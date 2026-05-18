// ==================== index.js ====================
// 设备管控模块 API 接口
// 包含设备管控列表查询、绑定、设置规则、远程控制、优化、关闭、启动等操作
// 以及图表数据获取和关联的策略、用户详情接口

import { requestClient } from '#/api/request';

// 是否使用模拟数据（上线前请改为 false）
const USE_MOCK = true;

// ---------- 模拟数据 ----------
let mockDeviceList = null; // 模拟设备列表缓存

// 模拟节能策略数据映射
const mockStrategyMap = {
  1: { id: 1, strategyName: '空调智能温控策略', description: '根据室温自动调节设定温度' },
  2: { id: 2, strategyName: '照明时段控制策略', description: '非工作时段自动关闭照明' },
  3: { id: 3, strategyName: '水泵变频节能策略', description: '根据负载自动调节频率' },
};

/**
 * 生成模拟设备数据（基于 device_control 表字段）
 * @returns {Array} 设备列表
 */
function generateMockDevices() {
  const deviceNames = ['一号楼中央空调', '二号楼照明系统', '三号楼水泵', '四号楼空调', '五号楼照明', '六号楼水泵'];
  const types = ['空调', '照明', '水泵'];
  const list = [];
  for (let i = 1; i <= 36; i++) {
    const type = types[i % 3];
    const status = i % 4 === 0 ? '未管控' : '管控中';
    const beforeEnergy = parseFloat((Math.random() * 10000 + 2000).toFixed(2));
    const afterEnergy = status === '管控中' ? parseFloat((beforeEnergy * (0.7 + Math.random() * 0.2)).toFixed(2)) : null;
    const downEnergy = status === '管控中' ? parseFloat((beforeEnergy - afterEnergy).toFixed(2)) : null;
    list.push({
      id: i,
      deviceName: deviceNames[i % deviceNames.length] + (i > 6 ? `-${i}` : ''),
      deviceType: type,
      strategyId: status === '管控中' ? (i % 3) + 1 : null,
      strategyName: status === '管控中' ? mockStrategyMap[(i % 3) + 1]?.strategyName : null,
      controlRule: status === '管控中' ? (type === '空调' ? '非工作时段自动调高温度' : (type === '照明' ? '非工作时段自动关闭' : '根据负载自动调节')) : null,
      controlStatus: status,
      beforeEnergy: beforeEnergy,
      afterEnergy: afterEnergy,
      downEnergy: downEnergy,
      handleUser: ['admin', 'energy_operator', 'maintainer'][Math.floor(Math.random() * 3)],
      createTime: Date.now() - Math.random() * 86400000 * 30,
      updateTime: Date.now(),
    });
  }
  return list;
}

/**
 * 获取模拟设备列表（懒加载生成）
 * @returns {Array}
 */
function getMockDevices() {
  if (!mockDeviceList) mockDeviceList = generateMockDevices();
  return mockDeviceList;
}

/**
 * 模拟分页查询接口，支持设备名称模糊、设备类型、管控状态筛选
 */
async function mockGetPage(params) {
  let data = [...getMockDevices()];
  if (params.deviceName) data = data.filter(item => item.deviceName.includes(params.deviceName));
  if (params.deviceType) data = data.filter(item => item.deviceType === params.deviceType);
  if (params.controlStatus) data = data.filter(item => item.controlStatus === params.controlStatus);
  const total = data.length;
  const pageNo = params.pageNo || 1;
  const pageSize = params.pageSize || 10;
  const start = (pageNo - 1) * pageSize;
  const list = data.slice(start, start + pageSize);
  return { list, total };
}

async function mockBind(data) { console.log('[Mock] 绑定设备', data); return true; }
async function mockSetRule(data) { console.log('[Mock] 设置规则', data); return true; }
async function mockControl(data) { console.log('[Mock] 远程控制', data); return true; }
async function mockOptimize(data) { console.log('[Mock] 优化能耗', data); return true; }
async function mockClose(data) { console.log('[Mock] 关闭管控', data); return true; }
async function mockStart(data) { console.log('[Mock] 启动管控', data); return true; }

async function mockGetDeviceDetail(params) {
  return getMockDevices().find(item => item.id === params.id) || getMockDevices()[0];
}

async function mockGetStrategyDetail(params) {
  return mockStrategyMap[params.id] || { id: params.id, strategyName: '默认策略', description: '策略描述' };
}

async function mockGetUserDetail(params) {
  return {
    id: params.id,
    nickname: params.id === 'admin' ? '管理员' : (params.id === 'energy_operator' ? '能耗操作员' : '维护工程师'),
    userName: params.id
  };
}

/**
 * 模拟图表数据（高能耗设备管控态势），符合接口文档输出格式
 */
async function mockGetChart() {
  const devices = getMockDevices();
  const controlled = devices.filter(d => d.controlStatus === '管控中');
  const totalDevices = devices.length;
  const totalSaveEnergy = controlled.reduce((sum, d) => sum + (d.downEnergy || 0), 0);
  const avgDownEnergy = controlled.length ? totalSaveEnergy / controlled.length : 0;
  const totalBefore = controlled.reduce((sum, d) => sum + d.beforeEnergy, 0);
  const totalAfter = controlled.reduce((sum, d) => sum + d.afterEnergy, 0);
  const saveRate = totalBefore ? ((totalBefore - totalAfter) / totalBefore * 100) : 0;
  const deviceEnergyBar = controlled.map(d => ({ name: d.deviceName, value: d.afterEnergy }));
  const downEnergyBar = controlled.map(d => ({ name: d.deviceName, value: d.downEnergy }));
  const typeCount = { '空调': 0, '照明': 0, '水泵': 0 };
  controlled.forEach(d => { typeCount[d.deviceType]++; });
  const deviceTypePie = Object.entries(typeCount).map(([name, value]) => ({ name, value }));
  return { totalDevices, avgDownEnergy, saveRate, totalSaveEnergy, deviceEnergyBar, downEnergyBar, deviceTypePie };
}

// ---------- 真实接口（待后端实现）----------
// 以下导出函数根据 USE_MOCK 决定使用模拟实现还是真实请求

/**
 * 获取设备管控分页列表
 * 支持设备名称模糊查询、设备类型、管控状态筛选
 */
export function getDeviceControlPage(params) {
  return USE_MOCK ? mockGetPage(params) : requestClient.get('/energymgmt/device-control/page', { params });
}

/**
 * 绑定设备与节能策略（单设备）
 */
export function bindDeviceControl(data) {
  return USE_MOCK ? mockBind(data) : requestClient.post('/energymgmt/device-control/bind', data);
}

/**
 * 设置设备管控规则（支持批量）
 */
export function setDeviceControlRule(data) {
  return USE_MOCK ? mockSetRule(data) : requestClient.put('/energymgmt/device-control/setting', data);
}

/**
 * 远程控制设备（支持批量）
 */
export function controlDevice(data) {
  return USE_MOCK ? mockControl(data) : requestClient.post('/energymgmt/device-control/control', data);
}

/**
 * 能耗优化（支持批量）
 */
export function optimizeDevice(data) {
  return USE_MOCK ? mockOptimize(data) : requestClient.post('/energymgmt/device-control/optimize', data);
}

/**
 * 关闭设备管控（支持批量）
 */
export function closeDeviceControl(data) {
  return USE_MOCK ? mockClose(data) : requestClient.put('/energymgmt/device-control/close', data);
}

/**
 * 启动单个设备管控
 */
export function startDeviceControl(data) {
  return USE_MOCK ? mockStart(data) : requestClient.put('/energymgmt/device-control/start', data);
}

/**
 * 获取设备详情
 */
export function getDeviceDetail(params) {
  return USE_MOCK ? mockGetDeviceDetail(params) : requestClient.get('/energymgmt/device-control/get', { params });
}

/**
 * 获取节能策略详情
 */
export function getStrategyDetail(params) {
  return USE_MOCK ? mockGetStrategyDetail(params) : requestClient.get('/energymgmt/strategy-set/get', { params });
}

/**
 * 获取用户详情
 */
export function getUserDetail(params) {
  return USE_MOCK ? mockGetUserDetail(params) : requestClient.get('/system/user/get', { params });
}

/**
 * 获取高能耗设备管控态势图表数据
 * 返回各设备能耗值、管控后下降值、设备类型占比
 */
export function getDeviceControlChart(params) {
  return USE_MOCK ? mockGetChart(params) : requestClient.get('/energymgmt/device-control/chart', { params });
}
