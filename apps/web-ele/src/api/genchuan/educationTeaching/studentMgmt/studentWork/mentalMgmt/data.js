import { requestClient } from '#/api/request';

// ==================== 心理管理接口 ====================
export function getMentalMgmtPage(params) {
  return requestClient.get('/studentmgmt/mental-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

export function createMentalMgmt(data) {
  return requestClient.post('/studentmgmt/mental-mgmt/create', data).catch(err => {
    console.warn('建档接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateMentalMgmt(data) {
  return requestClient.put('/studentmgmt/mental-mgmt/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function consultMentalMgmt(data) {
  return requestClient.put('/studentmgmt/mental-mgmt/consult', data).catch(err => {
    console.warn('预约接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function interveneMentalMgmt(data) {
  return requestClient.put('/studentmgmt/mental-mgmt/intervene', data).catch(err => {
    console.warn('跟进接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateStatusMentalMgmt(data) {
  return requestClient.put('/studentmgmt/mental-mgmt/updateStatus', data).catch(err => {
    console.warn('状态更新接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportMentalMgmt(params) {
  return requestClient.download('/studentmgmt/mental-mgmt/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getMentalMgmtDetail(params) {
  return requestClient.get('/studentmgmt/mental-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = dataList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// 获取学生选项（用于建档下拉框）
export function getStudentOptions(params) {
  return requestClient.get('/envirhealth/user/options', { params }).catch(err => {
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
export function getMentalMgmtChart() {
  return requestClient.get('/studentmgmt/mental-mgmt/chart').catch(err => {
    console.warn('心理看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalCount: 120,
      normalCount: 98,
      focusCount: 18,
      highRiskCount: 4,
      lowRiskCount: 100,
      midRiskCount: 16,
      highRiskLevelCount: 4,
      waitEvaluateCount: 10,
      consultingCount: 5,
      intervenedCount: 105,
      recent7DayCount: 8,
    });
  });
}

export function getStatusDistribution() {
  return requestClient.get('/studentmgmt/mental-mgmt/chart/statusDistribution').catch(err => {
    console.warn('分布统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      mentalStatusDistribution: [
        { name: '正常', value: 98 },
        { name: '关注', value: 18 },
        { name: '高危', value: 4 },
      ],
      riskLevelDistribution: [
        { name: '低', value: 100 },
        { name: '中', value: 16 },
        { name: '高', value: 4 },
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
      className: '计算机科学与技术1班',
      mentalStatus: '正常',
      riskLevel: '低',
      evaluateTime: 1672531200000,
      consultTime: null,
      interveneTime: null,
      interveneContent: null,
      status: '待评估',
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
      className: '软件工程1班',
      mentalStatus: '关注',
      riskLevel: '中',
      evaluateTime: 1672617600000,
      consultTime: 1672704000000,
      interveneTime: null,
      interveneContent: null,
      status: '咨询中',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672704000000,
    },
    {
      id: 3,
      studentId: 3,
      studentName: '王五',
      className: '计算机科学与技术2班',
      mentalStatus: '高危',
      riskLevel: '高',
      evaluateTime: 1672704000000,
      consultTime: 1672790400000,
      interveneTime: 1672876800000,
      interveneContent: '安排心理咨询，情绪稳定',
      status: '已干预',
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
      className: '电子信息工程1班',
      mentalStatus: '正常',
      riskLevel: '低',
      evaluateTime: 1672790400000,
      consultTime: null,
      interveneTime: null,
      interveneContent: null,
      status: '待评估',
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
      mentalStatus: '关注',
      riskLevel: '中',
      evaluateTime: 1672876800000,
      consultTime: 1672963200000,
      interveneTime: null,
      interveneContent: null,
      status: '咨询中',
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
      className: '软件工程2班',
      mentalStatus: '高危',
      riskLevel: '高',
      evaluateTime: 1672963200000,
      consultTime: null,
      interveneTime: null,
      interveneContent: null,
      status: '待评估',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
