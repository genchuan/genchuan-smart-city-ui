import { requestClient } from '#/api/request';

// 检测能力及设备管理 VO
export type TestingCapabilityVO = {
  agencyCode: string; // 机构编号
  calibrationRecord: string; // 校准记录
  equipmentModel: string; // 设备型号
  equipmentNo: string; // 设备编号
  equipmentStatus: string; // 设备状态(正常/维修中/停用)
  id: number; // 序号
  testableIndicators: string; // 可检测指标
};

// 检测能力及设备管理 API
export const TestingCapabilityApi = {
  // 查询检测能力及设备管理分页
  getTestingCapabilityPage: async (params: any) => {
    return await requestClient.get(`/waterdetection/testing-capability/page`, {
      params,
    });
  },

  // 查询检测能力及设备管理详情
  getTestingCapability: async (id: number) => {
    return await requestClient.get(`/waterdetection/testing-capability/get`, {
      params: { id },
    });
  },

  // 新增检测能力及设备管理
  createTestingCapability: async (data: TestingCapabilityVO) => {
    return await requestClient.post(
      `/waterdetection/testing-capability/create`,
      data,
    );
  },

  // 修改检测能力及设备管理
  updateTestingCapability: async (data: TestingCapabilityVO) => {
    return await requestClient.put(
      `/waterdetection/testing-capability/update`,
      data,
    );
  },

  // 删除检测能力及设备管理
  deleteTestingCapability: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/testing-capability/delete`,
      { params: { id } },
    );
  },

  // 导出检测能力及设备管理 Excel
  exportTestingCapability: async (params) => {
    return await requestClient.download(
      `/waterdetection/testing-capability/export-excel`,
      params,
    );
  },
};
