// 文件: escapeDataApi.js
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

// 逃费等级映射关系
const escapeLevelMap = {
  'level1': '一级逃费',
  'level2': '二级逃费',
  'level3': '三级逃费',
  'level4': '四级逃费'
};

// 追缴状态映射关系
const traceStatusMap = {
  'pending': '待追缴',
  'processing': '追缴中',
  'completed': '已追缴',
  'failed': '追缴失败',
  'exempted': '已豁免'
};

// 辅助函数：生成逃费模拟数据
function generateEscapeData(startDate, endDate) {
  const data = [];
  const plateNumbers = [
    '闽E12345', '闽E23456', '闽E34567', '闽E45678', '闽E56789',
    '闽D12345', '闽D23456', '闽D34567', '闽D45678', '闽D56789',
    '闽F12345', '闽F23456', '闽F34567', '闽F45678', '闽F56789'
  ];

  const regionCodes = Object.keys(regionMap);
  const parkingIds = Object.keys(parkingMap);
  const escapeLevelCodes = Object.keys(escapeLevelMap);
  const traceStatusCodes = Object.keys(traceStatusMap);

  // 生成日期范围内的数据
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  for (let day = 0; day <= daysDiff; day++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + day);

    // 每天生成1-6条数据
    const dayCount = Math.floor(Math.random() * 6) + 1;

    for (let i = 0; i < dayCount; i++) {
      const id = data.length + 1;
      const randomHour = Math.floor(Math.random() * 24);
      const randomMinute = Math.floor(Math.random() * 60);
      const randomSecond = Math.floor(Math.random() * 60);

      const regionCode = regionCodes[Math.floor(Math.random() * regionCodes.length)];
      const parkingId = parkingIds[Math.floor(Math.random() * parkingIds.length)];
      const escapeLevelCode = escapeLevelCodes[Math.floor(Math.random() * escapeLevelCodes.length)];
      const traceStatusCode = traceStatusCodes[Math.floor(Math.random() * traceStatusCodes.length)];

      const hasTrace = traceStatusCode === 'completed' || traceStatusCode === 'exempted';

      data.push({
        escapeId: `ESCAPE${String(id).padStart(6, '0')}`,
        carNumber: plateNumbers[Math.floor(Math.random() * plateNumbers.length)],
        regionCode: regionCode,
        regionName: regionMap[regionCode],
        parkingId: parkingId,
        parkingName: parkingMap[parkingId],
        escapeTime: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(randomHour).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}:${String(randomSecond).padStart(2, '0')}`,
        escapeAmount: Math.floor(Math.random() * 500) + 10,
        escapeLevelCode: escapeLevelCode,
        escapeLevel: escapeLevelMap[escapeLevelCode],
        traceStatusCode: traceStatusCode,
        traceStatus: traceStatusMap[traceStatusCode],
        lastTraceTime: hasTrace ?
          `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String((randomHour + 1) % 24).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}:${String(randomSecond).padStart(2, '0')}` :
          null,
        vehicleType: ['小型车', '中型车', '大型车'][Math.floor(Math.random() * 3)],
        contactInfo: Math.random() > 0.7 ? '138****5678' : null,
        remark: Math.random() > 0.8 ? '车主多次逃费' : ''
      });
    }
  }

  return data;
}

/**
 * 获取逃费数据报表
 */
export const getEscapeDataReport = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const {
    startDate = getDefaultStartDate(),
    endDate = getDefaultEndDate(),
    carNumber = '',
    region = '',
    parkingId = '',
    escapeLevel = '',
    traceStatus = '',
    page = 1,
    pageSize = 10
  } = params;

  const allData = generateEscapeData(startDate, endDate);

  let filteredData = allData.filter(item => {
    const itemDate = item.escapeTime.split(' ')[0];
    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;
    if (carNumber && !item.carNumber.includes(carNumber)) return false;
    if (region && item.regionCode !== region) return false;
    if (parkingId && item.parkingId !== parkingId) return false;
    if (escapeLevel && item.escapeLevelCode !== escapeLevel) return false;
    if (traceStatus && item.traceStatusCode !== traceStatus) return false;
    return true;
  });

  const total = filteredData.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // 计算统计数据
  const totalEscapeAmount = filteredData.reduce((sum, item) => sum + item.escapeAmount, 0);
  const totalCount = filteredData.length;
  const pendingCount = filteredData.filter(item => item.traceStatus === '待追缴').length;
  const completedCount = filteredData.filter(item => item.traceStatus === '已追缴').length;
  const recoveryRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 生成趋势数据
  const trendData = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayData = filteredData.filter(item => {
      const itemDate = item.escapeTime.split(' ')[0];
      return itemDate === dateStr;
    });

    trendData.push({
      date: dateStr,
      count: dayData.length,
      amount: dayData.reduce((sum, item) => sum + item.escapeAmount, 0)
    });
  }

  // 生成等级分布
  const escapeLevelDistribution = Object.entries(
    filteredData.reduce((acc, item) => {
      acc[item.escapeLevel] = (acc[item.escapeLevel] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // 生成状态分布
  const traceStatusDistribution = Object.entries(
    filteredData.reduce((acc, item) => {
      acc[item.traceStatus] = (acc[item.traceStatus] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // 生成区域对比
  const regionAmountComparison = Object.entries(
    filteredData.reduce((acc, item) => {
      acc[item.regionName] = (acc[item.regionName] || 0) + item.escapeAmount;
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
      totalEscapeAmount,
      pendingCount,
      completedCount,
      recoveryRate
    },
    trendData,
    escapeLevelDistribution,
    traceStatusDistribution,
    regionAmountComparison,
    generatedAt: new Date().toISOString()
  };
};

/**
 * 导出逃费数据报表
 */
export const exportEscapeDataReport = async (params) => {
  try {
    const data = await getEscapeDataReport({
      ...params,
      page: 1,
      pageSize: 10000
    });

    const headers = [
      '逃费ID', '车牌号码', '行政区域', '车场名称', '逃费时间',
      '逃费金额(元)', '逃费等级', '追缴状态', '上次追缴时间', '车辆类型', '联系方式', '备注'
    ];

    const csvRows = data.data.map((item) => [
      item.escapeId,
      item.carNumber,
      item.regionName,
      item.parkingName,
      item.escapeTime,
      item.escapeAmount,
      item.escapeLevel,
      item.traceStatus,
      item.lastTraceTime || '',
      item.vehicleType || '',
      item.contactInfo || '',
      item.remark || ''
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
    link.download = `逃费数据报表_${params.startDate || '开始'}_${params.endDate || '结束'}_${new Date().getTime()}.csv`;

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
 * 获取逃费详情
 */
export const getEscapeDetail = async (escapeId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 生成一些测试数据
  const detail = {
    escapeId: escapeId,
    carNumber: `闽E${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    regionName: '芗城区',
    parkingName: '漳州万达广场停车场',
    escapeTime: new Date().toISOString().replace('T', ' ').substr(0, 19),
    escapeAmount: Math.floor(Math.random() * 500) + 10,
    escapeLevel: '一级逃费',
    traceStatus: '待追缴',
    lastTraceTime: null,
    vehicleType: '小型车'
  };

  const vehicleRecords = [
    {
      time: new Date(Date.now() - 86400000 * 2).toISOString().replace('T', ' ').substr(0, 19),
      parkingName: detail.parkingName,
      action: '入场',
      plateNumber: detail.carNumber,
      operator: '自动识别',
      lane: '入口1'
    },
    {
      time: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString().replace('T', ' ').substr(0, 19),
      parkingName: detail.parkingName,
      action: '出场',
      plateNumber: detail.carNumber,
      operator: '自动识别',
      lane: '出口2'
    }
  ];

  const traceHistory = detail.lastTraceTime ? [
    {
      time: detail.lastTraceTime,
      operator: '系统自动',
      action: '短信通知',
      result: '已发送',
      remark: `逃费金额${detail.escapeAmount}元通知`,
      contact: '138****5678'
    }
  ] : [];

  const ownerInfo = {
    name: '王先生',
    phone: '138****5678',
    vehicleType: detail.vehicleType,
    plateNumber: detail.carNumber,
    registrationDate: '2022-05-10',
    creditScore: 85
  };

  return {
    detail,
    vehicleRecords,
    traceHistory,
    ownerInfo,
    generatedAt: new Date().toISOString()
  };
};

/**
 * 发起追缴
 */
export const submitTraceAction = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const { escapeId } = params;

  const success = Math.random() > 0.2;

  if (success) {
    return {
      success: true,
      message: '追缴操作已发起',
      traceId: `TRACE${String(Date.now()).slice(-8)}`,
      nextAction: '系统将在24小时内跟进处理',
      estimatedTime: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    };
  } else {
    throw new Error('追缴操作失败，请稍后重试');
  }
};

/**
 * 获取筛选选项
 */
export const getEscapeFilterOptions = async () => {
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
    parkingList: [
      { value: '', label: '全部停车场' },
      { value: 'park001', label: '漳州万达广场停车场' },
      { value: 'park002', label: '芗城政府路侧停车场' },
      { value: 'park003', label: '龙文区体育中心停车场' },
      { value: 'park004', label: '龙海区商业城停车场' },
      { value: 'park005', label: '漳浦县汽车站停车场' },
      { value: 'park006', label: '云霄县中心停车场' },
      { value: 'park007', label: '诏安县人民广场停车场' },
      { value: 'park008', label: '东山县旅游中心停车场' },
      { value: 'park009', label: '南靖县土楼停车场' },
      { value: 'park010', label: '平和县商贸城停车场' }
    ],
    escapeLevels: [
      { value: '', label: '全部等级' },
      { value: 'level1', label: '一级逃费' },
      { value: 'level2', label: '二级逃费' },
      { value: 'level3', label: '三级逃费' },
      { value: 'level4', label: '四级逃费' }
    ],
    traceStatuses: [
      { value: '', label: '全部状态' },
      { value: 'pending', label: '待追缴' },
      { value: 'processing', label: '追缴中' },
      { value: 'completed', label: '已追缴' },
      { value: 'failed', label: '追缴失败' },
      { value: 'exempted', label: '已豁免' }
    ],
    traceMethods: [
      { value: 'sms', label: '短信通知' },
      { value: 'phone', label: '电话追缴' },
      { value: 'letter', label: '书面通知' },
      { value: 'legal', label: '法律途径' },
      { value: 'system', label: '系统自动' }
    ],
    vehicleTypes: [
      { value: '', label: '全部车型' },
      { value: 'small', label: '小型车' },
      { value: 'medium', label: '中型车' },
      { value: 'large', label: '大型车' },
      { value: 'newEnergy', label: '新能源汽车' }
    ]
  };
};

/**
 * 获取逃费统计数据
 */
export const getEscapeStatistics = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const { startDate = getDefaultStartDate(), endDate = getDefaultEndDate() } = params;

  const allData = generateEscapeData(startDate, endDate);

  const totalCount = allData.length;
  const totalEscapeAmount = allData.reduce((sum, item) => sum + item.escapeAmount, 0);
  const pendingCount = allData.filter(item => item.traceStatus === '待追缴').length;
  const completedCount = allData.filter(item => item.traceStatus === '已追缴').length;
  const recoveryRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    summary: {
      totalCount,
      totalEscapeAmount,
      pendingCount,
      completedCount,
      recoveryRate
    },
    generatedAt: new Date().toISOString()
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
