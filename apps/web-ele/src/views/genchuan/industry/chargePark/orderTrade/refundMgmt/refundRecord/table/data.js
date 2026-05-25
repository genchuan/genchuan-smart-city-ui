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
          { label: '正常记录', value: 'normal' },
          { label: '异常记录', value: 'abnormal' }, 
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
/** 退款记录表格列配置 */
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
      field: 'applyNo',
      title: '关联退款申请编号',
      minWidth: 160,
      sortable: true,
      slots: { default: 'applyNo' },
    },
    {
      field: 'orderId',
      title: '关联订单ID',
      minWidth: 140,
      sortable: true,
      slots: { default: 'orderId' },
    },
    {
      field: 'refundAmount',
      title: '退款金额',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'refundTime',
      title: '退款时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'checkReason',
      title: '核查理由',
      minWidth: 200,
      sortable: true,
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