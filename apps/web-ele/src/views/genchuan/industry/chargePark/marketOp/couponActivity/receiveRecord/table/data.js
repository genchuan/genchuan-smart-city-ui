import { ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getCouponSimpleList } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/couponMgmt';
import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

/** 获取记录状态Tag类型 - 使用封装的字典颜色工具 */
export const getReceiveRecordStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.RECEIVE_RECORD_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取同步状态Tag类型 - 使用封装的字典颜色工具 */
export const getReceiveRecordSyncStatusTagType = (syncStatus) => {
  const dict = getDictObj(
    DICT_TYPE.RECEIVE_RECORD_SYNC_STATUS,
    String(syncStatus),
  );
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取记录状态标签 */
export const getReceiveRecordStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.RECEIVE_RECORD_STATUS, String(status));
  return dict ? dict.label : status;
};

/** 获取同步状态标签 */
export const getReceiveRecordSyncStatusLabel = (syncStatus) => {
  const dict = getDictObj(
    DICT_TYPE.RECEIVE_RECORD_SYNC_STATUS,
    String(syncStatus),
  );
  return dict ? dict.label : syncStatus;
};

/** 优惠券搜索选项 - 静态数据作为默认值 */
export const couponSearchOptions = [
  { label: '5元充电券', value: 1 },
  { label: '10元充电券', value: 2 },
  { label: '20元充电券', value: 3 },
  { label: '30元充电券', value: 4 },
  { label: '50元充电券', value: 5 },
  { label: '充电8.5折券', value: 6 },
  { label: '充电7.5折券', value: 7 },
  { label: '充电9折券', value: 8 },
];

/** 动态优惠券搜索选项（从接口获取） */
export const dynamicCouponSearchOptions = ref([]);

/** 获取当前可用的优惠券搜索选项（优先使用动态数据） */
export function getCurrentCouponSearchOptions() {
  return dynamicCouponSearchOptions.value.length > 0
    ? dynamicCouponSearchOptions.value
    : couponSearchOptions;
}

/** 获取优惠券精简列表用于搜索 */
export async function fetchCouponSearchOptions() {
  try {
    const res = await getCouponSimpleList();
    if (res && Array.isArray(res)) {
      dynamicCouponSearchOptions.value = res.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return dynamicCouponSearchOptions.value;
    }
  } catch (error) {
    console.error('获取优惠券列表失败:', error);
  }
  return couponSearchOptions;
}

/** 领用记录表格初始数据 - 按接口文档格式生成，字典值与系统字典一致 */
export const dataList = () => {
  return [
    {
      id: 1,
      no: 'RC-20250401001',
      userId: 1001,
      userName: '张三',
      couponId: 1,
      couponName: '5元充电券',
      receiveTime: 1_743_472_800_000,
      status: '0',
      statusName: '正常记录',
      verifyTime: 1_743_589_200_000,
      checkResult: null,
      syncStatus: '1',
      syncStatusName: '已同步',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_472_800_000,
      updateTime: 1_743_589_200_000,
    },
    {
      id: 2,
      no: 'RC-20250401002',
      userId: 1002,
      userName: '李四',
      couponId: 2,
      couponName: '10元充电券',
      receiveTime: 1_743_476_400_000,
      status: '1',
      statusName: '异常记录',
      verifyTime: null,
      checkResult: '数据异常，需核查',
      syncStatus: '2',
      syncStatusName: '同步失败',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'admin',
      createTime: 1_743_476_400_000,
      updateTime: 1_743_562_800_000,
    },
    {
      id: 3,
      no: 'RC-20250401003',
      userId: 1003,
      userName: '王五',
      couponId: 3,
      couponName: '20元充电券',
      receiveTime: 1_743_480_000_000,
      status: '2',
      statusName: '已核查',
      verifyTime: 1_743_592_800_000,
      checkResult: '核查通过，数据正常',
      syncStatus: '1',
      syncStatusName: '已同步',
      archiveTime: 1_743_679_200_000,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'admin',
      createTime: 1_743_480_000_000,
      updateTime: 1_743_679_200_000,
    },
    {
      id: 4,
      no: 'RC-20250401004',
      userId: 1004,
      userName: '赵六',
      couponId: 1,
      couponName: '5元充电券',
      receiveTime: 1_743_483_600_000,
      status: '0',
      statusName: '正常记录',
      verifyTime: 1_743_596_400_000,
      checkResult: null,
      syncStatus: '1',
      syncStatusName: '已同步',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_483_600_000,
      updateTime: 1_743_596_400_000,
    },
    {
      id: 5,
      no: 'RC-20250401005',
      userId: 1005,
      userName: '孙七',
      couponId: 4,
      couponName: '30元充电券',
      receiveTime: 1_743_487_200_000,
      status: '0',
      statusName: '正常记录',
      verifyTime: 1_743_600_000_000,
      checkResult: null,
      syncStatus: '0',
      syncStatusName: '未同步',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_487_200_000,
      updateTime: 1_743_487_200_000,
    },
    {
      id: 6,
      no: 'RC-20250401006',
      userId: 1006,
      userName: '周八',
      couponId: 2,
      couponName: '10元充电券',
      receiveTime: 1_743_490_800_000,
      status: '1',
      statusName: '异常记录',
      verifyTime: null,
      checkResult: '用户重复领取',
      syncStatus: '2',
      syncStatusName: '同步失败',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'admin',
      createTime: 1_743_490_800_000,
      updateTime: 1_743_566_400_000,
    },
    {
      id: 7,
      no: 'RC-20250401007',
      userId: 1007,
      userName: '吴九',
      couponId: 5,
      couponName: '50元充电券',
      receiveTime: 1_743_494_400_000,
      status: '0',
      statusName: '正常记录',
      verifyTime: 1_743_603_600_000,
      checkResult: null,
      syncStatus: '1',
      syncStatusName: '已同步',
      archiveTime: null,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_743_494_400_000,
      updateTime: 1_743_603_600_000,
    },
    {
      id: 8,
      no: 'RC-20250401008',
      userId: 1008,
      userName: '郑十',
      couponId: 3,
      couponName: '20元充电券',
      receiveTime: 1_743_498_000_000,
      status: '2',
      statusName: '已核查',
      verifyTime: 1_743_607_200_000,
      checkResult: '核查通过',
      syncStatus: '1',
      syncStatusName: '已同步',
      archiveTime: 1_743_693_600_000,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'admin',
      createTime: 1_743_498_000_000,
      updateTime: 1_743_693_600_000,
    },
  ];
};

/** 领用记录表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'no',
      label: '记录编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入记录编号',
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
      fieldName: 'couponId',
      label: '优惠券ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入优惠券ID',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'receiveTime',
      label: '领用时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择领用时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        options: getDictOptions(DICT_TYPE.RECEIVE_RECORD_STATUS, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'syncStatus',
      label: '同步状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择同步状态',
        options: getDictOptions(DICT_TYPE.RECEIVE_RECORD_SYNC_STATUS, 'string'),
      },
      rules: 'required',
    },
  ];
}

/** 领用记录搜索表单配置 - 根据ReceiveRecordPageReqVO参数配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'no',
      label: '记录编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入记录编号',
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
      fieldName: 'couponId',
      label: '优惠券',
      component: 'Select',
      componentProps: {
        placeholder: '请选择优惠券',
        options: couponSearchOptions,
        clearable: true,
        filterable: true,
      },
    },
    {
      fieldName: 'receiveTime',
      label: '领用时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        options: getDictOptions(DICT_TYPE.RECEIVE_RECORD_STATUS, 'string'),
        clearable: true,
      },
    },
  ];
}

/** 领用记录表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'no',
      title: '记录编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'no' },
    },
    {
      field: 'userName',
      title: '用户名称',
      minWidth: 120,
      sortable: true,
      // slots: { default: 'userName' },
    },
    {
      field: 'couponName',
      title: '优惠券名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'couponName' },
    },
    {
      field: 'receiveTime',
      title: '领用时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'receiveTime' },
    },
    {
      field: 'statusName',
      title: '记录状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'statusName' },
    },
    {
      field: 'verifyTime',
      title: '核销时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'verifyTime' },
    },
    {
      field: 'checkResult',
      title: '核查结果',
      minWidth: 200,
      sortable: true,
      // slots: { default: 'checkResult' },
    },
    {
      field: 'syncStatusName',
      title: '同步状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'syncStatusName' },
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
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑领用记录',
  addText: '新增领用记录',
  excelName: '领用记录列表',
  excelAllName: '领用记录数据.xlsx',
  total: ' 总计: 领用记录数量8;正常记录:4;异常记录:2;已核查:2',
};

/** 详情抽屉字段配置 - 使用与表格相同的字典颜色逻辑 */
export const detailFields = [
  { key: 'no', label: '记录编号' },
  { key: 'userName', label: '用户名称' },
  { key: 'couponName', label: '优惠券名称' },
  {
    key: 'receiveTime',
    label: '领用时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '',
  },
  {
    key: 'status',
    label: '记录状态',
    type: 'tag',
    formatter: (value) => getReceiveRecordStatusLabel(value),
    tagType: (value) => getReceiveRecordStatusTagType(value),
  },
  {
    key: 'verifyTime',
    label: '核销时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-',
  },
  { key: 'checkResult', label: '核查结果', formatter: (value) => value || '-' },
  {
    key: 'syncStatus',
    label: '同步状态',
    type: 'tag',
    formatter: (value) => getReceiveRecordSyncStatusLabel(value),
    tagType: (value) => getReceiveRecordSyncStatusTagType(value),
  },
  {
    key: 'archiveTime',
    label: '归档时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-',
  },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  {
    key: 'createTime',
    label: '创建时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '',
  },
  {
    key: 'updateTime',
    label: '更新时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '',
  },
];
