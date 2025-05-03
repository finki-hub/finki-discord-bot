import { type ClientEvents, Events } from 'discord.js';

import { decidePoll } from '../utils/polls/core/special.js';

export const name = Events.MessagePollVoteAdd;
export const once = true;

export const execute = async (...[answer]: ClientEvents[typeof name]) => {
  await decidePoll(answer.poll);
};
