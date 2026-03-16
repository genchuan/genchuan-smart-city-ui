/** 表格初始数据 - 企业违规自定义分析报表数据 */
export const dataList = () => [
  {
    reportCode: 'CUSTOM-QZ-FZ-20260615-001', // 自定义报表编号：CUSTOM-泉州-丰泽-日期-序号
    filterCond: '丰泽区-学校食堂-2026年1-6月-未戴口罩', // 核心筛选条件
    createTime: '2026-06-15 14:35:28', // 生成时间（精确至分秒）
    entCount: 85, // 涉及企业数量
    createBy: '张三', // 生成人（关联系统用户表）
    totalWarnCount: 328, // 筛选范围总告警次数
    illegalEntCount: 68, // 筛选范围违规企业数
    avgIllegalCount: 3.86, // 平均违规频次（328/85，保留2位小数）
    highIllegalType: '未戴口罩:156,操作不规范:98,消毒不及时:74', // 高频违规类型TOP3
    areaIllegalDist: '东海街道:32.5%,丰泽街道:28.8%,北峰街道:18.2%,东湖街道:12.5%,华大街道:8.0%', // 区域违规分布（保留1位小数）
    entTypeIllegalDist: '中小学食堂:45.2%,高校食堂:32.5%,幼儿园食堂:22.3%', // 企业类型违规占比（保留1位小数）
    rectifyRate: 89.5, // 筛选范围整改完成率（保留1位小数）
    illegalRankTop10: '丰泽区第一中心小学食堂:12,泉州第九中学食堂:10,丰泽区实验幼儿园食堂:9,泉州师院附小食堂:8,丰泽区第二实验小学食堂:7,东海中学食堂:6,华大附小食堂:5,东湖小学食堂:4,北峰中学食堂:3,湖心实验小学食堂:2', // 违规频次排名TOP10
  },
  {
    reportCode: 'CUSTOM-QZ-LC-20260615-001',
    filterCond: '鲤城区-餐饮门店-2026年1-6月-后厨卫生不达标',
    createTime: '2026-06-15 10:22:15',
    entCount: 128,
    createBy: '李四',
    totalWarnCount: 485,
    illegalEntCount: 95,
    avgIllegalCount: 3.79, // 485/128≈3.79
    highIllegalType: '后厨卫生不达标:215,食材储存不当:156,餐具未消毒:114',
    areaIllegalDist: '鲤中街道:35.8%,临江街道:26.5%,海滨街道:18.2%,浮桥街道:12.5%,江南街道:7.0%',
    entTypeIllegalDist: '中式餐饮:65.8%,西式快餐:20.5%,特色小吃:13.7%',
    rectifyRate: 85.2,
    illegalRankTop10: '鲤城区老泉州餐馆:15,临江路海鲜酒楼:12,海滨街牛肉面店:10,鲤中南路火锅店:9,浮桥西街烧烤店:8,江南大道家常菜馆:7,中山中路小吃店:6,涂门街卤肉店:5,义全街麻辣烫店:4,新门街饺子馆:3',
  },
  {
    reportCode: 'CUSTOM-QZ-JJ-20260615-001',
    filterCond: '晋江市-工业企业-2026年1-6月-消防设施不达标',
    createTime: '2026-06-15 09:18:45',
    entCount: 156,
    createBy: '王五',
    totalWarnCount: 586,
    illegalEntCount: 112,
    avgIllegalCount: 3.76, // 586/156≈3.76
    highIllegalType: '消防设施不达标:258,安全通道堵塞:185,灭火器过期:143',
    areaIllegalDist: '青阳街道:28.5%,梅岭街道:25.2%,陈埭镇:18.8%,安海镇:12.5%,西园街道:9.8%,池店镇:5.2%',
    entTypeIllegalDist: '纺织企业:42.5%,鞋服企业:35.8%,电子企业:15.2%,其他工业:6.5%',
    rectifyRate: 82.8,
    illegalRankTop10: '晋江市XX纺织有限公司:18,泉州XX鞋服有限公司:15,晋江XX电子科技有限公司:12,安海XX包装厂:10,陈埭XX制鞋厂:9,青阳XX机械加工厂:8,梅岭XX五金厂:7,西园XX塑料制品厂:6,池店XX印刷有限公司:5,紫帽XX建材厂:4',
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