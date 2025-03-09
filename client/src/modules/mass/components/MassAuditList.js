import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import massAuditService from '../services/massAuditService';

const MassAuditList = ({ audits, onDelete }) => {
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

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Vehicle</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {audits.map((audit) => (
          <tr key={audit._id}>
            <td>{audit.auditNumber}</td>
            <td>{audit.vehicle}</td>
            <td>{new Date(audit.date).toLocaleDateString()}</td>
            <td>{audit.status}</td>
            <td>
              <Button
                as={Link}
                to={`/mass-audits/${audit._id}`}
                variant="primary"
                size="sm"
                className="me-2"
              >
                View
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(audit._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MassAuditList;
