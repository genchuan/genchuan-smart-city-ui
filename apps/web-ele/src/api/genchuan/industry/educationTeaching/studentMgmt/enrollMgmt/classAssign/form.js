// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'ruleContent',
      label: '分班规则',
      component: 'Input',
      componentProps: { placeholder: '请输入分班规则' },
      labelWidth: '100',
    },
    {
      fieldName: 'studentNum',
      label: '分班学生数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入分班学生数',
        min: 1,
        step: 1,
        style: 'width: 100%'
      },
      labelWidth: '100',
    },
    {
      fieldName: 'confirmUser',
      label: '确认人',
      component: 'Input',
      componentProps: { placeholder: '请输入确认人' },
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
          { label: '未分班', value: '未分班' },
          { label: '已分班', value: '已分班' },
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
    // { field: 'className', title: '班级名称', minWidth: 150, slots: { default: 'className' } },
    { field: 'ruleContent', title: '分班规则', minWidth: 340, sortable: true, slots: { default: 'ruleContent' } },
    { field: 'studentNum', title: '分班学生数', minWidth: 120, sortable: true, },
    { field: 'assignTime', title: '分班时间', minWidth: 180, sortable: true, slots: { default: 'assignTime' } },
    { field: 'confirmUser', title: '确认人', minWidth: 120, sortable: true, },
    { field: 'confirmTime', title: '确认时间', minWidth: 180, sortable: true, slots: { default: 'confirmTime' } },
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

// 配置表单 schema（新增/编辑分班任务）
export function useConfigFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'ruleContent',
      label: '分班规则',
      component: 'Input',
      componentProps: { placeholder: '请输入分班规则', type: 'textarea', rows: 3 },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'studentNum',
      label: '分班学生数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入学生数', min: 1, step: 1, style: 'width: 100%' },
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
  configText: '配置',
  assignText: '分班',
  confirmText: '确认',
  editText: '编辑',
  excelName: '分班管理列表',
};
