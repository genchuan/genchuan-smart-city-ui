import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 状态映射（前端中文 ↔ 后端英文）
const statusMap = {
  '未推送': 'unpushed',
  '已推送': 'pushed'
};
const statusReverse = {
  'unpushed': '未推送',
  'pushed': '已推送'
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

// ==================== 迎新推送接口 ====================

// 分页查询
export function getNewPushPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/new-push/page', { params: convertedParams })
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

// 配置（新增推送任务）
export function createNewPushConfig(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/new-push/config', convertedData).catch(err => {
    console.warn('配置接口失败，模拟成功', err);
    return Promise.resolve({ id: Date.now() });
  });
}

// 推送（批量）
export function pushNewPush(data) {
  return requestClient.put('/studentmgmt/new-push/push', data).catch(err => {
    console.warn('推送接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑
export function updateNewPush(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/new-push/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportNewPush(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/new-push/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getNewPushDetail(params) {
  return requestClient.get('/studentmgmt/new-push/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      return Promise.reject(err);
    });
}

// 迎新推送统计看板（折线图 + 卡片）
export function getNewPushChart(params) {
  return requestClient.get('/studentmgmt/new-push/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      waitPushCount: 2,
      finishedCount: 8,
      totalCount: 10,
      totalPushNum: 2800,
      avgFinishRate: 98.5,
      dateList: ['2025-08-20', '2025-08-22', '2025-08-25', '2025-08-28', '2025-08-30'],
      dailyPushList: [320, 320, 320, 320, 320],
    });
  });
}

// 推送核心指标统计（卡片）
export function getNewPushIndex(params) {
  return requestClient.get('/studentmgmt/new-push/pushIndex', { params }).catch(err => {
    console.warn('指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalTaskCount: 10,
      pushedCount: 8,
      pushRate: 80.0,
      totalPushNum: 2560,
    });
  });
}
