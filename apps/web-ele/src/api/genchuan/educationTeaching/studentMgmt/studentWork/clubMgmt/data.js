// 文件1: data.js (API 接口定义与模拟数据)
import { requestClient } from '#/api/request';

// ==================== 社团管理接口 ====================
export function getClubMgmtPage(params) {
  return requestClient.get('/studentmgmt/club-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

export function createClubMgmt(data) {
  return requestClient.post('/studentmgmt/club-mgmt/create', data).catch(err => {
    console.warn('申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateClubMgmt(data) {
  return requestClient.put('/studentmgmt/club-mgmt/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function auditClubMgmt(data) {
  return requestClient.put('/studentmgmt/club-mgmt/audit', data).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function archiveClubMgmt(data) {
  return requestClient.put('/studentmgmt/club-mgmt/archive', data).catch(err => {
    console.warn('建档接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function venueApplyClubMgmt(data) {
  return requestClient.put('/studentmgmt/club-mgmt/venueApply', data).catch(err => {
    console.warn('场馆申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportClubMgmt(params) {
  return requestClient.download('/studentmgmt/club-mgmt/export', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getClubMgmtDetail(params) {
  return requestClient.get('/studentmgmt/club-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = dataList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// 获取学生选项（用于申请下拉框）
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
      totalClubCount: 28,
      totalMemberCount: 896,
      pendingAuditCount: 32,
      venueApplyCount: 126,
      clubTypeDistribution: [
        { name: '文体', value: 12 },
        { name: '学术', value: 8 },
        { name: '志愿', value: 5 },
        { name: '其他', value: 3 },
      ],
      monthlyApplyTrend: [
        { month: '09月', count: 256 },
        { month: '10月', count: 128 },
        { month: '11月', count: 86 },
      ],
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

// 模拟数据（与接口响应结构一致）
export const dataList = () => {
  return [
    {
      id: 1,
      clubName: '篮球社',
      clubType: '文体',
      studentId: 1,
      studentName: '张三',
      className: '计算机科学与技术1班',
      applyTime: 1672531200000,
      auditUser: null,
      auditTime: null,
      archiveTime: null,
      venueApplyStatus: '无',
      status: '待审核',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      clubName: '文学社',
      clubType: '学术',
      studentId: 2,
      studentName: '李四',
      className: '软件工程1班',
      applyTime: 1672617600000,
      auditUser: '王老师',
      auditTime: 1672650000000,
      archiveTime: null,
      venueApplyStatus: '无',
      status: '已通过',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672650000000,
    },
    {
      id: 3,
      clubName: '志愿者协会',
      clubType: '志愿',
      studentId: 3,
      studentName: '王五',
      className: '计算机科学与技术2班',
      applyTime: 1672704000000,
      auditUser: '李老师',
      auditTime: 1672720000000,
      archiveTime: 1672800000000,
      venueApplyStatus: '已通过',
      status: '已建档',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672800000000,
    },
    {
      id: 4,
      clubName: '动漫社',
      clubType: '其他',
      studentId: 4,
      studentName: '赵六',
      className: '电子信息工程1班',
      applyTime: 1672790400000,
      auditUser: null,
      auditTime: null,
      archiveTime: null,
      venueApplyStatus: '待申请',
      status: '待审核',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672790400000,
    },
    {
      id: 5,
      clubName: '篮球社',
      clubType: '文体',
      studentId: 5,
      studentName: '孙七',
      className: '大数据1班',
      applyTime: 1672876800000,
      auditUser: '王老师',
      auditTime: 1672900000000,
      archiveTime: null,
      venueApplyStatus: '无',
      status: '已通过',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672900000000,
    },
    {
      id: 6,
      clubName: '文学社',
      clubType: '学术',
      studentId: 6,
      studentName: '周八',
      className: '软件工程2班',
      applyTime: 1672963200000,
      auditUser: null,
      auditTime: null,
      archiveTime: null,
      venueApplyStatus: '无',
      status: '待审核',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
