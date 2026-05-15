// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'taskName',
      label: '宣传任务名称',
      component: 'Input',
      componentProps: { placeholder: '请输入任务名称' },
      labelWidth: '100',
    },
    {
      fieldName: 'site',
      label: '宣传站点',
      component: 'Input',
      componentProps: { placeholder: '请输入宣传站点' },
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
          { label: '未执行', value: '未执行' },
          { label: '已执行', value: '已执行' },
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
    { field: 'taskName', title: '宣传任务名称', minWidth: 180, sortable: true, slots: { default: 'taskName' } },
    { field: 'site', title: '宣传站点', minWidth: 120, sortable: true, slots: { default: 'site' } },
    { field: 'promoteNum', title: '宣传人数', minWidth: 100, sortable: true, },
    { field: 'intentNum', title: '意向学生数', minWidth: 100, sortable: true, },
    { field: 'executeUser', title: '执行人', minWidth: 100, sortable: true, },
    { field: 'executeTime', title: '执行时间', minWidth: 180, sortable: true, slots: { default: 'executeTime' } },
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

// 发布表单 schema（新增/编辑宣传任务，添加 status 字段）
export function usePublishFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'taskName',
      label: '宣传任务名称',
      component: 'Input',
      componentProps: { placeholder: '请输入宣传任务名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'site',
      label: '宣传站点',
      component: 'Input',
      componentProps: { placeholder: '请输入宣传站点' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'status',                     // 新增状态字段
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        disabled: isEdit,                      // 编辑时状态不可修改（只有未执行可编辑，状态固定为未执行）
        options: [
          { label: '未执行', value: '未执行' },
          { label: '已执行', value: '已执行' },
        ],
      },
      rules: 'required',
      defaultValue: '未执行',
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

// 执行表单 schema
export function useExecuteFormSchema() {
  return [
    {
      fieldName: 'promoteNum',
      label: '宣传人数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入宣传人数', min: 0, step: 1, style: 'width: 100%' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'intentNum',
      label: '意向学生数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入意向学生数', min: 0, step: 1, style: 'width: 100%' },
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
  publishText: '发布',
  executeText: '执行',
  editText: '编辑',
  excelName: '宣传管理列表',
};
