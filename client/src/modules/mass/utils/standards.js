// NHVAS Mass Management Standards with verbatim requirements
// Read in conjunction with memory-bank\reference-materials\mass-management-guide.md

export const MASS_STANDARDS = [
  {
    standardNumber: 1,
    name: 'Responsibilities',
    verbatimStandard: 'The authorities, responsibilities and duties of all positions involved in the management, operation, administration, participation in, and verification of the Mass Management System are current, clearly defined and documented and carried out accordingly.',
    keyChecklistItems: [
      'Have the Mass Management System tasks been fully documented?',
      'Are the tasks clearly described so another person could follow them?',
      'Have responsibilities for tasks been allocated and written down?',
      'Have all relevant staff members been told what their responsibilities are?',
      'Does your MMS include procedures to ensure correct application of the standards?',
      'Have you appointed a compliance manager?'
    ],
    additionalChecks: [
      'Evidence of Communication (memos, induction records)',
      'Organisational Charts/Responsibility Tables',
      'Periodic Validation documentation'
    ],
    guidanceNotes: 'This standard ensures clear definition of roles and responsibilities. All staff should understand their duties within the Mass Management System, and documentation should be clear enough that another person could follow the procedures if needed.'
  },
  {
    standardNumber: 2,
    name: 'Vehicle Control',
    verbatimStandard: 'All vehicles nominated by the accredited operator and all trailers used in combination with nominated vehicles must be operated in accordance with the Mass Management System.',
    keyChecklistItems: [
      'Maintain current vehicle register with all required details',
      'Document subcontractor vehicle compliance',
      'Specify driver mass limit communication process'
    ],
    additionalChecks: [
      'Vehicle register accuracy',
      'Engineering certificates/permits',
      'NHVR notification procedures'
    ],
    guidanceNotes: 'Your vehicle register should include ownership, registration, VIN, type of unit, manufacturer specs (GVM/GCM), and date of joining/exiting accreditation. Subcontractors vehicles should be identified separately with documentation confirming compliance.'
  },
  {
    standardNumber: 3,
    name: 'Vehicle Use',
    verbatimStandard: 'The vehicle mass must be determined by weighing or by a method of assessment prior to departure that allows for any variation.',
    keyChecklistItems: [
      'Documented mass measurement procedures',
      'Handling of load variations and third-party loaders',
      'Mass recording and storage processes'
    ],
    additionalChecks: [
      'Loading instructions documentation',
      'Trip dockets with mass data',
      'Staff training records'
    ],
    guidanceNotes: 'Your procedures should account for different loading conditions or variations (e.g., moisture content, density changes). If third parties load your vehicles, you need a process to communicate allowable mass limits to them.'
  },
  {
    standardNumber: 4,
    name: 'Records and Documentation',
    verbatimStandard: 'Documented evidence must be maintained to demonstrate the effective operation of the Mass Management System in accordance with the Mass Management Standards.',
    keyChecklistItems: [
      'Maintain trip records exceeding GML',
      'Defect/infringement register management',
      'Document version control system'
    ],
    additionalChecks: [
      'Legible trip manifests',
      'Defect resolution tracking',
      'Document revision history'
    ],
    guidanceNotes: 'Documentary evidence should be kept for each trip that runs above General Mass Limits, including date, time, vehicle registration or fleet number, established gross mass, and loading/destination location.'
  },
  {
    standardNumber: 5,
    name: 'Verification',
    verbatimStandard: 'The weight of the vehicle and load must be verified to produce an auditable record.',
    keyChecklistItems: [
      'Bi-annual verification procedures',
      'Calibration records maintenance',
      'Inaccuracy correction processes'
    ],
    additionalChecks: [
      'Calibration certificates',
      'Spot check documentation',
      'Corrective action reports'
    ],
    guidanceNotes: 'Your MMS should provide a method for verifying (at least bi-annually) that your loading method is accurate, such as using a calibrated scale or weighbridge to test your usual method.'
  },
  {
    standardNumber: 6,
    name: 'Internal Review',
    verbatimStandard: 'The Mass Management System must be subject to quarterly and annual internal review to verify that all results and activities comply with the systems policies, procedures, instructions and current business activities.',
    keyChecklistItems: [
      'Independent review processes',
      'Non-conformance handling system',
      'Quarterly compliance reporting'
    ],
    additionalChecks: [
      'Annual review reports',
      'Compliance statistics',
      'Issue tracking register'
    ],
    guidanceNotes: 'Internal reviews should be as independent as possible. You should produce quarterly compliance statements detailing the number of vehicles in the fleet, number of trips above GML, any non-compliant trips, and details of any defects or infringements.'
  },
  {
    standardNumber: 7,
    name: 'Training and Education',
    verbatimStandard: 'Persons who hold positions of responsibility under the Mass Management Systems are trained in and familiar with the specific policy, procedure and instruction they are to carry out.',
    keyChecklistItems: [
      'Role-specific training programs',
      'Training record maintenance',
      'Refresher training protocols'
    ],
    additionalChecks: [
      'Training materials archive',
      'Signed acknowledgments',
      'Competency assessments'
    ],
    guidanceNotes: 'All relevant staff should be trained for the tasks they perform under the MMS. Evidence should be maintained showing who was trained, on what topics, by whom, and when. Refresher training should be offered if non-compliances are identified.'
  },
  {
    standardNumber: 8,
    name: 'Maintenance of Suspension',
    verbatimStandard: "All vehicles subject to this accreditation, including trailers supplied by other parties, must have their suspension systems maintained and replaced according to manufacturer or a qualified mechanical engineers specification, and in line with the ARTSA Air Suspension Code (when applicable).",
    keyChecklistItems: [
      'Scheduled maintenance documentation',
      'Repair process specifications',
      'Third-party compliance verification'
    ],
    additionalChecks: [
      'Maintenance logs',
      'Mechanic qualifications',
      'Road-Friendly Suspension proof'
    ],
    guidanceNotes: 'You should have and follow a documented schedule for checking and maintaining suspensions based on manufacturer or engineer specs, or the ARTSA Code if applicable. Fault/repair processes should be clearly documented, including who performs the repairs and how they are recorded.'
  }
];
