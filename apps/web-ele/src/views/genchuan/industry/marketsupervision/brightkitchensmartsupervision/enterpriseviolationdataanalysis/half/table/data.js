/** 表格初始数据 - 丰泽区学校食堂违规分析半年报管理数据 */
export const dataList = () => [
  {
    reportNumber: 'BNY-QZ-FZ-2024S1-001', // 半年报编号：BNY-泉州-丰泽-2024上半年-序号
    statHalfyear: '2024年上半年', // 统计半年（格式：XXXX年上/下半年）
    statArea: '丰泽区东海街道', // 统计区域
    statCycle: '2024年01月-2024年06月', // 统计周期（半年月份范围）
    halfyearWarnCount: 1085, // 半年总告警次数
    halfyearIllegalEntCount: 88, // 半年违规食堂数量
    quarterIllegalTrend: '2024Q1:520,2024Q2:565', // 季度违规趋势（半年内各季度告警）
    highIllegalType: '从业人员未戴工作帽/口罩:385,操作区卫生不达标:312,食材留样不规范:185', // 高频违规类型（前3）
    areaIllegalRank: '东海社区:30,滨城社区:25,法石社区:18', // 区域违规排名（前3）
    entTypeIllegalDist: '幼儿园食堂:45%,小学食堂:30%,中学食堂:18%,高校食堂:7%', // 食堂类型违规分布
    warnChangeYoy: 8.8, // 同比告警变化率（%）
    warnChangeMom: 4.5, // 环比告警变化率（%）
    halfyearRectifyRate: 92.5, // 半年整改完成率（%）
    halfyearDeviceNormalRate: 96.8, // 半年设备正常率（消毒柜/留样柜等）
    complianceRate: 88.6, // 合规食堂占比（%）
  },
  {
    reportNumber: 'BNY-QZ-FZ-2024S1-002',
    statHalfyear: '2024年上半年',
    statArea: '丰泽区丰泽街道',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 956,
    halfyearIllegalEntCount: 75,
    quarterIllegalTrend: '2024Q1:460,2024Q2:496',
    highIllegalType: '操作区卫生不达标:305,从业人员未戴工作帽/口罩:278,餐具消毒不达标:165',
    areaIllegalRank: '丰泽社区:25,迎津社区:20,东涂社区:15',
    entTypeIllegalDist: '幼儿园食堂:42%,小学食堂:32%,中学食堂:20%,高校食堂:6%',
    warnChangeYoy: 7.5,
    warnChangeMom: 3.8,
    halfyearRectifyRate: 93.8,
    halfyearDeviceNormalRate: 97.5,
    complianceRate: 90.2,
  },
  {
    reportNumber: 'BNY-QZ-FZ-2024S1-003',
    statHalfyear: '2024年上半年',
    statArea: '丰泽区北峰街道',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 785,
    halfyearIllegalEntCount: 65,
    quarterIllegalTrend: '2024Q1:375,2024Q2:410',
    highIllegalType: '从业人员未戴工作帽/口罩:265,操作区卫生不达标:228,食材储存不当:135',
    areaIllegalRank: '北峰社区:22,招丰社区:18,拒洪社区:12',
    entTypeIllegalDist: '小学食堂:40%,幼儿园食堂:35%,中学食堂:20%,高校食堂:5%',
    warnChangeYoy: 9.2,
    warnChangeMom: 5.1,
    halfyearRectifyRate: 91.8,
    halfyearDeviceNormalRate: 96.2,
    complianceRate: 87.5,
  },
  {
    reportNumber: 'BNY-QZ-FZ-2024S1-004',
    statHalfyear: '2024年上半年',
    statArea: '丰泽区城东街道',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 1025,
    halfyearIllegalEntCount: 82,
    quarterIllegalTrend: '2024Q1:490,2024Q2:535',
    highIllegalType: '操作区卫生不达标:335,从业人员未戴工作帽/口罩:298,留样柜温度超标:158',
    areaIllegalRank: '埭头社区:28,庄任社区:22,浔美社区:18',
    entTypeIllegalDist: '幼儿园食堂:48%,小学食堂:28%,中学食堂:17%,高校食堂:7%',
    warnChangeYoy: 9.0,
    warnChangeMom: 4.8,
    halfyearRectifyRate: 91.2,
    halfyearDeviceNormalRate: 96.5,
    complianceRate: 86.8,
  },
  {
    reportNumber: 'BNY-QZ-FZ-2024S1-005',
    statHalfyear: '2024年上半年',
    statArea: '丰泽区华大街道',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 878,
    halfyearIllegalEntCount: 70,
    quarterIllegalTrend: '2024Q1:420,2024Q2:458',
    highIllegalType: '从业人员未戴工作帽/口罩:295,操作区卫生不达标:245,从业人员健康证过期:142',
    areaIllegalRank: '华大社区:20,南埔社区:18,法花美社区:15',
    entTypeIllegalDist: '高校食堂:35%,幼儿园食堂:30%,小学食堂:20%,中学食堂:15%',
    warnChangeYoy: 7.8,
    warnChangeMom: 4.0,
    halfyearRectifyRate: 92.2,
    halfyearDeviceNormalRate: 97.0,
    complianceRate: 89.5,
  },
  {
    reportNumber: 'BNY-QZ-FZ-2024S1-006',
    statHalfyear: '2024年上半年',
    statArea: '丰泽区清源街道',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 668,
    halfyearIllegalEntCount: 55,
    quarterIllegalTrend: '2024Q1:320,2024Q2:348',
    highIllegalType: '操作区卫生不达标:205,从业人员未戴工作帽/口罩:185,餐具清洗不彻底:108',
    areaIllegalRank: '西门社区:18,清源社区:15,环山社区:12',
    entTypeIllegalDist: '小学食堂:42%,幼儿园食堂:38%,中学食堂:15%,高校食堂:5%',
    warnChangeYoy: 7.2,
    warnChangeMom: 3.5,
    halfyearRectifyRate: 94.5,
    halfyearDeviceNormalRate: 97.8,
    complianceRate: 91.8,
  },
  {
    reportNumber: 'BNY-QZ-FZ-2024S1-007',
    statHalfyear: '2024年上半年',
    statArea: '丰泽区泉秀街道',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 1158,
    halfyearIllegalEntCount: 95,
    quarterIllegalTrend: '2024Q1:550,2024Q2:608',
    highIllegalType: '从业人员未戴工作帽/口罩:405,操作区卫生不达标:352,食材采购索证不全:185',
    areaIllegalRank: '泉淮社区:32,灯洲社区:28,成洲社区:20',
    entTypeIllegalDist: '幼儿园食堂:46%,小学食堂:29%,中学食堂:18%,高校食堂:7%',
    warnChangeYoy: 9.5,
    warnChangeMom: 5.2,
    halfyearRectifyRate: 90.8,
    halfyearDeviceNormalRate: 96.5,
    complianceRate: 85.6,
  },
  {
    reportNumber: 'BNY-QZ-FZ-2024S1-008',
    statHalfyear: '2024年上半年',
    statArea: '丰泽区东湖街道',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 825,
    halfyearIllegalEntCount: 72,
    quarterIllegalTrend: '2024Q1:390,2024Q2:435',
    highIllegalType: '操作区卫生不达标:265,从业人员未戴工作帽/口罩:245,垃圾桶未加盖:128',
    areaIllegalRank: '东湖社区:22,少林社区:18,仁风社区:15',
    entTypeIllegalDist: '小学食堂:38%,幼儿园食堂:35%,中学食堂:20%,高校食堂:7%',
    warnChangeYoy: 8.0,
    warnChangeMom: 4.2,
    halfyearRectifyRate: 92.0,
    halfyearDeviceNormalRate: 96.8,
    complianceRate: 88.2,
  },
  {
    reportNumber: 'BNY-QZ-FZ-2024S1-009',
    statHalfyear: '2024年上半年',
    statArea: '丰泽区蟳埔街道',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 558,
    halfyearIllegalEntCount: 45,
    quarterIllegalTrend: '2024Q1:265,2024Q2:293',
    highIllegalType: '从业人员未戴工作帽/口罩:185,操作区卫生不达标:165,清洗池混用:95',
    areaIllegalRank: '蟳埔社区:15,金崎社区:12,东梅社区:10',
    entTypeIllegalDist: '幼儿园食堂:50%,小学食堂:35%,中学食堂:15%,高校食堂:0%',
    warnChangeYoy: 7.5,
    warnChangeMom: 3.8,
    halfyearRectifyRate: 93.5,
    halfyearDeviceNormalRate: 97.2,
    complianceRate: 90.5,
  },
  {
    reportNumber: 'BNY-QZ-FZ-2024S1-010',
    statHalfyear: '2024年上半年',
    statArea: '丰泽区全域汇总',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 9026, // 全域汇总告警数
    halfyearIllegalEntCount: 720, // 全域汇总违规食堂数
    quarterIllegalTrend: '2024Q1:4380,2024Q2:4646', // 全域季度趋势
    highIllegalType: '从业人员未戴工作帽/口罩:3085,操作区卫生不达标:2585,食材留样不规范:1458', // 全域高频违规类型
    areaIllegalRank: '东海街道:88,泉秀街道:82,城东街道:75', // 全域街道排名
    entTypeIllegalDist: '幼儿园食堂:44%,小学食堂:31%,中学食堂:18%,高校食堂:7%', // 全域食堂类型分布
    warnChangeYoy: 8.5, // 全域同比
    warnChangeMom: 4.5, // 全域环比
    halfyearRectifyRate: 92.5, // 全域整改完成率
    halfyearDeviceNormalRate: 96.8, // 全域设备正常率
    complianceRate: 88.8, // 全域合规食堂占比
  },
];

/** 新增/修改的表单/列表的搜索表单 - 企业违规分析半年报管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'reportNumber',
      label: '报告编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入半年报编号（如：BNY-QZ-FZ-2024S1-001）',
        maxLength: 50,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'statHalfyear',
      label: '统计半年',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '2024年上半年', value: '2024年上半年' },
          { label: '2024年下半年', value: '2024年下半年' },
          { label: '2023年上半年', value: '2023年上半年' },
          { label: '2023年下半年', value: '2023年下半年' },
        ],
        placeholder: '请选择统计半年',
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
      fieldName: 'halfyearWarnCount',
      label: '半年总告警次数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入半年总告警次数',
        min: 0,
        precision: 0,
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'halfyearIllegalEntCount',
      label: '半年违规企业数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入半年违规企业数量',
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
      fieldName: 'warnChangeMom',
      label: '环比告警变化率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入环比告警变化率',
        min: -100,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'halfyearRectifyRate',
      label: '半年整改完成率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入半年整改完成率',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'halfyearDeviceNormalRate',
      label: '半年设备正常率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入半年设备正常率',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      labelWidth: 120,
      rules: 'required',
    },
    {
      fieldName: 'complianceRate',
      label: '合规企业占比(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入合规企业占比',
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

/** 表格字段 - 企业违规分析半年报管理表格列 */
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
      field: 'statHalfyear',
      title: '统计半年',
      minWidth: 130,
      sortable: true, 
    },
    {
      field: 'statArea',
      title: '统计区域',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'statCycle',
      title: '统计周期',
      minWidth: 180,
      sortable: false,
    },
    {
      field: 'halfyearWarnCount',
      title: '半年总告警次数',
      minWidth: 140,
      sortable: true, 
    },
    {
      field: 'halfyearIllegalEntCount',
      title: '半年违规企业数量',
      minWidth: 140,
      sortable: true, 
    },
    {
      field: 'quarterIllegalTrend',
      title: '季度违规趋势',
      minWidth: 200,
      sortable: false, 
    },
    {
      field: 'highIllegalType',
      title: '高频违规类型',
      minWidth: 220,
      sortable: false, 
    },
    {
      field: 'areaIllegalRank',
      title: '区域违规排名',
      minWidth: 200,
      sortable: false, 
    },
    {
      field: 'entTypeIllegalDist',
      title: '企业类型违规分布',
      minWidth: 200,
      sortable: false, 
    },
    {
      field: 'warnChangeYoy',
      title: '同比告警变化率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'warnChangeMom',
      title: '环比告警变化率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'halfyearRectifyRate',
      title: '半年整改完成率(%)',
      minWidth: 140,
      sortable: true, 
    },
    {
      field: 'halfyearDeviceNormalRate',
      title: '半年设备正常率(%)',
      minWidth: 140,
      sortable: true, 
    },
    {
      field: 'complianceRate',
      title: '合规企业占比(%)',
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