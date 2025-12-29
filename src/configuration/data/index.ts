import { readFile } from 'node:fs/promises';
import { z } from 'zod';

import { logger } from '@/common/logger/index.js';
import {
  type CourseInformation,
  CourseInformationSchema,
} from '@/modules/course/schemas/CourseInformation.js';
import {
  type CourseParticipants,
  CourseParticipantsSchema,
} from '@/modules/course/schemas/CourseParticipants.js';
import {
  type CoursePrerequisites,
  CoursePrerequisitesSchema,
} from '@/modules/course/schemas/CoursePrerequisites.js';
import {
  type CourseStaff,
  CourseStaffSchema,
} from '@/modules/course/schemas/CourseStaff.js';
import { type Room, RoomSchema } from '@/modules/room/schemas/Room.js';
import { type Staff, StaffSchema } from '@/modules/staff/schemas/Staff.js';

const options = {
  encoding: 'utf8',
  flag: 'a+',
} as const;

const parseContent = (content: string, fallback: unknown = []): unknown => {
  if (content.length === 0) {
    return fallback;
  }

  return JSON.parse(content);
};

let courses: string[] = [];
let rooms: Room[] = [];
let information: CourseInformation[] = [];
let participants: CourseParticipants[] = [];
let prerequisites: CoursePrerequisites[] = [];
let professors: CourseStaff[] = [];
let sessions: Record<string, string> = {};
let staff: Staff[] = [];

export const reloadData = async () => {
  try {
    const coursesPromise = readFile('./config/courses.json', options);
    const roomsPromise = readFile('./config/rooms.json', options);
    const infoPromise = readFile('./config/information.json', options);
    const participantsPromise = readFile('./config/participants.json', options);
    const prerequisitesPromise = readFile(
      './config/prerequisites.json',
      options,
    );
    const professorsPromise = readFile('./config/professors.json', options);
    const sessionsPromise = readFile('./config/sessions.json', options);
    const staffPromise = readFile('./config/staff.json', options);

    const [
      coursesRaw,
      roomsRaw,
      infoRaw,
      participantsRaw,
      prerequisitesRaw,
      professorsRaw,
      sessionsRaw,
      staffRaw,
    ] = await Promise.all([
      coursesPromise,
      roomsPromise,
      infoPromise,
      participantsPromise,
      prerequisitesPromise,
      professorsPromise,
      sessionsPromise,
      staffPromise,
    ]).catch((error: unknown) => {
      logger.error(`Failed reloading data files\n${String(error)}`);
      throw error;
    });

    const coursesData = parseContent(coursesRaw);
    const roomsData = parseContent(roomsRaw);
    const informationData = parseContent(infoRaw);
    const participantsData = parseContent(participantsRaw);
    const prerequisitesData = parseContent(prerequisitesRaw);
    const professorsData = parseContent(professorsRaw);
    const sessionsData = parseContent(sessionsRaw, {});
    const staffData = parseContent(staffRaw);

    const coursesDataPromise = z.string().array().parseAsync(coursesData);
    const roomsDataPromise = RoomSchema.array().parseAsync(roomsData);
    const infoDataPromise =
      CourseInformationSchema.array().parseAsync(informationData);
    const participantsDataPromise =
      CourseParticipantsSchema.array().parseAsync(participantsData);
    const prerequisitesDataPromise =
      CoursePrerequisitesSchema.array().parseAsync(prerequisitesData);
    const professorsDataPromise =
      CourseStaffSchema.array().parseAsync(professorsData);
    const sessionsDataPromise = z
      .record(z.string(), z.string())
      .parseAsync(sessionsData);
    const staffDataPromise = StaffSchema.array().parseAsync(staffData);

    [
      courses,
      rooms,
      information,
      participants,
      prerequisites,
      professors,
      sessions,
      staff,
    ] = await Promise.all([
      coursesDataPromise,
      roomsDataPromise,
      infoDataPromise,
      participantsDataPromise,
      prerequisitesDataPromise,
      professorsDataPromise,
      sessionsDataPromise,
      staffDataPromise,
    ]).catch((error: unknown) => {
      logger.error(`Failed reloading data files\n${String(error)}`);
      throw error;
    });

    logger.info('Data files reloaded');
  } catch (error) {
    logger.error(`Failed reloading data files\n${String(error)}`);
    throw error;
  }
};

export const getRooms = () => rooms;

export const getCourses = () => courses;

export const getInformation = () => information;

export const getParticipants = () => participants;

export const getProfessors = () => professors;

export const getPrerequisites = () => prerequisites;

export const getSessions = () => sessions;

export const getStaff = () => staff;
