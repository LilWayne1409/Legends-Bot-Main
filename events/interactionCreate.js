// events/interactionCreate.js
import path from 'path';
import { pathToFileURL } from 'url';

export const name = 'interactionCreate';
export const once = false;

export async function execute(client, interaction) {
    try {
        if (interaction.isCommand()) {
            const commandName = interaction.commandName;
            const command = client.commands.get(commandName);
            if (!command) {
                // Fallback: try dynamic import (for legacy modules)
                try {
                    const cmdPath = path.join(process.cwd(), 'commands', `${commandName}.js`);
                    const mod = await import(pathToFileURL(cmdPath).href);
                    const fn = mod.execute || (mod.default && mod.default.execute);
                    if (fn) return await fn(interaction, client);
                } catch (e) {
                    console.warn('No command handler found for', commandName);
                }
                return;
            }

            await command.execute(interaction, client);
        }

        // Select menu for info command
        if (interaction.isStringSelectMenu() && interaction.customId === 'info_select') {
            const infoCommand = client.commands.get('info');
            if (infoCommand && infoCommand.handleSelectMenu) await infoCommand.handleSelectMenu(interaction);
        }
    } catch (err) {
        console.error('❌ Interaction error:', err);
        if (!interaction.replied) {
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
        }
    }
}
