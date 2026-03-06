// 模拟公厕运营管理数据
export const dataList = () => {
  return [
    // ---------- 原有数据（id1-id10）----------
    {
      id: '1',
      toiletName: '中山公园公厕',
      location: '中山公园东门',
      area: '芗城区-巷口街道',
      openHours: '06:00-22:00',
      stallCount: 8,
      status: '保洁待执行',
      manager: '张三',
      cleaningRate: 98.5,
      complaintRate: 100,
      warningCount: 2,
      facilityRate: 95.2,
      cleaningFrequency: '每日两次',
      cleaningTime: '07:00-09:00,18:00-20:00',
      cleaningContent: '地面清洗、蹲位消毒、垃圾清理',
      cleaner: '李四、王五',
      cleaningStandard: '一级标准',
      createBy: 'admin',
      createTime: '2026-02-24 08:00:00',
      updateTime: '2026-02-24 08:00:00',
      isEffective: true,
    },
    {
      id: '2',
      toiletName: '碧湖公园公厕',
      location: '碧湖公园西门',
      area: '龙文区-碧湖街道',
      openHours: '06:30-21:30',
      stallCount: 6,
      status: '物资待补充',
      manager: '李华',
      cleaningRate: 95.0,
      complaintRate: 80,
      warningCount: 3,
      facilityRate: 92.0,
      consumableName: '洗手液',
      materialType: '清洁用品',
      currentStock: 2,
      threshold: 5,
      gap: 3,
      warningStatus: '预警',
      warningLevel: '中',
      lastSupplyTime: '2026-02-20 10:00:00',
      supplyCycle: '7天',
    },
    {
      id: '3',
      toiletName: '火车站公厕',
      location: '火车站广场',
      area: '龙海区-石码镇',
      openHours: '00:00-24:00',
      stallCount: 12,
      status: '投诉待处置',
      manager: '王强',
      cleaningRate: 88.0,
      complaintRate: 60,
      warningCount: 1,
      facilityRate: 89.5,
      complaintId: 'TS001',
      complaintType: '卫生差',
      complaintContent: '地面有积水，异味重',
      complaintName: '赵先生',
      complaintTime: '2026-02-24 09:30:00',
      phone: '138****1234',
      dispatchStatus: '待派单',
      handler: null,
      isTimeout: false,
    },
    {
      id: '4',
      toiletName: '客运中心公厕',
      location: '客运中心站内',
      area: '长泰区-武安镇',
      openHours: '05:30-23:00',
      stallCount: 10,
      status: '设施待维修',
      manager: '陈敏',
      cleaningRate: 92.5,
      complaintRate: 100,
      warningCount: 0,
      facilityRate: 75.0,
      repairId: 'WX001',
      facilityType: '水龙头',
      damageDesc: '水龙头漏水',
      reportBy: '陈敏',
      reportTime: '2026-02-23 14:00:00',
      photoUrl: 'http://example.com/photo1.jpg',
      repairBy: null,
      repairStatus: '待派单',
      expectedCompleteTime: '2026-02-25 18:00:00',
    },
    {
      id: '5',
      toiletName: '体育中心公厕',
      location: '体育场东侧',
      area: '漳浦县-绥安镇',
      openHours: '08:00-20:00',
      stallCount: 8,
      status: '已完成',
      manager: '刘芳',
      cleaningRate: 100,
      complaintRate: 100,
      warningCount: 0,
      facilityRate: 100,
      taskType: '保洁',
      completeTime: '2026-02-23 17:30:00',
      handler: '刘芳',
      handleResult: '合格',
      proofUrl: 'http://example.com/proof.jpg',
      handleDuration: '2.5小时',
      satisfaction: 100,
      statPeriod: '2026-02-23',
    },
    {
      id: '6',
      toiletName: '市民公园公厕',
      location: '市民广场',
      area: '芗城区-南坑街道',
      openHours: '06:00-22:00',
      stallCount: 8,
      status: '保洁待执行',
      manager: '赵雷',
      cleaningRate: 97.0,
      complaintRate: 100,
      warningCount: 1,
      facilityRate: 96.0,
      cleaningFrequency: '每日一次',
      cleaningTime: '08:00-10:00',
      cleaningContent: '地面清洗、垃圾清理',
      cleaner: '赵雷',
      cleaningStandard: '二级标准',
      createBy: 'admin',
      createTime: '2026-02-25 08:00:00',
      updateTime: '2026-02-25 08:00:00',
      isEffective: true,
    },
    {
      id: '7',
      toiletName: '滨海公园公厕',
      location: '滨海大道',
      area: '龙海区-海澄镇',
      openHours: '07:00-19:00',
      stallCount: 6,
      status: '物资待补充',
      manager: '周涛',
      cleaningRate: 93.0,
      complaintRate: 90,
      warningCount: 2,
      facilityRate: 94.0,
      consumableName: '卫生纸',
      materialType: '纸品',
      currentStock: 1,
      threshold: 10,
      gap: 9,
      warningStatus: '预警',
      warningLevel: '高',
      lastSupplyTime: '2026-02-22 15:00:00',
      supplyCycle: '5天',
    },
    {
      id: '8',
      toiletName: '文化宫公厕',
      location: '文化宫一楼',
      area: '长泰区-武安镇',
      openHours: '08:30-21:00',
      stallCount: 8,
      status: '投诉待处置',
      manager: '吴迪',
      cleaningRate: 85.0,
      complaintRate: 50,
      warningCount: 1,
      facilityRate: 88.0,
      complaintId: 'TS002',
      complaintType: '设施损坏',
      complaintContent: '洗手台破损',
      complaintName: '孙女士',
      complaintTime: '2026-02-25 10:15:00',
      phone: '159****5678',
      dispatchStatus: '已派单',
      handler: '郑凯',
      isTimeout: false,
    },
    {
      id: '9',
      toiletName: '中医院公厕',
      location: '中医院院内',
      area: '漳浦县-绥安镇',
      openHours: '06:00-22:00',
      stallCount: 6,
      status: '设施待维修',
      manager: '郑爽',
      cleaningRate: 91.0,
      complaintRate: 100,
      warningCount: 0,
      facilityRate: 82.0,
      repairId: 'WX002',
      facilityType: '马桶',
      damageDesc: '马桶堵塞',
      reportBy: '郑爽',
      reportTime: '2026-02-24 09:00:00',
      photoUrl: 'http://example.com/photo2.jpg',
      repairBy: '维修组',
      repairStatus: '维修中',
      expectedCompleteTime: '2026-02-25 12:00:00',
    },
    {
      id: '10',
      toiletName: '行政中心公厕',
      location: '行政中心B座',
      area: '龙文区-步文街道',
      openHours: '08:00-18:00',
      stallCount: 10,
      status: '已完成',
      manager: '林欣',
      cleaningRate: 100,
      complaintRate: 100,
      warningCount: 0,
      facilityRate: 100,
      taskType: '维修',
      completeTime: '2026-02-24 16:00:00',
      handler: '维修组',
      handleResult: '合格',
      proofUrl: 'http://example.com/proof2.jpg',
      handleDuration: '3小时',
      satisfaction: 100,
      statPeriod: '2026-02-24',
    },

    // ---------- 新增数据（id11-id18）----------
    // 保洁待执行（id11）
    {
      id: '11',
      toiletName: '博物馆公厕',
      location: '博物馆一层',
      area: '芗城区-东铺头街道',
      openHours: '09:00-17:00',
      stallCount: 6,
      status: '保洁待执行',
      manager: '许峰',
      cleaningRate: 96.0,
      complaintRate: 100,
      warningCount: 0,
      facilityRate: 98.0,
      cleaningFrequency: '每日一次',
      cleaningTime: '09:30-11:30',
      cleaningContent: '地面清洗、垃圾桶清理',
      cleaner: '许峰',
      cleaningStandard: '二级标准',
      createBy: 'admin',
      createTime: '2026-02-26 09:00:00',
      updateTime: '2026-02-26 09:00:00',
      isEffective: true,
    },
    // 物资待补充（id12, id13, id14）
    {
      id: '12',
      toiletName: '图书馆公厕',
      location: '图书馆一楼',
      area: '龙文区-步文街道',
      openHours: '08:30-20:30',
      stallCount: 8,
      status: '物资待补充',
      manager: '高阳',
      cleaningRate: 94.0,
      complaintRate: 100,
      warningCount: 2,
      facilityRate: 95.0,
      consumableName: '消毒液',
      materialType: '消毒用品',
      currentStock: 1,
      threshold: 5,
      gap: 4,
      warningStatus: '预警',
      warningLevel: '高',
      lastSupplyTime: '2026-02-25 14:00:00',
      supplyCycle: '3天',
    },
    {
      id: '13',
      toiletName: '体育场公厕',
      location: '体育场南门',
      area: '龙海区-海澄镇',
      openHours: '06:00-22:00',
      stallCount: 10,
      status: '物资待补充',
      manager: '宋阳',
      cleaningRate: 92.0,
      complaintRate: 90,
      warningCount: 3,
      facilityRate: 93.0,
      consumableName: '擦手纸',
      materialType: '纸品',
      currentStock: 0,
      threshold: 8,
      gap: 8,
      warningStatus: '预警',
      warningLevel: '高',
      lastSupplyTime: '2026-02-24 10:00:00',
      supplyCycle: '4天',
    },
    {
      id: '14',
      toiletName: '公园南门公厕',
      location: '公园南门入口',
      area: '长泰区-武安镇',
      openHours: '07:00-19:00',
      stallCount: 6,
      status: '物资待补充',
      manager: '秦岚',
      cleaningRate: 91.0,
      complaintRate: 95,
      warningCount: 1,
      facilityRate: 94.0,
      consumableName: '洗手液',
      materialType: '清洁用品',
      currentStock: 3,
      threshold: 5,
      gap: 2,
      warningStatus: '预警',
      warningLevel: '低',
      lastSupplyTime: '2026-02-26 08:30:00',
      supplyCycle: '6天',
    },
    // 投诉待处置（id15）
    {
      id: '15',
      toiletName: '社区公厕',
      location: '社区活动中心旁',
      area: '漳浦县-绥安镇',
      openHours: '06:00-22:00',
      stallCount: 4,
      status: '投诉待处置',
      manager: '冯燕',
      cleaningRate: 82.0,
      complaintRate: 40,
      warningCount: 0,
      facilityRate: 85.0,
      complaintId: 'TS003',
      complaintType: '异味',
      complaintContent: '厕所异味严重，通风不畅',
      complaintName: '李女士',
      complaintTime: '2026-02-26 11:20:00',
      phone: '137****2233',
      dispatchStatus: '待派单',
      handler: null,
      isTimeout: true,
    },
    // 设施待维修（id16, id17）
    {
      id: '16',
      toiletName: '步行街公厕',
      location: '步行街中段',
      area: '芗城区-巷口街道',
      openHours: '08:00-22:00',
      stallCount: 8,
      status: '设施待维修',
      manager: '褚健',
      cleaningRate: 89.0,
      complaintRate: 75,
      warningCount: 1,
      facilityRate: 70.0,
      repairId: 'WX003',
      facilityType: '洗手台',
      damageDesc: '洗手台破裂',
      reportBy: '褚健',
      reportTime: '2026-02-26 09:45:00',
      photoUrl: 'http://example.com/photo3.jpg',
      repairBy: null,
      repairStatus: '待派单',
      expectedCompleteTime: '2026-02-27 18:00:00',
    },
    {
      id: '17',
      toiletName: '车站广场公厕',
      location: '车站广场东侧',
      area: '龙文区-碧湖街道',
      openHours: '05:00-23:00',
      stallCount: 12,
      status: '设施待维修',
      manager: '魏敏',
      cleaningRate: 90.0,
      complaintRate: 85,
      warningCount: 2,
      facilityRate: 78.0,
      repairId: 'WX004',
      facilityType: '照明',
      damageDesc: '灯光闪烁，部分不亮',
      reportBy: '魏敏',
      reportTime: '2026-02-26 13:20:00',
      photoUrl: 'http://example.com/photo4.jpg',
      repairBy: '电工组',
      repairStatus: '维修中',
      expectedCompleteTime: '2026-02-27 10:00:00',
    },
    // 已完成（id18）
    {
      id: '18',
      toiletName: '医院公厕',
      location: '医院门诊楼',
      area: '龙海区-石码镇',
      openHours: '00:00-24:00',
      stallCount: 10,
      status: '已完成',
      manager: '沈洁',
      cleaningRate: 100,
      complaintRate: 100,
      warningCount: 0,
      facilityRate: 100,
      taskType: '消杀',
      completeTime: '2026-02-26 15:30:00',
      handler: '沈洁',
      handleResult: '合格',
      proofUrl: 'http://example.com/proof3.jpg',
      handleDuration: '1小时',
      satisfaction: 100,
      statPeriod: '2026-02-26',
    },
  ];
};

import { baseRequestClient, requestClient } from '#/api/request';
import { useAccessStore } from '@vben/stores';

// ---------- 公厕基础信息 ----------
/**
 * 分页查询公厕列表
 */
export function getPublicToiletPage(params) {
  return requestClient.get('/envirhealth/public-toilet/detail-page', { params });
}

/**
 * 创建公厕
 */
export function createPublicToilet(data) {
  return requestClient.post('/envirhealth/public-toilet/create', data);
}

/**
 * 更新公厕
 */
export function updatePublicToilet(data) {
  return requestClient.put('/envirhealth/public-toilet/update', data);
}

/**
 * 删除单个公厕
 */
export function deletePublicToilet(id) {
  return requestClient.delete(`/envirhealth/public-toilet/delete?id=${id}`);
}

/**
 * 批量删除公厕
 */
export function deletePublicToiletBatch(ids) {
  return requestClient.delete('/envirhealth/public-toilet/delete-batch', { data: ids });
}

/**
 * 导出公厕列表 Excel
 */
export async function exportPublicToiletExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get('/envirhealth/public-toilet/export-excel', {
    params,
    responseType: 'blob',
    validateStatus: () => true,
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

// ---------- 投诉记录 ----------
export function getToiletComplaintPage(params) {
  return requestClient.get('/envirhealth/toilet-complaint/detail-page', { params });
}

export function createToiletComplaint(data) {
  return requestClient.post('/envirhealth/toilet-complaint/create', data);
}

export function updateToiletComplaint(data) {
  return requestClient.put('/envirhealth/toilet-complaint/update', data);
}

export function deleteToiletComplaint(id) {
  return requestClient.delete(`/envirhealth/toilet-complaint/delete?id=${id}`);
}

export function deleteToiletComplaintBatch(ids) {
  return requestClient.delete('/envirhealth/toilet-complaint/delete-batch', { data: ids });
}

export async function exportToiletComplaintExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get('/envirhealth/toilet-complaint/export-excel', {
    params,
    responseType: 'blob',
    validateStatus: () => true,
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

// ---------- 设施维修记录 ----------
export function getToiletFacilityRepairPage(params) {
  return requestClient.get('/envirhealth/toilet-facility-repair/detail-page', { params });
}

export function createToiletFacilityRepair(data) {
  return requestClient.post('/envirhealth/toilet-facility-repair/create', data);
}

export function updateToiletFacilityRepair(data) {
  return requestClient.put('/envirhealth/toilet-facility-repair/update', data);
}

export function deleteToiletFacilityRepair(id) {
  return requestClient.delete(`/envirhealth/toilet-facility-repair/delete?id=${id}`);
}

export function deleteToiletFacilityRepairBatch(ids) {
  return requestClient.delete('/envirhealth/toilet-facility-repair/delete-batch', { data: ids });
}

export async function exportToiletFacilityRepairExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get('/envirhealth/toilet-facility-repair/export-excel', {
    params,
    responseType: 'blob',
    validateStatus: () => true,
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

// ---------- 保洁任务 ----------
/**
 * 分页查询保洁任务列表
 */
export function getToiletCleaningTaskPage(params) {
  return requestClient.get('/envirhealth/toilet-cleaning-task/detail-page', { params });
}

/**
 * 创建保洁任务
 */
export function createToiletCleaningTask(data) {
  return requestClient.post('/envirhealth/toilet-cleaning-task/create', data);
}

/**
 * 更新保洁任务
 */
export function updateToiletCleaningTask(data) {
  return requestClient.put('/envirhealth/toilet-cleaning-task/update', data);
}

/**
 * 删除单个保洁任务
 */
export function deleteToiletCleaningTask(id) {
  return requestClient.delete(`/envirhealth/toilet-cleaning-task/delete?id=${id}`);
}

/**
 * 批量删除保洁任务
 */
export function deleteToiletCleaningTaskBatch(ids) {
  return requestClient.delete('/envirhealth/toilet-cleaning-task/delete-batch', { data: ids });
}

/**
 * 导出保洁任务 Excel
 */
export async function exportToiletCleaningTaskExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get('/envirhealth/toilet-cleaning-task/export-excel', {
    params,
    responseType: 'blob',
    validateStatus: () => true,
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

// ---------- 物资待补充（消耗品）接口 ----------
/**
 * 分页查询物资待补充列表
 */
export function getToiletConsumablePage(params) {
  return requestClient.get('/envirhealth/toilet-consumable/detail-page', { params });
}

/**
 * 创建物资待补充记录
 */
export function createToiletConsumable(data) {
  return requestClient.post('/envirhealth/toilet-consumable/create', data);
}

/**
 * 更新物资待补充记录
 */
export function updateToiletConsumable(data) {
  return requestClient.put('/envirhealth/toilet-consumable/update', data);
}

/**
 * 删除单个物资待补充记录
 */
export function deleteToiletConsumable(id) {
  return requestClient.delete(`/envirhealth/toilet-consumable/delete?id=${id}`);
}

/**
 * 批量删除物资待补充记录
 */
export function deleteToiletConsumableBatch(ids) {
  return requestClient.delete('/envirhealth/toilet-consumable/delete-batch', { data: ids });
}

/**
 * 导出物资待补充 Excel
 */
export async function exportToiletConsumableExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get('/envirhealth/toilet-consumable/export-excel', {
    params,
    responseType: 'blob',
    validateStatus: () => true,
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

// ---------- 统计接口（用于选项卡数字）----------
/**
 * 获取公厕运营任务统计（各状态数量）
 */
export function getPublicToiletStatistics() {
  return requestClient.get('/envirhealth/public-toilet/chart/statistics');
}
