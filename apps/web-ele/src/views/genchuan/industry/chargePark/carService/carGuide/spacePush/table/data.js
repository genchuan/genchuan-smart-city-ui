// space-push/table/data.js
export function useFormSchema() {
  return [
    {
      fieldName: 'userName',
      label: '用户',
      component: 'Input',
      componentProps: { placeholder: '请输入用户名', clearable: true },
      isSearch: true,
    },
    {
      fieldName: 'stationName',
      label: '场站名称',
      component: 'Input',
      componentProps: { placeholder: '请输入场站名称', clearable: true },
      isSearch: true,
    },
    {
      fieldName: 'status',
      label: '推送状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择推送状态',
        clearable: true,
        options: [
          { label: '待推送', value: '待推送' },
          { label: '已推送', value: '已推送' },
        ],
      },
      isSearch: true,
    },
    {
      fieldName: 'pushTime',
      label: '推送时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        defaultTime: [new Date(2000, 0, 1, 0, 0, 0), new Date(2000, 0, 1, 23, 59, 59)],
        clearable: true,
      },
      isSearch: true,
    },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '推送ID', minWidth: 100, slots: { default: 'id' } },
    { field: 'userName', title: '用户', minWidth: 120, slots: { default: 'userName' } },
    { field: 'stationName', title: '场站', minWidth: 150, slots: { default: 'stationName' } },
    { field: 'spaceInfo', title: '空位信息', minWidth: 150, slots: { default: 'spaceInfo' } },
    { field: 'pushTime', title: '推送时间', minWidth: 160 },
    { field: 'status', title: '推送状态', minWidth: 100, slots: { default: 'status' } },
    { field: 'pushResult', title: '推送结果', minWidth: 100, slots: { default: 'pushResult' } },
    { title: '操作', width: 150, fixed: 'right', slots: { default: 'actions' } },
  ];
}
