// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'dormNum',
      label: '宿舍号',
      component: 'Input',
      componentProps: { placeholder: '请输入宿舍号' },
      labelWidth: '100',
    },
    {
      fieldName: 'repairType',
      label: '报修类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报修类型',
        clearable: true,
        options: [
          { label: '水电', value: '水电' },
          { label: '家具', value: '家具' },
          { label: '其他', value: '其他' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        clearable: true,
        options: [
          { label: '待派单', value: '待派单' },
          { label: '维修中', value: '维修中' },
          { label: '已维修', value: '已维修' },
        ],
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义
export function getColumns() {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'dormNum', title: '宿舍号', minWidth: 100, sortable: true, slots: { default: 'dormNum' } },
    { field: 'repairType', title: '报修类型', minWidth: 100, sortable: true, slots: { default: 'repairType' } },
    { field: 'applyTime', title: '申请时间', minWidth: 180, sortable: true, slots: { default: 'applyTime' } },
    { field: 'dispatchUser', title: '派单人', minWidth: 100, sortable: true, },
    { field: 'dispatchTime', title: '派单时间', minWidth: 180, sortable: true, slots: { default: 'dispatchTime' } },
    { field: 'repairUser', title: '维修人', minWidth: 100, sortable: true, },
    { field: 'feedbackContent', title: '维修反馈', minWidth: 150, sortable: true, },
    { field: 'feedbackTime', title: '反馈时间', minWidth: 180, sortable: true, slots: { default: 'feedbackTime' } },
    { field: 'checkUser', title: '验收人', minWidth: 100, sortable: true, },
    { field: 'checkTime', title: '验收时间', minWidth: 180, sortable: true, slots: { default: 'checkTime' } },
    { field: 'status', title: '状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'checkStatus', title: '验收状态', minWidth: 100, sortable: true, },
    { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 200,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 申请表单 schema（添加 status 字段）
export function useApplyFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'dormNum',
      label: '宿舍号',
      component: 'Input',
      componentProps: { placeholder: '请输入宿舍号' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'repairType',
      label: '报修类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报修类型',
        options: [
          { label: '水电', value: '水电' },
          { label: '家具', value: '家具' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'applyTime',
      label: '申请时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择申请时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'status',                     // 新增状态字段
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待派单', value: '待派单' },
          { label: '维修中', value: '维修中' },
          { label: '已维修', value: '已维修' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入备注', type: 'textarea', rows: 3 },
      labelWidth: '100',
    },
  ];
}

// 反馈表单 schema
export function useFeedbackFormSchema() {
  return [
    {
      fieldName: 'feedbackContent',
      label: '维修反馈',
      component: 'Input',
      componentProps: { placeholder: '请输入维修反馈内容', type: 'textarea', rows: 4 },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入备注', type: 'textarea', rows: 2 },
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  applyText: '申请报修',
  assignText: '派单',
  feedbackText: '维修反馈',
  editText: '编辑报修',
  excelName: '报修管理列表',
};
