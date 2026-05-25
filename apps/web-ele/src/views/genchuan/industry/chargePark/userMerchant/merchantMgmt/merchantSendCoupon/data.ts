import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MerchantInfoDetailVO,
  MerchantInfoVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import type {
  MerchantSendCouponChartVO,
  MerchantSendCouponDetailVO,
  MerchantSendCouponLogVO,
  MerchantSendCouponMerchantVO,
  MerchantSendCouponPageReqVO,
  MerchantSendCouponRedemptionVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantSendCoupon';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

const QUERY_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

function hasQueryValue(value: any) {
  return !(
    value === '' ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0)
  );
}

function formatCouponDictLabel(
  dictType: string,
  value?: null | number | string,
  valueName?: null | number | string,
) {
  const rawValue = value === null || value === undefined ? '' : String(value);
  const rawName =
    valueName === null || valueName === undefined ? '' : String(valueName);
  const dict = rawValue ? getDictObj(dictType, rawValue) : undefined;

  if (dict?.label) {
    return dict.label;
  }

  return rawName || rawValue || '-';
}

export type MerchantSendCouponStatus = '已取消' | '已执行' | '待执行';

export interface RedemptionLog {
  count: number;
  orderNo: string;
  plateNo: string;
  remark: string;
  time: string;
  type: string;
  userName: string;
}

export interface OperationLog {
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

export interface CouponProfileInfo {
  amount: string;
  name: string;
  remark: string;
  rule: string;
  status: string;
  type: string;
  validPeriod: string;
}

export interface CouponMgmtApiVO {
  amount?: number;
  description?: string;
  id?: number;
  name?: string;
  status?: string;
  statusName?: string;
  type?: string;
  typeName?: string;
  useCondition?: string;
  validTime?: null | number | string;
}

export interface MerchantSendCouponRow {
  couponId: number;
  couponName: string;
  createTime: string;
  creator: string;
  execTime: string;
  finishTime: string;
  id: number;
  logs: OperationLog[];
  merchantAddress: string;
  merchantContact: string;
  merchantId: number;
  merchantName: string;
  merchantPhone: string;
  merchantRegisterTime: string;
  merchantStatus: string;
  merchantType: string;
  redemptions: RedemptionLog[];
  remark: string;
  reserve1: string;
  reserve2: string;
  sendCount: number;
  status: MerchantSendCouponStatus;
  updateTime: string;
  updater: string;
  useCount: number;
}

export const sendStatusOptions: MerchantSendCouponStatus[] = [
  '待执行',
  '已执行',
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
  addText: '发券任务',
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
  { key: 'merchantAddress', label: '商户地址' },
  { key: 'couponId', label: '优惠券ID' },
  { key: 'couponName', label: '优惠券名称' },
  { key: 'sendCountDisplay', label: '发放数量' },
  { key: 'useCountDisplay', label: '已核销数量' },
  {
    key: 'status',
    label: '发券状态',
    type: 'tag',
    tagType: (value: string) =>
      getStatusTagType(value as MerchantSendCouponStatus),
  },
  { key: 'execTime', label: '执行时间' },
  { key: 'finishTime', label: '发券完成时间' },
  { key: 'redemptionSummary', label: '核销明细' },
  { key: 'logSummary', label: '操作日志' },
  { key: 'creator', label: '创建人' },
  { key: 'updater', label: '更新人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
  { key: 'reserve1', label: '预留字段1' },
  { key: 'reserve2', label: '预留字段2' },
  { key: 'remark', label: '备注' },
];

/**
 * 获取状态标签色
 */
export function getStatusTagType(status: MerchantSendCouponStatus) {
  switch (status) {
    case '已取消': {
      return 'danger';
    }
    case '已执行': {
      return 'success';
    }
    case '待执行': {
      return 'warning';
    }
    default: {
      return 'info';
    }
  }
}

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

export function buildMerchantProfile(
  data?: Partial<MerchantInfoDetailVO> | Partial<MerchantSendCouponMerchantVO>,
  fallback: Partial<MerchantSendCouponRow> = {},
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

export function buildCouponProfile(
  data?: null | Partial<CouponMgmtApiVO>,
  fallback: Partial<MerchantSendCouponRow> = {},
): CouponProfileInfo {
  return {
    amount:
      data?.amount === null || data?.amount === undefined
        ? '-'
        : String(data.amount),
    name: data?.name || fallback.couponName || '-',
    remark: data?.description || fallback.remark || '',
    rule: data?.useCondition || '-',
    status: formatCouponDictLabel(
      DICT_TYPE.COUPON_MGMT_STATUS,
      data?.status,
      data?.statusName,
    ),
    type: formatCouponDictLabel(
      DICT_TYPE.COUPON_MGMT_TYPE,
      data?.type,
      data?.typeName,
    ),
    validPeriod: formatApiTime(data?.validTime),
  };
}

function buildRedemptionLog(
  data?: null | Partial<MerchantSendCouponRedemptionVO>,
): RedemptionLog {
  return {
    count: Number(data?.count ?? 0),
    orderNo: data?.orderNo || '-',
    plateNo: data?.plateNo || '-',
    remark: data?.remark || '',
    time: formatApiTime(data?.time),
    type: data?.type || '-',
    userName: data?.userName || '-',
  };
}

function buildOperationLog(
  data?: null | Partial<MerchantSendCouponLogVO>,
): OperationLog {
  return {
    content: data?.content || '-',
    operator: data?.operator || '-',
    time: formatApiTime(data?.time),
  };
}

function buildFallbackLogs(row: MerchantSendCouponRow) {
  const logs: OperationLog[] = [
    {
      content: '创建发券任务',
      operator: row.creator || 'admin',
      time: row.createTime,
    },
  ];

  if (row.status === '待执行' && row.execTime !== '-') {
    logs.push({
      content: '设置执行时间',
      operator: row.creator || 'admin',
      time: row.execTime,
    });
  }

  if (row.finishTime !== '-') {
    logs.push({
      content: '执行发券任务',
      operator: row.creator || 'admin',
      time: row.finishTime,
    });
  } else if (row.status === '已取消') {
    logs.push({
      content: '取消发券任务',
      operator: row.creator || 'admin',
      time: row.updateTime,
    });
  }

  return logs;
}

/**
 * 获取核销记录摘要
 */
export function formatRedemptions(logs: RedemptionLog[] = []) {
  if (logs.length === 0) {
    return '暂无核销记录';
  }

  return logs
    .map((item) => {
      const suffix = item.userName === '-' ? '' : ` / ${item.userName}`;
      return `${item.time} ${item.type} ${item.count} 张${suffix}`;
    })
    .join('\n');
}

/**
 * 获取操作日志摘要
 */
export function formatOperationLogs(logs: OperationLog[] = []) {
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
export function buildMerchantSendCouponRowFromApi(
  data: Partial<MerchantSendCouponDetailVO>,
  fallback: Partial<MerchantSendCouponRow> = {},
  merchantLookup: Record<number, Partial<MerchantProfileInfo>> = {},
): MerchantSendCouponRow {
  const merchantId = Number(
    data.merchantId ?? data.merchantInfo?.id ?? fallback.merchantId ?? 0,
  );
  const merchantProfile = buildMerchantProfile(
    data.merchantInfo
      ? {
          address: data.merchantInfo.address,
          contact: data.merchantInfo.contact,
          id: data.merchantInfo.id || merchantId,
          merchantType: data.merchantInfo.merchantType,
          name: data.merchantInfo.name,
          phone: data.merchantInfo.phone,
          registerTime: data.merchantInfo.registerTime,
          remark: data.merchantInfo.remark,
          status: data.merchantInfo.status,
        }
      : undefined,
    {
      ...fallback,
      merchantId,
    },
    merchantLookup,
  );

  const row: MerchantSendCouponRow = {
    couponId: Number(data.couponId ?? fallback.couponId ?? 0),
    couponName: data.couponName || fallback.couponName || '-',
    createTime: formatApiTime(data.createTime ?? fallback.createTime),
    creator: data.creator || fallback.creator || '-',
    execTime: formatApiTime(data.execTime ?? fallback.execTime),
    finishTime: formatApiTime(data.finishTime ?? fallback.finishTime),
    id: Number(data.id ?? fallback.id ?? 0),
    logs: Array.isArray(data.logs)
      ? data.logs.map((item) => buildOperationLog(item))
      : fallback.logs || [],
    merchantAddress: merchantProfile.address,
    merchantContact: merchantProfile.contact,
    merchantId,
    merchantName: merchantProfile.name,
    merchantPhone: merchantProfile.phone,
    merchantRegisterTime: merchantProfile.registerTime,
    merchantStatus: merchantProfile.status,
    merchantType: merchantProfile.merchantType,
    redemptions: Array.isArray(data.redemptions)
      ? data.redemptions.map((item) => buildRedemptionLog(item))
      : fallback.redemptions || [],
    remark: data.remark || fallback.remark || '',
    reserve1: data.reserve1 || fallback.reserve1 || '',
    reserve2: data.reserve2 || fallback.reserve2 || '',
    sendCount: Number(data.sendCount ?? fallback.sendCount ?? 0),
    status: (data.status ||
      fallback.status ||
      sendStatusOptions[0]) as MerchantSendCouponStatus,
    updateTime: formatApiTime(data.updateTime ?? fallback.updateTime),
    updater: data.updater || fallback.updater || '-',
    useCount: Number(data.useCount ?? fallback.useCount ?? 0),
  };

  if (row.logs.length === 0) {
    row.logs = buildFallbackLogs(row);
  }

  return row;
}

function formatRateValue(rate: number) {
  const normalized = rate > 1 ? rate : rate * 100;
  return `${Number(normalized.toFixed(2))}%`;
}

/**
 * 构建兜底统计数据
 */
export function buildStatsData(rows: MerchantSendCouponRow[]) {
  const monthLabels = Array.from({ length: 6 }, (_, index) =>
    dayjs()
      .subtract(5 - index, 'month')
      .format('YYYY-MM'),
  );
  const sendMap = Object.fromEntries(monthLabels.map((item) => [item, 0]));

  rows.forEach((item) => {
    if (item.createTime === '-') {
      return;
    }

    const key = dayjs(item.createTime).format('YYYY-MM');
    if (key in sendMap) {
      sendMap[key] = (sendMap[key] ?? 0) + item.sendCount;
    }
  });

  const totalSendCount = rows.reduce(
    (total, item) => total + item.sendCount,
    0,
  );
  const totalUseCount = rows.reduce((total, item) => total + item.useCount, 0);

  return {
    cards: [
      {
        title: '发券量',
        value: totalSendCount,
        desc: '点击数字可查看全部发券记录',
        color: '#2F80ED',
      },
      {
        title: '核销率',
        value: formatRateValue(
          totalSendCount === 0 ? 0 : totalUseCount / totalSendCount,
        ),
        desc: '点击数字可查看已核销发券记录',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '发券量趋势',
        type: 'line',
        xAxis: monthLabels,
        series: monthLabels.map((item) => sendMap[item]),
      },
    ],
  };
}

/**
 * 接口统计数据转图表数据
 */
export function buildStatsDataFromApi(
  data?: Partial<MerchantSendCouponChartVO>,
) {
  const fallback = buildStatsData([]);
  const fallbackChart = fallback.charts[0] || {
    series: [],
    title: '发券量趋势',
    type: 'line',
    xAxis: [],
  };
  const trend = data?.sendCountTrend || [];

  return {
    cards: [
      {
        title: '发券量',
        value: Number(data?.sendCount ?? 0),
        desc: '点击数字可查看全部发券记录',
        color: '#2F80ED',
      },
      {
        title: '核销率',
        value: formatRateValue(Number(data?.useRate ?? 0)),
        desc: '点击数字可查看已核销发券记录',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        ...fallbackChart,
        xAxis:
          trend.length > 0
            ? trend.map((item) => item.date)
            : fallbackChart.xAxis,
        series:
          trend.length > 0
            ? trend.map((item) => item.count)
            : fallbackChart.series,
      },
    ],
  };
}

function buildRangeParam(value: any) {
  if (!Array.isArray(value) || value.length !== 2) {
    return undefined;
  }

  return [
    dayjs(value[0]).format(QUERY_TIME_FORMAT),
    dayjs(value[1]).format(QUERY_TIME_FORMAT),
  ];
}

/**
 * 构建查询参数
 */
export function buildMerchantSendCouponQueryParams(
  formValues: Record<string, any>,
  extraValues: Record<string, any> = {},
): MerchantSendCouponPageReqVO {
  const params = {
    ...formValues,
    ...extraValues,
    execTime: buildRangeParam(formValues.execTime),
  };

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => hasQueryValue(value)),
  ) as MerchantSendCouponPageReqVO;
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
      fieldName: 'couponName',
      label: '优惠券名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入优惠券名称',
      },
    },
    {
      fieldName: 'status',
      label: '发券状态',
      component: 'Select',
      componentProps: {
        options: sendStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择发券状态',
      },
    },
    {
      fieldName: 'execTime',
      label: '执行时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

/**
 * 发券表单
 */
export function useCreateSchema(
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
      rules: 'selectRequired',
    },
    {
      fieldName: 'couponId',
      label: '优惠券ID',
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: '请输入优惠券ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'sendCount',
      label: '发放数量',
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: '请输入发放数量',
      },
      rules: 'required',
    },
    {
      fieldName: 'execTime',
      label: '执行时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '不填则立即执行',
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
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
export function useGridColumns(): VxeTableGridOptions<MerchantSendCouponRow>['columns'] {
  return [
    {
      type: 'checkbox',
      width: 40,
    },
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 180,
      slots: { default: 'merchantName' },
    },
    {
      field: 'couponName',
      title: '优惠券名称',
      minWidth: 170,
      slots: { default: 'couponName' },
    },
    {
      field: 'sendCount',
      title: '发放数量',
      minWidth: 100,
      slots: { default: 'sendCount' },
    },
    {
      field: 'execTime',
      title: '执行时间',
      minWidth: 170,
    },
    {
      field: 'finishTime',
      title: '发券完成时间',
      minWidth: 170,
    },
    {
      field: 'useCount',
      title: '已核销数量',
      minWidth: 110,
      slots: { default: 'useCount' },
    },
    {
      field: 'status',
      title: '发券状态',
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
