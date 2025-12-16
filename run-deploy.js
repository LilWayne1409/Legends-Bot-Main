import 'dotenv/config';
import { deployCommands } from './deploy-commands.js';

async function main() {
  const clientStub = { user: { id: process.env.CLIENT_ID } };
  if (!process.env.TOKEN || !process.env.CLIENT_ID) {
    console.error('Missing TOKEN or CLIENT_ID in environment.');
    process.exit(1);
  }

  try {
    await deployCommands(clientStub);
    console.log('Deploy script completed.');
  } catch (err) {
    console.error('Deploy failed:', err);
    process.exit(1);
  }
}

main();
