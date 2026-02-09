// data.js
/** 日收入数据报表 - 初始数据 */
export const dataList = () => {
  return [
    {
      "id": 1,
      "statDate": "2026-02-05",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "payWay": "微信支付",
      "totalIncome": 125800,
      "orderCount": 1250,
      "avgOrderAmount": 100.64,
      "onlinePayRatio": 85,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 2,
      "statDate": "2026-02-05",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "payWay": "支付宝",
      "totalIncome": 78400,
      "orderCount": 980,
      "avgOrderAmount": 80.00,
      "onlinePayRatio": 82,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 3,
      "statDate": "2026-02-05",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "payWay": "微信支付",
      "totalIncome": 110000,
      "orderCount": 1100,
      "avgOrderAmount": 100.00,
      "onlinePayRatio": 88,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 4,
      "statDate": "2026-02-05",
      "areaName": "白云区",
      "parkType": "小区停车场",
      "payWay": "现金支付",
      "totalIncome": 51000,
      "orderCount": 850,
      "avgOrderAmount": 60.00,
      "onlinePayRatio": 40,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 5,
      "statDate": "2026-02-05",
      "areaName": "黄埔区",
      "parkType": "商业停车场",
      "payWay": "支付宝",
      "totalIncome": 92000,
      "orderCount": 920,
      "avgOrderAmount": 100.00,
      "onlinePayRatio": 90,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 6,
      "statDate": "2026-02-04",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "payWay": "微信支付",
      "totalIncome": 118000,
      "orderCount": 1180,
      "avgOrderAmount": 100.00,
      "onlinePayRatio": 86,
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 7,
      "statDate": "2026-02-04",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "payWay": "支付宝",
      "totalIncome": 76000,
      "orderCount": 950,
      "avgOrderAmount": 80.00,
      "onlinePayRatio": 83,
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 8,
      "statDate": "2026-02-03",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "payWay": "微信支付",
      "totalIncome": 132000,
      "orderCount": 1320,
      "avgOrderAmount": 100.00,
      "onlinePayRatio": 87,
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 9,
      "statDate": "2026-02-03",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "payWay": "支付宝",
      "totalIncome": 105000,
      "orderCount": 1050,
      "avgOrderAmount": 100.00,
      "onlinePayRatio": 85,
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 10,
      "statDate": "2026-02-02",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "payWay": "微信支付",
      "totalIncome": 128000,
      "orderCount": 1280,
      "avgOrderAmount": 100.00,
      "onlinePayRatio": 88,
      "updateTime": "2026-02-02 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 11,
      "statDate": "2026-02-01",
      "areaName": "荔湾区",
      "parkType": "路侧停车",
      "payWay": "现金支付",
      "totalIncome": 53400,
      "orderCount": 890,
      "avgOrderAmount": 60.00,
      "onlinePayRatio": 35,
      "updateTime": "2026-02-01 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 12,
      "statDate": "2026-02-01",
      "areaName": "番禺区",
      "parkType": "小区停车场",
      "payWay": "微信支付",
      "totalIncome": 62400,
      "orderCount": 780,
      "avgOrderAmount": 80.00,
      "onlinePayRatio": 75,
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
      fieldName: 'payWay',
      label: '支付方式',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '微信支付', value: '微信支付' },
          { label: '支付宝', value: '支付宝' },
          { label: '现金支付', value: '现金支付' },
          { label: 'ETC支付', value: 'ETC支付' },
          { label: '银行卡', value: '银行卡' },
        ],
        placeholder: '请选择支付方式',
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
      field: 'payWay',
      title: '支付方式',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'totalIncome',
      title: '总收费金额(元)',
      minWidth: 140,
      sortable: true,
      slots: { default: 'totalIncome' },
    },
    {
      field: 'orderCount',
      title: '订单总数',
      minWidth: 100,
      sortable: true,
      slots: { default: 'orderCount' },
    },
    {
      field: 'avgOrderAmount',
      title: '平均客单价(元)',
      minWidth: 120,
      sortable: true,
      slots: { default: 'avgOrderAmount' },
    },
    {
      field: 'onlinePayRatio',
      title: '线上支付占比(%)',
      minWidth: 120,
      sortable: true,
      slots: { default: 'onlinePayRatio' },
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
  excelName: '日收入数据报表',
  excelAllName: '日收入数据报表.xlsx',
  total: '报表总数: 12; 今日数据: 5; 本周数据: 10;',
};
