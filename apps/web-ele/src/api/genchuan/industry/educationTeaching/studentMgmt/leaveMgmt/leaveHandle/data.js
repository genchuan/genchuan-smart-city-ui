import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const checkoutStatusMap = {
  '已退宿': 'checked_out',
  '未退宿': 'not_checked_out'
};
const checkoutStatusReverseMap = {
  'checked_out': '已退宿',
  'not_checked_out': '未退宿'
};

const statusMap = {
  '待确认': 'pending_confirm',
  '待办理': 'pending_handle',
  '已离校': 'left',
  '待审核': 'pending_handle'
};
const statusReverseMap = {
  'pending_confirm': '待确认',
  'pending_handle': '待办理',
  'left': '已离校'
};

// 响应数据：英文 → 中文
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.checkoutStatus && checkoutStatusReverseMap[result.checkoutStatus]) {
    result.checkoutStatus = checkoutStatusReverseMap[result.checkoutStatus];
  }
  if (result.status && statusReverseMap[result.status]) {
    result.status = statusReverseMap[result.status];
  } else if (result.status === '待审核') {
    result.status = '待办理';
  }
  return result;
}

// 请求参数：中文 → 英文
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.checkoutStatus && checkoutStatusMap[result.checkoutStatus]) {
    result.checkoutStatus = checkoutStatusMap[result.checkoutStatus];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  return result;
}

// 转换列表
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 离校办理接口 ====================
export function getLeaveHandlePage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/leave-handle/page', { params: convertedParams })
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

export function createLeaveHandle(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/leave-handle/create', convertedData)
}

export function updateLeaveHandle(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/leave-handle/update', convertedData)
}

export function confirmLeaveHandle(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/leave-handle/confirm', convertedData)
}

export function handleLeaveHandle(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/leave-handle/handle', convertedData)
}

export function exportLeaveHandle(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/leave-handle/export-excel', convertedParams)
}

export function getLeaveHandleDetail(params) {
  return requestClient.get('/studentmgmt/leave-handle/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getLeaveHandleChart(params) {
  return requestClient.get('/studentmgmt/leave-handle/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalGraduate: 256,
      waitConfirm: 12,
      waitHandle: 24,
      finishedLeave: 220,
      finishRate: 85.94,
    });
  });
}

export function getLeaveHandleIndex(params) {
  return requestClient.get('/studentmgmt/leave-handle/chart/leaveIndex', { params }).catch(err => {
    console.warn('核心指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      checkoutRate: 92.58,
      parentConfirmRate: 95.31,
      handleFinishRate: 85.94,
      dailyLeaveCount: [
        { date: '2025-03-25', count: 15 },
        { date: '2025-03-26', count: 22 },
        { date: '2025-03-27', count: 18 },
        { date: '2025-03-28', count: 16 },
        { date: '2025-03-29', count: 12 },
        { date: '2025-03-30', count: 9 },
        { date: '2025-03-31', count: 11 },
      ],
    });
  });
}
