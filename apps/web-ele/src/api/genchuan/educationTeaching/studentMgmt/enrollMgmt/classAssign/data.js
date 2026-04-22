import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const statusMap = {
  '未分班': 'unassigned',
  '已分班': 'assigned'
};
const statusReverseMap = {
  'unassigned': '未分班',
  'assigned': '已分班'
};

// 响应数据：英文 → 中文
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.status && statusReverseMap[result.status]) {
    result.status = statusReverseMap[result.status];
  }
  return result;
}

// 请求参数：中文 → 英文
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
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

// ==================== 分班管理接口 ====================

// 分页查询
export function getClassAssignPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/class-assign/page', { params: convertedParams })
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

// 配置（新增分班任务）
export function createClassAssignConfig(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/class-assign/config', convertedData).catch(err => {
    console.warn('配置接口失败，模拟成功', err);
    return Promise.resolve({ id: Date.now() });
  });
}

// 分班（批量）
export function assignClassAssign(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/class-assign/assign', convertedData).catch(err => {
    console.warn('分班接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 确认（批量）
export function confirmClassAssign(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/class-assign/confirm', convertedData).catch(err => {
    console.warn('确认接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑
export function updateClassAssign(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/class-assign/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportClassAssign(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/class-assign/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getClassAssignDetail(params) {
  return requestClient.get('/studentmgmt/class-assign/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// 新生分班分布看板
export function getClassAssignChart(params) {
  return requestClient.get('/studentmgmt/class-assign/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalAssignTaskCount: 12,
      unassignedCount: 3,
      assignedCount: 9,
      totalAssignedStudentCount: 586,
      recentWeekAssignTrend: [
        { date: '2025-03-25', count: 68 },
        { date: '2025-03-26', count: 85 },
        { date: '2025-03-27', count: 135 },
        { date: '2025-03-28', count: 72 },
        { date: '2025-03-29', count: 42 },
        { date: '2025-03-30', count: 12 },
        { date: '2025-03-31', count: 12 },
      ],
    });
  });
}

// 班级人数/专业分班占比统计
export function getClassAssignDistribution(params) {
  return requestClient.get('/studentmgmt/class-assign/chart/classDistribution', { params }).catch(err => {
    console.warn('分布统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      classStudentCount: [
        { className: '2025级计算机1班', studentCount: 48 },
        { className: '2025级计算机2班', studentCount: 47 },
        { className: '2025级电商1班', studentCount: 45 },
        { className: '2025级机电1班', studentCount: 48 },
        { className: '2025级会计1班', studentCount: 43 },
        { className: '2025级学前1班', studentCount: 41 },
      ],
      majorAssignRate: [
        { name: '计算机应用技术', value: 0.28 },
        { name: '电子商务', value: 0.20 },
        { name: '机电一体化', value: 0.19 },
        { name: '会计电算化', value: 0.17 },
        { name: '学前教育', value: 0.16 },
      ],
    });
  });
}

// 模拟数据（原始值使用英文）
export const getMockList = () => {
  return [
    {
      id: 1,
      ruleContent: '按成绩均衡分班，成绩前30%平均分配',
      studentNum: 120,
      assignTime: 1735689600000,
      confirmUser: '张主任',
      confirmTime: 1735776000000,
      status: 'assigned',
      remark: '',
      className: '2025级计算机1班',
      creator: 'admin',
      updater: 'admin',
      createTime: 1735603200000,
      updateTime: 1735689600000,
    },
    {
      id: 2,
      ruleContent: '按性别和生源地均衡分班',
      studentNum: 98,
      assignTime: null,
      confirmUser: null,
      confirmTime: null,
      status: 'unassigned',
      remark: '优先考虑本地生源',
      className: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1735603200000,
      updateTime: 1735603200000,
    },
    {
      id: 3,
      ruleContent: '按成绩分层分班，重点班选拔',
      studentNum: 85,
      assignTime: 1738281600000,
      confirmUser: '王主任',
      confirmTime: 1738368000000,
      status: 'assigned',
      remark: '',
      className: '2025级计算机2班',
      creator: 'admin',
      updater: 'admin',
      createTime: 1738195200000,
      updateTime: 1738281600000,
    },
    {
      id: 4,
      ruleContent: '随机分班，平衡班级人数',
      studentNum: 105,
      assignTime: null,
      confirmUser: null,
      confirmTime: null,
      status: 'unassigned',
      remark: '',
      className: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1738195200000,
      updateTime: 1738195200000,
    },
    {
      id: 5,
      ruleContent: '按成绩均衡分班，成绩前30%平均分配',
      studentNum: 112,
      assignTime: 1738886400000,
      confirmUser: '李主任',
      confirmTime: 1738972800000,
      status: 'assigned',
      remark: '含特长生',
      className: '2025级会计1班',
      creator: 'admin',
      updater: 'admin',
      createTime: 1738800000000,
      updateTime: 1738886400000,
    },
    {
      id: 6,
      ruleContent: '按性别和生源地均衡分班',
      studentNum: 95,
      assignTime: null,
      confirmUser: null,
      confirmTime: null,
      status: 'unassigned',
      remark: '',
      className: '',
      creator: 'teacher_wang',
      updater: 'teacher_wang',
      createTime: 1738800000000,
      updateTime: 1738800000000,
    },
    {
      id: 7,
      ruleContent: '随机分班，平衡班级人数',
      studentNum: 108,
      assignTime: 1739491200000,
      confirmUser: '赵主任',
      confirmTime: 1739577600000,
      status: 'assigned',
      remark: '走读生优先',
      className: '2025级计算机3班',
      creator: 'admin',
      updater: 'admin',
      createTime: 1739404800000,
      updateTime: 1739491200000,
    },
    {
      id: 8,
      ruleContent: '按成绩分层分班，重点班选拔',
      studentNum: 78,
      assignTime: null,
      confirmUser: null,
      confirmTime: null,
      status: 'unassigned',
      remark: '',
      className: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1739404800000,
      updateTime: 1739404800000,
    },
  ];
};
