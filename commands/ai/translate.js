import { aiAsk } from "./chatbot.js";

const LANGUAGES = [
    { label: "Deutsch", value: "German" },
    { label: "English", value: "English" },
    { label: "Русский", value: "Russian" },
    { label: "中文", value: "Chinese" },
    { label: "日本語", value: "Japanese" },
    { label: "한국어", value: "Korean" },
    { label: "Українська", value: "Ukrainian" },
    { label: "العربية", value: "Arabic" },
    { label: "हिंदी", value: "Hindi" },
    { label: "Türkçe", value: "Turkish" },
    { label: "Ελληνικά", value: "Greek" },
    { label: "български", value: "Bulgarian" },
    { label: "עברית", value: "Hebrew" },
    { label: "Dansk", value: "Danish" },
    { label: "Polski", value: "Polish" },
    { label: "Español", value: "Spanish" },
    { label: "Français", value: "French" },
    { label: "Italiano", value: "Italian" },
    { label: "Português", value: "Portuguese" },
    { label: "Norsk", value: "Norwegian" },
    { label: "Schwäbisch", value: "Swabian" }
];

const languageChoices = LANGUAGES.map(lang => ({ name: lang.label, value: lang.value }));

export default {
    data: {
        name: "ai_translate",
        description: "Translate text to a specified language",
        options: [
            {
                name: "text",
                type: 3, // STRING
                description: "Text to translate",
                required: true
            },
            {
                name: "language",
                type: 3, // STRING
                description: "Target language (choose from list)",
                required: true,
                choices: languageChoices
            }
        ]
    },
    async execute(interaction) {
        const text = interaction.options.getString("text");
        const language = interaction.options.getString("language");

        try {
            await interaction.deferReply();

<<<<<<< HEAD
            const prompt = `Translate the following text to ${language}:\n"${text}"\nOnly provide the translation, nothing else.`;
=======
            const prompt = `Translate the following text into ${language}.\nONLY provide the translated text. NO explanations, NO extra text.\nText: "${text}"`;

>>>>>>> e700fa6 (Initial commit)

            const translation = await aiAsk(interaction.channel.id, prompt);

            await interaction.editReply(`**Translation (${language}):**\n${translation}`);
        } catch (err) {
            console.error("Translate command error:", err);
            if (!interaction.replied) {
                await interaction.reply({ content: "⚠️ Error translating text. Please try again.", ephemeral: true });
            } else {
                await interaction.editReply("⚠️ Error translating text. Please try again.");
            }
        }
    }
};
