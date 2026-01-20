// 文件: chargeAbnormalApi.js
import { ElMessage } from 'element-plus';

// 区域映射关系
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

// 停车场映射关系
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

// 异常类型映射关系
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

// 处置状态映射关系
const disposalStatusMap = {
  'pending': '待处理',
  'processing': '处理中',
  'resolved': '已处理',
  'closed': '已关闭',
  'rejected': '已驳回',
  'reviewing': '复核中'
};

// 处理结果映射关系
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
function generateChargeAbnormalData(startDate, endDate) {
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

  // 生成30天范围内的数据
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  for (let day = 0; day <= daysDiff; day++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + day);

    // 每天生成1-5条数据
    const dayCount = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < dayCount; i++) {
      const id = data.length + 1;
      const randomHour = Math.floor(Math.random() * 24);
      const randomMinute = Math.floor(Math.random() * 60);
      const randomSecond = Math.floor(Math.random() * 60);

      const regionCode = regionCodes[Math.floor(Math.random() * regionCodes.length)];
      const parkingId = parkingIds[Math.floor(Math.random() * parkingIds.length)];
      const abnormalTypeCode = abnormalTypeCodes[Math.floor(Math.random() * abnormalTypeCodes.length)];
      const disposalStatusCode = disposalStatusCodes[Math.floor(Math.random() * disposalStatusCodes.length)];

      const hasDisposal = disposalStatusCode === 'resolved' || disposalStatusCode === 'closed';
      const abnormalAmount = Math.floor(Math.random() * 50) + 1;
      const actualAmount = Math.floor(Math.random() * 100) + 20;

      data.push({
        abnormalId: `ABN${String(id).padStart(6, '0')}`,
        orderNo: `ORDER${String(10000 + id)}`,
        carNumber: plateNumbers[Math.floor(Math.random() * plateNumbers.length)],
        regionCode: regionCode,
        regionName: regionMap[regionCode],
        parkingId: parkingId,
        parkingName: parkingMap[parkingId],
        abnormalTime: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(randomHour).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}:${String(randomSecond).padStart(2, '0')}`,
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
          new Date(currentDate.getTime() + Math.random() * 86400000).toISOString().replace('T', ' ').substr(0, 19) :
          null,
        operator: hasDisposal ? ['张三', '李四', '王五'][Math.floor(Math.random() * 3)] : null,
        workOrderId: hasDisposal ? `WO${String(20000 + id)}` : null
      });
    }
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

/**
 * 获取收费异常报表
 */
export const getChargeAbnormalReport = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const {
    startDate = getDefaultStartDate(),
    endDate = getDefaultEndDate(),
    orderNo = '',
    carNumber = '',
    region = '',
    abnormalType = '',
    disposalStatus = '',
    page = 1,
    pageSize = 10
  } = params;

  const allData = generateChargeAbnormalData(startDate, endDate);

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

  // 计算统计数据
  const totalAbnormalAmount = filteredData.reduce((sum, item) => sum + item.abnormalAmount, 0);
  const totalCount = filteredData.length;
  const completedCount = filteredData.filter(item => item.disposalStatus === '已处理' || item.disposalStatus === '已关闭').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const correctionSuccessRate = completedCount > 0 ? Math.round((completedCount * 0.8) / totalCount * 100) : 0;

  // 生成趋势数据（近30天）
  const trendData = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayData = filteredData.filter(item => {
      const itemDate = item.abnormalTime.split(' ')[0];
      return itemDate === dateStr;
    });

    trendData.push({
      date: dateStr,
      count: dayData.length,
      amount: dayData.reduce((sum, item) => sum + item.abnormalAmount, 0)
    });
  }

  // 生成异常类型分布
  const abnormalTypeDistribution = Object.entries(
    filteredData.reduce((acc, item) => {
      acc[item.abnormalType] = (acc[item.abnormalType] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // 生成状态分布
  const statusDistribution = Object.entries(
    filteredData.reduce((acc, item) => {
      acc[item.disposalStatus] = (acc[item.disposalStatus] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // 生成区域对比
  const regionAbnormalComparison = Object.entries(
    filteredData.reduce((acc, item) => {
      acc[item.regionName] = (acc[item.regionName] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
    summary: {
      totalCount,
      totalAbnormalAmount,
      completionRate,
      correctionSuccessRate
    },
    trendData,
    abnormalTypeDistribution,
    disposalStatusDistribution: statusDistribution,
    regionAbnormalComparison,
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
      '支付方式', '处置状态', '处理结果', '客户投诉', '投诉时间', '处理人', '关联工单'
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

  // 生成一些测试数据
  const detail = {
    abnormalId: abnormalId,
    orderNo: `ORDER${Math.floor(Math.random() * 10000) + 10000}`,
    carNumber: `闽E${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    parkingName: '漳州万达广场停车场',
    regionName: '芗城区',
    abnormalTime: new Date().toISOString().replace('T', ' ').substr(0, 19),
    abnormalType: ['多收费', '少收费', '重复收费'][Math.floor(Math.random() * 3)],
    abnormalReason: getAbnormalReason(Math.floor(Math.random() * 8)),
    abnormalAmount: Math.floor(Math.random() * 50) + 1,
    actualAmount: Math.floor(Math.random() * 100) + 20,
    disposalStatus: ['待处理', '处理中', '已处理'][Math.floor(Math.random() * 3)],
    disposalResult: Math.random() > 0.5 ? ['已退款', '已补偿', '已纠正'][Math.floor(Math.random() * 3)] : null
  };

  const orderDetail = {
    orderNo: detail.orderNo,
    enterTime: new Date(Date.now() - 7200000).toISOString().replace('T', ' ').substr(0, 19),
    exitTime: new Date(Date.now() - 3600000).toISOString().replace('T', ' ').substr(0, 19),
    duration: '2小时',
    basicAmount: detail.shouldAmount || detail.actualAmount + detail.abnormalAmount,
    discountAmount: 0,
    paidAmount: detail.actualAmount,
    paymentType: '微信支付',
    paymentTime: detail.abnormalTime
  };

  const correctionRecords = detail.disposalResult ? [
    {
      time: new Date(detail.abnormalTime).getTime() + 1800000,
      action: '异常检测',
      operator: '系统自动',
      description: `检测到${detail.abnormalType}异常`,
      result: '已创建纠错任务'
    },
    {
      time: new Date(detail.abnormalTime).getTime() + 3600000,
      action: '手动复核',
      operator: '复核员',
      description: '确认异常属实',
      result: '复核通过'
    }
  ] : [
    {
      time: new Date(detail.abnormalTime).getTime(),
      action: '异常检测',
      operator: '系统自动',
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

// 默认日期函数
function getDefaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}

function getDefaultEndDate() {
  return new Date().toISOString().split('T')[0];
}
