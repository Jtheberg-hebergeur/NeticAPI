import FormData from 'form-data';
import fs from 'fs';

/**
 * Crée un objet FormData pour les requêtes avec fichiers
 * @param {Object} data - Données à formater
 * @param {string} data.message - Message
 * @param {File|Buffer|string} [data.audio] - Fichier audio
 * @param {Array} [data.history] - Historique de conversation
 * @returns {FormData}
 */
export function createFormData({ message, audio, history = [] }) {
    const formData = new FormData();
    
    formData.append('message', message);
    formData.append('history', JSON.stringify(history));
    
    if (audio) {
        if (Buffer.isBuffer(audio)) {
            formData.append('audio', audio, 'audio.webm');
        } else if (typeof audio === 'string') {
            // Chemin de fichier
            const fileBuffer = fs.readFileSync(audio);
            const fileName = audio.split('/').pop() || 'audio.webm';
            formData.append('audio', fileBuffer, fileName);
        } else {
            // Objet File ou similaire
            formData.append('audio', audio);
        }
    }
    
    return formData;
}

/**
 * Valide une clé API Netic
 * @param {string} apiKey - Clé API à valider
 * @returns {boolean}
 */
export function isValidApiKey(apiKey) {
    return typeof apiKey === 'string' && 
           apiKey.startsWith('netic_') && 
           apiKey.length > 10;
}

/**
 * Formate l'historique de conversation
 * @param {Array} history - Historique brut
 * @returns {Array} Historique formaté
 */
export function formatHistory(history) {
    if (!Array.isArray(history)) return [];
    
    return history.filter(msg => 
        msg && 
        typeof msg === 'object' && 
        ['user', 'assistant'].includes(msg.role) && 
        typeof msg.content === 'string'
    );
}
