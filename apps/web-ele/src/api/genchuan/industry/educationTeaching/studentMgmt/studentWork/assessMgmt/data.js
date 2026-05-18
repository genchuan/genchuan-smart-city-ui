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
  'published': '已发布',
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
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/assess-mgmt/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败', err);
      // 分页接口已联调成功，不再使用模拟数据，返回空列表
      return { list: [], total: 0 };
    });
}

export function createAssessMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/assess-mgmt/create', convertedData)
}

export function updateAssessMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/assess-mgmt/update', convertedData)
}

export function publishAssessMgmt(data) {
  return requestClient.put('/studentmgmt/assess-mgmt/publish', data)
}

export function exportAssessMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/assess-mgmt/export', convertedParams)
}

export function getAssessMgmtDetail(params) {
  return requestClient.get('/studentmgmt/assess-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
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
      { cycleName: '第1周', avgScore: 90.50, rankNo: 2 },
      { cycleName: '第2周', avgScore: 92.00, rankNo: 1 },
      { cycleName: '第3周', avgScore: 93.50, rankNo: 1 },
      { cycleName: '第4周', avgScore: 95.00, rankNo: 1 },
    ]);
  });
}
