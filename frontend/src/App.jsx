import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import UploadPaper from './components/UploadPaper';
import AnalysisProgress from './components/AnalysisProgress';
import AnalysisResult from './components/AnalysisResult';
import PastPapersModal from './components/PastPapersModal';
import CyberBackground from './components/CyberBackground';
import FloatingAmbientBackground from './components/FloatingAmbientBackground';
import { AlertCircle } from 'lucide-react';

function App() {
  const [appState, setAppState] = useState('upload'); // 'upload' | 'analyzing' | 'results'
  const [paper, setPaper] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleUploadComplete = (uploadedPaper) => {
    setPaper(uploadedPaper);
    setAppState('analyzing');
    setError(null);
  };

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setAppState('results');
  };

  const handleAnalysisError = (errMsg) => {
    setError(errMsg);
    setAppState('upload');
  };

  const resetApp = () => {
    setAppState('upload');
    setPaper(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleSelectPastPaper = (selectedPaper, analysis) => {
    setPaper(selectedPaper);
    setAnalysisResult(analysis);
    setAppState('results');
    setError(null);
  };

  const isGlassMode = appState === 'upload';

  return (
    <div className={isGlassMode ? 'view-glass' : 'view-clay'}>
      {/* 1. Landing Page (First Page Only): UNCHANGED Cybersecurity Glassmorphism Background */}
      {isGlassMode && (
        <>
          <CyberBackground />
          <div className="glass-ambient-layer">
            <div className="glass-orb glass-orb-1"></div>
            <div className="glass-orb glass-orb-2"></div>
            <div className="glass-orb glass-orb-3"></div>
          </div>
        </>
      )}

      {/* 2. Internal Pages Only: Floating 3D Ambient Purple + Charcoal Atmosphere */}
      {!isGlassMode && (
        <>
          <FloatingAmbientBackground />
          <div className="clay-bg-texture"></div>
        </>
      )}

      <div className={isGlassMode ? 'app-glass-container' : 'app-clay-container'}>
        {/* Navigation Bar */}
        <Navbar 
          mode={isGlassMode ? 'glass' : 'clay'}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onNewAnalysis={!isGlassMode ? resetApp : null}
          currentPaperTitle={paper?.filename || paper?.title}
        />

        {/* Error Messages */}
        {error && (
          <div className={isGlassMode ? 'glass-error-banner' : 'clay-error-banner'}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Landing & Upload Page (Glassmorphism + Cybersecurity Background) */}
        {appState === 'upload' && (
          <UploadPaper 
            onUploadComplete={handleUploadComplete} 
            onError={setError} 
          />
        )}

        {/* 2. Analysis Progress Page (Charcoal + Purple Dark Claymorphism) */}
        {appState === 'analyzing' && paper && (
          <AnalysisProgress 
            paperId={paper.id} 
            onComplete={handleAnalysisComplete}
            onError={handleAnalysisError}
          />
        )}

        {/* 3. Analysis Results Page (Charcoal + Purple Dark Claymorphism) */}
        {appState === 'results' && analysisResult && paper && (
          <AnalysisResult 
            result={analysisResult} 
            paperId={paper.id} 
            paperTitle={paper.filename || paper.title}
            onReset={resetApp}
          />
        )}
      </div>

      {/* Library of Past Papers (Charcoal + Purple Claymorphic Modal) */}
      <PastPapersModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectPaper={handleSelectPastPaper}
      />
    </div>
  );
}

export default App;
