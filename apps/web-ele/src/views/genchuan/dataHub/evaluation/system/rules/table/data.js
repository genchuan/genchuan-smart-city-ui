/** 评价规则管理 - 静态配置 */

// 适用对象类型（若其他模块需要可保留）
export const objectTypeList = [
  { id: '1', name: '网格' },
  { id: '2', name: '部门' },
  { id: '3', name: '社区' },
  { id: '4', name: '街道' },
];

// 规则类型（保持不变）
export const ruleTypeList = [
  { id: 'rt1', name: '加分' },
  { id: 'rt2', name: '扣分' },
];

// 指标体系（用于表单默认值，实际从接口获取）
export const indexSystemList = [
  { id: 'is_hy', name: '环卫园林一体化考核体系' },
];

// 指标项列表（仅用于表单默认值，实际从接口获取）
export const indexItemList = [];

// 用户列表（保持不变）
export const userList = [
  { id: 'u1', name: '张三' },
  { id: 'u2', name: '李四' },
  { id: 'u3', name: '王五' },
];

// 状态列表（保持不变）
export const statusList = [
  { id: 's1', name: '启用' },
  { id: 's2', name: '停用' },
];

/** 表单配置（新增/编辑规则分类） */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '规则分类名称',
      component: 'Input',
      componentProps: { placeholder: '请输入规则分类名称' },
      rules: 'required',
    },
    {
      fieldName: 'systemId',
      label: '适用指标体系',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用指标体系',
        options: [], // 动态加载
      },
      rules: 'required',
    },
    {
      fieldName: 'statusId',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [], // 动态加载
      },
      rules: '',
      defaultValue: 1,
      hidden: true,
    },
  ];
}

/** 规则项表单配置 */
export function useRuleItemFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '规则项名称',
      component: 'Input',
      componentProps: { placeholder: '请输入规则项名称' },
      rules: 'required',
    },
    {
      fieldName: 'indexId',
      label: '关联指标项',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联指标项',
        options: [], // 动态加载
      },
      rules: 'required',
    },
    {
      fieldName: 'scoreLogic',
      label: '评分逻辑',
      component: 'Input',
      componentProps: { type: 'textarea', placeholder: '请输入评分逻辑' },
      rules: 'required',
    },
    {
      fieldName: 'fullScore',
      label: '满分值',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入满分值', min: 0, step: 0.1 },
      rules: 'required',
    },
    {
      fieldName: 'weight',
      label: '权重',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入权重', min: 0, step: 0.1 },
      rules: 'required',
    },
    {
      fieldName: 'ruleTypeId',
      label: '规则类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择规则类型',
        options: [], // 动态加载
      },
      rules: 'required',
    },
  ];
}

/** 根据标签页获取表格列配置 */
export function getGridColumnsByTab(tab) {
  const baseColumns = [
    { type: 'checkbox', width: 40},
  ];

  const commonColumns = [
    {
      field: 'name',
      title: '规则分类名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'systemName',
      title: '适用指标体系',
      minWidth: 180,
      sortable: true,
      slots: { default: 'systemName' },
    },
  ];

  const allExtraColumns = [
    { field: 'itemCount', title: '规则项数量', minWidth: 120, sortable: true },
    {
      field: 'statusName',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'statusName' },
    },
    { field: 'createByName', title: '创建人', minWidth: 100, sortable: true },
    { field: 'createTime', title: '创建时间', minWidth: 160, sortable: true },
    { field: 'changeLog', title: '变更日志', minWidth: 200, sortable: false },
  ];

  const enableExtraColumns = [
    { field: 'itemCount', title: '规则项数量', minWidth: 120, sortable: true },
    { field: 'createByName', title: '创建人', minWidth: 100, sortable: true },
    { field: 'createTime', title: '创建时间', minWidth: 160, sortable: true },
    {
      field: 'lastUseTime',
      title: '最近使用时间',
      minWidth: 160,
      sortable: true,
    },
    { field: 'useCount', title: '使用次数', minWidth: 100, sortable: true },
  ];

  const disableExtraColumns = [
    { field: 'changeLog', title: '停用原因', minWidth: 200, sortable: false },
    { field: 'itemCount', title: '规则项数量', minWidth: 120, sortable: true },
    { field: 'createByName', title: '创建人', minWidth: 100, sortable: true },
    { field: 'createTime', title: '创建时间', minWidth: 160, sortable: true },
    { field: 'updateTime', title: '停用时间', minWidth: 160, sortable: true },
    {
      field: 'updateByName',
      title: '停用操作人',
      minWidth: 120,
      sortable: true,
    },
  ];

  let dynamicColumns = [];
  switch (tab) {
    case '停用': {
      {
        dynamicColumns = disableExtraColumns;
        // No default
      }
      break;
    }
    case '全部': {
      dynamicColumns = allExtraColumns;
      break;
    }
    case '启用': {
      dynamicColumns = enableExtraColumns;
      break;
    }
  }

  const columns = [
    ...baseColumns,
    ...commonColumns,
    ...dynamicColumns,
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
  return columns;
}

export const textObj = {
  editText: '编辑规则分类',
  addText: '新增规则分类',
  addRuleItemText: '新增规则项',
  excelName: '规则分类列表',
  excelAllName: '规则分类数据.xlsx',
};
