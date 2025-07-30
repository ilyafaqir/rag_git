import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react'

interface ApiStatusProps {
  onTestApi: () => Promise<boolean>
}

const ApiStatus: React.FC<ApiStatusProps> = ({ onTestApi }) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const testConnection = async () => {
    setStatus('checking')
    try {
      const isOnline = await onTestApi()
      setStatus(isOnline ? 'online' : 'offline')
      setLastCheck(new Date())
    } catch (error) {
      setStatus('offline')
      setLastCheck(new Date())
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'text-green-600'
      case 'offline': return 'text-red-600'
      case 'checking': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />
      case 'offline': return <XCircle className="w-4 h-4" />
      case 'checking': return <RefreshCw className="w-4 h-4 animate-spin" />
      default: return <WifiOff className="w-4 h-4" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'online': return 'API RAG connectée'
      case 'offline': return 'API RAG déconnectée'
      case 'checking': return 'Vérification de la connexion...'
      default: return 'Statut inconnu'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <button
          onClick={testConnection}
          disabled={status === 'checking'}
          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          title="Tester la connexion"
        >
          <RefreshCw className={`w-4 h-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {lastCheck && (
        <p className="text-xs text-gray-500 mt-1">
          Dernière vérification : {lastCheck.toLocaleTimeString('fr-FR')}
        </p>
      )}
      
      {status === 'offline' && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <p className="font-medium">Conseils de dépannage :</p>
          <ul className="mt-1 space-y-1">
            <li>• Vérifiez que votre serveur RAG est lancé sur http://127.0.0.1:8000</li>
            <li>• Vérifiez que le port 8000 n'est pas bloqué par un firewall</li>
            <li>• Consultez les logs de votre serveur RAG</li>
          </ul>
        </div>
      )}
    </motion.div>
  )
}

export default ApiStatus 