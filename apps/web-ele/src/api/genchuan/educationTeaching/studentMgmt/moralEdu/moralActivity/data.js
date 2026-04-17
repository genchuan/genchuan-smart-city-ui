import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 活动类型映射
const activityTypeMap = {
  '党团活动': 'party_league',
  '志愿活动': 'volunteer',
  '其他': 'other'
};
const activityTypeReverse = {
  'party_league': '党团活动',
  'volunteer': '志愿活动',
  'other': '其他'
};

// 状态映射
const statusMap = {
  '未发布': 'unpublished',
  '进行中': 'ongoing',
  '已结束': 'ended'
};
const statusReverse = {
  'unpublished': '未发布',
  'ongoing': '进行中',
  'ended': '已结束'
};

// 部门ID到名称的映射（根据后端实际数据）
const deptIdToName = {
  1001: '学生工作部',
  1002: '团委',
  1003: '教务处'
};

// 通用转换函数：后端 → 前端
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.activityType && activityTypeReverse[result.activityType]) {
    result.activityType = activityTypeReverse[result.activityType];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  if (result.hostDept && typeof result.hostDept === 'number' && deptIdToName[result.hostDept]) {
    result.hostDept = deptIdToName[result.hostDept];
  }
  return result;
}

// 通用转换函数：前端 → 后端
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.activityType && activityTypeMap[result.activityType]) {
    result.activityType = activityTypeMap[result.activityType];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  // 注意：hostDept 前端是名称，后端期望 ID，但需要反向映射（名称 → ID）
  // 由于名称到ID的映射不唯一（但此处我们只用于提交，可构建反向映射）
  if (result.hostDept && typeof result.hostDept === 'string') {
    const reverseDeptMap = Object.fromEntries(
      Object.entries(deptIdToName).map(([id, name]) => [name, Number(id)])
    );
    if (reverseDeptMap[result.hostDept]) {
      result.hostDept = reverseDeptMap[result.hostDept];
    }
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 德育活动接口 ====================
export function getMoralActivityPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/moral-activity/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = getMockList();
      // 模拟数据已经是中文，但为了保持一致也调用转换（幂等）
      return { list: convertList(mock), total: mock.length };
    });
}

export function createMoralActivity(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/moral-activity/create', convertedData).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateMoralActivity(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/moral-activity/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function publishMoralActivity(ids) {
  // 发布接口只传 ids，无需转换
  return requestClient.put('/studentmgmt/moral-activity/publish', { ids }).catch(err => {
    console.warn('发布接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function joinMoralActivity(data) {
  // 报名接口只传 id 和 studentId，无需转换
  return requestClient.put('/studentmgmt/moral-activity/join', data).catch(err => {
    console.warn('报名接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function recordMoralActivity(data) {
  // 记录接口只传 id、content、joinNum，无需转换
  return requestClient.put('/studentmgmt/moral-activity/record', data).catch(err => {
    console.warn('记录接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportMoralActivity(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/moral-activity/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getMoralActivityDetail(params) {
  return requestClient.get('/studentmgmt/moral-activity/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// 获取学生列表（用于报名下拉框）
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

// 获取部门列表（用于主办部门下拉框）- 返回部门名称作为 value，同时保留 id 用于映射
export function getDeptOptions(params) {
  return requestClient.get('/studentmgmt/dept/options', { params }).catch(err => {
    console.warn('获取部门列表失败，使用模拟数据', err);
    // 模拟数据：返回包含 id 和 name 的对象数组，便于映射
    return Promise.resolve([
      { id: 1001, name: '学生工作部', value: '学生工作部', label: '学生工作部' },
      { id: 1002, name: '团委', value: '团委', label: '团委' },
      { id: 1003, name: '教务处', value: '教务处', label: '教务处' },
    ]);
  });
}

// ==================== 图表接口 ====================
export function getMoralActivityChart(params) {
  return requestClient.get('/studentmgmt/moral-activity/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      statusCount: { unPublishCount: 2, processingCount: 3, finishedCount: 10 },
      activityTypeCount: { partyCount: 5, volunteerCount: 7, otherCount: 3 },
      monthTrend: [
        { month: '2025-01', count: 2 },
        { month: '2025-02', count: 4 },
        { month: '2025-03', count: 9 },
      ],
      joinTrend: [
        { month: '2025-01', count: 80 },
        { month: '2025-02', count: 150 },
        { month: '2025-03', count: 300 },
      ],
    });
  });
}

export function getMoralActivityCount(params) {
  return requestClient.get('/studentmgmt/moral-activity/chart/activityCount', { params }).catch(err => {
    console.warn('活动数量统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      typeList: ['党团活动', '志愿活动', '其他'],
      activityCountList: [5, 7, 3],
      joinCountList: [200, 280, 50],
    });
  });
}

// 模拟数据（原始值使用中文，与前端一致）
export const getMockList = () => {
  return [
    {
      id: 1,
      activityName: '学雷锋志愿活动',
      activityType: '志愿活动',
      hostDept: '学生工作部',
      startTime: 1767225600000,
      endTime: 1767312000000,
      joinNum: 45,
      photo: 'https://picsum.photos/id/100/200/150',
      content: '组织学生清扫校园',
      publishTime: 1767139200000,
      status: '进行中',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767139200000,
      updateTime: 1767139200000,
    },
    {
      id: 2,
      activityName: '党史知识竞赛',
      activityType: '党团活动',
      hostDept: '团委',
      startTime: 1769904000000,
      endTime: 1769990400000,
      joinNum: 80,
      photo: '',
      content: '',
      publishTime: null,
      status: '未发布',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 3,
      activityName: '社区服务',
      activityType: '志愿活动',
      hostDept: '学生工作部',
      startTime: 1775088000000,
      endTime: 1775174400000,
      joinNum: 120,
      photo: 'https://picsum.photos/id/101/200/150',
      content: '',
      publishTime: 1775001600000,
      status: '已结束',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775001600000,
      updateTime: 1775001600000,
    },
    {
      id: 4,
      activityName: '环保讲座',
      activityType: '其他',
      hostDept: '教务处',
      startTime: 1777680000000,
      endTime: 1777766400000,
      joinNum: 60,
      photo: 'https://picsum.photos/id/102/200/150',
      content: '',
      publishTime: 1777593600000,
      status: '进行中',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1777593600000,
      updateTime: 1777593600000,
    },
    {
      id: 5,
      activityName: '植树活动',
      activityType: '志愿活动',
      hostDept: '团委',
      startTime: 1780358400000,
      endTime: 1780444800000,
      joinNum: null,
      photo: '',
      content: '',
      publishTime: null,
      status: '未发布',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1780358400000,
      updateTime: 1780358400000,
    },
  ];
};
