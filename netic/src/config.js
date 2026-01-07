let apiKey = null;

/**
 * Configure la clé API Netic à utiliser globalement
 * @param {string} key - La clé API à configurer
 */
export function setApiKey(key) {
    if (!isValidApiKey(key)) {
        throw new Error('Clé API invalide. La clé doit commencer par "netic_" et faire plus de 10 caractères.');
    }
    apiKey = key;
}

/**
 * Récupère la clé API configurée
 * @returns {string|null} La clé API configurée ou null
 */
export function getApiKey() {
    return apiKey;
}

/**
 * Supprime la clé API configurée
 */
export function clearApiKey() {
    apiKey = null;
}

/**
 * Valide une clé API Netic
 * @param {string} apiKey - Clé API à valider
 * @returns {boolean}
 */
function isValidApiKey(apiKey) {
    return typeof apiKey === 'string' && 
           apiKey.startsWith('netic_') && 
           apiKey.length > 10;
}
