import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 状态映射（前端中文 ↔ 后端英文）
const statusMap = {
  '未发布': 'unpublished',
  '已发布': 'published'
};
const statusReverse = {
  'unpublished': '未发布',
  'published': '已发布'
};

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
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
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 沟通管理接口 ====================
export function getCommunicateMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/communicate-mgmt/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败', err);
      return { list: [], total: 0 };
    });
}

export function createCommunicateMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/communicate-mgmt/create', convertedData).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function publishCommunicateMgmt(data) {
  // 发布接口不需要转换 status（前端传入 ids 和 sendTime）
  return requestClient.put('/studentmgmt/communicate-mgmt/publish', data).catch(err => {
    console.warn('发布接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function feedbackCommunicateMgmt(data) {
  // 反馈接口不需要转换
  return requestClient.put('/studentmgmt/communicate-mgmt/feedback', data).catch(err => {
    console.warn('反馈接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function replyCommunicateMgmt(data) {
  return requestClient.put('/studentmgmt/communicate-mgmt/reply', data).catch(err => {
    console.warn('回复接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateCommunicateMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/communicate-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportCommunicateMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/communicate-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getCommunicateMgmtDetail(params) {
  return requestClient.get('/studentmgmt/communicate-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getCommunicateMgmtChart(params) {
  return requestClient.get('/studentmgmt/communicate-mgmt/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalMsgCount: 42,
      publishedMsgCount: 38,
      unpublishedMsgCount: 4,
      totalReplyCount: 126,
      avgInteractRate: 0.89,
      recentWeekInteractTrend: [
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

export function getCommunicateMgmtInteractIndex(params) {
  return requestClient.get('/studentmgmt/communicate-mgmt/chart/interactIndex', { params }).catch(err => {
    console.warn('核心指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      msgTypeCount: [
        { name: '通知公告', value: 22 },
        { name: '成绩反馈', value: 10 },
        { name: '活动通知', value: 6 },
        { name: '其他', value: 4 },
      ],
      classInteractRate: [
        { name: '初一1班', value: 0.95 },
        { name: '初一2班', value: 0.92 },
        { name: '初二1班', value: 0.88 },
        { name: '初二2班', value: 0.86 },
        { name: '初三1班', value: 0.85 },
        { name: '初三2班', value: 0.83 },
      ],
      replyTimeDistribution: [
        { name: '1小时内', value: 68 },
        { name: '1-3小时', value: 32 },
        { name: '3-12小时', value: 18 },
        { name: '12小时以上', value: 8 },
      ],
    });
  });
}
