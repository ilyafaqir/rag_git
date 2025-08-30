import React, { useState } from 'react'
import { Message } from '../types/chat'
import { User, Bot, Copy } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChatMessageProps {
  message: Message
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user'
  const [copied, setCopied] = useState(false)

  // Extraction des sources et confiance si présents
  let mainContent = message.content
  let sources: string[] = []
  let confidence: string | null = null

  if (!isUser && message.content.includes('📚 Sources consultées')) {
    const parts = message.content.split('📚 Sources consultées :')
    mainContent = parts[0].trim()
    if (parts[1]) {
      const lines = parts[1].split('\n').map(l => l.trim()).filter(Boolean)
      sources = lines.filter(l => l.startsWith('•')).map(l => l.replace(/^• /, ''))
    }
  }
  if (!isUser && message.content.includes('🎯 Confiance')) {
    const confMatch = message.content.match(/🎯 Confiance : (\d+)%/)
    if (confMatch) confidence = confMatch[1] + '%'
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.02 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start space-x-3 max-w-[70%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <motion.div 
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
            isUser 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
              : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700'
          }`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ 
              rotate: isUser ? [0, 360] : 0,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: isUser ? 2 : 0,
              repeat: isUser ? Infinity : 0,
              ease: "linear"
            }}
          >
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className={`rounded-xl px-4 py-3 shadow-lg relative backdrop-blur-sm ${
            isUser 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
              : 'bg-gradient-to-br from-white to-gray-50 text-gray-900 border border-gray-200'
          }`}
          animate={{
            boxShadow: [
              "0 4px 6px rgba(0,0,0,0.1)",
              "0 8px 25px rgba(0,0,0,0.15)",
              "0 4px 6px rgba(0,0,0,0.1)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-line">{mainContent}</p>
          {/* Affichage des sources */}
          {sources.length > 0 && (
            <div className="mt-2 text-xs text-blue-700">
              <div className="font-semibold mb-1">Sources consultées :</div>
              <ul className="list-disc list-inside">
                {sources.map((src, i) => (
                  <li key={i}>{src}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Affichage de la confiance */}
          {confidence && (
            <div className="mt-1 text-xs text-purple-700">Confiance : {confidence}</div>
          )}
          {/* Bouton copier */}
          {!isUser && (
            <motion.button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
              title="Copier la réponse"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: copied ? 360 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Copy className="w-4 h-4" />
              </motion.div>
            </motion.button>
          )}
          {/* Notification copié */}
          {copied && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              className="absolute top-2 right-10 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs px-2 py-1 rounded-lg shadow-lg border border-green-200"
            >
              ✓ Copié !
            </motion.span>
          )}
          <p className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage 