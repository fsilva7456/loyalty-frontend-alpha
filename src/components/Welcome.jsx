import { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';

export default function Welcome() {
  const [inputCompanyName, setInputCompanyName] = useState('');
  const { startAnalysis } = useGlobal();

  const handleStart = () => {
    if (inputCompanyName.trim()) {
      startAnalysis(inputCompanyName.trim());
    }
  };

  return (
    <div className="welcome-container">
      <h1>Loyalty Program Builder</h1>
      <div className="input-group">
        <input
          type="text"
          value={inputCompanyName}
          onChange={(e) => setInputCompanyName(e.target.value)}
          placeholder="Enter company name"
          className="company-input"
        />
        <button 
          onClick={handleStart}
          className="start-button"
          disabled={!inputCompanyName.trim()}
        >
          Start
        </button>
      </div>
    </div>
  );
}