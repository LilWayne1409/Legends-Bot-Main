import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('message')
    .setDescription('Send a custom message through the bot.')
    .addStringOption(option =>
        option
            .setName('text')
            .setDescription('The message you want the bot to send.')
            .setRequired(true)
    );

export async function execute(interaction) {
    const text = interaction.options.getString('text');

    const confirmEmbed = new EmbedBuilder().setColor(0x4caf50).setTitle('📩 Message sent!');

    await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });

    const msgEmbed = new EmbedBuilder().setColor(0x8000ff).setDescription(text);
    await interaction.channel.send({ embeds: [msgEmbed] });
}
