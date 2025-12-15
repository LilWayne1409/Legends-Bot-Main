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
                return i.reply({ content: 'You are not part of this game!', ephemeral: true });

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
                await message.edit({ content: 'Game ended: Not all choices made in time!', components: [] });
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
                return i.reply({ content: 'You are not part of this game!', ephemeral: true });

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
            .setFooter({ text: winner ? `${winner.username} wins this round! 🎉` : 'This round is a tie!' });
    }

    determineRoundWinner() {
        const p = this.choices.get(this.player.id);
        const o = this.choices.get(this.opponent.id);

        if (!p || !o || p === o) return null;
        const wins = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
        return wins[p] === o ? this.player : this.opponent;
    }
}
