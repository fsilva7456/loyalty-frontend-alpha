import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext(undefined);

export const STEPS = [
  { id: 1, title: 'Competitor Analysis' },
  { id: 2, title: 'Customer Analysis' },
  { id: 3, title: 'Program Design' },
  { id: 4, title: 'Financial Model' },
  { id: 5, title: 'Implementation Roadmap' },
  { id: 6, title: 'Business Case' },
  { id: 7, title: 'Executive Summary' },
];

export function GlobalProvider({ children }) {
  const [companyName, setCompanyName] = useState('');
  const [currentStep, setCurrentStep] = useState(0); // 0 means not started
  const [stepData, setStepData] = useState({});

  const startAnalysis = (name) => {
    setCompanyName(name);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const updateStepData = (stepId, data) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: data
    }));
  };

  return (
    <GlobalContext.Provider value={{
      companyName,
      currentStep,
      stepData,
      startAnalysis,
      nextStep,
      updateStepData
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
}