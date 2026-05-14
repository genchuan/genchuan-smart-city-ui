// index.js - 能耗对比分析 API（支持模拟数据，上线前关闭 MOCK）
import { requestClient } from '#/api/request';

// ==================== 模拟数据开关 ====================
// 开发/测试时设为 true，使用本地模拟数据；上线前必须改为 false 调用真实接口
const USE_MOCK = true;  // 上线前改为 false

// ==================== 模拟数据生成 ====================
const mockCompareList = [];
const mockDimList = ['同比', '环比', '区域间', '设备间'];
const mockNames = ['5月办公区能耗同比对比', '研发区环比能耗分析', '生产区区域间对比', '空调设备间对比'];
for (let i = 1; i <= 36; i++) {
  mockCompareList.push({
    id: i,
    compareName: mockNames[i % mockNames.length] + (i > 4 ? `_${i}` : ''),
    compareDim: mockDimList[i % 4],
    compareTime: `2025-0${(i % 12)+1}`,
    energyDiff: parseFloat((Math.random() * 1000 - 500).toFixed(2)),
    changeRate: parseFloat((Math.random() * 30 - 15).toFixed(2)),
    forecast: Math.random() > 0.5 ? '后续能耗将趋于平稳' : '预计下月能耗下降5%',
    problem: Math.random() > 0.7 ? '办公区照明待优化' : '无明显异常',
    plan: Math.random() > 0.8 ? '分时控制策略' : '维持现有方案',
    handleUser: ['admin', 'energy_operator', 'maintainer'][i % 3],
    creator: 'admin',
    createTime: Date.now() - i * 86400000,
    updateTime: Date.now() - i * 43200000,
  });
}

/**
 * 模拟分页查询（内部使用）
 * @param {Object} params - 查询参数
 * @param {string} [params.compareName] - 对比名称（模糊匹配）
 * @param {string} [params.compareDim] - 对比维度（同比/环比/区域间/设备间）
 * @param {string} [params.compareTime] - 对比时间（支持字符串或逗号分隔的时间范围）
 * @param {number} [params.pageNo=1] - 当前页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Object} 包含 list 和 total 的分页结果
 */
function mockPage(params) {
  let data = [...mockCompareList];
  if (params.compareName) data = data.filter(item => item.compareName.includes(params.compareName));
  if (params.compareDim) data = data.filter(item => item.compareDim === params.compareDim);
  if (params.compareTime) {
    const timeStr = params.compareTime;
    data = data.filter(item => timeStr.includes(item.compareTime) || item.compareTime.includes(timeStr));
  }
  const pageNo = params.pageNo || 1, pageSize = params.pageSize || 10;
  const list = data.slice((pageNo-1)*pageSize, pageNo*pageSize);
  return { list, total: data.length };
}

// ==================== 对外 API 方法（遵循接口文档） ====================

/**
 * ① 分页查询对比分析列表（筛选、刷新）
 * @param {Object} params - 请求参数
 * @param {string} [params.compareName] - 对比名称（模糊查询）
 * @param {string} [params.compareDim] - 对比维度
 * @param {string} [params.compareTime] - 对比时间（格式：开始时间,结束时间）
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise<{list: Array, total: number}>} 对比分析列表分页数据
 */
export function getCompareAnalyzePage(params) {
  if (USE_MOCK) return Promise.resolve(mockPage(params));
  return requestClient.get('/energymgmt/compare-analyze/page', { params });
}

/**
 * ② 选择对比配置（右侧抽屉提交）
 * @param {Object} data - 请求体
 * @param {string} data.dim - 对比维度（同比/环比/区域间/设备间）
 * @param {string} data.timeRange - 对比时间范围
 * @param {Array<string>} data.targets - 对比目标（区域或设备列表）
 * @returns {Promise<boolean>} 操作结果
 */
export function selectCompareAnalyze(data) {
  if (USE_MOCK) return Promise.resolve(true);
  return requestClient.post('/energymgmt/compare-analyze/select', data);
}

/**
 * ③ 执行能耗数据对比（批量）
 * @param {Object} data - 请求体
 * @param {Array<number>} data.ids - 对比任务ID列表
 * @returns {Promise<boolean>} 操作结果
 */
export function compareAnalyze(data) {
  if (USE_MOCK) return Promise.resolve(true);
  return requestClient.post('/energymgmt/compare-analyze/compare', data);
}

/**
 * ④ 趋势研判（批量）
 * @param {Object} data - 请求体
 * @param {Array<number>} data.ids - 对比任务ID列表
 * @returns {Promise<boolean>} 操作结果
 */
export function judgeCompareAnalyze(data) {
  if (USE_MOCK) return Promise.resolve(true);
  return requestClient.post('/energymgmt/compare-analyze/judge', data);
}

/**
 * ⑤ 问题定位（批量）
 * @param {Object} data - 请求体
 * @param {Array<number>} data.ids - 对比任务ID列表
 * @returns {Promise<boolean>} 操作结果
 */
export function locateCompareAnalyze(data) {
  if (USE_MOCK) return Promise.resolve(true);
  return requestClient.post('/energymgmt/compare-analyze/locate', data);
}

/**
 * ⑥ 导出对比数据（批量）
 * @param {Object} params - 请求参数
 * @param {Array<number>} params.ids - 对比任务ID列表
 * @returns {Promise<Blob>} 导出文件的Blob对象
 */
export function exportCompareAnalyzeExcel(params) {
  if (USE_MOCK) return Promise.resolve(new Blob(['模拟对比数据'], { type: 'application/vnd.ms-excel' }));
  return requestClient.download('/energymgmt/compare-analyze/export', params);
}

/**
 * ⑦ 查看对比详情（单个）
 * @param {number} id - 对比任务ID
 * @returns {Promise<Object>} 对比详情对象
 */
export function getCompareAnalyzeDetail(id) {
  if (USE_MOCK) return Promise.resolve(mockCompareList.find(item => item.id === id) || mockCompareList[0]);
  return requestClient.get('/energymgmt/compare-analyze/get', { params: { id } });
}

/**
 * ⑧ 提交优化方案
 * @param {Object} data - 请求体
 * @param {number} data.id - 对比任务ID
 * @param {string} data.optimizePlan - 优化方案内容
 * @returns {Promise<boolean>} 操作结果
 */
export function optimizeCompareAnalyze(data) {
  if (USE_MOCK) return Promise.resolve(true);
  return requestClient.put('/energymgmt/compare-analyze/optimize', data);
}

/**
 * ⑨ 获取能耗对比分析态势图表数据
 * @param {Object} params - 请求参数
 * @param {string} [params.timeRange] - 时间范围，默认近6个月
 * @returns {Promise<Object>} 包含四个图表数据的对象
 * @property {Array} yoyDiffBar - 同比能耗差值柱状图数据 [{month, value}]
 * @property {Array} momDiffBar - 环比能耗差值柱状图数据
 * @property {Array} yoyTrendLine - 能耗同比趋势折线图数据 [{month, lastYear, thisYear}]
 * @property {Array} momTrendLine - 能耗环比趋势折线图数据 [{month, lastMonth, thisMonth}]
 */
export function getCompareChart(params) {
  if (USE_MOCK) {
    const months = ['11月', '12月', '1月', '2月', '3月', '4月'];
    return Promise.resolve({
      yoyDiffBar: months.map(m => ({ month: m, value: (Math.random() * 400 - 200).toFixed(1) })),
      momDiffBar: months.map(m => ({ month: m, value: (Math.random() * 200 - 100).toFixed(1) })),
      yoyTrendLine: months.map(m => ({ month: m, lastYear: 8000+Math.random()*2000, thisYear: 7800+Math.random()*2000 })),
      momTrendLine: months.map(m => ({ month: m, lastMonth: 8500+Math.random()*1500, thisMonth: 8300+Math.random()*1500 })),
    });
  }
  return requestClient.get('/energymgmt/compare-analyze/chart', { params });
}

/**
 * ⑩ 获取用户详情（用于操作人弹窗）
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 用户详细信息
 */
export function getUserDetail(userId) {
  if (USE_MOCK) return Promise.resolve({ id: userId, nickname: userId === 'admin' ? '管理员' : '分析员', userName: userId });
  return requestClient.get('/system/user/get', { params: { id: userId } });
}
