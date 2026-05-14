import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { UserCarVO } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';
import type {
  UserInfoAuditLogVO,
  UserInfoCarVO,
  UserInfoChartVO,
  UserInfoDetailVO,
  UserInfoOperatorVO,
  UserInfoWalletLogVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userInfo';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

const QUERY_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export type UserStatus = '正常' | '禁用';

export interface CarInfo {
  plateColor: string;
  plateNo: string;
  carType: string;
  status: string;
}

export interface WalletLog {
  afterBalance: number;
  amount: number;
  time: string;
  type: string;
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

export interface UserRow {
  auditLogs?: AuditLog[];
  id: number;
  nickname: string;
  phone: string;
  userType: string;
  status: UserStatus;
  registerTime: string;
  loginTime: string;
  walletBalance: number;
  carCount: number;
  creator: string;
  createTime: string;
  updater: string;
  updateTime: string;
  remark: string;
  cars: CarInfo[];
  walletLogs: WalletLog[];
  auditSummary: string;
  creatorId?: number;
  creatorInfo?: OperatorInfo;
  updaterId?: number;
  updaterInfo?: OperatorInfo;
}

export const detailFields = [
  { key: 'nickname', label: '用户昵称' },
  { key: 'maskedPhone', label: '绑定手机号' },
  {
    key: 'userType',
    label: '用户类型',
    type: 'tag',
    tagType: () => 'primary',
  },
  {
    key: 'status',
    label: '用户状态',
    type: 'tag',
    tagType: (value: string) => (value === '正常' ? 'success' : 'danger'),
  },
  { key: 'registerTime', label: '注册时间' },
  { key: 'loginTime', label: '最后登录时间' },
  { key: 'walletDisplay', label: '钱包余额' },
  { key: 'carDisplay', label: '绑定车辆' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updater', label: '最后更新人' },
  { key: 'updateTime', label: '最后更新时间' },
  { key: 'carsSummary', label: '绑定车辆信息' },
  { key: 'auditSummary', label: '审计日志摘要' },
  { key: 'remark', label: '备注' },
];

export const statusOptions: UserStatus[] = ['正常', '禁用'];

export const userTypeOptions = ['个人用户', '小程序用户', '平台用户'];

export const textObj = {
  addText: '新增用户',
  editText: '编辑用户',
  excelAllName: '用户信息列表.xlsx',
  excelName: '用户信息',
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
    dept: '用户运营组',
    name: '李主管',
    phone: '13800000002',
    role: '运营主管',
  },
  陈老师: {
    account: 'chenls',
    dept: '商户服务组',
    name: '陈老师',
    phone: '13800000003',
    role: '运营专员',
  },
  王客服: {
    account: 'wangkf',
    dept: '客户服务组',
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

export function getOperatorDetail(
  name: string,
  detail?: null | Partial<UserInfoOperatorVO>,
) {
  const fallback = operatorMap[name] || {
    account: name,
    dept: '未分配部门',
    name,
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

export function formatWalletLogs(logs: WalletLog[]) {
  if (logs.length === 0) {
    return '暂无钱包流水';
  }
  return logs
    .map(
      (item) =>
        `${item.time} ${item.type} ${item.amount}，余额 ${item.afterBalance}`,
    )
    .join('\n');
}

export function formatCars(cars: CarInfo[]) {
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

export function buildAuditLogs(row: UserRow): AuditLog[] {
  const logs: AuditLog[] = [
    {
      content: '创建用户',
      operator: row.creator,
      time: row.createTime,
    },
  ];

  if (row.updateTime !== row.createTime) {
    logs.push({
      content: row.auditSummary || '更新用户信息',
      operator: row.updater,
      time: row.updateTime,
    });
  }

  return logs;
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

export function buildCarInfo(
  data?: null | Partial<UserCarVO & UserInfoCarVO>,
): CarInfo {
  return {
    plateColor: data?.plateColor || '-',
    plateNo: data?.plateNo || '-',
    carType: data?.carType || '-',
    status: data?.status || '-',
  };
}

function buildWalletLog(data?: null | Partial<UserInfoWalletLogVO>): WalletLog {
  return {
    afterBalance: Number(data?.afterBalance ?? 0),
    amount: Number(data?.amount ?? 0),
    time: formatApiTime(data?.time),
    type: data?.type || '-',
  };
}

function buildAuditLog(data?: null | Partial<UserInfoAuditLogVO>): AuditLog {
  return {
    content: data?.content || '-',
    operator: data?.operator || '-',
    remark: data?.remark,
    time: formatApiTime(data?.time),
  };
}

/**
 * 接口数据转表格行
 */
export function buildUserRowFromApi(
  data: Partial<UserInfoDetailVO>,
  fallback: Partial<UserRow> = {},
): UserRow {
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

  const row: UserRow = {
    id: Number(data.id ?? fallback.id ?? 0),
    nickname: data.nickname || fallback.nickname || '-',
    phone: data.phone || fallback.phone || '-',
    userType: data.userType || fallback.userType || '-',
    status: (data.status || fallback.status || '正常') as UserStatus,
    registerTime: formatApiTime(data.registerTime ?? fallback.registerTime),
    loginTime: formatApiTime(data.loginTime ?? fallback.loginTime),
    walletBalance: Number(data.walletBalance ?? fallback.walletBalance ?? 0),
    carCount: Number(data.carCount ?? fallback.carCount ?? 0),
    creator,
    createTime: formatApiTime(data.createTime ?? fallback.createTime),
    updater,
    updateTime: formatApiTime(data.updateTime ?? fallback.updateTime),
    remark: data.remark || fallback.remark || '',
    cars: Array.isArray(data.cars)
      ? data.cars.map((item) => buildCarInfo(item))
      : fallback.cars || [],
    walletLogs: Array.isArray(data.walletLogs)
      ? data.walletLogs.map((item) => buildWalletLog(item))
      : fallback.walletLogs || [],
    auditSummary: data.auditSummary || fallback.auditSummary || '创建用户',
    auditLogs: Array.isArray(data.auditLogs)
      ? data.auditLogs.map((item) => buildAuditLog(item))
      : fallback.auditLogs || [],
    creatorId: Number(data.creatorId ?? fallback.creatorId ?? 0) || undefined,
    creatorInfo: data.creatorInfo
      ? getOperatorDetail(creator, data.creatorInfo)
      : fallback.creatorInfo,
    updaterId: Number(data.updaterId ?? fallback.updaterId ?? 0) || undefined,
    updaterInfo: data.updaterInfo
      ? getOperatorDetail(updater, data.updaterInfo)
      : fallback.updaterInfo,
  };

  if (!row.auditLogs?.length) {
    row.auditLogs = buildAuditLogs(row);
  }

  return row;
}

/**
 * 构建模拟用户数据
 */
function buildUser(data: UserRow): UserRow {
  return {
    ...data,
    carCount: data.cars.length,
  };
}

/**
 * 获取页面模拟数据
 */
export function getMockUsers(): UserRow[] {
  return [
    buildUser({
      id: 1,
      nickname: '张三',
      phone: '13812345678',
      userType: '个人用户',
      status: '正常',
      registerTime: '2026-01-08 09:20:00',
      loginTime: '2026-04-12 10:30:00',
      walletBalance: 128.5,
      creator: 'admin',
      createTime: '2026-01-08 09:20:00',
      updater: '李主管',
      updateTime: '2026-04-12 10:30:00',
      remark: '普通用户，已开通钱包',
      cars: [
        {
          plateColor: '蓝牌',
          plateNo: '闽C12345',
          carType: '小型车',
          status: '已绑定',
        },
        {
          plateColor: '绿牌',
          plateNo: '闽C8D888',
          carType: '新能源',
          status: '已绑定',
        },
      ],
      walletLogs: [
        {
          afterBalance: 163.5,
          amount: 200,
          time: '2026-04-01 09:00:00',
          type: '充值',
        },
        {
          afterBalance: 128.5,
          amount: -35,
          time: '2026-04-10 13:00:00',
          type: '停车扣费',
        },
      ],
      auditSummary: '创建用户、完善信息、状态同步',
    }),
    buildUser({
      id: 2,
      nickname: '李四',
      phone: '13912345679',
      userType: '小程序用户',
      status: '正常',
      registerTime: '2026-02-11 14:10:00',
      loginTime: '2026-04-14 17:10:00',
      walletBalance: 56,
      creator: '陈老师',
      createTime: '2026-02-11 14:10:00',
      updater: '陈老师',
      updateTime: '2026-04-14 17:10:00',
      remark: '小程序活动拉新用户',
      cars: [
        {
          plateColor: '蓝牌',
          plateNo: '闽C56789',
          carType: '小型车',
          status: '已绑定',
        },
      ],
      walletLogs: [
        {
          afterBalance: 91,
          amount: 100,
          time: '2026-04-03 11:30:00',
          type: '充值',
        },
        {
          afterBalance: 56,
          amount: -35,
          time: '2026-04-13 18:00:00',
          type: '停车扣费',
        },
      ],
      auditSummary: '小程序注册，钱包充值',
    }),
    buildUser({
      id: 3,
      nickname: '王五',
      phone: '13712345670',
      userType: '平台用户',
      status: '禁用',
      registerTime: '2026-02-28 11:35:00',
      loginTime: '2026-03-20 08:20:00',
      walletBalance: 0,
      creator: '王客服',
      createTime: '2026-02-28 11:35:00',
      updater: '王客服',
      updateTime: '2026-04-02 09:30:00',
      remark: '违规停放后被禁用',
      cars: [],
      walletLogs: [],
      auditSummary: '创建用户、禁用用户',
    }),
    buildUser({
      id: 4,
      nickname: '赵六',
      phone: '13612345671',
      userType: '个人用户',
      status: '正常',
      registerTime: '2026-03-18 08:45:00',
      loginTime: '2026-04-15 09:15:00',
      walletBalance: 340,
      creator: 'admin',
      createTime: '2026-03-18 08:45:00',
      updater: '李主管',
      updateTime: '2026-04-15 09:15:00',
      remark: '高频停车用户',
      cars: [
        {
          plateColor: '黄牌',
          plateNo: '闽C88888',
          carType: '大型车',
          status: '已绑定',
        },
      ],
      walletLogs: [
        {
          afterBalance: 385,
          amount: 400,
          time: '2026-04-05 10:00:00',
          type: '充值',
        },
        {
          afterBalance: 340,
          amount: -45,
          time: '2026-04-14 20:00:00',
          type: '停车扣费',
        },
      ],
      auditSummary: '创建用户、完善钱包信息',
    }),
    buildUser({
      id: 5,
      nickname: '孙七',
      phone: '13512345672',
      userType: '小程序用户',
      status: '正常',
      registerTime: '2026-04-10 16:05:00',
      loginTime: '2026-04-15 08:30:00',
      walletBalance: 21,
      creator: 'admin',
      createTime: '2026-04-10 16:05:00',
      updater: '李主管',
      updateTime: '2026-04-15 08:30:00',
      remark: '最近30天新增用户',
      cars: [
        {
          plateColor: '蓝牌',
          plateNo: '闽C23456',
          carType: '小型车',
          status: '已绑定',
        },
      ],
      walletLogs: [
        {
          afterBalance: 50,
          amount: 50,
          time: '2026-04-12 09:00:00',
          type: '充值',
        },
        {
          afterBalance: 21,
          amount: -29,
          time: '2026-04-15 08:00:00',
          type: '停车扣费',
        },
      ],
      auditSummary: '创建用户、绑定车辆',
    }),
  ];
}

/**
 * 构建统计卡片和图表数据
 */
export function buildStatsData(users: UserRow[]) {
  const monthLabels = Array.from({ length: 6 }, (_, index) =>
    dayjs()
      .subtract(5 - index, 'month')
      .format('YYYY-MM'),
  );

  const growthMap = Object.fromEntries(monthLabels.map((item) => [item, 0]));

  users.forEach((item) => {
    const key = dayjs(item.registerTime).format('YYYY-MM');
    if (key in growthMap) {
      growthMap[key] += 1;
    }
  });

  const newUserCount = users.filter(
    (item) => dayjs().diff(dayjs(item.registerTime), 'day') <= 30,
  ).length;

  return {
    cards: [
      {
        title: '总用户数',
        value: users.length,
        desc: '累计注册用户',
        color: '#2F80ED',
      },
      {
        title: '近30天新增',
        value: newUserCount,
        desc: '近30天注册用户',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '用户增长趋势',
        type: 'line',
        xAxis: monthLabels,
        series: monthLabels.map((item) => growthMap[item]),
      },
      {
        title: '用户类型分布',
        type: 'bar',
        xAxis: userTypeOptions,
        series: userTypeOptions.map(
          (item) => users.filter((user) => user.userType === item).length,
        ),
      },
    ],
  };
}

/**
 * 接口统计数据转图表数据
 */
export function buildStatsDataFromApi(data?: Partial<UserInfoChartVO>) {
  const fallback = buildStatsData([]);
  const growthTrend = data?.userGrowthTrend || [];
  const userTypeDistribution = data?.userTypeDistribution || [];

  return {
    cards: [
      {
        title: '总用户数',
        value: data?.totalUserCount ?? 0,
        desc: '累计注册用户',
        color: '#2F80ED',
      },
      {
        title: '近30天新增',
        value: data?.newUserCount ?? 0,
        desc: '近30天注册用户',
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
          userTypeDistribution.length > 0
            ? userTypeDistribution.map((item) => item.type)
            : fallback.charts[1].xAxis,
        series:
          userTypeDistribution.length > 0
            ? userTypeDistribution.map((item) => item.count)
            : fallback.charts[1].series,
      },
    ],
  };
}

/**
 * 构建查询参数
 */
export function buildUserInfoQueryParams(formValues: Record<string, any>) {
  const registerTimeRange =
    Array.isArray(formValues.registerTime) &&
    formValues.registerTime.length === 2 &&
    formValues.registerTime.every((item) => dayjs(item).isValid())
      ? [
          dayjs(formValues.registerTime[0]).format(QUERY_TIME_FORMAT),
          dayjs(formValues.registerTime[1]).format(QUERY_TIME_FORMAT),
        ]
      : undefined;

  const params = {
    ...formValues,
    registerTime: registerTimeRange,
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
export function buildExportRows(users: UserRow[]) {
  return users.map((item) => ({
    用户昵称: item.nickname,
    绑定手机号: maskPhone(item.phone),
    用户类型: item.userType,
    注册时间: item.registerTime,
    用户状态: item.status,
    钱包余额: item.walletBalance.toFixed(2),
    绑定车辆数: item.carCount,
    创建人: item.creator,
    创建时间: item.createTime,
    最后更新人: item.updater,
    最后更新时间: item.updateTime,
    最后登录时间: item.loginTime,
    备注: item.remark,
  }));
}

/**
 * 用户详情字段
 */
export function getUserDetailFields() {
  return detailFields;
}

/**
 * 筛选表单
 */
export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'nickname',
      label: '用户昵称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户昵称',
      },
    },
    {
      fieldName: 'phone',
      label: '绑定手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号',
      },
    },
    {
      fieldName: 'userType',
      label: '用户类型',
      component: 'Select',
      componentProps: {
        options: userTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择用户类型',
      },
    },
    {
      fieldName: 'status',
      label: '用户状态',
      component: 'Select',
      componentProps: {
        options: statusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择用户状态',
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
      fieldName: 'nickname',
      label: '用户昵称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户昵称',
        maxlength: 20,
      },
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '绑定手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入绑定手机号',
        maxlength: 11,
      },
      rules: 'mobileRequired',
    },
    {
      fieldName: 'userType',
      label: '用户类型',
      component: 'Select',
      componentProps: {
        options: userTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择用户类型',
      },
      rules: 'selectRequired',
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
      fieldName: 'nickname',
      label: '用户昵称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户昵称',
        maxlength: 20,
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
 * 列表字段
 */
export function useGridColumns(): VxeTableGridOptions<UserRow>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'nickname',
      title: '用户昵称',
      minWidth: 140,
      slots: { default: 'nickname' },
    },
    {
      field: 'phone',
      title: '绑定手机号',
      minWidth: 140,
      slots: { default: 'phone' },
    },
    {
      field: 'userType',
      title: '用户类型',
      minWidth: 120,
      slots: { default: 'userType' },
    },
    {
      field: 'registerTime',
      title: '注册时间',
      minWidth: 170,
    },
    {
      field: 'status',
      title: '用户状态',
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'walletBalance',
      title: '钱包余额',
      minWidth: 110,
      slots: { default: 'walletBalance' },
    },
    {
      field: 'carCount',
      title: '绑定车辆数',
      minWidth: 110,
      slots: { default: 'carCount' },
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
      field: 'updater',
      title: '最后更新人',
      minWidth: 110,
    },
    {
      field: 'updateTime',
      title: '最后更新时间',
      minWidth: 170,
    },
    {
      field: 'loginTime',
      title: '最后登录时间',
      minWidth: 170,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
    },
    {
      title: '操作',
      width: 190,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
