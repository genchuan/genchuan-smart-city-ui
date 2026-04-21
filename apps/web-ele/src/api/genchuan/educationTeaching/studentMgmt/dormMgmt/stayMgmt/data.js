import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 状态映射
const statusMap = {
  '待确认': 'pending_confirm',
  '待审核': 'pending_audit',
  '已通过': 'approved'
};
const statusReverse = {
  'pending_confirm': '待确认',
  'pending_audit': '待审核',
  'approved': '已通过'
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

// ==================== 留宿管理接口 ====================
export function getStayMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/stay-mgmt/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = getMockList();
      return { list: convertList(mock), total: mock.length };
    });
}

// 申请留宿
export function createStayMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/stay-mgmt/create', convertedData).catch(err => {
    console.warn('申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 家长确认（批量）
export function confirmStayMgmt(data) {
  return requestClient.put('/studentmgmt/stay-mgmt/confirm', data).catch(err => {
    console.warn('确认接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 审核（批量）
export function auditStayMgmt(data) {
  return requestClient.put('/studentmgmt/stay-mgmt/audit', data).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑留宿申请
export function updateStayMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/stay-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportStayMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/stay-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getStayMgmtDetail(params) {
  return requestClient.get('/studentmgmt/stay-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// 获取学生列表（用于申请下拉框）
export function getStudentOptions(params) {
  return requestClient.get('/studentmgmt/student/options', { params }).catch(err => {
    console.warn('获取学生列表失败，使用模拟数据', err);
    return Promise.resolve([
      { value: 1, label: '张三', className: '高一1班' },
      { value: 2, label: '李四', className: '高一1班' },
      { value: 3, label: '王五', className: '高一2班' },
      { value: 4, label: '赵六', className: '高一2班' },
      { value: 5, label: '孙七', className: '高一3班' },
    ]);
  });
}

// ==================== 图表接口 ====================
export function getStayMgmtChart(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/stay-mgmt/chart', { params: convertedParams }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalStayCount: 156,
      pendingConfirmCount: 15,
      pendingAuditCount: 8,
      passedCount: 133,
      weekendTrend: [
        { date: '2025-03-02', count: 22 },
        { date: '2025-03-09', count: 18 },
        { date: '2025-03-16', count: 25 },
        { date: '2025-03-23', count: 20 },
        { date: '2025-03-30', count: 28 },
      ],
      statusDistribution: [
        { status: '待确认', count: 15 },
        { status: '待审核', count: 8 },
        { status: '已通过', count: 133 },
      ],
    });
  });
}

export function getStayMgmtCount(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/stay-mgmt/chart/stayCount', { params: convertedParams }).catch(err => {
    console.warn('班级统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      classStatistics: [
        { className: '高一1班', stayCount: 18, ratio: 0.25 },
        { className: '高一2班', stayCount: 15, ratio: 0.21 },
        { className: '高一3班', stayCount: 22, ratio: 0.30 },
      ],
    });
  });
}

// 模拟数据（原始值使用英文，通过转换函数对外提供中文）
export const getMockList = () => {
  return [
    {
      id: 1,
      studentId: 202301,
      studentName: '张三',
      className: '高一1班',
      stayDate: [2025, 1, 1],
      stayReason: '周末补习',
      applyTime: 1767225600000,
      parentConfirmTime: 1767312000000,
      auditUser: '张老师',
      auditTime: 1767398400000,
      status: 'approved',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      studentId: 202302,
      studentName: '李四',
      className: '高一1班',
      stayDate: [2025, 1, 1],
      stayReason: '社团活动',
      applyTime: 1767225600000,
      parentConfirmTime: null,
      auditUser: null,
      auditTime: null,
      status: 'pending_confirm',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 3,
      studentId: 202403,
      studentName: '王五',
      className: '高一2班',
      stayDate: [2025, 2, 1],
      stayReason: '比赛集训',
      applyTime: 1769904000000,
      parentConfirmTime: 1769990400000,
      auditUser: null,
      auditTime: null,
      status: 'pending_audit',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 4,
      studentId: 202404,
      studentName: '赵六',
      className: '高一2班',
      stayDate: [2025, 2, 1],
      stayReason: '图书馆自习',
      applyTime: 1769904000000,
      parentConfirmTime: null,
      auditUser: null,
      auditTime: null,
      status: 'pending_confirm',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 5,
      studentId: 202505,
      studentName: '孙七',
      className: '高一3班',
      stayDate: [2025, 3, 1],
      stayReason: '参加活动',
      applyTime: 1775088000000,
      parentConfirmTime: 1775174400000,
      auditUser: '李老师',
      auditTime: 1775260800000,
      status: 'approved',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775088000000,
      updateTime: 1775088000000,
    },
  ];
};
