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
      fieldName: 'deptName',
      label: '系部',
      component: 'Select',
      componentProps: {
        placeholder: '请选择系部',
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
    { field: 'coopEnterpriseNum', title: '合作企业数', minWidth: 130, sortable: true, slots: { default: 'coopEnterpriseNum' } },
    { field: 'employRate', title: '就业率(%)', minWidth: 120, sortable: true },
    { field: 'studyUpNum', title: '升学人数', minWidth: 120, sortable: true, slots: { default: 'studyUpNum' } },
    { field: 'jobMatchRate', title: '岗位匹配率(%)', minWidth: 150, sortable: true },
    { field: 'generateStatus', title: '生成状态', minWidth: 110, sortable: true, slots: { default: 'generateStatus' } },
    { field: 'generateTime', title: '生成时间', minWidth: 180, sortable: true, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
    { field: 'operatorId', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'operatorId' } },
    { field: 'exportCount', title: '导出次数', minWidth: 100, sortable: true },
    { field: 'coopEnterpriseNumYoy', title: '合作企业数同比(%)', minWidth: 160, sortable: true },
    { field: 'coopEnterpriseNumQoq', title: '合作企业数环比(%)', minWidth: 160, sortable: true },
    { field: 'studyUpNumYoy', title: '升学人数同比(%)', minWidth: 150, sortable: true },
    { field: 'studyUpNumQoq', title: '升学人数环比(%)', minWidth: 150, sortable: true },
    { title: '操作', width: 180, fixed: 'right', slots: { default: 'actions' } },
  ];
}

// ==================== 详情抽屉字段配置 ====================
export const detailFields = [
  { key: 'reportCycle', label: '报表周期' },
  { key: 'statStartTime', label: '统计开始时间', formatter: (val) => val ? new Date(val).toLocaleString() : '-' },
  { key: 'statEndTime', label: '统计结束时间', formatter: (val) => val ? new Date(val).toLocaleString() : '-' },
  { key: 'coopEnterpriseNum', label: '合作企业数' },
  { key: 'employRate', label: '就业率(%)' },
  { key: 'studyUpNum', label: '升学人数' },
  { key: 'jobMatchRate', label: '岗位匹配率(%)' },
  { key: 'generateStatus', label: '生成状态' },
  { key: 'generateTime', label: '生成时间', formatter: (val) => val ? new Date(val).toLocaleString() : '-' },
  { key: 'operatorId', label: '操作人ID' },
  { key: 'exportCount', label: '导出次数' },
  { key: 'coopEnterpriseNumYoy', label: '合作企业数同比(%)' },
  { key: 'coopEnterpriseNumQoq', label: '合作企业数环比(%)' },
  { key: 'studyUpNumYoy', label: '升学人数同比(%)' },
  { key: 'studyUpNumQoq', label: '升学人数环比(%)' },
  { key: 'creator', label: '创建者' },
];
