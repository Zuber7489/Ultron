// /src/components/VoiceAssistant.js
import React, { useState, useEffect } from 'react';
import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';
import axios from 'axios';
import WaveAnimation from './WaveAnimation';
import styled from 'styled-components';

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

  const { listen, stop, supported } = useSpeechRecognition({
    onResult: (result) => handleVoiceCommand(result),
    continuous: true,
    interimResults: false,
  });

  const { speak } = useSpeechSynthesis();

  const handleVoiceCommand = async (result) => {
    const command = result.toLowerCase();

    if (command.includes("ultron")) {
      setIsListening(true);
      speak({ text: "How can I assist you?" });
      return;
    }

    if (isListening) {
      setIsSpeaking(true);
      // Check for specific commands
      const actionResponse = handleSpecificCommands(command);
      if (actionResponse) {
        setResponseText(actionResponse);
        speak({ text: actionResponse });
      } else {
        // Use Gemini for other queries
        const geminiResponse = await fetchGeminiResponse(command);
        setResponseText(geminiResponse);
        speak({ text: geminiResponse });
      }
      setIsSpeaking(false);
    }
  };

  const handleSpecificCommands = (command) => {
    if (command.includes("open youtube")) {
      window.open("https://www.youtube.com", "_blank");
      return "Opening YouTube.";
    } else if (command.includes("open vscode")) {
      window.open("vscode://", "_blank");
      return "Opening Visual Studio Code.";
    } else if (command.includes("open calculator")) {
      window.open("calculator://", "_blank");
      return "Opening Calculator.";
    } else if (command.includes("play chamka chalo")) {
      window.open("https://www.youtube.com/results?search_query=chamka+chalo", "_blank");
      return "Playing 'Chamka Chalo' on YouTube.";
    } 
    // Add other commands as previously defined...
    
    return null;
  };

  const fetchGeminiResponse = async (query) => {
    try {
      const apiKey = "AIzaSyBfivWk1WKyZ6PCHC69X6viASCMQ14tBsw"; // Replace with your actual Gemini API key
      const response = await axios.post(
        'https://generativeai.googleapis.com/v1/models/gemini-pro:generateText',
        {
          prompt: query,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data?.text || "I couldn't find an answer to that.";
    } catch (error) {
      console.error('Error generating content:', error);
      return "Sorry, I couldn't understand that.";
    }
  };

  useEffect(() => {
    if (!supported) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    listen(); // Start listening automatically
    return () => stop(); // Clean up on unmount
  }, [listen, stop, supported]);

  return (
    <AssistantContainer>
      <h1>Ultron Voice Assistant</h1>
      <WaveAnimation isActive={isListening || isSpeaking} />
      <p>{responseText}</p>
    </AssistantContainer>
  );
};

export default VoiceAssistant;
