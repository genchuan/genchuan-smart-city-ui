/** 异常订单搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'identifyTimeStart',
      label: '异常识别时间',
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
      fieldName: 'identifyTimeEnd',
      label: '异常识别时间',
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
      fieldName: 'orderType',
      label: '订单类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择订单类型',
        options: [ 
          { label: '临时停车', value: 'temp_park' },
          { label: '错时停车', value: 'offtime_park' },
          { label: '汽车充电', value: 'car_charge' },
          { label: '两轮充电', value: 'bike_charge' },
          { label: '共享充电', value: 'share_charge' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'abnormalType',
      label: '异常类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择异常类型',
        options: [ 
          { label: '支付异常', value: 'payment_error' },
          { label: '计费异常', value: 'billing_error' },
          { label: '状态异常', value: 'status_error' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'identifyTime',
      label: '异常识别时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择异常识别时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'status',
      label: '处置状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处置状态',
        options: [ 
          { label: '未处理', value: 'unhandled' },
          { label: '处理中', value: 'handling' },
          { label: '已关闭', value: 'closed' }, 
        ],
      },
      labelWidth: 120,
      isSearch: true,
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
      fieldName: 'ignoreReason',
      label: '忽略理由',
      component: 'Input',
      componentProps: {
        placeholder: '请输入忽略理由',
        maxLength: 200,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'processProgress',
      label: '处置进度',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处置进度',
        maxLength: 100,
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
/** 异常订单表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 100,
      sortable: true, 
      slots: { default: 'id' },
    },
    {
      field: 'orderId',
      title: '订单ID',
      minWidth: 140,
      sortable: true,
      slots: { default: 'orderId' },
    },
    {
      field: 'orderType',
      title: '订单类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'orderType' },
    },
    {
      field: 'abnormalType',
      title: '异常类型',
      minWidth: 140,
      sortable: true,
      slots: { default: 'abnormalType' },
    },
    {
      field: 'identifyTime',
      title: '异常识别时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'status',
      title: '处置状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 140,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'ignoreReason',
      title: '忽略理由',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'processProgress',
      title: '处置进度',
      minWidth: 140,
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