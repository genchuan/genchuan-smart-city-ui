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
 * @param {number} params.tenantId - 租户 ID，默认 1 必传
 * @returns {Promise}
 */
export function getCycleReportChart(params) {
  return requestClient.get('/marketop/cycle-report/chart', { params });
}

// ==================== 卡片数据钻取接口 ====================

/** 1) 活动数卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillActivityCount(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/activity-count', { params });
}

/** 2) 参与用户数卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillJoinUserCount(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/join-user-count', { params });
}

/** 3) 抽奖量卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillLotteryCount(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/lottery-count', { params });
}

/** 4) 中奖率卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillWinningRate(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/winning-rate', { params });
}

/** 5) 优惠券发放量卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillCouponSendCount(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/coupon-send-count', { params });
}

/** 6) 核销率卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillVerifyRate(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/verify-rate', { params });
}

/** 7) 卡种订单量卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillCardOrderCount(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/card-order-count', { params });
}

/** 8) 营收卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillRevenue(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/revenue', { params });
}

/** 9) 兑换量卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillExchangeCount(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/exchange-count', { params });
}

/** 10) 总库存卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillTotalStock(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/total-stock', { params });
}

/** 11) 预警库存数卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillWarnStockCount(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/warn-stock-count', { params });
}

// ==================== 图表数据钻取接口 ====================

/** 饼图数据钻取
 * @param {object} params - 请求参数
 * @param {string} params.pieType - 饼图类型（规则类型占比 / 配置类型占比 / 券包类型占比），必填
 * @param {string} params.pieName - 点击数据名称（饼图各扇区/图例数据项的label属性值）
 * @param {number} params.pageNo - 页码，从1开始，默认1，必填
 * @param {number} params.pageSize - 每页条数，最大值为200，默认10，必填
 * @returns {Promise}
 */
export function getCycleReportPieDrillData(params) {
  return requestClient.get('/marketop/cycle-report/chart/pie-drill', { params });
}

/** 柱状图数据钻取
 * @param {object} params - 请求参数
 * @param {string} params.categoryType - 柱状图分类基准（活动类型分布 / 奖品类型分布 / 优惠券类型分布 / 卡种类型分布 / 兑换类目订单分布），必填
 * @param {string} params.categoryName - 点击数据名称（对应x轴坐标点或柱条分类名/类目值）
 * @param {number} params.pageNo - 页码，从1开始，默认1，必填
 * @param {number} params.pageSize - 每页条数，最大值为200，默认10，必填
 * @returns {Promise}
 */
export function getCycleReportBarDrillData(params) {
  return requestClient.get('/marketop/cycle-report/chart/bar-drill', { params });
}

/** 折线图数据钻取
 * @param {object} params - 请求参数
 * @param {string} params.date - 时间区间，格式yyyy-MM-dd，必填
 * @param {number} params.pageNo - 页码，从1开始，默认1，必填
 * @param {number} params.pageSize - 每页条数，最大值为200，默认10，必填
 * @returns {Promise}
 */
export function getCycleReportLineDrillData(params) {
  return requestClient.get('/marketop/cycle-report/chart/line-drill', { params });
}
