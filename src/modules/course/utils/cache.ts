let transformedCourses: Array<[string, string]> | null = null;

export const getTransformedCourses = () => transformedCourses;

export const setTransformedCourses = (
  courses: Array<[string, string]>,
): void => {
  transformedCourses = courses;
};

export const clearTransformedCourses = () => {
  transformedCourses = null;
};
