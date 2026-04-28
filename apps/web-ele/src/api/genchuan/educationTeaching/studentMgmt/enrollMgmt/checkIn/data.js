import { requestClient } from '#/api/request';

// ==================== 报到管理接口 ====================

// 分页查询
export function getCheckInPage(params) {
  return requestClient.get('/studentmgmt/check-in/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

// 补充信息
export function supplyCheckIn(data) {
  return requestClient.put('/studentmgmt/check-in/supply', data).catch(err => {
    console.warn('补充接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 确认（批量）
export function confirmCheckIn(data) {
  return requestClient.put('/studentmgmt/check-in/confirm', data).catch(err => {
    console.warn('确认接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 审核（批量）
export function auditCheckIn(data) {
  return requestClient.put('/studentmgmt/check-in/audit', data).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportCheckIn(params) {
  return requestClient.download('/studentmgmt/check-in/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getCheckInDetail(params) {
  return requestClient.get('/studentmgmt/check-in/get', { params })
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(detail);
    });
}

// 新生报到进度看板（折线图+卡片）
export function getCheckInChart(params) {
  return requestClient.get('/studentmgmt/check-in/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      waitConfirmCount: 50,
      waitAuditCount: 30,
      finishedCount: 240,
      totalCount: 320,
      progress: 75.0,
      dateList: ['2025-08-25', '2025-08-26', '2025-08-27', '2025-08-28', '2025-08-29'],
      dailyConfirmList: [20, 35, 42, 58, 65],
      dailyAuditList: [15, 30, 40, 55, 60],
    });
  });
}

// 报到核心指标统计（卡片）
export function getCheckInIndex(params) {
  return requestClient.get('/studentmgmt/check-in/chart/checkinIndex', { params }).catch(err => {
    console.warn('指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalRegisterCount: 320,
      totalConfirmCount: 270,
      checkinRate: 84.38,
      accountCreatedCount: 240,
      accountCreateRate: 75.0,
    });
  });
}

// 模拟数据（原始值使用英文，通过转换函数对外提供中文）
export const getMockList = () => {
  return [
    {
      id: 1,
      studentId: 1001,
      studentName: '张三',
      examScore: 498.5,
      supplyInfo: '特长：篮球',
      confirmTime: 1735689600000,
      auditUser: '张老师',
      auditTime: 1735776000000,
      accountCreateTime: 1735862400000,
      accountStatus: '已创建',
      status: '已报到',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1735603200000,
      updateTime: 1735689600000,
    },
    {
      id: 2,
      studentId: 1002,
      studentName: '李四',
      examScore: 587.0,
      supplyInfo: '',
      confirmTime: null,
      auditUser: null,
      auditTime: null,
      accountCreateTime: null,
      accountStatus: '未创建',
      status: '待确认',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1735603200000,
      updateTime: 1735603200000,
    },
    {
      id: 3,
      studentId: 1003,
      studentName: '王五',
      examScore: 392.0,
      supplyInfo: '少数民族',
      confirmTime: 1738281600000,
      auditUser: null,
      auditTime: null,
      accountCreateTime: null,
      accountStatus: '未创建',
      status: '待审核',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1738195200000,
      updateTime: 1738281600000,
    },
    {
      id: 4,
      studentId: 1004,
      studentName: '赵六',
      examScore: null,
      supplyInfo: '',
      confirmTime: null,
      auditUser: null,
      auditTime: null,
      accountCreateTime: null,
      accountStatus: '未创建',
      status: '待确认',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1738195200000,
      updateTime: 1738195200000,
    },
    {
      id: 5,
      studentId: 1005,
      studentName: '孙七',
      examScore: 495.0,
      supplyInfo: '市级三好学生',
      confirmTime: 1738886400000,
      auditUser: '李老师',
      auditTime: 1738972800000,
      accountCreateTime: 1739059200000,
      accountStatus: '已创建',
      status: '已报到',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1738800000000,
      updateTime: 1738886400000,
    },
    {
      id: 6,
      studentId: 1006,
      studentName: '周八',
      examScore: 588.0,
      supplyInfo: '',
      confirmTime: null,
      auditUser: null,
      auditTime: null,
      accountCreateTime: null,
      accountStatus: '未创建',
      status: '待确认',
      remark: '',
      creator: 'teacher_wang',
      updater: 'teacher_wang',
      createTime: 1738800000000,
      updateTime: 1738800000000,
    },
  ];
};
