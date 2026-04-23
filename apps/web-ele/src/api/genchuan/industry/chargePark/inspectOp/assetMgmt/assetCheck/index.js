import { requestClient } from '#/api/request.js';

/** 分页查询资产盘点列表 */
export function getAssetCheckPage(params) {
  return requestClient.get('/inspectop/asset-check/page', { params });
}

/** 导出资产盘点数据 */
export function exportAssetCheck(params) {
  return requestClient.download('/inspectop/asset-check/export-excel', {
    params,
  });
}

/** 发起资产盘点 */
export function createAssetCheck(data) {
  return requestClient.post('/inspectop/asset-check/create', data);
}

/** 获取资产盘点详情 */
export function getAssetCheckDetail(id) {
  return requestClient.get('/inspectop/asset-check/get', { params: { id } });
}

/** 执行资产盘点 */
export function executeAssetCheck(data) {
  return requestClient.put('/inspectop/asset-check/execute', data);
}

/** 更新资产盘点进度 */
export function updateAssetCheckProgress(data) {
  return requestClient.put('/inspectop/asset-check/update-progress', data);
}

/** 确认资产盘点结果 */
export function confirmAssetCheck(data) {
  return requestClient.put('/inspectop/asset-check/confirm', data);
}

/** 获取资产盘点统计看板 */
export function getAssetCheckChart(params) {
  return requestClient.get('/inspectop/asset-check/chart', { params });
}
