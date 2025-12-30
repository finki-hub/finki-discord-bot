import { getCommonCommand } from '@/modules/room/utils/roomCommand.js';

const { data, execute } = getCommonCommand('office');

export { data, execute };
export const name = 'office';
