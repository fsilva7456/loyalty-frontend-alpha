import { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';

export default function LoyaltyProgramDesignStep() {
  const { companyName, stepData, updateStepData } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);

  const currentDesign = stepData?.program_design?.design || null;
  const programFeatures = stepData?.program_design?.features || null;

  const generateDesign = async (userFeedback = null) => {
    setLoading(true);
    setError(null);

    const requestBody = {
      company_name: companyName,
      previous_data: {
        customer_analysis: stepData?.customer?.analysis || '',
        loyalty_crm_objectives: stepData?.loyalty_crm?.analysis || ''
      },
      ...(userFeedback && {
        existing_generated_output: currentDesign,
        user_feedback: userFeedback
      })
    };

    try {
      const response = await fetch('https://loyalty-program-design-service.up.railway.app/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to generate program design');

      const data = await response.json();

      updateStepData('program_design', {
        design: data.generated_output,
        features: data.structured_data.program_features,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message || 'Failed to generate design. Please try again.');
    } finally {
      setLoading(false);
      setShowFeedback(false);
      setFeedback('');
    }
  };

  const handleRegenerate = () => setShowFeedback(true);
  const handleFeedbackSubmit = () => feedback.trim() && generateDesign(feedback);

  const canProceed = stepData?.customer?.analysis && stepData?.loyalty_crm?.analysis;

  return (
    <div className="step-content-container">
      {error && <div className="error-message">{error}</div>}

      {!currentDesign && !loading && (
        <button 
          onClick={() => generateDesign()}
          className="primary-button"
          disabled={!canProceed}
        >
          {!canProceed 
            ? 'Please complete previous steps first'
            : 'Generate Program Design'}
        </button>
      )}

      {loading && (
        <div className="loading-indicator">Generating program design...</div>
      )}

      {currentDesign && !loading && (
        <div className="analysis-container">
          <pre className="analysis-content">{currentDesign}</pre>
          
          {programFeatures && (
            <div className="features-container">
              <h3>Program Features</h3>
              <div className="features-grid">
                {programFeatures.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <h4>{feature.name}</h4>
                    <p>{feature.description}</p>
                    {feature.benefits && (
                      <ul>
                        {feature.benefits.map((benefit, idx) => (
                          <li key={idx}>{benefit}</li>
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
              Regenerate Design
            </button>
          )}
        </div>
      )}
    </div>
  );
}