// commands/ai/ai.js
import { SlashCommandBuilder } from 'discord.js';
import { aiAsk } from './chatbot.js';

export const data = new SlashCommandBuilder()
  .setName('ai')
  .setDescription('AI utilities')
  .addSubcommand(sub => sub
      .setName('ask')
      .setDescription('Ask the AI a question')
      .addStringOption(opt => opt.setName('question').setDescription('Your question').setRequired(true)))
  .addSubcommand(sub => sub
      .setName('translate')
      .setDescription('Translate text')
      .addStringOption(opt => opt.setName('text').setDescription('Text to translate').setRequired(true))
      .addStringOption(opt => opt.setName('language').setDescription('Target language').setRequired(true)));

export async function execute(interaction) {
  const sub = interaction.options.getSubcommand();

  if (sub === 'ask') {
      const question = interaction.options.getString('question');
      await interaction.deferReply();
      const reply = await aiAsk(interaction.channel.id, question);
      await interaction.editReply(reply);

  } else if (sub === 'translate') {
      const text = interaction.options.getString('text');
      const language = interaction.options.getString('language');
      await interaction.deferReply();
      const prompt = `Translate the following text to ${language}:\n"${text}"\nOnly provide the translation, nothing else.`;
      const translation = await aiAsk(interaction.channel.id, prompt);
      await interaction.editReply(`**Translation (${language}):**\n${translation}`);
  }
}
