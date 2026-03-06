// data.js

/** 车流分布报表 - 初始数据 */
export const dataList = () => {
  return [
    {
      "id": 1,
      "statDate": "2026-02-05",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "timePeriod": "早高峰",
      "totalTraffic": 1250,
      "avgTraffic": 625,
      "hotspotFlag": "是",
      "hotspotReason": "CBD核心区，工作日通勤需求大",
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 2,
      "statDate": "2026-02-05",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "timePeriod": "晚高峰",
      "totalTraffic": 980,
      "avgTraffic": 490,
      "hotspotFlag": "是",
      "hotspotReason": "老城区交通拥堵，停车需求集中",
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 3,
      "statDate": "2026-02-05",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "timePeriod": "平峰",
      "totalTraffic": 1100,
      "avgTraffic": 550,
      "hotspotFlag": "否",
      "hotspotReason": "",
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 4,
      "statDate": "2026-02-05",
      "areaName": "白云区",
      "parkType": "小区停车场",
      "timePeriod": "早高峰",
      "totalTraffic": 850,
      "avgTraffic": 425,
      "hotspotFlag": "否",
      "hotspotReason": "",
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 5,
      "statDate": "2026-02-05",
      "areaName": "黄埔区",
      "parkType": "商业停车场",
      "timePeriod": "平峰",
      "totalTraffic": 920,
      "avgTraffic": 460,
      "hotspotFlag": "是",
      "hotspotReason": "工业园区物流车辆集中",
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 6,
      "statDate": "2026-02-04",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "timePeriod": "早高峰",
      "totalTraffic": 1180,
      "avgTraffic": 590,
      "hotspotFlag": "是",
      "hotspotReason": "周五通勤与商务活动叠加",
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 7,
      "statDate": "2026-02-04",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "timePeriod": "晚高峰",
      "totalTraffic": 950,
      "avgTraffic": 475,
      "hotspotFlag": "是",
      "hotspotReason": "医院周边停车需求大",
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 8,
      "statDate": "2026-02-03",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "timePeriod": "平峰",
      "totalTraffic": 1320,
      "avgTraffic": 660,
      "hotspotFlag": "是",
      "hotspotReason": "大型商业活动期间",
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 9,
      "statDate": "2026-02-03",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "timePeriod": "晚高峰",
      "totalTraffic": 1050,
      "avgTraffic": 525,
      "hotspotFlag": "否",
      "hotspotReason": "",
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 10,
      "statDate": "2026-02-02",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "timePeriod": "早高峰",
      "totalTraffic": 1280,
      "avgTraffic": 640,
      "hotspotFlag": "是",
      "hotspotReason": "工作日通勤高峰",
      "updateTime": "2026-02-02 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 11,
      "statDate": "2026-02-01",
      "areaName": "荔湾区",
      "parkType": "路侧停车",
      "timePeriod": "平峰",
      "totalTraffic": 890,
      "avgTraffic": 445,
      "hotspotFlag": "否",
      "hotspotReason": "",
      "updateTime": "2026-02-01 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 12,
      "statDate": "2026-02-01",
      "areaName": "番禺区",
      "parkType": "小区停车场",
      "timePeriod": "晚高峰",
      "totalTraffic": 780,
      "avgTraffic": 390,
      "hotspotFlag": "否",
      "hotspotReason": "",
      "updateTime": "2026-02-01 18:30",
      "operator": "系统自动生成"
    }
  ];
};

/** 搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'dateRange',
      label: '时间范围',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        type: 'daterange',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD',
        shortcuts: [
          {
            text: '近7天',
            value: () => {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 6);
              return [start, end];
            },
          },
          {
            text: '近30天',
            value: () => {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 29);
              return [start, end];
            },
          },
          {
            text: '本月',
            value: () => {
              const now = new Date();
              const start = new Date(now.getFullYear(), now.getMonth(), 1);
              const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
              return [start, end];
            },
          },
        ],
      },
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
      fieldName: 'timePeriod',
      label: '时段',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '早高峰', value: '早高峰' },
          { label: '晚高峰', value: '晚高峰' },
          { label: '平峰', value: '平峰' },
          { label: '夜间', value: '夜间' },
        ],
        placeholder: '请选择时段',
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
      field: 'timePeriod',
      title: '时段',
      minWidth: 100,
      sortable: true,
      slots: { default: 'timePeriod' },
    },
    {
      field: 'totalTraffic',
      title: '总车流量',
      minWidth: 120,
      sortable: true,
      slots: { default: 'totalTraffic' },
    },
    {
      field: 'avgTraffic',
      title: '平均车流量',
      minWidth: 120,
      sortable: true,
      slots: { default: 'avgTraffic' },
    },
    {
      field: 'hotspotFlag',
      title: '热点标识',
      minWidth: 100,
      sortable: true,
      slots: { default: 'hotspotFlag' },
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
  excelName: '车流分布报表',
  excelAllName: '车流分布报表.xlsx',
  total: '报表总数: 12; 今日数据: 5; 本周数据: 10;',
};
