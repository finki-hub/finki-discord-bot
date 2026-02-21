import { getCommonCommand } from '@/modules/chat/utils/chatCommand.js';

const { data, execute } = getCommonCommand('prompt');

export { data, execute };
export const name = 'prompt';
