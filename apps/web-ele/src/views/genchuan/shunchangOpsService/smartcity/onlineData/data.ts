import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { OnlineDataApi } from '#/api/genchuan/shunchangOpsService/smartcity/onlineData';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '设备名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备名称',
        clearable: true,
      },
    },
    {
      fieldName: 'sn',
      label: '设备SN码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备SN码',
        clearable: true,
      },
    },
    {
      fieldName: 'type',
      label: '设备类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择设备类型',
        clearable: true,
        options: [
          { label: '液位计', value: 'YW01' },
        ],
      },
    },
    {
      fieldName: 'status',
      label: '设备状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择设备状态',
        clearable: true,
        options: getDictOptions(DICT_TYPE.SC_OP_SERVICE_DEVICE_STATUS, 'number'),
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
      title: '设备编号',
      minWidth: 100,
    },
    {
      field: 'name',
      title: '设备名称',
      minWidth: 200,
    },
    {
      field: 'sn',
      title: '设备SN码',
      minWidth: 150,
    },
    {
      field: 'typeName',
      title: '类型名称',
      minWidth: 120,
    },
    {
      field: 'type',
      title: '设备类型',
      minWidth: 100,
    },
    {
      field: 'status',
      title: '设备状态',
      minWidth: 100,
      align: 'center',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.SC_OP_SERVICE_DEVICE_STATUS },
      },
    },
    {
      field: 'enable',
      title: '启用状态',
      minWidth: 100,
      align: 'center',
      formatter: ({ cellValue }) => {
        return cellValue === 1 ? '启用' : '禁用';
      },
    },
    {
      field: 'warmStatus',
      title: '告警状态',
      minWidth: 100,
      align: 'center',
      formatter: ({ cellValue }) => {
        return cellValue === 1 ? '告警' : '正常';
      },
    },
    {
      field: 'onlineStatus',
      title: '在线状态',
      minWidth: 100,
      align: 'center',
      formatter: ({ cellValue }) => {
        return cellValue === 1 ? '在线' : '离线';
      },
    },
    {
      field: 'lastOnline',
      title: '最后在线时间',
      minWidth: 180,
    },
    {
      field: 'rssi',
      title: '信号强度',
      minWidth: 100,
    },
    {
      field: 'voltage',
      title: '电量',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue ? `${cellValue} mV` : '-';
      },
    },
    {
      field: 'voltageWarm',
      title: '电量告警',
      minWidth: 100,
      align: 'center',
      formatter: ({ cellValue }) => {
        return cellValue === 1 ? '告警' : '正常';
      },
    },
    {
      field: 'waterHeight',
      title: '液位高度',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue !== undefined ? `${cellValue} m` : '-';
      },
    },
    {
      field: 'waterSpeed',
      title: '流速',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue !== undefined ? `${cellValue} m/s` : '-';
      },
    },
    {
      field: 'currentFlow',
      title: '当前流量',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue !== undefined ? `${cellValue} m³/s` : '-';
      },
    },
    {
      field: 'totalFlow',
      title: '总流量',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue !== undefined ? `${cellValue} m³` : '-';
      },
    },
    {
      field: 'lastVal',
      title: '上次数值',
      minWidth: 100,
    },
    {
      field: 'holeDepth',
      title: '井深',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue !== undefined ? `${cellValue} m` : '-';
      },
    },
    {
      field: 'period',
      title: '采集周期',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue ? `${cellValue} 秒` : '-';
      },
    },
    {
      field: 'serialNum',
      title: '序列号',
      minWidth: 150,
    },
    {
      field: 'address',
      title: '地址',
      minWidth: 200,
    },
    {
      field: 'longitude',
      title: '经度',
      minWidth: 120,
    },
    {
      field: 'latitude',
      title: '纬度',
      minWidth: 120,
    },
    {
      field: 'versionHardware',
      title: '硬件版本',
      minWidth: 100,
    },
    {
      field: 'versionSoftware',
      title: '软件版本',
      minWidth: 100,
    },
    {
      field: 'demoMode',
      title: '演示模式',
      minWidth: 100,
      align: 'center',
      formatter: ({ cellValue }) => {
        return cellValue === 1 ? '是' : '否';
      },
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 设备数据页面的搜索表单 */
export function useDeviceDataFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'sn',
      label: '设备SN码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备SN码',
        clearable: true,
      },
    },
    {
      fieldName: 'name',
      label: '设备名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备名称',
        clearable: true,
      },
    },
    {
      fieldName: 'timeRange',
      label: '时间范围',
      component: 'RangePicker',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        clearable: true,
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

/** 设备数据页面的列表字段 */
export function useDeviceDataColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '设备名称',
      minWidth: 150,
    },
    {
      field: 'sn',
      title: '设备SN码',
      minWidth: 150,
    },
    {
      field: 'type',
      title: '设备类型',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        const typeMap: Record<string, string> = {
          YW01: '液位计',
        };
        return typeMap[cellValue] || cellValue;
      },
    },
    {
      field: 'rssi',
      title: '信号强度',
      minWidth: 100,
    },
    {
      field: 'voltage',
      title: '电量',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue ? `${cellValue} mV` : '-';
      },
    },
    {
      field: 'currentFlow',
      title: '当前流量',
      minWidth: 120,
      formatter: ({ cellValue }) => {
        return cellValue !== undefined ? `${cellValue} m³/s` : '-';
      },
    },
    {
      field: 'totalFlow',
      title: '总流量',
      minWidth: 120,
      formatter: ({ cellValue }) => {
        return cellValue !== undefined ? `${cellValue} m³` : '-';
      },
    },
    {
      field: 'waterHeight',
      title: '液位高度',
      minWidth: 120,
      formatter: ({ cellValue }) => {
        return cellValue !== undefined ? `${cellValue} m` : '-';
      },
    },
    {
      field: 'waterSpeed',
      title: '流速',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue !== undefined ? `${cellValue} m/s` : '-';
      },
    },
    {
      field: 'collectTime',
      title: '采集时间',
      minWidth: 180,
    },
    {
      field: 'uploadTime',
      title: '入库时间',
      minWidth: 180,
    },
  ];
}
