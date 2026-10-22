const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const RevokedToken = require('../models/RevokedToken');
const { JWT_SECRET } = require('../middleware/auth');

const VALID_ROLES = ['student', 'officer', 'admin'];
const TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || '24h';

// Helper: Sign JWT token containing user details, token version, and unique session ID (jti)
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id ? user._id.toString() : user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion !== undefined ? user.tokenVersion : 0,
      jti: crypto.randomUUID()
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 1 day
};

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const assignedRole = role.toLowerCase();
    if (!VALID_ROLES.includes(assignedRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role specified. Valid roles are: ${VALID_ROLES.join(', ')}`
      });
    }

    // Check if email already registered
    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Self-registered officers require admin approval; students are active
    const initialStatus = assignedRole === 'officer' ? 'pending' : 'active';

    // Create user in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword,
      role: assignedRole,
      status: initialStatus,
      tokenVersion: 0
    });

    if (initialStatus === 'pending') {
      return res.status(201).json({
        success: true,
        message: 'Officer registration submitted. Account is pending administrator approval.',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    }

    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.'
    });
  }
};

/**
 * User login
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Query user by email
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check account status
    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Officer account is pending administrator approval.'
      });
    }

    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
};

/**
 * Single-device logout
 * POST /api/auth/logout
 * Revokes the current device token and clears cookie
 */
exports.logout = async (req, res) => {
  try {
    if (req.token) {
      const expSeconds = req.tokenExp || Math.floor(Date.now() / 1000) + 86400;
      await RevokedToken.findOneAndUpdate(
        { token: req.token },
        { token: req.token, expiresAt: new Date(expSeconds * 1000) },
        { upsert: true, returnDocument: 'after' }
      );
    }

    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully from this device.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during logout.'
    });
  }
};

/**
 * Logout from all devices
 * POST /api/auth/logout-all
 * Increments tokenVersion in MongoDB, invalidating all existing tokens for this user
 */
exports.logoutAll = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to log out from all devices.'
      });
    }

    // Increment tokenVersion in MongoDB
    await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });

    // Also add current token to RevokedToken collection
    if (req.token) {
      const expSeconds = req.tokenExp || Math.floor(Date.now() / 1000) + 86400;
      await RevokedToken.findOneAndUpdate(
        { token: req.token },
        { token: req.token, expiresAt: new Date(expSeconds * 1000) },
        { upsert: true, returnDocument: 'after' }
      );
    }

    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully.'
    });
  } catch (error) {
    console.error('Logout-all error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during all-devices logout.'
    });
  }
};

/**
 * Current user profile
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        tokenVersion: user.tokenVersion,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching profile.'
    });
  }
};
