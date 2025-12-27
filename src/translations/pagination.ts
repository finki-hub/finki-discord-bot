export const paginationStringFunctions = {
  commandPage: (page: number, pages: number, total: number) =>
    `Страна: ${page} / ${pages}  •  Команди: ${total}`,

  membersPage: (page: number, pages: number, total: number) =>
    `Страна: ${page} / ${pages}  •  Членови: ${total}`,
};
