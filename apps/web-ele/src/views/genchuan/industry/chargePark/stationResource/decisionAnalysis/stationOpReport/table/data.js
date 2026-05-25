function padTime(value) {
  return String(value).padStart(2, '0');
}

export function formatDateTime(value) {
  if (value === undefined || value === null || value === '') return '--';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getFullYear()}-${padTime(value.getMonth() + 1)}-${padTime(value.getDate())} ${padTime(value.getHours())}:${padTime(value.getMinutes())}:${padTime(value.getSeconds())}`;
  }
  if (typeof value === 'number' || /^\d+$/.test(String(value))) {
    const text = String(value);
    const timestamp = Number(text.length === 10 ? `${text}000` : text);
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime())) return formatDateTime(date);
  }
  const normalized = String(value)
    .replace('T', ' ')
    .replace(/\.\d+Z?$/, '');
  const parsed = new Date(String(value).replaceAll('-', '/'));
  if (!Number.isNaN(parsed.getTime())) return formatDateTime(parsed);
  return normalized.length >= 19 ? normalized.slice(0, 19) : normalized;
}

export function formatDateTimeRange(startTime, endTime) {
  const start = formatDateTime(startTime);
  const end = formatDateTime(endTime);
  if (start === '--' && end === '--') return '--';
  return [start, end].filter((item) => item !== '--').join(' - ');
}

function pickFirstValue(row, keys) {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return '';
}

export function formatStatPeriod(row = {}, cellValue = '') {
  const startTime = pickFirstValue(row, [
    'reportStartTime',
    'statStartTime',
    'statisticsStartTime',
    'startTime',
    'beginTime',
  ]);
  const endTime = pickFirstValue(row, [
    'reportEndTime',
    'statEndTime',
    'statisticsEndTime',
    'endTime',
    'finishTime',
  ]);
  if (startTime || endTime) {
    return formatDateTimeRange(startTime, endTime);
  }
  return (
    pickFirstValue(row, ['statPeriod', 'reportPeriod', 'period']) ||
    formatDateTime(cellValue)
  );
}

export const pageConfig = {
  apiName: 'StationOpReport',
  title: '场站资源周期报表',
  exportName: '场站周期报表.xlsx',
  nameField: 'reportCycle',
  primaryField: 'id',
  toolbar: ['create', 'search', 'export', 'refresh'],
  rowActionMap: {
    日报: ['detail', 'exportRow'],
    周报: ['detail', 'exportRow'],
    月报: ['detail', 'exportRow'],
    季报: ['detail', 'exportRow'],
    半年报: ['detail', 'exportRow'],
    年报: ['detail', 'exportRow'],
    自定义报表: ['detail', 'exportRow'],
    default: ['detail', 'exportRow'],
  },
  chart: {
    cards: [
      ['totalAreaCount', '总片区数'],
      ['coverStationCount', '覆盖场站数'],
      ['totalStationCount', '总场站数'],
      ['normalOperateCount', '正常运营数'],
      ['totalSpaceCount', '总车位数'],
      ['availableSpaceCount', '可用车位数'],
      ['effectiveRuleCount', '生效规则数'],
      ['orderCount', '订单量'],
      ['revenue', '营收'],
      ['recoveryRate', '追缴完成率'],
      ['depositOrderCount', '押金订单量'],
    ],
    map: true,
    line: ['lineData', 'date', 'orderCount', '本报表周期订单趋势'],
    bar: ['barData', 'areaName', 'stationCount', '关键维度分布'],
  },
};

export const searchFields = [
  {
    field: 'reportCycle',
    label: '报表周期',
    type: 'select',
    options: ['日报', '周报', '月报', '季报', '半年报', '年报', '自定义报表'],
    required: false,
  },
  {
    field: 'generateStatus',
    label: '生成状态',
    type: 'select',
    options: ['生成中', '生成成功', '生成失败'],
    required: false,
  },
];

export const formFields = [
  {
    field: 'reportCycle',
    label: '报表周期',
    type: 'select',
    options: ['日报', '周报', '月报', '季报', '半年报', '年报', '自定义报表'],
    required: true,
  },
  {
    field: 'reportStartTime',
    label: '报表开始时间',
    type: 'datetime',
    required: true,
  },
  {
    field: 'reportEndTime',
    label: '报表结束时间',
    type: 'datetime',
    required: true,
  },
  { field: 'remark', label: '备注', type: 'input', required: false },
];

export const tableColumns = [
  {
    field: 'reportCycle',
    label: '报表周期',
    minWidth: 120,
    drillType: 'filter',
  },
  {
    field: 'statPeriod',
    label: '统计时段',
    minWidth: 260,
    formatter: ({ cellValue, row }) => formatStatPeriod(row, cellValue),
  },
  {
    field: 'totalAreaCount',
    label: '总片区数',
    minWidth: 130,
    drillType: 'dialog',
    drillLabel: '片区明细',
  },
  {
    field: 'coverStationCount',
    label: '覆盖场站数',
    minWidth: 140,
    drillType: 'dialog',
    drillLabel: '场站明细',
  },
  {
    field: 'totalStationCount',
    label: '总场站数',
    minWidth: 130,
    drillType: 'dialog',
    drillLabel: '全场站明细',
  },
  {
    field: 'normalOperateCount',
    label: '正常运营数',
    minWidth: 130,
    drillType: 'dialog',
    drillLabel: '正常运营场站明细',
  },
  {
    field: 'totalSpaceCount',
    label: '总车位数',
    minWidth: 120,
    drillType: 'dialog',
    drillLabel: '车位总览明细',
  },
  {
    field: 'availableSpaceCount',
    label: '可用车位数',
    minWidth: 130,
    drillType: 'dialog',
    drillLabel: '可用车位明细',
  },
  {
    field: 'effectiveRuleCount',
    label: '生效规则数',
    minWidth: 130,
    drillType: 'dialog',
    drillLabel: '生效规则明细',
  },
  {
    field: 'orderCount',
    label: '订单量',
    minWidth: 120,
    drillType: 'dialog',
    drillLabel: '本报表周期订单明细',
  },
  {
    field: 'revenue',
    label: '营收',
    minWidth: 140,
    drillType: 'dialog',
    drillLabel: '本报表周期营收明细',
  },
  {
    field: 'recoveryRate',
    label: '追缴完成率',
    minWidth: 140,
    drillType: 'dialog',
    drillLabel: '追缴明细',
  },
  {
    field: 'depositOrderCount',
    label: '押金订单量',
    minWidth: 130,
    drillType: 'dialog',
    drillLabel: '押金订单明细',
  },
  {
    field: 'generateStatus',
    label: '生成状态',
    minWidth: 120,
    drillType: 'filter',
  },
  {
    field: 'generateTime',
    label: '报表生成时间',
    minWidth: 180,
    formatter: ({ cellValue }) => formatDateTime(cellValue),
  },
  {
    field: 'operator',
    label: '操作人',
    minWidth: 120,
    drillType: 'dialog',
    drillLabel: '操作人信息',
  },
  { field: 'exportCount', label: '报表导出次数', minWidth: 130 },
];

export const detailFields = [
  { key: 'reportCycle', label: '报表周期', section: '报表信息' },
  { key: 'statPeriod', label: '统计时段', section: '报表信息' },
  { key: 'generateStatus', label: '生成状态', section: '报表信息' },
  { key: 'generateTime', label: '报表生成时间', section: '报表信息' },
  { key: 'operator', label: '操作人', section: '报表信息' },
  { key: 'exportCount', label: '报表导出次数', section: '报表信息' },
  { key: 'totalAreaCount', label: '总片区数', section: '核心指标' },
  { key: 'coverStationCount', label: '覆盖场站数', section: '核心指标' },
  { key: 'totalStationCount', label: '总场站数', section: '核心指标' },
  { key: 'normalOperateCount', label: '正常运营数', section: '核心指标' },
  { key: 'totalSpaceCount', label: '总车位数', section: '核心指标' },
  { key: 'availableSpaceCount', label: '可用车位数', section: '核心指标' },
  { key: 'effectiveRuleCount', label: '生效规则数', section: '核心指标' },
  { key: 'orderCount', label: '订单量', section: '核心指标' },
  { key: 'revenue', label: '营收', section: '核心指标' },
  { key: 'recoveryRate', label: '追缴完成率', section: '核心指标' },
  { key: 'depositOrderCount', label: '押金订单量', section: '核心指标' },
];
