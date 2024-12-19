import { useGlobal, STEPS } from '../context/GlobalContext';
import ProgressBar from './ProgressBar';

export default function StepScreen() {
  const { currentStep, nextStep, previousStep, companyName, resetProgress } = useGlobal();
  const currentStepData = STEPS[currentStep - 1];

  const handleBack = () => {
    if (currentStep === 1) {
      // If on first step, go back to company input
      resetProgress();
    } else {
      previousStep();
    }
  };

  return (
    <div className="step-screen">
      <div className="top-bar">
        <div className="step-header">
          <div className="company-name">{companyName}</div>
          <div className="step-info">
            Step {currentStep} of {STEPS.length}: {currentStepData.title}
          </div>
        </div>
        <ProgressBar />
      </div>
      <div className="step-content">
        {/* Placeholder for step content */}
        <p>Content for {currentStepData.title} will go here</p>
      </div>
      <div className="navigation-bar">
        <button 
          onClick={handleBack}
          className="nav-button"
        >
          {currentStep === 1 ? 'Change Company' : 'Previous'}
        </button>
        <button 
          onClick={nextStep}
          disabled={currentStep === STEPS.length}
          className="nav-button primary"
        >
          {currentStep === STEPS.length ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}