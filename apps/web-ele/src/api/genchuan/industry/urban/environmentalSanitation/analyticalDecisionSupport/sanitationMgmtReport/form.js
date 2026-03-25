/** 新增/编辑表单 schema - 环卫管理报表 */
export function useFormSchema() {
  return [
    {
      fieldName: 'reportName',
      label: '报表名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入报表名称（如：2026年第一季度环卫保洁达标率分析）',
        maxLength: 100,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'timeRange',
      label: '统计时间范围',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择统计时间范围',
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'area',
      label: '统计区域',
      component: 'Select',
      componentProps: {
        placeholder: '请选择统计区域（可多选）',
        mode: 'multiple',
        options: [
          { label: '芗城区', value: '芗城区' },
          { label: '龙文区', value: '龙文区' },
          { label: '龙海区', value: '龙海区' },
          { label: '长泰区', value: '长泰区' },
          { label: '全市范围', value: '全市范围' },
        ],
        showSearch: true,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'businessModule',
      label: '业务模块',
      component: 'Select',
      componentProps: {
        placeholder: '请选择业务模块（可多选）',
        mode: 'multiple',
        options: [
          { label: '保洁管理', value: '保洁管理' },
          { label: '收运管理', value: '收运管理' },
          { label: '设施管理', value: '设施管理' },
          { label: '车辆管理', value: '车辆管理' },
          { label: '人员管理', value: '人员管理' },
          { label: '河道管理', value: '河道管理' },
          { label: '集贸市场管理', value: '集贸市场管理' },
          { label: '城中村管理', value: '城中村管理' },
          { label: '公园管理', value: '公园管理' },
          { label: '商业街管理', value: '商业街管理' },
        ],
        showSearch: true,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'indicators',
      label: '统计指标',
      component: 'Select',
      componentProps: {
        placeholder: '请选择统计指标（可多选）',
        mode: 'multiple',
        options: [
          { label: '保洁达标率', value: '保洁达标率' },
          { label: '收运完成率', value: '收运完成率' },
          { label: '设施完好率', value: '设施完好率' },
          { label: '车辆完好率', value: '车辆完好率' },
          { label: '水质达标率', value: '水质达标率' },
          { label: '问题处置率', value: '问题处置率' },
          { label: '绿化存活率', value: '绿化存活率' },
          { label: '全勤率', value: '全勤率' },
          { label: '作业完成率', value: '作业完成率' },
        ],
        showSearch: true,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'createBy',
      label: '创建人',
      component: 'Input',
      componentProps: {
        placeholder: '创建人（自动获取）',
        disabled: true,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '创建时间（自动生成）',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        disabled: true,
      },
      labelWidth: 120,
    },
  ];
}

/** 表格字段 - 环卫管理报表表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'reportName',
      title: '报表名称',
      minWidth: 200,
      sortable: true,
      slots: { default: 'reportName' },
    },
    {
      field: 'timeRange',
      title: '统计时间范围',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'area',
      title: '统计区域',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'businessModule',
      title: '业务模块',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'indicators',
      title: '统计指标',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'createBy',
      title: '创建人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'status',
      title: '报表状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'dataCount',
      title: '数据记录数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'coreIndicatorSummary',
      title: '核心指标汇总',
      minWidth: 250,
      sortable: false,
    },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
