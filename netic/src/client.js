import axios from "axios";
import { getApiKey } from "./config.js";
import { createFormData, createImageFormData, isValidApiKey, formatHistory } from "./utils.js";

const API_BASE_URL = "https://api.neticai.fr/v1";

const API_ENDPOINTS = {
    chat: `${API_BASE_URL}/chat`,
    voice: `${API_BASE_URL}/voice`,
    image: `${API_BASE_URL}/image`,
    usage: `${API_BASE_URL}/usage`
};

export class NeticClient {
    constructor(apiKey = null) {
        this.apiKey = apiKey || getApiKey();
        this.baseUrl = API_BASE_URL;
        this.endpoints = API_ENDPOINTS;
        this.history = [];
        this.timeout = {
            chat: 30000,
            voice: 60000,
            image: 60000,
            status: 10000
        };
    }

    setApiKey(key) {
        if (!isValidApiKey(key)) {
            throw new Error("Invalid API key format. Expected format: netic_*");
        }
        this.apiKey = key;
    }

    /**
     * Envoie un message texte à l'API
     * @param {string} message - Message à envoyer
     * @param {Array} [history] - Historique de conversation optionnel
     * @returns {Promise<Object>} Réponse de l'API
     */
    async chat(message, history = null) {
        if (!this.apiKey) {
            throw new Error("API key not set. Provide it in constructor or use setApiKey()");
        }

        const chatHistory = history !== null ? formatHistory(history) : this.history;

        try {
            const response = await axios.post(this.endpoints.chat, { 
                message, 
                history: chatHistory 
            }, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                timeout: this.timeout.chat,
            });

            // Mettre à jour l'historique si on utilise l'historique interne
            if (history === null) {
                this.history.push(
                    { role: "user", content: message },
                    { role: "assistant", content: response.data.response }
                );
            }

            return response.data;

        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Envoie un message avec un fichier audio
     * @param {Object} options - Options de la requête
     * @param {string} options.message - Message ou transcription
     * @param {File|Buffer|string} [options.audio] - Fichier audio
     * @param {Array} [options.history] - Historique de conversation
     * @returns {Promise<Object>} Réponse de l'API
     */
    async chatWithAudio({ message, audio, history = null }) {
        if (!this.apiKey) {
            throw new Error("API key not set. Provide it in constructor or use setApiKey()");
        }

        if (!audio) {
            throw new Error("Audio file is required for chatWithAudio");
        }

        const chatHistory = history !== null ? formatHistory(history) : this.history;

        try {
            const formData = createFormData({ message, audio, history: chatHistory });

            const response = await axios.post(this.endpoints.voice, formData, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    ...formData.getHeaders(),
                },
                timeout: this.timeout.voice,
            });

            // Mettre à jour l'historique si on utilise l'historique interne
            if (history === null) {
                this.history.push(
                    { role: "user", content: message },
                    { role: "assistant", content: response.data.response }
                );
            }

            return response.data;

        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Upload une image et obtient une analyse par IA
     * @param {Object} options - Options de l'upload
     * @param {File|Buffer|string} options.image - Fichier image
     * @param {string} [options.prompt] - Question ou instruction personnalisée pour l'analyse IA
     * @returns {Promise<Object>} Réponse de l'API avec l'analyse
     */
    async uploadImage({ image, prompt }) {
        if (!this.apiKey) {
            throw new Error("API key not set. Provide it in constructor or use setApiKey()");
        }

        if (!image) {
            throw new Error("Image file is required for uploadImage");
        }



        try {
            const formData = createImageFormData({ image, prompt });

            const response = await axios.post(this.endpoints.image, formData, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    ...formData.getHeaders(),
                },
                timeout: this.timeout.image,
            });

            return response.data;

        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Vérifie le statut de l'API d'upload d'images
     * @returns {Promise<Object>} Statut de l'API
     */
    async getImageStatus() {
        try {
            const response = await axios.get(this.endpoints.image, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
                timeout: this.timeout.status,
            });

            return response.data;

        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Vide l'historique de conversation interne
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Récupère l'historique de conversation interne
     * @returns {Array} Historique actuel
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Configure les timeouts pour les différentes requêtes
     * @param {Object} timeouts - Objets avec les timeouts en millisecondes
     * @param {number} [timeouts.chat=30000] - Timeout pour le chat
     * @param {number} [timeouts.voice=60000] - Timeout pour la voix
     * @param {number} [timeouts.image=60000] - Timeout pour les images
     * @param {number} [timeouts.status=10000] - Timeout pour le statut
     */
    setTimeouts(timeouts) {
        this.timeout = { ...this.timeout, ...timeouts };
    }

    /**
     * Obtient des statistiques sur l'utilisation de l'API
     * @returns {Promise<Object>} Statistiques d'utilisation
     */
    async getUsageStats() {
        try {
            const response = await axios.get(this.endpoints.usage, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
                timeout: this.timeout.status,
            });

            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Vérifie la validité de la clé API
     * @returns {Promise<boolean>} True si la clé est valide
     */
    async validateApiKey() {
        try {
            await this.getImageStatus();
            return true;
        } catch (error) {
            if (error.message.includes("Unauthorized")) {
                return false;
            }
            throw error;
        }
    }

    /**
     * Gère les erreurs de l'API
     * @private
     */
    _handleError(error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.error || error.response.statusText;
            
            switch (status) {
                case 401:
                    return new Error("Unauthorized: Invalid or missing API key");
                case 403:
                    if (message.includes('audio')) {
                        return new Error("Forbidden: Audio feature not enabled for this API key");
                    }
                    return new Error("Forbidden: API key not approved or has been revoked");
                case 429:
                    return new Error("Too Many Requests: Quota exceeded");
                case 400:
                    return new Error(`Bad Request: ${message}`);
                case 500:
                    return new Error("Internal Server Error: Please try again later");
                default:
                    return new Error(`HTTP ${status}: ${message}`);
            }
        } else if (error.request) {
            return new Error("Network error: Unable to reach Netic API");
        } else {
            return new Error(`Request error: ${error.message}`);
        }
    }
}

// Fonctions utilitaires pour compatibilité
export async function chat(message, apiKey = null, history = null) {
    const client = new NeticClient(apiKey);
    return client.chat(message, history);
}

export async function chatWithAudio(options, apiKey = null) {
    const client = new NeticClient(apiKey);
    return client.chatWithAudio(options);
}

/**
 * Upload une image et obtient une analyse par IA (fonction utilitaire)
 * @param {Object} options - Options de l'upload
 * @param {File|Buffer|string} options.image - Fichier image
 * @param {string} [options.prompt] - Question ou instruction personnalisée
 * @param {string} [apiKey] - Clé API (optionnel si configurée globalement)
 * @returns {Promise<Object>} Réponse de l'API avec l'analyse
 */
export async function uploadImage(options, apiKey = null) {
    const client = new NeticClient(apiKey);
    return client.uploadImage(options);
}

/**
 * Vérifie le statut de l'API d'upload d'images (fonction utilitaire)
 * @param {string} [apiKey] - Clé API (optionnel si configurée globalement)
 * @returns {Promise<Object>} Statut de l'API
 */
export async function getImageStatus(apiKey = null) {
    const client = new NeticClient(apiKey);
    return client.getImageStatus();
}

/**
 * Obtient des statistiques sur l'utilisation de l'API (fonction utilitaire)
 * @param {string} [apiKey] - Clé API (optionnel si configurée globalement)
 * @returns {Promise<Object>} Statistiques d'utilisation
 */
export async function getUsageStats(apiKey = null) {
    const client = new NeticClient(apiKey);
    return client.getUsageStats();
}

/**
 * Vérifie la validité de la clé API (fonction utilitaire)
 * @param {string} [apiKey] - Clé API (optionnel si configurée globalement)
 * @returns {Promise<boolean>} True si la clé est valide
 */
export async function validateApiKey(apiKey = null) {
    const client = new NeticClient(apiKey);
    return client.validateApiKey();
}
