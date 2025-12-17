// commands/fun/lick.js
import { EmbedBuilder } from 'discord.js';

const lickGifs = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWVhZnJmaDU2MnNhejhhMmZ1ZnQ4aDFuaWlrcmVmcnA3MTlvNmV2dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/A8ReUjJdMCNOM/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZGJ4end1Ym5oYnFjdWRzZHh1cWFiaW9qb3p6OGk0Yjdmd3pwN3didSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/LQHCGkKx2dhHW/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cDE0bDBxZ2Nidm12MzllcG1mMHI2dDRydGQ2ejdhdnR5NGI0bTFoaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3HEMSqBkXdIyFCyZ2y/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm55MHIxMmluNTZqbTBhNm9iZXdqcXAydG1obndndHdtODJwdTJtaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/N0TtscnTopHCY99WkL/giphy.gif'
];

export async function execute(interaction) {
  const target = interaction.options.getUser('user');

  if (target.id === interaction.user.id) {
    return interaction.reply({
      content: "Licking yourself is… concerning 😐",
      ephemeral: true
    });
  }

  const gif = lickGifs[Math.floor(Math.random() * lickGifs.length)];

  const embed = new EmbedBuilder()
    .setDescription(`${interaction.user.username} licks ${target.username} 😛`)
    .setImage(gif)
    .setColor('Random');

  await interaction.reply({ embeds: [embed] });
}
