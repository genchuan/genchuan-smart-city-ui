import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 报修类型映射
const repairTypeMap = {
  '水电': 'water_electricity',
  '家具': 'furniture',
  '其他': 'other'
};
const repairTypeReverse = {
  'water_electricity': '水电',
  'furniture': '家具',
  'other': '其他'
};

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.repairType && repairTypeReverse[result.repairType]) {
    result.repairType = repairTypeReverse[result.repairType];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为英文）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.repairType && repairTypeMap[result.repairType]) {
    result.repairType = repairTypeMap[result.repairType];
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 报修管理接口 ====================
export function getRepairMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/repair-mgmt/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = getMockList();
      return { list: convertList(mock), total: mock.length };
    });
}

// 申请报修
export function createRepairMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/repair-mgmt/create', convertedData).catch(err => {
    console.warn('申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 派单（批量）
export function assignRepairMgmt(data) {
  // 派单接口只传 ids 和 repairUser，无需转换
  return requestClient.put('/studentmgmt/repair-mgmt/assign', data).catch(err => {
    console.warn('派单接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 反馈（批量）
export function feedbackRepairMgmt(data) {
  // 反馈接口只传 ids 和 feedbackContent，无需转换
  return requestClient.put('/studentmgmt/repair-mgmt/feedback', data).catch(err => {
    console.warn('反馈接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 验收（单个）
export function acceptRepairMgmt(data) {
  // 验收接口只传 id，无需转换
  return requestClient.put('/studentmgmt/repair-mgmt/accept', data).catch(err => {
    console.warn('验收接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑报修
export function updateRepairMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/repair-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportRepairMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/repair-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getRepairMgmtDetail(params) {
  return requestClient.get('/studentmgmt/repair-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// 获取维修人列表（用于派单下拉框）
export function getRepairUserOptions(params) {
  return requestClient.get('/studentmgmt/repair-user/options', { params }).catch(err => {
    console.warn('获取维修人列表失败，使用模拟数据', err);
    return Promise.resolve([
      { value: '张师傅', label: '张师傅' },
      { value: '李师傅', label: '李师傅' },
      { value: '王师傅', label: '王师傅' },
    ]);
  });
}

// ==================== 图表接口 ====================
// 报修处置看板（卡片 + 折线图 + 类型分布）
export function getRepairMgmtChart(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/repair-mgmt/chart', { params: convertedParams }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalRepairCount: 86,
      pendingDispatchCount: 8,
      repairingCount: 5,
      repairedCount: 12,
      acceptedCount: 61,
      dailyTrend: [
        { date: '2025-03-25', count: 15 },
        { date: '2025-03-26', count: 18 },
        { date: '2025-03-27', count: 20 },
        { date: '2025-03-28', count: 16 },
        { date: '2025-03-29', count: 22 },
        { date: '2025-03-30', count: 21 },
        { date: '2025-03-31', count: 8 },
      ],
      typeDistribution: [
        { type: '水电', count: 52 },
        { type: '家具', count: 24 },
        { type: '其他', count: 10 },
      ],
    });
  });
}

// 报修类型 / 维修完成率统计（饼图用完成率数据）
export function getRepairMgmtCount(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/repair-mgmt/chart/repairCount', { params: convertedParams }).catch(err => {
    console.warn('统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      typeStatistics: [
        { type: '水电', total: 52, finished: 50, finishRate: 0.9615 },
        { type: '家具', total: 24, finished: 22, finishRate: 0.9167 },
        { type: '其他', total: 10, finished: 9, finishRate: 0.9 },
      ],
      buildingStatistics: [
        { building: '1号楼', total: 22, finished: 21, finishRate: 0.9545 },
        { building: '2号楼', total: 28, finished: 26, finishRate: 0.9286 },
        { building: '3号楼', total: 36, finished: 34, finishRate: 0.9444 },
      ],
    });
  });
}

// 模拟数据（原始值使用英文，通过转换函数对外提供中文）
export const getMockList = () => {
  return [
    {
      id: 1,
      dormNum: '101',
      repairType: 'water_electricity',
      applyTime: 1767225600000,
      dispatchUser: '张老师',
      dispatchTime: 1767312000000,
      repairUser: '张师傅',
      feedbackContent: '已修复水管漏水',
      feedbackTime: 1767398400000,
      checkUser: '李同学',
      checkTime: 1767484800000,
      status: '已维修',
      checkStatus: '已验收',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      dormNum: '102',
      repairType: 'furniture',
      applyTime: 1767225600000,
      dispatchUser: null,
      dispatchTime: null,
      repairUser: null,
      feedbackContent: null,
      feedbackTime: null,
      checkUser: null,
      checkTime: null,
      status: '待派单',
      checkStatus: '未验收',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 3,
      dormNum: '201',
      repairType: 'other',
      applyTime: 1769904000000,
      dispatchUser: '王老师',
      dispatchTime: 1769990400000,
      repairUser: '李师傅',
      feedbackContent: '已处理',
      feedbackTime: 1770076800000,
      checkUser: null,
      checkTime: null,
      status: '维修中',
      checkStatus: '未验收',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 4,
      dormNum: '202',
      repairType: 'water_electricity',
      applyTime: 1769904000000,
      dispatchUser: null,
      dispatchTime: null,
      repairUser: null,
      feedbackContent: null,
      feedbackTime: null,
      checkUser: null,
      checkTime: null,
      status: '待派单',
      checkStatus: '未验收',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 5,
      dormNum: '301',
      repairType: 'furniture',
      applyTime: 1775088000000,
      dispatchUser: '李老师',
      dispatchTime: 1775174400000,
      repairUser: '王师傅',
      feedbackContent: '维修完成',
      feedbackTime: 1775260800000,
      checkUser: '王同学',
      checkTime: 1775347200000,
      status: '已维修',
      checkStatus: '已验收',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775088000000,
      updateTime: 1775088000000,
    },
  ];
};
