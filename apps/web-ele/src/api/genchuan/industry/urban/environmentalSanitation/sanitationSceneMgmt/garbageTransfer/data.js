import { baseRequestClient, requestClient } from '#/api/request';
import { useAccessStore } from '@vben/stores';

// 分页查询（全部）
export function getGarbageTransferPage(params) {
  return requestClient.get('/envirhealth/garbage-transfer/detail-page', { params });
}

// 新增
export function createGarbageTransfer(data) {
  return requestClient.post('/envirhealth/garbage-transfer/create', data);
}

// 修改
export function updateGarbageTransfer(data) {
  return requestClient.put('/envirhealth/garbage-transfer/update', data);
}

// 单个删除
export function deleteGarbageTransfer(id) {
  return requestClient.delete(`/envirhealth/garbage-transfer/delete?id=${id}`);
}

// 导出 Excel
export function exportGarbageTransferExcel(params) {
  const accessStore = useAccessStore(); // 根据需要引入token
  return baseRequestClient.get('/envirhealth/garbage-transfer/export-excel', {
    params,
    responseType: 'blob',
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

// 获取车辆待进站详情
export function getTransferReserveDetail(params) {
  return requestClient.get('/envirhealth/transfer-reserve/detail-page', { params });
}

// 获取作业进行中/已完成/已归档详情
export function getTransferOperationDetail(params) {
  return requestClient.get('/envirhealth/transfer-operation/detail-page', { params });
}

// 获取预警待处理详情
export function getTransferAlarmDetail(params) {
  return requestClient.get('/envirhealth/transfer-alarm/detail-page', { params });
}

// 获取设备待维护详情
export function getTransferMaintenanceDetail(params) {
  return requestClient.get('/envirhealth/transfer-maintenance/detail-page', { params });
}

// 获取垃圾转运站统计数据
export function getGarbageTransferChartDashboard() {
  return requestClient.get('/envirhealth/garbage-transfer/chart/dashboard');
}

// 模拟垃圾转运站运营管理数据
export const dataList = () => {
  return [
    // ---------- 全部状态（转运站基础信息）id1-id3 ----------
    {
      id: '1',
      toiletName: '城东转运站',
      location: '城东路88号',
      area: '芗城区-巷口街道',
      openHours: '06:00-22:00',
      stallCount: 2, // 压缩机数量
      status: '正常运营',
      manager: '张三',
      // 全部状态特有字段
      dailyTransferVolume: 120.5,
      equipmentRate: 98.2,
      environmentRate: 96.5,
      unhandledAlarmCount: 1,
      pendingMaintenanceCount: 2,
      // 核心设备（逗号分隔）
      coreEquipment: '压缩机A,压缩机B,除臭设备',
    },
    {
      id: '2',
      toiletName: '城西转运站',
      location: '城西路256号',
      area: '龙文区-碧湖街道',
      openHours: '05:30-23:30',
      stallCount: 3,
      status: '正常运营',
      manager: '李华',
      dailyTransferVolume: 200.0,
      equipmentRate: 99.1,
      environmentRate: 97.8,
      unhandledAlarmCount: 0,
      pendingMaintenanceCount: 1,
      coreEquipment: '压缩机C,压缩机D,喷淋除臭,地磅',
    },
    {
      id: '3',
      toiletName: '城南转运站',
      location: '城南路12号',
      area: '龙海区-石码镇',
      openHours: '00:00-24:00',
      stallCount: 4,
      status: '部分停机',
      manager: '王强',
      dailyTransferVolume: 85.0,
      equipmentRate: 85.5,
      environmentRate: 90.2,
      unhandledAlarmCount: 3,
      pendingMaintenanceCount: 4,
      coreEquipment: '压缩机E,风机,除尘器',
    },

    // ---------- 车辆待进站 id4-id6 ----------
    {
      id: '4',
      toiletName: '城东转运站',
      location: '城东路88号',
      area: '芗城区-巷口街道',
      openHours: '06:00-22:00',
      status: '车辆待进站',
      manager: '张三',
      // 车辆待进站特有字段
      reserveId: 'RES20250301001',
      licensePlate: '闽E12345',
      garbageType: '其他垃圾',
      expectedTime: '2026-03-01 09:30:00',
      garbageWeight: 8.2,
      reserveStatus: '待排序',
      sortNo: null,
      createTime: '2026-02-28 14:20:00',
      handler: null,
    },
    {
      id: '5',
      toiletName: '城西转运站',
      location: '城西路256号',
      area: '龙文区-碧湖街道',
      openHours: '05:30-23:30',
      status: '车辆待进站',
      manager: '李华',
      reserveId: 'RES20250301002',
      licensePlate: '闽E67890',
      garbageType: '厨余垃圾',
      expectedTime: '2026-03-01 10:15:00',
      garbageWeight: 5.0,
      reserveStatus: '已排序',
      sortNo: 3,
      createTime: '2026-02-28 15:10:00',
      handler: '调度员A',
    },
    {
      id: '6',
      toiletName: '城南转运站',
      location: '城南路12号',
      area: '龙海区-石码镇',
      openHours: '00:00-24:00',
      status: '车辆待进站',
      manager: '王强',
      reserveId: 'RES20250301003',
      licensePlate: '闽E24680',
      garbageType: '可回收物',
      expectedTime: '2026-03-01 11:00:00',
      garbageWeight: 3.5,
      reserveStatus: '待排序',
      sortNo: null,
      createTime: '2026-02-28 16:30:00',
      handler: null,
    },

    // ---------- 作业进行中 id7-id9 ----------
    {
      id: '7',
      toiletName: '城东转运站',
      location: '城东路88号',
      area: '芗城区-巷口街道',
      openHours: '06:00-22:00',
      status: '作业进行中',
      manager: '张三',
      // 作业进行中特有字段
      operationId: 'OP20250301001',
      licensePlate: '闽E12345',
      garbageType: '其他垃圾',
      entryTime: '2026-03-01 09:35:00',
      garbageWeight: 8.2,
      relatedPoints: '城东收集点A,城东收集点B',
      equipmentStatus: '{"compressor":"运行","deodorizer":"运行"}',
      environmentData: '{"temperature":22.5,"humidity":65,"odor":120}',
      progress: 65,
      destination: '焚烧厂',
      isAbnormal: false,
    },
    {
      id: '8',
      toiletName: '城西转运站',
      location: '城西路256号',
      area: '龙文区-碧湖街道',
      openHours: '05:30-23:30',
      status: '作业进行中',
      manager: '李华',
      operationId: 'OP20250301002',
      licensePlate: '闽E67890',
      garbageType: '厨余垃圾',
      entryTime: '2026-03-01 10:20:00',
      garbageWeight: 5.0,
      relatedPoints: '城西收集点C',
      equipmentStatus: '{"compressor":"运行","scale":"运行"}',
      environmentData: '{"temperature":21.0,"humidity":70,"odor":150}',
      progress: 30,
      destination: '厨余处理厂',
      isAbnormal: false,
    },
    {
      id: '9',
      toiletName: '城南转运站',
      location: '城南路12号',
      area: '龙海区-石码镇',
      openHours: '00:00-24:00',
      status: '作业进行中',
      manager: '王强',
      operationId: 'OP20250301003',
      licensePlate: '闽E13579',
      garbageType: '其他垃圾',
      entryTime: '2026-03-01 08:50:00',
      garbageWeight: 10.0,
      relatedPoints: '城南收集点D,城南收集点E',
      equipmentStatus: '{"compressor":"故障","fan":"运行"}',
      environmentData: '{"temperature":23.0,"humidity":68,"odor":300}',
      progress: 80,
      destination: '焚烧厂',
      isAbnormal: true,
    },

    // ---------- 预警待处理 id10-id12 ----------
    {
      id: '10',
      toiletName: '城东转运站',
      location: '城东路88号',
      area: '芗城区-巷口街道',
      openHours: '06:00-22:00',
      status: '预警待处理',
      manager: '张三',
      // 预警待处理特有字段
      alarmId: 'ALM20250301001',
      transferName: '城东转运站',
      alarmType: '设备故障',
      alarmTime: '2026-03-01 08:15:00',
      alarmContent: '压缩机A过载停机',
      relevantInfo: '压缩机A',
      handleStatus: '待处置',
      handler: null,
      isTimeout: false,
      handleProgress: 0,
    },
    {
      id: '11',
      toiletName: '城西转运站',
      location: '城西路256号',
      area: '龙文区-碧湖街道',
      openHours: '05:30-23:30',
      status: '预警待处理',
      manager: '李华',
      alarmId: 'ALM20250301002',
      transferName: '城西转运站',
      alarmType: '环境超标',
      alarmTime: '2026-03-01 09:00:00',
      alarmContent: '异味浓度超阈值',
      relevantInfo: '除臭区',
      handleStatus: '处理中',
      handler: '赵工',
      isTimeout: false,
      handleProgress: 50,
    },
    {
      id: '12',
      toiletName: '城南转运站',
      location: '城南路12号',
      area: '龙海区-石码镇',
      openHours: '00:00-24:00',
      status: '预警待处理',
      manager: '王强',
      alarmId: 'ALM20250301003',
      transferName: '城南转运站',
      alarmType: '物资短缺',
      alarmTime: '2026-02-28 23:50:00',
      alarmContent: '消毒液库存不足',
      relevantInfo: '仓库',
      handleStatus: '待处置',
      handler: null,
      isTimeout: true,
      handleProgress: 0,
    },

    // ---------- 设备待维护 id13-id15 ----------
    {
      id: '13',
      toiletName: '城东转运站',
      location: '城东路88号',
      area: '芗城区-巷口街道',
      openHours: '06:00-22:00',
      status: '设备待维护',
      manager: '张三',
      // 设备待维护特有字段
      maintenanceId: 'MT20250301001',
      transferName: '城东转运站',
      equipmentName: '压缩机A',
      maintenanceCycle: '每月',
      lastMaintenanceTime: '2026-02-01 10:00:00',
      maintenanceContent: '更换润滑油、检查轴承',
      handler: '维修组',
      maintenanceStatus: '待维护',
      expectedCompleteTime: '2026-03-02 18:00:00',
      isTimeout: false,
    },
    {
      id: '14',
      toiletName: '城西转运站',
      location: '城西路256号',
      area: '龙文区-碧湖街道',
      openHours: '05:30-23:30',
      status: '设备待维护',
      manager: '李华',
      maintenanceId: 'MT20250301002',
      transferName: '城西转运站',
      equipmentName: '地磅',
      maintenanceCycle: '每季度',
      lastMaintenanceTime: '2025-12-15 14:00:00',
      maintenanceContent: '校准传感器',
      handler: '计量组',
      maintenanceStatus: '维护中',
      expectedCompleteTime: '2026-03-01 16:00:00',
      isTimeout: false,
    },
    {
      id: '15',
      toiletName: '城南转运站',
      location: '城南路12号',
      area: '龙海区-石码镇',
      openHours: '00:00-24:00',
      status: '设备待维护',
      manager: '王强',
      maintenanceId: 'MT20250301003',
      transferName: '城南转运站',
      equipmentName: '除臭风机',
      maintenanceCycle: '每周',
      lastMaintenanceTime: '2026-02-25 09:00:00',
      maintenanceContent: '清洗滤网',
      handler: '维修组',
      maintenanceStatus: '待维护',
      expectedCompleteTime: '2026-03-01 12:00:00',
      isTimeout: true,
    },

    // ---------- 已完成 id16-id18 ----------
    {
      id: '16',
      toiletName: '城东转运站',
      location: '城东路88号',
      area: '芗城区-巷口街道',
      openHours: '06:00-22:00',
      status: '已完成',
      manager: '张三',
      // 已完成特有字段
      taskType: '转运作业',
      transferName: '城东转运站',
      completeTime: '2026-02-28 17:30:00',
      handler: '张三',
      handleResult: '完成',
      proofUrl: 'http://example.com/proof_op1.jpg',
      handleDuration: '2.5小时',
      totalEntryVolume: 120,
      equipmentIntactRate: 98.5,
      environmentQualifiedRate: 100,
    },
    {
      id: '17',
      toiletName: '城西转运站',
      location: '城西路256号',
      area: '龙文区-碧湖街道',
      openHours: '05:30-23:30',
      status: '已完成',
      manager: '李华',
      taskType: '设备维护',
      transferName: '城西转运站',
      completeTime: '2026-02-28 11:20:00',
      handler: '维修组',
      handleResult: '完成',
      proofUrl: 'http://example.com/proof_mt2.jpg',
      handleDuration: '3小时',
      totalEntryVolume: null,
      equipmentIntactRate: 100,
      environmentQualifiedRate: null,
    },
    {
      id: '18',
      toiletName: '城南转运站',
      location: '城南路12号',
      area: '龙海区-石码镇',
      openHours: '00:00-24:00',
      status: '已完成',
      manager: '王强',
      taskType: '预警处置',
      transferName: '城南转运站',
      completeTime: '2026-02-28 09:45:00',
      handler: '王强',
      handleResult: '已解除',
      proofUrl: 'http://example.com/proof_alarm3.jpg',
      handleDuration: '1小时',
      totalEntryVolume: null,
      equipmentIntactRate: null,
      environmentQualifiedRate: 95,
    },
  ];
};
