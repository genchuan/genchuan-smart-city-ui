import { useAccessStore } from '@vben/stores';
import { baseRequestClient, requestClient } from '#/api/request';

/**
 * 分页查询充电场站列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getChargingStationPage(params) {
  return requestClient.get('/vehiclecharging/charging_station/page', { params });
}

/**
 * 新增充电场站
 * @param {Object} data - 新增数据
 * @returns {Promise}
 */
export function createChargingStation(data) {
  return requestClient.post('/vehiclecharging/charging_station/create', data);
}

/**
 * 批量编辑充电场站
 * @param {Object} data - 包含 ids 数组及要更新的字段
 * @returns {Promise}
 */
export function batchUpdateChargingStation(data) {
  return requestClient.put('/vehiclecharging/charging_station/batch-update', data);
}

/**
 * 编辑充电场站
 * @param {Object} data - 编辑数据
 * @returns {Promise}
 */
export function updateChargingStation(data) {
  return requestClient.put('/vehiclecharging/charging_station/update', data);
}

/**
 * 批量停用充电场站
 * @param {Object} data - { ids: [], stopReason: "" }
 * @returns {Promise}
 */
export function batchDisableChargingStation(data) {
  return requestClient.put('/vehiclecharging/charging_station/batch-disable', data);
}

/**
 * 停用充电场站
 * @param {Object} data - { id, stopReason }
 * @returns {Promise}
 */
export function disableChargingStation(data) {
  return requestClient.put('/vehiclecharging/charging_station/disable', data);
}

/**
 * 启用充电场站
 * @param {Object} data - { id }
 * @returns {Promise}
 */
export function enableChargingStation(data) {
  return requestClient.put('/vehiclecharging/charging_station/enable', data);
}

/**
 * 导出充电场站列表 Excel
 * @param {Object} params - 查询参数
 * @returns {Promise<Blob>}
 */
export async function exportChargingStation(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get('/vehiclecharging/charging_station/export', {
    params,
    responseType: 'blob',
    validateStatus: () => true,
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

/**
 * 查询充电场站详情
 * @param {Object} params - { id }
 * @returns {Promise}
 */
export function getChargingStationDetail(params) {
  return requestClient.get('/vehiclecharging/charging_station/get', { params });
}

// ==================== 图表相关接口 ====================

/**
 * 获取充电场站总览图表数据
 * @returns {Promise}
 */
export function getChargingStationChartData() {
  return requestClient.get('/vehiclecharging/charging_station/chart');
}

/**
 * 获取子区域场站数量统计（柱状图下钻）
 * @param {string} parentArea - 父区域名称
 * @returns {Promise}
 */
export function getAreaCountChart(parentArea) {
  return requestClient.get('/vehiclecharging/charging_station/chart/areaCount', {
    params: { parentArea }
  });
}

/**
 * 获取场站状态分布统计（卡片钻取）
 * @param {string} status - 场站状态（enabled/disabled/wait），为空则返回所有状态统计
 * @returns {Promise}
 */
export function getStatusCountChart(status) {
  const params = status ? { status } : {};
  return requestClient.get('/vehiclecharging/charging_station/chart/statusCount', {
    params
  });
}

// 模拟充电场站管理数据
export const dataList = () => {
  return [
    {
      id: '1',
      station_code: 'CS001',
      toiletName: '城东充电站',
      location: '芗城区胜利路1号',
      area: '自营',                   // 合作模式
      openHours: '00:00-24:00',
      stallCount: 1.20,               // 电价服务费（元/度）
      status: '未启用',
      manager: '张三',
      // 其他字段
      cleaningRate: '2026-03-01 08:00:00', // 创建时间（复用）
      complaintRate: '2026-03-01 08:00:00', // 更新时间（复用）
      warningCount: 'admin',                // 操作人（复用）
      facilityRate: 98.5,                  // 备用（可忽略）
      cleaningFrequency: '自营',            // 备用
      cleaningTime: '测试场站',              // 备用
      cleaningContent: '位于城东工业区',     // 备注（复用）
      cleaner: null,                        // 停用原因（复用）
      cleaningStandard: '一级标准',          // 备用
      createBy: 'admin',
      createTime: '2026-03-01 08:00:00',
      updateTime: '2026-03-01 08:00:00',
      isEffective: true,
      lon: 117.654,
      lat: 24.515,
    },
    {
      id: '2',
      station_code: 'CS002',
      toiletName: '城南充电站',
      location: '龙文区迎宾路88号',
      area: '合作运营',
      openHours: '06:00-22:00',
      stallCount: 1.35,
      status: '已启用',
      manager: '李四',
      cleaningRate: '2026-03-02 09:00:00',
      complaintRate: '2026-03-02 15:30:00',
      warningCount: '李四',
      facilityRate: 99.0,
      cleaningFrequency: '合作运营',
      cleaningTime: '正常运营',
      cleaningContent: '靠近万达广场',
      cleaner: null,
      cleaningStandard: '一级标准',
      createBy: 'admin',
      createTime: '2026-03-02 09:00:00',
      updateTime: '2026-03-02 15:30:00',
      isEffective: true,
      lon: 117.712,
      lat: 24.502,
    },
    {
      id: '3',
      station_code: 'CS003',
      toiletName: '城西充电站',
      location: '龙海区人民路12号',
      area: '自营',
      openHours: '08:00-20:00',
      stallCount: 1.10,
      status: '已停用',
      manager: '王五',
      cleaningRate: '2026-03-01 10:00:00',
      complaintRate: '2026-03-03 11:00:00',
      warningCount: '王五',
      facilityRate: 85.0,
      cleaningFrequency: '自营',
      cleaningTime: '设备维护',
      cleaningContent: '设备老旧，需改造',
      cleaner: '设备老化',                // 停用原因（复用）
      cleaningStandard: '二级标准',
      createBy: 'admin',
      createTime: '2026-03-01 10:00:00',
      updateTime: '2026-03-03 11:00:00',
      isEffective: true,
      lon: 117.598,
      lat: 24.487,
    },
    {
      id: '4',
      station_code: 'CS004',
      toiletName: '城北充电站',
      location: '长泰区武安路99号',
      area: '特许经营',
      openHours: '00:00-24:00',
      stallCount: 1.45,
      status: '未启用',
      manager: '赵六',
      cleaningRate: '2026-03-04 14:00:00',
      complaintRate: '2026-03-04 14:00:00',
      warningCount: '赵六',
      facilityRate: 100.0,
      cleaningFrequency: '特许经营',
      cleaningTime: '新建未启用',
      cleaningContent: '北站新区',
      cleaner: null,
      cleaningStandard: '一级标准',
      createBy: 'admin',
      createTime: '2026-03-04 14:00:00',
      updateTime: '2026-03-04 14:00:00',
      isEffective: true,
      lon: 117.820,
      lat: 24.550,
    },
    {
      id: '5',
      station_code: 'CS005',
      toiletName: '开发区充电站',
      location: '漳浦县绥安开发区',
      area: '合作运营',
      openHours: '07:00-23:00',
      stallCount: 1.28,
      status: '已启用',
      manager: '钱七',
      cleaningRate: '2026-03-05 09:30:00',
      complaintRate: '2026-03-05 16:20:00',
      warningCount: '钱七',
      facilityRate: 97.5,
      cleaningFrequency: '合作运营',
      cleaningTime: '正常运营',
      cleaningContent: '企业园区专用',
      cleaner: null,
      cleaningStandard: '一级标准',
      createBy: 'admin',
      createTime: '2026-03-05 09:30:00',
      updateTime: '2026-03-05 16:20:00',
      isEffective: true,
      lon: 117.715,
      lat: 24.445,
    },
    {
      id: '6',
      station_code: 'CS006',
      toiletName: '旅游区充电站',
      location: '龙海区海澄镇滨海路',
      area: '特许经营',
      openHours: '08:00-22:00',
      stallCount: 1.50,
      status: '已停用',
      manager: '孙八',
      cleaningRate: '2026-03-02 08:00:00',
      complaintRate: '2026-03-06 10:15:00',
      warningCount: '孙八',
      facilityRate: 90.0,
      cleaningFrequency: '特许经营',
      cleaningTime: '停运检修',
      cleaningContent: '设备故障待维修',
      cleaner: '变压器损坏',              // 停用原因
      cleaningStandard: '二级标准',
      createBy: 'admin',
      createTime: '2026-03-02 08:00:00',
      updateTime: '2026-03-06 10:15:00',
      isEffective: true,
      lon: 117.880,
      lat: 24.468,
    },
  ];
};
