import React from 'react';
import Modal from './Modal';

export default function FeedbackModal({ 
  isOpen, 
  onClose, 
  feedback, 
  onFeedbackChange,
  onSubmit 
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3>Provide Feedback</h3>
      <p>What would you like to change or improve in the generated content?</p>
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