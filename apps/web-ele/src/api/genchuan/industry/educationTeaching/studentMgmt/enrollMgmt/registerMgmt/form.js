// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'studentName',
      label: '学生姓名',
      component: 'Input',
      componentProps: { placeholder: '请输入学生姓名' },
      labelWidth: '100',
    },
    {
      fieldName: 'major',
      label: '意向专业',
      component: 'Input',
      componentProps: { placeholder: '请输入意向专业' },
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
          { label: '待审核', value: '待审核' },
          { label: '已录取', value: '已录取' },
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
    { field: 'studentName', title: '学生姓名', minWidth: 100, sortable: true, slots: { default: 'studentName' } },
    { field: 'idCard', title: '身份证号', minWidth: 180, sortable: true, },
    { field: 'phone', title: '联系电话', minWidth: 120, sortable: true, },
    { field: 'major', title: '意向专业', minWidth: 150, sortable: true, slots: { default: 'major' } },
    { field: 'applyTime', title: '报名时间', minWidth: 180, sortable: true, slots: { default: 'applyTime' } },
    { field: 'auditUser', title: '审核人', minWidth: 100, sortable: true, },
    { field: 'auditTime', title: '审核时间', minWidth: 180, sortable: true, slots: { default: 'auditTime' } },
    { field: 'confirmTime', title: '录取确认时间', minWidth: 180, sortable: true, slots: { default: 'confirmTime' } },
    { field: 'status', title: '状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 220,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 报名表单 schema（添加 status 字段）
export function useApplyFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'studentName',
      label: '学生姓名',
      component: 'Input',
      componentProps: { placeholder: '请输入学生姓名' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'idCard',
      label: '身份证号',
      component: 'Input',
      componentProps: { placeholder: '请输入身份证号' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: { placeholder: '请输入联系电话' },
      labelWidth: '100',
    },
    {
      fieldName: 'major',
      label: '意向专业',
      component: 'Input',
      componentProps: { placeholder: '请输入意向专业' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'applyTime',
      label: '报名时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择报名时间',
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
          { label: '已录取', value: '已录取' },
        ],
      },
      rules: 'required',
      defaultValue: '待审核',
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
  applyText: '报名',
  auditText: '审核',
  confirmText: '确认',
  editText: '编辑',
  excelName: '报名管理列表',
};
