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
      fieldName: 'parentName',
      label: '家长姓名',
      component: 'Input',
      componentProps: { placeholder: '请输入家长姓名' },
      labelWidth: '100',
    },
    {
      fieldName: 'readStatus',
      label: '阅读状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择阅读状态',
        options: [
          { label: '未读', value: '未读' },
          { label: '已读', value: '已读' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'parentReplyTime',
      label: '回复时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择回复时间',
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'x',
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义
export function getColumns() {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'communicateTitle', title: '消息标题', minWidth: 200, slots: { default: 'communicateTitle' } },
    { field: 'studentName', title: '学生姓名', minWidth: 100, slots: { default: 'studentName' } },
    { field: 'parentName', title: '家长姓名', minWidth: 100 },
    { field: 'parentReplyContent', title: '家长回复内容', minWidth: 180 },
    { field: 'parentReplyTime', title: '回复时间', minWidth: 180, slots: { default: 'parentReplyTime' } },
    { field: 'teacherReplyContent', title: '老师回复内容', minWidth: 180 },
    { field: 'teacherReplyTime', title: '老师回复时间', minWidth: 180, slots: { default: 'teacherReplyTime' } },
    { field: 'readStatus', title: '阅读状态', minWidth: 100, slots: { default: 'readStatus' } },
    { field: 'replyStatus', title: '回复状态', minWidth: 100, slots: { default: 'replyStatus' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 240,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 老师回复表单 schema
export function useReplyFormSchema() {
  return [
    {
      fieldName: 'teacherReplyContent',
      label: '老师回复内容',
      component: 'Input',
      componentProps: { placeholder: '请输入老师回复内容', type: 'textarea', rows: 4 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 家长提交回复表单 schema
export function useSubmitFormSchema() {
  return [
    {
      fieldName: 'communicateId',
      label: '沟通消息',
      component: 'Select',
      componentProps: {
        placeholder: '请选择要回复的消息',
        filterable: true,
        options: [], // 动态加载未回复的沟通消息列表
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'parentReplyContent',
      label: '回复内容',
      component: 'Input',
      componentProps: { placeholder: '请输入回复内容', type: 'textarea', rows: 4 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  replyText: '回复',
  markReadText: '标记已读',
  viewDetailText: '详情',
  excelName: '家长回复列表',
};
