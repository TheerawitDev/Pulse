import { NextResponse } from 'next/server';
import { Bounty, LocalContext } from '@/types';

const SYSTEM_PROMPT = `You are a Generative UI engine for a hyper-personalized local commerce app. 
You will be provided with a "Bounty" (merchant rules and constraints) and a "LocalContext" (real-time data about the user's current situation like weather, battery, and time).

Your task is to generate an offer tailored specifically to this exact moment.

CRITICAL REQUIREMENT: 
You MUST respond with ONLY a valid JSON object matching the following structure. Do not include any markdown formatting, code blocks (like \`\`\`json), or conversational text. Output pure JSON only.

{
  "headline": "string (Short, punchy, situational hook)",
  "body": "string (1-2 sentences explaining why this offer matters right now)",
  "discountPercentage": "number (Must be less than or equal to the Bounty's maxDiscountPercentage)",
  "uiTheme": "string (Must be exactly one of: 'warm', 'cool', 'urgent', 'minimal')",
  "callToAction": "string (Short button text, e.g., 'Claim Offer')"
}

Example valid response:
{"headline": "Cold Hands?", "body": "Warm up with a hot latte just 2 mins away.", "discountPercentage": 10, "uiTheme": "warm", "callToAction": "Get Latte"}
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bounty, context }: { bounty: Bounty; context: LocalContext } = body;

    if (!bounty || !context) {
      return NextResponse.json({ error: 'Missing bounty or context' }, { status: 400 });
    }

    const userPrompt = `
Bounty:
${JSON.stringify(bounty, null, 2)}

Local Context:
${JSON.stringify(context, null, 2)}
`;

    // Call local Ollama instance (assuming Gemma is running on port 11434)
    const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({
        model: 'gemma:2b', // Using the lowest parameter Gemma model
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
        stream: false,
        format: 'json', // Instructs Ollama to output valid JSON
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.statusText}`);
    }

    const data = await ollamaResponse.json();
    
    // Parse the generated text into our expected JSON structure
    let generatedOffer;
    try {
      generatedOffer = JSON.parse(data.response);
    } catch (parseError) {
      console.error("Failed to parse Ollama response as JSON:", data.response);
      throw new Error('LLM did not return valid JSON');
    }

    return NextResponse.json(generatedOffer);
  } catch (error) {
    console.error('Error generating offer:', error);
    return NextResponse.json(
      { error: 'Failed to generate offer' },
      { status: 500 }
    );
  }
}
