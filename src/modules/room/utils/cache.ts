let transformedRooms: Array<[string, string]> | null = null;

export const getTransformedRooms = (): Array<[string, string]> | null =>
  transformedRooms;

export const setTransformedRooms = (rooms: Array<[string, string]>): void => {
  transformedRooms = rooms;
};

export const clearTransformedRooms = (): void => {
  transformedRooms = null;
};
