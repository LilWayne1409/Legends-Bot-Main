import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme');

export async function execute(interaction) {
    try {
        const res = await fetch('https://meme-api.com/gimme');
        if (!res.ok) throw new Error(`API returned status ${res.status}`);
        const json = await res.json();

        const embed = new EmbedBuilder()
            .setTitle(json.title)
            .setImage(json.url)
            .setURL(json.postLink)
            .setColor(0xFF4500);

        await interaction.reply({ embeds: [embed] });
    } catch (err) {
        console.error('Error fetching meme:', err);
        await interaction.reply({ 
            content: '⚠️ Couldn\'t fetch a meme right now, try again later!', 
            ephemeral: true 
        });
    }
}
