import { requestClient } from '#/api/request.js';

/** 分页查询库存管理列表 */
export function getAssetStockPage(params) {
  return requestClient.get('/inspectop/asset-stock/page', { params });
}

/** 导出库存管理数据 */
export function exportAssetStock(params) {
  return requestClient.download('/inspectop/asset-stock/export-excel', {
    params,
  });
}

/** 调配库存 */
export function allocateAssetStock(data) {
  return requestClient.put('/inspectop/asset-stock/allocate', data);
}

/** 获取库存详情 */
export function getAssetStockDetail(id) {
  return requestClient.get('/inspectop/asset-stock/get', { params: { id } });
}

/** 补货库存 */
export function replenishAssetStock(data) {
  return requestClient.put('/inspectop/asset-stock/replenish', data);
}

/** 推送库存告警 */
export function alarmAssetStock(data) {
  return requestClient.put('/inspectop/asset-stock/alarm', data);
}

/** 获取资产库存统计看板 */
export function getAssetStockChart(params) {
  return requestClient.get('/inspectop/asset-stock/chart', { params });
}

/** 更新库存 */
export function updateAssetStock(data) {
  return requestClient.put('/inspectop/asset-stock/update', data);
}
