import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MerchantInfoDetailVO,
  MerchantInfoVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import type {
  MerchantLinkChartVO,
  MerchantLinkDetailVO,
  MerchantLinkSyncLogVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantLink';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type MerchantLinkStatus = '已对接' | '未对接';

export interface SyncLog {
  content: string;
  operator: string;
  result: string;
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

export interface MerchantLinkRow {
  apiKey: string;
  apiUrl: string;
  createTime: string;
  creator: string;
  effectTime: string;
  id: number;
  lastSyncTime: string;
  linkType: string;
  merchantAddress: string;
  merchantContact: string;
  merchantId: number;
  merchantName: string;
  merchantPhone: string;
  merchantRegisterTime: string;
  merchantStatus: string;
  merchantType: string;
  remark: string;
  status: MerchantLinkStatus;
  syncLogs: SyncLog[];
  updateTime: string;
}

export const linkTypeOptions = ['数据对接', '接口对接', '商品同步', '核销同步'];

export const linkStatusOptions: MerchantLinkStatus[] = ['未对接', '已对接'];

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
  addText: '新增对接',
  editText: '编辑对接',
  excelAllName: '商户对接列表.xlsx',
  excelName: '商户对接',
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
  { key: 'merchantStatus', label: '商户状态' },
  { key: 'merchantRegisterTime', label: '注册时间' },
  {
    key: 'linkType',
    label: '对接类型',
    type: 'tag',
    tagType: () => 'primary',
  },
  { key: 'apiUrl', label: '接口地址' },
  { key: 'maskedApiKey', label: '对接密钥' },
  {
    key: 'status',
    label: '对接状态',
    type: 'tag',
    tagType: (value: string) => (value === '已对接' ? 'success' : 'warning'),
  },
  { key: 'effectTime', label: '生效时间' },
  { key: 'lastSyncTime', label: '最后同步时间' },
  { key: 'syncLogSummary', label: '同步日志' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
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
 * 脱敏接口密钥
 */
export function maskApiKey(apiKey: string) {
  if (!apiKey) {
    return '-';
  }

  if (apiKey.includes('*')) {
    return apiKey;
  }

  if (apiKey.length <= 6) {
    return `${apiKey.slice(0, 2)}***`;
  }

  return `${apiKey.slice(0, 3)}****${apiKey.slice(-3)}`;
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

  list.forEach((item) => {
    const value = Number(item.value ?? 0);
    const label = String(item.label || '');

    if (!label || value <= 0) {
      return;
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
  });

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
  fallback: Partial<MerchantLinkRow> = {},
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

function buildSyncLog(data?: null | Partial<MerchantLinkSyncLogVO>): SyncLog {
  return {
    content: data?.content || '-',
    operator: data?.operator || '-',
    result: data?.result || '成功',
    time: formatApiTime(data?.time),
  };
}

function buildFallbackSyncLogs(row: MerchantLinkRow) {
  const logs: SyncLog[] = [];

  if (row.lastSyncTime !== '-') {
    logs.push({
      content: '最近一次同步完成',
      operator: row.creator || '-',
      result: '成功',
      time: row.lastSyncTime,
    });
  }

  if (row.effectTime !== '-') {
    logs.push({
      content: '对接配置生效',
      operator: row.creator || '-',
      result: '成功',
      time: row.effectTime,
    });
  }

  if (logs.length === 0) {
    logs.push({
      content: row.status === '未对接' ? '当前尚未发起对接' : '暂无同步日志',
      operator: row.creator || '-',
      result: row.status === '未对接' ? '待处理' : '成功',
      time:
        row.updateTime === '-'
          ? row.createTime || dayjs().format('YYYY-MM-DD HH:mm:ss')
          : row.updateTime,
    });
  }

  return logs;
}

/**
 * 获取同步日志摘要
 */
export function formatSyncLogs(logs: SyncLog[] = []) {
  if (logs.length === 0) {
    return '暂无同步日志';
  }

  return logs
    .map((item) => {
      const operator =
        item.operator && item.operator !== '-' ? `${item.operator} ` : '';
      return `${item.time} ${operator}${item.result}：${item.content}`;
    })
    .join('\n');
}

/**
 * 接口数据转表格行
 */
export function buildMerchantLinkRowFromApi(
  data: Partial<MerchantLinkDetailVO>,
  fallback: Partial<MerchantLinkRow> = {},
  merchantLookup: Record<number, Partial<MerchantProfileInfo>> = {},
): MerchantLinkRow {
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

  const row: MerchantLinkRow = {
    apiKey: data.apiKey || fallback.apiKey || '',
    apiUrl: data.apiUrl || fallback.apiUrl || '-',
    createTime: formatApiTime(data.createTime ?? fallback.createTime),
    creator: data.creator || fallback.creator || 'admin',
    effectTime: formatApiTime(data.effectTime ?? fallback.effectTime),
    id: Number(data.id ?? fallback.id ?? 0),
    lastSyncTime: formatApiTime(data.lastSyncTime ?? fallback.lastSyncTime),
    linkType: data.linkType || fallback.linkType || '-',
    merchantAddress: merchantProfile.address,
    merchantContact: merchantProfile.contact,
    merchantId: Number(data.merchantId ?? fallback.merchantId ?? 0),
    merchantName: merchantProfile.name,
    merchantPhone: merchantProfile.phone,
    merchantRegisterTime: merchantProfile.registerTime,
    merchantStatus: merchantProfile.status,
    merchantType: merchantProfile.merchantType,
    remark: data.remark || fallback.remark || '',
    status: (data.status || fallback.status || '未对接') as MerchantLinkStatus,
    syncLogs: Array.isArray(data.syncLogs)
      ? data.syncLogs.map((item) => buildSyncLog(item))
      : fallback.syncLogs || [],
    updateTime: formatApiTime(data.updateTime ?? fallback.updateTime),
  };

  if (row.syncLogs.length === 0) {
    row.syncLogs = buildFallbackSyncLogs(row);
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
export function buildStatsData(links: MerchantLinkRow[]) {
  const linkedCount = links.filter((item) => item.status === '已对接').length;
  const successRate =
    links.length === 0 ? '0%' : formatRateValue(linkedCount / links.length);

  return {
    cards: [
      {
        title: '对接商户数',
        value: linkedCount,
        desc: '点击数字可筛选已对接记录',
        color: '#2F80ED',
      },
      {
        title: '对接成功率',
        value: successRate,
        desc: '点击数字可查看成功对接记录',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '对接类型分布',
        type: 'bar',
        xAxis: linkTypeOptions,
        series: linkTypeOptions.map(
          (item) => links.filter((link) => link.linkType === item).length,
        ),
      },
    ],
  };
}

/**
 * 接口统计数据转图表数据
 */
export function buildStatsDataFromApi(data?: Partial<MerchantLinkChartVO>) {
  const fallback = buildStatsData([]);
  const distribution = data?.linkTypeDistribution || [];

  return {
    cards: [
      {
        title: '对接商户数',
        value: data?.linkMerchantCount ?? 0,
        desc: '点击数字可筛选已对接记录',
        color: '#2F80ED',
      },
      {
        title: '对接成功率',
        value: formatRateValue(Number(data?.linkSuccessRate ?? 0)),
        desc: '点击数字可查看成功对接记录',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        ...fallback.charts[0],
        xAxis:
          distribution.length > 0
            ? distribution.map((item) => item.type)
            : fallback.charts[0].xAxis,
        series:
          distribution.length > 0
            ? distribution.map((item) => item.count)
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
export function buildMerchantLinkQueryParams(formValues: Record<string, any>) {
  const params = {
    ...formValues,
    effectTime: buildRangeParam(formValues.effectTime),
    lastSyncTime: buildRangeParam(formValues.lastSyncTime),
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
 * 导出数据结构
 */
export function buildExportRows(links: MerchantLinkRow[]) {
  return links.map((item) => ({
    商户名称: item.merchantName,
    商户类型: item.merchantType,
    对接类型: item.linkType,
    接口地址: item.apiUrl,
    对接密钥: maskApiKey(item.apiKey),
    对接状态: item.status,
    生效时间: item.effectTime,
    最后同步时间: item.lastSyncTime,
    创建人: item.creator,
    创建时间: item.createTime,
    更新时间: item.updateTime,
    备注: item.remark,
  }));
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
      fieldName: 'linkType',
      label: '对接类型',
      component: 'Select',
      componentProps: {
        options: linkTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择对接类型',
      },
    },
    {
      fieldName: 'apiUrl',
      label: '接口地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入接口地址',
      },
    },
    {
      fieldName: 'status',
      label: '对接状态',
      component: 'Select',
      componentProps: {
        options: linkStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择对接状态',
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

/**
 * 新增表单
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
      fieldName: 'linkType',
      label: '对接类型',
      component: 'Select',
      componentProps: {
        options: linkTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择对接类型',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'apiUrl',
      label: '接口地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入接口地址',
        maxlength: 200,
      },
      rules: 'required',
    },
    {
      fieldName: 'apiKey',
      label: '对接密钥',
      component: 'Input',
      componentProps: {
        placeholder: '请输入对接密钥',
        maxlength: 100,
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

/**
 * 编辑表单
 */
export function useEditSchema(
  currentMerchantOptions: MerchantSelectOption[] = merchantOptions,
): VbenFormSchema[] {
  return useCreateSchema(currentMerchantOptions);
}

/**
 * 列表字段
 */
export function useGridColumns(): VxeTableGridOptions<MerchantLinkRow>['columns'] {
  return [
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 180,
      slots: { default: 'merchantName' },
    },
    {
      field: 'linkType',
      title: '对接类型',
      minWidth: 130,
      slots: { default: 'linkType' },
    },
    {
      field: 'apiUrl',
      title: '接口地址',
      minWidth: 240,
    },
    {
      field: 'apiKey',
      title: '对接密钥',
      minWidth: 140,
      slots: { default: 'apiKey' },
    },
    {
      field: 'status',
      title: '对接状态',
      minWidth: 110,
      slots: { default: 'status' },
    },
    {
      field: 'effectTime',
      title: '生效时间',
      minWidth: 170,
    },
    {
      field: 'lastSyncTime',
      title: '最后同步时间',
      minWidth: 170,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
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
      width: 210,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
