import React from 'react';

const AgentCard = ({ title, icon, status }) => {
    
    let statusText = "Waiting...";
    if (status === 'working') statusText = "Working";
    if (status === 'completed') statusText = "Completed";

    return (
        <div className={`agent-card ${status === 'working' ? 'working' : ''}`}>
            <div className="agent-icon">{icon}</div>
            <div className="agent-name">{title}</div>
            <div className="agent-status">
                <span className={`status-dot ${status}`}></span>
                {statusText}
            </div>
        </div>
    );
};

export default AgentCard;
