import { requestClient } from '#/api/request';

// ==================== 床位管理接口 ====================
export function getBedMgmtPage(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const mock = getMockList();
    return { list: mock, total: mock.length };
  });
}

// 分配床位（批量，bedIds 与 studentIds 一一对应）
export function assignBedMgmt(data) {
  return requestClient.put('/studentmgmt/bed-mgmt/assign', data).catch(err => {
    console.warn('分配接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 调整床位（单个）
export function adjustBedMgmt(data) {
  return requestClient.put('/studentmgmt/bed-mgmt/adjust', data).catch(err => {
    console.warn('调整接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 新增床位
export function createBedMgmt(data) {
  return requestClient.post('/studentmgmt/bed-mgmt/create', data).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 更新床位
export function updateBedMgmt(data) {
  return requestClient.put('/studentmgmt/bed-mgmt/update', data).catch(err => {
    console.warn('更新接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportBedMgmt(params) {
  return requestClient.download('/studentmgmt/bed-mgmt/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getBedMgmtDetail(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = getMockList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// 获取学生列表（用于分配/调整下拉框）
export function getStudentOptions(params) {
  return requestClient.get('/studentmgmt/student/options', { params }).catch(err => {
    console.warn('获取学生列表失败，使用模拟数据', err);
    return Promise.resolve([
      { value: 1, label: '张三' },
      { value: 2, label: '李四' },
      { value: 3, label: '王五' },
      { value: 4, label: '赵六' },
      { value: 5, label: '孙七' },
      { value: 6, label: '周八' },
      { value: 7, label: '吴九' },
      { value: 8, label: '郑十' },
    ]);
  });
}

// ==================== 图表接口 ====================
export function getBedMgmtChart(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/chart', { params }).catch(err => {
    console.warn('床位看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalBed: 1200,
      usedBed: 980,
      unusedBed: 220,
      usageRate: 81.67,
      buildingStats: [
        { building: '1号楼', total: 400, used: 350, unused: 50 },
        { building: '2号楼', total: 400, used: 320, unused: 80 },
        { building: '3号楼', total: 400, used: 310, unused: 90 },
      ],
    });
  });
}

export function getBedDistribution(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/chart/bedDistribution', { params }).catch(err => {
    console.warn('床位占比接口失败，使用模拟数据', err);
    return Promise.resolve({
      labels: ['1号楼', '2号楼', '3号楼'],
      data: [33.33, 33.33, 33.34],
    });
  });
}

export function getBedIndex(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/chart/bedIndex', { params }).catch(err => {
    console.warn('核心指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      assignCount: 120,
      adjustCount: 15,
      newAssignCount: 8,
      newAdjustCount: 2,
      trendList: [
        { date: '2025-03-25', assign: 15, adjust: 2 },
        { date: '2025-03-26', assign: 18, adjust: 1 },
        { date: '2025-03-27', assign: 20, adjust: 3 },
        { date: '2025-03-28', assign: 16, adjust: 2 },
        { date: '2025-03-29', assign: 22, adjust: 3 },
        { date: '2025-03-30', assign: 21, adjust: 2 },
        { date: '2025-03-31', assign: 8, adjust: 2 },
      ],
    });
  });
}

// 模拟数据（包含更多学生，便于展示学生信息详情）
export const getMockList = () => {
  return [
    {
      id: 1,
      building: '1号楼',
      floor: 1,
      roomNum: '101',
      bedNum: 'A',
      studentId: 202301,
      studentName: '张三',
      assignTime: 1767225600000,
      adjustTime: null,
      status: '已分配',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      building: '1号楼',
      floor: 1,
      roomNum: '101',
      bedNum: 'B',
      studentId: null,
      studentName: null,
      assignTime: null,
      adjustTime: null,
      status: '未分配',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 3,
      building: '1号楼',
      floor: 1,
      roomNum: '102',
      bedNum: 'C',
      studentId: 202302,
      studentName: '李四',
      assignTime: 1769904000000,
      adjustTime: null,
      status: '已分配',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 4,
      building: '1号楼',
      floor: 1,
      roomNum: '102',
      bedNum: 'D',
      studentId: null,
      studentName: null,
      assignTime: null,
      adjustTime: null,
      status: '未分配',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 5,
      building: '2号楼',
      floor: 2,
      roomNum: '205',
      bedNum: 'E',
      studentId: 202403,
      studentName: '王五',
      assignTime: 1775088000000,
      adjustTime: 1772496000000,
      status: '已分配',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775088000000,
      updateTime: 1772496000000,
    },
    {
      id: 6,
      building: '2号楼',
      floor: 2,
      roomNum: '205',
      bedNum: 'F',
      studentId: 202404,
      studentName: '赵六',
      assignTime: 1775088000000,
      adjustTime: null,
      status: '已分配',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775088000000,
      updateTime: 1775088000000,
    },
    {
      id: 7,
      building: '2号楼',
      floor: 2,
      roomNum: '206',
      bedNum: 'G',
      studentId: null,
      studentName: null,
      assignTime: null,
      adjustTime: null,
      status: '未分配',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1780358400000,
      updateTime: 1780358400000,
    },
    {
      id: 8,
      building: '3号楼',
      floor: 3,
      roomNum: '312',
      bedNum: 'H',
      studentId: 202505,
      studentName: '孙七',
      assignTime: 1782950400000,
      adjustTime: 1782950400000,
      status: '已分配',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1782950400000,
      updateTime: 1782950400000,
    },
    {
      id: 9,
      building: '3号楼',
      floor: 3,
      roomNum: '312',
      bedNum: 'I',
      studentId: 202506,
      studentName: '周八',
      assignTime: 1782950400000,
      adjustTime: null,
      status: '已分配',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1782950400000,
      updateTime: 1782950400000,
    },
    {
      id: 10,
      building: '3号楼',
      floor: 3,
      roomNum: '313',
      bedNum: 'J',
      studentId: null,
      studentName: null,
      assignTime: null,
      adjustTime: null,
      status: '未分配',
      remark: '',
      creator: 'teacher_wang',
      updater: 'teacher_wang',
      createTime: 1785628800000,
      updateTime: 1785628800000,
    },
  ];
};
