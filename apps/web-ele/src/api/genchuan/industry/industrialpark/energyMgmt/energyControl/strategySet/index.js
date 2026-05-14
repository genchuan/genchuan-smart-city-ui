// index.js（API接口）
// 路径: src/api/genchuan/industry/industrialpark/energyMgmt/energyControl/strategySet/index.js

import { requestClient } from '#/api/request';

// ==================== 配置开关 ====================
// 上线前请改为 false
const USE_MOCK = true; // true: 使用模拟数据，false: 调用真实接口

// ==================== 模拟数据生成 ====================
let mockStrategyList = null;

/**
 * 生成模拟的策略数据列表
 * @returns {Array} 策略数据数组
 */
function generateMockStrategies() {
  const names = ['办公区空调节能策略', '照明智能调光策略', '生产设备间歇运行策略', '空调温度优化策略'];
  const types = ['照明', '空调', '设备'];
  const list = [];
  for (let i = 1; i <= 36; i++) {
    const status = i % 3 === 0 ? '已启用' : '未启用';
    list.push({
      id: i,
      strategyName: names[i % names.length] + (i > 4 ? `-${i}` : ''),
      strategyType: types[i % 3],
      deviceId: (i % 5) + 1,
      deviceName: `设备${(i % 5) + 1}`,
      executeTime: i % 2 === 0 ? '工作日 18:00-次日8:00' : '全天候',
      strategyStatus: status,
      saveEnergy: status === '已启用' ? parseFloat((Math.random() * 1000 + 50).toFixed(2)) : null,
      saveRate: status === '已启用' ? parseFloat((Math.random() * 20 + 1).toFixed(2)) : null,
      evaluateResult: status === '已启用' ? '策略执行效果良好，能耗下降明显' : null,
      handleUser: ['admin', 'energy_operator', 'maintainer'][Math.floor(Math.random() * 3)],
      createTime: Date.now() - Math.random() * 86400000 * 30,
      updateTime: Date.now(),
    });
  }
  return list;
}

/**
 * 获取模拟策略列表（单例模式）
 * @returns {Array}
 */
function getMockStrategies() {
  if (!mockStrategyList) mockStrategyList = generateMockStrategies();
  return mockStrategyList;
}

// ==================== 模拟接口实现 ====================

/**
 * 模拟分页查询
 */
async function mockGetPage(params) {
  let data = [...getMockStrategies()];
  if (params.strategyName) data = data.filter(item => item.strategyName.includes(params.strategyName));
  if (params.strategyType) data = data.filter(item => item.strategyType === params.strategyType);
  if (params.strategyStatus) data = data.filter(item => item.strategyStatus === params.strategyStatus);
  if (params.executeTime) data = data.filter(item => item.executeTime === params.executeTime);
  const total = data.length;
  const pageNo = params.pageNo || 1;
  const pageSize = params.pageSize || 10;
  const start = (pageNo - 1) * pageSize;
  const list = data.slice(start, start + pageSize);
  return { list, total };
}

async function mockCreate(data) { console.log('[Mock] 制定策略', data); return true; }
async function mockSetParam(data) { console.log('[Mock] 设置参数', data); return true; }
async function mockEnable(data) { console.log('[Mock] 启用', data); return true; }
async function mockEvaluate(data) { console.log('[Mock] 评估', data); return true; }
async function mockOptimize(data) { console.log('[Mock] 优化', data); return true; }
async function mockPause(data) { console.log('[Mock] 暂停', data); return true; }
async function mockUpdate(data) { console.log('[Mock] 修改', data); return true; }
async function mockDelete(data) { console.log('[Mock] 删除', data); return true; }
async function mockGetDetail(params) { return getMockStrategies().find(item => item.id === params.id) || getMockStrategies()[0]; }
async function mockGetDeviceDetail(deviceId) { return { id: deviceId, deviceName: `智能设备${deviceId}`, deviceType: '空调', areaName: 'A栋办公区', status: '运行中' }; }
async function mockGetEvaluateDetail(id) {
  const strategy = getMockStrategies().find(s => s.id === id);
  return { evaluateResult: strategy?.evaluateResult || '效果良好', saveEnergy: strategy?.saveEnergy || 0, saveRate: strategy?.saveRate || 0, evaluateTime: Date.now() };
}
async function mockGetChart() {
  const strategies = getMockStrategies();
  const totalStrategy = strategies.length;
  const enableStrategy = strategies.filter(s => s.strategyStatus === '已启用').length;
  const totalSaveEnergy = strategies.reduce((sum, s) => sum + (s.saveEnergy || 0), 0);
  const totalSaveRate = enableStrategy ? (totalSaveEnergy / (totalStrategy * 100)) * 100 : 0;
  const saveTrendLine = [];
  const energyDownTrendLine = [];
  for (let i = 1; i <= 30; i++) {
    const date = `04-${i.toString().padStart(2, '0')}`;
    saveTrendLine.push({ date, value: Math.random() * 200 + 50 });
    energyDownTrendLine.push({ date, value: Math.random() * 100 + 20 });
  }
  return { totalStrategy, enableStrategy, totalSaveEnergy: parseFloat(totalSaveEnergy.toFixed(1)), totalSaveRate: parseFloat(totalSaveRate.toFixed(1)), saveTrendLine, energyDownTrendLine };
}

// ==================== 真实接口（待后端联调） ====================

/**
 * 分页查询策略列表（支持筛选）
 * GET /energymgmt/strategy-set/page
 * @param {Object} params - 查询参数
 * @param {string} [params.strategyName] - 策略名称（模糊）
 * @param {string} [params.strategyType] - 策略类型（照明/空调/设备）
 * @param {string} [params.strategyStatus] - 策略状态（已启用/未启用）
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 */
export function getStrategyPage(params) {
  return USE_MOCK ? mockGetPage(params) : requestClient.get('/energymgmt/strategy-set/page', { params });
}

/**
 * 制定节能策略
 * POST /energymgmt/strategy-set/create
 * @param {Object} data - 策略信息
 * @param {string} data.strategyName - 策略名称
 * @param {string} data.strategyType - 策略类型
 * @param {number} data.deviceId - 关联设备ID
 * @param {string} data.executeTime - 执行时间
 */
export function createStrategy(data) {
  return USE_MOCK ? mockCreate(data) : requestClient.post('/energymgmt/strategy-set/create', data);
}

/**
 * 设置策略参数（批量）
 * PUT /energymgmt/strategy-set/setting
 * @param {Object} data
 * @param {number[]} data.ids - 策略ID列表
 * @param {Object} data.param - 策略执行参数（如 {temp: 26, speed: "low"}）
 */
export function setStrategyParam(data) {
  return USE_MOCK ? mockSetParam(data) : requestClient.put('/energymgmt/strategy-set/setting', data);
}

/**
 * 启用策略（批量）
 * PUT /energymgmt/strategy-set/enable
 * @param {Object} data
 * @param {number[]} data.ids - 策略ID列表
 */
export function enableStrategy(data) {
  return USE_MOCK ? mockEnable(data) : requestClient.put('/energymgmt/strategy-set/enable', data);
}

/**
 * 评估策略执行效果（批量）
 * POST /energymgmt/strategy-set/evaluate
 * @param {Object} data
 * @param {number[]} data.ids - 策略ID列表
 */
export function evaluateStrategy(data) {
  return USE_MOCK ? mockEvaluate(data) : requestClient.post('/energymgmt/strategy-set/evaluate', data);
}

/**
 * 优化策略参数（批量）
 * PUT /energymgmt/strategy-set/optimize
 * @param {Object} data
 * @param {number[]} data.ids - 策略ID列表
 * @param {Object} data.optimizeParam - 优化后的参数
 */
export function optimizeStrategy(data) {
  return USE_MOCK ? mockOptimize(data) : requestClient.put('/energymgmt/strategy-set/optimize', data);
}

/**
 * 暂停已启用的策略（单个）
 * PUT /energymgmt/strategy-set/pause
 * @param {Object} data
 * @param {number} data.id - 策略ID
 */
export function pauseStrategy(data) {
  return USE_MOCK ? mockPause(data) : requestClient.put('/energymgmt/strategy-set/pause', data);
}

/**
 * 修改策略基础信息（单个）
 * PUT /energymgmt/strategy-set/update
 * @param {Object} data
 * @param {number} data.id - 策略ID
 * @param {string} [data.strategyName] - 策略名称
 * @param {string} [data.executeTime] - 执行时间
 */
export function updateStrategy(data) {
  return USE_MOCK ? mockUpdate(data) : requestClient.put('/energymgmt/strategy-set/update', data);
}

/**
 * 删除策略（单个）
 * DELETE /energymgmt/strategy-set/delete
 * @param {Object} data
 * @param {number} data.id - 策略ID
 */
export function deleteStrategy(data) {
  return USE_MOCK ? mockDelete(data) : requestClient.delete('/energymgmt/strategy-set/delete', { data });
}

/**
 * 获取策略详情
 * GET /energymgmt/strategy-set/get
 * @param {Object} params
 * @param {number} params.id - 策略ID
 */
export function getStrategyDetail(params) {
  return USE_MOCK ? mockGetDetail(params) : requestClient.get('/energymgmt/strategy-set/get', { params });
}

/**
 * 获取设备明细
 * GET /energymgmt/device-control/get
 * @param {number} deviceId - 设备ID
 */
export function getDeviceDetail(deviceId) {
  return USE_MOCK ? mockGetDeviceDetail(deviceId) : requestClient.get('/energymgmt/device-control/get', { params: { id: deviceId } });
}

/**
 * 获取评估详情
 * GET /energymgmt/strategy-set/evaluate-result
 * @param {number} id - 策略ID
 */
export function getEvaluateDetail(id) {
  return USE_MOCK ? mockGetEvaluateDetail(id) : requestClient.get('/energymgmt/strategy-set/evaluate-result', { params: { id } });
}

/**
 * 获取图表数据（策略总数、启用数、节能总量、节能率及趋势）
 * GET /energymgmt/strategy-set/chart
 * @param {Object} params
 * @param {string} [params.timeRange] - 时间范围，如 "近30天" 或具体日期区间
 */
export function getStrategyChart(params) {
  return USE_MOCK ? mockGetChart() : requestClient.get('/energymgmt/strategy-set/chart', { params });
}
