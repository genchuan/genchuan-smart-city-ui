// 文件: deviceAbnormalApi.js
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

// 设备类型映射关系
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

// 故障类型映射关系
const faultTypeMap = {
  'hardware': '硬件故障',
  'software': '软件故障',
  'network': '网络故障',
  'power': '电源故障',
  'environment': '环境故障',
  'maintenance': '维护故障',
  'configuration': '配置错误'
};

// 处置状态映射关系
const disposalStatusMap = {
  'pending': '待处置',
  'processing': '处置中',
  'completed': '已处理',
  'failed': '处置失败',
  'closed': '已关闭',
  'reviewing': '复核中'
};

// 辅助函数：生成设备异常模拟数据
function generateDeviceAbnormalData(startDate, endDate) {
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
      const deviceTypeCode = deviceTypeCodes[Math.floor(Math.random() * deviceTypeCodes.length)];
      const faultTypeCode = faultTypeCodes[Math.floor(Math.random() * faultTypeCodes.length)];
      const disposalStatusCode = disposalStatusCodes[Math.floor(Math.random() * disposalStatusCodes.length)];

      const hasDisposal = disposalStatusCode === 'completed' || disposalStatusCode === 'closed';
      const hasOperator = Math.random() > 0.4;

      data.push({
        faultId: `FAULT${String(id).padStart(6, '0')}`,
        deviceCode: deviceCodes[Math.floor(Math.random() * deviceCodes.length)],
        deviceName: `${deviceCodes[Math.floor(Math.random() * deviceCodes.length)]}-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
        deviceTypeCode: deviceTypeCode,
        deviceType: deviceTypeMap[deviceTypeCode],
        manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
        regionCode: regionCode,
        regionName: regionMap[regionCode],
        faultTime: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(randomHour).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}:${String(randomSecond).padStart(2, '0')}`,
        faultTypeCode: faultTypeCode,
        faultType: faultTypeMap[faultTypeCode],
        faultDescription: getFaultDescription(Math.floor(Math.random() * 5)),
        impactLevel: ['高', '中', '低'][Math.floor(Math.random() * 3)],
        disposalStatusCode: disposalStatusCode,
        disposalStatus: disposalStatusMap[disposalStatusCode],
        disposalTime: hasDisposal ?
          `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String((randomHour + 2) % 24).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}:${String(randomSecond).padStart(2, '0')}` :
          null,
        operator: hasOperator ? operators[Math.floor(Math.random() * operators.length)] : null,
        installationDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        warrantyStatus: Math.random() > 0.5 ? '在保' : '过保',
        estimatedCost: Math.floor(Math.random() * 5000) + 100,
        workOrderId: hasDisposal ? `WO${String(10000 + id)}` : null
      });
    }
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

/**
 * 获取设备异常报表
 */
export const getDeviceAbnormalReport = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const {
    startDate = getDefaultStartDate(),
    endDate = getDefaultEndDate(),
    deviceCode = '',
    deviceType = '',
    region = '',
    faultType = '',
    disposalStatus = '',
    page = 1,
    pageSize = 10
  } = params;

  const allData = generateDeviceAbnormalData(startDate, endDate);

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

  // 计算统计数据
  const totalCount = filteredData.length;
  const pendingCount = filteredData.filter(item => item.disposalStatus === '待处置').length;
  const processingCount = filteredData.filter(item => item.disposalStatus === '处置中').length;
  const completedCount = filteredData.filter(item => item.disposalStatus === '已处理').length;
  const resolveRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const avgResolveTime = filteredData.filter(item => item.disposalTime).length > 0
    ? Math.floor(Math.random() * 24) + 1
    : 0;
  const totalEstimatedCost = filteredData.reduce((sum, item) => sum + item.estimatedCost, 0);

  // 生成趋势数据
  const trendData = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayData = filteredData.filter(item => {
      const itemDate = item.faultTime.split(' ')[0];
      return itemDate === dateStr;
    });

    trendData.push({
      date: dateStr,
      count: dayData.length,
      resolved: dayData.filter(item => item.disposalStatus === '已处理' || item.disposalStatus === '已关闭').length
    });
  }

  // 生成故障类型分布
  const faultTypeDistribution = Object.entries(
    filteredData.reduce((acc, item) => {
      acc[item.faultType] = (acc[item.faultType] || 0) + 1;
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
  const regionFaultComparison = Object.entries(
    filteredData.reduce((acc, item) => {
      acc[item.regionName] = (acc[item.regionName] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // 生成设备类型对比
  const deviceTypeFaultComparison = Object.entries(
    filteredData.reduce((acc, item) => {
      acc[item.deviceType] = (acc[item.deviceType] || 0) + 1;
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
      pendingCount,
      processingCount,
      completedCount,
      resolveRate,
      avgResolveTime,
      totalEstimatedCost
    },
    trendData,
    faultTypeDistribution,
    disposalStatusDistribution: statusDistribution,
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

  // 生成一些测试数据
  const detail = {
    faultId: faultId,
    deviceCode: `CAM${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
    deviceType: '监控摄像头',
    regionName: '芗城区',
    faultTime: new Date().toISOString().replace('T', ' ').substr(0, 19),
    faultType: '硬件故障',
    faultDescription: '设备无法启动，电源指示灯不亮',
    disposalStatus: '待处置',
    disposalTime: null,
    operator: null
  };

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
    }
  ];

  const disposalProcess = [
    {
      step: 1,
      time: new Date(detail.faultTime).getTime(),
      action: '故障上报',
      operator: '系统自动',
      result: '已创建工单',
      remark: `工单号: WO${faultId.substr(5)}`
    }
  ];

  return {
    detail,
    deviceLogs,
    disposalProcess,
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

// 默认日期函数
function getDefaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}

function getDefaultEndDate() {
  return new Date().toISOString().split('T')[0];
}
