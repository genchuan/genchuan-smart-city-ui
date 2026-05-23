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
          { label: '未追缴', value: 'uncollected' },
          { label: '追缴中', value: 'collecting' },
          { label: '已完成', value: 'completed' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'identifyTimeStart',
      label: '识别时间开始',
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
      fieldName: 'identifyTimeEnd',
      label: '识别时间结束',  
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
/** 欠费追缴记录表格列配置 */
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
    },
    {
      field: 'plateNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'arrearOrderCount',
      title: '欠费订单数',
      minWidth: 140,
      sortable: true,
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
      title: '追缴状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'collectProgress',
      title: '追缴进度',
      minWidth: 140,
      sortable: true,
    }, 
    {
      field: 'creator',
      title: '创建者',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'updater',
      title: '更新者',
      minWidth: 120,
      sortable: true,
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