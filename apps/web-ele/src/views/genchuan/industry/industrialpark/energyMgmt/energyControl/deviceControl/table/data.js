// ==================== data.js ====================
export function useFormSchema() {
  return [
    { fieldName: 'deviceName', label: '设备名称', component: 'Input', componentProps: { placeholder: '请输入设备名称' }, isSearch: true },
    { fieldName: 'deviceType', label: '设备类型', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '空调', value: '空调' }, { label: '照明', value: '照明' }, { label: '水泵', value: '水泵' }] }, isSearch: true },
    { fieldName: 'controlStatus', label: '管控状态', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '管控中', value: '管控中' }, { label: '未管控', value: '未管控' }] }, isSearch: true },
  ];
}

export function useGridColumns({ getUserName, showDeviceDetail, showStrategyDetail, showUserDetail, filterByType, filterByStatus }) {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '设备ID', minWidth: 80, sortable: true, slots: { default: 'id' } },
    { field: 'deviceName', title: '设备名称', minWidth: 180, sortable: true, slots: { default: 'device_name' } },
    { field: 'deviceType', title: '设备类型', minWidth: 100, sortable: true, slots: { default: 'device_type' } },
    { field: 'strategyName', title: '关联策略', minWidth: 150, sortable: true, slots: { default: 'strategy_name' } },
    { field: 'controlRule', title: '管控规则', minWidth: 180, sortable: true },
    { field: 'controlStatus', title: '管控状态', minWidth: 100, sortable: true, slots: { default: 'control_status' } },
    { field: 'beforeEnergy', title: '管控前能耗(kWh)', minWidth: 140, sortable: true },
    { field: 'afterEnergy', title: '管控后能耗(kWh)', minWidth: 140, sortable: true },
    { field: 'downEnergy', title: '能耗下降值(kWh)', minWidth: 140, sortable: true },
    { field: 'handleUser', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'handle_user' } },
    { title: '操作', width: 280, fixed: 'right', slots: { default: 'actions' } },
  ];
}
