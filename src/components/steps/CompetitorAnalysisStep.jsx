import { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { generateCompetitorAnalysis } from '../../services/api';
import FeedbackModal from '../FeedbackModal';
import ErrorDisplay from '../ErrorDisplay';

export default function CompetitorAnalysisStep() {
  const { companyName, stepData, updateStepData } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);

  const currentAnalysis = stepData?.competitor?.analysis || null;
  const competitors = stepData?.competitor?.structured_data?.competitors || [];

  const generateAnalysis = async (userFeedback = null) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Generating analysis for:', companyName);
      const response = await generateCompetitorAnalysis(
        companyName,
        userFeedback ? currentAnalysis : null,
        userFeedback
      );
      console.log('API Response:', response);

      if (response.error) {
        throw new Error(response.error);
      }

      updateStepData('competitor', {
        analysis: response.content || response.generated_output,
        structured_data: response.structured_data || {},
        lastUpdated: new Date().toISOString()
      });

      setShowFeedback(false);
      setFeedback('');
    } catch (err) {
      console.error('Analysis Error:', err);
      setError(err.message || 'Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      generateAnalysis(feedback);
    }
  };

  return (
    <div className="step-content-container">
      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={() => generateAnalysis()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      )}

      {!currentAnalysis && !loading && (
        <div className="initial-state">
          <button 
            onClick={() => generateAnalysis()}
            className="primary-button"
          >
            Generate Competitor Analysis
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          Generating analysis...
        </div>
      )}

      {currentAnalysis && !loading && (
        <div className="analysis-container">
          <pre className="analysis-content">
            {currentAnalysis}
          </pre>
          
          {competitors.length > 0 && (
            <div className="structured-data">
              <h3>Competitive Landscape</h3>
              <div className="data-grid">
                {competitors.map((competitor, index) => (
                  <div key={index} className="data-card competitor-card">
                    <h4>{competitor.name}</h4>
                    <p><strong>Program Type:</strong> {competitor.program_type}</p>
                    
                    <h5>Key Features</h5>
                    <ul>
                      {competitor.key_features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                    
                    <h5>Strengths</h5>
                    <ul className="strengths">
                      {competitor.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                    
                    <h5>Weaknesses</h5>
                    <ul className="weaknesses">
                      {competitor.weaknesses.map((weakness, idx) => (
                        <li key={idx}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="button-container">
            <button 
              onClick={() => setShowFeedback(true)}
              className="secondary-button"
            >
              Regenerate Analysis
            </button>
          </div>

          <FeedbackModal
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
            feedback={feedback}
            onFeedbackChange={(e) => setFeedback(e.target.value)}
            onSubmit={handleFeedbackSubmit}
          />
        </div>
      )}
    </div>
  );
}