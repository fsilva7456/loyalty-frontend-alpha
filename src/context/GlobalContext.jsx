import { createContext, useContext, useState } from 'react';
import { StepKeys } from './types';

const GlobalContext = createContext(undefined);

export const STEPS = [
  { id: 1, title: 'Competitor Analysis', key: StepKeys.COMPETITOR },
  { id: 2, title: 'Customer Analysis', key: StepKeys.CUSTOMER },
  { id: 3, title: 'Loyalty & CRM Objectives', key: StepKeys.LOYALTY_CRM },
  { id: 4, title: 'Loyalty Program Design', key: StepKeys.PROGRAM_DESIGN },
  { id: 5, title: 'Financial Model', key: StepKeys.FINANCIAL },
  { id: 6, title: 'Roadmap', key: StepKeys.ROADMAP },
  { id: 7, title: 'Business Case', key: StepKeys.BUSINESS_CASE },
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
    if (window.confirm('Are you sure you want to start over? All progress will be lost.')) {
      setCompanyName('');
      setCurrentStep(0);
      setStepData({});
    }
  };

  const updateStepData = (stepKey, data) => {
    setStepData(prev => ({
      ...prev,
      [stepKey]: {
        ...data,
        lastUpdated: new Date().toISOString()
      }
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