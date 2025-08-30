import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message } from '../types/chat'
import { chatbotConfig, generateBotResponse, createMessage, isValidMessage, testApiConnection } from '../utils/chatbot'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import QuickQuestions from './QuickQuestions'
import ApiStatus from './ApiStatus'
import ParticleBackground from './ParticleBackground'
import ConfettiEffect from './ConfettiEffect'
import { RefreshCw, Trash2 } from 'lucide-react'

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Charger l'historique au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory')
    if (saved) setMessages(JSON.parse(saved))
    else setMessages([createMessage(chatbotConfig.welcomeMessage, 'bot')])
  }, [])

  // Sauvegarder à chaque changement
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages))
  }, [messages])

  // Message de bienvenue initial
  useEffect(() => {
    const welcomeMessage = createMessage(chatbotConfig.welcomeMessage, 'bot')
    setMessages([welcomeMessage])
  }, [])

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!isValidMessage(content)) {
      setError('Le message doit contenir entre 1 et 1000 caractères.')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Ajouter le message utilisateur
      const userMessage = createMessage(content, 'user')
      setMessages(prev => [...prev, userMessage])

      // Générer la réponse du bot
      const botResponse = await generateBotResponse(content)
      const botMessage = createMessage(botResponse, 'bot')
      
      setMessages(prev => [...prev, botMessage])
      
      // Déclencher les confettis pour célébrer la réponse
      setShowConfetti(true)
    } catch (err) {
      setError('Une erreur est survenue lors de la génération de la réponse.')
      console.error('Erreur chatbot:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([createMessage(chatbotConfig.welcomeMessage, 'bot')])
    setError(null)
  }

  const handleRestartChat = () => {
    setMessages([])
    setError(null)
    // Redémarrer avec le message de bienvenue
    setTimeout(() => {
      setMessages([createMessage(chatbotConfig.welcomeMessage, 'bot')])
    }, 100)
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-8 py-8 min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center relative transition-colors duration-300">
      {/* Arrière-plan avec particules */}
      <ParticleBackground />
      
      {/* Effet de confettis */}
      <ConfettiEffect 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <ApiStatus onTestApi={testApiConnection} />
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        {/* En-tête du chat */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Effet de brillance animé */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ width: '50%', height: '100%' }}
          />
          
          <div className="flex items-center justify-between relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.h2 
                className="text-2xl font-bold"
                animate={{ 
                  textShadow: [
                    "0 0 0px rgba(255,255,255,0)",
                    "0 0 10px rgba(255,255,255,0.3)",
                    "0 0 0px rgba(255,255,255,0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {chatbotConfig.name}
              </motion.h2>
              <p className="text-blue-100 text-base">{chatbotConfig.personality}</p>
              <p className="text-blue-200 text-xs mt-1">Powered by RAG System - Base de Connaissances FSDM</p>
            </motion.div>
            
            <motion.div 
              className="flex space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.button
                onClick={handleRestartChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Redémarrer la conversation"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={handleClearChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Effacer l'historique"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Zone des messages */}
        <motion.div 
          className="h-[600px] md:h-[700px] overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-700/50 relative transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <ChatMessage message={message} />
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}
          
          {/* Afficher les questions rapides seulement si c'est le message de bienvenue */}
          {messages.length === 1 && messages[0].sender === 'bot' && (
            <QuickQuestions onQuestionClick={handleQuickQuestion} />
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={error !== null}
        />
      </div>

      {/* Statistiques */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {messages.length > 1 && (
          <p>
            {messages.length - 1} message{messages.length > 2 ? 's' : ''} échangé{messages.length > 2 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}

export default Chatbot 