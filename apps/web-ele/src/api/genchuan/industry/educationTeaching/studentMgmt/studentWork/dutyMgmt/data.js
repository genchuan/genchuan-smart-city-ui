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
  '待出车审批': 'pending_car',
  '已完成': 'completed'
};
const dutyStatusReverse = {
  'pending_checkin': '待打卡',
  'pending_transfer': '待调班审批',
  'pending_car': '待出车审批',
  'completed': '已完成'
};

// 调班状态映射
const transferStatusMap = {
  '无': 'none',
  '待审批': 'pending',
  '已通过': 'approved',
  '已驳回': 'rejected'
};
const transferStatusReverse = {
  'none': '无',
  'pending': '待审批',
  'approved': '已通过',
  'rejected': '已驳回'
};

// 出车状态映射
const carStatusMap = {
  '无': 'none',
  '待审批': 'pending',
  '已通过': 'approved'
};
const carStatusReverse = {
  'none': '无',
  'pending': '待审批',
  'approved': '已通过'
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
  // 调班状态转换
  if (result.transferStatus) {
    if (transferStatusReverse[result.transferStatus]) {
      result.transferStatus = transferStatusReverse[result.transferStatus];
    } else if (result.transferStatus === '待审批') {
      // 已经是中文，保持不变
      result.transferStatus = '待审批';
    }
  } else if (result.transferStatus === null || result.transferStatus === undefined) {
    result.transferStatus = '无';
  }
  // 出车状态转换
  if (result.carStatus) {
    if (carStatusReverse[result.carStatus]) {
      result.carStatus = carStatusReverse[result.carStatus];
    } else if (result.carStatus === '已通过') {
      // 已经是中文，保持不变
      result.carStatus = '已通过';
    }
  } else if (result.carStatus === null || result.carStatus === undefined) {
    result.carStatus = '无';
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
  if (result.transferStatus && transferStatusMap[result.transferStatus] !== undefined) {
    result.transferStatus = transferStatusMap[result.transferStatus];
  }
  if (result.carStatus && carStatusMap[result.carStatus] !== undefined) {
    result.carStatus = carStatusMap[result.carStatus];
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
      console.warn('分页接口失败', err);
      return { list: [], total: 0 };
    });
}

export function scheduleDutyMgmt(data) {
  const convertedData = convertZhToEn(data);
  if (convertedData.dutyDateList) {
    convertedData.dutyDate = convertedData.dutyDateList;
    delete convertedData.dutyDateList;
  }
  return requestClient.post('/studentmgmt/duty-mgmt/schedule', convertedData)
}

export function checkinDutyMgmt(data) {
  return requestClient.put('/studentmgmt/duty-mgmt/checkin', data)
}

export function shiftApplyDutyMgmt(data) {
  return requestClient.put('/studentmgmt/duty-mgmt/shiftApply', data)
}

export function vehicleApplyDutyMgmt(data) {
  return requestClient.put('/studentmgmt/duty-mgmt/vehicleApply', data)
}

export function shiftAuditDutyMgmt(data) {
  return requestClient.put('/studentmgmt/duty-mgmt/shiftAudit', data)
}

export function vehicleAuditDutyMgmt(data) {
  return requestClient.put('/studentmgmt/duty-mgmt/vehicleAudit', data)
}

export function uploadRecordDutyMgmt(data) {
  return requestClient.put('/studentmgmt/duty-mgmt/uploadRecord', data)
}

export function exportDutyMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/duty-mgmt/export-excel', convertedParams)
}

export function getDutyMgmtDetail(params) {
  return requestClient.get('/studentmgmt/duty-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      return Promise.reject(err);
    });
}

export function updateDutyMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/duty-mgmt/update', convertedData)
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
