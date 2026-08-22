import React, { useState, useRef } from 'react';
import { uploadPaper } from '../services/api';

const UploadPaper = ({ onUploadComplete, onError }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (selectedFile) => {
        if (selectedFile.type !== 'application/pdf') {
            onError("Please upload a valid PDF file.");
            return;
        }
        setFile(selectedFile);
        onError(null);
    };

    const handleUploadClick = async () => {
        if (!file) return;
        
        setIsUploading(true);
        try {
            const data = await uploadPaper(file);
            onUploadComplete(data);
        } catch (error) {
            onError(error.response?.data?.detail || "Failed to upload file.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="card">
            <div 
                className={`upload-area ${isDragging ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
            >
                <div className="upload-icon">📄</div>
                <h3>{file ? file.name : "Drag & Drop your PDF here"}</h3>
                <p>or click to browse files</p>
                <input 
                    type="file" 
                    accept=".pdf" 
                    style={{ display: 'none' }} 
                    ref={fileInputRef}
                    onChange={handleFileInput}
                />
            </div>
            {file && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button 
                        className="upload-btn" 
                        onClick={handleUploadClick}
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Start Analysis"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadPaper;
