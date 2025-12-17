import { EmbedBuilder } from 'discord.js';

const slapGifs = [
  'https://media.giphy.com/media/mEtSQlxqBtWWA/giphy.gif',
  'https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif',
  'https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif',
  'https://media.giphy.com/media/9U5J7xJ4sJ1u0/giphy.gif',
  'https://media.giphy.com/media/Zau0yrl17uzdK/giphy.gif',
  'https://media.giphy.com/media/3XlEk2RxPS1m8/giphy.gif'
];

export async function execute(interaction) {
  const target = interaction.options.getUser('user');

  if (target.id === interaction.user.id) {
    return interaction.reply({ content: "You can't slap yourself... imagine a tap instead! 😅", ephemeral: true });
  }

  const randomGif = slapGifs[Math.floor(Math.random() * slapGifs.length)];

  const embed = new EmbedBuilder()
    .setDescription(`${interaction.user.username} slaps ${target.username}! 😡`)
    .setImage(randomGif)
    .setColor('Random');

  await interaction.reply({ embeds: [embed] });
}
