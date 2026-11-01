import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  BookOpen, 
  FlaskConical, 
  BarChart3, 
  ShieldCheck, 
  Compass, 
  Sparkles
} from 'lucide-react';
import { analyzePaper } from '../services/api';
import AgentCard from './AgentCard';

const AnalysisProgress = ({ paperId, onComplete, onError }) => {
  const [progressPercent, setProgressPercent] = useState(15);
  const [statuses, setStatuses] = useState({
    coordinator: 'working',
    summary: 'idle',
    methodology: 'idle',
    findings: 'idle',
    strengths: 'idle',
    gaps: 'idle'
  });
  const [currentAction, setCurrentAction] = useState('Master Coordinator is reading parsed PDF tokens...');

  useEffect(() => {
    let isMounted = true;

    // Smooth simulated progress updates
    const t1 = setTimeout(() => {
      if (isMounted) {
        setProgressPercent(40);
        setCurrentAction('Coordinator dispatched extraction tasks to 5 specialized agents...');
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
    }, 1400);

    const t2 = setTimeout(() => {
      if (isMounted) {
        setProgressPercent(75);
        setCurrentAction('Gemini Neural API synthesizing methodology & empirical benchmarks...');
      }
    }, 3200);

    const runAnalysis = async () => {
      try {
        const result = await analyzePaper(paperId);

        if (isMounted) {
          setProgressPercent(100);
          setCurrentAction('All agents completed analysis. Compiling final academic report...');
          setStatuses({
            coordinator: 'completed',
            summary: 'completed',
            methodology: 'completed',
            findings: 'completed',
            strengths: 'completed',
            gaps: 'completed'
          });

          // Short delay to display completion
          setTimeout(() => {
            if (isMounted) {
              onComplete(result);
            }
          }, 900);
        }
      } catch (error) {
        if (isMounted) {
          onError(error.response?.data?.detail || "Multi-agent analysis failed. Please try again.");
        }
      }
    };

    runAnalysis();

    return () => {
      isMounted = false;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [paperId]);

  return (
    <div className="clay-card">
      <div className="clay-progress-header">
        <div className="clay-progress-badge">
          <Sparkles size={14} />
          <span>Multi-Agent Neural Synthesis</span>
        </div>
        <h2>Analyzing Research Paper</h2>
        <p>{currentAction}</p>
      </div>

      {/* Recessed Clay Progress Bar */}
      <div className="clay-progress-bar-wrap">
        <div 
          className="clay-progress-fill" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* 3D Clay Multi-Agent Architecture Visualizer */}
      <div className="clay-architecture-card">
        <div className="clay-arch-flow">
          <div className="clay-arch-node-master">
            <Cpu size={20} color="#8064D8" />
            <span>Master Coordinator Agent (Orchestrator)</span>
            <span className={`clay-status-pill ${statuses.coordinator}`}>
              {statuses.coordinator === 'working' ? 'Orchestrating' : 'Complete'}
            </span>
          </div>

          <div className="clay-arch-connector"></div>
          <div className="clay-arch-branch"></div>
        </div>

        {/* 5 Worker Agents Grid */}
        <div className="clay-agents-grid">
          <AgentCard 
            title="Summary Agent" 
            role="Extracts executive thesis & core problem" 
            icon={<BookOpen size={24} color="#8064D8" />} 
            status={statuses.summary} 
          />
          <AgentCard 
            title="Methodology Agent" 
            role="Audits architectural designs & experimental formulas" 
            icon={<FlaskConical size={24} color="#B19AF5" />} 
            status={statuses.methodology} 
          />
          <AgentCard 
            title="Findings Agent" 
            role="Isolates empirical benchmarks & statistical metrics" 
            icon={<BarChart3 size={24} color="#38BDF8" />} 
            status={statuses.findings} 
          />
          <AgentCard 
            title="Strengths & Weaknesses" 
            role="Critiques peer novelty & boundary limitations" 
            icon={<ShieldCheck size={24} color="#34D399" />} 
            status={statuses.strengths} 
          />
          <AgentCard 
            title="Research Gap Agent" 
            role="Detects unaddressed frontiers & future work" 
            icon={<Compass size={24} color="#B19AF5" />} 
            status={statuses.gaps} 
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;
