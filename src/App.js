import logo from './logo.svg';
import './App.css';
import GlobalStyles from './styles/GlobalStyles';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  return (
    <div className="ultron-container">
      <GlobalStyles />
      <VoiceAssistant />
    </div>
  );
}

export default App;
