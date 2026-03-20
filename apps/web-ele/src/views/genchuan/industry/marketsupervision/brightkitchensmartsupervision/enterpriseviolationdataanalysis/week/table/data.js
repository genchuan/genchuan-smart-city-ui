/** 表格初始数据 - 丰泽区学校食堂周度风险报告管理数据 */
export const dataList = () => [
  {
    reportNumber: 'WLY-QZ-FZ-202424-001', // 保留丰泽FZ标识
    statWeek: '2024年第24周',
    statArea: '丰泽区', // 统一为丰泽区
    statCycle: '2024-06-10 至 2024-06-16',
    weekWarnCount: 156, // 周度食品安全问题总数
    weekIllegalEntCount: 28, // 周度有问题的食堂数量
    highIllegalType: '食品留样,餐具消毒,人员健康', // 替换为食堂高频违规类型
    areaIllegalRank: '东海街道,丰泽街道,北峰街道', // 丰泽区街道排名
    timeIllegalDist: '08:00-10:00,14:00-16:00,18:00-20:00', // 检查发现问题的时段分布
    warnChangeYoy: 12.5, // 同比问题数量变化率（%）
    warnChangeMom: 8.8, // 环比问题数量变化率（%）
    weekRectifyRate: 82.3, // 周度整改完成率（%）
    weekDeviceNormalRate: 91.7, // 周度食堂设备合规率（%）
  },
  {
    reportNumber: 'WLY-QZ-FZ-202424-002',
    statWeek: '2024年第24周',
    statArea: '丰泽区',
    statCycle: '2024-06-10 至 2024-06-16',
    weekWarnCount: 132,
    weekIllegalEntCount: 22,
    highIllegalType: '食材储存,餐具消毒,台账记录', // 食堂核心违规类型
    areaIllegalRank: '城东街道,东湖街道,华大街道', // 丰泽区其他街道
    timeIllegalDist: '09:00-11:00,15:00-17:00,19:00-21:00',
    warnChangeYoy: 8.6,
    warnChangeMom: 5.4,
    weekRectifyRate: 85.1,
    weekDeviceNormalRate: 93.2,
  },
  {
    reportNumber: 'WLY-QZ-FZ-202424-003',
    statWeek: '2024年第24周',
    statArea: '丰泽区',
    statCycle: '2024-06-10 至 2024-06-16',
    weekWarnCount: 185,
    weekIllegalEntCount: 35,
    highIllegalType: '餐具消毒,食品留样,卫生管理',
    areaIllegalRank: '泉秀街道,清源街道,东海街道', // 丰泽区街道组合
    timeIllegalDist: '08:30-10:30,14:30-16:30,18:30-20:30',
    warnChangeYoy: 15.3,
    warnChangeMom: 10.2,
    weekRectifyRate: 78.6,
    weekDeviceNormalRate: 89.5,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 丰泽区学校食堂风险报告管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'reportNumber',
      label: '报告编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入报告编号',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'statWeek',
      label: '统计周次',
      component: 'Input',
      componentProps: {
        placeholder: '如：2024年第24周',
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
          // 聚焦丰泽区，仅保留丰泽区及下属街道（贴合食堂监管场景）
          { label: '丰泽区', value: '丰泽区' },
          { label: '丰泽区-东海街道', value: '丰泽区-东海街道' },
          { label: '丰泽区-丰泽街道', value: '丰泽区-丰泽街道' },
          { label: '丰泽区-北峰街道', value: '丰泽区-北峰街道' },
          { label: '丰泽区-城东街道', value: '丰泽区-城东街道' },
          { label: '丰泽区-东湖街道', value: '丰泽区-东湖街道' },
          { label: '丰泽区-华大街道', value: '丰泽区-华大街道' },
          { label: '丰泽区-泉秀街道', value: '丰泽区-泉秀街道' },
          { label: '丰泽区-清源街道', value: '丰泽区-清源街道' },
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
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'statWeek',
      title: '统计周次',
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
    },
    {
      field: 'weekWarnCount',
      title: '本周总告警次数',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'weekIllegalEntCount',
      title: '本周违规企业数量',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'highIllegalType',
      title: '高频违规类型',
      minWidth: 180,
    },
    {
      field: 'areaIllegalRank',
      title: '区域违规排名',
      minWidth: 180,
    },
    {
      field: 'timeIllegalDist',
      title: '时段违规分布',
      minWidth: 180,
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
      field: 'weekRectifyRate',
      title: '本周整改完成率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'weekDeviceNormalRate',
      title: '本周设备正常率(%)',
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