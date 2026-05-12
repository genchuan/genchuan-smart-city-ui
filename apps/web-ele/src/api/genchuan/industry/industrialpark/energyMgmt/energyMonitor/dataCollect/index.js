// index.js - 能耗采集 API（支持模拟数据，已修正返回格式）
import { requestClient } from '#/api/request';

// ==================== 模拟数据开关 ====================
const USE_MOCK = true;  // 上线前改为 false 即可切换到真实接口

// 模拟数据生成工具（直接返回组件期望的格式，无 code/data 包装）
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
    deviceCount: 28,
    normalCount: 24,
    exceptionCount: 4,
    totalEnergy: 12450.8,
    realTimeTrend: [
      { time: '00:00', value: 520.3 }, { time: '01:00', value: 498.2 },
      { time: '02:00', value: 480.5 }, { time: '03:00', value: 462.1 },
      { time: '04:00', value: 445.6 }, { time: '05:00', value: 468.9 },
      { time: '06:00', value: 512.4 }, { time: '07:00', value: 589.3 },
      { time: '08:00', value: 680.2 }, { time: '09:00', value: 745.8 },
      { time: '10:00', value: 792.5 }, { time: '11:00', value: 835.1 },
      { time: '12:00', value: 798.4 }, { time: '13:00', value: 756.2 },
      { time: '14:00', value: 723.9 }, { time: '15:00', value: 701.6 },
      { time: '16:00', value: 685.3 }, { time: '17:00', value: 672.0 },
      { time: '18:00', value: 698.7 }, { time: '19:00', value: 735.2 },
      { time: '20:00', value: 710.5 }, { time: '21:00', value: 678.9 },
      { time: '22:00', value: 612.4 }, { time: '23:00', value: 558.7 }
    ],
    periodTrend: [
      { time: '早高峰 (07-09)', value: 1426.1 },
      { time: '午间 (11-13)', value: 1633.5 },
      { time: '晚高峰 (17-19)', value: 1406.6 },
      { time: '深夜 (23-05)', value: 2972.6 }
    ]
  };
}

// 生成随机采集记录
const mockDeviceNames = ['一号楼总电表', '二号楼水表', '三号楼气表', '研发楼电表', '宿舍楼水表', '食堂气表', '充电桩电表', '路灯控制箱'];
const mockDeviceTypes = ['电表', '水表', '气表'];
const mockEnergyTypes = ['电', '水', '气'];
const mockStatuses = ['采集正常', '采集异常'];
const mockUsers = ['admin', 'energy_operator', 'maintainer'];

function generateMockCollectList(pageNo = 1, pageSize = 10) {
  const start = (pageNo - 1) * pageSize;
  const list = [];
  for (let i = 1; i <= pageSize; i++) {
    const id = start + i;
    const isNormal = Math.random() > 0.2;
    list.push({
      id,
      deviceName: mockDeviceNames[(id - 1) % mockDeviceNames.length] + (Math.floor(Math.random() * 10) + 1),
      deviceType: mockDeviceTypes[(id - 1) % mockDeviceTypes.length],
      energyType: mockEnergyTypes[(id - 1) % mockEnergyTypes.length],
      collectTime: Date.now() - Math.random() * 86400000,
      collectStatus: isNormal ? '采集正常' : '采集异常',
      energyValue: parseFloat((Math.random() * 200 + 50).toFixed(2)),
      collectFreq: [5, 10, 15][Math.floor(Math.random() * 3)],
      exceptionCount: isNormal ? 0 : Math.floor(Math.random() * 5) + 1,
      handleUser: mockUsers[Math.floor(Math.random() * mockUsers.length)],
      creator: 'admin',
      createTime: Date.now() - Math.random() * 86400000 * 7,
      updateTime: Date.now() - Math.random() * 86400000,
    });
  }
  return list;
}

// 存储所有模拟数据（用于分页和筛选）
let allMockData = null;
function getAllMockData() {
  if (!allMockData) {
    allMockData = [];
    for (let i = 1; i <= 68; i++) {
      const isNormal = Math.random() > 0.2;
      allMockData.push({
        id: i,
        deviceName: mockDeviceNames[(i - 1) % mockDeviceNames.length] + (Math.floor(Math.random() * 10) + 1),
        deviceType: mockDeviceTypes[(i - 1) % mockDeviceTypes.length],
        energyType: mockEnergyTypes[(i - 1) % mockEnergyTypes.length],
        collectTime: Date.now() - Math.random() * 86400000,
        collectStatus: isNormal ? '采集正常' : '采集异常',
        energyValue: parseFloat((Math.random() * 200 + 50).toFixed(2)),
        collectFreq: [5, 10, 15][Math.floor(Math.random() * 3)],
        exceptionCount: isNormal ? 0 : Math.floor(Math.random() * 5) + 1,
        handleUser: mockUsers[Math.floor(Math.random() * mockUsers.length)],
        creator: 'admin',
        createTime: Date.now() - Math.random() * 86400000 * 7,
        updateTime: Date.now() - Math.random() * 86400000,
      });
    }
  }
  return allMockData;
}

// ==================== 模拟接口实现 ====================
async function mockGetEnergyCollectPage(params) {
  console.log('[Mock] 分页请求参数:', params);
  let data = [...getAllMockData()];
  // 筛选
  if (params.deviceName) {
    data = data.filter(item => item.deviceName.includes(params.deviceName));
  }
  if (params.deviceType) {
    data = data.filter(item => item.deviceType === params.deviceType);
  }
  if (params.energyType) {
    data = data.filter(item => item.energyType === params.energyType);
  }
  if (params.collectStatus) {
    data = data.filter(item => item.collectStatus === params.collectStatus);
  }
  const total = data.length;
  const pageNo = params.pageNo || 1;
  const pageSize = params.pageSize || 10;
  const start = (pageNo - 1) * pageSize;
  const list = data.slice(start, start + pageSize);
  console.log('[Mock] 返回数据条数:', list.length, '总数:', total);
  return mockPageResult(list, total);
}

async function mockDockEnergyCollect(data) {
  console.log('[Mock] 对接设备', data);
  return mockSuccessResult();
}

async function mockCollectEnergyData(data) {
  console.log('[Mock] 手动采集', data);
  return mockSuccessResult();
}

async function mockMonitorEnergyCollect(data) {
  console.log('[Mock] 开启监测', data);
  return mockSuccessResult();
}

async function mockCheckEnergyCollect(id) {
  console.log('[Mock] 排查设备', id);
  return mockSuccessResult();
}

async function mockRestartEnergyCollect(id) {
  console.log('[Mock] 重启设备', id);
  return mockSuccessResult();
}

async function mockCalibrateEnergyCollect(data) {
  console.log('[Mock] 校准设备', data);
  return mockSuccessResult();
}

async function mockExportEnergyCollectExcel(params) {
  console.log('[Mock] 导出数据', params);
  return new Blob(['模拟 Excel 内容'], { type: 'application/vnd.ms-excel' });
}

async function mockGetEnergyCollectDetail(params) {
  console.log('[Mock] 获取详情', params);
  const id = params.id;
  const detail = getAllMockData().find(item => item.id === id);
  return mockGetDetailResult(detail || getAllMockData()[0]);
}

async function mockGetEnergyCollectChart(params) {
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

async function mockGetUserList() {
  return [
    { userId: 'admin', userName: '管理员' },
    { userId: 'energy_operator', userName: '能耗操作员' },
    { userId: 'maintainer', userName: '维护工程师' },
  ];
}

// ==================== 真实接口（保持不变） ====================
export function getEnergyCollectPage(params) {
  if (USE_MOCK) {
    return mockGetEnergyCollectPage(params);
  }
  return requestClient.get('/energymgmt/energy-collect/page', { params });
}

export function dockEnergyCollect(data) {
  if (USE_MOCK) {
    return mockDockEnergyCollect(data);
  }
  return requestClient.post('/energymgmt/energy-collect/dock', data);
}

export function collectEnergyData(data) {
  if (USE_MOCK) {
    return mockCollectEnergyData(data);
  }
  return requestClient.post('/energymgmt/energy-collect/collect', data);
}

export function monitorEnergyCollect(data) {
  if (USE_MOCK) {
    return mockMonitorEnergyCollect(data);
  }
  return requestClient.post('/energymgmt/energy-collect/monitor', data);
}

export function checkEnergyCollect(id) {
  if (USE_MOCK) {
    return mockCheckEnergyCollect(id);
  }
  return requestClient.put('/energymgmt/energy-collect/check', { id });
}

export function restartEnergyCollect(id) {
  if (USE_MOCK) {
    return mockRestartEnergyCollect(id);
  }
  return requestClient.put('/energymgmt/energy-collect/restart', { id });
}

export function calibrateEnergyCollect(data) {
  if (USE_MOCK) {
    return mockCalibrateEnergyCollect(data);
  }
  return requestClient.put('/energymgmt/energy-collect/calibrate', data);
}

export function exportEnergyCollectExcel(params) {
  if (USE_MOCK) {
    return mockExportEnergyCollectExcel(params);
  }
  return requestClient.download('/energymgmt/energy-collect/export', params);
}

export function getEnergyCollectDetail(params) {
  if (USE_MOCK) {
    return mockGetEnergyCollectDetail(params);
  }
  return requestClient.get('/energymgmt/energy-collect/get', { params });
}

export function getEnergyCollectChart(params) {
  if (USE_MOCK) {
    return mockGetEnergyCollectChart(params);
  }
  return requestClient.get('/energymgmt/energy-collect/chart', { params });
}

export function getUserDetail(userId) {
  if (USE_MOCK) {
    return mockGetUserDetail(userId);
  }
  return requestClient.get('/system/user/get', { params: { id: userId } });
}

export async function getUserList() {
  if (USE_MOCK) {
    return mockGetUserList();
  }
  try {
    const res = await requestClient.get('/system/user/simple-list');
    return (res || []).map(user => ({
      userId: user.id,
      userName: user.nickname,
    }));
  } catch {
    return [];
  }
}
