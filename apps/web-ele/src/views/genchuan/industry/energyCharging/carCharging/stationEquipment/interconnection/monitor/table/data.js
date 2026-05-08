
/** 接口对接统计分析搜索表单 */
export function useFormSchema() {
  return [
    // {
    //   fieldName: 'id',
    //   label: 'id',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '请输入id',
    //   },
    //   labelWidth: '130',
    //   rules: 'required',
    // },
    {
      fieldName: 'connectCode',
      label: '对接编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入对接编号',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'thirdPlatform',
      label: '第三方平台名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入平台名称',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'connectType',
      label: '对接类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择对接类型',
        options: [
          { label: 'REST API', value: 'REST API' },
          { label: 'HTTP API', value: 'HTTP API' },
          { label: 'HTTPS API', value: 'HTTPS API' },
          { label: 'RPC', value: 'RPC' },
          { label: 'SOAP API', value: 'SOAP API' },
          { label: 'WebService', value: 'WebService' },
          { label: 'OPEN API', value: 'OPEN API' }
        ]
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'apiParam',
      label: 'API参数',
      component: 'Input',
      componentProps: {
        placeholder: '请输入接口参数',
        maxlength: 500,
        type: 'textarea',
        rows: 3,
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'syncFreq',
      label: '同步频率(分钟)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入同步频率',
        min: 1,
        precision: 0
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'syncSuccessRate',
      label: '同步成功率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入同步成功率',
        min: 0,
        max: 100,
        precision: 2,
        addonAfter: '%',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'connectStatus',
      label: '对接状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择对接状态',
        options: [
          { label: '未申请', value: '未申请' },
          { label: '审核中', value: '审核中' },
          { label: '已开通', value: '已开通' },
          { label: '已关闭', value: '已关闭' }
        ]
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
      labelWidth: '130',
    }
  ];
}

/** 接口对接统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: 'ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'connectCode',
      title: '对接编号',
      minWidth: 120,
      sortable: true,
      slots: { default: 'connectCode' },
    },
    {
      field: 'thirdPlatform',
      title: '第三方平台',
      minWidth: 160,
      sortable: true,
      slots: { default: 'thirdPlatform' },
    },
    {
      field: 'connectType',
      title: '对接类型',
      minWidth: 130,
      sortable: true,
      slots: { default: 'connectType' },
    },
    {
      field: 'syncFreq',
      title: '同步频率',
      minWidth: 110,
      sortable: true,
    },
    {
      field: 'syncSuccessRate',
      title: '同步成功率(%)',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'connectStatus',
      title: '对接状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'connectStatus' },
      render: (text) => {
        const colorMap = {
          '未申请': '#909399',
          '审核中': '#E6A23C',
          '已开通': '#67C23A',
          '已关闭': '#F56C6C'
        };
        return `<span style="color: ${colorMap[text]}; font-weight: bold;">${text}</span>`;
      }
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 190,
      sortable: true,
      slots: { default: 'createTime' },
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
