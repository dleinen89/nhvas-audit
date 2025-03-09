import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Badge, Card, Form, InputGroup, Row, Col, Alert } from 'react-bootstrap';
import massAuditService from '../services/massAuditService';

const MassAuditList = ({ audits, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (audit.auditNumber && audit.auditNumber.toString().includes(searchTerm));
    
    const matchesStatus = filterStatus === 'all' || audit.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this audit?')) {
      try {
        await massAuditService.deleteMassAudit(id);
        onDelete(id);
      } catch (error) {
        console.error('Error deleting audit:', error);
      }
    }
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'secondary';
      default: return 'info';
    }
  };

  return (
    <>
      <Row className="mb-4">
        <Col md={6} lg={8}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by vehicle or audit number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} lg={4}>
          <Form.Select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
          </Form.Select>
        </Col>
      </Row>

      {filteredAudits.length === 0 ? (
        <Alert variant="info">
          No audits found. {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters.' : 'Create a new audit to get started.'}
        </Alert>
      ) : (
        <Card className="shadow-sm">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="text-center">#</th>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Status</th>
                <th>Completion</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.map((audit) => {
                // Calculate completion percentage
                const totalStandards = audit.standards?.length || 0;
                const completedStandards = audit.standards?.filter(s => s.status === 'completed').length || 0;
                const completionPercentage = totalStandards > 0 ? Math.round((completedStandards / totalStandards) * 100) : 0;
                
                return (
                  <tr key={audit._id}>
                    <td className="text-center">{audit.auditNumber || '-'}</td>
                    <td className="fw-bold">{audit.vehicle}</td>
                    <td>{new Date(audit.date).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={getStatusVariant(audit.status)}>
                        {audit.status === 'completed' ? 'Completed' : 
                         audit.status === 'in-progress' ? 'In Progress' : 
                         'Pending'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="progress flex-grow-1" style={{ height: '10px' }}>
                          <div 
                            className={`progress-bar bg-${completionPercentage === 100 ? 'success' : 'primary'}`} 
                            role="progressbar" 
                            style={{ width: `${completionPercentage}%` }}
                            aria-valuenow={completionPercentage} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <span className="ms-2 small">{completionPercentage}%</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <Button
                        as={Link}
                        to={`/mass-audits/${audit._id}`}
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() => onEdit(audit)}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(audit._id)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}
    </>
  );
};

export default MassAuditList;
