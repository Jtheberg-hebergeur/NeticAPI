/**
 * @typedef {Object} ChatMessage
 * @property {string} role - "user" ou "assistant"
 * @property {string} content - Contenu du message
 */

/**
 * @typedef {Object} ChatRequest
 * @property {string} message - Message à envoyer
 * @property {ChatMessage[]} [history] - Historique de conversation
 */

/**
 * @typedef {Object} Usage
 * @property {number} quota_used - Quota utilisé
 * @property {number} quota_limit - Limite du quota
 * @property {number} remaining - Quota restant
 */

/**
 * @typedef {Object} ChatResponse
 * @property {string} response - Réponse de l'IA
 * @property {Usage} usage - Informations sur le quota
 * @property {string} user - Nom de l'utilisateur
 * @property {string} [audio_url] - URL du fichier audio (si supporté)
 */

/**
 * @typedef {Object} AudioChatRequest
 * @property {string} message - Message ou transcription
 * @property {File|Buffer} [audio] - Fichier audio
 * @property {ChatMessage[]} [history] - Historique de conversation
 */

/**
 * @typedef {Object} ImageUploadRequest
 * @property {File|Buffer|string} image - Fichier image (File, Buffer ou chemin vers le fichier)
 * @property {string} [prompt] - Question ou instruction personnalisée pour l'analyse IA
 */

/**
 * @typedef {Object} ImageUploadResponse
 * @property {boolean} success - Statut de succès
 * @property {string} imageUrl - URL de l'image uploadée
 * @property {string} fileName - Nom du fichier
 * @property {number} size - Taille du fichier en octets
 * @property {string} type - Type MIME du fichier
 * @property {string} uploadedAt - Date d'upload (ISO 8601)
 * @property {string} [prompt] - Prompt utilisé pour l'analyse
 * @property {string} analysis - Analyse générée par l'IA
 */

/**
 * @typedef {Object} ImageStatusResponse
 * @property {string} status - Statut de l'API ("ready")
 * @property {boolean} enabled - Si l'API est activée
 * @property {boolean} publicApiEnabled - Si l'API publique est activée
 * @property {number} maxSize - Taille maximale en octets
 * @property {string[]} allowedTypes - Types de fichiers autorisés
 * @property {number} maxSizeMB - Taille maximale en MB
 */

export {};
