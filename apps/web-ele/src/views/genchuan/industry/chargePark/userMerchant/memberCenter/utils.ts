import { nextTick } from 'vue';

import dayjs from 'dayjs';

export type {
  ActiveFilterTag,
  FilterTagConfig,
} from '#/views/genchuan/industry/chargePark/userMerchant/utils/filterTags';

export { buildActiveFilterTags } from '#/views/genchuan/industry/chargePark/userMerchant/utils/filterTags';

export const QUERY_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const FORM_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const STATUS_DISABLED = 0;
export const STATUS_ENABLED = 1;

const NUMERIC_TIMESTAMP_PATTERN = /^\d+$/;

export const normalStatusOptions = [
  { label: '正常', value: STATUS_ENABLED },
  { label: '禁用', value: STATUS_DISABLED },
];

export const lifecycleStatusOptions = [
  { label: '已生效', value: STATUS_ENABLED },
  { label: '未生效', value: STATUS_DISABLED },
];

export const recordStatusOptions = [
  { label: '正常', value: STATUS_ENABLED },
  { label: '异常', value: STATUS_DISABLED },
];

function hasQueryValue(value: any) {
  return !(
    value === '' ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0)
  );
}

export function cleanQueryParams<T extends Record<string, any>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => hasQueryValue(value)),
  ) as Partial<T>;
}

export function buildDateRangeByChartName(dateText: string) {
  const date = dayjs(dateText);

  if (!date.isValid()) {
    return null;
  }

  const isDayValue = /^\d{4}-\d{2}-\d{2}$/.test(dateText);

  return [
    date.startOf(isDayValue ? 'day' : 'month').format(QUERY_TIME_FORMAT),
    date.endOf(isDayValue ? 'day' : 'month').format(QUERY_TIME_FORMAT),
  ];
}

export function buildRecentDateRange(days = 30) {
  return [
    dayjs().subtract(days, 'day').startOf('day').format(QUERY_TIME_FORMAT),
    dayjs().endOf('day').format(QUERY_TIME_FORMAT),
  ];
}

export function buildTodayDateRange() {
  return [
    dayjs().startOf('day').format(QUERY_TIME_FORMAT),
    dayjs().endOf('day').format(QUERY_TIME_FORMAT),
  ];
}

function parseDateTimeValue(value?: null | number | string) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const text = String(value).trim();
  if (text === '0') {
    return null;
  }

  let timestampValue: null | number = null;

  if (typeof value === 'number') {
    timestampValue = value;
  } else if (NUMERIC_TIMESTAMP_PATTERN.test(text)) {
    timestampValue = Number(text);
  }

  if (timestampValue !== null && Number.isFinite(timestampValue)) {
    if (text.length === 10) {
      return dayjs(timestampValue * 1000);
    }

    if (text.length === 13) {
      return dayjs(timestampValue);
    }
  }

  return dayjs(text);
}

export function normalizeDateTimeFormValue(value?: null | number | string) {
  const parsed = parseDateTimeValue(value);

  if (!parsed) {
    return undefined;
  }

  return parsed.isValid() ? parsed.format(FORM_TIME_FORMAT) : String(value);
}

export function formatDateTimeValue(value?: null | number | string) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const parsed = parseDateTimeValue(value);
  if (!parsed) {
    return '-';
  }

  return parsed.isValid()
    ? parsed.format('YYYY-MM-DD HH:mm:ss')
    : String(value);
}

export function formatDateValue(value?: null | number | string) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const parsed = parseDateTimeValue(value);
  if (!parsed) {
    return '-';
  }

  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : String(value);
}

export function formatPercentValue(value?: null | number | string) {
  const numberValue = Number(value ?? 0);
  const percentValue =
    Number.isFinite(numberValue) && Math.abs(numberValue) <= 1
      ? numberValue * 100
      : numberValue;

  return `${percentValue.toFixed(2)}%`;
}

export function isEnabledStatus(status?: number | string) {
  return Number(status) === STATUS_ENABLED;
}

export function formatNormalStatus(status?: number | string) {
  return isEnabledStatus(status) ? '正常' : '禁用';
}

export function getNormalStatusTagType(status?: number | string) {
  return isEnabledStatus(status) ? 'success' : 'danger';
}

export function formatLifecycleStatus(status?: number | string) {
  return isEnabledStatus(status) ? '已生效' : '未生效';
}

export function getLifecycleStatusTagType(status?: number | string) {
  return isEnabledStatus(status) ? 'success' : 'warning';
}

export function formatRecordStatus(status?: number | string) {
  return isEnabledStatus(status) ? '正常' : '异常';
}

export function getRecordStatusTagType(status?: number | string) {
  return isEnabledStatus(status) ? 'success' : 'danger';
}

export function formatOptionLabel(
  options: Array<{ label: string; value: number | string }>,
  value: number | string,
) {
  return (
    options.find((item) => String(item.value) === String(value))?.label ||
    String(value)
  );
}

type GridLayoutApi = {
  grid?: {
    recalculate?: (force?: boolean) => Promise<void> | void;
    refreshScroll?: () => Promise<void> | void;
  };
};

function waitForLayoutStable() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

export async function refreshStatsLayout(gridApi: GridLayoutApi) {
  await nextTick();
  await waitForLayoutStable();
  await gridApi.grid?.recalculate?.(true);
  await gridApi.grid?.refreshScroll?.();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('resize'));
  }
}
