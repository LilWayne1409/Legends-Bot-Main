import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';

const TOKEN = process.env.TOKEN?.trim();
const CLIENT_ID = process.env.CLIENT_ID?.trim();
const GUILD_ID = process.env.GUILD_ID?.trim();

const rest = new REST({ version: '10' }).setToken(TOKEN);

// Lade alle Command-Dateien
const commands = [];
const commandsPath = path.join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file://${filePath}`);
    if (command.data) commands.push(command.data.toJSON());
}

(async () => {
    try {
        console.log('🔄 Lösche alte Commands im Test-Guild...');
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });

        console.log('🔄 Registriere alle Commands...');
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });

        console.log('✅ Alle Commands wurden registriert!');
    } catch (err) {
        console.error('❌ Fehler beim Registrieren der Commands:', err);
    }
})();