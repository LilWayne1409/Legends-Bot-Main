// commands/fun/kill.js
import { EmbedBuilder } from 'discord.js';

const killGifs = [
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDRmcGljNm1lc3RsYWI3Y2d5eDJnNG9zaGk3dGE5cnNwa24yYWFtZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ptmWoT5ZoeStn3PP5v/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzRwenUwbzkxNDNqa3BoNXIwa3k1aHl3bDBnYTA2YWRleHQ4cWhhcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/11HeubLHnQJSAU/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3JubnFmM3hnMHpxN2hlOHZiNDQ2bmc1dm94bTVuMmY5N2Zmc3B5dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/eL3skWtp3Ce6YpzUrw/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3JubnFmM3hnMHpxN2hlOHZiNDQ2bmc1dm94bTVuMmY5N2Zmc3B5dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/oSUNxWvZB88VrJcOZK/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YXJ0aWtqaWZkbTBqdzI5Y3htOTBzazZmMmw2dHBmMWZmZnBsZW40NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/gxKkxCNuVMRLGraAd5/giphy.gif'
];

export async function execute(interaction) {
  const target = interaction.options.getUser('user');

  if (target.id === interaction.user.id) {
    return interaction.reply({
      content: "You can't kill yourself… this ain't that kind of bot 💀",
      ephemeral: true
    });
  }

  const gif = killGifs[Math.floor(Math.random() * killGifs.length)];

  const embed = new EmbedBuilder()
    .setDescription(`${interaction.user.username} *kills* ${target.username} ☠️`)
    .setImage(gif)
    .setColor('Random');

  await interaction.reply({ embeds: [embed] });
}
