import { requestClient } from '#/api/request';

// 监测点位 VO
export type PointInfoVO = {
  id: number; // 主键
  pointNumber: string; // 点位编号
  pointName: string; // 点位名称
  pointType: string; // 点位类型
  belongingArea: string; // 所属区域
  latitudeLongitudeCoordinate: string; // 经纬度坐标
  altitude: string; // 海拔高度
  deviceInfo: string; // 设备信息
};

// 监测点位 API
export const PointInfoApi = {
  // 查询监测点位分页
  getPointInfoPage: async (params: any) => {
    return await requestClient.get(
      `/smartcity/point-info/page`,
      { params },
    );
  },

  // 查询监测点位详情
  getPointInfo: async (id: number) => {
    return await requestClient.get(
      `/smartcity/point-info/get`,
      { params: { id } },
    );
  },

  // 新增监测点位
  createPointInfo: async (data: PointInfoVO) => {
    return await requestClient.post(
      `/smartcity/point-info/create`,
      data,
    );
  },

  // 修改监测点位
  updatePointInfo: async (data: PointInfoVO) => {
    return await requestClient.put(
      `/smartcity/point-info/update`,
      data,
    );
  },

  // 删除监测点位
  deletePointInfo: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/point-info/delete`,
      { params: { id } },
    );
  },

  // 导出监测点位 Excel
  exportPointInfo: async (params) => {
    return await requestClient.download(
      `/smartcity/point-info/export-excel`,
      params,
    );
  },
};
