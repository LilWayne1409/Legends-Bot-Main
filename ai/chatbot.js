import { getRandomTopic } from '../commands/topic.js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const historyFile = path.join(__dirname, '..', 'data', 'messageHistory.json');

const MAX_CONTEXT = 6;
const MAX_CHARS = 200;

let messageHistory = {};
if (fs.existsSync(historyFile)) {
    try { messageHistory = JSON.parse(fs.readFileSync(historyFile, 'utf8')); } catch { messageHistory = {}; }
}

function saveHistory() { fs.writeFileSync(historyFile, JSON.stringify(messageHistory, null, 2)); }

function trimHistory(channelId) {
    if (messageHistory[channelId].length > MAX_CONTEXT) {
        messageHistory[channelId].splice(0, messageHistory[channelId].length - MAX_CONTEXT);
    }
}

function saveBotReply(channelId, text) {
    if (!messageHistory[channelId]) messageHistory[channelId] = [];
    messageHistory[channelId].push({ author: 'Legend Bot', content: text, timestamp: Date.now() });
    trimHistory(channelId);
    saveHistory();
}

const ai = new OpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: process.env.OPENROUTER_KEY });

const responses = [
    {
        patterns: [/^\s*(hi|hello|hey|yo|hiya|greetings|what's up|howdy)\s*$/i],
        replies: [
            'Hey there! 👋', 'Hello! How’s it going?', 'Hi! Nice to see you here!', 'Yo! How’s your day?', 'Hiya! What’s up?', 'Greetings! 😄'
        ]
    },
    { patterns: [/bored/i], replies: ["Sounds like you need something fun 😎 Try /rps or /rps_bo3 🕹"] },
    { patterns: [/give me a topic|topic pls|send me a topic|random topic/i], replies: [() => getRandomTopic()] }
];

export async function handleMessage(message) {
    try {
        if (!message.content || message.author.bot) return;
        const channelId = message.channel.id;
        if (!messageHistory[channelId]) messageHistory[channelId] = [];

        messageHistory[channelId].push({ author: message.author.username, content: message.content, timestamp: Date.now() });
        trimHistory(channelId);
        saveHistory();

        const clientUser = message.client?.user;
        if (!clientUser || !message.mentions || !message.mentions.has(clientUser)) return;

        let content = message.content.replace(/<@!?(\d+)>/, '').trim();
        if (!content) return;

        if (content.length > MAX_CHARS) {
            content = content.slice(0, MAX_CHARS) + '...';
            try { await message.reply('⚠️ Your message was too long and has been shortened.'); } catch {}
        }

        for (const r of responses) {
            if (r.patterns.some(p => p.test(content))) {
                const choice = r.replies[Math.floor(Math.random() * r.replies.length)];
                const reply = typeof choice === 'function' ? choice() : choice;
                saveBotReply(channelId, reply);
                try { await message.reply(reply); } catch {}
                return;
            }
        }

        const gptReply = await gptFallback(channelId, content);
        saveBotReply(channelId, gptReply);
        try { await message.reply(gptReply); } catch {}

    } catch (err) {
        console.error('Unhandled error in handleMessage:', err);
        try { await message.reply('⚠️ An unexpected error occurred. Try again later.'); } catch {}
    }
}

export async function aiAsk(channelId, userMessage) {
    return await gptFallback(channelId, userMessage);
}

async function gptFallback(channelId, userMessage) {
    try {
        const history = messageHistory[channelId] || [];
        const formattedHistory = history.filter(m => m.content).map(m => m.author === 'Legend Bot' ? m.content : `User: ${m.content}`).join('\n');
        const fullPrompt = `\nConversation so far:\n\n${formattedHistory}\n\nUser says: ${userMessage}\n\nYou are Legend Bot, a relaxed, fun Discord buddy. - Answer short and naturally, like a friend.`;

        if (!ai?.chat?.completions?.create) return '⚠️ AI client not ready.';

        const response = await ai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are Legend Bot, a Discord chat buddy.' },
                { role: 'user', content: fullPrompt }
            ],
            max_tokens: 200
        });

        return response?.choices?.[0]?.message?.content || '⚠️ No response.';
    } catch (err) {
        console.error('GPT Fallback error:', err);
        return "⚠️ Sorry, I can't answer right now.";
    }
}
