// ==================== index.js ====================
// 能耗周期报表 API 接口层（支持模拟数据切换）
// 文件路径: src/api/genchuan/industry/industrialPark/energyMgmt/energyReport/cycleReport/index.js
// 对应后端接口: /energymgmt/energy-cycle-report/*

import { requestClient } from '#/api/request';

// 是否使用模拟数据（上线前改为 false 即可切换到真实接口）
const USE_MOCK = true;

// ========== 模拟数据生成（可在此处修改模拟数据内容） ==========
// 模拟报表列表数据，用于分页查询展示
const mockReportList = [];
const mockReportTypes = ['日报', '周报', '月报', '季报', '半年报', '年报', '自定义报表'];
const mockGenerateStatus = ['已生成', '生成中', '生成失败'];

// 生成 36 条模拟报表记录（涵盖各种类型）
for (let i = 1; i <= 36; i++) {
  const reportType = mockReportTypes[i % 7];
  const startDate = new Date(2025, 4, (i % 28) + 1);
  const endDate = new Date(2025, 4, (i % 28) + 7);
  mockReportList.push({
    id: i,
    reportName: `${startDate.toLocaleDateString()} ${reportType}`,
    reportType: reportType,
    reportTime: `${startDate.toISOString().slice(0, 19).replace('T', ' ')} 至 ${endDate.toISOString().slice(0, 19).replace('T', ' ')}`,
    totalEnergy: parseFloat((Math.random() * 50000 + 10000).toFixed(1)),    // 总能耗量 (kWh)
    unitEnergy: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),          // 单位能耗 (kWh/㎡)
    saveEnergy: parseFloat((Math.random() * 5000 + 100).toFixed(1)),       // 节能总量 (kWh)
    alarmCount: Math.floor(Math.random() * 20),                            // 异常预警数
    controlDeviceCount: Math.floor(Math.random() * 50 + 5),                // 管控设备数
    creator: ['admin', 'energy_user', 'monitor'][i % 3],                   // 操作人姓名
    creatorUserId: (i % 3) + 1,                                           // 操作人 ID
    createTime: Date.now() - Math.random() * 86400000 * 30,               // 报表生成时间
    updateTime: Date.now(),
    generateStatus: mockGenerateStatus[i % 3],                            // 生成状态
    exportCount: Math.floor(Math.random() * 10),                          // 导出次数
    yoyChange: parseFloat((Math.random() * 20 - 10).toFixed(1)),          // 同比变化(%)
    momChange: parseFloat((Math.random() * 15 - 5).toFixed(1)),           // 环比变化(%)
  });
}

/**
 * 模拟分页查询报表列表
 * @param {Object} params - 查询参数
 * @param {string} [params.reportType] - 报表类型（日报/周报/...）
 * @param {string} [params.generateStatus] - 生成状态
 * @param {string} [params.reportTime] - 统计时间范围，格式 "start,end"
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise<{list: Array, total: number}>}
 */
async function mockGetPage(params) {
  let data = [...mockReportList];
  if (params.reportType) {
    data = data.filter(item => item.reportType === params.reportType);
  }
  if (params.generateStatus) {
    data = data.filter(item => item.generateStatus === params.generateStatus);
  }
  if (params.reportTime) {
    const [start, end] = params.reportTime.split(',');
    if (start && end) {
      data = data.filter(item => item.reportTime.includes(start) || item.reportTime.includes(end));
    }
  }
  const total = data.length;
  const pageNo = params.pageNo || 1;
  const pageSize = params.pageSize || 10;
  const start = (pageNo - 1) * pageSize;
  const list = data.slice(start, start + pageSize);
  return { list, total };
}

/**
 * 模拟图表数据（能耗管理周期分析报表）
 * @param {Object} params - 请求参数
 * @param {number} params.reportId - 报表 ID
 * @returns {Promise<Object>} 图表数据，包含卡片指标、趋势线、柱状图、饼图、地图数据
 */
async function mockGetChart(params) {
  return {
    cardData: {
      totalEnergy: 85620.5,      // 总能耗量 (kWh)
      unitEnergy: 1.68,          // 单位能耗 (kWh/㎡)
      saveEnergy: 5280.6,        // 节能总量 (kWh)
      alarmCount: 8,             // 异常预警数
      controlDeviceCount: 10     // 管控设备数
    },
    // 能耗趋势折线图数据（按日）
    energyTrendLine: [
      { day: '05-01', value: 2800.5 }, { day: '05-02', value: 2750.2 },
      { day: '05-03', value: 2900.3 }, { day: '05-04', value: 2850.1 },
      { day: '05-05', value: 2700.8 }, { day: '05-06', value: 2650.4 }
    ],
    // 节能趋势折线图数据
    saveTrendLine: [
      { day: '05-01', value: 180.5 }, { day: '05-02', value: 175.2 },
      { day: '05-03', value: 190.3 }, { day: '05-04', value: 185.1 },
      { day: '05-05', value: 170.8 }, { day: '05-06', value: 165.4 }
    ],
    // 预警趋势折线图数据
    alarmTrendLine: [
      { day: '05-01', value: 0 }, { day: '05-02', value: 1 },
      { day: '05-03', value: 0 }, { day: '05-04', value: 2 },
      { day: '05-05', value: 0 }, { day: '05-06', value: 1 }
    ],
    // 各区域能耗分布柱状图数据
    areaEnergyBar: [
      { name: '一号楼', value: 25680.5 }, { name: '二号楼', value: 35620.8 },
      { name: '三号楼', value: 18650.3 }
    ],
    // 各设备能耗分布柱状图数据
    deviceEnergyBar: [
      { name: '中央空调', value: 18560.2 }, { name: '照明系统', value: 12580.5 },
      { name: '水泵', value: 8560.3 }
    ],
    // 同比环比能耗差值柱状图数据
    diffBar: [
      { name: '同比', value: -2580.6 }, { name: '环比', value: -1250.8 }
    ],
    // 能耗类型占比饼图数据
    energyTypePie: [
      { name: '电', value: 70 }, { name: '水', value: 15 }, { name: '气', value: 15 }
    ],
    // 区域能耗占比饼图数据
    areaEnergyPie: [
      { name: '一号楼', value: 30 }, { name: '二号楼', value: 42 },
      { name: '园区公共区', value: 28 }
    ],
    // 节能方式占比饼图数据
    saveTypePie: [
      { name: '空调管控', value: 45 }, { name: '照明管控', value: 35 },
      { name: '设备管控', value: 20 }
    ],
    // 能耗区域分布地图数据（含经纬度、能耗值、是否高能耗标注）
    areaMapData: [
      { areaId: 1, areaName: '一号楼', lon: 118.67, lat: 24.89, energy: 25680.5, isHigh: false },
      { areaId: 2, areaName: '二号楼', lon: 118.68, lat: 24.90, energy: 35620.8, isHigh: true },
      { areaId: 3, areaName: '园区公共区', lon: 118.675, lat: 24.895, energy: 18650.3, isHigh: false }
    ]
  };
}

/**
 * 模拟获取报表详情（含各维度明细数据）
 * @param {Object} params - { id: 报表ID }
 * @returns {Promise<Object>} 报表详情及明细数据
 */
async function mockGetDetail(params) {
  return {
    id: params.id,
    reportType: '月报',
    reportTime: '2025-05-01 00:00:00 至 2025-05-31 23:59:59',
    totalEnergy: 85620.5,
    unitEnergy: 1.68,
    saveEnergy: 5280.6,
    alarmCount: 8,
    controlDeviceCount: 10,
    detailData: {
      // 能耗采集明细（对应数据库表 energy_collect）
      energyCollectList: [
        { collectTime: '2025-05-01 08:00:00', energyValue: 280.5, deviceName: '空调主机', areaName: '一号楼' },
        { collectTime: '2025-05-01 12:00:00', energyValue: 350.2, deviceName: '照明系统', areaName: '二号楼' }
      ],
      // 分区监测数据（对应数据库表 area_monitor）
      areaMonitorList: [
        { areaName: '一号楼', unitEnergy: 1.52, areaArea: 16800, totalEnergy: 25536 },
        { areaName: '二号楼', unitEnergy: 1.85, areaArea: 19250, totalEnergy: 35612.5 }
      ],
      // 节能策略执行明细（对应数据库表 strategy_set）
      strategyList: [
        { strategyName: '空调智能温控策略', saveEnergy: 280.5, executeTime: '2025-05-01', deviceName: '中央空调' }
      ],
      // 能耗预警记录（对应数据库表 energy_alarm）
      alarmList: [
        { alarmType: '能耗超标', alarmContent: '单位能耗超过阈值1.5', createTime: '2025-05-03 14:30:00', handleStatus: '已处理' }
      ],
      // 管控设备记录（对应数据库表 device_control）
      deviceControlList: [
        { deviceName: '中央空调', deviceType: '空调', status: '管控中', bindTime: '2025-04-01' }
      ]
    }
  };
}

// ========== 以下是真实接口函数（与模拟函数签名保持一致） ==========
// 切换 USE_MOCK = false 后生效，需确保后端接口已实现

/**
 * 分页查询能耗周期报表列表
 * GET /energymgmt/energy-cycle-report/page
 * @permission energymgmt:energy-cycle-report:query
 * @param {Object} params - 查询参数
 * @param {string} [params.reportType] - 报表类型
 * @param {string} [params.generateStatus] - 生成状态
 * @param {string} [params.reportTime] - 时间范围（start,end）
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 */
export function getEnergyCycleReportPage(params) {
  return USE_MOCK ? mockGetPage(params) : requestClient.get('/energymgmt/energy-cycle-report/page', { params });
}

/**
 * 生成能耗周期报表
 * POST /energymgmt/energy-cycle-report/generate
 * @permission energymgmt:energy-cycle-report:generate
 * @param {Object} data - 生成参数
 * @param {string} data.reportType - 报表类型（日报/周报/.../自定义报表）
 * @param {string} data.timeRange - 统计时间范围，格式 "start,end"
 * @returns {Promise<{success: boolean}>}
 */
export function generateEnergyCycleReport(data) {
  return USE_MOCK ? Promise.resolve({ data: true }) : requestClient.post('/energymgmt/energy-cycle-report/generate', data);
}

/**
 * 导出报表列表（支持筛选条件）
 * GET /energymgmt/energy-cycle-report/export
 * @permission energymgmt:energy-cycle-report:export
 * @param {Object} params - 同分页查询参数
 * @returns {Promise<Blob>} Excel 文件流
 */
export function exportEnergyCycleReport(params) {
  return USE_MOCK ? Promise.resolve(new Blob()) : requestClient.download('/energymgmt/energy-cycle-report/export', params);
}

/**
 * 导出单条报表完整明细数据
 * GET /energymgmt/energy-cycle-report/row-export?id={id}
 * @param {number} id - 报表ID
 * @returns {Promise<Blob>} Excel 文件流
 */
export function rowExportEnergyCycleReport(id) {
  return USE_MOCK ? Promise.resolve(new Blob()) : requestClient.download(`/energymgmt/energy-cycle-report/row-export?id=${id}`);
}

/**
 * 获取报表详情（含各维度明细数据）
 * GET /energymgmt/energy-cycle-report/get
 * @param {Object} params - { id: 报表ID }
 * @returns {Promise<Object>} 报表详情
 */
export function getEnergyCycleReportDetail(params) {
  return USE_MOCK ? mockGetDetail(params) : requestClient.get('/energymgmt/energy-cycle-report/get', { params });
}

/**
 * 获取能耗管理周期分析报表图表数据
 * GET /energymgmt/energy-cycle-report/chart
 * @permission energymgmt:energy-cycle-report:query
 * @param {Object} params - { reportId: 报表ID }
 * @returns {Promise<Object>} 卡片、趋势、分布、地图等图表数据
 */
export function getEnergyCycleReportChart(params) {
  return USE_MOCK ? mockGetChart(params) : requestClient.get('/energymgmt/energy-cycle-report/chart', { params });
}

/**
 * 开启报表定时自动生成
 * POST /energymgmt/energy-cycle-report/start-auto
 * @returns {Promise<{success: boolean}>}
 */
export function startAutoGenerate() {
  return USE_MOCK ? Promise.resolve({ data: true }) : requestClient.post('/energymgmt/energy-cycle-report/start-auto');
}

/**
 * 关闭报表定时自动生成
 * POST /energymgmt/energy-cycle-report/stop-auto
 * @returns {Promise<{success: boolean}>}
 */
export function stopAutoGenerate() {
  return USE_MOCK ? Promise.resolve({ data: true }) : requestClient.post('/energymgmt/energy-cycle-report/stop-auto');
}

/**
 * 获取操作用户信息（关联 sys_user 表）
 * GET /system/user/get
 * @param {number|string} userId - 用户ID
 * @returns {Promise<{id, username, nickname}>}
 */
export function getUserInfo(userId) {
  return USE_MOCK
    ? Promise.resolve({ id: userId, username: `user${userId}`, nickname: `用户${userId}` })
    : requestClient.get('/system/user/get', { params: { id: userId } });
}

// ========== 以下为各明细弹窗所需的分页查询接口（模拟数据） ==========
// 真实接口需要根据后端实际路径调整

/**
 * 查询能耗采集明细（用于总能耗量钻取）
 * 对应数据库表 energy_collect，关联字段 collect_time
 */
export function getEnergyCollectDetail(params) {
  return USE_MOCK
    ? Promise.resolve({ list: mockReportList[0]?.detailData?.energyCollectList || [], total: 2 })
    : requestClient.get('/energymgmt/energy-collect/page', { params });
}

/**
 * 查询分区监测明细（用于单位能耗钻取）
 * 对应数据库表 area_monitor，关联字段 area_id
 */
export function getAreaMonitorDetail(params) {
  return USE_MOCK
    ? Promise.resolve({ list: mockReportList[0]?.detailData?.areaMonitorList || [], total: 2 })
    : requestClient.get('/energymgmt/area-monitor/page', { params });
}

/**
 * 查询节能策略执行明细（用于节能总量钻取）
 * 对应数据库表 strategy_set，关联字段 execute_time
 */
export function getStrategyDetailPage(params) {
  return USE_MOCK
    ? Promise.resolve({ list: mockReportList[0]?.detailData?.strategyList || [], total: 1 })
    : requestClient.get('/energymgmt/strategy-set/page', { params });
}

/**
 * 查询能耗预警记录（用于异常预警数钻取）
 * 对应数据库表 energy_alarm，关联字段 create_time
 */
export function getEnergyAlarmDetail(params) {
  return USE_MOCK
    ? Promise.resolve({ list: mockReportList[0]?.detailData?.alarmList || [], total: 1 })
    : requestClient.get('/energymgmt/energy-alarm/page', { params });
}

/**
 * 查询管控设备明细（用于管控设备数钻取）
 * 对应数据库表 device_control，关联字段 status
 */
export function getDeviceControlDetail(params) {
  return USE_MOCK
    ? Promise.resolve({ list: mockReportList[0]?.detailData?.deviceControlList || [], total: 1 })
    : requestClient.get('/energymgmt/device-control/page', { params });
}
