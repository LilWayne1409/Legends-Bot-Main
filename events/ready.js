import { ActivityType } from 'discord.js';
import { ChatReviver } from '../commands/topic.js';

export const name = 'ready';
export const once = true;

const activities = [
    { name: '/info', type: ActivityType.Playing },
    { name: 'AI Chatbot', type: ActivityType.Listening }
];

let activityIndex = 0;

export async function execute(client) {
    console.log(`${client.user.tag} ist online!`);

    if (activities.length > 0) {
        const activity = activities[activityIndex];
        client.user.setActivity(activity.name, { type: activity.type });
    }

    // Start activity rotation
    setInterval(() => {
        const guild = client.guilds.cache.first();
        if (!guild) return;

        const memberCountActivity = { name: `Members: ${guild.memberCount}`, type: ActivityType.Watching };
        const currentActivity = activityIndex === activities.length ? memberCountActivity : activities[activityIndex];

        client.user.setActivity(currentActivity.name, { type: currentActivity.type });
        activityIndex = (activityIndex + 1) % (activities.length + 1);
    }, 15000);

    // Chat reviver setup (channel id kept from original)
    const REVIVE_CHANNEL_ID = '1419352213607809046';
    client.chatReviver = new ChatReviver(client, REVIVE_CHANNEL_ID);
    client.chatReviver.start();

    client.emit('clientReady');
}
