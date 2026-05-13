/** 欠费识别记录搜索表单配置 */
export function useFormSchema() {
  return [ 
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',  
        options: [
          { label: '待核算', value: 'pending' },  
          { label: '已核算', value: 'checked' },  
          { label: '已确认', value: 'confirmed' },  
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'refundTimeStart',
      label: '退款时间开始',
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
      fieldName: 'refundTimeEnd',
      label: '退款结束时间',
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
/** 核算记录表格列配置 */
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
      field: 'checkNo',
      title: '核算编号',
      minWidth: 160,
      sortable: true,
      slots: { default: 'checkNo' },
    },
    {
      field: 'orderId',
      title: '关联订单ID',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'applyAmount',
      title: '申请金额',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'checkResult',
      title: '核算结果',
      minWidth: 140,
      sortable: true,
      slots: { default: 'checkResult' },
    },
    {
      field: 'checkDetail',
      title: '核算明细',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
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