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
      fieldName: 'dormNum',
      label: '宿舍号',
      component: 'Input',
      componentProps: { placeholder: '请输入宿舍号' },
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
          { label: '未分配', value: '未分配' },
          { label: '已分配', value: '已分配' },
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
    { field: 'dormNum', title: '宿舍号', minWidth: 120, sortable: true, slots: { default: 'dormNum' } },
    { field: 'bedId', title: '床位号', minWidth: 100, sortable: true, },
    { field: 'ruleContent', title: '分配规则', minWidth: 150, sortable: true, },
    { field: 'assignTime', title: '分配时间', minWidth: 180, sortable: true, slots: { default: 'assignTime' } },
    { field: 'adjustTime', title: '调整时间', minWidth: 180, sortable: true, slots: { default: 'adjustTime' } },
    { field: 'finishRate', title: '分配完成率', minWidth: 120, sortable: true, slots: { default: 'finishRate' } },
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

// 分配表单 schema（批量分配）
export function useAssignFormSchema() {
  return [
    {
      fieldName: 'dormNum',
      label: '宿舍号',
      component: 'Input',
      componentProps: { placeholder: '请输入宿舍号，例如：1号楼101' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'bedStartNum',
      label: '起始床位号',
      component: 'InputNumber',
      componentProps: { placeholder: '起始床位号（数字）', min: 1, step: 1, style: 'width: 100%' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'ruleContent',
      label: '分配规则',
      component: 'Input',
      componentProps: { placeholder: '请输入分配规则，如：同班级优先' },
      labelWidth: '100',
    },
  ];
}

// 调整表单 schema（批量调整）
export function useAdjustFormSchema() {
  return [
    {
      fieldName: 'newDormNum',
      label: '新宿舍号',
      component: 'Input',
      componentProps: { placeholder: '请输入新宿舍号，例如：2号楼202' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'newBedStartNum',
      label: '新起始床位号',
      component: 'InputNumber',
      componentProps: { placeholder: '新起始床位号（数字）', min: 1, step: 1, style: 'width: 100%' },
      rules: 'required',
      labelWidth: '100',
    },
    // {
    //   fieldName: 'remark',
    //   label: '调整原因',
    //   component: 'Input',
    //   componentProps: { placeholder: '请输入调整原因', type: 'textarea', rows: 2 },
    //   labelWidth: '100',
    // },
  ];
}

// 编辑表单 schema（添加 status 字段）
export function useEditFormSchema() {
  return [
    {
      fieldName: 'studentId',
      label: '学号',
      component: 'Input',
      componentProps: { placeholder: '请输入学号' },
      labelWidth: '100',
    },
    {
      fieldName: 'dormNum',
      label: '宿舍号',
      component: 'Input',
      componentProps: { placeholder: '请输入宿舍号' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'bedId',
      label: '床位号',
      component: 'Input',
      componentProps: { placeholder: '请输入床位号' },
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
          { label: '未分配', value: '未分配' },
          { label: '已分配', value: '已分配' },
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
  assignText: '分配',
  adjustText: '调整',
  editText: '编辑',
  excelName: '宿舍分配列表',
};
