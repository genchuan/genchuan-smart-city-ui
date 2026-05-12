import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 考勤状态映射
const checkStatusMap = {
  '正常': '0',
  '迟到': '1',
  '未到': '2'
};
const checkStatusReverse = {
  '0': '正常',
  '1': '迟到',
  '2': '未到'
};

// 异常类型映射
const abnormalTypeMap = {
  '无': '0',
  '晚归': '1',
  '未归': '2'
};
const abnormalTypeReverse = {
  '0': '无',
  '1': '晚归',
  '2': '未归'
};

// 状态映射（正常/异常）
const statusMap = {
  '正常': '0',
  '异常': '1'
};
const statusReverse = {
  '0': '正常',
  '1': '异常'
};

// 通用转换函数：后端 → 前端（将数字转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.checkStatus !== undefined && checkStatusReverse[result.checkStatus]) {
    result.checkStatus = checkStatusReverse[result.checkStatus];
  }
  if (result.abnormalType !== undefined && abnormalTypeReverse[result.abnormalType]) {
    result.abnormalType = abnormalTypeReverse[result.abnormalType];
  }
  if (result.status !== undefined && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为数字）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.checkStatus && checkStatusMap[result.checkStatus]) {
    result.checkStatus = checkStatusMap[result.checkStatus];
  }
  if (result.abnormalType && abnormalTypeMap[result.abnormalType]) {
    result.abnormalType = abnormalTypeMap[result.abnormalType];
  }
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

// ==================== 宿舍考勤接口 ====================
export function getDormCheckPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/dorm-check/page', { params: convertedParams })
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

// 打卡（批量）
export function createDormCheck(data) {
  // 打卡接口只传 studentIds、checkTime、remark，无需转换
  return requestClient.post('/studentmgmt/dorm-check/create', data).catch(err => {
    console.warn('打卡接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 补卡（批量）
export function recheckDormCheck(data) {
  // 补卡接口只传 ids，无需转换
  return requestClient.put('/studentmgmt/dorm-check/recheck', data).catch(err => {
    console.warn('补卡接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 推送（批量）
export function pushDormCheck(data) {
  return requestClient.put('/studentmgmt/dorm-check/push', data);
}

// 导出
export function exportDormCheck(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/dorm-check/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getDormCheckDetail(params) {
  return requestClient.get('/studentmgmt/dorm-check/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getDormCheckChart(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/dorm-check/chart', { params: convertedParams }).catch(err => {
    console.warn('考勤看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalCheck: 1200,
      normalCount: 1110,
      abnormalCount: 90,
      inRate: 92.5,
      warningCount: 15,
      abnormalStats: [
        { type: '晚归', count: 10 },
        { type: '未归', count: 5 },
        { type: '迟到', count: 75 },
      ],
    });
  });
}

export function getDormCheckCount(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/dorm-check/checkCount', { params: convertedParams }).catch(err => {
    console.warn('班级统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      labels: ['高一1班', '高一2班', '高一3班', '高二1班'],
      abnormalCount: [3, 5, 2, 4],
      inRate: [95.0, 92.5, 97.0, 93.0],
    });
  });
}
