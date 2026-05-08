import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  GroupCarBindingLogVO,
  GroupCarChartVO,
  GroupCarDetailVO,
  GroupCarGroupVO,
  GroupCarOperatorVO,
  GroupCarPageReqVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/groupClient/groupCar';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type GroupCarStatus = '已绑定' | '已解绑' | '已驳回' | '待审核';

export interface BindingLog {
  action: string;
  operator: string;
  remark: string;
  time: string;
}

export interface GroupProfileInfo {
  contact: string;
  groupType: string;
  name: string;
  phone: string;
  remark: string;
}

export interface OperatorInfo {
  account: string;
  dept: string;
  name: string;
  phone: string;
  role: string;
}

export interface GroupSelectOption {
  label: string;
  value: number;
}

export interface GroupCarRow {
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
  groupId: number;
  groupInfo?: GroupProfileInfo;
  groupName: string;
  id: number;
  plateColor: string;
  plateNo: string;
  remark: string;
  status: GroupCarStatus;
  updateTime: string;
}

export const carTypeOptions = ['小型车', '大型车', '新能源', '其他'];

export const plateColorOptions = ['蓝牌', '黄牌', '绿牌', '黑牌', '白牌'];

export const statusOptions: GroupCarStatus[] = [
  '待审核',
  '已绑定',
  '已解绑',
  '已驳回',
];

export const groupOptions: GroupSelectOption[] = [
  { label: '泉州智联企业集团', value: 1 },
  { label: '泉州教育服务中心', value: 2 },
  { label: '泉州市政协调服务中心', value: 3 },
  { label: '福建商务联合体', value: 4 },
  { label: '晋江航空产业联盟', value: 5 },
];

const groupProfileMap: Record<number, GroupProfileInfo> = {
  1: {
    contact: '张经理',
    groupType: '企业单位',
    name: '泉州智联企业集团',
    phone: '13512349012',
    remark: '大型企业集团客户',
  },
  2: {
    contact: '陈老师',
    groupType: '事业单位',
    name: '泉州教育服务中心',
    phone: '13412345678',
    remark: '事业单位集团客户',
  },
  3: {
    contact: '王主任',
    groupType: '政府机构',
    name: '泉州市政协调服务中心',
    phone: '13312345679',
    remark: '待补充资料的集团客户',
  },
  4: {
    contact: '林主管',
    groupType: '企业单位',
    name: '福建商务联合体',
    phone: '13212345670',
    remark: '高频代付集团客户',
  },
  5: {
    contact: '刘秘书',
    groupType: '其他',
    name: '晋江航空产业联盟',
    phone: '13112345671',
    remark: '最近新增集团客户',
  },
};

const operatorProfileMap: Record<string, OperatorInfo> = {
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

const operatorNameByIdMap: Record<number, string> = {
  1: 'admin',
  2: '李主管',
  3: '王客服',
};

export function buildGroupSelectOptions(
  options?: Array<Partial<GroupSelectOption>>,
) {
  const list = Array.isArray(options) ? options : [];

  const normalizedList = list
    .map((item) => ({
      label: String(item.label || ''),
      value: Number(item.value ?? 0),
    }))
    .filter((item) => item.label && item.value > 0);

  return normalizedList.length > 0 ? normalizedList : groupOptions;
}

export const detailFields = [
  { key: 'groupName', label: '所属集团' },
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

export function getGroupProfile(
  groupId: number,
  name?: string,
  detail?: null | Partial<GroupCarGroupVO>,
) {
  const fallback = groupProfileMap[groupId] || {
    contact: '-',
    groupType: '-',
    name: name || `集团${groupId}`,
    phone: '-',
    remark: '',
  };

  if (!detail) {
    return {
      ...fallback,
      name: name || fallback.name,
    };
  }

  return {
    contact: detail.contact || fallback.contact,
    groupType: detail.groupType || fallback.groupType,
    name: detail.name || name || fallback.name,
    phone: detail.phone || fallback.phone,
    remark: detail.remark || fallback.remark,
  };
}

export function getOperatorDetail(
  name?: string,
  detail?: null | Partial<GroupCarOperatorVO>,
  operatorId?: null | number,
) {
  const fallbackName =
    (operatorId ? operatorNameByIdMap[operatorId] : undefined) || name || '-';
  const fallback = operatorProfileMap[fallbackName] || {
    account: fallbackName,
    dept: '未分配部门',
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

function buildBindingLogs(row: GroupCarRow): BindingLog[] {
  const logs: BindingLog[] = [
    {
      action: '创建绑定',
      operator: row.creator,
      remark: row.remark || '新增集团车辆绑定申请',
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

function buildBindingLog(
  data?: null | Partial<GroupCarBindingLogVO>,
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
export function buildGroupCarRowFromApi(
  data: Partial<GroupCarDetailVO>,
  fallback: Partial<GroupCarRow> = {},
): GroupCarRow {
  const groupId = Number(data.groupId ?? fallback.groupId ?? 0);
  const groupProfile = getGroupProfile(
    groupId,
    data.groupName || fallback.groupName,
    data.groupInfo,
  );
  const creator = data.creator || fallback.creator || 'admin';
  const auditorName =
    data.auditorName ||
    data.auditorInfo?.name ||
    data.auditorInfo?.nickname ||
    (data.auditorId ? operatorNameByIdMap[data.auditorId] : undefined) ||
    fallback.auditorName ||
    '-';
  let auditorInfo: OperatorInfo | undefined;

  if (auditorName !== '-') {
    auditorInfo = data.auditorInfo
      ? getOperatorDetail(auditorName, data.auditorInfo, data.auditorId)
      : fallback.auditorInfo ||
        getOperatorDetail(auditorName, undefined, data.auditorId);
  }

  const row: GroupCarRow = {
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
    groupId,
    groupInfo: data.groupInfo
      ? groupProfile
      : fallback.groupInfo || groupProfile,
    groupName: data.groupName || fallback.groupName || groupProfile.name,
    id: Number(data.id ?? fallback.id ?? 0),
    plateColor: data.plateColor || fallback.plateColor || '-',
    plateNo: data.plateNo || fallback.plateNo || '-',
    remark: data.remark || fallback.remark || '',
    status: (data.status || fallback.status || '待审核') as GroupCarStatus,
    updateTime: formatApiTime(data.updateTime ?? fallback.updateTime),
  };

  if (row.bindingLogs.length === 0) {
    row.bindingLogs = buildBindingLogs(row);
  }

  return row;
}

/**
 * 构建统计区数据
 */
export function buildStatsData(cars: GroupCarRow[]) {
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
        desc: '集团车辆审核指标',
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
export function buildStatsDataFromApi(data?: Partial<GroupCarChartVO>) {
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
        desc: '集团车辆审核指标',
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
export function buildGroupCarQueryParams(formValues: Record<string, any>) {
  const params = {
    ...formValues,
    bindTime:
      Array.isArray(formValues.bindTime) && formValues.bindTime.length === 2
        ? `${dayjs(formValues.bindTime[0]).format('YYYY-MM-DD HH:mm:ss')},${dayjs(formValues.bindTime[1]).format('YYYY-MM-DD HH:mm:ss')}`
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
  ) as GroupCarPageReqVO;
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
  currentGroupOptions: GroupSelectOption[] = groupOptions,
): VbenFormSchema[] {
  return [
    {
      fieldName: 'groupId',
      label: '所属集团',
      component: 'Select',
      componentProps: {
        options: currentGroupOptions,
        placeholder: '请选择所属集团',
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
  currentGroupOptions: GroupSelectOption[] = groupOptions,
): VbenFormSchema[] {
  return [
    {
      fieldName: 'groupId',
      label: '所属集团',
      component: 'Select',
      componentProps: {
        options: currentGroupOptions,
        placeholder: '请选择所属集团',
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
export function useGridColumns(): VxeTableGridOptions<GroupCarRow>['columns'] {
  return [
    {
      field: 'groupName',
      title: '所属集团',
      minWidth: 160,
      slots: { default: 'groupName' },
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
      title: '操作',
      width: 210,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
