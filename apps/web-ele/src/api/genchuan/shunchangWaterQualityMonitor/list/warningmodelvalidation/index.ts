import { requestClient } from '#/api/request';

// 预警模型校验 VO
export type WarningModelValidationVO = {
  accuracyRate: number; // 准确率(%)
  accurateWarningCount: number; // 准确预警次数
  adjustmentSuggestion: string; // 调整建议
  falseAlarmCount: number; // 误报次数
  id: number; // 序号
  modelName: string; // 模型名称
  validationPeriod: string; // 校验时间段
  warningCount: number; // 预警次数
};

// 预警模型校验 API
export const WarningModelValidationApi = {
  // 查询预警模型校验分页
  getWarningModelValidationPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/warning-model-validation/page`,
      { params },
    );
  },

  // 查询预警模型校验详情
  getWarningModelValidation: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/warning-model-validation/get`,
      { params: { id } },
    );
  },

  // 新增预警模型校验
  createWarningModelValidation: async (data: WarningModelValidationVO) => {
    return await requestClient.post(
      `/waterdetection/warning-model-validation/create`,
      data,
    );
  },

  // 修改预警模型校验
  updateWarningModelValidation: async (data: WarningModelValidationVO) => {
    return await requestClient.put(
      `/waterdetection/warning-model-validation/update`,
      data,
    );
  },

  // 删除预警模型校验
  deleteWarningModelValidation: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/warning-model-validation/delete`,
      { params: { id } },
    );
  },

  // 导出预警模型校验 Excel
  exportWarningModelValidation: async (params) => {
    return await requestClient.download(
      `/waterdetection/warning-model-validation/export-excel`,
      params,
    );
  },
};
