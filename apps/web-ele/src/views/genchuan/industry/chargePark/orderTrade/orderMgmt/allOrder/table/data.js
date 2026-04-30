/** 新增/修改的表单 - 充电停车订单搜索表单 */
export function useFormSchema() {
  return [
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
      fieldName: 'userId',
      label: '用户ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入用户ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'stationId',
      label: '场站ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入场站ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'type',
      label: '订单类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择订单类型',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'status',
      label: '订单状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择订单状态',
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
      fieldName: 'payTimeStart',
      label: '支付开始时间',
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
      fieldName: 'payTimeEnd',
      label: '支付结束时间',
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

/** 表格字段 - 充电停车订单表格列 */
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
      minWidth: 200,
      sortable: true,
      slots: { default: 'orderNo' },
    },
    {
      field: 'plateNo',
      title: '车牌',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'orderType',
      title: '订单类型',
      minWidth: 150,
      sortable: true,
      slots: { default: 'orderType' },
    },
    {
      field: 'amount',
      title: '订单金额',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'discountAmount',
      title: '优惠抵扣金额',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'status',
      title: '订单状态',
      minWidth: 150,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'payTime',
      title: '支付时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'creator',
      title: '创建者',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'updater',
      title: '更新者',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 200,
      sortable: true,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
