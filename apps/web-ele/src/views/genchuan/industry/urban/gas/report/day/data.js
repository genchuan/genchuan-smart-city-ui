/** 表格初始数据 - 改造为桥梁监测统计分析数据 */
export const dataList = () => [
  {
    statisticsDate: '2024-06-30',
    bridgeName: '福州闽江大桥',
    monitorPosition: '主桥左侧支座',
    bearingDisplacementAvg: 0.85,
    vibrationFrequencyAvg: 2.8,
    strainValueAvg: 125.6,
    deviceOnlineRate: 99.2,
    warningTriggerCount: 2,
    maintenanceOrderCount: 2,
    momChangeRate: 3.5,
    bridgeHealthRank: 3,
  },
  {
    statisticsDate: '2024-06-30',
    bridgeName: '厦门海沧大桥',
    monitorPosition: '引桥右侧支座',
    bearingDisplacementAvg: 0.62,
    vibrationFrequencyAvg: 3.2,
    strainValueAvg: 118.9,
    deviceOnlineRate: 98.7,
    warningTriggerCount: 1,
    maintenanceOrderCount: 1,
    momChangeRate: -1.2,
    bridgeHealthRank: 1,
  },
  {
    statisticsDate: '2024-06-30',
    bridgeName: '泉州晋江大桥',
    monitorPosition: '主桥中跨支座',
    bearingDisplacementAvg: 1.25,
    vibrationFrequencyAvg: 2.5,
    strainValueAvg: 142.8,
    deviceOnlineRate: 95.8,
    warningTriggerCount: 5,
    maintenanceOrderCount: 5,
    momChangeRate: 8.7,
    bridgeHealthRank: 8,
  },
  {
    statisticsDate: '2024-06-30',
    bridgeName: '漳州九龙江大桥',
    monitorPosition: '副桥左侧支座',
    bearingDisplacementAvg: 0.48,
    vibrationFrequencyAvg: 3.5,
    strainValueAvg: 105.3,
    deviceOnlineRate: 99.5,
    warningTriggerCount: 0,
    maintenanceOrderCount: 0,
    momChangeRate: -2.8,
    bridgeHealthRank: 2,
  },
  {
    statisticsDate: '2024-06-30',
    bridgeName: '莆田木兰溪大桥',
    monitorPosition: '主桥右侧支座',
    bearingDisplacementAvg: 0.98,
    vibrationFrequencyAvg: 2.9,
    strainValueAvg: 131.5,
    deviceOnlineRate: 97.6,
    warningTriggerCount: 3,
    maintenanceOrderCount: 3,
    momChangeRate: 4.2,
    bridgeHealthRank: 5,
  },
  {
    statisticsDate: '2024-06-30',
    bridgeName: '宁德东湖大桥',
    monitorPosition: '引桥左侧支座',
    bearingDisplacementAvg: 0.76,
    vibrationFrequencyAvg: 3.1,
    strainValueAvg: 119.8,
    deviceOnlineRate: 98.9,
    warningTriggerCount: 1,
    maintenanceOrderCount: 1,
    momChangeRate: 0.8,
    bridgeHealthRank: 4,
  },
  {
    statisticsDate: '2024-06-30',
    bridgeName: '龙岩龙川大桥',
    monitorPosition: '主桥边跨支座',
    bearingDisplacementAvg: 1.12,
    vibrationFrequencyAvg: 2.7,
    strainValueAvg: 138.4,
    deviceOnlineRate: 96.5,
    warningTriggerCount: 4,
    maintenanceOrderCount: 4,
    momChangeRate: 7.3,
    bridgeHealthRank: 7,
  },
  {
    statisticsDate: '2024-06-30',
    bridgeName: '三明沙溪大桥',
    monitorPosition: '副桥右侧支座',
    bearingDisplacementAvg: 0.55,
    vibrationFrequencyAvg: 3.3,
    strainValueAvg: 112.7,
    deviceOnlineRate: 99.1,
    warningTriggerCount: 0,
    maintenanceOrderCount: 0,
    momChangeRate: -1.5,
    bridgeHealthRank: 1,
  },
  {
    statisticsDate: '2024-06-30',
    bridgeName: '南平建溪大桥',
    monitorPosition: '主桥中支座',
    bearingDisplacementAvg: 1.05,
    vibrationFrequencyAvg: 2.6,
    strainValueAvg: 129.8,
    deviceOnlineRate: 97.2,
    warningTriggerCount: 3,
    maintenanceOrderCount: 2,
    momChangeRate: 5.6,
    bridgeHealthRank: 6,
  },
  {
    statisticsDate: '2024-06-30',
    bridgeName: '平潭海峡大桥',
    monitorPosition: '引桥中支座',
    bearingDisplacementAvg: 0.82,
    vibrationFrequencyAvg: 3,
    strainValueAvg: 121.4,
    deviceOnlineRate: 99,
    warningTriggerCount: 1,
    maintenanceOrderCount: 1,
    momChangeRate: 1.8,
    bridgeHealthRank: 4,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为桥梁监测统计分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'statisticsDate',
      label: '统计日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择统计日期',
        type: 'date',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      labelWidth: '120',
      rules: 'required', // 统计日期为必填项
      isSearch: true, // 作为搜索字段
      addShow: true, // 新增时显示
      editShow: true, // 编辑时显示
    },
    {
      fieldName: 'bridgeName',
      label: '桥梁名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入桥梁名称',
        maxlength: 100,
      },
      labelWidth: '120',
      rules: 'required',
      isSearch: true,
      addShow: true,
      editShow: true,
    },
    {
      fieldName: 'monitorPosition',
      label: '监测部位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入监测部位（如：主桥左侧支座）',
        maxlength: 100,
      },
      labelWidth: '120',
      rules: 'required',
      isSearch: true,
      addShow: true,
      editShow: true,
    },
    {
      fieldName: 'bearingDisplacementAvg',
      label: '支座位移日均值',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入支座位移日均值（单位：mm）',
        min: 0,
        precision: 2, // 保留2位小数，贴合位移监测精度
        addonAfter: 'mm',
      },
      rules: 'required',
      addShow: true,
      editShow: true,
    },
    {
      fieldName: 'vibrationFrequencyAvg',
      label: '振动频率日均值',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入振动频率日均值（单位：Hz）',
        min: 0,
        precision: 1,
        addonAfter: 'Hz',
      },
      rules: 'required',
      addShow: true,
      editShow: true,
    },
    {
      fieldName: 'strainValueAvg',
      label: '应变值日均值',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入应变值日均值（单位：με）',
        min: 0,
        precision: 1,
        addonAfter: 'με',
      },
      rules: 'required',
      addShow: true,
      editShow: true,
    },
    {
      fieldName: 'deviceOnlineRate',
      label: '设备日在线率',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入设备日在线率（单位：%）',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
      addShow: true,
      editShow: true,
    },
    {
      fieldName: 'warningTriggerCount',
      label: '预警触发次数',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入预警触发次数',
        min: 0,
        precision: 0,
        addonAfter: '次',
      },
      rules: 'required',
      addShow: true,
      editShow: true,
    },
    {
      fieldName: 'maintenanceOrderCount',
      label: '养护工单创建数',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入养护工单创建数',
        min: 0,
        precision: 0,
        addonAfter: '个',
      },
      rules: 'required',
      addShow: true,
      editShow: true,
    },
    {
      fieldName: 'momChangeRate',
      label: '环比变化率',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入环比变化率（单位：%）',
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
      addShow: true,
      editShow: true,
    },
    {
      fieldName: 'bridgeHealthRank',
      label: '桥梁健康度当日排名',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入桥梁健康度当日排名',
        min: 1,
        precision: 0,
        addonAfter: '名',
      },
      rules: 'required',
      addShow: true,
      editShow: true,
    },
  ];
}

/** 表格字段 - 改造为桥梁监测统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'statisticsDate',
      title: '统计日期',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'bridgeName',
      title: '桥梁名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'bridgeName' },
    },
    {
      field: 'monitorPosition',
      title: '监测部位',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'bearingDisplacementAvg',
      title: '支座位移日均值(mm)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'vibrationFrequencyAvg',
      title: '振动频率日均值(Hz)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'strainValueAvg',
      title: '应变值日均值(με)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'deviceOnlineRate',
      title: '设备日在线率(%)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'warningTriggerCount',
      title: '预警触发次数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'maintenanceOrderCount',
      title: '养护工单创建数',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'momChangeRate',
      title: '环比变化率(%)',
      minWidth: 120,
      sortable: true,
      // 自定义单元格样式，区分正负变化率
      cellRender: {
        name: 'custom-cell',
        props: {
          formatter: (row) => {
            const rate = row.momChangeRate;
            return {
              text: `${rate}%`,
              style:
                rate > 0
                  ? 'color: #ef4444;'
                  : rate < 0
                    ? 'color: #10b981;'
                    : '',
            };
          },
        },
      },
    },
    {
      field: 'bridgeHealthRank',
      title: '桥梁健康度当日排名',
      minWidth: 160,
      sortable: true,
      // 排名高亮显示
      cellRender: {
        name: 'custom-cell',
        props: {
          formatter: (row) => {
            const rank = row.bridgeHealthRank;
            return {
              text: `${rank}名`,
              style: rank <= 3 ? 'color: #1989fa; font-weight: 600;' : '',
            };
          },
        },
      },
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
