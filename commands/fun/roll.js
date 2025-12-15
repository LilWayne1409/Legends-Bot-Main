import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a number between 1 and max')
    .addIntegerOption(option =>
        option.setName('max')
            .setDescription('Maximum number to roll')
            .setRequired(false)
    );

export async function execute(interaction) {
    const max = interaction.options.getInteger('max') || 100;
    const roll = Math.floor(Math.random() * max) + 1;
    await interaction.reply(`🎲 You rolled: **${roll}** (1-${max})`);
}
