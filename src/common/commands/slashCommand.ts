export const createSlashCommandChoices = (choices: readonly string[]) =>
  choices.map((choice) => ({
    name: choice,
    value: choice,
  }));
