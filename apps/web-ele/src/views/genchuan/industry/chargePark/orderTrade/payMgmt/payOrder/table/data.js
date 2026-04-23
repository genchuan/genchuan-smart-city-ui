/** 渠道订单记录搜索表单配置 */
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
      fieldName: 'merchantOrderId',
      label: '商户订单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户订单号',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'channelOrderNo',
      label: '渠道订单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入渠道订单号',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'appId',
      label: '应用ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入应用ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'channelCode',
      label: '渠道编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入渠道编码',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'amount',
      label: '金额（分）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入金额',
        precision: 0,
        min: 0,
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
          { label: '待支付', value: 0 },
          { label: '支付成功', value: 1 },
          { label: '支付失败', value: 2 },
          { label: '已过期', value: 3 },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'expireTime',
      label: '过期时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择过期时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'notifyTime',
      label: '通知时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择通知时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'successTime',
      label: '支付成功时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择支付成功时间',
        format: 'YYYY-MM-DD HH:mm:ss',
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

/** 渠道订单记录表格列配置 */
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
      field: 'merchantOrderId',
      title: '商户订单号',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'channelOrderNo',
      title: '渠道订单号',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'appId',
      title: '应用ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'channelCode',
      title: '渠道编码',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'amount',
      title: '金额（元）',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `¥${(text / 100).toFixed(2)}` : '¥0.00',
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'expireTime',
      title: '过期时间',
      minWidth: 200,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'notifyTime',
      title: '通知时间',
      minWidth: 200,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'successTime',
      title: '支付成功时间',
      minWidth: 200,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 200,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 200,
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