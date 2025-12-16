import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import "dotenv/config";

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

const commands = [];
const commandFiles = getAllCommandFiles(path.resolve("src/commands"));

for (const file of commandFiles) {
  const command = await import(file);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

await rest.put(
  Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
  { body: commands }
);

console.log("✅ All slash commands deployed:", commands.map(c => c.name));
