import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eaziwage_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('eaziwage_token');
      localStorage.removeItem('eaziwage_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Employer APIs
export const employerApi = {
  create: (data) => api.post('/employers', data),
  getMe: () => api.get('/employers/me'),
  list: (params) => api.get('/employers', { params }),
  get: (id) => api.get(`/employers/${id}`),
  updateStatus: (id, status) => api.patch(`/employers/${id}/status`, null, { params: { status } }),
};

// Employee APIs
export const employeeApi = {
  create: (data) => api.post('/employees', data),
  getMe: () => api.get('/employees/me'),
  list: (params) => api.get('/employees', { params }),
  get: (id) => api.get(`/employees/${id}`),
  updateStatus: (id, status) => api.patch(`/employees/${id}/status`, null, { params: { status } }),
  updateKycStatus: (id, kycStatus) => api.patch(`/employees/${id}/kyc-status`, null, { params: { kyc_status: kycStatus } }),
};

// Advance APIs
export const advanceApi = {
  create: (data) => api.post('/advances', data),
  list: (params) => api.get('/advances', { params }),
  get: (id) => api.get(`/advances/${id}`),
  approve: (id) => api.patch(`/advances/${id}/approve`),
  disburse: (id) => api.patch(`/advances/${id}/disburse`),
  reject: (id, reason) => api.patch(`/advances/${id}/reject`, null, { params: { reason } }),
};

// KYC APIs
export const kycApi = {
  uploadDocument: (data) => api.post('/kyc/documents', data),
  listDocuments: (params) => api.get('/kyc/documents', { params }),
  reviewDocument: (id, status, notes) => api.patch(`/kyc/documents/${id}/review`, null, { params: { status, notes } }),
};

// Risk Score APIs
export const riskScoreApi = {
  updateEmployerScore: (employerId, data) => api.post(`/risk-scores/employer/${employerId}`, data),
  updateEmployeeScore: (employeeId, data) => api.post(`/risk-scores/employee/${employeeId}`, data),
  getScore: (entityType, entityId) => api.get(`/risk-scores/${entityType}/${entityId}`),
};

// Payroll APIs
export const payrollApi = {
  upload: (data) => api.post('/payroll/upload', data),
  getHistory: () => api.get('/payroll/history'),
};

// Transaction APIs
export const transactionApi = {
  list: () => api.get('/transactions'),
};

// Dashboard APIs
export const dashboardApi = {
  getEmployeeDashboard: () => api.get('/dashboard/employee'),
  getEmployerDashboard: () => api.get('/dashboard/employer'),
  getAdminDashboard: () => api.get('/dashboard/admin'),
};

// Utility APIs
export const utilityApi = {
  getCountries: () => api.get('/countries'),
  getIndustries: () => api.get('/industries'),
};

export default api;
