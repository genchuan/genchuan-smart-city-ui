// data.js - 收入明细报表版本
/** 收入明细报表 - 初始数据 */
export const dataList = () => {
  return [
    {
      "id": 1,
      "orderNo": "DD202602050001",
      "carNumber": "粤A12345",
      "userPhone": "13800138001",
      "lotId": "PARK001",
      "lotName": "天河城停车场",
      "parkingStartTime": "2026-02-05 08:30:00",
      "parkingEndTime": "2026-02-05 12:45:00",
      "parkingDuration": 255,
      "originalAmount": 35.0,
      "discountAmount": 5.0,
      "payAmount": 30.0,
      "payWay": "微信支付",
      "payTime": "2026-02-05 12:40:00",
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 2,
      "orderNo": "DD202602050002",
      "carNumber": "粤B56789",
      "userPhone": "13800138002",
      "lotId": "PARK002",
      "lotName": "正佳广场停车场",
      "parkingStartTime": "2026-02-05 09:15:00",
      "parkingEndTime": "2026-02-05 16:30:00",
      "parkingDuration": 435,
      "originalAmount": 65.0,
      "discountAmount": 10.0,
      "payAmount": 55.0,
      "payWay": "支付宝",
      "payTime": "2026-02-05 16:25:00",
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 3,
      "orderNo": "DD202602050003",
      "carNumber": "粤C24680",
      "userPhone": "13800138003",
      "lotId": "PARK003",
      "lotName": "体育中心停车场",
      "parkingStartTime": "2026-02-05 10:00:00",
      "parkingEndTime": "2026-02-05 14:15:00",
      "parkingDuration": 255,
      "originalAmount": 30.0,
      "discountAmount": 0,
      "payAmount": 30.0,
      "payWay": "微信支付",
      "payTime": "2026-02-05 14:10:00",
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 4,
      "orderNo": "DD202602050004",
      "carNumber": "粤D13579",
      "userPhone": "13800138004",
      "lotId": "PARK004",
      "lotName": "越秀公园停车场",
      "parkingStartTime": "2026-02-05 11:30:00",
      "parkingEndTime": "2026-02-05 18:45:00",
      "parkingDuration": 435,
      "originalAmount": 70.0,
      "discountAmount": 15.0,
      "payAmount": 55.0,
      "payWay": "银联支付",
      "payTime": "2026-02-05 18:40:00",
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 5,
      "orderNo": "DD202602050005",
      "carNumber": "粤E98765",
      "userPhone": "13800138005",
      "lotId": "PARK001",
      "lotName": "天河城停车场",
      "parkingStartTime": "2026-02-05 13:00:00",
      "parkingEndTime": "2026-02-05 15:30:00",
      "parkingDuration": 150,
      "originalAmount": 25.0,
      "discountAmount": 5.0,
      "payAmount": 20.0,
      "payWay": "支付宝",
      "payTime": "2026-02-05 15:25:00",
      "updateTime": "2026-02-05 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 6,
      "orderNo": "DD202602040001",
      "carNumber": "粤F54321",
      "userPhone": "13800138006",
      "lotId": "PARK002",
      "lotName": "正佳广场停车场",
      "parkingStartTime": "2026-02-04 08:45:00",
      "parkingEndTime": "2026-02-04 17:30:00",
      "parkingDuration": 525,
      "originalAmount": 85.0,
      "discountAmount": 10.0,
      "payAmount": 75.0,
      "payWay": "微信支付",
      "payTime": "2026-02-04 17:25:00",
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 7,
      "orderNo": "DD202602040002",
      "carNumber": "粤G11223",
      "userPhone": "13800138007",
      "lotId": "PARK005",
      "lotName": "海珠广场停车场",
      "parkingStartTime": "2026-02-04 10:30:00",
      "parkingEndTime": "2026-02-04 12:45:00",
      "parkingDuration": 135,
      "originalAmount": 20.0,
      "discountAmount": 0,
      "payAmount": 20.0,
      "payWay": "现金支付",
      "payTime": "2026-02-04 12:40:00",
      "updateTime": "2026-02-04 18:30",
      "operator": "系统自动生成"
    },
    {
      "id": 8,
      "orderNo": "DD202602030001",
      "carNumber": "粤H44556",
      "userPhone": "13800138008",
      "lotId": "PARK001",
      "lotName": "天河城停车场",
      "parkingStartTime": "2026-02-03 09:00:00",
      "parkingEndTime": "2026-02-03 19:00:00",
      "parkingDuration": 600,
      "originalAmount": 100.0,
      "discountAmount": 20.0,
      "payAmount": 80.0,
      "payWay": "支付宝",
      "payTime": "2026-02-03 18:55:00",
      "updateTime": "2026-02-03 18:30",
      "operator": "系统自动生成"
    }
  ];
};

/** 搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'orderNo',
      label: '订单编号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入订单编号',
      },
    },
    {
      fieldName: 'carNumber',
      label: '车牌号码',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
    },
    {
      fieldName: 'userPhone',
      label: '用户手机号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入用户手机号',
      },
    },
    {
      fieldName: 'timeRange',
      label: '时间范围',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        type: 'daterange',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
      },
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '天河城停车场', value: 'PARK001' },
          { label: '正佳广场停车场', value: 'PARK002' },
          { label: '体育中心停车场', value: 'PARK003' },
          { label: '越秀公园停车场', value: 'PARK004' },
          { label: '海珠广场停车场', value: 'PARK005' },
          { label: '白云山停车场', value: 'PARK006' },
        ],
        placeholder: '请选择车场',
        showSearch: true,
      },
      fieldName: 'lotId',
      label: '车场选择',
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
          { label: '银联支付', value: '银联支付' },
          { label: '现金支付', value: '现金支付' },
          { label: '月卡抵扣', value: '月卡抵扣' },
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
      field: 'orderNo',
      title: '订单编号',
      minWidth: 140,
      sortable: true,
      slots: { default: 'orderNo' },
    },
    {
      field: 'carNumber',
      title: '车牌号码',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'lotName',
      title: '车场名称',
      minWidth: 120,
      sortable: true,
      slots: { default: 'lotName' },
    },
    {
      field: 'parkingStartTime',
      title: '停放开始时间',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'parkingEndTime',
      title: '停放结束时间',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'parkingDuration',
      title: '停车时长(分钟)',
      minWidth: 120,
      sortable: true,
      slots: { default: 'parkingDuration' },
    },
    {
      field: 'originalAmount',
      title: '应付金额(元)',
      minWidth: 100,
      sortable: true,
      slots: { default: 'originalAmount' },
    },
    {
      field: 'discountAmount',
      title: '优惠金额(元)',
      minWidth: 100,
      sortable: true,
      slots: { default: 'discountAmount' },
    },
    {
      field: 'payAmount',
      title: '实付金额(元)',
      minWidth: 100,
      sortable: true,
      slots: { default: 'payAmount' },
    },
    {
      field: 'payWay',
      title: '支付方式',
      minWidth: 100,
      sortable: true,
      slots: { default: 'payWay' },
    },
    {
      field: 'payTime',
      title: '支付时间',
      minWidth: 150,
      sortable: true,
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
  editText: '编辑明细',
  addText: '新增明细',
  excelName: '收入明细报表',
  excelAllName: '收入明细报表.xlsx',
  total: '明细总数: 8; 今日明细: 5; 本周明细: 8;',
};
