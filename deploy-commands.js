import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';

const TOKEN = process.env.TOKEN?.trim();
const CLIENT_ID = process.env.CLIENT_ID?.trim();
const GUILD_ID = process.env.GUILD_ID?.trim();

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('💥 Deleting all existing guild commands...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });
    console.log('✅ All old guild commands deleted');

    // ==== Read commands folder ====
    const commandsPath = path.join('./commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    const commands = [];
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      if (command.data) {
        commands.push(command.data.toJSON());
        console.log(`📄 Loaded command: ${command.data.name}`);
      }
    }

    console.log('🔄 Registering new commands...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Slash commands registered successfully!');

  } catch (err) {
    console.error('❌ Error deploying commands:', err);
  }
})();
