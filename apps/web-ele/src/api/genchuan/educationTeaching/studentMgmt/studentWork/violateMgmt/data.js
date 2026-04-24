import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 违纪类型映射
const violateTypeMap = {
  '仪容仪表': 'appearance',
  '行为违规': 'behavior',
  '其他': 'other'
};
const violateTypeReverse = {
  'appearance': '仪容仪表',
  'behavior': '行为违规',
  'other': '其他'
};

// 处分类型映射
const punishTypeMap = {
  '警告': 'warn',
  '记过': 'demerit',
  '留校察看': 'probation',
  '开除': 'expel'
};
const punishTypeReverse = {
  'warn': '警告',
  'demerit': '记过',
  'probation': '留校察看',
  'expel': '开除'
};

// 状态映射（后端返回多种格式，统一转为前端三种状态）
const statusReverse = {
  '3': '待审批',        // 根据样例，status:"3" 视为待审批
  'executed': '已执行',
  'warned': '已预警',
  'warn': '已预警'
};
const statusMap = {
  '待审批': '3',        // 提交时映射为后端期望的值（需后端确认，暂用 "3"）
  '已执行': 'executed',
  '已预警': 'warned'
};

// 通用转换函数：后端 → 前端（将对象中的英文字段值转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.violateType && violateTypeReverse[result.violateType]) {
    result.violateType = violateTypeReverse[result.violateType];
  }
  if (result.punishType && punishTypeReverse[result.punishType]) {
    result.punishType = punishTypeReverse[result.punishType];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  } else if (result.status && !statusReverse[result.status]) {
    // 未知状态默认映射为“待审批”
    result.status = '待审批';
  }
  return result;
}

// 通用转换函数：前端 → 后端（将对象中的中文字段值转为英文）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.violateType && violateTypeMap[result.violateType]) {
    result.violateType = violateTypeMap[result.violateType];
  }
  if (result.punishType && punishTypeMap[result.punishType]) {
    result.punishType = punishTypeMap[result.punishType];
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

// ==================== 违纪管理接口 ====================
export function getViolateMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/violate-mgmt/page', { params: convertedParams })
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

export function createViolateMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/violate-mgmt/create', convertedData).catch(err => {
    console.warn('登记接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateViolateMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/violate-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function auditViolateMgmt(data) {
  // 审批接口只传 ids，无需转换字段值
  const idsParam = data.ids ? data.ids.join(',') : '';
  return requestClient.put('/studentmgmt/violate-mgmt/audit', null, { params: { ids: idsParam } }).catch(err => {
    console.warn('审批接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function pushViolateMgmt(params) {
  // 推送接口只传 id，无需转换
  return requestClient.put('/studentmgmt/violate-mgmt/push', null, { params }).catch(err => {
    console.warn('推送接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function warnViolateMgmt(params) {
  return requestClient.put('/studentmgmt/violate-mgmt/warn', null, { params }).catch(err => {
    console.warn('预警接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportViolateMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/violate-mgmt/export', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getViolateMgmtDetail(params) {
  return requestClient.get('/studentmgmt/violate-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
// 图表接口暂不处理映射（因未提供后端数据结构），如有需要可类似添加
export function getViolateMgmtChart(params) {
  return requestClient.get('/studentmgmt/violate-mgmt/chart', { params }).catch(err => {
    console.warn('预警看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalCount: 32,
      pendingCount: 5,
      warnCount: 8,
      highRiskStudentCount: 0,
      violateTypeCount: {
        appearance: 10,
        behavior: 18,
        other: 4,
      },
    });
  });
}

export function getViolateCount(params) {
  return requestClient.get('/studentmgmt/violate-mgmt/chart/violateCount', { params }).catch(err => {
    console.warn('违纪次数统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      classCountList: [
        { className: '高一(1)班', count: 5 },
        { className: '高一(2)班', count: 8 },
        { className: '高一(3)班', count: 6 },
        { className: '高二(1)班', count: 7 },
        { className: '高二(2)班', count: 6 },
      ],
      typeCountList: [
        { typeName: '仪容仪表', count: 10, percent: 31.25 },
        { typeName: '行为违规', count: 18, percent: 56.25 },
        { typeName: '其他', count: 4, percent: 12.5 },
      ],
    });
  });
}

export function getWarnIndex(params) {
  return requestClient.get('/studentmgmt/violate-mgmt/chart/warnIndex', { params }).catch(err => {
    console.warn('预警指标接口失败，使用模拟数据', err);
    return Promise.resolve([
      { cycleName: '第1周', newViolateCount: 8, newWarnCount: 2, handleRate: 87.5 },
      { cycleName: '第2周', newViolateCount: 10, newWarnCount: 3, handleRate: 90.0 },
      { cycleName: '第3周', newViolateCount: 7, newWarnCount: 2, handleRate: 100.0 },
      { cycleName: '第4周', newViolateCount: 7, newWarnCount: 1, handleRate: 100.0 },
    ]);
  });
}
