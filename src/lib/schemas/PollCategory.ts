import { z } from 'zod';

export enum PollCategory {
  LOTTERY = 'lottery',
  SPECIAL = 'special',
}

export const PollCategorySchema = z.nativeEnum(PollCategory);
