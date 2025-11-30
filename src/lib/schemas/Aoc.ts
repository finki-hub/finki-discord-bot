/* eslint-disable camelcase */

import z from 'zod';

export const GetAocProblemOptionsSchema = z
  .object({
    userId: z.string(),
    userTag: z.string(),
  })
  .transform((data) => ({
    discord_id: data.userId,
    username: data.userTag,
  }));

export type GetAocProblemOptions = z.infer<typeof GetAocProblemOptionsSchema>;

export const AocProblemSchema = z
  .object({
    description: z.string(),
    input_example: z.string(),
    is_solved: z.boolean().or(z.number()),
    title: z.string(),
    user_input: z.string(),
    week: z.number(),
  })
  .transform((data) => ({
    description: data.description,
    inputExample: data.input_example,
    isSolved: Boolean(data.is_solved),
    title: data.title,
    userInput: data.user_input,
    week: data.week,
  }));

export type AocProblem = z.infer<typeof AocProblemSchema>;

export const SubmitAocAnswerOptionsSchema = z
  .object({
    answer: z.string(),
    userId: z.string(),
  })
  .transform((data) => ({
    answer: data.answer,
    discord_id: data.userId,
  }));

export type SubmitAocAnswerOptions = z.infer<
  typeof SubmitAocAnswerOptionsSchema
>;

export const AocSubmitResultSchema = z
  .object({
    has_qualified_for_bonus: z.boolean().optional(),
    message: z.string(),
    status: z.enum(['already_solved', 'incorrect', 'correct']),
  })
  .transform((data) => ({
    hasQualifiedForBonus: data.has_qualified_for_bonus,
    message: data.message,
    status: data.status,
  }));

export type AocSubmitResult = z.infer<typeof AocSubmitResultSchema>;

export const AocSubmitBonusResultSchema = z.object({
  diploma: z.string().optional(),
  message: z.string(),
  status: z.enum(['already_solved', 'incorrect', 'correct']),
});

export type AocSubmitBonusResult = z.infer<typeof AocSubmitBonusResultSchema>;

export const AocLeaderboardSchema = z
  .object({
    data: z.array(
      z.object({
        discord_id: z.string(),
        rank: z.number(),
        total_score: z.number(),
        username: z.string(),
      }),
    ),
  })
  .transform((data) => ({
    data: data.data.map((entry) => ({
      discordId: entry.discord_id,
      rank: entry.rank,
      totalScore: entry.total_score,
      username: entry.username,
    })),
  }));

export type AocLeaderboard = z.infer<typeof AocLeaderboardSchema>;
