import React from 'react';
import styled from 'styled-components';

const ChatBox = styled.div`
  width: 90%;
  max-width: 600px;
  background: #222;
  padding: 10px;
  border-radius: 8px;
  margin-top: 20px;
  color: #ffffff;
  overflow-y: auto;
  max-height: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const ChatInterface = ({ conversation }) => (
  <ChatBox>
    {conversation.map((msg, index) => (
      <p key={index}>{msg}</p>
    ))}
  </ChatBox>
);

export default ChatInterface;
