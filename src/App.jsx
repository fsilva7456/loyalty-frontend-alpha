import { useGlobal, GlobalProvider } from './context/GlobalContext';
import Welcome from './components/Welcome';
import StepScreen from './components/StepScreen';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function MainContent() {
  const { companyName } = useGlobal();
  return companyName ? <StepScreen /> : <Welcome />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <GlobalProvider>
        <div className="app-container">
          <MainContent />
        </div>
      </GlobalProvider>
    </ErrorBoundary>
  );
}