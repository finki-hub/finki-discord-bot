import { z } from 'zod';

export enum Model {
  BGE_M3 = 'bge-m3:latest',
  LLAMA_3_3_70B = 'llama3.3:70b',
  MISTRAL = 'mistral:latest',
}

export const ModelSchema = z.nativeEnum(Model);
