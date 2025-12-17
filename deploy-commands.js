<<<<<<< HEAD
import { SlashCommandBuilder } from '@discordjs/builders';
=======
>>>>>>> e700fa6 (Initial commit)
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
<<<<<<< HEAD
import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const deployCommands = async (client, guildId) => {
  if (!guildId) {
    console.error('❌ Please provide a GUILD_ID for deployment. Guild Commands only.');
    return;
  }

  const languageChoices = [
    { name: 'Deutsch', value: 'German' },
    { name: 'English', value: 'English' },
    { name: 'Русский', value: 'Russian' },
    { name: '中文', value: 'Chinese' },
    { name: '日本語', value: 'Japanese' },
    { name: 'Dänisch', value: 'Danish' },
    { name: 'Polnisch', value: 'Polish' },
    { name: 'Spanisch', value: 'Spanish' },
    { name: 'Französisch', value: 'French' },
    { name: 'Italienisch', value: 'Italian' },
    { name: 'Portugiesisch', value: 'Portuguese' },
    { name: 'Norwegisch', value: 'Norwegian' },
    { name: 'Schwädisch', value: 'Swedish' }
  ];

  const commands = [
    new SlashCommandBuilder().setName('topic').setDescription('Get a random topic to chat about!'),
    new SlashCommandBuilder().setName('ping').setDescription('Check bot latency!'),
    new SlashCommandBuilder().setName('hello').setDescription('Say hi to the bot!'),
    new SlashCommandBuilder().setName('info').setDescription('Show bot info and commands!'),
    new SlashCommandBuilder()
      .setName('rps')
      .setDescription('Play Rock Paper Scissors with a user')
      .addUserOption(option => option.setName('user').setDescription('User to challenge').setRequired(false)),
    new SlashCommandBuilder()
      .setName('rps_bo3')
      .setDescription('Play Best of 3 Rock Paper Scissors')
      .addUserOption(option => option.setName('user').setDescription('User to challenge').setRequired(false)),
    new SlashCommandBuilder().setName('coinflip').setDescription('Flip a coin'),
    new SlashCommandBuilder().setName('roll').setDescription('Roll a number between 1 and max'),
    new SlashCommandBuilder().setName('meme').setDescription('Get a random meme'),
    new SlashCommandBuilder().setName('joke').setDescription('Get a random joke'),
    new SlashCommandBuilder()
      .setName('8ball')
      .setDescription('Ask the Magic 8 Ball a question')
      .addStringOption(option => option.setName('question').setDescription('Your question').setRequired(true)),
    new SlashCommandBuilder()
      .setName('poll')
      .setDescription('Create a quick poll with ✅/❌ votes')
      .addStringOption(option => option.setName('question').setDescription('The poll question').setRequired(true)),
    new SlashCommandBuilder()
      .setName('ai')
      .setDescription('All AI related commands')
      .addSubcommand(sub =>
        sub.setName('ask')
          .setDescription('Ask something to the AI')
          .addStringOption(option => option.setName('question').setDescription('Your question for the AI').setRequired(true))
      )
      .addSubcommand(sub =>
        sub.setName('translate')
          .setDescription('Translate text to another language')
          .addStringOption(option => option.setName('text').setDescription('Text to translate').setRequired(true))
          .addStringOption(option =>
            option.setName('language')
                  .setDescription('Target language')
                  .setRequired(true)
                  .addChoices(...languageChoices)
          )
      )
  ];

  // Lade Commands aus commands-Ordner
  async function loadFolderCommands(dir = path.join(process.cwd(), 'commands')) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        await loadFolderCommands(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.js')) {
        const cmd = await import(pathToFileURL(path.join(dir, entry.name)).href);
        const mod = cmd.default || cmd;
        if (mod.data && typeof mod.data.toJSON === 'function') {
          commands.push(mod.data.toJSON());
        } else {
          console.log(`⚠ Skipped ${entry.name}, not a valid command.`);
        }
      }
    }
  }

  await loadFolderCommands();

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('📦 Deleting old guild commands...');
    const existingGuildCommands = await rest.get(Routes.applicationGuildCommands(client.user.id, guildId));
    for (const cmd of existingGuildCommands) {
      await rest.delete(Routes.applicationGuildCommand(client.user.id, guildId, cmd.id));
    }
    console.log('✅ Old guild commands deleted.');

    console.log('📦 Deleting old global commands...');
    const globalCommands = await rest.get(Routes.applicationCommands(client.user.id));
    console.log(`Found ${globalCommands.length} global commands.`);
    for (const cmd of globalCommands) {
      console.log(`Deleting global command: ${cmd.name}`);
      await rest.delete(Routes.applicationCommand(client.user.id, cmd.id));
    }
    console.log('✅ Old global commands deleted.');

    console.log(`📦 Deploying ${commands.length} guild commands...`);
    await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: commands });
    console.log('✅ Guild commands deployed successfully!');
  } catch (error) {
    console.error('❌ Failed to deploy commands:', error);
  }
};

// Client ready → deploy
client.once('ready', () => {
  console.log(`${client.user.tag} is online.`);
  deployCommands(client, process.env.GUILD_ID);
});

client.login(process.env.TOKEN);
=======
import 'dotenv/config';

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
    console.error('❌ TOKEN, CLIENT_ID oder GUILD_ID fehlt');
    process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function loadCommands(dir = path.join(process.cwd(), 'commands')) {
    const commands = [];
    if (!fs.existsSync(dir)) return commands;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            commands.push(...await loadCommands(full));
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            try {
                const mod = await import(pathToFileURL(full).href);
                const cmd = mod.default || mod;
                if (cmd.data?.toJSON && cmd.execute) commands.push(cmd.data.toJSON());
            } catch (err) {
                console.warn(`⚠️ Fehler beim Laden von ${entry.name}:`, err.message);
            }
        }
    }
    return commands;
}

(async () => {
    try {
        console.log('🧹 Lösche alte Guild Commands...');
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });
        console.log('✅ Alle Guild Commands gelöscht');

        const commands = await loadCommands();
        console.log(`📦 Gefundene Commands: ${commands.map(c => c.name).join(', ')}`);
        console.log(`📦 Deploye ${commands.length} Commands...`);

        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
        console.log('✅ Alle Commands erfolgreich deployed');
        process.exit(0);
    } catch (err) {
        console.error('❌ Deploy fehlgeschlagen:', err);
        process.exit(1);
    }
})();
>>>>>>> e700fa6 (Initial commit)
