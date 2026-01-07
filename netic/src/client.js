import axios from "axios";
import { getApiKey } from "./config.js";
import { createFormData, isValidApiKey, formatHistory } from "./utils.js";

const API_URL = "https://netic.jtheberg.cloud/api/v1/chat";

export class NeticClient {
    constructor(apiKey = null) {
        this.apiKey = apiKey || getApiKey();
        this.baseUrl = API_URL;
        this.history = [];
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
            const response = await axios.post(this.baseUrl, { 
                message, 
                history: chatHistory 
            }, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                timeout: 30000,
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
        const voiceUrl = this.baseUrl.replace('/chat', '/voice');

        try {
            const formData = createFormData({ message, audio, history: chatHistory });

            const response = await axios.post(voiceUrl, formData, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    ...formData.getHeaders(),
                },
                timeout: 60000, // Timeout plus long pour les fichiers audio
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
