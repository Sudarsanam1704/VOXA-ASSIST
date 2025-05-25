import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../assets/maverickWidget.css';
import speechRecognitionService from '../services/SpeechRecognitionService';

// Configuration
const GEMINI_API_KEY = 'AIzaSyC9g4oPDCChk2KLGrhrYWZfxTl5SVqSoAk'; // Replace with env variable in production
const WEBSITE_URL = 'https://maverickedits.vercel.app/'; // The website to crawl

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

  const chatRef = useRef(null);
  const synthesizer = useRef(window.speechSynthesis);
  const isProcessingVoiceRef = useRef(false);
  const processedTranscripts = useRef(new Set());

  // Fetch website content on component mount
  useEffect(() => {
  const fetchWebsiteContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://cors-anywhere.herokuapp.com/${WEBSITE_URL}`, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const html = await res.text();
      const text = extractTextFromHTML(html);
      setWebsiteContent(text);
    } catch (err) {
      console.error("Failed to load website content:", err);
      setWebsiteContent(
        "Failed to load website content. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };
  fetchWebsiteContent();
}, []);

  // Basic HTML to text extraction
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
    
    // Get text from important sections (customize as needed)
    const title = doc.querySelector('title')?.textContent || '';
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const mainContent = doc.querySelector('main')?.textContent || '';
    const bodyContent = doc.querySelector('body')?.textContent || '';
    
    // Combine and clean the content
    let content = `Title: ${title}\nDescription: ${metaDescription}\n\n`;
    content += mainContent || bodyContent;
    
    // Clean up whitespace and return
    return content.replace(/\s+/g, ' ').trim();
  };

  // Speak Text Function
  const speakResponse = useCallback((text) => {
    if (!synthesizer.current || !text) return;

    const voices = synthesizer.current.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    // Prefer a Google voice if available
    const preferred = voices.find(v => v.name.includes('Google'));
    if (preferred) utterance.voice = preferred;

    synthesizer.current.speak(utterance);
  }, []);

  // Fetch Gemini Response
  const getAIResponse = useCallback(async (message) => {
    try {
      // If API key is not set, return mock response
      if (GEMINI_API_KEY === 'YOUR_API_KEY') {
        console.log("Using mock response (API key not configured)");
        return `I understand you asked about "${message}" in relation to the website i gave. As a demo, I'm providing this mock response since the API key isn't configured.`;
      }
      
      // If website content isn't loaded yet, inform the user
      if (isLoading) {
        return "I'm still loading information about the website. Please try again in a moment.";
      }
      
      // Prepare the context with website content
      const context = websiteContent || "The website i provided is a domain used for illustrative examples in documents.";
      
      // Form the prompt with context and instruction to only answer based on the website
      const prompt = `
        I want you to act as an AI assistant that only answers questions about the website i provided.
        
        Here is the content from the website:
        "${context}"
        
        Based ONLY on the above content, answer the following question:
        "${message}"
        
        If the question cannot be answered using the provided content, say: "I don't have that Information, you can ask other than that."
        
        Keep your response friendly, professional, and within 3-4 lines. Don't mention that you're using specific content unless directly asked.
      `;
      
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
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I don't have enough information to answer that about the website i provided.";
    } catch (error) {
      console.error("Error getting AI response:", error);
      return "I'm having trouble connecting to my knowledge base about the website i provided right now. Could you try again?";
    }
  }, [websiteContent, isLoading]);

  // Send message logic
  const sendMessage = useCallback(async (message) => {
    const userText = message || inputText.trim();
    if (!userText) return;

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

    // Speak the response
    speakResponse(response);

    // Scroll to bottom
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
    
    return response;
  }, [inputText, getAIResponse, speakResponse]);

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
    
    // Check if this is likely a chat command rather than navigation
    const talkingToMaverick = 
      trimmedTranscript.toLowerCase().includes('VOXA ASSIST') || 
      trimmedTranscript.toLowerCase().includes('example') || 
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
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="theme-btn">
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`} />
              </button>
              <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
            </div>
          </div>

          <div className="chat-messages" ref={chatRef}>
            {isLoading && websiteContent === null && (
              <div className="system-message">Loading website content...</div>
              
            )}
            
            {messages.map((msg, index) => (
              <div key={msg.id || index} className={`message ${msg.from === 'user' ? 'user-message' : 'bot-message'} ${msg.loading ? 'loading' : ''}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask about example.com..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={() => sendMessage()}>Send</button>
          </div>

          <div className={`voice-status ${voiceStatus}`}>
            <i className={`fas ${voiceStatus === 'listening' ? 'fa-microphone-alt' : 'fa-microphone'}`}></i>
            {voiceStatus === 'listening' ? "Listening..." : "Voice Ready"} 
          </div>
        </div>
      )}
    </div>
  );
};

export default MaverickWidget;