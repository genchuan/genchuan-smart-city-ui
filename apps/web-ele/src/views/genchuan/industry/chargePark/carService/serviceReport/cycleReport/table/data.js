// 筛选搜索表单
export function useFormSchema() {
  return [
    { fieldName: 'reportCycle', label: '报表周期', component: 'Select', componentProps: { options: [
          { label: '日报', value: '日报' }, { label: '周报', value: '周报' }, { label: '月报', value: '月报' },
          { label: '季报', value: '季报' }, { label: '半年报', value: '半年报' }, { label: '年报', value: '年报' },
          { label: '自定义报表', value: '自定义报表' }
        ] }, isSearch: true },
    { fieldName: 'statStartTime', label: '统计开始时间', component: 'DatePicker', componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' }, isSearch: true },
    { fieldName: 'statEndTime', label: '统计结束时间', component: 'DatePicker', componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' }, isSearch: true },
    { fieldName: 'generateStatus', label: '生成状态', component: 'Select', componentProps: { options: [
          { label: '已生成', value: '已生成' }, { label: '生成中', value: '生成中' }, { label: '生成失败', value: '生成失败' }
        ] }, isSearch: true },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { type: 'seq', title: '序号', width: 60 },
    { field: 'reportCycle', title: '报表周期', minWidth: 120, slots: { default: 'reportCycle' } },
    { field: 'statTime', title: '统计时段', minWidth: 240, slots: { default: 'statTime' } },
    { field: 'rescueCompleteRate', title: '救援完成率(%)', minWidth: 120, slots: { default: 'rescueCompleteRate' } },
    { field: 'reserveSuccessRate', title: '预约成功率(%)', minWidth: 120, slots: { default: 'reserveSuccessRate' } },
    { field: 'complaintHandleRate', title: '投诉处理率(%)', minWidth: 120, slots: { default: 'complaintHandleRate' } },
    { field: 'findCarSuccessRate', title: '寻车定位成功率(%)', minWidth: 140, slots: { default: 'findCarSuccessRate' } },
    { field: 'spacePushSuccessRate', title: '空位推送成功率(%)', minWidth: 140, slots: { default: 'spacePushSuccessRate' } },
    { field: 'effectiveWordingCount', title: '生效话术数', minWidth: 120, slots: { default: 'effectiveWordingCount' } },
    { field: 'rescueTotal', title: '救援总量', minWidth: 100 },
    { field: 'reserveTotal', title: '预约总量', minWidth: 100 },
    { field: 'complaintTotal', title: '投诉总量', minWidth: 100 },
    { field: 'spacePushTotal', title: '空位推送总量', minWidth: 120 },
    { field: 'generateStatus', title: '生成状态', minWidth: 100, slots: { default: 'generateStatus' } },
    { field: 'generateTime', title: '报表生成时间', minWidth: 160 },
    { field: 'operator', title: '操作人', minWidth: 120, slots: { default: 'operator' } },
    { field: 'yearOnYearGrowthRate', title: '同比增长率(%)', minWidth: 130, slots: { default: 'yearOnYearGrowthRate' } },
    { field: 'monthOnMonthGrowthRate', title: '环比增长率(%)', minWidth: 130, slots: { default: 'monthOnMonthGrowthRate' } },
    { field: 'serviceStatusRatio', title: '服务状态占比', minWidth: 180 },
    { title: '操作', width: 180, fixed: 'right', slots: { default: 'actions' } },
  ];
}
