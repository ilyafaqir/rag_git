import React from 'react'
import { motion } from 'framer-motion'

const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-4"
    >
      <div className="flex items-start space-x-3 max-w-[70%]">
        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0">
          <div className="w-4 h-4">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
          <div className="flex space-x-1">
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TypingIndicator 