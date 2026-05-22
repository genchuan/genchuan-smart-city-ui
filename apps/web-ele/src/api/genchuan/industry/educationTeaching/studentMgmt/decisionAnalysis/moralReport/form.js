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
      fieldName: 'grade',
      label: '年级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择年级',
        options: [],
        filterable: true,
      },
      rules: 'required',
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
    {
      fieldName: 'className',
      label: '班级名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择班级（可选）',
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
    { field: 'targetTotal', title: '指标总数', minWidth: 120, sortable: true, slots: { default: 'targetTotal' } },
    { field: 'targetEnableNum', title: '启用指标数', minWidth: 130, sortable: true, slots: { default: 'targetEnableNum' } },
    { field: 'targetWarnNum', title: '预警指标数', minWidth: 130, sortable: true, slots: { default: 'targetWarnNum' } },
    { field: 'activityJoinNum', title: '活动参与人数', minWidth: 140, sortable: true, slots: { default: 'activityJoinNum' } },
    { field: 'resourceLearnRate', title: '资源学习完成率(%)', minWidth: 160, sortable: true },
    { field: 'generateStatus', title: '生成状态', minWidth: 110, sortable: true, slots: { default: 'generateStatus' } },
    { field: 'generateTime', title: '生成时间', minWidth: 180, sortable: true, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
    { field: 'operatorId', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'operatorId' } },
    { field: 'exportCount', title: '导出次数', minWidth: 100, sortable: true },
    { field: 'targetTotalYoy', title: '指标总数同比(%)', minWidth: 150, sortable: true },
    { field: 'targetTotalQoq', title: '指标总数环比(%)', minWidth: 150, sortable: true },
    { field: 'targetEnableNumYoy', title: '启用指标数同比(%)', minWidth: 160, sortable: true },
    { field: 'targetEnableNumQoq', title: '启用指标数环比(%)', minWidth: 160, sortable: true },
    { field: 'targetWarnNumYoy', title: '预警指标数同比(%)', minWidth: 150, sortable: true },
    { field: 'targetWarnNumQoq', title: '预警指标数环比(%)', minWidth: 150, sortable: true },
    { title: '操作', width: 180, fixed: 'right', slots: { default: 'actions' } },
  ];
}

// ==================== 详情抽屉字段配置 ====================
export const detailFields = [
  { key: 'reportCycle', label: '报表周期' },
  { key: 'statStartTime', label: '统计开始时间', formatter: (val) => val ? new Date(val).toLocaleString() : '-' },
  { key: 'statEndTime', label: '统计结束时间', formatter: (val) => val ? new Date(val).toLocaleString() : '-' },
  { key: 'targetTotal', label: '指标总数' },
  { key: 'targetEnableNum', label: '启用指标数' },
  { key: 'targetWarnNum', label: '预警指标数' },
  { key: 'activityJoinNum', label: '活动参与人数' },
  { key: 'resourceLearnRate', label: '资源学习完成率(%)' },
  { key: 'generateStatus', label: '生成状态' },
  { key: 'generateTime', label: '生成时间', formatter: (val) => val ? new Date(val).toLocaleString() : '-' },
  { key: 'operatorId', label: '操作人ID' },
  { key: 'exportCount', label: '导出次数' },
  { key: 'targetTotalYoy', label: '指标总数同比(%)' },
  { key: 'targetTotalQoq', label: '指标总数环比(%)' },
  { key: 'targetEnableNumYoy', label: '启用指标数同比(%)' },
  { key: 'targetEnableNumQoq', label: '启用指标数环比(%)' },
  { key: 'targetWarnNumYoy', label: '预警指标数同比(%)' },
  { key: 'targetWarnNumQoq', label: '预警指标数环比(%)' },
  { key: 'creator', label: '创建者' },
];
