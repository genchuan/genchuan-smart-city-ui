/** 资金变动记录搜索表单配置 */
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
      fieldName: 'orderNo',
      label: '关联订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联订单编号',
        maxLength: 50,
      },
      labelWidth: 120,
    }, 
    {
      fieldName: 'merchantName',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'amount',
      label: '变动金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入变动金额',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'tradeTime',
      label: '交易时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择交易时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [ 
          { label: '正常记录', value: 'normal' },
          { label: '异常记录', value: 'abnormal' }, 
        ],
      },
      labelWidth: 120,
      isSearch: true,
    }, 
    {
      fieldName: 'checkerName',
      label: '核查人名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入核查人名称',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'checkTime',
      label: '核查时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择核查时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'checkResult',
      label: '核查结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择核查结果',
        options: [
          { label: '待核查', value: 'pending' },
          { label: '核查通过', value: 'passed' },
          { label: '核查驳回', value: 'rejected' },
        ],
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
      fieldName: 'creator',
      label: '创建者',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建者',
        maxLength: 50,
      }, 
      labelWidth: 120,
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
    },
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 140,
      sortable: true,
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
