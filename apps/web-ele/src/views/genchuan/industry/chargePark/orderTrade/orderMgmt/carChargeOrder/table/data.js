/** 充电订单搜索表单配置 */
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

    },
    {
      fieldName: 'orderNo',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'plateNo',
      label: '车牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌',
        maxLength: 20,
      },
      labelWidth: 120,

    },
    {
      fieldName: 'chargeDuration',
      label: '充电时长（分钟）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入充电时长',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,

    },
    {
      fieldName: 'chargeQuantity',
      label: '充电量（度）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入充电量',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,

    },
    {
      fieldName: 'chargePower',
      label: '充电功率（kw）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入充电功率',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,

    },
    {
      fieldName: 'amount',
      label: '订单金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入订单金额',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,

    },
    {
      fieldName: 'status',
      label: '订单状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择订单状态',
        options: [
          { label: '充电中', value: 'charging' },
          { label: '待支付', value: 'pending_pay' },
          { label: '已支付', value: 'paid' },
          { label: '已完成', value: 'completed' },
          { label: '已取消', value: 'cancelled' },
          { label: '退款中', value: 'refunding' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'createOrderTimeStart',
      label: '订单生成时间',
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
      fieldName: 'createOrderTimeEnd',
      label: '订单结束时间',
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
      fieldName: 'stationName',
      label: '所属场站',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属场站',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'payTime',
      label: '支付时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择支付时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'payMethod',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付方式',
        options: [
          { label: '支付宝', value: 'alipay' },
          { label: '微信支付', value: 'wechat' },
          { label: '现金', value: 'cash' },
        ],
      },
      labelWidth: 120,

    },
    {
      fieldName: 'discountAmount',
      label: '优惠抵扣金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入优惠抵扣金额',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'archiveTime',
      label: '归档时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择归档时间',
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
/** 充电订单表格列配置 */
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
      field: 'orderNo',
      title: '订单编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'orderNo' },
    },
    {
      field: 'plateNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
      slots: { default: 'plateNo' },
    },
    {
      field: 'chargeDuration',
      title: '充电时长（分钟）',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'chargeQuantity',
      title: '充电量（度）',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `${text.toFixed(2)} 度` : '0.00 度',
    },
    {
      field: 'chargePower',
      title: '充电功率（kw）',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `${text.toFixed(2)} kw` : '0.00 kw',
    },
    {
      field: 'amount',
      title: '订单金额',
      minWidth: 120,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 140,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'status',
      title: '订单状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'createOrderTime',
      title: '订单生成时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text ? new Date(Number(text)).toLocaleString() : '-',
    }, 
    {
      field: 'payTime',
      title: '支付时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text ? new Date(Number(text)).toLocaleString() : '-',
    },
    {
      field: 'payMethod',
      title: '支付方式',
      minWidth: 120,
      sortable: true,
      slots: { default: 'payMethod' },
    },
    {
      field: 'discountAmount',
      title: '优惠抵扣金额',
      minWidth: 160,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'archiveTime',
      title: '归档时间',
      minWidth: 220,
      sortable: true,
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
      slots: { default: 'creator' },
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
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 220,
      sortable: true,
    },
    {
      field: 'invoiceStatus',
      title: '开票状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'invoiceStatus' },
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}