import { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js';
import { RPSView, RPSBo3View } from '../commands/games/rps.js';
import { getRandomTopic } from '../commands/topic.js';
import { aiAsk } from '../ai/chatbot.js';

export const name = 'interactionCreate';
export const once = false;

async function handleInfo(interaction, client) {
    try {
        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('📘 Bot Info')
            .setDescription('Choose a category below to learn more about the bot!');

        const menu = new StringSelectMenuBuilder()
            .setCustomId('info_select')
            .setPlaceholder('Select a category')
            .addOptions([
                { label: 'General Info', value: 'main', emoji: '📘' },
                { label: 'AI System', value: 'chatbot', emoji: '🤖' },
                { label: 'Fun', value: 'fun', emoji: '🎉' },
                { label: 'Polls', value: 'poll', emoji: '📊' },
                { label: 'Ping', value: 'ping', emoji: '🏓' },
                { label: 'Topic Generator', value: 'topic', emoji: '💡' }
            ]);

        const row = new ActionRowBuilder().addComponents(menu);
        await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (err) {
        console.error('/info handler error:', err);
        if (!interaction.replied) await interaction.reply({ content: 'Error in /info command', ephemeral: true });
    }
}

export async function execute(client, interaction) {
    try {
        if (interaction.isCommand()) {
            switch (interaction.commandName) {
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
                    const cmd = await import('../commands/fun/coinflip.js');
                    await cmd.execute(interaction);
                    break;
                }
                case 'roll': {
                    const cmd = await import('../commands/fun/roll.js');
                    await cmd.execute(interaction);
                    break;
                }
                case 'meme': {
                    const cmd = await import('../commands/fun/meme.js');
                    await cmd.execute(interaction);
                    break;
                }
                case 'joke': {
                    const cmd = await import('../commands/fun/joke.js');
                    await cmd.execute(interaction);
                    break;
                }
                case '8ball': {
                    const cmd = await import('../commands/fun/8ball.js');
                    await cmd.execute(interaction);
                    break;
                }
                case 'poll': {
                    const cmd = await import('../commands/poll.js');
                    await cmd.execute(interaction);
                    break;
                }
                case 'info':
                    await handleInfo(interaction, client);
                    break;
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
                    const cmd = await import('../commands/message.js');
                    const command = cmd.default || cmd;
                    await command.execute(interaction);
                    break;
                }
                case 'ai': {
                    const sub = interaction.options.getSubcommand();
                    if (sub === 'ask') {
                        const question = interaction.options.getString('question');
                        await interaction.deferReply();
                        await interaction.channel.sendTyping();
                        const reply = await aiAsk(interaction.channel.id, question);
                        await interaction.editReply(reply);
                    } else if (sub === 'translate') {
                        const text = interaction.options.getString('text');
                        const language = interaction.options.getString('language');
                        await interaction.deferReply();
                        await interaction.channel.sendTyping();
                        const prompt = `Translate the following text to ${language}:\n"${text}"\nOnly provide the translation, nothing else.`;
                        const translation = await aiAsk(interaction.channel.id, prompt);
                        await interaction.editReply(`**Translation (${language}):**\n${translation}`);
                    }
                    break;
                }
            }
        }

        if (interaction.isStringSelectMenu() && interaction.customId === 'info_select') {
            const embed = new EmbedBuilder().setColor(0x5865F2);
            switch (interaction.values[0]) {
                case 'main':
                    embed.setTitle('📘 Info').setDescription(`Hey ${interaction.user}! 👋 I’m **Legend Bot**, the official bot of **Lagged Legends**.

**What I can do:**
• Chat with you using AI
• Suggest topics
• Play mini-games
• Keep the server active with chat reviver
• Counting channels
`);
                    break;
                case 'chatbot':
                    embed.setTitle('🤖 Chatbot AI').setDescription(`Legend Bot is an intelligent, fast, and personality-driven AI assistant built to keep the server active, fun, and organized.`);
                    break;
                case 'fun':
                    embed.setTitle('🎉 Fun').setDescription(`Commands: /rps, /rps_bo3, /coinflip, /8ball, /roll, /meme, /joke`);
                    break;
                case 'poll':
                    embed.setTitle('📊 Polls').setDescription('Create quick polls using /poll.');
                    break;
                case 'ping':
                    embed.setTitle('🏓 Ping').setDescription(`Your current ping: **${Math.round(client.ws.ping)}ms**`);
                    break;
                case 'topic':
                    embed.setTitle('💡 Topic Generator').setDescription('Use /topic to get a random conversation topic.');
                    break;
            }
            await interaction.update({ embeds: [embed] });
        }

    } catch (err) {
        console.error('Interaction error:', err);
    }
}
