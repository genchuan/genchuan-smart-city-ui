/** 指标体系管理 - 数据配置 */

// 适用对象类型字典（模拟，后续可替换为接口）
export const objectTypeList = [
  { id: 'obj_type_001', name: '政府部门' },
  { id: 'obj_type_002', name: '事业单位' },
  { id: 'obj_type_003', name: '国有企业' },
  { id: 'obj_type_004', name: '民营企业' },
  { id: 'obj_type_005', name: '社会组织' },
];

// 状态字典
export const statusList = [
  { id: 1, name: '启用' },
  { id: 2, name: '停用' },
];

/** 新增/编辑表单（基本信息） */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '体系名称',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入体系名称' },
    },
    {
      fieldName: 'code',
      label: '体系编码',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入体系编码' },
    },
    {
      fieldName: 'objectTypeId',
      label: '适用对象类型',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择适用对象类型',
        options: objectTypeList.map(t => ({ label: t.name, value: t.id })),
      },
    },
    {
      fieldName: 'version',
      label: '版本号',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入版本号，如V1.0' },
    },
    {
      fieldName: 'desc',
      label: '描述信息',
      component: 'Input',
      componentProps: { type: 'textarea', placeholder: '请输入描述信息' },
    },
    {
      fieldName: 'statusId',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: statusList.map(s => ({ label: s.name, value: s.id })),
      },
      defaultValue: 1,
      hidden: true,
    },
  ];
}

/** 查询表单（与接口参数对应） */
export function useQuerySchema() {
  return [
    {
      fieldName: 'name',
      label: '体系名称',
      component: 'Input',
      componentProps: { placeholder: '请输入体系名称' },
    },
    {
      fieldName: 'code',
      label: '体系编码',
      component: 'Input',
      componentProps: { placeholder: '请输入体系编码' },
    },
    {
      fieldName: 'objectTypeId',
      label: '适用对象类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用对象类型',
        options: objectTypeList.map(t => ({ label: t.name, value: t.id })),
        allowClear: true,
      },
    },
    {
      fieldName: 'version',
      label: '版本号',
      component: 'Input',
      componentProps: { placeholder: '请输入版本号' },
    },
    {
      fieldName: 'statusId',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: statusList.map(s => ({ label: s.name, value: s.id })),
        allowClear: true,
      },
    },
  ];
}

/** 根据标签页获取表格列配置（严格按照文档要求） */
export function getGridColumnsByTab(tab) {
  // 全部标签列（明细级）
  if (tab === '全部') {
    return [
      { type: 'checkbox', width: 40 },
      { field: 'name', title: '体系名称', minWidth: 150, sortable: true, slots: { default: 'name' } },
      { field: 'code', title: '体系编码', minWidth: 120, sortable: true, slots: { default: 'code' } },
      { field: 'objectTypeName', title: '适用对象类型', minWidth: 120, sortable: true, slots: { default: 'objectTypeName' } },
      { field: 'version', title: '版本号', minWidth: 100, sortable: true },
      { field: 'desc', title: '描述信息', minWidth: 200 },
      { field: 'categoryName', title: '指标分类', minWidth: 120, sortable: true },
      { field: 'itemName', title: '指标项名称', minWidth: 150, sortable: true },
      { field: 'indexTypeName', title: '指标类型', minWidth: 100 },
      { field: 'calcWayName', title: '计算方式', minWidth: 100 },
      { field: 'threshold', title: '达标阈值', minWidth: 100 },
      { field: 'categoryWeight', title: '分类权重', minWidth: 100 },
      { field: 'itemWeight', title: '指标项权重', minWidth: 100 },
      { field: 'createUserName', title: '创建人', minWidth: 100 },
      { field: 'bizCreateTime', title: '创建时间', minWidth: 160, sortable: true },
      { field: 'statusName', title: '状态', minWidth: 100, slots: { default: 'statusName' } },
      { field: 'categoryCount', title: '分类总数', minWidth: 100 },
      { field: 'itemCount', title: '指标项总数', minWidth: 120 },
      {
        title: '操作',
        width: 180,
        fixed: 'right',
        slots: { default: 'actions' },
      },
    ];
  }

  // 启用标签列（体系级）
  if (tab === '启用') {
    return [
      { field: 'name', title: '体系名称', minWidth: 150, sortable: true, slots: { default: 'name' } },
      { field: 'code', title: '体系编码', minWidth: 120, sortable: true, slots: { default: 'code' } },
      { field: 'objectTypeName', title: '适用对象类型', minWidth: 120, sortable: true, slots: { default: 'objectTypeName' } },
      { field: 'version', title: '版本号', minWidth: 100, sortable: true },
      { field: 'categoryCount', title: '分类总数', minWidth: 100 },
      { field: 'itemCount', title: '指标项总数', minWidth: 120 },
      { field: 'createUserName', title: '创建人', minWidth: 100 },
      { field: 'bizCreateTime', title: '创建时间', minWidth: 160, sortable: true },
      { field: 'lastUseTime', title: '最近使用时间', minWidth: 160 },
      { field: 'useCount', title: '使用次数', minWidth: 100 },
      {
        title: '操作',
        width: 160,
        fixed: 'right',
        slots: { default: 'actions' },
      },
    ];
  }

  // 停用标签列（体系级）
  if (tab === '停用') {
    return [
      { field: 'name', title: '体系名称', minWidth: 150, sortable: true, slots: { default: 'name' } },
      { field: 'code', title: '体系编码', minWidth: 120, sortable: true, slots: { default: 'code' } },
      { field: 'objectTypeName', title: '适用对象类型', minWidth: 120, sortable: true, slots: { default: 'objectTypeName' } },
      { field: 'version', title: '版本号', minWidth: 100, sortable: true },
      { field: 'changeLogShort', title: '停用原因', minWidth: 200 },
      { field: 'createUserName', title: '创建人', minWidth: 100 },
      { field: 'bizCreateTime', title: '创建时间', minWidth: 160, sortable: true },
      { field: 'updateTime', title: '停用时间', minWidth: 160, sortable: true },
      { field: 'updateUserName', title: '停用操作人', minWidth: 120 },
      {
        title: '操作',
        width: 120,
        fixed: 'right',
        slots: { default: 'actions' },
      },
    ];
  }

  return [];
}

export const textObj = {
  editText: '编辑指标体系',
  addText: '新增指标体系',
  versionText: '新增版本',
  excelName: '指标体系列表',
  excelAllName: '指标体系数据.xlsx',
};
