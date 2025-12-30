import { Cron } from 'croner';

import { logger } from '@/common/logger/index.js';
import { getDataStorageUrl } from '@/configuration/environment.js';

import { type Course, CourseSchema } from '../schemas/Course.js';
import { clearTransformedCourses } from './cache.js';

const parseContent = (content: string, fallback: unknown = []): unknown => {
  if (content.length === 0) {
    return fallback;
  }

  return JSON.parse(content);
};

const fetchJsonFromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }
  return response.text();
};

let courses: Course[] = [];
let reloadCron: Cron | null = null;

export const reloadCourses = async () => {
  const baseUrl = getDataStorageUrl();

  if (!baseUrl) {
    logger.warn(
      'DATA_STORAGE_URL not configured, course data loading disabled',
    );
    return;
  }

  try {
    const coursesUrl = `${baseUrl}/courses.json`;

    const coursesRaw = await fetchJsonFromUrl(coursesUrl).catch(
      (error: unknown) => {
        logger.error(
          `Failed fetching courses from data storage\n${String(error)}`,
        );
        throw error;
      },
    );

    const coursesData = parseContent(coursesRaw);
    const coursesParsed = await CourseSchema.array()
      .parseAsync(coursesData)
      .catch((error: unknown) => {
        logger.error(`Failed parsing courses data\n${String(error)}`);
        throw error;
      });

    courses = coursesParsed;
    clearTransformedCourses();
    logger.info('Courses data reloaded from data storage');
  } catch (error) {
    logger.error(`Failed reloading courses\n${String(error)}`);
    throw error;
  }
};

export const startPeriodicReload = () => {
  const baseUrl = getDataStorageUrl();

  if (!baseUrl) {
    logger.debug(
      'DATA_STORAGE_URL not configured, periodic course reload disabled',
    );
    return;
  }

  if (reloadCron) {
    reloadCron.stop();
  }

  // Reload every hour
  reloadCron = new Cron('0 * * * *', () => {
    logger.info('Starting scheduled courses reload from data storage...');
    reloadCourses().catch((error: unknown) => {
      logger.error(`Scheduled courses reload failed\n${String(error)}`);
    });
  });

  logger.info('Periodic courses reload scheduled (every hour)');
};

// Getter functions
export const getCourses = (): string[] => courses.map((course) => course.name);

export const getCourse = (name: string): Course | undefined =>
  courses.find((course) => course.name.toLowerCase() === name.toLowerCase());
