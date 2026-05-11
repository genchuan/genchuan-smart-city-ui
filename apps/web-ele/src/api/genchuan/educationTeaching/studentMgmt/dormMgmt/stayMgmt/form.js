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
      fieldName: 'stayDate',
      label: '留宿日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择留宿日期',
        type: 'date',
        format: 'YYYY-MM-DD',
        valueFormat: 'x',
      },
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
          { label: '待审核', value: '待审核' },
          { label: '已通过', value: '已通过' },
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
    { field: 'stayDate', title: '留宿日期', minWidth: 120, sortable: true, slots: { default: 'stayDate' } },
    { field: 'stayReason', title: '留宿原因', minWidth: 150, sortable: true, },
    { field: 'applyTime', title: '申请时间', minWidth: 180, sortable: true, slots: { default: 'applyTime' } },
    { field: 'parentConfirmTime', title: '家长确认时间', minWidth: 180, sortable: true, slots: { default: 'parentConfirmTime' } },
    { field: 'auditUser', title: '审核人', minWidth: 100, sortable: true, },
    { field: 'auditTime', title: '审核时间', minWidth: 180, sortable: true, slots: { default: 'auditTime' } },
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

// 申请表单 schema（添加 status 和 applyTime 字段）
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
      fieldName: 'stayDate',
      label: '留宿日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择留宿日期',
        type: 'date',
        format: 'YYYY-MM-DD',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'stayReason',
      label: '留宿原因',
      component: 'Input',
      componentProps: { placeholder: '请输入留宿原因', type: 'textarea', rows: 3 },
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
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待确认', value: '待确认' },
          { label: '待审核', value: '待审核' },
          { label: '已通过', value: '已通过' },
        ],
      },
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
  applyText: '申请留宿',
  confirmText: '确认',
  auditText: '审核',
  editText: '编辑申请',
  excelName: '留宿管理列表',
};
