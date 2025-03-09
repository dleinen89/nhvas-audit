const express = require('express');
const {
  createMassAudit,
  getMassAudits,
  getMassAudit,
  updateMassAuditStandard,
  addEvidence,
  deleteEvidence,
  deleteMassAudit
} = require('../controllers/massAudit');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mass Audit Routes
router
  .route('/')
  .post(protect, createMassAudit)
  .get(protect, getMassAudits);

router
  .route('/:id')
  .get(protect, getMassAudit)
  .delete(protect, deleteMassAudit);

// Standard-specific routes
router
  .route('/:id/standards/:standard')
  .put(protect, updateMassAuditStandard);

// Evidence routes
router
  .route('/:id/standards/:standard/evidence')
  .post(protect, addEvidence);

router
  .route('/:id/standards/:standard/evidence/:evidenceId')
  .delete(protect, deleteEvidence);

module.exports = router;
