import dayjs from 'dayjs';

const QUERY_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export function formatQueryDateTimeRange(value?: unknown) {
  if (!Array.isArray(value) || value.length !== 2) {
    return undefined;
  }

  const range = value.map((item) => dayjs(item));

  if (range.some((item) => !item.isValid())) {
    return undefined;
  }

  return range.map((item) => item.format(QUERY_DATE_TIME_FORMAT));
}

export function normalizeQueryDateTimeRanges<T extends Record<string, any>>(
  params: T,
  fields: string[],
) {
  const nextParams = { ...params };

  for (const field of fields) {
    const range = formatQueryDateTimeRange(nextParams[field]);

    if (range) {
      nextParams[field] = range;
    }
  }

  return nextParams;
}
