import { requestClient } from '#/api/request';

// 用户基础信息登记 VO
export type UserBasicInfoVO = {
  address: string; // 家庭住址
  id: number; // 序号
  idCardNo: string; // 身份证号
  openDate: Date; // 开户日期
  phone: string; // 联系电话
  userCode: string; // 用户编号
  userName: string; // 姓名
};

// 用户基础信息登记 API
export const UserBasicInfoApi = {
  // 查询用户基础信息登记分页
  getUserBasicInfoPage: async (params: any) => {
    return await requestClient.get(`/waterdetection/user-basic-info/page`, {
      params,
    });
  },

  // 查询用户基础信息登记详情
  getUserBasicInfo: async (id: number) => {
    return await requestClient.get(`/waterdetection/user-basic-info/get`, {
      params: { id },
    });
  },

  // 新增用户基础信息登记
  createUserBasicInfo: async (data: UserBasicInfoVO) => {
    return await requestClient.post(
      `/waterdetection/user-basic-info/create`,
      data,
    );
  },

  // 修改用户基础信息登记
  updateUserBasicInfo: async (data: UserBasicInfoVO) => {
    return await requestClient.put(
      `/waterdetection/user-basic-info/update`,
      data,
    );
  },

  // 删除用户基础信息登记
  deleteUserBasicInfo: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/user-basic-info/delete`,
      { params: { id } },
    );
  },

  // 导出用户基础信息登记 Excel
  exportUserBasicInfo: async (params) => {
    return await requestClient.download(
      `/waterdetection/user-basic-info/export-excel`,
      params,
    );
  },
};
