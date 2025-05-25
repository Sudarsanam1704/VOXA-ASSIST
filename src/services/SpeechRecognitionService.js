// src/services/SpeechRecognitionService.js

class SpeechRecognitionService {
    constructor() {
      this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = null;
      this.isListening = false;
      this.isInitialized = false;
      this.callbacks = {
        onResult: [],
        onStart: [],
        onEnd: [],
        onError: []
      };
      
      // Prevent multiple initializations in React strict mode
      this.initializeCount = 0;
    }
    
    initialize() {
      // If already initialized, don't reinitialize
      if (this.isInitialized) return true;
      
      if (!this.SpeechRecognition) {
        console.error("Speech Recognition not supported in this browser");
        return false;
      }
      
      try {
        this.recognition = new this.SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        
        // Set up listeners
        this.recognition.onstart = () => {
          console.log("Speech recognition service started");
          this.isListening = true;
          this.callbacks.onStart.forEach(callback => callback());
        };
        
        this.recognition.onend = () => {
          console.log("Speech recognition service ended");
          this.isListening = false;
          this.callbacks.onEnd.forEach(callback => callback());
          
          // Auto restart if it stopped unexpectedly
          if (this.shouldRestart) {
            this.shouldRestart = false;
            setTimeout(() => {
              if (!this.isListening) {
                try {
                  this.recognition.start();
                } catch (err) {
                  console.warn("Failed to restart recognition:", err);
                }
              }
            }, 300);
          }
        };
        
        this.recognition.onerror = (event) => {
          console.log("Speech recognition error:", event.error);
          this.callbacks.onError.forEach(callback => callback(event));
          
          if (event.error === 'aborted') {
            // Don't restart on aborted error
            this.shouldRestart = false;
          }
        };
        
        this.recognition.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
          const isFinal = event.results[event.results.length - 1].isFinal;
          
          if (isFinal) {
            console.log("Speech recognition heard:", transcript);
          }
          
          this.callbacks.onResult.forEach(callback => callback(transcript, isFinal, event));
        };
        
        this.isInitialized = true;
        return true;
      } catch (error) {
        console.error("Failed to initialize speech recognition:", error);
        return false;
      }
    }
    
    start() {
      // Initialize if not already done
      if (!this.isInitialized) {
        if (!this.initialize()) return false;
      }
      
      // Only start if not already listening
      if (!this.isListening) {
        try {
          this.recognition.start();
          this.shouldRestart = true;
          return true;
        } catch (error) {
          console.error("Failed to start speech recognition", error);
          // If we get an error that it's already started, update our state
          if (error.name === 'InvalidStateError') {
            this.isListening = true;
          }
          return false;
        }
      }
      return true; // Already listening is considered a success
    }
    
    stop() {
      if (this.recognition && this.isListening) {
        this.shouldRestart = false;
        try {
          this.recognition.stop();
          return true;
        } catch (error) {
          console.error("Failed to stop speech recognition", error);
          // If we get an error that it's not running, update our state
          if (error.name === 'InvalidStateError') {
            this.isListening = false;
          }
          return false;
        }
      }
      return true; // Already stopped is considered a success
    }
    
    subscribe(eventType, callback) {
      if (this.callbacks[eventType]) {
        // Check if the callback is already registered to prevent duplicates
        const exists = this.callbacks[eventType].some(cb => cb === callback);
        if (!exists) {
          this.callbacks[eventType].push(callback);
        }
        
        // Initialize and start if this is the first subscription
        if (!this.isInitialized) {
          this.initialize();
        }
        if (!this.isListening && this.isInitialized) {
          this.start();
        }
        return true;
      }
      return false;
    }
    
    unsubscribe(eventType, callbackToRemove) {
      if (this.callbacks[eventType]) {
        this.callbacks[eventType] = this.callbacks[eventType].filter(callback => callback !== callbackToRemove);
        return true;
      }
      return false;
    }
    
    // Utility method to check if there are any active subscribers
    hasSubscribers() {
      return Object.values(this.callbacks).some(callbackList => callbackList.length > 0);
    }
  }
  
  // Create a singleton instance
  const speechRecognitionService = new SpeechRecognitionService();
  export default speechRecognitionService;