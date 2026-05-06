/** 临时停车订单搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '订单ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入订单ID',
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
      fieldName: 'reserveStartTime',
      label: '预约开始时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择预约开始时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,

    },
    {
      fieldName: 'reserveEndTime',
      label: '预约结束时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择预约结束时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120, 
    },
    {
      fieldName: 'actualStartTime',
      label: '实际使用开始时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择实际使用开始时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },

    {
      fieldName: 'actualEndTime',
      label: '实际使用结束时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择实际使用结束时间',
        format: 'YYYY-MM-DD HH:mm:ss',
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
      fieldName: 'stationName',
      label: '场站名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场站名称',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'status',
      label: '支付状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付状态',
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
      fieldName: 'createOrderTime',
      label: '订单生成时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择订单生成时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,

    },
    {
      fieldName: 'stationId',
      label: '所属场站ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入所属场站ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,

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
/** 临时停车订单表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '订单ID',
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
    },
    {
      field: 'stationName',
      title: '场站名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'reserveStartTime',
      title: '预约开始时间',
      minWidth: 220,
      sortable: true,
    },
    {
      field: 'reserveEndTime',
      title: '预约结束时间',
      minWidth: 220,
      sortable: true,
    },
    {
      field: 'actualStartTime',
      title: '实际使用开始时间',
      minWidth: 220,
      sortable: true,
    },
    {
      field: 'actualEndTime',
      title: '实际使用结束时间',
      minWidth: 220,
      sortable: true,
    },
    {
      field: 'amount',
      title: '订单金额',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: '支付状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'createOrderTime',
      title: '订单生成时间',
      minWidth: 220,
      sortable: true,
    },
    {
      field: 'payTime',
      title: '支付时间',
      minWidth: 220,
      sortable: true,
    },
    {
      field: 'payMethod',
      title: '支付方式',
      minWidth: 120,
      sortable: true,
      slots: { default: 'payMethod' },
    },
    {
      field: 'archiveTime',
      title: '归档时间',
      minWidth: 220,
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
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 220,
      sortable: true,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}