export async function generateCompetitorAnalysis(companyName, existingOutput = null, userFeedback = null) {
  const response = await fetch(`${import.meta.env.VITE_COMPETITOR_API_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      text: `Analyze competitors for ${companyName}`,
      ...(existingOutput && { previous_response: existingOutput }),
      ...(userFeedback && { feedback: userFeedback })
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(errorData.message || 'Failed to generate analysis');
  }

  return response.json();
}