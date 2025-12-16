import { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Show bot info and commands!');

export async function execute(interaction) {
    try {
        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('📘 Bot Info')
            .setDescription('Choose a category below to learn more about the bot!');

        const menu = new StringSelectMenuBuilder()
            .setCustomId("info_select")
            .setPlaceholder("Select a category")
            .addOptions([
                { label: "General Info", value: "main", emoji: "📘" },
                { label: "AI System", value: "chatbot", emoji: "🤖" },
                { label: "Fun", value: "fun", emoji: "🎉" },
                { label: "Polls", value: "poll", emoji: "📊" },
                { label: "Ping", value: "ping", emoji: "🏓" },
                { label: "Topic Generator", value: "topic", emoji: "💡" },
            ]);

        const row = new ActionRowBuilder().addComponents(menu);
        await interaction.editReply({ embeds: [embed], components: [row] });

    } catch (err) {
        console.error("❌ /info ERROR:", err);
        if (!interaction.replied) {
            await interaction.reply({ content: "⚠️ Error in /info command", ephemeral: true });
        } else {
            await interaction.editReply({ content: "⚠️ Error in /info command" });
        }
    }
}

// Handle select menu interactions
export async function handleSelectMenu(interaction) {
    if (!interaction.isStringSelectMenu() || interaction.customId !== 'info_select') return;

    const embed = new EmbedBuilder().setColor(0x5865F2);

    switch (interaction.values[0]) {
        case 'main':
            embed.setTitle('📘 Info').setDescription(`Hey ${interaction.user}! 👋 I’m **Legend Bot**, the official bot of **Lagged Legends**.

**What I can do:**
• Chat with you using **GPT GPT-4o Mini**
• Suggest over **100 pre-made topics**, and more with AI
• Play mini-games like Rock Paper Scissors
• Keep the server active with chat reviver features
• Count numbers in counting channels
• Continuously adding more features

Legend Bot is here to make your server fun, engaging, and interactive!`);
            break;
        case 'chatbot':
            embed.setTitle('🤖 Chatbot AI').setDescription(`Legend Bot is an intelligent, fun, and personality-driven AI assistant built to keep the server active and entertaining.

**Features:**
• Chat with you using **GPT GPT-4o Mini**
• Keyword responses for greetings, moods, games, fun, etc.
• Topic suggestions
• GPT fallback if no keyword match
• Auto-truncates long messages`);
            break;
        case 'fun':
            embed.setTitle('🎉 Fun').setDescription(`**Challenge someone with:**
• **/rps @User** – single game  
• **/rps_bo3 @User** – best-of-three  

**Other fun commands:**
• **/coinflip** – Flip a coin: heads or tails  
• **/8ball** – Ask the Magic 8 Ball a question  
• **/roll [max]** – Roll a number between 1 and max  
• **/meme** – Get a random meme  
• **/joke** – Get a random joke`);
            break;
        case 'poll':
            embed.setTitle('📊 Polls').setDescription(`Create quick and interactive polls in your server with /poll. Users can vote with ✅/❌.`);
            break;
        case 'ping':
            embed.setTitle('🏓 Ping').setDescription(`Your current ping: **${Math.round(interaction.client.ws.ping)}ms**`);
            break;
        case 'topic':
            embed.setTitle('💡 Topic Generator').setDescription('Use /topic to get a random conversation topic.');
            break;
    }

    await interaction.update({ embeds: [embed] });
}
