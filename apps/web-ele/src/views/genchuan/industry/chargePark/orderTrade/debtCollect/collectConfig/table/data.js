/** 追缴配置搜索表单配置 */
export function useFormSchema() {
  return [ 
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
    } 
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
      slots: { default: 'templateId' },
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
      slots: { default: 'operatorId' },
    }, 
    {
      field: 'creator',
      title: '创建者',
      minWidth: 120,
      sortable: true,
      slots: { default: 'creator' },
    },
    {
      field: 'updater',
      title: '更新者',
      minWidth: 120,
      sortable: true,
      slots: { default: 'updater' },
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