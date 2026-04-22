/** 代付订单表单配置 */
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
      fieldName: 'orderNo',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'merchantId',
      label: '商户ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入商户ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
      isRequired: true,
    },
    {
      fieldName: 'carNo',
      label: '车牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌',
        maxLength: 20,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'amount',
      label: '金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入金额',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,
      isRequired: true,
    },
    {
      fieldName: 'payType',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付方式',
        options: [
          { label: '微信支付', value: 'wechat' },
          { label: '支付宝', value: 'alipay' },
          { label: '银联', value: 'unionpay' },
        ],
      },
      labelWidth: 120,
      isRequired: true,
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待支付', value: 'pending_pay' },
          { label: '已支付', value: 'paid' },
          { label: '已完成', value: 'completed' },
          { label: '已取消', value: 'cancelled' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
        maxLength: 200,
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
  ];
}
/** 代付订单表格列配置 */
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
      minWidth: 160,
      sortable: true,
      slots: { default: 'orderNo' },
    },
    {
      field: 'merchantId',
      title: '商户ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'carNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'amount',
      title: '金额',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'payType',
      title: '支付方式',
      minWidth: 120,
      sortable: true,
      slots: { default: 'payType' },
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'payTime',
      title: '支付时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 160,
      sortable: true,
      customRender: ({ text }) => text || '-',
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