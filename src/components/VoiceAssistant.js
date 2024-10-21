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
  const [isActivated, setIsActivated] = useState(false); // New state to track activation

  const { listen, stop, supported } = useSpeechRecognition({
    onResult: (result) => handleVoiceCommand(result),
    continuous: true,
    interimResults: false,
  });

  const { speak } = useSpeechSynthesis();

  const handleVoiceCommand = async (result) => {
    const command = result.toLowerCase();
    console.log(`Recognized command: ${command}`);

    // Activate on "Ultron"
    if (command.includes("ultron") && !isActivated) {
      setIsListening(true);
      setIsActivated(true); // Mark as activated to prevent multiple triggers
      speak({ text: "How can I assist you?" });
      console.log("Ultron activated.");
      return;
    }

    // Listen to further commands
    if (isListening) {
      console.log("Listening for further commands...");
      setIsSpeaking(true);

      // Check for specific commands
      const actionResponse = handleSpecificCommands(command);
      if (actionResponse) {
        setResponseText(actionResponse);
        console.log(`Action taken: ${actionResponse}`);
        speak({ text: actionResponse });
      } else {
        // Use Gemini for other queries
        const geminiResponse = await fetchGeminiResponse(command);
        setResponseText(geminiResponse);
        console.log(`Gemini response: ${geminiResponse}`);
        speak({ text: geminiResponse });
      }

      setIsSpeaking(false);
      setIsListening(false);
      setIsActivated(false); // Reset activation after processing command
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
    // Add more commands as needed...

    return null;
  };

  const fetchGeminiResponse = async (query) => {
    try {
      const apiKey = "AIzaSyBfivWk1WKyZ6PCHC69X6viASCMQ14tBsw"; // Replace with your actual Gemini API key
      console.log(`Fetching Gemini response for: ${query}`);

      const response = await axios.post(
        'https://generativeai.googleapis.com/v1/models/gemini-pro:generateText',
        { prompt: query },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const geminiResponse = response.data?.text || "I couldn't find an answer to that.";
      console.log(`Received Gemini response: ${geminiResponse}`);
      return geminiResponse;
    } catch (error) {
      console.error('Error generating content:', error);
      return "Sorry, I couldn't understand that.";
    }
  };

  useEffect(() => {
    if (!supported) {
      console.warn("Speech recognition is not supported in this browser.");
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    listen(); // Start listening automatically on mount
    return () => stop(); // Clean up on unmount
  }, [listen, stop, supported]);

  return (
    <AssistantContainer>
      <h1>Ultron Voice Assistant</h1>
      <WaveAnimation isActive={isListening || isSpeaking} />
      <p>{responseText}</p>
      <button onClick={() => { setIsListening(!isListening); isListening ? stop() : listen(); }}>
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>
      {isSpeaking && <p>Speaking...</p>}
    </AssistantContainer>
  );
};

export default VoiceAssistant;
