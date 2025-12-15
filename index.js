import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits } from 'discord.js';

const TOKEN = process.env.TOKEN?.trim();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

async function loadCounting() {
  try {
    const mod = await import('./counting/counting.js').catch(() => ({}));
    const countingEvent = mod.countingEvent || mod.default;
    if (countingEvent) client.on(countingEvent.name, (...args) => countingEvent.execute(...args));
  } catch (err) {
    console.warn('No counting module found or failed to load:', err?.message || err);
  }
}

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

(async () => {
  await loadCounting();
  await loadEvents();
  client.once('ready', () => console.log('✅ Bot ready'));
  await client.login(TOKEN).catch(err => console.error('Login failed:', err));
})();
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits } from 'discord.js';

const TOKEN = process.env.TOKEN?.trim();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

async function loadCounting() {
  try {
    const mod = await import('./counting/counting.js').catch(() => ({}));
    const countingEvent = mod.countingEvent || mod.default;
    if (countingEvent) client.on(countingEvent.name, (...args) => countingEvent.execute(...args));
  } catch (err) {
    console.warn('No counting module found or failed to load:', err?.message || err);
  }
}

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

(async () => {
  await loadCounting();
  await loadEvents();
  client.once('ready', () => console.log('✅ Bot ready'));
  await client.login(TOKEN).catch(err => console.error('Login failed:', err));
})();
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits } from 'discord.js';

const TOKEN = process.env.TOKEN?.trim();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

async function loadCounting() {
    try {
        const mod = await import('./counting/counting.js').catch(() => ({}));
        const countingEvent = mod.countingEvent || mod.default;
        if (countingEvent) client.on(countingEvent.name, (...args) => countingEvent.execute(...args));
    } catch (err) {
        console.warn('No counting module found or failed to load:', err?.message || err);
    }
}

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

(async () => {
    await loadCounting();
    await loadEvents();
    client.once('ready', () => console.log('✅ Bot ready'));
    await client.login(TOKEN).catch(err => console.error('Login failed:', err));
})();
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits } from 'discord.js';

const TOKEN = process.env.TOKEN?.trim();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Safe: load counting listener if present
try {
    const mod = await import('./counting/counting.js').catch(() => ({}));
    const countingEvent = mod.countingEvent || mod.default;
    if (countingEvent) client.on(countingEvent.name, (...args) => countingEvent.execute(...args));
} catch (err) {
    console.warn('No counting module found or failed to load:', err?.message || err);
}

// Load event handlers from `events/`
const eventsDir = path.join(process.cwd(), 'events');
if (fs.existsSync(eventsDir)) {
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
} else {
    console.warn('Events directory not found:', eventsDir);
}

client.login(TOKEN).catch(err => console.error('Login failed:', err));
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits } from 'discord.js';

const TOKEN = process.env.TOKEN?.trim();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Load counting event if available
try {
    const mod = await import('./counting/counting.js').catch(() => ({}));
    const countingEvent = mod.countingEvent || mod.default;
    if (countingEvent) client.on(countingEvent.name, (...args) => countingEvent.execute(...args));
} catch (err) {
    console.warn('No counting module found or failed to load:', err?.message || err);
}

// Load event handlers from events/
const eventsDir = path.join(process.cwd(), 'events');
if (fs.existsSync(eventsDir)) {
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
} else {
    console.warn('Events directory not found:', eventsDir);
}

client.login(TOKEN).catch(err => console.error('Login failed:', err));
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits } from 'discord.js';

const TOKEN = process.env.TOKEN?.trim();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

try {
    const { countingEvent } = (await import('./counting/counting.js')) || {};
    if (countingEvent) client.on(countingEvent.name, (...args) => countingEvent.execute(...args));
} catch (err) {
    console.warn('No counting module found or failed to load:', err?.message || err);
}

const eventsDir = path.join(process.cwd(), 'events');
if (fs.existsSync(eventsDir)) {
    for (const file of fs.readdirSync(eventsDir).filter(f => f.endsWith('.js'))) {
        try {
            const event = await import(`./events/${file}`);
            const ev = event.default || event;
            if (ev.once) client.once(ev.name, (...args) => ev.execute(client, ...args));
            else client.on(ev.name, (...args) => ev.execute(client, ...args));
        } catch (err) {
            console.error('Failed loading event', file, err);
        }
    }
} else {
    console.warn('Events directory not found:', eventsDir);
}

client.login(TOKEN).catch(err => console.error('Login failed:', err));
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits } from 'discord.js';

const TOKEN = process.env.TOKEN?.trim();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Register counting listener (kept as separate module)
try {
    const { countingEvent } = await import('./counting/counting.js');
    client.on(countingEvent.name, (...args) => countingEvent.execute(...args));
} catch (err) {
    console.warn('No counting module found or failed to load:', err?.message || err);
}

// Load events from events/
const eventsDir = path.join(process.cwd(), 'events');
if (fs.existsSync(eventsDir)) {
    for (const file of fs.readdirSync(eventsDir).filter(f => f.endsWith('.js'))) {
        try {
            const event = await import(`./events/${file}`);
            if (event.once) client.once(event.name, (...args) => event.execute(client, ...args));
            else client.on(event.name, (...args) => event.execute(client, ...args));
        } catch (err) {
            console.error('Failed loading event', file, err);
        }
    }
} else {
    console.warn('Events directory not found:', eventsDir);
}

client.login(TOKEN);
import 'dotenv/config';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits } from 'discord.js';

const TOKEN = process.env.TOKEN?.trim();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Register counting listener (kept as separate module)
try {
    const { countingEvent } = await import('./counting/counting.js');
    client.on(countingEvent.name, (...args) => countingEvent.execute(...args));
} catch (err) {
    console.warn('No counting module found or failed to load:', err?.message || err);
}

// Load events from events/
const eventsDir = path.join(process.cwd(), 'events');
if (fs.existsSync(eventsDir)) {
    for (const file of fs.readdirSync(eventsDir).filter(f => f.endsWith('.js'))) {
        try {
            const event = await import(`./events/${file}`);
            if (event.once) client.once(event.name, (...args) => event.execute(client, ...args));
            else client.on(event.name, (...args) => event.execute(client, ...args));
        } catch (err) {
            console.error('Failed loading event', file, err);
        }
    }
} else {
    console.warn('Events directory not found:', eventsDir);
}

client.login(TOKEN);
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers
        ]
    });

    // Register counting listener (kept as separate module)
    try {
        const { countingEvent } = await import('./counting/counting.js');
        client.on(countingEvent.name, (...args) => countingEvent.execute(...args));
    } catch (err) {
        console.warn('No counting module found or failed to load:', err?.message || err);
    }

    // Load events from events/
    const eventsDir = path.join(process.cwd(), 'events');
    if (fs.existsSync(eventsDir)) {
        for (const file of fs.readdirSync(eventsDir).filter(f => f.endsWith('.js'))) {
            try {
                const event = await import(`./events/${file}`);
                if (event.once) client.once(event.name, (...args) => event.execute(client, ...args));
                else client.on(event.name, (...args) => event.execute(client, ...args));
            } catch (err) {
                console.error('Failed loading event', file, err);
            }
        }
    } else {
        console.warn('Events directory not found:', eventsDir);
    }

    client.login(TOKEN);
                case 'ping':
                    embed.setTitle('🏓 Ping').setDescription(`Your current ping: **${Math.round(client.ws.ping)}ms**`);
                    break;
                case 'topic':
                    embed.setTitle('💡 Topic Generator').setDescription('Use /topic to get a random conversation topic.');
                    break;
            }
            await interaction.update({ embeds: [embed] });
        }

    } catch (err) {
        console.error('Interaction error:', err);
    }
});

// ==== CLIENT READY CONFIRMATION ====
client.once("clientReady", () => {
    console.log("🔥 Bot start was successful!");
});

// ==== LOGIN ====
client.login(TOKEN);
