/**
 * api.js
 * 
 * Centralized Axios API client.
 * All API calls go through this module so the
 * backend URL is defined in one place.
 * Uses the VITE_API_URL environment variable.
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // 30 seconds for file uploads
  // Do not set Content-Type here; let the browser set multipart boundaries when sending FormData
});

// ============ EXAM API ============

/**
 * Fetch all active examinations.
 * @returns {Promise<Array>} List of exam objects
 */
export const fetchExams = async () => {
  const response = await api.get('/exams');
  return response.data.exams;
};

// ============ APPLICATION API ============

/**
 * Submit a new examination registration application.
 * @param {FormData} formData - The form data with all fields and files
 * @returns {Promise<Object>} The created application info
 */
export const submitApplication = async (formData) => {
  const response = await api.post('/applications', formData);
  return response.data;
};

/**
 * Get application details by application ID.
 * @param {string} applicationId
 * @returns {Promise<Object>} Application details
 */
export const getApplication = async (applicationId) => {
  const response = await api.get(`/applications/${applicationId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

/**
 * Get the PDF download URL for an application.
 * @param {string} applicationId
 * @returns {string} The URL to download the PDF
 */
export const getPDFDownloadURL = (applicationId) => {
  return `${API_BASE}/applications/${applicationId}/pdf`;
};

export default api;
