import { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
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
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockResponse = {
        generated_output: `Competitor Analysis for ${companyName}:\n\n` +
          (userFeedback ? `[Regenerated based on feedback: ${userFeedback}]\n\n` : '') +
          '1. Market Position\n' +
          '- Industry leader in retail sector\n' +
          '- Strong presence in urban markets\n\n' +
          '2. Competitor Programs\n' +
          '- Various loyalty initiatives in market\n' +
          '- Mix of points and tier-based systems\n\n' +
          '3. Key Differentiators\n' +
          '- Technology integration\n' +
          '- Customer service focus\n\n' +
          '4. Opportunities\n' +
          '- Digital expansion\n' +
          '- Personalization potential',
        structured_data: {
          competitors: [
            {
              name: 'Competitor A',
              program_type: 'Points-based',
              key_features: ['Mobile app integration', 'Instant rewards'],
              strengths: ['Wide market reach', 'Strong brand recognition'],
              weaknesses: ['Limited personalization', 'Complex redemption process']
            },
            {
              name: 'Competitor B',
              program_type: 'Tiered',
              key_features: ['VIP benefits', 'Partner network'],
              strengths: ['Premium customer base', 'High engagement rates'],
              weaknesses: ['High maintenance costs', 'Limited accessibility']
            }
          ]
        }
      };

      updateStepData('competitor', {
        analysis: mockResponse.generated_output,
        structured_data: mockResponse.structured_data,
        lastUpdated: new Date().toISOString()
      });

      setShowFeedback(false);
      setFeedback('');
    } catch (err) {
      setError('Failed to generate analysis. Please try again.');
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