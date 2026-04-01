import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';

/** 订单告警表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'alarmCode',
      label: '告警编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入告警编号',
      },
      rules: 'required',
    },
    {
      fieldName: 'orderCode',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
      },
      rules: 'required',
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
      fieldName: 'pileCode',
      label: '充电桩编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入充电桩编号',
      },
    },
    {
      fieldName: 'abnormalType',
      label: '异常类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择异常类型',
        options: getDictOptions(DICT_TYPE.ORDER_ALARM_ABNORMAL_TYPE, 'string'),
      },
    },
    {
      fieldName: 'alarmStatus',
      label: '告警状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择告警状态',
        options: getDictOptions(DICT_TYPE.ORDER_ALARM_ALARM_STATUS, 'string'),
      },
    },
    {
      fieldName: 'verifyResult',
      label: '核实结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择核实结果',
        options: getDictOptions(DICT_TYPE.ORDER_ALARM_VERIFY_RESULT, 'string'),
      },
    },
    {
      fieldName: 'handleMeasure',
      label: '处理措施',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处理措施',
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
  ];
}

/** 订单告警搜索表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'alarmCode',
      label: '告警编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入告警编号',
      },
    },
    {
      fieldName: 'orderCode',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
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
      fieldName: 'pileCode',
      label: '充电桩编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入充电桩编号',
      },
    },
    {
      fieldName: 'abnormalType',
      label: '异常类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择异常类型',
        options: getDictOptions(DICT_TYPE.ORDER_ALARM_ABNORMAL_TYPE, 'string'),
      },
    },
    {
      fieldName: 'alarmStatus',
      label: '告警状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择告警状态',
        options: getDictOptions(DICT_TYPE.ORDER_ALARM_ALARM_STATUS, 'string'),
      },
    },
    {
      fieldName: 'alarmTime',
      label: '告警时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择告警时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetimerange',
      },
    },
  ];
}

/** 订单告警表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'alarmCode',
      title: '告警编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'alarmCode' },
    },
    {
      field: 'orderCode',
      title: '订单编号',
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
      field: 'abnormalType',
      title: '异常类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'abnormalType' },
    },
    {
      field: 'alarmTime',
      title: '告警时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'alarmTime' },
    },
    {
      field: 'pileName',
      title: '关联充电桩',
      minWidth: 180,
      sortable: true,
      slots: { default: 'pileName' },
    },
    {
      field: 'alarmStatus',
      title: '告警状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'alarmStatus' },
    },
    {
      field: 'verifyResult',
      title: '核实结果',
      minWidth: 100,
      sortable: true,
      slots: { default: 'verifyResult' },
    },
    {
      field: 'handleMeasure',
      title: '处理措施',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'handleTime',
      title: '处理时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'handleTime' },
    },
    {
      field: 'creatorName',
      title: '操作人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'creatorName' },
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 获取异常类型Tag类型 - 使用封装的字典颜色工具 */
export const getAbnormalTypeTagType = (abnormalType) => {
  const dict = getDictObj(DICT_TYPE.ORDER_ALARM_ABNORMAL_TYPE, String(abnormalType));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取告警状态Tag类型 - 使用封装的字典颜色工具 */
export const getAlarmStatusTagType = (alarmStatus) => {
  const dict = getDictObj(DICT_TYPE.ORDER_ALARM_ALARM_STATUS, String(alarmStatus));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取核实结果Tag类型 - 使用封装的字典颜色工具 */
export const getVerifyResultTagType = (verifyResult) => {
  const dict = getDictObj(DICT_TYPE.ORDER_ALARM_VERIFY_RESULT, String(verifyResult));
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
  editText: '编辑订单告警',
  addText: '新增订单告警',
  excelName: '订单告警列表',
  excelAllName: '订单告警数据.xlsx',
  total: ' 总计: 订单告警数量0',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'alarmCode', label: '告警编号' },
  { key: 'orderCode', label: '订单编号' },
  { key: 'userName', label: '用户名称' },
  { key: 'plateNo', label: '车牌号' },
  {
    key: 'abnormalType',
    label: '异常类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.ORDER_ALARM_ABNORMAL_TYPE, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => getAbnormalTypeTagType(value),
  },
  { key: 'alarmTime', label: '告警时间' },
  { key: 'pileName', label: '关联充电桩' },
  {
    key: 'alarmStatus',
    label: '告警状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.ORDER_ALARM_ALARM_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => getAlarmStatusTagType(value),
  },
  {
    key: 'verifyResult',
    label: '核实结果',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.ORDER_ALARM_VERIFY_RESULT, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => getVerifyResultTagType(value),
  },
  { key: 'handleMeasure', label: '处理措施' },
  { key: 'remark', label: '备注' },
  { key: 'handleTime', label: '处理时间' },
  { key: 'creatorName', label: '操作人' },
];
