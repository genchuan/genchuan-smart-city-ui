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
      startTime: 1743436800000,
      endTime: 1746028800000,
      rule: '每日签到赠送10积分',
      description: '用户每日签到可获积分奖励',
      stationIds: '1,2,3',
      joinCount: 120,
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1743309600000,
      remainPoint: 8800,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743237600000,
      updateTime: 1743478800000,
    },
    {
      id: 2,
      name: '消费满额赠分活动',
      type: '1',
      typeName: '消费',
      startTime: 1743523200000,
      endTime: 1746115200000,
      rule: '消费满100元赠送50积分',
      description: '充电消费满额赠分活动',
      stationIds: '4,5',
      joinCount: 85,
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1743396000000,
      remainPoint: 5000,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743324000000,
      updateTime: 1743565200000,
    },
    {
      id: 3,
      name: '邀请好友赠分活动',
      type: '2',
      typeName: '邀请',
      startTime: 1743609600000,
      endTime: 1746201600000,
      rule: '邀请好友注册双方各得100积分',
      description: '邀请好友注册赠分活动',
      stationIds: '1,2,3,4,5',
      joinCount: 200,
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1743482400000,
      remainPoint: 15000,
      status: '0',
      statusName: '待生效',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743410400000,
      updateTime: 1743651600000,
    },
    {
      id: 4,
      name: '连续签到赠分活动',
      type: '0',
      typeName: '签到',
      startTime: 1743696000000,
      endTime: 1746288000000,
      rule: '连续签到7天赠送100积分',
      description: '连续签到额外奖励活动',
      stationIds: '6,7',
      joinCount: 150,
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1743568800000,
      remainPoint: 12000,
      status: '2',
      statusName: '已结束',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743496800000,
      updateTime: 1743738000000,
    },
    {
      id: 5,
      name: '大额消费赠分活动',
      type: '1',
      typeName: '消费',
      startTime: 1743782400000,
      endTime: 1746374400000,
      rule: '消费满200元赠送100积分',
      description: '大额消费额外赠分活动',
      stationIds: '8,9',
      joinCount: 95,
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1743655200000,
      remainPoint: 10000,
      status: '3',
      statusName: '已暂停',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743583200000,
      updateTime: 1743824400000,
    },
    {
      id: 6,
      name: '好友邀请奖励翻倍',
      type: '2',
      typeName: '邀请',
      startTime: 1743868800000,
      endTime: 1746460800000,
      rule: '邀请好友注册双方各得200积分',
      description: '邀请好友奖励翻倍活动',
      stationIds: '10,11,12',
      joinCount: 60,
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1743741600000,
      remainPoint: 7000,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743669600000,
      updateTime: 1743910800000,
    },
    {
      id: 7,
      name: '月度签到挑战赛',
      type: '0',
      typeName: '签到',
      startTime: 1743955200000,
      endTime: 1746547200000,
      rule: '月度累计签到20天赠送500积分',
      description: '月度签到挑战活动',
      stationIds: '1,2',
      joinCount: 180,
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1743828000000,
      remainPoint: 18000,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743756000000,
      updateTime: 1743997200000,
    },
    {
      id: 8,
      name: '充电消费返积分',
      type: '1',
      typeName: '消费',
      startTime: 1744041600000,
      endTime: 1746633600000,
      rule: '充电消费每满50元返20积分',
      description: '充电消费返积分活动',
      stationIds: '3,4,5,6',
      joinCount: 300,
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1743914400000,
      remainPoint: 25000,
      status: '0',
      statusName: '待生效',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743842400000,
      updateTime: 1744083600000,
    },
    {
      id: 9,
      name: '春季邀请有礼',
      type: '2',
      typeName: '邀请',
      startTime: 1744128000000,
      endTime: 1746720000000,
      rule: '春季邀请好友各得150积分',
      description: '春季邀请好友活动',
      stationIds: '7,8',
      joinCount: 110,
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1744000800000,
      remainPoint: 9000,
      status: '2',
      statusName: '已结束',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743928800000,
      updateTime: 1744160400000,
    },
    {
      id: 10,
      name: '周末消费双倍积分',
      type: '1',
      typeName: '消费',
      startTime: 1744214400000,
      endTime: 1746806400000,
      rule: '周末充电消费双倍积分返还',
      description: '周末消费双倍积分活动',
      stationIds: '9,10,11',
      joinCount: 75,
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1744087200000,
      remainPoint: 6000,
      status: '3',
      statusName: '已暂停',
      creator: 'admin',
      updater: 'admin',
      createTime: 1744015200000,
      updateTime: 1744246800000,
    },
    {
      id: 11,
      name: '会员日签到活动',
      type: '0',
      typeName: '签到',
      startTime: 1744300800000,
      endTime: 1746892800000,
      rule: '会员日签到赠送50积分',
      description: '会员日签到额外奖励活动',
      stationIds: '12,1,2',
      joinCount: 220,
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1744173600000,
      remainPoint: 20000,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1744101600000,
      updateTime: 1744333200000,
    },
    {
      id: 12,
      name: '国庆邀请狂欢',
      type: '2',
      typeName: '邀请',
      startTime: 1744387200000,
      endTime: 1746979200000,
      rule: '国庆期间邀请好友各得300积分',
      description: '国庆邀请好友狂欢活动',
      stationIds: '3,4,5,6,7,8',
      joinCount: 450,
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1744260000000,
      remainPoint: 35000,
      status: '1',
      statusName: '进行中',
      creator: 'admin',
      updater: 'admin',
      createTime: 1744188000000,
      updateTime: 1744419600000,
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
        valueFormat: 'timestamp',
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
        valueFormat: 'timestamp',
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
        valueFormat: 'timestamp',
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
        valueFormat: 'timestamp',
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
        valueFormat: 'timestamp',
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
        valueFormat: 'timestamp',
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
        valueFormat: 'timestamp',
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
      width: 200,
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
