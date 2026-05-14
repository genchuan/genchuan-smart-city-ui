import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  UserCarBindingLogVO,
  UserCarChartVO,
  UserCarDetailVO,
  UserCarOperatorVO,
  UserCarUserVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

const QUERY_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const textObj = {
  addText: '新增车辆',
  editText: '编辑车辆',
  excelAllName: '用户车辆列表.xlsx',
  excelName: '用户车辆',
};

export type UserCarStatus = '已绑定' | '已解绑' | '已驳回' | '待审核';

export interface BindingLog {
  action: string;
  operator: string;
  remark: string;
  time: string;
}

export interface UserProfileInfo {
  nickname: string;
  phone: string;
  remark: string;
  userType: string;
}

export interface OperatorInfo {
  account: string;
  dept: string;
  email: string;
  name: string;
  phone: string;
  role: string;
}

export interface UserSelectOption {
  label: string;
  value: number;
}

export interface UserCarRow {
  auditRemark: string;
  auditorId?: number;
  auditorInfo?: OperatorInfo;
  auditorName: string;
  auditTime: string;
  bindTime: string;
  bindingLogs: BindingLog[];
  carType: string;
  createTime: string;
  creator: string;
  creatorInfo?: OperatorInfo;
  id: number;
  phone: string;
  plateColor: string;
  plateNo: string;
  remark: string;
  status: UserCarStatus;
  updateTime: string;
  userId: number;
  userInfo?: UserProfileInfo;
  userName: string;
}

export const carTypeOptions = ['小型车', '大型车', '新能源', '其他'];

export const plateColorOptions = ['蓝牌', '黄牌', '绿牌', '黑牌', '白牌'];

export const statusOptions: UserCarStatus[] = [
  '待审核',
  '已绑定',
  '已解绑',
  '已驳回',
];

export const userOptions: UserSelectOption[] = [
  { label: '张三', value: 1 },
  { label: '李四', value: 2 },
  { label: '王五', value: 3 },
  { label: '赵六', value: 4 },
  { label: '孙七', value: 5 },
];

export function buildUserSelectOptions(
  options?: Array<Partial<UserSelectOption>>,
) {
  const list = Array.isArray(options) ? options : [];

  const normalizedList = list
    .map((item) => ({
      label: String(item.label || ''),
      value: Number(item.value ?? 0),
    }))
    .filter((item) => item.label && item.value > 0);

  return normalizedList;
}

export const detailFields = [
  { key: 'userName', label: '所属用户' },
  { key: 'maskedPhone', label: '绑定手机号' },
  { key: 'plateNo', label: '车牌号码' },
  {
    key: 'plateColor',
    label: '车牌颜色',
    type: 'tag',
    tagType: () => 'primary',
  },
  {
    key: 'carType',
    label: '车辆类型',
    type: 'tag',
    tagType: () => 'warning',
  },
  {
    key: 'status',
    label: '绑定状态',
    type: 'tag',
    tagType: (value: string) => {
      switch (value) {
        case '已绑定': {
          return 'success';
        }
        case '已驳回': {
          return 'danger';
        }
        case '待审核': {
          return 'warning';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  { key: 'bindTime', label: '绑定时间' },
  { key: 'auditorName', label: '审核人' },
  { key: 'auditTime', label: '审核时间' },
  { key: 'auditRemark', label: '审核备注' },
  { key: 'bindingLogsSummary', label: '绑定操作日志' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '最后更新时间' },
  { key: 'remark', label: '备注' },
];

const userProfileMap: Record<number, UserProfileInfo> = {
  1: {
    nickname: '张三',
    phone: '13812345678',
    remark: '个人用户，已绑定两辆车',
    userType: '个人用户',
  },
  2: {
    nickname: '李四',
    phone: '13912345679',
    remark: '小程序用户',
    userType: '小程序用户',
  },
  3: {
    nickname: '王五',
    phone: '13712345670',
    remark: '平台侧导入用户',
    userType: '平台用户',
  },
  4: {
    nickname: '赵六',
    phone: '13612345671',
    remark: '高频停车用户',
    userType: '个人用户',
  },
  5: {
    nickname: '孙七',
    phone: '13512345672',
    remark: '近期新增用户',
    userType: '小程序用户',
  },
};

const operatorProfileMap: Record<string, OperatorInfo> = {
  admin: {
    account: 'admin',
    dept: '平台运营中心',
    email: 'admin@genchuan.cn',
    name: 'admin',
    phone: '13800000001',
    role: '系统管理员',
  },
  李主管: {
    account: 'lizg',
    dept: '用户运营组',
    email: 'li@genchuan.cn',
    name: '李主管',
    phone: '13800000002',
    role: '运营主管',
  },
  陈老师: {
    account: 'chenls',
    dept: '商户服务组',
    email: 'chen@genchuan.cn',
    name: '陈老师',
    phone: '13800000003',
    role: '运营专员',
  },
  王客服: {
    account: 'wangkf',
    dept: '客户服务组',
    email: 'wang@genchuan.cn',
    name: '王客服',
    phone: '13800000004',
    role: '客服专员',
  },
};

const operatorNameByIdMap: Record<number, string> = {
  1: 'admin',
  2: '李主管',
  3: '陈老师',
  4: '王客服',
};

/**
 * 脱敏手机号
 */
export function maskPhone(phone: string) {
  if (!phone || phone.length < 7 || phone.includes('*')) {
    return phone;
  }

  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

export function getUserProfile(
  userId: number,
  nickname?: string,
  detail?: null | Partial<UserCarUserVO>,
) {
  const fallback = userProfileMap[userId] || {
    nickname: nickname || `用户${userId}`,
    phone: '-',
    remark: '',
    userType: '-',
  };

  if (!detail) {
    return {
      ...fallback,
      nickname: nickname || fallback.nickname,
    };
  }

  return {
    nickname: detail.nickname || nickname || fallback.nickname,
    phone: detail.phone || fallback.phone,
    remark: detail.remark || fallback.remark,
    userType: detail.userType || fallback.userType,
  };
}

export function getOperatorDetail(
  name?: string,
  detail?: null | Partial<UserCarOperatorVO>,
  operatorId?: null | number,
) {
  const fallbackName =
    (operatorId ? operatorNameByIdMap[operatorId] : undefined) || name || '-';
  const fallback = operatorProfileMap[fallbackName] || {
    account: fallbackName,
    dept: '未分配部门',
    email: '-',
    name: fallbackName,
    phone: '-',
    role: '操作人员',
  };

  if (!detail) {
    return fallback;
  }

  return {
    account: detail.account || fallback.account,
    dept: detail.deptName || detail.dept || fallback.dept,
    email: detail.email || fallback.email,
    name: detail.name || detail.nickname || fallback.name,
    phone: detail.phone || detail.mobile || fallback.phone,
    role: Array.isArray(detail.roleNames)
      ? detail.roleNames.join('、')
      : detail.role || fallback.role,
  };
}

function formatBindingLogs(logs: BindingLog[]) {
  if (logs.length === 0) {
    return '暂无绑定操作日志';
  }

  return logs
    .map(
      (item) =>
        `${item.time} ${item.operator}：${item.action}${item.remark ? `（${item.remark}）` : ''}`,
    )
    .join('\n');
}

function buildBindingLogs(row: UserCarRow): BindingLog[] {
  const logs: BindingLog[] = [
    {
      action: '创建绑定',
      operator: row.creator,
      remark: row.remark || '新增车辆绑定申请',
      time: row.createTime,
    },
  ];

  if (row.auditTime !== '-' && row.auditorName !== '-') {
    logs.push({
      action: row.status === '已驳回' ? '审核驳回' : '审核通过',
      operator: row.auditorName,
      remark: row.auditRemark || '审核完成',
      time: row.auditTime,
    });
  }

  if (
    row.status === '已解绑' &&
    row.updateTime !== '-' &&
    row.updateTime !== row.auditTime
  ) {
    logs.push({
      action: '解绑',
      operator: row.auditorName === '-' ? row.creator : row.auditorName,
      remark: '执行解绑操作',
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

function buildBindingLog(
  data?: null | Partial<UserCarBindingLogVO>,
): BindingLog {
  return {
    action: data?.action || '-',
    operator: data?.operator || '-',
    remark: data?.remark || '',
    time: formatApiTime(data?.time),
  };
}

/**
 * 接口数据转表格行
 */
export function buildUserCarRowFromApi(
  data: Partial<UserCarDetailVO>,
  fallback: Partial<UserCarRow> = {},
): UserCarRow {
  const userId = Number(data.userId ?? fallback.userId ?? 0);
  const userProfile = getUserProfile(
    userId,
    data.nickname || fallback.userName,
    data.userInfo,
  );
  const creator = data.creator || fallback.creator || 'admin';
  const auditorName =
    data.auditorName ||
    data.auditorInfo?.name ||
    data.auditorInfo?.nickname ||
    fallback.auditorName ||
    (data.auditorId ? operatorNameByIdMap[data.auditorId] : undefined) ||
    '-';
  let auditorInfo: OperatorInfo | undefined;

  if (auditorName !== '-') {
    auditorInfo = data.auditorInfo
      ? getOperatorDetail(auditorName, data.auditorInfo, data.auditorId)
      : fallback.auditorInfo ||
        getOperatorDetail(auditorName, undefined, data.auditorId);
  }

  const row: UserCarRow = {
    auditRemark: data.auditRemark || fallback.auditRemark || '',
    auditorId: Number(data.auditorId ?? fallback.auditorId ?? 0) || undefined,
    auditorInfo,
    auditorName,
    auditTime: formatApiTime(data.auditTime ?? fallback.auditTime),
    bindTime: formatApiTime(data.bindTime ?? fallback.bindTime),
    bindingLogs: Array.isArray(data.bindingLogs)
      ? data.bindingLogs.map((item) => buildBindingLog(item))
      : fallback.bindingLogs || [],
    carType: data.carType || fallback.carType || '-',
    createTime: formatApiTime(data.createTime ?? fallback.createTime),
    creator,
    creatorInfo: data.creatorInfo
      ? getOperatorDetail(creator, data.creatorInfo)
      : fallback.creatorInfo,
    id: Number(data.id ?? fallback.id ?? 0),
    phone: data.phone || fallback.phone || userProfile.phone,
    plateColor: data.plateColor || fallback.plateColor || '-',
    plateNo: data.plateNo || fallback.plateNo || '-',
    remark: data.remark || fallback.remark || '',
    status: (data.status || fallback.status || '待审核') as UserCarStatus,
    updateTime: formatApiTime(data.updateTime ?? fallback.updateTime),
    userId,
    userInfo: data.userInfo ? userProfile : fallback.userInfo || userProfile,
    userName: data.nickname || fallback.userName || userProfile.nickname,
  };

  if (row.bindingLogs.length === 0) {
    row.bindingLogs = buildBindingLogs(row);
  }

  return row;
}

/**
 * 构建模拟车辆数据
 */
function buildUserCar(data: UserCarRow): UserCarRow {
  return data;
}

/**
 * 获取模拟数据
 */
export function getMockUserCars(): UserCarRow[] {
  return [
    buildUserCar({
      auditRemark: '审核通过',
      auditorInfo: getOperatorDetail('李主管'),
      auditorName: '李主管',
      auditTime: '2026-04-02 11:00:00',
      bindTime: '2026-04-02 10:00:00',
      bindingLogs: [
        {
          action: '创建绑定',
          operator: 'admin',
          remark: '新增车辆绑定申请',
          time: '2026-04-02 10:00:00',
        },
        {
          action: '审核通过',
          operator: '李主管',
          remark: '资料齐全，审核通过',
          time: '2026-04-02 11:00:00',
        },
      ],
      carType: '小型车',
      createTime: '2026-04-02 10:00:00',
      creator: 'admin',
      creatorInfo: getOperatorDetail('admin'),
      id: 1,
      phone: '13812345678',
      plateColor: '蓝牌',
      plateNo: '闽C12345',
      remark: '用户自有车辆',
      status: '已绑定',
      updateTime: '2026-04-02 11:00:00',
      userId: 1,
      userInfo: getUserProfile(1),
      userName: '张三',
    }),
    buildUserCar({
      auditRemark: '',
      auditorName: '-',
      auditTime: '-',
      bindTime: '2026-04-05 09:20:00',
      bindingLogs: [
        {
          action: '创建绑定',
          operator: '陈老师',
          remark: '发起车辆绑定',
          time: '2026-04-05 09:20:00',
        },
      ],
      carType: '新能源',
      createTime: '2026-04-05 09:20:00',
      creator: '陈老师',
      creatorInfo: getOperatorDetail('陈老师'),
      id: 2,
      phone: '13912345679',
      plateColor: '绿牌',
      plateNo: '闽C56789',
      remark: '待审核新能源车辆',
      status: '待审核',
      updateTime: '2026-04-05 09:20:00',
      userId: 2,
      userInfo: getUserProfile(2),
      userName: '李四',
    }),
    buildUserCar({
      auditRemark: '审核通过，后续解绑',
      auditorInfo: getOperatorDetail('王客服'),
      auditorName: '王客服',
      auditTime: '2026-03-18 10:00:00',
      bindTime: '2026-03-18 08:45:00',
      bindingLogs: [
        {
          action: '审核通过',
          operator: '王客服',
          remark: '资料审核通过',
          time: '2026-03-18 10:00:00',
        },
        {
          action: '解绑',
          operator: '李主管',
          remark: '用户主动申请解绑',
          time: '2026-04-08 16:20:00',
        },
      ],
      carType: '大型车',
      createTime: '2026-03-18 08:45:00',
      creator: 'admin',
      creatorInfo: getOperatorDetail('admin'),
      id: 3,
      phone: '13612345671',
      plateColor: '黄牌',
      plateNo: '闽C88888',
      remark: '集团业务调整后解绑',
      status: '已解绑',
      updateTime: '2026-04-08 16:20:00',
      userId: 4,
      userInfo: getUserProfile(4),
      userName: '赵六',
    }),
    buildUserCar({
      auditRemark: '行驶证信息不符',
      auditorInfo: getOperatorDetail('王客服'),
      auditorName: '王客服',
      auditTime: '2026-04-07 15:30:00',
      bindTime: '2026-04-07 14:10:00',
      bindingLogs: [
        {
          action: '创建绑定',
          operator: '王客服',
          remark: '发起车辆绑定',
          time: '2026-04-07 14:10:00',
        },
        {
          action: '审核驳回',
          operator: '王客服',
          remark: '行驶证信息不符',
          time: '2026-04-07 15:30:00',
        },
      ],
      carType: '其他',
      createTime: '2026-04-07 14:10:00',
      creator: '王客服',
      creatorInfo: getOperatorDetail('王客服'),
      id: 4,
      phone: '13712345670',
      plateColor: '黑牌',
      plateNo: '闽C99999',
      remark: '待重新提交资料',
      status: '已驳回',
      updateTime: '2026-04-07 15:30:00',
      userId: 3,
      userInfo: getUserProfile(3),
      userName: '王五',
    }),
    buildUserCar({
      auditRemark: '审核通过',
      auditorInfo: getOperatorDetail('李主管'),
      auditorName: '李主管',
      auditTime: '2026-04-10 16:55:00',
      bindTime: '2026-04-10 16:20:00',
      bindingLogs: [
        {
          action: '创建绑定',
          operator: 'admin',
          remark: '新增车辆绑定',
          time: '2026-04-10 16:20:00',
        },
        {
          action: '审核通过',
          operator: '李主管',
          remark: '审核通过',
          time: '2026-04-10 16:55:00',
        },
      ],
      carType: '小型车',
      createTime: '2026-04-10 16:20:00',
      creator: 'admin',
      creatorInfo: getOperatorDetail('admin'),
      id: 5,
      phone: '13512345672',
      plateColor: '蓝牌',
      plateNo: '闽C23456',
      remark: '小程序用户常用车辆',
      status: '已绑定',
      updateTime: '2026-04-10 16:55:00',
      userId: 5,
      userInfo: getUserProfile(5),
      userName: '孙七',
    }),
  ];
}

/**
 * 构建统计区数据
 */
export function buildStatsData(cars: UserCarRow[]) {
  const bindCount = cars.filter((item) => item.status === '已绑定').length;
  const passCount = cars.filter(
    (item) => item.auditRemark === '审核通过',
  ).length;
  const passRate =
    cars.length === 0 ? 0 : Number((passCount / cars.length).toFixed(2));

  return {
    cards: [
      {
        title: '绑定车辆数',
        value: bindCount,
        desc: '累计绑定车辆',
        color: '#2F80ED',
      },
      {
        title: '审核通过率',
        value: `${Math.round(passRate * 100)}%`,
        desc: '车辆审核质量指标',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '车辆类型分布',
        type: 'bar',
        xAxis: carTypeOptions,
        series: carTypeOptions.map(
          (item) => cars.filter((car) => car.carType === item).length,
        ),
      },
    ],
  };
}

/**
 * 接口统计数据转图表数据
 */
export function buildStatsDataFromApi(data?: Partial<UserCarChartVO>) {
  const fallback = buildStatsData([]);
  const distribution = data?.carTypeDistribution || [];

  return {
    cards: [
      {
        title: '绑定车辆数',
        value: data?.bindCarCount ?? 0,
        desc: '累计绑定车辆',
        color: '#2F80ED',
      },
      {
        title: '审核通过率',
        value: `${Math.round(Number(data?.auditPassRate ?? 0) * 100)}%`,
        desc: '车辆审核质量指标',
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

/**
 * 构建查询参数
 */
export function buildUserCarQueryParams(formValues: Record<string, any>) {
  const params = {
    ...formValues,
    nickname: formValues.nickname || formValues.userName,
    userName: undefined,
    bindTime:
      Array.isArray(formValues.bindTime) && formValues.bindTime.length === 2
        ? [
            dayjs(formValues.bindTime[0]).format(QUERY_TIME_FORMAT),
            dayjs(formValues.bindTime[1]).format(QUERY_TIME_FORMAT),
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
 * 导出数据结构
 */
export function buildExportRows(cars: UserCarRow[]) {
  return cars.map((item) => ({
    所属用户: item.userName,
    绑定手机号: maskPhone(item.phone),
    车牌号码: item.plateNo,
    车牌颜色: item.plateColor,
    车辆类型: item.carType,
    绑定时间: item.bindTime,
    绑定状态: item.status,
    审核人: item.auditorName,
    审核时间: item.auditTime,
    审核备注: item.auditRemark,
    创建人: item.creator,
    创建时间: item.createTime,
    更新时间: item.updateTime,
    备注: item.remark,
  }));
}

/**
 * 获取日志摘要
 */
export function getBindingLogsSummary(logs: BindingLog[]) {
  return formatBindingLogs(logs);
}

/**
 * 筛选表单
 */
export function useSearchSchema(
): VbenFormSchema[] {
  return [
    {
      fieldName: 'nickname',
      label: '所属用户',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属用户',
      },
    },
    {
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
    },
    {
      fieldName: 'carType',
      label: '车辆类型',
      component: 'Select',
      componentProps: {
        options: carTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择车辆类型',
      },
    },
    {
      fieldName: 'status',
      label: '绑定状态',
      component: 'Select',
      componentProps: {
        options: statusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择绑定状态',
      },
    },
    {
      fieldName: 'bindTime',
      label: '绑定时间',
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
  currentUserOptions: UserSelectOption[] = userOptions,
): VbenFormSchema[] {
  return [
    {
      fieldName: 'userId',
      label: '所属用户',
      component: 'Select',
      componentProps: {
        options: currentUserOptions,
        placeholder: '请选择所属用户',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
      rules: 'required',
    },
    {
      fieldName: 'plateColor',
      label: '车牌颜色',
      component: 'Select',
      componentProps: {
        options: plateColorOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择车牌颜色',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'carType',
      label: '车辆类型',
      component: 'Select',
      componentProps: {
        options: carTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择车辆类型',
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
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
      rules: 'required',
    },
    {
      fieldName: 'plateColor',
      label: '车牌颜色',
      component: 'Select',
      componentProps: {
        options: plateColorOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择车牌颜色',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'carType',
      label: '车辆类型',
      component: 'Select',
      componentProps: {
        options: carTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择车辆类型',
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
 * 列表字段
 */
export function useGridColumns(): VxeTableGridOptions<UserCarRow>['columns'] {
  return [
    {
      field: 'userName',
      title: '所属用户',
      minWidth: 120,
      slots: { default: 'userName' },
    },
    {
      field: 'plateNo',
      title: '车牌号码',
      minWidth: 130,
      slots: { default: 'plateNo' },
    },
    {
      field: 'plateColor',
      title: '车牌颜色',
      minWidth: 100,
      slots: { default: 'plateColor' },
    },
    {
      field: 'carType',
      title: '车辆类型',
      minWidth: 110,
      slots: { default: 'carType' },
    },
    {
      field: 'bindTime',
      title: '绑定时间',
      minWidth: 170,
    },
    {
      field: 'status',
      title: '绑定状态',
      minWidth: 110,
      slots: { default: 'status' },
    },
    {
      field: 'auditorName',
      title: '审核人',
      minWidth: 110,
      slots: { default: 'auditorName' },
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 170,
    },
    {
      field: 'auditRemark',
      title: '审核备注',
      minWidth: 180,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
    },
    {
      field: 'creator',
      title: '创建者',
      minWidth: 110,
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
      title: '操作',
      width: 210,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
