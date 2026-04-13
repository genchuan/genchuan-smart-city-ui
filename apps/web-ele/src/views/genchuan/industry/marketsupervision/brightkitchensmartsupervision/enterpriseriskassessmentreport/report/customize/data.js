/** 新增/修改的表单/列表的搜索表单 - 企业风险报告管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'statisticPeriod',
      label: '统计周期',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统计周期（yyyy-MM）',
        maxLength: 7,
      },
      labelWidth: '120',
      rules: '', // 仅月报使用，非必填 
    },
    {
      fieldName: 'reportNo',
      label: '报告编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入报告编号',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: '',
    },
    {
      fieldName: 'entId',
      label: '企业ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入企业ID',
        precision: 0,
      },
      labelWidth: '120',
      rules: '',
    },
    {
      fieldName: 'entName',
      label: '企业名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业名称（模糊查询）',
        maxLength: 100,
      },
      labelWidth: '120',
      rules: '', 
    },
    {
      fieldName: 'riskLevel',
      label: '风险等级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择风险等级',
      },
      labelWidth: '120',
      rules: '',
    },
    {
      fieldName: 'area',
      label: '区域',
      component: 'Input',
      componentProps: {
        placeholder: '请输入区域',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: '',
      isSearch: true, // 新增搜索标识
    },
    {
      fieldName: 'entType',
      label: '企业类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业类型',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: '',
      isSearch: true, // 新增搜索标识
    },
    {
      fieldName: 'beginTime',
      label: '统计开始时间',
      component: 'DatePicker',
      componentProps: {
        type: 'month',
        placeholder: '请选择统计开始月份',
        format: 'YYYY-MM', 
      },
      labelWidth: '120',
      rules: '',
      isSearch: true, // 新增搜索标识
    },
    {
      fieldName: 'endTime',
      label: '统计结束时间',
      component: 'DatePicker',
      componentProps: {
        type: 'month',
        placeholder: '请选择统计结束月份',
        format: 'YYYY-MM', 
      },
      labelWidth: '120',
      rules: '',
      isSearch: true, // 新增搜索标识
    },
    {
      fieldName: 'violationCount',
      label: '违规次数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入违规次数',
        precision: 0,
        min: 0,
      },
      labelWidth: '120',
      rules: '',
    },
  ];
}

/** 表格字段 - 企业风险报告管理表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'statisticPeriod',
      title: '统计周期',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'reportNo',
      title: '报告编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'reportNo' },
    }, 
    {
      field: 'entName',
      title: '企业名称',
      minWidth: 200,
      sortable: true,
      slots: { default: 'entName' },
    },
    {
      field: 'riskLevel',
      title: '风险等级',
      minWidth: 100,
      sortable: true,
      slots: { default: 'riskLevel' },
    },
    {
      field: 'area',
      title: '区域',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'entType',
      title: '企业类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'beginTime',
      title: '统计开始时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'endTime',
      title: '统计结束时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'violationCount',
      title: '违规次数',
      minWidth: 100,
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