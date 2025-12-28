import { getCommonCommand } from '@/modules/room/utils/commandFactory.js';

const { data, execute } = getCommonCommand('office');

export { data, execute };
export const name = 'office';
