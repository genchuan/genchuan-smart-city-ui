/** 表格初始数据 - 丰泽区学校食堂违规自定义分析报表数据 */
export const dataList = () => [
  {
    reportCode: 'CUSTOM-QZ-FZ-20260615-001', // 自定义报表编号：CUSTOM-泉州-丰泽-日期-序号
    filterCond: '丰泽区-学校食堂-2026年1-6月-未戴工作帽/口罩', // 核心筛选条件
    createTime: '2026-06-15 14:35:28', // 生成时间（精确至分秒）
    entCount: 85, // 涉及食堂数量
    createBy: '张三', // 生成人（关联系统用户表）
    totalWarnCount: 328, // 筛选范围总告警次数
    illegalEntCount: 68, // 筛选范围违规食堂数
    avgIllegalCount: 3.86, // 平均违规频次（328/85，保留2位小数）
    highIllegalType: '未戴工作帽/口罩:156,操作区卫生不达标:98,餐具消毒不及时:74', // 高频违规类型TOP3
    areaIllegalDist: '东海街道:32.5%,丰泽街道:28.8%,北峰街道:18.2%,东湖街道:12.5%,华大街道:8.0%', // 区域违规分布（保留1位小数）
    entTypeIllegalDist: '幼儿园食堂:45.2%,小学食堂:32.5%,中学食堂:22.3%', // 食堂类型违规占比（保留1位小数）
    rectifyRate: 89.5, // 筛选范围整改完成率（保留1位小数）
    illegalRankTop10: '丰泽区实验幼儿园食堂:12,丰泽区第一中心小学食堂:10,泉州第九中学食堂:9,泉州师院附小食堂:8,丰泽区第二实验小学食堂:7,东海中学食堂:6,华大附小食堂:5,东湖小学食堂:4,北峰中学食堂:3,湖心实验小学食堂:2', // 违规频次排名TOP10
  },
  {
    reportCode: 'CUSTOM-QZ-FZ-20260615-002',
    filterCond: '丰泽区-学校食堂-2026年4-6月-操作区卫生不达标',
    createTime: '2026-06-15 15:12:45',
    entCount: 78,
    createBy: '李四',
    totalWarnCount: 298,
    illegalEntCount: 62,
    avgIllegalCount: 3.82, // 298/78≈3.82
    highIllegalType: '操作区卫生不达标:145,未戴工作帽/口罩:88,食材留样不规范:65',
    areaIllegalDist: '泉秀街道:30.5%,城东街道:25.8%,东海街道:20.2%,丰泽街道:15.5%,北峰街道:8.0%',
    entTypeIllegalDist: '小学食堂:42.5%,幼儿园食堂:38.8%,中学食堂:18.7%',
    rectifyRate: 91.2,
    illegalRankTop10: '丰泽区第三实验小学食堂:11,泉秀中心幼儿园食堂:10,城东中学食堂:9,丰泽区机关幼儿园食堂:8,刺桐小学食堂:7,云谷小学食堂:6,沉洲小学食堂:5,坪山路小学食堂:4,东星小学食堂:3,通政中心小学丰泽分校食堂:2',
  },
  {
    reportCode: 'CUSTOM-QZ-FZ-20260615-003',
    filterCond: '丰泽区-幼儿园食堂-2026年1-6月-食材留样不规范',
    createTime: '2026-06-15 10:08:32',
    entCount: 45,
    createBy: '王五',
    totalWarnCount: 185,
    illegalEntCount: 38,
    avgIllegalCount: 4.11, // 185/45≈4.11
    highIllegalType: '食材留样不规范:98,未戴工作帽/口罩:55,操作区卫生不达标:32',
    areaIllegalDist: '东海街道:35.2%,丰泽街道:28.5%,泉秀街道:18.8%,东湖街道:10.5%,华大街道:7.0%',
    entTypeIllegalDist: '民办幼儿园食堂:65.8%,公办幼儿园食堂:34.2%',
    rectifyRate: 88.5,
    illegalRankTop10: '丰泽区阳光幼儿园食堂:10,东海湾实验幼儿园食堂:9,丰泽区小星星幼儿园食堂:8,泉秀双语幼儿园食堂:7,东湖中心幼儿园食堂:6,北峰小精灵幼儿园食堂:5,华大附属幼儿园食堂:4,城东安琪幼儿园食堂:3,清源爱心幼儿园食堂:2,蟳埔育苗幼儿园食堂:1',
  },
  {
    reportCode: 'CUSTOM-QZ-FZ-20260615-004',
    filterCond: '丰泽区-小学食堂-2026年3-6月-餐具消毒不达标',
    createTime: '2026-06-15 11:25:18',
    entCount: 38,
    createBy: '赵六',
    totalWarnCount: 152,
    illegalEntCount: 30,
    avgIllegalCount: 4.00, // 152/38=4.00
    highIllegalType: '餐具消毒不达标:78,操作区卫生不达标:45,未戴工作帽/口罩:29',
    areaIllegalDist: '北峰街道:32.8%,东湖街道:26.5%,丰泽街道:20.8%,华大街道:12.5%,城东街道:7.4%',
    entTypeIllegalDist: '公办小学食堂:75.5%,民办小学食堂:24.5%',
    rectifyRate: 92.8,
    illegalRankTop10: '北峰小学食堂:9,东湖小学食堂:8,丰泽区第七中心小学食堂:7,华大附小食堂:6,湖心小学食堂:5,圣湖小学食堂:4,少林小学食堂:3,东涂小学食堂:2,霞淮小学食堂:2,后埔小学食堂:1',
  },
  {
    reportCode: 'CUSTOM-QZ-FZ-20260615-005',
    filterCond: '丰泽区-中学食堂-2026年1-6月-从业人员健康证过期',
    createTime: '2026-06-15 09:45:56',
    entCount: 22,
    createBy: '孙七',
    totalWarnCount: 85,
    illegalEntCount: 18,
    avgIllegalCount: 3.86, // 85/22≈3.86
    highIllegalType: '健康证过期:42,未戴工作帽/口罩:25,操作区卫生不达标:18',
    areaIllegalDist: '城东街道:40.5%,东海街道:30.2%,丰泽街道:18.8%,北峰街道:10.5%',
    entTypeIllegalDist: '公办中学食堂:85.5%,民办中学食堂:14.5%',
    rectifyRate: 90.5,
    illegalRankTop10: '泉州第九中学食堂:8,城东中学食堂:7,东海中学食堂:6,北峰中学食堂:5,泉州现代中学食堂:4,泉州科技中学食堂:3,泉州第十一中学食堂:2,泉州实验中学丰泽校区食堂:2,泉州五中城东校区食堂:1,泉州七中东海校区食堂:1',
  },
  {
    reportCode: 'CUSTOM-QZ-FZ-20260615-006',
    filterCond: '丰泽区-学校食堂-2026年5-6月-清洗池混用',
    createTime: '2026-06-15 16:22:48',
    entCount: 65,
    createBy: '周八',
    totalWarnCount: 245,
    illegalEntCount: 52,
    avgIllegalCount: 3.77, // 245/65≈3.77
    highIllegalType: '清洗池混用:115,操作区卫生不达标:78,未戴工作帽/口罩:52',
    areaIllegalDist: '蟳埔街道:35.8%,清源街道:25.2%,泉秀街道:18.5%,东湖街道:12.8%,华大街道:7.7%',
    entTypeIllegalDist: '幼儿园食堂:48.5%,小学食堂:32.8%,中学食堂:18.7%',
    rectifyRate: 87.8,
    illegalRankTop10: '蟳埔中心幼儿园食堂:10,清源中心小学食堂:9,泉秀第二中心小学食堂:8,蟳埔小学食堂:7,清源中学食堂:6,法石小学食堂:5,金崎小学食堂:4,东梅小学食堂:3,环山小学食堂:2,田边小学食堂:1',
  },
  {
    reportCode: 'CUSTOM-QZ-FZ-20260615-007',
    filterCond: '丰泽区-民办学校食堂-2026年1-6月-垃圾桶未加盖',
    createTime: '2026-06-15 14:10:15',
    entCount: 32,
    createBy: '吴九',
    totalWarnCount: 128,
    illegalEntCount: 26,
    avgIllegalCount: 4.00, // 128/32=4.00
    highIllegalType: '垃圾桶未加盖:65,未戴工作帽/口罩:35,操作区卫生不达标:28',
    areaIllegalDist: '东海街道:38.5%,泉秀街道:28.8%,丰泽街道:18.2%,城东街道:10.5%,北峰街道:4.0%',
    entTypeIllegalDist: '民办幼儿园食堂:62.5%,民办小学食堂:28.8%,民办中学食堂:8.7%',
    rectifyRate: 86.5,
    illegalRankTop10: '丰泽区金色童年幼儿园食堂:9,东海双语小学食堂:8,泉秀外国语学校食堂:7,丰泽区小博士幼儿园食堂:6,城东精英小学食堂:5,北峰阳光中学食堂:4,东湖育才幼儿园食堂:3,华大外国语幼儿园食堂:2,清源创新小学食堂:2,蟳埔未来幼儿园食堂:1',
  },
  {
    reportCode: 'CUSTOM-QZ-FZ-20260615-008',
    filterCond: '丰泽区-公办学校食堂-2026年2-6月-留样柜温度超标',
    createTime: '2026-06-15 11:58:36',
    entCount: 58,
    createBy: '郑十',
    totalWarnCount: 215,
    illegalEntCount: 45,
    avgIllegalCount: 3.71, // 215/58≈3.71
    highIllegalType: '留样柜温度超标:98,操作区卫生不达标:65,未戴工作帽/口罩:52',
    areaIllegalDist: '丰泽街道:32.5%,东海街道:29.8%,城东街道:18.2%,东湖街道:10.5%,北峰街道:9.0%',
    entTypeIllegalDist: '公办幼儿园食堂:42.5%,公办小学食堂:38.8%,公办中学食堂:18.7%',
    rectifyRate: 93.2,
    illegalRankTop10: '丰泽区机关幼儿园食堂:10,丰泽区第一中心小学食堂:9,泉州第九中学食堂:8,东海中心小学食堂:7,丰泽区第二实验小学食堂:6,城东中心小学食堂:5,东湖中心幼儿园食堂:4,北峰中心小学食堂:3,华大中心小学食堂:2,清源中心幼儿园食堂:1',
  },
  {
    reportCode: 'CUSTOM-QZ-FZ-20260615-009',
    filterCond: '丰泽区-高校食堂-2026年1-6月-食材采购索证不全',
    createTime: '2026-06-15 08:45:22',
    entCount: 15,
    createBy: '钱十一',
    totalWarnCount: 78,
    illegalEntCount: 12,
    avgIllegalCount: 5.20, // 78/15=5.20
    highIllegalType: '索证不全:45,未戴工作帽/口罩:18,操作区卫生不达标:15',
    areaIllegalDist: '华大街道:65.5%,东海街道:25.8%,城东街道:8.7%',
    entTypeIllegalDist: '本科院校食堂:75.8%,高职高专食堂:24.2%',
    rectifyRate: 88.2,
    illegalRankTop10: '华侨大学泉州校区第一食堂:9,泉州师范学院东海校区食堂:8,闽南理工学院丰泽校区食堂:6,泉州职业技术大学食堂:5,泉州医学高等专科学校食堂:4,泉州经贸职业技术学院食堂:3,泉州工艺美术职业学院丰泽实训基地食堂:2,泉州幼儿师范高等专科学校食堂:2,福建电力职业技术学院食堂:1,泉州华光职业学院食堂:1',
  },
  {
    reportCode: 'CUSTOM-QZ-FZ-20260615-010',
    filterCond: '丰泽区-所有学校食堂-2026年1-6月-综合违规',
    createTime: '2026-06-15 17:05:58',
    entCount: 128,
    createBy: '综合管理员',
    totalWarnCount: 485,
    illegalEntCount: 98,
    avgIllegalCount: 3.79, // 485/128≈3.79
    highIllegalType: '未戴工作帽/口罩:185,操作区卫生不达标:156,食材留样不规范:88,餐具消毒不达标:38,其他违规:18',
    areaIllegalDist: '东海街道:28.5%,泉秀街道:22.8%,丰泽街道:18.5%,城东街道:15.2%,北峰街道:8.8%,东湖街道:5.2%,华大街道:1.0%',
    entTypeIllegalDist: '幼儿园食堂:42.5%,小学食堂:35.8%,中学食堂:15.2%,高校食堂:6.5%',
    rectifyRate: 90.2,
    illegalRankTop10: '丰泽区实验幼儿园食堂:15,丰泽区第一中心小学食堂:12,泉州第九中学食堂:10,泉秀中心幼儿园食堂:9,东海中学食堂:8,城东中心小学食堂:7,东湖小学食堂:6,北峰中心小学食堂:5,华大附小食堂:4,清源中心幼儿园食堂:3',
  },
];
/** 新增/修改的表单/列表的搜索表单 - 企业违规自定义分析报表表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'reportCode',
      label: '报表编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入自定义报表编号（如：CUSTOM-QZ-FZ-20260615-001）',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'filterCond',
      label: '筛选条件',
      component: 'Input',
      componentProps: {
        placeholder: '请输入核心筛选条件（如：丰泽区-学校食堂-2026年1-6月-未戴口罩）',
        maxLength: 200,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'createTime',
      label: '生成时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生成时间',
        picker: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'createBy',
      label: '生成人',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '张三', value: '张三' },
          { label: '李四', value: '李四' },
          { label: '王五', value: '王五' },
          { label: '赵六', value: '赵六' },
        ],
        placeholder: '请选择生成人',
        showSearch: true,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'entCount',
      label: '涉及企业数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入涉及企业数量',
        min: 0,
        precision: 0,
      },
      labelWidth: 120,
    },
  ];
}

/** 表格字段 - 企业违规自定义分析报表表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'reportCode',
      title: '报表编号',
      minWidth: 220,
      sortable: true, 
    },
    {
      field: 'filterCond',
      title: '筛选条件',
      minWidth: 280,
      sortable: false,
    },
    {
      field: 'createTime',
      title: '生成时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'entCount',
      title: '涉及企业数量',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'createBy',
      title: '生成人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'totalWarnCount',
      title: '筛选范围总告警次数',
      minWidth: 140,
      sortable: true, 
    },
    {
      field: 'illegalEntCount',
      title: '筛选范围违规企业数',
      minWidth: 140,
      sortable: true, 
    },
    {
      field: 'avgIllegalCount',
      title: '平均违规频次',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'highIllegalType',
      title: '高频违规类型',
      minWidth: 250,
      sortable: false, 
    },
    {
      field: 'areaIllegalDist',
      title: '区域违规分布',
      minWidth: 250,
      sortable: false, 
    },
    {
      field: 'entTypeIllegalDist',
      title: '企业类型违规占比',
      minWidth: 250,
      sortable: false, 
    },
    {
      field: 'rectifyRate',
      title: '筛选范围整改完成率(%)',
      minWidth: 160,
      sortable: true, 
    },
    {
      field: 'illegalRankTop10',
      title: '违规频次排名TOP10',
      minWidth: 350,
      sortable: false, 
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}