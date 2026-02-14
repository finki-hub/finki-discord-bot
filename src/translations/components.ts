export const componentMessages = {
  allCommands:
    'Ова се сите достапни команди за вас. Командите може да ги повикате во овој сервер, или во приватна порака.',
  allTickets: 'Ова се сите активни тикети.',
};

export const componentMessageFunctions = {
  allLinks: (command: string) =>
    `Ова се сите достапни линкови. Истите можете да ги добиете посебно со ${command}.`,
  allQuestions: (command: string) =>
    `Ова се сите достапни прашања. Користете ${command} за да ги добиете одговорите.`,
};
