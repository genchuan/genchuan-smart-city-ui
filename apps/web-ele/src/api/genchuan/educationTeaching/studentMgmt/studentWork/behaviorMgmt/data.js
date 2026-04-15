import { requestClient } from '#/api/request';

// ==================== 行为管理接口 ====================
export function getBehaviorMgmtPage(params) {
  return requestClient.get('/studentmgmt/behavior-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

export function createBehaviorMgmt(data) {
  return requestClient.post('/studentmgmt/behavior-mgmt/create', data).catch(err => {
    console.warn('申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateBehaviorMgmt(data) {
  return requestClient.put('/studentmgmt/behavior-mgmt/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function auditBehaviorMgmt(data) {
  return requestClient.put('/studentmgmt/behavior-mgmt/audit', data).catch(err => {
    console.warn('审批接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function cancelBehaviorMgmt(params) {
  return requestClient.put('/studentmgmt/behavior-mgmt/cancel', null, { params }).catch(err => {
    console.warn('撤销接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportBehaviorMgmt(params) {
  return requestClient.download('/studentmgmt/behavior-mgmt/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getBehaviorMgmtDetail(params) {
  return requestClient.get('/studentmgmt/behavior-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = dataList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// 获取学生选项（用于申请下拉框）
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
export function getBehaviorMgmtChart(params) {
  return requestClient.get('/studentmgmt/behavior-mgmt/chart', { params }).catch(err => {
    console.warn('行为考勤看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalLeaveCount: 86,
      pendingAuditCount: 12,
      attendanceAbnormalCount: 5,
      syncCount: 74,
      leaveTypeDistribution: [
        { name: '事假', value: 45 },
        { name: '病假', value: 32 },
        { name: '其他', value: 9 },
      ],
      dailyLeaveTrend: [
        { date: '03-01', count: 3 },
        { date: '03-02', count: 5 },
        { date: '03-03', count: 2 },
      ],
    });
  });
}

export function getAttendanceCount(params) {
  return requestClient.get('/studentmgmt/behavior-mgmt/chart/attendanceCount', { params }).catch(err => {
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

// 模拟数据（与接口响应结构一致）
export const dataList = () => {
  return [
    {
      id: 1,
      studentId: 1,
      studentName: '张三',
      className: '计算机1班',
      leaveType: '事假',
      startTime: 1672531200000,
      endTime: 1672617600000,
      leaveReason: '家里有事',
      auditLevel: '班主任',
      auditUser: null,
      auditTime: null,
      attendanceSync: '未同步',
      status: '待审批',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      studentId: 2,
      studentName: '李四',
      className: '软件1班',
      leaveType: '病假',
      startTime: 1672617600000,
      endTime: 1672704000000,
      leaveReason: '感冒发烧',
      auditLevel: '班主任',
      auditUser: '王老师',
      auditTime: 1672650000000,
      attendanceSync: '已同步',
      status: '已通过',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672650000000,
    },
    {
      id: 3,
      studentId: 3,
      studentName: '王五',
      className: '计算机2班',
      leaveType: '其他',
      startTime: 1672704000000,
      endTime: 1672790400000,
      leaveReason: '参加比赛',
      auditLevel: '辅导员',
      auditUser: '李老师',
      auditTime: 1672720000000,
      attendanceSync: '未同步',
      status: '已驳回',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672720000000,
    },
    {
      id: 4,
      studentId: 4,
      studentName: '赵六',
      className: '电子1班',
      leaveType: '事假',
      startTime: 1672790400000,
      endTime: 1672876800000,
      leaveReason: '探亲',
      auditLevel: '班主任',
      auditUser: null,
      auditTime: null,
      attendanceSync: '未同步',
      status: '待审批',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672790400000,
    },
    {
      id: 5,
      studentId: 5,
      studentName: '孙七',
      className: '大数据1班',
      leaveType: '病假',
      startTime: 1672876800000,
      endTime: 1672963200000,
      leaveReason: '牙痛',
      auditLevel: '班主任',
      auditUser: '王老师',
      auditTime: 1672900000000,
      attendanceSync: '已同步',
      status: '已通过',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672900000000,
    },
    {
      id: 6,
      studentId: 6,
      studentName: '周八',
      className: '软件2班',
      leaveType: '事假',
      startTime: 1672963200000,
      endTime: 1673049600000,
      leaveReason: '婚礼',
      auditLevel: '辅导员',
      auditUser: null,
      auditTime: null,
      attendanceSync: '未同步',
      status: '待审批',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
