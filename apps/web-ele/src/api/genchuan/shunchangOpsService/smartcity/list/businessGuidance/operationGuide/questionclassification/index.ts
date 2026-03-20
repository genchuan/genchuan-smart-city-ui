import { requestClient } from '#/api/request';

// 问题录入 VO
export type QuestionClassificationVO = {
  id: number; // 主键
  involvingTheSubject: string; // 涉及主体
  isArea: string; // 所属领域
  questionType: string; // 问题类型
  urgency: string; // 紧急程度
};

// 问题录入 API
export const QuestionClassificationApi = {
  // 查询问题录入分页
  getQuestionClassificationPage: async (params: any) => {
    return await requestClient.get(`/smartcity/question-classification/page`, {
      params,
    });
  },

  // 查询问题录入详情
  getQuestionClassification: async (id: number) => {
    return await requestClient.get(`/smartcity/question-classification/get`, {
      params: { id },
    });
  },

  // 新增问题录入
  createQuestionClassification: async (data: QuestionClassificationVO) => {
    return await requestClient.post(
      `/smartcity/question-classification/create`,
      data,
    );
  },

  // 修改问题录入
  updateQuestionClassification: async (data: QuestionClassificationVO) => {
    return await requestClient.put(
      `/smartcity/question-classification/update`,
      data,
    );
  },

  // 删除问题录入
  deleteQuestionClassification: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/question-classification/delete`,
      { params: { id } },
    );
  },

  // 导出问题录入 Excel
  exportQuestionClassification: async (params) => {
    return await requestClient.download(
      `/smartcity/question-classification/export-excel`,
      params,
    );
  },
};
