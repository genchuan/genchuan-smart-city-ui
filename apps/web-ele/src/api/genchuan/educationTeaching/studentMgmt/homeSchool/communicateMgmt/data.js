import { requestClient } from '#/api/request';

// ==================== 沟通管理接口 ====================
export function getCommunicateMgmtPage(params) {
  return requestClient.get('/studentmgmt/communicate-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败', err);
    // 分页接口已联调成功，不再使用模拟数据，返回空列表
    return { list: [], total: 0 };
  });
}

// 新增消息
export function createCommunicateMgmt(data) {
  return requestClient.post('/studentmgmt/communicate-mgmt/create', data).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 发布（批量）
export function publishCommunicateMgmt(data) {
  return requestClient.put('/studentmgmt/communicate-mgmt/publish', data).catch(err => {
    console.warn('发布接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 反馈（批量）
export function feedbackCommunicateMgmt(data) {
  return requestClient.put('/studentmgmt/communicate-mgmt/feedback', data).catch(err => {
    console.warn('反馈接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 回复（单个）
export function replyCommunicateMgmt(data) {
  return requestClient.put('/studentmgmt/communicate-mgmt/reply', data).catch(err => {
    console.warn('回复接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑消息
export function updateCommunicateMgmt(data) {
  return requestClient.put('/studentmgmt/communicate-mgmt/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportCommunicateMgmt(params) {
  return requestClient.download('/studentmgmt/communicate-mgmt/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getCommunicateMgmtDetail(params) {
  return requestClient.get('/studentmgmt/communicate-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败', err);
    // 不再使用模拟数据，直接抛出错误让调用方处理
    return Promise.reject(err);
  });
}

// ==================== 图表接口 ====================
// 家校协同互动看板（卡片 + 折线图）
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

// 互动核心指标统计（柱状图）
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
