// data.js
// 路径: src/views/genchuan/industry/industrialPark/energyMgmt/energyControl/strategySet/table/data.js
export function useFormSchema() {
  return [
    { fieldName: 'strategyName', label: '策略名称', component: 'Input', componentProps: { placeholder: '请输入策略名称' }, isSearch: true },
    { fieldName: 'strategyType', label: '策略类型', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '照明', value: '照明' }, { label: '空调', value: '空调' }, { label: '设备', value: '设备' }] }, isSearch: true },
    { fieldName: 'strategyStatus', label: '策略状态', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '已启用', value: '已启用' }, { label: '未启用', value: '未启用' }] }, isSearch: true },
  ];
}

export function useGridColumns({ getUserName, showStrategyDetail, showDeviceDetail, showEvaluateDetail, showUserDetail, handleTypeFilter, handleStatusFilter }) {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '策略ID', minWidth: 80, sortable: true, slots: { default: 'id' } },
    { field: 'strategyName', title: '策略名称', minWidth: 180, sortable: true, slots: { default: 'strategy_name' } },
    { field: 'strategyType', title: '策略类型', minWidth: 100, sortable: true, slots: { default: 'strategy_type' } },
    { field: 'deviceName', title: '关联设备', minWidth: 150, sortable: true, slots: { default: 'device_name' } },
    { field: 'executeTime', title: '执行时间', minWidth: 160, sortable: true },
    { field: 'strategyStatus', title: '策略状态', minWidth: 100, sortable: true, slots: { default: 'strategy_status' } },
    { field: 'saveEnergy', title: '节能总量(kWh)', minWidth: 130, sortable: true },
    { field: 'saveRate', title: '节能率(%)', minWidth: 110, sortable: true },
    { field: 'evaluateResult', title: '评估结果', minWidth: 140, sortable: true, slots: { default: 'evaluate_result' } },
    { field: 'handleUser', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'handle_user' } },
    { title: '操作', width: 300, fixed: 'right', slots: { default: 'actions' } },
  ];
}
