/** 评价对象管理 - 静态枚举配置（字段名与后端完全一致） */

/** 新增/编辑表单配置 - 使用 ID 字段 + 选择器 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '对象名称',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入对象名称' },
    },
    {
      fieldName: 'code',
      label: '对象编码',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入对象编码' },
    },
    {
      fieldName: 'areaCode',
      label: '所属区域',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择所属区域',
        options: [], // 动态加载
        valueField: 'value',
        labelField: 'label',
      },
    },
    {
      fieldName: 'objectTypeId',
      label: '对象类型',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择对象类型',
        options: [],
        valueField: 'value',
        labelField: 'label',
      },
    },
    {
      fieldName: 'managerId',
      label: '负责人',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择负责人',
        options: [],
        valueField: 'value',
        labelField: 'label',
      },
    },
    {
      fieldName: 'managerPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '由负责人自动填充',
        disabled: true, // 禁用输入
      },
    },
    {
      fieldName: 'relatedId',
      label: '关联网格/部门',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择关联网格/部门',
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
      label: '对象名称',
      component: 'Input',
      componentProps: { placeholder: '请输入对象名称' },
    },
    {
      fieldName: 'code',
      label: '对象编码',
      component: 'Input',
      componentProps: { placeholder: '请输入对象编码' },
    },
    {
      fieldName: 'areaName',
      label: '所属区域',
      component: 'Input',
      componentProps: { placeholder: '请输入所属区域' },
    },
    {
      fieldName: 'objectTypeName',
      label: '对象类型',
      component: 'Input',
      componentProps: { placeholder: '请输入对象类型' },
    },
    {
      fieldName: 'managerName',
      label: '负责人',
      component: 'Input',
      componentProps: { placeholder: '请输入负责人' },
    },
    {
      fieldName: 'statusName',
      label: '状态',
      component: 'Input',
      componentProps: { placeholder: '请输入状态' },
    },
  ];
}

/** 表格列配置 - 使用后端实际字段名 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '对象名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' }
    },
    {
      field: 'code',
      title: '对象编码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'code' }
    },
    {
      field: 'areaName',
      title: '所属区域',
      minWidth: 120,
      sortable: true,
      slots: { default: 'areaName' }
    },
    {
      field: 'objectTypeName',
      title: '对象类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'objectTypeName' }
    },
    {
      field: 'managerName',
      title: '负责人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'managerPhone',
      title: '联系电话',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'relatedName',
      title: '关联网格/部门',
      minWidth: 180,
      sortable: true,
      slots: { default: 'relatedName' }
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
      field: 'updateUserName',
      title: '更新人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 160,
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
  { label: '对象名称', key: 'name', required: true },
  { label: '对象编码', key: 'code', required: true },
  { label: '所属区域', key: 'areaName', required: true },
  { label: '对象类型', key: 'objectTypeName', required: true },
  { label: '负责人', key: 'managerName', required: true },
  { label: '联系电话', key: 'managerPhone', required: true },
  { label: '关联网格/部门', key: 'relatedName', required: true },
  { label: '状态ID', key: 'statusId', required: true, defaultValue: 1 },
  { label: '创建人', key: 'createUserName', required: false },
];

export const textObj = {
  editText: '编辑评价对象',
  addText: '新增评价对象',
  excelName: '评价对象列表',
  excelAllName: '评价对象数据.xlsx',
  total: '总计：对象数量{total}；启用{enabled}；停用{disabled}',
};
