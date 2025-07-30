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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start space-x-3 max-w-[70%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        
        <div className={`rounded-lg px-4 py-3 shadow-sm relative ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-white text-gray-900 border border-gray-200'
        }`}>
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
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Copier la réponse"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
          {/* Notification copié */}
          {copied && (
            <span className="absolute top-2 right-10 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded shadow">Copié !</span>
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