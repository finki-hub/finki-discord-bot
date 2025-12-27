/* eslint-disable @typescript-eslint/restrict-template-expressions */

export const databaseErrorFunctions = {
  createAntoError: (error: unknown) => `Failed creating Anto fact\n${error}`,

  createAntosError: (error: unknown) => `Failed creating Anto facts\n${error}`,

  createExperienceError: (error: unknown) =>
    `Failed creating experience\n${error}`,

  createLinkError: (error: unknown) => `Failed creating link\n${error}`,

  createQuestionError: (error: unknown) => `Failed creating question\n${error}`,

  createQuestionLinkError: (error: unknown) =>
    `Failed creating question link\n${error}`,

  createQuestionLinksError: (error: unknown) =>
    `Failed creating question links\n${error}`,

  createReminderError: (error: unknown) => `Failed creating reminder\n${error}`,

  deleteAntoError: (error: unknown) => `Failed deleting Anto fact\n${error}`,

  deleteLinkError: (error: unknown) => `Failed deleting link\n${error}`,

  deleteQuestionError: (error: unknown) => `Failed deleting question\n${error}`,

  deleteQuestionLinksByQuestionIdError: (error: unknown) =>
    `Failed deleting question links by question ID\n${error}`,

  deleteReminderError: (error: unknown) => `Failed deleting reminder\n${error}`,

  getAntosError: (error: unknown) => `Failed getting Anto facts\n${error}`,

  getExperienceByUserIdError: (error: unknown) =>
    `Failed getting experience by user ID\n${error}`,

  getExperienceCountError: (error: unknown) =>
    `Failed getting experience count\n${error}`,

  getExperienceSortedError: (error: unknown) =>
    `Failed getting sorted experience\n${error}`,

  getLinkError: (error: unknown) => `Failed getting link\n${error}`,

  getLinkNamesError: (error: unknown) => `Failed getting link names\n${error}`,

  getLinksError: (error: unknown) => `Failed getting links\n${error}`,

  getNthLinkError: (error: unknown) => `Failed getting nth link\n${error}`,

  getNthQuestionError: (error: unknown) =>
    `Failed getting nth question\n${error}`,

  getQuestionError: (error: unknown) => `Failed getting question\n${error}`,

  getQuestionNamesError: (error: unknown) =>
    `Failed getting question names\n${error}`,

  getQuestionsError: (error: unknown) => `Failed getting questions\n${error}`,

  getRandomAntoError: (error: unknown) =>
    `Failed getting random Anto fact\n${error}`,

  getReminderByIdError: (error: unknown) =>
    `Failed getting reminder by ID\n${error}`,

  getRemindersByUserIdError: (error: unknown) =>
    `Failed getting reminders by user ID\n${error}`,

  getRemindersError: (error: unknown) => `Failed getting reminders\n${error}`,

  updateExperienceError: (error: unknown) =>
    `Failed updating experience\n${error}`,

  updateLinkError: (error: unknown) => `Failed updating link\n${error}`,

  updateQuestionError: (error: unknown) => `Failed updating question\n${error}`,
};
