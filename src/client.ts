import { GatewayIntentBits } from 'discord-api-types/v10';
import { Client, Partials } from 'discord.js';

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildExpressions,
  GatewayIntentBits.GuildMessagePolls,
];

const partials = [Partials.Message, Partials.Poll, Partials.PollAnswer];

const presence = {
  activities: [
    {
      name: 'World Domination',
    },
  ],
};

export const client = new Client({
  intents,
  partials,
  presence,
});
