import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import "dotenv/config";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

function getAllCommandFiles(dirPath) {
  let files = [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      files = files.concat(getAllCommandFiles(path.join(dirPath, item.name)));
    } else if (item.name.endsWith(".js")) {
      files.push(path.join(dirPath, item.name));
    }
  }
  return files;
}

// Commands laden
const commandFiles = getAllCommandFiles(path.resolve("src/commands"));
for (const file of commandFiles) {
  const command = await import(file);
  client.commands.set(command.data.name, command);
}

// Interaction Handler
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "❌ Error executing command", ephemeral: true });
  }
});

client.login(process.env.TOKEN);
