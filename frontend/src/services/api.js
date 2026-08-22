import axios from 'axios';

// Use VITE_API_URL for production, fallback to localhost for local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
