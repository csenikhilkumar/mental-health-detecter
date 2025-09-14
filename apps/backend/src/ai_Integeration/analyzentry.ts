import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompt1 } from "./prompt";

export interface AIAnalysis {
  mood: string;
  confidence: number;
  reply: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function AnalyzeEntry(entry: string): Promise<AIAnalysis> {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 200,
      },
    });

    // Create the prompt
    const prompt = `${prompt1}Journal entry to analyze:
"${entry}"

Please provide your analysis in the exact format specified above.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text();

    console.log('Gemini Response:', resultText); // For debugging

    // Parse the response using regex
    const moodMatch = resultText.match(/Mood:\s*(\w+)/i);
    const confidenceMatch = resultText.match(/Confidence:\s*([\d.]+)/i);
    const replyMatch = resultText.match(/Reply:\s*(.+)/i);

    return {
      mood: moodMatch?.[1]?.toLowerCase() || "unknown",
      confidence: Math.min(Math.max(parseFloat(confidenceMatch?.[1] || "0.5"), 0), 1),
      reply: replyMatch?.[1]?.trim() || "You're doing your best, and that matters.",
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Simple fallback analysis based on keywords
    return fallbackAnalysis(entry);
  }
}

// Fallback function for when API fails
function fallbackAnalysis(entry: string): AIAnalysis {
  const text = entry.toLowerCase();
  const positiveWords = ['happy', 'good', 'great', 'excited', 'wonderful', 'amazing', 'love', 'joy'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'depressed', 'angry', 'hate', 'upset'];
  const anxiousWords = ['worried', 'anxious', 'nervous', 'stressed', 'overwhelmed', 'scared'];
  
  let mood = 'neutral';
  let confidence = 0.6;
  
  if (positiveWords.some(word => text.includes(word))) {
    mood = 'positive';
    confidence = 0.7;
  } else if (negativeWords.some(word => text.includes(word))) {
    mood = 'negative';
    confidence = 0.7;
  } else if (anxiousWords.some(word => text.includes(word))) {
    mood = 'anxious';
    confidence = 0.7;
  }
  
  const supportiveReplies = {
    positive: "It's wonderful to hear you're feeling positive! Keep nurturing those good feelings.",
    negative: "I hear that you're going through a tough time. Remember, it's okay to feel this way, and you're not alone.",
    anxious: "Anxiety can be challenging. Try some deep breathing exercises and remember to take things one step at a time.",
    neutral: "Thank you for sharing your thoughts. Every feeling is valid, and expressing them is a healthy step."
  };
  
  return {
    mood,
    confidence,
    reply: supportiveReplies[mood as keyof typeof supportiveReplies] || supportiveReplies.neutral,
  };
}