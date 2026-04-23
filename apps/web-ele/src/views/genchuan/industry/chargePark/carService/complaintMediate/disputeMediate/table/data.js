/** 纠纷调解表单配置（搜索） */
export function useFormSchema() {
  return [
    { fieldName: 'userId', label: '用户ID', component: 'Input', componentProps: { placeholder: '请输入用户ID' }, isSearch: true },
    { fieldName: 'merchantId', label: '商户ID', component: 'Input', componentProps: { placeholder: '请输入商户ID' }, isSearch: true },
    { fieldName: 'status', label: '调解状态', component: 'Select', componentProps: { placeholder: '请选择', options: [
          { label: '待调解', value: '待调解' },
          { label: '调解中', value: '调解中' },
          { label: '已完成', value: '已完成' }
        ] }, isSearch: true },
    { fieldName: 'submitTime', label: '发起时间', component: 'DatePicker', componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD HH:mm:ss' }, isSearch: true },
  ];
}

/** 纠纷调解表格列配置（带钻取交互） */
export function useGridColumns({ getUserName, getMerchantName }) {
  return [
    { field: 'id', title: '调解ID', minWidth: 100, sortable: true, slots: { default: 'id' } },
    { field: 'userId', title: '用户', minWidth: 120, sortable: true, slots: { default: 'user_name' }, formatter: ({ userId }) => getUserName(userId) },
    { field: 'merchantId', title: '商户', minWidth: 120, slots: { default: 'merchant_name' }, formatter: ({ merchantId }) => getMerchantName(merchantId) },
    { field: 'content', title: '纠纷内容', minWidth: 250, sortable: true, slots: { default: 'content' } },
    { field: 'submitTime', title: '发起时间', minWidth: 160, sortable: true },
    { field: 'status', title: '调解状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'mediateUserId', title: '调解人', minWidth: 120, slots: { default: 'mediate_user_name' }, formatter: ({ mediateUserId }) => getUserName(mediateUserId) },
    { field: 'progress', title: '调解进度', minWidth: 200 },
    { field: 'confirmResult', title: '确认结果', minWidth: 200, slots: { default: 'confirmResult' } },
    { field: 'confirmTime', title: '确认时间', minWidth: 160, sortable: true },
    { title: '操作', width: 260, fixed: 'right', slots: { default: 'actions' } },
  ];
}
