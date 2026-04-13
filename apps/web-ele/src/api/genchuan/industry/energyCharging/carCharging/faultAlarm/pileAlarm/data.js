import { requestClient } from '#/api/request';

/**
 * 分页查询充电桩告警列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getPileAlarmPage(params) {
  return requestClient.get('/vehiclecharging/pile-alarm/page', { params });
}

/**
 * 派单接口
 * @param {Object} data - 派单数据
 * @returns {Promise}
 */
export function dispatchPileAlarm(data) {
  return requestClient.put('/vehiclecharging/pile-alarm/dis', data);
}

/**
 * 处置接口
 * @param {Object} data - 处置数据
 * @returns {Promise}
 */
export function handlePileAlarm(data) {
  return requestClient.put('/vehiclecharging/pile-alarm/handle', data);
}

/**
 * 销单接口
 * @param {Object} data - 销单数据
 * @returns {Promise}
 */
export function closePileAlarm(data) {
  return requestClient.put('/vehiclecharging/pile-alarm/close', data);
}

/**
 * 备注接口
 * @param {Object} data - 备注数据
 * @returns {Promise}
 */
export function remarkPileAlarm(data) {
  return requestClient.put('/vehiclecharging/pile-alarm/remark', data);
}

/**
 * 导出接口
 * @returns {Promise}
 */
export function exportPileAlarm() {
  return requestClient.download('/vehiclecharging/pile-alarm/export-excel');
}

// ==================== 充电桩告警图表相关接口 ====================
/**
 * 获取充电桩告警统计总览数据
 * @param {Object} params - { startTime, endTime, stationId }
 * @returns {Promise}
 */
export function getPileAlarmChart(params) {
  return requestClient.get('/vehiclecharging/pile-alarm/chart', { params });
}


// 模拟数据（字段与接口响应保持一致）
export const dataList = () => {
  return [
    {
      id: 1,
      alarmCode: 'ALARM-20250328001',
      pileCode: 'PILE-001',
      pileName: '桩A001',
      stationId: 1001,
      stationName: '城东充电站',
      faultType: '硬件故障',
      alarmLevel: '严重',
      alarmTime: '2026-03-31 08:23:15',
      handleUser: null,
      handleUserName: null,
      alarmStatus: '未派单',
      disposeMeasure: null,
      disposeTime: null,
      remark: '设备过热',
      createTime: '2026-03-31 08:23:15',
      updateTime: '2026-03-31 08:23:15',
    },
    {
      id: 2,
      alarmCode: 'ALARM-20250328002',
      pileCode: 'PILE-002',
      pileName: '桩B002',
      stationId: 1002,
      stationName: '城南充电站',
      faultType: '软件故障',
      alarmLevel: '一般',
      alarmTime: '2026-03-31 09:15:30',
      handleUser: '10001',
      handleUserName: '李四',
      alarmStatus: '已派单',
      disposeMeasure: null,
      disposeTime: null,
      remark: '通讯超时',
      createTime: '2026-03-31 09:15:30',
      updateTime: '2026-03-31 09:15:30',
    },
    {
      id: 3,
      alarmCode: 'ALARM-20250328003',
      pileCode: 'PILE-003',
      pileName: '桩C003',
      stationId: 1003,
      stationName: '城西充电站',
      faultType: '网络故障',
      alarmLevel: '严重',
      alarmTime: '2026-03-30 10:05:22',
      handleUser: '10002',
      handleUserName: '王五',
      alarmStatus: '处置中',
      disposeMeasure: '重启网络设备',
      disposeTime: '2026-03-30 10:20:00',
      remark: '交换机故障',
      createTime: '2026-03-30 10:05:22',
      updateTime: '2026-03-30 10:20:00',
    },
    {
      id: 4,
      alarmCode: 'ALARM-20250328004',
      pileCode: 'PILE-004',
      pileName: '桩D004',
      stationId: 1004,
      stationName: '城北充电站',
      faultType: '硬件故障',
      alarmLevel: '一般',
      alarmTime: '2026-03-30 11:30:45',
      handleUser: '10003',
      handleUserName: '赵六',
      alarmStatus: '已销单',
      disposeMeasure: '更换熔断器',
      disposeTime: '2026-03-30 12:15:00',
      remark: '保险丝熔断',
      createTime: '2026-03-30 11:30:45',
      updateTime: '2026-03-30 12:15:00',
    },
    {
      id: 5,
      alarmCode: 'ALARM-20250328005',
      pileCode: 'PILE-005',
      pileName: '桩E005',
      stationId: 1005,
      stationName: '开发区充电站',
      faultType: '软件故障',
      alarmLevel: '严重',
      alarmTime: '2026-03-29 13:20:10',
      handleUser: null,
      handleUserName: null,
      alarmStatus: '未派单',
      disposeMeasure: null,
      disposeTime: null,
      remark: '充电逻辑错误',
      createTime: '2026-03-29 13:20:10',
      updateTime: '2026-03-29 13:20:10',
    },
    {
      id: 6,
      alarmCode: 'ALARM-20250328006',
      pileCode: 'PILE-006',
      pileName: '桩F006',
      stationId: 1006,
      stationName: '旅游区充电站',
      faultType: '网络故障',
      alarmLevel: '一般',
      alarmTime: '2026-03-28 14:10:30',
      handleUser: '10004',
      handleUserName: '孙七',
      alarmStatus: '已派单',
      disposeMeasure: null,
      disposeTime: null,
      remark: '信号弱',
      createTime: '2026-03-28 14:10:30',
      updateTime: '2026-03-28 14:10:30',
    },
  ];
};
