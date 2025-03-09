import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import MassAuditList from '../components/MassAuditList';
import MassAuditForm from '../components/MassAuditForm';
import massAuditService from '../services/massAuditService';

const MassAuditPage = () => {
  const [audits, setAudits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);

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
    <Container>
      <h1 className="my-4">Mass Audits</h1>
      
      <Button 
        variant="primary" 
        onClick={handleCreate}
        className="mb-3"
      >
        Create New Audit
      </Button>

      {showForm ? (
        <MassAuditForm 
          existingAudit={selectedAudit}
          onSuccess={() => {
            setShowForm(false);
            fetchAudits();
          }}
        />
      ) : (
        <MassAuditList 
          audits={audits} 
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </Container>
  );
};

export default MassAuditPage;
