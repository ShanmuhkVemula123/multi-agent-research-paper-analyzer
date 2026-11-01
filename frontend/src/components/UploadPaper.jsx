import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  X, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  BarChart3, 
  ShieldCheck, 
  Compass, 
  BookOpen,
  FlaskConical
} from 'lucide-react';
import { uploadPaper } from '../services/api';

const AGENT_SHOWCASE = [
  {
    icon: <Cpu size={22} className="text-indigo-400" />,
    name: "Coordinator Agent",
    role: "Orchestration & Workflow",
    desc: "Parses PDF structure, partitions paper contexts, and synchronizes parallel execution among worker agents.",
    color: "rgba(99, 102, 241, 0.2)"
  },
  {
    icon: <BookOpen size={22} className="text-violet-400" />,
    name: "Summary Agent",
    role: "Executive Synthesis",
    desc: "Distills core thesis, research scope, high-level objectives, and overarching contributions.",
    color: "rgba(139, 92, 246, 0.2)"
  },
  {
    icon: <FlaskConical size={22} className="text-cyan-400" />,
    name: "Methodology Agent",
    role: "Experimental Auditor",
    desc: "Deconstructs experimental setups, architectural pipelines, mathematical formulas, and benchmarks.",
    color: "rgba(6, 182, 212, 0.2)"
  },
  {
    icon: <BarChart3 size={22} className="text-emerald-400" />,
    name: "Findings Agent",
    role: "Quantitative Analyst",
    desc: "Extracts empirical metrics, BLEU/F1 benchmarks, ablation scores, and statistical outcomes.",
    color: "rgba(16, 185, 129, 0.2)"
  },
  {
    icon: <ShieldCheck size={22} className="text-amber-400" />,
    name: "Strengths & Weaknesses",
    role: "Peer Review Evaluator",
    desc: "Applies peer-review critique to determine technical novelty, computational advantages, and dataset limitations.",
    color: "rgba(245, 158, 11, 0.2)"
  },
  {
    icon: <Compass size={22} className="text-rose-400" />,
    name: "Research Gap Agent",
    role: "Frontier Explorer",
    desc: "Identifies unexplored edge-cases, future work vectors, and open technical challenges.",
    color: "rgba(244, 63, 94, 0.2)"
  }
];

const UploadPaper = ({ onUploadComplete, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      onError("Please upload a valid PDF research paper.");
      return;
    }
    setFile(selectedFile);
    onError(null);
  };

  const handleClearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await uploadPaper(file);
      onUploadComplete(data);
    } catch (error) {
      onError(error.response?.data?.detail || "Failed to upload and parse the PDF document.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {/* Hero Header */}
      <section className="glass-hero">
        <div className="glass-badge-hero">
          <Sparkles size={14} />
          <span>Autonomous Multi-Agent Intelligence • Academic SaaS</span>
        </div>
        <h1>Multi-Agent Research Paper Analyzer</h1>
        <p>
          Deconstruct complex scientific literature in seconds. Our autonomous multi-agent architecture uses specialized AI agents to extract executive summaries, rigorous methodology, empirical findings, and critical research gaps.
        </p>
      </section>

      {/* Visual Centerpiece: Glassmorphic Upload Card */}
      <div className="glass-centerpiece-wrapper">
        <div className="glass-centerpiece-glow"></div>

        <div className="glass-card-centerpiece">
          <div 
            className={`glass-dropzone ${isDragging ? 'drag-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <div className="glass-upload-icon-box">
              <UploadCloud size={36} strokeWidth={1.8} />
            </div>

            <h3 className="glass-dropzone-title">
              {file ? "PDF Selected — Ready to Analyze" : "Drag & drop your research paper"}
            </h3>

            <p className="glass-dropzone-subtitle">
              {file ? "Click to change document or proceed with multi-agent analysis below" : "or click to browse your local device"}
            </p>

            <div className="glass-dropzone-pills">
              <span className="glass-pill">PDF Document</span>
              <span className="glass-pill">Text & OCR Extraction</span>
              <span className="glass-pill">Up to 25MB</span>
            </div>

            <input 
              type="file" 
              accept=".pdf,application/pdf" 
              style={{ display: 'none' }} 
              ref={fileInputRef}
              onChange={handleFileInput}
            />
          </div>

          {/* Selected File Details Glass Pill */}
          {file && (
            <div className="glass-selected-file-card">
              <div className="glass-file-info">
                <div className="glass-file-icon">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="glass-file-name" title={file.name}>{file.name}</div>
                  <div className="glass-file-size">
                    {formatFileSize(file.size)} • PDF Ready
                  </div>
                </div>
              </div>

              <div className="glass-file-actions">
                <button 
                  className="glass-remove-btn" 
                  onClick={handleClearFile} 
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Start Analysis Glass Button */}
          {file && (
            <button 
              className="glass-btn-primary" 
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="pulse-dot"></div>
                  <span>Extracting & Uploading Paper...</span>
                </>
              ) : (
                <>
                  <span>Initialize Multi-Agent Analysis</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Glassmorphic Agent Showcase */}
      <section className="glass-showcase-section">
        <div className="glass-showcase-header">
          <h2>Specialized AI Agent Roster</h2>
          <p>Each agent runs focused analytical prompts tailored for academic peer-review standards</p>
        </div>

        <div className="glass-agents-grid">
          {AGENT_SHOWCASE.map((agent, index) => (
            <div key={index} className="glass-agent-card">
              <div className="glass-agent-card-header">
                <div className="glass-agent-icon-badge" style={{ background: agent.color }}>
                  {agent.icon}
                </div>
                <div className="glass-agent-meta">
                  <h4>{agent.name}</h4>
                  <span className="glass-agent-tag">{agent.role}</span>
                </div>
              </div>
              <p>{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UploadPaper;
