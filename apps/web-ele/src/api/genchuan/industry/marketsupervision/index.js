import { requestClient } from '#/api/request';
/** 道路实施检测分页 */
export function getWarnList(params) {
  return requestClient.get('/kitchen/ai-alert-message/page', {
    params,
  });
} 


/**整改通知书复审管理 */
export function getRectifyList(params) {
  return requestClient.get('/kitchen/rectify-review/page', {
    params,
  });
} 

/** excel导出 */
export function exporReviewExcel() {
  return requestClient.download('/kitchen/rectify-review/export-excel');
}


/** 批量查看整改复审台账证据分页 */
export function getRectifyEvidence(data) { 
  return requestClient.post('/kitchen/rectify-review/create', data);
}


/** 删除台账数据 */
export function deleteRectifyEvidence(id) {
  return requestClient.delete(`/kitchen/rectify-review/delete?id=${id}`);
}
export function addRectify(data) {
  return requestClient.post(`/kitchen/rectify-review/create`, data);
}
