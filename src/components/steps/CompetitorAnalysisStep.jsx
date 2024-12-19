import { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';

export default function CompetitorAnalysisStep() {
  const { companyName, stepData, updateStepData } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);

  const currentAnalysis = stepData?.competitor?.analysis || null;

  const generateAnalysis = async (userFeedback = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call for now
      const response = await new Promise(resolve => setTimeout(() => {
        resolve({
          analysis: `Competitor Analysis for ${companyName}:\n\n` +
            (userFeedback ? `[Regenerated based on feedback: ${userFeedback}]\n\n` : '') +
            '1. Market Position\n' +
            '2. Competitor Programs\n' +
            '3. Key Differentiators\n' +
            '4. Opportunities'
        });
      }, 1500));

      updateStepData('competitor', {
        analysis: response.analysis,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
      setShowFeedback(false);
      setFeedback('');
    }
  };

  const handleRegenerate = () => {
    setShowFeedback(true);
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      generateAnalysis(feedback);
    }
  };

  const handleInitialGenerate = () => {
    generateAnalysis();
  };

  return (
    <div className="step-content-container">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!currentAnalysis && !loading && (
        <button 
          onClick={handleInitialGenerate}
          className="primary-button"
        >
          Generate Competitor Analysis
        </button>
      )}

      {loading && (
        <div className="loading-indicator">
          Generating analysis...
        </div>
      )}

      {currentAnalysis && !loading && (
        <div className="analysis-container">
          <pre className="analysis-content">
            {currentAnalysis}
          </pre>
          
          {showFeedback ? (
            <div className="feedback-container">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What would you like to change or improve?"
                className="feedback-input"
              />
              <div className="feedback-actions">
                <button 
                  onClick={() => setShowFeedback(false)}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleFeedbackSubmit}
                  className="primary-button"
                  disabled={!feedback.trim()}
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleRegenerate}
              className="secondary-button"
            >
              Regenerate Analysis
            </button>
          )}
        </div>
      )}
    </div>
  );
}