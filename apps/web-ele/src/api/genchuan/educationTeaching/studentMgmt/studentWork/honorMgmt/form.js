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
      fieldName: 'honorType',
      label: '荣誉类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择荣誉类型',
        options: [
          { label: '优秀学生', value: '优秀学生' },
          { label: '奖学金', value: '奖学金' },
          { label: '竞赛获奖', value: '竞赛获奖' },
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
          { label: '已推送', value: '已推送' },
        ],
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义（不变）
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'studentId', title: '学号', minWidth: 100, slots: { default: 'studentId' } },
    { field: 'className', title: '班级', minWidth: 150 },
    { field: 'honorType', title: '荣誉类型', minWidth: 120, slots: { default: 'honorType' } },
    { field: 'honorName', title: '荣誉名称', minWidth: 180 },
    { field: 'getTime', title: '获得时间', minWidth: 180, slots: { default: 'getTime' } },
    { field: 'auditUser', title: '审核人', minWidth: 120 },
    { field: 'auditTime', title: '审核时间', minWidth: 180, slots: { default: 'auditTime' } },
    { field: 'pushTime', title: '推送时间', minWidth: 180, slots: { default: 'pushTime' } },
    { field: 'status', title: '状态', minWidth: 100, slots: { default: 'status' } },
    { field: 'creator', title: '创建人', minWidth: 120, slots: { default: 'creator' } },
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

// 新增/编辑表单 schema（学生姓名改为输入框）
export function useCreateFormSchema(isEdit = false) {
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
      fieldName: 'honorType',
      label: '荣誉类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择荣誉类型',
        options: [
          { label: '优秀学生', value: '优秀学生' },
          { label: '奖学金', value: '奖学金' },
          { label: '竞赛获奖', value: '竞赛获奖' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'honorName',
      label: '荣誉名称',
      component: 'Input',
      componentProps: { placeholder: '请输入荣誉名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'getTime',
      label: '获得时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择获得时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x', // 时间戳
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

// 文本常量（不变）
export const textObj = {
  editText: '编辑荣誉信息',
  addText: '新增荣誉',
  excelName: '荣誉管理列表',
};
