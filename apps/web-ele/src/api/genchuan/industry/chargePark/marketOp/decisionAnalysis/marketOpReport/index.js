import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询营销运营周期报表列表
 * @param {object} params - 请求参数
 * @param {string} params.reportCycle - 报表周期（日报 / 周报 / 月报 / 季报 / 半年报 / 年报 / 自定义报表）
 * @param {string} params.statStartTime - 统计开始时间
 * @param {string} params.statEndTime - 统计结束时间
 * @param {string} params.generateStatus - 报表生成状态（已生成 / 生成中 / 生成失败）
 * @param {number} params.pageNo - 页码，默认 1
 * @param {number} params.pageSize - 每页条数，默认 10
 * @param {number} params.tenantId - 租户 ID，默认 1
 * @returns {Promise}
 */
export function getCycleReportPage(params) {
  return requestClient.get('/marketop/cycle-report/page', { params });
}

/** 生成营销运营周期报表
 * @param {object} data - 请求参数
 * @param {string} data.reportCycle - 报表周期（日报 / 周报 / 月报 / 季报 / 半年报 / 年报 / 自定义报表）
 * @param {string} data.statStartTime - 统计开始时间
 * @param {string} data.statEndTime - 统计结束时间
 * @param {string} data.filterRule - 筛选规则
 * @param {number} data.tenantId - 租户 ID，默认 1
 * @returns {Promise}
 */
export function createCycleReport(data) {
  return requestClient.post('/marketop/cycle-report/create', data);
}

/** 导出营销运营周期报表数据
 * @returns {Promise}
 */
export function exportCycleReport() {
  return requestClient.download('/marketop/cycle-report/export');
}

// ==================== 列表行交互操作接口 ====================

/** 获取营销运营周期报表详情
 * @param {object} params - 请求参数
 * @param {number} params.id - 报表主键 ID
 * @returns {Promise}
 */
export function getCycleReportDetail(params) {
  return requestClient.get('/marketop/cycle-report/get', { params });
}

// ==================== 数据可视化图表接口 ====================

/** 营销运营周期报表统计（卡片 + 折线图 + 柱状图 + 饼图）
 * @param {object} params - 请求参数
 * @param {string} params.reportCycle - 报表周期（日报 / 周报 / 月报 / 季报 / 半年报 / 年报 / 自定义报表）
 * @param {string} params.statStartTime - 统计开始时间
 * @param {string} params.statEndTime - 统计结束时间
 * @param {number} params.tenantId - 租户 ID，默认 1
 * @returns {Promise}
 */
export function getCycleReportChart(params) {
  return requestClient.get('/marketop/cycle-report/chart', { params });
}

/** 卡片数据钻取
 * @param {object} params - 请求参数
 * @param {string} params.cardType - 卡片类型（activityCount / joinUserCount / lotteryCount / winningRate / couponSendCount / couponVerifyRate / cardOrderCount / revenue / exchangeCount / totalStock / warnStockCount）
 * @param {string} params.reportCycle - 报表周期
 * @param {string} params.statStartTime - 统计开始时间
 * @param {string} params.statEndTime - 统计结束时间
 * @param {number} params.tenantId - 租户 ID
 * @returns {Promise}
 */
export function getCycleReportCardDrill(params) {
  return requestClient.get('/marketop/cycle-report/chart/card', { params });
}

/** 折线图数据钻取
 * @param {object} params - 请求参数
 * @param {string} params.lineType - 折线类型（活动参与趋势 / 抽奖量趋势 / 优惠券发放趋势 / 订单量趋势 / 库存趋势）
 * @param {string} params.date - 日期
 * @param {string} params.reportCycle - 报表周期
 * @param {number} params.tenantId - 租户 ID
 * @returns {Promise}
 */
export function getCycleReportLineDrill(params) {
  return requestClient.get('/marketop/cycle-report/chart/line', { params });
}

/** 柱状图数据钻取
 * @param {object} params - 请求参数
 * @param {string} params.barType - 柱状类型（活动类型分布 / 奖品类型分布 / 优惠券类型分布 / 卡种类型分布 / 兑换类目订单分布）
 * @param {string} params.type - 类型值
 * @param {string} params.reportCycle - 报表周期
 * @param {number} params.tenantId - 租户 ID
 * @returns {Promise}
 */
export function getCycleReportBarDrill(params) {
  return requestClient.get('/marketop/cycle-report/chart/bar', { params });
}

/** 饼图数据钻取
 * @param {object} params - 请求参数
 * @param {string} params.pieType - 饼图类型（规则类型占比 / 配置类型占比 / 券包类型占比）
 * @param {string} params.type - 类型值
 * @param {string} params.reportCycle - 报表周期
 * @param {number} params.tenantId - 租户 ID
 * @returns {Promise}
 */
export function getCycleReportPieDrill(params) {
  return requestClient.get('/marketop/cycle-report/chart/pie', { params });
}
