// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'resourceName',
      label: '资源名称',
      component: 'Input',
      componentProps: { placeholder: '请输入资源名称' },
      labelWidth: '100',
    },
    {
      fieldName: 'resourceType',
      label: '资源类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择资源类型',
        options: [
          { label: '课程', value: '课程' },
          { label: '图书', value: '图书' },
          { label: '专题包', value: '专题包' },
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
          { label: '未上架', value: '未上架' },
          { label: '已上架', value: '已上架' },
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
    { field: 'resourceName', title: '资源名称', minWidth: 180, slots: { default: 'resourceName' } },
    { field: 'resourceType', title: '资源类型', minWidth: 100, slots: { default: 'resourceType' } },
    { field: 'resourceUrl', title: '资源地址', minWidth: 200 },
    { field: 'learnNum', title: '学习人数', minWidth: 100 },
    { field: 'learnRate', title: '学习完成率(%)', minWidth: 120 },
    { field: 'publishTime', title: '上架时间', minWidth: 180, slots: { default: 'publishTime' } },
    { field: 'offTime', title: '下架时间', minWidth: 180, slots: { default: 'offTime' } },
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

// 上传/编辑表单 schema（添加 status 字段）
export function useCreateFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'resourceName',
      label: '资源名称',
      component: 'Input',
      componentProps: { placeholder: '请输入资源名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'resourceType',
      label: '资源类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择资源类型',
        options: [
          { label: '课程', value: '课程' },
          { label: '图书', value: '图书' },
          { label: '专题包', value: '专题包' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'resourceUrl',
      label: '资源地址',
      component: 'Input',
      componentProps: { placeholder: '请输入资源地址（URL）' },
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
          { label: '未上架', value: '未上架' },
          { label: '已上架', value: '已上架' },
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

// 文本常量
export const textObj = {
  editText: '编辑资源',
  addText: '上传资源',
  onlineText: '上架',
  offlineText: '下架',
  excelName: '德育资源列表',
};
