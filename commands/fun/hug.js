import { EmbedBuilder } from 'discord.js';

const hugGifs = [
  'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',
  'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',
  'https://media.giphy.com/media/wnsgren9NtITS/giphy.gif',
  'https://media.giphy.com/media/143v0Z4767T15e/giphy.gif',
  'https://media.giphy.com/media/xT39D7ubkIUIrgXkso/giphy.gif',
  'https://media.giphy.com/media/HaC1WdpkL3W00/giphy.gif'
];

export const data = { name: 'hug' };

export async function execute(interaction) {
  const user = interaction.options.getUser('user');
  if (!user) return interaction.reply({ content: 'Du musst zuerst jemanden auswählen!', ephemeral: true });
  if (user.id === interaction.user.id) return interaction.reply({ content: "You can't hug yourself! 🤗", ephemeral: true });

  const gif = hugGifs[Math.floor(Math.random() * hugGifs.length)];

  const embed = new EmbedBuilder()
    .setDescription(`${interaction.user.username} gives ${user.username} a big hug! 🤗`)
    .setImage(gif)
    .setColor('Random');

  await interaction.reply({ embeds: [embed] });
}
