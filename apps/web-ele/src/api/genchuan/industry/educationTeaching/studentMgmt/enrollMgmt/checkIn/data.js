import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 状态映射（后端英文 → 前端中文）
const statusMap = {
  '待确认': 'pending_confirm',
  '待审核': 'pending_audit',
  '已报到': 'checked_in'
};
const statusReverse = {
  'pending_confirm': '待确认',
  'pending_audit': '待审核',
  'checked_in': '已报到'
};

// 账号状态映射
const accountStatusMap = {
  '未创建': 'not_created',
  '已创建': 'created'
};
const accountStatusReverse = {
  'not_created': '未创建',
  'created': '已创建'
};

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  if (result.accountStatus && accountStatusReverse[result.accountStatus]) {
    result.accountStatus = accountStatusReverse[result.accountStatus];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为英文）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  if (result.accountStatus && accountStatusMap[result.accountStatus]) {
    result.accountStatus = accountStatusMap[result.accountStatus];
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 报到管理接口 ====================

// 分页查询
export function getCheckInPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/check-in/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败', err);
      // 分页接口已联调成功，不再使用模拟数据，返回空列表
      return { list: [], total: 0 };
    });
}

// 补充信息
export function supplyCheckIn(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/check-in/supply', convertedData)
}

// 确认（批量）
export function confirmCheckIn(data) {
  return requestClient.put('/studentmgmt/check-in/confirm', data)
}

// 审核（批量）
export function auditCheckIn(data) {
  return requestClient.put('/studentmgmt/check-in/audit', data)
}

// 导出
export function exportCheckIn(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/check-in/export-excel', convertedParams)
}

// 详情
export function getCheckInDetail(params) {
  return requestClient.get('/studentmgmt/check-in/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// 新生报到进度看板（折线图+卡片）
export function getCheckInChart(params) {
  return requestClient.get('/studentmgmt/check-in/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      waitConfirmCount: 50,
      waitAuditCount: 30,
      finishedCount: 240,
      totalCount: 320,
      progress: 75.0,
      dateList: ['2025-08-25', '2025-08-26', '2025-08-27', '2025-08-28', '2025-08-29'],
      dailyConfirmList: [20, 35, 42, 58, 65],
      dailyAuditList: [15, 30, 40, 55, 60],
    });
  });
}

// 报到核心指标统计（卡片）
export function getCheckInIndex(params) {
  return requestClient.get('/studentmgmt/check-in/checkinIndex', { params }).catch(err => {
    console.warn('指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalRegisterCount: 320,
      totalConfirmCount: 270,
      checkinRate: 84.38,
      accountCreatedCount: 240,
      accountCreateRate: 75.0,
    });
  });
}
