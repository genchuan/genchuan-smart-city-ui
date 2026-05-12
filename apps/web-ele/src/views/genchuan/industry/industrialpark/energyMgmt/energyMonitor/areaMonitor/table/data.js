// data.js - 搜索表单与表格列配置
/** 分区能耗监测搜索表单配置 */
export function useFormSchema() {
  return [
    { fieldName: 'areaName', label: '区域名称', component: 'Input', componentProps: { placeholder: '请输入区域名称' }, isSearch: true },
    { fieldName: 'energyStatus', label: '能耗状态', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '正常能耗', value: '正常能耗' }, { label: '能耗异常', value: '能耗异常' }] }, isSearch: true },
  ];
}

/** 分区能耗监测表格列配置 */
export function useGridColumns({ getUserName, showAreaDetail, showDeviceList, showUserDetail }) {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '区域ID', minWidth: 80, sortable: true, slots: { default: 'id' } },
    { field: 'areaName', title: '区域名称', minWidth: 150, sortable: true, slots: { default: 'area_name' }, formatter: ({ areaName }) => areaName },
    { field: 'areaSize', title: '区域面积(㎡)', minWidth: 120, sortable: true },
    { field: 'totalEnergy', title: '能耗总量(kWh)', minWidth: 130, sortable: true },
    { field: 'unitEnergy', title: '单位面积能耗(kWh/㎡)', minWidth: 150, sortable: true },
    { field: 'energyStatus', title: '能耗状态', minWidth: 110, sortable: true, slots: { default: 'energy_status' } },
    { field: 'deviceCount', title: '关联设备数', minWidth: 110, sortable: true, slots: { default: 'device_count' } },
    { field: 'yoyChange', title: '同比变化(%)', minWidth: 110, sortable: true, slots: { default: 'yoy_change' } },
    { field: 'momChange', title: '环比变化(%)', minWidth: 110, sortable: true, slots: { default: 'mom_change' } },
    { field: 'handleUser', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'handle_user' }, formatter: ({ handleUser }) => getUserName(handleUser) },
    { title: '操作', width: 180, fixed: 'right', slots: { default: 'actions' } },
  ];
}
