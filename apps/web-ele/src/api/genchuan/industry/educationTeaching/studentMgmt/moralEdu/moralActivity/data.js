import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
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

const deptIdToName = {
  1001: '学生工作部',
  1002: '团委',
  1003: '教务处'
};

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

function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.activityType && activityTypeMap[result.activityType]) {
    result.activityType = activityTypeMap[result.activityType];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
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
      console.warn('分页接口失败', err);
      // 分页接口已联调成功，不再使用模拟数据，返回空列表
      return { list: [], total: 0 };
    });
}

export function createMoralActivity(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/moral-activity/create', convertedData)
}

export function updateMoralActivity(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/moral-activity/update', convertedData)
}

export function publishMoralActivity(ids) {
  return requestClient.put('/studentmgmt/moral-activity/publish', { ids })
}

export function joinMoralActivity(data) {
  const payload = {
    id: Number(data.id),
    studentId: Number(data.studentId)
  };
  return requestClient.put('/studentmgmt/moral-activity/join', payload);
}

export function recordMoralActivity(data) {
  return requestClient.put('/studentmgmt/moral-activity/record', data)
}

export function exportMoralActivity(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/moral-activity/export-excel', convertedParams)
}

export function getMoralActivityDetail(params) {
  return requestClient.get('/studentmgmt/moral-activity/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getMoralActivityChart(params) {
  return requestClient.get('/studentmgmt/moral-activity/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      statusCount: { ongoing: 3, ended: 5, unpublished: 2 },
      activityTypeCount: { party_league: 4, volunteer: 3, other: 3 },
      monthTrend: [
        { date: '2025-03', totalCount: 2 },
        { date: '2025-04', totalCount: 1 },
        { date: '2025-06', totalCount: 1 },
      ],
      joinTrend: [
        { date: '2025-03', totalCount: 1 },
        { date: '2025-04', totalCount: 1 },
        { date: '2025-05', totalCount: 1 },
      ],
    });
  });
}

export function getMoralActivityCount(params) {
  return requestClient.get('/studentmgmt/moral-activity/chart/activityCount', { params })
    .then(res => {
      if (res && res.typeList && Array.isArray(res.typeList)) {
        const typeMapping = {
          'party_league': '党团活动',
          'volunteer': '志愿活动',
          'other': '其他'
        };
        res.typeList = res.typeList.map(item => typeMapping[item] || item);
      }
      return res;
    })
    .catch(err => {
      console.warn('活动数量统计接口失败，使用模拟数据', err);
      return Promise.resolve({
        typeList: ['党团活动', '志愿活动', '其他'],
        activityCountList: [5, 7, 3],
        joinCountList: [200, 280, 50],
      });
    });
}
