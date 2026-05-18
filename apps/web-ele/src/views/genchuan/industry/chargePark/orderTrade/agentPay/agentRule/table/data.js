/** 代付规则搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '规则名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则名称',
        maxLength: 100,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'merchantId',
      label: '商户ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入商户ID',
        min: 0,
      },
      labelWidth: 120,
    },
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
      fieldName: 'agentType',
      label: '代付类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择代付类型',
        options: [
          { label: '商户代付', value: 'merchant' },
          { label: '企业代付', value: 'enterprise' },
          { label: '公益代付', value: 'public' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'singleLimit',
      label: '单次限额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入单次限额',
        min: 0,
        precision: 2,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'dayLimit',
      label: '日累计限额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入日累计限额',
        min: 0,
        precision: 2,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'scene',
      label: '适用场景',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用场景',
        maxLength: 100,
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
          { label: '已禁用', value: 'disabled' },
          { label: '已生效', value: 'enabled' },
          { label: '待生效', value: 'pending' }, 
        ],
      },
      labelWidth: 120,
      isSearch: true,
    }, 
  ];
}
/** 代付规则表格列配置 */
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
      field: 'name',
      title: '规则名称',
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
      field: 'agentType',
      title: '代付类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'agentType' },
    },
    {
      field: 'singleLimit',
      title: '单次限额',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'dayLimit',
      title: '日累计限额',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'scene',
      title: '适用场景',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'useCount',
      title: '使用次数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'auditorName',
      title: '审核人名称',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'lastUpdateTime',
      title: '最后更新时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
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