import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin: Heads or Tails');

export async function execute(interaction) {
    const outcomes = ['Heads', 'Tails'];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];

    const embed = new EmbedBuilder()
        .setTitle('🪙 Coin Flip!')
        .setDescription(`You flipped: **${result}**`)
        .setColor(result === 'Heads' ? 0x1abc9c : 0xe74c3c)
        .setFooter({ text: 'Try your luck again!' });

    // sofort antworten
    await interaction.reply({ embeds: [embed] });
}
