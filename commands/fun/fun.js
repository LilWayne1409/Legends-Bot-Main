import { SlashCommandBuilder } from 'discord.js';
import * as Coinflip from './coinflip.js';
import * as Joke from './joke.js';
import * as Roll from './roll.js';
import * as Meme from './meme.js';
import * as EightBall from './8ball.js';
import * as Hug from './hug.js';
import * as Kiss from './kiss.js';
import * as Slap from './slap.js';
import * as Kill from './kill.js';
import * as Lick from './lick.js';
import * as Smash from './smash.js';


export const data = new SlashCommandBuilder()
  .setName('fun')
  .setDescription('All fun commands')
  .addSubcommand(sc => sc.setName('coinflip').setDescription('Flip a coin'))
  .addSubcommand(sc => sc.setName('joke').setDescription('Get a random joke'))
  .addSubcommand(sc => sc.setName('roll').setDescription('Roll a number'))
  .addSubcommand(sc => sc.setName('meme').setDescription('Get a random meme'))
  .addSubcommand(sc => sc.setName('8ball').setDescription('Ask the Magic 8 Ball a question')
    .addStringOption(opt => opt.setName('question').setDescription('Your question').setRequired(true))
  )
  .addSubcommand(sc =>
    sc.setName('hug')
      .setDescription('Give someone a hug')
      .addUserOption(opt => opt.setName('user').setDescription('User to hug').setRequired(true))
  )
  .addSubcommand(sc =>
    sc.setName('slap')
      .setDescription('Slap someone')
      .addUserOption(opt => opt.setName('user').setDescription('User to slap').setRequired(true))
  )
  .addSubcommand(sc =>
    sc.setName('kiss')
      .setDescription('Give someone a kiss')
      .addUserOption(opt => opt.setName('user').setDescription('User to kiss').setRequired(true))
  )
  .addSubcommand(sc =>
  sc.setName('kill')
    .setDescription('Kill someone (jokingly)')
    .addUserOption(opt => opt.setName('user').setDescription('User to kill').setRequired(true))
)
.addSubcommand(sc =>
  sc.setName('lick')
    .setDescription('Lick someone')
    .addUserOption(opt => opt.setName('user').setDescription('User to lick').setRequired(true))
)
.addSubcommand(sc =>
  sc.setName('smash')
    .setDescription('Smash someone (meme)')
    .addUserOption(opt => opt.setName('user').setDescription('User to smash').setRequired(true))
);


export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case 'coinflip': await Coinflip.execute(interaction); break;
    case 'joke': await Joke.execute(interaction); break;
    case 'roll': await Roll.execute(interaction); break;
    case 'meme': await Meme.execute(interaction); break;
    case '8ball': await EightBall.execute(interaction); break;
    case 'hug': await Hug.execute(interaction); break;
    case 'slap': await Slap.execute(interaction); break;
    case 'kiss': await Kiss.execute(interaction); break;
    case 'kill': await Kill.execute(interaction); break;
    case 'lick': await Lick.execute(interaction); break;
    case 'smash': await Smash.execute(interaction); break;

    default: await interaction.reply({ content: 'Unknown subcommand', ephemeral: true });
  }
}
