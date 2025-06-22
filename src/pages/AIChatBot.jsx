// AIChatBot.js
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Paperclip, Loader } from 'lucide-react'; // Added Paperclip, Loader
import { sendChatMessageToAI } from '../api/aiapi'; // Corrected import
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid'; // For generating thread_id

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [stagedFiles, setStagedFiles] = useState([]); // NEW: For files to be sent
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // NEW: Ref for file input

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !currentThreadId) { // If opening for the first time in a session
      const newThreadId = uuidv4();
      setCurrentThreadId(newThreadId);
      // Optional: Persist thread_id for next session if desired
      // localStorage.setItem('aiChatThreadId', newThreadId);
      setMessages([{ type: 'ai', content: 'Hello! I am Synapax, your AI Medical Tutor. How can I assist you today?' }]);
    } else if (isOpen && messages.length === 0 && currentThreadId) { // Re-opening an existing session with no messages yet
        setMessages([{ type: 'ai', content: 'Welcome back! How can I help?' }]);
    }
  };

  // Removed useEffect for welcome message, handled in toggleChat or initial state
  // useEffect(() => {
  //   if (isOpen && messages.length === 0) { ... }
  // }, [isOpen, messages.length]);


  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.filter(file => !stagedFiles.some(sf => sf.name === file.name)); // Avoid duplicates
    setStagedFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
        setMessages(prev => [...prev, { type: 'system', content: `File ready: ${file.name}. Add a message or send.`}]);
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input to allow selecting same file again
    }
  };

  const removeStagedFile = (fileName) => {
    setStagedFiles(prev => prev.filter(f => f.name !== fileName));
    setMessages(prev => [...prev, { type: 'system', content: `Removed file: ${fileName}.`}]);
  };

  const sendMessage = async () => {
    const textInput = input.trim();
    if ((!textInput && stagedFiles.length === 0) || isLoading) return;

    // Ensure threadId is set
    let effectiveThreadId = currentThreadId;
    if (!effectiveThreadId) {
      effectiveThreadId = uuidv4();
      setCurrentThreadId(effectiveThreadId);
      // localStorage.setItem('aiChatThreadId', effectiveThreadId);
      if (messages.length === 0) { // If it's truly the first interaction
         setMessages([{ type: 'ai', content: 'Hello! I am Synapax, your AI Medical Tutor. How can I assist you today?' }]);
      }
    }

    // Add user's text message to chat immediately if it exists
    if (textInput) {
        const userTextMessage = { type: 'user', content: textInput };
        setMessages((prev) => [...prev, userTextMessage]);
    }
    // Add system messages for files being sent
    stagedFiles.forEach(file => {
        setMessages(prev => [...prev, { type: 'system', content: `Sending file: ${file.name}...`}]);
    });

    const currentInputForAI = textInput;
    const filesToSend = [...stagedFiles];

    setInput('');
    setStagedFiles([]); // Clear staged files after preparing to send
    setIsLoading(true);

    try {
      // History is handled by the agent's checkpointer via thread_id,
      // so we don't need to send `history` in the payload from here.
      const response = await sendChatMessageToAI({
        message: currentInputForAI,
        thread_id: effectiveThreadId,
        files: filesToSend,
      });

      if (response.success && response.response) {
        const aiMessage = { type: 'ai', content: response.response };
        setMessages((prev) => [...prev, aiMessage]);
        if (response.thread_id && response.thread_id !== currentThreadId) {
          setCurrentThreadId(response.thread_id);
          // localStorage.setItem('aiChatThreadId', response.thread_id);
        }
      } else {
        const errorMessageContent = response.message || 'Sorry, I had trouble processing that.';
        setMessages((prev) => [...prev, { type: 'ai', content: errorMessageContent }]);
      }
    } catch (error) {
      console.error('Error in sendMessage component:', error);
      setMessages((prev) => [...prev, { type: 'ai', content: 'Network error or unexpected issue. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced custom components for better markdown rendering
  const components = {
    a: ({ node, ...props }) => (
      <a
        {...props}
        className="text-blue-500 hover:underline dark:text-blue-300" // Added dark mode support
        target="_blank" // Open links in a new tab
        rel="noopener noreferrer" // Security best practice for target="_blank"
      />
    ),
    // Add proper spacing and styling for headings
    h1: ({ node, ...props }) => (
      <h1 {...props} className="text-xl font-bold my-3 text-gray-900 dark:text-gray-100" />
    ),
    h2: ({ node, ...props }) => (
      <h2 {...props} className="text-lg font-bold my-2 text-gray-900 dark:text-gray-100" />
    ),
    h3: ({ node, ...props }) => (
      <h3 {...props} className="text-md font-bold my-2 text-gray-900 dark:text-gray-100" />
    ),
    // Add spacing for paragraphs
    p: ({ node, ...props }) => (
      <p {...props} className="my-2 leading-relaxed" />
    ),
    // Style strong/bold text
    strong: ({ node, ...props }) => (
      <strong {...props} className="font-semibold text-gray-900 dark:text-gray-100" />
    ),
    // Style lists with proper spacing
    ul: ({ node, ...props }) => (
      <ul {...props} className="my-2 ml-4 list-disc space-y-1" />
    ),
    ol: ({ node, ...props }) => (
      <ol {...props} className="my-2 ml-4 list-decimal space-y-1" />
    ),
    li: ({ node, ...props }) => (
      <li {...props} className="leading-relaxed" />
    ),
    // Style code blocks
    code: ({ node, inline, ...props }) => 
      inline ? (
        <code {...props} className="bg-gray-100 dark:bg-gray-600 px-1 py-0.5 rounded text-sm font-mono" />
      ) : (
        <code {...props} className="block bg-gray-100 dark:bg-gray-600 p-2 rounded text-sm font-mono my-2" />
      ),
    pre: ({ node, ...props }) => (
      <pre {...props} className="bg-gray-100 dark:bg-gray-600 p-2 rounded overflow-x-auto my-2" />
    ),
    // Style blockquotes
    blockquote: ({ node, ...props }) => (
      <blockquote {...props} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 italic" />
    ),
  };

  return (

  <>
    <motion.button
      onClick={toggleChat}
      className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <MessageCircle size={24} />
      </motion.div>
    </motion.button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed z-[1000] bottom-16 right-4 w-[550px] h-[70vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-center p-4 border-b dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Chatbot</h3>
            <motion.button
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </motion.div>

          {/* 👇 Flexible message area */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`mb-2 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`inline-block p-3 rounded-lg ${msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    style={{ maxWidth: '80%' }}
                  >
                    {msg.type === 'user' ? (
                      // For user messages, render plain text to avoid formatting issues
                      <div className="text-left whitespace-pre-wrap break-words">
                        {msg.content}
                      </div>
                    ) : (
                      // For AI messages, use ReactMarkdown with full formatting
                      <div className="prose prose-sm max-w-none dark:prose-invert text-left">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <motion.span
                  className="inline-block p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Thinking...
                </motion.span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Staged Files Display */}
            {stagedFiles.length > 0 && (
              <div className="px-3 pt-2 pb-1 border-t dark:border-gray-700 text-xs space-y-1">
                <p className="text-gray-600 dark:text-gray-400 font-medium">Files to send:</p>
                {stagedFiles.map((file, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-between items-center bg-gray-100 dark:bg-gray-600 p-1.5 rounded text-gray-700 dark:text-gray-200"
                  >
                    <span className="truncate max-w-[80%]">{file.name}</span>
                    <button 
                      onClick={() => removeStagedFile(file.name)} 
                      className="text-red-500 hover:text-red-700 ml-1 p-0.5"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

          {/* 👇 Input always pinned at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 border-t dark:border-gray-700"
          >
            <div className="flex items-center gap-2">
              {/* File Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                  id="chatBotFileInput"
                  accept="image/*,.pdf,.doc,.docx,.txt" // Specify acceptable file types
                />
                <motion.label
                  htmlFor="chatBotFileInput"
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 cursor-pointer border border-gray-300 dark:border-gray-500 rounded-md flex items-center justify-center h-[42px] w-[42px]" // Fixed size
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.05)'}}
                  whileTap={{ scale: 0.95 }}
                  title="Attach files"
                >
                  <Paperclip size={20} />
                </motion.label>

              <motion.input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                disabled={isLoading}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.button
                onClick={sendMessage}
                className="px-4 py-3 h-full bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-gray-400"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={isLoading ? { repeat: Infinity, duration: 1 } : {}}
                >
                  <Send size={20} />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
};

export default AIChatBot;