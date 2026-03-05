/** 表格初始数据 - 改造为渣土管理年度统计分析数据 */
export const dataList = () => [
  {
    statsYear: '2024年',
    yearClearTotal: 85600,
    yearViolationTotal: 326,
    yearEnterpriseRank: 12,
    yearEnforcementTotal: 1840,
    yearManagementScore: 92.5,
    yearOverYearGrowthRate: 6.8,
  },
  {
    statsYear: '2023年',
    yearClearTotal: 80100,
    yearViolationTotal: 354,
    yearEnterpriseRank: 15,
    yearEnforcementTotal: 1720,
    yearManagementScore: 89.3,
    yearOverYearGrowthRate: 5.2,
  },
  {
    statsYear: '2022年',
    yearClearTotal: 76100,
    yearViolationTotal: 382,
    yearEnterpriseRank: 18,
    yearEnforcementTotal: 1650,
    yearManagementScore: 87.1,
    yearOverYearGrowthRate: 4.5,
  },
  {
    statsYear: '2021年',
    yearClearTotal: 72800,
    yearViolationTotal: 408,
    yearEnterpriseRank: 21,
    yearEnforcementTotal: 1580,
    yearManagementScore: 84.8,
    yearOverYearGrowthRate: 3.9,
  },
  {
    statsYear: '2020年',
    yearClearTotal: 70100,
    yearViolationTotal: 435,
    yearEnterpriseRank: 24,
    yearEnforcementTotal: 1510,
    yearManagementScore: 82.5,
    yearOverYearGrowthRate: 3.2,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为渣土管理年度统计分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'statsYear',
      label: '统计年度',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统计年度（如：2024年）',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'yearClearTotal',
      label: '年度清运总量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入年度清运总量（单位：吨）',
        min: 0,
        precision: 0,
        addonAfter: '吨',
      },
      rules: 'required',
    },
    {
      fieldName: 'yearViolationTotal',
      label: '年度违规案件总量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入年度违规案件总量',
        min: 0,
        precision: 0,
        addonAfter: '件',
      },
      rules: 'required',
    },
    {
      fieldName: 'yearEnterpriseRank',
      label: '年度清运企业综合排名',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入年度清运企业综合排名',
        min: 1,
        precision: 0,
        addonAfter: '名',
      },
      rules: 'required',
    },
    {
      fieldName: 'yearEnforcementTotal',
      label: '年度卡点执法总量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入年度卡点执法总量',
        min: 0,
        precision: 0,
        addonAfter: '次',
      },
      rules: 'required',
    },
    {
      fieldName: 'yearManagementScore',
      label: '年度渣土管理工作考核得分',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入年度渣土管理工作考核得分',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '分',
      },
      rules: 'required',
    },
    {
      fieldName: 'yearOverYearGrowthRate',
      label: '同比增长率',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入同比增长率（单位：%）',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 改造为渣土管理年度统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'statsYear',
      title: '统计年度',
      minWidth: 120,
      sortable: true,
      slots: { default: 'statsYear' },
    },
    {
      field: 'yearClearTotal',
      title: '年度清运总量(吨)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'yearViolationTotal',
      title: '年度违规案件总量',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'yearEnterpriseRank',
      title: '年度清运企业综合排名',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'yearEnforcementTotal',
      title: '年度卡点执法总量',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'yearManagementScore',
      title: '年度渣土管理工作考核得分',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'yearOverYearGrowthRate',
      title: '同比增长率(%)',
      minWidth: 150,
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
