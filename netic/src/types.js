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

export {};
