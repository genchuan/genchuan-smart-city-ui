 /** 设备监测表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'rateCode',
      label: '方案编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入方案编号',
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'rateName',
      label: '方案名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入方案名称'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'applyScene',
      label: '适用场景',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用场景'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'rateRule',
      label: '费率规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入费率规则'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'effectTime',
      label: '生效时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生效时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'expireTime',
      label: '失效时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择失效时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'applyStation',
      label: '适用场站',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用场站'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'applyGroup',
      label: '适用集团',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用集团'
      },
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'rateStatus',
      label: '费率状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择费率状态',
        options: [
          { label: '未生效', value: '未生效' },
          { label: '已生效', value: '已生效' },
          { label: '已失效', value: '已失效' }
        ]
      },
      rules: 'required',
      isSearch: true
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

/** 设备监测表格列配置（带钻取交互标记） */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'rateCode',
      title: '方案编号',
      minWidth: 120,
      sortable: true, 
      slots: { default: 'rateCode' }
    },
    {
      field: 'rateName',
      title: '方案名称',
      minWidth: 200,
      sortable: true,  
    },
    {
      field: 'applyScene',
      title: '适用场景',
      minWidth: 120,
      sortable: true,  
    },
    {
      field: 'rateRule',
      title: '费率规则',
      minWidth: 120,
      sortable: true,   
    },
    {
      field: 'effectTime',
      title: '生效时间',
      minWidth: 180,
      sortable: true // 无钻取交互
    },
    {
      field: 'expireTime',
      title: '失效时间',
      minWidth: 180,
      sortable: true // 无钻取交互
    },
    {
      field: 'applyStation',
      title: '适用场站',
      minWidth: 200,
      sortable: true,  
    },
    {
      field: 'applyGroup',
      title: '适用集团',
      minWidth: 200,
      sortable: true,  
    },
    {
      field: 'rateStatus',
      title: '费率状态',
      minWidth: 120,
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
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
} 