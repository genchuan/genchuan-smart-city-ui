/** 代付码搜索表单配置 */
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
      fieldName: 'ruleName',
      label: '规则名称',
      component: 'Input',
      componentProps: {
        placeholder: '请选择规则名称',  
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
          { label: '未使用', value: 'unused' },
          { label: '已使用', value: 'used' },
          { label: '已过期', value: 'expired' }, 
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'startTime',
      label: '开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择开始时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'endTime',
      label: '结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择结束时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
      isSearch: true,
    },
  ];
}

/** 生成代付码表单配置 */
export function useGenerateFormSchema() {
  return [
    {
      fieldName: 'merchantId',
      label: '所属商户',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属商户',
        options: [],
      },
      labelWidth: 120,
    },
    {
      fieldName: 'ruleId',
      label: '关联代付规则',
      component: 'Select',
      componentProps: {
        placeholder: '请选择代付规则',
        options: [],
      },
      labelWidth: 120,
    },
    {
      fieldName: 'expireTime',
      label: '过期时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择过期时间',
         type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
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
          { label: '未使用', value: 'unused' },
          { label: '已使用', value: 'used' },
          { label: '已过期', value: 'expired' }, 
        ],
      },
      labelWidth: 120,
    }, 
  ];
}
/** 代付码表格列配置 */
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
      field: 'code',
      title: '代付码',
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
      field: 'ruleName',
      title: '规则名称',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'expireTime',
      title: '过期时间',
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
      field: 'userName',
      title: '用户名称',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'userTel',
      title: '用户手机号',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'useTime',
      title: '使用时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    }, 
    {
      field: 'orderNo',
      title: '关联订单编号',
      minWidth: 160,
      sortable: true,
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
