import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MerchantInfoDetailVO,
  MerchantInfoVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import type {
  MerchantRechargeChartVO,
  MerchantRechargeDetailVO,
  MerchantRechargeLogVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantRecharge';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type MerchantRechargeStatus = '已取消' | '已支付' | '已生效' | '待支付';

export interface RechargeLog {
  content: string;
  operator: string;
  time: string;
}

export interface MerchantProfileInfo {
  address: string;
  contact: string;
  merchantType: string;
  name: string;
  phone: string;
  registerTime: string;
  remark: string;
  status: string;
}

export interface MerchantSelectOption {
  address?: string;
  contact?: string;
  label: string;
  merchantType?: string;
  phone?: string;
  registerTime?: string;
  remark?: string;
  status?: string;
  value: number;
}

export interface MerchantRechargeRow {
  amount: number;
  confirmTime: string;
  createTime: string;
  creator: string;
  id: number;
  logs: RechargeLog[];
  merchantAddress: string;
  merchantContact: string;
  merchantId: number;
  merchantName: string;
  merchantPhone: string;
  merchantRegisterTime: string;
  merchantStatus: string;
  merchantType: string;
  orderNo: string;
  payChannel: string;
  payTime: string;
  remark: string;
  status: MerchantRechargeStatus;
  updateTime: string;
}

export const payChannelOptions = ['微信', '支付宝', '银行转账', '平台余额'];

export const rechargeStatusOptions: MerchantRechargeStatus[] = [
  '待支付',
  '已支付',
  '已生效',
  '已取消',
];

export const merchantOptions: MerchantSelectOption[] = [
  {
    address: '福建省泉州市丰泽区东海街道',
    contact: '王五',
    label: '泉州丰泽充停商户',
    merchantType: '充停一体商户',
    phone: '13712345678',
    registerTime: '2026-01-08 10:00:00',
    remark: '商品和订单接口双向同步',
    status: '正常',
    value: 1,
  },
  {
    address: '福建省泉州市鲤城区中山路',
    contact: '赵六',
    label: '泉州鲤城停车商户',
    merchantType: '停车商户',
    phone: '13612345679',
    registerTime: '2026-02-13 09:30:00',
    remark: '停车数据待联调',
    status: '正常',
    value: 2,
  },
  {
    address: '福建省泉州市洛江区万安街道',
    contact: '陈七',
    label: '泉州洛江充电商户',
    merchantType: '充电商户',
    phone: '13512345670',
    registerTime: '2026-02-27 10:20:00',
    remark: '等待白名单放通',
    status: '正常',
    value: 3,
  },
  {
    address: '福建省泉州市丰泽区万达广场',
    contact: '林八',
    label: '丰泽万达联合商户',
    merchantType: '充停一体商户',
    phone: '13412345671',
    registerTime: '2026-03-06 15:00:00',
    remark: '商品与核销数据同步',
    status: '正常',
    value: 4,
  },
  {
    address: '福建省泉州市晋江市机场片区',
    contact: '周九',
    label: '晋江机场停车商户',
    merchantType: '停车商户',
    phone: '13312345672',
    registerTime: '2026-04-10 13:50:00',
    remark: '停车核销同步',
    status: '正常',
    value: 5,
  },
];

export const textObj = {
  excelAllName: '商户充值列表.xlsx',
  excelName: '商户充值',
};

export const detailFields = [
  { key: 'merchantName', label: '商户名称' },
  {
    key: 'merchantType',
    label: '商户类型',
    type: 'tag',
    tagType: () => 'primary',
  },
  { key: 'merchantContact', label: '联系人' },
  { key: 'maskedMerchantPhone', label: '联系电话' },
  { key: 'amountDisplay', label: '充值金额' },
  { key: 'payChannel', label: '支付渠道' },
  {
    key: 'status',
    label: '充值状态',
    type: 'tag',
    tagType: (value: string) => {
      switch (value) {
        case '已取消': {
          return 'danger';
        }
        case '已支付': {
          return 'primary';
        }
        case '已生效': {
          return 'success';
        }
        case '待支付': {
          return 'warning';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  { key: 'orderNo', label: '充值订单号' },
  { key: 'createTime', label: '申请时间' },
  { key: 'payTime', label: '支付时间' },
  { key: 'confirmTime', label: '确认时间' },
  { key: 'logSummary', label: '操作日志' },
  { key: 'remark', label: '备注' },
];

/**
 * 脱敏手机号
 */
export function maskPhone(phone: string) {
  if (!phone || phone.length < 7 || phone.includes('*')) {
    return phone || '-';
  }

  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

/**
 * 格式化接口时间
 */
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

/**
 * 兼容确认后已生效状态
 */
export function normalizeRechargeStatus(
  status?: null | string,
  confirmTime?: null | number | string,
) {
  const currentStatus = status || '待支付';
  const confirmTimeText = formatApiTime(confirmTime);

  if (
    (currentStatus === '已支付' || currentStatus === '已生效') &&
    confirmTimeText !== '-'
  ) {
    return '已生效' as MerchantRechargeStatus;
  }

  return currentStatus as MerchantRechargeStatus;
}

/**
 * 构建商户下拉
 */
export function buildMerchantSelectOptions(
  options?: Array<Partial<MerchantSelectOption>>,
) {
  const list = Array.isArray(options) ? options : [];
  const uniqueMap = new Map<number, MerchantSelectOption>();

  for (const item of list) {
    const value = Number(item.value ?? 0);
    const label = String(item.label || '');

    if (!label || value <= 0) {
      continue;
    }

    uniqueMap.set(value, {
      address: item.address || '',
      contact: item.contact || '',
      label,
      merchantType: item.merchantType || '',
      phone: item.phone || '',
      registerTime: item.registerTime || '-',
      remark: item.remark || '',
      status: item.status || '-',
      value,
    });
  }

  return uniqueMap.size > 0 ? [...uniqueMap.values()] : merchantOptions;
}

/**
 * 构建商户信息索引
 */
export function buildMerchantProfileLookup(
  options: MerchantSelectOption[] = merchantOptions,
) {
  const result: Record<number, Partial<MerchantProfileInfo>> = {};

  for (const item of options) {
    result[item.value] = {
      address: item.address || '-',
      contact: item.contact || '-',
      merchantType: item.merchantType || '-',
      name: item.label || '-',
      phone: item.phone || '-',
      registerTime: item.registerTime || '-',
      remark: item.remark || '',
      status: item.status || '-',
    };
  }

  return result;
}

/**
 * 构建商户弹窗信息
 */
export function buildMerchantProfile(
  data?: Partial<MerchantInfoDetailVO>,
  fallback: Partial<MerchantRechargeRow> = {},
  lookup: Record<number, Partial<MerchantProfileInfo>> = {},
): MerchantProfileInfo {
  const merchantId = Number(data?.id ?? fallback.merchantId ?? 0);
  const profile = merchantId ? lookup[merchantId] || {} : {};

  return {
    address:
      data?.address || profile.address || fallback.merchantAddress || '-',
    contact:
      data?.contact || profile.contact || fallback.merchantContact || '-',
    merchantType:
      data?.merchantType ||
      profile.merchantType ||
      fallback.merchantType ||
      '-',
    name:
      data?.name ||
      profile.name ||
      fallback.merchantName ||
      (merchantId ? `商户${merchantId}` : '-'),
    phone: data?.phone || profile.phone || fallback.merchantPhone || '-',
    registerTime: formatApiTime(
      data?.registerTime ||
        profile.registerTime ||
        fallback.merchantRegisterTime,
    ),
    remark: data?.remark || profile.remark || fallback.remark || '',
    status: data?.status || profile.status || fallback.merchantStatus || '-',
  };
}

function buildRechargeLog(
  data?: null | Partial<MerchantRechargeLogVO>,
): RechargeLog {
  return {
    content: data?.content || '-',
    operator: data?.operator || '-',
    time: formatApiTime(data?.time),
  };
}

function buildFallbackLogs(row: MerchantRechargeRow) {
  const logs: RechargeLog[] = [
    {
      content: '发起充值申请',
      operator: row.creator || 'admin',
      time: row.createTime,
    },
  ];

  if (row.payTime !== '-') {
    logs.push({
      content: `完成支付，渠道：${row.payChannel}`,
      operator: row.creator || 'admin',
      time: row.payTime,
    });
  }

  if (row.confirmTime !== '-') {
    logs.push({
      content: '确认充值到账并生效',
      operator: row.creator || 'admin',
      time: row.confirmTime,
    });
  } else if (row.status === '已取消') {
    logs.push({
      content: '取消充值申请',
      operator: row.creator || 'admin',
      time: row.updateTime,
    });
  }

  return logs;
}

/**
 * 获取操作日志摘要
 */
export function formatLogs(logs: RechargeLog[] = []) {
  if (logs.length === 0) {
    return '暂无操作日志';
  }

  return logs
    .map((item) => `${item.time} ${item.operator}：${item.content}`)
    .join('\n');
}

/**
 * 接口数据转表格行
 */
export function buildMerchantRechargeRowFromApi(
  data: Partial<MerchantRechargeDetailVO>,
  fallback: Partial<MerchantRechargeRow> = {},
  merchantLookup: Record<number, Partial<MerchantProfileInfo>> = {},
): MerchantRechargeRow {
  const merchantProfile = buildMerchantProfile(
    data.merchantInfo
      ? {
          address: data.merchantInfo.address,
          contact: data.merchantInfo.contact,
          id: data.merchantInfo.id || data.merchantId,
          merchantType: data.merchantInfo.merchantType,
          name: data.merchantInfo.name,
          phone: data.merchantInfo.phone,
          registerTime: data.merchantInfo.registerTime,
          remark: data.merchantInfo.remark,
          status: data.merchantInfo.status,
        }
      : undefined,
    fallback,
    merchantLookup,
  );

  const row: MerchantRechargeRow = {
    amount: Number(data.amount ?? fallback.amount ?? 0),
    confirmTime: formatApiTime(data.confirmTime ?? fallback.confirmTime),
    createTime: formatApiTime(data.createTime ?? fallback.createTime),
    creator: data.creator || fallback.creator || 'admin',
    id: Number(data.id ?? fallback.id ?? 0),
    logs: Array.isArray(data.logs)
      ? data.logs.map((item) => buildRechargeLog(item))
      : fallback.logs || [],
    merchantAddress: merchantProfile.address,
    merchantContact: merchantProfile.contact,
    merchantId: Number(data.merchantId ?? fallback.merchantId ?? 0),
    merchantName: merchantProfile.name,
    merchantPhone: merchantProfile.phone,
    merchantRegisterTime: merchantProfile.registerTime,
    merchantStatus: merchantProfile.status,
    merchantType: merchantProfile.merchantType,
    orderNo: data.orderNo || fallback.orderNo || '-',
    payChannel: data.payChannel || fallback.payChannel || '-',
    payTime: formatApiTime(data.payTime ?? fallback.payTime),
    remark: data.remark || fallback.remark || '',
    status: normalizeRechargeStatus(
      data.status || fallback.status,
      data.confirmTime ?? fallback.confirmTime,
    ),
    updateTime: formatApiTime(data.updateTime ?? fallback.updateTime),
  };

  if (row.logs.length === 0) {
    row.logs = buildFallbackLogs(row);
  }

  return row;
}

function formatRateValue(rate: number) {
  const normalized = rate > 1 ? rate : rate * 100;
  return `${Math.round(normalized)}%`;
}

/**
 * 构建兜底统计数据
 */
export function buildStatsData(recharges: MerchantRechargeRow[]) {
  const monthLabels = Array.from({ length: 6 }, (_, index) =>
    dayjs()
      .subtract(5 - index, 'month')
      .format('YYYY-MM'),
  );
  const amountMap = Object.fromEntries(monthLabels.map((item) => [item, 0]));

  recharges.forEach((item) => {
    if (item.payTime === '-') {
      return;
    }

    const key = dayjs(item.payTime).format('YYYY-MM');
    if (key in amountMap) {
      amountMap[key] += item.amount;
    }
  });

  const totalAmount = recharges
    .filter((item) => item.status === '已生效')
    .reduce((total, item) => total + item.amount, 0);
  const successCount = recharges.filter(
    (item) => item.status === '已生效',
  ).length;
  const successRate =
    recharges.length === 0
      ? '0%'
      : formatRateValue(successCount / recharges.length);

  return {
    cards: [
      {
        title: '充值金额',
        value: totalAmount,
        desc: '点击数字可查看全部充值记录',
        color: '#2F80ED',
      },
      {
        title: '充值成功率',
        value: successRate,
        desc: '点击数字可查看已生效记录',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '充值金额趋势',
        type: 'line',
        xAxis: monthLabels,
        series: monthLabels.map((item) => amountMap[item]),
      },
    ],
  };
}

/**
 * 接口统计数据转图表数据
 */
export function buildStatsDataFromApi(data?: Partial<MerchantRechargeChartVO>) {
  const fallback = buildStatsData([]);
  const trend = data?.rechargeAmountTrend || [];

  return {
    cards: [
      {
        title: '充值金额',
        value: Number(data?.rechargeAmount ?? 0),
        desc: '点击数字可查看全部充值记录',
        color: '#2F80ED',
      },
      {
        title: '充值成功率',
        value: formatRateValue(Number(data?.rechargeSuccessRate ?? 0)),
        desc: '点击数字可查看已生效记录',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        ...fallback.charts[0],
        xAxis:
          trend.length > 0
            ? trend.map((item) => item.date)
            : fallback.charts[0].xAxis,
        series:
          trend.length > 0
            ? trend.map((item) => item.amount)
            : fallback.charts[0].series,
      },
    ],
  };
}

function buildRangeParam(value: any) {
  if (!Array.isArray(value) || value.length !== 2) {
    return undefined;
  }

  return `${dayjs(value[0]).format('YYYY-MM-DD HH:mm:ss')},${dayjs(value[1]).format('YYYY-MM-DD HH:mm:ss')}`;
}

/**
 * 构建查询参数
 */
export function buildMerchantRechargeQueryParams(
  formValues: Record<string, any>,
) {
  const amountValue =
    typeof formValues.amount === 'string'
      ? formValues.amount.trim()
      : formValues.amount;

  const params = {
    ...formValues,
    amount: amountValue === '' ? undefined : amountValue,
    payTime: buildRangeParam(formValues.payTime),
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
 * 将商户接口数据转下拉项
 */
export function buildMerchantOptionsFromApi(list: MerchantInfoVO[] = []) {
  return buildMerchantSelectOptions(
    list.map((item) => ({
      address: item.address || '',
      contact: item.contact || '',
      label: item.name || '',
      merchantType: item.merchantType || '',
      phone: item.phone || '',
      registerTime: formatApiTime(item.registerTime),
      remark: item.remark || '',
      status: item.status || '-',
      value: Number(item.id ?? 0),
    })),
  );
}

/**
 * 筛选表单
 */
export function useSearchSchema(
  currentMerchantOptions: MerchantSelectOption[] = merchantOptions,
): VbenFormSchema[] {
  return [
    {
      fieldName: 'merchantId',
      label: '商户名称',
      component: 'Select',
      componentProps: {
        options: currentMerchantOptions,
        placeholder: '请选择商户名称',
      },
    },
    {
      fieldName: 'amount',
      label: '充值金额',
      component: 'Input',
      componentProps: {
        placeholder: '请输入充值金额',
      },
    },
    {
      fieldName: 'payChannel',
      label: '支付渠道',
      component: 'Select',
      componentProps: {
        options: payChannelOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择支付渠道',
      },
    },
    {
      fieldName: 'status',
      label: '充值状态',
      component: 'Select',
      componentProps: {
        options: rechargeStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择充值状态',
      },
    },
    {
      fieldName: 'payTime',
      label: '支付时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

/**
 * 列表字段
 */
export function useGridColumns(): VxeTableGridOptions<MerchantRechargeRow>['columns'] {
  return [
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 180,
      slots: { default: 'merchantName' },
    },
    {
      field: 'amount',
      title: '充值金额',
      minWidth: 110,
      slots: { default: 'amount' },
    },
    {
      field: 'payChannel',
      title: '支付渠道',
      minWidth: 120,
      slots: { default: 'payChannel' },
    },
    {
      field: 'createTime',
      title: '申请时间',
      minWidth: 170,
    },
    {
      field: 'status',
      title: '充值状态',
      minWidth: 110,
      slots: { default: 'status' },
    },
    {
      field: 'orderNo',
      title: '充值订单号',
      minWidth: 180,
    },
    {
      field: 'payTime',
      title: '支付时间',
      minWidth: 170,
    },
    {
      field: 'confirmTime',
      title: '确认时间',
      minWidth: 170,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
