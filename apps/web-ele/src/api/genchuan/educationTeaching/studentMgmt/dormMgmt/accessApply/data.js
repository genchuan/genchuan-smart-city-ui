import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 申请类型映射
const applyTypeMap = {
  '应急出入': 'emergency',
  '其他': 'other'
};
const applyTypeReverse = {
  'emergency': '应急出入',
  'other': '其他'
};

// 状态映射
const statusMap = {
  '待审核': 'pending',
  '已通过': 'approved'
};
const statusReverse = {
  'pending': '待审核',
  'approved': '已通过'
};

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.applyType && applyTypeReverse[result.applyType]) {
    result.applyType = applyTypeReverse[result.applyType];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为英文）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.applyType && applyTypeMap[result.applyType]) {
    result.applyType = applyTypeMap[result.applyType];
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

// ==================== 出入申请接口 ====================
export function getAccessApplyPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/access-apply/page', { params: convertedParams })
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

// 新增申请
export function createAccessApply(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/access-apply/create', convertedData).catch(err => {
    console.warn('申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 审核（批量）
export function auditAccessApply(data) {
  // 审核接口只传 ids，无需转换
  return requestClient.put('/studentmgmt/access-apply/audit', data).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑申请
export function updateAccessApply(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/access-apply/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportAccessApply(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/access-apply/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getAccessApplyDetail(params) {
  return requestClient.get('/studentmgmt/access-apply/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// 获取学生列表
export function getStudentOptions(params) {
  return requestClient.get('/studentmgmt/student/options', { params }).catch(err => {
    console.warn('获取学生列表失败，使用模拟数据', err);
    return Promise.resolve([
      { value: 1, label: '张三' },
      { value: 2, label: '李四' },
      { value: 3, label: '王五' },
      { value: 4, label: '赵六' },
      { value: 5, label: '孙七' },
    ]);
  });
}

// ==================== 图表接口 ====================
export function getAccessApplyChart(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/access-apply/chart', { params: convertedParams }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalApplyCount: 128,
      pendingAuditCount: 12,
      passedCount: 116,
      dailyTrend: [
        { date: '2025-03-25', count: 15 },
        { date: '2025-03-26', count: 18 },
        { date: '2025-03-27', count: 20 },
        { date: '2025-03-28', count: 16 },
        { date: '2025-03-29', count: 22 },
        { date: '2025-03-30', count: 21 },
        { date: '2025-03-31', count: 8 },
      ],
      typeDistribution: [
        { type: '应急出入', count: 98 },
        { type: '其他', count: 30 },
      ],
    });
  });
}

export function getAccessApplyCount(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/access-apply/chart/applyCount', { params: convertedParams }).catch(err => {
    console.warn('班级统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      classStatistics: [
        { className: '高一1班', emergencyCount: 12, otherCount: 3, totalCount: 15 },
        { className: '高一2班', emergencyCount: 8, otherCount: 2, totalCount: 10 },
        { className: '高一3班', emergencyCount: 5, otherCount: 1, totalCount: 6 },
      ],
    });
  });
}
