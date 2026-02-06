// data.js
/** 出场车流报表 - 初始数据 */
export const dataList = () => {
  return [
    {
      "id": 1,
      "statDate": "2026-02-05",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "stayDuration": "1小时内",
      "peakMorningExit": 300,
      "peakEveningExit": 270,
      "totalExit": 1200,
      "turnoverRate": 2.8,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 2,
      "statDate": "2026-02-05",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "stayDuration": "1-3小时",
      "peakMorningExit": 240,
      "peakEveningExit": 210,
      "totalExit": 950,
      "turnoverRate": 2.5,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 3,
      "statDate": "2026-02-05",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "stayDuration": "3-6小时",
      "peakMorningExit": 280,
      "peakEveningExit": 260,
      "totalExit": 1100,
      "turnoverRate": 2.2,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 4,
      "statDate": "2026-02-05",
      "areaName": "白云区",
      "parkType": "小区停车场",
      "stayDuration": "6-12小时",
      "peakMorningExit": 180,
      "peakEveningExit": 160,
      "totalExit": 850,
      "turnoverRate": 1.8,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 5,
      "statDate": "2026-02-05",
      "areaName": "黄埔区",
      "parkType": "商业停车场",
      "stayDuration": "12小时以上",
      "peakMorningExit": 200,
      "peakEveningExit": 180,
      "totalExit": 920,
      "turnoverRate": 1.5,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 6,
      "statDate": "2026-02-04",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "stayDuration": "1小时内",
      "peakMorningExit": 290,
      "peakEveningExit": 260,
      "totalExit": 1180,
      "turnoverRate": 2.7,
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 7,
      "statDate": "2026-02-04",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "stayDuration": "1-3小时",
      "peakMorningExit": 230,
      "peakEveningExit": 200,
      "totalExit": 950,
      "turnoverRate": 2.4,
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 8,
      "statDate": "2026-02-03",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "stayDuration": "3-6小时",
      "peakMorningExit": 330,
      "peakEveningExit": 290,
      "totalExit": 1320,
      "turnoverRate": 2.9,
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 9,
      "statDate": "2026-02-03",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "stayDuration": "1小时内",
      "peakMorningExit": 250,
      "peakEveningExit": 230,
      "totalExit": 1050,
      "turnoverRate": 2.6,
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 10,
      "statDate": "2026-02-02",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "stayDuration": "1-3小时",
      "peakMorningExit": 320,
      "peakEveningExit": 280,
      "totalExit": 1280,
      "turnoverRate": 2.8,
      "updateTime": "2026-02-02 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 11,
      "statDate": "2026-02-01",
      "areaName": "荔湾区",
      "parkType": "路侧停车",
      "stayDuration": "3-6小时",
      "peakMorningExit": 210,
      "peakEveningExit": 180,
      "totalExit": 890,
      "turnoverRate": 2.3,
      "updateTime": "2026-02-01 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 12,
      "statDate": "2026-02-01",
      "areaName": "番禺区",
      "parkType": "小区停车场",
      "stayDuration": "6-12小时",
      "peakMorningExit": 180,
      "peakEveningExit": 170,
      "totalExit": 780,
      "turnoverRate": 1.7,
      "updateTime": "2026-02-01 18:30",
      "operator": "系统自动生成"
    }
  ];
};

/** 搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'statDate',
      label: '统计日期',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        type: 'date',
        placeholder: '请选择统计日期',
      },
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '天河区', value: '天河区' },
          { label: '越秀区', value: '越秀区' },
          { label: '海珠区', value: '海珠区' },
          { label: '白云区', value: '白云区' },
          { label: '黄埔区', value: '黄埔区' },
          { label: '荔湾区', value: '荔湾区' },
          { label: '番禺区', value: '番禺区' },
        ],
        placeholder: '请选择行政区域',
        showSearch: true,
      },
      fieldName: 'areaName',
      label: '行政区域',
    },
    {
      fieldName: 'parkType',
      label: '车场类型',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '商业停车场', value: '商业停车场' },
          { label: '路侧停车', value: '路侧停车' },
          { label: '小区停车场', value: '小区停车场' },
          { label: '景区停车场', value: '景区停车场' },
        ],
        placeholder: '请选择车场类型',
      },
    },
    {
      fieldName: 'stayDuration',
      label: '停留时长',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '1小时内', value: '1小时内' },
          { label: '1-3小时', value: '1-3小时' },
          { label: '3-6小时', value: '3-6小时' },
          { label: '6-12小时', value: '6-12小时' },
          { label: '12小时以上', value: '12小时以上' },
        ],
        placeholder: '请选择停留时长',
      },
    },
  ];
}

/** 表格字段配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'statDate',
      title: '统计日期',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'areaName',
      title: '行政区域',
      minWidth: 100,
      sortable: true,
      slots: { default: 'areaName' },
    },
    {
      field: 'parkType',
      title: '车场类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'stayDuration',
      title: '停留时长',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'peakMorningExit',
      title: '早高峰(7-9点)出场数',
      minWidth: 140,
      sortable: true,
      slots: { default: 'peakMorningExit' },
    },
    {
      field: 'peakEveningExit',
      title: '晚高峰(17-19点)出场数',
      minWidth: 140,
      sortable: true,
      slots: { default: 'peakEveningExit' },
    },
    {
      field: 'totalExit',
      title: '总出场数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'totalExit' },
    },
    {
      field: 'turnoverRate',
      title: '车流周转率',
      minWidth: 120,
      sortable: true,
      slots: { default: 'turnoverRate' },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 文字描述对象 */
export const textObj = {
  editText: '编辑报表',
  addText: '新增报表',
  excelName: '出场车流报表',
  excelAllName: '出场车流报表.xlsx',
  total: '报表总数: 12; 今日数据: 5; 本周数据: 10;',
};
