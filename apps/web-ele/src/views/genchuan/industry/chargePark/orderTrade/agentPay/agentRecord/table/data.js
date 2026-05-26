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
      fieldName: 'orderNo',
      label: '关联订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        options: [ 
          { label: '正常记录', value: 'normal' },
          { label: '异常记录', value: 'abnormal' }, 
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },  
  ];
}
/** 资金变动记录表格列配置 */
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
      field: 'orderNo',
      title: '关联订单编号',
      minWidth: 160,
      sortable: true,
      slots: { default: 'orderNo' },
    },
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 140,
      sortable: true,
      slots: { default: 'merchantName' },
    },
    {
      field: 'amount',
      title: '变动金额',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'tradeTime',
      title: '交易时间',
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
      field: 'checkerName',
      title: '核查人名称',
      minWidth: 120,
      sortable: true,
      slots: { default: 'checkerName' },
    },
    {
      field: 'checkTime',
      title: '核查时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'checkResult',
      title: '核查结果',
      minWidth: 140,
      sortable: true,
      slots: { default: 'checkResult' },
    },
    {
      field: 'creator',
      title: '创建者',
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
