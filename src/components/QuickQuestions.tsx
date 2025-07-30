import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Users, GraduationCap, Briefcase } from 'lucide-react'

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void
}

const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onQuestionClick }) => {
  const questionCategories = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Masters Informatique",
      questions: [
        "Quels sont les masters en informatique disponibles à FSDM ?",
        "Parler du master ML/AIM et multimédia, quels modules sont étudiés ?",
        "Quels sont les débouchés du master informatique ?"
      ]
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Masters Sciences",
      questions: [
        "Quels masters en mathématiques propose FSDM ?",
        "Parler des masters en physique et leurs spécialités",
        "Quels sont les masters en chimie disponibles ?"
      ]
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Admission & Inscription",
      questions: [
        "Quelles sont les conditions d'admission aux masters FSDM ?",
        "Comment s'inscrire aux masters de FSDM ?",
        "Quels sont les documents requis pour l'inscription ?"
      ]
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: "Débouchés & Carrières",
      questions: [
        "Quels sont les débouchés professionnels des masters FSDM ?",
        "Y a-t-il des partenariats avec des entreprises ?",
        "Quelles sont les opportunités de stage ?"
      ]
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions fréquentes</h3>
      <div className="overflow-x-auto">
        <div className="flex flex-nowrap gap-4 pb-2">
          {questionCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="min-w-[260px] max-w-xs bg-blue-50 rounded-xl p-3 flex-shrink-0 flex flex-col gap-2 border border-blue-100"
            >
              <div className="flex items-center space-x-2 text-blue-600 font-medium mb-1">
                {category.icon}
                <span>{category.title}</span>
              </div>
              <div className="flex flex-col gap-2">
                {category.questions.map((question, questionIndex) => (
                  <button
                    key={questionIndex}
                    onClick={() => onQuestionClick(question)}
                    className="block w-full text-left p-2 text-xs md:text-sm text-gray-700 bg-white hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors border border-transparent hover:border-blue-200 shadow-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuickQuestions 