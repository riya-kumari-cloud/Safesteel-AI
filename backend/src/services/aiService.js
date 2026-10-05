export const analyzeTextWithAI = async (text, context = 'general') => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ No AI API key found. Using fallback mock AI response.');
    return `[Mock AI Response]: Analyzed "${text}". This is a fallback because no GEMINI_API_KEY or OPENAI_API_KEY was provided in the .env file.`;
  }

  try {
    // Placeholder for actual API call
    console.log('🤖 Calling external AI service...');
    return `[Real AI Service Layer Placeholder]: Successfully processed prompt using provided API key.`;
  } catch (error) {
    console.error('AI Service Error:', error);
    return `[Error]: Failed to process AI request. Fallback activated.`;
  }
};
