import Fuse from 'fuse.js';

import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import { getCourses, getFromRoleConfig } from '@/configuration/data/index.js';

export const getClosestCourse = (course: string) => {
  const courses = getCourses();

  // Latin -> Cyrillic
  const transformedCourseNames = createTransliterationSearchMap(courses);

  const fuse = new Fuse(Object.keys(transformedCourseNames), {
    includeScore: true,
    threshold: 0.4,
  });

  const result = fuse.search(course);

  if (result.length === 0) {
    return null;
  }

  const closestLatinCourse = result[0]?.item;

  if (closestLatinCourse === undefined) {
    return null;
  }

  const closestCourse = transformedCourseNames[closestLatinCourse];

  return closestCourse ?? null;
};

export const getClosestCourseRole = (courseRole: string) => {
  const configCourseRoles = getFromRoleConfig('courses');

  if (configCourseRoles === undefined) {
    return null;
  }

  const courseRoles = Object.values(configCourseRoles);

  // Latin -> Cyrillic
  const transformedCourseRoleNames =
    createTransliterationSearchMap(courseRoles);

  const fuse = new Fuse(Object.keys(transformedCourseRoleNames), {
    includeScore: true,
    threshold: 0.4,
  });

  const result = fuse.search(courseRole);

  if (result.length === 0) {
    return null;
  }

  const closestLatinCourseRole = result[0]?.item;

  if (closestLatinCourseRole === undefined) {
    return null;
  }

  const closestCourseRole = transformedCourseRoleNames[closestLatinCourseRole];

  return closestCourseRole ?? null;
};
