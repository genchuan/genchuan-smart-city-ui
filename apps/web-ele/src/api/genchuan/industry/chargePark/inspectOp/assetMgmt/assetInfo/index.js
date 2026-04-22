import { requestClient } from '#/api/request.js';

/** 分页查询资产信息列表 */
export function getAssetInfoPage(params) {
  return requestClient.get('/inspectop/asset-info/page', { params });
}

/** 新增资产信息 */
export function createAssetInfo(data) {
  return requestClient.post('/inspectop/asset-info/create', data);
}

/** 导入资产信息 */
export function importAssetInfo(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/inspectop/asset-info/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 导出资产信息数据 */
export function exportAssetInfo(params) {
  return requestClient.download('/inspectop/asset-info/export-excel', {
    params,
  });
}

/** 获取资产信息详情 */
export function getAssetInfoDetail(id) {
  return requestClient.get('/inspectop/asset-info/get', { params: { id } });
}

/** 编辑资产信息 */
export function updateAssetInfo(data) {
  return requestClient.put('/inspectop/asset-info/update', data);
}

/** 禁用资产信息 */
export function disableAssetInfo(data) {
  return requestClient.put('/inspectop/asset-info/disable', data);
}

/** 报废资产信息 */
export function scrapAssetInfo(data) {
  return requestClient.put('/inspectop/asset-info/scrap', data);
}

/** 获取资产信息统计看板 */
export function getAssetInfoChart(params) {
  return requestClient.get('/inspectop/asset-info/chart', { params });
}
