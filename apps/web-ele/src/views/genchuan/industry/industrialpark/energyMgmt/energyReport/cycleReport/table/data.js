// data.js - 筛选表单和表格列配置
// 筛选搜索表单
export function useFormSchema() {
  return [
    { fieldName: 'reportType', label: '报表周期', component: 'Select', componentProps: { options: [
          { label: '日报', value: '日报' }, { label: '周报', value: '周报' }, { label: '月报', value: '月报' },
          { label: '季报', value: '季报' }, { label: '半年报', value: '半年报' }, { label: '年报', value: '年报' },
          { label: '自定义报表', value: '自定义报表' }
        ] }, isSearch: true },
    { fieldName: 'reportTimeStart', label: '统计开始时间', component: 'DatePicker', componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' }, isSearch: true },
    { fieldName: 'reportTimeEnd', label: '统计结束时间', component: 'DatePicker', componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' }, isSearch: true },
    { fieldName: 'generateStatus', label: '生成状态', component: 'Select', componentProps: { options: [
          { label: '已生成', value: '已生成' }, { label: '生成中', value: '生成中' }, { label: '生成失败', value: '生成失败' }
        ] }, isSearch: true },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'reportType', title: '报表周期', minWidth: 120, sortable: true,
      slots: { default: 'reportType' }
    },
    { field: 'reportTime', title: '统计时段', minWidth: 240, sortable: true, slots: { default: 'reportTime' } },
    { field: 'totalEnergy', title: '总能耗量(kWh)', minWidth: 130, sortable: true, slots: { default: 'totalEnergy' } },
    { field: 'unitEnergy', title: '单位能耗(kWh/㎡)', minWidth: 140, sortable: true, slots: { default: 'unitEnergy' } },
    { field: 'saveEnergy', title: '节能总量(kWh)', minWidth: 130, sortable: true, slots: { default: 'saveEnergy' } },
    { field: 'alarmCount', title: '异常预警数(次)', minWidth: 130, sortable: true, slots: { default: 'alarmCount' } },
    { field: 'controlDeviceCount', title: '管控设备数(台)', minWidth: 140, sortable: true, slots: { default: 'controlDeviceCount' } },
    { field: 'generateStatus', title: '生成状态', minWidth: 100, sortable: true, slots: { default: 'generateStatus' } },
    { field: 'createTime', title: '报表生成时间', minWidth: 160, sortable: true },
    { field: 'creator', title: '操作人', minWidth: 120, sortable: true, slots: { default: 'operator' } },
    { field: 'exportCount', title: '报表导出次数', minWidth: 120, sortable: true },
    { field: 'yoyChange', title: '同比变化(%)', minWidth: 120, sortable: true },
    { field: 'momChange', title: '环比变化(%)', minWidth: 120, sortable: true },
    { title: '操作', width: 180, fixed: 'right', slots: { default: 'actions' } },
  ];
}

export const cycleTypeOptions = [
  { label: '全部', value: '' },
  { label: '日报', value: '日报' },
  { label: '周报', value: '周报' },
  { label: '月报', value: '月报' },
  { label: '季报', value: '季报' },
  { label: '半年报', value: '半年报' },
  { label: '年报', value: '年报' },
  { label: '自定义报表', value: '自定义报表' },
];
