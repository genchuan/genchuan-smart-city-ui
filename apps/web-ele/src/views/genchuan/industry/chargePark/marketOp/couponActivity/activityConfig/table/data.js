import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { formatDate } from '#/utils/genchuan/formatTime';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';

/** 获取配置类型Tag类型 - 使用封装的字典颜色工具 */
export const getActivityConfigTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.ACTIVITY_CONFIG_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取配置状态Tag类型 - 使用封装的字典颜色工具 */
export const getActivityConfigStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.ACTIVITY_CONFIG_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取适用人群Tag类型 - 使用封装的字典颜色工具 */
export const getActivityConfigUserGroupTagType = (userGroup) => {
  const dict = getDictObj(DICT_TYPE.ACTIVITY_CONFIG_USER_GROUP, String(userGroup));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取配置类型标签 */
export const getActivityConfigTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.ACTIVITY_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

/** 获取配置状态标签 */
export const getActivityConfigStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.ACTIVITY_CONFIG_STATUS, String(status));
  return dict ? dict.label : status;
};

/** 获取适用人群标签 */
export const getActivityConfigUserGroupLabel = (userGroup) => {
  const dict = getDictObj(DICT_TYPE.ACTIVITY_CONFIG_USER_GROUP, String(userGroup));
  return dict ? dict.label : userGroup;
};

/** 活动配置表格初始数据 - 按接口文档格式生成，字典值与系统字典一致 */
export const dataList = () => {
  return [
    {
      id: 1,
      name: '五一充电优惠活动',
      type: '1',
      typeName: '节假日',
      joinCondition: '活动期间充电消费满50元',
      ruleContent: '满50减10，额外赠送50积分',
      status: '1',
      statusName: '已生效',
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1745104800000,
      joinCount: 320,
      effectTime: 1746028800000,
      description: '五一专属充电优惠活动',
      userGroup: '2',
      userGroupName: '全部',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 2,
      name: '新用户首充优惠',
      type: '0',
      typeName: '新用户',
      joinCondition: '首次注册并充电',
      ruleContent: '首充满20减5，赠送100积分',
      status: '1',
      statusName: '已生效',
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1745104800000,
      joinCount: 156,
      effectTime: 1746028800000,
      description: '新用户专属充电优惠',
      userGroup: '0',
      userGroupName: '新用户',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 3,
      name: '周年庆大酬宾',
      type: '2',
      typeName: '店庆',
      joinCondition: '活动期间任意充电',
      ruleContent: '充电满30减8，抽奖赢免单',
      status: '0',
      statusName: '未生效',
      auditorId: 3,
      auditorName: '王五',
      auditTime: null,
      joinCount: 0,
      effectTime: 1748707200000,
      description: '平台周年庆感恩回馈活动',
      userGroup: '2',
      userGroupName: '全部',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 4,
      name: '日常充电返现',
      type: '3',
      typeName: '日常',
      joinCondition: '每日充电满20元',
      ruleContent: '返现5%，积分双倍',
      status: '1',
      statusName: '已生效',
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1745104800000,
      joinCount: 892,
      effectTime: 1746028800000,
      description: '日常充电返现活动',
      userGroup: '1',
      userGroupName: '老用户',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 5,
      name: '国庆充电特惠',
      type: '1',
      typeName: '节假日',
      joinCondition: '国庆期间充电消费',
      ruleContent: '满100减20，赠送200积分',
      status: '0',
      statusName: '未生效',
      auditorId: null,
      auditorName: null,
      auditTime: null,
      joinCount: 0,
      effectTime: 1756656000000,
      description: '国庆长假充电特惠活动',
      userGroup: '2',
      userGroupName: '全部',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 6,
      name: '老用户回馈季',
      type: '3',
      typeName: '日常',
      joinCondition: '累计充电满100次',
      ruleContent: '专属8折优惠，积分5倍',
      status: '1',
      statusName: '已生效',
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1745104800000,
      joinCount: 234,
      effectTime: 1746028800000,
      description: '老用户专属回馈活动',
      userGroup: '1',
      userGroupName: '老用户',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 7,
      name: '春节充电红包',
      type: '1',
      typeName: '节假日',
      joinCondition: '春节期间充电',
      ruleContent: '随机红包，最高免单',
      status: '0',
      statusName: '未生效',
      auditorId: null,
      auditorName: null,
      auditTime: null,
      joinCount: 0,
      effectTime: 1735689600000,
      description: '春节充电红包活动',
      userGroup: '2',
      userGroupName: '全部',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 8,
      name: '周末充电半价',
      type: '3',
      typeName: '日常',
      joinCondition: '周末时段充电',
      ruleContent: '服务费半价，积分3倍',
      status: '1',
      statusName: '已生效',
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1745104800000,
      joinCount: 567,
      effectTime: 1746028800000,
      description: '周末充电优惠活动',
      userGroup: '2',
      userGroupName: '全部',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 9,
      name: '会员日专享',
      type: '2',
      typeName: '店庆',
      joinCondition: '每月8日充电',
      ruleContent: '会员专属折扣，额外积分',
      status: '1',
      statusName: '已生效',
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1745104800000,
      joinCount: 445,
      effectTime: 1746028800000,
      description: '会员日专属优惠活动',
      userGroup: '1',
      userGroupName: '老用户',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 10,
      name: '新用户注册礼',
      type: '0',
      typeName: '新用户',
      joinCondition: '新注册用户',
      ruleContent: '送50元充电券包',
      status: '1',
      statusName: '已生效',
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1745104800000,
      joinCount: 678,
      effectTime: 1746028800000,
      description: '新用户注册礼包活动',
      userGroup: '0',
      userGroupName: '新用户',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 11,
      name: '端午充电优惠',
      type: '1',
      typeName: '节假日',
      joinCondition: '端午节期间充电',
      ruleContent: '满30减5，送粽子礼盒',
      status: '0',
      statusName: '未生效',
      auditorId: null,
      auditorName: null,
      auditTime: null,
      joinCount: 0,
      effectTime: 1751241600000,
      description: '端午节充电优惠活动',
      userGroup: '2',
      userGroupName: '全部',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 12,
      name: '夜间充电特惠',
      type: '3',
      typeName: '日常',
      joinCondition: '22:00-06:00时段充电',
      ruleContent: '电费8折，积分双倍',
      status: '1',
      statusName: '已生效',
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1745104800000,
      joinCount: 1234,
      effectTime: 1746028800000,
      description: '夜间低谷时段充电优惠',
      userGroup: '2',
      userGroupName: '全部',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
  ];
};

/** 活动配置表单配置 */
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
      label: '配置类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择配置类型',
        options: getDictOptions(DICT_TYPE.ACTIVITY_CONFIG_TYPE, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'joinCondition',
      label: '参与条件',
      component: 'Input',
      componentProps: {
        placeholder: '请输入参与条件',
      },
      rules: 'required',
    },
    {
      fieldName: 'ruleContent',
      label: '规则内容',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则内容',
      },
      rules: 'required',
    },
    {
      fieldName: 'userGroup',
      label: '适用人群',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用人群',
        options: getDictOptions(DICT_TYPE.ACTIVITY_CONFIG_USER_GROUP, 'string'),
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
  ];
}

/** 活动配置搜索表单配置 - 根据ActivityConfigPageReqVO参数配置 */
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
      label: '配置类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择配置类型',
        options: getDictOptions(DICT_TYPE.ACTIVITY_CONFIG_TYPE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'userGroup',
      label: '适用人群',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用人群',
        options: getDictOptions(DICT_TYPE.ACTIVITY_CONFIG_USER_GROUP, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '配置状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择配置状态',
        options: getDictOptions(DICT_TYPE.ACTIVITY_CONFIG_STATUS, 'string'),
        clearable: true,
      },
    },
  ];
}

/** 活动配置表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '活动名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'typeName',
      title: '配置类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'typeName' },
    },
    {
      field: 'userGroupName',
      title: '适用人群',
      minWidth: 120,
      sortable: true,
      slots: { default: 'userGroupName' },
    },
    {
      field: 'joinCondition',
      title: '参与条件',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'ruleContent',
      title: '规则内容',
      minWidth: 250,
      sortable: true,
    },
    {
      field: 'statusName',
      title: '配置状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'statusName' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'createTime' },
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
      slots: { default: 'auditTime' },
    },
    {
      field: 'joinCount',
      title: '参与人数',
      minWidth: 100,
      sortable: true,
      slots: { default: 'joinCount' },
    },
    {
      field: 'effectTime',
      title: '生效时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'effectTime' },
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
  editText: '编辑活动配置',
  addText: '新增活动配置',
  excelName: '活动配置列表',
  excelAllName: '活动配置数据.xlsx',
  total: ' 总计: 活动配置数量12;已生效:8;未生效:4',
};

/** 详情抽屉字段配置 - 使用与表格相同的字典颜色逻辑 */
export const detailFields = [
  { key: 'name', label: '活动名称' },
  {
    key: 'type',
    label: '配置类型',
    type: 'tag',
    formatter: (value) => getActivityConfigTypeLabel(value),
    tagType: (value) => getActivityConfigTypeTagType(value),
  },
  {
    key: 'userGroup',
    label: '适用人群',
    type: 'tag',
    formatter: (value) => getActivityConfigUserGroupLabel(value),
    tagType: (value) => getActivityConfigUserGroupTagType(value),
  },
  { key: 'joinCondition', label: '参与条件' },
  { key: 'ruleContent', label: '规则内容' },
  {
    key: 'status',
    label: '配置状态',
    type: 'tag',
    formatter: (value) => getActivityConfigStatusLabel(value),
    tagType: (value) => getActivityConfigStatusTagType(value),
  },
  { key: 'createTime', label: '创建时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '' },
  {
    key: 'auditorName',
    label: '审核人',
    formatter: (value) => value || '-',
  },
  {
    key: 'auditTime',
    label: '审核时间',
    formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-',
  },
  { key: 'joinCount', label: '参与人数' },
  { key: 'effectTime', label: '生效时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '' },
  { key: 'description', label: '活动描述' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'updateTime', label: '更新时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '' },
];
