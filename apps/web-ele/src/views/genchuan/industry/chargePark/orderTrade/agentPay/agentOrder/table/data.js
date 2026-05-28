/** 代付规则搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'merchantName',
      label: '所属商户',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'carNo',
      label: '车牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌',
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
      fieldName: 'payType',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '微信支付', value: 'wechat' },
          { label: '支付宝支付', value: 'alipay' },
          { label: '银行卡支付', value: 'bank' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },

  ];
}

/** 编辑表单配置 */
export function useEditFormSchema() {
  return [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      labelWidth: 100,
      isHidden: true,
    },
    {
      fieldName: 'orderNo',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
        maxLength: 50,
      },
      labelWidth: 100,
    }, 
    {
      fieldName: 'merchantId',
      label: '所属商户',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属商户',
        options: [],
      },
      labelWidth: 100,
    },
    {
      fieldName: 'carNo',
      label: '车牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌',
        maxLength: 20,
      },
      labelWidth: 100,
    },
    {
      fieldName: 'amount',
      label: '金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入金额',
        min: 0,
        step: 0.01,
      },
      labelWidth: 100,
    },
    {
      fieldName: 'payType',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付方式',
        options: [
          { label: '微信支付', value: 'wechat' },
          { label: '支付宝支付', value: 'alipay' },
          { label: '银行卡支付', value: 'bank' },
        ],
      },
      labelWidth: 100,
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
      labelWidth: 100,
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
      field: 'merchantName',
      title: '商户名称',
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