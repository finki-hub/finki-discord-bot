import { getCommonCommand } from '@/modules/room/utils/commandFactory.js';

const { data, execute } = getCommonCommand('room');

export { data, execute };
export const name = 'room';
