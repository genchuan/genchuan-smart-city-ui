// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'building',
      label: '楼栋',
      component: 'Input',
      componentProps: { placeholder: '请输入楼栋' },
      labelWidth: '100',
    },
    {
      fieldName: 'roomNum',
      label: '房间号',
      component: 'Input',
      componentProps: { placeholder: '请输入房间号' },
      labelWidth: '100',
    },
    {
      fieldName: 'studentId',
      label: '学号',
      component: 'Input',
      componentProps: { placeholder: '请输入学号' },
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '未分配', value: '未分配' },
          { label: '已分配', value: '已分配' },
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
    { field: 'studentId', title: '学号', minWidth: 100, slots: { default: 'studentId' } },
    { field: 'building', title: '楼栋', minWidth: 100, slots: { default: 'building' } },
    { field: 'floor', title: '楼层', minWidth: 80 },
    { field: 'roomNum', title: '房间号', minWidth: 100, slots: { default: 'roomNum' } },
    { field: 'bedNum', title: '床位号', minWidth: 80 },
    { field: 'assignTime', title: '分配时间', minWidth: 180, slots: { default: 'assignTime' } },
    { field: 'adjustTime', title: '调整时间', minWidth: 180, slots: { default: 'adjustTime' } },
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

// 通用床位表单 schema（新增/编辑共用，包含 status 字段）
export function useBedFormSchema() {
  return [
    {
      fieldName: 'building',
      label: '楼栋',
      component: 'Input',
      componentProps: { placeholder: '请输入楼栋' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'floor',
      label: '楼层',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入楼层', min: 1, step: 1, style: 'width: 100%' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'roomNum',
      label: '房间号',
      component: 'Input',
      componentProps: { placeholder: '请输入房间号' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'bedNum',
      label: '床位号',
      component: 'Input',
      componentProps: { placeholder: '请输入床位号' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '未分配', value: '未分配' },
          { label: '已分配', value: '已分配' },
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
  assignText: '分配床位',
  adjustText: '调整床位',
  addText: '新增床位',
  editText: '编辑床位',
  excelName: '床位管理列表',
};
