import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

/** 获取卡种类型Tag类型 - 使用封装的字典颜色工具 */
export const getCardConfigTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取适用范围Tag类型 - 使用封装的字典颜色工具 */
export const getCardConfigScopeTagType = (scope) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_SCOPE, String(scope));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取配置状态Tag类型 - 使用封装的字典颜色工具 */
export const getCardConfigStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取卡种类型标签 */
export const getCardConfigTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

/** 获取适用范围标签 */
export const getCardConfigScopeLabel = (scope) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_SCOPE, String(scope));
  return dict ? dict.label : scope;
};

/** 获取配置状态标签 */
export const getCardConfigStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_STATUS, String(status));
  return dict ? dict.label : status;
};

/** 卡种配置表格初始数据 - 按接口文档格式生成，字典值与系统字典一致 */
export const dataList = () => {
  return [
    {
      id: 1,
      name: '月卡 - 充电通用',
      type: '2',
      typeName: '月卡',
      scope: '0',
      scopeName: '充电',
      price: 99,
      status: '1',
      statusName: '已生效',
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1_745_104_800_000,
      saleCount: 120,
      effectTime: 1_746_028_800_000,
      description: '充电月卡，30天内不限次数充电',
      validDays: 30,
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 2,
      name: '日卡 - 停车专用',
      type: '0',
      typeName: '日卡',
      scope: '1',
      scopeName: '停车',
      price: 15,
      status: '1',
      statusName: '已生效',
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1_745_104_800_000,
      saleCount: 85,
      effectTime: 1_746_028_800_000,
      description: '停车日卡，24小时内不限次数停车',
      validDays: 1,
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 3,
      name: '季卡 - 充停通用',
      type: '3',
      typeName: '季卡',
      scope: '2',
      scopeName: '充停通用',
      price: 299,
      status: '0',
      statusName: '未生效',
      auditorId: null,
      auditorName: null,
      auditTime: null,
      saleCount: 0,
      effectTime: 1_748_707_200_000,
      description: '充停通用季卡，90天内不限次数充电和停车',
      validDays: 90,
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 4,
      name: '周卡 - 充电优惠',
      type: '1',
      typeName: '周卡',
      scope: '0',
      scopeName: '充电',
      price: 49,
      status: '1',
      statusName: '已生效',
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1_745_104_800_000,
      saleCount: 68,
      effectTime: 1_746_028_800_000,
      description: '充电周卡，7天内不限次数充电',
      validDays: 7,
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 5,
      name: '年卡 - 充停通用',
      type: '4',
      typeName: '年卡',
      scope: '2',
      scopeName: '充停通用',
      price: 999,
      status: '1',
      statusName: '已生效',
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1_745_104_800_000,
      saleCount: 45,
      effectTime: 1_746_028_800_000,
      description: '充停通用年卡，365天内不限次数充电和停车',
      validDays: 365,
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 6,
      name: '月卡 - 停车专用',
      type: '2',
      typeName: '月卡',
      scope: '1',
      scopeName: '停车',
      price: 199,
      status: '0',
      statusName: '未生效',
      auditorId: null,
      auditorName: null,
      auditTime: null,
      saleCount: 0,
      effectTime: 1_751_241_600_000,
      description: '停车月卡，30天内不限次数停车',
      validDays: 30,
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 7,
      name: '日卡 - 充停通用',
      type: '0',
      typeName: '日卡',
      scope: '2',
      scopeName: '充停通用',
      price: 25,
      status: '1',
      statusName: '已生效',
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1_745_104_800_000,
      saleCount: 156,
      effectTime: 1_746_028_800_000,
      description: '充停通用日卡，24小时内不限次数充电和停车',
      validDays: 1,
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 8,
      name: '季卡 - 充电专用',
      type: '3',
      typeName: '季卡',
      scope: '0',
      scopeName: '充电',
      price: 259,
      status: '1',
      statusName: '已生效',
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1_745_104_800_000,
      saleCount: 32,
      effectTime: 1_746_028_800_000,
      description: '充电季卡，90天内不限次数充电',
      validDays: 90,
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
  ];
};

/** 卡种配置表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '卡种名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入卡种名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '卡种类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择卡种类型',
        options: getDictOptions(DICT_TYPE.CARD_CONFIG_TYPE, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'scope',
      label: '适用范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用范围',
        options: getDictOptions(DICT_TYPE.CARD_CONFIG_SCOPE, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'price',
      label: '价格',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入价格',
        min: 0,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'validDays',
      label: '有效期天数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入有效期天数',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'description',
      label: '卡种描述',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入卡种描述',
        rows: 3,
      },
    },
  ];
}

/** 卡种配置搜索表单配置 - 仅包含接口支持的参数 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '卡种名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入卡种名称',
        clearable: true,
      },
    },
    {
      fieldName: 'type',
      label: '卡种类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择卡种类型',
        options: getDictOptions(DICT_TYPE.CARD_CONFIG_TYPE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'scope',
      label: '适用范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用范围',
        options: getDictOptions(DICT_TYPE.CARD_CONFIG_SCOPE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '配置状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择配置状态',
        options: getDictOptions(DICT_TYPE.CARD_CONFIG_STATUS, 'string'),
        clearable: true,
      },
    },
  ];
}

/** 卡种配置表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '卡种名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'typeName',
      title: '卡种类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'typeName' },
    },
    {
      field: 'scopeName',
      title: '适用范围',
      minWidth: 120,
      sortable: true,
      slots: { default: 'scopeName' },
    },
    {
      field: 'price',
      title: '价格',
      minWidth: 120,
      sortable: true,
      slots: { default: 'price' },
    },
    {
      field: 'statusName',
      title: '配置状态',
      minWidth: 120,
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
      // slots: { default: 'auditorName' },
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'auditTime' },
    },
    {
      field: 'saleCount',
      title: '销量',
      minWidth: 100,
      sortable: true,
      // slots: { default: 'saleCount' },
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
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑卡种配置',
  addText: '新增卡种配置',
  excelName: '卡种配置列表',
  excelAllName: '卡种配置数据.xlsx',
  total: ' 总计: 卡种配置数量8;已生效:5;未生效:3',
};

/** 详情抽屉字段配置 - 使用与表格相同的字典颜色逻辑 */
export const detailFields = [
  { key: 'name', label: '卡种名称' },
  {
    key: 'type',
    label: '卡种类型',
    type: 'tag',
    formatter: (value) => getCardConfigTypeLabel(value),
    tagType: (value) => getCardConfigTypeTagType(value),
  },
  {
    key: 'scope',
    label: '适用范围',
    type: 'tag',
    formatter: (value) => getCardConfigScopeLabel(value),
    tagType: (value) => getCardConfigScopeTagType(value),
  },
  {
    key: 'price',
    label: '价格',
    formatter: (value) => `¥${Number(value).toFixed(2)}`,
  },
  {
    key: 'status',
    label: '配置状态',
    type: 'tag',
    formatter: (value) => getCardConfigStatusLabel(value),
    tagType: (value) => getCardConfigStatusTagType(value),
  },
  {
    key: 'createTime',
    label: '创建时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '',
  },
  {
    key: 'auditorName',
    label: '审核人',
    formatter: (value) => value || '-',
  },
  {
    key: 'auditTime',
    label: '审核时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-',
  },
  { key: 'saleCount', label: '销量' },
  {
    key: 'effectTime',
    label: '生效时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-',
  },
  { key: 'description', label: '卡种描述' },
  { key: 'validDays', label: '有效期天数' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  {
    key: 'updateTime',
    label: '更新时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '',
  },
];
