// 报表类型字典
export const reportTypeMap = {
  order: '订单统计',
  abnormal: '异常统计',
  refund: '退款统计',
  comprehensive: '综合统计',
};

// 报表状态字典
export const reportStatusMap = {
  generating: '生成中',
  completed: '已完成',
  failed: '生成失败',
};

// 时间尺度字典
export const timeScaleMap = {
  day: '日报',
  week: '周报',
  month: '月报',
  quarter: '季报',
  halfYear: '半年报',
  year: '年报',
  custom: '自定义报表',
};

// 状态标签样式
export const reportStatusTagType = (status) => {
  const map = {
    generating: 'warning',
    completed: 'success',
    failed: 'danger',
  };
  return map[status] || 'info';
};

// 时间尺度标签样式
export const timeScaleTagType = (scale) => {
  const map = {
    day: 'primary',
    week: 'success',
    month: 'warning',
    quarter: 'info',
    halfYear: 'danger',
    year: '',
    custom: 'primary',
  };
  return map[scale] || '';
};

/** 查询表单配置（增加 reportCode 和 timeScale） */
export function useQuerySchema() {
  return [
    {
      fieldName: 'reportCode',
      label: '报表编号',
      component: 'Input',
      componentProps: { placeholder: '请输入报表编号' },
    },
    {
      fieldName: 'reportName',
      label: '报表名称',
      component: 'Input',
      componentProps: { placeholder: '请输入报表名称' },
    },
    {
      fieldName: 'reportType',
      label: '报表类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表类型',
        options: Object.entries(reportTypeMap).map(([key, label]) => ({ label, value: key })),
      },
    },
    {
      fieldName: 'reportStatus',
      label: '报表状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表状态',
        options: Object.entries(reportStatusMap).map(([key, label]) => ({ label, value: key })),
      },
    },
    {
      fieldName: 'timeScale',
      label: '时间尺度',
      component: 'Select',
      componentProps: {
        placeholder: '请选择时间尺度',
        options: Object.entries(timeScaleMap).map(([key, label]) => ({ label, value: key })),
      },
    },
    {
      fieldName: 'createTimeBegin',
      label: '生成时间开始',
      component: 'DatePicker',
      componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    },
    {
      fieldName: 'createTimeEnd',
      label: '生成时间结束',
      component: 'DatePicker',
      componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    },
  ];
}

/** 表格列配置（为 reportCode 添加 slot） */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '报表ID', minWidth: 100, sortable: true, slots: { default: 'reportId' } },
    { field: 'reportCode', title: '报表编号', minWidth: 160, showOverflow: true, slots: { default: 'reportCode' } },
    { field: 'reportName', title: '报表名称', minWidth: 180, showOverflow: true },
    { field: 'reportTypeName', title: '报表类型', minWidth: 100, sortable: true, slots: { default: 'reportType' } },
    { field: 'timeScaleName', title: '时间尺度', minWidth: 100, sortable: true, slots: { default: 'timeScale' } },
    { field: 'statPeriod', title: '统计周期', minWidth: 200, slots: { default: 'statPeriod' } },
    { field: 'createTime', title: '生成时间', minWidth: 160, sortable: true, slots: { default: 'createTime' } },
    { field: 'reportStatusName', title: '流程状态', minWidth: 100, sortable: true, slots: { default: 'reportStatus' } },
    { field: 'filterCondition', title: '筛选条件', minWidth: 150, slots: { default: 'filterCondition' } },
    { field: 'analysis', title: '同比/环比数据', minWidth: 130, slots: { default: 'analysis' } },
    { field: 'createUser', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'createUser' } },
    { title: '操作', width: 190, fixed: 'right', align: 'center', slots: { default: 'actions' } },
  ];
}

/**
 * 格式化统计周期显示（支持时间戳和日期字符串）
 */
export function formatStatPeriod(startTime, endTime) {
  if (!startTime || !endTime) return '-';
  let startDate, endDate;
  // 判断是否为纯数字字符串（Unix 时间戳，秒）
  if (/^\d+$/.test(startTime)) {
    startDate = new Date(Number(startTime) * 1000);
  } else {
    startDate = new Date(startTime);
  }
  if (/^\d+$/.test(endTime)) {
    endDate = new Date(Number(endTime) * 1000);
  } else {
    endDate = new Date(endTime);
  }
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '-';
  return `${startDate.toLocaleDateString()} 至 ${endDate.toLocaleDateString()}`;
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return '-';
  return new Date(Number(timestamp) * 1000).toLocaleString();
}

// ==================== 模拟数据（用于开发调试） ====================
export const mockReportList = [
  {
    id: 1,
    reportCode: 'RPT-20250401001',
    reportName: '2025年4月1日丰泽站日报',
    reportType: 'comprehensive',
    timeScale: 'day',
    startTime: '1711900800',
    endTime: '1711987199',
    filterCondition: '{"stationId":1,"orderStatus":"completed"}',
    reportStatus: 'completed',
    createUser: '数据分析员',
    createTime: '1711900800',
    updateTime: '1711904400',
  },
  {
    id: 2,
    reportCode: 'RPT-20250408001',
    reportName: '2025年4月第一周周报',
    reportType: 'comprehensive',
    timeScale: 'week',
    startTime: '1711900800',
    endTime: '1712505599',
    filterCondition: '{"stationId":null}',
    reportStatus: 'completed',
    createUser: '系统自动',
    createTime: '1712505600',
    updateTime: '1712512800',
  },
  {
    id: 3,
    reportCode: 'RPT-20250401002',
    reportName: '2025年3月月报',
    reportType: 'order',
    timeScale: 'month',
    startTime: '1711900800',
    endTime: '1714492799',
    filterCondition: '{"orderStatus":"completed"}',
    reportStatus: 'completed',
    createUser: '运营张三',
    createTime: '1714492800',
    updateTime: '1714496400',
  },
  {
    id: 4,
    reportCode: 'RPT-20250401003',
    reportName: '2025年第一季度季报',
    reportType: 'abnormal',
    timeScale: 'quarter',
    startTime: '1711900800',
    endTime: '1714492799',
    filterCondition: '{"abnormalType":"interrupt"}',
    reportStatus: 'completed',
    createUser: '系统自动',
    createTime: '1714492800',
    updateTime: '1714496400',
  },
  {
    id: 5,
    reportCode: 'RPT-20250401004',
    reportName: '2025年上半年半年报',
    reportType: 'refund',
    timeScale: 'halfYear',
    startTime: '1711900800',
    endTime: '1727740799',
    filterCondition: '{"refundStatus":"completed"}',
    reportStatus: 'generating',
    createUser: '系统自动',
    createTime: '1727740800',
    updateTime: '1727740800',
  },
  {
    id: 6,
    reportCode: 'RPT-20250401005',
    reportName: '2024年年报',
    reportType: 'comprehensive',
    timeScale: 'year',
    startTime: '1704067200',
    endTime: '1735689599',
    filterCondition: '{}',
    reportStatus: 'completed',
    createUser: '财务部',
    createTime: '1735689600',
    updateTime: '1735693200',
  },
  {
    id: 7,
    reportCode: 'RPT-CUS-001',
    reportName: '国庆假期商圈场站报表',
    reportType: 'comprehensive',
    timeScale: 'custom',
    startTime: '1727625600',
    endTime: '1728316799',
    filterCondition: '{"stationId":5,"timeRange":"2025-10-01~2025-10-07"}',
    reportStatus: 'completed',
    createUser: '数据分析专员',
    createTime: '1728316800',
    updateTime: '1728320400',
  },
];

export const mockReportDetail = {
  id: 1,
  reportCode: 'RPT-20250401001',
  reportName: '2025年4月1日丰泽站日报',
  reportType: 'comprehensive',
  timeScale: 'day',
  startTime: '1711900800',
  endTime: '1711987199',
  filterCondition: '{"stationId":1,"orderStatus":"completed"}',
  reportStatus: 'completed',
  createUser: '数据分析员',
  createTime: '1711900800',
  statistics: {
    totalOrderCount: 1250,
    totalTradeAmount: 62500.00,
    totalChargeAmount: 31250,
    refundCount: 18,
    abnormalOrderCount: 32,
    abnormalRate: '2.56%',
  },
  paymentDistribution: [
    { payType: '微信支付', amount: 35000 },
    { payType: '支付宝', amount: 20000 },
    { payType: '会员卡', amount: 7500 },
  ],
  stationRanking: [
    { stationName: '丰泽站', income: 32500, orderCount: 650 },
    { stationName: '洛江站', income: 18000, orderCount: 360 },
    { stationName: '鲤城站', income: 12000, orderCount: 240 },
  ],
  comparison: {
    orderCountMom: '+5.2%',
    orderCountYoy: '+12.8%',
    tradeAmountMom: '+3.1%',
    tradeAmountYoy: '+9.5%',
    abnormalRateMom: '-0.8%',
    abnormalRateYoy: '-1.2%',
  },
  trendData: [
    { period: '前一周', current: 1180, previous: 1120 },
    { period: '前两周', current: 1250, previous: 1180 },
    { period: '前三周', current: 1300, previous: 1250 },
  ],
};

export const mockChartData = {
  lineData: [
    { date: '2025-03-25', orderCount: 120, tradeAmount: 5600 },
    { date: '2025-03-26', orderCount: 135, tradeAmount: 6200 },
    { date: '2025-03-27', orderCount: 150, tradeAmount: 7100 },
    { date: '2025-03-28', orderCount: 140, tradeAmount: 6800 },
    { date: '2025-03-29', orderCount: 160, tradeAmount: 8200 },
    { date: '2025-03-30', orderCount: 170, tradeAmount: 8900 },
    { date: '2025-03-31', orderCount: 155, tradeAmount: 7500 },
  ],
  barData: [
    { date: '2025-03-25', abnormalCount: 5, refundCount: 3 },
    { date: '2025-03-26', abnormalCount: 3, refundCount: 2 },
    { date: '2025-03-27', abnormalCount: 7, refundCount: 4 },
    { date: '2025-03-28', abnormalCount: 4, refundCount: 2 },
    { date: '2025-03-29', abnormalCount: 6, refundCount: 5 },
    { date: '2025-03-30', abnormalCount: 8, refundCount: 3 },
    { date: '2025-03-31', abnormalCount: 5, refundCount: 2 },
  ],
  pieData: [
    { name: '已完成', value: 1200 },
    { name: '充电中', value: 50 },
    { name: '待支付', value: 20 },
    { name: '已取消', value: 30 },
  ],
  cardData: {
    totalOrderCount: 1300,
    totalTradeAmount: 58900,
    totalAbnormalCount: 38,
    totalRefundCount: 21,
  },
};
