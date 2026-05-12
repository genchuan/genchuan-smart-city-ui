// index.js - 能耗对比分析 API（支持模拟数据）
import { requestClient } from '#/api/request';

const USE_MOCK = true;  // 上线前改为 false

// ==================== 模拟数据 ====================
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

function mockPage(params) {
  let data = [...mockCompareList];
  if (params.compareName) data = data.filter(item => item.compareName.includes(params.compareName));
  if (params.compareDim) data = data.filter(item => item.compareDim === params.compareDim);
  if (params.compareTime && params.compareTime.length) {
    // 简化的时间范围过滤
    const [start] = params.compareTime;
    data = data.filter(item => item.compareTime >= start.substring(0,7));
  }
  const pageNo = params.pageNo || 1, pageSize = params.pageSize || 10;
  const list = data.slice((pageNo-1)*pageSize, pageNo*pageSize);
  return { list, total: data.length };
}

export function getCompareAnalyzePage(params) {
  if (USE_MOCK) return Promise.resolve(mockPage(params));
  return requestClient.get('/energymgmt/compare-analyze/page', { params });
}
export function selectCompareAnalyze(data) {
  if (USE_MOCK) return Promise.resolve(true);
  return requestClient.post('/energymgmt/compare-analyze/select', data);
}
export function compareAnalyze(data) {
  if (USE_MOCK) return Promise.resolve(true);
  return requestClient.post('/energymgmt/compare-analyze/compare', data);
}
export function judgeCompareAnalyze(data) {
  if (USE_MOCK) return Promise.resolve(true);
  return requestClient.post('/energymgmt/compare-analyze/judge', data);
}
export function locateCompareAnalyze(data) {
  if (USE_MOCK) return Promise.resolve(true);
  return requestClient.post('/energymgmt/compare-analyze/locate', data);
}
export function exportCompareAnalyzeExcel(params) {
  if (USE_MOCK) return Promise.resolve(new Blob(['模拟对比数据'], { type: 'application/vnd.ms-excel' }));
  return requestClient.download('/energymgmt/compare-analyze/export', params);
}
export function getCompareAnalyzeDetail(id) {
  if (USE_MOCK) return Promise.resolve(mockCompareList.find(item => item.id === id) || mockCompareList[0]);
  return requestClient.get('/energymgmt/compare-analyze/get', { params: { id } });
}
export function optimizeCompareAnalyze(data) {
  if (USE_MOCK) return Promise.resolve(true);
  return requestClient.put('/energymgmt/compare-analyze/optimize', data);
}
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
export function getUserDetail(userId) {
  if (USE_MOCK) return Promise.resolve({ id: userId, nickname: userId === 'admin' ? '管理员' : '分析员', userName: userId });
  return requestClient.get('/system/user/get', { params: { id: userId } });
}
