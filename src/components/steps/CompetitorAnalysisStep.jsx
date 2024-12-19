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
  const competitors = stepData?.competitor?.structured_data?.top_competitors || [];

  const generateAnalysis = async (userFeedback = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await generateCompetitorAnalysis(
        companyName,
        userFeedback ? currentAnalysis : null,
        userFeedback
      );

      updateStepData('competitor', {
        analysis: response.generated_output,
        structured_data: response.structured_data,
        lastUpdated: new Date().toISOString()
      });

      setShowFeedback(false);
      setFeedback('');
    } catch (err) {
      console.error('Analysis generation error:', err);
      setError('Failed to generate analysis. Using sample data for demonstration.');
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
            onClick={() => setError(null)}
            className="dismiss-button"
          >
            Dismiss
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
                    
                    <h5>Loyalty Program Features</h5>
                    <ul className="features">
                      {competitor.loyalty_program_features.map((feature, idx) => (
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