# Legend Bot

This repository contains the Legend Bot Discord bot.

Local setup

1. Create a `.env` file with your bot token and API keys:

```
TOKEN=your_discord_token
OPENROUTER_KEY=your_openrouter_key
```

2. Install dependencies:

```bash
npm install
```

3. Run the bot locally:

```bash
node index.js
```

Upload to GitHub

- Initialize and commit locally (already done). To push to GitHub, create a new repository on GitHub, then run:

```bash
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

If you want me to create the remote repo for you, provide a GitHub personal access token with `repo` scope and the target repo name.
