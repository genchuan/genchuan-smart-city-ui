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
      fieldName: 'treatType',
      label: '就诊类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择就诊类型',
        options: [
          { label: '门诊', value: '门诊' },
          { label: '急诊', value: '急诊' },
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
          { label: '已就诊', value: '已就诊' },
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
    { field: 'treatType', title: '就诊类型', minWidth: 100, sortable: true, slots: { default: 'treatType' } },
    { field: 'symptom', title: '症状描述', minWidth: 150, sortable: true, },
    { field: 'registerTime', title: '就诊登记时间', minWidth: 180, sortable: true, slots: { default: 'registerTime' } },
    { field: 'treatContent', title: '就诊内容', minWidth: 150, sortable: true, },
    { field: 'applyTime', title: '预约时间', minWidth: 180, sortable: true, slots: { default: 'applyTime' } },
    { field: 'auditUser', title: '审核人', minWidth: 100, sortable: true, },
    { field: 'auditTime', title: '审核时间', minWidth: 180, sortable: true, slots: { default: 'auditTime' } },
    { field: 'feedbackTime', title: '家长反馈时间', minWidth: 180, sortable: true, slots: { default: 'feedbackTime' } },
    { field: 'status', title: '状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 240,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 编辑表单 schema（含 registerTime）
export function useAppointFormSchema(isEdit = false) {
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
      fieldName: 'treatType',
      label: '就诊类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择就诊类型',
        options: [
          { label: '门诊', value: '门诊' },
          { label: '急诊', value: '急诊' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'applyTime',
      label: '预约时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择预约时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'symptom',
      label: '症状描述',
      component: 'Input',
      componentProps: { placeholder: '请输入症状描述', type: 'textarea', rows: 3 },
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
          { label: '已就诊', value: '已就诊' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'registerTime',
      label: '就诊登记时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择就诊登记时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
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

// 新增预约表单 schema（不含 registerTime）
export function useCreateAppointFormSchema() {
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
      fieldName: 'treatType',
      label: '就诊类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择就诊类型',
        options: [
          { label: '门诊', value: '门诊' },
          { label: '急诊', value: '急诊' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'applyTime',
      label: '预约时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择预约时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'symptom',
      label: '症状描述',
      component: 'Input',
      componentProps: { placeholder: '请输入症状描述', type: 'textarea', rows: 3 },
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
          { label: '已就诊', value: '已就诊' },
        ],
      },
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

// 登记表单 schema
export function useRegisterFormSchema() {
  return [
    {
      fieldName: 'treatContent',
      label: '就诊内容',
      component: 'Input',
      componentProps: { placeholder: '请输入就诊内容', type: 'textarea', rows: 4 },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'registerTime',
      label: '就诊登记时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择就诊登记时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  appointText: '预约',
  auditText: '审核',
  registerText: '登记',
  feedbackText: '反馈',
  editText: '编辑',
  excelName: '就诊管理列表',
};
