import React from 'react'
import Chatbot from './components/Chatbot'
import Header from './components/Header'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Chatbot />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App 