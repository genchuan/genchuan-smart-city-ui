import { requestClient } from '#/api/request';

// ==================== 考评管理接口 ====================
export function getAssessMgmtPage(params) {
  return requestClient.get('/studentmgmt/assess-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

export function createAssessMgmt(data) {
  return requestClient.post('/studentmgmt/assess-mgmt/create', data).catch(err => {
    console.warn('录入接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateAssessMgmt(data) {
  return requestClient.put('/studentmgmt/assess-mgmt/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function publishAssessMgmt(data) {
  return requestClient.put('/studentmgmt/assess-mgmt/publish', data).catch(err => {
    console.warn('发布接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportAssessMgmt(params) {
  return requestClient.download('/studentmgmt/assess-mgmt/export', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getAssessMgmtDetail(params) {
  return requestClient.get('/studentmgmt/assess-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = dataList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// ==================== 图表接口 ====================
export function getAssessMgmtChart(params) {
  return requestClient.get('/studentmgmt/assess-mgmt/chart', { params }).catch(err => {
    console.warn('考评态势看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalCount: 12,
      avgScore: 89.50,
      topRankClass: '高一(1)班',
      assessTypeCount: {
        class_clean: 4,
        morning_exercise: 3,
        civil_class: 3,
        blackboard: 2,
      },
      statusCount: {
        un_publish: 2,
        published: 10,
      },
    });
  });
}

export function getDimensionScore(params) {
  return requestClient.get('/studentmgmt/assess-mgmt/chart/dimensionScore', { params }).catch(err => {
    console.warn('多维度得分统计接口失败，使用模拟数据', err);
    return Promise.resolve([
      {
        className: '高一(1)班',
        classCleanScore: 95.00,
        morningExerciseScore: 92.00,
        civilClassScore: 98.00,
        blackboardScore: 90.00,
        totalScore: 93.75,
      },
      {
        className: '高一(2)班',
        classCleanScore: 88.00,
        morningExerciseScore: 85.00,
        civilClassScore: 90.00,
        blackboardScore: 87.00,
        totalScore: 87.50,
      },
      {
        className: '高二(1)班',
        classCleanScore: 92.00,
        morningExerciseScore: 94.00,
        civilClassScore: 91.00,
        blackboardScore: 93.00,
        totalScore: 92.50,
      },
    ]);
  });
}

export function getCycleTrend(params) {
  return requestClient.get('/studentmgmt/assess-mgmt/chart/cycleTrend', { params }).catch(err => {
    console.warn('周期趋势统计接口失败，使用模拟数据', err);
    return Promise.resolve([
      { cycleName: '第1周', avgScore: 90.50, rank: 2 },
      { cycleName: '第2周', avgScore: 92.00, rank: 1 },
      { cycleName: '第3周', avgScore: 93.50, rank: 1 },
      { cycleName: '第4周', avgScore: 95.00, rank: 1 },
    ]);
  });
}

// 模拟数据（rank → classRank）
export const dataList = () => {
  return [
    {
      id: 1,
      className: '高一(1)班',
      assessType: '教室卫生',
      cycle: '周',
      score: 95.00,
      classRank: 1,           // 原 rank 改为 classRank
      assessUser: '张老师',
      publishTime: null,
      status: '未发布',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      className: '高一(2)班',
      assessType: '早操',
      cycle: '周',
      score: 88.00,
      classRank: 3,
      assessUser: '李老师',
      publishTime: 1672617600000,
      status: '已发布',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672617600000,
    },
    {
      id: 3,
      className: '高二(1)班',
      assessType: '文明班级',
      cycle: '月',
      score: 92.00,
      classRank: 2,
      assessUser: '王老师',
      publishTime: null,
      status: '未发布',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672704000000,
    },
    {
      id: 4,
      className: '高二(2)班',
      assessType: '黑板报',
      cycle: '月',
      score: 87.00,
      classRank: 4,
      assessUser: '赵老师',
      publishTime: 1672790400000,
      status: '已发布',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672790400000,
    },
    {
      id: 5,
      className: '高三(1)班',
      assessType: '教室卫生',
      cycle: '学期',
      score: 90.00,
      classRank: 2,
      assessUser: '孙老师',
      publishTime: 1672876800000,
      status: '已发布',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672876800000,
    },
    {
      id: 6,
      className: '高三(2)班',
      assessType: '早操',
      cycle: '学期',
      score: 85.00,
      classRank: 3,
      assessUser: '周老师',
      publishTime: null,
      status: '未发布',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
