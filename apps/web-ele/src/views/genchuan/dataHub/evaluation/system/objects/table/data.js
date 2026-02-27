/** 评价对象管理 - 静态枚举配置（字段名与后端完全一致） */
// 状态（id 为数字，与后端一致）
export const statusList = [
  { id: 1, name: '启用' },
  { id: 2, name: '停用' }
];

/** 表单配置（新增/编辑）- 字段名与后端一致 */
export function useFormSchema() {
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
      fieldName: 'areaCode',
      label: '所属区域',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属区域',
        options: [
          { label: '上海市', value: '0' },
          { label: '广州市', value: '1' },
        ]
      },
    },
    {
      fieldName: 'objectTypeId',
      label: '对象类型',
      component: 'Select',                // 原为小写 input
      componentProps: {
        placeholder: '请选择对象类型',
        options: []                        // 需从接口动态获取（示例留空）
      },
    },
    {
      fieldName: 'managerId',
      label: '负责人',
      component: 'Select',                // 原为 input
      componentProps: {
        placeholder: '请选择负责人',
        options: []                        // 需从接口动态获取
      },
    },
    {
      fieldName: 'managerPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: { placeholder: '请输入联系电话' },
    },
    {
      fieldName: 'relatedId',
      label: '关联网格/部门',
      component: 'Select',                // 原为 input
      componentProps: {
        placeholder: '请选择关联网格/部门',
        options: []                        // 需从接口动态获取
      },
    }
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
      sortable: true
    },
    {
      field: 'areaName',
      title: '所属区域',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'objectTypeName',
      title: '对象类型',
      minWidth: 100,
      sortable: true
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
      sortable: true
    },
    {
      field: 'statusName',
      title: '状态',
      minWidth: 100,
      sortable: true
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
      field: 'changeLog',
      title: '变更日志',
      minWidth: 200,
      sortable: false,
      formatter: (row) => row.changeLogShort || row.changeLog?.substring(0, 50) + (row.changeLog?.length > 50 ? '...' : '') || '-'
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

// 导入字段映射配置
export const importFields = [
  { label: '对象名称', key: 'name', required: true },
  { label: '对象编码', key: 'code', required: true },
  { label: '所属区域编码', key: 'areaCode', required: true },
  { label: '对象类型ID', key: 'objectTypeId', required: true },
  { label: '负责人ID', key: 'managerId', required: true },
  { label: '联系电话', key: 'managerPhone', required: true },
  { label: '关联网格/部门ID', key: 'relatedId', required: true },
  { label: '状态ID', key: 'statusId', required: true, defaultValue: 1 },
];

export const textObj = {
  editText: '编辑评价对象',
  addText: '新增评价对象',
  excelName: '评价对象列表',
  excelAllName: '评价对象数据.xlsx',
  total: '总计：对象数量{total}；启用{enabled}；停用{disabled}',
};
