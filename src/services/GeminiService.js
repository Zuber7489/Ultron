// /src/services/GeminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateContent(prompt) {
    try {
      // Use the gemini-pro model as per your Angular service logic
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('Error generating content:', error);
      return "Sorry, I couldn't understand that.";
    }
  }
}

// Create an instance of the service with your API key
const geminiService = new GeminiService('AIzaSyBfivWk1WKyZ6PCHC69X6viASCMQ14tBsw');

export default geminiService;
