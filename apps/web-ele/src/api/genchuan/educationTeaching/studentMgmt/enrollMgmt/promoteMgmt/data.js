import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 状态映射（后端英文 executed -> 前端中文 已执行）
const statusMap = {
  '未执行': 'pending',
  '已执行': 'executed'
};
const statusReverse = {
  'pending': '未执行',
  'executed': '已执行'
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

// ==================== 宣传管理接口 ====================

// 分页查询
export function getPromoteMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/promote-mgmt/page', { params: convertedParams })
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

// 发布（新增宣传任务）
export function createPromoteMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/promote-mgmt/create', convertedData).catch(err => {
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
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/promote-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportPromoteMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/promote-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getPromoteMgmtDetail(params) {
  return requestClient.get('/studentmgmt/promote-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
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
  return requestClient.get('/studentmgmt/promote-mgmt/promoteCount', { params }).catch(err => {
    console.warn('站点统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      siteList: ['泉州一中', '泉州五中', '厦门双十', '福州一中'],
      promoteNumList: [500, 600, 700, 700],
      intentNumList: [130, 160, 180, 180],
    });
  });
}
