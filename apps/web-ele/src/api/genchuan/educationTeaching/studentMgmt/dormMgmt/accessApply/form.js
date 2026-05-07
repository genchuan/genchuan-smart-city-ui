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
      fieldName: 'applyType',
      label: '申请类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择申请类型',
        options: [
          { label: '应急出入', value: '应急出入' },
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
        options: [
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
    { field: 'studentId', title: '学号', minWidth: 100, slots: { default: 'studentId' } },
    { field: 'applyType', title: '申请类型', minWidth: 100, slots: { default: 'applyType' } },
    { field: 'applyReason', title: '申请原因', minWidth: 150 },
    { field: 'applyTime', title: '申请时间', minWidth: 180, slots: { default: 'applyTime' } },
    { field: 'auditUser', title: '审核人', minWidth: 100 },
    { field: 'auditTime', title: '审核时间', minWidth: 180, slots: { default: 'auditTime' } },
    { field: 'status', title: '状态', minWidth: 100, slots: { default: 'status' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, slots: { default: 'updateTime' } },
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

// 申请表单 schema（新增/编辑）- 添加 status 字段
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
      fieldName: 'applyType',
      label: '申请类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择申请类型',
        options: [
          { label: '应急出入', value: '应急出入' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'applyReason',
      label: '申请原因',
      component: 'Input',
      componentProps: { placeholder: '请输入申请原因', type: 'textarea', rows: 3 },
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
  applyText: '申请',
  auditText: '审核',
  editText: '编辑申请',
  excelName: '出入申请列表',
};
