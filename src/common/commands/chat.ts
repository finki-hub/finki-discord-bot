export const createChatCommandChoices = (choices: readonly string[]) =>
  choices.map((choice) => ({
    name: choice,
    value: choice,
  }));
