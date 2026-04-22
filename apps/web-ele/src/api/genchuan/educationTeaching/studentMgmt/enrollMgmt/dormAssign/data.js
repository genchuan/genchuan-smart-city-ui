import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const statusMap = {
  '未分配': 'unassigned',
  '已分配': 'assigned'
};
const statusReverseMap = {
  'unassigned': '未分配',
  'assigned': '已分配'
};

// 响应数据：英文 → 中文
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.status && statusReverseMap[result.status]) {
    result.status = statusReverseMap[result.status];
  }
  return result;
}

// 请求参数：中文 → 英文
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  return result;
}

// 转换列表
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 宿舍分配接口 ====================

// 分页查询
export function getDormAssignPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/dorm-assign/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = convertList(getMockList());
      return { list: mock, total: mock.length };
    });
}

// 分配（批量）
export function assignDormAssign(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/dorm-assign/assign', convertedData).catch(err => {
    console.warn('分配接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 调整（批量）
export function adjustDormAssign(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/dorm-assign/adjust', convertedData).catch(err => {
    console.warn('调整接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑
export function updateDormAssign(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/dorm-assign/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportDormAssign(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/dorm-assign/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getDormAssignDetail(params) {
  return requestClient.get('/studentmgmt/dorm-assign/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// 新生宿舍分配看板（柱状图 + 卡片）
export function getDormAssignChart(params) {
  return requestClient.get('/studentmgmt/dorm-assign/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      waitAssignCount: 40,
      finishedCount: 280,
      totalCount: 320,
      progress: 87.5,
      buildingList: ['1号楼', '2号楼', '3号楼', '4号楼'],
      buildingAssignCountList: [80, 75, 65, 60],
      buildingBedCountList: [90, 80, 75, 75],
    });
  });
}

// 分配核心指标统计（卡片）
export function getDormAssignIndex(params) {
  return requestClient.get('/studentmgmt/dorm-assign/chart/assignIndex', { params }).catch(err => {
    console.warn('指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalStudentCount: 320,
      assignedCount: 280,
      assignRate: 87.5,
      emptyBedCount: 60,
    });
  });
}

// 模拟数据（原始值使用英文）
export const getMockList = () => {
  return [
    {
      id: 1,
      studentId: 1001,
      studentName: '张三',
      dormNum: '1号楼101',
      bedId: 101,
      bedName: '1号床',
      ruleContent: '按班级优先分配',
      assignTime: 1735689600000,
      adjustTime: 1738886400000,
      finishRate: 100.0,
      status: 'assigned',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1735603200000,
      updateTime: 1735689600000,
    },
    {
      id: 2,
      studentId: 1002,
      studentName: '',
      dormNum: null,
      bedId: null,
      bedName: null,
      ruleContent: '智能分配',
      assignTime: null,
      adjustTime: null,
      finishRate: 0,
      status: 'unassigned',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1735603200000,
      updateTime: 1735603200000,
    },
    {
      id: 3,
      studentId: 1003,
      studentName: '王五',
      dormNum: '2号楼205',
      bedId: 205,
      bedName: '5号床',
      ruleContent: '按性别分配',
      assignTime: 1738281600000,
      adjustTime: null,
      finishRate: 100.0,
      status: 'assigned',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1738195200000,
      updateTime: 1738281600000,
    },
    {
      id: 4,
      studentId: 1004,
      studentName: '',
      dormNum: null,
      bedId: null,
      bedName: null,
      ruleContent: '智能分配',
      assignTime: null,
      adjustTime: null,
      finishRate: 0,
      status: 'unassigned',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1738195200000,
      updateTime: 1738195200000,
    },
    {
      id: 5,
      studentId: 1005,
      studentName: '孙七',
      dormNum: '3号楼302',
      bedId: 302,
      bedName: '2号床',
      ruleContent: '同班级优先',
      assignTime: 1738886400000,
      adjustTime: null,
      finishRate: 100.0,
      status: 'assigned',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1738800000000,
      updateTime: 1738886400000,
    },
    {
      id: 6,
      studentId: 1006,
      studentName: '',
      dormNum: null,
      bedId: null,
      bedName: null,
      ruleContent: '随机分配',
      assignTime: null,
      adjustTime: null,
      finishRate: 0,
      status: 'unassigned',
      remark: '',
      creator: 'teacher_wang',
      updater: 'teacher_wang',
      createTime: 1738800000000,
      updateTime: 1738800000000,
    },
  ];
};
