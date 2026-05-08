import { HfInference } from '@huggingface/inference';

const MODEL = 'Qwen/Qwen2.5-Coder-32B-Instruct';

/**
 * Send a message to the Hugging Face model with dashboard context
 */
export async function sendChatMessage(userMessage, dashboardData) {
  const token = import.meta.env.VITE_AI_TOKEN;
  if (!token) {
    throw new Error('AI token not configured. Please set VITE_AI_TOKEN in your .env file.');
  }

  const hf = new HfInference(token);

  // Build context from dashboard data
  const contextParts = [];

  if (dashboardData.issPosition) {
    contextParts.push(
      `ISS Current Position: Latitude ${dashboardData.issPosition.latitude.toFixed(4)}, Longitude ${dashboardData.issPosition.longitude.toFixed(4)}`
    );
  }

  if (dashboardData.issSpeed !== undefined) {
    contextParts.push(`ISS Current Speed: ${dashboardData.issSpeed} km/h`);
  }

  if (dashboardData.nearestLocation) {
    contextParts.push(`ISS Nearest Location: ${dashboardData.nearestLocation}`);
  }

  if (dashboardData.astronautCount !== undefined) {
    contextParts.push(`People Currently in Space: ${dashboardData.astronautCount}`);
  }

  if (dashboardData.astronauts && dashboardData.astronauts.length > 0) {
    const names = dashboardData.astronauts.map((a) => `${a.name} (${a.craft})`).join(', ');
    contextParts.push(`Astronauts: ${names}`);
  }

  if (dashboardData.newsArticles && dashboardData.newsArticles.length > 0) {
    const newsSummary = dashboardData.newsArticles
      .map((a, i) => `${i + 1}. "${a.title}" - ${a.source} (${a.description || 'No description'})`)
      .join('\n');
    contextParts.push(`Latest News:\n${newsSummary}`);
  }

  if (dashboardData.trackedPositions !== undefined) {
    contextParts.push(`Number of Tracked ISS Positions: ${dashboardData.trackedPositions}`);
  }

  const contextString = contextParts.join('\n');

  try {
    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are SpacePulse AI assistant. Answer ONLY using the provided dashboard data below. If the answer does not exist in the dashboard data, reply: "I don't have that information from the dashboard data."\n\nDo NOT use any outside knowledge. Do NOT make up information. Only reference facts present in the dashboard data.\n\nDashboard Data:\n${contextString}`
        },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    }

    return "I couldn't generate a response. Please try again.";
  } catch (error) {
    if (error.message.includes('loading') || error.message.includes('503')) {
      throw new Error('AI model is loading. Please try again in a few seconds.');
    }
    if (error.message.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    }
    console.error("HF Inference Error:", error);
    throw new Error('Failed to get AI response. Please check your API token or try again.');
  }
}
