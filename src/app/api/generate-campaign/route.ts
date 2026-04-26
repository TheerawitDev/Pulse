import { NextResponse } from 'next/server';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL_NAME = 'gemma:2b';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `You are a local marketing expert AI assistant for a platform called Pulse. 
The user is a local merchant (e.g., a cafe, bakery, or retail store owner).
They will tell you their goal in natural language (e.g., "I need to sell 20 extra coffees before 2pm").
Your job is to translate their goal into a structured campaign.

You MUST respond with a raw JSON object and nothing else. Do not use markdown blocks.

The JSON must exactly match this format:
{
  "name": "A short, catchy campaign name (e.g., Rainy Day Coffee Boost)",
  "discount": "A reasonable discount percentage as a string without the % sign (e.g., '15' or '20')",
  "traffic": "One of these exact strings: 'Low (Fill quiet hours)', 'Medium (Sustain flow)', or 'High (Capitalize on rush)'",
  "triggers": "Natural language rules for the generative engine (e.g., 'Target users walking slowly. Emphasize urgency.')"
}

Ensure the discount makes financial sense (e.g., not 100% unless it's a specific giveaway, usually 10-30%).
Match the traffic target to their goal (e.g., if they are trying to clear inventory quickly, use 'High', if they are empty, use 'Low').`;

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `Merchant Goal: ${prompt}`,
        system: systemPrompt,
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    let parsedContent;
    try {
        // Gemma sometimes wraps the JSON in markdown blocks despite the format parameter
        const cleanJsonStr = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedContent = JSON.parse(cleanJsonStr);
    } catch (e) {
        console.error("Failed to parse JSON from Ollama:", data.response);
        return NextResponse.json({ error: 'Failed to generate valid JSON' }, { status: 500 });
    }

    return NextResponse.json(parsedContent);

  } catch (error) {
    console.error('Error generating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to generate campaign' },
      { status: 500 }
    );
  }
}
