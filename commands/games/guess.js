// commands/game/guess.js
import { EmbedBuilder } from 'discord.js';

export async function execute(interaction) {
  const guess = interaction.options.getInteger('number');
  const number = Math.floor(Math.random() * 10) + 1;

  let result = '❌ Wrong!';
  if (guess === number) result = '🎉 **Correct!**';

  const embed = new EmbedBuilder()
    .setTitle('🔢 Guess the Number')
    .setDescription(
      `Your guess: **${guess}**\nMy number: **${number}**\n\n${result}`
    )
    .setColor('Random');

  await interaction.reply({ embeds: [embed] });
}
