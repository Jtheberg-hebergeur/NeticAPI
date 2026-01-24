import { NeticClient, chat, chatWithAudio, uploadImage, getImageStatus } from './client.js';
import { setApiKey, getApiKey, clearApiKey } from './config.js';
import { createFormData, createImageFormData, isValidApiKey, formatHistory } from './utils.js';

export {
    NeticClient,
    chat,
    chatWithAudio,
    uploadImage,
    getImageStatus,
    setApiKey,
    getApiKey,
    clearApiKey,
    createFormData,
    createImageFormData,
    isValidApiKey,
    formatHistory
};
