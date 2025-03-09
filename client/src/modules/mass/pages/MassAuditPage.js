import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Row, Col, Badge, Nav, Tab } from 'react-bootstrap';
import MassAuditList from '../components/MassAuditList';
import MassAuditForm from '../components/MassAuditForm';
import massAuditService from '../services/massAuditService';
import { MASS_STANDARDS } from '../utils/standards';

const MassAuditPage = () => {
  const [audits, setAudits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [activeTab, setActiveTab] = useState('audits');

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await massAuditService.getMassAudits();
      setAudits(response.data);
    } catch (error) {
      console.error('Error fetching audits:', error);
    }
  };

  const handleDelete = (id) => {
    setAudits(audits.filter(audit => audit._id !== id));
  };

  const handleCreate = () => {
    setSelectedAudit(null);
    setShowForm(true);
  };

  const handleEdit = (audit) => {
    setSelectedAudit(audit);
    setShowForm(true);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="mb-0">NHVAS Mass Management</h1>
                  <p className="text-muted mb-0">Manage and track your mass management compliance</p>
                </div>
                <div>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleCreate}
                    className="shadow-sm"
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Create New Audit
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col md={3} lg={2} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Navigation</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="audits" className="rounded-0 border-bottom">
                      <i className="bi bi-clipboard-check me-2"></i>
                      Audits
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="standards" className="rounded-0 border-bottom">
                      <i className="bi bi-journal-text me-2"></i>
                      Standards Reference
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="guide" className="rounded-0">
                      <i className="bi bi-info-circle me-2"></i>
                      Guidance
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={9} lg={10}>
            <Tab.Content>
              <Tab.Pane eventKey="audits">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    {showForm ? (
                      <MassAuditForm 
                        existingAudit={selectedAudit}
                        onSuccess={() => {
                          setShowForm(false);
                          fetchAudits();
                        }}
                      />
                    ) : (
                      <>
                        <h3 className="mb-4">Your Mass Audits</h3>
                        <MassAuditList 
                          audits={audits} 
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                        />
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              <Tab.Pane eventKey="standards">
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-primary text-white">
                    <h3 className="mb-0">NHVAS Mass Management Standards Reference</h3>
                  </Card.Header>
                  <Card.Body>
                    <p className="lead mb-4">
                      The National Heavy Vehicle Accreditation Scheme (NHVAS) Mass Management module 
                      requires compliance with the following eight standards:
                    </p>
                    
                    <Row>
                      {MASS_STANDARDS.map((standard, index) => (
                        <Col md={6} lg={4} key={index} className="mb-4">
                          <Card className="h-100 shadow-sm">
                            <Card.Header className="bg-light">
                              <h5 className="mb-0">
                                <Badge bg="primary" className="me-2">{standard.standardNumber}</Badge>
                                {standard.name}
                              </h5>
                            </Card.Header>
                            <Card.Body>
                              <p className="fst-italic small">{standard.verbatimStandard}</p>
                              <hr />
                              <p className="small">{standard.guidanceNotes}</p>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              <Tab.Pane eventKey="guide">
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-info text-white">
                    <h3 className="mb-0">Mass Management Guidance</h3>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-4">
                      <Col md={8}>
                        <h4>About NHVAS Mass Management</h4>
                        <p>
                          The Mass Management module of the National Heavy Vehicle Accreditation Scheme (NHVAS) 
                          allows operators to demonstrate that they have specific management systems in place 
                          to ensure compliance with mass limits.
                        </p>
                        <p>
                          Accredited operators may be eligible for concessions such as Higher Mass Limits (HML) 
                          and Concessional Mass Limits (CML), allowing them to carry increased payloads under 
                          specific conditions.
                        </p>
                        
                        <h4 className="mt-4">How to Use This Tool</h4>
                        <ol>
                          <li>Create a new audit for each vehicle or fleet assessment</li>
                          <li>Work through each of the eight standards systematically</li>
                          <li>Upload evidence documents to support compliance</li>
                          <li>Mark standards as "In Progress" or "Completed" as you go</li>
                          <li>Use the guidance notes to help understand requirements</li>
                          <li>Save your audit to return to it later if needed</li>
                        </ol>
                      </Col>
                      <Col md={4}>
                        <Card className="bg-light">
                          <Card.Body>
                            <h5>Quick Links</h5>
                            <ul className="list-unstyled">
                              <li className="mb-2">
                                <a href="https://www.nhvr.gov.au/safety-accreditation-compliance/national-heavy-vehicle-accreditation-scheme/mass-management" target="_blank" rel="noopener noreferrer">
                                  NHVR Mass Management
                                </a>
                              </li>
                              <li className="mb-2">
                                <a href="https://www.nhvr.gov.au/files/201707-0577-mass-management-accreditation-guide.pdf" target="_blank" rel="noopener noreferrer">
                                  Mass Management Accreditation Guide
                                </a>
                              </li>
                              <li className="mb-2">
                                <a href="https://www.nhvr.gov.au/files/201707-0578-mass-management-standards-and-business-rules.pdf" target="_blank" rel="noopener noreferrer">
                                  Standards and Business Rules
                                </a>
                              </li>
                            </ul>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default MassAuditPage;
