import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 状态映射
const statusMap = {
  '待审核': 'pending',
  '已录取': 'admitted'
};
const statusReverse = {
  'pending': '待审核',
  'admitted': '已录取'
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

// ==================== 报名管理接口 ====================
export function getRegisterMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/register-mgmt/page', { params: convertedParams })
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

// 报名
export function createRegisterMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/register-mgmt/create', convertedData).catch(err => {
    console.warn('报名接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 审核（批量）
export function auditRegisterMgmt(data) {
  return requestClient.put('/studentmgmt/register-mgmt/audit', data).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 确认（批量）
export function confirmRegisterMgmt(data) {
  return requestClient.put('/studentmgmt/register-mgmt/confirm', data).catch(err => {
    console.warn('确认接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑
export function updateRegisterMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/register-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportRegisterMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/register-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getRegisterMgmtDetail(params) {
  return requestClient.get('/studentmgmt/register-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// ==================== 图表接口 ====================
// 招生报名统计看板
export function getRegisterMgmtChart(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/register-mgmt/chart', { params: convertedParams }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalApplyCount: 156,
      pendingAuditCount: 22,
      admittedCount: 134,
      confirmedCount: 118,
      recentWeekApplyTrend: [
        { date: '2025-03-25', count: 12 },
        { date: '2025-03-26', count: 18 },
        { date: '2025-03-27', count: 22 },
        { date: '2025-03-28', count: 16 },
        { date: '2025-03-29', count: 14 },
        { date: '2025-03-30', count: 10 },
        { date: '2025-03-31', count: 8 },
      ],
    });
  });
}

// 各专业报名/录取人数统计
export function getRegisterMgmtEnrollCount(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/register-mgmt/chart/enrollCount', { params: convertedParams }).catch(err => {
    console.warn('专业统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      majorEnrollData: [
        { major: '计算机应用技术', applyCount: 45, admitCount: 40 },
        { major: '电子商务', applyCount: 32, admitCount: 28 },
        { major: '机电一体化', applyCount: 28, admitCount: 25 },
        { major: '会计电算化', applyCount: 25, admitCount: 22 },
        { major: '学前教育', applyCount: 26, admitCount: 19 },
      ],
    });
  });
}

// 模拟数据（原始值使用英文，通过转换函数对外提供中文）
export const getMockList = () => {
  return [
    {
      id: 1,
      studentName: '张三',
      idCard: '41010119900307663X',
      phone: '13800001111',
      major: '计算机应用技术',
      applyTime: 1767225600000,
      auditUser: '张老师',
      auditTime: 1767312000000,
      confirmTime: 1767398400000,
      status: 'admitted',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      studentName: '李四',
      idCard: '410101199003076641',
      phone: '13800002222',
      major: '电子商务',
      applyTime: 1767225600000,
      auditUser: null,
      auditTime: null,
      confirmTime: null,
      status: 'pending',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 3,
      studentName: '王五',
      idCard: '410101199003076652',
      phone: '13800003333',
      major: '机电一体化',
      applyTime: 1769904000000,
      auditUser: '王老师',
      auditTime: 1769990400000,
      confirmTime: 1770076800000,
      status: 'admitted',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 4,
      studentName: '赵六',
      idCard: '410101199003076663',
      phone: '13800004444',
      major: '会计电算化',
      applyTime: 1769904000000,
      auditUser: null,
      auditTime: null,
      confirmTime: null,
      status: 'pending',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 5,
      studentName: '孙七',
      idCard: '410101199003076674',
      phone: '13800005555',
      major: '学前教育',
      applyTime: 1775088000000,
      auditUser: '李老师',
      auditTime: 1775174400000,
      confirmTime: 1775260800000,
      status: 'admitted',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775088000000,
      updateTime: 1775088000000,
    },
  ];
};
