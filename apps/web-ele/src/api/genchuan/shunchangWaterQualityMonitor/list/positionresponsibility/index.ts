import request from '@/config/axios'

// 岗位职责划分管理 VO
export interface PositionResponsibilityVO {
  id: number // 序号
  positionName: string // 岗位名称
  responsibilityDesc: string // 岗位职责描述
  qualificationReq: string // 任职要求
  belongUnit: string // 所属单位
  manager: string // 负责人
}

// 岗位职责划分管理 API
export const PositionResponsibilityApi = {
  // 查询岗位职责划分管理分页
  getPositionResponsibilityPage: async (params: any) => {
    return await request.get({ url: `/waterdetection/position-responsibility/page`, params })
  },

  // 查询岗位职责划分管理详情
  getPositionResponsibility: async (id: number) => {
    return await request.get({ url: `/waterdetection/position-responsibility/get?id=` + id })
  },

  // 新增岗位职责划分管理
  createPositionResponsibility: async (data: PositionResponsibilityVO) => {
    return await request.post({ url: `/waterdetection/position-responsibility/create`, data })
  },

  // 修改岗位职责划分管理
  updatePositionResponsibility: async (data: PositionResponsibilityVO) => {
    return await request.put({ url: `/waterdetection/position-responsibility/update`, data })
  },

  // 删除岗位职责划分管理
  deletePositionResponsibility: async (id: number) => {
    return await request.delete({ url: `/waterdetection/position-responsibility/delete?id=` + id })
  },

  // 导出岗位职责划分管理 Excel
  exportPositionResponsibility: async (params) => {
    return await request.download({ url: `/waterdetection/position-responsibility/export-excel`, params })
  },
}
