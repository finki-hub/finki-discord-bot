export const fetchJsonFromUrl = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
};

export const parseContent = (
  content: string,
  fallback: unknown = [],
): unknown => {
  if (content.length === 0) {
    return fallback;
  }

  return JSON.parse(content);
};
