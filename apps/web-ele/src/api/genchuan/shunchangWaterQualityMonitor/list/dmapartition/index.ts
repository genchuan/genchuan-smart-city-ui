import { requestClient } from '#/api/request';

// DMA分区划分与调整 VO
export type DmaPartitionVO = {
  id: number; // 序号
  partitionId: string; // 分区ID
  partitionName: string; // 分区名称
  coveredVillages: string; // 覆盖行政村
  boundaryCoordinates: string; // 边界坐标
  monitorPointIds: string; // 包含监测点ID
  divisionDate: Date; // 划分日期
  adjustmentRecords: string; // 调整记录
};

// DMA分区划分与调整 API
export const DmaPartitionApi = {
  // 查询DMA分区划分与调整分页
  getDmaPartitionPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/dma-partition/page`,
      { params },
    );
  },

  // 查询DMA分区划分与调整详情
  getDmaPartition: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/dma-partition/get`,
      { params: { id } },
    );
  },

  // 新增DMA分区划分与调整
  createDmaPartition: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/dma-partition/create`,
      data,
    );
  },

  // 修改DMA分区划分与调整
  updateDmaPartition: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/dma-partition/update`,
      data,
    );
  },

  // 删除DMA分区划分与调整
  deleteDmaPartition: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/dma-partition/delete`,
      { params: { id } },
    );
  },

  // 导出DMA分区划分与调整 Excel
  exportDmaPartition: async (params) => {
    return await requestClient.download(
      `/waterdetection/dma-partition/export-excel`,
      params,
    );
  },
};
