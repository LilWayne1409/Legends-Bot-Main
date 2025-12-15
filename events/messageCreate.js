import { handleMessage } from '../ai/chatbot.js';

export const name = 'messageCreate';
export const once = false;

export async function execute(client, message) {
    try {
        if (message.author.bot) return;
        client.chatReviver?.updateActivity();
        await handleMessage(message);
    } catch (err) {
        console.error('messageCreate handler error:', err);
    }
}
