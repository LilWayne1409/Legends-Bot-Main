import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the Magic 8 Ball a question')
    .addStringOption(option =>
        option.setName('question')
            .setDescription('Your question')
            .setRequired(true)
    );

export async function execute(interaction) {
    const question = interaction.options.getString('question'); // holt die Frage
    const answers = [
        "Absolutely yes 😏",
        "No way 🤡",
        "Maybe… or maybe not 🤔",
        "Ask again later, genius 😎",
        "Sure… if pigs fly 🐷✈️",
        "It is certain.",
        "Without a doubt.",
        "Yes – definitely.",
        "You may rely on it.",
        "As I see it, yes.",
        "Most likely.",
        "Outlook good.",
        "Yes.",
        "Signs point to yes.",
        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now.",
        "Cannot predict now.",
        "Concentrate and ask again.",
        "Don't count on it.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful.",
        "Absolutely… until it kills you.",
        "Yes… but chaos will follow.",
        "No… but your life will get weirder.",
        "Definitely not… run while you can.",
        "Sure, if you enjoy disappointment.",
        "Ask again after you’ve cried a bit.",
        "Probably… unless the universe disagrees.",
        "Yes… in an alternate, horrifying reality.",
        "No… and you’ll regret asking.",
        "Maybe… but it will haunt you forever.",
        "Yes… but your cat will betray you.",
        "No… your secrets will be exposed.",
        "Definitely… and someone will get hurt.",
        "Ask again… before it’s too late.",
        "Yes… while the shadows watch.",
        "No… the darkness wins.",
        "Sure… but at a terrible cost.",
        "Probably… but don’t trust anyone.",
        "Yes… until the next full moon.",
        "No… and you’ll laugh in regret."
    ];
    const answer = answers[Math.floor(Math.random() * answers.length)];

    const embed = new EmbedBuilder()
        .setTitle('🎱 Magic 8 Ball')
        .addFields(
            { name: 'Question', value: question },
            { name: 'Answer', value: answer }
        )
        .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed] });
}
