import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const assessTypeMap = {
  '教室卫生': 'class_clean',
  '早操': 'morning_exercise',
  '文明班级': 'civilized_class',
  '黑板报': 'blackboard'
};
const assessTypeReverseMap = {
  'class_clean': '教室卫生',
  'morning_exercise': '早操',
  'civilized_class': '文明班级',
  'blackboard': '黑板报'
};

const cycleMap = {
  '周': 'week',
  '月': 'month',
  '学期': 'semester'
};
const cycleReverseMap = {
  'week': '周',
  'month': '月',
  'semester': '学期'
};

const statusMap = {
  '未发布': 'un_publish',
  '已发布': 'published'
};
const statusReverseMap = {
  'un_publish': '未发布',
  'published': '已发布'
};

// 通用转换函数：将对象中的英文字段值转为中文（用于响应数据）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.assessType && assessTypeReverseMap[result.assessType]) {
    result.assessType = assessTypeReverseMap[result.assessType];
  }
  if (result.cycle && cycleReverseMap[result.cycle]) {
    result.cycle = cycleReverseMap[result.cycle];
  }
  if (result.status && statusReverseMap[result.status]) {
    result.status = statusReverseMap[result.status];
  }
  return result;
}

// 通用转换函数：将对象中的中文字段值转为英文（用于请求参数）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.assessType && assessTypeMap[result.assessType]) {
    result.assessType = assessTypeMap[result.assessType];
  }
  if (result.cycle && cycleMap[result.cycle]) {
    result.cycle = cycleMap[result.cycle];
  }
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

// ==================== 考评管理接口 ====================
export function getAssessMgmtPage(params) {
  // 将查询参数中的中文字段转为英文
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/assess-mgmt/page', { params: convertedParams })
    .then(res => {
      // 响应数据转换：将 list 中的英文转为中文
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mockData = convertList(dataList()); // 模拟数据也转为中文
      return { list: mockData, total: mockData.length };
    });
}

export function createAssessMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/assess-mgmt/create', convertedData).catch(err => {
    console.warn('录入接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateAssessMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/assess-mgmt/update', convertedData).catch(err => {
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
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/assess-mgmt/export', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getAssessMgmtDetail(params) {
  return requestClient.get('/studentmgmt/assess-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = dataList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(convertEnToZh(detail));
  }).then(res => convertEnToZh(res));
}

// ==================== 图表接口 ====================
// 图表接口暂不处理映射，如有需要可类似添加
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

// 模拟数据（原始值使用英文，通过转换函数对外提供中文）
export const dataList = () => {
  return [
    {
      id: 1,
      className: '高一(1)班',
      assessType: 'class_clean',
      cycle: 'week',
      score: 95.00,
      rankNo: 1,
      assessUser: '张老师',
      publishTime: null,
      status: 'un_publish',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      className: '高一(2)班',
      assessType: 'morning_exercise',
      cycle: 'week',
      score: 88.00,
      rankNo: 3,
      assessUser: '李老师',
      publishTime: 1672617600000,
      status: 'published',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672617600000,
    },
    {
      id: 3,
      className: '高二(1)班',
      assessType: 'civilized_class',
      cycle: 'month',
      score: 92.00,
      rankNo: 2,
      assessUser: '王老师',
      publishTime: null,
      status: 'un_publish',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672704000000,
    },
    {
      id: 4,
      className: '高二(2)班',
      assessType: 'blackboard',
      cycle: 'month',
      score: 87.00,
      rankNo: 4,
      assessUser: '赵老师',
      publishTime: 1672790400000,
      status: 'published',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672790400000,
    },
    {
      id: 5,
      className: '高三(1)班',
      assessType: 'class_clean',
      cycle: 'semester',
      score: 90.00,
      rankNo: 2,
      assessUser: '孙老师',
      publishTime: 1672876800000,
      status: 'published',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672876800000,
    },
    {
      id: 6,
      className: '高三(2)班',
      assessType: 'morning_exercise',
      cycle: 'semester',
      score: 85.00,
      rankNo: 3,
      assessUser: '周老师',
      publishTime: null,
      status: 'un_publish',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
