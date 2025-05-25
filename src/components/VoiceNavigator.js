import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import speechRecognitionService from '../services/SpeechRecognitionService';

const VoiceNavigator = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('idle');

  // Handle navigation commands
  const handleResult = useCallback((transcript, isFinal) => {
    if (!isFinal) return;
    
    console.log("Voice Navigator heard:", transcript);
    
    // Simple navigation commands
    if (transcript.includes('home')) {
      navigate('/');
    } else if (transcript.includes('about')) {
      navigate('/about');
    } else if (transcript.includes('contact')) {
      navigate('/contact');
    }
  }, [navigate]);

  useEffect(() => {
    // Register event handlers
    speechRecognitionService.subscribe('onStart', () => {
      setIsListening(true);
      setStatus('listening');
      console.log("Voice Navigation started");
    });
    
    speechRecognitionService.subscribe('onEnd', () => {
      setIsListening(false);
      setStatus('idle');
      console.log("Voice Navigation ended");
    });
    
    speechRecognitionService.subscribe('onError', (error) => {
      setIsListening(false);
      setStatus(error.error || 'error');
      console.log("Voice Navigation error:", error);
    });
    
    // Register result handler
    const resultHandler = (transcript, isFinal) => handleResult(transcript, isFinal);
    speechRecognitionService.subscribe('onResult', resultHandler);
    
    // Start the service if it's not already running
    speechRecognitionService.start();
    
    // Cleanup function
    return () => {
      speechRecognitionService.unsubscribe('onStart', () => {});
      speechRecognitionService.unsubscribe('onEnd', () => {});
      speechRecognitionService.unsubscribe('onError', () => {});
      speechRecognitionService.unsubscribe('onResult', resultHandler);
    };
  }, [handleResult]);

  // Pass the listening state up to parent components
  useEffect(() => {
    const event = new CustomEvent('voiceStatusChange', { 
      detail: { isListening, status } 
    });
    document.dispatchEvent(event);
  }, [isListening, status]);

  return null; // No UI needed
};

export default VoiceNavigator;