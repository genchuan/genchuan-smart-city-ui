/** 评价规则管理 - 静态配置 */

/** 搜索表单配置（将适用指标体系、状态改为输入框） */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '规则分类名称',
      component: 'Input',
      componentProps: { placeholder: '请输入规则分类名称' },
    },
    {
      fieldName: 'systemName',
      label: '适用指标体系',
      component: 'Input',
      componentProps: { placeholder: '请输入适用指标体系名称' },
    },
    {
      fieldName: 'statusId',
      label: '状态',
      component: 'Input',
      componentProps: { placeholder: '请输入状态编码（1-启用/2-停用）' },
    },
  ];
}

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
