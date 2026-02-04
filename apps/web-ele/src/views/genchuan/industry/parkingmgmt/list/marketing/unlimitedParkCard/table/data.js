import { maskPhone } from '#/utils/dataMask/index.js';

/** 统计数据生成函数 - 根据标签页类型生成对应统计数据 */
export const getStatsDataByTabType = (tabType) => {
  switch (tabType) {
    case '卡种配置':
      return getCardConfigStats();
    case '畅停卡订单':
      return getOrderStats();
    case '短信通知配置':
      return getSmsConfigStats();
    default:
      return {
        cards: [],
        charts: [],
      };
  }
};

/** 卡种配置统计数据 */
const getCardConfigStats = () => {
  const data = dataList();
  
  // 卡片数据
  const totalCards = data.length;
  const enabledCards = data.filter(item => item.enableStatus === '启用').length;
  const onSaleCards = data.filter(item => item.status === '在售').length;
  
  // 卡种类型占比
  const cardTypeMap = {};
  data.forEach(item => {
    cardTypeMap[item.cardType] = (cardTypeMap[item.cardType] || 0) + 1;
  });
  const cardTypeData = Object.keys(cardTypeMap).map(key => ({
    name: key,
    value: cardTypeMap[key],
  }));
  
  // 适用车场分布占比
  const parkingLotMap = {};
  data.forEach(item => {
    parkingLotMap[item.applicableParkingLot] = (parkingLotMap[item.applicableParkingLot] || 0) + 1;
  });
  const parkingLotData = Object.keys(parkingLotMap).map(key => ({
    name: key,
    value: parkingLotMap[key],
  }));
  
  // 各卡种销量排名
  const salesRankData = data
    .sort((a, b) => b.salesCount - a.salesCount);
  
  const salesRankXAxis = salesRankData.map(item => item.cardName);
  const salesRankSeries = salesRankData.map(item => item.salesCount);
  
  return {
    cards: [
      {
        title: '卡种总数',
        value: totalCards,
        color: '#409EFF',
      },
      {
        title: '启用卡种数',
        value: enabledCards,
        color: '#67C23A',
      },
      {
        title: '在售卡种数',
        value: onSaleCards,
        color: '#E6A23C',
      },
    ],
    charts: [
      {
        title: '卡种类型占比',
        type: 'pie',
        data: cardTypeData,
      },
      {
        title: '适用车场分布占比',
        type: 'pie',
        data: parkingLotData,
      },
      {
        title: '各卡种销量排名',
        type: 'bar',
        xAxis: salesRankXAxis,
        series: salesRankSeries,
      },
    ],
  };
};

/** 畅停卡订单统计数据 */
const getOrderStats = () => {
  const data = orderDataList();
  
  // 卡片数据
  const totalOrders = data.length;
  const paidOrders = data.filter(item => item.payStatus === '已支付').length;
  const refundOrders = data.filter(item => item.payStatus === '已退款').length;
  
  // 支付方式占比
  const payWayMap = {};
  data.forEach(item => {
    payWayMap[item.payWay] = (payWayMap[item.payWay] || 0) + 1;
  });
  const payWayData = Object.keys(payWayMap).map(key => ({
    name: key,
    value: payWayMap[key],
  }));
  
  // 售价占比
  const priceMap = {};
  data.forEach(item => {
    const priceRange = item.payAmount < 100 ? '<100' : item.payAmount < 500 ? '100-500' : item.payAmount < 2000 ? '500-2000' : '>2000';
    priceMap[priceRange] = (priceMap[priceRange] || 0) + 1;
  });
  const priceData = Object.keys(priceMap).map(key => ({
    name: key,
    value: priceMap[key],
  }));
  
  // 订单卡种类型对比
  const cardTypeMap = {};
  data.forEach(item => {
    cardTypeMap[item.cardType] = (cardTypeMap[item.cardType] || 0) + 1;
  });
  
  const cardTypeXAxis = Object.keys(cardTypeMap);
  const cardTypeSeries = Object.values(cardTypeMap);
  
  return {
    cards: [
      {
        title: '总订单数',
        value: totalOrders,
        color: '#409EFF',
      },
      {
        title: '已支付订单数',
        value: paidOrders,
        color: '#67C23A',
      },
      {
        title: '退款订单数',
        value: refundOrders,
        color: '#F56C6C',
      },
    ],
    charts: [
      {
        title: '各卡种支付方式占比',
        type: 'pie',
        data: payWayData,
      },
      {
        title: '售价占比',
        type: 'pie',
        data: priceData,
      },
      {
        title: '订单卡种类型对比',
        type: 'bar',
        xAxis: cardTypeXAxis,
        series: cardTypeSeries,
      },
    ],
  };
};

/** 短信通知配置统计数据 */
const getSmsConfigStats = () => {
  const data = smsConfigDataList();
  
  // 卡片数据
  const totalTemplates = data.length;
  const enabledTemplates = data.filter(item => item.enableStatus === '启用').length;
  const totalUsage = data.reduce((sum, item) => sum + item.useCount, 0);
  
  // 触发事件占比
  const eventMap = {};
  data.forEach(item => {
    eventMap[item.triggerEvent] = (eventMap[item.triggerEvent] || 0) + 1;
  });
  const eventData = Object.keys(eventMap).map(key => ({
    name: key,
    value: eventMap[key],
  }));
  
  // 适用卡种占比
  const cardMap = {};
  data.forEach(item => {
    cardMap[item.applicableCard] = (cardMap[item.applicableCard] || 0) + 1;
  });
  const cardData = Object.keys(cardMap).map(key => ({
    name: key,
    value: cardMap[key],
  }));
  
  // 模板创建趋势（按日期）
  const dateMap = {};
  data.forEach(item => {
    const date = item.createTime.split(' ')[0];
    dateMap[date] = (dateMap[date] || 0) + 1;
  });
  
  const trendXAxis = Object.keys(dateMap).sort();
  const trendSeries = trendXAxis.map(date => dateMap[date]);
  
  return {
    cards: [
      {
        title: '已配置模板总数',
        value: totalTemplates,
        color: '#409EFF',
      },
      {
        title: '启用模板数',
        value: enabledTemplates,
        color: '#67C23A',
      },
      {
        title: '模板使用总次数',
        value: totalUsage,
        color: '#E6A23C',
      },
    ],
    charts: [
      {
        title: '触发事件占比',
        type: 'pie',
        data: eventData,
      },
      {
        title: '适用卡种占比',
        type: 'pie',
        data: cardData,
      },
      {
        title: '模板创建趋势',
        type: 'line',
        xAxis: trendXAxis,
        series: trendSeries,
      },
    ],
  };
};


/** 无限停车卡表格初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      cardId: 'CARD001',
      cardName: '月度无限停车卡',
      cardType: '月度卡',
      salePrice: 199,
      validDays: 30,
      applicableParkingLot: '芗城区XX社区公共停车场',
      bindCarCount: 2,
      enableStatus: '启用',
      status: '在售',
      salesCount: 156,
      createTime: '2025-01-10 09:20:30'
    },
    {
      cardId: 'CARD002',
      cardName: '季度无限停车卡',
      cardType: '季度卡',
      salePrice: 499,
      validDays: 90,
      applicableParkingLot: '龙文区碧湖公园停车场',
      bindCarCount: 3,
      enableStatus: '启用',
      status: '在售',
      salesCount: 89,
      createTime: '2025-01-12 14:15:20'
    },
    {
      cardId: 'CARD003',
      cardName: '年度无限停车卡',
      cardType: '年度卡',
      salePrice: 1999,
      validDays: 365,
      applicableParkingLot: '龙海区石码镇便民停车场',
      bindCarCount: 5,
      enableStatus: '启用',
      status: '在售',
      salesCount: 45,
      createTime: '2025-01-15 10:05:10'
    },
    {
      cardId: 'CARD004',
      cardName: '周末无限停车卡',
      cardType: '特殊卡',
      salePrice: 99,
      validDays: 30,
      applicableParkingLot: '龙海区闽齐社区停车场',
      bindCarCount: 1,
      enableStatus: '启用',
      status: '在售',
      salesCount: 234,
      createTime: '2025-01-18 08:30:45'
    },
    {
      cardId: 'CARD005',
      cardName: '企业无限停车卡',
      cardType: '企业卡',
      salePrice: 2999,
      validDays: 365,
      applicableParkingLot: '芗城区江滨路生态停车场',
      bindCarCount: 10,
      enableStatus: '启用',
      status: '在售',
      salesCount: 12,
      createTime: '2025-01-20 16:40:15'
    },
    {
      cardId: 'CARD006',
      cardName: '夜间无限停车卡',
      cardType: '特殊卡',
      salePrice: 149,
      validDays: 30,
      applicableParkingLot: '龙文区万达商圈停车场',
      bindCarCount: 2,
      enableStatus: '禁用',
      status: '下架',
      salesCount: 78,
      createTime: '2025-01-22 11:10:30'
    },
    {
      cardId: 'CARD007',
      cardName: '学生无限停车卡',
      cardType: '特殊卡',
      salePrice: 149,
      validDays: 30,
      applicableParkingLot: '长泰区武安镇公共停车场',
      bindCarCount: 1,
      enableStatus: '启用',
      status: '在售',
      salesCount: 345,
      createTime: '2025-01-25 13:25:40'
    },
    {
      cardId: 'CARD008',
      cardName: '家庭无限停车卡',
      cardType: '家庭卡',
      salePrice: 299,
      validDays: 60,
      applicableParkingLot: '漳浦县绥安镇便民停车场',
      bindCarCount: 4,
      enableStatus: '启用',
      status: '在售',
      salesCount: 67,
      createTime: '2025-01-28 09:50:25'
    },
    {
      cardId: 'CARD009',
      cardName: '老年无限停车卡',
      cardType: '特殊卡',
      salePrice: 99,
      validDays: 30,
      applicableParkingLot: '芗城区巷口街道停车场',
      bindCarCount: 1,
      enableStatus: '禁用',
      status: '下架',
      salesCount: 45,
      createTime: '2025-02-01 15:15:10'
    },
    {
      cardId: 'CARD010',
      cardName: '商务无限停车卡',
      cardType: '商务卡',
      salePrice: 499,
      validDays: 30,
      applicableParkingLot: '龙文区蓝田街道停车场',
      bindCarCount: 3,
      enableStatus: '启用',
      status: '已过期',
      salesCount: 56,
      createTime: '2025-02-05 10:30:50'
    },
    {
      cardId: 'CARD011',
      cardName: 'VIP无限停车卡',
      cardType: 'VIP卡',
      salePrice: 5999,
      validDays: 365,
      applicableParkingLot: '全市通用',
      bindCarCount: 8,
      enableStatus: '启用',
      status: '在售',
      salesCount: 8,
      createTime: '2025-02-08 14:20:15'
    },
    {
      cardId: 'CARD012',
      cardName: '临时无限停车卡',
      cardType: '临时卡',
      salePrice: 49,
      validDays: 7,
      applicableParkingLot: '芗城区东铺头街道停车场',
      bindCarCount: 1,
      enableStatus: '启用',
      status: '在售',
      salesCount: 123,
      createTime: '2025-02-10 09:40:30'
    }
  ];
};

/** 无限停车卡表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'cardId',
      label: '卡ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入卡ID',
      },
      rules: 'required'
    },
    {
      fieldName: 'cardName',
      label: '卡种名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入卡种名称'
      },
      rules: 'required'
    },
    {
      fieldName: 'cardType',
      label: '卡种类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择卡种类型',
        options: [
          { label: '月度卡', value: '月度卡' },
          { label: '季度卡', value: '季度卡' },
          { label: '年度卡', value: '年度卡' },
          { label: '特殊卡', value: '特殊卡' },
          { label: '企业卡', value: '企业卡' },
          { label: '家庭卡', value: '家庭卡' },
          { label: '商务卡', value: '商务卡' },
          { label: 'VIP卡', value: 'VIP卡' },
          { label: '临时卡', value: '临时卡' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'salePrice',
      label: '售价',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入售价',
        min: 0,
        precision: 2
      },
      rules: 'required'
    },
    {
      fieldName: 'validDays',
      label: '有效天数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入有效天数',
        min: 1
      },
      rules: 'required'
    },
    {
      fieldName: 'applicableParkingLot',
      label: '适用车场',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用车场'
      },
      rules: 'required'
    },
    {
      fieldName: 'bindCarCount',
      label: '可绑定车牌数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入可绑定车牌数',
        min: 1
      },
      rules: 'required'
    },
    {
      fieldName: 'enableStatus',
      label: '启用状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择启用状态',
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '在售', value: '在售' },
          { label: '下架', value: '下架' },
          { label: '已过期', value: '已过期' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'salesCount',
      label: '销量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入销量',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    }
  ];
}

/** 无限停车卡表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'cardId',
      title: '卡ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'cardId' },
    },
    {
      field: 'cardName',
      title: '卡种名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'cardType',
      title: '卡种类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'cardType' },
    },
    {
      field: 'salePrice',
      title: '售价',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'validDays',
      title: '有效天数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'applicableParkingLot',
      title: '适用车场',
      minWidth: 180,
      sortable: true,
      slots: { default: 'applicableParkingLot' },
    },
    {
      field: 'bindCarCount',
      title: '可绑定车牌数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'enableStatus',
      title: '启用状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'enableStatus' },
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'salesCount',
      title: '销量',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑无限停车卡',
  addText: '新增无限停车卡',
  // 导出Excel相关文本
  excelName: '无限停车卡列表',
  excelAllName: '无限停车卡数据.xlsx',
  // 统计总计文本
  total: ' 总计: 无限停车卡种类12;总销量:1874;启用卡种10;禁用卡种2',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'cardId', label: '卡ID' },
  { key: 'cardName', label: '卡种名称' },
  { key: 'cardType', label: '卡种类型' },
  { key: 'salePrice', label: '售价' },
  { key: 'validDays', label: '有效天数' },
  { key: 'applicableParkingLot', label: '适用车场' },
  { key: 'bindCarCount', label: '可绑定车牌数' },
  { key: 'enableStatus', label: '启用状态' },
  { key: 'status', label: '状态' },
  { key: 'salesCount', label: '销量' },
  { key: 'createTime', label: '创建时间' }
];

/** 状态标签类型映射 */
export const getStatusTagType = (status) => {
  switch (status) {
    case '在售':
      return 'success';
    case '启用':
      return 'success';
    case '下架':
      return 'warning';
    case '禁用':
      return 'danger';
    case '已过期':
      return 'danger';
    default:
      return 'info';
  }
};

/** 畅停卡订单表格初始数据 - 按指定字段生成 */
export const orderDataList = () => {
  return [
    {
      orderNo: 'ORDER001',
      userName: '张三',
      cardName: '月度无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-01-31 23:59:59',
      cardType: '月度卡',
      payStatus: '已支付',
      userPhone: '13800138001',
      payWay: '微信支付',
      createTime: '2025-01-01 10:00:00',
      orderStatus: '已激活',
      payAmount: 199
    },
    {
      orderNo: 'ORDER002',
      userName: '李四',
      cardName: '季度无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-03-31 23:59:59',
      cardType: '季度卡',
      payStatus: '已支付',
      userPhone: '13800138002',
      payWay: '支付宝',
      createTime: '2025-01-02 11:00:00',
      orderStatus: '已激活',
      payAmount: 499
    },
    {
      orderNo: 'ORDER003',
      userName: '王五',
      cardName: '年度无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-12-31 23:59:59',
      cardType: '年度卡',
      payStatus: '已支付',
      userPhone: '13800138003',
      payWay: '银行卡',
      createTime: '2025-01-03 12:00:00',
      orderStatus: '已激活',
      payAmount: 1999
    },
    {
      orderNo: 'ORDER004',
      userName: '赵六',
      cardName: '周末无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-01-31 23:59:59',
      cardType: '特殊卡',
      payStatus: '未支付',
      userPhone: '13800138004',
      payWay: '微信支付',
      createTime: '2025-01-04 13:00:00',
      orderStatus: '待激活',
      payAmount: 99
    },
    {
      orderNo: 'ORDER005',
      userName: '孙七',
      cardName: '企业无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-12-31 23:59:59',
      cardType: '企业卡',
      payStatus: '已支付',
      userPhone: '13800138005',
      payWay: '银行转账',
      createTime: '2025-01-05 14:00:00',
      orderStatus: '已取消',
      payAmount: 2999
    },
    {
      orderNo: 'ORDER006',
      userName: '周八',
      cardName: '夜间无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-01-31 23:59:59',
      cardType: '特殊卡',
      payStatus: '已退款',
      userPhone: '13800138006',
      payWay: '微信支付',
      createTime: '2025-01-06 15:00:00',
      orderStatus: '已过期',
      payAmount: 149
    },
    {
      orderNo: 'ORDER007',
      userName: '吴九',
      cardName: '学生无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-01-31 23:59:59',
      cardType: '特殊卡',
      payStatus: '已支付',
      userPhone: '13800138007',
      payWay: '支付宝',
      createTime: '2025-01-07 16:00:00',
      orderStatus: '已激活',
      payAmount: 149
    },
    {
      orderNo: 'ORDER008',
      userName: '郑十',
      cardName: '家庭无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-02-28 23:59:59',
      cardType: '家庭卡',
      payStatus: '已支付',
      userPhone: '13800138008',
      payWay: '微信支付',
      createTime: '2025-01-08 17:00:00',
      orderStatus: '已激活',
      payAmount: 299
    },
    {
      orderNo: 'ORDER009',
      userName: '王十一',
      cardName: '老年无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-01-31 23:59:59',
      cardType: '特殊卡',
      payStatus: '已支付',
      userPhone: '13800138009',
      payWay: '支付宝',
      createTime: '2025-01-09 18:00:00',
      orderStatus: '已激活',
      payAmount: 99
    },
    {
      orderNo: 'ORDER010',
      userName: '赵十二',
      cardName: '商务无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-01-31 23:59:59',
      cardType: '商务卡',
      payStatus: '已支付',
      userPhone: '13800138010',
      payWay: '微信支付',
      createTime: '2025-01-10 19:00:00',
      orderStatus: '已激活',
      payAmount: 499
    },
    {
      orderNo: 'ORDER011',
      userName: '孙十三',
      cardName: 'VIP无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-12-31 23:59:59',
      cardType: 'VIP卡',
      payStatus: '已支付',
      userPhone: '13800138011',
      payWay: '银行转账',
      createTime: '2025-01-11 20:00:00',
      orderStatus: '已激活',
      payAmount: 5999
    },
    {
      orderNo: 'ORDER012',
      userName: '周十四',
      cardName: '临时无限停车卡',
      createTimeRange: '2025-01-01 00:00:00 - 2025-01-07 23:59:59',
      cardType: '临时卡',
      payStatus: '已支付',
      userPhone: '13800138012',
      payWay: '微信支付',
      createTime: '2025-01-12 21:00:00',
      orderStatus: '已过期',
      payAmount: 49
    }
  ];
};

/** 畅停卡订单表单配置（包含所有指定字段） */
export function useOrderFormSchema() {
  return [
    {
      fieldName: 'orderNo',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
      },
      rules: 'required'
    },
    {
      fieldName: 'userName',
      label: '用户姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户姓名'
      },
      rules: 'required'
    },
    {
      fieldName: 'cardName',
      label: '卡种名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入卡种名称'
      },
      rules: 'required'
    },
    {
      fieldName: 'createTimeRange',
      label: '时间范围',
      component: 'Input',
      componentProps: {
        placeholder: '请输入时间范围'
      },
      rules: 'required'
    },
    {
      fieldName: 'cardType',
      label: '卡种类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择卡种类型',
        options: [
          { label: '月度卡', value: '月度卡' },
          { label: '季度卡', value: '季度卡' },
          { label: '年度卡', value: '年度卡' },
          { label: '特殊卡', value: '特殊卡' },
          { label: '企业卡', value: '企业卡' },
          { label: '家庭卡', value: '家庭卡' },
          { label: '商务卡', value: '商务卡' },
          { label: 'VIP卡', value: 'VIP卡' },
          { label: '临时卡', value: '临时卡' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'payStatus',
      label: '支付状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付状态',
        options: [
          { label: '已支付', value: '已支付' },
          { label: '未支付', value: '未支付' },
          { label: '已退款', value: '已退款' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'userPhone',
      label: '用户手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户手机号'
      },
      rules: 'required'
    },
    {
      fieldName: 'payWay',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付方式',
        options: [
          { label: '微信支付', value: '微信支付' },
          { label: '支付宝', value: '支付宝' },
          { label: '银行卡', value: '银行卡' },
          { label: '银行转账', value: '银行转账' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'orderStatus',
      label: '订单状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择订单状态',
        options: [
          { label: '待激活', value: '待激活' },
          { label: '已激活', value: '已激活' },
          { label: '已过期', value: '已过期' },
          { label: '已取消', value: '已取消' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'payAmount',
      label: '售价',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入售价',
        min: 0,
        precision: 2
      },
      rules: 'required'
    }
  ];
}

/** 畅停卡订单表格列配置 */
export function useOrderGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'orderNo',
      title: '订单编号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'orderNo' },
    },
    {
      field: 'userName',
      title: '用户姓名',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'cardName',
      title: '卡种名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'createTimeRange',
      title: '时间范围',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'cardType',
      title: '卡种类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'cardType' },
    },
    {
      field: 'payStatus',
      title: '支付状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'payStatus' },
    },
    {
      field: 'userPhone',
      title: '用户手机号',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return maskPhone(cellValue);
      },
    },
    {
      field: 'payWay',
      title: '支付方式',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'orderStatus',
      title: '订单状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'orderStatus' },
    },
    {
      field: 'payAmount',
      title: '售价',
      minWidth: 100,
      sortable: true,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const orderTextObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑畅停卡订单',
  addText: '新增畅停卡订单',
  // 导出Excel相关文本
  excelName: '畅停卡订单列表',
  excelAllName: '畅停卡订单数据.xlsx',
  // 统计总计文本
  total: ' 总计: 畅停卡订单12;总金额:13598;已激活订单12;',
};

/** 畅停卡订单详情抽屉字段配置 */
export const orderDetailFields = [
  { key: 'orderNo', label: '订单编号' },
  { key: 'userName', label: '用户姓名' },
  { key: 'cardName', label: '卡种名称' },
  { key: 'createTimeRange', label: '时间范围' },
  { key: 'cardType', label: '卡种类型' },
  { key: 'payStatus', label: '支付状态' },
  { key: 'userPhone', label: '用户手机号', formatter: maskPhone },
  { key: 'payWay', label: '支付方式' },
  { key: 'createTime', label: '创建时间' },
  { key: 'orderStatus', label: '订单状态' },
  { key: 'payAmount', label: '售价' }
];

/** 短信通知配置表格初始数据 */
export const smsConfigDataList = () => {
  return [
    {
      templateId: 'SMS001',
      templateName: '卡激活通知',
      triggerEvent: '卡激活',
      templateContent: '尊敬的用户，您的畅停卡已成功激活，有效期至：{expireDate}，祝您使用愉快！',
      applicableCard: '月度无限停车卡',
      enableStatus: '启用',
      useCount: 156,
      createTime: '2025-01-01 10:00:00'
    },
    {
      templateId: 'SMS002',
      templateName: '卡到期提醒',
      triggerEvent: '卡到期',
      templateContent: '尊敬的用户，您的畅停卡将于3天后到期，请及时续费，以免影响您的正常使用！',
      applicableCard: '季度无限停车卡',
      enableStatus: '启用',
      useCount: 89,
      createTime: '2025-01-02 11:00:00'
    },
    {
      templateId: 'SMS003',
      templateName: '订单支付成功',
      triggerEvent: '订单支付',
      templateContent: '尊敬的用户，您的订单{orderNo}已支付成功，卡种：{cardName}，金额：{amount}元，感谢您的购买！',
      applicableCard: '年度无限停车卡',
      enableStatus: '启用',
      useCount: 234,
      createTime: '2025-01-03 12:00:00'
    },
    {
      templateId: 'SMS004',
      templateName: '订单取消通知',
      triggerEvent: '订单取消',
      templateContent: '尊敬的用户，您的订单{orderNo}已取消，如有疑问，请联系客服。',
      applicableCard: '周末无限停车卡',
      enableStatus: '启用',
      useCount: 45,
      createTime: '2025-01-04 13:00:00'
    },
    {
      templateId: 'SMS005',
      templateName: '退款成功通知',
      triggerEvent: '退款成功',
      templateContent: '尊敬的用户，您的退款申请已处理成功，金额：{amount}元，预计1-3个工作日到账，请查收。',
      applicableCard: '夜间无限停车卡',
      enableStatus: '启用',
      useCount: 23,
      createTime: '2025-01-05 14:00:00'
    },
    {
      templateId: 'SMS006',
      templateName: '新卡种上线通知',
      triggerEvent: '新卡种上线',
      templateContent: '尊敬的用户，我们推出了新的{cardName}，限时优惠，快来体验吧！',
      applicableCard: '学生无限停车卡',
      enableStatus: '启用',
      useCount: 67,
      createTime: '2025-01-06 15:00:00'
    },
    {
      templateId: 'SMS007',
      templateName: '活动促销通知',
      triggerEvent: '活动促销',
      templateContent: '尊敬的用户，限时促销活动开始了，{cardName}享受{discount}折优惠，数量有限，先到先得！',
      applicableCard: '家庭无限停车卡',
      enableStatus: '启用',
      useCount: 123,
      createTime: '2025-01-07 16:00:00'
    },
    {
      templateId: 'SMS008',
      templateName: '卡状态变更通知',
      triggerEvent: '卡状态变更',
      templateContent: '尊敬的用户，您的{cardName}状态已变更为{status}，如有疑问，请联系客服。',
      applicableCard: '老年无限停车卡',
      enableStatus: '禁用',
      useCount: 34,
      createTime: '2025-01-08 17:00:00'
    },
    {
      templateId: 'SMS009',
      templateName: '绑定车牌提醒',
      triggerEvent: '绑定车牌',
      templateContent: '尊敬的用户，您已成功绑定车牌{plateNumber}到{cardName}，请确认信息是否正确。',
      applicableCard: '商务无限停车卡',
      enableStatus: '启用',
      useCount: 56,
      createTime: '2025-01-09 18:00:00'
    },
    {
      templateId: 'SMS010',
      templateName: '解绑车牌提醒',
      triggerEvent: '解绑车牌',
      templateContent: '尊敬的用户，您已成功解绑车牌{plateNumber}，如有疑问，请联系客服。',
      applicableCard: 'VIP无限停车卡',
      enableStatus: '启用',
      useCount: 12,
      createTime: '2025-01-10 19:00:00'
    },
    {
      templateId: 'SMS011',
      templateName: '系统维护通知',
      triggerEvent: '系统维护',
      templateContent: '尊敬的用户，系统将于{maintenanceTime}进行维护，届时可能影响您的使用，敬请谅解。',
      applicableCard: '临时无限停车卡',
      enableStatus: '启用',
      useCount: 78,
      createTime: '2025-01-11 20:00:00'
    }
  ];
};

/** 短信通知配置表单配置 */
export function useSmsConfigFormSchema() {
  return [
    {
      fieldName: 'templateId',
      label: '模板ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入模板ID'
      },
      rules: 'required'
    },
    {
      fieldName: 'templateName',
      label: '模板名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入模板名称'
      },
      rules: 'required'
    },
    {
      fieldName: 'triggerEvent',
      label: '触发事件',
      component: 'Select',
      componentProps: {
        placeholder: '请选择触发事件',
        options: [
          { label: '卡激活', value: '卡激活' },
          { label: '卡到期', value: '卡到期' },
          { label: '订单支付', value: '订单支付' },
          { label: '订单取消', value: '订单取消' },
          { label: '退款成功', value: '退款成功' },
          { label: '新卡种上线', value: '新卡种上线' },
          { label: '活动促销', value: '活动促销' },
          { label: '卡状态变更', value: '卡状态变更' },
          { label: '绑定车牌', value: '绑定车牌' },
          { label: '解绑车牌', value: '解绑车牌' },
          { label: '系统维护', value: '系统维护' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'templateContent',
      label: '模板内容',
      component: 'Input',
      componentProps: {
        placeholder: '请输入模板内容',
        type: 'textarea',
        rows: 4
      },
      rules: 'required'
    },
    {
      fieldName: 'applicableCard',
      label: '适用卡种',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用卡种'
      },
      rules: 'required'
    },
    {
      fieldName: 'enableStatus',
      label: '启用状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择启用状态',
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'useCount',
      label: '使用次数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入使用次数',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    }
  ];
}

/** 短信通知配置表格列配置 */
export function useSmsConfigGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'templateId',
      title: '模板ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'templateId' },
    },
    {
      field: 'templateName',
      title: '模板名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'triggerEvent',
      title: '触发事件',
      minWidth: 120,
      sortable: true,
      slots: { default: 'triggerEvent' },
    },
    {
      field: 'templateContent',
      title: '模板内容',
      minWidth: 250,
      sortable: true,
    },
    {
      field: 'applicableCard',
      title: '适用卡种',
      minWidth: 150,
      sortable: true,
      slots: { default: 'applicableCard' },
    },
    {
      field: 'enableStatus',
      title: '启用状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'enableStatus' },
    },
    {
      field: 'useCount',
      title: '使用次数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 短信通知配置详情抽屉字段配置 */
export const smsConfigDetailFields = [
  { key: 'templateId', label: '模板ID' },
  { key: 'templateName', label: '模板名称' },
  { key: 'triggerEvent', label: '触发事件' },
  { key: 'templateContent', label: '模板内容' },
  { key: 'applicableCard', label: '适用卡种' },
  { key: 'enableStatus', label: '启用状态' },
  { key: 'useCount', label: '使用次数' },
  { key: 'createTime', label: '创建时间' }
];

/** 短信通知配置文本对象 */
export const smsConfigTextObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑短信通知模板',
  addText: '新增短信通知模板',
  // 导出Excel相关文本
  excelName: '短信通知模板列表',
  excelAllName: '短信通知模板数据.xlsx',
  // 统计总计文本
  total: ' 总计: 短信通知模板11;启用模板10;禁用模板1;',
};

/** 畅停卡订单状态标签类型映射 */
export const getOrderStatusTagType = (status) => {
  switch (status) {
    case '已支付':
      return 'success';
    case '未支付':
      return 'warning';
    case '已退款':
      return 'danger';
    case '待激活':
      return 'warning';
    case '已激活':
      return 'success';
    case '已过期':
      return 'danger';
    case '已取消':
      return 'info';
    default:
      return 'info';
  }
};


