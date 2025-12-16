// Message-based commands are disabled to enforce slash-commands-only design.
// The original message-based chatbot logic remains in `ai/chatbot.js` and
// is used via the `/ai` slash commands.

export const name = 'noop_messageCreate';
export const once = false;
export async function execute() {}
