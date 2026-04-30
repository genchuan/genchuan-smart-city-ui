/** 预约信息表单配置（搜索） */
export function useFormSchema() {
  return [
    { fieldName: 'userId', label: '用户ID', component: 'Input', componentProps: { placeholder: '请输入用户ID' }, isSearch: true },
    { fieldName: 'stationId', label: '场站ID', component: 'Input', componentProps: { placeholder: '请输入场站ID' }, isSearch: true },
    { fieldName: 'spaceId', label: '车位ID', component: 'Input', componentProps: { placeholder: '请输入车位ID' }, isSearch: true },
    { fieldName: 'reserveType', label: '预约类型', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '停车预约', value: '停车预约' }, { label: '充电预约', value: '充电预约' }] }, isSearch: true },
    { fieldName: 'status', label: '预约状态', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '待审核', value: '待审核' }, { label: '已生效', value: '已生效' }, { label: '已完成', value: '已完成' }, { label: '已取消', value: '已取消' }] }, isSearch: true },
    { fieldName: 'reserveTime', label: '预约时间', component: 'DatePicker', componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD HH:mm:ss', defaultTime: [new Date(2000, 0, 1, 0, 0, 0), new Date(2000, 0, 1, 23, 59, 59)] }, isSearch: true },
  ];
}

/** 预约信息表格列配置（带钻取交互） */
export function useGridColumns({ getUserName, getStationName, getSpaceName }) {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '预约ID', minWidth: 100, sortable: true, slots: { default: 'id' } },
    { field: 'userId', title: '用户', minWidth: 120, sortable: true, slots: { default: 'user_name' }, formatter: ({ userId }) => getUserName(userId) },
    { field: 'stationId', title: '场站', minWidth: 150, slots: { default: 'station_name' }, formatter: ({ stationId }) => getStationName(stationId) },
    { field: 'spaceId', title: '车位', minWidth: 120, slots: { default: 'space_name' }, formatter: ({ spaceId }) => getSpaceName(spaceId) },
    { field: 'reserveTime', title: '预约时间', minWidth: 160, sortable: true },
    { field: 'reserveType', title: '预约类型', minWidth: 100, sortable: true },
    { field: 'status', title: '预约状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'auditUserId', title: '审核人', minWidth: 100, slots: { default: 'audit_user_name' }, formatter: ({ auditUserId }) => getUserName(auditUserId) },
    { field: 'auditTime', title: '审核时间', minWidth: 160, sortable: true },
    { field: 'finishTime', title: '完成时间', minWidth: 160, sortable: true },
    { field: 'score', title: '评价得分', minWidth: 100, sortable: true, slots: { default: 'score' } },
    { title: '操作', width: 200, fixed: 'right', slots: { default: 'actions' } },
  ];
}
