import { requestClient } from '#/api/request';

// 基础URL，可根据实际项目配置
const BASE_URL = '/api/transportation';

// 通行效率监测视图
// 通行效率概览数据（核心指标）
export const fetchTrafficEfficiencyOverview = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/trafficEfficiency/overview`);
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('通行效率概览接口调用失败，使用模拟数据:', error.message);
    return {
      totalRoadLength: 386.5, // 总道路里程（公里）
      peakAvgSpeed: 32.8,     // 高峰平均速度（km/h）
      congestionRoadCount: 12, // 拥堵路段数（条）
      congestionRate: 8.3,     // 拥堵率（%）
      efficiencyYoY: 4.2,      // 通行效率同比变化（%）
      efficiencyMoM: -1.8,     // 通行效率环比变化（%）
      mainCongestionArea: '市中心商圈、东部高架枢纽', // 主要拥堵区域
      monitorFrequency: '实时监测（5分钟/次）',      // 监测频次
      lastMonitorTime: '2025-11-25 08:45',          // 最近监测时间
      congestionYoY: 2.3,      // 拥堵率同比变化（%）
      congestionMoM: -0.8      // 拥堵率环比变化（%）
    };
  }
};

// 通行效率趋势数据（近6个月）
export const fetchTrafficEfficiencyTrend = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/trafficEfficiency/trend`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('通行效率趋势接口调用失败，使用模拟数据:', error.message);
    const months = ['6月', '7月', '8月', '9月', '10月', '11月'];
    return {
      xAxis: months,
      series: [
        { name: '高峰平均速度（km/h）', data: [30.2, 31.5, 33.1, 32.7, 33.5, 32.8] },
        { name: '拥堵率（%）', data: [10.5, 9.8, 7.2, 7.8, 8.1, 8.3] }
      ]
    };
  }
};

// 拥堵区域分布数据
export const fetchTrafficCongestionDistribution = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/trafficEfficiency/congestionDistribution`);
    if (response.data && response.data.legend && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('拥堵区域分布接口调用失败，使用模拟数据:', error.message);
    return {
      legend: ['东部城区', '南部郊区', '西部县区', '北部新区', '市中心'],
      series: [{
        name: '拥堵路段数（条）',
        data: [3, 1, 2, 2, 4]
      }]
    };
  }
};

// 道路列表数据（基础信息）
export const fetchRoadList = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/trafficEfficiency/roadList`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('道路列表接口调用失败，使用模拟数据:', error.message);
    return [
      {
        road_id: 'RD-001',
        name: '东环路快速路',
        type: 'expressway', // 快速路
        region: '东部城区',
        status: 'smooth',   // 畅通
        last_check: '2025-11-25 08:30'
      },
      {
        road_id: 'RD-002',
        name: '长安大道主干道',
        type: 'arterial',   // 主干道
        region: '市中心',
        status: 'congested',// 拥堵
        last_check: '2025-11-25 08:45'
      },
      {
        road_id: 'RD-003',
        name: '西湖路次干道',
        type: 'collector',  // 次干道
        region: '西部县区',
        status: 'slow',     // 缓行
        last_check: '2025-11-25 08:20'
      }
    ];
  }
};

// 道路详细监测数据（表格用）
export const fetchRoadDetailData = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/trafficEfficiency/roadDetailData`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('道路详细数据接口调用失败，使用模拟数据:', error.message);
    return Array(15).fill(0).map((_, index) => ({
      road_id: `RD-${String(index + 100).slice(1)}`,
      name: `${['东环', '长安', '西湖', '北岭', '南浦'][index % 5]}${['快速路', '主干道', '次干道', '支路'][index % 4]}`,
      type: index % 4 === 0 ? 'expressway' : index % 4 === 1 ? 'arterial' : index % 4 === 2 ? 'collector' : 'local',
      region: ['东部城区', '南部郊区', '西部县区', '北部新区', '市中心'][index % 5],
      peak_speed: index % 4 === 0 ? (45 + Math.random() * 10).toFixed(1) :
        index % 4 === 1 ? (30 + Math.random() * 8).toFixed(1) :
          index % 4 === 2 ? (25 + Math.random() * 6).toFixed(1) : (20 + Math.random() * 5).toFixed(1),
      offpeak_speed: index % 4 === 0 ? (55 + Math.random() * 10).toFixed(1) :
        index % 4 === 1 ? (40 + Math.random() * 8).toFixed(1) :
          index % 4 === 2 ? (35 + Math.random() * 6).toFixed(1) : (30 + Math.random() * 5).toFixed(1),
      congestion_rate: index === 1 || index === 6 || index === 10 ? (15 + Math.random() * 5).toFixed(1) :
        index % 4 === 3 ? (8 + Math.random() * 3).toFixed(1) : (3 + Math.random() * 2).toFixed(1),
      lane_count: index % 4 === 0 ? 6 : index % 4 === 1 ? 4 : index % 4 === 2 ? 3 : 2,
      design_speed: index % 4 === 0 ? 80 : index % 4 === 1 ? 60 : index % 4 === 2 ? 40 : 30,
      status: index === 1 || index === 6 || index === 10 ? 'congested' :
        index % 4 === 3 || index === 3 ? 'slow' : 'smooth',
      last_check: `2025-11-25 ${8 + (index % 6)}:${index % 2 === 0 ? '30' : '45'}`,
      congestion_time: index === 1 || index === 6 || index === 10 ? '07:30-09:00, 17:30-19:00' : '',
      main_cause: index === 1 || index === 6 || index === 10 ? '车流量大、路口信号灯优化不足' : '',
      improvement_measures: index === 1 || index === 6 || index === 10 ? '优化信号灯配时、增加潮汐车道' : ''
    }));
  }
};

// 单条道路通行趋势数据（详情弹窗用）
export const fetchRoadDetailTrend = async (roadId) => {
  try {
    const response = await requestClient.get(`${BASE_URL}/trafficEfficiency/roadDetailTrend/${roadId}`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('道路详情趋势接口调用失败，使用模拟数据:', error.message);
    return {
      xAxis: ['8月', '9月', '10月', '11月'],
      series: [
        { name: '高峰速度（km/h）', data: [32.5, 33.8, 34.2, 32.8] },
        { name: '拥堵率（%）', data: [9.2, 8.5, 7.8, 8.3] }
      ]
    };
  }
};

// 事故预警视图
// 事故预警概览数据（核心指标）
export const fetchAccidentWarningOverview = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/overview`);
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('事故预警概览接口调用失败，使用模拟数据:', error.message);
    return {
      totalAccident: 28,          // 事故总数（起）
      totalWarning: 45,           // 预警总数（条）
      handledWarning: 34,         // 已处理预警（条）
      pendingWarning: 11,         // 未处理预警（条）
      handlingRate: 75.6,         // 预警处理率（%）
      warningYoY: -12.3,          // 预警数同比变化（%）
      warningMoM: -8.5,           // 预警数环比变化（%）
      highRiskArea: '东部高架枢纽、市中心商圈、北岭隧道', // 高风险区域
      monitorFrequency: '实时监测（3分钟/次）',          // 监测频次
      lastMonitorTime: '2025-11-25 09:15'              // 最近监测时间
    };
  }
};

// 事故预警趋势数据（近6个月）
export const fetchAccidentWarningTrend = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/trend`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('事故预警趋势接口调用失败，使用模拟数据:', error.message);
    const months = ['6月', '7月', '8月', '9月', '10月', '11月'];
    return {
      xAxis: months,
      series: [
        { name: '预警数（条）', data: [58, 52, 49, 47, 42, 45] },
        { name: '事故数（起）', data: [35, 31, 29, 26, 23, 28] }
      ]
    };
  }
};

// 风险区域分布数据
export const fetchRiskAreaDistribution = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/riskAreaDistribution`);
    if (response.data && response.data.legend && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('风险区域分布接口调用失败，使用模拟数据:', error.message);
    return {
      legend: ['东部城区', '南部郊区', '西部县区', '北部新区', '市中心'],
      series: [{
        name: '预警数（条）',
        data: [12, 5, 8, 7, 13]
      }]
    };
  }
};

// 预警列表数据（基础信息）
export const fetchWarningList = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/warningList`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('预警列表接口调用失败，使用模拟数据:', error.message);
    return [
      {
        warning_id: 'AW-001',
        name: '东部高架枢纽拥堵易肇事预警',
        level: 'high',       // 高风险
        area: '东部城区',
        status: 'handled',   // 已处理
        create_time: '2025-11-25 08:00'
      },
      {
        warning_id: 'AW-002',
        name: '市中心商圈行人横穿预警',
        level: 'medium',     // 中风险
        area: '市中心',
        status: 'pending',   // 未处理
        create_time: '2025-11-25 08:30'
      },
      {
        warning_id: 'AW-003',
        name: '北岭隧道能见度低预警',
        level: 'high',       // 高风险
        area: '北部新区',
        status: 'processing',// 处理中
        create_time: '2025-11-25 09:00'
      }
    ];
  }
};

// 预警详细监测数据（表格用）
export const fetchWarningDetailData = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/warningDetailData`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('预警详细数据接口调用失败，使用模拟数据:', error.message);
    return Array(15).fill(0).map((_, index) => ({
      warning_id: `AW-${String(index + 100).slice(1)}`,
      name: `${['东部', '市中心', '北岭', '南郊', '西湖'][index % 5]}${['拥堵', '行人', '能见度', '施工', '事故隐患'][index % 5]}预警`,
      level: index % 3 === 0 ? 'high' : index % 3 === 1 ? 'medium' : 'low',
      area: ['东部城区', '南部郊区', '西部县区', '北部新区', '市中心'][index % 5],
      risk_factor: index % 5 === 0 ? '车流量大' : index % 5 === 1 ? '行人密集' : index % 5 === 2 ? '天气影响' : index % 5 === 3 ? '道路施工' : '设备故障',
      related_accident: index % 4 === 0 ? (2 + Math.floor(Math.random() * 3)).toString() : (0 + Math.floor(Math.random() * 2)).toString(),
      status: index % 3 === 0 ? 'handled' : index % 3 === 1 ? 'pending' : 'processing',
      create_time: `2025-11-25 ${8 + (index % 6)}:${index % 2 === 0 ? '00' : '30'}`,
      handle_time: index % 3 === 0 ? `2025-11-25 ${9 + (index % 6)}:${index % 2 === 0 ? '30' : '00'}` : '',
      handler: index % 3 === 0 ? ['张三', '李四', '王五'][index % 3] : '',
      handle_measures: index % 3 === 0 ? '加强巡逻、优化信号灯配时' : index % 3 === 1 ? '未处理' : '已派工作人员现场处置'
    }));
  }
};

// 单条预警趋势数据（详情弹窗用）
export const fetchWarningDetailTrend = async (warningId) => {
  try {
    const response = await requestClient.get(`${BASE_URL}/warningDetailTrend/${warningId}`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('预警详情趋势接口调用失败，使用模拟数据:', error.message);
    return {
      xAxis: ['8月', '9月', '10月', '11月'],
      series: [
        { name: '预警数（条）', data: [12, 10, 8, 5] },
        { name: '关联事故数（起）', data: [4, 3, 2, 1] }
      ]
    };
  }
};

// 服务质量评估视图
// 服务质量概览数据（核心指标）
export const fetchServiceQualityOverview = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/overview`);
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('服务质量概览接口调用失败，使用模拟数据:', error.message);
    return {
      totalEvaluation: 326,        // 保留总评价数（可用于其他场景）
      satisfactionScore: 89.6,     // 保留整体满意度（可用于其他场景）
      satisfactionYoY: 3.2,        // 保留满意度同比（可用于其他场景）
      satisfactionMoM: 1.8,        // 保留满意度环比（可用于其他场景）
      busOnTimeRate: 96.8,         // 公交准点率（%）
      onTimeRateYoY: 2.5,          // 准点率同比变化（%）
      onTimeRateMoM: 1.2,          // 准点率环比变化（%）
      lateRouteCount: 3,           // 晚点线路数（条）
      complaintTotal: 42,          // 总投诉量（件）
      complaintWeekly: 8,          // 本周新增投诉（件）
      complaintMonthly: 34,        // 本月累计投诉（件）
      complaintReduction: 15.3,     // 投诉量同比减少率（%，负数表示增加）
      lastUpdateTime: '2025-11-25 10:30'   // 最近更新时间
    };
  }
};

// 服务质量趋势数据（近6个月）
export const fetchServiceQualityTrend = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/trend`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('服务质量趋势接口调用失败，使用模拟数据:', error.message);
    const months = ['6月', '7月', '8月', '9月', '10月', '11月'];
    return {
      xAxis: months,
      series: [
        { name: '满意度（分）', data: [85.2, 86.7, 87.5, 88.3, 89.1, 89.6] },
        { name: '评价数（条）', data: [215, 248, 265, 292, 310, 326] }
      ]
    };
  }
};

// 评价等级分布数据
export const fetchEvaluationLevelDistribution = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/evaluationLevelDistribution`);
    if (response.data && response.data.legend && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('评价等级分布接口调用失败，使用模拟数据:', error.message);
    return {
      legend: ['优秀', '良好', '一般', '差评'],
      series: [{
        name: '评价数（条）',
        data: [245, 62, 15, 4]
      }]
    };
  }
};

// 评价列表数据（基础信息）
export const fetchEvaluationList = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/evaluationList`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('评价列表接口调用失败，使用模拟数据:', error.message);
    return [
      {
        eval_id: 'SQ-001',
        name: '市中心公交站点服务评价',
        level: 'excellent',    // 优秀
        area: '市中心',
        service_type: 'public_transit', // 公共交通
        status: 'processed',   // 已处理
        create_time: '2025-11-25 08:15'
      },
      {
        eval_id: 'SQ-002',
        name: '东部高速服务区卫生评价',
        level: 'good',         // 良好
        area: '东部城区',
        service_type: 'service_area', // 服务区
        status: 'processed',   // 已处理
        create_time: '2025-11-25 09:20'
      },
      {
        eval_id: 'SQ-003',
        name: '北岭地铁口指引标识评价',
        level: 'average',      // 一般
        area: '北部新区',
        service_type: 'public_transit', // 公共交通
        status: 'pending',     // 未处理
        create_time: '2025-11-25 10:05'
      }
    ];
  }
};

// 评价详细数据（表格用）
export const fetchEvaluationDetailData = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/evaluationDetailData`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('评价详细数据接口调用失败，使用模拟数据:', error.message);
    const evalContents = [
      '服务人员态度热情，响应及时，非常满意！',
      '设施齐全，环境整洁，整体体验良好',
      '标识不够清晰，找路不太方便，希望优化',
      '卫生状况一般，需要加强清洁频率',
      '工作人员专业度高，解答问题耐心细致',
      '等待时间略长，建议增加服务窗口',
      '环境舒适，配套完善，值得推荐',
      '部分设施损坏未及时维修，影响使用'
    ];

    return Array(20).fill(0).map((_, index) => ({
      eval_id: `SQ-${String(index + 100).slice(1)}`,
      name: `${['市中心', '东部', '西部', '北部', '南部'][index % 5]}${['公交', '地铁', '高速', '服务区', '客运站'][index % 5]}服务评价`,
      level: index % 4 === 0 ? 'excellent' : index % 4 === 1 ? 'good' : index % 4 === 2 ? 'average' : 'poor',
      area: ['东部城区', '南部郊区', '西部县区', '北部新区', '市中心'][index % 5],
      service_type: index % 3 === 0 ? 'public_transit' : index % 3 === 1 ? 'service_area' : 'station',
      score: index % 4 === 0 ? (95 + Math.random() * 5).toFixed(1) :
        index % 4 === 1 ? (85 + Math.random() * 10).toFixed(1) :
          index % 4 === 2 ? (70 + Math.random() * 15).toFixed(1) : (50 + Math.random() * 20).toFixed(1),
      content: evalContents[index % evalContents.length],
      contact: index % 5 === 0 ? `138****${String(1000 + Math.floor(Math.random() * 9000)).slice(-4)}` : '',
      status: index % 3 === 0 ? 'processed' : index % 3 === 1 ? 'processing' : 'pending',
      create_time: `2025-11-2${5 - Math.floor(index / 10)} ${9 + (index % 6)}:${index % 2 === 0 ? '00' : '30'}`,
      handle_time: index % 3 === 0 ? `2025-11-2${5 - Math.floor(index / 10)} ${10 + (index % 6)}:${index % 2 === 0 ? '30' : '00'}` : '',
      handler: index % 3 === 0 ? ['张三', '李四', '王五', '赵六'][index % 4] : '',
      improvement: index % 3 === 0 ? '已优化服务流程，加强人员培训' : index % 3 === 1 ? '正在制定优化方案' : '未处理'
    }));
  }
};

// 单条评价趋势数据（详情弹窗用）
export const fetchEvaluationDetailTrend = async (evalId) => {
  try {
    const response = await requestClient.get(`${BASE_URL}/evaluationDetailTrend/${evalId}`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('评价详情趋势接口调用失败，使用模拟数据:', error.message);
    return {
      xAxis: ['8月', '9月', '10月', '11月'],
      series: [
        { name: '满意度（分）', data: [82.5, 85.3, 87.8, 89.2] },
        { name: '评价数（条）', data: [32, 45, 58, 63] }
      ]
    };
  }
};

// 应急处置效率视图
// 应急处置概览数据（核心指标）
export const fetchDisposalOverview = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/overview`);
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('应急处置概览接口调用失败，使用模拟数据:', error.message);
    return {
      totalEvents: 156,            // 总处置事件数（件）
      averageDisposalTime: 28.5,   // 平均处置时长（分钟）
      completionRate: 92.3,        // 处置完成率（%）
      timelyRate: 87.8,            // 及时处置率（%）
      unfinishedEvents: 12,        // 未完成事件数（件）
      overtimeEvents: 5,           // 超时事件数（件）
      efficiencyYoY: -2.1,         // 处置效率同比变化（-表示时长缩短，效率提升）
      efficiencyMoM: -1.5,         // 处置效率环比变化
      avgResponseTime: 8.2,        // 平均响应时间（分钟）
      responseRate: 94.5,          // 响应达标率（%，如5分钟内响应的比例）
      slowResponseCount: 3,         // 慢响应事件数（件，如超过10分钟响应）
      lastUpdateTime: '2025-11-25 14:30'                  // 最近更新时间
    };
  }
};

// 处置效率趋势数据（近6个月）
export const fetchDisposalTrend = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/trend`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('处置效率趋势接口调用失败，使用模拟数据:', error.message);
    const months = ['6月', '7月', '8月', '9月', '10月', '11月'];
    return {
      xAxis: months,
      series: [
        { name: '平均处置时长（分钟）', data: [35.2, 33.7, 31.5, 30.1, 29.3, 28.5] },
        { name: '处置完成率（%）', data: [85.6, 87.3, 89.1, 90.5, 91.8, 92.3] }
      ]
    };
  }
};

// 处置类型分布数据
export const fetchDisposalTypeDistribution = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/typeDistribution`);
    if (response.data && response.data.legend && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('处置类型分布接口调用失败，使用模拟数据:', error.message);
    return {
      legend: ['交通事故', '设备故障', '道路施工', '自然灾害', '其他事件'],
      series: [{
        name: '事件数（件）',
        data: [68, 32, 25, 15, 16]
      }]
    };
  }
};

// 处置事件列表数据（基础信息）
export const fetchDisposalEventList = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/eventList`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('处置事件列表接口调用失败，使用模拟数据:', error.message);
    return [
      {
        event_id: 'EM-001',
        name: '南部城区主干道交通事故处置',
        type: 'traffic_accident',    // 交通事故
        level: 'medium',             // 中等级别
        area: '南部城区',
        status: 'completed',         // 已完成
        create_time: '2025-11-25 09:10',
        disposal_time: 22            // 处置时长（分钟）
      },
      {
        event_id: 'EM-002',
        name: '西部高速段设备故障抢修',
        type: 'equipment_failure',   // 设备故障
        level: 'high',               // 高级别
        area: '西部高速',
        status: 'processing',        // 处置中
        create_time: '2025-11-25 10:30',
        disposal_time: 18            // 已耗时（分钟）
      },
      {
        event_id: 'EM-003',
        name: '市中心枢纽道路施工围挡',
        type: 'road_construction',   // 道路施工
        level: 'low',                // 低级别
        area: '市中心',
        status: 'pending',           // 待处置
        create_time: '2025-11-25 11:15',
        disposal_time: 0             // 未开始处置
      }
    ];
  }
};

// 处置事件详细数据（表格用）
export const fetchDisposalEventDetailData = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/eventDetailData`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('处置事件详细数据接口调用失败，使用模拟数据:', error.message);
    const descriptions = [
      '多车追尾事故，无人员伤亡，需清理现场并疏导交通',
      '道路监控设备故障，影响交通管控，需紧急抢修',
      '主干道施工占道，需设置围挡并引导绕行',
      '暴雨导致路面积水，需排水作业并封闭部分车道',
      '车辆抛锚占用应急车道，需拖车救援',
      '交通信号灯故障，需临时疏导并维修',
      '施工路段警示标识缺失，需补充设置',
      '大雪导致路面结冰，需撒盐除冰并限速'
    ];

    return Array(20).fill(0).map((_, index) => ({
      event_id: `EM-${String(index + 100).slice(1)}`,
      name: `${['南部城区', '西部高速', '市中心', '北部新区', '东部郊区'][index % 5]}${['交通事故', '设备故障', '道路施工', '自然灾害', '其他事件'][index % 5]}处置`,
      type: index % 5 === 0 ? 'traffic_accident' : index % 5 === 1 ? 'equipment_failure' :
        index % 5 === 2 ? 'road_construction' : index % 5 === 3 ? 'natural_disaster' : 'other',
      level: index % 3 === 0 ? 'low' : index % 3 === 1 ? 'medium' : 'high',
      area: ['南部城区', '西部高速', '市中心', '北部新区', '东部郊区'][index % 5],
      status: index % 4 === 0 ? 'completed' : index % 4 === 1 ? 'processing' :
        index % 4 === 2 ? 'pending' : 'overtime',
      create_time: `2025-11-2${5 - Math.floor(index / 10)} ${9 + (index % 6)}:${index % 2 === 0 ? '00' : '30'}`,
      response_time: index % 4 !== 2 ? `${1 + Math.floor(Math.random() * 5)}` : '0', // 响应时间（分钟）
      disposal_time: index % 4 === 0 ? `${20 + Math.floor(Math.random() * 20)}` :
        index % 4 === 1 ? `${15 + Math.floor(Math.random() * 15)}` : '0',
      expected_time: `${30 + Math.floor(Math.random() * 20)}`, // 预计处置时长
      handler_team: ['应急一队', '应急二队', '维修组', '交通疏导组', '抢险组'][index % 5],
      handler: ['张三', '李四', '王五', '赵六', '孙七'][index % 5],
      description: descriptions[index % descriptions.length],
      result: index % 4 === 0 ? '处置完成，现场恢复正常' :
        index % 4 === 1 ? '处置中，已完成初步管控' : '未处置',
      feedback: index % 4 === 0 ? '处置及时，效果良好' : ''
    }));
  }
};

// 单事件处置趋势数据（详情弹窗用）
export const fetchEventDisposalTrend = async (eventId) => {
  try {
    const response = await requestClient.get(`${BASE_URL}/eventDisposalTrend/${eventId}`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('事件处置趋势接口调用失败，使用模拟数据:', error.message);
    return {
      xAxis: ['8月', '9月', '10月', '11月'],
      series: [
        { name: '平均处置时长（分钟）', data: [32.5, 30.1, 29.4, 28.2] },
        { name: '处置完成率（%）', data: [88.3, 89.7, 91.2, 92.5] }
      ]
    };
  }
};
