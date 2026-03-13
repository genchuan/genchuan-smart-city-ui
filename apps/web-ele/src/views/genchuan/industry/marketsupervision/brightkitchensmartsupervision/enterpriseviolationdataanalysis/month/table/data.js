/** 表格初始数据 - 企业风险报告管理数据 */
export const dataList = () => [
  {
    reportNumber: 'MLY-QZ-FZ-202406-001', // 月度报告编号：MLY-泉州-丰泽-202406-序号
    statMonth: '2024年06月', // 统计月份（关联ent_illegal_ana_report.stat_month）
    statArea: '丰泽区', // 统计区域（默认丰泽区全域）
    entTypeDist: '燃气供应:35,管道运输:12,燃气储存:8,燃气加气:5', // 企业类型分布
    monthWarnCount: 685, // 本月总告警次数
    monthIllegalEntCount: 42, // 本月违规企业数量
    highIllegalType: '操作规范:185,设备维护:156,安全管理:98', // 高频违规类型（前3）
    areaIllegalRank: '东海街道:12,丰泽街道:9,北峰街道:7', // 区域违规排名（前3）
    entTypeIllegalDist: '燃气供应:65%,管道运输:18%,燃气储存:10%,燃气加气:7%', // 企业类型违规分布
    warnChangeYoy: 9.8, // 同比告警变化率（%）
    warnChangeMom: 5.6, // 环比告警变化率（%）
    monthRectifyRate: 84.2, // 本月整改完成率（%）
    monthDeviceNormalRate: 92.5, // 本月设备正常率（%）
  },
  {
    reportNumber: 'MLY-QZ-FZ-202406-002',
    statMonth: '2024年06月',
    statArea: '鲤城区',
    entTypeDist: '燃气供应:28,管道运输:9,燃气储存:6,燃气加气:4',
    monthWarnCount: 578,
    monthIllegalEntCount: 35,
    highIllegalType: '设备维护:142,操作规范:128,台账不规范:75',
    areaIllegalRank: '鲤中街道:10,临江街道:8,海滨街道:6',
    entTypeIllegalDist: '燃气供应:68%,管道运输:15%,燃气储存:9%,燃气加气:8%',
    warnChangeYoy: 7.5,
    warnChangeMom: 4.2,
    monthRectifyRate: 86.7,
    monthDeviceNormalRate: 93.8,
  },
  {
    reportNumber: 'MLY-QZ-FZ-202406-003',
    statMonth: '2024年06月',
    statArea: '晋江市',
    entTypeDist: '燃气供应:42,管道运输:15,燃气储存:10,燃气加气:7',
    monthWarnCount: 792,
    monthIllegalEntCount: 51,
    highIllegalType: '操作规范:210,设备维护:178,安全管理:115',
    areaIllegalRank: '青阳街道:15,梅岭街道:12,陈埭镇:10',
    entTypeIllegalDist: '燃气供应:62%,管道运输:20%,燃气储存:12%,燃气加气:6%',
    warnChangeYoy: 12.3,
    warnChangeMom: 8.5,
    monthRectifyRate: 80.5,
    monthDeviceNormalRate: 90.2,
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