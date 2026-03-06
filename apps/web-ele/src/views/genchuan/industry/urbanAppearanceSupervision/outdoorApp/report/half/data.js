/** 表格初始数据 - 改造为广告设施半年备案统计管理数据 */
export const dataList = () => [
  {
    statisticalHalf: '2024年上半年',
    recordTotalHalf: 156,
    illegalDisposalHalf: 23,
    rectificationCompletionRate: 85.26,
    facilityUpdateCount: 89,
    crossRegionEfficiency: 92.5,
    yearOverYearGrowth: 12.3,
  },
  {
    statisticalHalf: '2023年下半年',
    recordTotalHalf: 142,
    illegalDisposalHalf: 31,
    rectificationCompletionRate: 78.17,
    facilityUpdateCount: 76,
    crossRegionEfficiency: 88.2,
    yearOverYearGrowth: 8.7,
  },
  {
    statisticalHalf: '2023年上半年',
    recordTotalHalf: 135,
    illegalDisposalHalf: 28,
    rectificationCompletionRate: 79.26,
    facilityUpdateCount: 72,
    crossRegionEfficiency: 86.9,
    yearOverYearGrowth: 5.2,
  },
  {
    statisticalHalf: '2022年下半年',
    recordTotalHalf: 128,
    illegalDisposalHalf: 35,
    rectificationCompletionRate: 72.66,
    facilityUpdateCount: 68,
    crossRegionEfficiency: 82.4,
    yearOverYearGrowth: -2.1,
  },
  {
    statisticalHalf: '2022年上半年',
    recordTotalHalf: 119,
    illegalDisposalHalf: 32,
    rectificationCompletionRate: 73.11,
    facilityUpdateCount: 62,
    crossRegionEfficiency: 80.7,
    yearOverYearGrowth: 3.4,
  },
  {
    statisticalHalf: '2021年下半年',
    recordTotalHalf: 112,
    illegalDisposalHalf: 29,
    rectificationCompletionRate: 74.11,
    facilityUpdateCount: 58,
    crossRegionEfficiency: 78.9,
    yearOverYearGrowth: 6.8,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为广告设施半年备案统计管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'statisticalHalf',
      label: '统计半年',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '2024年上半年', value: '2024年上半年' },
          { label: '2023年下半年', value: '2023年下半年' },
          { label: '2023年上半年', value: '2023年上半年' },
          { label: '2022年下半年', value: '2022年下半年' },
          { label: '2022年上半年', value: '2022年上半年' },
          { label: '2021年下半年', value: '2021年下半年' },
        ],
        placeholder: '请选择统计半年',
        showSearch: true,
      },
      labelWidth: '150',
      rules: 'required',
    },
    {
      fieldName: 'recordTotalHalf',
      label: '半年备案总量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入半年备案总量',
        min: 0,
        precision: 0,
        addonAfter: '件',
      },
      labelWidth: '150',
      rules: 'required',
    },
    {
      fieldName: 'illegalDisposalHalf',
      label: '半年违规处置总量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入半年违规处置总量',
        min: 0,
        precision: 0,
        addonAfter: '件',
      },
      labelWidth: '150',
      rules: 'required',
    },
    {
      fieldName: 'rectificationCompletionRate',
      label: '半年整改完成率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入半年整改完成率',
        min: 0,
        max: 100,
        precision: 2,
        addonAfter: '%',
      },
      labelWidth: '150',
      rules: 'required',
    },
    {
      fieldName: 'facilityUpdateCount',
      label: '半年广告设施更新数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入半年广告设施更新数量',
        min: 0,
        precision: 0,
        addonAfter: '个',
      },
      labelWidth: '150',
      rules: 'required',
    },
    {
      fieldName: 'crossRegionEfficiency',
      label: '跨区域违规案件处置效率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入跨区域违规案件处置效率',
        min: 0,
        max: 100,
        precision: 2,
        addonAfter: '%',
      },
      labelWidth: '150',
      rules: 'required',
    },
    {
      fieldName: 'yearOverYearGrowth',
      label: '同比增长率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入同比增长率',
        min: -100,
        max: 1000,
        precision: 2,
        addonAfter: '%',
      },
      labelWidth: '150',
      rules: 'required',
    },
  ];
}

/** 表格字段 - 改造为广告设施半年备案统计表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'statisticalHalf',
      title: '统计半年',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'recordTotalHalf',
      title: '半年备案总量(件)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'illegalDisposalHalf',
      title: '半年违规处置总量(件)',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'rectificationCompletionRate',
      title: '半年整改完成率(%)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'facilityUpdateCount',
      title: '半年广告设施更新数量(个)',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'crossRegionEfficiency',
      title: '跨区域违规案件处置效率(%)',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'yearOverYearGrowth',
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
