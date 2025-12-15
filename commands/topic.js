export function getRandomTopic() {
  const topics = [
    "What's your favorite game?", "What's your dream vacation?", "If you could have any superpower, what would it be?",
    "What's your favorite movie?", "What's a skill you want to learn?", "What's your favorite book?",
    "What's your favorite food?", "If you could live anywhere, where would it be?", "What's your favorite hobby?",
    "What's a talent you have?", "What's your favorite song?", "What's your favorite TV show?",
    "What's your favorite animal?", "If you could meet anyone, dead or alive, who would it be?", "What's your favorite color?",
    "What's your favorite sport?", "What's your favorite season?", "Do you prefer cats or dogs?",
    "What's a fun fact about you?", "What's your favorite holiday?", "What's your favorite childhood memory?",
    "What's your favorite drink?", "Do you prefer mountains or the beach?", "What's your favorite dessert?",
    "What's your favorite app?", "What's a country you want to visit?", "What's your favorite quote?",
    "What's your favorite board game?", "Do you prefer morning or night?", "What's your favorite type of music?",
    "What's your guilty pleasure?", "What's a habit you're proud of?", "What's your favorite fruit?",
    "What's your favorite vegetable?", "What's your favorite superhero?", "What's your favorite video game?",
    "What's your dream job?", "Do you prefer coffee or tea?", "What's your favorite restaurant?",
    "What's your favorite way to relax?", "What's your favorite city?", "What's your favorite holiday destination?",
    "What's your favorite ice cream flavor?", "What's your favorite TV character?", "What's your favorite childhood toy?",
    "What's your favorite season of the year?", "What's your favorite candy?", "What's your favorite clothing brand?",
    "What's your favorite flower?", "What's your favorite kind of weather?", "What's your favorite social media platform?"
  ];
  return topics[Math.floor(Math.random() * topics.length)];
}

export class ChatReviver {
  constructor(client, channelId) {
    this.client = client;
    this.channelId = channelId;
    this.lastActivity = Date.now();
    this.interval = null;
  }

  updateActivity() {
    this.lastActivity = Date.now();
  }

  start() {
    this.interval = setInterval(async () => {
      const now = Date.now();
      const diff = now - this.lastActivity;
      if (diff > 60000 * 10) {
        const channel = await this.client.channels.fetch(this.channelId);
        if (channel) {
          const question = getRandomTopic();
          await channel.send(`👀 The chat is quiet… here's a topic: ${question}`);
          this.lastActivity = Date.now();
        }
      }
    }, 60000);
  }
}
