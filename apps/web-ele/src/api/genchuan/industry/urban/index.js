import { requestClient } from '#/api/request';
/** 道路实施检测分页 */
export function getRoadList(params) {
  return requestClient.get('/facility/monitor/realtime-page', {
    params,
  });
}
/** 道路实施增加 */
export function addRoad(data) {
  return requestClient.post('/facility/monitor/create', data);
}
/** 道路实施更新 */
export function updateRoad(data) {
  return requestClient.put('/facility/monitor/update', data);
}
/** 道路实施删除 */
export function deleteRoad(id) {
  return requestClient.delete(`/facility/monitor/delete?id=${id}`);
}

/** excel导出 */
export function exportRoadExcel() {
  return requestClient.download('facility/monitor/export-excel');
}
/** 分割 */

/** 道路实施检测分页 */
export function getRoadConfig(params) {
  return requestClient.get('/facility/road-config/page', {
    params,
  });
}
/** 道路实施检测增加 */
export function addRoadConfig(data) {
  return requestClient.post('/facility/road-config/create', data);
}
/** 道路实施检测更新 */
export function updateRoadConfig(data) {
  return requestClient.put('/facility/road-config/update', data);
}
/** 道路实施检测删除 */
export function deleteRoadConfig(id) {
  return requestClient.delete(`/facility/road-config/delete?id=${id}`);
}
