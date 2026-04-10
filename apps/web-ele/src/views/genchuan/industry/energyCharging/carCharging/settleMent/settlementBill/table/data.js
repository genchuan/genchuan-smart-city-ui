 /** 结算单表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'billCode',
      label: '结算单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入结算单编号',
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'cooperator',
      label: '合作方名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入合作方名称'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'settlementCycle',
      label: '结算周期',
      component: 'Input',
      componentProps: {
        placeholder: '请输入结算周期'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'settlementAmount',
      label: '总结算金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入总结算金额',
        precision: 2
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'sharingAmount',
      label: '分账结算金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入分账结算金额',
        precision: 2
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'billStatus',
      label: '结算状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择结算状态',
        options: [
          { label: '待审核', value: '待审核' },
          { label: '审核通过', value: '审核通过' },
          { label: '结算中', value: '结算中' },
          { label: '已完成', value: '已完成' },
          { label: '已驳回', value: '已驳回' }
        ]
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'auditUser',
      label: '审核人员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入审核人员'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'auditTime',
      label: '审核时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择审核时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'auditRemark',
      label: '审核备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入审核备注'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'settlementTime',
      label: '结算时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择结算时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'settlementChannel',
      label: '结算渠道',
      component: 'Input',
      componentProps: {
        placeholder: '请输入结算渠道'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注'
      },
      rules: 'required', 
    }, 
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    }
  ];
}

/** 结算单表格列配置（带钻取交互标记） */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'billCode',
      title: '结算单编号',
      minWidth: 150,
      sortable: true, 
      slots: { default: 'billCode' }
    },
    {
      field: 'cooperator',
      title: '合作方名称',
      minWidth: 150,
      sortable: true,  
    },
    {
      field: 'settlementCycle',
      title: '结算周期',
      minWidth: 150,
      sortable: true,  
    },
    {
      field: 'settlementAmount',
      title: '总结算金额',
      minWidth: 150,
      sortable: true,   
    },
    {
      field: 'sharingAmount',
      title: '分账结算金额',
      minWidth: 150,
      sortable: true,   
    },
    {
      field: 'billStatus',
      title: '结算状态',
      minWidth: 150,
      sortable: true,  
    },
    {
      field: 'auditUser',
      title: '审核人员',
      minWidth: 150,
      sortable: true,  
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 180,
      sortable: true // 无钻取交互
    },
    {
      field: 'auditRemark',
      title: '审核备注',
      minWidth: 180,
      sortable: true // 无钻取交互
    },
    {
      field: 'settlementTime',
      title: '结算时间',
      minWidth: 180,
      sortable: true,  
    },
    {
      field: 'settlementChannel',
      title: '结算渠道',
      minWidth: 150,
      sortable: true,  
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true // 无钻取交互
    }, 
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true, 
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
} 