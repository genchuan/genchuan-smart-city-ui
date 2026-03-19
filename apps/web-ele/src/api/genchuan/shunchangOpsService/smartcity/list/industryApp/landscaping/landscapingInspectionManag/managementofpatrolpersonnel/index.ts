import { requestClient } from '#/api/request';

// 巡査人员管理 VO
export type ManagementOfPatrolPersonnelVO = {
  certificateValidityPeriod: string; // 证书有效期
  contactInformation: string; // 联系方式
  dateOfBirth: Date; // 出生日期
  department: string; // 所属部门
  entryTime: Date; // 入职时间
  fullName: string; // 姓名
  gender: string; // 性别
  id: number; // 主键
  idNumber: string; // 身份证号
  inspectionEquipmentNumber: string; // 巡查设备编号
  inspectionShift: string; // 巡查班次
  patrolArea: string; // 巡查区域
  patrolRoute: string; // 巡查路线
  position: string; // 岗位名称
  qualificationCertificateNumber: string; // 资质证书编号
  rewardAndPunishmentSituation: string; // 奖惩情况
  trainingRecords: string; // 培训记录
  violationRecord: string; // 违规记录
};

// 巡査人员管理 API
export const ManagementOfPatrolPersonnelApi = {
  // 查询巡査人员管理分页
  getManagementOfPatrolPersonnelPage: async (params: any) => {
    return await requestClient.get(
      `/smartcity/management-of-patrol-personnel/page`,
      { params },
    );
  },

  // 查询巡査人员管理详情
  getManagementOfPatrolPersonnel: async (id: number) => {
    return await requestClient.get(
      `/smartcity/management-of-patrol-personnel/get`,
      { params: { id } },
    );
  },

  // 新增巡査人员管理
  createManagementOfPatrolPersonnel: async (data: any) => {
    return await requestClient.post(
      `/smartcity/management-of-patrol-personnel/create`,
      data,
    );
  },

  // 修改巡査人员管理
  updateManagementOfPatrolPersonnel: async (data: any) => {
    return await requestClient.put(
      `/smartcity/management-of-patrol-personnel/update`,
      data,
    );
  },

  // 删除巡査人员管理
  deleteManagementOfPatrolPersonnel: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/management-of-patrol-personnel/delete`,
      { params: { id } },
    );
  },

  // 导出巡査人员管理 Excel
  exportManagementOfPatrolPersonnel: async (params) => {
    return await requestClient.download(
      `/smartcity/management-of-patrol-personnel/export-excel`,
      params,
    );
  },
};
