// Default AI Prompt
const DEFAULT_ANALYSIS_PROMPT = `You are an AI content analyzer. Analyze the following article and respond with 'true' if it's about artificial intelligence, machine learning, or related technologies, and 'false' otherwise. Only respond with true or false. ### Title: {{title}} --- Content: {{description}} ### Only respond with true or false, it's very important.`;

// OLLAMA Configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';

export const config = {
  defaultAnalysisPrompt: DEFAULT_ANALYSIS_PROMPT,
  ollama: {
    baseUrl: OLLAMA_BASE_URL,
  },
};
