/** 评价主体管理 - 静态枚举配置（字段名与后端完全一致） */

/** 新增/编辑表单配置 - 使用 ID 字段 + 选择器 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '主体名称',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入主体名称' },
    },
    {
      fieldName: 'code',
      label: '主体编码',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入主体编码' },
    },
    {
      fieldName: 'subjectTypeId',
      label: '主体类型',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择主体类型',
        options: [], // 动态加载
        valueField: 'value',
        labelField: 'label',
      },
    },
    {
      fieldName: 'contactId',
      label: '联系人',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择联系人',
        options: [],
        valueField: 'value',
        labelField: 'label',
      },
    },
    {
      fieldName: 'contactPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '由负责人自动填充',
        disabled: true, // 禁用输入
      },
    },
    {
      fieldName: 'memberIds',
      label: '成员列表',
      component: 'Select',
      componentProps: {
        placeholder: '请选择成员（人工主体必填）',
        options: [],
        valueField: 'value',
        labelField: 'label',
        multiple: true,
      },
    },
    {
      fieldName: 'statusId',
      label: '状态',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择状态',
        options: [],
        valueField: 'value',
        labelField: 'label',
      },
    },
  ];
}

/** 查询表单配置 - 使用文本输入支持模糊搜索 */
export function useQuerySchema() {
  return [
    {
      fieldName: 'name',
      label: '主体名称',
      component: 'Input',
      componentProps: { placeholder: '请输入主体名称' },
    },
    {
      fieldName: 'code',
      label: '主体编码',
      component: 'Input',
      componentProps: { placeholder: '请输入主体编码' },
    },
    {
      fieldName: 'subjectTypeName',
      label: '主体类型',
      component: 'Input',
      componentProps: { placeholder: '请输入主体类型' },
    },
    {
      fieldName: 'statusName',
      label: '状态',
      component: 'Input',
      componentProps: { placeholder: '请输入状态' },
    },
    {
      field: 'contactName',
      title: '联系人',
      component: 'Input',
      componentProps: { placeholder: '请输入联系人' },
    },
  ];
}

/** 表格列配置 - 使用后端实际字段名 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '主体名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' }
    },
    {
      field: 'code',
      title: '主体编码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'code' }
    },
    {
      field: 'subjectTypeName',
      title: '主体类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'subjectTypeName' }
    },
    {
      field: 'contactName',
      title: '联系人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'contactPhone',
      title: '联系电话',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'memberCount',
      title: '成员数量',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'statusName',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'statusName' }
    },
    {
      field: 'createUserName',
      title: '创建人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'useCount',
      title: '使用次数',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'changeLogShort',
      title: '变更日志',
      minWidth: 200,
      sortable: false,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

// 导入字段映射配置
export const importFields = [
  { label: '主体名称', key: 'name', required: true },
  { label: '主体编码', key: 'code', required: true },
  { label: '主体类型', key: 'subjectTypeName', required: true },
  { label: '联系人', key: 'contactName', required: true },
  { label: '联系电话', key: 'contactPhone', required: true },
  { label: '成员数量', key: 'memberCount', required: false },
  { label: '状态ID', key: 'statusId', required: true, defaultValue: 1 },
  { label: '创建人', key: 'createUserName', required: false },
];

export const textObj = {
  editText: '编辑评价主体',
  addText: '新增评价主体',
  excelName: '评价主体列表',
  excelAllName: '评价主体数据.xlsx',
  total: '总计：主体数量{total}；启用{enabled}；停用{disabled}',
};
