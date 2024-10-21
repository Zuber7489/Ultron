import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #1a1a1d;
    color: #ffffff;
    font-family: 'Roboto', sans-serif;
    overflow: hidden;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #1f1c2c, #928dab);
  }

  .ultron-container {
    width: 80%;
    max-width: 1200px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    background: rgba(30, 30, 34, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .wave-animation {
    margin-top: 20px;
  }
`;

export default GlobalStyles;
