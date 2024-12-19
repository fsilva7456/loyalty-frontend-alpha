import { useGlobal } from '../context/GlobalContext';

export function useStepValidation() {
  const { stepData } = useGlobal();

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1: // Competitor Analysis
        return true; // First step is always valid
      
      case 2: // Customer Analysis
        return Boolean(stepData?.competitor?.analysis);
      
      case 3: // Loyalty & CRM Objectives
        return Boolean(stepData?.competitor?.analysis && 
                      stepData?.customer?.analysis);
      
      case 4: // Loyalty Program Design
        return Boolean(stepData?.customer?.analysis && 
                      stepData?.loyalty_crm?.analysis);
      
      case 5: // Financial Model
        return Boolean(stepData?.program_design?.design);
      
      case 6: // Roadmap
        return Boolean(stepData?.program_design?.design && 
                      stepData?.financial?.model);
      
      case 7: // Business Case
        return Boolean(stepData?.roadmap?.analysis);
      
      default:
        return false;
    }
  };

  const getValidationMessage = (stepNumber) => {
    if (validateStep(stepNumber)) return '';
    
    return 'Please complete all previous steps first';
  };

  return {
    validateStep,
    getValidationMessage
  };
}