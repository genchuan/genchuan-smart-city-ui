// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'studentId',
      label: '学号',
      component: 'Input',
      componentProps: { placeholder: '请输入学号' },
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待确认', value: '待确认' },
          { label: '待办理', value: '待办理' },
          { label: '已离校', value: '已离校' },
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
    { field: 'studentId', title: '学号', minWidth: 100, sortable: true, slots: { default: 'studentId' } },
    { field: 'leaveTime', title: '离校时间', minWidth: 180, sortable: true, slots: { default: 'leaveTime' } },
    { field: 'leaveAddress', title: '离校去处', minWidth: 150, sortable: true, },
    { field: 'parentConfirmTime', title: '家长确认时间', minWidth: 180, sortable: true, slots: { default: 'parentConfirmTime' } },
    { field: 'handleUser', title: '办理人', minWidth: 100, sortable: true, },
    { field: 'handleTime', title: '办理时间', minWidth: 180, sortable: true, slots: { default: 'handleTime' } },
    { field: 'checkoutTime', title: '退宿时间', minWidth: 180, sortable: true, slots: { default: 'checkoutTime' } },
    { field: 'checkoutStatus', title: '退宿状态', minWidth: 100, sortable: true, },
    { field: 'finishRate', title: '办理完成率(%)', minWidth: 120, sortable: true, },
    { field: 'status', title: '状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 240,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 申请表单 schema（添加 status 字段）
export function useApplyFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'studentId',
      label: '学号',
      component: 'Input',
      componentProps: { placeholder: '请输入学号' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'leaveTime',
      label: '离校时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择离校时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'leaveAddress',
      label: '离校去处',
      component: 'Input',
      componentProps: { placeholder: '请输入离校去处' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待确认', value: '待确认' },
          { label: '待办理', value: '待办理' },
          { label: '已离校', value: '已离校' },
        ],
      },
      rules: 'required',
      defaultValue: '待确认',
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

// 文本常量
export const textObj = {
  applyText: '申请',
  confirmText: '确认',
  handleText: '办理',
  editText: '编辑',
  excelName: '离校办理列表',
};
