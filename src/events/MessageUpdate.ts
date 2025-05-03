import { type ClientEvents, Events } from 'discord.js';

import { decidePoll } from '../utils/polls/core/special.js';

export const name = Events.MessageUpdate;
export const once = true;

export const execute = async (...[message]: ClientEvents[typeof name]) => {
  if (message.poll === null) {
    return;
  }

  await decidePoll(message.poll, true);
};
