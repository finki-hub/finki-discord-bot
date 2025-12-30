import Fuse from 'fuse.js';

import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import { getStaff } from '@/modules/staff/utils/data.js';

export const getClosestStaff = (professor: string) => {
  const professors = getStaff();

  const transformedProfessorNames = createTransliterationSearchMap(
    professors.map(({ name }) => name),
  );

  const fuse = new Fuse(Object.keys(transformedProfessorNames), {
    includeScore: true,
    threshold: 0.4,
  });

  const result = fuse.search(professor);

  if (result.length === 0) {
    return null;
  }

  const closestLatinProfessor = result[0]?.item;

  if (closestLatinProfessor === undefined) {
    return null;
  }

  const closestProfessor = transformedProfessorNames[closestLatinProfessor];

  return closestProfessor ?? null;
};
