import React from 'react';
import Modal from './Modal';
import Tooltip from './Tooltip';

const FEEDBACK_TIPS = [
  'Be specific about what you want to change',
  'Mention any missing information',
  'Point out any inaccuracies',
  'Suggest additional areas to cover'
];

export default function FeedbackModal({ 
  isOpen, 
  onClose, 
  feedback, 
  onFeedbackChange,
  onSubmit 
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-header">
        <h3>Provide Feedback</h3>
        <Tooltip
          content={
            <div className="feedback-tips">
              <p>Tips for effective feedback:</p>
              <ul>
                {FEEDBACK_TIPS.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          }
        >
          <button className="help-button">?</button>
        </Tooltip>
      </div>

      <textarea
        className="feedback-textarea"
        value={feedback}
        onChange={onFeedbackChange}
        placeholder="Enter your feedback here..."
      />

      <div className="button-container">
        <button className="secondary-button" onClick={onClose}>
          Cancel
        </button>
        <button 
          className="primary-button" 
          onClick={onSubmit}
          disabled={!feedback.trim()}
        >
          Submit Feedback
        </button>
      </div>
    </Modal>
  );
}