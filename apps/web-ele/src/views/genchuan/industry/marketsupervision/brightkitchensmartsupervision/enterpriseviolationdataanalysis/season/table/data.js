/** 表格初始数据 - 企业违规分析季报管理数据 */
export const dataList = () => [
  {
    reportNumber: 'JDY-QZ-FZ-2024Q2-001', // 季报编号：JDY-泉州-丰泽-2024Q2-序号
    statQuarter: '2024年第2季度', // 统计季度
    statArea: '丰泽区', // 统计区域（默认丰泽区全域）
    statCycle: '2024年04月-2024年06月', // 统计周期（季度月份范围）
    quarterWarnCount: 1856, // 本季度总告警次数
    quarterIllegalEntCount: 78, // 本季度违规企业数量
    highIllegalType: '操作规范:720,设备维护:580,安全管理:350', // 高频违规类型（前3）
    areaIllegalRank: '东海街道:25,丰泽街道:18,北峰街道:12', // 区域违规排名（前3）
    monthIllegalTrend: '4月:580,5月:620,6月:656', // 月度违规趋势（季度内各月告警）
    entTypeIllegalRank: '燃气供应:45,管道运输:18,燃气加气:15', // 企业类型违规排名（前3）
    warnChangeYoy: 9.8, // 同比告警变化率（%）
    warnChangeMom: 5.2, // 环比告警变化率（%）
    quarterRectifyRate: 91.5, // 本季度整改完成率（%）
    quarterDeviceNormalRate: 96.8, // 本季度设备正常率（%）
  },
  {
    reportNumber: 'JDY-QZ-LC-2024Q2-001',
    statQuarter: '2024年第2季度',
    statArea: '鲤城区',
    statCycle: '2024年04月-2024年06月',
    quarterWarnCount: 1625,
    quarterIllegalEntCount: 65,
    highIllegalType: '设备维护:650,操作规范:520,台账不规范:280',
    areaIllegalRank: '鲤中街道:20,临江街道:15,海滨街道:12',
    monthIllegalTrend: '4月:510,5月:550,6月:565',
    entTypeIllegalRank: '燃气供应:38,管道运输:15,燃气储存:12',
    warnChangeYoy: 7.5,
    warnChangeMom: 4.1,
    quarterRectifyRate: 89.2,
    quarterDeviceNormalRate: 95.5,
  },
  {
    reportNumber: 'JDY-QZ-JJ-2024Q2-001',
    statQuarter: '2024年第2季度',
    statArea: '晋江市',
    statCycle: '2024年04月-2024年06月',
    quarterWarnCount: 2180,
    quarterIllegalEntCount: 92,
    highIllegalType: '操作规范:850,设备维护:720,安全管理:420',
    areaIllegalRank: '青阳街道:30,梅岭街道:25,陈埭镇:20',
    monthIllegalTrend: '4月:680,5月:720,6月:780',
    entTypeIllegalRank: '燃气供应:55,管道运输:22,燃气加气:15',
    warnChangeYoy: 12.5,
    warnChangeMom: 6.8,
    quarterRectifyRate: 88.6,
    quarterDeviceNormalRate: 94.2,
  },
  {
    reportNumber: 'JDY-QZ-NA-2024Q2-001',
    statQuarter: '2024年第2季度',
    statArea: '南安市',
    statCycle: '2024年04月-2024年06月',
    quarterWarnCount: 1950,
    quarterIllegalEntCount: 81,
    highIllegalType: '操作规范:780,设备维护:650,安全管理:350',
    areaIllegalRank: '溪美街道:22,柳城街道:18,水头镇:15',
    monthIllegalTrend: '4月:620,5月:650,6月:680',
    entTypeIllegalRank: '燃气供应:48,管道运输:18,燃气加气:15',
    warnChangeYoy: 10.2,
    warnChangeMom: 5.5,
    quarterRectifyRate: 90.8,
    quarterDeviceNormalRate: 95.8,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 企业违规分析季报管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'reportNumber',
      label: '报告编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入季报编号（如：JDY-QZ-FZ-2024Q2-001）',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'statQuarter',
      label: '统计季度',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '2024年第1季度', value: '2024年第1季度' },
          { label: '2024年第2季度', value: '2024年第2季度' },
          { label: '2024年第3季度', value: '2024年第3季度' },
          { label: '2024年第4季度', value: '2024年第4季度' },
        ],
        placeholder: '请选择统计季度',
        showSearch: true,
      },
      labelWidth: '120',
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
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'quarterWarnCount',
      label: '本季度总告警次数',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入本季度总告警次数',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'quarterIllegalEntCount',
      label: '本季度违规企业数量',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入本季度违规企业数量',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'warnChangeYoy',
      label: '同比告警变化率(%)',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入同比告警变化率',
        min: -100,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'warnChangeMom',
      label: '环比告警变化率(%)',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入环比告警变化率',
        min: -100,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'quarterRectifyRate',
      label: '本季度整改完成率(%)',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入本季度整改完成率',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'quarterDeviceNormalRate',
      label: '本季度设备正常率(%)',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入本季度设备正常率',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 企业违规分析季报管理表格列 */
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
      field: 'statQuarter',
      title: '统计季度',
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
      field: 'quarterWarnCount',
      title: '本季度总告警次数',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'quarterIllegalEntCount',
      title: '本季度违规企业数量',
      minWidth: 140,
      sortable: true,
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
      field: 'monthIllegalTrend',
      title: '月度违规趋势',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'entTypeIllegalRank',
      title: '企业类型违规排名',
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
      field: 'quarterRectifyRate',
      title: '本季度整改完成率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'quarterDeviceNormalRate',
      title: '本季度设备正常率(%)',
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