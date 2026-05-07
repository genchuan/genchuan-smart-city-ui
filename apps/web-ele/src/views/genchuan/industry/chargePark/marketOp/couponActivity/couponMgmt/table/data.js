import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

/** 获取优惠券类型标签类型 */
export function getCouponTypeTagType(type) {
  const dict = getDictObj(DICT_TYPE.COUPON_MGMT_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
}

/** 获取优惠券状态标签类型 */
export function getCouponStatusTagType(status) {
  const dict = getDictObj(DICT_TYPE.COUPON_MGMT_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'info');
}

/** 获取优惠券类型字典标签 */
export function getCouponTypeLabel(type) {
  const dict = getDictObj(DICT_TYPE.COUPON_MGMT_TYPE, String(type));
  return dict ? dict.label : type;
}

/** 获取优惠券状态字典标签 */
export function getCouponStatusLabel(status) {
  const dict = getDictObj(DICT_TYPE.COUPON_MGMT_STATUS, String(status));
  return dict ? dict.label : status;
}

/** 优惠券管理静态数据 - 参照接口返回格式 */
export const dataList = () => {
  const rawData = [
    {
      id: 1,
      name: '充电满20减5券',
      type: '0',
      typeName: '满减',
      amount: 5,
      useCondition: '充电消费满20元可用',
      status: '0',
      statusName: '未领取',
      senderId: 1,
      senderName: 'admin',
      sendTime: null,
      receiverId: null,
      receiverName: null,
      verifyTime: null,
      validTime: 1_746_028_800_000,
      description: '新用户专属满减券',
      stationIds: '1,2,3',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_247_200_000,
      updateTime: 1_743_247_200_000,
    },
    {
      id: 2,
      name: '充电9折券',
      type: '1',
      typeName: '折扣',
      amount: 0.9,
      useCondition: '充电消费无门槛',
      status: '1',
      statusName: '已领取',
      senderId: 1,
      senderName: 'admin',
      sendTime: 1_743_333_600_000,
      receiverId: 1001,
      receiverName: '张三',
      verifyTime: null,
      validTime: 1_748_716_800_000,
      description: '会员专享折扣券',
      stationIds: '1,2',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_247_200_000,
      updateTime: 1_743_333_600_000,
    },
    {
      id: 3,
      name: '免费充电1小时券',
      type: '2',
      typeName: '时长',
      amount: 1,
      useCondition: '充电时长满1小时可用',
      status: '2',
      statusName: '已使用',
      senderId: 1,
      senderName: 'admin',
      sendTime: 1_743_333_600_000,
      receiverId: 1002,
      receiverName: '李四',
      verifyTime: 1_743_416_400_000,
      validTime: 1_746_124_800_000,
      description: '新用户专享时长券',
      stationIds: '3',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_247_200_000,
      updateTime: 1_743_416_400_000,
    },
    {
      id: 4,
      name: '立减3元券',
      type: '3',
      typeName: '立减',
      amount: 3,
      useCondition: '充电消费无门槛',
      status: '3',
      statusName: '已过期',
      senderId: 1,
      senderName: 'admin',
      sendTime: 1_743_333_600_000,
      receiverId: 1003,
      receiverName: '王五',
      verifyTime: null,
      validTime: 1_743_412_800_000,
      description: '限时立减券',
      stationIds: '1,2,3,4',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_247_200_000,
      updateTime: 1_743_412_800_000,
    },
    {
      id: 5,
      name: '充电满50减10券',
      type: '0',
      typeName: '满减',
      amount: 10,
      useCondition: '充电消费满50元可用',
      status: '0',
      statusName: '未领取',
      senderId: 1,
      senderName: 'admin',
      sendTime: null,
      receiverId: null,
      receiverName: null,
      verifyTime: null,
      validTime: 1_746_124_800_000,
      description: '大额满减券',
      stationIds: '2,3',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_247_200_000,
      updateTime: 1_743_247_200_000,
    },
    {
      id: 6,
      name: '充电8.5折券',
      type: '1',
      typeName: '折扣',
      amount: 0.85,
      useCondition: '充电消费满30元可用',
      status: '1',
      statusName: '已领取',
      senderId: 1,
      senderName: 'admin',
      sendTime: 1_743_333_600_000,
      receiverId: 1004,
      receiverName: '赵六',
      verifyTime: null,
      validTime: 1_748_716_800_000,
      description: 'VIP专享折扣券',
      stationIds: '1,3,4',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_247_200_000,
      updateTime: 1_743_333_600_000,
    },
    {
      id: 7,
      name: '免费充电2小时券',
      type: '2',
      typeName: '时长',
      amount: 2,
      useCondition: '充电时长满2小时可用',
      status: '0',
      statusName: '未领取',
      senderId: 1,
      senderName: 'admin',
      sendTime: null,
      receiverId: null,
      receiverName: null,
      verifyTime: null,
      validTime: 1_746_124_800_000,
      description: '老用户回馈时长券',
      stationIds: '1,2',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_247_200_000,
      updateTime: 1_743_247_200_000,
    },
    {
      id: 8,
      name: '立减5元券',
      type: '3',
      typeName: '立减',
      amount: 5,
      useCondition: '充电消费满10元可用',
      status: '2',
      statusName: '已使用',
      senderId: 1,
      senderName: 'admin',
      sendTime: 1_743_333_600_000,
      receiverId: 1005,
      receiverName: '孙七',
      verifyTime: 1_743_416_400_000,
      validTime: 1_746_124_800_000,
      description: '新用户专享立减券',
      stationIds: '1,2,3',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_247_200_000,
      updateTime: 1_743_416_400_000,
    },
  ];

  // 使用formatDate格式化时间戳字段
  return rawData.map((item) => ({
    ...item,
    createTimeStr: formatDate(item.createTime),
    updateTimeStr: formatDate(item.updateTime),
    sendTimeStr: formatDate(item.sendTime),
    verifyTimeStr: formatDate(item.verifyTime),
    validTimeStr: formatDate(item.validTime),
  }));
};

/** 优惠券管理搜索表单配置 - 覆盖所有表格展示字段 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '券名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入券名称',
        clearable: true,
      },
    },
    {
      fieldName: 'type',
      label: '券类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择券类型',
        options: getDictOptions(DICT_TYPE.COUPON_MGMT_TYPE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'amount',
      label: '面额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入面额',
        min: 0,
        precision: 2,
        clearable: true,
      },
    },
    {
      fieldName: 'useCondition',
      label: '使用条件',
      component: 'Input',
      componentProps: {
        placeholder: '请输入使用条件',
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '券状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择券状态',
        options: getDictOptions(DICT_TYPE.COUPON_MGMT_STATUS, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        type: 'datetimerange',
        valueFormat: 'x',
        clearable: true,
      },
    },
    {
      fieldName: 'senderName',
      label: '发放人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发放人',
        clearable: true,
      },
    },
    {
      fieldName: 'sendTime',
      label: '发放时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择发放时间',
        type: 'datetimerange',
        valueFormat: 'x',
        clearable: true,
      },
    },
    {
      fieldName: 'receiverName',
      label: '领取人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入领取人',
        clearable: true,
      },
    },
    {
      fieldName: 'verifyTime',
      label: '核销时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择核销时间',
        type: 'datetimerange',
        valueFormat: 'x',
        clearable: true,
      },
    },
    {
      fieldName: 'validTime',
      label: '有效期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择有效期',
        type: 'datetimerange',
        valueFormat: 'x',
        clearable: true,
      },
    },
  ];
}

/** 优惠券管理表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '券名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'type',
      title: '券类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'type' },
    },
    {
      field: 'amount',
      title: '面额',
      minWidth: 100,
      sortable: true,
      formatter: ({ row }) => {
        if (row.type === '1') {
          // 折扣类型显示百分比
          return `${(row.amount * 10).toFixed(1)}折`;
        } else if (row.type === '2') {
          // 时长类型
          return `${row.amount}小时`;
        }
        return `¥${row.amount}`;
      },
    },
    {
      field: 'useCondition',
      title: '使用条件',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'status',
      title: '券状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ row }) => row.createTimeStr || '-',
    },
    {
      field: 'senderName',
      title: '发放人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'senderName' },
    },
    {
      field: 'sendTime',
      title: '发放时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ row }) => row.sendTimeStr || '-',
    },
    {
      field: 'receiverName',
      title: '领取人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'receiverName' },
    },
    {
      field: 'verifyTime',
      title: '核销时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ row }) => row.verifyTimeStr || '-',
    },
    {
      field: 'validTime',
      title: '有效期',
      minWidth: 180,
      sortable: true,
      formatter: ({ row }) => row.validTimeStr || '-',
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 优惠券管理表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '券名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入券名称',
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '券类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择券类型',
        options: [
          { label: '满减', value: '0' },
          { label: '折扣', value: '1' },
          { label: '时长', value: '2' },
          { label: '立减', value: '3' },
        ],
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'amount',
      label: '面额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入面额',
        min: 0,
        precision: 2,
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'useCondition',
      label: '使用条件',
      component: 'Input',
      componentProps: {
        placeholder: '请输入使用条件',
        disabled: true,
      },
    },
    {
      fieldName: 'validTime',
      label: '有效期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择有效期',
        valueFormat: 'x',
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'description',
      label: '券描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入券描述',
      },
    },
    {
      fieldName: 'stationIds',
      label: '适用场站',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用场站ID，逗号分隔',
      },
    },
  ];
}

export const textObj = {
  editText: '编辑优惠券',
  addText: '新增优惠券',
  excelName: '优惠券列表',
  excelAllName: '优惠券数据.xlsx',
  total: ' 总计: 优惠券数量8;已发放:4;未领取:3;已使用:2;已过期:1',
};

/** 详情抽屉字段配置 - 使用与表格相同的字典颜色逻辑 */
export const detailFields = [
  { key: 'id', label: '优惠券ID' },
  { key: 'name', label: '券名称' },
  {
    key: 'type',
    label: '券类型',
    type: 'tag',
    formatter: (value) => getCouponTypeLabel(value),
    tagType: (value) => getCouponTypeTagType(value),
  },
  {
    key: 'amount',
    label: '面额',
    formatter: (value, row) => {
      if (!row) return value;
      if (row.type === '1') {
        return `${(value * 10).toFixed(1)}折`;
      } else if (row.type === '2') {
        return `${value}小时`;
      }
      return `¥${value}`;
    },
  },
  { key: 'useCondition', label: '使用条件' },
  {
    key: 'status',
    label: '券状态',
    type: 'tag',
    formatter: (value) => getCouponStatusLabel(value),
    tagType: (value) => getCouponStatusTagType(value),
  },
  { key: 'senderName', label: '发放人' },
  { key: 'sendTimeStr', label: '发放时间' },
  { key: 'receiverName', label: '领取人' },
  { key: 'verifyTimeStr', label: '核销时间' },
  { key: 'validTimeStr', label: '有效期' },
  { key: 'description', label: '券描述' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'updateTimeStr', label: '更新时间' },
];
