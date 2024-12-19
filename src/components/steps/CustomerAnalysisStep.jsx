import { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';

export default function CustomerAnalysisStep() {
  const { companyName, stepData, updateStepData } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);

  const currentAnalysis = stepData?.customer?.analysis || null;
  const customerSegments = stepData?.customer?.segments || null;

  const generateAnalysis = async (userFeedback = null) => {
    setLoading(true);
    setError(null);

    const requestBody = {
      company_name: companyName,
      previous_data: {
        competitor_analysis: stepData?.competitor?.analysis || ''
      },
      ...(userFeedback && {
        existing_generated_output: currentAnalysis,
        user_feedback: userFeedback
      })
    };

    try {
      const response = await fetch('https://loyalty-customer-analysis-production.up.railway.app/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to get customer analysis');
      }

      const data = await response.json();

      updateStepData('customer', {
        analysis: data.generated_output,
        segments: data.structured_data.customer_segments,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message || 'Failed to generate analysis. Please try again.');
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
          disabled={!stepData?.competitor?.analysis}
        >
          {!stepData?.competitor?.analysis 
            ? 'Please complete Competitor Analysis first'
            : 'Generate Customer Analysis'}
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
          
          {customerSegments && (
            <div className="segments-container">
              <h3>Customer Segments</h3>
              <div className="segments-grid">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="segment-card">
                    <h4>{segment.name}</h4>
                    <p>{segment.description}</p>
                    {segment.characteristics && (
                      <ul>
                        {segment.characteristics.map((char, idx) => (
                          <li key={idx}>{char}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
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