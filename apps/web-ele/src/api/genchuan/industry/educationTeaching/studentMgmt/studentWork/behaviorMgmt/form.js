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
      fieldName: 'leaveType',
      label: '请假类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择请假类型',
        clearable: true,
        options: [
          { label: '事假', value: '事假' },
          { label: '病假', value: '病假' },
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
        clearable: true,
        options: [
          { label: '待审批', value: '待审批' },
          { label: '已通过', value: '已通过' },
          { label: '已驳回', value: '已驳回' },
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
    { field: 'studentId', title: '学号', minWidth: 100, sortable: true, slots: { default: 'studentId' } },
    { field: 'leaveType', title: '请假类型', minWidth: 100, sortable: true, slots: { default: 'leaveType' } },
    { field: 'startTime', title: '开始时间', minWidth: 180, sortable: true, slots: { default: 'startTime' } },
    { field: 'endTime', title: '结束时间', minWidth: 180, sortable: true, slots: { default: 'endTime' } },
    { field: 'leaveReason', title: '请假原因', minWidth: 150, sortable: true, },
    { field: 'auditLevel', title: '审批级别', minWidth: 100, sortable: true, },
    { field: 'auditUser', title: '审批人', minWidth: 120, sortable: true, },
    { field: 'auditTime', title: '审批时间', minWidth: 180, sortable: true, slots: { default: 'auditTime' } },
    { field: 'attendanceSync', title: '考勤同步状态', minWidth: 120, sortable: true, },
    { field: 'status', title: '状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true, slots: { default: 'updateTime' } },
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

// 申请表单 schema（添加 status 字段）
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
      fieldName: 'leaveType',
      label: '请假类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择请假类型',
        options: [
          { label: '事假', value: '事假' },
          { label: '病假', value: '病假' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'startTime',
      label: '开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择开始时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'endTime',
      label: '结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择结束时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'leaveReason',
      label: '请假原因',
      component: 'Input',
      componentProps: { placeholder: '请输入请假原因', type: 'textarea', rows: 2 },
      labelWidth: '100',
    },
    {
      fieldName: 'auditLevel',
      label: '审批级别',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审批级别',
        options: [
          { label: '班主任', value: '班主任' },
          { label: '辅导员', value: '辅导员' },
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
          { label: '待审批', value: '待审批' },
          { label: '已通过', value: '已通过' },
          { label: '已驳回', value: '已驳回' },
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
  editText: '编辑请假申请',
  addText: '请假申请',
  excelName: '行为管理列表',
};
