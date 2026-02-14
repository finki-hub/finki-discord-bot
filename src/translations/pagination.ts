export const paginationStringFunctions = {
  footer: ({
    label,
    page,
    pages,
    total,
  }: {
    label: string;
    page: number;
    pages: number;
    total: number;
  }) => `Страна: ${page} / ${pages}  •  ${label}: ${total}`,
  noEntries: (label: string) => `Нема ${label.toLowerCase()}.`,
};
