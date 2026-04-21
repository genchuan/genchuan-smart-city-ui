import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 评比周期映射
const cycleMap = {
  '周': 'week',
  '月': 'month',
  '学期': 'semester'
};
const cycleReverse = {
  'week': '周',
  'month': '月',
  'semester': '学期'
};

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.cycle && cycleReverse[result.cycle]) {
    result.cycle = cycleReverse[result.cycle];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为英文）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.cycle && cycleMap[result.cycle]) {
    result.cycle = cycleMap[result.cycle];
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 评比管理接口 ====================
export function getCompareMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/compare-mgmt/page', { params: convertedParams })
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

export function createCompareMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/compare-mgmt/create', convertedData).catch(err => {
    console.warn('发起接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateCompareMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/compare-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function scoreCompareMgmt(data) {
  // 打分接口不涉及 cycle 字段，无需转换
  return requestClient.put('/studentmgmt/compare-mgmt/score', data).catch(err => {
    console.warn('打分接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function awardCompareMgmt(data) {
  // 授予接口不涉及 cycle 字段，无需转换
  return requestClient.put('/studentmgmt/compare-mgmt/award', data).catch(err => {
    console.warn('授予接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportCompareMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/compare-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getCompareMgmtDetail(params) {
  return requestClient.get('/studentmgmt/compare-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// ==================== 图表接口 ====================
export function getCompareMgmtChart(params) {
  return requestClient.get('/studentmgmt/compare-mgmt/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      rankList: [
        { className: '高一(1)班', totalScore: 92.5, rankNo: 1 },
        { className: '高一(3)班', totalScore: 90.0, rankNo: 2 },
        { className: '高一(2)班', totalScore: 88.0, rankNo: 3 },
        { className: '高二(1)班', totalScore: 85.5, rankNo: 4 },
      ],
      statusCount: { scoringCount: 5, finishedCount: 15 },
      cycleCount: { weekCount: 8, monthCount: 10, termCount: 2 },
    });
  });
}

export function getCompareMgmtScoreRank(params) {
  return requestClient.get('/studentmgmt/compare-mgmt/chart/scoreRank', { params }).catch(err => {
    console.warn('得分排名接口失败，使用模拟数据', err);
    return Promise.resolve({
      classList: ['高一(1)班', '高一(2)班', '高一(3)班', '高二(1)班'],
      scoreList: [92.5, 88.0, 90.0, 85.5],
      rankList: [1, 3, 2, 4],
    });
  });
}

// 模拟数据（原始值使用中文，保持与前端一致）
export const getMockList = () => {
  return [
    {
      id: 1,
      className: '高一(1)班',
      cycle: '月',
      totalScore: 92.5,
      rankNo: 1,
      awardName: '文明班级',
      awardTime: 1767225600000,
      scoreUser: '张老师',
      status: '已汇总',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      className: '高一(2)班',
      cycle: '月',
      totalScore: 88.0,
      rankNo: 3,
      awardName: null,
      awardTime: null,
      scoreUser: null,
      status: '打分中',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 3,
      className: '高一(3)班',
      cycle: '月',
      totalScore: 90.0,
      rankNo: 2,
      awardName: '文明班级',
      awardTime: 1775088000000,
      scoreUser: '王老师',
      status: '已汇总',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775088000000,
      updateTime: 1775088000000,
    },
    {
      id: 4,
      className: '高二(1)班',
      cycle: '周',
      totalScore: 85.5,
      rankNo: 1,
      awardName: '优秀班级',
      awardTime: 1777680000000,
      scoreUser: '李老师',
      status: '已汇总',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1777680000000,
      updateTime: 1777680000000,
    },
    {
      id: 5,
      className: '高二(2)班',
      cycle: '周',
      totalScore: null,
      rankNo: null,
      awardName: null,
      awardTime: null,
      scoreUser: null,
      status: '打分中',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1780358400000,
      updateTime: 1780358400000,
    },
    {
      id: 6,
      className: '高三(1)班',
      cycle: '学期',
      totalScore: 94.0,
      rankNo: 1,
      awardName: '文明班级',
      awardTime: 1782950400000,
      scoreUser: '陈老师',
      status: '已汇总',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1782950400000,
      updateTime: 1782950400000,
    },
    {
      id: 7,
      className: '高三(2)班',
      cycle: '学期',
      totalScore: 82.0,
      rankNo: 2,
      awardName: null,
      awardTime: null,
      scoreUser: null,
      status: '打分中',
      remark: '',
      creator: 'teacher_wang',
      updater: 'teacher_wang',
      createTime: 1785628800000,
      updateTime: 1785628800000,
    },
  ];
};
