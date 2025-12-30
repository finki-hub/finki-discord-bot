import { getCommonCommand } from '@/modules/room/utils/roomCommand.js';

const { data, execute } = getCommonCommand('room');

export { data, execute };
export const name = 'room';
