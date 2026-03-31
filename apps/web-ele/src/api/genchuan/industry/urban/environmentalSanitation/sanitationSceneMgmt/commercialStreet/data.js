import { baseRequestClient, requestClient } from '#/api/request';
import { useAccessStore } from '@vben/stores';

// 分页查询（全部）
export function getCommercialStreetPage(params) {
  return requestClient.get('/envirhealth/commercial-street/detail-page', { params });
}

// 新增
export function createCommercialStreet(data) {
  return requestClient.post('/envirhealth/commercial-street/create', data);
}

// 修改
export function updateCommercialStreet(data) {
  return requestClient.put('/envirhealth/commercial-street/update', data);
}

// 单个删除
export function deleteCommercialStreet(id) {
  return requestClient.delete(`/envirhealth/commercial-street/delete?id=${id}`);
}

// 批量删除
export function deleteCommercialStreetBatch(ids) {
  return requestClient.delete('/envirhealth/commercial-street/delete-batch', { data: ids });
}

// 导出 Excel
export function exportCommercialStreetExcel(params) {
  const accessStore = useAccessStore();
  return baseRequestClient.get('/envirhealth/commercial-street/export-excel', {
    params,
    responseType: 'blob',
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

export function getCommercialStreetChartAll() {
  return requestClient.get('/envirhealth/commercial-street');
}

// 模拟商业街环境管理数据
export const dataList = () => {
  return [
    // ---------- 全部（商业街基础信息）id1-id3 ----------
    {
      id: '1',
      toiletName: '中山路商业街',
      location: '芗城区中山路88号',
      area: '芗城区-巷口街道',
      openHours: '全天开放',
      stallCount: 30, // 垃圾收集点位数量（复用）
      status: '正常运营',
      manager: '张三',
      // 全部特有字段
      cleaningRate: 98.5, // 保洁覆盖率（复用）
      facilityRate: 95.2, // 设施完好率（复用）
      disposalDuration: 45, // 问题平均处置时长（分钟）
      collectionCompleteRate: 100, // 收运完成率
      cleaningFrequency: '每日四次', // 保洁频次
      transferInterval: 2, // 垃圾清运间隔（小时）
    },
    {
      id: '2',
      toiletName: '延安路商业街',
      location: '龙文区延安路256号',
      area: '龙文区-碧湖街道',
      openHours: '全天开放',
      stallCount: 45,
      status: '正常运营',
      manager: '李华',
      cleaningRate: 96.0,
      facilityRate: 93.8,
      disposalDuration: 30,
      collectionCompleteRate: 98,
      cleaningFrequency: '每日六次',
      transferInterval: 1.5,
    },
    {
      id: '3',
      toiletName: '瑞京路商业街',
      location: '龙海区瑞京路12号',
      area: '龙海区-石码镇',
      openHours: '08:00-23:00',
      stallCount: 25,
      status: '部分停运',
      manager: '王强',
      cleaningRate: 88.0,
      facilityRate: 82.5,
      disposalDuration: 60,
      collectionCompleteRate: 90,
      cleaningFrequency: '每日三次',
      transferInterval: 3,
    },

    // ---------- 保洁待执行 id4-id6 ----------
    {
      id: '4',
      toiletName: '中山路商业街',
      location: '芗城区中山路88号',
      area: '芗城区-巷口街道',
      openHours: '全天开放',
      stallCount: 30,
      status: '保洁待执行',
      manager: '张三',
      // 保洁待执行特有字段
      cleaningFrequency: '每日四次',
      patrolInterval: 30, // 巡回保洁间隔（分钟）
      cleaningTime: '08:00-10:00,12:00-14:00,17:00-19:00,21:00-23:00',
      cleaner: '李阿姨、王阿姨、赵姐',
      responsibilityArea: 'A段（1-100号）、B段（101-200号）',
      createBy: 'admin',
      createTime: '2026-03-01 08:00:00',
      updateTime: '2026-03-01 08:00:00',
      isEffective: true,
    },
    {
      id: '5',
      toiletName: '延安路商业街',
      location: '龙文区延安路256号',
      area: '龙文区-碧湖街道',
      openHours: '全天开放',
      stallCount: 45,
      status: '保洁待执行',
      manager: '李华',
      cleaningFrequency: '每日六次',
      patrolInterval: 20,
      cleaningTime: '07:00-09:00,11:00-13:00,15:00-17:00,19:00-21:00,22:00-24:00',
      cleaner: '赵叔、钱婶',
      responsibilityArea: '南段、北段',
      createBy: 'admin',
      createTime: '2026-03-01 09:30:00',
      updateTime: '2026-03-01 09:30:00',
      isEffective: true,
    },
    {
      id: '6',
      toiletName: '瑞京路商业街',
      location: '龙海区瑞京路12号',
      area: '龙海区-石码镇',
      openHours: '08:00-23:00',
      stallCount: 25,
      status: '保洁待执行',
      manager: '王强',
      cleaningFrequency: '每日三次',
      patrolInterval: 40,
      cleaningTime: '09:00-11:00,14:00-16:00,19:00-21:00',
      cleaner: '孙姐',
      responsibilityArea: '主街全段',
      createBy: 'admin',
      createTime: '2026-03-01 10:00:00',
      updateTime: '2026-03-01 10:00:00',
      isEffective: true,
    },

    // ---------- 收运待执行 id7-id9 ----------
    {
      id: '7',
      toiletName: '中山路商业街',
      location: '芗城区中山路88号',
      area: '芗城区-巷口街道',
      openHours: '全天开放',
      stallCount: 30,
      status: '收运待执行',
      manager: '张三',
      // 收运待执行特有字段
      collectionPoints: 30, // 垃圾收集点位数量
      transferInterval: 2,
      collectionTime: '10:00,14:00,18:00,22:00',
      vehicle: '闽E12345',
      staff: '李司机、王跟车',
      planStatus: '待执行',
      createBy: 'admin',
      createTime: '2026-03-01 08:30:00',
      updateTime: '2026-03-01 08:30:00',
      collectionCompleteRate: 85, // 收运计划完成率
      abnormalCount: 1,
    },
    {
      id: '8',
      toiletName: '延安路商业街',
      location: '龙文区延安路256号',
      area: '龙文区-碧湖街道',
      openHours: '全天开放',
      stallCount: 45,
      status: '收运待执行',
      manager: '李华',
      collectionPoints: 45,
      transferInterval: 1.5,
      collectionTime: '09:00,12:00,15:00,18:00,21:00,23:00',
      vehicle: '闽E67890',
      staff: '张司机',
      planStatus: '执行中',
      createBy: 'admin',
      createTime: '2026-03-01 09:00:00',
      updateTime: '2026-03-01 09:15:00',
      collectionCompleteRate: 60,
      abnormalCount: 0,
    },
    {
      id: '9',
      toiletName: '瑞京路商业街',
      location: '龙海区瑞京路12号',
      area: '龙海区-石码镇',
      openHours: '08:00-23:00',
      stallCount: 25,
      status: '收运待执行',
      manager: '王强',
      collectionPoints: 25,
      transferInterval: 3,
      collectionTime: '11:00,16:00,21:00',
      vehicle: '闽E24680',
      staff: '刘司机',
      planStatus: '待执行',
      createBy: 'admin',
      createTime: '2026-03-01 10:30:00',
      updateTime: '2026-03-01 10:30:00',
      collectionCompleteRate: 0,
      abnormalCount: 2,
    },

    // ---------- 设施待维护 id10-id12 ----------
    {
      id: '10',
      toiletName: '中山路商业街',
      location: '芗城区中山路88号',
      area: '芗城区-巷口街道',
      openHours: '全天开放',
      stallCount: 30,
      status: '设施待维护',
      manager: '张三',
      // 设施待维护特有字段
      repairId: 'MT20250301001',
      facilityType: '垃圾桶',
      facilityLocation: 'A段50号门前',
      damageDesc: '桶体破损，门盖脱落',
      reportBy: '巡查员小李',
      reportTime: '2026-03-01 09:20:00',
      photoUrl: 'http://example.com/facility1.jpg',
      repairBy: null,
      dispatchTime: null,
      repairStatus: '待派单',
      expectedCompleteTime: '2026-03-02 18:00:00',
    },
    {
      id: '11',
      toiletName: '延安路商业街',
      location: '龙文区延安路256号',
      area: '龙文区-碧湖街道',
      openHours: '全天开放',
      stallCount: 45,
      status: '设施待维护',
      manager: '李华',
      repairId: 'MT20250301002',
      facilityType: '路灯',
      facilityLocation: '北段120号',
      damageDesc: '路灯不亮，闪烁',
      reportBy: '商户王老板',
      reportTime: '2026-03-01 10:10:00',
      photoUrl: 'http://example.com/facility2.jpg',
      repairBy: '电工组',
      dispatchTime: '2026-03-01 10:40:00',
      repairStatus: '维修中',
      expectedCompleteTime: '2026-03-01 18:00:00',
    },
    {
      id: '12',
      toiletName: '瑞京路商业街',
      location: '龙海区瑞京路12号',
      area: '龙海区-石码镇',
      openHours: '08:00-23:00',
      stallCount: 25,
      status: '设施待维护',
      manager: '王强',
      repairId: 'MT20250301003',
      facilityType: '休息座椅',
      facilityLocation: '主街广场',
      damageDesc: '座椅木板断裂',
      reportBy: '保洁员孙姐',
      reportTime: '2026-03-01 11:00:00',
      photoUrl: 'http://example.com/facility3.jpg',
      repairBy: null,
      dispatchTime: null,
      repairStatus: '待派单',
      expectedCompleteTime: '2026-03-02 12:00:00',
    },

    // ---------- 问题待处置 id13-id15 ----------
    {
      id: '13',
      toiletName: '中山路商业街',
      location: '芗城区中山路88号',
      area: '芗城区-巷口街道',
      openHours: '全天开放',
      stallCount: 30,
      status: '问题待处置',
      manager: '张三',
      // 问题待处置特有字段
      complaintId: 'PB20250301001',
      complaintType: '垃圾堆积',
      problemLocation: 'A段30号餐饮店门口',
      complaintContent: '垃圾袋破裂，污水横流',
      complaintName: '路人张先生',
      complaintTime: '2026-03-01 12:30:00',
      phone: '138****1122',
      photoUrl: 'http://example.com/problem1.jpg',
      handler: null,
      dispatchTime: null,
      handleStatus: '待派单',
      disposalDuration: null,
      handleResult: null,
    },
    {
      id: '14',
      toiletName: '延安路商业街',
      location: '龙文区延安路256号',
      area: '龙文区-碧湖街道',
      openHours: '全天开放',
      stallCount: 45,
      status: '问题待处置',
      manager: '李华',
      complaintId: 'PB20250301002',
      complaintType: '占道经营',
      problemLocation: '南段80号',
      complaintContent: '商铺货架占用人行道',
      complaintName: '城管巡查员',
      complaintTime: '2026-03-01 14:20:00',
      phone: '139****3344',
      photoUrl: 'http://example.com/problem2.jpg',
      handler: '执法队',
      dispatchTime: '2026-03-01 14:50:00',
      handleStatus: '处理中',
      disposalDuration: 30,
      handleResult: null,
    },
    {
      id: '15',
      toiletName: '瑞京路商业街',
      location: '龙海区瑞京路12号',
      area: '龙海区-石码镇',
      openHours: '08:00-23:00',
      stallCount: 25,
      status: '问题待处置',
      manager: '王强',
      complaintId: 'PB20250301003',
      complaintType: '乱张贴',
      problemLocation: '主街中段墙面',
      complaintContent: '大量小广告乱贴',
      complaintName: '保洁员孙姐',
      complaintTime: '2026-03-01 15:10:00',
      phone: '137****5566',
      photoUrl: 'http://example.com/problem3.jpg',
      handler: null,
      dispatchTime: null,
      handleStatus: '待派单',
      disposalDuration: null,
      handleResult: null,
    },

    // ---------- 已完成 id16-id18 ----------
    {
      id: '16',
      toiletName: '中山路商业街',
      location: '芗城区中山路88号',
      area: '芗城区-巷口街道',
      openHours: '全天开放',
      stallCount: 30,
      status: '已完成',
      manager: '张三',
      // 已完成特有字段
      taskType: '保洁',
      completeTime: '2026-03-01 23:30:00',
      handler: '李阿姨',
      handleResult: '完成',
      proofUrl: 'http://example.com/proof_clean1.jpg',
      cleaningCoverage: 100, // 保洁覆盖率
      facilityRate: 96.5, // 设施完好率
      collectionCompleteRate: 100, // 收运完成率
      statPeriod: '2026-03-01',
      manageScore: 98, // 综合管理评分
    },
    {
      id: '17',
      toiletName: '延安路商业街',
      location: '龙文区延安路256号',
      area: '龙文区-碧湖街道',
      openHours: '全天开放',
      stallCount: 45,
      status: '已完成',
      manager: '李华',
      taskType: '收运',
      completeTime: '2026-03-01 23:00:00',
      handler: '张司机',
      handleResult: '完成',
      proofUrl: 'http://example.com/proof_collect2.jpg',
      cleaningCoverage: 98,
      facilityRate: 94.0,
      collectionCompleteRate: 98,
      statPeriod: '2026-03-01',
      manageScore: 96,
    },
    {
      id: '18',
      toiletName: '瑞京路商业街',
      location: '龙海区瑞京路12号',
      area: '龙海区-石码镇',
      openHours: '08:00-23:00',
      stallCount: 25,
      status: '已完成',
      manager: '王强',
      taskType: '设施维护',
      completeTime: '2026-03-01 17:30:00',
      handler: '电工组',
      handleResult: '已修复',
      proofUrl: 'http://example.com/proof_maintain3.jpg',
      cleaningCoverage: 92,
      facilityRate: 88.5,
      collectionCompleteRate: 95,
      statPeriod: '2026-03-01',
      manageScore: 90,
    },
  ];
};
