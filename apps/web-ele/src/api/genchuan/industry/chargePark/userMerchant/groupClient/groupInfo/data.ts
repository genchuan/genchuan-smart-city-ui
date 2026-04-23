import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  GroupAccountLogVO,
  GroupCarInfoVO,
  GroupInfoAuditLogVO,
  GroupInfoChartVO,
  GroupInfoDetailVO,
  GroupInfoOperatorVO,
  GroupInfoPageReqVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/groupClient/groupInfo';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type GroupStatus = '已驳回' | '待审核' | '正常' | '禁用';

export interface GroupAccountLog {
  afterBalance: number;
  amount: number;
  time: string;
  type: string;
}

export interface GroupCarInfo {
  carType: string;
  plateColor: string;
  plateNo: string;
  status: string;
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

export interface GroupInfoRow {
  accountLogs: GroupAccountLog[];
  address: string;
  auditLogs?: AuditLog[];
  auditSummary: string;
  auditorId?: number;
  auditorInfo?: OperatorInfo;
  auditorName: string;
  auditTime: string;
  cars: GroupCarInfo[];
  contact: string;
  createTime: string;
  creator: string;
  creatorId?: number;
  creatorInfo?: OperatorInfo;
  groupType: string;
  id: number;
  name: string;
  phone: string;
  registerTime: string;
  remark: string;
  status: GroupStatus;
  updateTime: string;
  updater: string;
  updaterId?: number;
  updaterInfo?: OperatorInfo;
  walletBalance: number;
}

export const detailFields = [
  { key: 'name', label: '集团名称' },
  { key: 'contact', label: '联系人' },
  { key: 'maskedPhone', label: '联系手机号' },
  {
    key: 'groupType',
    label: '集团类型',
    type: 'tag',
    tagType: () => 'primary',
  },
  { key: 'address', label: '集团地址' },
  { key: 'registerTime', label: '注册时间' },
  {
    key: 'status',
    label: '集团状态',
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
  { key: 'carSummary', label: '绑定车辆信息' },
  { key: 'auditorName', label: '审核人' },
  { key: 'auditTime', label: '审核时间' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updater', label: '最后更新人' },
  { key: 'updateTime', label: '最后更新时间' },
  { key: 'auditLogsSummary', label: '审计日志' },
  { key: 'remark', label: '备注' },
];

export const groupStatusOptions: GroupStatus[] = [
  '待审核',
  '正常',
  '禁用',
  '已驳回',
];

export const groupTypeOptions = ['企业单位', '事业单位', '政府机构', '其他'];

export const textObj = {
  addText: '新增集团',
  editText: '编辑集团',
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
    dept: '集团运营组',
    name: '李主管',
    phone: '13800000002',
    role: '运营主管',
  },
  王客服: {
    account: 'wangkf',
    dept: '集团服务组',
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
  detail?: null | Partial<GroupInfoOperatorVO>,
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
  data?: null | Partial<GroupAccountLogVO>,
): GroupAccountLog {
  return {
    afterBalance: Number(data?.afterBalance ?? 0),
    amount: Number(data?.amount ?? 0),
    time: formatApiTime(data?.time),
    type: data?.type || '-',
  };
}

function buildCarInfo(data?: null | Partial<GroupCarInfoVO>): GroupCarInfo {
  return {
    carType: data?.carType || '-',
    plateColor: data?.plateColor || '-',
    plateNo: data?.plateNo || '-',
    status: data?.status || '-',
  };
}

function buildAuditLog(data?: null | Partial<GroupInfoAuditLogVO>): AuditLog {
  return {
    content: data?.content || '-',
    operator: data?.operator || '-',
    remark: data?.remark,
    time: formatApiTime(data?.time),
  };
}

export function formatAccountLogs(logs: GroupAccountLog[] = []) {
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

export function formatCars(cars: GroupCarInfo[] = []) {
  if (cars.length === 0) {
    return '暂无绑定车辆';
  }

  return cars
    .map(
      (item) =>
        `${item.plateNo} / ${item.plateColor} / ${item.carType} / ${item.status}`,
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

export function buildAuditLogs(row: GroupInfoRow): AuditLog[] {
  const logs: AuditLog[] = [
    {
      content: '创建集团',
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
      content: row.auditSummary || '更新集团信息',
      operator: row.updater,
      time: row.updateTime,
    });
  }

  return logs;
}

/**
 * 接口数据转表格行
 */
export function buildGroupRowFromApi(
  data: Partial<GroupInfoDetailVO>,
  fallback: Partial<GroupInfoRow> = {},
): GroupInfoRow {
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
    data.auditorName ||
    data.auditorInfo?.name ||
    data.auditorInfo?.nickname ||
    (data.auditorId ? operatorNameByIdMap[data.auditorId] : undefined) ||
    fallback.auditorName ||
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

  const row: GroupInfoRow = {
    accountLogs: Array.isArray(data.accountLogs)
      ? data.accountLogs.map((item) => buildAccountLog(item))
      : fallback.accountLogs || [],
    address: data.address || fallback.address || '',
    auditLogs: Array.isArray(data.auditLogs)
      ? data.auditLogs.map((item) => buildAuditLog(item))
      : fallback.auditLogs || [],
    auditSummary: data.auditSummary || fallback.auditSummary || '创建集团',
    auditorId: Number(data.auditorId ?? fallback.auditorId ?? 0) || undefined,
    auditorInfo,
    auditorName,
    auditTime: formatApiTime(data.auditTime ?? fallback.auditTime),
    cars: Array.isArray(data.cars)
      ? data.cars.map((item) => buildCarInfo(item))
      : fallback.cars || [],
    contact: data.contact || fallback.contact || '-',
    createTime: formatApiTime(data.createTime ?? fallback.createTime),
    creator,
    creatorId: Number(data.creatorId ?? fallback.creatorId ?? 0) || undefined,
    creatorInfo: data.creatorInfo
      ? getOperatorDetail(creator, data.creatorInfo, data.creatorId)
      : fallback.creatorInfo,
    groupType: data.groupType || fallback.groupType || '-',
    id: Number(data.id ?? fallback.id ?? 0),
    name: data.name || fallback.name || '-',
    phone: data.phone || fallback.phone || '-',
    registerTime: formatApiTime(data.registerTime ?? fallback.registerTime),
    remark: data.remark || fallback.remark || '',
    status: (data.status || fallback.status || '待审核') as GroupStatus,
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
export function buildStatsData(groups: GroupInfoRow[]) {
  const monthLabels = Array.from({ length: 6 }, (_, index) =>
    dayjs()
      .subtract(5 - index, 'month')
      .format('YYYY-MM'),
  );

  const growthMap = Object.fromEntries(monthLabels.map((item) => [item, 0]));

  groups.forEach((item) => {
    const key = dayjs(item.registerTime).format('YYYY-MM');
    if (key in growthMap) {
      growthMap[key] = (growthMap[key] ?? 0) + 1;
    }
  });

  const newGroupCount = groups.filter(
    (item) => dayjs().diff(dayjs(item.registerTime), 'day') <= 30,
  ).length;

  return {
    cards: [
      {
        title: '总集团数',
        value: groups.length,
        desc: '点击数字可返回全部集团列表',
        color: '#2F80ED',
      },
      {
        title: '近30天新增',
        value: newGroupCount,
        desc: '点击数字可筛选近30天新增集团',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '集团增长趋势',
        type: 'line',
        xAxis: monthLabels,
        series: monthLabels.map((item) => growthMap[item]),
      },
    ],
  };
}

/**
 * 接口统计数据转图表数据
 */
export function buildStatsDataFromApi(data?: Partial<GroupInfoChartVO>) {
  const fallback = buildStatsData([]);
  const defaultChart = fallback.charts[0] || {
    series: [],
    title: '集团增长趋势',
    type: 'line',
    xAxis: [],
  };
  const growthTrend = data?.groupGrowthTrend || [];

  return {
    cards: [
      {
        title: '总集团数',
        value: data?.totalGroupCount ?? 0,
        desc: '点击数字可返回全部集团列表',
        color: '#2F80ED',
      },
      {
        title: '近30天新增',
        value: data?.newGroupCount ?? 0,
        desc: '点击数字可筛选近30天新增集团',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        ...defaultChart,
        xAxis:
          growthTrend.length > 0
            ? growthTrend.map((item) => item.date)
            : defaultChart.xAxis,
        series:
          growthTrend.length > 0
            ? growthTrend.map((item) => item.count)
            : defaultChart.series,
      },
    ],
  };
}

/**
 * 构建查询参数
 */
export function buildGroupInfoQueryParams(
  formValues: Record<string, any>,
  extraValues: Record<string, any> = {},
): GroupInfoPageReqVO {
  const params = {
    ...formValues,
    ...extraValues,
    registerTime:
      Array.isArray(formValues.registerTime) &&
      formValues.registerTime.length === 2
        ? `${dayjs(formValues.registerTime[0]).format('YYYY-MM-DD HH:mm:ss')},${dayjs(formValues.registerTime[1]).format('YYYY-MM-DD HH:mm:ss')}`
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
  ) as GroupInfoPageReqVO;
}

/**
 * 筛选表单
 */
export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '集团名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入集团名称',
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
      fieldName: 'groupType',
      label: '集团类型',
      component: 'Select',
      componentProps: {
        options: groupTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择集团类型',
      },
    },
    {
      fieldName: 'status',
      label: '集团状态',
      component: 'Select',
      componentProps: {
        options: groupStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择集团状态',
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
      label: '集团名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入集团名称',
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
      fieldName: 'groupType',
      label: '集团类型',
      component: 'Select',
      componentProps: {
        options: groupTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择集团类型',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'address',
      label: '地址',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入集团地址',
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
        placeholder: '请输入集团地址',
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
export function useGridColumns(): VxeTableGridOptions<GroupInfoRow>['columns'] {
  return [
    {
      field: 'name',
      title: '集团名称',
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
      field: 'groupType',
      title: '集团类型',
      minWidth: 130,
      slots: { default: 'groupType' },
    },
    {
      field: 'registerTime',
      title: '注册时间',
      minWidth: 170,
    },
    {
      field: 'status',
      title: '集团状态',
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
