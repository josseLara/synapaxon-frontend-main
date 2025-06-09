import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
// Assuming '../api/aiapi' exists and handles API calls
import { sendChatMessageToAI } from '../api/aiapi';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm'; // Import remarkGfm for GitHub Flavored Markdown
import { motion, AnimatePresence } from 'framer-motion';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState(null); // NEW: Store thread_id
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Scroll whenever messages array updates

  // Toggle chat window visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Optionally, you could clear currentThreadId here if you want every "new" chat window open to be a new thread
    // or persist it in localStorage to continue previous conversations.
    // For simplicity, let's allow continuing if thread_id exists.
    // If you want a fresh thread each time the empty chat opens:
    // if (!isOpen) setCurrentThreadId(null);
  };

  // Initialize chat with a welcome message when opened and messages are empty
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ type: 'ai', content: 'Hello! I am Synapax, your AI Medical Tutor. How can I assist you today?' }]);
    }
  }, [isOpen, messages.length]); // Dependencies ensure this runs when chat opens and messages are empty

  const sendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { type: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]); // Add user message instantly

    const currentInput = input; // Capture current input before clearing
    setInput(''); // Clear input field
    setIsLoading(true); // Show loading indicator

    try {
      // History for display is in `messages`. The agent uses checkpointer.
      // We don't strictly need to send `history` in payload if checkpointer handles it all.
      // However, sending recent history can be useful for the LLM's immediate context or if
      // the checkpointer mechanism has some latency or is only for longer-term persistence.
      // The `create_react_agent` primarily relies on the checkpointer.
      const historyForPayload = messages
        .filter(msg => msg.type === 'user' || msg.type === 'ai')
        .slice(0, -1) // Exclude the user message just added locally
        .slice(-6); // Send last 3 pairs of user/AI messages for context, adjust as needed

      const response = await sendChatMessageToAI({
        message: currentInput,
        history: historyForPayload, // Optional: for immediate context if desired by agent prompt
        thread_id: currentThreadId, // Send current thread_id
      });

      if (response.success && response.response) {
        const aiMessage = { type: 'ai', content: response.response };
        setMessages((prev) => [...prev, aiMessage]); // Add AI response
        if (response.thread_id && response.thread_id !== currentThreadId) {
          setCurrentThreadId(response.thread_id); // Update if backend assigned a new one
          // Optional: Persist thread_id for next session if desired
          // localStorage.setItem('aiChatThreadId', response.thread_id);
        }
      } else {
        const errorMessageContent = response.message || 'Sorry, I had trouble understanding that.';
        setMessages((prev) => [...prev, { type: 'ai', content: errorMessageContent }]);
      }
    } catch (error) {
      console.error('Error in sendMessage component:', error);
      setMessages((prev) => [...prev, { type: 'ai', content: 'Network error. Please try again.' }]);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  // Custom component for links to apply Tailwind CSS classes
  const components = {
    a: ({ node, ...props }) => (
      <a
        {...props}
        className="text-blue-500 hover:underline dark:text-blue-300" // Added dark mode support
        target="_blank" // Open links in a new tab
        rel="noopener noreferrer" // Security best practice for target="_blank"
      />
    ),
    // You can add more custom components for other markdown elements if needed
    // For example, to style headings:
    // h1: ({node, ...props}) => <h1 {...props} className="text-xl font-bold my-2" />,
    // strong: ({node, ...props}) => <strong {...props} className="font-semibold" />,
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
          className="fixed z-[1000] bottom-16 right-4 w-[550px] h-[80vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col"
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
                  className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`inline-block p-2 rounded-lg ${msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    style={{ maxWidth: '80%' }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                      {msg.content}
                    </ReactMarkdown>
                  </motion.span>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left"
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

          {/* 👇 Input always pinned at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 border-t dark:border-gray-700"
          >
            <div className="flex items-center gap-2">
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