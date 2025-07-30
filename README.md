# 🤖 Assistant FSDM - Chatbot RAG

Un chatbot moderne et professionnel spécialisé dans tous les masters de la Faculté des Sciences Dhar El Mahraz (FSDM). Développé avec React, TypeScript et Tailwind CSS, intégré avec un système RAG pour des réponses précises basées sur la base de connaissances FSDM.

## ✨ Fonctionnalités

- **Interface moderne** : Design épuré et professionnel avec Tailwind CSS
- **Animations fluides** : Transitions et animations avec Framer Motion
- **Responsive** : Compatible mobile et desktop
- **TypeScript** : Code type-safe et maintenable
- **Système RAG** : Intégration avec API de base de connaissances FSDM
- **Questions rapides** : Suggestions de questions fréquentes par catégorie
- **Indicateur de frappe** : Animation pendant la génération de réponse
- **Gestion d'erreurs** : Messages d'erreur clairs et informatifs
- **Auto-scroll** : Défilement automatique vers les nouveaux messages
- **Validation** : Vérification des messages avant envoi
- **Historique** : Gestion de l'historique des conversations

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd pro-chatbot
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 🛠️ Technologies utilisées

- **React 18** - Framework frontend
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations
- **Lucide React** - Icônes
- **Vite** - Build tool et dev server
- **API RAG** - Système de base de connaissances FSDM

## 📁 Structure du projet

```
src/
├── components/          # Composants React
│   ├── Chatbot.tsx     # Composant principal
│   ├── ChatMessage.tsx # Affichage des messages
│   ├── ChatInput.tsx   # Zone de saisie
│   ├── TypingIndicator.tsx # Indicateur de frappe
│   └── Header.tsx      # En-tête de l'application
├── types/              # Types TypeScript
│   └── chat.ts         # Interfaces pour le chat
├── utils/              # Utilitaires
│   └── chatbot.ts      # Logique du chatbot
├── App.tsx             # Composant racine
├── main.tsx            # Point d'entrée
└── index.css           # Styles globaux
```

## 🎨 Personnalisation

### Modifier la configuration du chatbot

Éditez `src/utils/chatbot.ts` pour personnaliser :

```typescript
export const chatbotConfig = {
  name: 'Assistant FSDM',
  personality: 'spécialisé dans tous les masters de la Faculté des Sciences Dhar El Mahraz (FSDM)',
  welcomeMessage: 'Bonjour ! Je suis votre assistant spécialisé dans tous les masters de FSDM.',
  maxMessages: 100
}
```

### Ajouter de nouvelles réponses

Modifiez la fonction `generateBotResponse` dans `src/utils/chatbot.ts` :

```typescript
export const generateBotResponse = async (userMessage: string): Promise<string> => {
  // Votre logique personnalisée ici
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('votre-mot-clé')) {
    return "Votre réponse personnalisée"
  }
  
  // Réponses par défaut
  return "Réponse générique"
}
```

## 🔧 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile pour la production
- `npm run preview` - Prévisualise la build de production
- `npm run lint` - Vérifie le code avec ESLint

## 🌟 Fonctionnalités avancées

### Intégration API

Pour intégrer une vraie API d'IA, remplacez la fonction `generateBotResponse` :

```typescript
export const generateBotResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    })
    
    const data = await response.json()
    return data.response
  } catch (error) {
    throw new Error('Erreur de communication avec l\'API')
  }
}
```

### Persistance des données

Ajoutez le stockage local pour sauvegarder les conversations :

```typescript
// Sauvegarder
localStorage.setItem('chatHistory', JSON.stringify(messages))

// Charger
const savedMessages = JSON.parse(localStorage.getItem('chatHistory') || '[]')
```

## 📱 Responsive Design

Le chatbot s'adapte automatiquement aux différentes tailles d'écran :
- **Desktop** : Interface complète avec sidebar
- **Tablet** : Layout adapté
- **Mobile** : Interface optimisée tactile

## 🎯 Prochaines améliorations

- [ ] Intégration avec OpenAI API
- [ ] Support des fichiers joints
- [ ] Mode sombre/clair
- [ ] Export des conversations
- [ ] Support multilingue
- [ ] Authentification utilisateur
- [ ] Base de données pour l'historique

## 📄 Licence

MIT License - Libre d'utilisation et de modification

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

---

**Développé avec ❤️ pour créer des expériences utilisateur exceptionnelles** 