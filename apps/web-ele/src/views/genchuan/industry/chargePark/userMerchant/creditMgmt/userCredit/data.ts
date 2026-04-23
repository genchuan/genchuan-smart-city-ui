import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  UserCreditAuditLogVO,
  UserCreditChangeRecordVO,
  UserCreditChartVO,
  UserCreditDetailVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/creditMgmt/userCredit';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type CreditLevel = '中等' | '优秀' | '极差' | '良好' | '较差';
export type CreditStatus = '低信用' | '正常信用';

export interface AuditLog {
  content: string;
  operator: string;
  remark?: string;
  time: string;
}

export interface CreditChangeRecord {
  afterScore: number;
  beforeScore: number;
  changeReason: string;
  changeTime: string;
  operator: string;
}

export interface UserProfileInfo {
  id: number;
  nickname: string;
  phone: string;
  userType: string;
}

export interface UserSelectOption {
  label: string;
  value: number;
}

export interface UserCreditRow {
  auditLogs?: AuditLog[];
  auditSummary: string;
  changeRecords: CreditChangeRecord[];
  createTime: string;
  creator: string;
  creditLevel: CreditLevel;
  creditScore: number;
  creditStatus: CreditStatus;
  id: number;
  phone: string;
  remark: string;
  ruleCode: string;
  ruleDesc: string;
  updateTime: string;
  updater: string;
  userId: number;
  userInfo?: UserProfileInfo;
  userName: string;
  userType: string;
}

export const creditLevelOptions: CreditLevel[] = [
  '优秀',
  '良好',
  '中等',
  '较差',
  '极差',
];

export const detailFields = [
  { key: 'userName', label: '用户名称' },
  { key: 'maskedPhone', label: '联系电话' },
  {
    key: 'userType',
    label: '用户类型',
    type: 'tag',
    tagType: () => 'primary',
  },
  { key: 'creditScore', label: '信用分' },
  {
    key: 'creditLevel',
    label: '信用等级',
    type: 'tag',
    tagType: (value: string) =>
      getCreditLevelTagType(value as UserCreditRow['creditLevel']),
  },
  {
    key: 'creditStatus',
    label: '记录状态',
    type: 'tag',
    tagType: (value: string) =>
      getCreditStatusTagType(value as UserCreditRow['creditStatus']),
  },
  { key: 'ruleCode', label: '评分规则编码' },
  { key: 'ruleDesc', label: '评分规则' },
  { key: 'updateTime', label: '更新时间' },
  { key: 'changeSummary', label: '评分明细' },
  { key: 'auditLogsSummary', label: '审计日志' },
  { key: 'remark', label: '备注' },
];

function getCreditStatus(score: number): CreditStatus {
  return score < 70 ? '低信用' : '正常信用';
}

export function getCreditLevelTagType(level: UserCreditRow['creditLevel']) {
  switch (level) {
    case '中等': {
      return 'warning';
    }
    case '优秀': {
      return 'success';
    }
    case '极差':
    case '较差': {
      return 'danger';
    }
    case '良好': {
      return 'primary';
    }
    default: {
      return 'info';
    }
  }
}

export function getCreditStatusTagType(status: UserCreditRow['creditStatus']) {
  return status === '正常信用' ? 'success' : 'danger';
}

export function maskPhone(phone: string) {
  if (!phone || phone.length < 7 || phone.includes('*')) {
    return phone || '-';
  }

  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

/** 格式化接口时间 */
export function formatApiTime(value?: null | number | string) {
  if (value === null || value === undefined || value === '') {
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

function buildChangeRecord(
  data?: null | Partial<UserCreditChangeRecordVO>,
): CreditChangeRecord {
  return {
    afterScore: Number(data?.afterScore ?? 0),
    beforeScore: Number(data?.beforeScore ?? 0),
    changeReason: data?.changeReason || '-',
    changeTime: formatApiTime(data?.changeTime),
    operator: data?.operator || '-',
  };
}

function buildAuditLog(data?: null | Partial<UserCreditAuditLogVO>): AuditLog {
  return {
    content: data?.content || '-',
    operator: data?.operator || '-',
    remark: data?.remark || '',
    time: formatApiTime(data?.time),
  };
}

export function buildAuditLogs(row: UserCreditRow): AuditLog[] {
  const logs: AuditLog[] = [
    {
      content: '创建信用记录',
      operator: row.creator,
      time: row.createTime,
    },
  ];

  if (row.updateTime !== row.createTime) {
    logs.push({
      content: row.auditSummary || '更新信用记录',
      operator: row.updater,
      time: row.updateTime,
    });
  }

  return logs;
}

export function formatChangeRecords(records: CreditChangeRecord[] = []) {
  if (records.length === 0) {
    return '暂无评分明细';
  }

  return records
    .map(
      (item) =>
        `${item.changeTime} ${item.operator}：${item.beforeScore} -> ${item.afterScore}，${item.changeReason}`,
    )
    .join('\n');
}

export function formatAuditLogs(logs: AuditLog[] = []) {
  if (logs.length === 0) {
    return '暂无审计日志';
  }

  return logs
    .map((item) => {
      const remark = item.remark ? `（${item.remark}）` : '';
      return `${item.time} ${item.operator}：${item.content}${remark}`;
    })
    .join('\n');
}

export function buildUserSelectOptions(
  users?: Array<Partial<UserProfileInfo>>,
): UserSelectOption[] {
  const list = Array.isArray(users) ? users : [];

  return list
    .map((item) => ({
      label: String(item.nickname || ''),
      value: Number(item.id ?? 0),
    }))
    .filter((item) => item.label && item.value > 0);
}

export function buildUserCreditRowFromApi(
  data?: null | Partial<UserCreditDetailVO>,
  fallback?: null | Partial<UserCreditRow>,
  userInfo?: null | Partial<UserProfileInfo>,
): UserCreditRow {
  const userId = Number(data?.userId ?? fallback?.userId ?? 0);
  const profile = userInfo || fallback?.userInfo;
  const creditScore = Number(data?.creditScore ?? fallback?.creditScore ?? 0);
  let changeRecords: CreditChangeRecord[] = [];
  let auditLogs: AuditLog[] | undefined;

  if (Array.isArray(data?.changeRecords)) {
    changeRecords = data.changeRecords.map((item) => buildChangeRecord(item));
  } else if (Array.isArray(fallback?.changeRecords)) {
    changeRecords = fallback.changeRecords;
  }

  if (Array.isArray(data?.auditLogs)) {
    auditLogs = data.auditLogs.map((item) => buildAuditLog(item));
  } else if (Array.isArray(fallback?.auditLogs)) {
    auditLogs = fallback.auditLogs;
  }
  const row: UserCreditRow = {
    auditSummary:
      data?.auditSummary || fallback?.auditSummary || '更新信用记录',
    changeRecords,
    createTime: formatApiTime(data?.createTime ?? fallback?.createTime),
    creator: data?.creator || fallback?.creator || '-',
    creditLevel: (data?.creditLevel ||
      fallback?.creditLevel ||
      '中等') as CreditLevel,
    creditScore,
    creditStatus: getCreditStatus(creditScore),
    id: Number(data?.id ?? fallback?.id ?? 0),
    phone: data?.phone || profile?.phone || fallback?.phone || '-',
    remark: data?.remark || fallback?.remark || '',
    ruleCode: data?.ruleCode || fallback?.ruleCode || '-',
    ruleDesc:
      data?.ruleDesc ||
      fallback?.ruleDesc ||
      data?.ruleCode ||
      fallback?.ruleCode ||
      '-',
    updateTime: formatApiTime(data?.updateTime ?? fallback?.updateTime),
    updater:
      data?.updater ||
      fallback?.updater ||
      data?.creator ||
      fallback?.creator ||
      '-',
    userId,
    userInfo:
      userId > 0
        ? {
            id: userId,
            nickname:
              data?.userName ||
              profile?.nickname ||
              fallback?.userName ||
              `用户${userId}`,
            phone: data?.phone || profile?.phone || fallback?.phone || '-',
            userType:
              data?.userType || profile?.userType || fallback?.userType || '-',
          }
        : undefined,
    userName:
      data?.userName ||
      profile?.nickname ||
      fallback?.userName ||
      (userId > 0 ? `用户${userId}` : '-'),
    userType: data?.userType || profile?.userType || fallback?.userType || '-',
  };

  row.auditLogs = auditLogs || buildAuditLogs(row);

  return row;
}

export function buildStatsDataFromApi(data?: Partial<UserCreditChartVO>) {
  const creditLevelDistribution = Array.isArray(data?.creditLevelDistribution)
    ? data.creditLevelDistribution
    : [];

  return {
    cards: [
      {
        title: '平均信用分',
        value: Number(data?.avgCreditScore ?? 0),
        desc: '当前用户信用平均分',
        color: '#2F80ED',
      },
      {
        title: '低信用用户数',
        value: Number(data?.lowCreditUserCount ?? 0),
        desc: '较差 / 极差用户预警',
        color: '#EB5757',
      },
    ],
    charts: [
      {
        title: '信用等级分布',
        type: 'pie',
        data: creditLevelDistribution.map((item) => ({
          name: item.level,
          value: Number(item.count ?? 0),
        })),
      },
    ],
  };
}

export function buildUserCreditQueryParams(
  formValues: Record<string, any>,
  drillFilters?: {
    creditScore?: number | string;
  },
) {
  const updateTime =
    Array.isArray(formValues.updateTime) && formValues.updateTime.length === 2
      ? `${dayjs(formValues.updateTime[0]).format('YYYY-MM-DD HH:mm:ss')},${dayjs(formValues.updateTime[1]).format('YYYY-MM-DD HH:mm:ss')}`
      : undefined;
  const userId = Number(formValues.userId || 0);

  return {
    creditLevel: formValues.creditLevel || undefined,
    creditScore: drillFilters?.creditScore || undefined,
    remark: formValues.remark || undefined,
    ruleCode: formValues.ruleCode || undefined,
    updateTime,
    userId: userId > 0 ? userId : undefined,
  };
}

export function useSearchSchema(
  currentUserOptions: UserSelectOption[] = [],
): VbenFormSchema[] {
  return [
    {
      fieldName: 'userId',
      label: '用户名称',
      component: 'Select',
      componentProps: {
        clearable: true,
        filterable: true,
        options: currentUserOptions,
        placeholder: '请选择用户名称',
      },
    },
    {
      fieldName: 'creditLevel',
      label: '信用等级',
      component: 'Select',
      componentProps: {
        options: creditLevelOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择信用等级',
      },
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions<UserCreditRow>['columns'] {
  return [
    {
      field: 'userName',
      title: '用户名称',
      minWidth: 140,
      slots: { default: 'userName' },
    },
    {
      field: 'creditScore',
      title: '信用分',
      minWidth: 90,
      slots: { default: 'creditScore' },
    },
    {
      field: 'creditLevel',
      title: '信用等级',
      minWidth: 110,
      slots: { default: 'creditLevel' },
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 170,
    },
    {
      field: 'ruleCode',
      title: '评分规则',
      minWidth: 130,
    },
    {
      field: 'updater',
      title: '最后更新人',
      minWidth: 110,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 200,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
