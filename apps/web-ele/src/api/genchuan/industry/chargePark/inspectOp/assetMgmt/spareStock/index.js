import { requestClient } from '#/api/request.js';

/** 分页查询备件仓储列表 */
export function getSpareStockPage(params) {
  return requestClient.get('/inspectop/spare-stock/page', { params });
}

/** 导出备件仓储数据 */
export function exportSpareStock(params) {
  return requestClient.download('/inspectop/spare-stock/export-excel', {
    params,
  });
}

/** 备件入库 */
export function inSpareStock(data) {
  return requestClient.post('/inspectop/spare-stock/in', data);
}

/** 备件出库 */
export function outSpareStock(data) {
  return requestClient.post('/inspectop/spare-stock/out', data);
}

/** 获取备件仓储详情 */
export function getSpareStockDetail(id) {
  return requestClient.get('/inspectop/spare-stock/get', { params: { id } });
}

/** 备件补货 */
export function replenishSpareStock(data) {
  return requestClient.put('/inspectop/spare-stock/replenish', data);
}

/** 获取备件仓储统计看板 */
export function getSpareStockChart(params) {
  return requestClient.get('/inspectop/spare-stock/chart', { params });
}
