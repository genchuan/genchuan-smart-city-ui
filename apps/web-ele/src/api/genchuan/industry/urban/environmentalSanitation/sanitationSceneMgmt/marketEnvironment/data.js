import { baseRequestClient, requestClient } from '#/api/request';
import { useAccessStore } from '@vben/stores';

// 分页查询（全部）
export function getMarketPage(params) {
  return requestClient.get('/envirhealth/market/detail-page', { params });
}

// 新增
export function createMarket(data) {
  return requestClient.post('/envirhealth/market/create', data);
}

// 修改
export function updateMarket(data) {
  return requestClient.put('/envirhealth/market/update', data);
}

// 单个删除
export function deleteMarket(id) {
  return requestClient.delete(`/envirhealth/market/delete?id=${id}`);
}

// 批量删除
export function deleteMarketBatch(ids) {
  return requestClient.delete('/envirhealth/market/delete-batch', { data: ids });
}

// 导出 Excel
export function exportMarketExcel(params) {
  const accessStore = useAccessStore();
  return baseRequestClient.get('/envirhealth/market/export-excel', {
    params,
    responseType: 'blob',
    headers: {
      Authorization: accessStore.accessToken ? `Bearer ${accessStore.accessToken}` : undefined,
    },
  });
}

/**
 * 获取集贸市场统计数据
 */
export function getMarketChartDashboard() {
  return requestClient.get('/envirhealth/market/chart/dashboard');
}

// 模拟集贸市场环境管理数据
export const dataList = () => {
  return [
    // ---------- 全部（市场基础信息）id1-id3 ----------
    {
      id: '1',
      toiletName: '北桥市场',
      location: '芗城区北桥路88号',
      area: '芗城区-巷口街道',
      openHours: '05:00-20:00',
      stallCount: 120,
      status: '正常运营',
      manager: '张经理',
      // 全部特有字段
      hygieneRate: 98.5,        // 卫生达标率
      wasteTransferRate: 100,    // 收运完成率
      sewageRate: 96.0,          // 污水处置合格率
      unfinishedTaskCount: 2,    // 未完成任务数
    },
    {
      id: '2',
      toiletName: '延通市场',
      location: '龙文区延通路256号',
      area: '龙文区-碧湖街道',
      openHours: '06:00-19:00',
      stallCount: 85,
      status: '正常运营',
      manager: '李经理',
      hygieneRate: 96.0,
      wasteTransferRate: 98,
      sewageRate: 94.5,
      unfinishedTaskCount: 1,
    },
    {
      id: '3',
      toiletName: '石码农贸市场',
      location: '龙海区人民路12号',
      area: '龙海区-石码镇',
      openHours: '04:00-18:00',
      stallCount: 60,
      status: '部分停运',
      manager: '王经理',
      hygieneRate: 88.0,
      wasteTransferRate: 90,
      sewageRate: 85.0,
      unfinishedTaskCount: 4,
    },

    // ---------- 保洁待执行 id4-id6 ----------
    {
      id: '4',
      toiletName: '北桥市场',
      location: '芗城区北桥路88号',
      area: '芗城区-巷口街道',
      openHours: '05:00-20:00',
      stallCount: 120,
      status: '保洁待执行',
      manager: '张经理',
      // 保洁待执行特有字段
      cleaningFrequency: '每日四次',
      cleaningTime: '06:00-08:00,10:00-12:00,14:00-16:00,18:00-20:00',
      cleaningArea: '蔬菜区、肉类区、水产区',
      cleaner: '李阿姨、王阿姨、赵姐',
      cleaningStandard: '一级标准',
      createBy: 'admin',
      createTime: '2026-03-01 08:00:00',
      updateTime: '2026-03-01 08:00:00',
      isEffective: true,
      cleaningPlanCompleteRate: 0,  // 计划完成率
    },
    {
      id: '5',
      toiletName: '延通市场',
      location: '龙文区延通路256号',
      area: '龙文区-碧湖街道',
      openHours: '06:00-19:00',
      stallCount: 85,
      status: '保洁待执行',
      manager: '李经理',
      cleaningFrequency: '每日三次',
      cleaningTime: '07:00-09:00,12:00-14:00,17:00-19:00',
      cleaningArea: '干货区、熟食区、公共通道',
      cleaner: '钱叔、孙婶',
      cleaningStandard: '一级标准',
      createBy: 'admin',
      createTime: '2026-03-01 09:30:00',
      updateTime: '2026-03-01 09:30:00',
      isEffective: true,
      cleaningPlanCompleteRate: 50,
    },
    {
      id: '6',
      toiletName: '石码农贸市场',
      location: '龙海区人民路12号',
      area: '龙海区-石码镇',
      openHours: '04:00-18:00',
      stallCount: 60,
      status: '保洁待执行',
      manager: '王经理',
      cleaningFrequency: '每日两次',
      cleaningTime: '05:00-07:00,15:00-17:00',
      cleaningArea: '全部区域',
      cleaner: '周姐',
      cleaningStandard: '二级标准',
      createBy: 'admin',
      createTime: '2026-03-01 10:00:00',
      updateTime: '2026-03-01 10:00:00',
      isEffective: true,
      cleaningPlanCompleteRate: 0,
    },

    // ---------- 收运待执行 id7-id9 ----------
    {
      id: '7',
      toiletName: '北桥市场',
      location: '芗城区北桥路88号',
      area: '芗城区-巷口街道',
      openHours: '05:00-20:00',
      stallCount: 120,
      status: '收运待执行',
      manager: '张经理',
      // 收运待执行特有字段（复用现有字段名）
      consumableName: '厨余垃圾',          // 垃圾类型
      currentStock: 30,                    // 收集容器数量
      threshold: 2,                         // 收运间隔（小时）
      lastSupplyTime: '09:00,14:00,19:00', // 收运时段
      repairBy: '闽E12345',                 // 负责车辆（复用repairBy）
      handler: '张司机、李跟车',            // 负责人员（复用handler）
      createBy: 'admin',
      createTime: '2026-03-01 08:30:00',
      updateTime: '2026-03-01 08:30:00',
      wasteTransferCompleteRate: 0,          // 收运完成率
    },
    {
      id: '8',
      toiletName: '延通市场',
      location: '龙文区延通路256号',
      area: '龙文区-碧湖街道',
      openHours: '06:00-19:00',
      stallCount: 85,
      status: '收运待执行',
      manager: '李经理',
      consumableName: '其他垃圾',
      currentStock: 20,
      threshold: 3,
      lastSupplyTime: '10:00,16:00',
      repairBy: '闽E67890',
      handler: '王司机',
      createBy: 'admin',
      createTime: '2026-03-01 09:20:00',
      updateTime: '2026-03-01 09:20:00',
      wasteTransferCompleteRate: 30,
    },
    {
      id: '9',
      toiletName: '石码农贸市场',
      location: '龙海区人民路12号',
      area: '龙海区-石码镇',
      openHours: '04:00-18:00',
      stallCount: 60,
      status: '收运待执行',
      manager: '王经理',
      consumableName: '可回收物',
      currentStock: 15,
      threshold: 4,
      lastSupplyTime: '08:00,13:00',
      repairBy: '闽E24680',
      handler: '刘司机',
      createBy: 'admin',
      createTime: '2026-03-01 10:15:00',
      updateTime: '2026-03-01 10:15:00',
      wasteTransferCompleteRate: 0,
    },

    // ---------- 污水待处置 id10-id12 ----------
    {
      id: '10',
      toiletName: '北桥市场',
      location: '芗城区北桥路88号',
      area: '芗城区-巷口街道',
      openHours: '05:00-20:00',
      stallCount: 120,
      status: '污水待处置',
      manager: '张经理',
      // 污水待处置特有字段（复用投诉待处置字段）
      complaintId: 'SW20250301001',           // 问题编号
      sewageDischargeArea: '水产区',           // 污水排放区域（新增，但可映射到facilityLocation）
      complaintType: '隔油池清理',             // 污水处置方式（复用complaintType）
      sewageCleaningFrequency: '每日两次',     // 清理频次（可映射到cleaningFrequency）
      complaintName: '赵师傅',                 // 负责人员（复用complaintName）
      complaintTime: '2026-03-01 11:00:00',   // 上次清理时间（复用complaintTime）
      handleStatus: '待处置',                   // 处置状态（复用dispatchStatus）
      nextCleaningTime: '2026-03-02 11:00:00', // 下次清理时间
      sewageRate: 96,                          // 污水处置合格率
      disposalLog: '3月1日已清理，运行正常',     // 处置日志（复用damageDesc）
    },
    {
      id: '11',
      toiletName: '延通市场',
      location: '龙文区延通路256号',
      area: '龙文区-碧湖街道',
      openHours: '06:00-19:00',
      stallCount: 85,
      status: '污水待处置',
      manager: '李经理',
      complaintId: 'SW20250301002',
      sewageDischargeArea: '肉类区',
      complaintType: '明沟疏通',
      sewageCleaningFrequency: '每日一次',
      complaintName: '钱师傅',
      complaintTime: '2026-03-01 10:30:00',
      handleStatus: '处置中',
      nextCleaningTime: '2026-03-02 10:30:00',
      sewageRate: 94,
      disposalLog: '正在疏通中',
    },
    {
      id: '12',
      toiletName: '石码农贸市场',
      location: '龙海区人民路12号',
      area: '龙海区-石码镇',
      openHours: '04:00-18:00',
      stallCount: 60,
      status: '污水待处置',
      manager: '王经理',
      complaintId: 'SW20250301003',
      sewageDischargeArea: '活禽区',
      complaintType: '沉淀池清理',
      sewageCleaningFrequency: '每日两次',
      complaintName: '孙师傅',
      complaintTime: '2026-03-01 09:45:00',
      handleStatus: '待处置',
      nextCleaningTime: '2026-03-02 09:45:00',
      sewageRate: 85,
      disposalLog: '沉淀物较多，需及时清理',
    },

    // ---------- 卫生待核查 id13-id15 ----------
    {
      id: '13',
      toiletName: '北桥市场',
      location: '芗城区北桥路88号',
      area: '芗城区-巷口街道',
      openHours: '05:00-20:00',
      stallCount: 120,
      status: '卫生待核查',
      manager: '张经理',
      // 卫生待核查特有字段（复用设施待维修字段）
      repairId: 'HC20250301001',           // 核查编号
      facilityType: '收摊后',               // 核查时段（复用facilityType）
      facilityLocation: '李检查员',         // 核查人员（复用facilityLocation）
      reportTime: '2026-03-01 18:00:00',   // 核查日期（复用reportTime）
      damageDesc: '水产区地面积水',         // 前期问题（复用damageDesc）
      repairStatus: '待核查',                // 核查结果（复用repairStatus）
      qualifiedItemCount: 18,                // 达标项数
      unqualifiedItemCount: 2,               // 不达标项数
      hygieneRate: 90,                        // 卫生达标率
      expectedCompleteTime: '2026-03-02',     // 整改期限（复用expectedCompleteTime）
      reformRequire: '疏通排水，保持干燥',     // 整改要求
    },
    {
      id: '14',
      toiletName: '延通市场',
      location: '龙文区延通路256号',
      area: '龙文区-碧湖街道',
      openHours: '06:00-19:00',
      stallCount: 85,
      status: '卫生待核查',
      manager: '李经理',
      repairId: 'HC20250301002',
      facilityType: '开市前',
      facilityLocation: '王检查员',
      reportTime: '2026-03-01 06:00:00',
      damageDesc: '熟食区未遮盖',
      repairStatus: '已达标',
      qualifiedItemCount: 20,
      unqualifiedItemCount: 0,
      hygieneRate: 100,
      expectedCompleteTime: null,
      reformRequire: null,
    },
    {
      id: '15',
      toiletName: '石码农贸市场',
      location: '龙海区人民路12号',
      area: '龙海区-石码镇',
      openHours: '04:00-18:00',
      stallCount: 60,
      status: '卫生待核查',
      manager: '王经理',
      repairId: 'HC20250301003',
      facilityType: '收摊后',
      facilityLocation: '张检查员',
      reportTime: '2026-03-01 17:30:00',
      damageDesc: '垃圾收集点满溢',
      repairStatus: '待核查',
      qualifiedItemCount: 15,
      unqualifiedItemCount: 3,
      hygieneRate: 83,
      expectedCompleteTime: '2026-03-02',
      reformRequire: '增加清运频次',
    },

    // ---------- 已完成 id16-id18 ----------
    {
      id: '16',
      toiletName: '北桥市场',
      location: '芗城区北桥路88号',
      area: '芗城区-巷口街道',
      openHours: '05:00-20:00',
      stallCount: 120,
      status: '已完成',
      manager: '张经理',
      // 已完成特有字段
      taskType: '保洁',
      completeTime: '2026-03-01 20:30:00',
      handler: '李阿姨',
      handleResult: '完成',
      proofUrl: 'http://example.com/proof_clean1.jpg',
      hygieneRate: 99,
      wasteTransferCompleteRate: null,
      sewageRate: null,
      statPeriod: '2026-03-01',
      manageScore: 98,
    },
    {
      id: '17',
      toiletName: '延通市场',
      location: '龙文区延通路256号',
      area: '龙文区-碧湖街道',
      openHours: '06:00-19:00',
      stallCount: 85,
      status: '已完成',
      manager: '李经理',
      taskType: '收运',
      completeTime: '2026-03-01 19:00:00',
      handler: '王司机',
      handleResult: '完成',
      proofUrl: 'http://example.com/proof_transfer2.jpg',
      hygieneRate: null,
      wasteTransferCompleteRate: 100,
      sewageRate: null,
      statPeriod: '2026-03-01',
      manageScore: 96,
    },
    {
      id: '18',
      toiletName: '石码农贸市场',
      location: '龙海区人民路12号',
      area: '龙海区-石码镇',
      openHours: '04:00-18:00',
      stallCount: 60,
      status: '已完成',
      manager: '王经理',
      taskType: '污水处置',
      completeTime: '2026-03-01 17:00:00',
      handler: '孙师傅',
      handleResult: '合格',
      proofUrl: 'http://example.com/proof_sewage3.jpg',
      hygieneRate: null,
      wasteTransferCompleteRate: null,
      sewageRate: 92,
      statPeriod: '2026-03-01',
      manageScore: 89,
    },
  ];
};
