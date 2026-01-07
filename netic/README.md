# Netic API Client

Un client Node.js moderne et complet pour communiquer avec l'API Netic AI.

## Installation

```bash
npm install netic
```

## Features

- ✅ Chat texte simple
- ✅ Support de l'historique de conversation
- ✅ Envoi de fichiers audio (premium)
- ✅ Gestion automatique du quota
- ✅ Gestion robuste des erreurs
- ✅ Configuration persistente de la clé API
- ✅ TypeScript-friendly avec JSDoc

## Utilisation rapide

### Importation

```javascript
import { NeticClient, chat, setApiKey } from 'netic';
```

### Chat simple

```javascript
import { chat } from 'netic';

try {
    const response = await chat("Bonjour, comment allez-vous ?", "netic_votre_api_key");
    console.log(response.response);
    console.log("Quota restant:", response.usage.remaining);
} catch (error) {
    console.error("Erreur:", error.message);
}
```

### Avec la classe NeticClient

```javascript
import { NeticClient } from 'netic';

const client = new NeticClient("netic_votre_api_key");

try {
    const response = await client.chat("Qu'est-ce que l'IA ?");
    console.log(response.response);
} catch (error) {
    console.error("Erreur:", error.message);
}
```

## Configuration

### Clé API persistente

```javascript
import { setApiKey, getApiKey } from 'netic';

// Sauvegarder la clé API
setApiKey("netic_votre_api_key");

// Utiliser automatiquement la clé sauvegardée
const client = new NeticClient();
```

## Fonctionnalités avancées

### Historique de conversation

```javascript
import { NeticClient } from 'netic';

const client = new NeticClient("netic_votre_api_key");

// L'historique est géré automatiquement
await client.chat("Je m'appelle Jean");
await client.chat("Comment tu m'appelles ?"); // L'IA se souvient !

// Voir l'historique
console.log(client.getHistory());

// Vider l'historique
client.clearHistory();
```

### Historique personnalisé

```javascript
const history = [
    { role: "user", content: "Je suis développeur" },
    { role: "assistant", content: "Intéressant !" }
];

const response = await client.chat("Quels frameworks ?", history);
```

### Support audio (premium)

```javascript
import { NeticClient } from 'netic';

const client = new NeticClient("netic_votre_api_key");

try {
    const response = await client.chatWithAudio({
        message: "Voici un message audio",
        audio: "/chemin/vers/fichier.webm"
    });
    
    console.log(response.response);
    if (response.audio_url) {
        console.log("Audio disponible:", response.audio_url);
    }
} catch (error) {
    if (error.message.includes('Audio feature not enabled')) {
        console.log("L'accès audio doit être activé par un admin");
    }
}
```

## API complète

### NeticClient

#### Constructor
- `new NeticClient(apiKey?: string)` - Crée une instance cliente

#### Methods
- `setApiKey(key: string)` - Définit la clé API
- `chat(message: string, history?: Array): Promise<Object>` - Chat texte
- `chatWithAudio(options: Object): Promise<Object>` - Chat avec audio
- `getHistory(): Array` - Récupère l'historique
- `clearHistory()` - Vide l'historique

### Fonctions utilitaires

- `chat(message, apiKey?, history?)` - Chat simple
- `chatWithAudio(options, apiKey?)` - Chat audio simple
- `setApiKey(key)` - Sauvegarde la clé API
- `getApiKey()` - Récupère la clé API
- `clearApiKey()` - Supprime la clé API
- `isValidApiKey(key)` - Valide le format de la clé
- `formatHistory(history)` - Formate l'historique

## Réponse API

```javascript
{
    response: "Réponse de l'IA",
    usage: {
        quota_used: 45,
        quota_limit: 1000,
        remaining: 955
    },
    user: "Nom utilisateur",
    audio_url: "/uploads/audio/..." // optionnel
}
```

## Gestion des erreurs

Le client gère automatiquement tous les codes d'erreur :

- **401** - Clé API invalide
- **403** - Clé non approuvée ou audio non activé
- **429** - Quota dépassé
- **400** - Requête invalide
- **500** - Erreur serveur

```javascript
try {
    const response = await client.chat("Test");
} catch (error) {
    if (error.message.includes('Quota exceeded')) {
        console.log("Quota épuisé !");
    }
}
```

## Exemples

Voir le dossier `/examples` pour des exemples complets :

- `examples/basic.js` - Utilisation de base
- `examples/audio.js` - Support audio
- `examples/advanced.js` - Fonctionnalités avancées

## Configuration

La clé API est sauvegardée dans `~/.netic/config.json`.

## Obtenir une clé API

1. Connectez-vous sur https://netic.jtheberg.cloud
2. Demandez une clé API dans le chat
3. Attendez l'approbation admin
4. Pour l'audio: contactez un admin pour l'activation

## Licence

Jtheberg License use
