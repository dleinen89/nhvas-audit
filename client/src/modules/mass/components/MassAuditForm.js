import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Accordion, Form, Button, Alert } from 'react-bootstrap';
import massAuditService from '../services/massAuditService';

const MassAuditForm = ({ existingAudit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicle: '',
    date: new Date().toISOString().split('T')[0],
    standards: []
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (existingAudit) {
      setFormData({
        vehicle: existingAudit.vehicle,
        date: existingAudit.date.split('T')[0],
        standards: existingAudit.standards
      });
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

  const handleAddStandard = () => {
    setFormData({
      ...formData,
      standards: [
        ...formData.standards,
        {
          name: '',
          status: 'pending',
          notes: '',
          evidence: []
        }
      ]
    });
  };

  const handleDeleteStandard = (index) => {
    setFormData({
      ...formData,
      standards: formData.standards.filter((_, i) => i !== index)
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

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Vehicle</Form.Label>
        <Form.Control
          type="text"
          name="vehicle"
          value={formData.vehicle}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="mb-3">
        {id ? 'Update Audit' : 'Create Audit'}
      </Button>

      <h4 className="mt-4">Standards Management</h4>
      <Accordion>
        {formData.standards.map((standard, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>{standard.name || `Standard ${index + 1}`}</Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-3">
                <Form.Label>Standard Name</Form.Label>
                <Form.Control
                  type="text"
                  value={standard.name}
                  onChange={(e) => handleStandardChange(index, 'name', e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={standard.status}
                  onChange={(e) => handleStandardChange(index, 'status', e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={standard.notes}
                  onChange={(e) => handleStandardChange(index, 'notes', e.target.value)}
                />
              </Form.Group>

              <Button 
                variant="danger" 
                onClick={() => handleDeleteStandard(index)}
                className="me-2"
              >
                Delete Standard
              </Button>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <Button 
        variant="success" 
        onClick={handleAddStandard}
        className="mt-3"
      >
        Add New Standard
      </Button>
    </Form>
  );
};

export default MassAuditForm;
