import { Message } from '../types/chat'

// Configuration du chatbot
export const chatbotConfig = {
  name: 'Assistant FSDM',
  personality: 'spécialisé dans tous les masters de la Faculté des Sciences Dhar El Mahraz (FSDM)',
  welcomeMessage: 'Bonjour ! Je suis votre assistant spécialisé dans tous les masters de FSDM. Je peux vous renseigner sur les différents masters, modules, cours, débouchés et tout ce qui concerne les formations de la faculté. Comment puis-je vous aider ?',
  maxMessages: 100
}

// Interface pour la réponse de l'API RAG
interface RAGResponse {
  answer: string
  sources?: string[]
  confidence?: number
}

// Générer une réponse via l'API RAG
export const generateBotResponse = async (userMessage: string): Promise<string> => {
  try {
    console.log('🔄 Tentative de connexion à l\'API RAG...')
    console.log('📤 Envoi de la question:', userMessage)
    
    const response = await fetch('http://127.0.0.1:8000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: userMessage
      })
    })

    console.log('📥 Réponse reçue, status:', response.status)

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`)
    }

    const data: RAGResponse = await response.json()
    console.log('📋 Données reçues:', data)
    
    // Formater la réponse avec les sources si disponibles
    let formattedResponse = data.answer || "Je n'ai pas pu trouver de réponse spécifique à votre question."
    
    if (data.sources && data.sources.length > 0) {
      formattedResponse += "\n\n📚 Sources consultées :"
      data.sources.forEach((source, index) => {
        formattedResponse += `\n• ${source}`
      })
    }
    
    if (data.confidence !== undefined) {
      formattedResponse += `\n\n🎯 Confiance : ${Math.round(data.confidence * 100)}%`
    }
    
    return formattedResponse
    
  } catch (error) {
    console.error('❌ Erreur lors de la communication avec l\'API RAG:', error)
    console.error('🔍 Détails de l\'erreur:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    })
    
    // Réponses de fallback pour les cas d'erreur
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut')) {
      return "Bonjour ! Je suis votre assistant spécialisé dans tous les masters de FSDM. Comment puis-je vous aider ?"
    }
    
    if (lowerMessage.includes('merci')) {
      return "Je vous en prie ! N'hésitez pas à me poser d'autres questions sur les masters de FSDM."
    }
    
    if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
      return "Je peux vous aider avec toutes vos questions sur les masters de FSDM : ML/AIM, multimédia, informatique, mathématiques, physique, chimie, biologie, etc. Que souhaitez-vous savoir ?"
    }
    
    if (lowerMessage.includes('au revoir') || lowerMessage.includes('bye')) {
      return "Au revoir ! Bonne continuation dans vos études !"
    }
    
    return "Désolé, je ne peux pas accéder à ma base de connaissances pour le moment. Pouvez-vous reformuler votre question ou réessayer plus tard ?"
  }
}

// Créer un nouveau message
export const createMessage = (content: string, sender: 'user' | 'bot'): Message => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  content,
  sender,
  timestamp: new Date()
})

// Vérifier si le message est valide
export const isValidMessage = (message: string): boolean => {
  return message.trim().length > 0 && message.trim().length <= 1000
}

// Tester la connexion à l'API RAG
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log('🧪 Test de connexion à l\'API RAG...')
    
    const response = await fetch('http://127.0.0.1:8000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: "test"
      })
    })

    console.log('📡 Test API - Status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API RAG fonctionnelle:', data)
      return true
    } else {
      console.log('❌ API RAG répond mais avec erreur:', response.status)
      return false
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion à l\'API RAG:', error)
    return false
  }
} 