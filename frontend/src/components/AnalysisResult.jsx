import React, { useState } from 'react';
import { 
  BookOpen, 
  FlaskConical, 
  BarChart3, 
  ShieldCheck, 
  AlertTriangle, 
  Compass, 
  Download, 
  Copy, 
  Check, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Layers, 
  Calendar,
  Sparkles,
  Maximize2,
  Minimize2,
  Printer
} from 'lucide-react';
import { getReportUrl } from '../services/api';

// Helper to format lengthy AI text into readable paragraphs and numbered lists
const FormattedContent = ({ content, sectionColor = "#8064D8" }) => {
  if (!content) {
    return <p style={{ fontStyle: 'italic', color: 'var(--clay-text-muted)' }}>No information recorded.</p>;
  }

  // Check if text has numbered items like "1. ", "2. "
  const numberedPattern = /(?:^|\n|\s)(?:\d+[.)]|\(\d+\))\s+/;
  
  // If text contains numbered items, split into items
  if (numberedPattern.test(content)) {
    // Split by numbers
    const parts = content.split(/(?=(?:^|\n|\s)(?:\d+[.)]|\(\d+\))\s+)/g).filter(p => p.trim());
    if (parts.length > 1) {
      return (
        <div className="clay-numbered-list">
          {parts.map((item, idx) => {
            const cleanItem = item.trim().replace(/^(?:\d+[.)]|\(\d+\))\s*/, '');
            return (
              <div key={idx} className="clay-list-item">
                <div className="clay-list-marker">{idx + 1}</div>
                <div className="clay-list-content">
                  {renderFormattedInline(cleanItem)}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  }

  // Handle standard paragraphs and bullet points
  const paragraphs = content.split(/\n\s*\n|\n(?=[-*•]\s+)/g).filter(p => p.trim());

  return (
    <div className="clay-readable-text">
      {paragraphs.map((p, idx) => {
        const trimmed = p.trim();
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
          const bulletText = trimmed.replace(/^[-*•]\s+/, '');
          return (
            <div key={idx} className="clay-list-item" style={{ marginBottom: '0.75rem' }}>
              <div className="clay-list-marker" style={{ width: '8px', height: '8px', borderRadius: '50%', background: sectionColor, marginTop: '8px' }}></div>
              <div className="clay-list-content">{renderFormattedInline(bulletText)}</div>
            </div>
          );
        }
        return <p key={idx}>{renderFormattedInline(trimmed)}</p>;
      })}
    </div>
  );
};

// Render bold formatting **word** cleanly
const renderFormattedInline = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} style={{ color: 'var(--clay-text-primary)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// Intelligently parse Strengths and Weaknesses if backend returned them together
const parseStrengthsAndWeaknesses = (strengthsRaw, weaknessesRaw) => {
  if (weaknessesRaw && weaknessesRaw.trim().length > 0) {
    return {
      strengths: strengthsRaw,
      weaknesses: weaknessesRaw
    };
  }

  if (!strengthsRaw) {
    return { strengths: "", weaknesses: "" };
  }

  const weaknessKeywords = /(?:weaknesses|limitations|threats to validity|disadvantages|drawbacks):/i;
  const match = strengthsRaw.search(weaknessKeywords);

  if (match !== -1) {
    const sPart = strengthsRaw.substring(0, match).trim();
    const wPart = strengthsRaw.substring(match).replace(weaknessKeywords, '').trim();
    return {
      strengths: sPart || strengthsRaw,
      weaknesses: wPart || "Not explicitly segregated in source text."
    };
  }

  return {
    strengths: strengthsRaw,
    weaknesses: "No separate limitations were flagged by the peer-review agent."
  };
};

const AnalysisResult = ({ result, paperId, paperTitle, onReset }) => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [copiedFull, setCopiedFull] = useState(false);
  const [allExpanded, setAllExpanded] = useState(true);

  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    methodology: true,
    findings: true,
    strengths: true,
    weaknesses: true,
    gaps: true
  });

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    setExpandedSections({
      summary: nextState,
      methodology: nextState,
      findings: nextState,
      strengths: nextState,
      weaknesses: nextState,
      gaps: nextState
    });
  };

  const copyToClipboard = (text, label) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    if (label === 'full') {
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
    } else {
      setCopiedSection(label);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const { strengths, weaknesses } = parseStrengthsAndWeaknesses(result.strengths, result.weaknesses);

  const sections = [
    {
      id: 'section-summary',
      key: 'summary',
      title: '1. Research Paper Summary',
      theme: 'theme-summary',
      color: '#8064D8',
      agent: 'Summary Agent',
      icon: <BookOpen size={24} />,
      content: result.summary
    },
    {
      id: 'section-methodology',
      key: 'methodology',
      title: '2. Methodology Analysis',
      theme: 'theme-methodology',
      color: '#B19AF5',
      agent: 'Methodology Agent',
      icon: <FlaskConical size={24} />,
      content: result.methodology
    },
    {
      id: 'section-findings',
      key: 'findings',
      title: '3. Key Findings',
      theme: 'theme-findings',
      color: '#38BDF8',
      agent: 'Findings Agent',
      icon: <BarChart3 size={24} />,
      content: result.findings
    },
    {
      id: 'section-strengths',
      key: 'strengths',
      title: '4. Strengths & Novel Contributions',
      theme: 'theme-strengths',
      color: '#34d399',
      agent: 'Peer Review Agent',
      icon: <ShieldCheck size={24} />,
      content: strengths
    },
    {
      id: 'section-weaknesses',
      key: 'weaknesses',
      title: '5. Weaknesses & Limitations',
      theme: 'theme-weaknesses',
      color: '#fbbf24',
      agent: 'Critical Evaluator Agent',
      icon: <AlertTriangle size={24} />,
      content: weaknesses
    },
    {
      id: 'section-gaps',
      key: 'gaps',
      title: '6. Research Gaps & Future Directions',
      theme: 'theme-gaps',
      color: '#B19AF5',
      agent: 'Research Gap Agent',
      icon: <Compass size={24} />,
      content: result.research_gaps
    }
  ];

  const fullReportText = `
# Multi-Agent Research Paper Analysis
Paper Title: ${paperTitle || `Paper #${paperId}`}

## 1. Research Paper Summary
${result.summary || ''}

## 2. Methodology Analysis
${result.methodology || ''}

## 3. Key Findings
${result.findings || ''}

## 4. Strengths & Novel Contributions
${strengths || ''}

## 5. Weaknesses & Limitations
${weaknesses || ''}

## 6. Research Gaps & Future Directions
${result.research_gaps || ''}
  `.trim();

  return (
    <div>
      {/* Top Metadata Header Card */}
      <div className="clay-report-meta-card">
        <div className="clay-report-top-row">
          <div className="clay-paper-title-area">
            <h1>{paperTitle || `Research Paper #${paperId}`}</h1>
            <div className="clay-meta-badges">
              <span className="clay-pill-badge success">
                <Sparkles size={13} />
                <span>Multi-Agent Synthesis Complete</span>
              </span>
              <span className="clay-pill-badge">
                <Layers size={13} />
                <span>6 Analytical Dimensions</span>
              </span>
              <span className="clay-pill-badge">
                <Calendar size={13} />
                <span>ID: #{paperId}</span>
              </span>
            </div>
          </div>

          <div className="clay-actions-toolbar">
            <button className="clay-btn" onClick={onReset} title="Upload and analyze another PDF">
              <ArrowLeft size={16} />
              <span>Analyze Another Paper</span>
            </button>
            <a 
              href={getReportUrl(paperId)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="clay-btn clay-btn-primary"
              title="Download full Markdown report"
            >
              <Download size={16} />
              <span>Download Report</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Quick Jump Navigation Ribbon */}
      <div className="clay-report-nav">
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--clay-text-muted)', marginRight: '0.5rem' }}>
          JUMP TO:
        </span>
        {sections.map(s => (
          <button 
            key={s.id} 
            className="clay-nav-pill" 
            onClick={() => scrollToSection(s.id)}
          >
            {s.title.split('.')[1] || s.title}
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button 
            className="clay-btn clay-btn-sm" 
            onClick={toggleAll}
            title={allExpanded ? "Collapse all sections" : "Expand all sections"}
          >
            {allExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{allExpanded ? "Collapse All" : "Expand All"}</span>
          </button>

          <button 
            className="clay-btn clay-btn-sm" 
            onClick={() => copyToClipboard(fullReportText, 'full')}
            title="Copy full report as Markdown"
          >
            {copiedFull ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedFull ? "Copied!" : "Copy Report"}</span>
          </button>
        </div>
      </div>

      {/* 6 Dedicated 3D Clay Section Cards */}
      <div className="clay-sections-container">
        {sections.map(section => {
          const isExpanded = expandedSections[section.key];
          return (
            <div 
              key={section.id} 
              id={section.id} 
              className={`clay-section-card ${section.theme}`}
            >
              {/* Card Header (Clickable to Expand/Collapse) */}
              <div 
                className="clay-section-header"
                onClick={() => toggleSection(section.key)}
              >
                <div className="clay-section-header-left">
                  <div className="clay-section-icon-box">
                    {section.icon}
                  </div>
                  <div className="clay-section-titles">
                    <h3>{section.title}</h3>
                    <span className="clay-section-agent-badge">
                      <Sparkles size={11} color={section.color} />
                      <span>{section.agent}</span>
                    </span>
                  </div>
                </div>

                <div className="clay-section-header-right">
                  <button 
                    className="clay-btn clay-btn-sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(section.content, section.key);
                    }}
                    title="Copy section content"
                  >
                    {copiedSection === section.key ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                    <span>{copiedSection === section.key ? "Copied" : "Copy"}</span>
                  </button>

                  <div className="clay-collapse-btn" title={isExpanded ? "Collapse" : "Expand"}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Card Body (Collapsible) */}
              {isExpanded && (
                <div className="clay-section-body">
                  <FormattedContent content={section.content} sectionColor={section.color} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Clay Download & Export Card */}
      <div className="clay-download-card">
        <div className="clay-download-icon-wrap">
          <Download size={32} />
        </div>
        <h2>Export Complete Analysis Report</h2>
        <p>
          Download the synthesized academic report compiled from the 6 AI agents in clean GitHub Flavored Markdown.
        </p>

        <div className="clay-download-actions">
          <a 
            href={getReportUrl(paperId)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="clay-btn clay-btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
          >
            <FileText size={18} />
            <span>Download Markdown File (.md)</span>
          </a>

          <button 
            className="clay-btn" 
            onClick={() => copyToClipboard(fullReportText, 'full')}
            style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
          >
            {copiedFull ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
            <span>{copiedFull ? "Report Copied to Clipboard!" : "Copy Full Report"}</span>
          </button>

          <button 
            className="clay-btn" 
            onClick={() => window.print()}
            style={{ padding: '0.85rem 1.25rem', fontSize: '0.95rem' }}
            title="Print report or save as PDF via system dialog"
          >
            <Printer size={18} />
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
