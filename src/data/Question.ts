import { type QuestionWithLinks } from "../types/QuestionWithLinks.js";
import { logger } from "../utils/logger.js";
import { database } from "./database.js";
import { type Prisma } from "@prisma/client";

export const getQuestions = async () => {
  try {
    return await database.question.findMany({
      include: {
        links: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    logger.error(`Failed obtaining questions\n${error}`);
    return [];
  }
};

export const getQuestionNames = async () => {
  try {
    return await database.question.findMany({
      select: {
        name: true,
      },
    });
  } catch (error) {
    logger.error(`Failed obtaining question names\n${error}`);
    return [];
  }
};

export const getQuestion = async (name?: string) => {
  if (name === undefined) {
    return null;
  }

  try {
    return await database.question.findFirst({
      include: {
        links: true,
      },
      where: {
        name,
      },
    });
  } catch (error) {
    logger.error(`Failed obtaining question\n${error}`);
    return null;
  }
};

export const createQuestion = async (question?: Prisma.QuestionCreateInput) => {
  if (question === undefined) {
    return null;
  }

  try {
    return await database.question.create({
      data: question,
      include: {
        links: true,
      },
    });
  } catch (error) {
    logger.error(`Failed creating question\n${error}`);
    return null;
  }
};

export const updateQuestion = async (question?: QuestionWithLinks) => {
  if (question === undefined) {
    return null;
  }

  const { links, ...rest } = question;

  try {
    return await database.question.update({
      data: {
        ...rest,
        links: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          upsert: links.map(({ questionId, ...linkRest }) => ({
            create: linkRest,
            update: linkRest,
            where: {
              id: linkRest.id,
            },
          })),
        },
      },
      include: {
        links: true,
      },
      where: {
        name: question.name,
      },
    });
  } catch (error) {
    logger.error(`Failed updating question\n${error}`);
    return null;
  }
};

export const deleteQuestion = async (name?: string) => {
  if (name === undefined) {
    return null;
  }

  try {
    return await database.question.delete({
      include: {
        links: true,
      },
      where: {
        name,
      },
    });
  } catch (error) {
    logger.error(`Failed deleting question\n${error}`);
    return null;
  }
};

export const getNthQuestion = async (index?: number) => {
  if (index === undefined) {
    return null;
  }

  try {
    return await database.question.findFirst({
      include: {
        links: true,
      },
      orderBy: {
        name: "asc",
      },
      skip: index - 1,
    });
  } catch (error) {
    logger.error(`Failed obtaining nth question\n${error}`);
    return null;
  }
};
