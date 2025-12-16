import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

export const deployCommands = async (client, guildId) => {
  const languageChoices = [
    { name: 'Deutsch', value: 'German' },
    { name: 'English', value: 'English' },
    { name: 'Русский', value: 'Russian' },
    { name: '中文', value: 'Chinese' },
    { name: '日本語', value: 'Japanese' },
    { name: 'Dänisch', value: 'Danish' },
    { name: 'Polnisch', value: 'Polish' },
    { name: 'Spanisch', value: 'Spanish' },
    { name: 'Französisch', value: 'French' },
    { name: 'Italienisch', value: 'Italian' },
    { name: 'Portugiesisch', value: 'Portuguese' },
    { name: 'Norwegisch', value: 'Norwegian' },
    { name: 'Schwädisch', value: 'Swedish' }
  ];

  const commands = [
    new SlashCommandBuilder().setName('topic').setDescription('Get a random topic to chat about!'),
    new SlashCommandBuilder().setName('ping').setDescription('Check bot latency!'),
    new SlashCommandBuilder().setName('hello').setDescription('Say hi to the bot!'),
    new SlashCommandBuilder().setName('info').setDescription('Show bot info and commands!'),
    new SlashCommandBuilder()
      .setName('rps')
      .setDescription('Play Rock Paper Scissors with a user')
      .addUserOption(option => option.setName('user').setDescription('User to challenge').setRequired(false)),
    new SlashCommandBuilder()
      .setName('rps_bo3')
      .setDescription('Play Best of 3 Rock Paper Scissors')
      .addUserOption(option => option.setName('user').setDescription('User to challenge').setRequired(false)),
    new SlashCommandBuilder().setName('coinflip').setDescription('Flip a coin'),
    new SlashCommandBuilder().setName('roll').setDescription('Roll a number between 1 and max'),
    new SlashCommandBuilder().setName('meme').setDescription('Get a random meme'),
    new SlashCommandBuilder().setName('joke').setDescription('Get a random joke'),
    new SlashCommandBuilder()
      .setName('8ball')
      .setDescription('Ask the Magic 8 Ball a question')
      .addStringOption(option => option.setName('question').setDescription('Your question').setRequired(true)),
    new SlashCommandBuilder()
      .setName('poll')
      .setDescription('Create a quick poll with ✅/❌ votes')
      .addStringOption(option => option.setName('question').setDescription('The poll question').setRequired(true)),
    new SlashCommandBuilder()
      .setName('ai')
      .setDescription('All AI related commands')
      .addSubcommand(sub =>
        sub.setName('ask')
          .setDescription('Ask something to the AI')
          .addStringOption(option => option.setName('question').setDescription('Your question for the AI').setRequired(true))
      )
      .addSubcommand(sub =>
        sub.setName('translate')
          .setDescription('Translate text to another language')
          .addStringOption(option => option.setName('text').setDescription('Text to translate').setRequired(true))
          .addStringOption(option => 
            option.setName('language')
                  .setDescription('Target language')
                  .setRequired(true)
                  .addChoices(...languageChoices)
          )
      )
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');
    if (guildId) {
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, guildId),
        { body: commands }
      );
      console.log('✅ Guild commands deployed');
    } else {
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
      console.log('✅ Global commands deployed (may take up to 1 hour)');
    }
  } catch (error) {
    console.error('Failed to deploy commands:', error);
  }
};
