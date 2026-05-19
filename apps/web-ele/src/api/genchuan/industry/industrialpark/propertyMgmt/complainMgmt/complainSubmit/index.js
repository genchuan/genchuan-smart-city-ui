// index.js（API接口）
// 路径: src/api/genchuan/industry/industrialpark/propertyMgmt/paymentMgmt/billMgmt/index.js

import { requestClient } from '#/api/request';

// ==================== 配置开关 ====================
/**
 * 是否使用模拟数据
 * - true: 前端使用本地模拟数据，无需后端接口（开发调试用）
 * - false: 调用真实后端接口（生产环境使用）
 */
const USE_MOCK = true;

// ==================== 模拟数据生成 ====================
let mockBillList = null; // 缓存模拟账单列表（单例模式）

/**
 * 生成模拟的缴费账单数据列表
 * 数据字段与后端接口定义完全一致
 * @returns {Array} 账单对象数组
 */
function generateMockBills() {
  const companies = ['福建亘川科技有限公司', '智慧能源有限公司', '创新科技园', '科创中心'];
  const items = ['物业费', '水电费', '停车费'];
  const statuses = ['待缴费', '已缴费', '已欠费'];
  const payTypes = ['微信', '支付宝', '银行卡'];
  const list = [];
  for (let i = 1; i <= 36; i++) {
    const status = statuses[i % 3];
    const paid = status === '已缴费';
    const arrears = status === '已欠费';
    list.push({
      id: i,
      billCode: `BILL-202505${i.toString().padStart(3, '0')}`,
      payCompany: companies[i % companies.length],
      payItem: items[i % 3],
      payAmount: parseFloat((Math.random() * 10000 + 500).toFixed(2)),
      payDeadline: `2025-05-${(i % 28) + 1} 23:59:59`,
      billStatus: status,
      payType: paid || arrears ? payTypes[i % 3] : null,
      payTime: paid ? `2025-05-${(i % 28) + 1} 10:30:00` : null,
      invoiceStatus: paid ? (i % 2 === 0 ? '已开具' : '未开具') : '未开具',
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
 * 获取模拟账单列表（单例缓存）
 * @returns {Array}
 */
function getMockBills() {
  if (!mockBillList) mockBillList = generateMockBills();
  return mockBillList;
}

/**
 * 模拟分页查询接口
 * 支持按账单编号、缴费企业、缴费项目、账单状态、支付方式、发票状态、缴费时间筛选
 * @param {Object} params - 查询参数
 * @returns {Promise<{list: Array, total: number}>}
 */
async function mockGetPage(params) {
  let data = [...getMockBills()];
  if (params.billCode) data = data.filter(item => item.billCode.includes(params.billCode));
  if (params.payCompany) data = data.filter(item => item.payCompany.includes(params.payCompany));
  if (params.payItem) data = data.filter(item => item.payItem === params.payItem);
  if (params.billStatus) data = data.filter(item => item.billStatus === params.billStatus);
  if (params.payType) data = data.filter(item => item.payType === params.payType);
  if (params.invoiceStatus) data = data.filter(item => item.invoiceStatus === params.invoiceStatus);
  if (params.payTime) data = data.filter(item => item.payTime && item.payTime.startsWith(params.payTime));
  const total = data.length;
  const pageNo = params.pageNo || 1;
  const pageSize = params.pageSize || 10;
  const start = (pageNo - 1) * pageSize;
  const list = data.slice(start, start + pageSize);
  return { list, total };
}

/**
 * 模拟生成账单
 * @param {Object} data - { payCompany?, payItem?, billMonth }
 * @returns {Promise<boolean>}
 */
async function mockGenerate(data) {
  console.log('[Mock] 生成账单', data);
  return true;
}

/**
 * 模拟核算账单
 * @param {Object} data - { ids }
 * @returns {Promise<boolean>}
 */
async function mockCalculate(data) {
  console.log('[Mock] 核算', data);
  return true;
}

/**
 * 模拟推送通知
 * @param {Object} data - { ids }
 * @returns {Promise<boolean>}
 */
async function mockPush(data) {
  console.log('[Mock] 推送', data);
  return true;
}

/**
 * 模拟在线缴费
 * @param {Object} data - { ids, payType }
 * @returns {Promise<boolean>}
 */
async function mockPay(data) {
  console.log('[Mock] 缴费', data);
  // 实际模拟中可更新账单状态为“已缴费”，此处简化
  return true;
}

/**
 * 模拟开具发票（会实际修改对应账单的发票状态）
 * @param {Object} data - { ids }
 * @returns {Promise<boolean>}
 */
async function mockInvoice(data) {
  console.log('[Mock] 开票', data);
  const bills = getMockBills();
  for (const id of data.ids) {
    const bill = bills.find(b => b.id === id);
    if (bill) {
      bill.invoiceStatus = '已开具';
      bill.updateTime = Date.now();
    }
  }
  return true;
}

/**
 * 模拟导出账单
 * @param {Object} params - 筛选条件
 * @returns {Promise<boolean>}
 */
async function mockExport(params) {
  console.log('[Mock] 导出', params);
  return true;
}

/**
 * 模拟获取账单详情
 * @param {Object} params - { id }
 * @returns {Promise<Object>}
 */
async function mockGetDetail(params) {
  return getMockBills().find(item => item.id === params.id) || getMockBills()[0];
}

/**
 * 模拟催缴
 * @param {Object} data - { id }
 * @returns {Promise<boolean>}
 */
async function mockRemind(data) {
  console.log('[Mock] 催缴', data);
  return true;
}

/**
 * 模拟费用减免
 * @param {Object} data - { id, discountAmount }
 * @returns {Promise<boolean>}
 */
async function mockDiscount(data) {
  console.log('[Mock] 减免', data);
  return true;
}

/**
 * 模拟补缴
 * @param {Object} data - { id, repayAmount, payType }
 * @returns {Promise<boolean>}
 */
async function mockRepay(data) {
  console.log('[Mock] 补缴', data);
  return true;
}

/**
 * 模拟提醒通知
 * @param {Object} data - { id }
 * @returns {Promise<boolean>}
 */
async function mockNotify(data) {
  console.log('[Mock] 提醒', data);
  return true;
}

/**
 * 模拟停用服务权限
 * @param {Object} data - { id }
 * @returns {Promise<boolean>}
 */
async function mockDisable(data) {
  console.log('[Mock] 停用', data);
  return true;
}

/**
 * 模拟编辑账单
 * @param {Object} data - { id, ...fields }
 * @returns {Promise<boolean>}
 */
async function mockUpdate(data) {
  console.log('[Mock] 编辑', data);
  return true;
}

/**
 * 模拟物业缴费态势图表数据
 * 返回卡片数据（账单总数、已缴数、欠费数、营收总额、缴费率）
 * 及折线图数据（每日缴费趋势、营收趋势）
 * @param {Object} params - { timeRange }
 * @returns {Promise<Object>}
 */
async function mockGetChart(params) {
  const bills = getMockBills();
  const billTotal = bills.length;
  const paidCount = bills.filter(b => b.billStatus === '已缴费').length;
  const arrearsCount = bills.filter(b => b.billStatus === '已欠费').length;
  const incomeTotal = bills.filter(b => b.billStatus === '已缴费').reduce((sum, b) => sum + b.payAmount, 0);
  const payRate = billTotal ? (paidCount / billTotal) * 100 : 0;
  const dailyPayTrend = [];
  const incomeTrend = [];
  for (let i = 1; i <= 30; i++) {
    const date = `2025-05-${i.toString().padStart(2, '0')}`;
    dailyPayTrend.push({ date, count: Math.floor(Math.random() * 10) });
    incomeTrend.push({ date, amount: Math.random() * 50000 + 10000 });
  }
  return {
    cardData: {
      billTotal,
      paidCount,
      arrearsCount,
      incomeTotal: parseFloat(incomeTotal.toFixed(2)),
      payRate: parseFloat(payRate.toFixed(2)),
    },
    lineData: { dailyPayTrend, incomeTrend },
  };
}

// ==================== 对外接口（自动切换 Mock / 真实 API） ====================

/**
 * 分页查询账单列表
 * GET /propertymgmt/bill-mgmt/page
 * @param {Object} params - 查询参数
 * @param {string} [params.billCode] - 账单编号（模糊）
 * @param {string} [params.payCompany] - 缴费企业（模糊）
 * @param {string} [params.payItem] - 缴费项目（物业费/水电费/停车费）
 * @param {string} [params.billStatus] - 账单状态（待缴费/已缴费/已欠费）
 * @param {string} [params.payType] - 支付方式（微信/支付宝/银行卡）
 * @param {string} [params.invoiceStatus] - 发票状态（已开具/未开具）
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise<{list: Array, total: number}>}
 */
export function getBillPage(params) {
  return USE_MOCK ? mockGetPage(params) : requestClient.get('/propertymgmt/bill-mgmt/page', { params });
}

/**
 * 生成账单（批量）
 * POST /propertymgmt/bill-mgmt/generate
 * @param {Object} data
 * @param {string} [data.payCompany] - 缴费企业，为空则全量生成
 * @param {string} [data.payItem] - 缴费项目，为空则全项目生成
 * @param {string} data.billMonth - 账单月份，格式 yyyy-MM
 * @returns {Promise<boolean>}
 */
export function generateBill(data) {
  return USE_MOCK ? mockGenerate(data) : requestClient.post('/propertymgmt/bill-mgmt/generate', data);
}

/**
 * 核算账单费用（批量）
 * PUT /propertymgmt/bill-mgmt/calculate
 * @param {Object} data
 * @param {number[]} data.ids - 账单ID集合
 * @returns {Promise<boolean>}
 */
export function calculateBill(data) {
  return USE_MOCK ? mockCalculate(data) : requestClient.put('/propertymgmt/bill-mgmt/calculate', data);
}

/**
 * 推送账单通知（批量）
 * PUT /propertymgmt/bill-mgmt/push
 * @param {Object} data
 * @param {number[]} data.ids - 账单ID集合
 * @returns {Promise<boolean>}
 */
export function pushBill(data) {
  return USE_MOCK ? mockPush(data) : requestClient.put('/propertymgmt/bill-mgmt/push', data);
}

/**
 * 在线缴费（批量）
 * PUT /propertymgmt/bill-mgmt/pay
 * @param {Object} data
 * @param {number[]} data.ids - 账单ID集合
 * @param {string} data.payType - 支付方式（微信/支付宝/银行卡）
 * @returns {Promise<boolean>}
 */
export function payBill(data) {
  return USE_MOCK ? mockPay(data) : requestClient.put('/propertymgmt/bill-mgmt/pay', data);
}

/**
 * 开具发票（批量）
 * PUT /propertymgmt/bill-mgmt/invoice
 * @param {Object} data
 * @param {number[]} data.ids - 账单ID集合
 * @returns {Promise<boolean>}
 */
export function invoiceBill(data) {
  return USE_MOCK ? mockInvoice(data) : requestClient.put('/propertymgmt/bill-mgmt/invoice', data);
}

/**
 * 导出账单（支持筛选条件）
 * GET /propertymgmt/bill-mgmt/export
 * @param {Object} params - 同分页查询参数，也可指定账单编号等
 * @returns {Promise<Blob>} 文件流
 */
export function exportBill(params) {
  return USE_MOCK ? mockExport(params) : requestClient.get('/propertymgmt/bill-mgmt/export', { params, responseType: 'blob' });
}

/**
 * 获取账单详情
 * GET /propertymgmt/bill-mgmt/get
 * @param {Object} params
 * @param {number} params.id - 账单ID
 * @returns {Promise<Object>}
 */
export function getBillDetail(params) {
  return USE_MOCK ? mockGetDetail(params) : requestClient.get('/propertymgmt/bill-mgmt/get', { params });
}

/**
 * 催缴（单个）
 * PUT /propertymgmt/bill-mgmt/remind
 * @param {Object} data
 * @param {number} data.id - 账单ID
 * @returns {Promise<boolean>}
 */
export function remindBill(data) {
  return USE_MOCK ? mockRemind(data) : requestClient.put('/propertymgmt/bill-mgmt/remind', data);
}

/**
 * 费用减免（单个）
 * PUT /propertymgmt/bill-mgmt/discount
 * @param {Object} data
 * @param {number} data.id - 账单ID
 * @param {number} data.discountAmount - 减免金额
 * @returns {Promise<boolean>}
 */
export function discountBill(data) {
  return USE_MOCK ? mockDiscount(data) : requestClient.put('/propertymgmt/bill-mgmt/discount', data);
}

/**
 * 补缴欠费（单个）
 * PUT /propertymgmt/bill-mgmt/repay
 * @param {Object} data
 * @param {number} data.id - 账单ID
 * @param {number} data.repayAmount - 补缴金额
 * @param {string} data.payType - 支付方式（微信/支付宝/银行卡）
 * @returns {Promise<boolean>}
 */
export function repayBill(data) {
  return USE_MOCK ? mockRepay(data) : requestClient.put('/propertymgmt/bill-mgmt/repay', data);
}

/**
 * 提醒通知（单个）
 * PUT /propertymgmt/bill-mgmt/notify
 * @param {Object} data
 * @param {number} data.id - 账单ID
 * @returns {Promise<boolean>}
 */
export function notifyBill(data) {
  return USE_MOCK ? mockNotify(data) : requestClient.put('/propertymgmt/bill-mgmt/notify', data);
}

/**
 * 停用服务权限（单个）
 * PUT /propertymgmt/bill-mgmt/disable
 * @param {Object} data
 * @param {number} data.id - 账单ID
 * @returns {Promise<boolean>}
 */
export function disableBill(data) {
  return USE_MOCK ? mockDisable(data) : requestClient.put('/propertymgmt/bill-mgmt/disable', data);
}

/**
 * 编辑账单基础信息（单个）
 * PUT /propertymgmt/bill-mgmt/update
 * @param {Object} data
 * @param {number} data.id - 账单ID
 * @param {string} [data.billCode] - 账单编号
 * @param {string} [data.payCompany] - 缴费企业
 * @param {string} [data.payItem] - 缴费项目
 * @param {number} [data.payAmount] - 缴费金额
 * @param {string} [data.payDeadline] - 缴费期限
 * @param {string} [data.billStatus] - 账单状态
 * @returns {Promise<boolean>}
 */
export function updateBill(data) {
  return USE_MOCK ? mockUpdate(data) : requestClient.put('/propertymgmt/bill-mgmt/update', data);
}

/**
 * 获取物业缴费态势图表数据
 * GET /propertymgmt/bill-mgmt/chart
 * @param {Object} params
 * @param {string} [params.timeRange] - 时间范围（近7天/近30天/本月）
 * @returns {Promise<{cardData: Object, lineData: Object}>}
 */
export function getBillChart(params) {
  return USE_MOCK ? mockGetChart(params) : requestClient.get('/propertymgmt/bill-mgmt/chart', { params });
}
