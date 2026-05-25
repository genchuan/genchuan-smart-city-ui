/** 欠费结清记录搜索表单配置 */
/** 欠费识别记录搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'stationName',
      label: '场场站名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场站名称',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [  
          { label: '未结清', value: 'unpaid' },
          { label: '已结清', value: 'cleared' }, 
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'createTimeStart',
      label: '创建时间开始',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'createTimeEnd',
      label: '创建结束时间',  
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
      isSearch: true,
    },
  ];
}
/** 欠费结清记录表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'recordNo',
      title: '记录编号',
      minWidth: 160,
      sortable: true,
      slots: { default: 'recordNo' },
    },
    {
      field: 'plateNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
      slots: { default: 'plateNo' },
    },
    {
      field: 'orderIds',
      title: '关联欠费订单ID',
      minWidth: 200,
      sortable: true,
      slots: { default: 'orderIds' },
    },
    {
      field: 'arrearAmount',
      title: '欠费金额',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'status',
      title: '结清状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 140,
      sortable: true,
      slots: { default: 'stationName' },
    }, 
    {
      field: 'creator',
      title: '创建者',
      minWidth: 120,
      sortable: true,
      slots: { default: 'creator' },
    },
    {
      field: 'updater',
      title: '更新者',
      minWidth: 120,
      sortable: true,
      slots: { default: 'updater' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}