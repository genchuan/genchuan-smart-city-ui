/** 路径规划表单配置（搜索） */
export function useFormSchema() {
  return [
    { fieldName: 'userId', label: '用户ID', component: 'Input', componentProps: { placeholder: '请输入用户ID' }, isSearch: true },
    { fieldName: 'startLocation', label: '起点位置', component: 'Input', componentProps: { placeholder: '请输入起点（支持模糊）' }, isSearch: true },
    { fieldName: 'endLocation', label: '终点位置', component: 'Input', componentProps: { placeholder: '请输入终点（支持模糊）' }, isSearch: true },
    { fieldName: 'planTime', label: '规划时间', component: 'DatePicker', componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD HH:mm:ss' }, isSearch: true },
  ];
}

/** 路径规划表格列配置（带钻取交互） */
export function useGridColumns({ getUserName }) {
  return [
    { field: 'id', title: '规划ID', minWidth: 100, sortable: true, slots: { default: 'id' } },
    { field: 'userId', title: '用户', minWidth: 120, sortable: true, slots: { default: 'user_name' }, formatter: ({ userId }) => getUserName(userId) },
    { field: 'startLocationName', title: '起点', minWidth: 180, sortable: true, slots: { default: 'start_location' } },
    { field: 'endLocationName', title: '终点', minWidth: 180, sortable: true, slots: { default: 'end_location' } },
    { field: 'planTime', title: '规划时间', minWidth: 160, sortable: true },
    { field: 'pathLength', title: '路径长度', minWidth: 100, sortable: true, },
    { field: 'expectDuration', title: '预计时长', minWidth: 100, sortable: true,  },
    { title: '操作', width: 150, fixed: 'right', slots: { default: 'actions' } },
  ];
}
