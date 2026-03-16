/** 表格初始数据 - 丰泽区学校食堂日度风险报告管理数据 */
export const dataList = () => [
  {
    reportNumber: 'DLY-QZ-FZ-20240615-001', // 日度报告编号：DLY-泉州-丰泽FZ-日期-序号
    statisticsDate: '2024-06-15', // 统计日期（日维度）
    statisticsArea: '丰泽区', // 统一为丰泽区
    totalAlarmCount: 28, // 当日总告警次数（改为：当日食品安全问题总数）
    violationCompanyCount: 8, // 改为：当日有问题的食堂数量
    highFreqViolationType: '食品留样:12,餐具消毒:8,人员健康:5,食材储存:3', // 替换为食堂高频违规类型
    areaViolationDistribution: '东海街道:3,丰泽街道:2,东湖街道:2,华大街道:1', // 丰泽区街道分布
    yoyAlarmChangeRate: 15.6, // 同比问题变化率（%）
    momAlarmChangeRate: 8.2, // 环比问题变化率（%）
    deviceAlarmNormalRate: 92.5, // 改为：食堂设备合规率（%）
    dailyRectificationCompletionRate: 78.3, // 当日整改完成率（%）
  },
  {
    reportNumber: 'DLY-QZ-FZ-20240615-002',
    statisticsDate: '2024-06-15',
    statisticsArea: '丰泽区',
    totalAlarmCount: 22,
    violationCompanyCount: 6,
    highFreqViolationType: '餐具消毒:9,食品留样:7,卫生管理:4,食材采购:2',
    areaViolationDistribution: '北峰街道:2,清源街道:1,城东街道:1,东海街道:1,泉秀街道:1',
    yoyAlarmChangeRate: 10.3,
    momAlarmChangeRate: 5.8,
    deviceAlarmNormalRate: 94.2,
    dailyRectificationCompletionRate: 85.7,
  },
  {
    reportNumber: 'DLY-QZ-FZ-20240615-003',
    statisticsDate: '2024-06-15',
    statisticsArea: '丰泽区',
    totalAlarmCount: 15,
    violationCompanyCount: 4,
    highFreqViolationType: '食材储存:6,操作规范:5,人员健康:3,台账记录:1',
    areaViolationDistribution: '城东街道:2,华大街道:1,清源街道:1',
    yoyAlarmChangeRate: 8.5,
    momAlarmChangeRate: 3.1,
    deviceAlarmNormalRate: 91.8,
    dailyRectificationCompletionRate: 82.5,
  },
  {
    reportNumber: 'DLY-QZ-FZ-20240615-004',
    statisticsDate: '2024-06-15',
    statisticsArea: '丰泽区',
    totalAlarmCount: 18,
    violationCompanyCount: 5,
    highFreqViolationType: '卫生管理:7,食材储存:6,餐具消毒:4,台账记录:1',
    areaViolationDistribution: '泉秀街道:2,丰泽街道:1,东湖街道:1,北峰街道:1',
    yoyAlarmChangeRate: 12.8,
    momAlarmChangeRate: 6.5,
    deviceAlarmNormalRate: 89.7,
    dailyRectificationCompletionRate: 75.2,
  },
  {
    reportNumber: 'DLY-QZ-FZ-20240615-005',
    statisticsDate: '2024-06-15',
    statisticsArea: '丰泽区',
    totalAlarmCount: 35,
    violationCompanyCount: 12,
    highFreqViolationType: '食品留样:14,餐具消毒:10,卫生管理:7,食材采购:4',
    areaViolationDistribution: '东海街道:3,城东街道:2,泉秀街道:2,北峰街道:2,华大街道:2,清源街道:1',
    yoyAlarmChangeRate: 18.2,
    momAlarmChangeRate: 9.8,
    deviceAlarmNormalRate: 90.5,
    dailyRectificationCompletionRate: 72.8,
  },
  {
    reportNumber: 'DLY-QZ-FZ-20240615-006',
    statisticsDate: '2024-06-15',
    statisticsArea: '丰泽区',
    totalAlarmCount: 29,
    violationCompanyCount: 9,
    highFreqViolationType: '操作规范:11,食材储存:9,人员健康:6,台账记录:3',
    areaViolationDistribution: '东湖街道:2,丰泽街道:2,东海街道:2,城东街道:2,清源街道:1',
    yoyAlarmChangeRate: 14.5,
    momAlarmChangeRate: 7.6,
    deviceAlarmNormalRate: 93.1,
    dailyRectificationCompletionRate: 80.5,
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
        placeholder: '请输入日度报告编号（如：DLY-QZ-20240615-001）',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'statisticsDate',
      label: '统计日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择统计日期',
        picker: 'date',
        format: 'YYYY-MM-DD',
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'statisticsArea',
      label: '统计区域',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '鲤城区', value: '鲤城区' },
          { label: '丰泽区', value: '丰泽区' },
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
      fieldName: 'totalAlarmCount',
      label: '当日总告警次数',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入当日总告警次数',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'violationCompanyCount',
      label: '当日违规企业数量',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入当日违规企业数量',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'highFreqViolationType',
      label: '高频违规类型',
      component: 'Input',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入高频违规类型（如：设备维护:12,操作规范:8）',
        maxLength: 200,
      },
      rules: 'required',
    },
    {
      fieldName: 'areaViolationDistribution',
      label: '区域违规分布',
      component: 'Input',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入区域违规分布（如：鲤中街道:3,临江街道:2）',
        maxLength: 200,
      },
      rules: 'required',
    },
    {
      fieldName: 'yoyAlarmChangeRate',
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
      fieldName: 'momAlarmChangeRate',
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
      fieldName: 'deviceAlarmNormalRate',
      label: '设备告警正常率(%)',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入设备告警正常率',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'dailyRectificationCompletionRate',
      label: '当日整改完成率(%)',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入当日整改完成率',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
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
      field: 'statisticsDate',
      title: '统计日期',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'statisticsArea',
      title: '统计区域',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'totalAlarmCount',
      title: '当日总告警次数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'violationCompanyCount',
      title: '当日违规企业数量',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'highFreqViolationType',
      title: '高频违规类型',
      minWidth: 220,
      sortable: false,
    },
    {
      field: 'areaViolationDistribution',
      title: '区域违规分布',
      minWidth: 220,
      sortable: false,
    },
    {
      field: 'yoyAlarmChangeRate',
      title: '同比告警变化率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'momAlarmChangeRate',
      title: '环比告警变化率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'deviceAlarmNormalRate',
      title: '设备告警正常率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'dailyRectificationCompletionRate',
      title: '当日整改完成率(%)',
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