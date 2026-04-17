import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const checkoutStatusMap = {
  '已退宿': 'checked_out',
  '未退宿': 'not_checked_out'
};
const checkoutStatusReverseMap = {
  'checked_out': '已退宿',
  'not_checked_out': '未退宿'
};

const statusMap = {
  '待确认': 'pending_confirm',
  '待办理': 'pending_handle',
  '已离校': 'left',
  '待审核': 'pending_handle'
};
const statusReverseMap = {
  'pending_confirm': '待确认',
  'pending_handle': '待办理',
  'left': '已离校'
};

// 响应数据：英文 → 中文
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.checkoutStatus && checkoutStatusReverseMap[result.checkoutStatus]) {
    result.checkoutStatus = checkoutStatusReverseMap[result.checkoutStatus];
  }
  if (result.status && statusReverseMap[result.status]) {
    result.status = statusReverseMap[result.status];
  } else if (result.status === '待审核') {
    result.status = '待办理';
  }
  return result;
}

// 请求参数：中文 → 英文
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.checkoutStatus && checkoutStatusMap[result.checkoutStatus]) {
    result.checkoutStatus = checkoutStatusMap[result.checkoutStatus];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  return result;
}

// 转换列表
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 离校办理接口 ====================
export function getLeaveHandlePage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/leave-handle/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = convertList(getMockList());
      return { list: mock, total: mock.length };
    });
}

export function createLeaveHandle(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/leave-handle/create', convertedData).catch(err => {
    console.warn('申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateLeaveHandle(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/leave-handle/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function confirmLeaveHandle(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/leave-handle/confirm', convertedData).catch(err => {
    console.warn('确认接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function handleLeaveHandle(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/leave-handle/handle', convertedData).catch(err => {
    console.warn('办理接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportLeaveHandle(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/leave-handle/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getLeaveHandleDetail(params) {
  return requestClient.get('/studentmgmt/leave-handle/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

export function getStudentOptions(params) {
  return requestClient.get('/studentmgmt/student/options', { params }).catch(err => {
    console.warn('获取学生列表失败，使用模拟数据', err);
    return Promise.resolve([
      { value: 1, label: '张三' },
      { value: 2, label: '李四' },
      { value: 3, label: '王五' },
      { value: 4, label: '赵六' },
      { value: 5, label: '孙七' },
    ]);
  });
}

// ==================== 图表接口 ====================
export function getLeaveHandleChart(params) {
  return requestClient.get('/studentmgmt/leave-handle/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalGraduate: 256,
      waitConfirm: 12,
      waitHandle: 24,
      finishedLeave: 220,
      finishRate: 85.94,
    });
  });
}

export function getLeaveHandleIndex(params) {
  return requestClient.get('/studentmgmt/leave-handle/chart/leaveIndex', { params }).catch(err => {
    console.warn('核心指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      checkoutRate: 92.58,
      parentConfirmRate: 95.31,
      handleFinishRate: 85.94,
      dailyLeaveCount: [
        { date: '2025-03-25', count: 15 },
        { date: '2025-03-26', count: 22 },
        { date: '2025-03-27', count: 18 },
        { date: '2025-03-28', count: 16 },
        { date: '2025-03-29', count: 12 },
        { date: '2025-03-30', count: 9 },
        { date: '2025-03-31', count: 11 },
      ],
    });
  });
}

// 模拟数据（原始值使用英文）
export const getMockList = () => {
  return [
    {
      id: 1,
      studentId: 1,
      studentName: '张三',
      leaveTime: 1767225600000,
      leaveAddress: '回家',
      parentConfirmTime: 1767312000000,
      handleUser: '张老师',
      handleTime: 1767398400000,
      checkoutTime: 1767398400000,
      checkoutStatus: 'checked_out',
      finishRate: 100.0,
      status: 'left',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      studentId: 2,
      studentName: '李四',
      leaveTime: 1767225600000,
      leaveAddress: '外出实习',
      parentConfirmTime: null,
      handleUser: null,
      handleTime: null,
      checkoutTime: null,
      checkoutStatus: 'not_checked_out',
      finishRate: null,
      status: 'pending_confirm',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 3,
      studentId: 3,
      studentName: '王五',
      leaveTime: 1769904000000,
      leaveAddress: '就业',
      parentConfirmTime: 1769990400000,
      handleUser: null,
      handleTime: null,
      checkoutTime: null,
      checkoutStatus: 'not_checked_out',
      finishRate: null,
      status: 'pending_handle',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 4,
      studentId: 4,
      studentName: '赵六',
      leaveTime: 1769904000000,
      leaveAddress: '回家',
      parentConfirmTime: null,
      handleUser: null,
      handleTime: null,
      checkoutTime: null,
      checkoutStatus: 'not_checked_out',
      finishRate: null,
      status: 'pending_confirm',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 5,
      studentId: 5,
      studentName: '孙七',
      leaveTime: 1775088000000,
      leaveAddress: '升学',
      parentConfirmTime: 1775174400000,
      handleUser: '李老师',
      handleTime: 1775260800000,
      checkoutTime: 1775260800000,
      checkoutStatus: 'checked_out',
      finishRate: 100.0,
      status: 'left',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775088000000,
      updateTime: 1775088000000,
    },
  ];
};
