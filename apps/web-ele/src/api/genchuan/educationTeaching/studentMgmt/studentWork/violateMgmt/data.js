import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
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

const statusReverse = {
  '3': '待审批',
  'executed': '已执行',
  'warned': '已预警',
  'warn': '已预警'
};
const statusMap = {
  '待审批': '3',
  '已执行': 'executed',
  '已预警': 'warned'
};

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
    result.status = '待审批';
  }
  return result;
}

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
  const idsParam = data.ids ? data.ids.join(',') : '';
  return requestClient.put('/studentmgmt/violate-mgmt/audit', null, { params: { ids: idsParam } }).catch(err => {
    console.warn('审批接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function pushViolateMgmt(params) {
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
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
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
        { class_name: '高一(1)班', count: 5 },
        { class_name: '高一(2)班', count: 8 },
        { class_name: '高一(3)班', count: 6 },
        { class_name: '高二(1)班', count: 7 },
        { class_name: '高二(2)班', count: 6 },
      ],
      typeCountList: [
        { typeName: '仪容仪表', count: 10, percent: '31.25' },
        { typeName: '行为违规', count: 18, percent: '56.25' },
        { typeName: '其他', count: 4, percent: '12.5' },
      ],
    });
  });
}

