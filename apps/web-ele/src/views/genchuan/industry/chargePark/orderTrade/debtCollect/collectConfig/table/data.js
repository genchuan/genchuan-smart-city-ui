/** 追缴配置搜索表单配置 */
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
      fieldName: 'configNo',
      label: '配置编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入配置编号',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'collectMethod',
      label: '追缴方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择追缴方式',
        options: [
          { label: '短信', value: 'sms' },
          { label: '站内信', value: 'notify' },
          { label: '电话', value: 'phone' },
        ],
      },
      labelWidth: 120,
    },
    {
      fieldName: 'templateId',
      label: '推送模板ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入推送模板ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'pushFrequency',
      label: '推送频次（小时）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入推送频次',
        precision: 0,
        min: 0,
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
          { label: '未生效', value: 'inactive' },
          { label: '已生效', value: 'active' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'remark',
      label: '配置说明',
      component: 'Input',
      componentProps: {
        placeholder: '请输入配置说明',
        maxLength: 200,
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
/** 追缴配置搜索表单配置 */
/** 追缴配置表格列配置 */
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
      field: 'configNo',
      title: '配置编号',
      minWidth: 160,
      sortable: true,
      slots: { default: 'configNo' },
    },
    {
      field: 'collectMethod',
      title: '追缴方式',
      minWidth: 120,
      sortable: true,
      slots: { default: 'collectMethod' },
    },
    {
      field: 'templateId',
      title: '推送模板ID',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'pushFrequency',
      title: '推送频次（小时）',
      minWidth: 160,
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
      field: 'remark',
      title: '配置说明',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'operatorId',
      title: '操作人ID',
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