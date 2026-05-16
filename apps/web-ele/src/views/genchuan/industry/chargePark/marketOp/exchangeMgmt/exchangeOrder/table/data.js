import { ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getExchangeCategoryList } from '#/api/genchuan/industry/chargePark/marketOp/exchangeMgmt/exchangeCategory';
import { formatDate } from '#/utils/genchuan/formatTime';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';

/** 兑换订单状态标签类型 */
export const getExchangeOrderPayStatusTagType = (status) => {
  const typeMap = {
    0: 'warning', // 待支付
    1: 'success', // 已支付
    2: 'info', // 已完成
    3: 'danger', // 已取消
  };
  return typeMap[status] || 'info';
};

/** 兑换订单状态标签文本 */
export const getExchangeOrderPayStatusLabel = (status) => {
  const labelMap = {
    0: '待支付',
    1: '已支付',
    2: '已完成',
    3: '已取消',
  };
  return labelMap[status] || status;
};

/** 兑换订单发货状态标签类型 */
export const getExchangeOrderShipStatusTagType = (status) => {
  const typeMap = {
    0: 'warning', // 未发货
    1: 'success', // 已发货
  };
  return typeMap[status] || 'info';
};

/** 兑换订单发货状态标签文本 */
export const getExchangeOrderShipStatusLabel = (status) => {
  const labelMap = {
    0: '未发货',
    1: '已发货',
  };
  return labelMap[status] || status;
};

/** 商品类目搜索选项 - 静态数据作为默认值 */
export const categorySearchOptions = [
  { label: '美妆个护', value: 1 },
  { label: '办公文具', value: 2 },
  { label: '虚拟卡券', value: 3 },
  { label: '数码配件', value: 4 },
  { label: '车载用品', value: 5 },
  { label: '图书音像', value: 6 },
  { label: '生活用品', value: 7 },
  { label: '美食零食', value: 8 },
];

/** 动态商品类目搜索选项（从接口获取） */
export const dynamicCategorySearchOptions = ref([]);

/** 获取当前可用的商品类目搜索选项（优先使用动态数据） */
export function getCurrentCategorySearchOptions() {
  return dynamicCategorySearchOptions.value.length > 0
    ? dynamicCategorySearchOptions.value
    : categorySearchOptions;
}

/** 获取商品类目精简列表用于搜索 */
export async function fetchCategorySearchOptions() {
  try {
    const res = await getExchangeCategoryList();
    if (res && Array.isArray(res)) {
      dynamicCategorySearchOptions.value = res.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return dynamicCategorySearchOptions.value;
    }
  } catch (error) {
    console.error('获取商品类目列表失败:', error);
  }
  return categorySearchOptions;
}

/** 兑换订单详情字段配置 - 使用formatter格式化时间和状态字段 */
export const detailFields = [
  { key: 'no', label: '订单编号' },
  { key: 'userName', label: '用户名称' },
  { key: 'categoryName', label: '类目名称' },
  { key: 'goodsName', label: '商品名称' },
  { key: 'costPoint', label: '消耗积分' },
  {
    key: 'payStatus',
    label: '支付状态',
    type: 'tag',
    formatter: (value) => getExchangeOrderPayStatusLabel(value),
    tagType: (value) => getExchangeOrderPayStatusTagType(value),
  },
  {
    key: 'createTime',
    label: '生成时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '',
  },
  {
    key: 'payTime',
    label: '支付时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-',
  },
  {
    key: 'shipTime',
    label: '发货时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-',
  },
  {
    key: 'logisticsInfo',
    label: '物流信息',
    formatter: (value) => value || '-',
  },
  {
    key: 'archiveTime',
    label: '归档时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-',
  },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者', formatter: (value) => value || '-' },
  {
    key: 'updateTime',
    label: '更新时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '',
  },
];

/** 兑换订单表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'no',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
      },
    },
    // {
    //   fieldName: 'userId',
    //   label: '用户ID',
    //   component: 'InputNumber',
    //   componentProps: {
    //     placeholder: '请输入用户ID',
    //   },
    // },
    {
      fieldName: 'categoryId',
      label: '类目ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入类目ID',
      },
    },
    {
      fieldName: 'goodsName',
      label: '商品名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商品名称',
      },
    },
    {
      fieldName: 'costPoint',
      label: '消耗积分',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入消耗积分',
      },
    },
    {
      fieldName: 'payStatus',
      label: '支付状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付状态',
        options: getDictOptions(DICT_TYPE.EXCHANGE_ORDER_PAY_STATUS, 'string'),
      },
    },
    {
      fieldName: 'logisticsInfo',
      label: '物流信息',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物流信息',
      },
    },
  ];
}

/** 商品详情字段配置 - 完全参照奖品管理列表详情页的 detailFields 配置 */
export const goodsDetailFields = [
  { key: 'name', label: '商品名称' },
  {
    key: 'type',
    label: '商品类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_TYPE, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_TYPE, String(value));
      return getDictTagTypeFromDict(dict, 'primary');
    },
  },
  { key: 'stock', label: '当前库存' },
  {
    key: 'status',
    label: '商品状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_STATUS, String(value));
      return getDictTagTypeFromDict(dict, 'info');
    },
  },
  { key: 'activityName', label: '绑定活动' },
  { key: 'sendCount', label: '发放量' },
  { key: 'warnThreshold', label: '预警阈值' },
  { key: 'description', label: '商品描述' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'syncTimeStr', label: '同步时间' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'updateTimeStr', label: '更新时间' },
];

/** 兑换订单搜索表单配置 - 仅包含接口支持的参数 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'no',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
        clearable: true,
      },
    },
    // {
    //   fieldName: 'userId',
    //   label: '用户ID',
    //   component: 'InputNumber',
    //   componentProps: {
    //     placeholder: '请输入用户ID',
    //     clearable: true,
    //   },
    // },
    {
      fieldName: 'categoryId',
      label: '商品类目',
      component: 'Select',
      componentProps: {
        placeholder: '请选择商品类目',
        options: categorySearchOptions,
        clearable: true,
        filterable: true,
      },
    },
    {
      fieldName: 'payStatus',
      label: '支付状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付状态',
        options: getDictOptions(DICT_TYPE.EXCHANGE_ORDER_PAY_STATUS, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '生成时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生成时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetimerange',
        clearable: true,
      },
    },
  ];
}

/** 兑换订单表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'no',
      title: '订单编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'no' },
    },
    {
      field: 'userName',
      title: '用户名称',
      minWidth: 120,
      sortable: true,
      slots: { default: 'userName' },
    },
    {
      field: 'goodsName',
      title: '商品名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'goodsName' },
    },
    {
      field: 'costPoint',
      title: '消耗积分',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'payStatusName',
      title: '支付状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'payStatusName' },
    },
    {
      field: 'createTime',
      title: '生成时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'createTime' },
    },
    {
      field: 'payTime',
      title: '支付时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'payTime' },
    },
    {
      field: 'shipTime',
      title: '发货时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'shipTime' },
    },
    {
      field: 'logisticsInfo',
      title: '物流信息',
      minWidth: 200,
      sortable: true,
      // slots: { default: 'logisticsInfo' },
    },
    {
      field: 'archiveTime',
      title: '归档时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'archiveTime' },
    },
    {
      field: 'action',
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 兑换订单静态数据 - 时间戳格式 */
export const dataList = () => [
  {
    id: 1,
    no: 'EO20260316035',
    userId: 1001,
    userName: '张三',
    categoryId: 1,
    categoryName: '美妆个护',
    goodsName: '牙膏套装（旅行装）',
    costPoint: 110,
    payStatus: '3',
    payStatusName: '已取消',
    createTime: 1_773_754_689_000,
    payTime: null,
    shipTime: null,
    logisticsInfo: null,
    archiveTime: null,
    creator: 'system',
    updater: 'system',
    updateTime: 1_773_754_689_000,
  },
  {
    id: 2,
    no: 'EO20260315034',
    userId: 1002,
    userName: '李四',
    categoryId: 2,
    categoryName: '办公文具',
    goodsName: 'A5笔记本×3本',
    costPoint: 90,
    payStatus: '2',
    payStatusName: '已完成',
    createTime: 1_773_754_689_000,
    payTime: 1_743_164_530_000,
    shipTime: 1_744_460_468_000,
    logisticsInfo: null,
    archiveTime: null,
    creator: 'system',
    updater: 'system',
    updateTime: 1_773_754_689_000,
  },
  {
    id: 3,
    no: 'EO20260314033',
    userId: 1003,
    userName: '王五',
    categoryId: 3,
    categoryName: '虚拟卡券',
    goodsName: '双倍积分卡（7天）',
    costPoint: 300,
    payStatus: '2',
    payStatusName: '已完成',
    createTime: 1_773_754_689_000,
    payTime: 1_742_967_201_000,
    shipTime: null,
    logisticsInfo: '虚拟商品，无需物流',
    archiveTime: 1_742_967_201_000,
    creator: 'system',
    updater: 'system',
    updateTime: 1_773_754_689_000,
  },
  {
    id: 4,
    no: 'EO20260313032',
    userId: 1004,
    userName: '赵六',
    categoryId: 4,
    categoryName: '数码配件',
    goodsName: 'USB集线器（4口）',
    costPoint: 130,
    payStatus: '2',
    payStatusName: '已完成',
    createTime: 1_773_754_689_000,
    payTime: 1_742_890_533_000,
    shipTime: 1_742_983_200_000,
    logisticsInfo: '顺丰快递 SF7890123456',
    archiveTime: 1_743_415_200_000,
    creator: 'system',
    updater: 'system',
    updateTime: 1_773_754_689_000,
  },
  {
    id: 5,
    no: 'EO20260312031',
    userId: 1005,
    userName: '钱七',
    categoryId: 5,
    categoryName: '数码配件',
    goodsName: '桌面无线充电器',
    costPoint: 600,
    payStatus: '1',
    payStatusName: '已支付',
    createTime: 1_773_754_689_000,
    payTime: 1_744_458_968_000,
    shipTime: null,
    logisticsInfo: null,
    archiveTime: null,
    creator: 'system',
    updater: 'system',
    updateTime: 1_773_754_689_000,
  },
  {
    id: 6,
    no: 'EO20260311030',
    userId: 1006,
    userName: '孙八',
    categoryId: 6,
    categoryName: '车载用品',
    goodsName: '行车记录仪',
    costPoint: 1500,
    payStatus: '3',
    payStatusName: '已取消',
    createTime: 1_773_754_689_000,
    payTime: null,
    shipTime: null,
    logisticsInfo: null,
    archiveTime: null,
    creator: 'system',
    updater: 'system',
    updateTime: 1_773_754_689_000,
  },
  {
    id: 7,
    no: 'EO20260310029',
    userId: 1007,
    userName: '周九',
    categoryId: 7,
    categoryName: '图书音像',
    goodsName: '编程入门书籍',
    costPoint: 150,
    payStatus: '1',
    payStatusName: '已支付',
    createTime: 1_773_754_689_000,
    payTime: 1_744_459_539_000,
    shipTime: null,
    logisticsInfo: null,
    archiveTime: null,
    creator: 'system',
    updater: 'system',
    updateTime: 1_773_754_689_000,
  },
  {
    id: 8,
    no: 'EO20260309028',
    userId: 1008,
    userName: '吴十',
    categoryId: 8,
    categoryName: '生活用品',
    goodsName: '保温饭盒三层',
    costPoint: 280,
    payStatus: '0',
    payStatusName: '待支付',
    createTime: 1_773_754_689_000,
    payTime: null,
    shipTime: null,
    logisticsInfo: null,
    archiveTime: null,
    creator: 'system',
    updater: 'system',
    updateTime: 1_773_754_689_000,
  },
  {
    id: 9,
    no: 'EO20260308027',
    userId: 1009,
    userName: '郑十一',
    categoryId: 9,
    categoryName: '美食零食',
    goodsName: '进口巧克力礼盒',
    costPoint: 500,
    payStatus: '1',
    payStatusName: '已支付',
    createTime: 1_773_754_689_000,
    payTime: 1_742_447_057_000,
    shipTime: null,
    logisticsInfo: null,
    archiveTime: null,
    creator: 'system',
    updater: 'system',
    updateTime: 1_773_754_689_000,
  },
  {
    id: 10,
    no: 'EO20260307026',
    userId: 1010,
    userName: '王十二',
    categoryId: 10,
    categoryName: '数码配件',
    goodsName: '三合一充电线',
    costPoint: 160,
    payStatus: '1',
    payStatusName: '已支付',
    createTime: 1_773_754_689_000,
    payTime: 1_742_305_735_000,
    shipTime: null,
    logisticsInfo: null,
    archiveTime: null,
    creator: 'system',
    updater: 'system',
    updateTime: 1_773_754_689_000,
  },
];

/** 兑换订单文本对象 */
export const textObj = {
  total: '共 35 条记录',
  addText: '新增兑换订单',
  editText: '编辑兑换订单',
  excelName: '兑换订单',
  excelAllName: '兑换订单列表',
};

/** 兑换订单数据对象 */
export const dataObj = {
  apilist: dataList(),
  list: dataList(),
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
};
