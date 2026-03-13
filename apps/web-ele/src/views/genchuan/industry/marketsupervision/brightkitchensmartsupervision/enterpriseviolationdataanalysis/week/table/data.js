/** 表格初始数据 - 企业风险报告管理数据 */
export const dataList = () => [
  {
    reportNumber: 'WLY-QZ-FZ-202424-001',
    statWeek: '2024年第24周',
    statArea: '丰泽区',
    statCycle: '2024-06-10 至 2024-06-16',
    weekWarnCount: 156,
    weekIllegalEntCount: 28,
    highIllegalType: '操作规范,设备维护,安全管理',
    areaIllegalRank: '东海街道,丰泽街道,北峰街道',
    timeIllegalDist: '08:00-10:00,14:00-16:00,18:00-20:00',
    warnChangeYoy: 12.5,
    warnChangeMom: 8.8,
    weekRectifyRate: 82.3,
    weekDeviceNormalRate: 91.7,
  },
  {
    reportNumber: 'WLY-QZ-FZ-202424-002',
    statWeek: '2024年第24周',
    statArea: '鲤城区',
    statCycle: '2024-06-10 至 2024-06-16',
    weekWarnCount: 132,
    weekIllegalEntCount: 22,
    highIllegalType: '设备维护,操作规范,台账不规范',
    areaIllegalRank: '鲤中街道,临江街道,海滨街道',
    timeIllegalDist: '09:00-11:00,15:00-17:00,19:00-21:00',
    warnChangeYoy: 8.6,
    warnChangeMom: 5.4,
    weekRectifyRate: 85.1,
    weekDeviceNormalRate: 93.2,
  },
  {
    reportNumber: 'WLY-QZ-FZ-202424-003',
    statWeek: '2024年第24周',
    statArea: '晋江市',
    statCycle: '2024-06-10 至 2024-06-16',
    weekWarnCount: 185,
    weekIllegalEntCount: 35,
    highIllegalType: '操作规范,设备维护,安全管理',
    areaIllegalRank: '青阳街道,梅岭街道,陈埭镇',
    timeIllegalDist: '08:30-10:30,14:30-16:30,18:30-20:30',
    warnChangeYoy: 15.3,
    warnChangeMom: 10.2,
    weekRectifyRate: 78.6,
    weekDeviceNormalRate: 89.5,
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