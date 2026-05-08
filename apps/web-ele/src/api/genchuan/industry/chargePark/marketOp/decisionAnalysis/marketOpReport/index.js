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
 * @param {object} params - 请求参数（作为query参数传递）
 * @param {string} params.reportCycle - 报表周期（日报 / 周报 / 月报 / 季报 / 半年报 / 年报 / 自定义报表），必填
 * @param {string} params.statStartTime - 统计开始时间，必填，格式：string(date-time)
 * @param {string} params.statEndTime - 统计结束时间，必填，格式：string(date-time)
 * @param {string} params.filterRule - 筛选规则，选填
 * @param {number} params.tenantId - 租户 ID，默认 1，选填
 * @returns {Promise}
 */
export function createCycleReport(params) {
  return requestClient.post('/marketop/cycle-report/create', null, { params });
}

/** 导出营销运营周期报表数据
 * @returns {Promise}
 */
export function exportCycleReport() {
  return requestClient.download('/marketop/cycle-report/export');
}

/** 批量导出营销运营周期报表数据（按ID列表）
 * @param {object} params - 请求参数
 * @param {Array<number>} params.ids - 报表ID列表
 * @returns {Promise}
 */
export function batchExportCycleReport(params) {
  return requestClient.download('/marketop/cycle-report/batch-export', {
    params,
  });
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
  return requestClient.get(
    '/marketop/cycle-report/chart/card-drill/activity-count',
    { params },
  );
}

/** 2) 参与用户数卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillJoinUserCount(params) {
  return requestClient.get(
    '/marketop/cycle-report/chart/card-drill/join-user-count',
    { params },
  );
}

/** 3) 抽奖量卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillLotteryCount(params) {
  return requestClient.get(
    '/marketop/cycle-report/chart/card-drill/lottery-count',
    { params },
  );
}

/** 4) 中奖率卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillWinningRate(params) {
  return requestClient.get(
    '/marketop/cycle-report/chart/card-drill/winning-rate',
    { params },
  );
}

/** 5) 优惠券发放量卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillCouponSendCount(params) {
  return requestClient.get(
    '/marketop/cycle-report/chart/card-drill/coupon-send-count',
    { params },
  );
}

/** 6) 核销率卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillVerifyRate(params) {
  return requestClient.get(
    '/marketop/cycle-report/chart/card-drill/verify-rate',
    { params },
  );
}

/** 7) 卡种订单量卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillCardOrderCount(params) {
  return requestClient.get(
    '/marketop/cycle-report/chart/card-drill/card-order-count',
    { params },
  );
}

/** 8) 营收卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillRevenue(params) {
  return requestClient.get('/marketop/cycle-report/chart/card-drill/revenue', {
    params,
  });
}

/** 9) 兑换量卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillExchangeCount(params) {
  return requestClient.get(
    '/marketop/cycle-report/chart/card-drill/exchange-count',
    { params },
  );
}

/** 10) 总库存卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillTotalStock(params) {
  return requestClient.get(
    '/marketop/cycle-report/chart/card-drill/total-stock',
    { params },
  );
}

/** 11) 预警库存数卡片钻取
 * @param {object} params - 请求参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCycleReportCardDrillWarnStockCount(params) {
  return requestClient.get(
    '/marketop/cycle-report/chart/card-drill/warn-stock-count',
    { params },
  );
}

// ==================== 图表数据钻取接口 ====================

/** 饼图数据钻取
 * @param {object} params - 请求参数
 * @param {string} params.pieType - 图例类型（ruleType/configType/packageType：规则类型、配置类型、券包类型），必填
 * @param {string} params.pieValue - 点击区枚举值（对应字典的value值，如ruleType时为1/2），必填
 * @param {number} params.pageNo - 页码，从1开始，默认1，必填
 * @param {number} params.pageSize - 每页条数，最大值为200，默认10，必填
 * @returns {Promise}
 */
export function getCycleReportPieDrillData(params) {
  return requestClient.get('/marketop/cycle-report/chart/pie-drill', {
    params,
  });
}

/** 柱状图数据钻取
 * @param {object} params - 请求参数
 * @param {string} params.categoryType - 柱状图分类类型（activityType/couponType/prizeType/cardType/exchangeCategory/pointActivityType），必填
 *   - activityType：活动分类类别（注册赠分/消费赠分/邀请赠分/活动赠分）
 *   - couponType：优惠券类型（类目优惠券/类目满减优惠券/类目时长优惠券/类目卡种）
 *   - prizeType：奖品类型（实物/虚拟/优惠券/卡种）
 *   - cardType：卡种类别（日卡/周卡/月卡/季卡/年卡）
 *   - exchangeCategory：兑换类目订单分布
 *   - pointActivityType：积分活动类型（注册赠分/消费赠分/邀请赠分/活动赠分）
 * @param {string} [params.categoryValue] - 分类枚举值（对应字典的value值；当categoryType=exchangeCategory时不传此参数，其余情况必传）
 * @param {number} [params.categoryId] - 兑换订单ID（当categoryType=exchangeCategory时必传，用于按类目过滤分类展示）
 * @param {number} params.pageNo - 页码，从1开始，默认1，必填
 * @param {number} params.pageSize - 每页条数，最大值为200，默认10，必填
 * @returns {Promise}
 */
export function getCycleReportBarDrillData(params) {
  return requestClient.get('/marketop/cycle-report/chart/bar-drill', {
    params,
  });
}

/** 折线图数据钻取
 * @param {object} params - 请求参数
 * @param {string} params.lineType - 折线图类型（activityTrend/lotteryTrend/couponSendTrend/orderTrend/stockTrend），必填
 *   - activityTrend：活动趋势（活动参与趋势）
 *   - lotteryTrend：抽奖趋势（抽奖量趋势）
 *   - couponSendTrend：优惠券发放趋势（优惠券发放量趋势）
 *   - orderTrend：订单趋势（订单量趋势）
 *   - stockTrend：库存趋势（库存趋势）
 * @param {string} params.lineName - 趋势名称（对应各趋势的具体名称），必填
 * @param {string} params.date - 对应日期值（格式：yyyy-MM-dd 或 MM-dd），必填
 * @param {number} params.pageNo - 页码，从1开始，默认1，必填
 * @param {number} params.pageSize - 每页条数，最大值为200，默认10，必填
 * @returns {Promise}
 */
export function getCycleReportLineDrillData(params) {
  return requestClient.get('/marketop/cycle-report/chart/line-drill', {
    params,
  });
}

// ==================== 表格字段钻取接口 ====================

/** 1) 活动数表格字段钻取（跳转对应周期活动明细弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.reportId - 报表ID，关联周期报表，必填
 * @param {number} params.pageNo - 页码，默认1，必填
 * @param {number} params.pageSize - 每页条数，默认10，必填
 * @returns {Promise}
 */
export function getTableDrillActivityCount(params) {
  return requestClient.get('/marketop/cycle-report/drill/activity-count', {
    params,
  });
}

/** 2) 参与用户数表格字段钻取（跳转对应周期参与用户明细弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.reportId - 报表ID，关联周期报表，必填
 * @param {number} params.pageNo - 页码，默认1，必填
 * @param {number} params.pageSize - 每页条数，默认10，必填
 * @returns {Promise}
 */
export function getTableDrillJoinUserCount(params) {
  return requestClient.get('/marketop/cycle-report/drill/join-user-count', {
    params,
  });
}

/** 3) 抽奖量表格字段钻取（跳转对应周期积分抽奖明细弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.reportId - 报表ID，关联周期报表，必填
 * @param {number} params.pageNo - 页码，默认1，必填
 * @param {number} params.pageSize - 每页条数，默认10，必填
 * @returns {Promise}
 */
export function getTableDrillLotteryCount(params) {
  return requestClient.get('/marketop/cycle-report/drill/lottery-count', {
    params,
  });
}

/** 4) 中奖率表格字段钻取（跳转对应周期中奖明细弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.reportId - 报表ID，关联周期报表，必填
 * @param {number} params.pageNo - 页码，默认1，必填
 * @param {number} params.pageSize - 每页条数，默认10，必填
 * @returns {Promise}
 */
export function getTableDrillWinningRate(params) {
  return requestClient.get('/marketop/cycle-report/drill/winning-rate', {
    params,
  });
}

/** 5) 优惠券发放量表格字段钻取（跳转对应周期优惠券发放明细弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.reportId - 报表ID，关联周期报表，必填
 * @param {number} params.pageNo - 页码，默认1，必填
 * @param {number} params.pageSize - 每页条数，默认10，必填
 * @returns {Promise}
 */
export function getTableDrillCouponSendCount(params) {
  return requestClient.get('/marketop/cycle-report/drill/coupon-send-count', {
    params,
  });
}

/** 6) 核销率表格字段钻取（跳转对应周期优惠券核销明细弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.reportId - 报表ID，关联周期报表，必填
 * @param {number} params.pageNo - 页码，默认1，必填
 * @param {number} params.pageSize - 每页条数，默认10，必填
 * @returns {Promise}
 */
export function getTableDrillVerifyRate(params) {
  return requestClient.get('/marketop/cycle-report/drill/verify-rate', {
    params,
  });
}

/** 7) 卡种订单量表格字段钻取（跳转对应周期卡种订单明细弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.reportId - 报表ID，关联周期报表，必填
 * @param {number} params.pageNo - 页码，默认1，必填
 * @param {number} params.pageSize - 每页条数，默认10，必填
 * @returns {Promise}
 */
export function getTableDrillCardOrderCount(params) {
  return requestClient.get('/marketop/cycle-report/drill/card-order-count', {
    params,
  });
}

/** 8) 营收表格字段钻取（跳转对应周期营收明细弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.reportId - 报表ID，关联周期报表，必填
 * @param {number} params.pageNo - 页码，默认1，必填
 * @param {number} params.pageSize - 每页条数，默认10，必填
 * @returns {Promise}
 */
export function getTableDrillRevenue(params) {
  return requestClient.get('/marketop/cycle-report/drill/revenue', {
    params,
  });
}

/** 9) 兑换量表格字段钻取（跳转对应周期积分兑换明细弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.reportId - 报表ID，关联周期报表，必填
 * @param {number} params.pageNo - 页码，默认1，必填
 * @param {number} params.pageSize - 每页条数，默认10，必填
 * @returns {Promise}
 */
export function getTableDrillExchangeCount(params) {
  return requestClient.get('/marketop/cycle-report/drill/exchange-count', {
    params,
  });
}

/** 10) 总库存表格字段钻取（跳转对应周期卡种库存总览弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.reportId - 报表ID，关联周期报表，必填
 * @param {number} params.pageNo - 页码，默认1，必填
 * @param {number} params.pageSize - 每页条数，默认10，必填
 * @returns {Promise}
 */
export function getTableDrillTotalStock(params) {
  return requestClient.get('/marketop/cycle-report/drill/total-stock', {
    params,
  });
}

/** 11) 预警库存数表格字段钻取（跳转对应周期预警卡种库存明细弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.reportId - 报表ID，关联周期报表，必填
 * @param {number} params.pageNo - 页码，默认1，必填
 * @param {number} params.pageSize - 每页条数，默认10，必填
 * @returns {Promise}
 */
export function getTableDrillWarnStockCount(params) {
  return requestClient.get('/marketop/cycle-report/drill/warn-stock-count', {
    params,
  });
}
