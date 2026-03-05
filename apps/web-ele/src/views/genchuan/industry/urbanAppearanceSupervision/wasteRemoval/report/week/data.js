/** 表格初始数据 - 改造为清运监管周度统计分析数据 */
export const dataList = () => [
  {
    weekNo: '2024-06-17 ~ 2024-06-23',
    vehicleId: 2850,
    transportId: 3,
    dregsTransportId: 42,
    orderNo: 156,
    weiguiNo: 8,
    zengzhang: 5.2,
  },
  {
    weekNo: '2024-06-10 ~ 2024-06-16',
    vehicleId: 2710,
    transportId: 5,
    dregsTransportId: 38,
    orderNo: 143,
    weiguiNo: 12,
    zengzhang: -2.8,
  },
  {
    weekNo: '2024-06-03 ~ 2024-06-09',
    vehicleId: 2635,
    transportId: 2,
    dregsTransportId: 45,
    orderNo: 168,
    weiguiNo: 6,
    zengzhang: 7.1,
  },
  {
    weekNo: '2024-05-27 ~ 2024-06-02',
    vehicleId: 2480,
    transportId: 7,
    dregsTransportId: 36,
    orderNo: 132,
    weiguiNo: 15,
    zengzhang: -4.5,
  },
  {
    weekNo: '2024-05-20 ~ 2024-05-26',
    vehicleId: 2600,
    transportId: 4,
    dregsTransportId: 40,
    orderNo: 151,
    weiguiNo: 9,
    zengzhang: 3.3,
  },
  {
    weekNo: '2024-05-13 ~ 2024-05-19',
    vehicleId: 2515,
    transportId: 6,
    dregsTransportId: 33,
    orderNo: 140,
    weiguiNo: 11,
    zengzhang: -1.0,
  },
  {
    weekNo: '2024-05-06 ~ 2024-05-12',
    vehicleId: 2540,
    transportId: 3,
    dregsTransportId: 37,
    orderNo: 147,
    weiguiNo: 7,
    zengzhang: 2.2,
  },
  {
    weekNo: '2024-04-29 ~ 2024-05-05',
    vehicleId: 2380,
    transportId: 8,
    dregsTransportId: 29,
    orderNo: 122,
    weiguiNo: 18,
    zengzhang: -6.8,
  },
  {
    weekNo: '2024-04-22 ~ 2024-04-28',
    vehicleId: 2455,
    transportId: 5,
    dregsTransportId: 32,
    orderNo: 135,
    weiguiNo: 13,
    zengzhang: -2.1,
  },
  {
    weekNo: '2024-04-15 ~ 2024-04-21',
    vehicleId: 2500,
    transportId: 4,
    dregsTransportId: 35,
    orderNo: 144,
    weiguiNo: 10,
    zengzhang: 4.0,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为清运监管周度统计分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'weekNo',
      label: '统计周次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统计周次 (如：2024-06-17 ~ 2024-06-23)',
        maxlength: 40,
      },
      labelWidth: '130',
      rules: 'required', // 周次为必填项
    },
    {
      fieldName: 'vehicleId',
      label: '周累计备案通行量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入通行量',
        min: 0,
        precision: 0,
        addonAfter: '辆',
      },
      rules: 'required',
    },
    {
      fieldName: 'transportId',
      label: '违规清运次数',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入违规清运次数',
        min: 0,
        precision: 0,
        addonAfter: '次',
      },
      rules: 'required',
    },
    {
      fieldName: 'dregsTransportId',
      label: '清运审批通过数量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入审批通过数量',
        min: 0,
        precision: 0,
        addonAfter: '个',
      },
      rules: 'required',
    },
    {
      fieldName: 'orderNo',
      label: '卡点检查次数',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入卡点检查次数',
        min: 0,
        precision: 0,
        addonAfter: '次',
      },
      rules: 'required',
    },
    {
      fieldName: 'weiguiNo',
      label: '违规整改完成数量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入违规整改完成数量',
        min: 0,
        precision: 0,
        addonAfter: '个',
      },
      rules: 'required',
    },
    {
      fieldName: 'zengzhang',
      label: '环比增长率',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入环比增长率',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 改造为清运监管周度统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'weekNo',
      title: '统计周次',
      minWidth: 200,
      sortable: true,
      slots: { default: 'weekNo' },
    },
    {
      field: 'vehicleId',
      title: '周累计备案通行量',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'transportId',
      title: '违规清运次数',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'dregsTransportId',
      title: '清运审批通过数量',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'orderNo',
      title: '卡点检查次数',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'weiguiNo',
      title: '违规整改完成数量',
      minWidth: 170,
      sortable: true,
    },
    {
      field: 'zengzhang',
      title: '环比增长率(%)',
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
