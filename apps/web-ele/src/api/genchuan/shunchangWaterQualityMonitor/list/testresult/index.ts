import { requestClient } from '#/api/request';

// 检测结果录入 VO
export type TestResultVO = {
  equipmentCode: string; // 设备编号
  id: number; // 序号
  sampleCode: string; // 样本编号
  testIndicator: string; // 检测指标
  testMethod: string; // 检测方法
  testOperator: string; // 检测人员
  testTime: Date; // 检测时间
  testValue: number; // 检测值
  unit: string; // 单位
};

// 检测结果录入 API
export const TestResultApi = {
  // 查询检测结果录入分页
  getTestResultPage: async (params: any) => {
    return await requestClient.get(`/waterdetection/test-result/page`, {
      params,
    });
  },

  // 查询检测结果录入详情
  getTestResult: async (id: number) => {
    return await requestClient.get(`/waterdetection/test-result/get`, {
      params: { id },
    });
  },

  // 新增检测结果录入
  createTestResult: async (data: TestResultVO) => {
    return await requestClient.post(`/waterdetection/test-result/create`, data);
  },

  // 修改检测结果录入
  updateTestResult: async (data: TestResultVO) => {
    return await requestClient.put(`/waterdetection/test-result/update`, data);
  },

  // 删除检测结果录入
  deleteTestResult: async (id: number) => {
    return await requestClient.delete(`/waterdetection/test-result/delete`, {
      params: { id },
    });
  },

  // 导出检测结果录入 Excel
  exportTestResult: async (params) => {
    return await requestClient.download(
      `/waterdetection/test-result/export-excel`,
      params,
    );
  },
};
