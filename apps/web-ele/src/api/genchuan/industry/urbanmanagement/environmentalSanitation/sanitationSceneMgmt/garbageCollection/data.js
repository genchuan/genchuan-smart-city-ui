import { baseRequestClient, requestClient } from '#/api/request';
import { useAccessStore } from '@vben/stores';

// ---------- API 接口函数 ----------
// 获取各状态数量统计（用于标签页计数）
export function getGarbageCollectionStatistics() {
  return requestClient.get('/envirhealth/garbage-collection/chart/statistics');
}

/**
 * 导出垃圾收运计划列表 Excel
 * @param {Object} params - 查询参数（与分页列表参数一致）
 * @returns {Promise<Blob>} 返回二进制文件流
 */
export async function exportGarbageCollectionExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get('/envirhealth/garbage-collection/export-excel', {
    params,
    responseType: 'blob',
    validateStatus: () => true,
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

/**
 * 导出垃圾异常记录 Excel
 * @param {Object} params - 查询参数（与分页列表参数一致）
 * @returns {Promise<Blob>} 返回二进制文件流
 */
export async function exportGarbageAbnormalExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get('/envirhealth/plan-status/export-excel', {
    params,
    responseType: 'blob',
    validateStatus: () => true,
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

/**
 * 分页查询垃圾收运计划列表
 * @param {Object} params - 分页及筛选参数
 * @returns {Promise<Object>} 返回分页数据
 */
export function getGarbageCollectionPage(params) {
  return requestClient.get('/envirhealth/garbage-collection/detail-page', { params });
}

/**
 * 分页查询垃圾异常记录列表
 * @param {Object} params - 分页及筛选参数
 * @returns {Promise<Object>} 返回分页数据
 */
export function getGarbageAbnormalPage(params) {
  return requestClient.get('/envirhealth/garbage-abnormal/detail-page', { params });
}

/**
 * 创建垃圾收运计划
 * @param {Object} data - 表单数据
 * @returns {Promise}
 */
export function createGarbageCollection(data) {
  return requestClient.post('/envirhealth/garbage-collection/create', data);
}

/**
 * 根据ID获取垃圾收运计划详情
 * @param {string|number} id - 计划ID
 * @returns {Promise<Object>} 返回计划详情
 */
export function getGarbageCollection(id) {
  return requestClient.get('/envirhealth/garbage-collection/get', { params: { id } });
}

/**
 * 更新垃圾收运计划
 * @param {Object} data - 包含ID的更新数据
 * @returns {Promise}
 */
export function updateGarbageCollection(data) {
  return requestClient.put('/envirhealth/garbage-collection/update', data);
}

/**
 * 删除单个垃圾收运计划
 * @param {string|number} id - 计划ID
 * @returns {Promise}
 */
export function deleteGarbageCollection(id) {
  return requestClient.delete(`/envirhealth/garbage-collection/delete?id=${id}`);
}

/**
 * 批量删除垃圾收运计划
 * @param {Array} ids - 计划ID数组
 * @returns {Promise}
 */
export function deleteGarbageCollectionBatch(ids) {
  return requestClient.delete('/envirhealth/garbage-collection/delete-batch', { data: ids });
}

// 异常数据接口

/**
 * 创建垃圾异常记录
 * @param {Object} data - 异常表单数据
 * @returns {Promise}
 */
export function createGarbageAbnormal(data) {
  return requestClient.post('/envirhealth/garbage-abnormal/create', data);
}

/**
 * 更新垃圾异常记录
 * @param {Object} data - 包含ID的更新数据
 * @returns {Promise}
 */
export function updateGarbageAbnormal(data) {
  return requestClient.put('/envirhealth/garbage-abnormal/update', data);
}

/**
 * 删除单个垃圾异常记录
 * @param {string|number} id - 异常ID
 * @returns {Promise}
 */
export function deleteGarbageAbnormal(id) {
  return requestClient.delete(`/envirhealth/garbage-abnormal/delete?id=${id}`);
}

// ------全部状态下------

/**
 * 获取垃圾收运概览卡片数据（全部状态）
 * @returns {Promise<Object>} 返回 totalCount, executingCount, completedCount, abnormalCount 等
 */
export function getGarbageCollectionStats() {
  return requestClient.get('/envirhealth/garbage-collection/chart/card-all');
}

/**
 * 获取垃圾类型占比饼图数据（全部状态）
 * @returns {Promise<Array>} 返回 [{ name, value, proportion }]
 */
export function getGarbageTypeCircle() {
  return requestClient.get('/envirhealth/garbage-collection/chart/garbage-type-circle-all');
}

/**
 * 获取计划状态占比饼图数据（全部状态）
 * @returns {Promise<Array>} 返回 [{ name, value, proportion }]
 */
export function getPlanStatusCircle() {
  return requestClient.get('/envirhealth/garbage-collection/chart/plan-status-circle-all');
}

/**
 * 获取区域分布占比饼图数据（全部状态）
 * @returns {Promise<Array>} 返回 [{ name, value, proportion }]
 */
export function getAreaDistributionCircle() {
  return requestClient.get('/envirhealth/garbage-collection/chart/area-distribution-circle-all');
}

/**
 * 获取区域完成率柱状图数据（全部状态）
 * @returns {Promise<Array>} 返回 [{ areaName, completionRate }]
 */
export function getAreaCompletionRateColumn() {
  return requestClient.get('/envirhealth/garbage-collection/chart/area-completion-rate-column-all');
}

// ------异常状态下------

/**
 * 获取异常待处置卡片数据
 * @returns {Promise<Object>} 返回 toHandleTotal, highPriorityTotal, timeoutTotal
 */
export function getGarbageAbnormalCard() {
  return requestClient.get('/envirhealth/garbage-abnormal/chart/card-abnormal');
}

/**
 * 获取异常类型占比饼图数据（用于异常待处置）
 * @returns {Promise<Array>} 返回 [{ name, value, proportion }]
 */
export function getGarbageAbnormalTypeCircle() {
  return requestClient.get('/envirhealth/garbage-abnormal/chart/circle-abnormal-type');
}

/**
 * 获取异常类型占比饼图数据（用于处置待复核）
 * @returns {Promise<Array>} 返回 [{ name, value, proportion }]
 */
export function getGarbageAbnormalTypeCircleForReview() {
  return requestClient.get('/envirhealth/garbage-abnormal/chart/circle-abnormal-type-for-review');
}

/**
 * 获取异常区域分布占比饼图数据
 * @returns {Promise<Array>} 返回 [{ name, value, proportion }]
 */
export function getGarbageAbnormalAreaCircle() {
  return requestClient.get('/envirhealth/garbage-abnormal/chart/circle-area-distribution');
}

/**
 * 获取异常责任人柱状图数据
 * @returns {Promise<Array>} 返回 [{ name, value }] 责任人及其异常数量
 */
export function getGarbageAbnormalColumn() {
  return requestClient.get('/envirhealth/garbage-abnormal/chart/column-abnormal');
}

/**
 * 获取处置待复核卡片数据
 * @returns {Promise<Object>} 返回 reviewTotal, passedCount, returnCount
 */
export function getGarbageAbnormalReviewCard() {
  return requestClient.get('/envirhealth/garbage-abnormal/chart/card-review');
}

/**
 * 获取复核结果占比饼图数据
 * @returns {Promise<Array>} 返回 [{ name, value, proportion }]
 */
export function getGarbageAbnormalReviewResultCircle() {
  return requestClient.get('/envirhealth/garbage-abnormal/chart/circle-review-result');
}

/**
 * 获取异常处置平均时长柱状图数据
 * @returns {Promise<Array>} 返回 [{ name, avgHandleHours }]
 */
export function getGarbageAbnormalAvgHandleColumn() {
  return requestClient.get('/envirhealth/garbage-abnormal/chart/column-avg-handle-time');
}

// 计划待执行

/**
 * 获取计划待执行卡片数据
 * @returns {Promise<Object>} 返回 totalPendingCount, areaPendingCountMap, garbageTypePendingCountMap
 */
export function getGarbageCollectionCardPending() {
  return requestClient.get('/envirhealth/garbage-collection/chart/card-pending');
}

/**
 * 获取计划待执行区域分布饼图数据
 * @returns {Promise<Array>} 返回 [{ name, value, proportion }]
 */
export function getGarbageCollectionPendingByArea() {
  return requestClient.get('/envirhealth/garbage-collection/chart/pending-by-area');
}

/**
 * 获取计划待执行品类分布饼图数据
 * @returns {Promise<Array>} 返回 [{ name, value, proportion }]
 */
export function getGarbageCollectionPendingByGarbageType() {
  return requestClient.get('/envirhealth/garbage-collection/chart/pending-by-garbage-type');
}

/**
 * 获取计划待执行时段分布柱状图数据
 * @returns {Promise<Array>} 返回 [{ timePeriod, count }]
 */
export function getGarbageCollectionTimePeriodPendingColumn() {
  return requestClient.get('/envirhealth/garbage-collection/chart/time-period-pending-column');
}

// 作业进行中

/**
 * 获取作业进行中卡片数据
 * @returns {Promise<Object>} 返回 currentTaskCount, normalRunningCount, abnormalCount
 */
export function getGarbageCollectionCardExecuting() {
  return requestClient.get('/envirhealth/garbage-collection/chart/card-executing');
}

/**
 * 获取作业进行中日收运量趋势数据
 * @returns {Promise<Array>} 返回 [{ timePoint, collectedVolume, cumulativeVolume }]
 */
export function getGarbageCollectionTrendDailyVolume() {
  return requestClient.get('/envirhealth/garbage-collection/chart/trend-daily-volume');
}

// 已完成

/**
 * 获取已完成卡片数据
 * @returns {Promise<Object>} 返回 completedTaskCount, totalCollectedVolume, averageCompletionRate, abnormalCompleteRate
 */
export function getGarbageCollectionCardCompleted() {
  return requestClient.get('/envirhealth/garbage-collection/chart/card-completed');
}

/**
 * 获取已完成收运完成率趋势数据
 * @param {Object} params - 包含 startTime, endTime (格式 YYYY-MM-DD HH:MM:SS)
 * @returns {Promise<Array>} 返回 [{ date, completionRate }]
 */
export function getGarbageCollectionCompletionRateTrend(params) {
  return requestClient.get('/envirhealth/garbage-collection/chart/completion-rate-trend', { params });
}

/**
 * 获取已完成收运量对比数据
 * @param {Object} params - 包含 dimension, startTime, endTime (dimension: day/week/month)
 * @returns {Promise<Array>} 返回 [{ timeDimension, collectedVolume }]
 */
export function getGarbageCollectionVolumeComparison(params) {
  return requestClient.get('/envirhealth/garbage-collection/chart/collection-volume-comparison', { params });
}

/**
 * 获取已完成品类收运量占比饼图数据
 * @returns {Promise<Array>} 返回 [{ name, value, proportion }]
 */
export function getGarbageCollectionCompletedVolumeByGarbageType() {
  return requestClient.get('/envirhealth/garbage-collection/chart/completed-volume-by-garbage-type');
}

/**
 * 获取已完成区域收运量占比饼图数据
 * @returns {Promise<Array>} 返回 [{ name, value, proportion }]
 */
export function getGarbageCollectionCompletedVolumeByArea() {
  return requestClient.get('/envirhealth/garbage-collection/chart/completed-volume-by-area');
}
