import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { formatDate } from '#/utils/genchuan/formatTime';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';

/** 获取类目状态Tag类型 - 使用封装的字典颜色工具 */
export const getExchangeCategoryStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.EXCHANGE_CATEGORY_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取适用范围Tag类型 - 使用封装的字典颜色工具 */
export const getExchangeCategoryScopeTagType = (scope) => {
  const dict = getDictObj(DICT_TYPE.EXCHANGE_CATEGORY_SCOPE, String(scope));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取类目状态标签 */
export const getExchangeCategoryStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.EXCHANGE_CATEGORY_STATUS, String(status));
  return dict ? dict.label : status;
};

/** 获取适用范围标签 */
export const getExchangeCategoryScopeLabel = (scope) => {
  const dict = getDictObj(DICT_TYPE.EXCHANGE_CATEGORY_SCOPE, String(scope));
  return dict ? dict.label : scope;
};

/** 兑换类目表格初始数据 - 按接口文档格式生成，字典值与系统字典一致 */
export const dataList = () => {
  return [
    {
      id: 1,
      name: '数码配件',
      description: '各类充电、数码相关配件',
      goodsCount: 12,
      status: '1',
      statusName: '已生效',
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1745104800000,
      effectTime: 1746028800000,
      sort: 1,
      scope: '0',
      scopeName: '全平台',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 2,
      name: '生活用品',
      description: '日常生活用品兑换',
      goodsCount: 8,
      status: '1',
      statusName: '已生效',
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1745104800000,
      effectTime: 1746028800000,
      sort: 2,
      scope: '0',
      scopeName: '全平台',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 3,
      name: '食品饮料',
      description: '各类食品饮料兑换',
      goodsCount: 15,
      status: '1',
      statusName: '已生效',
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1745104800000,
      effectTime: 1746028800000,
      sort: 3,
      scope: '1',
      scopeName: '指定场站',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 4,
      name: '虚拟商品',
      description: '虚拟卡券、会员等',
      goodsCount: 5,
      status: '0',
      statusName: '未生效',
      auditorId: null,
      auditorName: null,
      auditTime: null,
      effectTime: 1748707200000,
      sort: 4,
      scope: '0',
      scopeName: '全平台',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 5,
      name: '汽车用品',
      description: '汽车相关用品兑换',
      goodsCount: 10,
      status: '2',
      statusName: '已禁用',
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1745104800000,
      effectTime: 1746028800000,
      sort: 5,
      scope: '0',
      scopeName: '全平台',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
    {
      id: 6,
      name: '充电服务',
      description: '充电服务相关兑换',
      goodsCount: 6,
      status: '1',
      statusName: '已生效',
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1745104800000,
      effectTime: 1746028800000,
      sort: 6,
      scope: '1',
      scopeName: '指定场站',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1745018400000,
      updateTime: 1745101200000,
    },
  ];
};

/** 兑换类目表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '类目名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入类目名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'scope',
      label: '适用范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用范围',
        options: getDictOptions(DICT_TYPE.EXCHANGE_CATEGORY_SCOPE, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'sort',
      label: '排序权重',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入排序权重',
        min: 0,
      },
    },
    {
      fieldName: 'description',
      label: '类目描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入类目描述',
      },
    },
  ];
}

/** 兑换类目搜索表单配置 - 仅包含接口支持的参数 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '类目名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入类目名称',
        clearable: true,
      },
    },
    {
      fieldName: 'scope',
      label: '适用范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用范围',
        options: getDictOptions(DICT_TYPE.EXCHANGE_CATEGORY_SCOPE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '类目状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择类目状态',
        options: getDictOptions(DICT_TYPE.EXCHANGE_CATEGORY_STATUS, 'string'),
        clearable: true,
      },
    },
  ];
}

/** 兑换类目表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '类目名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'description',
      title: '类目描述',
      minWidth: 250,
      sortable: true,
    },
    {
      field: 'goodsCount',
      title: '商品数量',
      minWidth: 120,
      sortable: true,
      slots: { default: 'goodsCount' },
    },
    {
      field: 'scopeName',
      title: '适用范围',
      minWidth: 120,
      sortable: true,
      slots: { default: 'scopeName' },
    },
    {
      field: 'statusName',
      title: '类目状态',
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
      minWidth: 120,
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
      field: 'effectTime',
      title: '生效时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'effectTime' },
    },
    {
      field: 'sort',
      title: '排序权重',
      minWidth: 120,
      sortable: true,
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
  editText: '编辑兑换类目',
  addText: '新增兑换类目',
  excelName: '兑换类目列表',
  excelAllName: '兑换类目数据.xlsx',
  total: ' 总计: 兑换类目数量6;已生效:4;未生效:1;已禁用:1',
};

/** 详情抽屉字段配置 - 使用与表格相同的字典颜色逻辑 */
export const detailFields = [
  { key: 'name', label: '类目名称' },
  { key: 'description', label: '类目描述' },
  { key: 'goodsCount', label: '商品数量' },
  {
    key: 'status',
    label: '类目状态',
    type: 'tag',
    formatter: (value) => getExchangeCategoryStatusLabel(value),
    tagType: (value) => getExchangeCategoryStatusTagType(value),
  },
  { key: 'createTime', label: '创建时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '' },
  {
    key: 'auditorName',
    label: '审核人',
    formatter: (value) => value || '-',
  },
  { key: 'auditTime', label: '审核时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-' },
  { key: 'effectTime', label: '生效时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '' },
  { key: 'sort', label: '排序权重' },
  {
    key: 'scope',
    label: '适用范围',
    type: 'tag',
    formatter: (value) => getExchangeCategoryScopeLabel(value),
    tagType: (value) => getExchangeCategoryScopeTagType(value),
  },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'updateTime', label: '更新时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '' },
];
