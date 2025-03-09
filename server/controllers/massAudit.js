const MassAudit = require('../models/MassAudit');
const { validationResult } = require('express-validator');

// @desc    Create a new mass audit
// @route   POST /api/mass-audits
// @access  Private
exports.createMassAudit = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a new audit
    const audit = new MassAudit({
      user: req.user.id,
      organization: req.user.organization
    });

    await audit.save();

    res.status(201).json({
      success: true,
      data: audit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all mass audits for a user
// @route   GET /api/mass-audits
// @access  Private
exports.getMassAudits = async (req, res) => {
  try {
    const audits = await MassAudit.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: audits.length,
      data: audits
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get a single mass audit
// @route   GET /api/mass-audits/:id
// @access  Private
exports.getMassAudit = async (req, res) => {
  try {
    const audit = await MassAudit.findById(req.params.id);

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }

    // Make sure user owns the audit
    if (audit.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this audit'
      });
    }

    res.status(200).json({
      success: true,
      data: audit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update a mass audit standard
// @route   PUT /api/mass-audits/:id/standards/:standard
// @access  Private
exports.updateMassAuditStandard = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { standard } = req.params;
    const { responses, completed } = req.body;

    // Validate standard name
    const validStandards = [
      'responsibilities',
      'vehicleControl',
      'vehicleUse',
      'recordsAndDocumentation',
      'verification',
      'internalReview',
      'trainingAndEducation',
      'maintenanceOfSuspension'
    ];

    if (!validStandards.includes(standard)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid standard name'
      });
    }

    let audit = await MassAudit.findById(req.params.id);

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }

    // Make sure user owns the audit
    if (audit.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this audit'
      });
    }

    // Update the standard
    audit.standards[standard].responses = responses || {};
    audit.standards[standard].completed = completed || false;

    // Calculate progress
    audit.calculateProgress();

    await audit.save();

    res.status(200).json({
      success: true,
      data: audit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add evidence to a standard
// @route   POST /api/mass-audits/:id/standards/:standard/evidence
// @access  Private
exports.addEvidence = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { standard } = req.params;
    const { name, path } = req.body;

    // Validate standard name
    const validStandards = [
      'responsibilities',
      'vehicleControl',
      'vehicleUse',
      'recordsAndDocumentation',
      'verification',
      'internalReview',
      'trainingAndEducation',
      'maintenanceOfSuspension'
    ];

    if (!validStandards.includes(standard)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid standard name'
      });
    }

    let audit = await MassAudit.findById(req.params.id);

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }

    // Make sure user owns the audit
    if (audit.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this audit'
      });
    }

    // Add evidence
    audit.standards[standard].evidence.push({
      name,
      path,
      uploadDate: Date.now()
    });

    await audit.save();

    res.status(200).json({
      success: true,
      data: audit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete evidence from a standard
// @route   DELETE /api/mass-audits/:id/standards/:standard/evidence/:evidenceId
// @access  Private
exports.deleteEvidence = async (req, res) => {
  try {
    const { standard, evidenceId } = req.params;

    // Validate standard name
    const validStandards = [
      'responsibilities',
      'vehicleControl',
      'vehicleUse',
      'recordsAndDocumentation',
      'verification',
      'internalReview',
      'trainingAndEducation',
      'maintenanceOfSuspension'
    ];

    if (!validStandards.includes(standard)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid standard name'
      });
    }

    let audit = await MassAudit.findById(req.params.id);

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }

    // Make sure user owns the audit
    if (audit.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this audit'
      });
    }

    // Find evidence index
    const evidenceIndex = audit.standards[standard].evidence.findIndex(
      (e) => e._id.toString() === evidenceId
    );

    if (evidenceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Evidence not found'
      });
    }

    // Remove evidence
    audit.standards[standard].evidence.splice(evidenceIndex, 1);

    await audit.save();

    res.status(200).json({
      success: true,
      data: audit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete a mass audit
// @route   DELETE /api/mass-audits/:id
// @access  Private
exports.deleteMassAudit = async (req, res) => {
  try {
    const audit = await MassAudit.findById(req.params.id);

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }

    // Make sure user owns the audit
    if (audit.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this audit'
      });
    }

    await audit.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
