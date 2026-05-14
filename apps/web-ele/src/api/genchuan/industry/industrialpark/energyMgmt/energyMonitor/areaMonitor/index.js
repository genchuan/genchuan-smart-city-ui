// index.js - 分区能耗监测 API（支持模拟数据）
import { requestClient } from '#/api/request';

// ==================== 模拟数据开关 ====================
const USE_MOCK = true;  // 上线前改为 false 即可切换到真实接口

// ==================== 模拟数据生成工具 ====================
/**
 * 生成分页格式的模拟返回数据
 * @param {Array} list 数据列表
 * @param {number} total 总记录数
 * @returns {Object} 分页结果对象
 */
function mockPageResult(list, total) {
  return { list, total };
}

/**
 * 模拟成功响应（布尔值）
 * @returns {boolean} true
 */
function mockSuccessResult() {
  return true;
}

/**
 * 模拟获取详情成功响应
 * @param {Object} detail 详情对象
 * @returns {Object} 原样返回详情
 */
function mockGetDetailResult(detail) {
  return detail;
}

/**
 * 模拟图表数据（分区能耗分布态势）
 * @returns {Object} 包含地图数据、柱状图数据、统计卡片数据的模拟结果
 */
function mockChartResult() {
  return {
    areaMapData: [
      { areaId: 1, lon: 118.67, lat: 24.89, energy: 8562.3, status: 'normal', name: '一号楼办公区' },
      { areaId: 2, lon: 118.68, lat: 24.90, energy: 12580.5, status: 'exception', name: '二号楼研发区' },
      { areaId: 3, lon: 118.66, lat: 24.91, energy: 6320.2, status: 'normal', name: '三号楼生产区' }
    ],
    highEnergyArea: [
      { id: 2, name: '二号楼研发区', energy: 12580.5 }
    ],
    areaEnergyBar: [
      { name: '一号楼办公区', value: 8562.3 },
      { name: '二号楼研发区', value: 12580.5 },
      { name: '三号楼生产区', value: 6320.2 }
    ],
    unitEnergyBar: [
      { name: '一号楼办公区', value: 1.71 },
      { name: '二号楼研发区', value: 2.10 },
      { name: '三号楼生产区', value: 1.26 }
    ],
    totalAreas: 3,
    normalCount: 2,
    exceptionCount: 1,
    totalEnergy: 27462.0
  };
}

// ==================== 模拟数据池（分区基础数据） ====================
const mockAreaNames = ['一号楼办公区', '二号楼研发区', '三号楼生产区', '四号楼宿舍区', '五号楼食堂', '六号楼仓库'];
const mockEnergyStatuses = ['正常能耗', '能耗异常'];
const mockUsers = ['admin', 'energy_operator', 'maintainer'];

/**
 * 生成单页模拟分区列表（用于分页请求）
 * @param {number} pageNo 页码，默认1
 * @param {number} pageSize 每页条数，默认10
 * @returns {Array} 模拟分区数据数组
 */
function generateMockAreaList(pageNo = 1, pageSize = 10) {
  const start = (pageNo - 1) * pageSize;
  const list = [];
  for (let i = 1; i <= pageSize; i++) {
    const id = start + i;
    const isNormal = Math.random() > 0.2;
    list.push({
      id,
      areaName: mockAreaNames[(id - 1) % mockAreaNames.length] + (id > 6 ? `-${id}` : ''),
      areaSize: Math.floor(Math.random() * 8000) + 1000,
      totalEnergy: parseFloat((Math.random() * 15000 + 3000).toFixed(2)),
      unitEnergy: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
      energyStatus: isNormal ? '正常能耗' : '能耗异常',
      deviceCount: Math.floor(Math.random() * 30) + 5,
      yoyChange: parseFloat((Math.random() * 20 - 10).toFixed(2)),
      momChange: parseFloat((Math.random() * 15 - 8).toFixed(2)),
      handleUser: mockUsers[Math.floor(Math.random() * mockUsers.length)],
      creator: 'admin',
      createTime: Date.now() - Math.random() * 86400000 * 30,
      updateTime: Date.now() - Math.random() * 86400000,
    });
  }
  return list;
}

let allMockData = null;
/**
 * 获取全量模拟分区数据（用于筛选和分页）
 * @returns {Array} 全量模拟数据（懒加载，仅生成一次）
 */
function getAllMockData() {
  if (!allMockData) {
    allMockData = [];
    for (let i = 1; i <= 48; i++) {
      const isNormal = Math.random() > 0.2;
      allMockData.push({
        id: i,
        areaName: mockAreaNames[(i - 1) % mockAreaNames.length] + (i > 6 ? `-${i}` : ''),
        areaSize: Math.floor(Math.random() * 8000) + 1000,
        totalEnergy: parseFloat((Math.random() * 15000 + 3000).toFixed(2)),
        unitEnergy: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
        energyStatus: isNormal ? '正常能耗' : '能耗异常',
        deviceCount: Math.floor(Math.random() * 30) + 5,
        yoyChange: parseFloat((Math.random() * 20 - 10).toFixed(2)),
        momChange: parseFloat((Math.random() * 15 - 8).toFixed(2)),
        handleUser: mockUsers[Math.floor(Math.random() * mockUsers.length)],
        creator: 'admin',
        createTime: Date.now() - Math.random() * 86400000 * 30,
        updateTime: Date.now() - Math.random() * 86400000,
      });
    }
  }
  return allMockData;
}

// ==================== 模拟接口实现（供开发调试用） ====================

/**
 * 模拟分页查询分区能耗监测列表
 * @param {Object} params 查询参数（areaName, energyStatus, pageNo, pageSize）
 * @returns {Promise<Object>} 分页结果
 */
async function mockGetAreaMonitorPage(params) {
  console.log('[Mock] 分页请求参数:', params);
  let data = [...getAllMockData()];
  if (params.areaName) {
    data = data.filter(item => item.areaName.includes(params.areaName));
  }
  if (params.energyStatus) {
    data = data.filter(item => item.energyStatus === params.energyStatus);
  }
  const total = data.length;
  const pageNo = params.pageNo || 1;
  const pageSize = params.pageSize || 10;
  const start = (pageNo - 1) * pageSize;
  const list = data.slice(start, start + pageSize);
  return mockPageResult(list, total);
}

/**
 * 模拟创建/划分能耗监测区域
 * @param {Object} data { areaName, areaSize }
 * @returns {Promise<boolean>}
 */
async function mockCreateAreaMonitor(data) {
  console.log('[Mock] 划分区域', data);
  return mockSuccessResult();
}

/**
 * 模拟统计区域能耗
 * @param {Object} data { ids: 区域ID数组 }
 * @returns {Promise<boolean>}
 */
async function mockStatAreaMonitor(data) {
  console.log('[Mock] 统计区域能耗', data);
  return mockSuccessResult();
}

/**
 * 模拟分析区域能耗（同比环比）
 * @param {Object} data { ids: 区域ID数组 }
 * @returns {Promise<boolean>}
 */
async function mockAnalyzeAreaMonitor(data) {
  console.log('[Mock] 分析区域能耗', data);
  return mockSuccessResult();
}

/**
 * 模拟预警区域能耗
 * @param {Object} data { ids: 区域ID数组 }
 * @returns {Promise<boolean>}
 */
async function mockAlarmAreaMonitor(data) {
  console.log('[Mock] 预警区域能耗', data);
  return mockSuccessResult();
}

/**
 * 模拟导出分区能耗数据（Excel）
 * @param {Object} params 导出筛选参数
 * @returns {Promise<Blob>}
 */
async function mockExportAreaMonitorExcel(params) {
  console.log('[Mock] 导出数据', params);
  return new Blob(['模拟 Excel 内容'], { type: 'application/vnd.ms-excel' });
}

/**
 * 模拟获取分区能耗详情
 * @param {Object} params { id: 区域ID }
 * @returns {Promise<Object>} 区域详情
 */
async function mockGetAreaMonitorDetail(params) {
  console.log('[Mock] 获取详情', params);
  const id = params.id;
  const detail = getAllMockData().find(item => item.id === id);
  return mockGetDetailResult(detail || getAllMockData()[0]);
}

/**
 * 模拟对比区域能耗（同比、环比）
 * @param {Object} data { id: 区域ID }
 * @returns {Promise<Object>} 同比环比数据
 */
async function mockCompareAreaMonitor(data) {
  console.log('[Mock] 对比区域能耗', data);
  return {
    yoyData: { lastYear: 9200.5, thisYear: 8562.3, diff: -638.2 },
    momData: { lastMonth: 8700.1, thisMonth: 8562.3, diff: -137.8 }
  };
}

/**
 * 模拟排查异常能耗区域
 * @param {number} id 区域ID
 * @returns {Promise<boolean>}
 */
async function mockCheckAreaMonitor(id) {
  console.log('[Mock] 排查区域', id);
  return mockSuccessResult();
}

/**
 * 模拟提交能耗优化方案
 * @param {Object} data { id: 区域ID, optimizePlan: 优化方案 }
 * @returns {Promise<boolean>}
 */
async function mockOptimizeAreaMonitor(data) {
  console.log('[Mock] 优化区域', data);
  return mockSuccessResult();
}

/**
 * 模拟获取分区能耗分布态势图表数据
 * @param {Object} params 时间范围等
 * @returns {Promise<Object>} 图表数据
 */
async function mockGetAreaMonitorChart(params) {
  console.log('[Mock] 图表请求', params);
  return mockChartResult();
}

/**
 * 模拟获取用户详情
 * @param {string} userId 用户账号
 * @returns {Promise<Object>} 用户信息
 */
async function mockGetUserDetail(userId) {
  console.log('[Mock] 获取用户详情', userId);
  return {
    id: userId,
    nickname: userId === 'admin' ? '管理员' : (userId === 'energy_operator' ? '能耗操作员' : '维护工程师'),
    userName: userId,
    deptName: '技术部',
  };
}

/**
 * 模拟根据区域ID获取关联设备列表
 * @param {number} areaId 区域ID
 * @returns {Promise<Object>} 设备列表
 */
async function mockGetDeviceListByArea(areaId) {
  console.log('[Mock] 获取区域设备列表', areaId);
  return {
    list: [
      { id: 1, deviceName: '电表_A01', deviceType: '电表', energyValue: 123.5, status: '正常' },
      { id: 2, deviceName: '水表_B02', deviceType: '水表', energyValue: 45.2, status: '正常' }
    ]
  };
}

// ==================== 真实接口（上线时关闭 USE_MOCK 即可切换） ====================

/**
 * 分页查询分区能耗监测列表
 * @param {Object} params 查询参数（areaName, energyStatus, pageNo, pageSize）
 * @returns {Promise} 分页结果
 */
export function getAreaMonitorPage(params) {
  if (USE_MOCK) {
    return mockGetAreaMonitorPage(params);
  }
  return requestClient.get('/energymgmt/area-monitor/page', { params });
}

/**
 * 创建/划分能耗监测区域
 * @param {Object} data { areaName, areaSize }
 * @returns {Promise} 操作结果
 */
export function createAreaMonitor(data) {
  if (USE_MOCK) {
    return mockCreateAreaMonitor(data);
  }
  return requestClient.post('/energymgmt/area-monitor/create', data);
}

/**
 * 统计区域能耗（批量）
 * @param {Object} data { ids: 区域ID数组 }
 * @returns {Promise} 操作结果
 */
export function statAreaMonitor(data) {
  if (USE_MOCK) {
    return mockStatAreaMonitor(data);
  }
  return requestClient.post('/energymgmt/area-monitor/stat', data);
}

/**
 * 分析区域能耗（同比环比）
 * @param {Object} data { ids: 区域ID数组 }
 * @returns {Promise} 操作结果
 */
export function analyzeAreaMonitor(data) {
  if (USE_MOCK) {
    return mockAnalyzeAreaMonitor(data);
  }
  return requestClient.post('/energymgmt/area-monitor/analyze', data);
}

/**
 * 预警区域能耗（开启高能耗监控）
 * @param {Object} data { ids: 区域ID数组 }
 * @returns {Promise} 操作结果
 */
export function alarmAreaMonitor(data) {
  if (USE_MOCK) {
    return mockAlarmAreaMonitor(data);
  }
  return requestClient.post('/energymgmt/area-monitor/alarm', data);
}

/**
 * 导出分区能耗数据为Excel文件
 * @param {Object} params 导出筛选条件
 * @returns {Promise<Blob>} Excel文件数据
 */
export function exportAreaMonitorExcel(params) {
  if (USE_MOCK) {
    return mockExportAreaMonitorExcel(params);
  }
  return requestClient.download('/energymgmt/area-monitor/export', params);
}

/**
 * 获取分区能耗详情
 * @param {Object} params { id: 区域ID }
 * @returns {Promise} 区域详情
 */
export function getAreaMonitorDetail(params) {
  if (USE_MOCK) {
    return mockGetAreaMonitorDetail(params);
  }
  return requestClient.get('/energymgmt/area-monitor/get', { params });
}

/**
 * 对比分析单个区域能耗（同比、环比）
 * @param {Object} data { id: 区域ID }
 * @returns {Promise} 对比数据 { yoyData, momData }
 */
export function compareAreaMonitor(data) {
  if (USE_MOCK) {
    return mockCompareAreaMonitor(data);
  }
  return requestClient.post('/energymgmt/area-monitor/compare', data);
}

/**
 * 排查异常能耗区域
 * @param {number} id 区域ID
 * @returns {Promise} 操作结果
 */
export function checkAreaMonitor(id) {
  if (USE_MOCK) {
    return mockCheckAreaMonitor(id);
  }
  return requestClient.put('/energymgmt/area-monitor/check', { id });
}

/**
 * 提交能耗优化方案
 * @param {Object} data { id: 区域ID, optimizePlan: 优化方案文本 }
 * @returns {Promise} 操作结果
 */
export function optimizeAreaMonitor(data) {
  if (USE_MOCK) {
    return mockOptimizeAreaMonitor(data);
  }
  return requestClient.put('/energymgmt/area-monitor/optimize', data);
}

/**
 * 获取分区能耗分布态势图表数据（包含地图、柱状图、统计卡片）
 * @param {Object} params 时间范围等筛选条件
 * @returns {Promise} 图表数据
 */
export function getAreaMonitorChart(params) {
  if (USE_MOCK) {
    return mockGetAreaMonitorChart(params);
  }
  return requestClient.get('/energymgmt/area-monitor/chart', { params });
}

/**
 * 获取用户详情（用于展示操作人信息）
 * @param {string} userId 用户ID/账号
 * @returns {Promise} 用户信息
 */
export function getUserDetail(userId) {
  if (USE_MOCK) {
    return mockGetUserDetail(userId);
  }
  return requestClient.get('/system/user/get', { params: { id: userId } });
}

/**
 * 根据区域ID获取关联的设备列表（用于钻取设备明细）
 * @param {number} areaId 区域ID
 * @returns {Promise} 设备列表
 */
export function getDeviceListByArea(areaId) {
  if (USE_MOCK) {
    return mockGetDeviceListByArea(areaId);
  }
  return requestClient.get('/energymgmt/energy-collect/list-by-area', { params: { areaId } });
}
