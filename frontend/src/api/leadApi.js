import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leads';

export const getLeads = () => axios.get(`${API_URL}/all`);
export const createLead = (leadData) => axios.post(`${API_URL}/add`, leadData);
export const updateLead = (id, updatedData) => axios.put(`${API_URL}/${id}`, updatedData);
export const deleteLead = (id) => axios.delete(`${API_URL}/${id}`);