import React from 'react';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';

const AgentCard = ({ title, icon, status, role }) => {
  let statusText = "Queued";
  let statusClass = "idle";
  let statusIcon = <Clock size={12} />;

  if (status === 'working') {
    statusText = "Synthesizing";
    statusClass = "working";
    statusIcon = <Loader2 size={12} className="spin-slow" />;
  } else if (status === 'completed') {
    statusText = "Completed";
    statusClass = "completed";
    statusIcon = <CheckCircle2 size={12} />;
  }

  return (
    <div className={`clay-agent-tile ${status === 'working' ? 'active' : ''}`}>
      <div className="clay-agent-tile-top">
        <div className="clay-agent-avatar">
          {icon}
        </div>
        <div className={`clay-status-pill ${statusClass}`}>
          {statusIcon}
          <span>{statusText}</span>
        </div>
      </div>

      <h4 className="clay-agent-title">{title}</h4>
      {role && <p className="clay-agent-desc">{role}</p>}
    </div>
  );
};

export default AgentCard;
