import { getStaff } from '../configuration/files.js';
import { labels } from '../translations/labels.js';

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
