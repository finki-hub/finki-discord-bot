let transformedSessions: Array<[string, string]> | null = null;

export const getTransformedSessions = (): Array<[string, string]> | null =>
  transformedSessions;

export const setTransformedSessions = (
  sessions: Array<[string, string]>,
): void => {
  transformedSessions = sessions;
};

export const clearTransformedSessions = (): void => {
  transformedSessions = null;
};
