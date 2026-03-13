/** 表格初始数据 - 企业违规分析年报管理数据 */
export const dataList = () => [
  {
    reportNumber: 'NYB-QZ-FZ-2024-001', // 年报编号：NYB-泉州-丰泽-年份-序号
    statYear: '2024年', // 统计年份（格式：XXXX年）
    statArea: '丰泽区', // 统计区域（默认丰泽区全域）
    superviseEntTotal: 285, // 监管企业总数
    yearWarnCount: 7856, // 年度总告警次数
    yearIllegalEntCount: 325, // 年度违规企业数量
    monthIllegalTrend: '1月:580,2月:620,3月:650,4月:680,5月:720,6月:750,7月:780,8月:820,9月:790,10月:750,11月:680,12月:636', // 月度违规趋势
    quarterIllegalDist: 'Q1:1850(23.5%),Q2:2150(27.4%),Q3:2390(30.4%),Q4:1466(18.7%)', // 季度违规分布（次数+占比）
    highIllegalType: '操作规范:2850,设备维护:2280,安全管理:1580,台账不规范:650,人员资质:496', // 高频违规类型TOP5
    areaIllegalRank: '东海街道:85,丰泽街道:72,北峰街道:58,东湖街道:45,华大街道:35', // 区域违规排名TOP5
    entTypeIllegalRate: '燃气供应:18.5%,管道运输:12.2%,燃气储存:9.8%,燃气加气:8.5%,燃气施工:15.6%', // 企业类型违规率
    warnChangeYoy: 7.8, // 同比告警变化率（%）
    yearRectifyRate: 90.5, // 年度整改完成率（%）
    yearDeviceNormalRate: 95.2, // 年度设备正常率（%）
    yearComplianceRate: 86.8, // 年度合规企业占比（%）
  },
  {
    reportNumber: 'NYB-QZ-LC-2024-001',
    statYear: '2024年',
    statArea: '鲤城区',
    superviseEntTotal: 245,
    yearWarnCount: 6852,
    yearIllegalEntCount: 285,
    monthIllegalTrend: '1月:520,2月:550,3月:580,4月:600,5月:630,6月:650,7月:680,8月:720,9月:690,10月:650,11月:600,12月:582',
    quarterIllegalDist: 'Q1:1650(24.1%),Q2:1880(27.4%),Q3:2090(30.5%),Q4:1232(18.0%)',
    highIllegalType: '设备维护:2150,操作规范:1980,台账不规范:1250,安全管理:850,应急管理:622',
    areaIllegalRank: '鲤中街道:75,临江街道:68,海滨街道:55,浮桥街道:42,江南街道:35',
    entTypeIllegalRate: '燃气供应:16.8%,管道运输:10.5%,燃气储存:8.2%,燃气加气:7.8%,燃气施工:13.5%',
    warnChangeYoy: 6.5,
    yearRectifyRate: 92.8,
    yearDeviceNormalRate: 96.5,
    yearComplianceRate: 89.2,
  },
  {
    reportNumber: 'NYB-QZ-JJ-2024-001',
    statYear: '2024年',
    statArea: '晋江市',
    superviseEntTotal: 385,
    yearWarnCount: 9258,
    yearIllegalEntCount: 415,
    monthIllegalTrend: '1月:680,2月:720,3月:750,4月:780,5月:820,6月:850,7月:880,8月:920,9月:890,10月:850,11月:780,12月:738',
    quarterIllegalDist: 'Q1:2150(23.2%),Q2:2450(26.5%),Q3:2690(29.1%),Q4:1968(21.2%)',
    highIllegalType: '操作规范:3250,设备维护:2680,安全管理:1850,台账不规范:850,人员资质:628',
    areaIllegalRank: '青阳街道:95,梅岭街道:82,陈埭镇:75,安海镇:65,西园街道:58',
    entTypeIllegalRate: '燃气供应:20.5%,管道运输:14.2%,燃气储存:10.8%,燃气加气:9.5%,燃气施工:17.8%',
    warnChangeYoy: 9.2,
    yearRectifyRate: 88.6,
    yearDeviceNormalRate: 94.5,
    yearComplianceRate: 82.5,
  },
  {
    reportNumber: 'NYB-QZ-NA-2024-001',
    statYear: '2024年',
    statArea: '南安市',
    superviseEntTotal: 325,
    yearWarnCount: 8560,
    yearIllegalEntCount: 365,
    monthIllegalTrend: '1月:620,2月:650,3月:680,4月:720,5月:750,6月:780,7月:820,8月:850,9月:820,10月:780,11月:720,12月:670',
    quarterIllegalDist: 'Q1:1950(22.8%),Q2:2250(26.3%),Q3:2490(29.1%),Q4:1870(21.8%)',
    highIllegalType: '操作规范:3050,设备维护:2480,安全管理:1650,台账不规范:750,人员资质:630',
    areaIllegalRank: '溪美街道:82,柳城街道:75,水头镇:68,美林街道:55,官桥镇:45',
    entTypeIllegalRate: '燃气供应:19.2%,管道运输:13.5%,燃气储存:10.2%,燃气加气:8.8%,燃气施工:16.5%',
    warnChangeYoy: 8.5,
    yearRectifyRate: 90.2,
    yearDeviceNormalRate: 95.8,
    yearComplianceRate: 85.6,
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