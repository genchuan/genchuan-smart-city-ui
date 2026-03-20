/** 表格初始数据 - 改造为广告监测周度统计分析数据 */
export const dataList = () => [
  {
    timeRange: '2024-06-17 ~ 2024-06-23',
    region: '福州市鼓楼区',
    pointType: '公交站台',
    adContent: '商业广告',
    cleanupResponsibilityUnit: '福州市环卫局',
    antiStickingFacilityPoint: '有',
    weekTotalWarningCount: 5,
    weekCleanupEfficiency: 90,
    cleanupTimeoutRate: 10,
    facilityWeekOnlineRate: 98,
    weekComplianceRate: 85,
    adCountMomChangeRate: 5,
    adCountYoYChangeRate: 10,
    warningTypeDistribution: '广告超标: 3次；设施超标: 2次',
  },
  {
    timeRange: '2024-06-17 ~ 2024-06-23',
    region: '厦门市思明区',
    pointType: '地铁站',
    adContent: '公益广告',
    cleanupResponsibilityUnit: '厦门市环卫局',
    antiStickingFacilityPoint: '无',
    weekTotalWarningCount: 3,
    weekCleanupEfficiency: 95,
    cleanupTimeoutRate: 5,
    facilityWeekOnlineRate: 99,
    weekComplianceRate: 90,
    adCountMomChangeRate: -2,
    adCountYoYChangeRate: -5,
    warningTypeDistribution: '广告超标: 1次；设施超标: 2次',
  },
  // ... 其他数据项
];

/** 新增/修改的表单/列表的搜索表单 - 改造为广告监测周度统计分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'timeRange',
      label: '时间范围',
      component: 'Input',
      componentProps: {
        placeholder: '请输入时间范围（如：2024-06-17 ~ 2024-06-23）',
        maxlength: 50,
      },
      rules: 'required',
    },
    {
      fieldName: 'region',
      label: '区域',
      component: 'Input',
      componentProps: {
        placeholder: '请输入区域',
      },
      rules: 'required',
    },
    {
      fieldName: 'pointType',
      label: '点位类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入点位类型',
      },
      rules: 'required',
    },
    {
      fieldName: 'adContent',
      label: '广告内容',
      component: 'Input',
      componentProps: {
        placeholder: '请输入广告内容',
      },
      rules: 'required',
    },
    {
      fieldName: 'cleanupResponsibilityUnit',
      label: '清理责任单位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入清理责任单位',
      },
      rules: 'required',
    },
    {
      fieldName: 'antiStickingFacilityPoint',
      label: '防粘贴设施点位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入防粘贴设施点位（如有/无）',
      },
      rules: 'required',
    },
    {
      fieldName: 'weekTotalWarningCount',
      label: '周累计预警数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入周累计预警数',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'weekCleanupEfficiency',
      label: '周清理效率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入周清理效率（单位：%）',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'cleanupTimeoutRate',
      label: '清理超时率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入清理超时率（单位：%）',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'facilityWeekOnlineRate',
      label: '设施周在线率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入设施周在线率（单位：%）',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'weekComplianceRate',
      label: '周达标率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入周达标率（单位：%）',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'adCountMomChangeRate',
      label: '广告数量环比变化率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入广告数量环比变化率（单位：%）',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'adCountYoYChangeRate',
      label: '广告数量同比变化率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入广告数量同比变化率（单位：%）',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'warningTypeDistribution',
      label: '预警类型分布',
      component: 'Input',
      componentProps: {
        placeholder: '请输入预警类型分布（如：广告超标:3次；设施超标:2次）',
        maxlength: 300,
        type: 'textarea',
        rows: 3,
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 改造为广告监测周度统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'timeRange',
      title: '时间范围',
      minWidth: 150,
      sortable: false,
    },
    {
      field: 'region',
      title: '区域',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'pointType',
      title: '点位类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'adContent',
      title: '广告内容',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'cleanupResponsibilityUnit',
      title: '清理责任单位',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'antiStickingFacilityPoint',
      title: '防粘贴设施点位',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'weekTotalWarningCount',
      title: '周累计预警数',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'weekCleanupEfficiency',
      title: '周清理效率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'cleanupTimeoutRate',
      title: '清理超时率(%)',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'facilityWeekOnlineRate',
      title: '设施周在线率(%)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'weekComplianceRate',
      title: '周达标率(%)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'adCountMomChangeRate',
      title: '广告数量环比变化率(%)',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'adCountYoYChangeRate',
      title: '广告数量同比变化率(%)',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'warningTypeDistribution',
      title: '预警类型分布',
      minWidth: 180,
      sortable: false,
    },
    // {
    //   title: '操作',
    //   width: 80,
    //   fixed: 'right',
    //   slots: { default: 'actions' },
    // },
  ];
}
