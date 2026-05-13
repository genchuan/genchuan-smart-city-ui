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
