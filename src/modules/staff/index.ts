import { reloadStaff, startPeriodicReload } from './utils/data.js';

export const init = async () => {
  await reloadStaff();
  startPeriodicReload();
};
