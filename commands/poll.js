import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a simple poll')
    .addStringOption(option =>
        option.setName('question')
            .setDescription('Poll question')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('options')
            .setDescription('Comma-separated options (max 5)')
            .setRequired(true)
    );

export async function execute(interaction) {
    const question = interaction.options.getString('question');
    const options = interaction.options.getString('options').split(',').slice(0, 5).map(o => o.trim());

    const embed = new EmbedBuilder()
        .setTitle('📊 Poll')
        .setDescription(question)
        .setColor(0x5865F2)
        .addFields(options.map((o, i) => ({ name: `Option ${i+1}`, value: o, inline: true })));

    await interaction.reply({ embeds: [embed] });
}
