// 筛选表单 schema
export function useFormSchema() {
  return [
    {
      fieldName: 'activityName',
      label: '活动名称',
      component: 'Input',
      componentProps: { placeholder: '请输入活动名称' },
      labelWidth: '100',
    },
    {
      fieldName: 'activityType',
      label: '活动类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择活动类型',
        clearable: true,
        options: [
          { label: '党团活动', value: '党团活动' },
          { label: '志愿活动', value: '志愿活动' },
          { label: '其他', value: '其他' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'hostDept',
      label: '主办部门',
      component: 'Select',
      componentProps: {
        placeholder: '请选择主办部门',
        clearable: true,
        options: [
          { label: '学生工作部', value: '1001' },
          { label: '团委', value: '1002' },
          { label: '教务处', value: '1003' },
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
        clearable: true,
        options: [
          { label: '未发布', value: '未发布' },
          { label: '进行中', value: '进行中' },
          { label: '已结束', value: '已结束' },
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
    { field: 'activityName', title: '活动名称', minWidth: 180, sortable: true, slots: { default: 'activityName' } },
    { field: 'activityType', title: '活动类型', minWidth: 100, sortable: true, slots: { default: 'activityType' } },
    { field: 'hostDept', title: '主办部门', minWidth: 120, sortable: true, slots: { default: 'hostDept' } },
    { field: 'startTime', title: '开始时间', minWidth: 180, sortable: true, slots: { default: 'startTime' } },
    { field: 'endTime', title: '结束时间', minWidth: 180, sortable: true, slots: { default: 'endTime' } },
    { field: 'joinNum', title: '参与人数', minWidth: 100, sortable: true, },
    { field: 'publishTime', title: '发布时间', minWidth: 180, sortable: true, slots: { default: 'publishTime' } },
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

// 发布/编辑表单 schema（已加入 photo 字段）
export function useCreateFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'activityName',
      label: '活动名称',
      component: 'Input',
      componentProps: { placeholder: '请输入活动名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'activityType',
      label: '活动类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择活动类型',
        options: [
          { label: '党团活动', value: '党团活动' },
          { label: '志愿活动', value: '志愿活动' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'hostDept',
      label: '主办部门',
      component: 'Select',
      componentProps: {
        placeholder: '请选择主办部门',
        filterable: true,
        options: [
          { label: '学生工作部', value: '1001' },
          { label: '团委', value: '1002' },
          { label: '教务处', value: '1003' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'startTime',
      label: '开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择开始时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'endTime',
      label: '结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择结束时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
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
          { label: '未发布', value: '未发布' },
          { label: '进行中', value: '进行中' },
          { label: '已结束', value: '已结束' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'content',
      label: '活动详情',
      component: 'Input',
      componentProps: { placeholder: '请输入活动详情', type: 'textarea', rows: 4 },
      labelWidth: '100',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入备注', type: 'textarea', rows: 2 },
      labelWidth: '100',
    },
    {
      fieldName: 'photo',
      label: '活动照片地址',
      component: 'Input',
      componentProps: { placeholder: '请输入活动照片URL地址' },
      labelWidth: '100',
    },
  ];
}

// 报名表单 schema（使用 InputNumber 直接输入学生ID）
export function useJoinFormSchema() {
  return [
    {
      fieldName: 'studentId',
      label: '学生ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入学生ID',
        controls: false,
        style: 'width: 100%',
        min: 1,
      },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 记录表单 schema
export function useRecordFormSchema() {
  return [
    {
      fieldName: 'content',
      label: '活动记录',
      component: 'Input',
      componentProps: { placeholder: '请输入活动过程记录', type: 'textarea', rows: 4 },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'joinNum',
      label: '实际参与人数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入实际参与人数', min: 0, step: 1, style: 'width: 100%' },
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  editText: '编辑活动',
  addText: '新增活动',
  joinText: '报名',
  recordText: '活动记录',
  excelName: '德育活动列表',
};
