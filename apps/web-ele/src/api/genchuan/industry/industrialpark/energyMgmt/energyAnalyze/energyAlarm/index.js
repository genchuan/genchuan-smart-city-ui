// index.js - 分区能耗监测 API（支持模拟数据）
import { requestClient } from '#/api/request';

// ==================== 模拟数据开关 ====================
const USE_MOCK = true;  // 上线前改为 false 即可切换到真实接口

// 模拟数据生成工具
function mockPageResult(list, total) {
  return { list, total };
}
function mockSuccessResult() {
  return true;
}
function mockGetDetailResult(detail) {
  return detail;
}
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

// 生成模拟分区数据
const mockAreaNames = ['一号楼办公区', '二号楼研发区', '三号楼生产区', '四号楼宿舍区', '五号楼食堂', '六号楼仓库'];
const mockEnergyStatuses = ['正常能耗', '能耗异常'];
const mockUsers = ['admin', 'energy_operator', 'maintainer'];

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

// ==================== 模拟接口实现 ====================
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

async function mockCreateAreaMonitor(data) {
  console.log('[Mock] 划分区域', data);
  return mockSuccessResult();
}

async function mockStatAreaMonitor(data) {
  console.log('[Mock] 统计区域能耗', data);
  return mockSuccessResult();
}

async function mockAnalyzeAreaMonitor(data) {
  console.log('[Mock] 分析区域能耗', data);
  return mockSuccessResult();
}

async function mockAlarmAreaMonitor(data) {
  console.log('[Mock] 预警区域能耗', data);
  return mockSuccessResult();
}

async function mockExportAreaMonitorExcel(params) {
  console.log('[Mock] 导出数据', params);
  return new Blob(['模拟 Excel 内容'], { type: 'application/vnd.ms-excel' });
}

async function mockGetAreaMonitorDetail(params) {
  console.log('[Mock] 获取详情', params);
  const id = params.id;
  const detail = getAllMockData().find(item => item.id === id);
  return mockGetDetailResult(detail || getAllMockData()[0]);
}

async function mockCompareAreaMonitor(data) {
  console.log('[Mock] 对比区域能耗', data);
  return {
    yoyData: { lastYear: 9200.5, thisYear: 8562.3, diff: -638.2 },
    momData: { lastMonth: 8700.1, thisMonth: 8562.3, diff: -137.8 }
  };
}

async function mockCheckAreaMonitor(id) {
  console.log('[Mock] 排查区域', id);
  return mockSuccessResult();
}

async function mockOptimizeAreaMonitor(data) {
  console.log('[Mock] 优化区域', data);
  return mockSuccessResult();
}

async function mockGetAreaMonitorChart(params) {
  console.log('[Mock] 图表请求', params);
  return mockChartResult();
}

async function mockGetUserDetail(userId) {
  console.log('[Mock] 获取用户详情', userId);
  return {
    id: userId,
    nickname: userId === 'admin' ? '管理员' : (userId === 'energy_operator' ? '能耗操作员' : '维护工程师'),
    userName: userId,
    deptName: '技术部',
  };
}

async function mockGetDeviceListByArea(areaId) {
  console.log('[Mock] 获取区域设备列表', areaId);
  return {
    list: [
      { id: 1, deviceName: '电表_A01', deviceType: '电表', energyValue: 123.5, status: '正常' },
      { id: 2, deviceName: '水表_B02', deviceType: '水表', energyValue: 45.2, status: '正常' }
    ]
  };
}

// ==================== 真实接口 ====================
export function getAreaMonitorPage(params) {
  if (USE_MOCK) {
    return mockGetAreaMonitorPage(params);
  }
  return requestClient.get('/energymgmt/area-monitor/page', { params });
}

export function createAreaMonitor(data) {
  if (USE_MOCK) {
    return mockCreateAreaMonitor(data);
  }
  return requestClient.post('/energymgmt/area-monitor/create', data);
}

export function statAreaMonitor(data) {
  if (USE_MOCK) {
    return mockStatAreaMonitor(data);
  }
  return requestClient.post('/energymgmt/area-monitor/stat', data);
}

export function analyzeAreaMonitor(data) {
  if (USE_MOCK) {
    return mockAnalyzeAreaMonitor(data);
  }
  return requestClient.post('/energymgmt/area-monitor/analyze', data);
}

export function alarmAreaMonitor(data) {
  if (USE_MOCK) {
    return mockAlarmAreaMonitor(data);
  }
  return requestClient.post('/energymgmt/area-monitor/alarm', data);
}

export function exportAreaMonitorExcel(params) {
  if (USE_MOCK) {
    return mockExportAreaMonitorExcel(params);
  }
  return requestClient.download('/energymgmt/area-monitor/export', params);
}

export function getAreaMonitorDetail(params) {
  if (USE_MOCK) {
    return mockGetAreaMonitorDetail(params);
  }
  return requestClient.get('/energymgmt/area-monitor/get', { params });
}

export function compareAreaMonitor(data) {
  if (USE_MOCK) {
    return mockCompareAreaMonitor(data);
  }
  return requestClient.post('/energymgmt/area-monitor/compare', data);
}

export function checkAreaMonitor(id) {
  if (USE_MOCK) {
    return mockCheckAreaMonitor(id);
  }
  return requestClient.put('/energymgmt/area-monitor/check', { id });
}

export function optimizeAreaMonitor(data) {
  if (USE_MOCK) {
    return mockOptimizeAreaMonitor(data);
  }
  return requestClient.put('/energymgmt/area-monitor/optimize', data);
}

export function getAreaMonitorChart(params) {
  if (USE_MOCK) {
    return mockGetAreaMonitorChart(params);
  }
  return requestClient.get('/energymgmt/area-monitor/chart', { params });
}

export function getUserDetail(userId) {
  if (USE_MOCK) {
    return mockGetUserDetail(userId);
  }
  return requestClient.get('/system/user/get', { params: { id: userId } });
}

export function getDeviceListByArea(areaId) {
  if (USE_MOCK) {
    return mockGetDeviceListByArea(areaId);
  }
  return requestClient.get('/energymgmt/energy-collect/list-by-area', { params: { areaId } });
}
