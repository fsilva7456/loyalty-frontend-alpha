import { GlobalProvider, useGlobal } from './context/GlobalContext';
import Welcome from './components/Welcome';
import StepScreen from './components/StepScreen';
import './App.css';

function MainContent() {
  const { companyName } = useGlobal();
  return companyName ? <StepScreen /> : <Welcome />;
}

export default function App() {
  return (
    <GlobalProvider>
      <div className="app-container">
        <MainContent />
      </div>
    </GlobalProvider>
  );
}