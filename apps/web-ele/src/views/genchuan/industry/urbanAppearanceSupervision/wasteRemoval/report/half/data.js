/** 表格初始数据 - 改造为环卫清运半年统计分析数据 */
export const dataList = () => [
  {
    statsHalfYear: '2024年上半年',
    halfYearClearTotal: 12500,
    halfYearViolationTotal: 48,
    halfYearCrossRegionCases: 12,
    halfYearRewardPunishCount: 8,
    halfYearDeviceOnlineRate: 97.5,
    yearOverYearGrowthRate: 5.8,
  },
  {
    statsHalfYear: '2023年下半年',
    halfYearClearTotal: 11800,
    halfYearViolationTotal: 52,
    halfYearCrossRegionCases: 15,
    halfYearRewardPunishCount: 6,
    halfYearDeviceOnlineRate: 96.2,
    yearOverYearGrowthRate: 4.2,
  },
  {
    statsHalfYear: '2023年上半年',
    halfYearClearTotal: 11200,
    halfYearViolationTotal: 45,
    halfYearCrossRegionCases: 10,
    halfYearRewardPunishCount: 5,
    halfYearDeviceOnlineRate: 95.8,
    yearOverYearGrowthRate: 3.5,
  },
  {
    statsHalfYear: '2022年下半年',
    halfYearClearTotal: 10800,
    halfYearViolationTotal: 49,
    halfYearCrossRegionCases: 14,
    halfYearRewardPunishCount: 7,
    halfYearDeviceOnlineRate: 94.9,
    yearOverYearGrowthRate: 2.8,
  },
  {
    statsHalfYear: '2022年上半年',
    halfYearClearTotal: 10500,
    halfYearViolationTotal: 44,
    halfYearCrossRegionCases: 11,
    halfYearRewardPunishCount: 4,
    halfYearDeviceOnlineRate: 94.1,
    yearOverYearGrowthRate: 2.1,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为环卫清运半年统计分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'statsHalfYear',
      label: '统计半年',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统计半年（如：2024年上半年）',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'halfYearClearTotal',
      label: '半年清运总量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入半年清运总量（单位：吨）',
        min: 0,
        precision: 0,
        addonAfter: '吨',
      },
      rules: 'required',
    },
    {
      fieldName: 'halfYearViolationTotal',
      label: '半年违规处置总量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入半年违规处置总量',
        min: 0,
        precision: 0,
        addonAfter: '次',
      },
      rules: 'required',
    },
    {
      fieldName: 'halfYearCrossRegionCases',
      label: '半年跨区域清运案件数',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入半年跨区域清运案件数',
        min: 0,
        precision: 0,
        addonAfter: '件',
      },
      rules: 'required',
    },
    {
      fieldName: 'halfYearRewardPunishCount',
      label: '半年清运企业奖惩数量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入半年清运企业奖惩数量',
        min: 0,
        precision: 0,
        addonAfter: '次',
      },
      rules: 'required',
    },
    {
      fieldName: 'halfYearDeviceOnlineRate',
      label: '半年卡点设备完好率',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入半年卡点设备完好率（单位：%）',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
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

/** 表格字段 - 改造为环卫清运半年统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'statsHalfYear',
      title: '统计半年',
      minWidth: 150,
      sortable: true,
      slots: { default: 'statsHalfYear' },
    },
    {
      field: 'halfYearClearTotal',
      title: '半年清运总量(吨)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'halfYearViolationTotal',
      title: '半年违规处置总量',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'halfYearCrossRegionCases',
      title: '半年跨区域清运案件数',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'halfYearRewardPunishCount',
      title: '半年清运企业奖惩数量',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'halfYearDeviceOnlineRate',
      title: '半年卡点设备完好率(%)',
      minWidth: 180,
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
