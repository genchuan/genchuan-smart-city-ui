// index.js（API接口）
// 路径: src/api/genchuan/industry/industrialpark/propertyMgmt/paymentMgmt/arrearsMgmt/index.js

import { requestClient } from '#/api/request';

// ==================== 配置开关 ====================
/**
 * 是否使用模拟数据
 * - true: 前端使用本地模拟数据，无需后端接口（开发调试用）
 * - false: 调用真实后端接口（生产环境使用）
 */
const USE_MOCK = true;

// ==================== 模拟数据生成 ====================
let mockArrearsList = null; // 缓存模拟欠费列表（单例模式）

/**
 * 生成模拟的欠费记录数据列表
 * 数据字段与后端接口定义完全一致
 * @returns {Array} 欠费记录对象数组
 */
function generateMockArrears() {
  const companies = ['福建亘川科技有限公司', '智慧能源有限公司', '创新科技园', '科创中心'];
  const items = ['物业费', '水电费', '停车费'];
  const statuses = ['待补缴', '已补缴'];
  const list = [];
  for (let i = 1; i <= 36; i++) {
    const status = statuses[i % 2];
    const repaid = status === '已补缴';
    list.push({
      id: i,
      arrearsCompany: companies[i % companies.length],
      arrearsItem: items[i % 3],
      arrearsAmount: parseFloat((Math.random() * 10000 + 500).toFixed(2)),
      arrearsDuration: Math.floor(Math.random() * 90) + 1,
      arrearsStatus: status,
      repayTime: repaid ? `2025-05-${(i % 28) + 1} 10:30:00` : null,
      repayAmount: repaid ? parseFloat((Math.random() * 10000 + 500).toFixed(2)) : null,
      handleUser: ['admin', 'property_admin', 'enterprise_user'][Math.floor(Math.random() * 3)],
      creator: 'admin',
      updater: 'admin',
      createTime: Date.now() - Math.random() * 86400000 * 30,
      updateTime: Date.now(),
    });
  }
  return list;
}

/**
 * 获取模拟欠费列表（单例缓存）
 * @returns {Array}
 */
function getMockArrears() {
  if (!mockArrearsList) mockArrearsList = generateMockArrears();
  return mockArrearsList;
}

/**
 * 模拟分页查询接口
 * 支持按欠费企业、欠费项目、欠费状态、欠费时长范围筛选
 * @param {Object} params - 查询参数
 * @param {string} [params.arrearsCompany] - 欠费企业，模糊查询
 * @param {string} [params.arrearsItem] - 欠费项目（物业费/水电费/停车费）
 * @param {string} [params.arrearsStatus] - 欠费状态（待补缴/已补缴）
 * @param {string} [params.arrearsDurationRange] - 欠费时长范围（0-30天/30-60天/60天以上）
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise<{list: Array, total: number}>}
 */
async function mockGetPage(params) {
  let data = [...getMockArrears()];
  if (params.arrearsCompany) data = data.filter(item => item.arrearsCompany.includes(params.arrearsCompany));
  if (params.arrearsItem) data = data.filter(item => item.arrearsItem === params.arrearsItem);
  if (params.arrearsStatus) data = data.filter(item => item.arrearsStatus === params.arrearsStatus);
  if (params.arrearsDurationRange) {
    if (params.arrearsDurationRange === '0-30天') data = data.filter(item => item.arrearsDuration <= 30);
    else if (params.arrearsDurationRange === '30-60天') data = data.filter(item => item.arrearsDuration > 30 && item.arrearsDuration <= 60);
    else if (params.arrearsDurationRange === '60天以上') data = data.filter(item => item.arrearsDuration > 60);
  }
  const total = data.length;
  const pageNo = params.pageNo || 1;
  const pageSize = params.pageSize || 10;
  const start = (pageNo - 1) * pageSize;
  const list = data.slice(start, start + pageSize);
  return { list, total };
}

/**
 * 模拟欠费统计接口
 * 返回卡片统计数据（欠费总户数、欠费总金额、补缴数、补缴率）
 * 以及柱状图数据（各类型欠费金额、欠费时长分布）
 * @param {Object} params - 请求参数
 * @param {string} [params.timeRange] - 时间范围（近7天/近30天/本月），模拟中未使用
 * @returns {Promise<{cardData: Object, barData: Object}>}
 */
async function mockGetStatistics(params) {
  const bills = getMockArrears();
  const arrearsCompanyCount = new Set(bills.map(b => b.arrearsCompany)).size;
  const arrearsAmountTotal = bills.reduce((sum, b) => sum + b.arrearsAmount, 0);
  const repayCount = bills.filter(b => b.arrearsStatus === '已补缴').length;
  const repayRate = arrearsCompanyCount ? (repayCount / arrearsCompanyCount) * 100 : 0;
  return {
    cardData: {
      arrearsCompanyCount,
      arrearsAmountTotal,
      repayCount,
      repayRate: parseFloat(repayRate.toFixed(2))
    },
    barData: {
      itemAmount: [
        { item: '物业费', amount: bills.filter(b => b.arrearsItem === '物业费').reduce((s, b) => s + b.arrearsAmount, 0) },
        { item: '水电费', amount: bills.filter(b => b.arrearsItem === '水电费').reduce((s, b) => s + b.arrearsAmount, 0) },
        { item: '停车费', amount: bills.filter(b => b.arrearsItem === '停车费').reduce((s, b) => s + b.arrearsAmount, 0) },
      ],
      durationDistribution: [
        { duration: '0-30天', count: bills.filter(b => b.arrearsDuration <= 30).length },
        { duration: '30-60天', count: bills.filter(b => b.arrearsDuration > 30 && b.arrearsDuration <= 60).length },
        { duration: '60天以上', count: bills.filter(b => b.arrearsDuration > 60).length },
      ]
    }
  };
}

/**
 * 模拟发送提醒通知（批量）
 * @param {Object} data - { ids: number[] }
 * @returns {Promise<boolean>}
 */
async function mockNotify(data) {
  console.log('[Mock] 提醒', data);
  return true;
}

/**
 * 模拟补缴操作（批量）
 * @param {Object} data - { ids: number[], repayAmount: number, payType: string }
 * @returns {Promise<boolean>}
 */
async function mockRepay(data) {
  console.log('[Mock] 补缴', data);
  return true;
}

/**
 * 模拟更新欠费记录（单个）
 * @param {Object} data - { id: number, arrearsAmount?: number, remark?: string }
 * @returns {Promise<boolean>}
 */
async function mockUpdate(data) {
  console.log('[Mock] 更新', data);
  return true;
}

/**
 * 模拟停用服务权限（批量）
 * @param {Object} data - { ids: number[] }
 * @returns {Promise<boolean>}
 */
async function mockDisable(data) {
  console.log('[Mock] 停用', data);
  return true;
}

/**
 * 模拟导出欠费记录
 * @param {Object} params - 筛选条件或 id
 * @returns {Promise<boolean>}
 */
async function mockExport(params) {
  console.log('[Mock] 导出', params);
  return true;
}

/**
 * 模拟获取欠费详情
 * @param {Object} params - { id: number }
 * @returns {Promise<Object>}
 */
async function mockGetDetail(params) {
  return getMockArrears().find(item => item.id === params.id) || getMockArrears()[0];
}

/**
 * 模拟催收（单个）
 * @param {Object} data - { id: number }
 * @returns {Promise<boolean>}
 */
async function mockUrge(data) {
  console.log('[Mock] 催收', data);
  return true;
}

/**
 * 模拟费用减免（单个）
 * @param {Object} data - { id: number, discountAmount: number }
 * @returns {Promise<boolean>}
 */
async function mockDiscount(data) {
  console.log('[Mock] 减免', data);
  return true;
}

/**
 * 模拟获取物业欠费统计态势图表数据
 * 复用 mockGetStatistics 返回相同结构
 * @param {Object} params - { timeRange?: string }
 * @returns {Promise<{cardData: Object, barData: Object}>}
 */
async function mockGetChart(params) {
  return mockGetStatistics(params);
}

// ==================== 对外接口（自动切换 Mock / 真实 API） ====================

/**
 * 分页查询欠费记录列表
 * GET /propertymgmt/arrears-mgmt/page
 * @param {Object} params - 查询参数
 * @param {string} [params.arrearsCompany] - 欠费企业（模糊）
 * @param {string} [params.arrearsItem] - 欠费项目（物业费/水电费/停车费）
 * @param {string} [params.arrearsStatus] - 欠费状态（待补缴/已补缴）
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise<{list: Array, total: number}>}
 */
export function getArrearsPage(params) {
  return USE_MOCK ? mockGetPage(params) : requestClient.get('/propertymgmt/arrears-mgmt/page', { params });
}

/**
 * 欠费统计（园区整体欠费情况）
 * GET /propertymgmt/arrears-mgmt/statistics
 * @param {Object} params - 请求参数
 * @param {string} [params.timeRange] - 时间范围（近7天/近30天/本月）
 * @returns {Promise<{cardData: Object, barData: Object}>}
 */
export function getArrearsStatistics(params) {
  return USE_MOCK ? mockGetStatistics(params) : requestClient.get('/propertymgmt/arrears-mgmt/statistics', { params });
}

/**
 * 发送提醒通知（批量）
 * PUT /propertymgmt/arrears-mgmt/notify
 * @param {Object} data - { ids: number[] }
 * @returns {Promise<boolean>}
 */
export function notifyArrears(data) {
  return USE_MOCK ? mockNotify(data) : requestClient.put('/propertymgmt/arrears-mgmt/notify', data);
}

/**
 * 欠费补缴（批量）
 * PUT /propertymgmt/arrears-mgmt/repay
 * @param {Object} data - { ids: number[], repayAmount: number, payType: string }
 * @returns {Promise<boolean>}
 */
export function repayArrears(data) {
  return USE_MOCK ? mockRepay(data) : requestClient.put('/propertymgmt/arrears-mgmt/repay', data);
}

/**
 * 更新欠费记录（单个）
 * PUT /propertymgmt/arrears-mgmt/update
 * @param {Object} data - { id: number, arrearsAmount?: number, remark?: string }
 * @returns {Promise<boolean>}
 */
export function updateArrears(data) {
  return USE_MOCK ? mockUpdate(data) : requestClient.put('/propertymgmt/arrears-mgmt/update', data);
}

/**
 * 停用服务权限（批量）
 * PUT /propertymgmt/arrears-mgmt/disable
 * @param {Object} data - { ids: number[] }
 * @returns {Promise<boolean>}
 */
export function disableArrears(data) {
  return USE_MOCK ? mockDisable(data) : requestClient.put('/propertymgmt/arrears-mgmt/disable', data);
}

/**
 * 导出欠费记录
 * GET /propertymgmt/arrears-mgmt/export
 * @param {Object} params - 筛选条件或 id
 * @returns {Promise<Blob>} 文件流
 */
export function exportArrears(params) {
  return USE_MOCK ? mockExport(params) : requestClient.get('/propertymgmt/arrears-mgmt/export', { params, responseType: 'blob' });
}

/**
 * 获取欠费详情
 * GET /propertymgmt/arrears-mgmt/get
 * @param {Object} params - { id: number }
 * @returns {Promise<Object>}
 */
export function getArrearsDetail(params) {
  return USE_MOCK ? mockGetDetail(params) : requestClient.get('/propertymgmt/arrears-mgmt/get', { params });
}

/**
 * 催收（单个）
 * PUT /propertymgmt/arrears-mgmt/urge
 * @param {Object} data - { id: number }
 * @returns {Promise<boolean>}
 */
export function urgeArrears(data) {
  return USE_MOCK ? mockUrge(data) : requestClient.put('/propertymgmt/arrears-mgmt/urge', data);
}

/**
 * 费用减免（单个）
 * PUT /propertymgmt/arrears-mgmt/discount
 * @param {Object} data - { id: number, discountAmount: number }
 * @returns {Promise<boolean>}
 */
export function discountArrears(data) {
  return USE_MOCK ? mockDiscount(data) : requestClient.put('/propertymgmt/arrears-mgmt/discount', data);
}

/**
 * 物业欠费统计态势图表数据
 * GET /propertymgmt/arrears-mgmt/chart
 * @param {Object} params - { timeRange?: string }
 * @returns {Promise<{cardData: Object, barData: Object}>}
 */
export function getArrearsChart(params) {
  return USE_MOCK ? mockGetChart(params) : requestClient.get('/propertymgmt/arrears-mgmt/chart', { params });
}
