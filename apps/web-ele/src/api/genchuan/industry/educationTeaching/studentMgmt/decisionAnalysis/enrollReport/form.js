/** 获取报表周期Tag类型 */
export function getReportCycleTagType(cycle) {
  const map = {
    日报: 'info',
    周报: 'success',
    月报: 'primary',
    季报: 'warning',
    半年报: 'danger',
    年报: 'danger',
    自定义报表: 'info',
  };
  return map[cycle] || 'info';
}

/** 获取生成状态Tag类型 */
export function getGenerateStatusTagType(status) {
  const map = {
    待生成: 'info',
    已生成: 'success',
    已归档: 'warning',
  };
  return map[status] || 'info';
}

// ==================== 生成报表表单配置 ====================
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'statTimeRange',
      label: '统计时段',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        placeholder: ['开始时间', '结束时间'],
      },
      rules: 'required',
    },
    {
      fieldName: 'reportCycle',
      label: '报表周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表周期',
        options: [
          { label: '日报', value: '日报' },
          { label: '周报', value: '周报' },
          { label: '月报', value: '月报' },
          { label: '季报', value: '季报' },
          { label: '半年报', value: '半年报' },
          { label: '年报', value: '年报' },
          { label: '自定义报表', value: '自定义报表' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'sourcePlace',
      label: '生源地',
      component: 'Select',
      componentProps: {
        placeholder: '请选择生源地',
        options: [],
        filterable: true,
      },
    },
    {
      fieldName: 'majorName',
      label: '专业名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择专业（可选）',
        options: [],
        filterable: true,
        clearable: true,
      },
    },
  ];
}

// ==================== 列表页搜索表单配置 ====================
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'reportCycle',
      label: '报表周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表周期',
        options: [
          { label: '日报', value: '日报' },
          { label: '周报', value: '周报' },
          { label: '月报', value: '月报' },
          { label: '季报', value: '季报' },
          { label: '半年报', value: '半年报' },
          { label: '年报', value: '年报' },
          { label: '自定义报表', value: '自定义报表' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'statTimeRange',
      label: '统计时段',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        placeholder: ['开始时间', '结束时间'],
        clearable: true,
      },
    },
    {
      fieldName: 'generateStatus',
      label: '生成状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择生成状态',
        options: [
          { label: '待生成', value: '待生成' },
          { label: '已生成', value: '已生成' },
          { label: '已归档', value: '已归档' },
        ],
        clearable: true,
      },
    },
  ];
}

// ==================== 表格列配置 ====================
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'reportCycle', title: '报表周期', minWidth: 120, sortable: true, slots: { default: 'reportCycle' } },
    { title: '统计时段', minWidth: 280, sortable: true, slots: { default: 'statisticalPeriod' } },
    { field: 'sourceTotal', title: '生源总数', minWidth: 130, sortable: true, slots: { default: 'sourceTotal' } },
    { field: 'applyNum', title: '报名数', minWidth: 120, sortable: true, slots: { default: 'applyNum' } },
    { field: 'admitNum', title: '录取数', minWidth: 120, sortable: true, slots: { default: 'admitNum' } },
    { field: 'checkinNum', title: '报到数', minWidth: 120, sortable: true, slots: { default: 'checkinNum' } },
    { field: 'classAssignRate', title: '分班完成率(%)', minWidth: 150, sortable: true },
    { field: 'dormAssignRate', title: '分配完成率(%)', minWidth: 150, sortable: true },
    { field: 'generateStatus', title: '生成状态', minWidth: 110, sortable: true, slots: { default: 'generateStatus' } },
    { field: 'generateTime', title: '生成时间', minWidth: 180, sortable: true, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
    { field: 'operatorId', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'operatorId' } },
    { field: 'exportCount', title: '导出次数', minWidth: 100, sortable: true },
    { field: 'sourceTotalYoy', title: '生源总数同比(%)', minWidth: 160, sortable: true },
    { field: 'sourceTotalQoq', title: '生源总数环比(%)', minWidth: 160, sortable: true },
    { field: 'applyNumYoy', title: '报名数同比(%)', minWidth: 150, sortable: true },
    { field: 'applyNumQoq', title: '报名数环比(%)', minWidth: 150, sortable: true },
    { field: 'admitNumYoy', title: '录取数同比(%)', minWidth: 150, sortable: true },
    { field: 'admitNumQoq', title: '录取数环比(%)', minWidth: 150, sortable: true },
    { field: 'checkinNumYoy', title: '报到数同比(%)', minWidth: 150, sortable: true },
    { field: 'checkinNumQoq', title: '报到数环比(%)', minWidth: 150, sortable: true },
    { title: '操作', width: 180, fixed: 'right', slots: { default: 'actions' } },
  ];
}

// ==================== 详情抽屉字段配置 ====================
export const detailFields = [
  { key: 'reportCycle', label: '报表周期' },
  { key: 'statStartTime', label: '统计开始时间', formatter: (val) => val ? new Date(val).toLocaleString() : '-' },
  { key: 'statEndTime', label: '统计结束时间', formatter: (val) => val ? new Date(val).toLocaleString() : '-' },
  { key: 'sourceTotal', label: '生源总数' },
  { key: 'applyNum', label: '报名数' },
  { key: 'admitNum', label: '录取数' },
  { key: 'checkinNum', label: '报到数' },
  { key: 'classAssignRate', label: '分班完成率(%)' },
  { key: 'dormAssignRate', label: '分配完成率(%)' },
  { key: 'generateStatus', label: '生成状态' },
  { key: 'generateTime', label: '生成时间', formatter: (val) => val ? new Date(val).toLocaleString() : '-' },
  { key: 'operatorId', label: '操作人ID' },
  { key: 'exportCount', label: '导出次数' },
  { key: 'sourceTotalYoy', label: '生源总数同比(%)' },
  { key: 'sourceTotalQoq', label: '生源总数环比(%)' },
  { key: 'applyNumYoy', label: '报名数同比(%)' },
  { key: 'applyNumQoq', label: '报名数环比(%)' },
  { key: 'admitNumYoy', label: '录取数同比(%)' },
  { key: 'admitNumQoq', label: '录取数环比(%)' },
  { key: 'checkinNumYoy', label: '报到数同比(%)' },
  { key: 'checkinNumQoq', label: '报到数环比(%)' },
  { key: 'creator', label: '创建者' },
];
