// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'studentNo',
      label: '学号',
      component: 'Input',
      componentProps: { placeholder: '请输入学号' },
      labelWidth: '100',
    },
    {
      fieldName: 'name',
      label: '姓名',
      component: 'Input',
      componentProps: { placeholder: '请输入姓名' },
      labelWidth: '100',
    },
    {
      fieldName: 'major',
      label: '专业',
      component: 'Input',
      componentProps: { placeholder: '请输入专业' },
      labelWidth: '100',
    },
    {
      fieldName: 'className',
      label: '班级',
      component: 'Input',
      componentProps: { placeholder: '请输入班级' },
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '学籍状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择学籍状态',
        clearable: true,
        options: [
          { label: '在籍', value: '在籍' },
          { label: '休学', value: '休学' },
          { label: '退学', value: '退学' },
          { label: '异动', value: '异动' },
        ],
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义（未修改，如需显示年级可自行添加）
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'studentNo', title: '学号', minWidth: 130, sortable: true, },
    { field: 'name', title: '姓名', minWidth: 100, sortable: true, slots: { default: 'name' } },
    { field: 'educationLevel', title: '学历层次', minWidth: 100, sortable: true, },
    { field: 'studyForm', title: '学习形式', minWidth: 100, sortable: true, },
    { field: 'major', title: '专业', minWidth: 150, sortable: true, slots: { default: 'major' } },
    { field: 'className', title: '班级', minWidth: 150, sortable: true, slots: { default: 'className' } },
    { field: 'studentType', title: '学生类型', minWidth: 100, sortable: true, },
    { field: 'status', title: '学籍状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'phone', title: '联系电话', minWidth: 130, sortable: true, },
    { field: 'parentPhone', title: '家长联系电话', minWidth: 150, sortable: true, },
    { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 180,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 新增/编辑表单 schema（添加年级字段）
export function useCreateFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'studentNo',
      label: '学号',
      component: 'Input',
      componentProps: { placeholder: '请输入学号', disabled: isEdit },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'name',
      label: '姓名',
      component: 'Input',
      componentProps: { placeholder: '请输入姓名' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'idCard',
      label: '身份证号',
      component: 'Input',
      componentProps: { placeholder: '请输入身份证号', disabled: isEdit },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'grade',                     // 新增年级字段
      label: '年级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择年级',
        disabled: isEdit,                    // 编辑时不可修改年级（根据业务调整）
        options: [
          { label: '2021级', value: '2021级' },
          { label: '2022级', value: '2022级' },
          { label: '2023级', value: '2023级' },
          { label: '2024级', value: '2024级' },
          { label: '2025级', value: '2025级' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'educationLevel',
      label: '学历层次',
      component: 'Select',
      componentProps: {
        placeholder: '请选择学历层次',
        options: [
          { label: '中专', value: '中专' },
          { label: '大专', value: '大专' },
          { label: '本科', value: '本科' },
          { label: '研究生', value: '研究生' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'studyForm',
      label: '学习形式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择学习形式',
        options: [
          { label: '全日制', value: '全日制' },
          { label: '非全日制', value: '非全日制' },
          { label: '函授', value: '函授' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'major',
      label: '专业',
      component: 'Input',
      componentProps: { placeholder: '请输入专业' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'className',
      label: '班级',
      component: 'Input',
      componentProps: { placeholder: '请输入班级' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'studentType',
      label: '学生类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择学生类型',
        options: [
          { label: '普通生', value: '普通生' },
          { label: '特长生', value: '特长生' },
          { label: '转学生', value: '转学生' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '学籍状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择学籍状态',
        options: [
          { label: '在籍', value: '在籍' },
          { label: '休学', value: '休学' },
          { label: '退学', value: '退学' },
          { label: '异动', value: '异动' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: { placeholder: '请输入联系电话' },
      labelWidth: '100',
    },
    {
      fieldName: 'parentPhone',
      label: '家长联系电话',
      component: 'Input',
      componentProps: { placeholder: '请输入家长联系电话' },
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
  editText: '编辑学生信息',
  addText: '新增学生',
  excelName: '学生信息列表',
};
