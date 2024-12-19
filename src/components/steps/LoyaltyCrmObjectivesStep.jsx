import { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';

export default function LoyaltyCrmObjectivesStep() {
  const { companyName, stepData, updateStepData } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);

  const currentAnalysis = stepData?.loyalty_crm?.analysis || null;
  const objectives = stepData?.loyalty_crm?.objectives || null;

  const generateAnalysis = async (userFeedback = null) => {
    setLoading(true);
    setError(null);

    const requestBody = {
      company_name: companyName,
      previous_data: {
        competitor_analysis: stepData?.competitor?.analysis || '',
        customer_analysis: stepData?.customer?.analysis || ''
      },
      ...(userFeedback && {
        existing_generated_output: currentAnalysis,
        user_feedback: userFeedback
      })
    };

    try {
      const response = await fetch('https://loyalty-program-objectives-service.up.railway.app/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to generate objectives');

      const data = await response.json();

      updateStepData('loyalty_crm', {
        analysis: data.generated_output,
        objectives: data.structured_data.objectives,
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

  const handleRegenerate = () => setShowFeedback(true);
  const handleFeedbackSubmit = () => feedback.trim() && generateAnalysis(feedback);

  const canProceed = stepData?.competitor?.analysis && stepData?.customer?.analysis;

  return (
    <div className="step-content-container">
      {error && <div className="error-message">{error}</div>}

      {!currentAnalysis && !loading && (
        <button 
          onClick={() => generateAnalysis()}
          className="primary-button"
          disabled={!canProceed}
        >
          {!canProceed 
            ? 'Please complete previous steps first'
            : 'Generate Loyalty & CRM Objectives'}
        </button>
      )}

      {loading && (
        <div className="loading-indicator">Generating objectives...</div>
      )}

      {currentAnalysis && !loading && (
        <div className="analysis-container">
          <pre className="analysis-content">{currentAnalysis}</pre>
          
          {objectives && (
            <div className="objectives-container">
              <h3>Key Objectives</h3>
              <div className="objectives-grid">
                {objectives.map((objective, index) => (
                  <div key={index} className="objective-card">
                    <h4>{objective.title}</h4>
                    <p>{objective.description}</p>
                    {objective.metrics && (
                      <ul>
                        {objective.metrics.map((metric, idx) => (
                          <li key={idx}>{metric}</li>
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