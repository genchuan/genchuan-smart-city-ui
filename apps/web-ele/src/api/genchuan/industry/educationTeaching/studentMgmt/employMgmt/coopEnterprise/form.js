// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'enterpriseName',
      label: '企业名称',
      component: 'Input',
      componentProps: { placeholder: '请输入企业名称' },
      labelWidth: '100',
    },
    {
      fieldName: 'enterpriseType',
      label: '企业类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择企业类型',
        clearable: true,
        options: [
          { label: '国企', value: '国企' },
          { label: '民企', value: '民企' },
          { label: '外企', value: '外企' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'deptId',
      label: '负责系部',
      component: 'Select',
      componentProps: {
        placeholder: '请选择负责系部',
        clearable: true,
        options: [
          { value: 2001, label: '计算机系' },
          { value: 2002, label: '机电系' },
          { value: 2003, label: '经贸系' },
          { value: 2004, label: '其他' },
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
          { label: '合作中', value: '合作中' },
          { label: '已结束', value: '已结束' },
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
    { field: 'enterpriseName', title: '企业名称', minWidth: 180, sortable: true, slots: { default: 'enterpriseName' } },
    { field: 'enterpriseType', title: '企业类型', minWidth: 100, sortable: true, slots: { default: 'enterpriseType' } },
    { field: 'deptId', title: '负责系部', minWidth: 120, sortable: true, slots: { default: 'deptId' } },
    { field: 'contactUser', title: '联系人', minWidth: 100, sortable: true, },
    { field: 'contactPhone', title: '联系电话', minWidth: 120, sortable: true, },
    { field: 'coopStartTime', title: '合作开始时间', minWidth: 180, sortable: true, slots: { default: 'coopStartTime' } },
    { field: 'coopEndTime', title: '合作结束时间', minWidth: 180, sortable: true, slots: { default: 'coopEndTime' } },
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

// 建档/编辑表单 schema
export function useCreateFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'enterpriseName',
      label: '企业名称',
      component: 'Input',
      componentProps: { placeholder: '请输入企业名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'enterpriseType',
      label: '企业类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择企业类型',
        options: [
          { label: '国企', value: '国企' },
          { label: '民企', value: '民企' },
          { label: '外企', value: '外企' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'deptId',
      label: '负责系部',
      component: 'Select',
      componentProps: {
        placeholder: '请选择负责系部',
        filterable: true,
        options: [
          { value: 2001, label: '计算机系' },
          { value: 2002, label: '机电系' },
          { value: 2003, label: '经贸系' },
          { value: 2004, label: '其他' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'contactUser',
      label: '联系人',
      component: 'Input',
      componentProps: { placeholder: '请输入联系人' },
      labelWidth: '100',
    },
    {
      fieldName: 'contactPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: { placeholder: '请输入联系电话' },
      labelWidth: '100',
    },
    {
      fieldName: 'coopStartTime',
      label: '合作开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择合作开始时间',
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
          { label: '合作中', value: '合作中' },
          { label: '已结束', value: '已结束' },
        ],
      },
      rules: 'required',
      defaultValue: '合作中',
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

// 维护表单 schema - 改为 timeRange 和 remark，与后端接口完全一致
export function useMaintainFormSchema() {
  return [
    {
      fieldName: 'timeRange',
      label: '合作时间范围',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        rangeSeparator: '至',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'remark',
      label: '维护备注',
      component: 'Input',
      componentProps: { placeholder: '请输入维护备注', type: 'textarea', rows: 3 },
      labelWidth: '100',
    },
  ];
}

export const textObj = {
  createText: '建档',
  maintainText: '维护',
  editText: '编辑',
  excelName: '校企合作列表',
};
