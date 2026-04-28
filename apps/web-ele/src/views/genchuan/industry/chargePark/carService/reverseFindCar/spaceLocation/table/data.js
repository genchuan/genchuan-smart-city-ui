/** 车位定位表单配置（搜索） */
export function useFormSchema() {
  return [
    { fieldName: 'userId', label: '用户ID', component: 'Input', componentProps: { placeholder: '请输入用户ID' }, isSearch: true },
    { fieldName: 'plateNo', label: '车牌号码', component: 'Input', componentProps: { placeholder: '请输入车牌（支持模糊）' }, isSearch: true },
    { fieldName: 'locationResult', label: '定位结果', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '成功', value: '成功' }, { label: '失败', value: '失败' }] }, isSearch: true },
    { fieldName: 'queryTime', label: '查询时间', component: 'DatePicker', componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD HH:mm:ss' }, isSearch: true },
  ];
}

/** 车位定位表格列配置（带钻取交互） */
export function useGridColumns({ getUserName }) {
  return [
    { field: 'id', title: '定位ID', minWidth: 100, sortable: true, slots: { default: 'id' } },
    { field: 'userId', title: '用户', minWidth: 120, sortable: true, slots: { default: 'user_name' }, formatter: ({ userId }) => getUserName(userId) },
    { field: 'plateNo', title: '车牌号码', minWidth: 120, sortable: true, slots: { default: 'plate_no' } },
    { field: 'queryTime', title: '查询时间', minWidth: 160, sortable: true },
    { field: 'locationResult', title: '定位结果', minWidth: 100, sortable: true, slots: { default: 'location_result' } },
    { field: 'responseDuration', title: '响应时长', minWidth: 100, sortable: true, slots: { default: 'response_duration' } },
    { title: '操作', width: 150, fixed: 'right', slots: { default: 'actions' } },
  ];
}
