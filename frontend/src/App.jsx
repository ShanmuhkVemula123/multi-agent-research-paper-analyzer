import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import UploadPaper from './components/UploadPaper'
import AnalysisProgress from './components/AnalysisProgress'
import AnalysisResult from './components/AnalysisResult'

function App() {
  const [appState, setAppState] = useState('upload'); // upload, analyzing, results
  const [paper, setPaper] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

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
  }

  return (
    <div className="app-container">
      <Header />
      
      {error && <div className="error-message">{error}</div>}

      {appState === 'upload' && (
        <UploadPaper onUploadComplete={handleUploadComplete} onError={setError} />
      )}

      {appState === 'analyzing' && paper && (
        <AnalysisProgress 
          paperId={paper.id} 
          onComplete={handleAnalysisComplete}
          onError={handleAnalysisError}
        />
      )}

      {appState === 'results' && analysisResult && paper && (
        <AnalysisResult 
          result={analysisResult} 
          paperId={paper.id} 
          onReset={resetApp}
        />
      )}
    </div>
  )
}

export default App
