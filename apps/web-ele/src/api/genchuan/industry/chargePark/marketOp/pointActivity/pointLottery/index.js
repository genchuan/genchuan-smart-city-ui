import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询积分抽奖记录列表 */
export function getPointLotteryPage(params) {
  return requestClient.get('/marketop/point-lottery/page', { params });
}

/** 导出积分抽奖记录数据 */
export function exportPointLottery() {
  return requestClient.download('/marketop/point-lottery/export');
}

// ==================== 列表行交互操作接口 ====================

/** 获取积分抽奖记录详情 */
export function getPointLotteryDetail(id) {
  return requestClient.get('/marketop/point-lottery/get', { params: { id } });
}

/** 核查积分抽奖记录
 * @param {object} data - 请求参数
 * @param {number} data.id - 记录 ID
 * @param {string} data.checkResult - 核查结果
 */
export function checkPointLottery(data) {
  return requestClient.put('/marketop/point-lottery/check', data);
}

// ==================== 数据可视化图表接口 ====================

/** 积分抽奖统计（折线图 + 卡片） */
export function getPointLotteryChart() {
  return requestClient.get('/marketop/point-lottery/chart');
}
