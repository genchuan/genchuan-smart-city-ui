import { requestClient } from '#/api/request';

// ==================== 学生信息接口 ====================
export function getStudentInfoPage(params) {
  return requestClient.get('/studentmgmt/student-info/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

export function createStudentInfo(data) {
  return requestClient.post('/studentmgmt/student-info/create', data).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateStudentInfo(data) {
  return requestClient.put('/studentmgmt/student-info/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function deleteStudentInfo(params) {
  return requestClient.delete('/studentmgmt/student-info/delete', { params }).catch(err => {
    console.warn('删除接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function deleteStudentInfoList(data) {
  return requestClient.delete('/studentmgmt/student-info/delete-list', { params: data }).catch(err => {
    console.warn('批量删除接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportStudentInfo(params) {
  return requestClient.download('/studentmgmt/student-info/export', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getStudentInfoDetail(params) {
  return requestClient.get('/studentmgmt/student-info/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = dataList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// ==================== 图表接口 ====================
export function getStudentInfoChart(params) {
  return requestClient.get('/studentmgmt/student-info/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalStudent: 1256,
      inSchoolStudent: 1220,
      suspendStudent: 15,
      transferStudent: 12,
      specialStudent: 9,
    });
  });
}

export function getStudentInfoDistribution(params) {
  return requestClient.get('/studentmgmt/student-info/chart/distributionCount', { params }).catch(err => {
    console.warn('分布统计接口失败，使用模拟数据', err);
    const mockDistribution = {
      grade: [
        { name: '2021级', count: 320 },
        { name: '2022级', count: 310 },
        { name: '2023级', count: 305 },
        { name: '2024级', count: 321 },
      ],
      major: [
        { name: '计算机科学与技术', count: 328 },
        { name: '软件工程', count: 286 },
        { name: '电子信息工程', count: 252 },
        { name: '网络工程', count: 215 },
        { name: '数据科学与大数据技术', count: 175 },
      ],
      class: [
        { name: '计算机1班', count: 45 },
        { name: '计算机2班', count: 42 },
        { name: '软件1班', count: 48 },
        { name: '软件2班', count: 50 },
        { name: '电子1班', count: 40 },
      ],
    };
    const dimension = params.dimension || 'grade';
    return Promise.resolve(mockDistribution[dimension] || []);
  });
}

export function getStudentInfoCoreIndex(params) {
  return requestClient.get('/studentmgmt/student-info/chart/coreIndex', { params }).catch(err => {
    console.warn('核心指标接口失败，使用模拟数据', err);
    return Promise.resolve([
      { date: '2025-01', newStudentCount: 45, transferCount: 2, suspendCount: 1 },
      { date: '2025-02', newStudentCount: 12, transferCount: 1, suspendCount: 0 },
      { date: '2025-03', newStudentCount: 8, transferCount: 3, suspendCount: 2 },
    ]);
  });
}

// 模拟数据（添加 grade 字段）
export const dataList = () => {
  return [
    {
      id: 1,
      studentNo: '20210001',
      name: '张三',
      idCard: '41010119900307663X',
      photo: '',
      grade: '2021级',        // 新增年级
      educationLevel: '本科',
      studyForm: '全日制',
      major: '计算机科学与技术',
      className: '计算机科学与技术1班',
      studentType: '普通生',
      status: '在籍',
      phone: '13800138001',
      parentPhone: '13800138000',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      studentNo: '20210002',
      name: '李四',
      idCard: '410101199003076631',
      photo: '',
      grade: '2021级',
      educationLevel: '本科',
      studyForm: '全日制',
      major: '软件工程',
      className: '软件工程1班',
      studentType: '普通生',
      status: '在籍',
      phone: '13800138002',
      parentPhone: '13800138001',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672617600000,
    },
    {
      id: 3,
      studentNo: '20210003',
      name: '王五',
      idCard: '410101199003076632',
      photo: '',
      grade: '2021级',
      educationLevel: '本科',
      studyForm: '非全日制',
      major: '计算机科学与技术',
      className: '计算机科学与技术2班',
      studentType: '特长生',
      status: '休学',
      phone: '13800138003',
      parentPhone: '13800138002',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672704000000,
    },
    {
      id: 4,
      studentNo: '20210004',
      name: '赵六',
      idCard: '410101199003076633',
      photo: '',
      grade: '2021级',
      educationLevel: '大专',
      studyForm: '函授',
      major: '电子信息工程',
      className: '电子信息工程1班',
      studentType: '转学生',
      status: '异动',
      phone: '13800138004',
      parentPhone: '13800138003',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672790400000,
    },
    {
      id: 5,
      studentNo: '20210005',
      name: '孙七',
      idCard: '410101199003076634',
      photo: '',
      grade: '2021级',
      educationLevel: '研究生',
      studyForm: '全日制',
      major: '数据科学与大数据技术',
      className: '大数据1班',
      studentType: '普通生',
      status: '在籍',
      phone: '13800138005',
      parentPhone: '13800138004',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672876800000,
    },
    {
      id: 6,
      studentNo: '20210006',
      name: '周八',
      idCard: '410101199003076635',
      photo: '',
      grade: '2021级',
      educationLevel: '本科',
      studyForm: '全日制',
      major: '软件工程',
      className: '软件工程2班',
      studentType: '特长生',
      status: '在籍',
      phone: '13800138006',
      parentPhone: '13800138005',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
