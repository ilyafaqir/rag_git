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
    <div className="max-w-6xl mx-auto px-2 md:px-8 py-8 min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex flex-col items-center">
      <ApiStatus onTestApi={testApiConnection} />
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* En-tête du chat */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{chatbotConfig.name}</h2>
              <p className="text-blue-100 text-base">{chatbotConfig.personality}</p>
              <p className="text-blue-200 text-xs mt-1">Powered by RAG System - Base de Connaissances FSDM</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleRestartChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Redémarrer la conversation"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleClearChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Effacer l'historique"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Zone des messages */}
        <div className="h-[600px] md:h-[700px] overflow-y-auto p-6 bg-gray-50">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && <TypingIndicator />}
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