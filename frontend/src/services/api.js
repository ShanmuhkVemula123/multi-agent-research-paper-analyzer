import axios from 'axios';

// Use VITE_API_URL for production, fallback to localhost for local development.
// Normalize to strip any trailing slash so paths resolve cleanly.
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = rawApiUrl.replace(/\/+$/, '');

export const uploadPaper = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const analyzePaper = async (paperId) => {
    const response = await axios.post(`${API_URL}/analyze/${paperId}`);
    return response.data;
};

export const getReportUrl = (paperId) => {
    return `${API_URL}/reports/${paperId}`;
};

export const getPapers = async () => {
    const response = await axios.get(`${API_URL}/papers`);
    return response.data;
};

export const getPaperById = async (paperId) => {
    const response = await axios.get(`${API_URL}/papers/${paperId}`);
    return response.data;
};
