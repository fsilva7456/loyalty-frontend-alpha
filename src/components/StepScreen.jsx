import { useGlobal, STEPS } from '../context/GlobalContext';

export default function StepScreen() {
  const { currentStep, nextStep, companyName } = useGlobal();
  const currentStepData = STEPS[currentStep - 1];

  return (
    <div className="step-screen">
      <div className="top-bar">
        <div className="step-info">
          Step {currentStep} of {STEPS.length}: {currentStepData.title}
        </div>
        <div className="company-name">{companyName}</div>
      </div>
      <div className="step-content">
        {/* Placeholder for step content */}
        <p>Content for {currentStepData.title} will go here</p>
      </div>
      <div className="navigation-bar">
        <button 
          onClick={nextStep}
          disabled={currentStep === STEPS.length}
          className="next-button"
        >
          {currentStep === STEPS.length ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}