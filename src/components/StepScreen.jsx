import { useGlobal, STEPS } from '../context/GlobalContext';
import ProgressBar from './ProgressBar';
import CompetitorAnalysisStep from './steps/CompetitorAnalysisStep';
import CustomerAnalysisStep from './steps/CustomerAnalysisStep';

export default function StepScreen() {
  const { currentStep, nextStep, previousStep, companyName, resetProgress } = useGlobal();
  const currentStepData = STEPS[currentStep - 1];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CompetitorAnalysisStep />;
      case 2:
        return <CustomerAnalysisStep />;
      default:
        return (
          <div className="step-placeholder">
            <p>Content for {currentStepData.title} will go here</p>
          </div>
        );
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
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
        {renderStepContent()}
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