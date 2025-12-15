import { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder, 
    ComponentType 
} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a quick poll with Yes/No votes')
    .addStringOption(option => 
        option.setName('question')
            .setDescription('The poll question')
            .setRequired(true)
    );

export async function execute(interaction) {
    const question = interaction.options.getString('question');

    let votes = { yes: 0, no: 0 };
    const votedUsers = new Set();

    const embed = new EmbedBuilder()
        .setTitle('📊 New Poll')
        .setDescription(
            `> A message from ${interaction.user}\n` +
            `> Use buttons below to vote\n\n` +
            `> ${question}`
        )
        .setColor(0x5865F2)
        .setFooter({ text: 'This message will automatically close in 10 min.' });

    const yesButton = new ButtonBuilder()
        .setCustomId('yes')
        .setLabel(`✅ Yes (${votes.yes})`)
        .setStyle(ButtonStyle.Success);

    const noButton = new ButtonBuilder()
        .setCustomId('no')
        .setLabel(`❌ No (${votes.no})`)
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(yesButton, noButton);

    await interaction.reply({ embeds: [embed], components: [row] });
    const message = await interaction.fetchReply();

    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 10 * 60 * 1000
    });

    collector.on('collect', async i => {
        if (votedUsers.has(i.user.id)) return i.reply({ content: '❌ You already voted!', ephemeral: true });
        votedUsers.add(i.user.id);

        if (i.customId === 'yes') votes.yes++;
        if (i.customId === 'no') votes.no++;

        yesButton.setLabel(`✅ Yes (${votes.yes})`);
        noButton.setLabel(`❌ No (${votes.no})`);

        const updatedRow = new ActionRowBuilder().addComponents(yesButton, noButton);

        try { await i.update({ embeds: [embed], components: [updatedRow] }); } catch (err) { if (err.code === 10008) collector.stop(); }
    });

    collector.on('end', async () => {
        yesButton.setDisabled(true);
        noButton.setDisabled(true);

        const finalRow = new ActionRowBuilder().addComponents(yesButton, noButton);

        embed.setDescription(`> A message from ${interaction.user}\n> Poll closed\n\n> ${question}`);

        try { await interaction.editReply({ embeds: [embed], components: [finalRow] }); } catch (err) { if (err.code !== 10008) console.error(err); }
    });
}
