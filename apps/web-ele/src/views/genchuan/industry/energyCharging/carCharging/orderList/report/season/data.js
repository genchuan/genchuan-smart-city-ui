/** 表格初始数据 - 改造为占道经营季度统计分析数据 */
export const dataList = () => [
  {
    regionName: '鼓楼区',
    businessDistrict: '东街口商圈',
    diversionPoint: '东街口疏导点',
    quarterStatisticsPeriod: '2024-Q2',
    quarterOccupancyCaseDisposalRate: 92.5,
    quarterKeyBusinessDistrictControlEffectiveness: 88.0,
    quarterDiversionPointOptimizationAdjustmentCount: 5,
    quarterLawEnforcementCollaborationCount: 12,
    quarterOccupancyCaseComplaintHandlingRate: 95.0,
    quarterOverQuarterChangeRate: 3.5,
    quarterOverQuarterChangeRateType: 'occupancyCaseDisposalRate',
    quarterYearOverYearChangeRate: 5.2,
    quarterYearOverYearChangeRateType: 'keyBusinessDistrictControlEffectiveness',
    quarterDetailData: {
      byRegion: [
        { region: '鼓楼区', disposalRate: 92.5, complaintHandlingRate: 95.0 },
        { region: '台江区', disposalRate: 89.0, complaintHandlingRate: 93.5 },
      ],
      byBusinessDistrict: [
        { district: '东街口商圈', disposalRate: 92.5, collaborationCount: 5 },
        { district: '五四路商圈', disposalRate: 88.0, collaborationCount: 3 },
      ],
      byDiversionPoint: [
        { point: '东街口疏导点', optimizationCount: 3, complaintRate: 2.5 },
        { point: '五四路疏导点', optimizationCount: 2, complaintRate: 1.8 },
      ],
      byComplaintType: [
        { type: '噪音投诉', handlingRate: 96.0, count: 25 },
        { type: '交通投诉', handlingRate: 94.0, count: 18 },
      ],
    },
  },
  {
    regionName: '台江区',
    businessDistrict: '五四路商圈',
    diversionPoint: '五四路疏导点',
    quarterStatisticsPeriod: '2024-Q2',
    quarterOccupancyCaseDisposalRate: 89.0,
    quarterKeyBusinessDistrictControlEffectiveness: 85.5,
    quarterDiversionPointOptimizationAdjustmentCount: 3,
    quarterLawEnforcementCollaborationCount: 8,
    quarterOccupancyCaseComplaintHandlingRate: 93.5,
    quarterOverQuarterChangeRate: -1.2,
    quarterOverQuarterChangeRateType: 'diversionPointOptimizationAdjustmentCount',
    quarterYearOverYearChangeRate: 2.8,
    quarterYearOverYearChangeRateType: 'quarterLawEnforcementCollaborationCount',
    quarterDetailData: {
      byRegion: [
        { region: '台江区', disposalRate: 89.0, complaintHandlingRate: 93.5 },
        { region: '仓山区', disposalRate: 87.0, complaintHandlingRate: 91.0 },
      ],
      byBusinessDistrict: [
        { district: '五四路商圈', disposalRate: 89.0, collaborationCount: 3 },
        { district: '台江步行街商圈', disposalRate: 86.0, collaborationCount: 2 },
      ],
      byDiversionPoint: [
        { point: '五四路疏导点', optimizationCount: 2, complaintRate: 1.8 },
        { point: '台江广场疏导点', optimizationCount: 1, complaintRate: 2.2 },
      ],
      byComplaintType: [
        { type: '占道经营', handlingRate: 95.0, count: 32 },
        { type: '乱堆乱放', handlingRate: 91.0, count: 15 },
      ],
    },
  },
  {
    regionName: '仓山区',
    businessDistrict: '仓山万达商圈',
    diversionPoint: '仓山万达疏导点',
    quarterStatisticsPeriod: '2024-Q2',
    quarterOccupancyCaseDisposalRate: 94.2,
    quarterKeyBusinessDistrictControlEffectiveness: 91.0,
    quarterDiversionPointOptimizationAdjustmentCount: 7,
    quarterLawEnforcementCollaborationCount: 15,
    quarterOccupancyCaseComplaintHandlingRate: 96.8,
    quarterOverQuarterChangeRate: 8.3,
    quarterOverQuarterChangeRateType: 'quarterOccupancyCaseDisposalRate',
    quarterYearOverYearChangeRate: 12.1,
    quarterYearOverYearChangeRateType: 'quarterOccupancyCaseComplaintHandlingRate',
    quarterDetailData: {
      byRegion: [
        { region: '仓山区', disposalRate: 94.2, complaintHandlingRate: 96.8 },
        { region: '马尾区', disposalRate: 91.5, complaintHandlingRate: 94.5 },
      ],
      byBusinessDistrict: [
        { district: '仓山万达商圈', disposalRate: 94.2, collaborationCount: 6 },
        { district: '浦上大道商圈', disposalRate: 92.0, collaborationCount: 4 },
      ],
      byDiversionPoint: [
        { point: '仓山万达疏导点', optimizationCount: 5, complaintRate: 1.2 },
        { point: '马尾港口疏导点', optimizationCount: 3, complaintRate: 1.5 },
      ],
      byComplaintType: [
        { type: '车辆违停', handlingRate: 97.5, count: 28 },
        { type: '商户占道', handlingRate: 95.5, count: 22 },
      ],
    },
  },
  {
    regionName: '晋安区',
    businessDistrict: '五四北商圈',
    diversionPoint: '五四北疏导点',
    quarterStatisticsPeriod: '2024-Q2',
    quarterOccupancyCaseDisposalRate: 87.8,
    quarterKeyBusinessDistrictControlEffectiveness: 83.2,
    quarterDiversionPointOptimizationAdjustmentCount: 4,
    quarterLawEnforcementCollaborationCount: 10,
    quarterOccupancyCaseComplaintHandlingRate: 92.0,
    quarterOverQuarterChangeRate: -2.1,
    quarterOverQuarterChangeRateType: 'quarterKeyBusinessDistrictControlEffectiveness',
    quarterYearOverYearChangeRate: 1.5,
    quarterYearOverYearChangeRateType: 'quarterDiversionPointOptimizationAdjustmentCount',
    quarterDetailData: {
      byRegion: [
        { region: '晋安区', disposalRate: 87.8, complaintHandlingRate: 92.0 },
        { region: '长乐区', disposalRate: 85.0, complaintHandlingRate: 90.0 },
      ],
      byBusinessDistrict: [
        { district: '五四北商圈', disposalRate: 87.8, collaborationCount: 4 },
        { district: '森林公园商圈', disposalRate: 84.5, collaborationCount: 3 },
      ],
      byDiversionPoint: [
        { point: '五四北疏导点', optimizationCount: 2, complaintRate: 2.8 },
        { point: '火车站北站疏导点', optimizationCount: 1, complaintRate: 3.2 },
      ],
      byComplaintType: [
        { type: '流动摊贩', handlingRate: 93.0, count: 35 },
        { type: '广告占道', handlingRate: 90.0, count: 12 },
      ],
    },
  },
  {
    regionName: '马尾区',
    businessDistrict: '马尾港商圈',
    diversionPoint: '马尾港疏导点',
    quarterStatisticsPeriod: '2024-Q2',
    quarterOccupancyCaseDisposalRate: 91.5,
    quarterKeyBusinessDistrictControlEffectiveness: 89.0,
    quarterDiversionPointOptimizationAdjustmentCount: 6,
    quarterLawEnforcementCollaborationCount: 13,
    quarterOccupancyCaseComplaintHandlingRate: 95.2,
    quarterOverQuarterChangeRate: 6.8,
    quarterOverQuarterChangeRateType: 'quarterLawEnforcementCollaborationCount',
    quarterYearOverYearChangeRate: 10.3,
    quarterYearOverYearChangeRateType: 'quarterKeyBusinessDistrictControlEffectiveness',
    quarterDetailData: {
      byRegion: [
        { region: '马尾区', disposalRate: 91.5, complaintHandlingRate: 95.2 },
      ],
      byBusinessDistrict: [
        { district: '马尾港商圈', disposalRate: 91.5, collaborationCount: 5 },
        { district: '船政文化商圈', disposalRate: 88.0, collaborationCount: 2 },
      ],
      byDiversionPoint: [
        { point: '马尾港疏导点', optimizationCount: 4, complaintRate: 1.5 },
        { point: '保税区疏导点', optimizationCount: 2, complaintRate: 2.0 },
      ],
      byComplaintType: [
        { type: '港口物流', handlingRate: 96.5, count: 18 },
        { type: '船舶占道', handlingRate: 93.5, count: 8 },
      ],
    },
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为占道经营季度统计分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'regionName',
      label: '区域名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入区域名称',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'businessDistrict',
      label: '重点商圈',
      component: 'Input',
      componentProps: {
        placeholder: '请输入重点商圈名称',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'diversionPoint',
      label: '疏导点',
      component: 'Input',
      componentProps: {
        placeholder: '请输入疏导点名称',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'quarterStatisticsPeriod',
      label: '季度统计时段',
      component: 'Input',
      componentProps: {
        placeholder: '请输入季度统计时段（如：2024-Q2）',
        maxlength: 20,
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'quarterOccupancyCaseDisposalRate',
      label: '季度占道经营案件处置率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入季度占道经营案件处置率',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'quarterKeyBusinessDistrictControlEffectiveness',
      label: '季度重点商圈管控成效(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入季度重点商圈管控成效',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'quarterDiversionPointOptimizationAdjustmentCount',
      label: '季度疏导点优化调整数量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入季度疏导点优化调整数量',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'quarterLawEnforcementCollaborationCount',
      label: '季度执法协作次数',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入季度执法协作次数',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'quarterOccupancyCaseComplaintHandlingRate',
      label: '季度占道经营投诉处理率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入季度占道经营投诉处理率',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'quarterOverQuarterChangeRate',
      label: '环比变化率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入环比变化率',
        min: -100,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'quarterOverQuarterChangeRateType',
      label: '环比变化指标类型',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入环比变化指标类型（如：quarterOccupancyCaseDisposalRate）',
        maxlength: 50,
      },
      rules: 'required',
    },
    {
      fieldName: 'quarterYearOverYearChangeRate',
      label: '同比变化率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入同比变化率',
        min: -100,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'quarterYearOverYearChangeRateType',
      label: '同比变化指标类型',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入同比变化指标类型（如：quarterKeyBusinessDistrictControlEffectiveness）',
        maxlength: 50,
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 改造为占道经营季度统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'regionName',
      title: '区域名称',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'businessDistrict',
      title: '重点商圈',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'diversionPoint',
      title: '疏导点',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'quarterStatisticsPeriod',
      title: '季度统计时段',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'quarterOccupancyCaseDisposalRate',
      title: '季度占道经营案件处置率(%)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'quarterKeyBusinessDistrictControlEffectiveness',
      title: '季度重点商圈管控成效(%)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'quarterDiversionPointOptimizationAdjustmentCount',
      title: '季度疏导点优化调整数量',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'quarterLawEnforcementCollaborationCount',
      title: '季度执法协作次数',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'quarterOccupancyCaseComplaintHandlingRate',
      title: '季度占道经营投诉处理率(%)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'quarterOverQuarterChangeRate',
      title: '环比变化率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'quarterOverQuarterChangeRateType',
      title: '环比变化指标',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'quarterYearOverYearChangeRate',
      title: '同比变化率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'quarterYearOverYearChangeRateType',
      title: '同比变化指标',
      minWidth: 140,
      sortable: true,
    },
  ];
}
