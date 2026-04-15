// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'studentName',
      label: '学生姓名',
      component: 'Input',
      componentProps: { placeholder: '请输入学生姓名' },
      labelWidth: '100',
    },
    {
      fieldName: 'mentalStatus',
      label: '心理状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择心理状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '关注', value: '关注' },
          { label: '高危', value: '高危' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'riskLevel',
      label: '风险等级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择风险等级',
        options: [
          { label: '低', value: '低' },
          { label: '中', value: '中' },
          { label: '高', value: '高' },
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
          { label: '待评估', value: '待评估' },
          { label: '咨询中', value: '咨询中' },
          { label: '已干预', value: '已干预' },
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
    { field: 'studentName', title: '学生姓名', minWidth: 100, slots: { default: 'studentName' } },
    { field: 'mentalStatus', title: '心理状态', minWidth: 100, slots: { default: 'mentalStatus' } },
    { field: 'riskLevel', title: '风险等级', minWidth: 100, slots: { default: 'riskLevel' } },
    { field: 'evaluateTime', title: '评估时间', minWidth: 180, slots: { default: 'evaluateTime' } },
    { field: 'consultTime', title: '咨询预约时间', minWidth: 180, slots: { default: 'consultTime' } },
    { field: 'interveneTime', title: '干预时间', minWidth: 180, slots: { default: 'interveneTime' } },
    { field: 'interveneContent', title: '干预内容', minWidth: 200 },
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

// 建档表单 schema（添加 status 字段）
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'studentId',
      label: '学生',
      component: 'Select',
      componentProps: {
        placeholder: '请选择学生',
        filterable: true,
        remote: true,
        remoteMethod: () => {},
        options: [], // 动态加载
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'mentalStatus',
      label: '心理状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择心理状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '关注', value: '关注' },
          { label: '高危', value: '高危' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'riskLevel',
      label: '风险等级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择风险等级',
        options: [
          { label: '低', value: '低' },
          { label: '中', value: '中' },
          { label: '高', value: '高' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'evaluateTime',
      label: '评估时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择评估时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
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
          { label: '待评估', value: '待评估' },
          { label: '咨询中', value: '咨询中' },
          { label: '已干预', value: '已干预' },
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
  editText: '编辑心理档案',
  addText: '建档',
  excelName: '心理管理列表',
};
