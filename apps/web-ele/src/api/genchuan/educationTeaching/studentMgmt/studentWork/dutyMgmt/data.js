import { requestClient } from '#/api/request';

// ==================== 值班管理接口 ====================
export function getDutyMgmtPage(params) {
  return requestClient.get('/studentmgmt/duty-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

export function scheduleDutyMgmt(data) {
  return requestClient.post('/studentmgmt/duty-mgmt/schedule', data).catch(err => {
    console.warn('排班接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function checkinDutyMgmt(data) {
  return requestClient.put('/studentmgmt/duty-mgmt/checkin', data).catch(err => {
    console.warn('打卡接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function shiftApplyDutyMgmt(data) {
  return requestClient.post('/studentmgmt/duty-mgmt/shiftApply', data).catch(err => {
    console.warn('调班申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function vehicleApplyDutyMgmt(data) {
  return requestClient.post('/studentmgmt/duty-mgmt/vehicleApply', data).catch(err => {
    console.warn('出车申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function shiftAuditDutyMgmt(data) {
  return requestClient.put('/studentmgmt/duty-mgmt/shiftAudit', data).catch(err => {
    console.warn('调班审批接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function vehicleAuditDutyMgmt(data) {
  return requestClient.put('/studentmgmt/duty-mgmt/vehicleAudit', data).catch(err => {
    console.warn('出车审批接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function uploadRecordDutyMgmt(data) {
  return requestClient.put('/studentmgmt/duty-mgmt/uploadRecord', data).catch(err => {
    console.warn('上传记录接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportDutyMgmt(params) {
  return requestClient.download('/studentmgmt/duty-mgmt/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getDutyMgmtDetail(params) {
  return requestClient.get('/studentmgmt/duty-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = dataList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// ==================== 新增：编辑值班记录 ====================
export function updateDutyMgmt(data) {
  return requestClient.put('/studentmgmt/duty-mgmt/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 获取值班人选项（用于排班下拉框）
export function getUserOptions(params) {
  return requestClient.get('/system/user/options', { params }).catch(err => {
    console.warn('获取用户选项失败，使用模拟数据', err);
    return Promise.resolve([
      { label: '张三', value: '张三' },
      { label: '李四', value: '李四' },
      { label: '王五', value: '王五' },
      { label: '赵六', value: '赵六' },
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

// 模拟数据（与接口响应结构一致）
export const dataList = () => {
  return [
    {
      id: 1,
      dutyDate: '2025-03-25',
      dutyUser: '张三',
      checkInTime: null,
      checkInStatus: '未打卡',
      transferReason: null,
      transferUser: null,
      transferStatus: '无',
      carReason: null,
      carDestination: null,
      carStatus: '无',
      recordContent: null,
      recordUploadTime: null,
      status: '待打卡',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      dutyDate: '2025-03-25',
      dutyUser: '李四',
      checkInTime: 1672531200000,
      checkInStatus: '已打卡',
      transferReason: null,
      transferUser: null,
      transferStatus: '无',
      carReason: null,
      carDestination: null,
      carStatus: '无',
      recordContent: '正常值班，无异常',
      recordUploadTime: 1672531200000,
      status: '已完成',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 3,
      dutyDate: '2025-03-26',
      dutyUser: '王五',
      checkInTime: null,
      checkInStatus: '未打卡',
      transferReason: '家中有事',
      transferUser: '赵六',
      transferStatus: '待审批',
      carReason: null,
      carDestination: null,
      carStatus: '无',
      recordContent: null,
      recordUploadTime: null,
      status: '待调班审批',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 4,
      dutyDate: '2025-03-27',
      dutyUser: '赵六',
      checkInTime: null,
      checkInStatus: '未打卡',
      transferReason: null,
      transferUser: null,
      transferStatus: '无',
      carReason: '紧急维修',
      carDestination: '设备仓库',
      carStatus: '待审批',
      recordContent: null,
      recordUploadTime: null,
      status: '待出车审批',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 5,
      dutyDate: '2025-03-28',
      dutyUser: '张三',
      checkInTime: 1672531200000,
      checkInStatus: '已打卡',
      transferReason: null,
      transferUser: null,
      transferStatus: '无',
      carReason: null,
      carDestination: null,
      carStatus: '无',
      recordContent: '完成设备巡检',
      recordUploadTime: 1672531200000,
      status: '已完成',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 6,
      dutyDate: '2025-03-29',
      dutyUser: '李四',
      checkInTime: null,
      checkInStatus: '未打卡',
      transferReason: null,
      transferUser: null,
      transferStatus: '无',
      carReason: null,
      carDestination: null,
      carStatus: '无',
      recordContent: null,
      recordUploadTime: null,
      status: '待打卡',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
  ];
};
