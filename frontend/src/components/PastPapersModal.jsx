import React, { useState, useEffect } from 'react';
import { X, FileText, ArrowRight, Search, Loader2 } from 'lucide-react';
import { getPapers, getPaperById } from '../services/api';

const PastPapersModal = ({ isOpen, onClose, onSelectPaper }) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchPapers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPapers();
        setPapers(data.reverse()); // most recent first
      } catch {
        setError("Failed to fetch past research papers.");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredPapers = papers.filter(p => 
    p.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = async (paper) => {
    if (paper.analysis) {
      onSelectPaper(paper, paper.analysis);
      onClose();
    } else {
      // If analysis not in summary, fetch full paper
      try {
        const full = await getPaperById(paper.id);
        onSelectPaper(full, full.analysis);
        onClose();
      } catch {
        setError("Failed to load this paper's analysis.");
      }
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="clay-modal-overlay" onClick={onClose}>
      <div className="clay-modal" onClick={e => e.stopPropagation()}>
        <div className="clay-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="clay-brand-avatar" style={{ width: '36px', height: '36px' }}>
              <FileText size={18} />
            </div>
            <div>
              <h3>Research Paper Library</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--clay-text-muted)' }}>
                Previously analyzed papers from SQLite database
              </span>
            </div>
          </div>

          <button className="clay-collapse-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '1rem 2rem 0' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'var(--clay-surface-recessed)', 
            padding: '0.65rem 1rem', 
            borderRadius: '16px',
            boxShadow: 'var(--clay-shadow-inset)',
            border: '1px solid var(--clay-border)'
          }}>
            <Search size={16} color="var(--clay-text-muted)" />
            <input 
              type="text" 
              placeholder="Search past research papers..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.9rem',
                color: 'var(--clay-text-primary)'
              }}
            />
          </div>
        </div>

        <div className="clay-modal-body">
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--clay-text-muted)' }}>
              <Loader2 size={32} className="spin-slow" style={{ margin: '0 auto 1rem' }} />
              <p>Fetching papers from database...</p>
            </div>
          )}

          {error && (
            <div className="clay-error-banner">
              <span>{error}</span>
            </div>
          )}

          {!loading && filteredPapers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--clay-text-muted)' }}>
              <p>No papers found in database.</p>
            </div>
          )}

          {!loading && filteredPapers.map(paper => (
            <div 
              key={paper.id} 
              className="clay-history-item"
              onClick={() => handleSelect(paper)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="clay-agent-avatar" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>
                  📄
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--clay-text-primary)' }}>
                    {paper.filename || paper.title || `Paper #${paper.id}`}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--clay-text-muted)' }}>
                    <span>ID: #{paper.id}</span>
                    <span>•</span>
                    <span>{formatDate(paper.created_at)}</span>
                    <span>•</span>
                    <span style={{ 
                      color: paper.status === 'analyzed' ? '#34d399' : '#fbbf24',
                      fontWeight: 600
                    }}>
                      {paper.status === 'analyzed' ? 'Analyzed' : paper.status}
                    </span>
                  </div>
                </div>
              </div>

              <button className="clay-btn clay-btn-sm" style={{ pointerEvents: 'none' }}>
                <span>View</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PastPapersModal;

