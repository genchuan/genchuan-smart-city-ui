import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

/** 获取支付状态Tag类型 - 使用封装的字典颜色工具 */
export const getCardOrderPayStatusTagType = (payStatus) => {
  const dict = getDictObj(DICT_TYPE.CARD_ORDER_PAY_STATUS, String(payStatus));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取开票状态Tag类型 - 使用封装的字典颜色工具 */
export const getCardOrderInvoiceStatusTagType = (invoiceStatus) => {
  const dict = getDictObj(
    DICT_TYPE.CARD_ORDER_INVOICE_STATUS,
    String(invoiceStatus),
  );
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取支付状态标签 */
export const getCardOrderPayStatusLabel = (payStatus) => {
  const dict = getDictObj(DICT_TYPE.CARD_ORDER_PAY_STATUS, String(payStatus));
  return dict ? dict.label : payStatus;
};

/** 获取开票状态标签 */
export const getCardOrderInvoiceStatusLabel = (invoiceStatus) => {
  const dict = getDictObj(
    DICT_TYPE.CARD_ORDER_INVOICE_STATUS,
    String(invoiceStatus),
  );
  return dict ? dict.label : invoiceStatus;
};

/** 卡种订单表格初始数据 - 按接口文档格式生成，字典值与系统字典一致 */
export const dataList = () => {
  return [
    {
      id: 1,
      no: 'CO-20250401001',
      userId: 1001,
      userName: '张三',
      cardId: 1,
      cardName: '日卡',
      amount: 99,
      payStatus: '1',
      payStatusName: '已支付',
      payTime: 1_743_472_800_000,
      activeTime: 1_743_472_860_000,
      invoiceStatus: '0',
      invoiceStatusName: '未开票',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_472_800_000,
      updateTime: 1_743_472_860_000,
    },
    {
      id: 2,
      no: 'CO-20250401002',
      userId: 1002,
      userName: '李四',
      cardId: 2,
      cardName: '周卡',
      amount: 199,
      payStatus: '0',
      payStatusName: '待支付',
      payTime: null,
      activeTime: null,
      invoiceStatus: '0',
      invoiceStatusName: '未开票',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_476_400_000,
      updateTime: 1_743_476_400_000,
    },
    {
      id: 3,
      no: 'CO-20250401003',
      userId: 1003,
      userName: '王五',
      cardId: 3,
      cardName: '月卡',
      amount: 399,
      payStatus: '2',
      payStatusName: '已完成',
      payTime: 1_743_480_000_000,
      activeTime: 1_743_480_060_000,
      invoiceStatus: '1',
      invoiceStatusName: '已开票',
      archiveTime: 1_743_566_400_000,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_480_000_000,
      updateTime: 1_743_566_400_000,
    },
    {
      id: 4,
      no: 'CO-20250401004',
      userId: 1004,
      userName: '赵六',
      cardId: 1,
      cardName: '日卡',
      amount: 99,
      payStatus: '3',
      payStatusName: '已取消',
      payTime: null,
      activeTime: null,
      invoiceStatus: '0',
      invoiceStatusName: '未开票',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_483_600_000,
      updateTime: 1_743_483_600_000,
    },
    {
      id: 5,
      no: 'CO-20250401005',
      userId: 1005,
      userName: '孙七',
      cardId: 4,
      cardName: '季卡',
      amount: 999,
      payStatus: '1',
      payStatusName: '已支付',
      payTime: 1_743_487_200_000,
      activeTime: 1_743_487_260_000,
      invoiceStatus: '0',
      invoiceStatusName: '未开票',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_487_200_000,
      updateTime: 1_743_487_260_000,
    },
    {
      id: 6,
      no: 'CO-20250401006',
      userId: 1006,
      userName: '周八',
      cardId: 5,
      cardName: '年卡',
      amount: 2999,
      payStatus: '2',
      payStatusName: '已完成',
      payTime: 1_743_490_800_000,
      activeTime: 1_743_490_860_000,
      invoiceStatus: '1',
      invoiceStatusName: '已开票',
      archiveTime: 1_743_577_200_000,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_490_800_000,
      updateTime: 1_743_577_200_000,
    },
    {
      id: 7,
      no: 'CO-20250401007',
      userId: 1007,
      userName: '吴九',
      cardId: 2,
      cardName: '周卡',
      amount: 199,
      payStatus: '1',
      payStatusName: '已支付',
      payTime: 1_743_494_400_000,
      activeTime: 1_743_494_460_000,
      invoiceStatus: '0',
      invoiceStatusName: '未开票',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_494_400_000,
      updateTime: 1_743_494_460_000,
    },
    {
      id: 8,
      no: 'CO-20250401008',
      userId: 1008,
      userName: '郑十',
      cardId: 3,
      cardName: '月卡',
      amount: 399,
      payStatus: '0',
      payStatusName: '待支付',
      payTime: null,
      activeTime: null,
      invoiceStatus: '0',
      invoiceStatusName: '未开票',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_498_000_000,
      updateTime: 1_743_498_000_000,
    },
  ];
};

/** 卡种订单表单配置 */
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
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'cardId',
      label: '卡种ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入卡种ID',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'amount',
      label: '订单金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入订单金额',
        min: 0,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'payStatus',
      label: '支付状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付状态',
        options: getDictOptions(DICT_TYPE.CARD_ORDER_PAY_STATUS, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'invoiceStatus',
      label: '开票状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择开票状态',
        options: getDictOptions(DICT_TYPE.CARD_ORDER_INVOICE_STATUS, 'string'),
      },
      rules: 'required',
    },
  ];
}

/** 卡种订单搜索表单配置 - 根据CardOrderPageReqVO参数配置 */
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
      fieldName: 'cardId',
      label: '卡种',
      component: 'Select',
      componentProps: {
        placeholder: '请选择卡种',
        options: [],
        clearable: true,
        filterable: true,
        remote: true,
      },
    },
    {
      fieldName: 'payStatus',
      label: '支付状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付状态',
        options: getDictOptions(DICT_TYPE.CARD_ORDER_PAY_STATUS, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'invoiceStatus',
      label: '开票状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择开票状态',
        options: getDictOptions(DICT_TYPE.CARD_ORDER_INVOICE_STATUS, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '订单时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择订单时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetimerange',
        clearable: true,
      },
    },
  ];
}

/** 卡种订单表格列配置 */
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
      field: 'cardName',
      title: '卡种名称',
      minWidth: 120,
      sortable: true,
      slots: { default: 'cardName' },
    },
    {
      field: 'amount',
      title: '订单金额',
      minWidth: 120,
      sortable: true,
      slots: { default: 'amount' },
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
      field: 'activeTime',
      title: '激活时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'activeTime' },
    },
    {
      field: 'invoiceStatusName',
      title: '开票状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'invoiceStatusName' },
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
  editText: '编辑卡种订单',
  addText: '新增卡种订单',
  excelName: '卡种订单列表',
  excelAllName: '卡种订单数据.xlsx',
  total: ' 总计: 卡种订单数量8;待支付:2;已支付:3;已完成:2;已取消:1',
};

/** 详情抽屉字段配置 - 使用与表格相同的字典颜色逻辑 */
export const detailFields = [
  { key: 'no', label: '订单编号' },
  { key: 'userName', label: '用户名称' },
  { key: 'cardName', label: '卡种名称' },
  { key: 'amount', label: '订单金额' },
  {
    key: 'payStatus',
    label: '支付状态',
    type: 'tag',
    formatter: (value) => getCardOrderPayStatusLabel(value),
    tagType: (value) => getCardOrderPayStatusTagType(value),
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
    key: 'activeTime',
    label: '激活时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-',
  },
  {
    key: 'invoiceStatus',
    label: '开票状态',
    type: 'tag',
    formatter: (value) => getCardOrderInvoiceStatusLabel(value),
    tagType: (value) => getCardOrderInvoiceStatusTagType(value),
  },
  {
    key: 'archiveTime',
    label: '归档时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-',
  },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
];
