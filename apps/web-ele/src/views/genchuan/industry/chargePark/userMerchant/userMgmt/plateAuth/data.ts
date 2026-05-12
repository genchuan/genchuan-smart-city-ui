import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  PlateAuthAuditLogVO,
  PlateAuthCarVO,
  PlateAuthChartVO,
  PlateAuthDetailVO,
  PlateAuthOperatorVO,
  PlateAuthUserVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/plateAuth';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

const QUERY_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export type PlateAuthStatus = '已认证' | '已驳回' | '待审核';

export interface AuthLog {
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

export interface CarProfileInfo {
  bindTime: string;
  carType: string;
  plateColor: string;
  plateNo: string;
  status: string;
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
  phone?: string;
  remark?: string;
  userType?: string;
  value: number;
}

export interface PlateAuthRow {
  applyTime: string;
  auditRemark: string;
  auditorId?: number;
  auditorInfo?: OperatorInfo;
  auditorName: string;
  auditTime: string;
  authLogs: AuthLog[];
  carId: number;
  carInfo?: CarProfileInfo;
  carType: string;
  createTime: string;
  creator: string;
  drivingLicense: string;
  id: number;
  phone: string;
  plateColor: string;
  plateNo: string;
  remark: string;
  status: PlateAuthStatus;
  updateTime: string;
  userId: number;
  userInfo?: UserProfileInfo;
  userName: string;
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
  { key: 'applyTime', label: '认证申请时间' },
  {
    key: 'status',
    label: '认证状态',
    type: 'tag',
    tagType: (value: string) => {
      switch (value) {
        case '已认证': {
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
  { key: 'auditorName', label: '审核人' },
  { key: 'auditTime', label: '审核时间' },
  { key: 'auditRemark', label: '审核备注' },
  { key: 'authLogsSummary', label: '审核记录' },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
];

export const statusOptions: PlateAuthStatus[] = ['待审核', '已认证', '已驳回'];

export const textObj = {
  excelAllName: '车牌认证列表.xlsx',
  excelName: '车牌认证',
};

export const userOptions: UserSelectOption[] = [
  {
    label: '张三',
    phone: '13812345678',
    remark: '个人用户，已有已认证车牌',
    userType: '个人用户',
    value: 1,
  },
  {
    label: '李四',
    phone: '13912345679',
    remark: '小程序用户，近期发起认证',
    userType: '小程序用户',
    value: 2,
  },
  {
    label: '王五',
    phone: '13712345670',
    remark: '历史驳回后待重新提交资料',
    userType: '平台用户',
    value: 3,
  },
  {
    label: '赵六',
    phone: '13612345671',
    remark: '大型车车主，资料齐全',
    userType: '个人用户',
    value: 4,
  },
  {
    label: '孙七',
    phone: '13512345672',
    remark: '近期新增认证申请用户',
    userType: '小程序用户',
    value: 5,
  },
];

const userProfileMap: Record<number, UserProfileInfo> = {
  1: {
    nickname: '张三',
    phone: '13812345678',
    remark: '个人用户，已有已认证车牌',
    userType: '个人用户',
  },
  2: {
    nickname: '李四',
    phone: '13912345679',
    remark: '小程序用户，近期发起认证',
    userType: '小程序用户',
  },
  3: {
    nickname: '王五',
    phone: '13712345670',
    remark: '历史驳回后待重新提交资料',
    userType: '平台用户',
  },
  4: {
    nickname: '赵六',
    phone: '13612345671',
    remark: '大型车车主，资料齐全',
    userType: '个人用户',
  },
  5: {
    nickname: '孙七',
    phone: '13512345672',
    remark: '近期新增认证申请用户',
    userType: '小程序用户',
  },
};

const carProfileMap: Record<number, CarProfileInfo> = {
  1: {
    bindTime: '2026-02-02 09:20:00',
    carType: '小型车',
    plateColor: '蓝牌',
    plateNo: '闽C12345',
    status: '已绑定',
  },
  2: {
    bindTime: '2026-03-06 14:10:00',
    carType: '新能源',
    plateColor: '绿牌',
    plateNo: '闽C56789',
    status: '待审核',
  },
  3: {
    bindTime: '2026-04-08 16:20:00',
    carType: '大型车',
    plateColor: '黄牌',
    plateNo: '闽C88888',
    status: '已绑定',
  },
  4: {
    bindTime: '2026-03-28 09:30:00',
    carType: '其他',
    plateColor: '黑牌',
    plateNo: '闽C99999',
    status: '已驳回',
  },
  5: {
    bindTime: '2026-04-15 08:20:00',
    carType: '小型车',
    plateColor: '蓝牌',
    plateNo: '闽C23456',
    status: '待审核',
  },
};

const operatorMap: Record<string, OperatorInfo> = {
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

function buildLicenseImage(plateNo: string, status: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="260" viewBox="0 0 420 260">
      <rect width="420" height="260" rx="18" fill="#f5f7fa" />
      <rect x="18" y="18" width="384" height="224" rx="12" fill="#ffffff" stroke="#dcdfe6" stroke-width="2" />
      <text x="32" y="60" fill="#303133" font-size="22" font-family="Microsoft YaHei">机动车行驶证</text>
      <text x="32" y="110" fill="#606266" font-size="18" font-family="Microsoft YaHei">车牌号码</text>
      <text x="160" y="110" fill="#409eff" font-size="24" font-family="Microsoft YaHei">${plateNo}</text>
      <text x="32" y="155" fill="#606266" font-size="18" font-family="Microsoft YaHei">认证状态</text>
      <text x="160" y="155" fill="#67c23a" font-size="20" font-family="Microsoft YaHei">${status}</text>
      <text x="32" y="205" fill="#909399" font-size="16" font-family="Microsoft YaHei">充电停车一体化管理系统示意资料</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function resolveDrivingLicense(
  license?: null | string,
  plateNo = '-',
  status = '待审核',
) {
  if (license) {
    return license;
  }

  return buildLicenseImage(plateNo, status);
}

export function buildUserSelectOptions(
  options?: Array<Partial<UserSelectOption>>,
) {
  const list = Array.isArray(options) ? options : [];

  const normalizedList = list
    .map((item) => ({
      label: String(item.label || ''),
      phone: item.phone ? String(item.phone) : undefined,
      remark: item.remark ? String(item.remark) : undefined,
      userType: item.userType ? String(item.userType) : undefined,
      value: Number(item.value ?? 0),
    }))
    .filter((item) => item.label && item.value > 0);

  return normalizedList.length > 0 ? normalizedList : userOptions;
}

export function buildUserProfileLookup(options: UserSelectOption[]) {
  return Object.fromEntries(
    options.map((item) => [
      item.value,
      {
        nickname: item.label,
        phone: item.phone,
        remark: item.remark,
        userType: item.userType,
      },
    ]),
  );
}

export function maskPhone(phone: string) {
  if (!phone || phone.length < 7 || phone.includes('*')) {
    return phone;
  }

  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

export function getUserProfile(
  userId: number,
  nickname?: string,
  detail?: null | Partial<PlateAuthUserVO>,
  lookup: Record<number, Partial<UserProfileInfo>> = {},
) {
  const lookupProfile = lookup[userId];
  const fallback = userProfileMap[userId] || {
    nickname: nickname || `用户${userId}`,
    phone: '-',
    remark: '',
    userType: '-',
  };

  if (!detail) {
    return {
      nickname: nickname || lookupProfile?.nickname || fallback.nickname,
      phone: lookupProfile?.phone || fallback.phone,
      remark: lookupProfile?.remark || fallback.remark,
      userType: lookupProfile?.userType || fallback.userType,
    };
  }

  return {
    nickname:
      detail.nickname ||
      nickname ||
      lookupProfile?.nickname ||
      fallback.nickname,
    phone: detail.phone || lookupProfile?.phone || fallback.phone,
    remark: detail.remark || lookupProfile?.remark || fallback.remark,
    userType: detail.userType || lookupProfile?.userType || fallback.userType,
  };
}

export function getCarProfile(
  carId: number,
  plateNo?: string,
  detail?: null | Partial<PlateAuthCarVO>,
  lookup: Record<number, Partial<CarProfileInfo>> = {},
) {
  const lookupProfile = lookup[carId];
  const fallback = carProfileMap[carId] || {
    bindTime: '-',
    carType: '-',
    plateColor: '-',
    plateNo: plateNo || '-',
    status: '-',
  };

  if (!detail) {
    return {
      bindTime: lookupProfile?.bindTime || fallback.bindTime,
      carType: lookupProfile?.carType || fallback.carType,
      plateColor: lookupProfile?.plateColor || fallback.plateColor,
      plateNo: plateNo || lookupProfile?.plateNo || fallback.plateNo,
      status: lookupProfile?.status || fallback.status,
    };
  }

  return {
    bindTime: formatApiTime(
      detail.bindTime || lookupProfile?.bindTime || fallback.bindTime,
    ),
    carType: detail.carType || lookupProfile?.carType || fallback.carType,
    plateColor:
      detail.plateColor || lookupProfile?.plateColor || fallback.plateColor,
    plateNo:
      detail.plateNo || plateNo || lookupProfile?.plateNo || fallback.plateNo,
    status: detail.status || lookupProfile?.status || fallback.status,
  };
}

export function getOperatorDetail(
  name?: string,
  detail?: null | Partial<PlateAuthOperatorVO>,
  operatorId?: null | number,
) {
  const fallbackName =
    (operatorId ? operatorNameByIdMap[operatorId] : undefined) || name || '-';
  const fallback = operatorMap[fallbackName] || {
    account: fallbackName,
    dept: '未分配部门',
    email: '-',
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
    email: detail.email || fallback.email,
    name: detail.name || detail.nickname || fallback.name,
    phone: detail.phone || detail.mobile || fallback.phone,
    role: Array.isArray(detail.roleNames)
      ? detail.roleNames.join('、')
      : detail.role || fallback.role,
  };
}

export function formatAuthLogs(logs: AuthLog[] = []) {
  if (logs.length === 0) {
    return '暂无审核记录';
  }

  return logs
    .map(
      (item) =>
        `${item.time} ${item.operator}：${item.action}${item.remark ? `（${item.remark}）` : ''}`,
    )
    .join('\n');
}

function buildAuthLogs(row: PlateAuthRow) {
  const logs: AuthLog[] = [
    {
      action: '发起认证',
      operator: row.creator || row.userName,
      remark: row.remark || '上传认证资料',
      time: row.createTime || row.applyTime,
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

  return logs;
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

function buildAuthLog(data?: null | Partial<PlateAuthAuditLogVO>): AuthLog {
  return {
    action: data?.action || data?.content || '-',
    operator: data?.operator || '-',
    remark: data?.remark || '',
    time: formatApiTime(data?.time),
  };
}

export function buildPlateAuthRowFromApi(
  data: Partial<PlateAuthDetailVO>,
  fallback: Partial<PlateAuthRow> = {},
  userLookup: Record<number, Partial<UserProfileInfo>> = {},
  carLookup: Record<number, Partial<CarProfileInfo>> = {},
): PlateAuthRow {
  const userId = Number(data.userId ?? fallback.userId ?? 0);
  const carId = Number(data.carId ?? fallback.carId ?? 0);
  const userProfile = getUserProfile(
    userId,
    fallback.userName,
    data.userInfo,
    userLookup,
  );
  const carProfile = getCarProfile(
    carId,
    data.plateNo || fallback.plateNo,
    data.carInfo,
    carLookup,
  );
  const creator =
    data.creator || fallback.creator || userProfile.nickname || '-';
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

    return (
      fallback.auditorInfo ||
      getOperatorDetail(auditorName, undefined, data.auditorId)
    );
  })();

  const row: PlateAuthRow = {
    applyTime: formatApiTime(data.applyTime ?? fallback.applyTime),
    auditRemark: data.auditRemark || fallback.auditRemark || '',
    auditorId: Number(data.auditorId ?? fallback.auditorId ?? 0) || undefined,
    auditorInfo,
    auditorName,
    auditTime: formatApiTime(data.auditTime ?? fallback.auditTime),
    authLogs: Array.isArray(data.auditLogs)
      ? data.auditLogs.map((item) => buildAuthLog(item))
      : fallback.authLogs || [],
    carId,
    carInfo: carProfile,
    carType: carProfile.carType,
    createTime: formatApiTime(data.createTime ?? fallback.createTime),
    creator,
    drivingLicense: resolveDrivingLicense(
      data.drivingLicense || fallback.drivingLicense,
      data.plateNo || fallback.plateNo || carProfile.plateNo,
      data.status || fallback.status || '待审核',
    ),
    id: Number(data.id ?? fallback.id ?? 0),
    phone: userProfile.phone,
    plateColor: carProfile.plateColor,
    plateNo: data.plateNo || fallback.plateNo || carProfile.plateNo,
    remark: data.remark || fallback.remark || '',
    status: (data.status || fallback.status || '待审核') as PlateAuthStatus,
    updateTime: formatApiTime(data.updateTime ?? fallback.updateTime),
    userId,
    userInfo: userProfile,
    userName: userProfile.nickname,
  };

  if (row.authLogs.length === 0) {
    row.authLogs = buildAuthLogs(row);
  }

  return row;
}

export function buildStatsData(auths: PlateAuthRow[]) {
  const monthLabels = Array.from({ length: 6 }, (_, index) =>
    dayjs()
      .subtract(5 - index, 'month')
      .format('YYYY-MM'),
  );

  const trendMap = Object.fromEntries(monthLabels.map((item) => [item, 0]));

  auths.forEach((item) => {
    const key = dayjs(item.applyTime).format('YYYY-MM');
    if (key in trendMap) {
      trendMap[key] += 1;
    }
  });

  const authCount = auths.length;
  const passCount = auths.filter((item) => item.status === '已认证').length;
  const passRate =
    authCount === 0 ? 0 : Number((passCount / authCount).toFixed(2));

  return {
    cards: [
      {
        title: '认证量',
        value: authCount,
        desc: '点击数字可回到全部认证记录',
        color: '#2F80ED',
      },
      {
        title: '认证通过率',
        value: `${Math.round(passRate * 100)}%`,
        desc: '点击数字可查看认证通过记录',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '认证量趋势',
        type: 'line',
        xAxis: monthLabels,
        series: monthLabels.map((item) => trendMap[item]),
      },
    ],
  };
}

export function buildStatsDataFromApi(data?: Partial<PlateAuthChartVO>) {
  const fallback = buildStatsData([]);
  const authTrend = data?.authTrend || [];

  return {
    cards: [
      {
        title: '认证量',
        value: data?.authCount ?? 0,
        desc: '点击数字可回到全部认证记录',
        color: '#2F80ED',
      },
      {
        title: '认证通过率',
        value: `${Math.round(Number(data?.authPassRate ?? 0) * 100)}%`,
        desc: '点击数字可查看认证通过记录',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        ...fallback.charts[0],
        xAxis:
          authTrend.length > 0
            ? authTrend.map((item) => item.date)
            : fallback.charts[0].xAxis,
        series:
          authTrend.length > 0
            ? authTrend.map((item) => item.count)
            : fallback.charts[0].series,
      },
    ],
  };
}

export function buildPlateAuthQueryParams(formValues: Record<string, any>) {
  const params = {
    ...formValues,
    applyTime:
      Array.isArray(formValues.applyTime) && formValues.applyTime.length === 2
        ? [
            dayjs(formValues.applyTime[0]).format(QUERY_TIME_FORMAT),
            dayjs(formValues.applyTime[1]).format(QUERY_TIME_FORMAT),
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

export function useSearchSchema(): VbenFormSchema[] {
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
      fieldName: 'status',
      label: '认证状态',
      component: 'Select',
      componentProps: {
        options: statusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择认证状态',
      },
    },
    {
      fieldName: 'applyTime',
      label: '申请时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions<PlateAuthRow>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
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
      field: 'drivingLicense',
      title: '行驶证信息',
      minWidth: 120,
      slots: { default: 'drivingLicense' },
    },
    {
      field: 'applyTime',
      title: '认证申请时间',
      minWidth: 170,
    },
    {
      field: 'status',
      title: '认证状态',
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
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
