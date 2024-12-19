import { useGlobal, STEPS } from '../context/GlobalContext';

export default function ProgressBar() {
  const { currentStep } = useGlobal();
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-steps">
        {STEPS.map((step) => (
          <div 
            key={step.id}
            className={`progress-step ${currentStep >= step.id ? 'completed' : ''}`}
          >
            {step.id}
          </div>
        ))}
      </div>
    </div>
  );
}