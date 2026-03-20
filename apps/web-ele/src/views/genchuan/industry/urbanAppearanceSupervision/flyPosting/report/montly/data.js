/** 表格初始数据 - 改造为乱贴乱画月度统计分析数据 */
export const dataList = () => [
  {
    regionName: '鼓楼区',
    pointTypeName: '商业区',
    monthIllegalPostingAndPaintingCaseTotal: 120,
    monthCleanupCompletionRate: 95.5,
    monthIllegalNumberVerificationAndDisposalRate: 98.0,
    monthKeyRoadSectionIllegalPostingAndPaintingIncidenceRate: 0.05,
    monthCleanupTeamAssessmentScore: 88.5,
    monthOverMonthChangeRate: 5.2,
    monthYearOnYearChangeRate: 8.7,
    monthStatisticsPeriod: '2024-06-01 ~ 2024-06-30',
  },
  {
    regionName: '台江区',
    pointTypeName: '居民区',
    monthIllegalPostingAndPaintingCaseTotal: 95,
    monthCleanupCompletionRate: 93.0,
    monthIllegalNumberVerificationAndDisposalRate: 97.0,
    monthKeyRoadSectionIllegalPostingAndPaintingIncidenceRate: 0.04,
    monthCleanupTeamAssessmentScore: 85.0,
    monthOverMonthChangeRate: -2.1,
    monthYearOnYearChangeRate: 3.2,
    monthStatisticsPeriod: '2024-06-01 ~ 2024-06-30',
  },
  {
    regionName: '仓山区',
    pointTypeName: '交通枢纽',
    monthIllegalPostingAndPaintingCaseTotal: 110,
    monthCleanupCompletionRate: 96.0,
    monthIllegalNumberVerificationAndDisposalRate: 98.5,
    monthKeyRoadSectionIllegalPostingAndPaintingIncidenceRate: 0.06,
    monthCleanupTeamAssessmentScore: 90.0,
    monthOverMonthChangeRate: 7.8,
    monthYearOnYearChangeRate: 10.1,
    monthStatisticsPeriod: '2024-06-01 ~ 2024-06-30',
  },
  // 可以继续添加更多数据...
];

/** 新增/修改的表单/列表的搜索表单 - 改造为乱贴乱画月度统计分析表单 */
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
      fieldName: 'pointTypeName',
      label: '点位类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入点位类型',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'monthIllegalPostingAndPaintingCaseTotal',
      label: '月乱贴乱画案件总量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月乱贴乱画案件总量',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'monthCleanupCompletionRate',
      label: '月清理完成率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月清理完成率(%)',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'monthIllegalNumberVerificationAndDisposalRate',
      label: '月非法号码核查处置率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月非法号码核查处置率(%)',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'monthKeyRoadSectionIllegalPostingAndPaintingIncidenceRate',
      label: '月重点路段乱贴乱画发生率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月重点路段乱贴乱画发生率(%)',
        min: 0,
        max: 1,
        precision: 3,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'monthCleanupTeamAssessmentScore',
      label: '月清理队伍考核得分',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月清理队伍考核得分',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '分',
      },
      rules: 'required',
    },
    {
      fieldName: 'monthOverMonthChangeRate',
      label: '月环比变化率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月环比变化率(%)',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'monthYearOnYearChangeRate',
      label: '月同比变化率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月同比变化率(%)',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'monthStatisticsPeriod',
      label: '月统计时段',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入月统计时段（如：2024-06-01 ~ 2024-06-30）',
        maxlength: 50,
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 改造为乱贴乱画月度统计分析表格列 */
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
      field: 'pointTypeName',
      title: '点位类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'monthIllegalPostingAndPaintingCaseTotal',
      title: '月乱贴乱画案件总量',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'monthCleanupCompletionRate',
      title: '月清理完成率(%)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'monthIllegalNumberVerificationAndDisposalRate',
      title: '月非法号码核查处置率(%)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'monthKeyRoadSectionIllegalPostingAndPaintingIncidenceRate',
      title: '月重点路段乱贴乱画发生率(%)',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'monthCleanupTeamAssessmentScore',
      title: '月清理队伍考核得分',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'monthOverMonthChangeRate',
      title: '月环比变化率(%)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'monthYearOnYearChangeRate',
      title: '月同比变化率(%)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'monthStatisticsPeriod',
      title: '月统计时段',
      minWidth: 150,
      sortable: false,
    },
  ];
}
