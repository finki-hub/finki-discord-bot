import { commandErrors } from '../../translations/commands.js';

export const LLM_ERRORS: Record<string, string> = {
  LLM_DISABLED: commandErrors.llmDisabled,
  LLM_NOT_READY: commandErrors.llmNotReady,
  LLM_UNAVAILABLE: commandErrors.llmUnavailable,
} as const;
