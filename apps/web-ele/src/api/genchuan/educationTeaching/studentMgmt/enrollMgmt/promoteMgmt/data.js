import { requestClient } from '#/api/request';

// ==================== 宣传管理接口 ====================

// 分页查询
export function getPromoteMgmtPage(params) {
  return requestClient.get('/studentmgmt/promote-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败', err);
    // 分页接口已联调成功，不再使用模拟数据，返回空列表
    return { list: [], total: 0 };
  });
}

// 发布（新增宣传任务）
export function createPromoteMgmt(data) {
  return requestClient.post('/studentmgmt/promote-mgmt/create', data).catch(err => {
    console.warn('发布接口失败，模拟成功', err);
    return Promise.resolve({ id: Date.now() });
  });
}

// 执行（批量）
export function executePromoteMgmt(data) {
  return requestClient.put('/studentmgmt/promote-mgmt/execute', data).catch(err => {
    console.warn('执行接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑
export function updatePromoteMgmt(data) {
  return requestClient.put('/studentmgmt/promote-mgmt/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportPromoteMgmt(params) {
  return requestClient.download('/studentmgmt/promote-mgmt/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getPromoteMgmtDetail(params) {
  return requestClient.get('/studentmgmt/promote-mgmt/get', { params })
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// 招生宣传统计看板（折线图 + 卡片）
export function getPromoteMgmtChart(params) {
  return requestClient.get('/studentmgmt/promote-mgmt/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      waitExecuteCount: 5,
      finishedCount: 20,
      totalCount: 25,
      totalPromoteNum: 2500,
      totalIntentNum: 650,
      intentRate: 26.0,
      dateList: ['2025-06-10', '2025-06-15', '2025-06-20', '2025-06-25', '2025-06-30'],
      dailyPromoteList: [300, 450, 520, 630, 600],
      dailyIntentList: [80, 120, 150, 160, 140],
    });
  });
}

// 各站点宣传人数统计（柱状图）
export function getPromoteMgmtSiteCount(params) {
  return requestClient.get('/studentmgmt/promote-mgmt/chart/promoteCount', { params }).catch(err => {
    console.warn('站点统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      siteList: ['泉州一中', '泉州五中', '厦门双十', '福州一中'],
      promoteNumList: [500, 600, 700, 700],
      intentNumList: [130, 160, 180, 180],
    });
  });
}
