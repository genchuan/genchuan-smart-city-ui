import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 资助类型映射（aidType）
const aidTypeMap = {
  '奖学金': '1',
  '助学金': '2',
  '助学贷款': '3',
  '勤工俭学': '4'
};
const aidTypeReverse = {
  '1': '奖学金',
  '2': '助学金',
  '3': '助学贷款',
  '4': '勤工俭学'
};

// 状态映射（status）
const statusMap = {
  '待审核': '0',
  '已通过': '1',
  '已完成': '2'
};
const statusReverse = {
  '0': '待审核',
  '1': '已通过',
  '2': '已完成'
};

// 流程状态映射（processStatus）
const processStatusMap = {
  '跟进中': '1',
  '已完成': '2'
};
const processStatusReverse = {
  '1': '跟进中',
  '2': '已完成'
};

// 通用转换函数：后端 → 前端（将数字/代码转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.aidType && aidTypeReverse[result.aidType]) {
    result.aidType = aidTypeReverse[result.aidType];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  if (result.processStatus && processStatusReverse[result.processStatus]) {
    result.processStatus = processStatusReverse[result.processStatus];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为数字/代码）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.aidType && aidTypeMap[result.aidType]) {
    result.aidType = aidTypeMap[result.aidType];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  if (result.processStatus && processStatusMap[result.processStatus]) {
    result.processStatus = processStatusMap[result.processStatus];
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 奖助勤贷接口 ====================
export function getAidWorkPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/aid-work/page', { params: convertedParams })
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

export function createAidWork(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/aid-work/create', convertedData).catch(err => {
    console.warn('申报接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateAidWork(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/aid-work/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function auditAidWork(data) {
  return requestClient.put('/studentmgmt/aid-work/audit', data).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function followAidWork(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/aid-work/follow', convertedData).catch(err => {
    console.warn('跟进接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportAidWork(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/aid-work/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getAidWorkDetail(params) {
  return requestClient.get('/studentmgmt/aid-work/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

export function getStudentOptions(params) {
  return requestClient.get('/studentmgmt/student/options', { params }).catch(err => {
    console.warn('获取学生选项失败，使用模拟数据', err);
    return Promise.resolve([
      { label: '张三', value: 1 },
      { label: '李四', value: 2 },
      { label: '王五', value: 3 },
      { label: '赵六', value: 4 },
      { label: '孙七', value: 5 },
      { label: '周八', value: 6 },
    ]);
  });
}

// ==================== 图表接口 ====================
export function getAidWorkChart(params) {
  return requestClient.get('/studentmgmt/aid-work/chart', { params }).catch(err => {
    console.warn('奖助勤贷看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalApplyCount: 256,
      totalPassCount: 198,
      totalApplyAmount: 768000.00,
      totalGrantAmount: 594000.00,
      statusCountMap: {
        '待审核': 32,
        '已通过': 198,
        '已完成': 26,
      },
      typeCountMap: {
        '奖学金': 86,
        '助学金': 102,
        '助学贷款': 48,
        '勤工俭学': 20,
      },
    });
  });
}

export function getApplyCount(params) {
  return requestClient.get('/studentmgmt/aid-work/chart/applyCount', { params }).catch(err => {
    console.warn('申请人数统计接口失败，使用模拟数据', err);
    // 模拟数据也改为数组格式，字段与后端一致
    return Promise.resolve([
      { type: "1", name: "", applyCount: 86, finishCount: 78, finishRate: 0.907 },
      { type: "2", name: "", applyCount: 102, finishCount: 92, finishRate: 0.902 },
      { type: "3", name: "", applyCount: 48, finishCount: 42, finishRate: 0.875 },
      { type: "4", name: "", applyCount: 20, finishCount: 18, finishRate: 0.90 },
    ]);
  });
}
