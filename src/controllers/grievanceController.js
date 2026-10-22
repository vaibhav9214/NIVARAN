const fs = require('fs');
const mongoose = require('mongoose');
const Grievance = require('../models/Grievance');
const Department = require('../models/Department');
const { generateUniqueTicketId } = require('../utils/ticketGenerator');

/**
 * Helper to remove uploaded files if validation fails
 */
function cleanupFiles(files) {
  if (Array.isArray(files)) {
    for (const file of files) {
      if (file && file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (e) {
          console.error('Error cleaning up file:', e.message);
        }
      }
    }
  }
}

/**
 * Submit Grievance
 * POST /api/student/complaints
 */
exports.submitGrievance = async (req, res) => {
  const uploadedFiles = req.files || [];

  try {
    const { title, category, department, description, priority = 'Medium' } = req.body;

    // 1. Validation: Title
    if (!title || typeof title !== 'string' || title.trim().length < 5) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Title is required and must be at least 5 characters long.'
      });
    }

    if (title.trim().length > 200) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Title cannot exceed 200 characters.'
      });
    }

    // 2. Validation: Category
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Category is required.'
      });
    }

    // 3. Validation: Department
    if (!department) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Department is required.'
      });
    }

    let deptDoc = null;
    if (mongoose.Types.ObjectId.isValid(department)) {
      deptDoc = await Department.findById(department);
    } else {
      // Support finding department by code (e.g. 'HOSTEL', 'ACAD') or name
      deptDoc = await Department.findOne({
        $or: [{ code: department.toUpperCase() }, { name: department }]
      });
    }

    if (!deptDoc) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Selected department does not exist.'
      });
    }

    if (!deptDoc.isActive) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Selected department is currently inactive.'
      });
    }

    // 4. Validation: Description
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Description is required and must be at least 10 characters long.'
      });
    }

    // 5. Generate Unique Ticket ID
    const ticketId = await generateUniqueTicketId();

    // 6. Map uploaded attachments
    const attachments = uploadedFiles.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path,
      uploadedAt: new Date()
    }));

    // 7. Save Grievance in MongoDB
    const grievance = await Grievance.create({
      ticketId,
      student: req.user.id,
      title: title.trim(),
      category: category.trim(),
      department: deptDoc._id,
      description: description.trim(),
      priority: ['Low', 'Medium', 'High', 'Urgent'].includes(priority) ? priority : 'Medium',
      attachments,
      status: 'Submitted'
    });

    // Populate department details for clean response
    await grievance.populate('department', 'name code');

    // 8. Display Submission Confirmation
    return res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully.',
      confirmation: {
        ticketId: grievance.ticketId,
        title: grievance.title,
        category: grievance.category,
        department: deptDoc.name,
        departmentCode: deptDoc.code,
        status: grievance.status,
        priority: grievance.priority,
        attachmentCount: grievance.attachments.length,
        submittedAt: grievance.createdAt
      },
      grievance
    });
  } catch (error) {
    cleanupFiles(uploadedFiles);
    console.error('Grievance submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while submitting grievance.'
    });
  }
};

/**
 * Retrieve grievances submitted by the logged-in student
 * GET /api/student/complaints
 */
exports.getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.user.id })
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      portal: 'student',
      count: grievances.length,
      complaints: grievances
    });
  } catch (error) {
    console.error('Fetch student grievances error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching complaints.'
    });
  }
};

/**
 * Retrieve a specific grievance by Ticket ID or MongoDB _id
 * GET /api/student/complaints/:identifier
 */
exports.getGrievanceById = async (req, res) => {
  try {
    const { identifier } = req.params;

    let query;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier, student: req.user.id };
    } else {
      query = { ticketId: identifier.toUpperCase(), student: req.user.id };
    }

    const grievance = await Grievance.findOne(query)
      .populate('department', 'name code')
      .populate('assignedOfficer', 'name email');

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      grievance
    });
  } catch (error) {
    console.error('Fetch grievance details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching grievance details.'
    });
  }
};

