import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-kit';
import axios from 'axios';
import WaveAnimation from './WaveAnimation';
import styled from 'styled-components';
import { GoogleGenerativeAI } from '@google/generative-ai';
const AssistantContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
  text-align: center;
`;

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [inputText, setInputText] = useState('');

  const { listen, stop, supported } = useSpeechRecognition({
    onResult: (result) => handleVoiceCommand(result.toLowerCase()),
    continuous: true,
    interimResults: false,
  });

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceCommand = async (command) => {
    if (!command) return;

    console.log("Command received:", command);

    if (command.includes("ultron")) {
      if (!isSpeaking) {
        setIsListening(true);
        setIsSpeaking(true);
        speak("How can I assist you?");
        return;
      }
    }

    if (isListening || inputText) {
      setIsSpeaking(true);
      console.log("Processing command...");
      const actionResponse = handleSpecificCommands(command);
      if (actionResponse) {
        setResponseText(actionResponse);
        speak(actionResponse);
      } else {
        const geminiResponse = await fetchGeminiResponse(command);
        setResponseText(geminiResponse);
        speak(geminiResponse);
      }
      setIsSpeaking(false);
      setIsListening(false); // Stop listening after processing
    }
  };

  const handleSpecificCommands = (command) => {
    if (command.includes("open youtube")) {
      window.open("https://www.youtube.com", "_blank");
      return "Opening YouTube.";
    } else if (command.includes("open vscode")) {
      return "Visual Studio Code cannot be opened directly from the browser.";
    } else if (command.includes("open calculator")) {
      return "Opening Calculator on your system.";
    } else if (command.includes("play chamka chalo")) {
      window.open("https://www.youtube.com/results?search_query=chamka+chalo", "_blank");
      return "Playing 'Chamka Chalo' on YouTube.";
    }
    return null;
  };

  const fetchGeminiResponse = async (query) => {
    try {
      const apiKey = 'AIzaSyBfivWk1WKyZ6PCHC69X6viASCMQ14tBsw'; // Ensure your API key is set in the .env file
      const genAI = new GoogleGenerativeAI(apiKey); // Initialize the GoogleGenerativeAI instance

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([query]); // Use query as an array
      
      console.log("Gemini response:", result.response.text());
      return result.response.text(); // Return the response text
    } catch (error) {
      console.error('Error generating content:', error);
      return "Sorry, I couldn't understand that.";
    }
  };

  const handleManualInput = (event) => {
    if (event.key === 'Enter') {
      handleVoiceCommand(inputText.toLowerCase());
      setInputText(''); // Clear input after command is processed
    }
  };

  useEffect(() => {
    if (!supported) {
      alert("Speech recognition is not supported in this browser. Please try using Chrome.");
      return;
    }
    listen();
    return () => stop();
  }, [listen, stop, supported]);

  return (
    <AssistantContainer>
      <h1>Ultron Voice Assistant</h1>
      {!supported && (
        <p>Speech recognition is not supported in this browser. Please use Chrome or Edge on desktop.</p>
      )}
      <WaveAnimation isActive={isListening || isSpeaking} />
      <p>{responseText}</p>
      <input
        type="text"
        placeholder="Type command here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleManualInput}
      />
    </AssistantContainer>
  );
};

export default VoiceAssistant;
