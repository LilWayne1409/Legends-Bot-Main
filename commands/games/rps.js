<<<<<<< HEAD
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js';

export class RPSView {
    constructor(player, opponent, interaction) {
        this.player = player;
        this.opponent = opponent;
        this.interaction = interaction;
        this.choices = new Map();
        this.row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rock').setLabel('Rock').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('paper').setLabel('Paper').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('scissors').setLabel('Scissors').setStyle(ButtonStyle.Primary)
        );
    }

    async start() {
        const message = await this.interaction.reply({ embeds: [this.createEmbed(this.interaction.user.id)], components: [this.row], fetchReply: true });

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 20000 });

        collector.on('collect', async i => {
            if (![this.player.id, this.opponent.id].includes(i.user.id)) 
                return i.reply({ content: "You are not part of this game!", ephemeral: true });

            this.choices.set(i.user.id, i.customId);
            await i.reply({ content: `You picked ${i.customId}!`, ephemeral: true });

            await message.edit({ embeds: [
                this.createEmbed(this.player.id),
                this.createEmbed(this.opponent.id)
            ]});

            if (this.choices.has(this.player.id) && this.choices.has(this.opponent.id)) {
                collector.stop();
                await message.edit({ embeds: [this.createResultEmbed()], components: [] });
            }
        });

        collector.on('end', async () => {
            if (!this.choices.has(this.player.id) || !this.choices.has(this.opponent.id)) {
                await message.edit({ content: "Game ended: Not all choices made in time!", components: [] });
            }
        });
    }

    createEmbed(viewerId) {
        const pChoice = viewerId === this.player.id ? this.choices.get(this.player.id) : null;
        const oChoice = viewerId === this.opponent.id ? this.choices.get(this.opponent.id) : null;

        return new EmbedBuilder()
            .setTitle(`${this.player.username} vs ${this.opponent.username}`)
            .setColor(0x5865F2)
            .setDescription('Choose your move:')
            .addFields(
                { name: this.player.username, value: pChoice ? '✅ Selected' : 'Waiting...', inline: true },
                { name: this.opponent.username, value: oChoice ? '✅ Selected' : 'Waiting...', inline: true }
            );
    }

    createResultEmbed() {
        const pChoice = this.choices.get(this.player.id);
        const oChoice = this.choices.get(this.opponent.id);

        const winner = this.determineWinner();

        return new EmbedBuilder()
            .setTitle(`${this.player.username} vs ${this.opponent.username}`)
            .setColor(0x5865F2)
            .setDescription('Results are in!')
            .addFields(
                { name: this.player.username, value: pChoice, inline: true },
                { name: this.opponent.username, value: oChoice, inline: true }
            )
            .setFooter({ text: winner });
    }

    determineWinner() {
        const p = this.choices.get(this.player.id);
        const o = this.choices.get(this.opponent.id);

        if (!p || !o) return 'Waiting for players...';
        if (p === o) return "It's a tie!";
        const wins = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
        return wins[p] === o ? `${this.player.username} wins! 🎉` : `${this.opponent.username} wins! 🎉`;
    }
}

export class RPSBo3View {
    constructor(player, opponent, interaction) {
        this.player = player;
        this.opponent = opponent;
        this.interaction = interaction;

        this.scores = new Map([
            [this.player.id, 0],
            [this.opponent.id, 0]
        ]);

        this.choices = new Map();
        this.round = 1;
        this.maxRounds = 3;

        this.row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rock').setLabel('Rock').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('paper').setLabel('Paper').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('scissors').setLabel('Scissors').setStyle(ButtonStyle.Primary)
        );
    }

    async start() {
        const message = await this.interaction.reply({ embeds: [this.createEmbed(this.player.id)], components: [this.row], fetchReply: true });
        this.nextRound(message);
    }

    async nextRound(message) {
        if (this.round > this.maxRounds || this.scores.get(this.player.id) === 2 || this.scores.get(this.opponent.id) === 2) {
            const finalWinner = this.scores.get(this.player.id) > this.scores.get(this.opponent.id)
                ? this.player
                : this.scores.get(this.opponent.id) > this.scores.get(this.player.id)
                    ? this.opponent
                    : null;

            return message.edit({
                content: `Final Score:\n${this.player.username}: ${this.scores.get(this.player.id)}\n${this.opponent.username}: ${this.scores.get(this.opponent.id)}\n` +
                         `${finalWinner ? `${finalWinner.username} wins the game! 🎉` : "The game ended in a tie!"}`,
                components: []
            });
        }

        this.choices.clear();

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 20000 });

        collector.on('collect', async i => {
            if (![this.player.id, this.opponent.id].includes(i.user.id)) 
                return i.reply({ content: "You are not part of this game!", ephemeral: true });

            this.choices.set(i.user.id, i.customId);
            await i.reply({ content: `You picked ${i.customId}!`, ephemeral: true });

            await message.edit({ embeds: [
                this.createEmbed(this.player.id),
                this.createEmbed(this.opponent.id)
            ]});

            if (this.choices.has(this.player.id) && this.choices.has(this.opponent.id)) {
                collector.stop();

                const winner = this.determineRoundWinner();
                if (winner) this.scores.set(winner.id, this.scores.get(winner.id) + 1);

                await message.edit({ embeds: [this.createResultEmbed()] });

                this.round++;
                setTimeout(() => this.nextRound(message), 1500);
            }
        });

        collector.on('end', async () => {
            if (!this.choices.has(this.player.id) || !this.choices.has(this.opponent.id)) {
                await message.edit({ content: `Round ${this.round} ended: No choice made.`, components: [] });
            }
        });
    }

    createEmbed(viewerId) {
        const pChoice = viewerId === this.player.id ? this.choices.get(this.player.id) : null;
        const oChoice = viewerId === this.opponent.id ? this.choices.get(this.opponent.id) : null;

        return new EmbedBuilder()
            .setTitle(`${this.player.username} vs ${this.opponent.username} — Round ${this.round}`)
            .setColor(0x5865F2)
            .setDescription('Choose your move:')
            .addFields(
                { name: this.player.username, value: pChoice ? '✅ Selected' : 'Waiting...', inline: true },
                { name: this.opponent.username, value: oChoice ? '✅ Selected' : 'Waiting...', inline: true }
            );
    }

    createResultEmbed() {
        const pChoice = this.choices.get(this.player.id);
        const oChoice = this.choices.get(this.opponent.id);

        const winner = this.determineRoundWinner();

        return new EmbedBuilder()
            .setTitle(`${this.player.username} vs ${this.opponent.username} — Round ${this.round}`)
            .setColor(0x5865F2)
            .setDescription('Round results:')
            .addFields(
                { name: this.player.username, value: pChoice, inline: true },
                { name: this.opponent.username, value: oChoice, inline: true }
            )
            .setFooter({ text: winner ? `${winner.username} wins this round! 🎉` : "This round is a tie!" });
    }

    determineRoundWinner() {
        const p = this.choices.get(this.player.id);
        const o = this.choices.get(this.opponent.id);

        if (!p || !o || p === o) return null;
        const wins = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
        return wins[p] === o ? this.player : this.opponent;
    }
=======
import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('rps')
  .setDescription('Play Rock Paper Scissors')
  .addUserOption(opt => opt.setName('user').setDescription('Opponent').setRequired(false))
  .addStringOption(opt => opt.setName('mode').setDescription('Mode: single or bo3').addChoices(
    { name: 'single', value: 'single' },
    { name: 'bo3', value: 'bo3' }
  ));

const choices = ['rock', 'paper', 'scissors'];

class RPSView {
  constructor(player1, player2, interaction) {
    this.player1 = player1;
    this.player2 = player2;
    this.interaction = interaction;
  }

  async playRound() {
    return new Promise(async (resolve) => {
      const row = new ActionRowBuilder().addComponents(
        choices.map(c => new ButtonBuilder().setCustomId(c).setLabel(c).setStyle(ButtonStyle.Primary))
      );

      await this.interaction.followUp({ content: `${this.player1.username}, choose your move!`, components: [row], ephemeral: true });

      const filter = i => i.user.id === this.player1.id;
      const collector = this.interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 15000 });

      collector.on('collect', async i => {
        const p1Choice = i.customId;
        const p2Choice = this.player2.id === 'legendbot' ? choices[Math.floor(Math.random() * choices.length)] : 'rock';
        let result = 'Draw!';
        let winnerId = null;

        if ((p1Choice === 'rock' && p2Choice === 'scissors') ||
            (p1Choice === 'paper' && p2Choice === 'rock') ||
            (p1Choice === 'scissors' && p2Choice === 'paper')) {
          result = `${this.player1.username} wins this round! 🎉`;
          winnerId = this.player1.id;
        } else if (p1Choice !== p2Choice) {
          result = `${this.player2.username} wins this round! 😢`;
          winnerId = this.player2.id;
        }

        await i.update({ content: `You chose **${p1Choice}**\n${this.player2.username} chose **${p2Choice}**\n${result}`, components: [] });
        resolve({ winnerId, p1Choice, p2Choice });
      });

      collector.on('end', collected => {
        if (collected.size === 0) resolve({ winnerId: null, p1Choice: '❌', p2Choice: '❌' });
      });
    });
  }
}

class RPSBo3View {
  constructor(player1, player2, interaction) {
    this.player1 = player1;
    this.player2 = player2;
    this.interaction = interaction;
    this.score = { [player1.id]: 0, [player2.id]: 0 };
    this.roundHistory = [];
  }

  async start() {
    const embed = new EmbedBuilder()
      .setTitle('Best of 3 RPS 🪨📄✂️')
      .setColor('Random')
      .setDescription(`**${this.player1.username}** vs **${this.player2.username}**\nStarting game...`);

    await this.interaction.reply({ embeds: [embed] });

    for (let round = 1; round <= 3; round++) {
      const roundGame = new RPSView(this.player1, this.player2, this.interaction);
      const result = await roundGame.playRound();
      this.roundHistory.push(result);

      // Score aktualisieren
      if (result.winnerId) this.score[result.winnerId]++;

      // Embed aktualisieren
      let desc = '';
      this.roundHistory.forEach((r, idx) => {
        desc += `**Round ${idx + 1}:** ${this.player1.username} chose **${r.p1Choice}**, ${this.player2.username} chose **${r.p2Choice}** - `;
        if (!r.winnerId) desc += 'Draw\n';
        else desc += `${r.winnerId === this.player1.id ? this.player1.username : this.player2.username} wins\n`;
      });
      desc += `\n**Score:** ${this.player1.username} ${this.score[this.player1.id]} - ${this.player2.username} ${this.score[this.player2.id]}`;

      embed.setDescription(desc);
      await this.interaction.editReply({ embeds: [embed] });
      await new Promise(r => setTimeout(r, 1000)); // kleine Pause zwischen Runden
    }

    // Gewinner bestimmen
    let finalWinner;
    if (this.score[this.player1.id] > this.score[this.player2.id]) finalWinner = this.player1.username;
    else if (this.score[this.player2.id] > this.score[this.player1.id]) finalWinner = this.player2.username;
    else finalWinner = 'No one, it\'s a tie';

    embed.setDescription(`${embed.data.description}\n\n🏆 **Game Over! Winner:** ${finalWinner}`)
         .setColor('Gold');
    await this.interaction.editReply({ embeds: [embed], components: [] });
  }
}

export async function execute(interaction) {
  const user = interaction.options.getUser('user') || { id: 'legendbot', username: 'Legend Bot 🤖' };
  const mode = interaction.options.getString('mode') || 'single';

  if (mode === 'bo3') {
    const game = new RPSBo3View(interaction.user, user, interaction);
    await game.start();
  } else {
    const game = new RPSView(interaction.user, user, interaction);
    const result = await game.playRound();

    // Einfaches Embed für Single Mode
    const embed = new EmbedBuilder()
      .setTitle('RPS Single 🪨📄✂️')
      .setColor('Random')
      .setDescription(`You chose **${result.p1Choice}**\n${user.username} chose **${result.p2Choice}**\n${result.winnerId === interaction.user.id ? 'You win! 🎉' : result.winnerId === user.id ? `${user.username} wins! 😢` : 'Draw!'}`);
    await interaction.followUp({ embeds: [embed] });
  }
>>>>>>> e700fa6 (Initial commit)
}
