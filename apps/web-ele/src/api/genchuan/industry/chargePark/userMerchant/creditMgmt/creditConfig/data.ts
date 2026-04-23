import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  CreditConfigChartVO,
  CreditConfigVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/creditMgmt/creditConfig';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

type CreditConfigApiExtraVO = CreditConfigVO & {
  accuracy?: number;
  applyRecords?: ApplyRecord[];
  auditLogs?: AuditLog[];
  auditSummary?: string;
  configType?: string;
  updater?: string;
};

export type CreditConfigStatus = '已生效' | '未生效';

export interface AuditLog {
  content: string;
  operator: string;
  remark?: string;
  time: string;
}

export interface ApplyRecord {
  applyResult: string;
  applyTarget: string;
  time: string;
}

export interface CreditConfigRow {
  accuracy: number;
  applyRecords: ApplyRecord[];
  auditLogs?: AuditLog[];
  auditSummary: string;
  configType: string;
  createTime: string;
  creator: string;
  effectTime: string;
  id: number;
  levelThreshold: string;
  remark: string;
  ruleDesc: string;
  status: CreditConfigStatus;
  updateTime: string;
  updater: string;
}

export const detailFields = [
  { key: 'configType', label: '配置类型' },
  { key: 'ruleDesc', label: '加减分规则' },
  { key: 'levelThreshold', label: '等级阈值' },
  {
    key: 'status',
    label: '配置状态',
    type: 'tag',
    tagType: (value: string) =>
      getStatusTagType(value as CreditConfigRow['status']),
  },
  { key: 'effectTime', label: '生效时间' },
  { key: 'applySummary', label: '评分应用记录' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updater', label: '最后更新人' },
  { key: 'updateTime', label: '最后更新时间' },
  { key: 'auditLogsSummary', label: '审计日志' },
  { key: 'remark', label: '备注' },
];

export const creditConfigStatusOptions: CreditConfigStatus[] = [
  '未生效',
  '已生效',
];

export const textObj = {
  addText: '新增信用配置',
  editText: '编辑信用配置',
};

export function classifyConfigType(ruleDesc: string) {
  if (
    ruleDesc.includes('逃单') ||
    ruleDesc.includes('违停') ||
    ruleDesc.includes('恶意')
  ) {
    return '特殊规则';
  }

  if (ruleDesc.includes('行业') || ruleDesc.includes('商户')) {
    return '行业规则';
  }

  return '基础规则';
}

export function getStatusTagType(status: CreditConfigRow['status']) {
  return status === '已生效' ? 'success' : 'warning';
}

export function formatApiTime(value?: null | number | string) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (value === '-') {
    return '-';
  }

  const timeValue = String(value);
  if (/^\d+$/.test(timeValue)) {
    const timestamp =
      timeValue.length === 10 ? Number(timeValue) * 1000 : Number(timeValue);

    return dayjs(timestamp).isValid()
      ? dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
      : '-';
  }

  return dayjs(timeValue).isValid()
    ? dayjs(timeValue).format('YYYY-MM-DD HH:mm:ss')
    : '-';
}

export function buildAuditLogs(row: CreditConfigRow): AuditLog[] {
  const logs: AuditLog[] = [];

  if (row.createTime !== '-') {
    logs.push({
      content: '创建信用配置',
      operator: row.creator || '-',
      time: row.createTime,
    });
  }

  if (row.status === '已生效' && row.effectTime !== '-') {
    logs.push({
      content: '信用配置生效',
      operator: row.updater || row.creator || '-',
      time: row.effectTime,
    });
  }

  if (
    row.updateTime !== '-' &&
    row.updateTime !== row.createTime &&
    row.auditSummary
  ) {
    logs.push({
      content: row.auditSummary,
      operator: row.updater || row.creator || '-',
      time: row.updateTime,
    });
  }

  return logs;
}

export function formatApplyRecords(
  records: CreditConfigRow['applyRecords'] = [],
) {
  if (records.length === 0) {
    return '暂无评分应用记录';
  }

  return records
    .map((item) => `${item.time} ${item.applyTarget}：${item.applyResult}`)
    .join('\n');
}

export function formatAuditLogs(logs?: AuditLog[]) {
  if (!logs?.length) {
    return '暂无审计日志';
  }

  return logs
    .map((item) => {
      const remark = item.remark ? `（${item.remark}）` : '';
      return `${item.time} ${item.operator}：${item.content}${remark}`;
    })
    .join('\n');
}

export function buildCreditConfigRowFromApi(
  data?: null | Partial<CreditConfigApiExtraVO>,
  fallback?: null | Partial<CreditConfigRow>,
): CreditConfigRow {
  const ruleDesc = data?.ruleDesc || fallback?.ruleDesc || '';
  let applyRecords: ApplyRecord[] = [];
  let auditLogs: AuditLog[] | undefined;

  if (Array.isArray(data?.applyRecords)) {
    applyRecords = data.applyRecords;
  } else if (Array.isArray(fallback?.applyRecords)) {
    applyRecords = fallback.applyRecords;
  }

  if (Array.isArray(data?.auditLogs)) {
    auditLogs = data.auditLogs;
  } else if (
    Array.isArray(fallback?.auditLogs) &&
    fallback.auditLogs.length > 0
  ) {
    auditLogs = fallback.auditLogs;
  }
  const row: CreditConfigRow = {
    accuracy: Number(data?.accuracy ?? fallback?.accuracy ?? 0),
    applyRecords,
    auditSummary:
      data?.auditSummary || fallback?.auditSummary || '更新信用配置',
    configType:
      data?.configType || fallback?.configType || classifyConfigType(ruleDesc),
    createTime: formatApiTime(data?.createTime ?? fallback?.createTime),
    creator: data?.creator || fallback?.creator || '-',
    effectTime: formatApiTime(data?.effectTime ?? fallback?.effectTime),
    id: Number(data?.id ?? fallback?.id ?? 0),
    levelThreshold: data?.levelThreshold || fallback?.levelThreshold || '',
    remark: data?.remark || fallback?.remark || '',
    ruleDesc,
    status: (data?.status ||
      fallback?.status ||
      '未生效') as CreditConfigStatus,
    updateTime: formatApiTime(data?.updateTime ?? fallback?.updateTime),
    updater:
      data?.updater ||
      fallback?.updater ||
      data?.creator ||
      fallback?.creator ||
      '-',
  };

  row.auditLogs = auditLogs || buildAuditLogs(row);

  return row;
}

function formatRate(value?: null | number) {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return '0%';
  }

  const percentValue = numericValue <= 1 ? numericValue * 100 : numericValue;

  return `${Number.parseFloat(percentValue.toFixed(2))}%`;
}

export function buildStatsDataFromApi(data?: Partial<CreditConfigChartVO>) {
  const configTypeDistribution = Array.isArray(data?.configTypeDistribution)
    ? data.configTypeDistribution
    : [];

  return {
    cards: [
      {
        title: '生效配置数',
        value: Number(data?.effectConfigCount ?? 0),
        desc: '当前已生效的信用配置数量',
        color: '#2F80ED',
      },
      {
        title: '信用评分准确率',
        value: formatRate(data?.creditScoreAccuracy),
        desc: '信用评分模型验证结果',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '配置类型占比',
        type: 'pie',
        data: configTypeDistribution.map((item) => ({
          name: item.type,
          value: Number(item.count ?? 0),
        })),
      },
    ],
  };
}

export function buildCreditConfigQueryParams(formValues: Record<string, any>) {
  const effectTime =
    Array.isArray(formValues.effectTime) && formValues.effectTime.length === 2
      ? `${dayjs(formValues.effectTime[0]).format('YYYY-MM-DD HH:mm:ss')},${dayjs(formValues.effectTime[1]).format('YYYY-MM-DD HH:mm:ss')}`
      : undefined;

  return {
    effectTime,
    levelThreshold: formValues.levelThreshold || undefined,
    remark: formValues.remark || undefined,
    ruleDesc: formValues.ruleDesc || undefined,
    status: formValues.status || undefined,
  };
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'ruleDesc',
      label: '加减分规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入加减分规则',
      },
    },
    {
      fieldName: 'levelThreshold',
      label: '等级阈值',
      component: 'Input',
      componentProps: {
        placeholder: '请输入等级阈值',
      },
    },
    {
      fieldName: 'status',
      label: '配置状态',
      component: 'Select',
      componentProps: {
        options: creditConfigStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择配置状态',
      },
    },
    {
      fieldName: 'effectTime',
      label: '生效时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useCreateSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'ruleDesc',
      label: '加减分规则',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入加减分规则',
        maxlength: 200,
      },
      rules: 'required',
    },
    {
      fieldName: 'levelThreshold',
      label: '等级阈值',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入等级阈值',
        maxlength: 200,
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        maxlength: 200,
      },
    },
  ];
}

export function useEditSchema(): VbenFormSchema[] {
  return useCreateSchema();
}

export function useGridColumns(): VxeTableGridOptions<CreditConfigRow>['columns'] {
  return [
    {
      field: 'ruleDesc',
      title: '加减分规则',
      minWidth: 260,
      slots: { default: 'ruleDesc' },
    },
    {
      field: 'levelThreshold',
      title: '等级阈值',
      minWidth: 260,
      slots: { default: 'levelThreshold' },
    },
    {
      field: 'status',
      title: '配置状态',
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'effectTime',
      title: '生效时间',
      minWidth: 170,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 170,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 200,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
