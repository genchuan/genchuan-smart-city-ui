// 评价标准管理 - 真实数据配置

/** 搜索表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '标准分类名称',
      component: 'Input',
      componentProps: { placeholder: '请输入标准分类名称' },
    },
    {
      fieldName: 'systemId',
      label: '适用指标体系',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用指标体系',
        options: [], // 动态加载
      },
    },
    {
      fieldName: 'statusId',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [], // 动态加载
      },
    },
  ];
}

/** 表单配置（新增/编辑标准分类） */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '标准分类名称',
      component: 'Input',
      componentProps: { placeholder: '请输入标准分类名称' },
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
      defaultValue: 1,
      hidden: true,
    },
  ];
}

/** 标准项表单配置 */
export function useItemFormSchema() {
  return [
    {
      fieldName: 'grade',
      label: '标准项等级',
      component: 'Input',
      componentProps: { placeholder: '请输入等级名称，如：优秀、良好' },
      rules: 'required',
    },
    {
      fieldName: 'scoreRange',
      label: '分数范围',
      component: 'Input',
      componentProps: { placeholder: '例如：90-100' },
      rules: 'required',
    },
    {
      fieldName: 'sortNo',
      label: '排序序号',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入整数', min: 1, precision: 0 },
      rules: 'required',
    },
  ];
}

/** 表格列配置 */
export function getGridColumnsByTab(tab) {
  const baseColumns = [
    { type: 'checkbox', width: 40 },
  ];

  const commonColumns = [
    {
      field: 'name',
      title: '标准分类名称',
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
    { field: 'itemCount', title: '标准项数量', minWidth: 120, sortable: true },
    {
      field: 'statusName',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'statusName' },
    },
    { field: 'creatorName', title: '创建人', minWidth: 100, sortable: true },
    { field: 'createTime', title: '创建时间', minWidth: 160, sortable: true },
    { field: 'changeLogShort', title: '变更日志', minWidth: 200, sortable: false },
  ];

  const enableExtraColumns = [
    { field: 'itemCount', title: '标准项数量', minWidth: 120, sortable: true },
    { field: 'creatorName', title: '创建人', minWidth: 100, sortable: true },
    { field: 'createTime', title: '创建时间', minWidth: 160, sortable: true },
    { field: 'lastUseTime', title: '最近使用时间', minWidth: 160, sortable: true },
    { field: 'useCount', title: '使用次数', minWidth: 100, sortable: true },
  ];

  const disableExtraColumns = [
    { field: 'changeLogShort', title: '变更日志', minWidth: 200, sortable: false },
    { field: 'itemCount', title: '标准项数量', minWidth: 120, sortable: true },
    { field: 'creatorName', title: '创建人', minWidth: 100, sortable: true },
    { field: 'createTime', title: '创建时间', minWidth: 160, sortable: true },
    { field: 'updateTime', title: '停用时间', minWidth: 160, sortable: true },
    { field: 'updaterName', title: '停用操作人', minWidth: 120, sortable: true },
  ];

  let dynamicColumns = [];
  if (tab === '全部') dynamicColumns = allExtraColumns;
  else if (tab === '启用') dynamicColumns = enableExtraColumns;
  else if (tab === '停用') dynamicColumns = disableExtraColumns;

  const columns = [
    ... baseColumns,
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
  editText: '编辑标准分类',
  addText: '新增标准分类',
  addItemText: '新增标准项',
  editItemText: '编辑标准项',
  excelName: '标准分类列表',
  excelAllName: '标准分类数据.xlsx',
};
