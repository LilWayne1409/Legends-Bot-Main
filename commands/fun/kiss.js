import { EmbedBuilder } from 'discord.js';

const kissGifs = [
  'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif',
  'https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.gif',
  'https://media.giphy.com/media/zkppEMFvRX5FC/giphy.gif',
  'https://media.giphy.com/media/bGm9FuBCGg4SY/giphy.gif',
  'https://media.giphy.com/media/11k3oaUjSlFR4I/giphy.gif',
  'https://media.giphy.com/media/hnNyVPIXgLdle/giphy.gif'
];


export async function execute(interaction) {
  const target = interaction.options.getUser('user');

  if (target.id === interaction.user.id) {
    return interaction.reply({ content: "You can't kiss yourself... but here's a virtual kiss! 😘", ephemeral: true });
  }

  const randomGif = kissGifs[Math.floor(Math.random() * kissGifs.length)];

  const embed = new EmbedBuilder()
    .setDescription(`${interaction.user.username} gives ${target.username} a sweet kiss! 😘`)
    .setImage(randomGif)
    .setColor('Random');

  await interaction.reply({ embeds: [embed] });
}
