import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import Welcome from './components/Welcome';
import StepScreen from './components/StepScreen';
import './App.css';

function MainContent() {
  const { companyName } = useGlobal();
  return companyName ? <StepScreen /> : <Welcome />;
}

export default function App() {
  return (
    <Router>
      <GlobalProvider>
        <div className="app-container">
          <MainContent />
        </div>
      </GlobalProvider>
    </Router>
  );
}