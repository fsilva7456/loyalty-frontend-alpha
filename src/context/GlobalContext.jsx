import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext(undefined);

export const STEPS = [
  { id: 1, title: 'Competitor Analysis', key: 'competitor' },
  { id: 2, title: 'Customer Analysis', key: 'customer' },
  { id: 3, title: 'Loyalty & CRM Objectives', key: 'objectives' },
  { id: 4, title: 'Loyalty Program Design', key: 'design' },
  { id: 5, title: 'Financial Model', key: 'financial' },
  { id: 6, title: 'Roadmap', key: 'roadmap' },
  { id: 7, title: 'Business Case', key: 'business' },
];

export function GlobalProvider({ children }) {
  const [companyName, setCompanyName] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
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

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetProgress = () => {
    setCompanyName('');
    setCurrentStep(0);
    setStepData({});
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
      previousStep,
      resetProgress,
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