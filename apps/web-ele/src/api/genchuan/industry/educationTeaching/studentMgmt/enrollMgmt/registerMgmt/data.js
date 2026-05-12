import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 状态映射
const statusMap = {
  '待审核': 'pending',
  '已录取': 'admitted'
};
const statusReverse = {
  'pending': '待审核',
  'admitted': '已录取'
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

// ==================== 报名管理接口 ====================
export function getRegisterMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/register-mgmt/page', { params: convertedParams })
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

// 报名
export function createRegisterMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/register-mgmt/create', convertedData).catch(err => {
    console.warn('报名接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 审核（批量）
export function auditRegisterMgmt(data) {
  return requestClient.put('/studentmgmt/register-mgmt/audit', data).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 确认（批量）
export function confirmRegisterMgmt(data) {
  return requestClient.put('/studentmgmt/register-mgmt/confirm', data).catch(err => {
    console.warn('确认接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑
export function updateRegisterMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/register-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportRegisterMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/register-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getRegisterMgmtDetail(params) {
  return requestClient.get('/studentmgmt/register-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
// 招生报名统计看板
export function getRegisterMgmtChart(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/register-mgmt/chart', { params: convertedParams }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalApplyCount: 156,
      pendingAuditCount: 22,
      admittedCount: 134,
      confirmedCount: 118,
      recentWeekApplyTrend: [
        { date: '2025-03-25', count: 12 },
        { date: '2025-03-26', count: 18 },
        { date: '2025-03-27', count: 22 },
        { date: '2025-03-28', count: 16 },
        { date: '2025-03-29', count: 14 },
        { date: '2025-03-30', count: 10 },
        { date: '2025-03-31', count: 8 },
      ],
    });
  });
}

// 各专业报名/录取人数统计
export function getRegisterMgmtEnrollCount(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/register-mgmt/enrollCount', { params: convertedParams }).catch(err => {
    console.warn('专业统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      majorEnrollData: [
        { major: '计算机应用技术', applyCount: 45, admitCount: 40 },
        { major: '电子商务', applyCount: 32, admitCount: 28 },
        { major: '机电一体化', applyCount: 28, admitCount: 25 },
        { major: '会计电算化', applyCount: 25, admitCount: 22 },
        { major: '学前教育', applyCount: 26, admitCount: 19 },
      ],
    });
  });
}
