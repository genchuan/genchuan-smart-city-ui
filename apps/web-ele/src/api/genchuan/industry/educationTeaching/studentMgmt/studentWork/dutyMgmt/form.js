// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'dutyUser',
      label: '值班人',
      component: 'Input',
      componentProps: { placeholder: '请输入值班人' },
      labelWidth: '100',
    },
    {
      fieldName: 'dutyDate',
      label: '值班日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择值班日期范围',
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
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
          { label: '待打卡', value: '待打卡' },
          { label: '待调班审批', value: '待调班审批' },
          { label: '待出车审批', value: '待出车审批' },
          { label: '已完成', value: '已完成' },
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
    { field: 'dutyDate', title: '值班日期', minWidth: 120, sortable: true, },
    { field: 'dutyUser', title: '值班人', minWidth: 100, sortable: true, slots: { default: 'dutyUser' } },
    { field: 'status', title: '状态', minWidth: 120, sortable: true, slots: { default: 'status' } },
    { field: 'checkInStatus', title: '打卡状态', minWidth: 100, sortable: true, },
    { field: 'transferReason', title: '调班原因', minWidth: 150, sortable: true, },
    { field: 'transferUser', title: '调班替代人', minWidth: 120, sortable: true, },
    { field: 'transferStatus', title: '调班状态', minWidth: 100, sortable: true, },
    { field: 'carReason', title: '出车事由', minWidth: 150, sortable: true, },
    { field: 'carDestination', title: '出车目的地', minWidth: 120, sortable: true, },
    { field: 'carStatus', title: '出车状态', minWidth: 100, sortable: true, },
    { field: 'recordContent', title: '值班记录', minWidth: 200, sortable: true, },
    { field: 'recordUploadTime', title: '记录上传时间', minWidth: 180, sortable: true, slots: { default: 'recordUploadTime' } },
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

// 排班表单
export function useScheduleFormSchema() {
  return [
    {
      fieldName: 'dutyDateList',
      label: '值班日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择值班日期',
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'dutyUser',
      label: '值班人',
      component: 'Input',
      componentProps: { placeholder: '请输入值班人姓名' },
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

// 编辑值班记录表单
export function useEditFormSchema() {
  return [
    {
      fieldName: 'dutyDate',
      label: '值班日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择值班日期',
        type: 'date',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'dutyUser',
      label: '值班人',
      component: 'Input',
      componentProps: { placeholder: '请输入值班人姓名' },
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
          { label: '待打卡', value: '待打卡' },
          { label: '待调班审批', value: '待调班审批' },
          { label: '待出车审批', value: '待出车审批' },
          { label: '已完成', value: '已完成' },
        ],
        disabled: true,
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

// 调班申请表单
export function useShiftApplyFormSchema() {
  return [
    {
      fieldName: 'transferReason',
      label: '调班原因',
      component: 'Input',
      componentProps: { placeholder: '请输入调班原因' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'transferUser',
      label: '调班替代人',
      component: 'Input',
      componentProps: { placeholder: '请输入调班替代人' },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 出车申请表单
export function useVehicleApplyFormSchema() {
  return [
    {
      fieldName: 'carReason',
      label: '出车事由',
      component: 'Input',
      componentProps: { placeholder: '请输入出车事由' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'carDestination',
      label: '出车目的地',
      component: 'Input',
      componentProps: { placeholder: '请输入出车目的地' },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 上传记录表单
export function useUploadRecordFormSchema() {
  return [
    {
      fieldName: 'recordContent',
      label: '值班记录',
      component: 'Input',
      componentProps: { placeholder: '请输入值班记录内容', type: 'textarea', rows: 5 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  editText: '编辑值班记录',
  addText: '排班',
  excelName: '值班管理列表',
};
