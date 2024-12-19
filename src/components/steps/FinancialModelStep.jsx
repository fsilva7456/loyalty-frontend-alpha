import { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';

export default function FinancialModelStep() {
  const { companyName, stepData, updateStepData } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);

  const currentModel = stepData?.financial?.model || null;
  const financialMetrics = stepData?.financial?.metrics || null;

  const generateModel = async (userFeedback = null) => {
    setLoading(true);
    setError(null);

    const requestBody = {
      company_name: companyName,
      previous_data: {
        program_design: stepData?.program_design?.design || ''
      },
      ...(userFeedback && {
        existing_generated_output: currentModel,
        user_feedback: userFeedback
      })
    };

    try {
      const response = await fetch('https://loyalty-financial-model.up.railway.app/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to generate financial model');

      const data = await response.json();

      updateStepData('financial', {
        model: data.generated_output,
        metrics: data.structured_data.financial_metrics,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message || 'Failed to generate model. Please try again.');
    } finally {
      setLoading(false);
      setShowFeedback(false);
      setFeedback('');
    }
  };

  const handleRegenerate = () => setShowFeedback(true);
  const handleFeedbackSubmit = () => feedback.trim() && generateModel(feedback);

  const canProceed = stepData?.program_design?.design;

  return (
    <div className="step-content-container">
      {error && <div className="error-message">{error}</div>}

      {!currentModel && !loading && (
        <button 
          onClick={() => generateModel()}
          className="primary-button"
          disabled={!canProceed}
        >
          {!canProceed 
            ? 'Please complete previous steps first'
            : 'Generate Financial Model'}
        </button>
      )}

      {loading && (
        <div className="loading-indicator">Generating financial model...</div>
      )}

      {currentModel && !loading && (
        <div className="analysis-container">
          <pre className="analysis-content">{currentModel}</pre>
          
          {financialMetrics && (
            <div className="metrics-container">
              <h3>Financial Metrics</h3>
              <div className="metrics-grid">
                {financialMetrics.map((metric, index) => (
                  <div key={index} className="metric-card">
                    <h4>{metric.name}</h4>
                    <p className="metric-value">{metric.value}</p>
                    <p className="metric-description">{metric.description}</p>
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
              Regenerate Model
            </button>
          )}
        </div>
      )}
    </div>
  );
}