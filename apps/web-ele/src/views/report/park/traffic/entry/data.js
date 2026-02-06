// data.js
/** 入场车流报表 - 初始数据 */
export const dataList = () => {
  return [
    {
      "id": 1,
      "statDate": "2026-02-05",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "carType": "小型车",
      "peakMorningEntry": 320,
      "peakEveningEntry": 280,
      "offPeakEntry": 650,
      "totalEntry": 1250,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 2,
      "statDate": "2026-02-05",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "carType": "小型车",
      "peakMorningEntry": 250,
      "peakEveningEntry": 220,
      "offPeakEntry": 510,
      "totalEntry": 980,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 3,
      "statDate": "2026-02-05",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "carType": "中型车",
      "peakMorningEntry": 280,
      "peakEveningEntry": 260,
      "offPeakEntry": 560,
      "totalEntry": 1100,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 4,
      "statDate": "2026-02-05",
      "areaName": "白云区",
      "parkType": "小区停车场",
      "carType": "小型车",
      "peakMorningEntry": 180,
      "peakEveningEntry": 160,
      "offPeakEntry": 510,
      "totalEntry": 850,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 5,
      "statDate": "2026-02-05",
      "areaName": "黄埔区",
      "parkType": "商业停车场",
      "carType": "大型车",
      "peakMorningEntry": 200,
      "peakEveningEntry": 180,
      "offPeakEntry": 540,
      "totalEntry": 920,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 6,
      "statDate": "2026-02-04",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "carType": "小型车",
      "peakMorningEntry": 300,
      "peakEveningEntry": 270,
      "offPeakEntry": 610,
      "totalEntry": 1180,
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 7,
      "statDate": "2026-02-04",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "carType": "小型车",
      "peakMorningEntry": 240,
      "peakEveningEntry": 210,
      "offPeakEntry": 500,
      "totalEntry": 950,
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 8,
      "statDate": "2026-02-03",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "carType": "中型车",
      "peakMorningEntry": 340,
      "peakEveningEntry": 300,
      "offPeakEntry": 680,
      "totalEntry": 1320,
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 9,
      "statDate": "2026-02-03",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "carType": "小型车",
      "peakMorningEntry": 260,
      "peakEveningEntry": 240,
      "offPeakEntry": 550,
      "totalEntry": 1050,
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 10,
      "statDate": "2026-02-02",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "carType": "小型车",
      "peakMorningEntry": 330,
      "peakEveningEntry": 290,
      "offPeakEntry": 660,
      "totalEntry": 1280,
      "updateTime": "2026-02-02 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 11,
      "statDate": "2026-02-01",
      "areaName": "荔湾区",
      "parkType": "路侧停车",
      "carType": "小型车",
      "peakMorningEntry": 220,
      "peakEveningEntry": 190,
      "offPeakEntry": 480,
      "totalEntry": 890,
      "updateTime": "2026-02-01 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 12,
      "statDate": "2026-02-01",
      "areaName": "番禺区",
      "parkType": "小区停车场",
      "carType": "小型车",
      "peakMorningEntry": 190,
      "peakEveningEntry": 170,
      "offPeakEntry": 420,
      "totalEntry": 780,
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
      fieldName: 'carType',
      label: '车型',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '小型车', value: '小型车' },
          { label: '中型车', value: '中型车' },
          { label: '大型车', value: '大型车' },
          { label: '新能源车', value: '新能源车' },
        ],
        placeholder: '请选择车型',
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
      field: 'carType',
      title: '车型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'peakMorningEntry',
      title: '早高峰(7-9点)入场数',
      minWidth: 140,
      sortable: true,
      slots: { default: 'peakMorningEntry' },
    },
    {
      field: 'peakEveningEntry',
      title: '晚高峰(17-19点)入场数',
      minWidth: 140,
      sortable: true,
      slots: { default: 'peakEveningEntry' },
    },
    {
      field: 'offPeakEntry',
      title: '平峰时段入场数',
      minWidth: 140,
      sortable: true,
      slots: { default: 'offPeakEntry' },
    },
    {
      field: 'totalEntry',
      title: '总入场数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'totalEntry' },
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
  excelName: '入场车流报表',
  excelAllName: '入场车流报表.xlsx',
  total: '报表总数: 12; 今日数据: 5; 本周数据: 10;',
};
