import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const clubTypeMap = {
  '文体': '1',
  '学术': '2',
  '志愿': '3',
  '其他': '4'
};
const clubTypeReverseMap = {
  '1': '文体',
  '2': '学术',
  '3': '志愿',
  '4': '其他'
};

const venueStatusMap = {
  '无': '0',
  '待申请': '1',
  '已通过': '2'
};
const venueStatusReverseMap = {
  '0': '无',
  '1': '待申请',
  '2': '已通过'
};

const statusMap = {
  '待审核': '0',
  '已通过': '1',
  '已建档': '2'
};
const statusReverseMap = {
  '0': '待审核',
  '1': '已通过',
  '2': '已建档'
};

function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.clubType && clubTypeReverseMap[result.clubType]) {
    result.clubType = clubTypeReverseMap[result.clubType];
  }
  if (result.venueApplyStatus && venueStatusReverseMap[result.venueApplyStatus]) {
    result.venueApplyStatus = venueStatusReverseMap[result.venueApplyStatus];
  }
  if (result.status && statusReverseMap[result.status]) {
    result.status = statusReverseMap[result.status];
  }
  return result;
}

function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.clubType && clubTypeMap[result.clubType]) {
    result.clubType = clubTypeMap[result.clubType];
  }
  if (result.venueApplyStatus && venueStatusMap[result.venueApplyStatus]) {
    result.venueApplyStatus = venueStatusMap[result.venueApplyStatus];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  return result;
}

function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 社团管理接口 ====================
export function getClubMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/club-mgmt/page', { params: convertedParams })
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

export function createClubMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/club-mgmt/create', convertedData).catch(err => {
    console.warn('申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateClubMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/club-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function auditClubMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/club-mgmt/audit', convertedData).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function archiveClubMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/club-mgmt/archive', convertedData).catch(err => {
    console.warn('建档接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function venueApplyClubMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/club-mgmt/venueApply', null, { params: convertedData }).catch(err => {
    console.warn('场馆申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportClubMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/club-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getClubMgmtDetail(params) {
  return requestClient.get('/studentmgmt/club-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

export function getStudentOptions(params) {
  return requestClient.get('/studentmgmt/student/options', { params }).catch(err => {
    console.warn('获取学生选项失败，使用模拟数据', err);
    return Promise.resolve([
      { label: '张三', value: 1 },
      { label: '李四', value: 2 },
      { label: '王五', value: 3 },
      { label: '赵六', value: 4 },
      { label: '孙七', value: 5 },
      { label: '周八', value: 6 },
    ]);
  });
}

// ==================== 图表接口 ====================
export function getClubMgmtChart(params) {
  return requestClient.get('/studentmgmt/club-mgmt/chart', { params }).catch(err => {
    console.warn('社团运营看板接口失败，使用模拟数据', err);
    // 模拟数据字段与后端保持一致
    return Promise.resolve({
      totalClubCount: 9,
      totalMemberCount: 9,
      pendingAuditCount: 1,
      venueApplyCount: 9,
      clubTypeDistribution: [
        {count: 4, name: "文体", type: "1"},
        {count: 3, name: "学术", type: "2"},
        {count: 2, name: "志愿", type: "3"}
      ],
      monthlyApplyTrend: [
        { month: "2024-09", count: 7 },
        { month: "2026-04", count: 2 }
      ]
    });
  });
}

export function getClubDistribution(params) {
  return requestClient.get('/studentmgmt/club-mgmt/chart/clubDistribution', { params }).catch(err => {
    console.warn('社团分布统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      clubStatistics: [
        { clubName: '篮球社', memberCount: 68, clubType: '文体' },
        { clubName: '文学社', memberCount: 42, clubType: '学术' },
        { clubName: '志愿者协会', memberCount: 86, clubType: '志愿' },
        { clubName: '动漫社', memberCount: 35, clubType: '其他' },
      ],
      typeMemberDistribution: [
        { name: '文体', value: 426 },
        { name: '学术', value: 235 },
        { name: '志愿', value: 189 },
        { name: '其他', value: 46 },
      ],
    });
  });
}
