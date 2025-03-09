import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Accordion, Form, Button, Alert, Card, Badge, ProgressBar, Row, Col, 
  Container, Tooltip, OverlayTrigger, Tabs, Tab, Modal
} from 'react-bootstrap';
import { InfoCircle, CheckCircleFill, XCircleFill, QuestionCircleFill } from 'react-bootstrap-icons';
import massAuditService from '../services/massAuditService';
import { MASS_STANDARDS } from '../utils/standards';
import './MassAuditForm.css';

const MassAuditForm = ({ existingAudit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accreditationNumber: '',
    standards: existingAudit ? existingAudit.standards : MASS_STANDARDS.map(standard => ({
      name: standard.name,
      standardNumber: standard.standardNumber,
      verbatimStandard: standard.verbatimStandard,
      keyChecklistItems: standard.keyChecklistItems,
      additionalChecks: standard.additionalChecks,
      guidanceNotes: standard.guidanceNotes,
      status: 'pending',
      notes: '',
      evidence: [],
      responses: {}
    }))
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeStep, setActiveStep] = useState('intro');
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  useEffect(() => {
    if (existingAudit) {
      setFormData({
        accreditationNumber: existingAudit.accreditationNumber || '',
        standards: existingAudit.standards
      });
      setShowWelcomeModal(false);
    }
  }, [existingAudit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStandardChange = (index, field, value) => {
    const updatedStandards = [...formData.standards];
    updatedStandards[index] = {
      ...updatedStandards[index],
      [field]: value
    };
    setFormData({
      ...formData,
      standards: updatedStandards
    });
  };

  const handleResponseChange = (standardIndex, itemIndex, value) => {
    const updatedStandards = [...formData.standards];
    const standard = updatedStandards[standardIndex];
    
    // Initialize responses object if it doesn't exist
    if (!standard.responses) {
      standard.responses = {};
    }
    
    // Set the response for this item
    standard.responses[`item_${itemIndex}`] = value;
    
    // Update the standard status based on responses
    const responseValues = Object.values(standard.responses);
    if (responseValues.length === 0) {
      standard.status = 'pending';
    } else if (responseValues.includes('not_sure') || responseValues.includes('no')) {
      standard.status = 'in-progress';
    } else if (responseValues.length === standard.keyChecklistItems.length) {
      standard.status = 'completed';
    } else {
      standard.status = 'in-progress';
    }
    
    setFormData({
      ...formData,
      standards: updatedStandards
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (id) {
        await massAuditService.updateMassAudit(id, formData);
        setSuccess('Audit updated successfully');
      } else {
        await massAuditService.createMassAudit(formData);
        setSuccess('Audit created successfully');
        navigate('/mass-audits');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const startAudit = () => {
    setActiveStep('standard_1');
    setShowWelcomeModal(false);
  };

  const renderTooltip = (content) => (
    <Tooltip className="custom-tooltip">
      {content}
    </Tooltip>
  );

  const getResponseIcon = (response) => {
    switch(response) {
      case 'yes':
        return <CheckCircleFill className="text-success me-2" />;
      case 'no':
        return <XCircleFill className="text-danger me-2" />;
      case 'not_sure':
        return <QuestionCircleFill className="text-warning me-2" />;
      default:
        return null;
    }
  };

  const calculateOverallProgress = () => {
    const totalItems = formData.standards.reduce((total, standard) => 
      total + standard.keyChecklistItems.length, 0);
    
    const answeredItems = formData.standards.reduce((total, standard) => {
      return total + (standard.responses ? Object.keys(standard.responses).length : 0);
    }, 0);
    
    return Math.round((answeredItems / totalItems) * 100);
  };

  const renderWelcomeModal = () => (
    <Modal 
      show={showWelcomeModal} 
      onHide={() => setShowWelcomeModal(false)}
      centered
      size="lg"
      className="welcome-modal"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Welcome to the NHVAS Mass Management Audit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <h4>Your Guided Audit Process</h4>
          <p className="lead">
            This tool will guide you through a comprehensive assessment of your organization's 
            compliance with the NHVAS Mass Management standards.
          </p>
        </div>
        
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <h5>What to Expect:</h5>
            <ul className="process-list">
              <li>Step-by-step guidance through all 8 NHVAS Mass Management standards</li>
              <li>Detailed explanations and evidence suggestions for each requirement</li>
              <li>Ability to upload supporting documentation</li>
              <li>Generation of a customized action plan based on your responses</li>
              <li>Comprehensive compliance report upon completion</li>
            </ul>
          </Card.Body>
        </Card>
        
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <h5>Before You Begin:</h5>
            <p>
              Have your organization information ready, including your optional NHVAS accreditation 
              number if applicable. You'll also want to have access to your documentation and 
              evidence that demonstrates compliance with each standard.
            </p>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary" size="lg" onClick={startAudit}>
          Start Your Audit
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderIntroStep = () => (
    <Container className="py-4">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">NHVAS Mass Management Audit</h2>
          
          <p className="lead text-center mb-4">
            This audit will guide you through assessing your organization's compliance with 
            the NHVAS Mass Management standards.
          </p>
          
          <Form>
            <Form.Group className="mb-4">
              <Form.Label>Organization Name</Form.Label>
              <Form.Control
                type="text"
                name="organization"
                value={formData.organization || ''}
                disabled
                className="form-control-lg"
              />
              <Form.Text className="text-muted">
                This is automatically populated from your account information.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>
                NHVAS Accreditation Number (Optional)
                <OverlayTrigger
                  placement="right"
                  overlay={renderTooltip("If you already have NHVAS accreditation, enter your number here. If you're preparing for accreditation, you can leave this blank.")}
                >
                  <InfoCircle className="ms-2 text-primary" />
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                type="text"
                name="accreditationNumber"
                value={formData.accreditationNumber}
                onChange={handleChange}
                className="form-control-lg"
                placeholder="Enter your accreditation number if you have one"
              />
            </Form.Group>
          </Form>
          
          <div className="text-center mt-5">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={startAudit}
              className="px-5 py-3"
            >
              Start Audit
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h4>What to Expect</h4>
          <p>
            This audit will guide you through all 8 NHVAS Mass Management standards. For each standard, you'll:
          </p>
          <ul>
            <li>Review the requirements and guidance</li>
            <li>Answer questions about your compliance</li>
            <li>Upload supporting evidence</li>
            <li>Receive recommendations for improvement</li>
          </ul>
          <p>
            Upon completion, you'll receive a comprehensive report and action plan to help maintain or 
            improve your compliance.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );

  const renderStandardStep = (standardIndex) => {
    const standard = formData.standards[standardIndex];
    
    return (
      <Container className="py-4">
        <Card className="shadow-sm border-0 mb-4">
          <Card.Header className="bg-primary text-white p-3">
            <div className="d-flex align-items-center">
              <Badge bg="light" text="dark" className="me-3 p-2">
                Standard {standard.standardNumber}
              </Badge>
              <h3 className="mb-0">{standard.name}</h3>
            </div>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="standard-description mb-4 p-3 bg-light rounded">
              <h5>Standard Description:</h5>
              <p className="fst-italic mb-0">{standard.verbatimStandard}</p>
            </div>
            
            {standard.guidanceNotes && (
              <div className="guidance-notes mb-4">
                <h5>Guidance:</h5>
                <p>{standard.guidanceNotes}</p>
              </div>
            )}
            
            <h5 className="mt-4 mb-3">Key Requirements:</h5>
            {standard.keyChecklistItems.map((item, itemIndex) => (
              <Card key={itemIndex} className="mb-3 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <div className="flex-grow-1">
                      <p className="mb-2 fw-bold">{item}</p>
                      <div className="d-flex mt-3">
                        <Form.Check
                          type="radio"
                          name={`standard_${standardIndex}_item_${itemIndex}`}
                          id={`standard_${standardIndex}_item_${itemIndex}_yes`}
                          label="Yes"
                          className="me-4"
                          checked={standard.responses?.[`item_${itemIndex}`] === 'yes'}
                          onChange={() => handleResponseChange(standardIndex, itemIndex, 'yes')}
                        />
                        <Form.Check
                          type="radio"
                          name={`standard_${standardIndex}_item_${itemIndex}`}
                          id={`standard_${standardIndex}_item_${itemIndex}_no`}
                          label="No"
                          className="me-4"
                          checked={standard.responses?.[`item_${itemIndex}`] === 'no'}
                          onChange={() => handleResponseChange(standardIndex, itemIndex, 'no')}
                        />
                        <Form.Check
                          type="radio"
                          name={`standard_${standardIndex}_item_${itemIndex}`}
                          id={`standard_${standardIndex}_item_${itemIndex}_not_sure`}
                          label="Not Sure"
                          checked={standard.responses?.[`item_${itemIndex}`] === 'not_sure'}
                          onChange={() => handleResponseChange(standardIndex, itemIndex, 'not_sure')}
                        />
                      </div>
                    </div>
                    <div className="ms-3">
                      <OverlayTrigger
                        placement="left"
                        overlay={renderTooltip(
                          <div>
                            <p className="mb-2"><strong>Guidance:</strong></p>
                            <p className="mb-2">This requirement asks if you have properly documented and assigned responsibilities within your Mass Management System.</p>
                            <p className="mb-0"><strong>Evidence could include:</strong></p>
                            <ul className="mb-0">
                              <li>Process documentation</li>
                              <li>Responsibility matrices</li>
                              <li>Job descriptions</li>
                            </ul>
                          </div>
                        )}
                      >
                        <InfoCircle className="text-primary fs-5" />
                      </OverlayTrigger>
                    </div>
                  </div>
                  
                  {standard.responses?.[`item_${itemIndex}`] && (
                    <div className="mt-3 pt-3 border-top">
                      <Form.Group>
                        <Form.Label>Upload Evidence</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={(e) => {
                            // This would typically handle file uploads
                            // For now, we're just showing the UI
                          }}
                        />
                        <Form.Text className="text-muted">
                          Upload documentation that demonstrates your compliance with this requirement.
                        </Form.Text>
                      </Form.Group>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
            
            <Form.Group className="mt-4">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={standard.notes}
                onChange={(e) => handleStandardChange(standardIndex, 'notes', e.target.value)}
                placeholder="Enter any additional notes, observations, or context..."
              />
            </Form.Group>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between p-3">
            <Button 
              variant="outline-secondary" 
              onClick={() => standardIndex === 0 ? setActiveStep('intro') : setActiveStep(`standard_${standardIndex}`)}
            >
              Back
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                if (standardIndex < 7) {
                  setActiveStep(`standard_${standardIndex + 2}`);
                } else {
                  setActiveStep('summary');
                }
              }}
            >
              {standardIndex < 7 ? 'Next Standard' : 'Review & Submit'}
            </Button>
          </Card.Footer>
        </Card>
      </Container>
    );
  };

  const renderSummaryStep = () => (
    <Container className="py-4">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-primary text-white p-3">
          <h3 className="mb-0">Audit Summary</h3>
        </Card.Header>
        <Card.Body className="p-4">
          <h4 className="mb-4">Overall Progress</h4>
          <ProgressBar className="mb-3" style={{ height: '25px' }}>
            <ProgressBar 
              variant="success" 
              now={formData.standards.filter(s => s.status === 'completed').length / formData.standards.length * 100} 
              key={1} 
              label={`${formData.standards.filter(s => s.status === 'completed').length} Completed`}
            />
            <ProgressBar 
              variant="warning" 
              now={formData.standards.filter(s => s.status === 'in-progress').length / formData.standards.length * 100} 
              key={2} 
              label={`${formData.standards.filter(s => s.status === 'in-progress').length} In Progress`}
            />
          </ProgressBar>
          
          <h4 className="mt-5 mb-4">Standards Status</h4>
          <div className="standards-summary">
            {formData.standards.map((standard, index) => (
              <Card key={index} className="mb-3 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Badge bg={
                        standard.status === 'completed' ? 'success' : 
                        standard.status === 'in-progress' ? 'warning' : 
                        'secondary'
                      } className="me-2">
                        {standard.standardNumber}
                      </Badge>
                      <span className="fw-bold">{standard.name}</span>
                    </div>
                    <div>
                      <Badge bg={
                        standard.status === 'completed' ? 'success' : 
                        standard.status === 'in-progress' ? 'warning' : 
                        'secondary'
                      } className="p-2">
                        {standard.status === 'completed' ? 'Completed' : 
                         standard.status === 'in-progress' ? 'In Progress' : 
                         'Not Started'}
                      </Badge>
                      <Button 
                        variant="link" 
                        size="sm"
                        onClick={() => setActiveStep(`standard_${standard.standardNumber}`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
          
          <div className="mt-5">
            <h4 className="mb-3">Action Items</h4>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <p>Based on your responses, we've identified the following action items:</p>
                <ul className="action-items">
                  {formData.standards.flatMap((standard, standardIndex) => 
                    standard.keyChecklistItems.map((item, itemIndex) => {
                      if (standard.responses?.[`item_${itemIndex}`] === 'no' || 
                          standard.responses?.[`item_${itemIndex}`] === 'not_sure') {
                        return (
                          <li key={`${standardIndex}_${itemIndex}`} className="mb-3">
                            <div className="d-flex align-items-start">
                              {getResponseIcon(standard.responses[`item_${itemIndex}`])}
                              <div>
                                <strong>Standard {standard.standardNumber}: {standard.name}</strong>
                                <p className="mb-0">{item}</p>
                              </div>
                            </div>
                          </li>
                        );
                      }
                      return null;
                    }).filter(Boolean)
                  )}
                </ul>
                
                {formData.standards.flatMap((standard, standardIndex) => 
                  standard.keyChecklistItems.map((item, itemIndex) => 
                    standard.responses?.[`item_${itemIndex}`] === 'no' || 
                    standard.responses?.[`item_${itemIndex}`] === 'not_sure'
                  )
                ).filter(Boolean).length === 0 && (
                  <p className="text-success">
                    <CheckCircleFill className="me-2" />
                    No action items identified. Great job!
                  </p>
                )}
              </Card.Body>
            </Card>
          </div>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between p-3">
          <Button 
            variant="outline-secondary" 
            onClick={() => setActiveStep('standard_8')}
          >
            Back
          </Button>
          <Button 
            variant="success" 
            onClick={handleSubmit}
          >
            Submit Audit
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );

  const renderContent = () => {
    if (activeStep === 'intro') {
      return renderIntroStep();
    } else if (activeStep.startsWith('standard_')) {
      const standardNumber = parseInt(activeStep.split('_')[1]);
      return renderStandardStep(standardNumber - 1);
    } else if (activeStep === 'summary') {
      return renderSummaryStep();
    }
  };

  return (
    <div className="mass-audit-form">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {renderWelcomeModal()}
      
      <div className="audit-progress-bar sticky-top bg-white shadow-sm p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Audit Progress</h5>
          <span>{calculateOverallProgress()}% Complete</span>
        </div>
        <ProgressBar now={calculateOverallProgress()} />
      </div>
      
      {renderContent()}
    </div>
  );
};

export default MassAuditForm;
