import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Client, GatewayIntentBits, Collection } from 'discord.js';

const TOKEN = process.env.TOKEN?.trim();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

// Load counting module
async function loadCounting() {
    try {
        const { countingEvent } = await import('./counting/counting.js').catch(() => ({}));
        if (countingEvent) client.on(countingEvent.name, (...args) => countingEvent.execute(...args, client));
    } catch (err) {
        console.warn('No counting module found or failed to load:', err?.message || err);
    }
}

// Load events
async function loadEvents() {
    const eventsDir = path.join(process.cwd(), 'events');
    if (!fs.existsSync(eventsDir)) return;

    for (const file of fs.readdirSync(eventsDir).filter(f => f.endsWith('.js'))) {
        try {
            const eventMod = await import(`./events/${file}`);
            const ev = eventMod.default || eventMod;
            if (!ev || !ev.name || !ev.execute) continue;
            if (ev.once) client.once(ev.name, (...args) => ev.execute(client, ...args));
            else client.on(ev.name, (...args) => ev.execute(client, ...args));
        } catch (err) {
            console.error('Failed loading event', file, err);
        }
    }
}

// Load commands
async function loadCommands(dir = './commands') {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            await loadCommands(path.join(dir, entry.name));
        } else if (entry.name.endsWith('.js')) {
            const cmdPath = path.join(process.cwd(), dir, entry.name);
            const cmd = await import(pathToFileURL(cmdPath).href);
            if (cmd.data && cmd.execute) client.commands.set(cmd.data.name, cmd);
        }
    }
}

// Start bot
(async () => {
    await loadCounting();
    await loadEvents();
    await loadCommands();
    client.once('ready', () => console.log(`✅ ${client.user.tag} ready`));
    await client.login(TOKEN).catch(err => console.error('Login failed:', err));
})();