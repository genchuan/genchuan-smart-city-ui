/** 表格初始数据 - 户外广告执法年度统计管理数据 */
export const dataList = () => [
  {
    statisticalYear: '2024',
    totalAnnualRecords: 1250,
    totalAnnualViolations: 86,
    annualRectificationRate: 93.12,
    excellentLawEnforcementSquadronRanking: '1. 湖里中队、2. 思明中队、3. 集美中队',
    advertisingFacilityAccidentRate: 0.08,
    yearOverYearGrowthRate: 5.32,
  },
  {
    statisticalYear: '2023',
    totalAnnualRecords: 1180,
    totalAnnualViolations: 95,
    annualRectificationRate: 91.95,
    excellentLawEnforcementSquadronRanking: '1. 思明中队、2. 湖里中队、3. 海沧中队',
    advertisingFacilityAccidentRate: 0.12,
    yearOverYearGrowthRate: 4.78,
  },
  {
    statisticalYear: '2022',
    totalAnnualRecords: 1125,
    totalAnnualViolations: 108,
    annualRectificationRate: 90.40,
    excellentLawEnforcementSquadronRanking: '1. 集美中队、2. 思明中队、3. 同安中队',
    advertisingFacilityAccidentRate: 0.15,
    yearOverYearGrowthRate: 3.21,
  },
  {
    statisticalYear: '2021',
    totalAnnualRecords: 1090,
    totalAnnualViolations: 112,
    annualRectificationRate: 89.72,
    excellentLawEnforcementSquadronRanking: '1. 海沧中队、2. 集美中队、3. 翔安中队',
    advertisingFacilityAccidentRate: 0.18,
    yearOverYearGrowthRate: 2.65,
  },
  {
    statisticalYear: '2020',
    totalAnnualRecords: 1050,
    totalAnnualViolations: 125,
    annualRectificationRate: 88.10,
    excellentLawEnforcementSquadronRanking: '1. 思明中队、2. 湖里中队、3. 集美中队',
    advertisingFacilityAccidentRate: 0.22,
    yearOverYearGrowthRate: -1.23,
  },
  {
    statisticalYear: '2019',
    totalAnnualRecords: 1065,
    totalAnnualViolations: 118,
    annualRectificationRate: 88.92,
    excellentLawEnforcementSquadronRanking: '1. 湖里中队、2. 思明中队、3. 海沧中队',
    advertisingFacilityAccidentRate: 0.20,
    yearOverYearGrowthRate: 0.00,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 户外广告执法年度统计管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'statisticalYear',
      label: '统计年度',
      component: 'Select',
      componentProps: {
        placeholder: '请选择统计年度',
        allowClear: true,
        filterOption: true,
        options: [
          { label: '2024年', value: '2024' },
          { label: '2023年', value: '2023' },
          { label: '2022年', value: '2022' },
          { label: '2021年', value: '2021' },
          { label: '2020年', value: '2020' },
          { label: '2019年', value: '2019' },
          { label: '2018年', value: '2018' },
        ],
        showSearch: true,
      },
      labelWidth: '140',
      rules: 'required', // 统计年度为必填项
    },
    {
      fieldName: 'totalAnnualRecords',
      label: '年度备案总量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入年度备案总量',
        min: 0, // 数量非负
        precision: 0, // 整数
        addonAfter: '件',
      },
      labelWidth: '140',
      rules: 'required', // 年度备案总量为必填项
    },
    {
      fieldName: 'totalAnnualViolations',
      label: '年度违规总量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入年度违规总量',
        min: 0,
        precision: 0,
        addonAfter: '件',
      },
      labelWidth: '140',
      rules: 'required', // 年度违规总量为必填项
    },
    {
      fieldName: 'annualRectificationRate',
      label: '年度整改率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入年度整改率',
        min: 0,
        max: 100,
        precision: 2,
        addonAfter: '%',
      },
      labelWidth: '140',
      rules: 'required', // 年度整改率为必填项
    },
    {
      fieldName: 'excellentLawEnforcementSquadronRanking',
      label: '年度优秀执法中队排名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入年度优秀执法中队排名（如：1. 湖里中队、2. 思明中队）',
        maxLength: 200,
        type: 'textarea',
        rows: 3,
      },
      labelWidth: '140',
      rules: 'required', // 年度优秀执法中队排名为必填项
    },
    {
      fieldName: 'advertisingFacilityAccidentRate',
      label: '年度广告设施安全事故发生率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入年度广告设施安全事故发生率',
        min: 0,
        max: 100,
        precision: 2,
        addonAfter: '%',
      },
      labelWidth: '140',
      rules: 'required', // 年度广告设施安全事故发生率为必填项
    },
    {
      fieldName: 'yearOverYearGrowthRate',
      label: '同比增长率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入同比增长率',
        min: -100,
        max: 1000,
        precision: 2,
        addonAfter: '%',
      },
      labelWidth: '140',
      rules: 'required', // 同比增长率为必填项
    },
  ];
}

/** 表格字段 - 户外广告执法年度统计管理表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'statisticalYear',
      title: '统计年度',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'totalAnnualRecords',
      title: '年度备案总量(件)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'totalAnnualViolations',
      title: '年度违规总量(件)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'annualRectificationRate',
      title: '年度整改率(%)',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'excellentLawEnforcementSquadronRanking',
      title: '年度优秀执法中队排名',
      minWidth: 250,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      field: 'advertisingFacilityAccidentRate',
      title: '广告设施安全事故发生率(%)',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'yearOverYearGrowthRate',
      title: '同比增长率(%)',
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
