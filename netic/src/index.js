import { NeticClient, chat, chatWithAudio, uploadImage, getImageStatus, getUsageStats, validateApiKey } from './client.js';
import { setApiKey, getApiKey, clearApiKey } from './config.js';
import { createFormData, createImageFormData, isValidApiKey, formatHistory } from './utils.js';

export {
    NeticClient,
    chat,
    chatWithAudio,
    uploadImage,
    getImageStatus,
    getUsageStats,
    validateApiKey,
    setApiKey,
    getApiKey,
    clearApiKey,
    createFormData,
    createImageFormData,
    isValidApiKey,
    formatHistory
};
