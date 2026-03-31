export const dataList = () => [
  {
    reportNumber: 'RPT-QZ-FZ-202406-001', // 统一为丰泽FZ编码
    filterConditions: '区域：丰泽区；时间：2024-06；食堂类型：中学食堂', // 替换为食堂类型
    generationTime: '2024-06-30 16:30:25',
    involvedCompanyCount: 42, // 改为涉及学校食堂数量
    riskLevelDistribution: '低风险:28,中风险:10,高风险:4', // 食堂风险分布
    averageViolationCount: 2.1, // 平均违规次数（食堂维度）
    averageRectificationRate: 88.5, // 平均整改完成率
    highRiskPoints: '食品留样,人员健康', // 替换为食堂高风险项
    reportGenerator: '陈铭（工号：FJEDU001）', // 工号前缀改为教育EDU
  },
  {
    reportNumber: 'RPT-QZ-FZ-202406-002',
    filterConditions: '区域：丰泽区；时间：2024-06；食堂类型：小学食堂',
    generationTime: '2024-06-30 15:45:18',
    involvedCompanyCount: 56,
    riskLevelDistribution: '低风险:38,中风险:14,高风险:4',
    averageViolationCount: 1.9,
    averageRectificationRate: 91.2,
    highRiskPoints: '餐具消毒,卫生管理',
    reportGenerator: '林晓婷（工号：FJEDU002）',
  },
  {
    reportNumber: 'RPT-QZ-FZ-202406-003',
    filterConditions: '区域：丰泽区；时间：2024-06；食堂类型：幼儿园食堂',
    generationTime: '2024-06-30 14:20:33',
    involvedCompanyCount: 28,
    riskLevelDistribution: '低风险:20,中风险:6,高风险:2',
    averageViolationCount: 1.6,
    averageRectificationRate: 93.8,
    highRiskPoints: '食材储存',
    reportGenerator: '王志远（工号：FJEDU003）',
  },
  {
    reportNumber: 'RPT-QZ-FZ-202406-004',
    filterConditions: '区域：丰泽区；时间：2024-06；食堂类型：职校食堂',
    generationTime: '2024-06-30 13:15:42',
    involvedCompanyCount: 18,
    riskLevelDistribution: '低风险:12,中风险:4,高风险:2',
    averageViolationCount: 1.4,
    averageRectificationRate: 95.6,
    highRiskPoints: '卫生管理',
    reportGenerator: '黄丽萍（工号：FJEDU004）',
  },
  {
    reportNumber: 'RPT-QZ-FZ-202406-005',
    filterConditions: '区域：丰泽区；时间：2024-06；食堂类型：九年一贯制学校食堂',
    generationTime: '2024-06-30 12:30:56',
    involvedCompanyCount: 35,
    riskLevelDistribution: '低风险:22,中风险:10,高风险:3',
    averageViolationCount: 2.3,
    averageRectificationRate: 86.7,
    highRiskPoints: '食材储存,餐具消毒,卫生管理',
    reportGenerator: '郑建明（工号：FJEDU005）',
  },
  {
    reportNumber: 'RPT-QZ-FZ-202406-006',
    filterConditions: '区域：丰泽区；时间：2024-06；食堂类型：民办学校食堂',
    generationTime: '2024-06-30 11:15:28',
    involvedCompanyCount: 32,
    riskLevelDistribution: '低风险:20,中风险:8,高风险:4',
    averageViolationCount: 2.0,
    averageRectificationRate: 89.3,
    highRiskPoints: '餐具消毒,食材储存',
    reportGenerator: '吴永辉（工号：FJEDU006）',
  },
  {
    reportNumber: 'RPT-QZ-FZ-202406-007',
    filterConditions: '区域：丰泽区；时间：2024-06；食堂类型：公办学校食堂',
    generationTime: '2024-06-30 10:30:42',
    involvedCompanyCount: 24,
    riskLevelDistribution: '低风险:18,中风险:5,高风险:1',
    averageViolationCount: 1.3,
    averageRectificationRate: 94.5,
    highRiskPoints: '餐具消毒',
    reportGenerator: '张志强（工号：FJEDU007）',
  },
  {
    reportNumber: 'RPT-QZ-FZ-202406-008',
    filterConditions: '区域：丰泽区；时间：2024-06；食堂类型：寄宿制学校食堂',
    generationTime: '2024-06-30 09:45:15',
    involvedCompanyCount: 20,
    riskLevelDistribution: '低风险:16,中风险:3,高风险:1',
    averageViolationCount: 1.1,
    averageRectificationRate: 96.2,
    highRiskPoints: '卫生管理',
    reportGenerator: '李芳（工号：FJEDU008）',
  },
  {
    reportNumber: 'RPT-QZ-FZ-202406-009',
    filterConditions: '区域：丰泽区；时间：2024-06；食堂类型：特殊教育学校食堂',
    generationTime: '2024-06-30 09:00:33',
    involvedCompanyCount: 16,
    riskLevelDistribution: '低风险:12,中风险:3,高风险:1',
    averageViolationCount: 1.2,
    averageRectificationRate: 95.8,
    highRiskPoints: '食材储存',
    reportGenerator: '刘建国（工号：FJEDU009）',
  },
  {
    reportNumber: 'RPT-QZ-FZ-202406-010',
    filterConditions: '区域：丰泽区；时间：2024-06；食堂类型：普惠性幼儿园食堂',
    generationTime: '2024-06-30 08:30:56',
    involvedCompanyCount: 12,
    riskLevelDistribution: '低风险:10,中风险:2,高风险:0',
    averageViolationCount: 0.8,
    averageRectificationRate: 98.5,
    highRiskPoints: '无',
    reportGenerator: '蔡伟明（工号：FJEDU010）',
  },
];
/** 新增/修改的表单/列表的搜索表单 - 企业风险报告管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'reportNumber',
      label: '区域',
      component: 'Input',
      componentProps: {
        placeholder: '请输入区域',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '企业类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业类型',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'time',
      label: '时间配置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入时间配置',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
    },
  ];
}

/** 表格字段 - 企业风险报告管理表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'reportNumber',
      title: '报表编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'reportNumber' },
    },
    {
      field: 'filterConditions',
      title: '筛选条件',
      minWidth: 250,
      sortable: false,
    },
    {
      field: 'generationTime',
      title: '生成时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'involvedCompanyCount',
      title: '涉及企业数量',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'riskLevelDistribution',
      title: '整体风险等级分布',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'averageViolationCount',
      title: '平均违规频次',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'averageRectificationRate',
      title: '平均整改完成率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'highRiskPoints',
      title: '高频风险点',
      minWidth: 180,
      sortable: false,
    },
    {
      field: 'reportGenerator',
      title: '报表生成人',
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
