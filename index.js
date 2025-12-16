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
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// Load events
async function loadEvents() {
  const eventsDir = path.join(process.cwd(), 'events');
  if (!fs.existsSync(eventsDir)) return;

  for (const file of fs.readdirSync(eventsDir).filter(f => f.endsWith('.js'))) {
    try {
      const eventMod = await import(pathToFileURL(path.join(eventsDir, file)).href);
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
async function loadCommands(dir = path.join(process.cwd(), 'commands')) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await loadCommands(path.join(dir, entry.name));
    } else if (entry.name.endsWith('.js')) {
      const cmdPath = path.join(dir, entry.name);
      try {
        const cmd = await import(pathToFileURL(cmdPath).href);
        const mod = cmd.default || cmd;
        if (mod.data && mod.execute) client.commands.set(mod.data.name, mod);
      } catch (err) {
        console.error('Failed loading command', cmdPath, err);
      }
    }
  }
}

(async () => {
  await loadEvents();
  await loadCommands();
  client.once('ready', () => console.log(`✅ ${client.user.tag} ready`));
  await client.login(TOKEN).catch(err => console.error('Login failed:', err));
})();
