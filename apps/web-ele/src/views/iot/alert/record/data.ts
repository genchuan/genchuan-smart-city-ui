import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { getSimpleAlertConfigList } from '#/api/iot/alert/config';
import { getSimpleDeviceList } from '#/api/iot/device/device';
import { getSimpleProductList } from '#/api/iot/product/product';

/** 获取Element Plus日期范围选择器的默认属性 */
export function getDateRangePickerDefaultProps() {
  return {
    type: 'datetimerange' as const,
    rangeSeparator: '至',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    format: 'YYYY-MM-DD HH:mm:ss',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    clearable: true,
  };
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'configId',
      label: '告警配置',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleAlertConfigList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择告警配置',
        clearable: true,
        filterable: true,
      },
    },
    {
      fieldName: 'configLevel',
      label: '告警级别',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.IOT_ALERT_LEVEL, 'number'),
        placeholder: '请选择告警级别',
        clearable: true,
      },
    },
    {
      fieldName: 'productId',
      label: '产品',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleProductList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择产品',
        clearable: true,
        filterable: true,
      },
    },
    {
      fieldName: 'deviceId',
      label: '设备',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDeviceList,
        labelField: 'deviceName',
        valueField: 'id',
        placeholder: '请选择设备',
        clearable: true,
        filterable: true,
      },
    },
    {
      fieldName: 'processStatus',
      label: '是否处理',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING),
        placeholder: '请选择是否处理',
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        ...getDateRangePickerDefaultProps(),
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '记录编号',
      minWidth: 80,
    },
    {
      field: 'configName',
      title: '告警名称',
      minWidth: 150,
    },
    {
      field: 'configLevel',
      title: '告警级别',
      minWidth: 100,
      slots: { default: 'configLevel' },
    },
    {
      field: 'productId',
      title: '产品名称',
      minWidth: 120,
      slots: { default: 'product' },
    },
    {
      field: 'deviceId',
      title: '设备名称',
      minWidth: 120,
      slots: { default: 'device' },
    },
    {
      field: 'deviceMessage',
      title: '触发的设备消息',
      minWidth: 150,
      slots: { default: 'deviceMessage' },
    },
    {
      field: 'processStatus',
      title: '是否处理',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.INFRA_BOOLEAN_STRING },
      },
    },
    {
      field: 'processRemark',
      title: '处理结果',
      minWidth: 150,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
