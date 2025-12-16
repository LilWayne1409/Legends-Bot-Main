import { SlashCommandBuilder } from 'discord.js';
import { RPSView, RPSBo3View } from '../../rps.js'; // Pfad zu deiner bestehenden RPS-Logik

export const data = new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock Paper Scissors with another player')
    .addUserOption(option =>
        option.setName('opponent')
            .setDescription('The user you want to challenge')
            .setRequired(true))
    .addBooleanOption(option =>
        option.setName('bo3')
            .setDescription('Play best-of-3 (true/false)')
            .setRequired(false));

export async function execute(interaction) {
    const opponent = interaction.options.getUser('opponent');
    const bo3 = interaction.options.getBoolean('bo3') || false;

    // Fehlerchecks
    if (opponent.bot) 
        return interaction.reply({ content: "You cannot challenge a bot!", ephemeral: true });
    if (opponent.id === interaction.user.id) 
        return interaction.reply({ content: "You cannot challenge yourself!", ephemeral: true });

    // Spiel starten
    if (bo3) {
        const game = new RPSBo3View(interaction.user, opponent, interaction);
        await game.start();
    } else {
        const game = new RPSView(interaction.user, opponent, interaction);
        await game.start();
    }
}
