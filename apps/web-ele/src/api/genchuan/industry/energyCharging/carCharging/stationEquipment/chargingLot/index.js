import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询充电车位列表 */
export function getChargingLotPage(params) {
  return requestClient.get('/vehiclecharging/charging-lot/page', { params });
}

/** 新增充电车位 */
export function createChargingLot(data) {
  return requestClient.post('/vehiclecharging/charging-lot/create', data);
}

/** 编辑充电车位 */
export function updateChargingLot(data) {
  return requestClient.put('/vehiclecharging/charging-lot/update', data);
}

/** 导出充电车位数据 */
export function exportChargingLot() {
  return requestClient.download('/vehiclecharging/charging-lot/export-excel');
}

// ==================== 列表行交互操作接口 ====================

/** 获取充电车位详情 */
export function getChargingLotDetail(id, tenantId) {
  return requestClient.get(`/vehiclecharging/charging-lot/get/${id}`, {
    params: { tenantId },
  });
}

/** 更新充电车位状态
 * @param {object} data - 请求参数
 * @param {number} data.id - 车位主键ID
 * @param {string} data.lotStatus - 车位状态（0-空闲，1-占用，2-维护中）
 * @param {number} data.occupyTime - 占用时长（分钟），状态为"占用"时必填
 */
export function updateChargingLotStatus(data) {
  return requestClient.put('/vehiclecharging/charging-lot/update-status', data);
}

// ==================== 数据可视化图表接口 ====================

/** 充电车位占用状态实时图（饼图 + 柱状图 + 卡片） */
export function getChargingLotChart() {
  return requestClient.get('/vehiclecharging/charging-lot/chart');
}

/** 车位状态占比（饼图钻取） */
export function getChargingLotStatusRatio(params) {
  return requestClient.get('/vehiclecharging/charging-lot/chart/statusRatio', {
    params,
  });
}
// ==================== 联表关联详情接口 ====================
