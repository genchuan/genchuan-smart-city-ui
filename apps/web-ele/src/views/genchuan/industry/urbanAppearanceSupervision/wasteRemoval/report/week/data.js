/** 表格初始数据 - 改造为每周违规备案统计 */
export const dataList = () => [
  {
    statsWeek: '2025年第12周',
    weeklyTotalFilingCount: 245,
    weeklyTotalViolationCount: 32,
    weeklyTotalRectificationRate: 86.94,
    weeklyRepeatViolationCount: 8,
    weekOverWeekGrowth: 3.5,
    yearOverYearGrowth: -2.1,
  },
  {
    statsWeek: '2025年第11周',
    weeklyTotalFilingCount: 237,
    weeklyTotalViolationCount: 29,
    weeklyTotalRectificationRate: 87.76,
    weeklyRepeatViolationCount: 6,
    weekOverWeekGrowth: 1.2,
    yearOverYearGrowth: -1.5,
  },
  {
    statsWeek: '2025年第10周',
    weeklyTotalFilingCount: 230,
    weeklyTotalViolationCount: 28,
    weeklyTotalRectificationRate: 87.83,
    weeklyRepeatViolationCount: 5,
    weekOverWeekGrowth: 2.8,
    yearOverYearGrowth: 0.5,
  },
  {
    statsWeek: '2025年第09周',
    weeklyTotalFilingCount: 224,
    weeklyTotalViolationCount: 31,
    weeklyTotalRectificationRate: 86.16,
    weeklyRepeatViolationCount: 7,
    weekOverWeekGrowth: -1.3,
    yearOverYearGrowth: 1.2,
  },
  {
    statsWeek: '2025年第08周',
    weeklyTotalFilingCount: 227,
    weeklyTotalViolationCount: 27,
    weeklyTotalRectificationRate: 88.11,
    weeklyRepeatViolationCount: 4,
    weekOverWeekGrowth: 4.5,
    yearOverYearGrowth: 2.8,
  },
  {
    statsWeek: '2025年第07周',
    weeklyTotalFilingCount: 218,
    weeklyTotalViolationCount: 26,
    weeklyTotalRectificationRate: 88.07,
    weeklyRepeatViolationCount: 3,
    weekOverWeekGrowth: 2.3,
    yearOverYearGrowth: 1.8,
  },
  {
    statsWeek: '2025年第06周',
    weeklyTotalFilingCount: 213,
    weeklyTotalViolationCount: 25,
    weeklyTotalRectificationRate: 88.26,
    weeklyRepeatViolationCount: 3,
    weekOverWeekGrowth: 1.9,
    yearOverYearGrowth: 2.5,
  },
  {
    statsWeek: '2025年第05周',
    weeklyTotalFilingCount: 209,
    weeklyTotalViolationCount: 24,
    weeklyTotalRectificationRate: 88.52,
    weeklyRepeatViolationCount: 2,
    weekOverWeekGrowth: 2.7,
    yearOverYearGrowth: 3.2,
  },
  {
    statsWeek: '2025年第04周',
    weeklyTotalFilingCount: 203,
    weeklyTotalViolationCount: 26,
    weeklyTotalRectificationRate: 87.19,
    weeklyRepeatViolationCount: 4,
    weekOverWeekGrowth: -1.8,
    yearOverYearGrowth: 2.1,
  },
  {
    statsWeek: '2025年第03周',
    weeklyTotalFilingCount: 207,
    weeklyTotalViolationCount: 23,
    weeklyTotalRectificationRate: 88.89,
    weeklyRepeatViolationCount: 2,
    weekOverWeekGrowth: 3.4,
    yearOverYearGrowth: 3.8,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为每周违规备案统计表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'statsWeek',
      label: '统计周次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统计周次（如：2025年第12周）',
        maxLength: 20,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'weeklyTotalFilingCount',
      label: '周累计备案数量',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入周累计备案数量',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'weeklyTotalViolationCount',
      label: '周累计违规数量',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入周累计违规数量',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'weeklyTotalRectificationRate',
      label: '周累计整改率',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入周累计整改率（%）',
        min: 0,
        max: 100,
        precision: 2,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'weeklyRepeatViolationCount',
      label: '周内重复违规点位数量',
      component: 'InputNumber',
      labelWidth: '150',
      componentProps: {
        placeholder: '请输入重复违规点位数量',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'weekOverWeekGrowth',
      label: '环比增长率',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入环比增长率（%）',
        precision: 2,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'yearOverYearGrowth',
      label: '同比增长率',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入同比增长率（%）',
        precision: 2,
        addonAfter: '%',
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 每周违规备案统计表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'statsWeek',
      title: '统计周次',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'weeklyTotalFilingCount',
      title: '周累计备案数量',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'weeklyTotalViolationCount',
      title: '周累计违规数量',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'weeklyTotalRectificationRate',
      title: '周累计整改率 (%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'weeklyRepeatViolationCount',
      title: '重复违规点位数量',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'weekOverWeekGrowth',
      title: '环比增长率 (%)',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'yearOverYearGrowth',
      title: '同比增长率 (%)',
      minWidth: 130,
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
