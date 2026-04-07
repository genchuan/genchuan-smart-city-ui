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

// 表格列定义
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'studentName', title: '学生姓名', minWidth: 100, slots: { default: 'studentName' } },
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
    { field: 'updater', title: '更新人', minWidth: 120 },
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

// 新增/编辑表单 schema
export function useCreateFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'studentId',
      label: '学生',
      component: 'Select',
      componentProps: {
        placeholder: '请选择学生',
        filterable: true,
        remote: true,
        remoteMethod: () => {}, // 实际项目中可接入远程搜索
        options: [
          { label: '张三', value: 1 },
          { label: '李四', value: 2 },
          { label: '王五', value: 3 },
          { label: '赵六', value: 4 },
          { label: '孙七', value: 5 },
          { label: '周八', value: 6 },
        ],
      },
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

// 文本常量
export const textObj = {
  editText: '编辑荣誉信息',
  addText: '新增荣誉',
  excelName: '荣誉管理列表',
};
