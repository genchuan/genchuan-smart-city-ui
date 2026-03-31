import { requestClient } from '#/api/request';

// 执法人员管理 VO
export type OfLawEnforcementPersonnelVO = {
  belongingLawDepartment: string; // 所属执法部门
  contactInformation: string; // 联系方式
  educationalBackground: string; // 学历
  emergencyContactName: string; // 紧急联系人姓名
  emergencyContactPhone: string; // 紧急联系人电话
  entryTime: string; // 入职时间
  fullName: string; // 姓名
  gender: string; // 性别
  id: number; // 主键
  idNumber: string; // 身份证号
  lawEnforcementNumber: string; // 执法证编号
  major: string; // 专业
  position: string; // 职务
  responsibleArea: string; // 负责区域
  resultOfExamination: string; // 考核成绩
  rewardsRecord: string; // 奖惩记录
  trainingExperience: string; // 培训经历
  validityCertificate: string; // 执法证有效期
  violationRegulations: string; // 违规违纪情况
};

// 执法人员管理 API
export const OfLawEnforcementPersonnelApi = {
  // 查询执法人员管理分页
  getOfLawEnforcementPersonnelPage: async (params: any) => {
    return await requestClient.get(
      `/smartcity/of-law-enforcement-personnel/page`,
      { params },
    );
  },

  // 查询执法人员管理详情
  getOfLawEnforcementPersonnel: async (id: number) => {
    return await requestClient.get(
      `/smartcity/of-law-enforcement-personnel/get`,
      { params: { id } },
    );
  },

  // 新增执法人员管理
  createOfLawEnforcementPersonnel: async (data: any) => {
    return await requestClient.post(
      `/smartcity/of-law-enforcement-personnel/create`,
      data,
    );
  },

  // 修改执法人员管理
  updateOfLawEnforcementPersonnel: async (data: any) => {
    return await requestClient.put(
      `/smartcity/of-law-enforcement-personnel/update`,
      data,
    );
  },

  // 删除执法人员管理
  deleteOfLawEnforcementPersonnel: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/of-law-enforcement-personnel/delete`,
      { params: { id } },
    );
  },

  // 导出执法人员管理 Excel
  exportOfLawEnforcementPersonnel: async (params) => {
    return await requestClient.download(
      `/smartcity/of-law-enforcement-personnel/export-excel`,
      params,
    );
  },
};
