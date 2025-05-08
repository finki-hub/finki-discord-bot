import type { Poll } from 'discord.js';

import { POLL_IDENTIFIER_REGEX } from '../regex.js';

export const getPollArguments = (text: string) => {
  const match = POLL_IDENTIFIER_REGEX.exec(text);

  if (match?.groups?.['content'] === undefined) {
    return [];
  }

  return match.groups['content'].split('-');
};

export const getVoters = async (poll: Poll) => {
  const votes = await Promise.all(
    poll.answers.map(async (answer) => await answer.fetchVoters()),
  );
  const voters = votes
    .flatMap((vote) => vote.values().toArray())
    .map((voter) => voter.id);

  return voters;
};
