// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'className',
      label: '班级',
      component: 'Input',
      componentProps: { placeholder: '请输入班级' },
      labelWidth: '100',
    },
    {
      fieldName: 'assessType',
      label: '考评类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择考评类型',
        options: [
          { label: '教室卫生', value: '教室卫生' },
          { label: '早操', value: '早操' },
          { label: '文明班级', value: '文明班级' },
          { label: '黑板报', value: '黑板报' },
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
          { label: '未发布', value: '未发布' },
          { label: '已发布', value: '已发布' },
        ],
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义（排名字段改为 rankNo）
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'className', title: '班级', minWidth: 180, sortable: true, slots: { default: 'className' } },
    { field: 'assessType', title: '考评类型', minWidth: 120, sortable: true, slots: { default: 'assessType' } },
    { field: 'cycle', title: '统计周期', minWidth: 100, sortable: true, },
    { field: 'score', title: '考评得分', minWidth: 100, sortable: true, },
    { field: 'rankNo', title: '班级排名', minWidth: 100, sortable: true, },
    { field: 'assessUser', title: '考评人', minWidth: 120, sortable: true, },
    { field: 'publishTime', title: '发布时间', minWidth: 180, sortable: true, slots: { default: 'publishTime' } },
    { field: 'status', title: '状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 180,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 新增/编辑表单 schema
export function useCreateFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'className',
      label: '班级',
      component: 'Input',
      componentProps: { placeholder: '请输入班级' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'assessType',
      label: '考评类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择考评类型',
        options: [
          { label: '教室卫生', value: '教室卫生' },
          { label: '早操', value: '早操' },
          { label: '文明班级', value: '文明班级' },
          { label: '黑板报', value: '黑板报' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'cycle',
      label: '统计周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择统计周期',
        options: [
          { label: '周', value: '周' },
          { label: '月', value: '月' },
          { label: '学期', value: '学期' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'score',
      label: '考评得分',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入考评得分', min: 0, max: 100, precision: 2, style: 'width: 100%' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'assessUser',
      label: '考评人',
      component: 'Input',
      componentProps: { placeholder: '请输入考评人' },
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        disabled: isEdit,
        options: [
          { label: '未发布', value: '未发布' },
          { label: '已发布', value: '已发布' },
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
  editText: '编辑考评记录',
  addText: '录入考评',
  excelName: '考评管理列表',
};
