/** 表格初始数据 - 改造为年度渣土管理统计分析数据 */
export const dataList = () => [
  {
    // 基础年度指标
    year: '2024',
    totalAnnualClearanceVolume: 125000, // 年度清运总量 (单位: 吨)
    totalAnnualViolationCases: 342, // 年度违规案件总量
    comprehensiveRankingOfCompanies: 'A-01', // 年度清运企业综合排名 (此处为排名第一的企业ID或名称)
    totalAnnualCheckpointLawEnforcement: 5680, // 年度卡点执法总量 (单位: 次)
    annualSlagManagementAssessmentScore: 92.5, // 年度渣土管理工作考核得分 (满分100)

    // 同比数据 (与上一年度2023年对比)
    yoyTotalAnnualClearanceVolume: 8.5, // 年度清运总量同比变化率 (%)
    yoyTotalAnnualViolationCases: -5.2, // 年度违规案件总量同比变化率 (%)
    yoyComprehensiveRankingOfCompanies: 3, // 年度清运企业综合排名同比变化 (排名提升3位, 正值表示进步)
    yoyTotalAnnualCheckpointLawEnforcement: 12.3, // 年度卡点执法总量同比变化率 (%)
    yoyAnnualSlagManagementAssessmentScore: 4.2, // 年度渣土管理工作考核得分同比变化率 (%)

    // 按区域拆分的年度明细数据及同比分析结果
    detailByRegion: '鼓楼区: 21500吨,同比+6.2%; 台江区: 18200吨,同比+4.5%; 仓山区: 19800吨,同比+10.1%; 晋安区: 24500吨,同比+9.3%; 马尾区: 12500吨,同比+2.8%; 长乐区: 9500吨,同比+15.2%; 福清市: 8000吨,同比+1.5%; 连江县: 5500吨,同比+18.7%; 闽侯县: 4800吨,同比+7.4%; 罗源县: 2700吨,同比-3.2%',

    // 按清运企业拆分的年度明细数据及同比分析结果 (排名前五示例)
    detailByCompany: '建工运输: 28500吨,同比+12.1%,排名第1; 城运集团: 24500吨,同比+8.3%,排名第2; 环投物流: 19800吨,同比+5.5%,排名第3; 中建渣运: 16500吨,同比+2.2%,排名第4; 广达运输: 14200吨,同比+15.8%,排名第5; 其余企业合计: 21500吨,同比+3.7%',

    // 按月拆分的年度趋势明细及同比分析结果
    detailByMonthlyTrend: '1月: 8900吨,同比+2.1%; 2月: 7200吨,同比-1.5%; 3月: 10500吨,同比+6.3%; 4月: 11200吨,同比+8.9%; 5月: 12800吨,同比+10.2%; 6月: 13500吨,同比+12.4%; 7月: 14100吨,同比+13.1%; 8月: 13900吨,同比+11.8%; 9月: 12100吨,同比+7.5%; 10月: 11500吨,同比+5.2%; 11月: 10200吨,同比+4.3%; 12月: 10100吨,同比+3.9%',

    // 按考核维度拆分的年度明细数据及同比分析结果 (管理、安全、环保、效率等维度)
    detailByAssessmentDimension: '规范管理: 94分,同比+5.2%; 运输安全: 88分,同比+2.8%; 环保控制: 91分,同比+7.1%; 处置效率: 89分,同比+3.5%; 群众满意度: 90分,同比+4.6%',
  },
  {
    // 可支持多个年度数据，例如2023年作为历史对比参照，但按需求主数据为2024年，这里保留2023供参考
    year: '2023',
    totalAnnualClearanceVolume: 115200,
    totalAnnualViolationCases: 361,
    comprehensiveRankingOfCompanies: 'A-02',
    totalAnnualCheckpointLawEnforcement: 5060,
    annualSlagManagementAssessmentScore: 88.3,

    yoyTotalAnnualClearanceVolume: 6.2,
    yoyTotalAnnualViolationCases: -3.1,
    yoyComprehensiveRankingOfCompanies: -1,
    yoyTotalAnnualCheckpointLawEnforcement: 9.5,
    yoyAnnualSlagManagementAssessmentScore: 3.1,

    detailByRegion: '鼓楼区: 20250吨,同比+5.1%; 台江区: 17400吨,同比+3.2%; 仓山区: 17980吨,同比+7.8%; 晋安区: 22400吨,同比+8.2%; 马尾区: 12150吨,同比+2.1%; 长乐区: 8250吨,同比+12.4%; 福清市: 7880吨,同比+1.2%; 连江县: 4630吨,同比+15.3%; 闽侯县: 4470吨,同比+5.1%; 罗源县: 2790吨,同比-2.5%',
    detailByCompany: '建工运输: 25420吨,同比+9.8%,排名第1; 城运集团: 22630吨,同比+7.1%,排名第2; 环投物流: 18760吨,同比+4.8%,排名第3; 中建渣运: 16150吨,同比+1.5%,排名第4; 广达运输: 12260吨,同比+13.2%,排名第5; 其余企业合计: 20750吨,同比+2.9%',
    detailByMonthlyTrend: '1月: 8720吨,同比+1.2%; 2月: 7310吨,同比-2.1%; 3月: 9870吨,同比+5.5%; 4月: 10280吨,同比+7.3%; 5月: 11610吨,同比+9.0%; 6月: 12010吨,同比+10.5%; 7月: 12470吨,同比+11.2%; 8月: 12430吨,同比+10.1%; 9月: 11260吨,同比+6.8%; 10月: 10930吨,同比+4.5%; 11月: 9780吨,同比+3.2%; 12月: 9720吨,同比+2.8%',
    detailByAssessmentDimension: '规范管理: 89.3分,同比+4.3%; 运输安全: 85.6分,同比+1.9%; 环保控制: 85.0分,同比+6.2%; 处置效率: 86.0分,同比+2.7%; 群众满意度: 86.0分,同比+3.9%',
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为年度渣土管理统计分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'year',
      label: '统计年度',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统计年度（如2024）',
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'totalAnnualClearanceVolume',
      label: '年度清运总量',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入年度清运总量（单位：吨）',
        min: 0,
        precision: 0,
        addonAfter: '吨',
      },
      rules: 'required',
    },
    {
      fieldName: 'totalAnnualViolationCases',
      label: '年度违规案件总量',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入年度违规案件总量',
        min: 0,
        precision: 0,
        addonAfter: '件',
      },
      rules: 'required',
    },
    {
      fieldName: 'comprehensiveRankingOfCompanies',
      label: '年度清运企业综合排名',
      component: 'Input',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入年度清运企业综合排名（企业ID或名称）',
      },
      rules: 'required',
    },
    {
      fieldName: 'totalAnnualCheckpointLawEnforcement',
      label: '年度卡点执法总量',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入年度卡点执法总量（单位：次）',
        min: 0,
        precision: 0,
        addonAfter: '次',
      },
      rules: 'required',
    },
    {
      fieldName: 'annualSlagManagementAssessmentScore',
      label: '年度渣土管理工作考核得分',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入年度考核得分',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '分',
      },
      rules: 'required',
    },
    {
      fieldName: 'yoyTotalAnnualClearanceVolume',
      label: '清运总量同比变化率',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入与上一年度同比变化率（%）',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'yoyTotalAnnualViolationCases',
      label: '违规案件总量同比变化率',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入与上一年度同比变化率（%）',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'yoyComprehensiveRankingOfCompanies',
      label: '企业综合排名同比变化',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入排名变化（正值表示进步，负值表示退步）',
        precision: 0,
        addonAfter: '位',
      },
      rules: 'required',
    },
    {
      fieldName: 'yoyTotalAnnualCheckpointLawEnforcement',
      label: '卡点执法总量同比变化率',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入与上一年度同比变化率（%）',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'yoyAnnualSlagManagementAssessmentScore',
      label: '考核得分同比变化率',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入与上一年度同比变化率（%）',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'detailByRegion',
      label: '按区域拆分明细及同比',
      component: 'Input',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入按区域拆分的年度明细数据及同比分析结果',
        maxlength: 500,
        type: 'textarea',
        rows: 3,
      },
      rules: 'required',
    },
    {
      fieldName: 'detailByCompany',
      label: '按清运企业拆分明细及同比',
      component: 'Input',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入按清运企业拆分的年度明细数据及同比分析结果',
        maxlength: 500,
        type: 'textarea',
        rows: 3,
      },
      rules: 'required',
    },
    {
      fieldName: 'detailByMonthlyTrend',
      label: '月度趋势明细及同比',
      component: 'Input',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入按月拆分的年度趋势明细数据及同比分析结果',
        maxlength: 600,
        type: 'textarea',
        rows: 3,
      },
      rules: 'required',
    },
    {
      fieldName: 'detailByAssessmentDimension',
      label: '考核维度拆分明细及同比',
      component: 'Input',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入按考核维度拆分的年度明细数据及同比分析结果',
        maxlength: 500,
        type: 'textarea',
        rows: 3,
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 改造为年度渣土管理统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'year',
      title: '统计年度',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'totalAnnualClearanceVolume',
      title: '年度清运总量(吨)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'totalAnnualViolationCases',
      title: '年度违规案件总量(件)',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'comprehensiveRankingOfCompanies',
      title: '年度清运企业综合排名',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'totalAnnualCheckpointLawEnforcement',
      title: '年度卡点执法总量(次)',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'annualSlagManagementAssessmentScore',
      title: '年度渣土管理工作考核得分(分)',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'yoyTotalAnnualClearanceVolume',
      title: '清运总量同比变化率(%)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'yoyTotalAnnualViolationCases',
      title: '违规案件总量同比变化率(%)',
      minWidth: 170,
      sortable: true,
    },
    {
      field: 'yoyComprehensiveRankingOfCompanies',
      title: '企业综合排名同比变化(位)',
      minWidth: 170,
      sortable: true,
    },
    {
      field: 'yoyTotalAnnualCheckpointLawEnforcement',
      title: '卡点执法总量同比变化率(%)',
      minWidth: 170,
      sortable: true,
    },
    {
      field: 'yoyAnnualSlagManagementAssessmentScore',
      title: '考核得分同比变化率(%)',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'detailByRegion',
      title: '按区域拆分明细及同比',
      minWidth: 280,
      sortable: false,
    },
    {
      field: 'detailByCompany',
      title: '按清运企业拆分明细及同比',
      minWidth: 280,
      sortable: false,
    },
    {
      field: 'detailByMonthlyTrend',
      title: '月度趋势明细及同比',
      minWidth: 300,
      sortable: false,
    },
    {
      field: 'detailByAssessmentDimension',
      title: '考核维度拆分明细及同比',
      minWidth: 280,
      sortable: false,
    },
  ];
}
