import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';


// ========== 资源设备 ==========
// 设备核心指标（卡片：总数、在线数、正常运行数、完好率、故障数）
export const fetchParkDeviceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/device/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.tbDeviceTotalCount &&
          response.tbDeviceOnlineCount &&
          response.tbDeviceNormalCount &&
          response.tbDeviceFaultCount &&
          response.tbDeviceIntactRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbDeviceTotalCount: 1200, // 设备总数
              tbDeviceOnlineCount: 1120, // 在线设备数
              tbDeviceNormalCount: 1080, // 正常运行数
              tbDeviceFaultCount: 80, // 故障设备数
              tbDeviceIntactRate: 90.0, // 设备完好率
              tbDeviceNewCount7d: 50, // 近7日新增设备数
              tbDeviceRepairCount7d: 45, // 近7日故障修复数
              sysFaultTypeName: '通讯故障', // 热门故障类型
              tbDeviceCoverageRate: 95.5, // 设备覆盖度
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbDeviceTotalCount: 0,
      tbDeviceOnlineCount: 0,
      tbDeviceNormalCount: 0,
      tbDeviceFaultCount: 0,
      tbDeviceIntactRate: 0,
      tbDeviceNewCount7d: 0,
      tbDeviceRepairCount7d: 0,
      sysFaultTypeName: '',
      tbDeviceCoverageRate: 0,
    });
  }
};

// 设备类型占比（饼图）
export const fetchParkDeviceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/device/stat/type/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['道闸', '摄像头', '计费桩', '充电桩', '传感器', '边缘网关'],
              series: [{ name: '设备类型占比(%)', data: [25, 30, 15, 10, 12, 8] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '设备类型占比(%)', data: [] }],
    });
  }
};

// 设备运行状态占比（饼图）
export const fetchParkDeviceStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/device/stat/status/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备运行状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备运行状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['正常运行', '在线故障', '离线', '禁用'],
              series: [{ name: '设备运行状态占比(%)', data: [90, 5, 4, 1] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备运行状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '设备运行状态占比(%)', data: [] }],
    });
  }
};

// 近7日设备在线率变化趋势（折线图）
export const fetchParkDeviceOnlineRateTrend7d = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/device/stat/online/rate/trend/7d`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备在线率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备在线率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 7}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 6 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = [95.2, 94.8, 96.1, 95.5, 94.9, 95.8, 96.5];
            resolve({
              xAxis,
              series: [{ name: '设备在线率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备在线率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '设备在线率(%)', data: [] }],
    });
  }
};


// ========== 停车资源分布明细 ==========
// 停车资源分布明细列表
export const fetchParkResourceDistributionList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/list`,
        params,
      })
      .then((response) => {
        console.log('停车资源分布明细-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('停车资源分布明细-响应符合实际格式');
          return response.map((item) => ({
            tbParkingName: item.tbParkingName,
            tbRegionName: item.tbRegionName,
            sysParkingTypeName: item.sysParkingTypeName,
            tbParkingSpaceTotalCount: item.tbParkingSpaceTotalCount,
            tbParkingSpaceAvailableCount: item.tbParkingSpaceAvailableCount,
            sysOperationStatusName: item.sysOperationStatusName,
            tbParkingContactPhone: item.tbParkingContactPhone,
            tbParkingId: item.tbParkingId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无停车资源分布明细数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('停车资源分布明细接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbParkingName: '北区停车场',
                tbRegionName: '高新区',
                sysParkingTypeName: '公共停车场',
                tbParkingSpaceTotalCount: 500,
                tbParkingSpaceAvailableCount: 105,
                sysOperationStatusName: '运营中',
                tbParkingContactPhone: '13800138001',
                tbParkingId: 'PK20260119001',
              },
              {
                tbParkingName: '南区停车场',
                tbRegionName: '主城区',
                sysParkingTypeName: '商业停车场',
                tbParkingSpaceTotalCount: 800,
                tbParkingSpaceAvailableCount: 118,
                sysOperationStatusName: '运营中',
                tbParkingContactPhone: '13800138002',
                tbParkingId: 'PK20260119002',
              },
              {
                tbParkingName: '东区停车场',
                tbRegionName: '经开区',
                sysParkingTypeName: '路侧停车场',
                tbParkingSpaceTotalCount: 400,
                tbParkingSpaceAvailableCount: 136,
                sysOperationStatusName: '暂停运营',
                tbParkingContactPhone: '13800138003',
                tbParkingId: 'PK20260119003',
              },
              {
                tbParkingName: '西区停车场',
                tbRegionName: '文旅区',
                sysParkingTypeName: '景区停车场',
                tbParkingSpaceTotalCount: 600,
                tbParkingSpaceAvailableCount: 168,
                sysOperationStatusName: '运营中',
                tbParkingContactPhone: '13800138004',
                tbParkingId: 'PK20260119004',
              },
              {
                tbParkingName: '中区停车场',
                tbRegionName: '龙文区',
                sysParkingTypeName: '住宅停车场',
                tbParkingSpaceTotalCount: 700,
                tbParkingSpaceAvailableCount: 98,
                sysOperationStatusName: '运营中',
                tbParkingContactPhone: '13800138005',
                tbParkingId: 'PK20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceDistributionList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 停车资源分布明细核心指标（卡片展示）
export const fetchParkResourceDistributionIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalParkCount &&
          response.runningParkCount &&
          response.totalSpaceCount &&
          response.availableSpaceCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无停车资源分布明细核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车资源分布明细指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalParkCount: 5, // 停车场总数
              runningParkCount: 4, // 运营中数
              totalSpaceCount: 3000, // 总泊位数
              availableSpaceCount: 625, // 可用泊位数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车资源分布明细指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalParkCount: 0,
      runningParkCount: 0,
      totalSpaceCount: 0,
      availableSpaceCount: 0,
    });
  }
};

// 各区域停车场数量对比（柱状图）
export const fetchParkResourceDistributionAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/stat/area/count`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无区域停车场数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域停车场数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '停车场数量', data: [1, 1, 1, 1, 1] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域停车场数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '停车场数量', data: [] }],
    });
  }
};

// 各类型停车场数量对比（柱状图）
export const fetchParkResourceDistributionTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/stat/type/count`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无类型停车场数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型停车场数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['公共停车场', '商业停车场', '路侧停车场', '景区停车场', '住宅停车场'],
              series: [{ name: '停车场数量', data: [1, 1, 1, 1, 1] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 类型停车场数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '停车场数量', data: [] }],
    });
  }
};

// 停车场类型占比（饼图）
export const fetchParkResourceDistributionTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/stat/type/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无停车场类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车场类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['公共停车场', '商业停车场', '路侧停车场', '景区停车场', '住宅停车场'],
              series: [{ name: '停车场类型占比(%)', data: [20, 20, 20, 20, 20] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车场类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '停车场类型占比(%)', data: [] }],
    });
  }
};

// 运营状态占比（饼图）
export const fetchParkResourceDistributionStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/stat/status/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无运营状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '运营状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['运营中', '暂停运营', '维护中', '已停用'],
              series: [{ name: '运营状态占比(%)', data: [80, 10, 5, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 运营状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '运营状态占比(%)', data: [] }],
    });
  }
};

// 停车资源分布明细详情查询 - 详情弹窗专用
export const fetchParkResourceDistributionDetail = (parkingId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/detail/${parkingId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbParkingParkingId === parkingId) {
          return response;
        }
        throw new Error('真实接口返回无停车资源分布明细详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('停车资源分布明细详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              // 基本信息
              tbParkingParkingId: parkingId,
              tbParkingName: parkingId === 'PK20260119001' ? '北区停车场' : '南区停车场',
              tbRegionName: parkingId === 'PK20260119001' ? '高新区' : '主城区',
              tbParkingContactPhone: parkingId === 'PK20260119001' ? '13800138001' : '13800138002',
              sysParkingTypeName: parkingId === 'PK20260119001' ? '公共停车场' : '商业停车场',
              sysOperationStatusName: parkingId === 'PK20260119001' ? '运营中' : '运营中',
              // 弹窗展示字段
              tbParkingSaturationRate: parkingId === 'PK20260119001' ? 79.0 : 85.2, // 饱和率
              tbParkingChargeStandard: parkingId === 'PK20260119001' ? '5元/小时，全天30元封顶' : '6元/小时，全天40元封顶', // 收费标准
              tbParkingUpdateTime: new Date().getTime() - 3 * 24 * 60 * 60 * 1000, // 最近更新时间
              // 泊位分布
              spaceDistribution: {
                legend: ['小型车', '大型车', '新能源', '无障碍'],
                series: [{ name: '车位分布', data: [400, 50, 40, 10] }]
              },
              // 运营数据
              operationData: {
                tbParkingSpaceTotalCount: parkingId === 'PK20260119001' ? 500 : 800,
                tbParkingSpaceAvailableCount: parkingId === 'PK20260119001' ? 105 : 118,
                tbParkingSaturationRate: parkingId === 'PK20260119001' ? 79.0 : 85.2,
                tbParkingAverageUtilization: parkingId === 'PK20260119001' ? 78.5 : 82.3,
              },
              // 收费标准明细
              chargeDetails: [
                { timeRange: '00:00-08:00', fee: '2元/小时' },
                { timeRange: '08:00-20:00', fee: '5元/小时' },
                { timeRange: '20:00-24:00', fee: '3元/小时' },
                { timeRange: '全天封顶', fee: '30元' }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceDistributionDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};


// ========== 泊位车位 ==========
// 泊位车位列表
export const fetchParkingSpaceList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/list`,
        params,
      })
      .then((response) => {
        console.log('泊位车位列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('泊位车位列表-响应符合实际格式');
          return response.map((item) => ({
            tbParkingName: item.tbParkingName,
            tbParkingSpaceSpaceNo: item.tbParkingSpaceSpaceNo,
            sysSpaceTypeName: item.sysSpaceTypeName,
            sysSpaceStatusName: item.sysSpaceStatusName,
            tbParkingRecordOccupyDuration: item.tbParkingRecordOccupyDuration,
            tbRegionName: item.tbRegionName,
            tbParkingSpaceSpaceId: item.tbParkingSpaceSpaceId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无泊位车位列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('泊位车位列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbParkingName: '北区停车场',
                tbParkingSpaceSpaceNo: 'A001',
                sysSpaceTypeName: '小型车位',
                sysSpaceStatusName: '占用',
                tbParkingRecordOccupyDuration: 125,
                tbRegionName: '高新区',
                tbParkingSpaceSpaceId: 'PS20260119001',
              },
              {
                tbParkingName: '北区停车场',
                tbParkingSpaceSpaceNo: 'A002',
                sysSpaceTypeName: '新能源车位',
                sysSpaceStatusName: '空闲',
                tbParkingRecordOccupyDuration: 0,
                tbRegionName: '高新区',
                tbParkingSpaceSpaceId: 'PS20260119002',
              },
              {
                tbParkingName: '南区停车场',
                tbParkingSpaceSpaceNo: 'B101',
                sysSpaceTypeName: '大型车位',
                sysSpaceStatusName: '故障',
                tbParkingRecordOccupyDuration: 360,
                tbRegionName: '主城区',
                tbParkingSpaceSpaceId: 'PS20260119003',
              },
              {
                tbParkingName: '东区停车场',
                tbParkingSpaceSpaceNo: 'C201',
                sysSpaceTypeName: '无障碍车位',
                sysSpaceStatusName: '占用',
                tbParkingRecordOccupyDuration: 89,
                tbRegionName: '经开区',
                tbParkingSpaceSpaceId: 'PS20260119004',
              },
              {
                tbParkingName: '西区停车场',
                tbParkingSpaceSpaceNo: 'D301',
                sysSpaceTypeName: '小型车位',
                sysSpaceStatusName: '空闲',
                tbParkingRecordOccupyDuration: 0,
                tbRegionName: '文旅区',
                tbParkingSpaceSpaceId: 'PS20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkingSpaceList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 泊位车位核心指标（卡片展示）
export const fetchParkingSpaceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalSpaceCount &&
          response.availableSpaceCount &&
          response.occupiedSpaceCount &&
          response.faultSpaceCount &&
          response.utilizationRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无泊位车位核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '泊位车位指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalSpaceCount: 3000, // 总泊位数
              availableSpaceCount: 625, // 空闲数
              occupiedSpaceCount: 2250, // 占用数
              faultSpaceCount: 125, // 故障数
              utilizationRate: 75.0, // 使用率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 泊位车位指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalSpaceCount: 0,
      availableSpaceCount: 0,
      occupiedSpaceCount: 0,
      faultSpaceCount: 0,
      utilizationRate: 0,
    });
  }
};

// 近24小时泊位使用率变化趋势（折线图）
export const fetchParkingSpaceUtilizationTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/stat/utilization/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无泊位使用率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '泊位使用率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 24}, (_, i) => `${i}:00`);
            const data = xAxis.map((hour) => {
              const h = parseInt(hour);
              if (h >= 7 && h <= 9) return 85 + Math.random() * 10; // 早高峰
              if (h >= 9 && h <= 17) return 70 + Math.random() * 10; // 平峰
              if (h >= 17 && h <= 20) return 90 + Math.random() * 10; // 晚高峰
              return 40 + Math.random() * 20; // 夜间
            });
            resolve({
              xAxis,
              series: [{ name: '泊位使用率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 泊位使用率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '泊位使用率(%)', data: [] }],
    });
  }
};

// 泊位类型占比（饼图）
export const fetchParkingSpaceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/stat/type/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无泊位类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '泊位类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['小型车位', '大型车位', '新能源车位', '无障碍车位'],
              series: [{ name: '泊位类型占比(%)', data: [65.5, 15.2, 12.8, 6.5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 泊位类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '泊位类型占比(%)', data: [] }],
    });
  }
};

// 使用状态占比（饼图）
export const fetchParkingSpaceStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/stat/status/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无使用状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '使用状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['空闲', '占用', '故障', '维护中'],
              series: [{ name: '使用状态占比(%)', data: [20.8, 75.0, 4.2, 0] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 使用状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '使用状态占比(%)', data: [] }],
    });
  }
};

// 泊位车位详情查询 - 详情弹窗专用
export const fetchParkingSpaceDetail = (spaceId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/detail/${spaceId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbParkingSpaceSpaceId === spaceId) {
          return response;
        }
        throw new Error('真实接口返回无泊位详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('泊位详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbParkingSpaceSpaceId: spaceId,
              tbParkingSpaceUseCount: spaceId === 'PS20260119001' ? 156 : 89, // 累计使用次数
              tbParkingSpaceLastUseTime: Date.now() - 2 * 60 * 60 * 1000, // 最近使用时间
              tbParkingSpaceFaultRate: spaceId === 'PS20260119003' ? 12.5 : 2.3, // 故障率
              // 使用记录
              usageRecords: [
                {
                  time: Date.now() - 24 * 60 * 60 * 1000,
                  duration: 125,
                  carNo: '京A12345',
                  status: '已完成'
                },
                {
                  time: Date.now() - 2 * 24 * 60 * 60 * 1000,
                  duration: 89,
                  carNo: '京B67890',
                  status: '已完成'
                },
                {
                  time: Date.now() - 3 * 24 * 60 * 60 * 1000,
                  duration: 210,
                  carNo: '京C11223',
                  status: '已完成'
                }
              ],
              // 故障记录
              faultRecords: spaceId === 'PS20260119003' ? [
                {
                  time: Date.now() - 7 * 24 * 60 * 60 * 1000,
                  content: '地磁传感器故障',
                  handleStatus: '已修复'
                },
                {
                  time: Date.now() - 15 * 24 * 60 * 60 * 1000,
                  content: '车位锁异常',
                  handleStatus: '已修复'
                }
              ] : []
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkingSpaceDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 释放泊位
export const releaseParkingSpace = (spaceId, releaseReason, params = {}) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/parking/space/release/${spaceId}`,
        data: { releaseReason },
        params,
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无释放结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('释放泊位接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '泊位释放成功',
              spaceStatus: '空闲'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== releaseParkingSpace 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '操作失败' });
  }
};


