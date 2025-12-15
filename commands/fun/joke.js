import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke (dark or trollish)');

export async function execute(interaction) {
    const jokes = [
        "Why don’t graveyards ever get overcrowded? People are dying to get in.",
        "I have a stepladder because my real ladder left when I was a kid.",
        "Parallel lines have so much in common… it’s a shame they’ll never meet.",
        "Why don’t cannibals eat clowns? Because they taste funny."
    ];
    const selected = jokes[Math.floor(Math.random() * jokes.length)];
    await interaction.reply(selected);
}
