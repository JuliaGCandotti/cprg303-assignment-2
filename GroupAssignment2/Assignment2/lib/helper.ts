
/**
 * Sends a base64 image to the Anthropic API and asks Claude to estimate
 * the nutritional content. Returns parsed macros or throws on failure.
 */
 
interface AINutrition {
  title: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  imgUrl: string;
}
const geminiApiKey = process.env.GEMINI_API_KEY!;
const api_url = process.env.API_URL!;
async function analyzeImageWithAI(base64: string): Promise<AINutrition> {
  const payload = {
    contents: [
      {
        parts: [
          {
            text: 'Analyze this food image. Provide a rough estimate of calories, protein, carbs, and fat. Return ONLY a JSON object: {"item": "name", "calories": 0, "protein": "0g", "carbs": "0g", "fat": "0g"}',
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64,
            },
          },
        ],
      },
    ],
  };
  const response = await fetch(api_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text;

  // Strip any accidental markdown fences
  const clean = textResponse.replace(/```json|```/g, "").trim();
  const parsed: AINutrition = JSON.parse(clean);
  return parsed;
}

export { analyzeImageWithAI, AINutrition };