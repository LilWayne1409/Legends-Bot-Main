import { SlashCommandBuilder } from 'discord.js';
import { aiAsk, aiTranslate } from '../../chatbot.js'; // deine AI-Funktionen

export const data = new SlashCommandBuilder()
    .setName('ai')
    .setDescription('AI commands')
    .addSubcommand(sub =>
        sub.setName('ask')
            .setDescription('Ask a question to the AI')
            .addStringOption(opt => opt.setName('prompt').setDescription('Your question').setRequired(true))
    )
    .addSubcommand(sub =>
        sub.setName('translate')
            .setDescription('Translate text using AI')
            .addStringOption(opt => opt.setName('text').setDescription('Text to translate').setRequired(true))
            .addStringOption(opt => opt.setName('language').setDescription('Target language').setRequired(true))
    );

export async function execute(interaction) {
    if (interaction.options.getSubcommand() === 'ask') {
        const prompt = interaction.options.getString('prompt');
        const answer = await aiAsk(prompt);
        await interaction.reply(answer);
    } else if (interaction.options.getSubcommand() === 'translate') {
        const text = interaction.options.getString('text');
        const language = interaction.options.getString('language');
        const translation = await aiTranslate(text, language);
        await interaction.reply(translation);
    }
}
