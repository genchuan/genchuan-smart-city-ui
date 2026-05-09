// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'title',
      label: '消息标题',
      component: 'Input',
      componentProps: { placeholder: '请输入消息标题' },
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
          { label: '已发布', value: '已发布' },
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
    { field: 'title', title: '消息标题', minWidth: 200, slots: { default: 'title' } },
    { field: 'content', title: '消息内容', minWidth: 250 },
    { field: 'sendUser', title: '发布人', minWidth: 100 },
    { field: 'sendTime', title: '发布时间', minWidth: 180, slots: { default: 'sendTime' } },
    { field: 'replyContent', title: '反馈内容', minWidth: 180 },
    { field: 'replyTime', title: '反馈时间', minWidth: 180, slots: { default: 'replyTime' } },
    { field: 'interactRate', title: '互动率(%)', minWidth: 100 },
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

// 编辑表单 schema（添加 status 字段）
export function usePublishFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'title',
      label: '消息标题',
      component: 'Input',
      componentProps: { placeholder: '请输入消息标题' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'content',
      label: '消息内容',
      component: 'Input',
      componentProps: { placeholder: '请输入消息内容', type: 'textarea', rows: 5 },
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
          { label: '已发布', value: '已发布' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入备注', type: 'textarea', rows: 2 },
      labelWidth: '100',
    },
  ];
}

// 回复表单 schema（老师回复）
export function useReplyFormSchema() {
  return [
    {
      fieldName: 'replyContent',
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
  createText: '新增消息',
  replyText: '回复',
  editText: '编辑消息',
  excelName: '沟通管理列表',
};
