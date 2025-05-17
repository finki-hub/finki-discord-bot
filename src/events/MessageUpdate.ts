import { type ClientEvents, Events } from 'discord.js';

import { handlePoll } from '../utils/polls/main.js';

export const name = Events.MessageUpdate;

export const execute = async (...[, message]: ClientEvents[typeof name]) => {
  if (message.poll === null) {
    return;
  }

  if (message.poll.message.author.id !== message.client.user.id) {
    return;
  }

  await handlePoll(message.poll);
};
