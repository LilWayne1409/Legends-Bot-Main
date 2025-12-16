import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Say hi to the bot!');

export async function execute(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('👋 Hello!')
        .setDescription(`Hello, ${interaction.user.username}!`)
        .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed] });
}
