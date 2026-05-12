// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'targetName',
      label: '指标名称',
      component: 'Input',
      componentProps: { placeholder: '请输入指标名称' },
      labelWidth: '100',
    },
    {
      fieldName: 'evaluatorType',
      label: '评价人类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择评价人类型',
        options: [
          { label: '教职工', value: '教职工' },
          { label: '家长', value: '家长' },
          { label: '领导', value: '领导' },
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
          { label: '未启用', value: '未启用' },
          { label: '已启用', value: '已启用' },
        ],
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义
export function getColumns() {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'targetName', title: '指标名称', minWidth: 150, sortable: true, slots: { default: 'targetName' } },
    { field: 'totalScore', title: '指标总分', minWidth: 100, sortable: true, },
    { field: 'warnThreshold', title: '预警阈值', minWidth: 100, sortable: true, },
    { field: 'evaluatorType', title: '评价人类型', minWidth: 120, sortable: true, slots: { default: 'evaluatorType' } },
    { field: 'scoreType', title: '计分方式', minWidth: 120, sortable: true, slots: { default: 'scoreType' } },
    { field: 'enableTime', title: '启用时间', minWidth: 180, sortable: true, slots: { default: 'enableTime' } },
    { field: 'disableTime', title: '停用时间', minWidth: 180, sortable: true, slots: { default: 'disableTime' } },
    { field: 'status', title: '状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true, slots: { default: 'updateTime' } },
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
      fieldName: 'targetName',
      label: '指标名称',
      component: 'Input',
      componentProps: { placeholder: '请输入指标名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'totalScore',
      label: '指标总分',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入总分', min: 0, precision: 2, step: 1, style: 'width: 100%' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'warnThreshold',
      label: '预警阈值',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入预警阈值', min: 0, precision: 2, step: 1, style: 'width: 100%' },
      labelWidth: '100',
    },
    {
      fieldName: 'evaluatorType',
      label: '评价人类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择评价人类型',
        options: [
          { label: '教职工', value: '教职工' },
          { label: '家长', value: '家长' },
          { label: '领导', value: '领导' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'scoreType',
      label: '计分方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择计分方式',
        options: [
          { label: '累计赋分', value: '累计赋分' },
          { label: '接口赋分', value: '接口赋分' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'status',                     // 新增状态字段
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '未启用', value: '未启用' },
          { label: '已启用', value: '已启用' },
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

// 配置弹窗表单 schema
export function useConfigFormSchema() {
  return [
    {
      fieldName: 'totalScore',
      label: '指标总分',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入总分', min: 0, precision: 2, step: 1, style: 'width: 100%' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'warnThreshold',
      label: '预警阈值',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入预警阈值', min: 0, precision: 2, step: 1, style: 'width: 100%' },
      labelWidth: '100',
    },
    {
      fieldName: 'evaluatorType',
      label: '评价人类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择评价人类型',
        options: [
          { label: '教职工', value: '教职工' },
          { label: '家长', value: '家长' },
          { label: '领导', value: '领导' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'scoreType',
      label: '计分方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择计分方式',
        options: [
          { label: '累计赋分', value: '累计赋分' },
          { label: '接口赋分', value: '接口赋分' },
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
  editText: '编辑指标',
  addText: '新增指标',
  configText: '配置指标',
  excelName: '指标管理列表',
};
