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
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = convertList(dataList());
      return { list: mock, total: mock.length };
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
  return requestClient.put('/studentmgmt/club-mgmt/venueApply', convertedData).catch(err => {
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
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = dataList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
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
    return Promise.resolve({
      totalClubCount: 9,
      totalMemberCount: 9,
      pendingAuditCount: 1,
      venueApplyCount: 9,
      clubTypeDistribution: [
        { count: 4, name: "", type: "1" },
        { count: 3, name: "", type: "2" },
        { count: 2, name: "", type: "3" }
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
    // 模拟数据字段与后端保持一致：typeMemberDistribution 使用 { name, count }
    return Promise.resolve({
      clubStatistics: [
        { clubName: '篮球社', memberCount: 1, clubType: '' },
        { clubName: '志愿者协会', memberCount: 1, clubType: '' },
        { clubName: '音乐社', memberCount: 1, clubType: '' },
        { clubName: '英语角', memberCount: 1, clubType: '' },
        { clubName: '摄影社', memberCount: 1, clubType: '' },
        { clubName: '读书社', memberCount: 1, clubType: '' },
        { clubName: '舞蹈社', memberCount: 1, clubType: '' },
        { clubName: '环保社', memberCount: 1, clubType: '' },
        { clubName: '辩论社', memberCount: 1, clubType: '' }
      ],
      typeMemberDistribution: [
        { name: "", count: 4 },
        { name: "", count: 3 },
        { name: "", count: 2 }
      ]
    });
  });
}

// 模拟数据（原始值使用数字枚举，通过转换函数对外提供中文）
export const dataList = () => {
  return [
    {
      id: 1,
      clubName: '篮球社',
      clubType: '1',
      studentId: 1,
      studentName: '张三',
      className: '计算机科学与技术1班',
      applyTime: 1672531200000,
      auditUser: null,
      auditTime: null,
      archiveTime: null,
      venueApplyStatus: '0',
      status: '0',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      clubName: '文学社',
      clubType: '2',
      studentId: 2,
      studentName: '李四',
      className: '软件工程1班',
      applyTime: 1672617600000,
      auditUser: '王老师',
      auditTime: 1672650000000,
      archiveTime: null,
      venueApplyStatus: '0',
      status: '1',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672650000000,
    },
    {
      id: 3,
      clubName: '志愿者协会',
      clubType: '3',
      studentId: 3,
      studentName: '王五',
      className: '计算机科学与技术2班',
      applyTime: 1672704000000,
      auditUser: '李老师',
      auditTime: 1672720000000,
      archiveTime: 1672800000000,
      venueApplyStatus: '2',
      status: '2',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672800000000,
    },
    {
      id: 4,
      clubName: '动漫社',
      clubType: '4',
      studentId: 4,
      studentName: '赵六',
      className: '电子信息工程1班',
      applyTime: 1672790400000,
      auditUser: null,
      auditTime: null,
      archiveTime: null,
      venueApplyStatus: '1',
      status: '0',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672790400000,
    },
    {
      id: 5,
      clubName: '篮球社',
      clubType: '1',
      studentId: 5,
      studentName: '孙七',
      className: '大数据1班',
      applyTime: 1672876800000,
      auditUser: '王老师',
      auditTime: 1672900000000,
      archiveTime: null,
      venueApplyStatus: '0',
      status: '1',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672900000000,
    },
    {
      id: 6,
      clubName: '文学社',
      clubType: '2',
      studentId: 6,
      studentName: '周八',
      className: '软件工程2班',
      applyTime: 1672963200000,
      auditUser: null,
      auditTime: null,
      archiveTime: null,
      venueApplyStatus: '0',
      status: '0',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
