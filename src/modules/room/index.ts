import { reloadRooms, startPeriodicReload } from './utils/data.js';

export const init = async () => {
  await reloadRooms();
  startPeriodicReload();
};
