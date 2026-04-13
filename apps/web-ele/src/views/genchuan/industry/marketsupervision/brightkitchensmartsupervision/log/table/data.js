 
/** 审计记录的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '主键ID',
      searchFilter: true,
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入审计记录ID',
        min: 1,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'operUserId',
      label: '操作人ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入操作人ID',
        min: 1,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'operUserName',
      label: '操作人姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入操作人姓名',
      },
      labelWidth: '100',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        clearable: true,
        filterOption: true,
        options: [
          { label: '查询', value: '查询' },
          { label: '新增', value: '新增' },
          { label: '编辑', value: '编辑' },
          { label: '删除', value: '删除' },
          { label: '导出', value: '导出' },
          { label: '复审', value: '复审' },
          { label: '批量操作', value: '批量操作' },
          { label: '其他', value: '其他' },
        ],
        placeholder: '请选择操作类型',
        showSearch: true,
      },
      fieldName: 'operType',
      label: '操作类型',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        clearable: true,
        filterOption: true,
        options: [
          { label: '成功', value: '成功' },
          { label: '失败', value: '失败' },
        ],
        placeholder: '请选择操作结果',
        showSearch: true,
      },
      fieldName: 'operResult',
      label: '操作结果',
    },
    {
      fieldName: 'operIp',
      label: '操作IP地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入操作IP地址',
      },
      labelWidth: '100',
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'createTime',
      label: '记录创建时间',
    },
  ];
} 
 
/** 审计记录表表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '审计记录ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'operUserId',
      title: '操作人ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'operUserName',
      title: '操作人姓名',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'operTime',
      title: '操作时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'operType',
      title: '操作类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'operObject',
      title: '操作对象',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'operResult',
      title: '操作结果',
      minWidth: 100,
      sortable: true, 
    },
    {
      field: 'batchSelectInfo',
      title: '批量操作信息',
      minWidth: 200,
      sortable: false, 
    },
    {
      field: 'operIp',
      title: '操作IP',
      minWidth: 150,
      sortable: false,
    },
    {
      field: 'operDesc',
      title: '操作描述',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'createTime',
      title: '记录创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' }, // 操作列（查看详情/导出）
    },
  ];
}