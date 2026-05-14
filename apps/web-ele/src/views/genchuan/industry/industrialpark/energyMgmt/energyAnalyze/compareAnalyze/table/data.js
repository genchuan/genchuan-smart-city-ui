// data.js - 搜索表单与表格列配置（能耗对比分析）
export function useFormSchema() {
  return [
    { fieldName: 'compareName', label: '对比名称', component: 'Input', componentProps: { placeholder: '请输入对比名称' }, isSearch: true },
    { fieldName: 'compareDim', label: '对比维度', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '同比', value: '同比' }, { label: '环比', value: '环比' }, { label: '区域间', value: '区域间' }, { label: '设备间', value: '设备间' }] }, isSearch: true },
    { fieldName: 'compareTime', label: '对比时间', component: 'DateRangePicker', componentProps: { style: { width: '100%' }, valueFormat: 'YYYY-MM-DD HH:mm:ss' }, isSearch: true },
  ];
}

export function useGridColumns({ getUserName, showCompareDetail, showProblemDetail, showUserDetail, filterByDim }) {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '对比ID', minWidth: 80, sortable: true, slots: { default: 'id' } },
    { field: 'compareName', title: '对比名称', minWidth: 180, sortable: true, slots: { default: 'compare_name' } },
    { field: 'compareDim', title: '对比维度', minWidth: 100, sortable: true, slots: { default: 'compare_dim' }, formatter: ({ compareDim }) => compareDim },
    { field: 'compareTime', title: '对比时间', minWidth: 120, sortable: true },
    { field: 'energyDiff', title: '能耗差值(kWh)', minWidth: 120, sortable: true },
    { field: 'changeRate', title: '变化率(%)', minWidth: 100, sortable: true, slots: { default: 'change_rate' } },
    { field: 'forecast', title: '趋势预测', minWidth: 150, showOverflow: true },
    { field: 'problem', title: '问题定位', minWidth: 150, showOverflow: true, slots: { default: 'problem' } },
    { field: 'plan', title: '优化方案', minWidth: 150, showOverflow: true },
    { field: 'handleUser', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'handle_user' }, formatter: ({ handleUser }) => getUserName(handleUser) },
    { title: '操作', width: 200, fixed: 'right', slots: { default: 'actions' } },
  ];
}
