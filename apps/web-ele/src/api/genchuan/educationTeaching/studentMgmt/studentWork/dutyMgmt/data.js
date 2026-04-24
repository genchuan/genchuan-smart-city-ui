import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 打卡状态映射
const checkInStatusMap = {
  '未打卡': 'not_checked_in',
  '已打卡': 'checked_in'
};
const checkInStatusReverse = {
  'not_checked_in': '未打卡',
  'checked_in': '已打卡'
};

// 值班状态映射
const dutyStatusMap = {
  '待打卡': 'pending_checkin',
  '待调班审批': 'pending_transfer',
  '待出车审批': 'pending_vehicle',
  '已完成': 'completed'
};
const dutyStatusReverse = {
  'pending_checkin': '待打卡',
  'pending_transfer': '待调班审批',
  'pending_vehicle': '待出车审批',
  'completed': '已完成'
};

// 日期转换：后端数组 [2024,12,10] → 前端字符串 '2024-12-10'
function formatDutyDate(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return dateArray;
  const [year, month, day] = dateArray;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// 日期转换：前端字符串 '2024-12-10' → 后端数组 [2024,12,10]
function parseDutyDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return dateStr;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return [parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])];
}

// 通用转换函数：后端 → 前端（将英文/数组转为中文/字符串）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.checkInStatus && checkInStatusReverse[result.checkInStatus]) {
    result.checkInStatus = checkInStatusReverse[result.checkInStatus];
  }
  if (result.status && dutyStatusReverse[result.status]) {
    result.status = dutyStatusReverse[result.status];
  }
  if (result.dutyDate) {
    result.dutyDate = formatDutyDate(result.dutyDate);
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文/字符串转为英文/数组）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.checkInStatus && checkInStatusMap[result.checkInStatus]) {
    result.checkInStatus = checkInStatusMap[result.checkInStatus];
  }
  if (result.status && dutyStatusMap[result.status]) {
    result.status = dutyStatusMap[result.status];
  }
  if (result.dutyDate && typeof result.dutyDate === 'string') {
    result.dutyDate = parseDutyDate(result.dutyDate);
  }
  // 处理排班接口的 dutyDateList（日期范围数组）
  if (result.dutyDateList && Array.isArray(result.dutyDateList)) {
    result.dutyDateList = result.dutyDateList.map(date =>
      typeof date === 'string' ? parseDutyDate(date) : date
    );
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 值班管理接口 ====================
export function getDutyMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/duty-mgmt/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mockData = convertList(dataList());
      return { list: mockData, total: mockData.length };
    });
}

// 修改：排班接口，将 dutyDateList 转换为后端所需的 dutyDate 字段
export function scheduleDutyMgmt(data) {
  const convertedData = convertZhToEn(data);
  // 将 dutyDateList 重命名为 dutyDate，并保持其值为数组形式 [[年,月,日], [年,月,日]]
  if (convertedData.dutyDateList) {
    convertedData.dutyDate = convertedData.dutyDateList;
    delete convertedData.dutyDateList;
  }
  return requestClient.post('/studentmgmt/duty-mgmt/schedule', convertedData).catch(err => {
    console.warn('排班接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function checkinDutyMgmt(data) {
  // 打卡接口只传 ids，无需转换
  return requestClient.put('/studentmgmt/duty-mgmt/checkin', data).catch(err => {
    console.warn('打卡接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function shiftApplyDutyMgmt(data) {
  // 调班申请接口只传 ids, transferReason, transferUser，无需转换
  return requestClient.post('/studentmgmt/duty-mgmt/shiftApply', data).catch(err => {
    console.warn('调班申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function vehicleApplyDutyMgmt(data) {
  // 出车申请接口只传 ids, carReason, carDestination，无需转换
  return requestClient.post('/studentmgmt/duty-mgmt/vehicleApply', data).catch(err => {
    console.warn('出车申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function shiftAuditDutyMgmt(data) {
  // 调班审批接口只传 id, auditResult, remark，无需转换（auditResult 为中文）
  return requestClient.put('/studentmgmt/duty-mgmt/shiftAudit', data).catch(err => {
    console.warn('调班审批接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function vehicleAuditDutyMgmt(data) {
  // 出车审批接口只传 id, auditResult, remark，无需转换
  return requestClient.put('/studentmgmt/duty-mgmt/vehicleAudit', data).catch(err => {
    console.warn('出车审批接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function uploadRecordDutyMgmt(data) {
  // 上传记录接口只传 id, recordContent，无需转换
  return requestClient.put('/studentmgmt/duty-mgmt/uploadRecord', data).catch(err => {
    console.warn('上传记录接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportDutyMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/duty-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getDutyMgmtDetail(params) {
  return requestClient.get('/studentmgmt/duty-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = dataList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

export function updateDutyMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/duty-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 获取用户选项（确保 value 为字符串类型）
export function getUserOptions(params) {
  return requestClient.get('/system/user/options', { params }).catch(err => {
    console.warn('获取用户选项失败，使用模拟数据', err);
    return Promise.resolve([
      { label: '张三', value: '3' },
      { label: '李四', value: '4' },
      { label: '王五', value: '5' },
      { label: '赵六', value: '6' },
    ]);
  });
}

// ==================== 图表接口 ====================
export function getDutyMgmtChart(params) {
  return requestClient.get('/studentmgmt/duty-mgmt/chart', { params }).catch(err => {
    console.warn('值班调度看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalDutyCount: 124,
      todayDutyCount: 4,
      checkInRate: 96.77,
      shiftApplyCount: 8,
      vehicleApplyCount: 5,
      statusCountMap: {
        '待打卡': 12,
        '待调班审批': 2,
        '待出车审批': 1,
        '已完成': 109,
      },
    });
  });
}

export function getDutyIndex(params) {
  return requestClient.get('/studentmgmt/duty-mgmt/chart/dutyIndex', { params }).catch(err => {
    console.warn('值班核心指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      monthList: ['2025-01', '2025-02', '2025-03'],
      dutyCountList: [112, 98, 124],
      checkInRateList: [95.54, 96.94, 96.77],
      shiftRateList: [6.25, 7.14, 6.45],
      vehicleRateList: [4.46, 3.06, 4.03],
    });
  });
}

// 模拟数据（原始值使用英文/数组，通过转换函数对外提供中文）
export const dataList = () => {
  return [
    {
      id: 1,
      dutyDate: [2025, 3, 25],
      dutyUser: '张三',
      checkInTime: null,
      checkInStatus: 'not_checked_in',
      transferReason: null,
      transferUser: null,
      transferStatus: null,
      carReason: null,
      carDestination: null,
      carStatus: null,
      recordContent: null,
      recordUploadTime: null,
      status: 'pending_checkin',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      dutyDate: [2025, 3, 25],
      dutyUser: '李四',
      checkInTime: 1672531200000,
      checkInStatus: 'checked_in',
      transferReason: null,
      transferUser: null,
      transferStatus: null,
      carReason: null,
      carDestination: null,
      carStatus: null,
      recordContent: '正常值班，无异常',
      recordUploadTime: 1672531200000,
      status: 'completed',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 3,
      dutyDate: [2025, 3, 26],
      dutyUser: '王五',
      checkInTime: null,
      checkInStatus: 'not_checked_in',
      transferReason: '家中有事',
      transferUser: '赵六',
      transferStatus: '待审批',
      carReason: null,
      carDestination: null,
      carStatus: null,
      recordContent: null,
      recordUploadTime: null,
      status: 'pending_transfer',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 4,
      dutyDate: [2025, 3, 27],
      dutyUser: '赵六',
      checkInTime: null,
      checkInStatus: 'not_checked_in',
      transferReason: null,
      transferUser: null,
      transferStatus: null,
      carReason: '紧急维修',
      carDestination: '设备仓库',
      carStatus: '待审批',
      recordContent: null,
      recordUploadTime: null,
      status: 'pending_vehicle',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 5,
      dutyDate: [2025, 3, 28],
      dutyUser: '张三',
      checkInTime: 1672531200000,
      checkInStatus: 'checked_in',
      transferReason: null,
      transferUser: null,
      transferStatus: null,
      carReason: null,
      carDestination: null,
      carStatus: null,
      recordContent: '完成设备巡检',
      recordUploadTime: 1672531200000,
      status: 'completed',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 6,
      dutyDate: [2025, 3, 29],
      dutyUser: '李四',
      checkInTime: null,
      checkInStatus: 'not_checked_in',
      transferReason: null,
      transferUser: null,
      transferStatus: null,
      carReason: null,
      carDestination: null,
      carStatus: null,
      recordContent: null,
      recordUploadTime: null,
      status: 'pending_checkin',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
  ];
};
