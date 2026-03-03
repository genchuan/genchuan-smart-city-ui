/** 新增/修改的表单/列表的搜索表单 - 改造为道路预警管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '配置名称',
      component: 'Input',
      componentProps: { placeholder: '请输入预警编号' },
      labelWidth: '100',
      rules: 'required', // 预警编号为必填项
    },
    {
      fieldName: 'collectFrequency',
      label: '采集频率（分钟）',
      component: 'Input',
      componentProps: { placeholder: '请输入采集频率' },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'roadId',
      label: '道路id',
      component: 'Input',
      componentProps: { placeholder: '请输入道路id' },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'potholeNumThreshold',
      label: '坑洼数量阈值',
      component: 'Input',
      componentProps: { placeholder: '请输入坑洼数量阈值' },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'crackLengthThreshold',
      label: '裂缝长度阈值(米)',
      component: 'Input',
      componentProps: { placeholder: '请输入裂缝长度阈值' },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'roadTempThreshold',
      label: '路面温度阈值(℃)',
      component: 'Input',
      componentProps: { placeholder: '请输入路面温度阈值' },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'trafficFlowThreshold',
      label: '交通流量阈值(辆/小时)',
      component: 'Input',
      componentProps: { placeholder: '请输入交通流量阈值' },
      labelWidth: '100',
      rules: 'required',
    },
  ];
}

/** 表格字段 - 改造为道路监测配置管理表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '配置名称',
      sortable: true,
    },
    {
      field: 'roadName',
      title: '道路名称',
      sortable: true,
    },
    {
      field: 'collectFrequency',
      title: '采集频率(分钟)',
      sortable: true,
    },
    {
      field: 'potholeNumThreshold',
      title: '坑洼数量阈值',
      sortable: true,
    },
    {
      field: 'crackLengthThreshold',
      title: '裂缝长度阈值(米)',
      sortable: true,
    },
    {
      field: 'roadTempThreshold',
      title: '路面温度阈值(℃)',
      sortable: true,
    },
    {
      field: 'trafficFlowThreshold',
      title: '交通流量阈值(辆/小时)',
      sortable: true,
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
