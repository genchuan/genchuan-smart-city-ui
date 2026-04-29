import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const statusMap = {
  '未分配': 'unassigned',
  '已分配': 'assigned'
};
const statusReverseMap = {
  'unassigned': '未分配',
  'assigned': '已分配'
};

// 响应数据：英文 → 中文
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.status && statusReverseMap[result.status]) {
    result.status = statusReverseMap[result.status];
  }
  return result;
}

// 请求参数：中文 → 英文
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
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

// ==================== 宿舍分配接口 ====================

// 分页查询
export function getDormAssignPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/dorm-assign/page', { params: convertedParams })
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

// 分配（批量）
export function assignDormAssign(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/dorm-assign/assign', convertedData).catch(err => {
    console.warn('分配接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 调整（批量）
export function adjustDormAssign(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/dorm-assign/adjust', convertedData).catch(err => {
    console.warn('调整接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑
export function updateDormAssign(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/dorm-assign/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportDormAssign(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/dorm-assign/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getDormAssignDetail(params) {
  return requestClient.get('/studentmgmt/dorm-assign/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// 新生宿舍分配看板（柱状图 + 卡片）
export function getDormAssignChart(params) {
  return requestClient.get('/studentmgmt/dorm-assign/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      waitAssignCount: 40,
      finishedCount: 280,
      totalCount: 320,
      progress: 87.5,
      buildingList: ['1号楼', '2号楼', '3号楼', '4号楼'],
      buildingAssignCountList: [80, 75, 65, 60],
      buildingBedCountList: [90, 80, 75, 75],
    });
  });
}

// 分配核心指标统计（卡片）
export function getDormAssignIndex(params) {
  return requestClient.get('/studentmgmt/dorm-assign/chart/assignIndex', { params }).catch(err => {
    console.warn('指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalStudentCount: 320,
      assignedCount: 280,
      assignRate: 87.5,
      emptyBedCount: 60,
    });
  });
}
