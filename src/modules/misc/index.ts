import { reloadQuotes, startPeriodicReload } from './utils/data.js';

export const init = async () => {
  await reloadQuotes();
  startPeriodicReload();
};
