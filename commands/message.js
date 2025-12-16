import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('message')
    .setDescription('Send a custom message')
    .addStringOption(option =>
        option.setName('text')
            .setDescription('Your message')
            .setRequired(true)
    );

export async function execute(interaction) {
    const text = interaction.options.getString('text');

    const embed = new EmbedBuilder()
        .setTitle('💬 Custom Message')
        .setDescription(text)
        .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed] });
}
