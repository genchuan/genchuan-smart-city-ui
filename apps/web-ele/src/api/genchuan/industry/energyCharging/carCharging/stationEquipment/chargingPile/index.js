// charging-pile/index.js
import { requestClient } from '#/api/request.js';

/**
 * 分页查询充电桩列表（支持筛选和刷新）
 * @param {Object} params
 * @returns {Promise}
 */
export function getPageList(params) {
  return requestClient.get('/vehiclecharging/charging-pile/page', { params });
}

/**
 * 新增充电桩
 * @param {Object} data
 * @returns {Promise}
 */
export function createPile(data) {
  return requestClient.post('/vehiclecharging/charging-pile/create', data);
}

/**
 * 编辑充电桩
 * @param {Object} data
 * @returns {Promise}
 */
export function updatePile(data) {
  return requestClient.put('/vehiclecharging/charging-pile/update', data);
}

/**
 * 删除充电桩
 * @param {number} id
 * @returns {Promise}
 */
export function deletePile(id) {
  return requestClient.delete(`/vehiclecharging/charging-pile/delete?id=${id}`);
}

/**
 * 调试充电桩（支持批量，id用逗号分隔）
 * @param {Object} data - { id, debugResult }
 * @returns {Promise}
 */
export function debugPile(data) {
  return requestClient.put('/vehiclecharging/charging-pile/debug', data);
}

/**
 * 启用充电桩
 * @param {Object} data - { id }
 * @returns {Promise}
 */
export function enablePile(data) {
  return requestClient.put('/vehiclecharging/charging-pile/enable', data);
}

/**
 * 停用充电桩
 * @param {Object} data - { id, stopReason }
 * @returns {Promise}
 */
export function disablePile(data) {
  return requestClient.put('/vehiclecharging/charging-pile/disable', data);
}

/**
 * 重启充电桩
 * @param {Object} data - { id }
 * @returns {Promise}
 */
export function restartPile(data) {
  return requestClient.post('/vehiclecharging/charging-pile/restart', data);
}

/**
 * 获取充电枪二维码（Base64）
 * @param {number} id
 * @returns {Promise<string>}
 */
export function getQrcode(id) {
  return requestClient.get(`/vehiclecharging/charging-pile/qrcode?id=${id}`);
}

/**
 * 导出充电桩数据（支持 Excel/PDF，目前仅Excel有效）
 * @param {Object} params - 包含 exportType, 以及筛选条件
 * @returns {Promise<Blob>}
 */
export function exportPile(params) {
  // 实际后端可能只支持Excel，这里统一调用导出Excel接口
  return requestClient.get('/vehiclecharging/charging-pile/export-excel', {
    params,
    responseType: 'blob',
  });
}

/**
 * 获取各状态充电桩数量（返回数组）
 * @returns {Promise<Array<{pileStatus: string, count: number}>>}
 */
export function getStatusCount() {
  return requestClient.get('/vehiclecharging/charging-pile/statusCount');
}

/**
 * 获取图表数据
 * @param {Object} params - stationId, startTime, endTime
 * @returns {Promise}
 */
export function getChartData(params) {
  return requestClient.get('/vehiclecharging/charging-pile/chart', { params });
}

/**
 * 获取场站简易列表 (适配新路径)
 */
export function getStationSimpleList() {
  return requestClient.get('/vehiclecharging/charging-pile/station-simple-list');
}

/**
 * 获取车位简易列表 (适配新路径)
 */
export function getLotSimpleList() {
  return requestClient.get('/vehiclecharging/charging-pile/simple-list');
}

/**
 * 获取充电模式字典 (适配新接口)
 * @returns {Promise<Array<{value: string, label: string}>>}
 */
export function getChargeModeDict() {
  return requestClient.get('/vehiclecharging/charging-pile/charge-mode-dict');
}

/**
 * 获取设备状态字典 (适配新接口)
 * @returns {Promise<Array<{value: string, label: string}>>}
 */
export function getPileStatusDict() {
  return requestClient.get('/vehiclecharging/charging-pile/status-dict');
}

/**
 * 获取车位详情
 * @param {number} id
 * @returns {Promise}
 */
export function getLotDetail(id) {
  return requestClient.get(`/vehiclecharging/charging-lot/get?id=${id}`);
}
