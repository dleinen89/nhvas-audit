import axios from 'axios';
import authHeader from '../../../services/auth-header';

const API_URL = process.env.REACT_APP_API_URL + '/api/mass-audits';

const createMassAudit = (auditData) => {
  return axios.post(API_URL, auditData, { headers: authHeader() });
};

const getMassAudits = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getMassAudit = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

const updateMassAudit = (id, auditData) => {
  return axios.put(`${API_URL}/${id}`, auditData, { 
    headers: authHeader() 
  });
};

const updateMassAuditStandard = (id, standard, data) => {
  return axios.put(`${API_URL}/${id}/standards/${standard}`, data, { 
    headers: authHeader() 
  });
};

const addEvidence = (id, standard, evidenceData) => {
  return axios.post(`${API_URL}/${id}/standards/${standard}/evidence`, 
    evidenceData, 
    { headers: authHeader() }
  );
};

const deleteMassAudit = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const massAuditService = {
  createMassAudit,
  getMassAudits,
  getMassAudit,
  updateMassAudit,
  updateMassAuditStandard,
  addEvidence,
  deleteMassAudit
};

export default massAuditService;
