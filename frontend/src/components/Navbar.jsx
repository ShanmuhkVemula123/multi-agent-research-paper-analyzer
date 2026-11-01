import React from 'react';
import { Layers, Bot, History, PlusCircle } from 'lucide-react';

const Navbar = ({ mode = 'glass', onOpenHistory, onNewAnalysis, currentPaperTitle }) => {
  if (mode === 'glass') {
    return (
      <header className="glass-navbar">
        <div className="glass-nav-brand">
          <div className="glass-brand-icon">
            <Layers size={20} strokeWidth={2.4} />
          </div>
          <div>
            <span className="glass-brand-title">Multi-Agent Research Paper Analyzer</span>
          </div>
          <span className="glass-brand-tag">v2.5 Pro</span>
        </div>

        <div className="glass-nav-actions">
          <div className="glass-status-pill">
            <span className="pulse-dot"></span>
            <span>6 AI Agents Online</span>
          </div>

          {onOpenHistory && (
            <button className="glass-nav-btn" onClick={onOpenHistory} title="View previously analyzed papers">
              <History size={15} />
              <span>Library</span>
            </button>
          )}
        </div>
      </header>
    );
  }

  // Claymorphism Navbar for Dashboard / Results / Progress
  return (
    <header className="clay-navbar">
      <div className="clay-nav-left">
        <div className="clay-nav-brand">
          <div className="clay-brand-avatar">
            <Bot size={22} strokeWidth={2.4} />
          </div>
          <div className="clay-brand-info">
            <h3>Multi-Agent Research Paper Analyzer</h3>
            <span>{currentPaperTitle ? `Active Paper: ${currentPaperTitle}` : 'Claymorphic Research Workspace'}</span>
          </div>
        </div>
      </div>

      <div className="clay-nav-actions">
        {onNewAnalysis && (
          <button className="clay-btn clay-btn-primary" onClick={onNewAnalysis}>
            <PlusCircle size={16} />
            <span>New Analysis</span>
          </button>
        )}
        {onOpenHistory && (
          <button className="clay-btn" onClick={onOpenHistory} title="View previously analyzed papers">
            <History size={16} />
            <span>Past Papers</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;

