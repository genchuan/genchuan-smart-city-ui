import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MerchantAccountLogVO,
  MerchantCouponInfoVO,
  MerchantInfoAuditLogVO,
  MerchantInfoChartVO,
  MerchantInfoDetailVO,
  MerchantInfoOperatorVO,
  MerchantLinkInfoVO,
  MerchantRechargeInfoVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

const QUERY_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export type MerchantStatus = '已驳回' | '待审核' | '正常' | '禁用';

export interface MerchantAccountLog {
  afterBalance: number;
  amount: number;
  time: string;
  type: string;
}

export interface MerchantLinkInfo {
  apiUrl: string;
  linkType: string;
  status: string;
}

export interface MerchantRechargeInfo {
  amount: number;
  payChannel: string;
  status: string;
  time: string;
}

export interface MerchantCouponInfo {
  couponName: string;
  sendCount: number;
  status: string;
  useCount: number;
}

export interface AuditLog {
  content: string;
  operator: string;
  remark?: string;
  time: string;
}

export interface OperatorInfo {
  account: string;
  dept: string;
  name: string;
  phone: string;
  role: string;
}

export interface MerchantInfoRow {
  accountLogs: MerchantAccountLog[];
  address: string;
  auditLogs?: AuditLog[];
  auditSummary: string;
  auditorId?: number;
  auditorInfo?: OperatorInfo;
  auditorName: string;
  auditTime: string;
  contact: string;
  couponRecords: MerchantCouponInfo[];
  createTime: string;
  creator: string;
  creatorId?: number;
  creatorInfo?: OperatorInfo;
  id: number;
  linkRecords: MerchantLinkInfo[];
  merchantType: string;
  name: string;
  phone: string;
  rechargeRecords: MerchantRechargeInfo[];
  registerTime: string;
  remark: string;
  status: MerchantStatus;
  updateTime: string;
  updater: string;
  updaterId?: number;
  updaterInfo?: OperatorInfo;
  walletBalance: number;
}

export const detailFields = [
  { key: 'name', label: '商户名称' },
  { key: 'contact', label: '联系人' },
  { key: 'maskedPhone', label: '联系手机号' },
  {
    key: 'merchantType',
    label: '商户类型',
    type: 'tag',
    tagType: () => 'primary',
  },
  { key: 'address', label: '地址' },
  { key: 'registerTime', label: '注册时间' },
  {
    key: 'status',
    label: '商户状态',
    type: 'tag',
    tagType: (value: string) => {
      switch (value) {
        case '已驳回':
        case '禁用': {
          return 'danger';
        }
        case '待审核': {
          return 'warning';
        }
        case '正常': {
          return 'success';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  { key: 'walletDisplay', label: '账户余额' },
  { key: 'accountSummary', label: '账户明细' },
  { key: 'linkSummary', label: '对接信息' },
  { key: 'rechargeSummary', label: '充值记录' },
  { key: 'couponSummary', label: '发券记录' },
  { key: 'auditorName', label: '审核人' },
  { key: 'auditTime', label: '审核时间' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updater', label: '最后更新人' },
  { key: 'updateTime', label: '最后更新时间' },
  { key: 'auditLogsSummary', label: '审计日志' },
  { key: 'remark', label: '备注' },
];

export const merchantStatusOptions: MerchantStatus[] = [
  '待审核',
  '正常',
  '禁用',
  '已驳回',
];

export const merchantTypeOptions = ['充电商户', '停车商户', '充停一体商户'];

export const textObj = {
  addText: '新增商户',
  editText: '编辑商户',
};

const operatorNameByIdMap: Record<number, string> = {
  1: 'admin',
  2: '李主管',
  3: '王客服',
};

/**
 * 操作人员信息兜底
 */
const operatorMap: Record<string, OperatorInfo> = {
  admin: {
    account: 'admin',
    dept: '平台运营中心',
    name: 'admin',
    phone: '13800000001',
    role: '系统管理员',
  },
  李主管: {
    account: 'lizg',
    dept: '商户运营组',
    name: '李主管',
    phone: '13800000002',
    role: '运营主管',
  },
  王客服: {
    account: 'wangkf',
    dept: '商户服务组',
    name: '王客服',
    phone: '13800000004',
    role: '客服专员',
  },
};

export function maskPhone(phone: string) {
  if (!phone || phone.length < 7 || phone.includes('*')) {
    return phone;
  }

  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

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

export function getOperatorDetail(
  name: string,
  detail?: null | Partial<MerchantInfoOperatorVO>,
  operatorId?: null | number,
) {
  const fallbackName =
    (operatorId ? operatorNameByIdMap[operatorId] : undefined) || name || '-';
  const fallback = operatorMap[fallbackName] || {
    account: fallbackName,
    dept: '未分配部门',
    name: fallbackName,
    phone: '-',
    role: '平台操作人',
  };

  if (!detail) {
    return fallback;
  }

  return {
    account: detail.account || fallback.account,
    dept: detail.deptName || detail.dept || fallback.dept,
    name: detail.name || detail.nickname || fallback.name,
    phone: detail.phone || detail.mobile || fallback.phone,
    role: Array.isArray(detail.roleNames)
      ? detail.roleNames.join('、')
      : detail.role || fallback.role,
  };
}

function buildAccountLog(
  data?: null | Partial<MerchantAccountLogVO>,
): MerchantAccountLog {
  return {
    afterBalance: Number(data?.afterBalance ?? 0),
    amount: Number(data?.amount ?? 0),
    time: formatApiTime(data?.time),
    type: data?.type || '-',
  };
}

function buildLinkRecord(
  data?: null | Partial<MerchantLinkInfoVO>,
): MerchantLinkInfo {
  return {
    apiUrl: data?.apiUrl || '-',
    linkType: data?.linkType || '-',
    status: data?.status || '-',
  };
}

function buildRechargeRecord(
  data?: null | Partial<MerchantRechargeInfoVO>,
): MerchantRechargeInfo {
  return {
    amount: Number(data?.amount ?? 0),
    payChannel: data?.payChannel || '-',
    status: data?.status || '-',
    time: formatApiTime(data?.time),
  };
}

function buildCouponRecord(
  data?: null | Partial<MerchantCouponInfoVO>,
): MerchantCouponInfo {
  return {
    couponName: data?.couponName || '-',
    sendCount: Number(data?.sendCount ?? 0),
    status: data?.status || '-',
    useCount: Number(data?.useCount ?? 0),
  };
}

function buildAuditLog(
  data?: null | Partial<MerchantInfoAuditLogVO>,
): AuditLog {
  return {
    content: data?.content || '-',
    operator: data?.operator || '-',
    remark: data?.remark,
    time: formatApiTime(data?.time),
  };
}

export function formatAccountLogs(logs: MerchantAccountLog[] = []) {
  if (logs.length === 0) {
    return '暂无账户明细';
  }

  return logs
    .map(
      (item) =>
        `${item.time} ${item.type} ${item.amount}，余额 ${item.afterBalance}`,
    )
    .join('\n');
}

export function formatLinkRecords(records: MerchantLinkInfo[] = []) {
  if (records.length === 0) {
    return '暂无对接信息';
  }

  return records
    .map((item) => `${item.linkType} / ${item.status} / ${item.apiUrl}`)
    .join('\n');
}

export function formatRechargeRecords(records: MerchantRechargeInfo[] = []) {
  if (records.length === 0) {
    return '暂无充值记录';
  }

  return records
    .map(
      (item) =>
        `${item.time} ${item.payChannel} ${item.amount}（${item.status}）`,
    )
    .join('\n');
}

export function formatCouponRecords(records: MerchantCouponInfo[] = []) {
  if (records.length === 0) {
    return '暂无发券记录';
  }

  return records
    .map(
      (item) =>
        `${item.couponName} / 发放 ${item.sendCount} / 核销 ${item.useCount} / ${item.status}`,
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
      return `${item.time} ${item.operator}（${item.content}${remark}）`;
    })
    .join('\n');
}

export function buildAuditLogs(row: MerchantInfoRow): AuditLog[] {
  const logs: AuditLog[] = [
    {
      content: '创建商户',
      operator: row.creator,
      time: row.createTime,
    },
  ];

  if (row.auditTime !== '-' && row.auditorName !== '-') {
    logs.push({
      content: row.status === '已驳回' ? '审核驳回' : '审核通过',
      operator: row.auditorName,
      remark: row.status === '已驳回' ? row.auditSummary : undefined,
      time: row.auditTime,
    });
  }

  if (row.updateTime !== row.createTime && row.updateTime !== row.auditTime) {
    logs.push({
      content: row.auditSummary || '更新商户信息',
      operator: row.updater,
      time: row.updateTime,
    });
  }

  return logs;
}

/**
 * 接口数据转表格行
 */
export function buildMerchantRowFromApi(
  data: Partial<MerchantInfoDetailVO>,
  fallback: Partial<MerchantInfoRow> = {},
): MerchantInfoRow {
  const creator =
    data.creator ||
    data.creatorInfo?.name ||
    data.creatorInfo?.nickname ||
    fallback.creator ||
    '-';
  const updater =
    data.updater ||
    data.updaterInfo?.name ||
    data.updaterInfo?.nickname ||
    fallback.updater ||
    creator;
  const auditorName =
    data.auditorInfo?.name ||
    data.auditorInfo?.nickname ||
    fallback.auditorName ||
    (data.auditorId ? operatorNameByIdMap[data.auditorId] : undefined) ||
    '-';
  const auditorInfo = (() => {
    if (auditorName === '-') {
      return undefined;
    }

    if (data.auditorInfo) {
      return getOperatorDetail(auditorName, data.auditorInfo, data.auditorId);
    }

    return fallback.auditorInfo;
  })();

  const row: MerchantInfoRow = {
    accountLogs: Array.isArray(data.accountLogs)
      ? data.accountLogs.map((item) => buildAccountLog(item))
      : fallback.accountLogs || [],
    address: data.address || fallback.address || '',
    auditLogs: Array.isArray(data.auditLogs)
      ? data.auditLogs.map((item) => buildAuditLog(item))
      : fallback.auditLogs || [],
    auditSummary: data.auditSummary || fallback.auditSummary || '创建商户',
    auditorId: Number(data.auditorId ?? fallback.auditorId ?? 0) || undefined,
    auditorInfo,
    auditorName,
    auditTime: formatApiTime(data.auditTime ?? fallback.auditTime),
    contact: data.contact || fallback.contact || '-',
    couponRecords: Array.isArray(data.couponRecords)
      ? data.couponRecords.map((item) => buildCouponRecord(item))
      : fallback.couponRecords || [],
    createTime: formatApiTime(data.createTime ?? fallback.createTime),
    creator,
    creatorId: Number(data.creatorId ?? fallback.creatorId ?? 0) || undefined,
    creatorInfo: data.creatorInfo
      ? getOperatorDetail(creator, data.creatorInfo, data.creatorId)
      : fallback.creatorInfo,
    id: Number(data.id ?? fallback.id ?? 0),
    linkRecords: Array.isArray(data.linkRecords)
      ? data.linkRecords.map((item) => buildLinkRecord(item))
      : fallback.linkRecords || [],
    merchantType: data.merchantType || fallback.merchantType || '-',
    name: data.name || fallback.name || '-',
    phone: data.phone || fallback.phone || '-',
    rechargeRecords: Array.isArray(data.rechargeRecords)
      ? data.rechargeRecords.map((item) => buildRechargeRecord(item))
      : fallback.rechargeRecords || [],
    registerTime: formatApiTime(data.registerTime ?? fallback.registerTime),
    remark: data.remark || fallback.remark || '',
    status: (data.status || fallback.status || '待审核') as MerchantStatus,
    updateTime: formatApiTime(data.updateTime ?? fallback.updateTime),
    updater,
    updaterId: Number(data.updaterId ?? fallback.updaterId ?? 0) || undefined,
    updaterInfo: data.updaterInfo
      ? getOperatorDetail(updater, data.updaterInfo, data.updaterId)
      : fallback.updaterInfo,
    walletBalance: Number(data.walletBalance ?? fallback.walletBalance ?? 0),
  };

  if (!row.auditLogs?.length) {
    row.auditLogs = buildAuditLogs(row);
  }

  if (!row.auditorInfo && row.auditorName !== '-') {
    row.auditorInfo = getOperatorDetail(
      row.auditorName,
      undefined,
      row.auditorId,
    );
  }

  return row;
}

/**
 * 构建统计卡片和图表数据
 */
export function buildStatsData(merchants: MerchantInfoRow[]) {
  const monthLabels = Array.from({ length: 6 }, (_, index) =>
    dayjs()
      .subtract(5 - index, 'month')
      .format('YYYY-MM'),
  );

  const growthMap = Object.fromEntries(monthLabels.map((item) => [item, 0]));

  merchants.forEach((item) => {
    const key = dayjs(item.registerTime).format('YYYY-MM');
    if (key in growthMap) {
      growthMap[key] += 1;
    }
  });

  const newMerchantCount = merchants.filter(
    (item) => dayjs().diff(dayjs(item.registerTime), 'day') <= 30,
  ).length;

  return {
    cards: [
      {
        title: '总商户数',
        value: merchants.length,
        desc: '点击数字可返回全部商户列表',
        color: '#2F80ED',
      },
      {
        title: '近30天新增',
        value: newMerchantCount,
        desc: '点击数字可筛选近30天新增商户',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '商户增长趋势',
        type: 'line',
        xAxis: monthLabels,
        series: monthLabels.map((item) => growthMap[item]),
      },
      {
        title: '商户类型分布',
        type: 'bar',
        xAxis: merchantTypeOptions,
        series: merchantTypeOptions.map(
          (item) =>
            merchants.filter((merchant) => merchant.merchantType === item)
              .length,
        ),
      },
    ],
  };
}

/**
 * 接口统计数据转图表数据
 */
export function buildStatsDataFromApi(data?: Partial<MerchantInfoChartVO>) {
  const fallback = buildStatsData([]);
  const growthTrend = data?.merchantGrowthTrend || [];
  const merchantTypeDistribution = data?.merchantTypeDistribution || [];

  return {
    cards: [
      {
        title: '总商户数',
        value: data?.totalMerchantCount ?? 0,
        desc: '点击数字可返回全部商户列表',
        color: '#2F80ED',
      },
      {
        title: '近30天新增',
        value: data?.newMerchantCount ?? 0,
        desc: '点击数字可筛选近30天新增商户',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        ...fallback.charts[0],
        xAxis:
          growthTrend.length > 0
            ? growthTrend.map((item) => item.date)
            : fallback.charts[0].xAxis,
        series:
          growthTrend.length > 0
            ? growthTrend.map((item) => item.count)
            : fallback.charts[0].series,
      },
      {
        ...fallback.charts[1],
        xAxis:
          merchantTypeDistribution.length > 0
            ? merchantTypeDistribution.map((item) => item.type)
            : fallback.charts[1].xAxis,
        series:
          merchantTypeDistribution.length > 0
            ? merchantTypeDistribution.map((item) => item.count)
            : fallback.charts[1].series,
      },
    ],
  };
}

/**
 * 构建查询参数
 */
export function buildMerchantInfoQueryParams(
  formValues: Record<string, any>,
  extraValues: Record<string, any> = {},
) {
  const params = {
    ...formValues,
    ...extraValues,
    registerTime:
      Array.isArray(formValues.registerTime) &&
      formValues.registerTime.length === 2
        ? [
            dayjs(formValues.registerTime[0]).format(QUERY_TIME_FORMAT),
            dayjs(formValues.registerTime[1]).format(QUERY_TIME_FORMAT),
          ]
        : undefined,
  };

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return !(
        value === '' ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      );
    }),
  );
}

/**
 * 筛选表单
 */
export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
      },
    },
    {
      fieldName: 'contact',
      label: '联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
      },
    },
    {
      fieldName: 'merchantType',
      label: '商户类型',
      component: 'Select',
      componentProps: {
        options: merchantTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择商户类型',
      },
    },
    {
      fieldName: 'status',
      label: '商户状态',
      component: 'Select',
      componentProps: {
        options: merchantStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择商户状态',
      },
    },
    {
      fieldName: 'registerTime',
      label: '注册时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

/**
 * 新增表单
 */
export function useCreateSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
        maxlength: 40,
      },
      rules: 'required',
    },
    {
      fieldName: 'contact',
      label: '联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
        maxlength: 20,
      },
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '联系手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系手机号',
        maxlength: 11,
      },
      rules: 'mobileRequired',
    },
    {
      fieldName: 'merchantType',
      label: '商户类型',
      component: 'Select',
      componentProps: {
        options: merchantTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择商户类型',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'address',
      label: '地址',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入商户地址',
        maxlength: 100,
      },
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

/**
 * 编辑表单
 */
export function useEditSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'contact',
      label: '联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
        maxlength: 20,
      },
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '联系手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系手机号',
        maxlength: 11,
      },
      rules: 'mobileRequired',
    },
    {
      fieldName: 'address',
      label: '地址',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入商户地址',
        maxlength: 100,
      },
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

/**
 * 列表字段
 */
export function useGridColumns(): VxeTableGridOptions<MerchantInfoRow>['columns'] {
  return [
    {
      field: 'name',
      title: '商户名称',
      minWidth: 180,
      slots: { default: 'name' },
    },
    {
      field: 'contact',
      title: '联系人',
      minWidth: 120,
      slots: { default: 'contact' },
    },
    {
      field: 'phone',
      title: '联系手机号',
      minWidth: 140,
      slots: { default: 'phone' },
    },
    {
      field: 'merchantType',
      title: '商户类型',
      minWidth: 130,
      slots: { default: 'merchantType' },
    },
    {
      field: 'registerTime',
      title: '注册时间',
      minWidth: 170,
    },
    {
      field: 'status',
      title: '商户状态',
      minWidth: 110,
      slots: { default: 'status' },
    },
    {
      field: 'walletBalance',
      title: '账户余额',
      minWidth: 110,
      slots: { default: 'walletBalance' },
    },
    {
      field: 'auditorName',
      title: '审核人',
      minWidth: 100,
      slots: { default: 'auditorName' },
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 170,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
      slots: { default: 'creator' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 170,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 170,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
