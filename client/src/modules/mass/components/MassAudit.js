import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Accordion, ListGroup, Spinner, Alert } from 'react-bootstrap';
import massAuditService from '../services/massAuditService';

const getStatusVariant = (status) => {
  switch(status) {
    case 'completed': return 'success';
    case 'in-progress': return 'warning';
    case 'pending': return 'secondary';
    default: return 'info';
  }
};

const MassAudit = () => {
  const { id } = useParams();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const response = await massAuditService.getMassAudit(id);
        setAudit(response.data);
      } catch (err) {
        setError(err.message || 'Error loading mass audit');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAudit();
    } else {
      setLoading(false);
      setError('No audit ID provided');
    }
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
  
  if (error) return (
    <Alert variant="danger">
      <Alert.Heading>Error Loading Audit</Alert.Heading>
      <p>{error}</p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button as={Link} to="/mass-audits" variant="outline-danger">
          Return to Audits
        </Button>
      </div>
    </Alert>
  );

  // Calculate completion stats
  const totalStandards = audit.standards?.length || 0;
  const completedStandards = audit.standards?.filter(s => s.status === 'completed').length || 0;
  const inProgressStandards = audit.standards?.filter(s => s.status === 'in-progress').length || 0;
  const pendingStandards = audit.standards?.filter(s => s.status === 'pending').length || 0;
  const completionPercentage = totalStandards > 0 ? Math.round((completedStandards / totalStandards) * 100) : 0;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="mb-0">
                    Mass Audit: {audit.vehicle}
                    {audit.auditNumber && <span className="text-muted ms-2">#{audit.auditNumber}</span>}
                  </h1>
                  <p className="text-muted mb-0">
                    Created on {new Date(audit.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Button 
                    as={Link}
                    to={`/mass-audits/${id}/edit`}
                    variant="primary" 
                    className="me-2"
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Edit Audit
                  </Button>
                  <Button 
                    as={Link}
                    to="/mass-audits"
                    variant="outline-secondary"
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to List
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Audit Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h6>Overall Status</h6>
                <Badge 
                  bg={getStatusVariant(audit.status)}
                  className="p-2 fs-6 w-100 text-center"
                >
                  {audit.status === 'completed' ? 'Completed' : 
                   audit.status === 'in-progress' ? 'In Progress' : 
                   'Pending'}
                </Badge>
              </div>
              
              <div className="mb-4">
                <h6>Completion Progress</h6>
                <div className="progress mb-2" style={{ height: '20px' }}>
                  <div 
                    className={`progress-bar bg-${completionPercentage === 100 ? 'success' : 'primary'}`} 
                    role="progressbar" 
                    style={{ width: `${completionPercentage}%` }}
                    aria-valuenow={completionPercentage} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {completionPercentage}%
                  </div>
                </div>
                <div className="d-flex justify-content-between small text-muted">
                  <span>{completedStandards} of {totalStandards} standards completed</span>
                </div>
              </div>
              
              <div>
                <h6>Standards Breakdown</h6>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Completed
                    <Badge bg="success" pill>{completedStandards}</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    In Progress
                    <Badge bg="warning" pill>{inProgressStandards}</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Pending
                    <Badge bg="secondary" pill>{pendingStandards}</Badge>
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Standards Assessment</h5>
            </Card.Header>
            <Card.Body>
              <Accordion>
                {audit.standards.map((standard, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>
                      <div className="d-flex align-items-center w-100">
                        <Badge bg={getStatusVariant(standard.status)} className="me-2">
                          {standard.standardNumber || index + 1}
                        </Badge>
                        <span className="me-auto">{standard.name}</span>
                        <Badge bg={getStatusVariant(standard.status)} className="ms-2">
                          {standard.status === 'completed' ? 'Completed' : 
                           standard.status === 'in-progress' ? 'In Progress' : 
                           'Pending'}
                        </Badge>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="mb-3">
                        <h6 className="text-primary">Verbatim Standard</h6>
                        <p className="fst-italic">{standard.verbatimStandard}</p>
                      </div>
                      
                      {standard.notes && (
                        <div className="mb-3">
                          <h6 className="text-primary">Audit Notes</h6>
                          <p>{standard.notes}</p>
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <h6 className="text-primary">Key Checklist Items</h6>
                        <ListGroup variant="flush">
                          {standard.keyChecklistItems?.map((item, idx) => (
                            <ListGroup.Item key={idx} className="border-0 ps-0">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              {item}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                      
                      {standard.evidence && standard.evidence.length > 0 && (
                        <div>
                          <h6 className="text-primary">Evidence Files</h6>
                          <ListGroup>
                            {standard.evidence.map((file, idx) => (
                              <ListGroup.Item key={idx}>
                                <i className="bi bi-file-earmark me-2"></i>
                                {file.name || `File ${idx + 1}`}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </div>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MassAudit;
