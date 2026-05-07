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
      fieldName: 'schoolType',
      label: '院校类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择院校类型',
        options: [
          { label: '公办', value: '公办' },
          { label: '民办', value: '民办' },
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
          { label: '待规划', value: '待规划' },
          { label: '已规划', value: '已规划' },
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
    { field: 'schoolName', title: '目标院校名称', minWidth: 150, slots: { default: 'schoolName' } },
    { field: 'schoolType', title: '院校类型', minWidth: 100, slots: { default: 'schoolType' } },
    { field: 'major', title: '意向专业', minWidth: 120 },
    { field: 'planContent', title: '升学规划内容', minWidth: 180, slots: { default: 'planContent' } },
    { field: 'planTime', title: '规划时间', minWidth: 180, slots: { default: 'planTime' } },
    { field: 'recordTime', title: '跟踪记录时间', minWidth: 180, slots: { default: 'recordTime' } },
    { field: 'status', title: '状态', minWidth: 100, slots: { default: 'status' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 220,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 选择表单 schema（小型弹窗）
export function useSelectFormSchema() {
  return [
    {
      fieldName: 'schoolName',
      label: '目标院校名称',
      component: 'Input',
      componentProps: { placeholder: '请输入目标院校名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'schoolType',
      label: '院校类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择院校类型',
        options: [
          { label: '公办', value: '公办' },
          { label: '民办', value: '民办' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'major',
      label: '意向专业',
      component: 'Input',
      componentProps: { placeholder: '请输入意向专业' },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 规划表单 schema
export function usePlanFormSchema() {
  return [
    {
      fieldName: 'planContent',
      label: '升学规划内容',
      component: 'Input',
      componentProps: { placeholder: '请输入升学规划内容', type: 'textarea', rows: 4 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 跟踪记录表单 schema
export function useRecordFormSchema() {
  return [
    {
      fieldName: 'remark',
      label: '跟踪备注',
      component: 'Input',
      componentProps: { placeholder: '请输入跟踪备注', type: 'textarea', rows: 3 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  selectText: '选择',
  planText: '规划',
  recordText: '记录',
  excelName: '升学管理列表',
};
