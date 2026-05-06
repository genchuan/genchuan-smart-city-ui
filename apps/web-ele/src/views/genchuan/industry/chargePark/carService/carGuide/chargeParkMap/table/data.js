// charge-park-map/table/data.js
export function useFormSchema() {
  return [
    {
      fieldName: 'userName',
      label: '用户',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户',
      },
      isSearch: true,
    },
    {
      fieldName: 'queryLocation',
      label: '查询位置',
      component: 'Input',
      componentProps: { placeholder: '支持模糊查询' },
      isSearch: true,
    },
    // {
    //   fieldName: 'queryTime',
    //   label: '查询时间',
    //   component: 'DatePicker',
    //   componentProps: {
    //     type: 'daterange',
    //     valueFormat: 'YYYY-MM-DD HH:mm:ss',
    //     startPlaceholder: '开始时间',
    //     endPlaceholder: '结束时间',
    //   },
    //   isSearch: true,
    // },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '查询ID', minWidth: 100, slots: { default: 'id' } },
    { field: 'userName', title: '用户', minWidth: 120, slots: { default: 'userName' } },
    { field: 'queryLocation', title: '查询位置', minWidth: 180, slots: { default: 'queryLocation' } },
    { field: 'queryTime', title: '查询时间', minWidth: 160 },
    { field: 'resultCount', title: '查询结果数', minWidth: 120,},
    { field: 'responseDuration', title: '响应时长(ms)', minWidth: 120,},
    { title: '操作', width: 150, fixed: 'right', slots: { default: 'actions' } },
  ];
}
