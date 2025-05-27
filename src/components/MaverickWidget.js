import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../assets/maverickWidget.css';
import speechRecognitionService from '../services/SpeechRecognitionService';

// Configuration
const GEMINI_API_KEY = 'AIzaSyC9g4oPDCChk2KLGrhrYWZfxTl5SVqSoAk'; // Replace with env variable in production
const BACKEND_URL = 'http://localhost:5000'; // Your backend server URL

const MaverickWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm VOXA ASSIST, your AI assistant. I can answer questions. How can I help you?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('disabled');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [websiteContent, setWebsiteContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const chatRef = useRef(null);
  const synthesizer = useRef(window.speechSynthesis);
  const isProcessingVoiceRef = useRef(false);
  const processedTranscripts = useRef(new Set());
  const currentUtterance = useRef(null);

  // Enhanced HTML to text extraction
  const extractTextFromHTML = (html) => {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove script and style elements
    const scripts = doc.getElementsByTagName('script');
    const styles = doc.getElementsByTagName('style');
    
    for (let i = scripts.length - 1; i >= 0; i--) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
    
    for (let i = styles.length - 1; i >= 0; i--) {
      styles[i].parentNode.removeChild(styles[i]);
    }
    
    // Get text from important sections
    const title = doc.querySelector('title')?.textContent || '';
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    // Get all text content from body
    const bodyContent = doc.querySelector('body')?.textContent || '';
    
    // Clean up whitespace and combine content
    let content = `Title: ${title}\nDescription: ${metaDescription}\n\n`;
    content += bodyContent.replace(/\s+/g, ' ').trim();
    
    // Extract contact information specifically
    const phoneRegex = /(?:\+91\s*)?(?:\d{5}\s*\d{5}|\d{10})/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    
    const phones = content.match(phoneRegex) || [];
    const emails = content.match(emailRegex) || [];
    
    // Add extracted contact info to ensure it's available
    if (phones.length > 0) {
      content += `\n\nContact Phone Numbers: ${phones.join(', ')}`;
    }
    if (emails.length > 0) {
      content += `\nContact Emails: ${emails.join(', ')}`;
    }
    
    console.log('📞 Extracted phones:', phones);
    console.log('📧 Extracted emails:', emails);
    
    return content;
  };

  // Fetch website content from backend
  useEffect(() => {
    const fetchWebsiteContent = async () => {
      setIsLoading(true);
      try {
        console.log('🚀 Fetching website content from backend...');
        
        const response = await fetch(`${BACKEND_URL}/crawl`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: '' // Empty URL to crawl all default paths
          })
        });

        if (!response.ok) {
          throw new Error(`Backend responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📡 Backend response received:', data);

        if (data.combinedContent) {
          // Extract text from the combined HTML content
          const extractedText = extractTextFromHTML(data.combinedContent);
          setWebsiteContent(extractedText);
          console.log('✅ Website content extracted and set successfully');
          console.log('Content preview:', extractedText.substring(0, 500) + '...');
        } else if (data.crawledPages && data.crawledPages.length > 0) {
          // Fallback: combine content from individual pages
          let combinedText = '';
          data.crawledPages.forEach(page => {
            if (page.content) {
              combinedText += `\n\n=== Content from ${page.url} ===\n`;
              combinedText += extractTextFromHTML(page.content);
            } else if (page.error) {
              console.warn(`⚠️ Error crawling ${page.url}:`, page.error);
            }
          });
          
          if (combinedText.trim()) {
            setWebsiteContent(combinedText);
            console.log('✅ Website content combined from individual pages');
          } else {
            throw new Error('No content could be extracted from crawled pages');
          }
        } else {
          throw new Error('No content received from backend');
        }
        
      } catch (err) {
        console.error("❌ Failed to load website content from backend:", err);
        setWebsiteContent(
          `Failed to load website content from backend: ${err.message}. Please ensure your backend server is running at ${BACKEND_URL}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebsiteContent();
  }, []);

  // Enhanced Speak Text Function with better error handling and voice selection
  const speakResponse = useCallback((text) => {
    if (!speechEnabled || !text || !synthesizer.current) {
      console.log('Speech disabled or no text/synthesizer available');
      return;
    }

    // Stop any current speech
    if (currentUtterance.current) {
      synthesizer.current.cancel();
    }

    try {
      // Clean the text for better speech
      const cleanText = text
        .replace(/[*#_`]/g, '') // Remove markdown characters
        .replace(/\n+/g, '. ') // Replace newlines with periods
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      currentUtterance.current = utterance;

      // Speech settings
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      // Get available voices and prefer a natural English voice
      const voices = synthesizer.current.getVoices();
      
      // Priority order for voice selection
      const preferredVoices = [
        'Google UK English Female',
        'Google US English Female',
        'Microsoft Zira Desktop',
        'Microsoft Hazel Desktop',
        'Google UK English Male',
        'Google US English Male'
      ];

      let selectedVoice = null;
      
      // Try to find a preferred voice
      for (const voiceName of preferredVoices) {
        selectedVoice = voices.find(v => v.name.includes(voiceName.split(' ')[1]) && v.lang.startsWith('en'));
        if (selectedVoice) break;
      }

      // Fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('🗣️ Using voice:', selectedVoice.name);
      }

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('🗣️ Started speaking:', cleanText.substring(0, 50) + '...');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtterance.current = null;
        console.log('🔇 Finished speaking');
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        currentUtterance.current = null;
        console.error('🚫 Speech error:', event.error);
      };

      // Speak the text
      synthesizer.current.speak(utterance);
      
    } catch (error) {
      console.error('🚫 Error in speakResponse:', error);
      setIsSpeaking(false);
      currentUtterance.current = null;
    }
  }, [speechEnabled]);

  // Function to stop speech
  const stopSpeech = useCallback(() => {
    if (synthesizer.current && isSpeaking) {
      synthesizer.current.cancel();
      setIsSpeaking(false);
      currentUtterance.current = null;
      console.log('🔇 Speech stopped by user');
    }
  }, [isSpeaking]);

  // Enhanced Gemini Response with better context handling
  const getAIResponse = useCallback(async (message) => {
    try {
      // If API key is not set, return mock response
      if (GEMINI_API_KEY === 'YOUR_API_KEY') {
        console.log("Using mock response (API key not configured)");
        return `I understand you asked about "${message}" in relation to the website. As a demo, I'm providing this mock response since the API key isn't configured.`;
      }
      
      // If website content isn't loaded yet, inform the user
      if (isLoading) {
        return "I'm still loading information about the website. Please try again in a moment.";
      }
      
      // Check if content loading failed
      if (websiteContent && websiteContent.includes('Failed to load website content')) {
        return "I'm having trouble accessing the website information right now. Please make sure the backend server is running and try again.";
      }
      
      // Prepare the context with website content
      const context = websiteContent || "The website content is not available at the moment.";
      
      // Simple and direct prompt
      const prompt = `Based on this VOXA ASSIST website information: ${context}

Question: ${message}

Give a brief, direct answer based only on the website content provided. If you can't find the specific information in the content, say so clearly.`;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Gemini API error:', data);
        return "I'm having trouble accessing my knowledge base right now. Please try again in a moment.";
      }
      
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I don't have enough information to answer that question.";
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      return "I'm having trouble connecting to my knowledge base right now. Could you try again?";
    }
  }, [websiteContent, isLoading]);

  // Send message logic
  const sendMessage = useCallback(async (message) => {
    const userText = message || inputText.trim();
    if (!userText) return;

    // Stop any current speech before processing new message
    if (isSpeaking) {
      stopSpeech();
    }

    // Update UI with user message
    setMessages(prev => [...prev, { from: 'user', text: userText }]);
    setInputText('');

    // Show loading or thinking indicator
    const tempId = Date.now();
    setMessages(prev => [...prev, { from: 'bot', text: "Thinking...", id: tempId, loading: true }]);

    // Get AI response
    const response = await getAIResponse(userText);
    
    // Replace loading message with actual response
    setMessages(prev => 
      prev.map(msg => 
        msg.id === tempId 
          ? { from: 'bot', text: response, id: tempId }
          : msg
      )
    );

    // Speak the response after a short delay to ensure UI is updated
    setTimeout(() => {
      speakResponse(response);
    }, 100);

    // Scroll to bottom
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 200);
    
    return response;
  }, [inputText, getAIResponse, speakResponse, isSpeaking, stopSpeech]);

  // Reset voice processing state
  const resetVoiceProcessing = useCallback(() => {
    isProcessingVoiceRef.current = false;
    console.log("Voice processing reset, ready for next command");
  }, []);

  // Process voice command
  const processVoiceCommand = useCallback(async (transcript) => {
    // Prevent processing if already handling a command
    if (isProcessingVoiceRef.current) {
      console.log("Already processing a voice command, skipping:", transcript);
      return;
    }

    const trimmedTranscript = transcript.trim();
    
    // Skip if empty
    if (!trimmedTranscript) return;
    
    // Skip if already processed this exact transcript
    if (processedTranscripts.current.has(trimmedTranscript)) {
      console.log("Skipping already processed transcript:", trimmedTranscript);
      return;
    }
    
    // Enhanced check for chat commands - made more inclusive
    const talkingToMaverick = 
      trimmedTranscript.toLowerCase().includes('voxa') || 
      trimmedTranscript.toLowerCase().includes('assist') || 
      trimmedTranscript.toLowerCase().includes('phone') ||
      trimmedTranscript.toLowerCase().includes('contact') ||
      trimmedTranscript.toLowerCase().includes('email') ||
      trimmedTranscript.toLowerCase().includes('number') ||
      trimmedTranscript.toLowerCase().includes('service') ||
      trimmedTranscript.toLowerCase().includes('website') ||
      trimmedTranscript.toLowerCase().startsWith('what') || 
      trimmedTranscript.toLowerCase().startsWith('how') || 
      trimmedTranscript.toLowerCase().startsWith('why') || 
      trimmedTranscript.toLowerCase().startsWith('which') || 
      trimmedTranscript.toLowerCase().startsWith('can you') || 
      trimmedTranscript.toLowerCase().startsWith('could you') ||
      trimmedTranscript.toLowerCase().startsWith('who') ||
      trimmedTranscript.toLowerCase().startsWith('when') ||
      trimmedTranscript.toLowerCase().startsWith('where') ||
      trimmedTranscript.toLowerCase().startsWith('is') ||
      trimmedTranscript.toLowerCase().startsWith('who') ||
      trimmedTranscript.toLowerCase().startsWith('hi') ||
      trimmedTranscript.toLowerCase().startsWith('hello') ||
      trimmedTranscript.toLowerCase().startsWith('please') ||
      trimmedTranscript.toLowerCase().startsWith('show') ||
      trimmedTranscript.toLowerCase().startsWith('give') ||
      trimmedTranscript.toLowerCase().startsWith('tell me');
    
    if (talkingToMaverick) {
      console.log("VOXA ASSIST Widget processing voice input:", trimmedTranscript);
      isProcessingVoiceRef.current = true;
      processedTranscripts.current.add(trimmedTranscript);
      
      // Open the widget if it's not open
      if (!isOpen) {
        setIsOpen(true);
      }
      
      try {
        await sendMessage(trimmedTranscript);
      } catch (error) {
        console.error("Error processing voice command:", error);
      } finally {
        // Add a delay before accepting new commands
        setTimeout(resetVoiceProcessing, 500);
      }
    } else {
      console.log("Not a VOXA ASSIST command, ignoring:", trimmedTranscript);
    }
  }, [isOpen, sendMessage, resetVoiceProcessing]);

  // Handle voice input results
  useEffect(() => {
    // Create stable callback functions for voice recognition
    const handleVoiceResult = (transcript, isFinal) => {
      // Skip if not final
      if (!isFinal) return;
      
      console.log("VOXA ASSIST attempting to process voice input:", transcript);
      processVoiceCommand(transcript);
    };
    
    const handleVoiceStatus = (status) => {
      setVoiceStatus(status === 'listening' ? 'listening' : 'disabled');
    };
    
    // Clear the processed transcripts set when speech recognition restarts
    const handleSpeechStart = () => {
      handleVoiceStatus('listening');
      processedTranscripts.current.clear();
      console.log("Speech recognition started, cleared transcript history");
    };
    
    // Subscribe to speech recognition results
    speechRecognitionService.subscribe('onResult', handleVoiceResult);
    speechRecognitionService.subscribe('onStart', handleSpeechStart);
    speechRecognitionService.subscribe('onEnd', () => handleVoiceStatus('disabled'));
    speechRecognitionService.subscribe('onError', () => handleVoiceStatus('error'));

    // Clean up on unmount
    return () => {
      speechRecognitionService.unsubscribe('onResult', handleVoiceResult);
      speechRecognitionService.unsubscribe('onStart', handleSpeechStart);
      speechRecognitionService.unsubscribe('onEnd', () => {});
      speechRecognitionService.unsubscribe('onError', () => {});
    };
  }, [processVoiceCommand]);

  // Auto-scroll when new messages are added
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize voices when component mounts
  useEffect(() => {
    // Load voices if not already loaded
    if (synthesizer.current && synthesizer.current.getVoices().length === 0) {
      synthesizer.current.addEventListener('voiceschanged', () => {
        console.log('🗣️ Voices loaded:', synthesizer.current.getVoices().length);
      });
    }
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (synthesizer.current && currentUtterance.current) {
        synthesizer.current.cancel();
      }
    };
  }, []);

  return (
    <div className={`maverick-widget ${isDarkMode ? 'dark' : ''}`}>
      <button className="maverick-toggle" onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-robot" />
      </button>

      {isOpen && (
        <div className="maverick-chatbox">
          <div className="chat-header">
            <span>VOXA ASSIST</span>
            <div>
              <button 
                onClick={() => setSpeechEnabled(!speechEnabled)} 
                className={`speech-toggle-btn ${speechEnabled ? 'enabled' : 'disabled'}`}
                title={speechEnabled ? 'Disable Speech' : 'Enable Speech'}
              >
                <i className={`fas ${speechEnabled ? 'fa-volume-up' : 'fa-volume-mute'}`} />
              </button>
              {isSpeaking && (
                <button 
                  onClick={stopSpeech} 
                  className="stop-speech-btn"
                  title="Stop Speaking"
                >
                  <i className="fas fa-stop" />
                </button>
              )}
            
              <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
            </div>
          </div>

          <div className="chat-messages" ref={chatRef}>
            {isLoading && (
              <div className="system-message">
                <i className="fas fa-spinner fa-spin"></i> Loading website content from backend...
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div key={msg.id || index} className={`message ${msg.from === 'user' ? 'user-message' : 'bot-message'} ${msg.loading ? 'loading' : ''}`}>
                {msg.text}
                {msg.from === 'bot' && !msg.loading && speechEnabled && (
                  <button 
                    onClick={() => speakResponse(msg.text)} 
                    className="speak-btn"
                    title="Speak this message"
                  >
                    <i className="fas fa-volume-up" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask about VOXA ASSIST services..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
            />
            <button onClick={() => sendMessage()} disabled={isLoading}>
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Send'}
            </button>
          </div>

          <div className={`voice-status ${voiceStatus}`}>
            <i className={`fas ${voiceStatus === 'listening' ? 'fa-microphone-alt' : 'fa-microphone'}`}></i>
            {voiceStatus === 'listening' ? "Listening..." : "Voice Ready"} 
            {isSpeaking && <span className="speaking-indicator"> | Speaking...</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaverickWidget;