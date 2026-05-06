import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询奖品管理列表 */
export function getPrizeMgmtPage(params) {
  return requestClient.get('/marketop/prize-mgmt/page', { params });
}

/** 新增奖品 */
export function createPrizeMgmt(data) {
  return requestClient.post('/marketop/prize-mgmt/create', data);
}

/** 下载导入奖品模板
 * @returns {Promise} 返回文件流
 */
export function getPrizeImportTemplate() {
  return requestClient.download('/marketop/prize-mgmt/get-import-template');
}
/** 导入奖品 */
export function importPrizeMgmt(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/marketop/prize-mgmt/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 导出奖品数据 */
export function exportPrizeMgmt() {
  return requestClient.download('/marketop/prize-mgmt/export');
}

// ==================== 列表行交互操作接口 ====================

/** 获取奖品详情 */
export function getPrizeMgmtDetail(id) {
  return requestClient.get('/marketop/prize-mgmt/get', { params: { id } });
}

/** 启用奖品 */
export function enablePrizeMgmt(data) {
  return requestClient.put('/marketop/prize-mgmt/enable', data);
}

/** 禁用奖品 */
export function disablePrizeMgmt(data) {
  return requestClient.put('/marketop/prize-mgmt/disable', data);
}

/** 编辑奖品 */
export function updatePrizeMgmt(data) {
  return requestClient.put('/marketop/prize-mgmt/update', data);
}

// ==================== 数据可视化图表接口 ====================

/** 奖品统计（柱状图 + 卡片） */
export function getPrizeMgmtChart() {
  return requestClient.get('/marketop/prize-mgmt/chart');
}
