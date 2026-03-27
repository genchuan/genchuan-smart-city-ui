import request from '@/config/axios'

// 用户基础信息登记 VO
export interface UserBasicInfoVO {
  id: number // 序号
  userCode: string // 用户编号
  userName: string // 姓名
  idCardNo: string // 身份证号
  address: string // 家庭住址
  phone: string // 联系电话
  openDate: Date // 开户日期
}

// 用户基础信息登记 API
export const UserBasicInfoApi = {
  // 查询用户基础信息登记分页
  getUserBasicInfoPage: async (params: any) => {
    return await request.get({ url: `/waterdetection/user-basic-info/page`, params })
  },

  // 查询用户基础信息登记详情
  getUserBasicInfo: async (id: number) => {
    return await request.get({ url: `/waterdetection/user-basic-info/get?id=` + id })
  },

  // 新增用户基础信息登记
  createUserBasicInfo: async (data: UserBasicInfoVO) => {
    return await request.post({ url: `/waterdetection/user-basic-info/create`, data })
  },

  // 修改用户基础信息登记
  updateUserBasicInfo: async (data: UserBasicInfoVO) => {
    return await request.put({ url: `/waterdetection/user-basic-info/update`, data })
  },

  // 删除用户基础信息登记
  deleteUserBasicInfo: async (id: number) => {
    return await request.delete({ url: `/waterdetection/user-basic-info/delete?id=` + id })
  },

  // 导出用户基础信息登记 Excel
  exportUserBasicInfo: async (params) => {
    return await request.download({ url: `/waterdetection/user-basic-info/export-excel`, params })
  },
}
