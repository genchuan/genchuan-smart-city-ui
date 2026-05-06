/** 用户申诉表单配置（搜索） */
export function useFormSchema() {
  return [
    { fieldName: 'userId', label: '用户ID', component: 'Input', componentProps: { placeholder: '请输入用户ID' }, isSearch: true },
    { fieldName: 'orderId', label: '订单ID', component: 'Input', componentProps: { placeholder: '请输入订单ID' }, isSearch: true },
    { fieldName: 'status', label: '申诉状态', component: 'Select', componentProps: { placeholder: '请选择', options: [
          { label: '待审核', value: '待审核' },
          { label: '待处置', value: '待处置' },
          { label: '处置中', value: '处置中' },
          { label: '已完成', value: '已完成' },
          { label: '已关闭', value: '已关闭' }
        ] }, isSearch: true },
    { fieldName: 'submitTime', label: '提交时间', component: 'DatePicker', componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD HH:mm:ss' }, isSearch: true },
  ];
}

/** 用户申诉表格列配置（带钻取交互） */
export function useGridColumns({ getUserName }) {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { field: 'id', title: '申诉ID', minWidth: 100, sortable: true, slots: { default: 'id' } },
    { field: 'userId', title: '用户', minWidth: 120, sortable: true, slots: { default: 'user_name' }, formatter: ({ userId }) => getUserName(userId) },
    { field: 'orderId', title: '关联订单', minWidth: 120, },
    { field: 'content', title: '申诉内容', minWidth: 250, sortable: true, slots: { default: 'content' } },
    { field: 'submitTime', title: '提交时间', minWidth: 160, sortable: true },
    { field: 'status', title: '申诉状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'auditUserId', title: '审核人', minWidth: 120, slots: { default: 'audit_user_name' }, formatter: ({ auditUserId }) => getUserName(auditUserId) },
    { field: 'auditTime', title: '审核时间', minWidth: 160, sortable: true },
    { field: 'handleUserId', title: '处置人', minWidth: 120, slots: { default: 'handle_user_name' }, formatter: ({ handleUserId }) => getUserName(handleUserId) },
    { field: 'progress', title: '处置进度', minWidth: 150, slots: { default: 'progress' } },
    { field: 'feedbackContent', title: '反馈内容', minWidth: 200, slots: { default: 'feedbackContent' } },
    { field: 'feedbackTime', title: '反馈时间', minWidth: 160, sortable: true },
    { title: '操作', width: 220, fixed: 'right', slots: { default: 'actions' } },
  ];
}
