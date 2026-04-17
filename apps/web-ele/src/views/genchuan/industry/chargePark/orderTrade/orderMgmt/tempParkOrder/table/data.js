/** 新增/修改的表单 - 临时停车订单搜索表单 */
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
      fieldName: 'orderId',
      label: '主订单ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入主订单ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'spaceId',
      label: '车位ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入车位ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'inTime',
      label: '入场时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'outTime',
      label: '离场时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择离场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'parkHour',
      label: '停车时长（小时）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入停车时长',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'fee',
      label: '停车费用',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入停车费用',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,
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
  ];
}

/** 表格字段 - 临时停车订单表格列 */
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
      field: 'orderId',
      title: '主订单ID',
      minWidth: 150,
      sortable: true,
      slots: { default: 'orderId' },
    },
    {
      field: 'spaceId',
      title: '车位ID',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'inTime',
      title: '入场时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'outTime',
      title: '离场时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'parkHour',
      title: '停车时长（小时）',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'fee',
      title: '停车费用',
      minWidth: 150,
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
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}