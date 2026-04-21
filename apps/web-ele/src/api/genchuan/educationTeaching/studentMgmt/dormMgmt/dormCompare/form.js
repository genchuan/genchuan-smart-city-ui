// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'dormNum',
      label: '宿舍号',
      component: 'Input',
      componentProps: { placeholder: '请输入宿舍号' },
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
    { field: 'dormNum', title: '宿舍号', minWidth: 100, slots: { default: 'dormNum' } },
    { field: 'cycle', title: '评比周期', minWidth: 100 },
    { field: 'score', title: '得分', minWidth: 100 },
    { field: 'rankNo', title: '排名', minWidth: 80 },
    { field: 'scoreUser', title: '打分人', minWidth: 100 },
    { field: 'sumTime', title: '汇总时间', minWidth: 180, slots: { default: 'sumTime' } },
    { field: 'pushTime', title: '推送时间', minWidth: 180, slots: { default: 'pushTime' } },
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

// 编辑表单 schema（添加 status 字段）
export function useEditFormSchema() {
  return [
    {
      fieldName: 'dormNum',
      label: '宿舍',
      component: 'Select',
      componentProps: {
        placeholder: '请选择宿舍',
        disabled: true,
        options: [
          { label: '101', value: '101' },
          { label: '201', value: '201' },
          { label: '202', value: '202' },
          { label: '301', value: '301' },
          { label: '302', value: '302' },
          { label: '401', value: '401' },
        ],
      },
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
      fieldName: 'score',
      label: '得分',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入得分', min: 0, max: 100, precision: 2, step: 1, style: 'width: 100%' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'status',                     // 新增状态字段（只读，不可修改）
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

// 文本常量
export const textObj = {
  editText: '编辑评比',
  addText: '打分',
  summaryText: '汇总',
  pushText: '推送',
  excelName: '宿舍评比列表',
};
