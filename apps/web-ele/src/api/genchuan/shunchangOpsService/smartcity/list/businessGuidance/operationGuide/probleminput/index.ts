import { requestClient } from '#/api/request';

// 问题录入 VO
export type ProblemInputVO = {
  id: number; // 主键
  isArea: string; // 所属领域
  problemDescription: string; // 问题描述
  questioner: string; // 提问人
  questionTime: Date; // 提问时间
  questionTitle: string; // 问题标题
  questionType: string; // 问题类型
  urgency: string; // 紧急程度
};

// 问题录入 API
export const ProblemInputApi = {
  // 查询问题录入分页
  getProblemInputPage: async (params: any) => {
    return await requestClient.get(`/smartcity/problem-input/page`, { params });
  },

  // 查询问题录入详情
  getProblemInput: async (id: number) => {
    return await requestClient.get(`/smartcity/problem-input/get`, {
      params: { id },
    });
  },

  // 新增问题录入
  createProblemInput: async (data: ProblemInputVO) => {
    return await requestClient.post(`/smartcity/problem-input/create`, data);
  },

  // 修改问题录入
  updateProblemInput: async (data: ProblemInputVO) => {
    return await requestClient.put(`/smartcity/problem-input/update`, data);
  },

  // 删除问题录入
  deleteProblemInput: async (id: number) => {
    return await requestClient.delete(`/smartcity/problem-input/delete`, {
      params: { id },
    });
  },

  // 导出问题录入 Excel
  exportProblemInput: async (params) => {
    return await requestClient.download(
      `/smartcity/problem-input/export-excel`,
      params,
    );
  },
};
