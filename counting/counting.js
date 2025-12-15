import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const countingDataFile = path.join(__dirname, 'countingData.json');

let countingData = {};
if (fs.existsSync(countingDataFile)) {
    try { countingData = JSON.parse(fs.readFileSync(countingDataFile)); } catch (err) { console.error('Fehler beim Lesen der JSON-Datei, erstelle neue...', err); countingData = {}; fs.writeFileSync(countingDataFile, JSON.stringify(countingData, null, 2)); }
} else {
    fs.writeFileSync(countingDataFile, JSON.stringify(countingData, null, 2));
}

function saveData() { fs.writeFileSync(countingDataFile, JSON.stringify(countingData, null, 2)); }

export const countingEvent = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const channelId = '1422854718857936897';
        if (message.channel.id !== channelId) return;

        if (!countingData[channelId]) { countingData[channelId] = { current: 885, lastUser: null }; }

        const current = countingData[channelId].current;
        const lastUser = countingData[channelId].lastUser || null;

        const number = parseInt(message.content.trim());
        if (isNaN(number)) { message.delete().catch(() => {}); return; }
        if (number !== current + 1) { message.delete().catch(() => {}); return; }
        if (message.author.id === lastUser) { message.delete().catch(() => {}); return; }

        countingData[channelId] = { current: number, lastUser: message.author.id };
        saveData();
    }
};
