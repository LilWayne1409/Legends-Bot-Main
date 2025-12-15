import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';

const TOKEN = process.env.TOKEN?.trim();
const CLIENT_ID = process.env.CLIENT_ID?.trim();
const GUILD_ID = process.env.GUILD_ID?.trim();

function readCommandFiles(dir) {
    const commands = [];
    for (const file of fs.readdirSync(dir)) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) commands.push(...readCommandFiles(full));
        else if (file.endsWith('.js')) commands.push(full);
    }
    return commands;
}

async function main() {
    const commandsPath = path.join(process.cwd(), 'commands');
    if (!fs.existsSync(commandsPath)) {
        console.error('commands directory not found');
        return;
    }

    const files = readCommandFiles(commandsPath);
    const commandData = [];

    for (const f of files) {
        try {
            const mod = await import(pathToFileURL(f).href);
            if (mod.data) commandData.push(mod.data.toJSON ? mod.data.toJSON() : mod.data);
            else if (mod.default && mod.default.data) commandData.push(mod.default.data.toJSON ? mod.default.data.toJSON() : mod.default.data);
        } catch (err) {
            console.warn('Failed to import command', f, err.message || err);
        }
    }

    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        console.log('Registering', commandData.length, 'commands...');
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commandData });
        console.log('Registered commands.');
    } catch (err) {
        console.error('Failed registering commands:', err);
    }
}

import { pathToFileURL } from 'url';
main();
