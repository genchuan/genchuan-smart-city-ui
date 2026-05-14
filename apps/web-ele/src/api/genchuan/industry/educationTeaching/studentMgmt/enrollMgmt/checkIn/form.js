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
        clearable: true,
        options: [
          { label: '待确认', value: '待确认' },
          { label: '待审核', value: '待审核' },
          { label: '已报到', value: '已报到' },
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
    { field: 'examScore', title: '中考成绩', minWidth: 100, sortable: true, },
    { field: 'supplyInfo', title: '补充信息', minWidth: 150, sortable: true, slots: { default: 'supplyInfo' } },
    { field: 'confirmTime', title: '报到确认时间', minWidth: 180, sortable: true, slots: { default: 'confirmTime' } },
    { field: 'auditUser', title: '审核人', minWidth: 100, sortable: true, },
    { field: 'auditTime', title: '审核时间', minWidth: 180, sortable: true, slots: { default: 'auditTime' } },
    { field: 'accountCreateTime', title: '账号创建时间', minWidth: 180, sortable: true, slots: { default: 'accountCreateTime' } },
    { field: 'accountStatus', title: '账号状态', minWidth: 100, sortable: true, slots: { default: 'accountStatus' } },
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

// 补充表单 schema（编辑补充信息）
export function useSupplyFormSchema() {
  return [
    {
      fieldName: 'examScore',
      label: '中考成绩',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入中考成绩', min: 0, max: 1000, step: 0.5, style: 'width: 100%' },
      labelWidth: '100',
    },
    {
      fieldName: 'supplyInfo',
      label: '补充信息',
      component: 'Input',
      componentProps: { placeholder: '请输入补充信息', type: 'textarea', rows: 3 },
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  supplyText: '补充',
  confirmText: '确认',
  auditText: '审核',
  editText: '编辑',
  excelName: '报到管理列表',
};
