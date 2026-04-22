/** 退款申请搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '主键ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入主键ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
      isSearch: true,
    },
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
      fieldName: 'orderId',
      label: '关联订单ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入关联订单ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'refundAmount',
      label: '退款金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入退款金额',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'refundReason',
      label: '退款原因',
      component: 'Input',
      componentProps: {
        placeholder: '请输入退款原因',
        maxLength: 200,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'applyTime',
      label: '申请时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择申请时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待审核', value: 'pending' },
          { label: '审核通过', value: 'approved' },
          { label: '审核拒绝', value: 'rejected' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'applicantId',
      label: '申请人ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入申请人ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'auditUserId',
      label: '审核人ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入审核人ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'auditTime',
      label: '审核时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择审核时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'operatorId',
      label: '操作人ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入操作人ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'reserve1',
      label: '备用字段1',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备用字段1',
        maxLength: 100,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'reserve2',
      label: '备用字段2',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备用字段2',
        maxLength: 100,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'creator',
      label: '创建者',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建者',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'updater',
      label: '更新者',
      component: 'Input',
      componentProps: {
        placeholder: '请输入更新者',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择更新时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
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