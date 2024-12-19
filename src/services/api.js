export async function generateCompetitorAnalysis(companyName, existingOutput = null, userFeedback = null) {
  const response = await fetch(`${import.meta.env.VITE_COMPETITOR_API_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      company_name: companyName,
      previous_data: {},
      ...(existingOutput && userFeedback ? {
        current_prompt_data: {
          existing_generated_output: existingOutput,
          user_feedback: userFeedback
        }
      } : {}),
      other_input_data: {}
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(errorData.detail || errorData.message || 'Failed to generate analysis');
  }

  return response.json();
}