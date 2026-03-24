/** 表格初始数据 - 丰泽区学校食堂风险报告管理数据 */
export const dataList = () => [
  {
    reportNumber: 'MLY-QZ-FZ-202406-001', // 月度报告编号：MLY-泉州-丰泽-202406-序号
    statMonth: '2024年06月', // 统计月份
    statArea: '丰泽区东海街道', // 统计区域
    entTypeDist: '小学食堂:12,中学食堂:8,幼儿园食堂:15,高校食堂:3', // 食堂类型分布（数量）
    monthWarnCount: 185, // 本月总告警次数
    monthIllegalEntCount: 22, // 本月违规食堂数量
    highIllegalType: '从业人员未戴工作帽/口罩:65,操作区卫生不达标:48,食材留样不规范:32', // 高频违规类型（前3）
    areaIllegalRank: '东海社区:8,滨城社区:6,法石社区:4', // 区域违规排名（前3）
    entTypeIllegalDist: '幼儿园食堂:45%,小学食堂:30%,中学食堂:18%,高校食堂:7%', // 食堂类型违规分布
    warnChangeYoy: 7.8, // 同比告警变化率（%）
    warnChangeMom: 4.2, // 环比告警变化率（%）
    monthRectifyRate: 90.5, // 本月整改完成率（%）
    monthDeviceNormalRate: 94.8, // 本月设备正常率（消毒柜/留样柜等）
  },
  {
    reportNumber: 'MLY-QZ-FZ-202406-002',
    statMonth: '2024年06月',
    statArea: '丰泽区丰泽街道',
    entTypeDist: '小学食堂:9,中学食堂:6,幼儿园食堂:11,高校食堂:2',
    monthWarnCount: 152,
    monthIllegalEntCount: 18,
    highIllegalType: '操作区卫生不达标:52,从业人员未戴工作帽/口罩:45,餐具消毒不达标:28',
    areaIllegalRank: '丰泽社区:7,迎津社区:5,东涂社区:4',
    entTypeIllegalDist: '幼儿园食堂:42%,小学食堂:32%,中学食堂:20%,高校食堂:6%',
    warnChangeYoy: 6.5,
    warnChangeMom: 3.8,
    monthRectifyRate: 92.3,
    monthDeviceNormalRate: 95.6,
  },
  {
    reportNumber: 'MLY-QZ-FZ-202406-003',
    statMonth: '2024年06月',
    statArea: '丰泽区北峰街道',
    entTypeDist: '小学食堂:8,中学食堂:5,幼儿园食堂:9,高校食堂:1',
    monthWarnCount: 128,
    monthIllegalEntCount: 15,
    highIllegalType: '从业人员未戴工作帽/口罩:42,操作区卫生不达标:36,食材储存不当:21',
    areaIllegalRank: '北峰社区:6,招丰社区:4,拒洪社区:3',
    entTypeIllegalDist: '小学食堂:40%,幼儿园食堂:35%,中学食堂:20%,高校食堂:5%',
    warnChangeYoy: 8.3,
    warnChangeMom: 5.1,
    monthRectifyRate: 88.7,
    monthDeviceNormalRate: 93.2,
  },
  {
    reportNumber: 'MLY-QZ-FZ-202406-004',
    statMonth: '2024年06月',
    statArea: '丰泽区城东街道',
    entTypeDist: '小学食堂:10,中学食堂:7,幼儿园食堂:13,高校食堂:4',
    monthWarnCount: 176,
    monthIllegalEntCount: 20,
    highIllegalType: '操作区卫生不达标:58,从业人员未戴工作帽/口罩:49,留样柜温度超标:25',
    areaIllegalRank: '埭头社区:7,庄任社区:5,浔美社区:4',
    entTypeIllegalDist: '幼儿园食堂:48%,小学食堂:28%,中学食堂:17%,高校食堂:7%',
    warnChangeYoy: 9.1,
    warnChangeMom: 4.7,
    monthRectifyRate: 89.8,
    monthDeviceNormalRate: 94.1,
  },
  {
    reportNumber: 'MLY-QZ-FZ-202406-005',
    statMonth: '2024年06月',
    statArea: '丰泽区华大街道',
    entTypeDist: '小学食堂:7,中学食堂:4,幼儿园食堂:8,高校食堂:6',
    monthWarnCount: 145,
    monthIllegalEntCount: 16,
    highIllegalType: '从业人员未戴工作帽/口罩:46,操作区卫生不达标:38,从业人员健康证过期:22',
    areaIllegalRank: '华大社区:5,南埔社区:4,法花美社区:3',
    entTypeIllegalDist: '高校食堂:35%,幼儿园食堂:30%,小学食堂:20%,中学食堂:15%',
    warnChangeYoy: 7.2,
    warnChangeMom: 3.5,
    monthRectifyRate: 91.2,
    monthDeviceNormalRate: 95.3,
  },
  {
    reportNumber: 'MLY-QZ-FZ-202406-006',
    statMonth: '2024年06月',
    statArea: '丰泽区清源街道',
    entTypeDist: '小学食堂:6,中学食堂:3,幼儿园食堂:7,高校食堂:1',
    monthWarnCount: 108,
    monthIllegalEntCount: 12,
    highIllegalType: '操作区卫生不达标:36,从业人员未戴工作帽/口罩:31,餐具清洗不彻底:18',
    areaIllegalRank: '西门社区:4,清源社区:3,环山社区:2',
    entTypeIllegalDist: '小学食堂:42%,幼儿园食堂:38%,中学食堂:15%,高校食堂:5%',
    warnChangeYoy: 6.8,
    warnChangeMom: 2.9,
    monthRectifyRate: 93.5,
    monthDeviceNormalRate: 96.7,
  },
  {
    reportNumber: 'MLY-QZ-FZ-202406-007',
    statMonth: '2024年06月',
    statArea: '丰泽区泉秀街道',
    entTypeDist: '小学食堂:11,中学食堂:7,幼儿园食堂:14,高校食堂:2',
    monthWarnCount: 192,
    monthIllegalEntCount: 23,
    highIllegalType: '从业人员未戴工作帽/口罩:68,操作区卫生不达标:55,食材采购索证不全:30',
    areaIllegalRank: '泉淮社区:8,灯洲社区:6,成洲社区:5',
    entTypeIllegalDist: '幼儿园食堂:46%,小学食堂:29%,中学食堂:18%,高校食堂:7%',
    warnChangeYoy: 8.9,
    warnChangeMom: 5.3,
    monthRectifyRate: 88.2,
    monthDeviceNormalRate: 93.9,
  },
  {
    reportNumber: 'MLY-QZ-FZ-202406-008',
    statMonth: '2024年06月',
    statArea: '丰泽区东湖街道',
    entTypeDist: '小学食堂:8,中学食堂:5,幼儿园食堂:10,高校食堂:1',
    monthWarnCount: 136,
    monthIllegalEntCount: 17,
    highIllegalType: '操作区卫生不达标:45,从业人员未戴工作帽/口罩:39,垃圾桶未加盖:21',
    areaIllegalRank: '东湖社区:6,少林社区:4,仁风社区:3',
    entTypeIllegalDist: '小学食堂:38%,幼儿园食堂:35%,中学食堂:20%,高校食堂:7%',
    warnChangeYoy: 7.5,
    warnChangeMom: 4.1,
    monthRectifyRate: 90.1,
    monthDeviceNormalRate: 94.5,
  },
  {
    reportNumber: 'MLY-QZ-FZ-202406-009',
    statMonth: '2024年06月',
    statArea: '丰泽区蟳埔街道',
    entTypeDist: '小学食堂:5,中学食堂:2,幼儿园食堂:6,高校食堂:0',
    monthWarnCount: 89,
    monthIllegalEntCount: 10,
    highIllegalType: '从业人员未戴工作帽/口罩:30,操作区卫生不达标:25,清洗池混用:15',
    areaIllegalRank: '蟳埔社区:4,金崎社区:3,东梅社区:2',
    entTypeIllegalDist: '幼儿园食堂:50%,小学食堂:35%,中学食堂:15%,高校食堂:0%',
    warnChangeYoy: 6.2,
    warnChangeMom: 3.3,
    monthRectifyRate: 92.8,
    monthDeviceNormalRate: 95.9,
  },
  {
    reportNumber: 'MLY-QZ-FZ-202406-010',
    statMonth: '2024年06月',
    statArea: '丰泽区全域汇总',
    entTypeDist: '小学食堂:84,中学食堂:50,幼儿园食堂:108,高校食堂:20', // 汇总数量
    monthWarnCount: 1509, // 汇总告警数
    monthIllegalEntCount: 173, // 汇总违规食堂数
    highIllegalType: '从业人员未戴工作帽/口罩:485,操作区卫生不达标:402,食材留样不规范:215', // 汇总违规类型
    areaIllegalRank: '东海街道:22,泉秀街道:20,城东街道:18', // 全域街道排名
    entTypeIllegalDist: '幼儿园食堂:44%,小学食堂:31%,中学食堂:18%,高校食堂:7%', // 全域类型分布
    warnChangeYoy: 7.9, // 全域同比
    warnChangeMom: 4.4, // 全域环比
    monthRectifyRate: 90.6, // 全域整改完成率
    monthDeviceNormalRate: 94.8, // 全域设备正常率
  },
];

/** 新增/修改的表单/列表的搜索表单 - 企业风险报告管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'reportNumber',
      label: '报告编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入月度报告编号（如：MLY-QZ-FZ-202406-001）',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'statMonth',
      label: '统计月份',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择统计月份',
        picker: 'month',
        format: 'YYYY年MM月',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'statArea',
      label: '统计区域',
      component: 'Select',
      componentProps: {
        allowClear: true,
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
      },
      labelWidth: 120,
    },
  ];
}

/** 表格字段 - 企业风险报告管理表格列 */
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
      field: 'statMonth',
      title: '统计月份',
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
      field: 'entTypeDist',
      title: '企业类型分布',
      minWidth: 200,
    },
    {
      field: 'monthWarnCount',
      title: '本月总告警次数',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'monthIllegalEntCount',
      title: '本月违规企业数量',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'highIllegalType',
      title: '高频违规类型',
      minWidth: 200,
    },
    {
      field: 'areaIllegalRank',
      title: '区域违规排名',
      minWidth: 200,
    },
    {
      field: 'entTypeIllegalDist',
      title: '企业类型违规分布',
      minWidth: 200,
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
      field: 'monthRectifyRate',
      title: '本月整改完成率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'monthDeviceNormalRate',
      title: '本月设备正常率(%)',
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