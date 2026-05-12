import dayjs from 'dayjs';

export function buildDateRangeByChartName(dateText: string) {
  const date = dayjs(dateText);

  if (!date.isValid()) {
    return null;
  }

  const isDayValue = /^\d{4}-\d{2}-\d{2}$/.test(dateText);

  return [
    date.startOf(isDayValue ? 'day' : 'month').format('YYYY-MM-DD HH:mm:ss'),
    date.endOf(isDayValue ? 'day' : 'month').format('YYYY-MM-DD HH:mm:ss'),
  ];
}
