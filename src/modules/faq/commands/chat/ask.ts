import { getCommonCommand } from '@/modules/faq/utils/faqCommand.js';

const { data, execute } = getCommonCommand('ask');

export { data, execute };
export const name = 'ask';
