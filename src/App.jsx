import { useState } from 'react'
import './App.css'

function App() {
  const [companyName, setCompanyName] = useState('')

  const handleStart = () => {
    console.log('Company Name:', companyName)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Loyalty Program Builder</h1>
      </header>
      <main className="app-main">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="company-input"
          />
          <button 
            onClick={handleStart}
            className="start-button"
          >
            Start
          </button>
        </div>
      </main>
    </div>
  )
}

export default App