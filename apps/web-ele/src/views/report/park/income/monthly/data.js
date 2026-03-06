// data.js - 月收入数据报表版本
/** 月收入数据报表 - 初始数据 */
export const dataList = () => {
  return [
    {
      "id": 1,
      "statMonth": "2026-01",
      "areaCode": "440106",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "orderType": "临时停车",
      "totalIncome": 1250000,
      "orderCount": 12500,
      "avgOrderAmount": 100,
      "arrearsAmount": 12500,
      "yoyGrowthRate": 12.5,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 2,
      "statMonth": "2026-01",
      "areaCode": "440104",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "orderType": "月卡停车",
      "totalIncome": 980000,
      "orderCount": 9800,
      "avgOrderAmount": 100,
      "arrearsAmount": 9800,
      "yoyGrowthRate": 8.7,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 3,
      "statMonth": "2026-01",
      "areaCode": "440105",
      "areaName": "海珠区",
      "parkType": "商业停车场",
      "orderType": "临时停车",
      "totalIncome": 1100000,
      "orderCount": 11000,
      "avgOrderAmount": 100,
      "arrearsAmount": 11000,
      "yoyGrowthRate": 15.2,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 4,
      "statMonth": "2026-01",
      "areaCode": "440111",
      "areaName": "白云区",
      "parkType": "小区停车场",
      "orderType": "业主停车",
      "totalIncome": 850000,
      "orderCount": 8500,
      "avgOrderAmount": 100,
      "arrearsAmount": 8500,
      "yoyGrowthRate": 6.3,
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 5,
      "statMonth": "2025-12",
      "areaCode": "440112",
      "areaName": "黄埔区",
      "parkType": "商业停车场",
      "orderType": "临时停车",
      "totalIncome": 920000,
      "orderCount": 9200,
      "avgOrderAmount": 100,
      "arrearsAmount": 9200,
      "yoyGrowthRate": 10.5,
      "updateTime": "2026-01-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 6,
      "statMonth": "2025-11",
      "areaCode": "440106",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "orderType": "临时停车",
      "totalIncome": 1180000,
      "orderCount": 11800,
      "avgOrderAmount": 100,
      "arrearsAmount": 11800,
      "yoyGrowthRate": 14.2,
      "updateTime": "2025-12-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 7,
      "statMonth": "2025-10",
      "areaCode": "440106",
      "areaName": "天河区",
      "parkType": "商业停车场",
      "orderType": "临时停车",
      "totalIncome": 1050000,
      "orderCount": 10500,
      "avgOrderAmount": 100,
      "arrearsAmount": 10500,
      "yoyGrowthRate": 11.8,
      "updateTime": "2025-11-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 8,
      "statMonth": "2025-09",
      "areaCode": "440104",
      "areaName": "越秀区",
      "parkType": "路侧停车",
      "orderType": "月卡停车",
      "totalIncome": 890000,
      "orderCount": 8900,
      "avgOrderAmount": 100,
      "arrearsAmount": 8900,
      "yoyGrowthRate": 7.5,
      "updateTime": "2025-10-05 18:30",
      "operator": "系统自动生成"
    }
  ];
};

/** 搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'statMonth',
      label: '统计月份',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        type: 'month',
        placeholder: '请选择统计月份',
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
          { label: '天河区', value: '440106' },
          { label: '越秀区', value: '440104' },
          { label: '海珠区', value: '440105' },
          { label: '白云区', value: '440111' },
          { label: '黄埔区', value: '440112' },
          { label: '荔湾区', value: '440103' },
          { label: '番禺区', value: '440113' },
        ],
        placeholder: '请选择行政区域',
        showSearch: true,
      },
      fieldName: 'areaCode',
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
      fieldName: 'orderType',
      label: '订单类型',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '临时停车', value: '临时停车' },
          { label: '月卡停车', value: '月卡停车' },
          { label: '业主停车', value: '业主停车' },
          { label: '预约停车', value: '预约停车' },
        ],
        placeholder: '请选择订单类型',
      },
    },
  ];
}

/** 表格字段配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'statMonth',
      title: '统计月份',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'areaName',
      title: '区域名称',
      minWidth: 100,
      sortable: true,
      slots: { default: 'areaName' },
    },
    {
      field: 'parkType',
      title: '车场类型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'orderType',
      title: '订单类型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'totalIncome',
      title: '总收费金额(元)',
      minWidth: 120,
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
      title: '月均客单价(元)',
      minWidth: 120,
      sortable: true,
      slots: { default: 'avgOrderAmount' },
    },
    {
      field: 'arrearsAmount',
      title: '欠费金额(元)',
      minWidth: 120,
      sortable: true,
      slots: { default: 'arrearsAmount' },
    },
    {
      field: 'yoyGrowthRate',
      title: '同比增长率(%)',
      minWidth: 120,
      sortable: true,
      slots: { default: 'yoyGrowthRate' },
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
  excelName: '月收入数据报表',
  excelAllName: '月收入数据报表.xlsx',
  total: '报表总数: 8; 本月数据: 4; 近3个月数据: 6;',
};
