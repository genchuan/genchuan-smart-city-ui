/** 欠费识别记录搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'applyNo',
      label: '申请编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请编号',  
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
          { label: '待审核', value: 'pending_audit' },
          { label: '待执行', value: 'pending_exec' },
          { label: '已完成', value: 'completed' },
          { label: '已驳回', value: 'rejected' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'applyTimeStart',
      label: '申请时间开始',
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
      fieldName: 'applyTimeEnd',
      label: '申请结束时间',
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
/** 退款申请表格列配置 */
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
      field: 'applyNo',
      title: '申请编号',
      minWidth: 160,
      sortable: true,
      slots: { default: 'applyNo' },
    },
    {
      field: 'orderId',
      title: '关联订单ID',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'refundAmount',
      title: '退款金额',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'refundReason',
      title: '退款原因',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'applyTime',
      title: '申请时间',
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
      field: 'applicantId',
      title: '申请人ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'auditUserId',
      title: '审核人ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'operatorId',
      title: '操作人ID',
      minWidth: 120,
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