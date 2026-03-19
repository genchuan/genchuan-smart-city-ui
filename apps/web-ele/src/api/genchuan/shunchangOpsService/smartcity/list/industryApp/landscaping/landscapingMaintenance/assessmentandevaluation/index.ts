import { requestClient } from '#/api/request';

// 养护考核评价 VO
export type AssessmentAndEvaluationVO = {
  assessmentCycle: string; // 考核周期
  assessmentLevel: string; // 考核等级
  assessmentScore: string; // 考核得分
  evaluationOpinion: string; // 评价意见
  id: number; // 主键
  improvementSuggestions: string; // 改进建议
  maintenancePersonnelNumber: string; // 养护人员编号
  maintenanceTaskNumber: string; // 养护任务编号
};

// 养护考核评价 API
export const AssessmentAndEvaluationApi = {
  // 查询养护考核评价分页
  getAssessmentAndEvaluationPage: async (params: any) => {
    return await requestClient.get(
      `/smartcity/assessment-and-evaluation/page`,
      { params },
    );
  },

  // 查询养护考核评价详情
  getAssessmentAndEvaluation: async (id: number) => {
    return await requestClient.get(`/smartcity/assessment-and-evaluation/get`, {
      params: { id },
    });
  },

  // 新增养护考核评价
  createAssessmentAndEvaluation: async (data: any) => {
    return await requestClient.post(
      `/smartcity/assessment-and-evaluation/create`,
      data,
    );
  },

  // 修改养护考核评价
  updateAssessmentAndEvaluation: async (data: any) => {
    return await requestClient.put(
      `/smartcity/assessment-and-evaluation/update`,
      data,
    );
  },

  // 删除养护考核评价
  deleteAssessmentAndEvaluation: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/assessment-and-evaluation/delete`,
      { params: { id } },
    );
  },

  // 导出养护考核评价 Excel
  exportAssessmentAndEvaluation: async (params) => {
    return await requestClient.download(
      `/smartcity/assessment-and-evaluation/export-excel`,
      params,
    );
  },
};
