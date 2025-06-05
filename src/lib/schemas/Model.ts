import { z } from 'zod';

export enum Model {
  BGE_M3 = 'bge-m3:latest',
  DEEPSEEK_R1_70B = 'deepseek-r1:70b',
  DOMESTIC_YAK_8B_INSTRUCT_GGUF = 'hf.co/LVSTCK/domestic-yak-8B-instruct-GGUF:Q8_0',
  LLAMA_3_3_70B = 'llama3.3:70b',
  MISTRAL = 'mistral:latest',
  QWEN_2_5_72B = 'qwen2.5:72b',
}

export const ModelSchema = z.nativeEnum(Model);

export const EMBEDDING_MODELS = [Model.BGE_M3, Model.LLAMA_3_3_70B] as const;

export const INFERENCE_MODELS = [
  Model.DEEPSEEK_R1_70B,
  Model.DOMESTIC_YAK_8B_INSTRUCT_GGUF,
  Model.LLAMA_3_3_70B,
  Model.MISTRAL,
  Model.QWEN_2_5_72B,
] as const;
