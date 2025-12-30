import { reloadSessions, startPeriodicReload } from './utils/data.js';

export const init = async () => {
  await reloadSessions();
  startPeriodicReload();
};
