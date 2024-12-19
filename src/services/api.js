const API_BASE_URL = 'https://loyalty-competitor-analysis-production.up.railway.app';

export async function generateCompetitorAnalysis(companyName, existingOutput = null, userFeedback = null) {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      company_name: companyName,
      existing_generated_output: existingOutput,
      user_feedback: userFeedback
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to generate analysis');
  }

  return response.json();
}