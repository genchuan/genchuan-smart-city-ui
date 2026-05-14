import { ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getCouponSimpleList } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/couponMgmt';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

/** 获取券包类型Tag类型 - 使用封装的字典颜色工具 */
export const getPackageConfigTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.PACKAGE_CONFIG_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取券包状态Tag类型 - 使用封装的字典颜色工具 */
export const getPackageConfigStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.PACKAGE_CONFIG_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取券包适用范围Tag类型 - 使用封装的字典颜色工具 */
export const getPackageConfigScopeTagType = (scope) => {
  const dict = getDictObj(DICT_TYPE.PACKAGE_CONFIG_SCOPE, String(scope));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取券包类型标签 */
export const getPackageConfigTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.PACKAGE_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

/** 获取券包状态标签 */
export const getPackageConfigStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.PACKAGE_CONFIG_STATUS, String(status));
  return dict ? dict.label : status;
};

/** 获取券包适用范围标签 */
export const getPackageConfigScopeLabel = (scope) => {
  const dict = getDictObj(DICT_TYPE.PACKAGE_CONFIG_SCOPE, String(scope));
  return dict ? dict.label : scope;
};

/** 优惠券选项配置 - 静态数据作为默认值 */
export const couponOptions = [
  { label: '5元充电券', value: '1' },
  { label: '10元充电券', value: '2' },
  { label: '20元充电券', value: '3' },
  { label: '30元充电券', value: '4' },
  { label: '50元充电券', value: '5' },
  { label: '充电8.5折券', value: '6' },
  { label: '充电7.5折券', value: '7' },
  { label: '充电9折券', value: '8' },
  { label: '3元充电券', value: '9' },
  { label: '5元充电券(新)', value: '10' },
  { label: '8元充电券', value: '11' },
  { label: '12元充电券', value: '12' },
];

/** 动态优惠券选项（从接口获取） */
export const dynamicCouponOptions = ref([]);

/** 获取当前可用的优惠券选项（优先使用动态数据） */
export function getCurrentCouponOptions() {
  return dynamicCouponOptions.value.length > 0
    ? dynamicCouponOptions.value
    : couponOptions;
}

/** 获取优惠券精简列表 */
export async function fetchCouponOptions() {
  try {
    const res = await getCouponSimpleList();
    if (res && Array.isArray(res)) {
      dynamicCouponOptions.value = res.map((item) => ({
        label: item.name,
        value: String(item.id),
      }));
      return dynamicCouponOptions.value;
    }
  } catch (error) {
    console.error('获取优惠券列表失败:', error);
  }
  return couponOptions;
}

/** 根据优惠券ID获取优惠券名称 */
export function getCouponNamesByIds(couponIds) {
  if (!couponIds) return '';
  const ids = couponIds.split(',');
  const names = ids.map((id) => {
    const coupon = couponOptions.find((c) => c.value === id);
    return coupon ? coupon.label : id;
  });
  return names.join(',');
}

/** 券包配置表格初始数据 - 按接口文档格式生成，字典值与系统字典一致 */
export const dataList = () => {
  return [
    {
      id: 1,
      name: '新手充电券包',
      type: '0',
      typeName: '新手包',
      couponIds: '1,2,3',
      couponNames: '5元券,10元券,20元券',
      price: 9.9,
      status: '1',
      statusName: '已生效',
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1_745_104_800_000,
      saleCount: 120,
      effectTime: 1_746_028_800_000,
      description: '新用户专属充电券包，包含3张不同面额优惠券',
      scope: '0',
      scopeName: '全平台',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 2,
      name: '春节特惠券包',
      type: '1',
      typeName: '节日包',
      couponIds: '4,5',
      couponNames: '30元券,50元券',
      price: 29.9,
      status: '1',
      statusName: '已生效',
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1_745_104_800_000,
      saleCount: 89,
      effectTime: 1_746_028_800_000,
      description: '春节专属充电券包',
      scope: '0',
      scopeName: '全平台',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 3,
      name: '日常充电券包',
      type: '2',
      typeName: '日常包',
      couponIds: '6,7,8,9',
      couponNames: '3元券,5元券,10元券,15元券',
      price: 19.9,
      status: '0',
      statusName: '未生效',
      auditorId: 3,
      auditorName: '王五',
      auditTime: null,
      saleCount: 0,
      effectTime: 1_748_707_200_000,
      description: '日常充电优惠组合',
      scope: '1',
      scopeName: '指定场站',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 4,
      name: '周末特惠券包',
      type: '2',
      typeName: '日常包',
      couponIds: '10,11',
      couponNames: '8元券,12元券',
      price: 15.9,
      status: '1',
      statusName: '已生效',
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1_745_104_800_000,
      saleCount: 256,
      effectTime: 1_746_028_800_000,
      description: '周末专属充电优惠',
      scope: '0',
      scopeName: '全平台',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 5,
      name: '会员专享券包',
      type: '0',
      typeName: '新手包',
      couponIds: '12,13,14',
      couponNames: '20元券,30元券,50元券',
      price: 49.9,
      status: '0',
      statusName: '未生效',
      auditorId: null,
      auditorName: null,
      auditTime: null,
      saleCount: 0,
      effectTime: 1_756_656_000_000,
      description: '会员专属大额券包',
      scope: '2',
      scopeName: '指定用户',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 6,
      name: '国庆狂欢券包',
      type: '1',
      typeName: '节日包',
      couponIds: '15,16,17,18',
      couponNames: '10元券,20元券,30元券,50元券',
      price: 59.9,
      status: '1',
      statusName: '已生效',
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1_745_104_800_000,
      saleCount: 178,
      effectTime: 1_746_028_800_000,
      description: '国庆长假充电优惠',
      scope: '0',
      scopeName: '全平台',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 7,
      name: '夜间充电券包',
      type: '2',
      typeName: '日常包',
      couponIds: '19,20',
      couponNames: '5元券,10元券',
      price: 12.9,
      status: '1',
      statusName: '已生效',
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1_745_104_800_000,
      saleCount: 342,
      effectTime: 1_746_028_800_000,
      description: '夜间低谷时段专用',
      scope: '0',
      scopeName: '全平台',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 8,
      name: '企业团购券包',
      type: '2',
      typeName: '日常包',
      couponIds: '21,22,23,24,25',
      couponNames: '50元券,100元券,200元券,500元券,1000元券',
      price: 999.9,
      status: '0',
      statusName: '未生效',
      auditorId: null,
      auditorName: null,
      auditTime: null,
      saleCount: 0,
      effectTime: 1_751_241_600_000,
      description: '企业批量采购专用',
      scope: '1',
      scopeName: '指定场站',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
  ];
};

/** 券包配置表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '券包名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入券包名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '券包类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择券包类型',
        options: getDictOptions(DICT_TYPE.PACKAGE_CONFIG_TYPE, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'couponIds',
      label: '包含优惠券',
      component: 'Select',
      componentProps: {
        placeholder: '请选择包含优惠券',
        multiple: true,
        options: couponOptions,
        filterable: true,
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
      fieldName: 'scope',
      label: '适用范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用范围',
        options: getDictOptions(DICT_TYPE.PACKAGE_CONFIG_SCOPE, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'description',
      label: '券包描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入券包描述',
      },
    },
  ];
}

/** 券包配置搜索表单配置 - 根据PackageConfigPageReqVO参数配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '券包名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入券包名称',
        clearable: true,
      },
    },
    {
      fieldName: 'type',
      label: '券包类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择券包类型',
        options: getDictOptions(DICT_TYPE.PACKAGE_CONFIG_TYPE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'scope',
      label: '适用范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用范围',
        options: getDictOptions(DICT_TYPE.PACKAGE_CONFIG_SCOPE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '配置状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择配置状态',
        options: getDictOptions(DICT_TYPE.PACKAGE_CONFIG_STATUS, 'string'),
        clearable: true,
      },
    },
  ];
}

/** 券包配置表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '券包名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'typeName',
      title: '券包类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'typeName' },
    },
    {
      field: 'couponNames',
      title: '包含优惠券',
      minWidth: 200,
      sortable: true,
      slots: { default: 'couponNames' },
    },
    {
      field: 'price',
      title: '价格',
      minWidth: 100,
      sortable: true,
      slots: { default: 'price' },
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
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑券包配置',
  addText: '新增券包配置',
  excelName: '券包配置列表',
  excelAllName: '券包配置数据.xlsx',
  total: ' 总计: 券包配置数量8;已生效:4;未生效:4',
};

/** 详情抽屉字段配置 - 使用与表格相同的字典颜色逻辑 */
export const detailFields = [
  { key: 'name', label: '券包名称' },
  {
    key: 'type',
    label: '券包类型',
    type: 'tag',
    formatter: (value) => getPackageConfigTypeLabel(value),
    tagType: (value) => getPackageConfigTypeTagType(value),
  },
  { key: 'couponNames', label: '包含优惠券' },
  { key: 'price', label: '价格' },
  {
    key: 'status',
    label: '配置状态',
    type: 'tag',
    formatter: (value) => getPackageConfigStatusLabel(value),
    tagType: (value) => getPackageConfigStatusTagType(value),
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
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '',
  },
  {
    key: 'scope',
    label: '适用范围',
    type: 'tag',
    formatter: (value) => getPackageConfigScopeLabel(value),
    tagType: (value) => getPackageConfigScopeTagType(value),
  },
  { key: 'description', label: '券包描述' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  {
    key: 'updateTime',
    label: '更新时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '',
  },
];
