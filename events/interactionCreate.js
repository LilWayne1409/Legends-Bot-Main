import { RPSView, RPSBo3View } from '../commands/games/rps.js';
import { getRandomTopic } from '../commands/topic.js';
import { aiAsk } from '../ai/chatbot.js';

// Commands laden
import * as infoCommand from '../commands/info.js';

export const name = 'interactionCreate';
export const once = false;

export async function execute(client, interaction) {
    try {
        if (interaction.isCommand()) {
            const cmd = interaction.commandName;

            // /info wird extra behandelt
            if (cmd === 'info') {
                await infoCommand.execute(interaction, client);
                return;
            }

            switch (cmd) {
                case 'topic':
                    await interaction.reply(`💡 Here's a topic for you: ${getRandomTopic()}`);
                    break;
                case 'ping':
                    await interaction.reply(`Pong! 🏓 ${Math.round(client.ws.ping)}ms`);
                    break;
                case 'hello':
                    await interaction.reply(`Hey ${interaction.user}! 👋`);
                    break;
                case 'coinflip': {
                    const command = await import('../commands/fun/coinflip.js');
                    await command.execute(interaction);
                    break;
                }
                case 'roll': {
                    const command = await import('../commands/fun/roll.js');
                    await command.execute(interaction);
                    break;
                }
                case 'meme': {
                    const command = await import('../commands/fun/meme.js');
                    await command.execute(interaction);
                    break;
                }
                case 'joke': {
                    const command = await import('../commands/fun/joke.js');
                    await command.execute(interaction);
                    break;
                }
                case '8ball': {
                    const command = await import('../commands/fun/8ball.js');
                    await command.execute(interaction);
                    break;
                }
                case 'poll': {
                    const command = await import('../commands/poll.js');
                    await command.execute(interaction);
                    break;
                }
                case 'rps': {
                    const user = interaction.options.getUser('user') || { id: 'legendbot', username: 'Legend Bot 🤖' };
                    const game = new RPSView(interaction.user, user, interaction);
                    await game.start();
                    break;
                }
                case 'rps_bo3': {
                    const user = interaction.options.getUser('user') || { id: 'legendbot', username: 'Legend Bot 🤖' };
                    const game = new RPSBo3View(interaction.user, user, interaction);
                    await game.start();
                    break;
                }
                case 'message': {
                    const command = await import('../commands/message.js');
                    await command.default.execute(interaction);
                    break;
                }
                case 'ai': {
                    const sub = interaction.options.getSubcommand();
                    await interaction.deferReply();
                    await interaction.channel.sendTyping();

                    if (sub === 'ask') {
                        const question = interaction.options.getString('question');
                        const reply = await aiAsk(interaction.channel.id, question);
                        await interaction.editReply(reply);
                    } else if (sub === 'translate') {
                        const text = interaction.options.getString('text');
                        const language = interaction.options.getString('language');
                        const prompt = `Translate the following text to ${language}:\n"${text}"\nOnly provide the translation, nothing else.`;
                        const translation = await aiAsk(interaction.channel.id, prompt);
                        await interaction.editReply(`**Translation (${language}):**\n${translation}`);
                    }
                    break;
                }
            }
        }

        // /info SelectMenu
        if (interaction.isStringSelectMenu() && interaction.customId === 'info_select') {
            await infoCommand.handleSelectMenu(interaction);
        }

    } catch (err) {
        console.error('❌ Interaction error:', err);
        if (!interaction.replied) await interaction.reply({ content: 'Error while executing command', ephemeral: true });
    }
}
