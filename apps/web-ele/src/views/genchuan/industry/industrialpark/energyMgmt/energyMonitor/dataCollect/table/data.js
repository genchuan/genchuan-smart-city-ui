// data.js - 搜索表单 & 表格列配置
/** 能耗采集搜索表单配置 */
export function useFormSchema() {
  return [
    { fieldName: 'deviceName', label: '设备名称', component: 'Input', componentProps: { placeholder: '请输入设备名称' }, isSearch: true },
    { fieldName: 'deviceType', label: '设备类型', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '电表', value: '电表' }, { label: '水表', value: '水表' }, { label: '气表', value: '气表' }] }, isSearch: true },
    { fieldName: 'energyType', label: '能耗类型', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '电', value: '电' }, { label: '水', value: '水' }, { label: '气', value: '气' }, { label: '热', value: '热' }] }, isSearch: true },
    { fieldName: 'collectStatus', label: '采集状态', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '采集正常', value: '采集正常' }, { label: '采集异常', value: '采集异常' }] }, isSearch: true },
    { fieldName: 'collectTime', label: '采集时间', component: 'DatePicker', componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD HH:mm:ss', defaultTime: [new Date(2000, 0, 1, 0, 0, 0), new Date(2000, 0, 1, 23, 59, 59)] }, isSearch: true },
  ];
}

/** 能耗采集表格列配置（带钻取交互） */
export function useGridColumns({ getUserName }) {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'deviceName', title: '设备名称', minWidth: 140, slots: { default: 'device_name' } },
    { field: 'deviceType', title: '设备类型', minWidth: 100, sortable: true, slots: { default: 'device_type' } },
    { field: 'energyType', title: '能耗类型', minWidth: 100, sortable: true, slots: { default: 'energy_type' } },
    { field: 'collectTime', title: '采集时间', minWidth: 160, sortable: true },
    { field: 'collectStatus', title: '采集状态', minWidth: 100, sortable: true, slots: { default: 'collect_status' } },
    { field: 'energyValue', title: '能耗数值', minWidth: 120, sortable: true },
    { field: 'collectFreq', title: '采集频率(分钟)', minWidth: 120, sortable: true },
    { field: 'exceptionCount', title: '异常次数', minWidth: 100, sortable: true, slots: { default: 'exception_count' } },
    { field: 'handleUser', title: '操作人', minWidth: 100, slots: { default: 'handle_user' }, formatter: ({ handleUser }) => getUserName(handleUser) || handleUser },
    { title: '操作', width: 240, fixed: 'right', slots: { default: 'actions' } },
  ];
}
