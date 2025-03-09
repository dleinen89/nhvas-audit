import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import massAuditService from '../services/massAuditService';

const MassAudit = () => {
  const { id } = useParams();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const response = id 
          ? await massAuditService.getMassAudit(id)
          : await massAuditService.getMassAudits();
        setAudit(response.data);
      } catch (err) {
        setError(err.message || 'Error loading mass audit');
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mass-audit-container">
      <h1>Mass Audit {id ? `#${id}` : 'Overview'}</h1>
      {/* Audit details and standards will be rendered here */}
    </div>
  );
};

export default MassAudit;
