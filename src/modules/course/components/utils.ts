import { getStaff } from '@/modules/staff/utils/data.js';
import { labels } from '@/translations/labels.js';

import { type Course } from '../schemas/Course.js';

export const linkStaff = (professors: string) => {
  if (professors === '') {
    return labels.none;
  }

  const allStaff = professors
    .split('\n')
    .map((professor) => [
      professor,
      getStaff().find((staff) => professor.includes(staff.name))?.profile,
    ]);

  const linkedStaff = allStaff
    .map(([professor, finki]) =>
      finki ? `[${professor}](${finki})` : professor,
    )
    .join('\n');

  if (linkedStaff.length < 1_000) {
    return linkedStaff;
  }

  return allStaff.map(([professor]) => professor).join('\n');
};

export const extractParticipants = (
  course: Course,
): Array<{ count: number; year: string }> => {
  const participants: Array<{ count: number; year: string }> = [];
  const courseRecord = course as Record<string, number | string>;

  for (const [key, value] of Object.entries(courseRecord)) {
    if (
      /^\d{4}\/\d{4}$/u.test(key) &&
      typeof value === 'number' &&
      value >= 0
    ) {
      participants.push({ count: value, year: key });
    }
  }
  return participants.sort((a, b) => b.year.localeCompare(a.year));
};
