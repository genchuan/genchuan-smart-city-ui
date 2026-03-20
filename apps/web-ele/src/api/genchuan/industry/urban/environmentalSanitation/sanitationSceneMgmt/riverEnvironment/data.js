import { baseRequestClient, requestClient } from '#/api/request';
import { useAccessStore } from '@vben/stores';

// 分页查询（全部）
export function getRiverPage(params) {
  return requestClient.get('/envirhealth/river/detail-page', { params });
}

// 新增
export function createRiver(data) {
  return requestClient.post('/envirhealth/river/create', data);
}

// 修改
export function updateRiver(data) {
  return requestClient.put('/envirhealth/river/update', data);
}

// 单个删除
export function deleteRiver(id) {
  return requestClient.delete(`/envirhealth/river/delete?id=${id}`);
}

// 批量删除
export function deleteRiverBatch(ids) {
  return requestClient.delete('/envirhealth/river/delete-batch', { data: ids });
}

// 导出 Excel
export function exportRiverExcel(params) {
  const accessStore = useAccessStore();
  return baseRequestClient.get('/envirhealth/river/export-excel', {
    params,
    responseType: 'blob',
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

/**
 * 获取河道环境管理统计数据
 */
export function getRiverChartDashboard() {
  return requestClient.get('/envirhealth/river/chart/dashboard');
}

// 模拟河道环境管理数据
export const dataList = () => {
  return [
    // ---------- 全部（河道基础信息）id1-id3 ----------
    {
      id: '1',
      toiletName: '九龙江',
      location: '芗城区江滨路',
      area: '芗城区-巷口街道',
      openHours: '全天',
      stallCount: 15.5, // 河道长度（公里）
      status: '正常运营',
      manager: '张河长',
      // 全部特有字段
      cleaningRate: 98.5,                 // 保洁覆盖率
      facilityRate: 96.0,                  // 水质达标率（复用）
      wasteFishingVolume: 120,              // 垃圾打捞总量（吨）
      complaintRate: 100,                   // 问题办结率（复用）
      responsibilitySection: '中山桥-战备大桥段',
      warningCount: 2,
    },
    {
      id: '2',
      toiletName: '九十九湾',
      location: '龙文区水仙大街',
      area: '龙文区-碧湖街道',
      openHours: '全天',
      stallCount: 8.2,
      status: '正常运营',
      manager: '李河长',
      cleaningRate: 95.0,
      facilityRate: 92.5,
      wasteFishingVolume: 85,
      complaintRate: 95,
      responsibilitySection: '浦头港-湘桥段',
      warningCount: 1,
    },
    {
      id: '3',
      toiletName: '西溪',
      location: '龙海区锦江道',
      area: '龙海区-石码镇',
      openHours: '全天',
      stallCount: 22.0,
      status: '部分停运',
      manager: '王河长',
      cleaningRate: 88.0,
      facilityRate: 85.0,
      wasteFishingVolume: 200,
      complaintRate: 90,
      responsibilitySection: '龙海桥-污水处理厂段',
      warningCount: 3,
    },

    // ---------- 保洁待执行 id4-id6 ----------
    {
      id: '4',
      toiletName: '九龙江',
      location: '芗城区江滨路',
      area: '芗城区-巷口街道',
      openHours: '全天',
      stallCount: 15.5,
      status: '保洁待执行',
      manager: '张河长',
      // 保洁待执行特有字段
      responsibilitySection: '中山桥-战备大桥段',
      cleaningType: '水域保洁',
      cleaningFrequency: '每日两次',
      cleaningTime: '08:00-10:00,14:00-16:00',
      cleaner: '李阿姨、王阿姨',
      cleaningTool: '打捞船、捞网',
      createBy: 'admin',
      createTime: '2026-03-01 08:00:00',
      updateTime: '2026-03-01 08:00:00',
      cleaningPlanCompleteRate: 0,
      wasteFishingEstimate: 0.5,
    },
    {
      id: '5',
      toiletName: '九十九湾',
      location: '龙文区水仙大街',
      area: '龙文区-碧湖街道',
      openHours: '全天',
      stallCount: 8.2,
      status: '保洁待执行',
      manager: '李河长',
      responsibilitySection: '浦头港-湘桥段',
      cleaningType: '陆域保洁',
      cleaningFrequency: '每日一次',
      cleaningTime: '09:00-11:00',
      cleaner: '赵叔、钱婶',
      cleaningTool: '垃圾夹、推车',
      createBy: 'admin',
      createTime: '2026-03-01 09:30:00',
      updateTime: '2026-03-01 09:30:00',
      cleaningPlanCompleteRate: 50,
      wasteFishingEstimate: 0.3,
    },
    {
      id: '6',
      toiletName: '西溪',
      location: '龙海区锦江道',
      area: '龙海区-石码镇',
      openHours: '全天',
      stallCount: 22.0,
      status: '保洁待执行',
      manager: '王河长',
      responsibilitySection: '龙海桥-污水处理厂段',
      cleaningType: '水域保洁',
      cleaningFrequency: '每日三次',
      cleaningTime: '07:00-09:00,13:00-15:00,17:00-19:00',
      cleaner: '孙姐、周哥',
      cleaningTool: '保洁船',
      createBy: 'admin',
      createTime: '2026-03-01 10:00:00',
      updateTime: '2026-03-01 10:00:00',
      cleaningPlanCompleteRate: 0,
      wasteFishingEstimate: 0.8,
    },

    // ---------- 监测待执行 id7-id9 ----------
    {
      id: '7',
      toiletName: '九龙江',
      location: '芗城区江滨路',
      area: '芗城区-巷口街道',
      openHours: '全天',
      stallCount: 15.5,
      status: '监测待执行',
      manager: '张河长',
      // 监测待执行特有字段（复用现有字段名）
      consumableName: '水质监测',            // 监测类型
      threshold: 7,                           // 监测周期（天）
      cleaningContent: '透明度, 溶解氧, 氨氮', // 监测指标（复用 cleaningContent）
      cleaner: '赵监测员',                    // 监测人员（复用 cleaner）
      cleaningTime: '2026-03-07 10:00:00',    // 计划监测时间（复用 cleaningTime）
      warningStatus: '待执行',                 // 监测状态（复用 warningStatus）
      lastSupplyTime: '2026-02-28 10:00:00',  // 上次监测时间（复用 lastSupplyTime）
      supplyCycle: '2026-03-07 10:00:00',     // 下次监测提醒时间（复用 supplyCycle）
      monitorDataQualifiedRate: 96,            // 监测数据达标率
      warningCount: 1,                         // 预警次数
    },
    {
      id: '8',
      toiletName: '九十九湾',
      location: '龙文区水仙大街',
      area: '龙文区-碧湖街道',
      openHours: '全天',
      stallCount: 8.2,
      status: '监测待执行',
      manager: '李河长',
      consumableName: '异味监测',
      threshold: 5,
      cleaningContent: '异味浓度',
      cleaner: '钱监测员',
      cleaningTime: '2026-03-05 09:00:00',
      warningStatus: '执行中',
      lastSupplyTime: '2026-02-28 09:00:00',
      supplyCycle: '2026-03-05 09:00:00',
      monitorDataQualifiedRate: 100,
      warningCount: 0,
    },
    {
      id: '9',
      toiletName: '西溪',
      location: '龙海区锦江道',
      area: '龙海区-石码镇',
      openHours: '全天',
      stallCount: 22.0,
      status: '监测待执行',
      manager: '王河长',
      consumableName: '水生植物监测',
      threshold: 10,
      cleaningContent: '覆盖度, 种类',
      cleaner: '孙监测员',
      cleaningTime: '2026-03-10 14:00:00',
      warningStatus: '待执行',
      lastSupplyTime: '2026-02-25 14:00:00',
      supplyCycle: '2026-03-10 14:00:00',
      monitorDataQualifiedRate: 90,
      warningCount: 2,
    },

    // ---------- 问题待处置 id10-id12 ----------
    {
      id: '10',
      toiletName: '九龙江',
      location: '芗城区江滨路',
      area: '芗城区-巷口街道',
      openHours: '全天',
      stallCount: 15.5,
      status: '问题待处置',
      manager: '张河长',
      // 问题待处置特有字段（复用现有字段名）
      complaintId: 'PB20250301001',
      complaintType: '垃圾堆积',
      facilityLocation: '中山桥下游200米',      // 问题位置
      complaintContent: '水面漂浮大量垃圾',
      complaintName: '市民张三',
      complaintTime: '2026-03-01 09:20:00',
      phone: '138****1122',
      photoUrl: 'http://example.com/problem1.jpg',
      dept: '河道管理科',                       // 责任部门
      handler: null,
      dispatchTime: null,
      dispatchStatus: '待派单',                   // 处置状态
      isTimeout: false,
    },
    {
      id: '11',
      toiletName: '九十九湾',
      location: '龙文区水仙大街',
      area: '龙文区-碧湖街道',
      openHours: '全天',
      stallCount: 8.2,
      status: '问题待处置',
      manager: '李河长',
      complaintId: 'PB20250301002',
      complaintType: '污水排放',
      facilityLocation: '浦头港桥下',
      complaintContent: '有管道排放黑色污水',
      complaintName: '市民李四',
      complaintTime: '2026-03-01 10:30:00',
      phone: '139****3344',
      photoUrl: 'http://example.com/problem2.jpg',
      dept: '环保科',
      handler: '执法队',
      dispatchTime: '2026-03-01 11:00:00',
      dispatchStatus: '处理中',
      isTimeout: false,
    },
    {
      id: '12',
      toiletName: '西溪',
      location: '龙海区锦江道',
      area: '龙海区-石码镇',
      openHours: '全天',
      stallCount: 22.0,
      status: '问题待处置',
      manager: '王河长',
      complaintId: 'PB20250301003',
      complaintType: '水生植物泛滥',
      facilityLocation: '污水处理厂入口',
      complaintContent: '水葫芦堵塞河道',
      complaintName: '市民王五',
      complaintTime: '2026-03-01 11:10:00',
      phone: '137****5566',
      photoUrl: 'http://example.com/problem3.jpg',
      dept: '河道管理科',
      handler: null,
      dispatchTime: null,
      dispatchStatus: '待派单',
      isTimeout: true,
    },

    // ---------- 已完成 id13-id15 ----------
    {
      id: '13',
      toiletName: '九龙江',
      location: '芗城区江滨路',
      area: '芗城区-巷口街道',
      openHours: '全天',
      stallCount: 15.5,
      status: '已完成',
      manager: '张河长',
      // 已完成特有字段
      taskType: '保洁',
      completeTime: '2026-03-01 16:30:00',
      handler: '李阿姨',
      handleResult: '完成',
      proofUrl: 'http://example.com/proof_clean1.jpg',
      cleaningRate: 99,
      facilityRate: 96,
      wasteFishingVolume: 0.5,
      complaintRate: 100,
      statPeriod: '2026-03-01',
    },
    {
      id: '14',
      toiletName: '九十九湾',
      location: '龙文区水仙大街',
      area: '龙文区-碧湖街道',
      openHours: '全天',
      stallCount: 8.2,
      status: '已完成',
      manager: '李河长',
      taskType: '监测',
      completeTime: '2026-03-01 15:00:00',
      handler: '钱监测员',
      handleResult: '达标',
      proofUrl: 'http://example.com/proof_monitor2.jpg',
      cleaningRate: null,
      facilityRate: 95,
      wasteFishingVolume: null,
      complaintRate: null,
      statPeriod: '2026-03-01',
    },
    {
      id: '15',
      toiletName: '西溪',
      location: '龙海区锦江道',
      area: '龙海区-石码镇',
      openHours: '全天',
      stallCount: 22.0,
      status: '已完成',
      manager: '王河长',
      taskType: '问题处置',
      completeTime: '2026-03-01 17:20:00',
      handler: '执法队',
      handleResult: '办结',
      proofUrl: 'http://example.com/proof_problem3.jpg',
      cleaningRate: null,
      facilityRate: null,
      wasteFishingVolume: null,
      complaintRate: 100,
      statPeriod: '2026-03-01',
    },
  ];
};
