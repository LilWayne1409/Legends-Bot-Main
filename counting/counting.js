import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const countingDataFile = path.join(__dirname, 'countingData.json');
const CHANNEL_ID = '1422854718857936897';

let countingData = {};
if (fs.existsSync(countingDataFile)) {
    try {
        countingData = JSON.parse(fs.readFileSync(countingDataFile));
    } catch {
        countingData = {};
    }
}

function saveData() {
    fs.writeFileSync(countingDataFile, JSON.stringify(countingData, null, 2));
}

export const countingEvent = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;
        if (message.channel.id !== CHANNEL_ID) return;

        if (!countingData[CHANNEL_ID]) {
            countingData[CHANNEL_ID] = { current: 0, lastUser: null };
        }

        const content = message.content.trim();

        // 🔒 NUR ZAHLEN ERLAUBEN
        if (!/^\d+$/.test(content)) {
            if (message.deletable) await message.delete();
            return;
        }

        const number = Number(content);
        const { current, lastUser } = countingData[CHANNEL_ID];

        if (number !== current + 1) {
            if (message.deletable) await message.delete();
            return;
        }

        if (message.author.id === lastUser) {
            if (message.deletable) await message.delete();
            return;
        }

        countingData[CHANNEL_ID] = {
            current: number,
            lastUser: message.author.id
        };

        saveData();
    }
};