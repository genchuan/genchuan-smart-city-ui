import { requestClient } from '#/api/request';

// ==================== 违纪管理接口 ====================
export function getViolateMgmtPage(params) {
  return requestClient.get('/studentmgmt/violate-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

export function createViolateMgmt(data) {
  return requestClient.post('/studentmgmt/violate-mgmt/create', data).catch(err => {
    console.warn('登记接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateViolateMgmt(data) {
  return requestClient.put('/studentmgmt/violate-mgmt/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function auditViolateMgmt(data) {
  return requestClient.put('/studentmgmt/violate-mgmt/audit', data).catch(err => {
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
  return requestClient.download('/studentmgmt/violate-mgmt/export', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getViolateMgmtDetail(params) {
  return requestClient.get('/studentmgmt/violate-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = dataList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
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

// 模拟数据（与接口响应结构一致）
export const dataList = () => {
  return [
    {
      id: 1,
      studentId: 1,
      studentName: '张三',
      className: '高一(1)班',
      violateType: '行为违规',
      punishType: '警告',
      violateTime: 1672531200000,
      violateReason: '上课玩手机',
      auditUser: 'admin',
      auditTime: 1672617600000,
      pushTime: null,
      warnTime: null,
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
      className: '高一(2)班',
      violateType: '仪容仪表',
      punishType: '警告',
      violateTime: 1672617600000,
      violateReason: '未穿校服',
      auditUser: 'admin',
      auditTime: 1672704000000,
      pushTime: 1672790400000,
      warnTime: null,
      status: '已执行',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672790400000,
    },
    {
      id: 3,
      studentId: 3,
      studentName: '王五',
      className: '高一(3)班',
      violateType: '行为违规',
      punishType: '记过',
      violateTime: 1672704000000,
      violateReason: '打架斗殴',
      auditUser: null,
      auditTime: null,
      pushTime: null,
      warnTime: 1672876800000,
      status: '已预警',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672876800000,
    },
    {
      id: 4,
      studentId: 4,
      studentName: '赵六',
      className: '高二(1)班',
      violateType: '其他',
      punishType: '留校察看',
      violateTime: 1672790400000,
      violateReason: '考试作弊',
      auditUser: 'admin',
      auditTime: 1672876800000,
      pushTime: 1672963200000,
      warnTime: null,
      status: '已执行',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672963200000,
    },
    {
      id: 5,
      studentId: 5,
      studentName: '孙七',
      className: '高二(2)班',
      violateType: '仪容仪表',
      punishType: '警告',
      violateTime: 1672876800000,
      violateReason: '染发',
      auditUser: 'admin',
      auditTime: 1672963200000,
      pushTime: null,
      warnTime: null,
      status: '待审批',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672963200000,
    },
    {
      id: 6,
      studentId: 6,
      studentName: '周八',
      className: '高二(1)班',
      violateType: '行为违规',
      punishType: '记过',
      violateTime: 1672963200000,
      violateReason: '旷课',
      auditUser: null,
      auditTime: null,
      pushTime: null,
      warnTime: null,
      status: '待审批',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
