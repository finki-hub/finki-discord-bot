import { type ClientEvents, Events } from 'discord.js';

import { handlePoll } from '../utils/polls/main.js';

export const name = Events.MessagePollVoteAdd;
export const once = true;

export const execute = async (...[answer]: ClientEvents[typeof name]) => {
  if (answer.poll.message.author.id !== answer.client.user.id) {
    return;
  }

  await handlePoll(answer.poll);
};
