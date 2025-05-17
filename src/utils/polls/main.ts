import { type Poll } from 'discord.js';

import { PollCategory } from '../../lib/schemas/PollCategory.js';
import { PollTypeSchema } from '../../lib/schemas/PollType.js';
import { POLL_CATEGORIES } from './constants.js';
import { decideLotteryPoll } from './core/lottery.js';
import { decideSpecialPoll } from './core/special.js';
import { getPollArguments } from './utils.js';

export const handlePoll = async (poll: Poll) => {
  const [pollType] = getPollArguments(poll.message.content);

  if (pollType === undefined) {
    return;
  }

  const parsedPollType = PollTypeSchema.safeParse(pollType);
  if (!parsedPollType.success) {
    return;
  }

  switch (POLL_CATEGORIES[parsedPollType.data]) {
    case PollCategory.LOTTERY:
      if (!poll.resultsFinalized) {
        return;
      }

      await decideLotteryPoll(poll);
      break;

    case PollCategory.SPECIAL:
      await decideSpecialPoll(poll);
      break;

    default:
  }
};
