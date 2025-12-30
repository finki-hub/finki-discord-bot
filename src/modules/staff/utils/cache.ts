let transformedProfessors: Array<[string, string]> | null = null;

export const getTransformedProfessors = (): Array<[string, string]> | null =>
  transformedProfessors;

export const setTransformedProfessors = (
  professors: Array<[string, string]>,
): void => {
  transformedProfessors = professors;
};

export const clearTransformedProfessors = (): void => {
  transformedProfessors = null;
};
