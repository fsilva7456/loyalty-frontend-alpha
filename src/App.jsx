import { useGlobal, GlobalProvider } from './context/GlobalContext';
import Welcome from './components/Welcome';
import './App.css';

function App() {
  const { companyName } = useGlobal();

  return (
    <GlobalProvider>
      <div className="app-container">
        <Welcome />
      </div>
    </GlobalProvider>
  );
}

export default App;