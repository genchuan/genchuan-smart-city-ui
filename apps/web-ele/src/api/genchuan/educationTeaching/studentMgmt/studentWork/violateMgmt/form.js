// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'studentId',
      label: '学号',
      component: 'Input',
      componentProps: { placeholder: '请输入学号' },
      labelWidth: '100',
    },
    {
      fieldName: 'violateType',
      label: '违纪类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择违纪类型',
        options: [
          { label: '仪容仪表', value: '仪容仪表' },
          { label: '行为违规', value: '行为违规' },
          { label: '其他', value: '其他' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'punishType',
      label: '处分类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处分类型',
        options: [
          { label: '警告', value: '警告' },
          { label: '记过', value: '记过' },
          { label: '留校察看', value: '留校察看' },
          { label: '开除', value: '开除' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待审批', value: '待审批' },
          { label: '已执行', value: '已执行' },
          { label: '已预警', value: '已预警' },
        ],
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义（未修改，但为完整展示保留）
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'studentId', title: '学号', minWidth: 100, slots: { default: 'studentId' } },
    { field: 'violateType', title: '违纪类型', minWidth: 120, slots: { default: 'violateType' } },
    { field: 'punishType', title: '处分类型', minWidth: 120, slots: { default: 'punishType' } },
    { field: 'violateTime', title: '违纪时间', minWidth: 180, slots: { default: 'violateTime' } },
    { field: 'violateReason', title: '违纪原因', minWidth: 180 },
    { field: 'auditUser', title: '审批人', minWidth: 120 },
    { field: 'auditTime', title: '审批时间', minWidth: 180, slots: { default: 'auditTime' } },
    { field: 'pushTime', title: '推送时间', minWidth: 180, slots: { default: 'pushTime' } },
    { field: 'warnTime', title: '预警时间', minWidth: 180, slots: { default: 'warnTime' } },
    { field: 'status', title: '状态', minWidth: 100, slots: { default: 'status' } },
    { field: 'creator', title: '创建人', minWidth: 120, slots: { default: 'creator' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 200,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 新增/编辑表单 schema（添加 status 字段）
export function useCreateFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'studentId',
      label: '学号',
      component: 'Input',
      componentProps: { placeholder: '请输入学号' },
      labelWidth: '100',
    },
    {
      fieldName: 'violateType',
      label: '违纪类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择违纪类型',
        options: [
          { label: '仪容仪表', value: '仪容仪表' },
          { label: '行为违规', value: '行为违规' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'punishType',
      label: '处分类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处分类型',
        options: [
          { label: '警告', value: '警告' },
          { label: '记过', value: '记过' },
          { label: '留校察看', value: '留校察看' },
          { label: '开除', value: '开除' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'violateTime',
      label: '违纪时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择违纪时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'violateReason',
      label: '违纪原因',
      component: 'Input',
      componentProps: { placeholder: '请输入违纪原因', type: 'textarea', rows: 2 },
      labelWidth: '100',
    },
    {
      fieldName: 'status',                     // 新增状态字段
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        disabled: isEdit,                      // 编辑时状态不可修改（业务上通常审批后才改变状态）
        options: [
          { label: '待审批', value: '待审批' },
          { label: '已执行', value: '已执行' },
          { label: '已预警', value: '已预警' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入备注', type: 'textarea', rows: 3 },
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  editText: '编辑违纪记录',
  addText: '登记违纪',
  excelName: '违纪管理列表',
};
