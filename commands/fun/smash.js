// commands/fun/smash.js
import { EmbedBuilder } from 'discord.js';

const smashGifs = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWtiajFibzY2NjZ6YzlzdGFxYzlsenVqa3hpbjViNnIybm1wZTBpeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/5XZatgyewAMaQ/giphy.gif',
  'https://tenor.com/de/view/bubu-dudu-sseeyall-gif-5748791747116434119'
];

export async function execute(interaction) {
  const target = interaction.options.getUser('user');

  if (target.id === interaction.user.id) {
    return interaction.reply({
      content: "Smashing yourself? Go touch grass 🌱",
      ephemeral: true
    });
  }

  const gif = smashGifs[Math.floor(Math.random() * smashGifs.length)];

  const embed = new EmbedBuilder()
    .setDescription(`${interaction.user.username} smashes ${target.username}`)
    .setImage(gif)
    .setColor('Random');

  await interaction.reply({ embeds: [embed] });
}
