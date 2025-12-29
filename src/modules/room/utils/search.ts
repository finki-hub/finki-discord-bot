import Fuse from 'fuse.js';

import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import { getRooms } from '@/configuration/data/index.js';

export const getClosestRoom = (room: string) => {
  const rooms = getRooms().map((c) => `${c.name} (${c.location})`);

  const transformedRoomNames = createTransliterationSearchMap(rooms);

  const fuse = new Fuse(Object.keys(transformedRoomNames), {
    includeScore: true,
    threshold: 0.4,
  });

  const result = fuse.search(room);

  if (result.length === 0) {
    return null;
  }

  const closestLatinRoom = result[0]?.item;

  if (closestLatinRoom === undefined) {
    return null;
  }

  const closestRoom = transformedRoomNames[closestLatinRoom];

  return closestRoom ?? null;
};
