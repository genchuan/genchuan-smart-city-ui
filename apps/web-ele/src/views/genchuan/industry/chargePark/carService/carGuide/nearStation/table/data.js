// near-station/table/data.js
export function useFormSchema() {
  return [
    {
      fieldName: 'userName',
      label: '用户',
      component: 'Input',
      componentProps: { placeholder: '请输入用户名' },
      isSearch: true,
    },
    {
      fieldName: 'queryLocation',
      label: '查询位置',
      component: 'Input',
      componentProps: { placeholder: '支持模糊查询' },
      isSearch: true,
    },
    {
      fieldName: 'queryTime',
      label: '查询时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        defaultTime: [new Date(2000, 0, 1, 0, 0, 0), new Date(2000, 0, 1, 23, 59, 59)],
      },
      isSearch: true,
    },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '查询ID', minWidth: 100, slots: { default: 'id' } },
    { field: 'userName', title: '用户', minWidth: 120, slots: { default: 'userName' } },
    { field: 'queryLocationName', title: '查询位置', minWidth: 180, slots: { default: 'queryLocation' } },
    { field: 'queryTime', title: '查询时间', minWidth: 160 },
    { field: 'stationCount', title: '周边场站数', minWidth: 120, slots: { default: 'stationCount' } },
    { field: 'emptyStationCount', title: '空位场站数', minWidth: 120, slots: { default: 'emptyStationCount' } },
  ];
}

/** 场站列表列(卡片/柱状图钻取后用,展示真实场站) */
export function useStationGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'rowIndex', title: '序号', minWidth: 80, slots: { default: 'rowIndex' } },
    { field: 'stationName', title: '场站名称', minWidth: 200, slots: { default: 'stationName' } },
    { field: 'coordinate', title: '经纬度', minWidth: 200 },
    { field: 'distance', title: '距离当前位置(km)', minWidth: 140, sortable: true, slots: { default: 'distance' } },
    { field: 'hasEmpty', title: '空位状态', minWidth: 100, slots: { default: 'hasEmpty' } },
    { title: '操作', width: 180, fixed: 'right', slots: { default: 'stationActions' } },
  ];
}
