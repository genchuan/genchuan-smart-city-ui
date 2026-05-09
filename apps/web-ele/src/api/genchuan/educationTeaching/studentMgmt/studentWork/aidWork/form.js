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
      fieldName: 'aidType',
      label: '资助类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择资助类型',
        options: [
          { label: '奖学金', value: '奖学金' },
          { label: '助学金', value: '助学金' },
          { label: '助学贷款', value: '助学贷款' },
          { label: '勤工俭学', value: '勤工俭学' },
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
          { label: '已完成', value: '已完成' },
        ],
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义（未修改，但为完整展示保留）
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'studentId', title: '学号', minWidth: 100, slots: { default: 'studentId' } },
    { field: 'aidType', title: '资助类型', minWidth: 120, slots: { default: 'aidType' } },
    { field: 'applyAmount', title: '申请金额', minWidth: 120, slots: { default: 'applyAmount' } },
    { field: 'applyTime', title: '申报时间', minWidth: 180, slots: { default: 'applyTime' } },
    { field: 'auditUser', title: '审核人', minWidth: 120 },
    { field: 'auditTime', title: '审核时间', minWidth: 180, slots: { default: 'auditTime' } },
    { field: 'processStatus', title: '流程状态', minWidth: 100 },
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

// 申报表单 schema（添加 status 字段）
export function useCreateFormSchema() {
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
      fieldName: 'aidType',
      label: '资助类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择资助类型',
        options: [
          { label: '奖学金', value: '奖学金' },
          { label: '助学金', value: '助学金' },
          { label: '助学贷款', value: '助学贷款' },
          { label: '勤工俭学', value: '勤工俭学' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'applyAmount',
      label: '申请金额',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入申请金额', min: 0, precision: 2, style: 'width: 100%' },
      labelWidth: '100',
    },
    {
      fieldName: 'applyTime',
      label: '申报时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择申报时间',
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
          { label: '已通过', value: '已通过' },
          { label: '已完成', value: '已完成' },
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

// 跟进表单 schema（未修改）
export function useFollowFormSchema() {
  return [
    {
      fieldName: 'processStatus',
      label: '流程状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择流程状态',
        options: [
          { label: '跟进中', value: '跟进中' },
          { label: '已完成', value: '已完成' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'remark',
      label: '跟进备注',
      component: 'Input',
      componentProps: { placeholder: '请输入跟进备注', type: 'textarea', rows: 3 },
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  editText: '编辑奖助申请',
  addText: '奖助申报',
  excelName: '奖助勤贷列表',
};
