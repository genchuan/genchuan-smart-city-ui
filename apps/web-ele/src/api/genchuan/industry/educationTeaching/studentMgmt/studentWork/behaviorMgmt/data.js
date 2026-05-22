import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 请假类型映射
const leaveTypeMap = {
  '事假': '1',
  '病假': '2',
  '其他': '3'
};
const leaveTypeReverse = {
  '1': '事假',
  '2': '病假',
  '3': '其他'
};

// 审批级别映射
const auditLevelMap = {
  '班主任': '1',
  '辅导员': '2'
};
const auditLevelReverse = {
  '1': '班主任',
  '2': '辅导员'
};

// 考勤同步状态映射
const attendanceSyncMap = {
  '未同步': '0',
  '已同步': '1'
};
const attendanceSyncReverse = {
  '0': '未同步',
  '1': '已同步'
};

// 状态映射（待审批、已通过、已驳回）
const statusMap = {
  '待审批': '1',
  '已通过': '2',
  '已驳回': '3'
};
const statusReverse = {
  '1': '待审批',
  '2': '已通过',
  '3': '已驳回'
};

// 通用转换函数：后端 → 前端（将数字/代码转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.leaveType && leaveTypeReverse[result.leaveType]) {
    result.leaveType = leaveTypeReverse[result.leaveType];
  }
  if (result.auditLevel && auditLevelReverse[result.auditLevel]) {
    result.auditLevel = auditLevelReverse[result.auditLevel];
  }
  if (result.attendanceSync && attendanceSyncReverse[result.attendanceSync]) {
    result.attendanceSync = attendanceSyncReverse[result.attendanceSync];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为数字/代码）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.leaveType && leaveTypeMap[result.leaveType]) {
    result.leaveType = leaveTypeMap[result.leaveType];
  }
  if (result.auditLevel && auditLevelMap[result.auditLevel]) {
    result.auditLevel = auditLevelMap[result.auditLevel];
  }
  if (result.attendanceSync && attendanceSyncMap[result.attendanceSync]) {
    result.attendanceSync = attendanceSyncMap[result.attendanceSync];
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

// ==================== 行为管理接口 ====================
export function getBehaviorMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/behavior-mgmt/page', { params: convertedParams })
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

export function createBehaviorMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/behavior-mgmt/create', convertedData)
}

export function updateBehaviorMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/behavior-mgmt/update', convertedData)
}

export function auditBehaviorMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/behavior-mgmt/audit', convertedData)
}

export function cancelBehaviorMgmt(data) {
  return requestClient.put('/studentmgmt/behavior-mgmt/cancel', data)
}

export function exportBehaviorMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/behavior-mgmt/export-excel', convertedParams)
}

export function getBehaviorMgmtDetail(params) {
  return requestClient.get('/studentmgmt/behavior-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
// 修改：模拟数据字段与后端保持一致（name/count）
export function getBehaviorMgmtChart(params) {
  return requestClient.get('/studentmgmt/behavior-mgmt/chart', { params }).catch(err => {
    console.warn('行为考勤看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalLeaveCount: 86,
      pendingAuditCount: 12,
      attendanceAbnormalCount: 5,
      syncCount: 74,
      leaveTypeDistribution: [
        { name: '事假', count: 45 },
        { name: '病假', count: 32 },
        { name: '其他', count: 9 },
      ],
      dailyLeaveTrend: [
        { name: '03-01', count: 3 },
        { name: '03-02', count: 5 },
        { name: '03-03', count: 2 },
      ],
    });
  });
}

export function getAttendanceCount(params) {
  return requestClient.get('/studentmgmt/behavior-mgmt/attendanceCount', { params }).catch(err => {
    console.warn('班级请假次数统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      classStatistics: [
        { className: '计算机1班', leaveCount: 12, abnormalCount: 1 },
        { className: '计算机2班', leaveCount: 15, abnormalCount: 2 },
        { className: '软件1班', leaveCount: 9, abnormalCount: 0 },
        { className: '软件2班', leaveCount: 8, abnormalCount: 1 },
        { className: '电子1班', leaveCount: 10, abnormalCount: 1 },
      ],
    });
  });
}
