import React, { useEffect, useState } from 'react';
import { analyzePaper } from '../services/api';
import AgentCard from './AgentCard';

const AnalysisProgress = ({ paperId, onComplete, onError }) => {
    // We simulate the sequence visually, while the backend actually does it concurrently
    const [statuses, setStatuses] = useState({
        coordinator: 'working',
        summary: 'idle',
        methodology: 'idle',
        findings: 'idle',
        strengths: 'idle',
        gaps: 'idle'
    });

    useEffect(() => {
        let isMounted = true;
        
        const runAnalysis = async () => {
            try {
                // Visual progression simulation for a better UX while waiting
                setTimeout(() => {
                    if (isMounted) {
                        setStatuses(prev => ({
                            ...prev, 
                            coordinator: 'completed',
                            summary: 'working',
                            methodology: 'working',
                            findings: 'working',
                            strengths: 'working',
                            gaps: 'working'
                        }));
                    }
                }, 1500);

                const result = await analyzePaper(paperId);
                
                if (isMounted) {
                    setStatuses({
                        coordinator: 'completed',
                        summary: 'completed',
                        methodology: 'completed',
                        findings: 'completed',
                        strengths: 'completed',
                        gaps: 'completed'
                    });
                    
                    // Small delay to let user see "completed" state
                    setTimeout(() => {
                        onComplete(result);
                    }, 1000);
                }

            } catch (error) {
                if (isMounted) {
                    onError(error.response?.data?.detail || "Analysis failed.");
                }
            }
        };

        runAnalysis();

        return () => { isMounted = false; };
    }, [paperId]);

    return (
        <div className="progress-container card">
            <h2>Multi-Agent System Active</h2>
            <p style={{ color: 'var(--text-muted)' }}>Agents are currently reading and analyzing the document...</p>
            
            <div className="architecture-vis">
{`                 Research Paper
                       │
                       ▼
              Coordinator Agent
             /    /    |    \\    \\
            ▼    ▼     ▼     ▼    ▼
        Summary Method Findings Strengths Gap
          Agent  Agent  Agent   Agent  Agent`}
            </div>

            <div className="agents-grid">
                <AgentCard title="Coordinator Agent" icon="🧠" status={statuses.coordinator} />
                <AgentCard title="Summary Agent" icon="📝" status={statuses.summary} />
                <AgentCard title="Methodology Agent" icon="🔬" status={statuses.methodology} />
                <AgentCard title="Findings Agent" icon="📊" status={statuses.findings} />
                <AgentCard title="Strengths & Weaknesses" icon="⚖️" status={statuses.strengths} />
                <AgentCard title="Research Gap Agent" icon="🎯" status={statuses.gaps} />
            </div>
        </div>
    );
};

export default AnalysisProgress;
