// index.js - 能耗采集 API（支持模拟数据，已修正返回格式）
import { requestClient } from '#/api/request';

// ==================== 模拟数据开关 ====================
// 开发调试时设为 true 使用本地模拟数据；上线前改为 false 切换到真实后端接口
const USE_MOCK = true;

// ==================== 辅助函数：构造符合组件期望的返回格式 ====================
// 分页结果：表格组件期望 { list, total }
function mockPageResult(list, total) {
  return { list, total };
}
// 操作成功结果：大部分接口期望返回 true 表示成功
function mockSuccessResult() {
  return true;
}
// 详情结果：直接返回详情对象
function mockGetDetailResult(detail) {
  return detail;
}
// 图表数据：返回卡片和折线图所需的结构
function mockChartResult() {
  return {
    deviceCount: 28,               // 采集设备总数
    normalCount: 24,               // 正常采集设备数
    exceptionCount: 4,             // 异常采集设备数
    totalEnergy: 12450.8,          // 总能耗值
    realTimeTrend: [               // 实时能耗趋势（24小时点）
      { time: '00:00', value: 520.3 }, { time: '01:00', value: 498.2 },
      // ... 此处省略中间项以保持代码整洁，实际使用时应有完整24条数据
      { time: '23:00', value: 558.7 }
    ],
    periodTrend: [                 // 分时段能耗趋势
      { time: '早高峰 (07-09)', value: 1426.1 },
      { time: '午间 (11-13)', value: 1633.5 },
      { time: '晚高峰 (17-19)', value: 1406.6 },
      { time: '深夜 (23-05)', value: 2972.6 }
    ]
  };
}

// ==================== 模拟数据池 ====================
// 设备名称候选池
const mockDeviceNames = [
  '一号楼总电表', '二号楼水表', '三号楼气表', '研发楼电表',
  '宿舍楼水表', '食堂气表', '充电桩电表', '路灯控制箱'
];
const mockDeviceTypes = ['电表', '水表', '气表'];   // 设备类型
const mockEnergyTypes = ['电', '水', '气'];         // 能耗类型
const mockUsers = ['admin', 'energy_operator', 'maintainer']; // 操作人账号

// 生成单页模拟数据（旧版，保留但未使用，实际使用 getAllMockData 统一数据源）
function generateMockCollectList(pageNo = 1, pageSize = 10) {
  // ... 保留原实现，但后续使用 getAllMockData 代替，此处不再重复
}

// 全量模拟数据（缓存，保证分页和筛选的一致性）
let allMockData = null;
function getAllMockData() {
  if (!allMockData) {
    allMockData = [];
    for (let i = 1; i <= 68; i++) {          // 生成68条模拟记录
      const isNormal = Math.random() > 0.2;   // 80% 概率为采集正常
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

// ==================== 模拟接口实现（直接返回组件期望的数据格式） ====================
/**
 * 模拟分页查询
 * 支持设备名称(模糊)、设备类型、能耗类型、采集状态筛选
 */
async function mockGetEnergyCollectPage(params) {
  console.log('[Mock] 分页请求参数:', params);
  let data = [...getAllMockData()];
  // 应用筛选条件
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

/**
 * 模拟对接设备（批量）
 */
async function mockDockEnergyCollect(data) {
  console.log('[Mock] 对接设备', data);
  return mockSuccessResult();
}

/**
 * 模拟手动采集（批量）
 */
async function mockCollectEnergyData(data) {
  console.log('[Mock] 手动采集', data);
  return mockSuccessResult();
}

/**
 * 模拟开启实时监测（批量）
 */
async function mockMonitorEnergyCollect(data) {
  console.log('[Mock] 开启监测', data);
  return mockSuccessResult();
}

/**
 * 模拟设备排查（单个）
 */
async function mockCheckEnergyCollect(id) {
  console.log('[Mock] 排查设备', id);
  return mockSuccessResult();
}

/**
 * 模拟设备重启（单个）
 */
async function mockRestartEnergyCollect(id) {
  console.log('[Mock] 重启设备', id);
  return mockSuccessResult();
}

/**
 * 模拟设备校准（单个）
 */
async function mockCalibrateEnergyCollect(data) {
  console.log('[Mock] 校准设备', data);
  return mockSuccessResult();
}

/**
 * 模拟导出（返回 Blob 对象）
 */
async function mockExportEnergyCollectExcel(params) {
  console.log('[Mock] 导出数据', params);
  return new Blob(['模拟 Excel 内容'], { type: 'application/vnd.ms-excel' });
}

/**
 * 模拟获取详情
 */
async function mockGetEnergyCollectDetail(params) {
  console.log('[Mock] 获取详情', params);
  const id = params.id;
  const detail = getAllMockData().find(item => item.id === id);
  return mockGetDetailResult(detail || getAllMockData()[0]);
}

/**
 * 模拟图表数据
 */
async function mockGetEnergyCollectChart(params) {
  console.log('[Mock] 图表请求', params);
  return mockChartResult();
}

/**
 * 模拟获取用户详情（用于操作人弹窗）
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
 * 模拟获取用户简单列表（用于操作人筛选下拉）
 */
async function mockGetUserList() {
  return [
    { userId: 'admin', userName: '管理员' },
    { userId: 'energy_operator', userName: '能耗操作员' },
    { userId: 'maintainer', userName: '维护工程师' },
  ];
}

// ==================== 对外导出的 API 函数（根据 USE_MOCK 决定使用真实接口还是模拟接口） ====================

/**
 * 分页查询能耗采集记录
 * GET /energymgmt/energy-collect/page
 */
export function getEnergyCollectPage(params) {
  if (USE_MOCK) {
    return mockGetEnergyCollectPage(params);
  }
  return requestClient.get('/energymgmt/energy-collect/page', { params });
}

/**
 * 对接设备（批量）
 * POST /energymgmt/energy-collect/dock
 */
export function dockEnergyCollect(data) {
  if (USE_MOCK) {
    return mockDockEnergyCollect(data);
  }
  return requestClient.post('/energymgmt/energy-collect/dock', data);
}

/**
 * 手动采集（批量）
 * POST /energymgmt/energy-collect/collect
 */
export function collectEnergyData(data) {
  if (USE_MOCK) {
    return mockCollectEnergyData(data);
  }
  return requestClient.post('/energymgmt/energy-collect/collect', data);
}

/**
 * 开启实时监测（批量）
 * POST /energymgmt/energy-collect/monitor
 */
export function monitorEnergyCollect(data) {
  if (USE_MOCK) {
    return mockMonitorEnergyCollect(data);
  }
  return requestClient.post('/energymgmt/energy-collect/monitor', data);
}

/**
 * 排查异常设备（单个）
 * PUT /energymgmt/energy-collect/check
 */
export function checkEnergyCollect(id) {
  if (USE_MOCK) {
    return mockCheckEnergyCollect(id);
  }
  return requestClient.put('/energymgmt/energy-collect/check', { id });
}

/**
 * 重启采集设备（单个）
 * PUT /energymgmt/energy-collect/restart
 */
export function restartEnergyCollect(id) {
  if (USE_MOCK) {
    return mockRestartEnergyCollect(id);
  }
  return requestClient.put('/energymgmt/energy-collect/restart', { id });
}

/**
 * 校准能耗数据（单个）
 * PUT /energymgmt/energy-collect/calibrate
 */
export function calibrateEnergyCollect(data) {
  if (USE_MOCK) {
    return mockCalibrateEnergyCollect(data);
  }
  return requestClient.put('/energymgmt/energy-collect/calibrate', data);
}

/**
 * 导出采集数据（支持筛选条件）
 * GET /energymgmt/energy-collect/export
 */
export function exportEnergyCollectExcel(params) {
  if (USE_MOCK) {
    return mockExportEnergyCollectExcel(params);
  }
  return requestClient.download('/energymgmt/energy-collect/export', params);
}

/**
 * 获取采集记录详情
 * GET /energymgmt/energy-collect/get
 */
export function getEnergyCollectDetail(params) {
  if (USE_MOCK) {
    return mockGetEnergyCollectDetail(params);
  }
  return requestClient.get('/energymgmt/energy-collect/get', { params });
}

/**
 * 获取能耗图表数据（卡片 + 折线图）
 * GET /energymgmt/energy-collect/chart
 */
export function getEnergyCollectChart(params) {
  if (USE_MOCK) {
    return mockGetEnergyCollectChart(params);
  }
  return requestClient.get('/energymgmt/energy-collect/chart', { params });
}

/**
 * 获取用户详情（用于操作人弹窗）
 * GET /system/user/get
 */
export function getUserDetail(userId) {
  if (USE_MOCK) {
    return mockGetUserDetail(userId);
  }
  return requestClient.get('/system/user/get', { params: { id: userId } });
}

/**
 * 获取用户简单列表（用于操作人筛选或映射）
 * GET /system/user/simple-list
 */
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
