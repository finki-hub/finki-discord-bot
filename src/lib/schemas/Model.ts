import { z } from 'zod';

export enum Model {
  LLAMA_3_3_70B = 'llama3.3:70b',
}

export const ModelSchema = z.nativeEnum(Model);
