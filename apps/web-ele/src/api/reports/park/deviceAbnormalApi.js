// 文件: deviceAbnormalApi.js
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

// 设备类型映射关系 - 对应tb_device_extend.device_type
const deviceTypeMap = {
  'camera': '监控摄像头',
  'gate': '道闸',
  'payment': '缴费机',
  'lighting': '照明设备',
  'network': '网络设备',
  'power': '电源设备',
  'display': '显示屏',
  'sensor': '传感器'
};

// 故障类型映射关系 - 对应park_fault.fault_type
const faultTypeMap = {
  'hardware': '硬件故障',
  'software': '软件故障',
  'network': '网络故障',
  'power': '电源故障',
  'environment': '环境故障',
  'maintenance': '维护故障',
  'configuration': '配置错误'
};

// 处置状态映射关系 - 对应park_fault.disposal_status
const disposalStatusMap = {
  'pending': '待处置',
  'processing': '处置中',
  'completed': '已处理',
  'failed': '处置失败',
  'closed': '已关闭',
  'reviewing': '复核中'
};

// 辅助函数：生成设备异常模拟数据
function generateDeviceAbnormalData() {
  const data = [];
  const deviceCodes = [
    'CAM001', 'CAM002', 'CAM003', 'CAM004', 'CAM005',
    'GATE001', 'GATE002', 'GATE003', 'GATE004', 'GATE005',
    'PAY001', 'PAY002', 'PAY003', 'PAY004', 'PAY005',
    'LIGHT001', 'LIGHT002', 'LIGHT003', 'LIGHT004', 'LIGHT005',
    'NET001', 'NET002', 'NET003', 'NET004',
    'PWR001', 'PWR002', 'PWR003'
  ];

  const regionCodes = Object.keys(regionMap);
  const deviceTypeCodes = Object.keys(deviceTypeMap);
  const faultTypeCodes = Object.keys(faultTypeMap);
  const disposalStatusCodes = Object.keys(disposalStatusMap);
  const operators = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九'];
  const manufacturers = ['海康威视', '大华', '宇视', '华为', '中兴', 'TP-LINK'];

  for (let i = 1; i <= 80; i++) {
    const randomDate = new Date(2023, 11, Math.floor(Math.random() * 30) + 1);
    const randomTime = `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;

    const regionCode = regionCodes[Math.floor(Math.random() * regionCodes.length)];
    const deviceTypeCode = deviceTypeCodes[Math.floor(Math.random() * deviceTypeCodes.length)];
    const faultTypeCode = faultTypeCodes[Math.floor(Math.random() * faultTypeCodes.length)];
    const disposalStatusCode = disposalStatusCodes[Math.floor(Math.random() * disposalStatusCodes.length)];

    const hasDisposal = disposalStatusCode === 'completed' || disposalStatusCode === 'closed';
    const hasOperator = Math.random() > 0.4;

    data.push({
      faultId: `FAULT${String(i).padStart(6, '0')}`,
      deviceCode: deviceCodes[Math.floor(Math.random() * deviceCodes.length)],
      deviceName: `${deviceCodes[Math.floor(Math.random() * deviceCodes.length)]}-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      deviceTypeCode: deviceTypeCode,
      deviceType: deviceTypeMap[deviceTypeCode],
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      regionCode: regionCode,
      regionName: regionMap[regionCode],
      faultTime: `${randomDate.toISOString().split('T')[0]} ${randomTime}`,
      faultTypeCode: faultTypeCode,
      faultType: faultTypeMap[faultTypeCode],
      faultDescription: getFaultDescription(Math.floor(Math.random() * 5)),
      impactLevel: ['高', '中', '低'][Math.floor(Math.random() * 3)],
      disposalStatusCode: disposalStatusCode,
      disposalStatus: disposalStatusMap[disposalStatusCode],
      disposalTime: hasDisposal ?
        new Date(randomDate.getTime() + Math.random() * 86400000 * 3).toISOString().replace('T', ' ').substr(0, 19) :
        null,
      operator: hasOperator ? operators[Math.floor(Math.random() * operators.length)] : null,
      installationDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      warrantyStatus: Math.random() > 0.5 ? '在保' : '过保',
      estimatedCost: Math.floor(Math.random() * 5000) + 100,
      workOrderId: hasDisposal ? `WO${String(10000 + i)}` : null
    });
  }

  return data;
}

// 辅助函数：生成故障描述
function getFaultDescription(type) {
  const descriptions = [
    '设备无法启动，电源指示灯不亮',
    '网络连接中断，无法传输数据',
    '软件界面卡死，操作无响应',
    '硬件部件损坏，需要更换',
    '性能下降，响应时间超过阈值',
    '频繁重启，系统不稳定',
    '通信模块故障，无法联网',
    '显示异常，画面花屏'
  ];
  return descriptions[type] || '设备出现异常';
}

// 辅助函数：计算故障趋势数据
function calculateFaultTrend(data) {
  const trend = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayData = data.filter(item => {
      const itemDate = item.faultTime.split(' ')[0];
      return itemDate === dateStr;
    });

    trend.push({
      date: dateStr,
      count: dayData.length,
      resolved: dayData.filter(item => item.disposalStatus === '已处理' || item.disposalStatus === '已关闭').length
    });
  }

  return trend;
}

// 辅助函数：计算故障类型分布
function calculateFaultTypeDistribution(data) {
  const distribution = {};

  data.forEach(item => {
    if (!distribution[item.faultType]) {
      distribution[item.faultType] = 0;
    }
    distribution[item.faultType]++;
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

// 辅助函数：计算区域故障数对比
function calculateRegionFaultComparison(data) {
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

// 辅助函数：计算设备类型故障数对比
function calculateDeviceTypeFaultComparison(data) {
  const comparison = {};

  data.forEach(item => {
    if (!comparison[item.deviceType]) {
      comparison[item.deviceType] = 0;
    }
    comparison[item.deviceType]++;
  });

  return Object.entries(comparison)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// 辅助函数：计算平均解决时间
function calculateAverageResolveTime(data) {
  const resolvedData = data.filter(item =>
    item.disposalStatus === '已处理' && item.disposalTime
  );

  if (resolvedData.length === 0) return 0;

  let totalHours = 0;
  resolvedData.forEach(item => {
    const faultTime = new Date(item.faultTime);
    const disposalTime = new Date(item.disposalTime);
    const hours = (disposalTime - faultTime) / (1000 * 60 * 60);
    totalHours += hours;
  });

  return Math.round(totalHours / resolvedData.length * 10) / 10;
}

/**
 * 获取设备异常报表
 */
export const getDeviceAbnormalReport = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const {
    startDate = '2023-12-01',
    endDate = '2023-12-31',
    deviceCode = '',
    deviceType = '',
    region = '',
    faultType = '',
    disposalStatus = '',
    page = 1,
    pageSize = 10
  } = params;

  const allData = generateDeviceAbnormalData();

  let filteredData = allData.filter(item => {
    const itemDate = item.faultTime.split(' ')[0];
    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;
    if (deviceCode && !item.deviceCode.includes(deviceCode)) return false;
    if (deviceType && item.deviceTypeCode !== deviceType) return false;
    if (region && item.regionCode !== region) return false;
    if (faultType && item.faultTypeCode !== faultType) return false;
    if (disposalStatus && item.disposalStatusCode !== disposalStatus) return false;
    return true;
  });

  const total = filteredData.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const trendData = calculateFaultTrend(filteredData);
  const faultTypeDistribution = calculateFaultTypeDistribution(filteredData);
  const disposalStatusDistribution = calculateDisposalStatusDistribution(filteredData);
  const regionFaultComparison = calculateRegionFaultComparison(filteredData);
  const deviceTypeFaultComparison = calculateDeviceTypeFaultComparison(filteredData);

  const totalCount = filteredData.length;
  const pendingCount = filteredData.filter(item => item.disposalStatus === '待处置').length;
  const processingCount = filteredData.filter(item => item.disposalStatus === '处置中').length;
  const completedCount = filteredData.filter(item => item.disposalStatus === '已处理').length;
  const avgResolveTime = calculateAverageResolveTime(filteredData);
  const totalEstimatedCost = filteredData.reduce((sum, item) => sum + item.estimatedCost, 0);

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
    summary: {
      totalCount,
      pendingCount,
      processingCount,
      completedCount,
      resolveRate: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      avgResolveTime,
      totalEstimatedCost
    },
    trendData,
    faultTypeDistribution,
    disposalStatusDistribution,
    regionFaultComparison,
    deviceTypeFaultComparison,
    generatedAt: new Date().toISOString()
  };
};

/**
 * 导出设备异常报表
 */
export const exportDeviceAbnormalReport = async (params) => {
  try {
    const data = await getDeviceAbnormalReport({
      ...params,
      page: 1,
      pageSize: 10000
    });

    const headers = [
      '故障ID', '设备编码', '设备名称', '设备类型', '生产厂家', '区域名称',
      '故障时间', '故障类型', '故障描述', '影响等级', '处置状态', '处置时间',
      '处理人', '安装日期', '保修状态', '预估维修成本(元)', '关联工单'
    ];

    const csvRows = data.data.map((item) => [
      item.faultId,
      item.deviceCode,
      item.deviceName,
      item.deviceType,
      item.manufacturer,
      item.regionName,
      item.faultTime,
      item.faultType,
      item.faultDescription,
      item.impactLevel,
      item.disposalStatus,
      item.disposalTime || '',
      item.operator || '',
      item.installationDate,
      item.warrantyStatus,
      item.estimatedCost,
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
    link.download = `设备异常报表_${params.startDate || '开始'}_${params.endDate || '结束'}_${new Date().getTime()}.csv`;

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
 * 获取设备异常详情
 */
export const getDeviceAbnormalDetail = async (faultId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allData = generateDeviceAbnormalData();
  const detail = allData.find(item => item.faultId === faultId);

  if (!detail) {
    throw new Error('故障记录不存在');
  }

  const deviceLogs = [
    {
      time: new Date(Date.now() - 86400000 * 3).toISOString().replace('T', ' ').substr(0, 19),
      event: '设备启动',
      status: '正常',
      operator: '系统',
      remark: '设备正常启动'
    },
    {
      time: new Date(Date.now() - 86400000 * 2).toISOString().replace('T', ' ').substr(0, 19),
      event: '日常巡检',
      status: '正常',
      operator: '张三',
      remark: '巡检通过'
    },
    {
      time: detail.faultTime,
      event: '故障发生',
      status: '异常',
      operator: '系统',
      remark: detail.faultDescription
    },
    ...(detail.disposalTime ? [{
      time: detail.disposalTime,
      event: '故障处理',
      status: detail.disposalStatus,
      operator: detail.operator || '未知',
      remark: '故障已修复'
    }] : [])
  ];

  const disposalProcess = detail.disposalTime ? [
    {
      step: 1,
      time: new Date(detail.faultTime).getTime() + 3600000,
      action: '故障上报',
      operator: '系统自动',
      result: '已创建工单',
      remark: `工单号: ${detail.workOrderId || 'WO' + faultId.substr(5)}`
    },
    {
      step: 2,
      time: new Date(detail.faultTime).getTime() + 7200000,
      action: '工单派发',
      operator: '调度中心',
      result: '已分配技术员',
      remark: `技术员: ${detail.operator || '待分配'}`
    },
    {
      step: 3,
      time: new Date(detail.disposalTime).getTime() - 3600000,
      action: '现场处理',
      operator: detail.operator || '技术员',
      result: '故障已修复',
      remark: `维修内容: ${detail.faultDescription}`
    },
    {
      step: 4,
      time: new Date(detail.disposalTime).getTime(),
      action: '工单关闭',
      operator: '系统',
      result: '处理完成',
      remark: `状态: ${detail.disposalStatus}`
    }
  ] : [
    {
      step: 1,
      time: new Date(detail.faultTime).getTime(),
      action: '故障上报',
      operator: '系统自动',
      result: '已创建工单',
      remark: '等待处理'
    }
  ];

  const deviceInfo = {
    deviceCode: detail.deviceCode,
    deviceName: detail.deviceName,
    deviceType: detail.deviceType,
    manufacturer: detail.manufacturer,
    model: 'DH-IPC-HFW1230S',
    serialNumber: `SN${detail.deviceCode}${Math.floor(Math.random() * 10000)}`,
    installationDate: detail.installationDate,
    warrantyStatus: detail.warrantyStatus,
    warrantyExpire: new Date(new Date(detail.installationDate).getTime() + 365 * 86400000).toISOString().split('T')[0],
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    location: `${detail.regionName}停车场${Math.floor(Math.random() * 10) + 1}号入口`
  };

  return {
    detail,
    deviceLogs,
    disposalProcess,
    deviceInfo,
    generatedAt: new Date().toISOString()
  };
};

/**
 * 获取筛选选项
 */
export const getDeviceAbnormalFilterOptions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    deviceTypes: [
      { value: '', label: '全部类型' },
      { value: 'camera', label: '监控摄像头' },
      { value: 'gate', label: '道闸' },
      { value: 'payment', label: '缴费机' },
      { value: 'lighting', label: '照明设备' },
      { value: 'network', label: '网络设备' },
      { value: 'power', label: '电源设备' },
      { value: 'display', label: '显示屏' },
      { value: 'sensor', label: '传感器' }
    ],
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
    faultTypes: [
      { value: '', label: '全部类型' },
      { value: 'hardware', label: '硬件故障' },
      { value: 'software', label: '软件故障' },
      { value: 'network', label: '网络故障' },
      { value: 'power', label: '电源故障' },
      { value: 'environment', label: '环境故障' },
      { value: 'maintenance', label: '维护故障' },
      { value: 'configuration', label: '配置错误' }
    ],
    disposalStatuses: [
      { value: '', label: '全部状态' },
      { value: 'pending', label: '待处置' },
      { value: 'processing', label: '处置中' },
      { value: 'completed', label: '已处理' },
      { value: 'failed', label: '处置失败' },
      { value: 'closed', label: '已关闭' },
      { value: 'reviewing', label: '复核中' }
    ]
  };
};
