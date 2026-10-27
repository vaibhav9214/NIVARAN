const mongoose = require('mongoose');
const Grievance = require('../models/Grievance');
const Department = require('../models/Department');
const aiService = require('../services/aiService');

/**
 * Helper to find grievance by ticketId or ObjectId
 */
async function findGrievanceByIdentifier(identifier) {
  if (!identifier) return null;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byId = await Grievance.findById(identifier).populate('department', 'name code');
    if (byId) return byId;
  }
  return await Grievance.findOne({ ticketId: identifier.toUpperCase() }).populate('department', 'name code');
}

/**
 * 0. AI Service Status & Configuration Health
 * GET /api/admin/ai/status
 */
async function getAiStatus(req, res) {
  try {
    const health = await aiService.checkAiHealth();
    return res.status(200).json({
      success: true,
      service: 'NIVARAN AI Grievance Intelligence',
      model: aiService.GEMINI_MODEL,
      fastapi_microservice: health,
      gemini_api_key_configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()),
      checkpoint: 'AI suggestions are advisory only and never silently alter official grievance statuses.'
    });
  } catch (error) {
    console.error('getAiStatus error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to inspect AI service status.'
    });
  }
}

/**
 * Student Pre-Submission AI Assistant
 * POST /api/student/ai/assist
 * Allows students to check completeness and receive categorization suggestions before official submission.
 */
async function studentPreSubmissionAssist(req, res) {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required for pre-submission AI analysis.'
      });
    }

    if (description.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters long.'
      });
    }

    // Sequence 1: Summarize preview
    const summaryResult = await aiService.summarizeDescription(title, description);

    // Sequence 2: Suggest classification
    const departments = await Department.find({ isActive: true }).select('name code');
    const deptNames = departments.map(d => d.name);
    const classificationResult = await aiService.suggestClassification(title, description, null, deptNames);

    // Sequence 3: Identify potentially missing info
    const missingInfoResult = await aiService.identifyMissingInfo(title, description, category || classificationResult.suggested_category);

    return res.status(200).json({
      success: true,
      draftPreview: {
        summary: summaryResult.summary,
        keyPoints: summaryResult.key_points
      },
      classificationSuggestion: {
        suggestedCategory: classificationResult.suggested_category,
        suggestedDepartment: classificationResult.suggested_department,
        confidence: classificationResult.confidence,
        reasoning: classificationResult.reasoning
      },
      completenessAudit: {
        isInformationComplete: missingInfoResult.is_information_complete,
        missingInformation: missingInfoResult.missing_information,
        suggestedQuestions: missingInfoResult.suggested_questions_for_student,
        completenessScore: missingInfoResult.completeness_score
      },
      model: aiService.GEMINI_MODEL,
      disclaimer: 'Advisory draft assistance only. Your grievance will only be registered when you officially click Submit.'
    });
  } catch (error) {
    console.error('studentPreSubmissionAssist error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to run pre-submission AI assistant.'
    });
  }
}

/**
 * Get or Generate AI Insights for an Existing Grievance
 * GET /api/officer/complaints/:id/ai-insights
 * POST /api/officer/complaints/:id/ai-insights
 */
async function getOrGenerateAiInsights(req, res) {
  try {
    const { id } = req.params;
    const forceRefresh = req.query.refresh === 'true' || req.body?.forceRefresh === true;

    const grievance = await findGrievanceByIdentifier(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance record not found.'
      });
    }

    // If insights already exist and refresh is not requested, return saved insights
    if (grievance.aiInsights && grievance.aiInsights.summary && !forceRefresh) {
      return res.status(200).json({
        success: true,
        ticketId: grievance.ticketId,
        officialStatus: grievance.status, // Verify official status is untouched
        aiInsights: grievance.aiInsights
      });
    }

    // Fetch active departments for accurate mapping
    const departments = await Department.find({ isActive: true }).select('name code');
    const deptNames = departments.map(d => d.name);

    // Call unified analysis (Sequences 1-4)
    const analysis = await aiService.analyzeGrievance(
      grievance.title,
      grievance.description,
      grievance.category,
      grievance.department ? grievance.department.name : null,
      grievance.status,
      null,
      deptNames
    );

    // Match suggested department name with database department
    let matchedDept = departments.find(d =>
      d.name.toLowerCase().includes(analysis.suggested_department.toLowerCase()) ||
      analysis.suggested_department.toLowerCase().includes(d.name.toLowerCase())
    );

    // Store AI insights alongside complaint
    // STRICT GUARANTEE: Never modify grievance.status here!
    const officialStatusBefore = grievance.status;

    grievance.aiInsights = {
      summary: analysis.summary,
      keyPoints: analysis.key_points,
      suggestedCategory: analysis.suggested_category,
      suggestedDepartment: matchedDept ? matchedDept._id : null,
      suggestedDepartmentName: analysis.suggested_department,
      classificationConfidence: analysis.classification_confidence,
      classificationReasoning: analysis.classification_reasoning,
      isInformationComplete: analysis.is_information_complete,
      missingInformation: analysis.missing_information,
      recommendedOfficerActions: analysis.recommended_officer_actions,
      recommendedPriority: analysis.recommended_priority,
      suggestedSlaHours: analysis.suggested_sla_hours,
      suggestedStudentQuery: analysis.suggested_student_query,
      generatedAt: new Date(),
      model: analysis.model || aiService.GEMINI_MODEL,
      disclaimer: 'AI suggestions are advisory only and must be reviewed by an authorized human officer. AI does not alter official status.',
      isReviewedByHuman: false,
      humanDecision: 'Pending Review',
      humanReviewNotes: null,
      reviewedBy: null,
      reviewedAt: null
    };

    // Save strictly preserving original status
    grievance.status = officialStatusBefore;
    await grievance.save();

    return res.status(200).json({
      success: true,
      message: 'AI insights generated and attached alongside grievance record.',
      ticketId: grievance.ticketId,
      officialStatus: grievance.status, // Proves status is unchanged
      aiInsights: grievance.aiInsights
    });
  } catch (error) {
    console.error('getOrGenerateAiInsights error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI insights.'
    });
  }
}

/**
 * Human Officer Review of AI Suggestions
 * PATCH /api/officer/complaints/:id/ai-review
 * Checkpoint: AI suggestions must be reviewed by a human and never silently change official statuses.
 */
async function reviewAiInsights(req, res) {
  try {
    const { id } = req.params;
    const {
      humanDecision,
      humanReviewNotes,
      applySuggestedCategory,
      applySuggestedPriority
    } = req.body;

    const validDecisions = ['Accepted', 'Modified', 'Rejected', 'Pending Review'];
    if (!humanDecision || !validDecisions.includes(humanDecision)) {
      return res.status(400).json({
        success: false,
        message: `Invalid humanDecision. Must be one of: ${validDecisions.join(', ')}`
      });
    }

    const grievance = await findGrievanceByIdentifier(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance record not found.'
      });
    }

    if (!grievance.aiInsights || !grievance.aiInsights.summary) {
      return res.status(400).json({
        success: false,
        message: 'No AI insights have been generated for this grievance yet.'
      });
    }

    const officialStatusBefore = grievance.status;

    // Record human officer's explicit decision
    grievance.aiInsights.isReviewedByHuman = true;
    grievance.aiInsights.humanDecision = humanDecision;
    grievance.aiInsights.humanReviewNotes = humanReviewNotes || '';
    grievance.aiInsights.reviewedBy = req.user.id || req.user._id;
    grievance.aiInsights.reviewedAt = new Date();

    // If human officer explicitly chooses to apply suggested category or priority
    if (applySuggestedCategory && grievance.aiInsights.suggestedCategory) {
      grievance.category = grievance.aiInsights.suggestedCategory;
    }
    if (applySuggestedPriority && grievance.aiInsights.recommendedPriority) {
      grievance.priority = grievance.aiInsights.recommendedPriority;
    }

    // STRICT GUARANTEE: AI review never alters official status (status transitions happen solely through lifecycle API)
    grievance.status = officialStatusBefore;
    await grievance.save();

    return res.status(200).json({
      success: true,
      message: `Human officer review recorded (${humanDecision}). Official status remains '${grievance.status}'.`,
      ticketId: grievance.ticketId,
      officialStatus: grievance.status,
      aiInsights: grievance.aiInsights
    });
  } catch (error) {
    console.error('reviewAiInsights error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record human officer review.'
    });
  }
}

/**
 * Sequence 5: Identify Trends in Aggregate Grievance Data
 * GET /api/admin/ai/trends
 * POST /api/admin/ai/trends
 */
async function getCampusAiTrends(req, res) {
  try {
    const { timeframe = 'Past 30 Days' } = req.body || req.query;

    // Retrieve recent grievances from MongoDB
    const grievances = await Grievance.find()
      .populate('department', 'name code')
      .select('ticketId title category status priority createdAt department')
      .sort({ createdAt: -1 })
      .limit(100);

    const formattedRecords = grievances.map(g => ({
      ticket_id: g.ticketId,
      title: g.title,
      category: g.category,
      department_name: g.department ? g.department.name : 'General',
      status: g.status,
      priority: g.priority,
      created_at: g.createdAt ? g.createdAt.toISOString() : null
    }));

    const trends = await aiService.identifyTrends(formattedRecords, timeframe);

    return res.status(200).json({
      success: true,
      timeframe,
      totalGrievancesAnalyzed: formattedRecords.length,
      trends,
      model: aiService.GEMINI_MODEL,
      checkpoint: 'Institutional aggregate trend intelligence. Advisory data for administrative decision-makers.'
    });
  } catch (error) {
    console.error('getCampusAiTrends error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute campus AI grievance trends.'
    });
  }
}

module.exports = {
  getAiStatus,
  studentPreSubmissionAssist,
  getOrGenerateAiInsights,
  reviewAiInsights,
  getCampusAiTrends
};

