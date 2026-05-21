import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询优惠券列表
 * @param {object} params - 请求参数
 * @param {string} params.name - 券名称，支持模糊查询
 * @param {string} params.type - 券类型（满减/折扣/时长/立减）
 * @param {string} params.status - 券状态（未领取/已领取/已使用/已过期）
 * @param {string} params.validTime - 有效期，支持时间范围查询
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCouponMgmtPage(params) {
  return requestClient.get('/marketop/coupon-mgmt/page', { params });
}

/** 新增优惠券
 * @param {object} data - 请求参数
 * @param {string} data.name - 券名称，唯一
 * @param {string} data.type - 券类型（满减/折扣/时长/立减）
 * @param {number} data.amount - 面额
 * @param {string} data.useCondition - 使用条件
 * @param {string} data.validTime - 有效期
 * @param {string} data.description - 券描述
 * @param {string} data.stationIds - 适用场站，存储场站ID列表，逗号分隔
 * @returns {Promise}
 */
export function createCouponMgmt(data) {
  return requestClient.post('/marketop/coupon-mgmt/create', data);
}
/** 下载导入优惠券模板
 * @returns {Promise} 返回文件流
 */
export function getCouponImportTemplate() {
  return requestClient.download('/marketop/coupon-mgmt/get-import-template');
}
/** 导入优惠券
 * @param {File} file - 导入文件，支持Excel格式
 * @returns {Promise}
 */
export function importCouponMgmt(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/marketop/coupon-mgmt/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 导出优惠券数据
 * @returns {Promise}
 */
export function exportCouponMgmt() {
  return requestClient.download('/marketop/coupon-mgmt/export');
}

// ==================== 列表行交互操作接口 ====================

/** 获取优惠券详情
 * @param {number} id - 优惠券ID
 * @returns {Promise}
 */
export function getCouponMgmtDetail(id) {
  return requestClient.get('/marketop/coupon-mgmt/get', { params: { id } });
}

/** 发放优惠券
 * @param {object} data - 请求参数
 * @param {number} data.id - 优惠券ID
 * @param {number} data.receiverId - 领取人用户ID
 * @returns {Promise}
 */
export function sendCouponMgmt(data) {
  return requestClient.put('/marketop/coupon-mgmt/send', data);
}

/** 核销优惠券
 * @param {object} data - 请求参数
 * @param {number} data.id - 优惠券ID
 * @returns {Promise}
 */
export function verifyCouponMgmt(data) {
  return requestClient.put('/marketop/coupon-mgmt/verify', data);
}

/** 重新发放优惠券
 * @param {object} data - 请求参数
 * @param {number} data.id - 优惠券ID
 * @param {number} data.receiverId - 领取人用户ID
 * @param {string} data.newValidTime - 新的有效期
 * @returns {Promise}
 */
export function resendCouponMgmt(data) {
  return requestClient.put('/marketop/coupon-mgmt/resend', data);
}

/** 编辑优惠券
 * @param {object} data - 请求参数
 * @returns {Promise}
 */
export function updateCouponMgmt(data) {
  return requestClient.put('/marketop/coupon-mgmt/update', data);
}

// ==================== 数据可视化图表接口 ====================

/** 优惠券统计（折线图 + 柱状图 + 卡片）
 * @returns {Promise}
 */
export function getCouponMgmtChart() {
  return requestClient.get('/marketop/coupon-mgmt/chart');
}
/** 获取优惠券 精简列表（用于下拉选择） */
export function getCouponSimpleList() {
  return requestClient.get('/marketop/coupon-mgmt/simple-list');
}

// ==================  下拉接口  ==========================

/** 获取发放对象（用户）精简列表
 * @param {object} [params] - 请求参数（可选）
 * @param {string} [params.name] - 用户名称，支持模糊查询（非必传）
 * @returns {Promise<Array<{id: number, name: string}>>} 返回用户列表
 */
export function getSendObject(params) {
  return requestClient.get('/marketop/coupon-mgmt/user-simple-list', {
    params,
  });
}
