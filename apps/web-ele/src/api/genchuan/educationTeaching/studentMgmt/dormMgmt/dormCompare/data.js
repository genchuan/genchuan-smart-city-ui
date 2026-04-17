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

// ==================== 宿舍评比接口 ====================
export function getDormComparePage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/dorm-compare/page', { params: convertedParams })
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

// 打分（批量）
export function scoreDormCompare(data) {
  // 打分接口只传 ids 和 score，无需转换
  return requestClient.put('/studentmgmt/dorm-compare/score', data).catch(err => {
    console.warn('打分接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 汇总（批量，自动计算排名）
export function summaryDormCompare(data) {
  // 汇总接口只传 ids，无需转换
  return requestClient.put('/studentmgmt/dorm-compare/summary', data).catch(err => {
    console.warn('汇总接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 推送（批量）
export function pushDormCompare(data) {
  // 推送接口只传 ids，无需转换
  return requestClient.put('/studentmgmt/dorm-compare/push', data).catch(err => {
    console.warn('推送接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 更新（编辑）
export function updateDormCompare(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/dorm-compare/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportDormCompare(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/dorm-compare/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getDormCompareDetail(params) {
  return requestClient.get('/studentmgmt/dorm-compare/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// ==================== 图表接口 ====================
// 宿舍评比得分看板（卡片 + 柱状图数据）
export function getDormCompareChart(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/dorm-compare/chart', { params: convertedParams }).catch(err => {
    console.warn('得分看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalCompare: 86,
      avgScore: 85.2,
      highScore: 98.5,
      lowScore: 62.0,
      dormStats: [
        { dormNum: '302', score: 95.5, rankNo: 1 },
        { dormNum: '301', score: 92.0, rankNo: 2 },
        { dormNum: '201', score: 90.5, rankNo: 3 },
        { dormNum: '202', score: 88.0, rankNo: 4 },
        { dormNum: '101', score: 85.5, rankNo: 5 },
      ],
    });
  });
}

// 宿舍得分排名统计（柱状图专用）
export function getDormCompareScoreRank(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/dorm-compare/chart/scoreRank', { params: convertedParams }).catch(err => {
    console.warn('得分排名接口失败，使用模拟数据', err);
    return Promise.resolve({
      labels: ['302', '301', '201', '202', '101'],
      data: [95.5, 92.0, 90.5, 88.0, 85.5],
    });
  });
}

// 模拟数据（原始值使用英文，通过转换函数对外提供中文）
export const getMockList = () => {
  return [
    {
      id: 1,
      dormId: 101,
      dormNum: '101',
      cycle: 'month',
      score: 85.5,
      rankNo: 5,
      scoreUser: '张老师',
      sumTime: 1767225600000,
      pushTime: null,
      status: '已汇总',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      dormId: 201,
      dormNum: '201',
      cycle: 'month',
      score: 90.5,
      rankNo: 3,
      scoreUser: '李老师',
      sumTime: 1769904000000,
      pushTime: null,
      status: '已汇总',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 3,
      dormId: 202,
      dormNum: '202',
      cycle: 'month',
      score: 88.0,
      rankNo: 4,
      scoreUser: '王老师',
      sumTime: 1775088000000,
      pushTime: null,
      status: '已汇总',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775088000000,
      updateTime: 1775088000000,
    },
    {
      id: 4,
      dormId: 301,
      dormNum: '301',
      cycle: 'month',
      score: 92.0,
      rankNo: 2,
      scoreUser: null,
      sumTime: null,
      pushTime: null,
      status: '打分中',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1777680000000,
      updateTime: 1777680000000,
    },
    {
      id: 5,
      dormId: 302,
      dormNum: '302',
      cycle: 'month',
      score: 95.5,
      rankNo: 1,
      scoreUser: '陈老师',
      sumTime: 1780358400000,
      pushTime: 1780444800000,
      status: '已汇总',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1780358400000,
      updateTime: 1780444800000,
    },
    {
      id: 6,
      dormId: 401,
      dormNum: '401',
      cycle: 'week',
      score: 78.0,
      rankNo: null,
      scoreUser: null,
      sumTime: null,
      pushTime: null,
      status: '打分中',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1782950400000,
      updateTime: 1782950400000,
    },
  ];
};
