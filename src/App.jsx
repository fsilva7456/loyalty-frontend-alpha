import { GlobalProvider } from './context/GlobalContext';
import MainContent from './components/MainContent';
import './App.css';

export default function App() {
  return (
    <GlobalProvider>
      <div className="app-container">
        <MainContent />
      </div>
    </GlobalProvider>
  );
}