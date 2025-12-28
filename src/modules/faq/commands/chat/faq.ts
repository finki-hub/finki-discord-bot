import { getCommonCommand } from '@/modules/faq/utils/commandFactory.js';

const { data, execute } = getCommonCommand('faq');

export { data, execute };
export const name = 'faq';
