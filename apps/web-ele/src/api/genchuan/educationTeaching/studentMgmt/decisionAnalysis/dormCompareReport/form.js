// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'timeScale',
      label: '报表时间尺度',
      component: 'Select',
      componentProps: {
        placeholder: '请选择时间尺度',
        options: [
          { label: '日', value: '日' },
          { label: '周', value: '周' },
          { label: '月', value: '月' },
          { label: '季', value: '季' },
          { label: '半年', value: '半年' },
          { label: '年', value: '年' },
          { label: '自定义', value: '自定义' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'statStartTime',
      label: '统计开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择统计开始时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      labelWidth: '120',
    },
    {
      fieldName: 'statEndTime',
      label: '统计结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择统计结束时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      labelWidth: '120',
    },
  ];
}

// 表格列定义
export function getColumns() {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'timeScale', title: '报表时间尺度', minWidth: 100, slots: { default: 'timeScale' } },
    { field: 'statStartTime', title: '统计开始时间', minWidth: 180, slots: { default: 'statStartTime' } },
    { field: 'statEndTime', title: '统计结束时间', minWidth: 180, slots: { default: 'statEndTime' } },
    { field: 'statFinishTime', title: '统计完成时间', minWidth: 180, slots: { default: 'statFinishTime' } },
    { field: 'reportType', title: '报表类型', minWidth: 150 },
    { field: 'yoyGrowth', title: '同比增长率(%)', minWidth: 120 },
    { field: 'qoqGrowth', title: '环比增长率(%)', minWidth: 120 },
    { field: 'creator', title: '生成人', minWidth: 120, slots: { default: 'creator' } },
    { field: 'createTime', title: '生成时间', minWidth: 180, slots: { default: 'createTime' } },
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

// 生成报表表单 schema（自定义报表弹窗）
export function useGenerateFormSchema() {
  return [
    {
      fieldName: 'timeScale',
      label: '时间尺度',
      component: 'Select',
      componentProps: {
        placeholder: '请选择时间尺度',
        options: [
          { label: '日', value: '日' },
          { label: '周', value: '周' },
          { label: '月', value: '月' },
          { label: '季', value: '季' },
          { label: '半年', value: '半年' },
          { label: '年', value: '年' },
          { label: '自定义', value: '自定义' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'statStartTime',
      label: '统计开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择统计开始时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '120',
    },
    {
      fieldName: 'statEndTime',
      label: '统计结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择统计结束时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '120',
    },
  ];
}

// 文本常量
export const textObj = {
  generateText: '生成报表',
  exportText: '导出',
  detailText: '详情',
  excelName: '宿舍评比报表',
};
