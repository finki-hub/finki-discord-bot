export const embedMessages = {
  allCommands:
    'Ова се сите достапни команди за вас. Командите може да ги повикате во овој сервер, или во приватна порака.',
  courseInfo: 'Ова се сите достапни информации за предметот од акредитацијата.',
  courseParticipantsInfo:
    'Ова е бројот на студенти кои го запишале предметот за секоја година.',
  courseStaffInfo:
    'Ова се професорите и асистентите кои го држеле предметот последните неколку години.',
  courseSummaryInfo: 'Ова се сите достапни информации за предметот.',
  studentInformation: 'Информации за студентот',
};

export const embedMessageFunctions = {
  allLinks: (command: string) =>
    `Ова се сите достапни линкови. Користете ${command} за да ги добиете линковите.`,

  allQuestions: (command: string) =>
    `Ова се сите достапни прашања. Користете ${command} за да ги добиете одговорите.`,
};

export const embedLabels = {
  author: 'Author',
  autocompleteInteraction: 'Autocomplete Command',
  buttonInteraction: 'Button Command',
  channel: 'Channel',
  chatInputInteraction: 'Chat Input Command',
  command: 'Command',
  empty: 'Empty',
  messageContextMenuInteraction: 'Message Context Menu Command',
  option: 'Option',
  target: 'Target',
  ticketClose: 'Ticket Close',
  ticketCreate: 'Ticket Create',
  unknown: 'Unknown',
  userContextMenuInteraction: 'User Context Menu Command',
  value: 'Value',
};
