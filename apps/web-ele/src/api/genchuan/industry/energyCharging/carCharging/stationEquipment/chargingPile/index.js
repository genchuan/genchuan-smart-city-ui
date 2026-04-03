// charging-pile/index.js
import { requestClient } from '#/api/request.js';

/**
 * 分页查询充电桩列表（支持筛选和刷新）
 * @param {Object} params - 查询参数（pageNo, pageSize, 以及其他筛选字段）
 * @returns {Promise<{list: Array, total: number}>}
 */
export function getPageList(params) {
  return requestClient.get('/vehiclecharging/charging-pile/page', { params });
}

/**
 * 新增充电桩
 * @param {Object} data - 充电桩数据（pileCode, model, power, manufacturer, stationId, lotId, chargeMode, remark）
 * @returns {Promise}
 */
export function createPile(data) {
  return requestClient.post('/vehiclecharging/charging-pile/create', data);
}

/**
 * 编辑充电桩
 * @param {Object} data - 充电桩数据（需包含 id）
 * @returns {Promise}
 */
export function updatePile(data) {
  return requestClient.put('/vehiclecharging/charging-pile/update', data);
}

/**
 * 删除充电桩
 * @param {number} id - 充电桩ID
 * @returns {Promise}
 */
export function deletePile(id) {
  return requestClient.delete(`/vehiclecharging/charging-pile/delete?id=${id}`);
}

/**
 * 调试充电桩（批量调试时 id 用逗号分隔）
 * @param {Object} data - { id, debugResult? }
 * @returns {Promise}
 */
export function debugPile(data) {
  return requestClient.post('/vehiclecharging/charging-pile/debug', data);
}

/**
 * 启用充电桩
 * @param {Object} data - { id }
 * @returns {Promise}
 */
export function enablePile(data) {
  return requestClient.post('/vehiclecharging/charging-pile/enable', data);
}

/**
 * 停用充电桩
 * @param {Object} data - { id, remark? }
 * @returns {Promise}
 */
export function disablePile(data) {
  return requestClient.post('/vehiclecharging/charging-pile/disable', data);
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
 * 获取充电枪二维码图片URL
 * @param {number} id - 充电桩ID
 * @returns {Promise<string>} 二维码图片URL
 */
export async function getQrcode(id) {
  const res = await requestClient.get(`/vehiclecharging/charging-pile/qrcode?id=${id}`);
  // 兼容 {code,data} 格式或直接字符串
  return res?.data ?? res;
}

/**
 * 导出充电桩数据（Excel）
 * @param {Object} params - 筛选参数及 exportType
 * @returns {Promise<Blob>}
 */
export function exportPile(params) {
  return requestClient.get('/vehiclecharging/charging-pile/export-excel', {
    params,
    responseType: 'blob',
  });
}

/**
 * 获取各状态充电桩数量（用于图表卡片）
 * @returns {Promise<Array<{pileStatus: string, count: number}>>}
 */
export function getStatusCount() {
  return requestClient.get('/vehiclecharging/charging-pile/statusCount');
}

/**
 * 获取图表数据（运行时长趋势、类型统计）
 * @param {Object} params - stationId, startTime, endTime
 * @returns {Promise}
 */
export function getChartData(params) {
  return requestClient.get('/vehiclecharging/charging-pile/chart', { params });
}

/**
 * 获取场站简易列表（用于下拉选择）
 * @returns {Promise<Array<{value: number, label: string}>>}
 */
export function getStationSimpleList() {
  return requestClient.get('/vehiclecharging/charging-pile/station-simple-list');
}

/**
 * 获取车位简易列表（用于下拉选择）
 * @returns {Promise<Array<{value: number, label: string}>>}
 */
export function getLotSimpleList() {
  return requestClient.get('/vehiclecharging/charging-pile/simple-list');
}

/**
 * 获取充电模式字典
 * @returns {Promise<Array<{value: string, label: string}>>}
 */
export function getChargeModeDict() {
  return requestClient.get('/vehiclecharging/charging-pile/charge-mode-dict');
}

/**
 * 获取设备状态字典
 * @returns {Promise<Array<{value: string, label: string}>>}
 */
export function getPileStatusDict() {
  return requestClient.get('/vehiclecharging/charging-pile/status-dict');
}

/**
 * 获取车位详情
 * @param {number} id - 车位ID
 * @returns {Promise}
 */
export function getLotDetail(id) {
  return requestClient.get(`/vehiclecharging/charging-lot/get?id=${id}`);
}
