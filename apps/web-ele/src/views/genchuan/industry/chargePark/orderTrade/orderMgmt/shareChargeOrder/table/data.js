/** 充电订单搜索表单配置 */
export function useFormSchema() {
  return [
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
  ];
}
/** 设备借出订单表格列配置 */
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
      field: 'userNickname',
      title: '用户昵称',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'lendTime',
      title: '借出时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'returnTime',
      title: '归还时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'actualDuration',
      title: '实际使用时长（分钟）',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'amount',
      title: '订单金额',
      minWidth: 120,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
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
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 140,
      sortable: true,
      slots: { default: 'stationName' },
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
    },
    {
      field: 'archiveTime',
      title: '归档时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
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