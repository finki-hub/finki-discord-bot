import { z } from 'zod';

export enum PollCategory {
  SPECIAL = 'special',
}

export const PollCategorySchema = z.nativeEnum(PollCategory);
