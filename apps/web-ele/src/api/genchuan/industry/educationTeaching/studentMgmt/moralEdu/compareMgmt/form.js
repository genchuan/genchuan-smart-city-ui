// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'className',
      label: '班级',
      component: 'Input',
      componentProps: { placeholder: '请输入班级名称' },
      labelWidth: '100',
    },
    {
      fieldName: 'cycle',
      label: '评比周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择评比周期',
        options: [
          { label: '周', value: '周' },
          { label: '月', value: '月' },
          { label: '学期', value: '学期' },
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
          { label: '打分中', value: '打分中' },
          { label: '已汇总', value: '已汇总' },
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
    { field: 'className', title: '班级', minWidth: 180, sortable: true, slots: { default: 'className' } },
    { field: 'cycle', title: '评比周期', minWidth: 100, sortable: true, },
    { field: 'totalScore', title: '总得分', minWidth: 100, sortable: true, },
    { field: 'rankNo', title: '排名', minWidth: 80, sortable: true, },
    { field: 'awardName', title: '授予称号', minWidth: 120, sortable: true, },
    { field: 'awardTime', title: '授予时间', minWidth: 180, sortable: true, slots: { default: 'awardTime' } },
    { field: 'scoreUser', title: '打分人', minWidth: 100, sortable: true, },
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

// 发起表单 schema（添加 status 和 totalScore）
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'className',
      label: '班级',
      component: 'Input',
      componentProps: { placeholder: '请输入班级名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'cycle',
      label: '评比周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择评比周期',
        options: [
          { label: '周', value: '周' },
          { label: '月', value: '月' },
          { label: '学期', value: '学期' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'totalScore',               // 新增总得分字段（默认为0，后端要求非空）
      label: '总得分',
      component: 'InputNumber',
      componentProps: {
        placeholder: '总得分（默认0）',
        min: 0,
        max: 100,
        precision: 2,
        disabled: true,                      // 发起时不可修改，由后续打分确定
        style: 'width: 100%',
      },
      defaultValue: 0,
      labelWidth: '100',
    },
    {
      fieldName: 'status',                   // 新增状态字段
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '状态',
        disabled: true,                      // 发起时固定为“打分中”
        options: [
          { label: '打分中', value: '打分中' },
          { label: '已汇总', value: '已汇总' },
        ],
      },
      defaultValue: '打分中',
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

// 编辑表单 schema（添加 status 和 totalScore，且设为只读）
export function useEditFormSchema() {
  return [
    {
      fieldName: 'className',
      label: '班级',
      component: 'Input',
      componentProps: { placeholder: '请输入班级名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'cycle',
      label: '评比周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择评比周期',
        disabled: true,
        options: [
          { label: '周', value: '周' },
          { label: '月', value: '月' },
          { label: '学期', value: '学期' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'totalScore',
      label: '总得分',
      component: 'InputNumber',
      componentProps: {
        placeholder: '总得分',
        disabled: true,                      // 编辑时不可修改得分
        min: 0,
        max: 100,
        precision: 2,
        style: 'width: 100%',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '状态',
        disabled: true,
        options: [
          { label: '打分中', value: '打分中' },
          { label: '已汇总', value: '已汇总' },
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

// 打分表单 schema
export function useScoreFormSchema() {
  return [
    {
      fieldName: 'totalScore',
      label: '总得分',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入总得分', min: 0, max: 100, precision: 2, step: 1, style: 'width: 100%' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'scoreUser',
      label: '打分人',
      component: 'Input',
      componentProps: { placeholder: '请输入打分人姓名' },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 授予表单 schema
export function useAwardFormSchema() {
  return [
    {
      fieldName: 'awardName',
      label: '授予称号',
      component: 'Input',
      componentProps: { placeholder: '请输入授予称号（如：文明班级）' },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  editText: '编辑评比',
  addText: '发起评比',
  scoreText: '打分',
  awardText: '授予称号',
  excelName: '评比管理列表',
};
