import Fuse from 'fuse.js';

import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import { getSessions } from '@/configuration/data/index.js';

export const getClosestSession = (session: string) => {
  const sessions = Object.keys(getSessions());

  // Latin -> Cyrillic
  const transformedSessionNames = createTransliterationSearchMap(sessions);

  const fuse = new Fuse(Object.keys(transformedSessionNames), {
    includeScore: true,
    threshold: 0.4,
  });

  const result = fuse.search(session);

  if (result.length === 0) {
    return null;
  }

  const closestLatinSession = result[0]?.item;

  if (closestLatinSession === undefined) {
    return null;
  }

  const closestSession = transformedSessionNames[closestLatinSession];

  return closestSession ?? null;
};
