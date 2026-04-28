/** 意见建议表单配置（搜索） */
export function useFormSchema() {
  return [
    { fieldName: 'userId', label: '用户ID', component: 'Input', componentProps: { placeholder: '请输入用户ID' }, isSearch: true },
    { fieldName: 'status', label: '处理状态', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '待处理', value: '待处理' }, { label: '处理中', value: '处理中' }, { label: '已完成', value: '已完成' }] }, isSearch: true },
    { fieldName: 'submitTime', label: '提交时间', component: 'DatePicker', componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD HH:mm:ss' }, isSearch: true },
  ];
}

/** 意见建议表格列配置（带钻取交互） */
export function useGridColumns({ getUserName }) {
  return [
    { field: 'id', title: '意见ID', minWidth: 100, sortable: true, slots: { default: 'id' } },
    { field: 'userId', title: '用户', minWidth: 120, sortable: true, slots: { default: 'user_name' }, formatter: ({ userId }) => getUserName(userId) },
    { field: 'content', title: '意见内容', minWidth: 250, sortable: true, slots: { default: 'content' } },
    { field: 'submitTime', title: '提交时间', minWidth: 160, sortable: true },
    { field: 'status', title: '意见状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'handleUserId', title: '处理人', minWidth: 120, slots: { default: 'handle_user_name' }, formatter: ({ handleUserId }) => getUserName(handleUserId) },
    { field: 'handleTime', title: '处理时间', minWidth: 160, sortable: true },
    { field: 'progress', title: '处理进度', minWidth: 150, slots: { default: 'progress' } },
    { field: 'feedbackContent', title: '反馈内容', minWidth: 200, slots: { default: 'feedback_content' } }, // 添加插槽
    { title: '操作', width: 220, fixed: 'right', slots: { default: 'actions' } },
  ];
}
