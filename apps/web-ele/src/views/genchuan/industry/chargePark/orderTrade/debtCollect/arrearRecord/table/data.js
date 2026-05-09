/** 欠费结清记录搜索表单配置 */
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
      fieldName: 'recordNo',
      label: '记录编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入记录编号',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
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
      isSearch: true,
    },
    {
      fieldName: 'orderIds',
      label: '关联欠费订单ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联欠费订单ID',
        maxLength: 100,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'arrearAmount',
      label: '欠费金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入欠费金额',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'status',
      label: '结清状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择结清状态',
        options: [
          { label: '未结清', value: 'unpaid' },
          { label: '已结清', value: 'paid' },
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
/** 欠费结清记录表格列配置 */
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
      field: 'plateNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'orderIds',
      title: '关联欠费订单ID',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'arrearAmount',
      title: '欠费金额',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'status',
      title: '结清状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'stationName',
      title: '所属场站',
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
      field: 'reserve1',
      title: '备用字段1',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'reserve2',
      title: '备用字段2',
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