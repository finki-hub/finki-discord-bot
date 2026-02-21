import { getCommonCommand } from '@/modules/chat/utils/chatCommand.js';

const { data, execute } = getCommonCommand('ask');

export { data, execute };
export const name = 'ask';
