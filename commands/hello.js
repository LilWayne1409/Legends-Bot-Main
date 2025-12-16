import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Say hello to the bot');

export async function execute(interaction) {
    await interaction.reply(`Hey ${interaction.user}! 👋`);
}
