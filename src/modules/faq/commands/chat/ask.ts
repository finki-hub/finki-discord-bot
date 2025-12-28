import { getCommonCommand } from '@/modules/faq/utils/commandFactory.js';

const { data, execute } = getCommonCommand('ask');

export { data, execute };
export const name = 'ask';
