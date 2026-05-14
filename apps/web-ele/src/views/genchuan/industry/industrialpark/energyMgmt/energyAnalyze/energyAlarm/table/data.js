// ==================== data.js ====================
export function useFormSchema() {
  return [
    { fieldName: 'alarmName', label: '预警名称', component: 'Input', componentProps: { placeholder: '请输入预警名称' }, isSearch: true },
    { fieldName: 'alarmType', label: '预警类型', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '过载', value: '过载' }, { label: '超阈值', value: '超阈值' }] }, isSearch: true },
    { fieldName: 'alarmStatus', label: '预警状态', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '正常监测', value: '正常监测' }, { label: '异常预警', value: '异常预警' }] }, isSearch: true },
  ];
}

export function useGridColumns({ getUserName, showAlarmDetail, showAreaDetail, showHandleResultDetail, showUserDetail }) {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '预警ID', minWidth: 80, sortable: true, slots: { default: 'id' } },
    { field: 'alarmName', title: '预警名称', minWidth: 180, sortable: true, slots: { default: 'alarm_name' } },
    { field: 'alarmType', title: '预警类型', minWidth: 100, sortable: true, slots: { default: 'alarm_type' } },
    { field: 'areaName', title: '关联区域', minWidth: 150, sortable: true, slots: { default: 'area_name' } },
    { field: 'alarmThreshold', title: '预警阈值(kWh)', minWidth: 130, sortable: true },
    { field: 'alarmStatus', title: '预警状态', minWidth: 100, sortable: true, slots: { default: 'alarm_status' } },
    { field: 'triggerTime', title: '触发时间', minWidth: 160, sortable: true, formatter: ({ triggerTime }) => triggerTime || '-' },
    { field: 'handleResult', title: '处置结果', minWidth: 140, sortable: true, slots: { default: 'handle_result' } },
    { field: 'saveEnergy', title: '能耗节约量(kWh)', minWidth: 140, sortable: true },
    { field: 'handleUser', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'handle_user' } },
    { title: '操作', width: 150, fixed: 'right', slots: { default: 'actions' } },
  ];
}
