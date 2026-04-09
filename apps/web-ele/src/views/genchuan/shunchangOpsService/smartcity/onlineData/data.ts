import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

/** 列表的搜索表单 - 设备列表接口只支持type参数，且固定为YW01，所以不需要搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  // 根据接口文档，/monitor_list 只支持 page、limit、type 参数
  // type 固定为 YW01，page 和 limit 由表格组件自动处理
  // 因此不需要额外的搜索字段
  return [];
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
      slots: { default: 'status' },
    },
    {
      field: 'enable',
      title: '启用状态',
      minWidth: 100,
      align: 'center',
      slots: { default: 'enable' },
    },
    {
      field: 'warmStatus',
      title: '告警状态',
      minWidth: 100,
      align: 'center',
      slots: { default: 'warmStatus' },
    },
    {
      field: 'onlineStatus',
      title: '在线状态',
      minWidth: 100,
      align: 'center',
      slots: { default: 'onlineStatus' },
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
      slots: { default: 'voltageWarm' },
    },
    {
      field: 'waterHeight',
      title: '液位高度',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue === undefined ? '-' : `${cellValue} m`;
      },
    },
    {
      field: 'waterSpeed',
      title: '流速',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue === undefined ? '-' : `${cellValue} m/s`;
      },
    },
    {
      field: 'currentFlow',
      title: '当前流量',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue === undefined ? '-' : `${cellValue} m³/s`;
      },
    },
    {
      field: 'totalFlow',
      title: '总流量',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue === undefined ? '-' : `${cellValue} m³`;
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
        return cellValue === undefined ? '-' : `${cellValue} m`;
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
    // {
    //   field: 'address',
    //   title: '地址',
    //   minWidth: 200,
    // },
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
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 设备数据页面的搜索表单 - 根据接口文档支持 sn、start、end 参数 */
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
      fieldName: 'timeRange',
      label: '时间范围',
      component: 'RangePicker',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        clearable: true,
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        format: 'YYYY-MM-DD HH:mm:ss',
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
        return cellValue === undefined ? '-' : `${cellValue} m³/s`;
      },
    },
    {
      field: 'totalFlow',
      title: '总流量',
      minWidth: 120,
      formatter: ({ cellValue }) => {
        return cellValue === undefined ? '-' : `${cellValue} m³`;
      },
    },
    {
      field: 'waterHeight',
      title: '液位高度',
      minWidth: 120,
      formatter: ({ cellValue }) => {
        return cellValue === undefined ? '-' : `${cellValue} m`;
      },
    },
    {
      field: 'waterSpeed',
      title: '流速',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue === undefined ? '-' : `${cellValue} m/s`;
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
