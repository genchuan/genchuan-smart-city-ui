/** 表格初始数据 - 企业违规分析半年报管理数据 */
export const dataList = () => [
  {
    reportNumber: 'BNY-QZ-FZ-2024S1-001', // 半年报编号：BNY-泉州-丰泽-2024上半年-序号
    statHalfyear: '2024年上半年', // 统计半年（格式：XXXX年上/下半年）
    statArea: '丰泽区', // 统计区域（默认丰泽区全域）
    statCycle: '2024年01月-2024年06月', // 统计周期（半年月份范围）
    halfyearWarnCount: 3852, // 半年总告警次数
    halfyearIllegalEntCount: 156, // 半年违规企业数量
    quarterIllegalTrend: '2024Q1:1820,2024Q2:2032', // 季度违规趋势（半年内各季度告警）
    highIllegalType: '操作规范:1450,设备维护:1180,安全管理:820', // 高频违规类型（前3）
    areaIllegalRank: '东海街道:45,丰泽街道:38,北峰街道:28', // 区域违规排名（前3）
    entTypeIllegalDist: '燃气供应:68%,管道运输:18%,燃气储存:8%,燃气加气:6%', // 企业类型违规分布
    warnChangeYoy: 8.5, // 同比告警变化率（%）
    warnChangeMom: 4.2, // 环比告警变化率（%）
    halfyearRectifyRate: 88.6, // 半年整改完成率（%）
    halfyearDeviceNormalRate: 94.8, // 半年设备正常率（%）
    complianceRate: 82.5, // 合规企业占比（%）
  },
  {
    reportNumber: 'BNY-QZ-LC-2024S1-001',
    statHalfyear: '2024年上半年',
    statArea: '鲤城区',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 3258,
    halfyearIllegalEntCount: 132,
    quarterIllegalTrend: '2024Q1:1580,2024Q2:1678',
    highIllegalType: '设备维护:1050,操作规范:980,台账不规范:720',
    areaIllegalRank: '鲤中街道:38,临江街道:32,海滨街道:25',
    entTypeIllegalDist: '燃气供应:70%,管道运输:15%,燃气储存:9%,燃气加气:6%',
    warnChangeYoy: 6.8,
    warnChangeMom: 3.5,
    halfyearRectifyRate: 90.2,
    halfyearDeviceNormalRate: 95.5,
    complianceRate: 85.8,
  },
  {
    reportNumber: 'BNY-QZ-JJ-2024S1-001',
    statHalfyear: '2024年上半年',
    statArea: '晋江市',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 4580,
    halfyearIllegalEntCount: 185,
    quarterIllegalTrend: '2024Q1:2150,2024Q2:2430',
    highIllegalType: '操作规范:1680,设备维护:1420,安全管理:980',
    areaIllegalRank: '青阳街道:52,梅岭街道:45,陈埭镇:38',
    entTypeIllegalDist: '燃气供应:65%,管道运输:20%,燃气储存:10%,燃气加气:5%',
    warnChangeYoy: 10.2,
    warnChangeMom: 5.8,
    halfyearRectifyRate: 86.5,
    halfyearDeviceNormalRate: 93.2,
    complianceRate: 78.6,
  },
  {
    reportNumber: 'BNY-QZ-NA-2024S1-001',
    statHalfyear: '2024年上半年',
    statArea: '南安市',
    statCycle: '2024年01月-2024年06月',
    halfyearWarnCount: 4025,
    halfyearIllegalEntCount: 168,
    quarterIllegalTrend: '2024Q1:1920,2024Q2:2105',
    highIllegalType: '操作规范:1520,设备维护:1280,安全管理:850',
    areaIllegalRank: '溪美街道:42,柳城街道:36,水头镇:30',
    entTypeIllegalDist: '燃气供应:67%,管道运输:19%,燃气储存:9%,燃气加气:5%',
    warnChangeYoy: 9.1,
    warnChangeMom: 4.8,
    halfyearRectifyRate: 89.8,
    halfyearDeviceNormalRate: 94.5,
    complianceRate: 80.2,
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