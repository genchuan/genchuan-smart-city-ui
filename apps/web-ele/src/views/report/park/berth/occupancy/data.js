// data.js
/** 泊位占用报表 - 初始数据 */
export const dataList = () => {
  return [
    {
      "id": 1,
      "statDate": "2026-02-05",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "spaceType": "标准泊位",
      "totalBerth": 450,
      "occupiedBerth": 320,
      "freeBerth": 130,
      "avgOccupationRate": "71.11%",
      "overtimeOccupationCount": 25,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 2,
      "statDate": "2026-02-05",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "spaceType": "临时泊位",
      "totalBerth": 280,
      "occupiedBerth": 210,
      "freeBerth": 70,
      "avgOccupationRate": "75.00%",
      "overtimeOccupationCount": 18,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 3,
      "statDate": "2026-02-05",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "spaceType": "充电泊位",
      "totalBerth": 380,
      "occupiedBerth": 290,
      "freeBerth": 90,
      "avgOccupationRate": "76.32%",
      "overtimeOccupationCount": 15,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 4,
      "statDate": "2026-02-05",
      "areaName": "白云区",
      "parkType": "小区停车场",
      "spaceType": "标准泊位",
      "totalBerth": 320,
      "occupiedBerth": 240,
      "freeBerth": 80,
      "avgOccupationRate": "75.00%",
      "overtimeOccupationCount": 22,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 5,
      "statDate": "2026-02-05",
      "areaName": "黄埔区",
      "parkType": "商业停车场",
      "spaceType": "无障碍泊位",
      "totalBerth": 180,
      "occupiedBerth": 135,
      "freeBerth": 45,
      "avgOccupationRate": "75.00%",
      "overtimeOccupationCount": 8,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 6,
      "statDate": "2026-02-04",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "spaceType": "标准泊位",
      "totalBerth": 450,
      "occupiedBerth": 310,
      "freeBerth": 140,
      "avgOccupationRate": "68.89%",
      "overtimeOccupationCount": 20,
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 7,
      "statDate": "2026-02-04",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "spaceType": "临时泊位",
      "totalBerth": 280,
      "occupiedBerth": 205,
      "freeBerth": 75,
      "avgOccupationRate": "73.21%",
      "overtimeOccupationCount": 16,
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 8,
      "statDate": "2026-02-03",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "spaceType": "充电泊位",
      "totalBerth": 200,
      "occupiedBerth": 150,
      "freeBerth": 50,
      "avgOccupationRate": "75.00%",
      "overtimeOccupationCount": 12,
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 9,
      "statDate": "2026-02-03",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "spaceType": "标准泊位",
      "totalBerth": 380,
      "occupiedBerth": 285,
      "freeBerth": 95,
      "avgOccupationRate": "75.00%",
      "overtimeOccupationCount": 14,
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 10,
      "statDate": "2026-02-02",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "spaceType": "标准泊位",
      "totalBerth": 450,
      "occupiedBerth": 325,
      "freeBerth": 125,
      "avgOccupationRate": "72.22%",
      "overtimeOccupationCount": 23,
      "updateTime": "2026-02-02 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 11,
      "statDate": "2026-02-01",
      "areaName": "荔湾区",
      "parkType": "路侧停车",
      "spaceType": "临时泊位",
      "totalBerth": 220,
      "occupiedBerth": 165,
      "freeBerth": 55,
      "avgOccupationRate": "75.00%",
      "overtimeOccupationCount": 10,
      "updateTime": "2026-02-01 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 12,
      "statDate": "2026-02-01",
      "areaName": "番禺区",
      "parkType": "小区停车场",
      "spaceType": "标准泊位",
      "totalBerth": 280,
      "occupiedBerth": 210,
      "freeBerth": 70,
      "avgOccupationRate": "75.00%",
      "overtimeOccupationCount": 17,
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
      fieldName: 'spaceType',
      label: '泊位类型',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '标准泊位', value: '标准泊位' },
          { label: '临时泊位', value: '临时泊位' },
          { label: '充电泊位', value: '充电泊位' },
          { label: '无障碍泊位', value: '无障碍泊位' },
          { label: '货车泊位', value: '货车泊位' },
        ],
        placeholder: '请选择泊位类型',
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
      field: 'spaceType',
      title: '泊位类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'totalBerth',
      title: '总泊位数',
      minWidth: 100,
      sortable: true,
      slots: { default: 'totalBerth' },
    },
    {
      field: 'occupiedBerth',
      title: '占用泊位数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'occupiedBerth' },
    },
    {
      field: 'freeBerth',
      title: '空闲泊位数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'freeBerth' },
    },
    {
      field: 'avgOccupationRate',
      title: '平均占用率',
      minWidth: 120,
      sortable: true,
      slots: { default: 'avgOccupationRate' },
    },
    {
      field: 'overtimeOccupationCount',
      title: '超时长占用次数',
      minWidth: 140,
      sortable: true,
      slots: { default: 'overtimeOccupationCount' },
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
  excelName: '泊位占用报表',
  excelAllName: '泊位占用报表.xlsx',
  total: '报表总数: 12; 今日数据: 5; 本周数据: 10;',
};
