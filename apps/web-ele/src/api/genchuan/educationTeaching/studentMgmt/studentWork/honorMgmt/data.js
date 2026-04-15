import { requestClient } from '#/api/request';

// ==================== 荣誉管理接口 ====================
export function getHonorMgmtPage(params) {
  return requestClient.get('/studentmgmt/honor-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

export function createHonorMgmt(data) {
  return requestClient.post('/studentmgmt/honor-mgmt/create', data).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateHonorMgmt(data) {
  return requestClient.put('/studentmgmt/honor-mgmt/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function auditHonorMgmt(data) {
  const idsParam = data.ids ? data.ids.join(',') : '';
  return requestClient.put('/studentmgmt/honor-mgmt/audit', null, { params: { ids: idsParam } }).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function pushHonorMgmt(data) {
  return requestClient.put('/studentmgmt/honor-mgmt/push', data).catch(err => {
    console.warn('推送接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportHonorMgmt(params) {
  return requestClient.download('/studentmgmt/honor-mgmt/export', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getHonorMgmtDetail(params) {
  return requestClient.get('/studentmgmt/honor-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = dataList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// ==================== 图表接口 ====================
export function getHonorMgmtChart(params) {
  return requestClient.get('/studentmgmt/honor-mgmt/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalHonor: 328,
      pendingAudit: 12,
      pushedHonor: 298,
      thisMonthNew: 28,
    });
  });
}

export function getHonorCount(params) {
  return requestClient.get('/studentmgmt/honor-mgmt/chart/honorCount', { params }).catch(err => {
    console.warn('荣誉数量统计接口失败，使用模拟数据', err);
    const mockData = {
      class: [
        { name: '计算机1班', count: 45 },
        { name: '计算机2班', count: 42 },
        { name: '软件1班', count: 48 },
        { name: '软件2班', count: 50 },
        { name: '电子1班', count: 40 },
      ],
      type: [
        { name: '优秀学生', count: 128 },
        { name: '奖学金', count: 86 },
        { name: '竞赛获奖', count: 92 },
        { name: '其他', count: 22 },
      ],
    };
    const dimension = params.dimension || 'class';
    return Promise.resolve(mockData[dimension] || []);
  });
}

// 模拟数据（与接口响应结构一致）
export const dataList = () => {
  return [
    {
      id: 1,
      studentId: 1,
      studentName: '张三',
      className: '计算机1班',
      honorType: '优秀学生',
      honorName: '校级优秀学生',
      getTime: 1672531200000,
      auditUser: 'admin',
      auditTime: 1672617600000,
      pushTime: null,
      status: '待审核',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      studentId: 2,
      studentName: '李四',
      className: '软件1班',
      honorType: '奖学金',
      honorName: '国家励志奖学金',
      getTime: 1672617600000,
      auditUser: 'admin',
      auditTime: 1672704000000,
      pushTime: 1672790400000,
      status: '已推送',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672790400000,
    },
    {
      id: 3,
      studentId: 3,
      studentName: '王五',
      className: '计算机2班',
      honorType: '竞赛获奖',
      honorName: '全国大学生数学竞赛一等奖',
      getTime: 1672704000000,
      auditUser: null,
      auditTime: null,
      pushTime: null,
      status: '待审核',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672704000000,
    },
    {
      id: 4,
      studentId: 4,
      studentName: '赵六',
      className: '电子1班',
      honorType: '其他',
      honorName: '优秀志愿者',
      getTime: 1672790400000,
      auditUser: 'admin',
      auditTime: 1672876800000,
      pushTime: 1672963200000,
      status: '已推送',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672963200000,
    },
    {
      id: 5,
      studentId: 5,
      studentName: '孙七',
      className: '大数据1班',
      honorType: '优秀学生',
      honorName: '院级优秀学生干部',
      getTime: 1672876800000,
      auditUser: 'admin',
      auditTime: 1672963200000,
      pushTime: null,
      status: '已通过',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672963200000,
    },
    {
      id: 6,
      studentId: 6,
      studentName: '周八',
      className: '软件2班',
      honorType: '奖学金',
      honorName: '校级一等奖学金',
      getTime: 1672963200000,
      auditUser: null,
      auditTime: null,
      pushTime: null,
      status: '待审核',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
