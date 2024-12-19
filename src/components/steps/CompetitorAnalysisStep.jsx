import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../../context/GlobalContext';
import { useAPICall } from '../../hooks/useAPICall';
import FeedbackModal from '../FeedbackModal';
import ErrorDisplay from '../ErrorDisplay';

export default function CompetitorAnalysisStep() {
  const { companyName, stepData, updateStepData } = useGlobal();
  const { loading, error, executeCall, clearError } = useAPICall();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!companyName) {
      navigate('/');
    }
  }, [companyName, navigate]);

  const currentAnalysis = stepData?.competitor?.analysis || null;
  const competitors = stepData?.competitor?.structured_data?.competitors || [];

  const generateAnalysis = async (userFeedback = null) => {
    try {
      const response = await executeCall(async () => {
        // Mock API call
        const result = await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              generated_output: `Competitor Analysis for ${companyName}:\n\n` +
                (userFeedback ? `[Regenerated based on feedback: ${userFeedback}]\n\n` : '') +
                '1. Market Position\n' +
                '2. Competitor Programs\n' +
                '3. Key Differentiators\n' +
                '4. Opportunities',
              structured_data: {
                competitors: [
                  {
                    name: 'Competitor A',
                    program_type: 'Points-based',
                    key_features: ['Feature 1', 'Feature 2'],
                    strengths: ['Strength 1', 'Strength 2'],
                    weaknesses: ['Weakness 1', 'Weakness 2']
                  },
                  {
                    name: 'Competitor B',
                    program_type: 'Tiered',
                    key_features: ['Feature 1', 'Feature 2'],
                    strengths: ['Strength 1', 'Strength 2'],
                    weaknesses: ['Weakness 1', 'Weakness 2']
                  }
                ]
              }
            });
          }, 1500);
        });

        return result;
      });

      updateStepData('competitor', {
        analysis: response.generated_output,
        structured_data: response.structured_data,
        lastUpdated: new Date().toISOString()
      });

      setShowFeedback(false);
      setFeedback('');
    } catch (err) {
      // Error is handled by useAPICall
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      generateAnalysis(feedback);
    }
  };

  return (
    <div className="step-content-container">
      <ErrorDisplay
        error={error}
        onRetry={() => generateAnalysis()}
        onDismiss={clearError}
      />

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