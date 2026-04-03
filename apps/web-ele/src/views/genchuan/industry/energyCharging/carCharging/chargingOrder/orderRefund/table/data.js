import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';

/** 退款订单表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'refundCode',
      label: '退款编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入退款编号',
      },
      rules: 'required',
    },
    {
      fieldName: 'orderCode',
      label: '关联订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联订单编号',
      },
      rules: 'required',
    },
    {
      fieldName: 'userId',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
      },
    },
    {
      fieldName: 'plateNo',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号',
      },
    },
    {
      fieldName: 'refundAmount',
      label: '退款金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入退款金额',
        min: 0,
        precision: 2,
      },
    },
    {
      fieldName: 'refundReason',
      label: '退款原因',
      component: 'Input',
      componentProps: {
        placeholder: '请输入退款原因',
      },
    },
    {
      fieldName: 'refundStatus',
      label: '退款状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择退款状态',
        options: getDictOptions(DICT_TYPE.ORDER_REFUND_STATUS, 'string'),
      },
    },
    {
      fieldName: 'auditUser',
      label: '审核人员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入审核人员',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
    {
      fieldName: 'refundChannel',
      label: '退款渠道',
      component: 'Select',
      componentProps: {
        placeholder: '请选择退款渠道',
        options: getDictOptions(DICT_TYPE.ORDER_REFUND_CHANNEL, 'string'),
      },
    },
    {
      fieldName: 'creator',
      label: '操作人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入操作人',
      },
    },
  ];
}

/** 退款订单搜索表单配置 - 覆盖所有表格展示字段 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'refundCode',
      label: '退款编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入退款编号',
        clearable: true,
      },
    },
    {
      fieldName: 'orderCode',
      label: '关联订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联订单编号',
        clearable: true,
      },
    },
    {
      fieldName: 'userId',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
        clearable: true,
      },
    },
    {
      fieldName: 'plateNo',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号',
        clearable: true,
      },
    },
    {
      fieldName: 'refundStatus',
      label: '退款状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择退款状态',
        options: getDictOptions(DICT_TYPE.ORDER_REFUND_STATUS, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'auditUser',
      label: '审核人员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入审核人员',
        clearable: true,
      },
    },
    {
      fieldName: 'refundChannel',
      label: '退款渠道',
      component: 'Select',
      componentProps: {
        placeholder: '请选择退款渠道',
        options: getDictOptions(DICT_TYPE.ORDER_REFUND_CHANNEL, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'creator',
      label: '操作人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入操作人',
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '申请时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择申请时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetimerange',
        clearable: true,
      },
    },
    {
      fieldName: 'auditTime',
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
    {
      fieldName: 'refundTime',
      label: '退款时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择退款时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetimerange',
        clearable: true,
      },
    },
  ];
}

/** 退款订单表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'refundCode',
      title: '退款编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'refundCode' },
    },
    {
      field: 'orderCode',
      title: '关联订单编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'orderCode' },
    },
    {
      field: 'userInfo',
      title: '用户ID/车牌号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'userInfo' },
    },
    {
      field: 'refundAmount',
      title: '退款金额',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'refundReason',
      title: '退款原因',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '申请时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'createTime' },
    },
    {
      field: 'refundStatus',
      title: '退款状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'refundStatus' },
    },
    {
      field: 'auditUser',
      title: '审核人员',
      minWidth: 100,
      sortable: true,
      slots: { default: 'auditUser' },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'refundTime',
      title: '退款时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'refundChannel',
      title: '退款渠道',
      minWidth: 120,
      sortable: true,
      slots: { default: 'refundChannel' },
    },
    {
      field: 'creator',
      title: '操作人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'creator' },
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 获取退款状态Tag类型 - 使用封装的字典颜色工具 */
export const getRefundStatusTagType = (refundStatus) => {
  const dict = getDictObj(DICT_TYPE.ORDER_REFUND_STATUS, String(refundStatus));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取退款渠道Tag类型 - 使用封装的字典颜色工具 */
export const getRefundChannelTagType = (refundChannel) => {
  const dict = getDictObj(DICT_TYPE.ORDER_REFUND_CHANNEL, String(refundChannel));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 格式化时间戳为 yyyy-MM-dd HH:mm:ss */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(Number(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const textObj = {
  editText: '编辑退款订单',
  addText: '新增退款订单',
  excelName: '退款订单列表',
  excelAllName: '退款订单数据.xlsx',
  total: ' 总计: 退款订单数量0',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'refundCode', label: '退款编号' },
  { key: 'orderCode', label: '关联订单编号' },
  { key: 'userId', label: '用户ID' },
  { key: 'plateNo', label: '车牌号' },
  { key: 'refundAmount', label: '退款金额' },
  { key: 'refundReason', label: '退款原因' },
  { key: 'createTime', label: '申请时间' },
  {
    key: 'refundStatus',
    label: '退款状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.ORDER_REFUND_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => getRefundStatusTagType(value),
  },
  { key: 'auditUser', label: '审核人员' },
  { key: 'remark', label: '备注' },
  { key: 'auditTime', label: '审核时间' },
  { key: 'refundTime', label: '退款时间' },
  {
    key: 'refundChannel',
    label: '退款渠道',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.ORDER_REFUND_CHANNEL, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => getRefundChannelTagType(value),
  },
  { key: 'creator', label: '操作人' },
];
