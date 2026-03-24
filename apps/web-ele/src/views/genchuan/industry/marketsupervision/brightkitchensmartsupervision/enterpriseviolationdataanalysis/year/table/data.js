/** 表格初始数据 - 丰泽区学校食堂违规分析年报管理数据 */
export const dataList = () => [
  {
    reportNumber: 'NYB-QZ-FZ-2024-001', // 年报编号：NYB-泉州-丰泽-年份-序号
    statYear: '2024年', // 统计年份（格式：XXXX年）
    statArea: '丰泽区东海街道', // 统计区域
    superviseEntTotal: 58, // 监管食堂总数
    yearWarnCount: 2185, // 年度总告警次数
    yearIllegalEntCount: 45, // 年度违规食堂数量
    monthIllegalTrend: '1月:158,2月:165,3月:172,4月:185,5月:192,6月:205,7月:218,8月:225,9月:210,10月:198,11月:185,12月:172', // 月度违规趋势
    quarterIllegalDist: 'Q1:495(22.7%),Q2:582(26.6%),Q3:653(29.9%),Q4:455(20.8%)', // 季度违规分布（次数+占比）
    highIllegalType: '从业人员未戴工作帽/口罩:785,操作区卫生不达标:652,食材留样不规范:325,餐具消毒不达标:215,从业人员健康证过期:208', // 高频违规类型TOP5
    areaIllegalRank: '东海社区:15,滨城社区:12,法石社区:8,宝山社区:6,后埔社区:4', // 区域违规排名TOP5
    entTypeIllegalRate: '幼儿园食堂:15.8%,小学食堂:12.5%,中学食堂:9.8%,高校食堂:8.5%,民办学校食堂:18.2%', // 食堂类型违规率
    warnChangeYoy: 8.2, // 同比告警变化率（%）
    yearRectifyRate: 93.5, // 年度整改完成率（%）
    yearDeviceNormalRate: 97.2, // 年度设备正常率（消毒柜/留样柜等）
    yearComplianceRate: 89.8, // 年度合规食堂占比（%）
  },
  {
    reportNumber: 'NYB-QZ-FZ-2024-002',
    statYear: '2024年',
    statArea: '丰泽区丰泽街道',
    superviseEntTotal: 45,
    yearWarnCount: 1856,
    yearIllegalEntCount: 38,
    monthIllegalTrend: '1月:135,2月:142,3月:148,4月:155,5月:162,6月:175,7月:182,8月:190,9月:178,10月:165,11月:155,12月:149',
    quarterIllegalDist: 'Q1:425(22.9%),Q2:492(26.5%),Q3:550(29.6%),Q4:389(20.9%)',
    highIllegalType: '操作区卫生不达标:625,从业人员未戴工作帽/口罩:585,餐具消毒不达标:218,食材储存不当:185,留样柜温度超标:163',
    areaIllegalRank: '丰泽社区:12,迎津社区:9,东涂社区:7,津淮社区:6,霞淮社区:4',
    entTypeIllegalRate: '幼儿园食堂:14.5%,小学食堂:11.8%,中学食堂:8.5%,高校食堂:7.2%,民办学校食堂:16.5%',
    warnChangeYoy: 7.5,
    yearRectifyRate: 94.2,
    yearDeviceNormalRate: 97.8,
    yearComplianceRate: 91.5,
  },
  {
    reportNumber: 'NYB-QZ-FZ-2024-003',
    statYear: '2024年',
    statArea: '丰泽区北峰街道',
    superviseEntTotal: 38,
    yearWarnCount: 1528,
    yearIllegalEntCount: 32,
    monthIllegalTrend: '1月:115,2月:120,3月:125,4月:132,5月:138,6月:145,7月:152,8月:158,9月:148,10月:138,11月:128,12月:121',
    quarterIllegalDist: 'Q1:360(23.6%),Q2:415(27.2%),Q3:458(30.0%),Q4:295(19.3%)',
    highIllegalType: '从业人员未戴工作帽/口罩:525,操作区卫生不达标:458,食材储存不当:185,餐具清洗不彻底:158,垃圾桶未加盖:102',
    areaIllegalRank: '北峰社区:10,招丰社区:8,拒洪社区:6,群峰社区:4,肖厝社区:4',
    entTypeIllegalRate: '小学食堂:13.2%,幼儿园食堂:12.8%,中学食堂:9.5%,高校食堂:6.8%,民办学校食堂:15.8%',
    warnChangeYoy: 8.8,
    yearRectifyRate: 92.8,
    yearDeviceNormalRate: 96.5,
    yearComplianceRate: 88.5,
  },
  {
    reportNumber: 'NYB-QZ-FZ-2024-004',
    statYear: '2024年',
    statArea: '丰泽区城东街道',
    superviseEntTotal: 52,
    yearWarnCount: 2058,
    yearIllegalEntCount: 42,
    monthIllegalTrend: '1月:148,2月:155,3月:162,4月:175,5月:182,6月:195,7月:205,8月:212,9月:198,10月:185,11月:175,12月:168',
    quarterIllegalDist: 'Q1:465(22.6%),Q2:552(26.8%),Q3:615(29.9%),Q4:426(20.7%)',
    highIllegalType: '操作区卫生不达标:685,从业人员未戴工作帽/口罩:625,留样柜温度超标:215,食材采购索证不全:185,清洗池混用:148',
    areaIllegalRank: '埭头社区:12,庄任社区:10,浔美社区:8,东星社区:6,西福社区:6',
    entTypeIllegalRate: '幼儿园食堂:16.2%,小学食堂:13.5%,中学食堂:10.2%,高校食堂:9.5%,民办学校食堂:17.8%',
    warnChangeYoy: 9.0,
    yearRectifyRate: 92.2,
    yearDeviceNormalRate: 96.8,
    yearComplianceRate: 87.8,
  },
  {
    reportNumber: 'NYB-QZ-FZ-2024-005',
    statYear: '2024年',
    statArea: '丰泽区华大街道',
    superviseEntTotal: 42,
    yearWarnCount: 1725,
    yearIllegalEntCount: 35,
    monthIllegalTrend: '1月:128,2月:135,3月:142,4月:148,5月:155,6月:165,7月:172,8月:180,9月:168,10月:155,11月:145,12月:132',
    quarterIllegalDist: 'Q1:405(23.5%),Q2:468(27.1%),Q3:502(29.1%),Q4:350(20.3%)',
    highIllegalType: '从业人员未戴工作帽/口罩:585,操作区卫生不达标:485,从业人员健康证过期:185,餐具消毒不达标:165,食材留样不规范:105',
    areaIllegalRank: '华大社区:9,南埔社区:8,法花美社区:7,城东社区:6,新铺社区:5',
    entTypeIllegalRate: '高校食堂:12.5%,幼儿园食堂:11.8%,小学食堂:10.5%,中学食堂:9.2%,民办学校食堂:16.5%',
    warnChangeYoy: 7.8,
    yearRectifyRate: 93.0,
    yearDeviceNormalRate: 97.0,
    yearComplianceRate: 90.2,
  },
  {
    reportNumber: 'NYB-QZ-FZ-2024-006',
    statYear: '2024年',
    statArea: '丰泽区清源街道',
    superviseEntTotal: 32,
    yearWarnCount: 1285,
    yearIllegalEntCount: 28,
    monthIllegalTrend: '1月:98,2月:102,3月:108,4月:115,5月:120,6月:128,7月:135,8月:142,9月:132,10月:120,11月:110,12月:105',
    quarterIllegalDist: 'Q1:308(24.0%),Q2:363(28.3%),Q3:389(30.3%),Q4:225(17.5%)',
    highIllegalType: '操作区卫生不达标:425,从业人员未戴工作帽/口罩:385,餐具清洗不彻底:155,食材储存不当:125,垃圾桶未加盖:95',
    areaIllegalRank: '西门社区:8,清源社区:7,环山社区:6,田边社区:4,后茂社区:3',
    entTypeIllegalRate: '小学食堂:14.2%,幼儿园食堂:13.5%,中学食堂:10.8%,高校食堂:7.5%,民办学校食堂:16.2%',
    warnChangeYoy: 7.2,
    yearRectifyRate: 94.8,
    yearDeviceNormalRate: 98.0,
    yearComplianceRate: 92.5,
  },
  {
    reportNumber: 'NYB-QZ-FZ-2024-007',
    statYear: '2024年',
    statArea: '丰泽区泉秀街道',
    superviseEntTotal: 65,
    yearWarnCount: 2358,
    yearIllegalEntCount: 48,
    monthIllegalTrend: '1月:165,2月:172,3月:180,4月:195,5月:202,6月:215,7月:225,8月:235,9月:220,10月:205,11月:195,12月:184',
    quarterIllegalDist: 'Q1:517(21.9%),Q2:612(25.9%),Q3:680(28.8%),Q4:549(23.3%)',
    highIllegalType: '从业人员未戴工作帽/口罩:825,操作区卫生不达标:725,食材采购索证不全:215,食材留样不规范:198,餐具消毒不达标:195',
    areaIllegalRank: '泉淮社区:15,灯洲社区:12,成洲社区:9,沉洲社区:7,华丰社区:5',
    entTypeIllegalRate: '幼儿园食堂:17.5%,小学食堂:14.2%,中学食堂:11.5%,高校食堂:8.8%,民办学校食堂:19.2%',
    warnChangeYoy: 9.5,
    yearRectifyRate: 91.8,
    yearDeviceNormalRate: 96.2,
    yearComplianceRate: 86.5,
  },
  {
    reportNumber: 'NYB-QZ-FZ-2024-008',
    statYear: '2024年',
    statArea: '丰泽区东湖街道',
    superviseEntTotal: 40,
    yearWarnCount: 1658,
    yearIllegalEntCount: 36,
    monthIllegalTrend: '1月:122,2月:128,3月:135,4月:142,5月:148,6月:155,7月:162,8月:170,9月:158,10月:145,11月:135,12月:128',
    quarterIllegalDist: 'Q1:385(23.2%),Q2:445(26.8%),Q3:480(28.9%),Q4:348(21.0%)',
    highIllegalType: '操作区卫生不达标:525,从业人员未戴工作帽/口罩:485,垃圾桶未加盖:155,餐具消毒不达标:145,食材留样不规范:148',
    areaIllegalRank: '东湖社区:10,少林社区:8,仁风社区:7,凤山社区:6,圣湖社区:5',
    entTypeIllegalRate: '小学食堂:13.8%,幼儿园食堂:12.5%,中学食堂:10.5%,高校食堂:8.2%,民办学校食堂:17.5%',
    warnChangeYoy: 8.0,
    yearRectifyRate: 93.2,
    yearDeviceNormalRate: 97.5,
    yearComplianceRate: 89.2,
  },
  {
    reportNumber: 'NYB-QZ-FZ-2024-009',
    statYear: '2024年',
    statArea: '丰泽区蟳埔街道',
    superviseEntTotal: 28,
    yearWarnCount: 1125,
    yearIllegalEntCount: 22,
    monthIllegalTrend: '1月:85,2月:88,3月:92,4月:98,5月:102,6月:108,7月:115,8月:120,9月:110,10月:102,11月:95,12月:90',
    quarterIllegalDist: 'Q1:265(23.6%),Q2:308(27.4%),Q3:327(29.1%),Q4:225(20.0%)',
    highIllegalType: '从业人员未戴工作帽/口罩:385,操作区卫生不达标:325,清洗池混用:125,食材储存不当:95,餐具清洗不彻底:95',
    areaIllegalRank: '蟳埔社区:7,金崎社区:6,东梅社区:5,临海社区:3,凤浦社区:1',
    entTypeIllegalRate: '幼儿园食堂:18.5%,小学食堂:15.2%,中学食堂:11.8%,高校食堂:0%,民办学校食堂:20.5%',
    warnChangeYoy: 7.5,
    yearRectifyRate: 94.0,
    yearDeviceNormalRate: 97.8,
    yearComplianceRate: 91.8,
  },
  {
    reportNumber: 'NYB-QZ-FZ-2024-010',
    statYear: '2024年',
    statArea: '丰泽区全域汇总',
    superviseEntTotal: 408, // 全域监管食堂总数
    yearWarnCount: 17806, // 全域年度总告警数
    yearIllegalEntCount: 338, // 全域年度违规食堂数
    monthIllegalTrend: '1月:1300,2月:1350,3月:1400,4月:1480,5月:1550,6月:1650,7月:1750,8月:1820,9月:1700,10月:1580,11月:1480,12月:1396', // 全域月度趋势
    quarterIllegalDist: 'Q1:4050(22.8%),Q2:4680(26.3%),Q3:5270(29.6%),Q4:3806(21.4%)', // 全域季度分布
    highIllegalType: '从业人员未戴工作帽/口罩:6250,操作区卫生不达标:5480,食材留样不规范:1850,餐具消毒不达标:1650,从业人员健康证过期:1576', // 全域高频违规
    areaIllegalRank: '东海街道:85,泉秀街道:78,城东街道:72,丰泽街道:65,北峰街道:58', // 全域街道排名
    entTypeIllegalRate: '幼儿园食堂:16.5%,小学食堂:13.2%,中学食堂:10.5%,高校食堂:9.2%,民办学校食堂:18.8%', // 全域食堂类型违规率
    warnChangeYoy: 8.3, // 全域同比
    yearRectifyRate: 93.0, // 全域整改完成率
    yearDeviceNormalRate: 97.2, // 全域设备正常率
    yearComplianceRate: 89.5, // 全域合规食堂占比
  },
];
/** 新增/修改的表单/列表的搜索表单 - 企业违规分析年报管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'reportNumber',
      label: '报告编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入年报编号（如：NYB-QZ-FZ-2024-001）',
        maxLength: 50,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'statYear',
      label: '统计年份',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '2024年', value: '2024年' },
          { label: '2023年', value: '2023年' },
          { label: '2022年', value: '2022年' },
          { label: '2021年', value: '2021年' },
        ],
        placeholder: '请选择统计年份',
        showSearch: true,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'statArea',
      label: '统计区域',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '丰泽区', value: '丰泽区' },
          { label: '鲤城区', value: '鲤城区' },
          { label: '洛江区', value: '洛江区' },
          { label: '泉港区', value: '泉港区' },
          { label: '晋江市', value: '晋江市' },
          { label: '石狮市', value: '石狮市' },
          { label: '南安市', value: '南安市' },
          { label: '惠安县', value: '惠安县' },
          { label: '安溪县', value: '安溪县' },
          { label: '永春县', value: '永春县' },
          { label: '德化县', value: '德化县' },
        ],
        placeholder: '请选择统计区域',
        showSearch: true,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'superviseEntTotal',
      label: '监管企业总数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入监管企业总数',
        min: 0,
        precision: 0,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'yearWarnCount',
      label: '年度总告警次数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入年度总告警次数',
        min: 0,
        precision: 0,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'yearIllegalEntCount',
      label: '年度违规企业数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入年度违规企业数量',
        min: 0,
        precision: 0,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'warnChangeYoy',
      label: '同比告警变化率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入同比告警变化率',
        min: -100,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'yearRectifyRate',
      label: '年度整改完成率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入年度整改完成率',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'yearDeviceNormalRate',
      label: '年度设备正常率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入年度设备正常率',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'yearComplianceRate',
      label: '年度合规企业占比(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入年度合规企业占比',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      labelWidth: 120,
      rules: 'required',
    },
  ];
}

/** 表格字段 - 企业违规分析年报管理表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'reportNumber',
      title: '报告编号',
      minWidth: 200,
      sortable: true, 
      slots: { default: 'reportNumber' },
    },
    {
      field: 'statYear',
      title: '统计年份',
      minWidth: 100,
      sortable: true, 
    },
    {
      field: 'statArea',
      title: '统计区域',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'superviseEntTotal',
      title: '监管企业总数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'yearWarnCount',
      title: '年度总告警次数',
      minWidth: 140,
      sortable: true, 
    },
    {
      field: 'yearIllegalEntCount',
      title: '年度违规企业数量',
      minWidth: 140,
      sortable: true, 
    },
    {
      field: 'monthIllegalTrend',
      title: '月度违规趋势',
      minWidth: 300,
      sortable: false, 
    },
    {
      field: 'quarterIllegalDist',
      title: '季度违规分布',
      minWidth: 220,
      sortable: false, 
    },
    {
      field: 'highIllegalType',
      title: '高频违规类型TOP5',
      minWidth: 280,
      sortable: false, 
    },
    {
      field: 'areaIllegalRank',
      title: '区域违规排名TOP5',
      minWidth: 250,
      sortable: false, 
    },
    {
      field: 'entTypeIllegalRate',
      title: '企业类型违规率',
      minWidth: 250,
      sortable: false, 
    },
    {
      field: 'warnChangeYoy',
      title: '同比告警变化率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'yearRectifyRate',
      title: '年度整改完成率(%)',
      minWidth: 140,
      sortable: true, 
    },
    {
      field: 'yearDeviceNormalRate',
      title: '年度设备正常率(%)',
      minWidth: 140,
      sortable: true,  
    },
    {
      field: 'yearComplianceRate',
      title: '年度合规企业占比(%)',
      minWidth: 140,
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