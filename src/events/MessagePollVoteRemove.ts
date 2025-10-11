import { type ClientEvents, Events } from 'discord.js';

import { handlePoll } from '../utils/polls/main.js';

export const name = Events.MessagePollVoteRemove;

export const execute = async (...[answer]: ClientEvents[typeof name]) => {
  let pollAnswer = answer;

  if (pollAnswer.partial) {
    await pollAnswer.poll.fetch();
    const fetchedAnswer = pollAnswer.poll.answers.get(pollAnswer.id);

    if (!fetchedAnswer) {
      return;
    }

    pollAnswer = fetchedAnswer;
  }

  if (!pollAnswer.poll.message.author) {
    return;
  }

  if (pollAnswer.poll.message.author.id !== pollAnswer.client.user.id) {
    return;
  }

  if (pollAnswer.poll.partial) {
    return;
  }

  await handlePoll(pollAnswer.poll);
};
