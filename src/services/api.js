// Ensure all env variables are defined
const requiredEnvVars = [
  'VITE_COMPETITOR_API_URL',
  'VITE_CUSTOMER_API_URL',
  'VITE_OBJECTIVES_API_URL',
  'VITE_PROGRAM_DESIGN_API_URL',
  'VITE_FINANCIAL_API_URL',
  'VITE_ROADMAP_API_URL',
  'VITE_BUSINESS_CASE_API_URL'
];

requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    console.warn(`Missing environment variable: ${varName}`);
  }
});

export async function generateCompetitorAnalysis(companyName, existingOutput = null, userFeedback = null) {
  const response = await fetch(`${import.meta.env.VITE_COMPETITOR_API_URL}/generate`, {
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