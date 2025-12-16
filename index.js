import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Client, GatewayIntentBits, Collection } from 'discord.js';

const TOKEN = process.env.TOKEN?.trim();
const CLIENT_ID = process.env.CLIENT_ID?.trim();
const GUILD_ID = process.env.GUILD_ID?.trim();
const OPENROUTER_KEY = process.env.OPENROUTER_KEY?.trim();

// Sicherheits-Log, damit VS Code die Variablen nutzt
console.log('✅ Loaded env variables:');
console.log('TOKEN:', TOKEN ? '✅' : '❌');
console.log('CLIENT_ID:', CLIENT_ID ? '✅' : '❌');
console.log('GUILD_ID:', GUILD_ID ? '✅' : '❌');
console.log('OPENROUTER_KEY:', OPENROUTER_KEY ? '✅' : '❌');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// ------------------- Load Events -------------------
async function loadEvents() {
  const eventsDir = path.join(process.cwd(), 'events');
  if (!fs.existsSync(eventsDir)) return;

  for (const file of fs.readdirSync(eventsDir).filter(f => f.endsWith('.js'))) {
    const eventMod = await import(pathToFileURL(path.join(eventsDir, file)).href);
    const ev = eventMod.default || eventMod;
    if (!ev || !ev.name || !ev.execute) continue;
    if (ev.once) client.once(ev.name, (...args) => ev.execute(client, ...args));
    else client.on(ev.name, (...args) => ev.execute(client, ...args));
  }
}

// ------------------- Load Commands -------------------
async function loadCommands(dir = path.join(process.cwd(), 'commands')) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await loadCommands(path.join(dir, entry.name));
    } else if (entry.name.endsWith('.js')) {
      const cmdPath = path.join(dir, entry.name);
      const cmd = await import(pathToFileURL(cmdPath).href);
      const mod = cmd.default || cmd;
      if (mod.data && mod.execute) client.commands.set(mod.data.name, mod);
    }
  }
}

// ------------------- Ready -------------------
(async () => {
  await loadEvents();
  await loadCommands();

  client.once('ready', () => {
    console.log(`✅ ${client.user.tag} ready`);
    // NICHTS: Keine automatische Registrierung
    console.log('Loaded', client.commands.size, 'commands');
  });

  await client.login(TOKEN);
})();
