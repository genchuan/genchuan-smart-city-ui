import { baseRequestClient, requestClient } from '#/api/request';
import { useAccessStore } from '@vben/stores';

// 分页查询（全部）
export function getUrbanVillagePage(params) {
  return requestClient.get('/envirhealth/urban-village/detail-page', { params });
}

// 新增
export function createUrbanVillage(data) {
  return requestClient.post('/envirhealth/urban-village/create', data);
}

// 修改
export function updateUrbanVillage(data) {
  return requestClient.put('/envirhealth/urban-village/update', data);
}

// 单个删除
export function deleteUrbanVillage(id) {
  return requestClient.delete(`/envirhealth/urban-village/delete?id=${id}`);
}

// 批量删除
export function deleteUrbanVillageBatch(ids) {
  return requestClient.delete('/envirhealth/urban-village/delete-batch', { data: ids });
}

// 导出 Excel
export function exportUrbanVillageExcel(params) {
  const accessStore = useAccessStore();
  return baseRequestClient.get('/envirhealth/urban-village/export-excel', {
    params,
    responseType: 'blob',
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

export function getUrbanVillageChartDashboard() {
  return requestClient.get('/envirhealth/urban-village/chart/dashboard');
}

// 模拟城中村环境管理数据
export const dataList = () => {
  return [
    // ---------- 全部（城中村基础信息）id1-id3 ----------
    {
      id: '1',
      toiletName: '上街村',
      location: '芗城区上街路88号',
      area: '芗城区-巷口街道',
      openHours: '全天开放',
      stallCount: 12, // 责任区域数（复用）
      status: '正常运营',
      manager: '张村长',
      // 全部特有字段
      cleaningRate: 96.5,
      problemRate: 95.0,
      reviewPassRate: 98.0,
      assessmentScore: 92,
      roadCleaningFrequency: '每日两次',
    },
    {
      id: '2',
      toiletName: '下街村',
      location: '龙文区下街路256号',
      area: '龙文区-碧湖街道',
      openHours: '全天开放',
      stallCount: 18,
      status: '正常运营',
      manager: '李村长',
      cleaningRate: 94.0,
      problemRate: 92.5,
      reviewPassRate: 96.0,
      assessmentScore: 88,
      roadCleaningFrequency: '每日三次',
    },
    {
      id: '3',
      toiletName: '石亭村',
      location: '龙海区石亭镇12号',
      area: '龙海区-石码镇',
      openHours: '07:00-19:00',
      stallCount: 8,
      status: '部分停运',
      manager: '王村长',
      cleaningRate: 82.0,
      problemRate: 85.0,
      reviewPassRate: 90.0,
      assessmentScore: 75,
      roadCleaningFrequency: '每日一次',
    },

    // ---------- 保洁待执行 id4-id6 ----------
    {
      id: '4',
      toiletName: '上街村',
      location: '芗城区上街路88号',
      area: '芗城区-巷口街道',
      openHours: '全天开放',
      stallCount: 12,
      status: '保洁待执行',
      manager: '张村长',
      // 保洁待执行特有字段
      responsibilityArea: '上街路北段、横巷',
      roadCleaningFrequency: '每日两次',
      cleaningTime: '07:00-09:00,14:00-16:00',
      cleaningStandard: '一级标准',
      staff: '李阿姨、王阿姨',
      planStatus: '待执行',
      createBy: 'admin',
      createTime: '2026-03-01 08:00:00',
      updateTime: '2026-03-01 08:00:00',
      cleaningPlanCompleteRate: 0,
      cleaningRate: 96.5,
    },
    {
      id: '5',
      toiletName: '下街村',
      location: '龙文区下街路256号',
      area: '龙文区-碧湖街道',
      openHours: '全天开放',
      stallCount: 18,
      status: '保洁待执行',
      manager: '李村长',
      responsibilityArea: '下街路全段、巷内',
      roadCleaningFrequency: '每日三次',
      cleaningTime: '08:00-10:00,13:00-15:00,18:00-20:00',
      cleaningStandard: '一级标准',
      staff: '赵叔、钱婶',
      planStatus: '执行中',
      createBy: 'admin',
      createTime: '2026-03-01 09:30:00',
      updateTime: '2026-03-01 09:30:00',
      cleaningPlanCompleteRate: 60,
      cleaningRate: 94.0,
    },
    {
      id: '6',
      toiletName: '石亭村',
      location: '龙海区石亭镇12号',
      area: '龙海区-石码镇',
      openHours: '07:00-19:00',
      stallCount: 8,
      status: '保洁待执行',
      manager: '王村长',
      responsibilityArea: '主街、菜市场周边',
      roadCleaningFrequency: '每日一次',
      cleaningTime: '09:00-11:00',
      cleaningStandard: '二级标准',
      staff: '孙姐',
      planStatus: '待执行',
      createBy: 'admin',
      createTime: '2026-03-01 10:00:00',
      updateTime: '2026-03-01 10:00:00',
      cleaningPlanCompleteRate: 0,
      cleaningRate: 82.0,
    },

    // ---------- 问题待处置 id7-id9 ----------
    {
      id: '7',
      toiletName: '上街村',
      location: '芗城区上街路88号',
      area: '芗城区-巷口街道',
      openHours: '全天开放',
      stallCount: 12,
      status: '问题待处置',
      manager: '张村长',
      // 问题待处置特有字段（复用 complaintId 等）
      complaintId: 'PB20250301001',
      complaintType: '垃圾堆积',
      problemLocation: '上街路北段巷口',
      complaintContent: '垃圾桶满溢，未及时清运',
      complaintName: '村民张三',
      complaintTime: '2026-03-01 09:20:00',
      phone: '138****1122',
      photoUrl: 'http://example.com/problem1.jpg',
      dept: '环卫科',
      handler: null,
      dispatchTime: null,
      handleStatus: '待派单',
      isTimeout: false,
    },
    {
      id: '8',
      toiletName: '下街村',
      location: '龙文区下街路256号',
      area: '龙文区-碧湖街道',
      openHours: '全天开放',
      stallCount: 18,
      status: '问题待处置',
      manager: '李村长',
      complaintId: 'PB20250301002',
      complaintType: '乱堆放',
      problemLocation: '下街路中段',
      complaintContent: '建筑垃圾乱堆放',
      complaintName: '村民李四',
      complaintTime: '2026-03-01 10:30:00',
      phone: '139****3344',
      photoUrl: 'http://example.com/problem2.jpg',
      dept: '城管科',
      handler: '执法队',
      dispatchTime: '2026-03-01 11:00:00',
      handleStatus: '处理中',
      isTimeout: false,
    },
    {
      id: '9',
      toiletName: '石亭村',
      location: '龙海区石亭镇12号',
      area: '龙海区-石码镇',
      openHours: '07:00-19:00',
      stallCount: 8,
      status: '问题待处置',
      manager: '王村长',
      complaintId: 'PB20250301003',
      complaintType: '乱张贴',
      problemLocation: '石亭村主街墙面',
      complaintContent: '大量小广告乱贴',
      complaintName: '村民王五',
      complaintTime: '2026-03-01 11:10:00',
      phone: '137****5566',
      photoUrl: 'http://example.com/problem3.jpg',
      dept: '环卫科',
      handler: null,
      dispatchTime: null,
      handleStatus: '待派单',
      isTimeout: true,
    },

    // ---------- 处置待复核 id10-id12 ----------
    {
      id: '10',
      toiletName: '上街村',
      location: '芗城区上街路88号',
      area: '芗城区-巷口街道',
      openHours: '全天开放',
      stallCount: 12,
      status: '处置待复核',
      manager: '张村长',
      // 处置待复核特有字段（复用 repairId 等）
      repairId: 'RV20250301001', // 复核编号
      complaintType: '垃圾堆积',
      problemLocation: '上街路北段巷口',
      handleBy: '张三丰',
      handleTime: '2026-03-01 14:20:00',
      handleDesc: '已清运垃圾，现场已打扫',
      reformPhotoUrl: 'http://example.com/reform1.jpg',
      reviewBy: null,
      reviewTime: null,
      reviewResult: null,
      reviewOpinion: null,
      reviewPassRate: null,
    },
    {
      id: '11',
      toiletName: '下街村',
      location: '龙文区下街路256号',
      area: '龙文区-碧湖街道',
      openHours: '全天开放',
      stallCount: 18,
      status: '处置待复核',
      manager: '李村长',
      repairId: 'RV20250301002',
      complaintType: '乱堆放',
      problemLocation: '下街路中段',
      handleBy: '李元霸',
      handleTime: '2026-03-01 15:10:00',
      handleDesc: '已清理建筑垃圾',
      reformPhotoUrl: 'http://example.com/reform2.jpg',
      reviewBy: '审核组',
      reviewTime: '2026-03-01 16:00:00',
      reviewResult: '通过',
      reviewOpinion: '合格',
      reviewPassRate: 96,
    },
    {
      id: '12',
      toiletName: '石亭村',
      location: '龙海区石亭镇12号',
      area: '龙海区-石码镇',
      openHours: '07:00-19:00',
      stallCount: 8,
      status: '处置待复核',
      manager: '王村长',
      repairId: 'RV20250301003',
      complaintType: '乱张贴',
      problemLocation: '石亭村主街墙面',
      handleBy: '王麻子',
      handleTime: '2026-03-01 15:30:00',
      handleDesc: '已清理小广告',
      reformPhotoUrl: 'http://example.com/reform3.jpg',
      reviewBy: null,
      reviewTime: null,
      reviewResult: null,
      reviewOpinion: null,
      reviewPassRate: 90,
    },

    // ---------- 已完成 id13-id15 ----------
    {
      id: '13',
      toiletName: '上街村',
      location: '芗城区上街路88号',
      area: '芗城区-巷口街道',
      openHours: '全天开放',
      stallCount: 12,
      status: '已完成',
      manager: '张村长',
      // 已完成特有字段
      taskType: '保洁',
      completeTime: '2026-03-01 16:30:00',
      handler: '李阿姨',
      handleResult: '完成',
      proofUrl: 'http://example.com/proof_clean1.jpg',
      cleaningRate: 98,
      problemRate: null,
      reviewPassRate: null,
      statPeriod: '2026-03-01',
      assessmentScore: 95,
    },
    {
      id: '14',
      toiletName: '下街村',
      location: '龙文区下街路256号',
      area: '龙文区-碧湖街道',
      openHours: '全天开放',
      stallCount: 18,
      status: '已完成',
      manager: '李村长',
      taskType: '问题处置',
      completeTime: '2026-03-01 17:00:00',
      handler: '执法队',
      handleResult: '办结',
      proofUrl: 'http://example.com/proof_problem2.jpg',
      cleaningRate: null,
      problemRate: 100,
      reviewPassRate: null,
      statPeriod: '2026-03-01',
      assessmentScore: 90,
    },
    {
      id: '15',
      toiletName: '石亭村',
      location: '龙海区石亭镇12号',
      area: '龙海区-石码镇',
      openHours: '07:00-19:00',
      stallCount: 8,
      status: '已完成',
      manager: '王村长',
      taskType: '复核',
      completeTime: '2026-03-01 17:20:00',
      handler: '审核组',
      handleResult: '通过',
      proofUrl: 'http://example.com/proof_review3.jpg',
      cleaningRate: null,
      problemRate: null,
      reviewPassRate: 95,
      statPeriod: '2026-03-01',
      assessmentScore: 80,
    },
  ];
};
