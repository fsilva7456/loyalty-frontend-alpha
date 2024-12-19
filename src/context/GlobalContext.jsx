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
    console.log('Starting analysis for:', name);
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
    if (window.confirm('Are you sure you want to start over? All progress will be lost.')) {
      setCompanyName('');
      setCurrentStep(0);
      setStepData({});
    }
  };

  const updateStepData = (stepKey, data) => {
    console.log('Updating step data:', stepKey, data);
    setStepData(prev => ({
      ...prev,
      [stepKey]: {
        ...data,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  const value = {
    companyName,
    currentStep,
    stepData,
    startAnalysis,
    nextStep,
    previousStep,
    resetProgress,
    updateStepData
  };

  return (
    <GlobalContext.Provider value={value}>
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