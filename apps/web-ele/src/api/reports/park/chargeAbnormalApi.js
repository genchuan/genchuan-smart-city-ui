// 文件: chargeAbnormalApi.js
import { ElMessage } from 'element-plus';

// 区域映射关系 - 对应sys_area.area_code
const regionMap = {
  'xiangcheng': '芗城区',
  'longwen': '龙文区',
  'longhai': '龙海区',
  'zhangpu': '漳浦县',
  'yunxiao': '云霄县',
  'zhaoan': '诏安县',
  'dongshan': '东山县',
  'nanjing': '南靖县',
  'pinghe': '平和县',
  'huaan': '华安县'
};

// 停车场映射关系 - 对应park_lot.lot_id
const parkingMap = {
  'park001': '漳州万达广场停车场',
  'park002': '芗城政府路侧停车场',
  'park003': '龙文区体育中心停车场',
  'park004': '龙海区商业城停车场',
  'park005': '漳浦县汽车站停车场',
  'park006': '云霄县中心停车场',
  'park007': '诏安县人民广场停车场',
  'park008': '东山县旅游中心停车场',
  'park009': '南靖县土楼停车场',
  'park010': '平和县商贸城停车场'
};

// 异常类型映射关系 - 对应park_charge_abnormal.abnormal_type
const abnormalTypeMap = {
  'overcharge': '多收费',
  'undercharge': '少收费',
  'duplicate': '重复收费',
  'system': '系统错误',
  'manual': '人工操作错误',
  'timeout': '超时计费',
  'discount': '优惠异常',
  'payment': '支付异常'
};

// 处置状态映射关系 - 对应park_charge_abnormal.disposal_status
const disposalStatusMap = {
  'pending': '待处理',
  'processing': '处理中',
  'resolved': '已处理',
  'closed': '已关闭',
  'rejected': '已驳回',
  'reviewing': '复核中'
};

// 处理结果映射关系 - 对应park_charge_abnormal.disposal_result
const disposalResultMap = {
  'refund': '已退款',
  'compensate': '已补偿',
  'corrected': '已纠正',
  'ignored': '已忽略',
  'pending': '待用户确认',
  'part_refund': '部分退款',
  'voucher': '优惠券补偿'
};

// 辅助函数：生成收费异常模拟数据
function generateChargeAbnormalData() {
  const data = [];
  const plateNumbers = [
    '闽E12345', '闽E23456', '闽E34567', '闽E45678', '闽E56789',
    '闽D12345', '闽D23456', '闽D34567', '闽D45678', '闽D56789',
    '闽F12345', '闽F23456', '闽F34567', '闽F45678', '闽F56789'
  ];

  const regionCodes = Object.keys(regionMap);
  const parkingIds = Object.keys(parkingMap);
  const abnormalTypeCodes = Object.keys(abnormalTypeMap);
  const disposalStatusCodes = Object.keys(disposalStatusMap);
  const disposalResultCodes = Object.keys(disposalResultMap);
  const paymentTypes = ['微信支付', '支付宝', '现金支付', '刷卡支付', '会员支付'];

  for (let i = 1; i <= 60; i++) {
    const randomDate = new Date(2023, 11, Math.floor(Math.random() * 30) + 1);
    const randomTime = `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;

    const regionCode = regionCodes[Math.floor(Math.random() * regionCodes.length)];
    const parkingId = parkingIds[Math.floor(Math.random() * parkingIds.length)];
    const abnormalTypeCode = abnormalTypeCodes[Math.floor(Math.random() * abnormalTypeCodes.length)];
    const disposalStatusCode = disposalStatusCodes[Math.floor(Math.random() * disposalStatusCodes.length)];

    const hasDisposal = disposalStatusCode === 'resolved' || disposalStatusCode === 'closed';
    const abnormalAmount = Math.floor(Math.random() * 50) + 1;
    const actualAmount = Math.floor(Math.random() * 100) + 20;

    data.push({
      abnormalId: `ABN${String(i).padStart(6, '0')}`,
      orderNo: `ORDER${String(10000 + i)}`,
      carNumber: plateNumbers[Math.floor(Math.random() * plateNumbers.length)],
      regionCode: regionCode,
      regionName: regionMap[regionCode],
      parkingId: parkingId,
      parkingName: parkingMap[parkingId],
      abnormalTime: `${randomDate.toISOString().split('T')[0]} ${randomTime}`,
      abnormalTypeCode: abnormalTypeCode,
      abnormalType: abnormalTypeMap[abnormalTypeCode],
      abnormalReason: getAbnormalReason(Math.floor(Math.random() * 8)),
      abnormalAmount: abnormalAmount,
      actualAmount: actualAmount,
      shouldAmount: actualAmount + (Math.random() > 0.5 ? -abnormalAmount : abnormalAmount),
      disposalStatusCode: disposalStatusCode,
      disposalStatus: disposalStatusMap[disposalStatusCode],
      disposalResultCode: hasDisposal ?
        disposalResultCodes[Math.floor(Math.random() * disposalResultCodes.length)] :
        null,
      disposalResult: hasDisposal ?
        disposalResultMap[disposalResultCodes[Math.floor(Math.random() * disposalResultCodes.length)]] :
        null,
      severityLevel: ['高', '中', '低'][Math.floor(Math.random() * 3)],
      paymentType: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
      customerComplaint: Math.random() > 0.7,
      complaintTime: Math.random() > 0.7 ?
        new Date(randomDate.getTime() + Math.random() * 86400000).toISOString().replace('T', ' ').substr(0, 19) :
        null,
      operator: hasDisposal ? ['张三', '李四', '王五'][Math.floor(Math.random() * 3)] : null,
      workOrderId: hasDisposal ? `WO${String(20000 + i)}` : null
    });
  }

  return data;
}

// 辅助函数：生成异常原因
function getAbnormalReason(type) {
  const reasons = [
    '系统计费规则错误',
    '人工录入信息错误',
    '设备识别错误导致时间计算错误',
    '网络延迟导致重复计费',
    '优惠券使用异常未生效',
    '支付系统接口异常',
    '车牌识别错误导致匹配错误',
    '节假日收费标准未正确应用'
  ];
  return reasons[type] || '未知原因';
}

// 辅助函数：计算异常趋势数据
function calculateAbnormalTrend(data) {
  const trend = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayData = data.filter(item => {
      const itemDate = item.abnormalTime.split(' ')[0];
      return itemDate === dateStr;
    });

    trend.push({
      date: dateStr,
      count: dayData.length,
      resolved: dayData.filter(item => item.disposalStatus === '已处理' || item.disposalStatus === '已关闭').length,
      amount: dayData.reduce((sum, item) => sum + item.abnormalAmount, 0)
    });
  }

  return trend;
}

// 辅助函数：计算异常类型分布
function calculateAbnormalTypeDistribution(data) {
  const distribution = {};

  data.forEach(item => {
    if (!distribution[item.abnormalType]) {
      distribution[item.abnormalType] = 0;
    }
    distribution[item.abnormalType]++;
  });

  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value
  }));
}

// 辅助函数：计算处置状态分布
function calculateDisposalStatusDistribution(data) {
  const distribution = {};

  data.forEach(item => {
    if (!distribution[item.disposalStatus]) {
      distribution[item.disposalStatus] = 0;
    }
    distribution[item.disposalStatus]++;
  });

  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value
  }));
}

// 辅助函数：计算区域异常数对比
function calculateRegionAbnormalComparison(data) {
  const comparison = {};

  data.forEach(item => {
    if (!comparison[item.regionName]) {
      comparison[item.regionName] = 0;
    }
    comparison[item.regionName]++;
  });

  return Object.entries(comparison)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// 辅助函数：计算异常金额统计
function calculateAmountStatistics(data) {
  const totalAbnormalAmount = data.reduce((sum, item) => sum + item.abnormalAmount, 0);
  const totalActualAmount = data.reduce((sum, item) => sum + item.actualAmount, 0);
  const totalShouldAmount = data.reduce((sum, item) => sum + item.shouldAmount, 0);
  const avgAbnormalAmount = data.length > 0 ? totalAbnormalAmount / data.length : 0;

  return {
    totalAbnormalAmount,
    totalActualAmount,
    totalShouldAmount,
    avgAbnormalAmount: Math.round(avgAbnormalAmount * 100) / 100
  };
}

/**
 * 获取收费异常报表
 */
export const getChargeAbnormalReport = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const {
    startDate = '2023-12-01',
    endDate = '2023-12-31',
    orderNo = '',
    carNumber = '',
    region = '',
    abnormalType = '',
    disposalStatus = '',
    page = 1,
    pageSize = 10
  } = params;

  const allData = generateChargeAbnormalData();

  let filteredData = allData.filter(item => {
    const itemDate = item.abnormalTime.split(' ')[0];
    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;
    if (orderNo && !item.orderNo.includes(orderNo)) return false;
    if (carNumber && !item.carNumber.includes(carNumber)) return false;
    if (region && item.regionCode !== region) return false;
    if (abnormalType && item.abnormalTypeCode !== abnormalType) return false;
    if (disposalStatus && item.disposalStatusCode !== disposalStatus) return false;
    return true;
  });

  const total = filteredData.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const trendData = calculateAbnormalTrend(filteredData);
  const abnormalTypeDistribution = calculateAbnormalTypeDistribution(filteredData);
  const disposalStatusDistribution = calculateDisposalStatusDistribution(filteredData);
  const regionAbnormalComparison = calculateRegionAbnormalComparison(filteredData);
  const amountStats = calculateAmountStatistics(filteredData);

  const totalCount = filteredData.length;
  const pendingCount = filteredData.filter(item => item.disposalStatus === '待处理').length;
  const resolvedCount = filteredData.filter(item => item.disposalStatus === '已处理').length;
  const completionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;
  const correctionSuccessRate = resolvedCount > 0 ? Math.round((resolvedCount * 0.8) / totalCount * 100) : 0;

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
    summary: {
      totalCount,
      pendingCount,
      resolvedCount,
      totalAbnormalAmount: amountStats.totalAbnormalAmount,
      totalActualAmount: amountStats.totalActualAmount,
      completionRate,
      correctionSuccessRate
    },
    trendData,
    abnormalTypeDistribution,
    disposalStatusDistribution,
    regionAbnormalComparison,
    amountStats,
    generatedAt: new Date().toISOString()
  };
};

/**
 * 导出收费异常报表
 */
export const exportChargeAbnormalReport = async (params) => {
  try {
    const data = await getChargeAbnormalReport({
      ...params,
      page: 1,
      pageSize: 10000
    });

    const headers = [
      '异常ID', '订单编号', '车牌号码', '车场名称', '行政区域', '异常时间',
      '异常类型', '异常原因', '异常金额(元)', '实际金额(元)', '应缴金额(元)',
      '支付方式', '严重程度', '处置状态', '处理结果', '客户投诉', '投诉时间', '处理人', '关联工单'
    ];

    const csvRows = data.data.map((item) => [
      item.abnormalId,
      item.orderNo,
      item.carNumber,
      item.parkingName,
      item.regionName,
      item.abnormalTime,
      item.abnormalType,
      item.abnormalReason,
      item.abnormalAmount,
      item.actualAmount,
      item.shouldAmount || '',
      item.paymentType,
      item.severityLevel,
      item.disposalStatus,
      item.disposalResult || '',
      item.customerComplaint ? '是' : '否',
      item.complaintTime || '',
      item.operator || '',
      item.workOrderId || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map((row) => row.join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `收费异常报表_${params.startDate || '开始'}_${params.endDate || '结束'}_${new Date().getTime()}.csv`;

    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    ElMessage.success(`导出成功，共${data.total}条记录`);

    return {
      success: true,
      message: '导出成功',
      filename: link.download,
      totalRecords: data.total,
      exportTime: new Date().toISOString()
    };
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error(`导出失败: ${error.message}`);
    throw error;
  }
};

/**
 * 获取收费异常详情
 */
export const getChargeAbnormalDetail = async (abnormalId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allData = generateChargeAbnormalData();
  const detail = allData.find(item => item.abnormalId === abnormalId);

  if (!detail) {
    throw new Error('异常记录不存在');
  }

  const orderDetail = {
    orderNo: detail.orderNo,
    plateNumber: detail.carNumber,
    parkingName: detail.parkingName,
    regionName: detail.regionName,
    enterTime: new Date(Date.now() - 7200000).toISOString().replace('T', ' ').substr(0, 19),
    exitTime: new Date(Date.now() - 3600000).toISOString().replace('T', ' ').substr(0, 19),
    duration: '2小时',
    basicAmount: detail.shouldAmount || detail.actualAmount + detail.abnormalAmount,
    discountAmount: 0,
    paidAmount: detail.actualAmount,
    paymentType: detail.paymentType,
    paymentTime: detail.abnormalTime,
    paymentStatus: '已支付',
    paymentChannel: detail.paymentType === '微信支付' ? '微信小程序' :
      detail.paymentType === '支付宝' ? '支付宝APP' : '现场支付',
    paymentTransactionNo: `TX${detail.orderNo}${Math.floor(Math.random() * 1000)}`,
    receiptNo: `RC${detail.orderNo}`
  };

  const correctionRecords = detail.disposalResult ? [
    {
      id: 1,
      time: new Date(detail.abnormalTime).getTime() + 1800000,
      operator: '系统自动',
      action: '异常检测',
      description: `检测到${detail.abnormalType}异常`,
      result: '已创建纠错任务'
    },
    {
      id: 2,
      time: new Date(detail.abnormalTime).getTime() + 3600000,
      operator: '复核员',
      action: '手动复核',
      description: '确认异常属实',
      result: '复核通过'
    },
    {
      id: 3,
      time: new Date(detail.abnormalTime).getTime() + 5400000,
      operator: detail.operator || '财务员',
      action: '处理异常',
      description: detail.disposalResult,
      result: '处理完成'
    }
  ] : [
    {
      id: 1,
      time: new Date(detail.abnormalTime).getTime() + 1800000,
      operator: '系统自动',
      action: '异常检测',
      description: `检测到${detail.abnormalType}异常`,
      result: '已创建纠错任务'
    }
  ];

  return {
    detail,
    orderDetail,
    correctionRecords,
    generatedAt: new Date().toISOString()
  };
};

/**
 * 获取筛选选项
 */
export const getChargeAbnormalFilterOptions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    regions: [
      { value: '', label: '全部区域' },
      { value: 'xiangcheng', label: '芗城区' },
      { value: 'longwen', label: '龙文区' },
      { value: 'longhai', label: '龙海区' },
      { value: 'zhangpu', label: '漳浦县' },
      { value: 'yunxiao', label: '云霄县' },
      { value: 'zhaoan', label: '诏安县' },
      { value: 'dongshan', label: '东山县' },
      { value: 'nanjing', label: '南靖县' },
      { value: 'pinghe', label: '平和县' },
      { value: 'huaan', label: '华安县' }
    ],
    abnormalTypes: [
      { value: '', label: '全部类型' },
      { value: 'overcharge', label: '多收费' },
      { value: 'undercharge', label: '少收费' },
      { value: 'duplicate', label: '重复收费' },
      { value: 'system', label: '系统错误' },
      { value: 'manual', label: '人工操作错误' },
      { value: 'timeout', label: '超时计费' },
      { value: 'discount', label: '优惠异常' },
      { value: 'payment', label: '支付异常' }
    ],
    disposalStatuses: [
      { value: '', label: '全部状态' },
      { value: 'pending', label: '待处理' },
      { value: 'processing', label: '处理中' },
      { value: 'resolved', label: '已处理' },
      { value: 'closed', label: '已关闭' },
      { value: 'rejected', label: '已驳回' },
      { value: 'reviewing', label: '复核中' }
    ],
    severityLevels: [
      { value: '', label: '全部等级' },
      { value: 'high', label: '高' },
      { value: 'medium', label: '中' },
      { value: 'low', label: '低' }
    ],
    paymentTypes: [
      { value: '', label: '全部方式' },
      { value: 'wechat', label: '微信支付' },
      { value: 'alipay', label: '支付宝' },
      { value: 'cash', label: '现金支付' },
      { value: 'card', label: '刷卡支付' },
      { value: 'member', label: '会员支付' }
    ]
  };
};
