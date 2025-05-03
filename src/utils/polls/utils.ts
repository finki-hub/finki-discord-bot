import { POLL_IDENTIFIER_REGEX } from '../regex.js';

export const getPollArguments = (text: string) => {
  const match = POLL_IDENTIFIER_REGEX.exec(text);

  if (match?.groups?.['content'] === undefined) {
    return [];
  }

  return match.groups['content'].split('-');
};
