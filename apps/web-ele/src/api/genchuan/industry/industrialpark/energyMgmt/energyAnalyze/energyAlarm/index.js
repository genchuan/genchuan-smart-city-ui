// ==================== index.js ====================
/**
 * 能耗预警模块 API 接口
 * 路径：src/api/genchuan/industry/industrialPark/energyMgmt/energyAnalyze/energyAlarm/index.js
 * 对应后端控制器：EnergyAlarmController
 * 权限要求：根据接口文档配置 @PreAuthorize
 */

import { requestClient } from '#/api/request';

// 开发时可设为 true 使用模拟数据，上线前必须改为 false
const USE_MOCK = true;

// ---------- 模拟数据生成器 ----------
let mockAlarmList = null;

/**
 * 生成模拟预警数据（共48条）
 * 字段对应能耗预警表 energy_alarm
 */
function generateMockAlarms() {
  const alarmNames = ['二号楼能耗超阈值', '三号楼过载预警', '一号楼电流异常', '四号楼峰值超限'];
  const types = ['过载', '超阈值'];               // alarm_type 字典值
  const statuses = ['正常监测', '异常预警'];       // alarm_status 字典值
  const handleResults = ['已处置', '未处置', '已忽略'];
  const list = [];
  for (let i = 1; i <= 48; i++) {
    const isException = i % 3 === 0;               // 模拟部分触发异常
    const alarmStatus = isException ? '异常预警' : '正常监测';
    list.push({
      id: i,
      alarmName: alarmNames[i % alarmNames.length] + (i > 4 ? `-${i}` : ''),
      alarmType: types[i % 2],
      areaId: (i % 5) + 1,
      areaName: `区域${(i % 5) + 1}`,               // 前端关联展示，实际由后端查 area_monitor 表填充
      alarmThreshold: parseFloat((Math.random() * 15000 + 5000).toFixed(2)),
      alarmStatus: alarmStatus,
      triggerTime: isException ? Date.now() - Math.random() * 86400000 * 5 : null,
      handleResult: isException ? handleResults[Math.floor(Math.random() * handleResults.length)] : null,
      saveEnergy: isException ? parseFloat((Math.random() * 500).toFixed(2)) : null,
      handleUser: ['admin', 'energy_operator', 'maintainer'][Math.floor(Math.random() * 3)],
      createTime: Date.now() - Math.random() * 86400000 * 30,
      updateTime: Date.now(),
    });
  }
  return list;
}

function getMockAlarms() {
  if (!mockAlarmList) mockAlarmList = generateMockAlarms();
  return mockAlarmList;
}

// ---------- 模拟接口实现 ----------

/**
 * 分页查询预警列表（模拟）
 * 支持按预警名称、类型、状态、处置结果筛选
 */
async function mockGetPage(params) {
  let data = [...getMockAlarms()];
  if (params.alarmName) data = data.filter(item => item.alarmName.includes(params.alarmName));
  if (params.alarmType) data = data.filter(item => item.alarmType === params.alarmType);
  if (params.alarmStatus) data = data.filter(item => item.alarmStatus === params.alarmStatus);
  if (params.handleResult) data = data.filter(item => item.handleResult === params.handleResult);
  const total = data.length;
  const pageNo = params.pageNo || 1;
  const pageSize = params.pageSize || 10;
  const start = (pageNo - 1) * pageSize;
  const list = data.slice(start, start + pageSize);
  return { list, total };
}

/**
 * 配置预警（创建规则）
 */
async function mockCreate(data) {
  console.log('[Mock] 配置预警', data);
  return true;
}

/**
 * 开启批量监测
 */
async function mockMonitor(data) {
  console.log('[Mock] 监测', data);
  return true;
}

/**
 * 手动触发预警
 */
async function mockTrigger(data) {
  console.log('[Mock] 触发', data);
  return true;
}

/**
 * 批量处置预警
 */
async function mockHandle(data) {
  console.log('[Mock] 处置', data);
  return true;
}

/**
 * 批量整改（需填写整改方案）
 */
async function mockRectify(data) {
  console.log('[Mock] 整改', data);
  return true;
}

/**
 * 调整预警配置（阈值、名称等）
 */
async function mockUpdate(data) {
  console.log('[Mock] 调整', data);
  return true;
}

/**
 * 忽略预警（单条）
 */
async function mockIgnore(data) {
  console.log('[Mock] 忽略', data);
  return true;
}

/**
 * 获取预警详情
 */
async function mockGetDetail(params) {
  return getMockAlarms().find(item => item.id === params.id) || getMockAlarms()[0];
}

/**
 * 获取区域详情（关联分区能耗表 area_monitor）
 */
async function mockGetAreaDetail(areaId) {
  return {
    id: areaId,
    areaName: `区域${areaId}`,
    areaSize: 5000,
    totalEnergy: 12000,
    energyStatus: '正常能耗'
  };
}

/**
 * 获取处置结果详情（含整改方案）
 */
async function mockGetHandleResultDetail(alarmId) {
  const alarm = getMockAlarms().find(a => a.id === alarmId);
  return {
    handleResult: alarm?.handleResult || '已处置',
    rectifyPlan: '调整空调设定温度，优化运行时段',
    handleUser: 'admin',
    updateTime: Date.now()
  };
}

/**
 * 获取用户详情（关联系统用户表 sys_user）
 */
async function mockGetUserDetail(userId) {
  return {
    id: userId,
    nickname: userId === 'admin' ? '管理员' : (userId === 'energy_operator' ? '能耗操作员' : '维护工程师'),
    userName: userId
  };
}

/**
 * 获取能耗异常预警态势图表数据
 * 包含：卡片指标（总数、处置数、未处置数、节约量）及两个饼图
 */
async function mockGetChart() {
  return {
    totalAlarm: 28,
    handledAlarm: 16,
    unhandledAlarm: 12,
    totalSaveEnergy: 3280.5,
    alarmTypePie: [
      { name: '过载', value: 10 },
      { name: '超阈值', value: 18 }
    ],
    handleResultPie: [
      { name: '已处置', value: 16 },
      { name: '未处置', value: 12 }
    ]
  };
}

// ---------- 真实接口导出（按后端文档定义） ----------

/**
 * ① 列表页交互操作接口
 */

/**
 * 分页查询预警列表
 * GET /energymgmt/energy-alarm/page
 * 权限: energymgmt:energy-alarm:query
 * @param {Object} params - 查询参数（alarmName, alarmType, alarmStatus, triggerTime, pageNo, pageSize）
 */
export function getEnergyAlarmPage(params) {
  return USE_MOCK ? mockGetPage(params) : requestClient.get('/energymgmt/energy-alarm/page', { params });
}

/**
 * 配置预警（创建规则）
 * POST /energymgmt/energy-alarm/create
 * 权限: energymgmt:energy-alarm:create
 * @param {Object} data - { alarmName, alarmType, areaId, alarmThreshold }
 */
export function createEnergyAlarm(data) {
  return USE_MOCK ? mockCreate(data) : requestClient.post('/energymgmt/energy-alarm/create', data);
}

/**
 * 开启监测（批量）
 * POST /energymgmt/energy-alarm/monitor
 * 权限: energymgmt:energy-alarm:monitor
 * @param {Object} data - { ids: [1,2,...] }
 */
export function monitorEnergyAlarm(data) {
  return USE_MOCK ? mockMonitor(data) : requestClient.post('/energymgmt/energy-alarm/monitor', data);
}

/**
 * 手动触发预警（批量）
 * POST /energymgmt/energy-alarm/trigger
 * 权限: energymgmt:energy-alarm:trigger
 * @param {Object} data - { ids: [1,2,...] }
 */
export function triggerEnergyAlarm(data) {
  return USE_MOCK ? mockTrigger(data) : requestClient.post('/energymgmt/energy-alarm/trigger', data);
}

/**
 * 处置预警（批量）
 * POST /energymgmt/energy-alarm/handle
 * 权限: energymgmt:energy-alarm:handle
 * @param {Object} data - { ids: [1,2,...] }
 */
export function handleEnergyAlarm(data) {
  return USE_MOCK ? mockHandle(data) : requestClient.post('/energymgmt/energy-alarm/handle', data);
}

/**
 * 整改预警（批量）
 * POST /energymgmt/energy-alarm/rectify
 * 权限: energymgmt:energy-alarm:rectify
 * @param {Object} data - { ids: [1,2,...], rectifyPlan }
 */
export function rectifyEnergyAlarm(data) {
  return USE_MOCK ? mockRectify(data) : requestClient.post('/energymgmt/energy-alarm/rectify', data);
}

/**
 * ② 列表行交互操作接口
 */

/**
 * 调整预警配置
 * PUT /energymgmt/energy-alarm/update
 * 权限: energymgmt:energy-alarm:update
 * @param {Object} data - { id, alarmName?, alarmThreshold? }
 */
export function updateEnergyAlarm(data) {
  return USE_MOCK ? mockUpdate(data) : requestClient.put('/energymgmt/energy-alarm/update', data);
}

/**
 * 忽略预警（单条）
 * PUT /energymgmt/energy-alarm/ignore
 * 权限: energymgmt:energy-alarm:ignore
 * @param {Object} data - { id }
 */
export function ignoreEnergyAlarm(data) {
  return USE_MOCK ? mockIgnore(data) : requestClient.put('/energymgmt/energy-alarm/ignore', data);
}

/**
 * 获取预警详情（查看）
 * GET /energymgmt/energy-alarm/get
 * 权限: energymgmt:energy-alarm:query
 * @param {Object} params - { id }
 */
export function getEnergyAlarmDetail(params) {
  return USE_MOCK ? mockGetDetail(params) : requestClient.get('/energymgmt/energy-alarm/get', { params });
}

/**
 * 获取关联区域详情（分区能耗表 area_monitor）
 * GET /energymgmt/area-monitor/get
 * 权限: energymgmt:area-monitor:query
 * @param {number} areaId - 区域ID
 */
export function getAreaDetailById(areaId) {
  return USE_MOCK ? mockGetAreaDetail(areaId) : requestClient.get('/energymgmt/area-monitor/get', { params: { id: areaId } });
}

/**
 * 获取处置结果详情（含整改方案）
 * GET /energymgmt/energy-alarm/handle-result
 * 权限: energymgmt:energy-alarm:query
 * @param {number} alarmId - 预警ID
 */
export function getHandleResultDetail(alarmId) {
  return USE_MOCK ? mockGetHandleResultDetail(alarmId) : requestClient.get('/energymgmt/energy-alarm/handle-result', { params: { id: alarmId } });
}

/**
 * 获取用户详情（系统用户表 sys_user）
 * GET /system/user/get
 * 权限: system:user:query
 * @param {string} userId - 用户账号
 */
export function getUserDetail(userId) {
  return USE_MOCK ? mockGetUserDetail(userId) : requestClient.get('/system/user/get', { params: { id: userId } });
}

/**
 * ③ 数据可视化图表接口
 */

/**
 * 获取能耗异常预警态势数据（卡片 + 饼图）
 * GET /energymgmt/energy-alarm/chart
 * 权限: energymgmt:energy-alarm:query
 * @param {Object} params - { timeRange } 时间范围，如 "近30天" 或具体起止
 */
export function getEnergyAlarmChart(params) {
  return USE_MOCK ? mockGetChart() : requestClient.get('/energymgmt/energy-alarm/chart', { params });
}
