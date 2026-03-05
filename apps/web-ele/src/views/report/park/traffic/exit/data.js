// data.js
/** 出场车流报表 - 初始数据 */
export const dataList = () => {
  return [
    {
      "id": 1,
      "statDate": "2026-02-05",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "stayDuration": "1-2小时",
      "peakMorningExit": 310,
      "peakEveningExit": 270,
      "totalExit": 1230,
      "turnoverRate": 0.85,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 2,
      "statDate": "2026-02-05",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "stayDuration": "0.5-1小时",
      "peakMorningExit": 240,
      "peakEveningExit": 210,
      "totalExit": 960,
      "turnoverRate": 0.92,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 3,
      "statDate": "2026-02-05",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "stayDuration": "2-4小时",
      "peakMorningExit": 270,
      "peakEveningExit": 250,
      "totalExit": 1080,
      "turnoverRate": 0.78,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 4,
      "statDate": "2026-02-05",
      "areaName": "白云区",
      "parkType": "小区停车场",
      "stayDuration": "4-8小时",
      "peakMorningExit": 170,
      "peakEveningExit": 150,
      "totalExit": 830,
      "turnoverRate": 0.65,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 5,
      "statDate": "2026-02-05",
      "areaName": "黄埔区",
      "parkType": "商业停车场",
      "stayDuration": "8小时以上",
      "peakMorningExit": 190,
      "peakEveningExit": 170,
      "totalExit": 900,
      "turnoverRate": 0.72,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 6,
      "statDate": "2026-02-04",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "stayDuration": "1-2小时",
      "peakMorningExit": 290,
      "peakEveningExit": 260,
      "totalExit": 1160,
      "turnoverRate": 0.83,
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 7,
      "statDate": "2026-02-04",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "stayDuration": "0.5-1小时",
      "peakMorningExit": 230,
      "peakEveningExit": 200,
      "totalExit": 930,
      "turnoverRate": 0.90,
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 8,
      "statDate": "2026-02-03",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "stayDuration": "2-4小时",
      "peakMorningExit": 330,
      "peakEveningExit": 290,
      "totalExit": 1300,
      "turnoverRate": 0.81,
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 9,
      "statDate": "2026-02-03",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "stayDuration": "1-2小时",
      "peakMorningExit": 250,
      "peakEveningExit": 230,
      "totalExit": 1030,
      "turnoverRate": 0.76,
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 10,
      "statDate": "2026-02-02",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "stayDuration": "1-2小时",
      "peakMorningExit": 320,
      "peakEveningExit": 280,
      "totalExit": 1260,
      "turnoverRate": 0.84,
      "updateTime": "2026-02-02 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 11,
      "statDate": "2026-02-01",
      "areaName": "荔湾区",
      "parkType": "路侧停车",
      "stayDuration": "0.5-1小时",
      "peakMorningExit": 210,
      "peakEveningExit": 180,
      "totalExit": 870,
      "turnoverRate": 0.88,
      "updateTime": "2026-02-01 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 12,
      "statDate": "2026-02-01",
      "areaName": "番禺区",
      "parkType": "小区停车场",
      "stayDuration": "4-8小时",
      "peakMorningExit": 180,
      "peakEveningExit": 160,
      "totalExit": 760,
      "turnoverRate": 0.68,
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
          { label: '0.5-1小时', value: '0.5-1小时' },
          { label: '1-2小时', value: '1-2小时' },
          { label: '2-4小时', value: '2-4小时' },
          { label: '4-8小时', value: '4-8小时' },
          { label: '8小时以上', value: '8小时以上' },
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
      width: 180,
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
