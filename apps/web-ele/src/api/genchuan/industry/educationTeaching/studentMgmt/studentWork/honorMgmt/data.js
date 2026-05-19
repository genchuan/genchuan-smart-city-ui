import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 荣誉类型映射（前端中文 ↔ 后端数字）
const honorTypeMap = {
  '优秀学生': '1',
  '奖学金': '2',
  '竞赛获奖': '3',
  '其他': '4'
};
const honorTypeReverse = {
  '1': '优秀学生',
  '2': '奖学金',
  '3': '竞赛获奖',
  '4': '其他'
};

// 状态映射（前端中文 ↔ 后端数字）
// 注：根据前端业务逻辑，待审核→1，已通过→2，已推送→3
const statusMap = {
  '待审核': '1',
  '已通过': '2',
  '已推送': '3'
};
const statusReverse = {
  '1': '待审核',
  '2': '已通过',
  '3': '已推送'
};

// 通用转换函数：后端 → 前端（将数字转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.honorType && honorTypeReverse[result.honorType]) {
    result.honorType = honorTypeReverse[result.honorType];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为数字）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.honorType && honorTypeMap[result.honorType]) {
    result.honorType = honorTypeMap[result.honorType];
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

// ==================== 荣誉管理接口 ====================
export function getHonorMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/honor-mgmt/page', { params: convertedParams })
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

export function createHonorMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/honor-mgmt/create', convertedData)
}

export function updateHonorMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/honor-mgmt/update', convertedData)
}

export function auditHonorMgmt(data) {
  // 审核接口：需要转换 status 字段（前端中文 → 后端数字）
  const convertedData = { ...data };
  if (convertedData.status && statusMap[convertedData.status]) {
    convertedData.status = statusMap[convertedData.status];
  }
  const idsParam = convertedData.ids ? convertedData.ids.join(',') : '';
  return requestClient.put('/studentmgmt/honor-mgmt/audit', null, {
    params: {
      ids: idsParam,
      status: convertedData.status,
      auditRemark: convertedData.auditRemark || '',
    },
  })
}

export function pushHonorMgmt(data) {
  return requestClient.put('/studentmgmt/honor-mgmt/push', data)
}

export function exportHonorMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/honor-mgmt/export', convertedParams)
}

export function getHonorMgmtDetail(params) {
  return requestClient.get('/studentmgmt/honor-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getHonorMgmtChart(params) {
  return requestClient.get('/studentmgmt/honor-mgmt/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    // 修改为后端实际字段名
    return Promise.resolve({
      totalHonorCount: 328,
      pendingAuditCount: 12,
      todayPushCount: 8,
      excellentStudentCount: 128,
      scholarshipCount: 86,
      competitionCount: 92,
    });
  });
}

export function getHonorCount(params) {
  return requestClient.get('/studentmgmt/honor-mgmt/chart/honorCount', { params })
    .then(res => {
      if (params.dimension === 'type' && Array.isArray(res)) {
        return res.map(item => ({
          ...item,
          name: honorTypeReverse[item.name] || item.name
        }));
      }
      return res;
    })
    .catch(err => {
      console.warn('荣誉数量统计接口失败，使用模拟数据', err);
      const mockData = {
        class: [
          { name: '计算机1班', count: 45 },
          { name: '计算机2班', count: 42 },
          { name: '软件1班', count: 48 },
          { name: '软件2班', count: 50 },
          { name: '电子1班', count: 40 },
        ],
        type: [
          { name: '优秀学生', count: 128 },
          { name: '奖学金', count: 86 },
          { name: '竞赛获奖', count: 92 },
          { name: '其他', count: 22 },
        ],
      };
      const dimension = params.dimension || 'class';
      return Promise.resolve(mockData[dimension] || []);
    });
}
