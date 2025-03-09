const mongoose = require('mongoose');

const MassAuditSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  progress: {
    type: Number,
    default: 0
  },
  standards: {
    responsibilities: {
      completed: {
        type: Boolean,
        default: false
      },
      responses: {
        type: Object,
        default: {}
      },
      evidence: [{
        name: String,
        path: String,
        uploadDate: {
          type: Date,
          default: Date.now
        }
      }]
    },
    vehicleControl: {
      completed: {
        type: Boolean,
        default: false
      },
      responses: {
        type: Object,
        default: {}
      },
      evidence: [{
        name: String,
        path: String,
        uploadDate: {
          type: Date,
          default: Date.now
        }
      }]
    },
    vehicleUse: {
      completed: {
        type: Boolean,
        default: false
      },
      responses: {
        type: Object,
        default: {}
      },
      evidence: [{
        name: String,
        path: String,
        uploadDate: {
          type: Date,
          default: Date.now
        }
      }]
    },
    recordsAndDocumentation: {
      completed: {
        type: Boolean,
        default: false
      },
      responses: {
        type: Object,
        default: {}
      },
      evidence: [{
        name: String,
        path: String,
        uploadDate: {
          type: Date,
          default: Date.now
        }
      }]
    },
    verification: {
      completed: {
        type: Boolean,
        default: false
      },
      responses: {
        type: Object,
        default: {}
      },
      evidence: [{
        name: String,
        path: String,
        uploadDate: {
          type: Date,
          default: Date.now
        }
      }]
    },
    internalReview: {
      completed: {
        type: Boolean,
        default: false
      },
      responses: {
        type: Object,
        default: {}
      },
      evidence: [{
        name: String,
        path: String,
        uploadDate: {
          type: Date,
          default: Date.now
        }
      }]
    },
    trainingAndEducation: {
      completed: {
        type: Boolean,
        default: false
      },
      responses: {
        type: Object,
        default: {}
      },
      evidence: [{
        name: String,
        path: String,
        uploadDate: {
          type: Date,
          default: Date.now
        }
      }]
    },
    maintenanceOfSuspension: {
      completed: {
        type: Boolean,
        default: false
      },
      responses: {
        type: Object,
        default: {}
      },
      evidence: [{
        name: String,
        path: String,
        uploadDate: {
          type: Date,
          default: Date.now
        }
      }]
    }
  },
  complianceScore: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Update the updatedAt field on save
MassAuditSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate progress based on completed standards
MassAuditSchema.methods.calculateProgress = function() {
  const standards = this.standards;
  const totalStandards = 8; // Total number of standards
  let completedStandards = 0;
  
  // Count completed standards
  if (standards.responsibilities.completed) completedStandards++;
  if (standards.vehicleControl.completed) completedStandards++;
  if (standards.vehicleUse.completed) completedStandards++;
  if (standards.recordsAndDocumentation.completed) completedStandards++;
  if (standards.verification.completed) completedStandards++;
  if (standards.internalReview.completed) completedStandards++;
  if (standards.trainingAndEducation.completed) completedStandards++;
  if (standards.maintenanceOfSuspension.completed) completedStandards++;
  
  // Calculate progress percentage
  this.progress = Math.round((completedStandards / totalStandards) * 100);
  
  // Update status if all standards are completed
  if (completedStandards === totalStandards) {
    this.status = 'completed';
    this.completedAt = Date.now();
  }
  
  return this.progress;
};

module.exports = mongoose.model('MassAudit', MassAuditSchema);
