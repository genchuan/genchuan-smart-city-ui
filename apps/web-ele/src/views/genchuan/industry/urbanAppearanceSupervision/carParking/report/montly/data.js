/** 表格初始数据 - 月停车管理统计分析数据 */
export const dataList = () => [
  {
    // 基础信息
    areaName: '鼓楼区',
    // 核心指标
    monthlyIllegalParkingCaseRate: 96.5,          // 月违停案件处置率(%)
    monthlyPublicParkingUsageRank: 3,              // 月公共停车场使用率排名(名次)
    monthlyBerthTurnoverRate: 4.8,                 // 月泊位周转率(次/泊位)
    monthlySmartParkingAccessCount: 156,           // 月智慧停车平台接入数量(个)
    monthlyParkingComplaintRate: 98.2,             // 月停车投诉处理率(%)

    // 环比数据(与上月相比)
    momChangeRate_IllegalParkingCaseRate: 1.2,     // 违停案件处置率环比(%)
    momChangeRate_PublicParkingUsageRank: -1,      // 停车场使用率排名环比(名次变化)
    momChangeRate_BerthTurnoverRate: 0.3,          // 泊位周转率环比(%)
    momChangeRate_SmartParkingAccessCount: 5.8,    // 智慧停车接入数量环比(%)
    momChangeRate_ParkingComplaintRate: 0.5,       // 停车投诉处理率环比(%)

    // 同比数据(与去年同月相比)
    yoyChangeRate_IllegalParkingCaseRate: 2.3,     // 违停案件处置率同比(%)
    yoyChangeRate_PublicParkingUsageRank: 2,        // 停车场使用率排名同比(名次变化)
    yoyChangeRate_BerthTurnoverRate: 0.6,           // 泊位周转率同比(%)
    yoyChangeRate_SmartParkingAccessCount: 18.5,    // 智慧停车接入数量同比(%)
    yoyChangeRate_ParkingComplaintRate: 1.1,        // 停车投诉处理率同比(%)

    // 明细字段 - 按区域拆分
    detailByRegion: '鼓楼区: 96.5%；台江区: 95.2%；仓山区: 94.8%；晋安区: 93.5%',
    // 按停车场拆分
    detailByParkingLot: '东街口停车场: 98.2%；五一广场停车场: 97.5%；西湖停车场: 96.8%；金牛山停车场: 95.2%',
    // 按泊位类型拆分
    detailByBerthType: '路边泊位: 5.2次；路外泊位: 4.6次；立体车库: 3.8次；地下车库: 4.2次',
    // 按月度趋势拆分
    detailByMonthlyTrend: '1月: 4.2次；2月: 4.5次；3月: 4.6次；4月: 4.8次；5月: 4.9次；6月: 5.1次',
    // 同比分析结果
    analysisByYearOverYear: '违停处置率同比提升2.3个百分点，泊位周转率同比提升0.6次/泊位，智慧停车接入数量同比增长18.5%',
    // 环比分析结果
    analysisByMonthOverMonth: '违停处置率环比提升1.2个百分点，泊位周转率环比提升0.3次/泊位，智慧停车接入数量环比增长5.8%'
  },
  {
    areaName: '台江区',
    monthlyIllegalParkingCaseRate: 95.2,
    monthlyPublicParkingUsageRank: 5,
    monthlyBerthTurnoverRate: 4.5,
    monthlySmartParkingAccessCount: 132,
    monthlyParkingComplaintRate: 97.8,

    momChangeRate_IllegalParkingCaseRate: 0.8,
    momChangeRate_PublicParkingUsageRank: 0,
    momChangeRate_BerthTurnoverRate: 0.2,
    momChangeRate_SmartParkingAccessCount: 4.2,
    momChangeRate_ParkingComplaintRate: 0.3,

    yoyChangeRate_IllegalParkingCaseRate: 1.8,
    yoyChangeRate_PublicParkingUsageRank: 1,
    yoyChangeRate_BerthTurnoverRate: 0.4,
    yoyChangeRate_SmartParkingAccessCount: 15.3,
    yoyChangeRate_ParkingComplaintRate: 0.8,

    detailByRegion: '台江区: 95.2%；鼓楼区: 96.5%；仓山区: 94.8%；晋安区: 93.5%',
    detailByParkingLot: '中亭街停车场: 97.2%；万达广场停车场: 96.8%；金融街停车场: 95.5%；海峡市场停车场: 94.2%',
    detailByBerthType: '路边泊位: 4.9次；路外泊位: 4.3次；立体车库: 3.6次；地下车库: 4.0次',
    detailByMonthlyTrend: '1月: 3.9次；2月: 4.1次；3月: 4.3次；4月: 4.5次；5月: 4.6次；6月: 4.8次',
    analysisByYearOverYear: '违停处置率同比提升1.8个百分点，泊位周转率同比提升0.4次/泊位，智慧停车接入数量同比增长15.3%',
    analysisByMonthOverMonth: '违停处置率环比提升0.8个百分点，泊位周转率环比提升0.2次/泊位，智慧停车接入数量环比增长4.2%'
  },
  {
    areaName: '仓山区',
    monthlyIllegalParkingCaseRate: 94.8,
    monthlyPublicParkingUsageRank: 6,
    monthlyBerthTurnoverRate: 4.2,
    monthlySmartParkingAccessCount: 118,
    monthlyParkingComplaintRate: 97.5,

    momChangeRate_IllegalParkingCaseRate: 0.6,
    momChangeRate_PublicParkingUsageRank: -1,
    momChangeRate_BerthTurnoverRate: 0.1,
    momChangeRate_SmartParkingAccessCount: 3.8,
    momChangeRate_ParkingComplaintRate: 0.2,

    yoyChangeRate_IllegalParkingCaseRate: 1.5,
    yoyChangeRate_PublicParkingUsageRank: 0,
    yoyChangeRate_BerthTurnoverRate: 0.3,
    yoyChangeRate_SmartParkingAccessCount: 12.8,
    yoyChangeRate_ParkingComplaintRate: 0.6,

    detailByRegion: '仓山区: 94.8%；晋安区: 93.5%；马尾区: 92.1%；长乐区: 91.5%',
    detailByParkingLot: '金山万达停车场: 96.5%；奥体中心停车场: 95.8%；仓山步行街停车场: 94.5%；火车南站停车场: 93.2%',
    detailByBerthType: '路边泊位: 4.6次；路外泊位: 4.0次；立体车库: 3.4次；地下车库: 3.8次',
    detailByMonthlyTrend: '1月: 3.7次；2月: 3.9次；3月: 4.0次；4月: 4.2次；5月: 4.3次；6月: 4.5次',
    analysisByYearOverYear: '违停处置率同比提升1.5个百分点，泊位周转率同比提升0.3次/泊位，智慧停车接入数量同比增长12.8%',
    analysisByMonthOverMonth: '违停处置率环比提升0.6个百分点，泊位周转率环比提升0.1次/泊位，智慧停车接入数量环比增长3.8%'
  },
  {
    areaName: '晋安区',
    monthlyIllegalParkingCaseRate: 93.5,
    monthlyPublicParkingUsageRank: 8,
    monthlyBerthTurnoverRate: 4.0,
    monthlySmartParkingAccessCount: 105,
    monthlyParkingComplaintRate: 96.8,

    momChangeRate_IllegalParkingCaseRate: 0.4,
    momChangeRate_PublicParkingUsageRank: -2,
    momChangeRate_BerthTurnoverRate: 0.1,
    momChangeRate_SmartParkingAccessCount: 3.2,
    momChangeRate_ParkingComplaintRate: 0.1,

    yoyChangeRate_IllegalParkingCaseRate: 1.2,
    yoyChangeRate_PublicParkingUsageRank: -1,
    yoyChangeRate_BerthTurnoverRate: 0.2,
    yoyChangeRate_SmartParkingAccessCount: 10.5,
    yoyChangeRate_ParkingComplaintRate: 0.4,

    detailByRegion: '晋安区: 93.5%；马尾区: 92.1%；长乐区: 91.5%；福清市: 90.8%',
    detailByParkingLot: '鼓山停车场: 95.2%；火车站北广场: 94.5%；东二环泰禾: 93.8%；王庄停车场: 92.5%',
    detailByBerthType: '路边泊位: 4.4次；路外泊位: 3.8次；立体车库: 3.2次；地下车库: 3.6次',
    detailByMonthlyTrend: '1月: 3.5次；2月: 3.7次；3月: 3.8次；4月: 4.0次；5月: 4.1次；6月: 4.3次',
    analysisByYearOverYear: '违停处置率同比提升1.2个百分点，泊位周转率同比提升0.2次/泊位，智慧停车接入数量同比增长10.5%',
    analysisByMonthOverMonth: '违停处置率环比提升0.4个百分点，泊位周转率环比提升0.1次/泊位，智慧停车接入数量环比增长3.2%'
  },
  {
    areaName: '马尾区',
    monthlyIllegalParkingCaseRate: 92.1,
    monthlyPublicParkingUsageRank: 10,
    monthlyBerthTurnoverRate: 3.8,
    monthlySmartParkingAccessCount: 86,
    monthlyParkingComplaintRate: 96.2,

    momChangeRate_IllegalParkingCaseRate: 0.3,
    momChangeRate_PublicParkingUsageRank: 1,
    momChangeRate_BerthTurnoverRate: -0.1,
    momChangeRate_SmartParkingAccessCount: 4.5,
    momChangeRate_ParkingComplaintRate: 0.2,

    yoyChangeRate_IllegalParkingCaseRate: 0.9,
    yoyChangeRate_PublicParkingUsageRank: 2,
    yoyChangeRate_BerthTurnoverRate: 0.1,
    yoyChangeRate_SmartParkingAccessCount: 14.2,
    yoyChangeRate_ParkingComplaintRate: 0.5,

    detailByRegion: '马尾区: 92.1%；长乐区: 91.5%；连江县: 90.2%；罗源县: 89.5%',
    detailByParkingLot: '马尾体育馆: 94.2%；自贸区停车场: 93.5%；船政文化: 92.8%；江滨公园: 91.5%',
    detailByBerthType: '路边泊位: 4.2次；路外泊位: 3.6次；立体车库: 3.0次；地下车库: 3.4次',
    detailByMonthlyTrend: '1月: 3.4次；2月: 3.5次；3月: 3.6次；4月: 3.8次；5月: 3.9次；6月: 4.0次',
    analysisByYearOverYear: '违停处置率同比提升0.9个百分点，泊位周转率同比提升0.1次/泊位，智慧停车接入数量同比增长14.2%',
    analysisByMonthOverMonth: '违停处置率环比提升0.3个百分点，泊位周转率环比下降0.1次/泊位，智慧停车接入数量环比增长4.5%'
  },
  {
    areaName: '长乐区',
    monthlyIllegalParkingCaseRate: 91.5,
    monthlyPublicParkingUsageRank: 12,
    monthlyBerthTurnoverRate: 3.6,
    monthlySmartParkingAccessCount: 72,
    monthlyParkingComplaintRate: 95.8,

    momChangeRate_IllegalParkingCaseRate: 0.5,
    momChangeRate_PublicParkingUsageRank: -1,
    momChangeRate_BerthTurnoverRate: 0.1,
    momChangeRate_SmartParkingAccessCount: 5.2,
    momChangeRate_ParkingComplaintRate: 0.3,

    yoyChangeRate_IllegalParkingCaseRate: 1.1,
    yoyChangeRate_PublicParkingUsageRank: 1,
    yoyChangeRate_BerthTurnoverRate: 0.2,
    yoyChangeRate_SmartParkingAccessCount: 16.5,
    yoyChangeRate_ParkingComplaintRate: 0.7,

    detailByRegion: '长乐区: 91.5%；福清市: 90.8%；闽侯县: 89.2%；连江县: 90.2%',
    detailByParkingLot: '长乐机场: 93.5%；南山公园: 92.8%；十洋商场: 91.5%；首占新区: 90.2%',
    detailByBerthType: '路边泊位: 4.0次；路外泊位: 3.4次；立体车库: 2.9次；地下车库: 3.2次',
    detailByMonthlyTrend: '1月: 3.2次；2月: 3.3次；3月: 3.4次；4月: 3.6次；5月: 3.7次；6月: 3.9次',
    analysisByYearOverYear: '违停处置率同比提升1.1个百分点，泊位周转率同比提升0.2次/泊位，智慧停车接入数量同比增长16.5%',
    analysisByMonthOverMonth: '违停处置率环比提升0.5个百分点，泊位周转率环比提升0.1次/泊位，智慧停车接入数量环比增长5.2%'
  },
  {
    areaName: '福清市',
    monthlyIllegalParkingCaseRate: 90.8,
    monthlyPublicParkingUsageRank: 14,
    monthlyBerthTurnoverRate: 3.5,
    monthlySmartParkingAccessCount: 65,
    monthlyParkingComplaintRate: 95.2,

    momChangeRate_IllegalParkingCaseRate: 0.2,
    momChangeRate_PublicParkingUsageRank: -2,
    momChangeRate_BerthTurnoverRate: 0.0,
    momChangeRate_SmartParkingAccessCount: 3.8,
    momChangeRate_ParkingComplaintRate: 0.1,

    yoyChangeRate_IllegalParkingCaseRate: 0.8,
    yoyChangeRate_PublicParkingUsageRank: -1,
    yoyChangeRate_BerthTurnoverRate: 0.1,
    yoyChangeRate_SmartParkingAccessCount: 11.2,
    yoyChangeRate_ParkingComplaintRate: 0.3,

    detailByRegion: '福清市: 90.8%；长乐区: 91.5%；闽侯县: 89.2%；平潭县: 88.5%',
    detailByParkingLot: '万达广场: 92.5%；动车站: 91.8%；石竹山: 90.5%；老城区: 89.2%',
    detailByBerthType: '路边泊位: 3.9次；路外泊位: 3.3次；立体车库: 2.8次；地下车库: 3.1次',
    detailByMonthlyTrend: '1月: 3.1次；2月: 3.2次；3月: 3.3次；4月: 3.5次；5月: 3.6次；6月: 3.7次',
    analysisByYearOverYear: '违停处置率同比提升0.8个百分点，泊位周转率同比提升0.1次/泊位，智慧停车接入数量同比增长11.2%',
    analysisByMonthOverMonth: '违停处置率环比提升0.2个百分点，泊位周转率环比持平，智慧停车接入数量环比增长3.8%'
  },
  {
    areaName: '闽侯县',
    monthlyIllegalParkingCaseRate: 89.2,
    monthlyPublicParkingUsageRank: 16,
    monthlyBerthTurnoverRate: 3.2,
    monthlySmartParkingAccessCount: 58,
    monthlyParkingComplaintRate: 94.5,

    momChangeRate_IllegalParkingCaseRate: 0.3,
    momChangeRate_PublicParkingUsageRank: 1,
    momChangeRate_BerthTurnoverRate: 0.1,
    momChangeRate_SmartParkingAccessCount: 4.2,
    momChangeRate_ParkingComplaintRate: 0.2,

    yoyChangeRate_IllegalParkingCaseRate: 0.9,
    yoyChangeRate_PublicParkingUsageRank: 2,
    yoyChangeRate_BerthTurnoverRate: 0.2,
    yoyChangeRate_SmartParkingAccessCount: 13.5,
    yoyChangeRate_ParkingComplaintRate: 0.5,

    detailByRegion: '闽侯县: 89.2%；连江县: 90.2%；罗源县: 88.5%；永泰县: 87.8%',
    detailByParkingLot: '大学城: 91.5%；永嘉天地: 90.8%；旗山: 89.5%；甘蔗街道: 88.2%',
    detailByBerthType: '路边泊位: 3.6次；路外泊位: 3.0次；立体车库: 2.6次；地下车库: 2.9次',
    detailByMonthlyTrend: '1月: 2.8次；2月: 2.9次；3月: 3.0次；4月: 3.2次；5月: 3.3次；6月: 3.5次',
    analysisByYearOverYear: '违停处置率同比提升0.9个百分点，泊位周转率同比提升0.2次/泊位，智慧停车接入数量同比增长13.5%',
    analysisByMonthOverMonth: '违停处置率环比提升0.3个百分点，泊位周转率环比提升0.1次/泊位，智慧停车接入数量环比增长4.2%'
  },
  {
    areaName: '连江县',
    monthlyIllegalParkingCaseRate: 90.2,
    monthlyPublicParkingUsageRank: 13,
    monthlyBerthTurnoverRate: 3.4,
    monthlySmartParkingAccessCount: 62,
    monthlyParkingComplaintRate: 94.8,

    momChangeRate_IllegalParkingCaseRate: 0.4,
    momChangeRate_PublicParkingUsageRank: 2,
    momChangeRate_BerthTurnoverRate: 0.1,
    momChangeRate_SmartParkingAccessCount: 3.5,
    momChangeRate_ParkingComplaintRate: 0.2,

    yoyChangeRate_IllegalParkingCaseRate: 1.0,
    yoyChangeRate_PublicParkingUsageRank: 3,
    yoyChangeRate_BerthTurnoverRate: 0.2,
    yoyChangeRate_SmartParkingAccessCount: 12.8,
    yoyChangeRate_ParkingComplaintRate: 0.4,

    detailByRegion: '连江县: 90.2%；罗源县: 88.5%；闽侯县: 89.2%；福清市: 90.8%',
    detailByParkingLot: '贵安: 92.5%；动车站: 91.2%；县城中心: 90.5%；黄岐: 89.2%',
    detailByBerthType: '路边泊位: 3.8次；路外泊位: 3.2次；立体车库: 2.7次；地下车库: 3.0次',
    detailByMonthlyTrend: '1月: 3.0次；2月: 3.1次；3月: 3.2次；4月: 3.4次；5月: 3.5次；6月: 3.6次',
    analysisByYearOverYear: '违停处置率同比提升1.0个百分点，泊位周转率同比提升0.2次/泊位，智慧停车接入数量同比增长12.8%',
    analysisByMonthOverMonth: '违停处置率环比提升0.4个百分点，泊位周转率环比提升0.1次/泊位，智慧停车接入数量环比增长3.5%'
  }
];

/** 新增/修改的表单/列表的搜索表单 - 月停车管理统计分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'areaName',
      label: '区域名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入区域名称',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'monthlyIllegalParkingCaseRate',
      label: '月违停案件处置率',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月违停案件处置率（单位：%）',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'monthlyPublicParkingUsageRank',
      label: '月公共停车场使用率排名',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月公共停车场使用率排名（名次）',
        min: 1,
        precision: 0,
        addonAfter: '名',
      },
      rules: 'required',
    },
    {
      fieldName: 'monthlyBerthTurnoverRate',
      label: '月泊位周转率',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月泊位周转率（次/泊位）',
        min: 0,
        precision: 1,
        addonAfter: '次/泊位',
      },
      rules: 'required',
    },
    {
      fieldName: 'monthlySmartParkingAccessCount',
      label: '月智慧停车平台接入数量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月智慧停车平台接入数量（个）',
        min: 0,
        precision: 0,
        addonAfter: '个',
      },
      rules: 'required',
    },
    {
      fieldName: 'monthlyParkingComplaintRate',
      label: '月停车投诉处理率',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月停车投诉处理率（单位：%）',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'momChangeRate_IllegalParkingCaseRate',
      label: '违停案件处置率环比',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入违停案件处置率环比（单位：百分点）',
        precision: 1,
        addonAfter: '百分点',
      },
      rules: 'required',
    },
    {
      fieldName: 'momChangeRate_PublicParkingUsageRank',
      label: '停车场使用率排名环比',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入停车场使用率排名环比（名次变化）',
        precision: 0,
        addonAfter: '名',
      },
      rules: 'required',
    },
    {
      fieldName: 'momChangeRate_BerthTurnoverRate',
      label: '泊位周转率环比',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入泊位周转率环比（单位：次/泊位）',
        precision: 1,
        addonAfter: '次/泊位',
      },
      rules: 'required',
    },
    {
      fieldName: 'momChangeRate_SmartParkingAccessCount',
      label: '智慧停车接入数量环比',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入智慧停车接入数量环比（单位：%）',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'momChangeRate_ParkingComplaintRate',
      label: '停车投诉处理率环比',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入停车投诉处理率环比（单位：百分点）',
        precision: 1,
        addonAfter: '百分点',
      },
      rules: 'required',
    },
    {
      fieldName: 'yoyChangeRate_IllegalParkingCaseRate',
      label: '违停案件处置率同比',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入违停案件处置率同比（单位：百分点）',
        precision: 1,
        addonAfter: '百分点',
      },
      rules: 'required',
    },
    {
      fieldName: 'yoyChangeRate_PublicParkingUsageRank',
      label: '停车场使用率排名同比',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入停车场使用率排名同比（名次变化）',
        precision: 0,
        addonAfter: '名',
      },
      rules: 'required',
    },
    {
      fieldName: 'yoyChangeRate_BerthTurnoverRate',
      label: '泊位周转率同比',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入泊位周转率同比（单位：次/泊位）',
        precision: 1,
        addonAfter: '次/泊位',
      },
      rules: 'required',
    },
    {
      fieldName: 'yoyChangeRate_SmartParkingAccessCount',
      label: '智慧停车接入数量同比',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入智慧停车接入数量同比（单位：%）',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'yoyChangeRate_ParkingComplaintRate',
      label: '停车投诉处理率同比',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入停车投诉处理率同比（单位：百分点）',
        precision: 1,
        addonAfter: '百分点',
      },
      rules: 'required',
    },
    {
      fieldName: 'detailByRegion',
      label: '按区域拆分明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入按区域拆分的明细数据',
        maxlength: 200,
        type: 'textarea',
        rows: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'detailByParkingLot',
      label: '按停车场拆分明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入按停车场拆分的明细数据',
        maxlength: 200,
        type: 'textarea',
        rows: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'detailByBerthType',
      label: '按泊位类型拆分明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入按泊位类型拆分的明细数据（路边泊位、路外泊位、立体车库、地下车库）',
        maxlength: 200,
        type: 'textarea',
        rows: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'detailByMonthlyTrend',
      label: '按月度趋势拆分明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入按月度趋势拆分的明细数据',
        maxlength: 200,
        type: 'textarea',
        rows: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'analysisByYearOverYear',
      label: '同比分析结果',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入同比分析结果',
        maxlength: 200,
        type: 'textarea',
        rows: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'analysisByMonthOverMonth',
      label: '环比分析结果',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入环比分析结果',
        maxlength: 200,
        type: 'textarea',
        rows: 2,
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 月停车管理统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'areaName',
      title: '区域名称',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'monthlyIllegalParkingCaseRate',
      title: '月违停案件处置率(%)',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'monthlyPublicParkingUsageRank',
      title: '月公共停车场使用率排名',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'monthlyBerthTurnoverRate',
      title: '月泊位周转率(次/泊位)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'monthlySmartParkingAccessCount',
      title: '月智慧停车平台接入数量(个)',
      minWidth: 220,
      sortable: true,
    },
    {
      field: 'monthlyParkingComplaintRate',
      title: '月停车投诉处理率(%)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'momChangeRate_IllegalParkingCaseRate',
      title: '违停处置率环比(百分点)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'momChangeRate_PublicParkingUsageRank',
      title: '停车场排名环比(名)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'momChangeRate_BerthTurnoverRate',
      title: '泊位周转率环比(次/泊位)',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'momChangeRate_SmartParkingAccessCount',
      title: '智慧停车接入环比(%)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'momChangeRate_ParkingComplaintRate',
      title: '投诉处理率环比(百分点)',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'yoyChangeRate_IllegalParkingCaseRate',
      title: '违停处置率同比(百分点)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'yoyChangeRate_PublicParkingUsageRank',
      title: '停车场排名同比(名)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'yoyChangeRate_BerthTurnoverRate',
      title: '泊位周转率同比(次/泊位)',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'yoyChangeRate_SmartParkingAccessCount',
      title: '智慧停车接入同比(%)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'yoyChangeRate_ParkingComplaintRate',
      title: '投诉处理率同比(百分点)',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'detailByRegion',
      title: '按区域拆分明细',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'detailByParkingLot',
      title: '按停车场拆分明细',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'detailByBerthType',
      title: '按泊位类型拆分明细',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'detailByMonthlyTrend',
      title: '按月度趋势拆分明细',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'analysisByYearOverYear',
      title: '同比分析结果',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'analysisByMonthOverMonth',
      title: '环比分析结果',
      minWidth: 200,
      sortable: false,
    },
  ];
}
