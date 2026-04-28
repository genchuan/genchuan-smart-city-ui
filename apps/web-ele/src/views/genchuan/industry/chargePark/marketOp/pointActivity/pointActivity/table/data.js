import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

/** 场站选项配置 */
export const stationOptions = [
  { label: '芗城区XX社区停车场', value: '1' },
  { label: '龙文区碧湖公园停车场', value: '2' },
  { label: '龙海区石码镇便民停车场', value: '3' },
  { label: '龙海区闽齐社区停车场', value: '4' },
  { label: '芗城区江滨路生态停车场', value: '5' },
  { label: '龙文区万达商圈停车场', value: '6' },
  { label: '长泰区武安镇公共停车场', value: '7' },
  { label: '漳浦县绥安镇便民停车场', value: '8' },
  { label: '芗城区巷口街道停车场', value: '9' },
  { label: '龙文区蓝田街道停车场', value: '10' },
  { label: '龙文区步文街道停车场', value: '11' },
  { label: '芗城区东铺头街道停车场', value: '12' },
];

/** 根据场站ID获取场站名称 */
export function getStationNamesByIds(stationIds) {
  if (!stationIds) return '';
  const ids = stationIds.split(',');
  const names = ids.map((id) => {
    const station = stationOptions.find((s) => s.value === id);
    return station ? station.label : id;
  });
  return names.join(',');
}

/** 积分活动静态数据 - 参照接口返回格式 */
export const dataList = () => {
  const rawData = [
    {
      id: 1,
      name: '每日签到赠分活动',
      type: '0',
      typeName: '签到',
      startTime: 1_743_436_800_000,
      endTime: 1_746_028_800_000,
      rule: '每日签到赠送10积分',
      description: '用户每日签到可获积分奖励',
      stationIds: '1,2,3',
      joinCount: 120,
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1_743_309_600_000,
      remainPoint: 8800,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_237_600_000,
      updateTime: 1_743_478_800_000,
    },
    {
      id: 2,
      name: '消费满额赠分活动',
      type: '1',
      typeName: '消费',
      startTime: 1_743_523_200_000,
      endTime: 1_746_115_200_000,
      rule: '消费满100元赠送50积分',
      description: '充电消费满额赠分活动',
      stationIds: '4,5',
      joinCount: 85,
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1_743_396_000_000,
      remainPoint: 5000,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_324_000_000,
      updateTime: 1_743_565_200_000,
    },
    {
      id: 3,
      name: '邀请好友赠分活动',
      type: '2',
      typeName: '邀请',
      startTime: 1_743_609_600_000,
      endTime: 1_746_201_600_000,
      rule: '邀请好友注册双方各得100积分',
      description: '邀请好友注册赠分活动',
      stationIds: '1,2,3,4,5',
      joinCount: 200,
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1_743_482_400_000,
      remainPoint: 15_000,
      status: '0',
      statusName: '待生效',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_410_400_000,
      updateTime: 1_743_651_600_000,
    },
    {
      id: 4,
      name: '连续签到赠分活动',
      type: '0',
      typeName: '签到',
      startTime: 1_743_696_000_000,
      endTime: 1_746_288_000_000,
      rule: '连续签到7天赠送100积分',
      description: '连续签到额外奖励活动',
      stationIds: '6,7',
      joinCount: 150,
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1_743_568_800_000,
      remainPoint: 12_000,
      status: '2',
      statusName: '已结束',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_496_800_000,
      updateTime: 1_743_738_000_000,
    },
    {
      id: 5,
      name: '大额消费赠分活动',
      type: '1',
      typeName: '消费',
      startTime: 1_743_782_400_000,
      endTime: 1_746_374_400_000,
      rule: '消费满200元赠送100积分',
      description: '大额消费额外赠分活动',
      stationIds: '8,9',
      joinCount: 95,
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1_743_655_200_000,
      remainPoint: 10_000,
      status: '3',
      statusName: '已暂停',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_583_200_000,
      updateTime: 1_743_824_400_000,
    },
    {
      id: 6,
      name: '好友邀请奖励翻倍',
      type: '2',
      typeName: '邀请',
      startTime: 1_743_868_800_000,
      endTime: 1_746_460_800_000,
      rule: '邀请好友注册双方各得200积分',
      description: '邀请好友奖励翻倍活动',
      stationIds: '10,11,12',
      joinCount: 60,
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1_743_741_600_000,
      remainPoint: 7000,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_669_600_000,
      updateTime: 1_743_910_800_000,
    },
    {
      id: 7,
      name: '月度签到挑战赛',
      type: '0',
      typeName: '签到',
      startTime: 1_743_955_200_000,
      endTime: 1_746_547_200_000,
      rule: '月度累计签到20天赠送500积分',
      description: '月度签到挑战活动',
      stationIds: '1,2',
      joinCount: 180,
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1_743_828_000_000,
      remainPoint: 18_000,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_756_000_000,
      updateTime: 1_743_997_200_000,
    },
    {
      id: 8,
      name: '充电消费返积分',
      type: '1',
      typeName: '消费',
      startTime: 1_744_041_600_000,
      endTime: 1_746_633_600_000,
      rule: '充电消费每满50元返20积分',
      description: '充电消费返积分活动',
      stationIds: '3,4,5,6',
      joinCount: 300,
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1_743_914_400_000,
      remainPoint: 25_000,
      status: '0',
      statusName: '待生效',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_842_400_000,
      updateTime: 1_744_083_600_000,
    },
    {
      id: 9,
      name: '春季邀请有礼',
      type: '2',
      typeName: '邀请',
      startTime: 1_744_128_000_000,
      endTime: 1_746_720_000_000,
      rule: '春季邀请好友各得150积分',
      description: '春季邀请好友活动',
      stationIds: '7,8',
      joinCount: 110,
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1_744_000_800_000,
      remainPoint: 9000,
      status: '2',
      statusName: '已结束',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_928_800_000,
      updateTime: 1_744_160_400_000,
    },
    {
      id: 10,
      name: '周末消费双倍积分',
      type: '1',
      typeName: '消费',
      startTime: 1_744_214_400_000,
      endTime: 1_746_806_400_000,
      rule: '周末充电消费双倍积分返还',
      description: '周末消费双倍积分活动',
      stationIds: '9,10,11',
      joinCount: 75,
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1_744_087_200_000,
      remainPoint: 6000,
      status: '3',
      statusName: '已暂停',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_744_015_200_000,
      updateTime: 1_744_246_800_000,
    },
    {
      id: 11,
      name: '会员日签到活动',
      type: '0',
      typeName: '签到',
      startTime: 1_744_300_800_000,
      endTime: 1_746_892_800_000,
      rule: '会员日签到赠送50积分',
      description: '会员日签到额外奖励活动',
      stationIds: '12,1,2',
      joinCount: 220,
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1_744_173_600_000,
      remainPoint: 20_000,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_744_101_600_000,
      updateTime: 1_744_333_200_000,
    },
    {
      id: 12,
      name: '国庆邀请狂欢',
      type: '2',
      typeName: '邀请',
      startTime: 1_744_387_200_000,
      endTime: 1_746_979_200_000,
      rule: '国庆期间邀请好友各得300积分',
      description: '国庆邀请好友狂欢活动',
      stationIds: '3,4,5,6,7,8',
      joinCount: 450,
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1_744_260_000_000,
      remainPoint: 35_000,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_744_188_000_000,
      updateTime: 1_744_419_600_000,
    },
  ];

  // 使用formatDate格式化时间戳字段
  return rawData.map((item) => ({
    ...item,
    startTimeStr: formatDate(item.startTime),
    endTimeStr: formatDate(item.endTime),
    createTimeStr: formatDate(item.createTime),
    updateTimeStr: formatDate(item.updateTime),
    auditTimeStr: formatDate(item.auditTime),
    stationNames: getStationNamesByIds(item.stationIds),
  }));
};

/** 获取活动类型Tag类型 - 使用封装的字典颜色工具 */
export const getPointActivityTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取活动状态Tag类型 - 使用封装的字典颜色工具 */
export const getPointActivityStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 积分活动搜索表单配置 - 支持所有展示字段 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '活动名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入活动名称',
        clearable: true,
      },
    },
    {
      fieldName: 'type',
      label: '活动类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择活动类型',
        options: getDictOptions(DICT_TYPE.POINT_ACTIVITY_TYPE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '活动状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择活动状态',
        options: getDictOptions(DICT_TYPE.POINT_ACTIVITY_STATUS, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'timeRange',
      label: '活动时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择活动时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        type: 'datetimerange',
        clearable: true,
      },
    },
    {
      fieldName: 'stationIds',
      label: '活动覆盖场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择活动覆盖场站',
        options: stationOptions,
        clearable: true,
        multiple: true,
      },
    },
    {
      fieldName: 'auditorName',
      label: '审核人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入审核人',
        clearable: true,
      },
    },
    {
      fieldName: 'creator',
      label: '创建者',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建者',
        clearable: true,
      },
    },
    {
      fieldName: 'createTimeRange',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        type: 'datetimerange',
        clearable: true,
      },
    },
    {
      fieldName: 'auditTimeRange',
      label: '审核时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择审核时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        type: 'datetimerange',
        clearable: true,
      },
    },
  ];
}

/** 积分活动表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '活动名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入活动名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '活动类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择活动类型',
        options: getDictOptions(DICT_TYPE.POINT_ACTIVITY_TYPE, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'startTime',
      label: '开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择开始时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        type: 'datetime',
      },
      rules: 'required',
    },
    {
      fieldName: 'endTime',
      label: '结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择结束时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        type: 'datetime',
      },
      rules: 'required',
    },
    {
      fieldName: 'rule',
      label: '积分规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入积分规则',
      },
      rules: 'required',
    },
    {
      fieldName: 'description',
      label: '活动描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入活动描述',
      },
    },
    {
      fieldName: 'stationIds',
      label: '适用场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用场站',
        multiple: true,
        options: stationOptions,
      },
    },
    {
      fieldName: 'remainPoint',
      label: '剩余积分额度',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入剩余积分额度',
        min: 0,
      },
      rules: 'required',
    },
  ];
}

/** 积分活动编辑表单配置 - 仅可编辑非核心字段 */
export function useEditFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '活动名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入活动名称',
        disabled: true,
      },
    },
    {
      fieldName: 'type',
      label: '活动类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择活动类型',
        options: getDictOptions(DICT_TYPE.POINT_ACTIVITY_TYPE, 'string'),
        disabled: true,
      },
    },
    {
      fieldName: 'startTime',
      label: '开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择开始时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        type: 'datetime',
        disabled: true,
      },
    },
    {
      fieldName: 'endTime',
      label: '结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择结束时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        type: 'datetime',
        disabled: true,
      },
    },
    {
      fieldName: 'rule',
      label: '积分规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入积分规则',
        disabled: true,
      },
    },
    {
      fieldName: 'description',
      label: '活动描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入活动描述',
      },
    },
    {
      fieldName: 'stationIds',
      label: '适用场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用场站',
        multiple: true,
        options: stationOptions,
      },
    },
    {
      fieldName: 'remainPoint',
      label: '剩余积分额度',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入剩余积分额度',
        min: 0,
        disabled: true,
      },
    },
  ];
}

/** 积分活动表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '活动名称',
      minWidth: 200,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'type',
      title: '活动类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'type' },
    },
    {
      field: 'activityTime',
      title: '活动时间',
      minWidth: 320,
      sortable: true,
      slots: { default: 'activityTime' },
    },
    {
      field: 'joinCount',
      title: '参与人数',
      minWidth: 100,
      sortable: true,
      slots: { default: 'joinCount' },
    },
    {
      field: 'status',
      title: '活动状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ cellValue }) => formatDate(cellValue),
    },
    {
      field: 'auditorName',
      title: '审核人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'auditorName' },
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ cellValue }) => formatDate(cellValue),
    },
    {
      field: 'remainPoint',
      title: '剩余积分额度',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'stationNames',
      title: '活动覆盖场站',
      minWidth: 300,
      sortable: true,
      slots: { default: 'stationNames' },
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑积分活动',
  addText: '新增积分活动',
  excelName: '积分活动列表',
  excelAllName: '积分活动数据.xlsx',
  total: ' 总计: 积分活动数量12;进行中:6;已结束:2;已暂停:2;待生效:2',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '活动ID' },
  { key: 'name', label: '活动名称' },
  {
    key: 'type',
    label: '活动类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_TYPE, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => getPointActivityTypeTagType(value),
  },
  { key: 'startTimeStr', label: '开始时间' },
  { key: 'endTimeStr', label: '结束时间' },
  { key: 'rule', label: '积分规则' },
  { key: 'description', label: '活动描述' },
  { key: 'stationNames', label: '适用场站' },
  { key: 'joinCount', label: '参与人数' },
  { key: 'auditorName', label: '审核人' },
  { key: 'auditTimeStr', label: '审核时间' },
  { key: 'remainPoint', label: '剩余积分额度' },
  {
    key: 'status',
    label: '活动状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => getPointActivityStatusTagType(value),
  },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];
