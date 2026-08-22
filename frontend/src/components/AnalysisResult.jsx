import React from 'react';
import { getReportUrl } from '../services/api';

const AnalysisResult = ({ result, paperId, onReset }) => {
    return (
        <div className="results-dashboard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Analysis Results</h2>
                <button 
                    onClick={onReset} 
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Analyze Another Paper
                </button>
            </div>

            <div className="result-section">
                <h3>📝 Paper Summary</h3>
                <div className="result-content">{result.summary}</div>
            </div>

            <div className="result-section">
                <h3>🔬 Methodology</h3>
                <div className="result-content">{result.methodology}</div>
            </div>

            <div className="result-section">
                <h3>📊 Key Findings</h3>
                <div className="result-content">{result.findings}</div>
            </div>

            <div className="result-section">
                <h3>⚖️ Strengths & Weaknesses</h3>
                <div className="result-content">{result.strengths}</div>
            </div>

            <div className="result-section">
                <h3>🎯 Research Gaps & Future Work</h3>
                <div className="result-content">{result.research_gaps}</div>
            </div>

            <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
                <h3>Download Full Report</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Get a compiled markdown version of this analysis.
                </p>
                <a 
                    href={getReportUrl(paperId)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="download-btn"
                >
                    📄 Download Markdown Report
                </a>
            </div>
        </div>
    );
};

export default AnalysisResult;
