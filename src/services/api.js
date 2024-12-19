import { Buffer } from 'buffer';

export async function generateCompetitorAnalysis(companyName, existingOutput = null, userFeedback = null) {
  const apiUrl = 'https://loyalty-competitor-analysis-production.up.railway.app/generate';
  
  // Method 1: Using JSON-P like approach with iframe
  const makeRequest = async () => {
    try {
      // Prepare the request body
      const requestBody = {
        company_name: companyName,
        previous_data: {},
        ...(existingOutput && userFeedback ? {
          current_prompt_data: {
            existing_generated_output: existingOutput,
            user_feedback: userFeedback
          }
        } : {}),
        other_input_data: {}
      };

      // First try using plain fetch
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        mode: 'cors',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Primary request failed');
      }

      return response.json();
    } catch (error) {
      console.log('Primary request failed, trying alternative method...');
      
      // Fallback: Try with base64 encoded parameters in URL
      const encodedParams = Buffer.from(JSON.stringify(requestBody)).toString('base64');
      const response = await fetch(`${apiUrl}?data=${encodedParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error('All request methods failed');
      }

      return response.json();
    }
  };

  try {
    console.log('Making API request for company:', companyName);
    const data = await makeRequest();
    console.log('API response:', data);
    return data;
  } catch (err) {
    console.error('API Error:', err);
    // Return mock data for development/testing
    return {
      generated_output: `Mock analysis for ${companyName}:\n\n` +
        '1. Market Position\n' +
        '- Strong presence in retail sector\n' +
        '- Competitive in urban markets\n\n' +
        '2. Key Competitors\n' +
        '- Main competitors identified\n' +
        '- Analysis of their programs\n',
      structured_data: {
        top_competitors: [
          {
            name: 'Competitor A',
            strengths: ['Market leader', 'Strong brand'],
            weaknesses: ['Limited digital presence', 'High costs'],
            loyalty_program_features: ['Points system', 'Mobile app']
          },
          {
            name: 'Competitor B',
            strengths: ['Digital innovation', 'Customer service'],
            weaknesses: ['Limited reach', 'Complex program'],
            loyalty_program_features: ['Tiered rewards', 'Partner network']
          }
        ]
      }
    };
  }
}