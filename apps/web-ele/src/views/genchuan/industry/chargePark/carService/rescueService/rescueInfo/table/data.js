/** 救援信息表单配置（用于搜索） */
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
      fieldName: 'rescueType',
      label: '救援类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择救援类型',
        options: [
          { label: '道路救援', value: '道路救援' },
          { label: '充电故障救援', value: '充电故障救援' },
          { label: '停车故障救援', value: '停车故障救援' },
        ],
      },
      isSearch: true,
    },
    {
      fieldName: 'status',
      label: '救援状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择救援状态',
        options: [
          { label: '待派发', value: '待派发' },
          { label: '待认领', value: '待认领' },
          { label: '处理中', value: '处理中' },
          { label: '已完成', value: '已完成' },
        ],
      },
      isSearch: true,
    },
    {
      fieldName: 'archiveStatus',
      label: '归档状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择归档状态',
        options: [
          { label: '未归档', value: '未归档' },
          { label: '已归档', value: '已归档' },
        ],
      },
      isSearch: true,
    },
    {
      fieldName: 'location',
      label: '救援位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入救援位置',
      },
      isSearch: true,
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      isSearch: true,
    },
  ];
}

/** 救援信息表格列配置（带钻取交互） */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '救援ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'userName',
      title: '用户',
      minWidth: 120,
      sortable: true,
      slots: { default: 'user_name' },
    },
    {
      field: 'location',
      title: '救援位置',
      minWidth: 200,
      slots: { default: 'location' },
    },
    {
      field: 'rescueType',
      title: '救援类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'rescue_type' },
    },
    {
      field: 'dispatchTime',
      title: '派发时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'status',
      title: '救援状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'rescueUserName',
      title: '救援人员',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'finishTime',
      title: '完成时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'handleDuration',
      title: '处理时长(秒)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'score',
      title: '评价得分',
      minWidth: 100,
      sortable: true,
      slots: { default: 'score' },
    },
    {
      field: 'archiveStatus',
      title: '归档状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'archive_status' },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
