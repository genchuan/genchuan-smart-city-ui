import { requestClient } from '#/api/request';

// ==================== 学工首页接口 ====================
export function getWorkHomePage(params) {
  return requestClient.get('/studentmgmt/work-home/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

export function getWorkHomeChart(params) {
  return requestClient.get('/studentmgmt/work-home/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalStudent: 1256,
      totalHonor: 328,
      totalAssess: 452,
      totalViolate: 86,
      totalMental: 215,
      totalFund: 168,
      unhandledViolate: 12,
      unhandledWarn: 5,
    });
  });
}

export function getDimensionCount(params) {
  return requestClient.get('/studentmgmt/work-home/chart/dimensionCount', { params }).catch(err => {
    console.warn('维度分布接口失败，使用模拟数据', err);
    return Promise.resolve([
      { dimension: '荣誉', count: 328 },
      { dimension: '考评', count: 452 },
      { dimension: '违纪', count: 86 },
      { dimension: '行为', count: 512 },
      { dimension: '心理', count: 215 },
      { dimension: '资助', count: 168 },
    ]);
  });
}

export function getScoreAnalysis(params) {
  return requestClient.get('/studentmgmt/work-home/chart/scoreAnalysis', { params }).catch(err => {
    console.warn('评分分析接口失败，使用模拟数据', err);
    return Promise.resolve([
      {
        className: '计算机2022级1班',
        healthScore: 95.5,
        exerciseScore: 92.0,
        civilizedScore: 98.0,
        blackboardScore: 90.0,
        totalScore: 94.125,
      },
      {
        className: '计算机2022级2班',
        healthScore: 88.0,
        exerciseScore: 90.5,
        civilizedScore: 89.0,
        blackboardScore: 92.5,
        totalScore: 90.0,
      },
    ]);
  });
}

export function getCoreIndex(params) {
  return requestClient.get('/studentmgmt/work-home/chart/coreIndex', { params }).catch(err => {
    console.warn('核心指标接口失败，使用模拟数据', err);
    return Promise.resolve([
      { date: '2025-01-06', honorCount: 12, violateCount: 3, assessCount: 18 },
      { date: '2025-01-13', honorCount: 15, violateCount: 2, assessCount: 18 },
      { date: '2025-01-20', honorCount: 8, violateCount: 5, assessCount: 18 },
    ]);
  });
}

// 模拟动态记录数据（符合新的字段定义）
export const dataList = () => {
  return [
    {
      id: 1,
      recordType: '行为',
      recordTitle: '周八提交事假申请，已审批通过',
      studentName: '周八',
      className: '软件工程2班',
      creator: '辅导员',
      createTime: 1672963200000,
    },
    {
      id: 2,
      recordType: '资助',
      recordTitle: '孙七获得国家助学金申请通过',
      studentName: '孙七',
      className: '大数据1班',
      creator: '资助中心',
      createTime: 1672876800000,
    },
    {
      id: 3,
      recordType: '考评',
      recordTitle: '电子信息工程1班获得文明班级称号',
      studentName: '',
      className: '电子信息工程1班',
      creator: '学生处',
      createTime: 1672790400000,
    },
    {
      id: 4,
      recordType: '心理',
      recordTitle: '王五完成心理评估，状态正常',
      studentName: '王五',
      className: '计算机科学与技术2班',
      creator: '心理老师',
      createTime: 1672704000000,
    },
    {
      id: 5,
      recordType: '违纪',
      recordTitle: '李四上课玩手机，给予警告处分',
      studentName: '李四',
      className: '软件工程1班',
      creator: '教务处',
      createTime: 1672617600000,
    },
    {
      id: 6,
      recordType: '荣誉',
      recordTitle: '张三获得校级优秀学生称号',
      studentName: '张三',
      className: '计算机科学与技术1班',
      creator: '辅导员',
      createTime: 1672531200000,
    },
  ];
};
