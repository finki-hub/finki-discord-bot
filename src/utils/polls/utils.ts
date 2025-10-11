import type { Poll } from 'discord.js';

import { POLL_IDENTIFIER_REGEX } from '../regex.js';

export const getPollArguments = (text: string) => {
  const match = POLL_IDENTIFIER_REGEX.exec(text);

  if (match?.groups?.['content'] === undefined) {
    return [];
  }

  return match.groups['content'].split('-');
};

export const getPollContent = (title: string, identifier: string) =>
  `${title}\n-# ${identifier}`;

export const getVoters = async (poll: Poll) => {
  const votes = await Promise.all(
    poll.answers.map(async (answer) => await answer.voters.fetch()),
  );
  const voters = votes
    .flatMap((vote) => vote.values().toArray())
    .map((voter) => voter.id);

  return voters;
};
