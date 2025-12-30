import { reloadCourses, startPeriodicReload } from './utils/data.js';

export const init = async () => {
  await reloadCourses();
  startPeriodicReload();
};
