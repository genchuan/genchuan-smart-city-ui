export type FilterTagType =
  | 'danger'
  | 'info'
  | 'primary'
  | 'success'
  | 'warning';

export type ActiveFilterTag = {
  key: string;
  label: string;
  source: string;
  type: FilterTagType;
  value: string;
};

export type FilterTagConfig = {
  formatter?: (value: any) => string;
  label: string;
  type?: FilterTagType;
};

export type FilterTagGroup = {
  configs: Record<string, FilterTagConfig>;
  source: string;
  values: Record<string, any>;
};

export function hasFilterValue(value: any) {
  return !(
    value === '' ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0)
  );
}

export function formatFilterValue(value: any) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => hasFilterValue(item))
      .map(String)
      .join(' 至 ');
  }

  return String(value);
}

function formatTagDisplayValue(value: string) {
  return value.replace(
    /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/g,
    '$1 $2',
  );
}

export function buildActiveFilterTags(groups: FilterTagGroup[]) {
  const seenKeys = new Set<string>();
  const tags: ActiveFilterTag[] = [];

  groups.forEach(({ configs, source, values }) => {
    Object.entries(values).forEach(([key, value]) => {
      const config = configs[key];

      if (!config || seenKeys.has(key) || !hasFilterValue(value)) {
        return;
      }

      const formattedValue = config.formatter
        ? config.formatter(value)
        : formatFilterValue(value);
      const displayValue = formatTagDisplayValue(formattedValue);

      if (!hasFilterValue(displayValue)) {
        return;
      }

      seenKeys.add(key);
      tags.push({
        key,
        label: config.label,
        source,
        type: config.type || 'info',
        value: displayValue,
      });
    });
  });

  return tags;
}
