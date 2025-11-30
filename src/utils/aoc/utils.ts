import { codeBlock, heading, HeadingLevel } from 'discord.js';

import type { AocProblem } from '../../lib/schemas/Aoc.js';

export const formatAocProblem = (problem: AocProblem) =>
  [
    heading(problem.title, HeadingLevel.One),
    '',
    problem.description,
    '',
    '**Example Input:**',
    codeBlock(problem.inputExample),
    '---',
    '📎 **User Input:**',
  ].join('\n');
