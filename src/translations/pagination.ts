export const paginationStringFunctions = {
  footer: (page: number, pages: number, label: string, total: number) =>
    `Страна: ${page} / ${pages}  •  ${label}: ${total}`,
};
