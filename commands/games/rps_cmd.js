import { SlashCommandBuilder } from 'discord.js';
import { RPSView, RPSBo3View } from './rps.js';

export const data = new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock Paper Scissors')
    .addUserOption(opt => opt.setName('user').setDescription('Opponent').setRequired(false))
    .addStringOption(opt => opt.setName('mode').setDescription('Mode: single or bo3').addChoices(
        { name: 'single', value: 'single' },
        { name: 'bo3', value: 'bo3' }
    ));

export async function execute(interaction) {
    const user = interaction.options.getUser('user') || { id: 'legendbot', username: 'Legend Bot 🤖' };
    const mode = interaction.options.getString('mode') || 'single';

    if (mode === 'bo3') {
        const game = new RPSBo3View(interaction.user, user, interaction);
        await game.start();
    } else {
        const game = new RPSView(interaction.user, user, interaction);
        await game.start();
    }
}
