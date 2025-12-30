import { z } from 'zod';

import { getStaff } from '@/modules/staff/utils/data.js';
import { labels } from '@/translations/labels.js';

import { type Course } from '../schemas/Course.js';

const findStaffProfile = (name: string): string | undefined =>
  getStaff().find((staff) => name.includes(staff.name))?.profile;

const formatStaffMember = (name: string, profileUrl?: string): string =>
  profileUrl ? `[${name}](${profileUrl})` : name;

export const linkStaff = (names: string[]): string => {
  if (names.length === 0) {
    return labels.none;
  }

  const staffWithProfiles = names.map((name) => ({
    name,
    profile: findStaffProfile(name),
  }));

  const linkedStaff = staffWithProfiles
    .map(({ name, profile }) => formatStaffMember(name, profile))
    .join('\n');

  if (linkedStaff.length < 1_000) {
    return linkedStaff;
  }

  return names.join('\n');
};

const ParticipantSchema = z
  .tuple([z.string().regex(/^\d{4}\/\d{4}$/u), z.coerce.number().nonnegative()])
  .transform(([year, count]) => ({ count, year }));

type Participant = z.infer<typeof ParticipantSchema>;

export const extractParticipants = (course: Course): Participant[] =>
  Object.entries(course)
    .map((entry) => ParticipantSchema.safeParse(entry))
    .filter((result) => result.success)
    .map((result) => result.data)
    .sort((a, b) => b.year.localeCompare(a.year));
