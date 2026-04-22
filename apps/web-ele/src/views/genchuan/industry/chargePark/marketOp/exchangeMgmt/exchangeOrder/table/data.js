import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { formatDate } from '#/utils/genchuan/formatTime';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';

/** 获取支付状态Tag类型 - 使用封装的字典颜色工具 */
export const getExchangeOrderPayStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.EXCHANGE_ORDER_PAY_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取支付状态标签 */
export const getExchangeOrderPayStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.EXCHANGE_ORDER_PAY_STATUS, String(status));
  return dict ? dict.label : status;
};

/** 兑换订单表格初始数据 - 按接口文档格式生成，字典值与系统字典一致 */
export const dataList = () => {
  return [
    {
      id: 1,
      no: 'EO-20250401001',
      userId: 1001,
      userName: '张三',
      categoryId: 1,
      categoryName: '数码配件',
      goodsName: '充电线',
      costPoint: 500,
      payStatus: '1',
      payStatusName: '已支付',
      createTime: 1743472800000,
      payTime: 1743472860000,
      shipTime: 1743490800000,
      logisticsInfo: '圆通快递：YT1234567890',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      updateTime: 1743490800000,
    },
    {
      id: 2,
      no: 'EO-20250401002',
      userId: 1002,
      userName: '李四',
      categoryId: 2,
      categoryName: '生活用品',
      goodsName: '保温杯',
      costPoint: 800,
      payStatus: '2',
      payStatusName: '已完成',
      createTime: 1743476400000,
      payTime: 1743476460000,
      shipTime: 1743494400000,
      logisticsInfo: '顺丰快递：SF1234567890',
      archiveTime: 1744081200000,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      updateTime: 1744081200000,
    },
    {
      id: 3,
      no: 'EO-20250401003',
      userId: 1003,
      userName: '王五',
      categoryId: 3,
      categoryName: '食品饮料',
      goodsName: '矿泉水',
      costPoint: 100,
      payStatus: '0',
      payStatusName: '待支付',
      createTime: 1743480000000,
      payTime: null,
      shipTime: null,
      logisticsInfo: null,
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      updateTime: 1743480000000,
    },
    {
      id: 4,
      no: 'EO-20250401004',
      userId: 1004,
      userName: '赵六',
      categoryId: 4,
      categoryName: '虚拟商品',
      goodsName: '会员卡',
      costPoint: 1000,
      payStatus: '3',
      payStatusName: '已取消',
      createTime: 1743483600000,
      payTime: null,
      shipTime: null,
      logisticsInfo: null,
      archiveTime: 1743487200000,
      reserve1: '用户主动取消',
      reserve2: null,
      creator: 'system',
      updater: 'system',
      updateTime: 1743487200000,
    },
    {
      id: 5,
      no: 'EO-20250401005',
      userId: 1005,
      userName: '孙七',
      categoryId: 1,
      categoryName: '数码配件',
      goodsName: '充电宝',
      costPoint: 1500,
      payStatus: '1',
      payStatusName: '已支付',
      createTime: 1743487200000,
      payTime: 1743487260000,
      shipTime: null,
      logisticsInfo: null,
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      updateTime: 1743487260000,
    },
    {
      id: 6,
      no: 'EO-20250401006',
      userId: 1006,
      userName: '周八',
      categoryId: 5,
      categoryName: '汽车用品',
      goodsName: '车载充电器',
      costPoint: 600,
      payStatus: '2',
      payStatusName: '已完成',
      createTime: 1743490800000,
      payTime: 1743490860000,
      shipTime: 1743508800000,
      logisticsInfo: '中通快递：ZT1234567890',
      archiveTime: 1744095600000,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      updateTime: 1744095600000,
    },
    {
      id: 7,
      no: 'EO-20250401007',
      userId: 1007,
      userName: '吴九',
      categoryId: 6,
      categoryName: '充电服务',
      goodsName: '充电优惠券',
      costPoint: 200,
      payStatus: '1',
      payStatusName: '已支付',
      createTime: 1743494400000,
      payTime: 1743494460000,
      shipTime: null,
      logisticsInfo: null,
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      updateTime: 1743494460000,
    },
    {
      id: 8,
      no: 'EO-20250401008',
      userId: 1008,
      userName: '郑十',
      categoryId: 2,
      categoryName: '生活用品',
      goodsName: '毛巾套装',
      costPoint: 300,
      payStatus: '0',
      payStatusName: '待支付',
      createTime: 1743498000000,
      payTime: null,
      shipTime: null,
      logisticsInfo: null,
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      updateTime: 1743498000000,
    },
  ];
};

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
      rules: 'required',
    },
    {
      fieldName: 'userId',
      label: '用户ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入用户ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'categoryId',
      label: '类目ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入类目ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'goodsName',
      label: '商品名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商品名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'costPoint',
      label: '消耗积分',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入消耗积分',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'payStatus',
      label: '支付状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付状态',
        options: getDictOptions(DICT_TYPE.EXCHANGE_ORDER_PAY_STATUS, 'string'),
      },
      rules: 'required',
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

/** 兑换订单搜索表单配置 - 仅包含表格展示字段 */
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
    {
      fieldName: 'userName',
      label: '用户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名称',
        clearable: true,
      },
    },
    {
      fieldName: 'goodsName',
      label: '商品名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商品名称',
        clearable: true,
      },
    },
    {
      fieldName: 'costPointMin',
      label: '消耗积分最小值',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入最小消耗积分',
        clearable: true,
        min: 0,
      },
    },
    {
      fieldName: 'costPointMax',
      label: '消耗积分最大值',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入最大消耗积分',
        clearable: true,
        min: 0,
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
    {
      fieldName: 'payTime',
      label: '支付时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择支付时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetimerange',
        clearable: true,
      },
    },
    {
      fieldName: 'shipTime',
      label: '发货时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择发货时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetimerange',
        clearable: true,
      },
    },
    {
      fieldName: 'logisticsInfo',
      label: '物流信息',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物流信息',
        clearable: true,
      },
    },
    {
      fieldName: 'archiveTime',
      label: '归档时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择归档时间',
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
      minWidth: 180,
      sortable: true,
      slots: { default: 'goodsName' },
    },
    {
      field: 'costPoint',
      title: '消耗积分',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'payStatusName',
      title: '支付状态',
      minWidth: 120,
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
      slots: { default: 'logisticsInfo' },
    },
    {
      field: 'archiveTime',
      title: '归档时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'archiveTime' },
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
  editText: '编辑订单',
  addText: '新增订单',
  excelName: '兑换订单列表',
  excelAllName: '兑换订单数据.xlsx',
  total: ' 总计: 兑换订单数量8;已支付:3;已完成:2;待支付:2;已取消:1',
};

/** 详情抽屉字段配置 - 使用与表格相同的字典颜色逻辑 */
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
  { key: 'createTime', label: '生成时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '' },
  { key: 'payTime', label: '支付时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-' },
  { key: 'shipTime', label: '发货时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-' },
  { key: 'logisticsInfo', label: '物流信息', formatter: (value) => value || '-' },
  { key: 'archiveTime', label: '归档时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'updateTime', label: '更新时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '' },
];
