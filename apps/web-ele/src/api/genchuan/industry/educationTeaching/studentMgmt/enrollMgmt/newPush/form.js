// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'taskName',
      label: '推送任务名称',
      component: 'Input',
      componentProps: { placeholder: '请输入任务名称' },
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '未推送', value: '未推送' },
          { label: '已推送', value: '已推送' },
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
    { field: 'taskName', title: '推送任务名称', minWidth: 180, sortable: true, slots: { default: 'taskName' } },
    { field: 'pushContent', title: '推送内容', minWidth: 340, sortable: true, slots: { default: 'pushContent' } },
    { field: 'pushNum', title: '推送人数', minWidth: 100, sortable: true, },
    { field: 'pushTime', title: '推送时间', minWidth: 180, sortable: true, slots: { default: 'pushTime' } },
    { field: 'finishRate', title: '推送完成率', minWidth: 120, sortable: true, slots: { default: 'finishRate' } },
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

// 配置表单 schema（新增/编辑推送任务）
export function useConfigFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'taskName',
      label: '推送任务名称',
      component: 'Input',
      componentProps: { placeholder: '请输入推送任务名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'pushContent',
      label: '推送内容',
      component: 'Input',
      componentProps: { placeholder: '请输入推送内容', type: 'textarea', rows: 3 },
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
  pushText: '推送',
  editText: '编辑',
  excelName: '迎新推送列表',
};
