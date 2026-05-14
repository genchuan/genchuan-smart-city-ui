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
      fieldName: 'grade',
      label: '年级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择年级',
        clearable: true,
        options: [
          { label: '2020级', value: '2020级' },
          { label: '2021级', value: '2021级' },
          { label: '2022级', value: '2022级' },
          { label: '2023级', value: '2023级' },
          { label: '2024级', value: '2024级' },
          { label: '2025级', value: '2025级' },
          { label: '2026级', value: '2026级' },
          { label: '2027级', value: '2027级' },
          { label: '2028级', value: '2028级' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'fundType',
      label: '资助类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择资助类型',
        clearable: true,
        options: [
          { label: '助学金', value: '助学金' },
          { label: '勤工俭学', value: '勤工俭学' },
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
          { label: '待审核', value: '待审核' },
          { label: '已汇总', value: '已汇总' },
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
    { field: 'fundType', title: '资助类型', minWidth: 120, sortable: true, slots: { default: 'fundType' } },
    { field: 'applyAmount', title: '申请金额', minWidth: 120, sortable: true, },
    { field: 'applyTime', title: '申请时间', minWidth: 180, sortable: true, slots: { default: 'applyTime' } },
    { field: 'auditUser', title: '审核人', minWidth: 120, sortable: true, },
    { field: 'auditTime', title: '审核时间', minWidth: 180, sortable: true, slots: { default: 'auditTime' } },
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
      fieldName: 'fundType',
      label: '资助类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择资助类型',
        options: [
          { label: '助学金', value: '助学金' },
          { label: '勤工俭学', value: '勤工俭学' },
          { label: '其他', value: '其他' },
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
      label: '申请时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择申请时间',
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
          { label: '已汇总', value: '已汇总' },
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
  editText: '编辑资助申请',
  addText: '资助申请',
  excelName: '资助系统列表',
};
