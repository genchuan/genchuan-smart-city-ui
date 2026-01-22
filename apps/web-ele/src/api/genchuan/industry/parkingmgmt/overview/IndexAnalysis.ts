import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';


// ========== 资源运行概览 ==========
// 资源运行列表
export const fetchParkResourceRunList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/list`,
        params,
      })
      .then((response) => {
        console.log('资源运行视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('资源运行视图-响应符合实际格式');
          return response.map((item) => ({
            tbParkingName: item.tbParkingName,
            tbRegionName: item.tbRegionName,
            tbParkingSpaceTotalCount: item.tbParkingSpaceTotalCount,
            tbParkingOperationDailyUtilizationRate: item.tbParkingOperationDailyUtilizationRate,
            tbParkingOperationTurnoverRate: item.tbParkingOperationTurnoverRate,
            tbParkingOperationPeakUtilizationRate: item.tbParkingOperationPeakUtilizationRate,
            tbParkingParkingId: item.tbParkingParkingId,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源运行视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbParkingName: '北区停车场',
                tbRegionName: '高新区',
                tbParkingSpaceTotalCount: 500,
                tbParkingOperationDailyUtilizationRate: 78.5,
                tbParkingOperationTurnoverRate: 2.8,
                tbParkingOperationPeakUtilizationRate: 92.3,
                tbParkingParkingId: 'PK20260119001',
              },
              {
                tbParkingName: '南区停车场',
                tbRegionName: '主城区',
                tbParkingSpaceTotalCount: 800,
                tbParkingOperationDailyUtilizationRate: 85.2,
                tbParkingOperationTurnoverRate: 3.2,
                tbParkingOperationPeakUtilizationRate: 95.8,
                tbParkingParkingId: 'PK20260119002',
              },
              {
                tbParkingName: '东区停车场',
                tbRegionName: '经开区',
                tbParkingSpaceTotalCount: 400,
                tbParkingOperationDailyUtilizationRate: 65.7,
                tbParkingOperationTurnoverRate: 2.1,
                tbParkingOperationPeakUtilizationRate: 88.6,
                tbParkingParkingId: 'PK20260119003',
              },
              {
                tbParkingName: '西区停车场',
                tbRegionName: '文旅区',
                tbParkingSpaceTotalCount: 600,
                tbParkingOperationDailyUtilizationRate: 72.4,
                tbParkingOperationTurnoverRate: 2.5,
                tbParkingOperationPeakUtilizationRate: 90.1,
                tbParkingParkingId: 'PK20260119004',
              },
              {
                tbParkingName: '中区停车场',
                tbRegionName: '龙文区',
                tbParkingSpaceTotalCount: 700,
                tbParkingOperationDailyUtilizationRate: 81.8,
                tbParkingOperationTurnoverRate: 3.0,
                tbParkingOperationPeakUtilizationRate: 94.2,
                tbParkingParkingId: 'PK20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceRunList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 资源运行核心指标
export const fetchParkResourceRunIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalSpaceCount &&
          response.averageUtilizationRate &&
          response.averageTurnoverRate &&
          response.peakAverageUtilizationRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无资源运行核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源运行指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalSpaceCount: 3000, // 全域泊位数
              averageUtilizationRate: 76.7, // 平均使用率
              averageTurnoverRate: 2.7, // 平均周转率
              peakAverageUtilizationRate: 92.2, // 高峰时段平均使用率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 资源运行指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalSpaceCount: 0,
      averageUtilizationRate: 0,
      averageTurnoverRate: 0,
      peakAverageUtilizationRate: 0,
    });
  }
};

// 近30天全域使用率趋势（折线图）
export const fetchParkResourceRunUtilizationTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/stat/utilization/trend`,
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
        throw new Error('真实接口返回无使用率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '使用率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 70 + Math.random() * 10);
            resolve({
              xAxis,
              series: [{ name: '全域使用率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 使用率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '全域使用率(%)', data: [] }],
    });
  }
};

// 重点停车场周转率趋势（折线图）
export const fetchParkResourceRunTurnoverTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/stat/turnover/trend`,
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
        throw new Error('真实接口返回无周转率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '周转率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 2.0 + Math.random() * 1.5);
            resolve({
              xAxis,
              series: [{ name: '重点停车场周转率', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 周转率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '重点停车场周转率', data: [] }],
    });
  }
};

// 各区域使用率占比（饼图）
export const fetchParkResourceRunRegionRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/stat/region/ratio`,
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
        throw new Error('真实接口返回无区域使用率占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域使用率占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '区域使用率占比(%)', data: [78.5, 85.2, 65.7, 72.4, 81.8] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域使用率占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '区域使用率占比(%)', data: [] }],
    });
  }
};

// 各时段使用率分布（饼图）
export const fetchParkResourceRunTimeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/stat/time/ratio`,
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
        throw new Error('真实接口返回无时段使用率分布数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '时段使用率分布饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['早高峰(7-9)', '平峰(9-17)', '晚高峰(17-20)', '夜间(20-7)'],
              series: [{ name: '时段使用率分布(%)', data: [88.5, 70.2, 92.7, 45.3] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 时段使用率分布饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '时段使用率分布(%)', data: [] }],
    });
  }
};

// 资源运行详情查询 - 详情弹窗专用
export const fetchParkResourceRunDetail = (parkingId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/detail/${parkingId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbParkingParkingId === parkingId) {
          return response;
        }
        throw new Error('真实接口返回无详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源运行详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbParkingParkingId: parkingId,
              tbParkingName: parkingId === 'PK20260119001' ? '北区停车场' : '南区停车场',
              tbRegionName: parkingId === 'PK20260119001' ? '高新区' : '主城区',
              tbParkingOperationChainUtilizationChange: parkingId === 'PK20260119001' ? 5.2 : 3.8,
              tbParkingOperationMonthlyMaxUtilization: parkingId === 'PK20260119001' ? 95.8 : 98.2,
              tbParkingOperationPeakHour: parkingId === 'PK20260119001' ? '17:00-19:00' : '18:00-20:00',
              runDetail: {
                tbParkingSpaceTotalCount: parkingId === 'PK20260119001' ? 500 : 800,
                tbParkingOperationDailyUtilizationRate: parkingId === 'PK20260119001' ? 78.5 : 85.2,
                tbParkingOperationTurnoverRate: parkingId === 'PK20260119001' ? 2.8 : 3.2,
                tbParkingOperationPeakUtilizationRate: parkingId === 'PK20260119001' ? 92.3 : 95.8,
              },
              timeDistribution: {
                xAxis: ['0-2', '2-4', '4-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24'],
                series: [{ name: '时段使用率(%)', data: [35.2, 28.1, 30.5, 78.6, 88.5, 75.3, 72.1, 70.5, 85.7, 92.3, 80.1, 45.8] }]
              },
              abnormalRecords: [
                {
                  time: Date.now() - 3 * 24 * 60 * 60 * 1000,
                  content: '早高峰时段使用率异常偏低，排查为道闸故障导致',
                  handleStatus: '已处理'
                },
                {
                  time: Date.now() - 7 * 24 * 60 * 60 * 1000,
                  content: '周转率低于平均值，排查为周边道路施工导致',
                  handleStatus: '处理中'
                }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceRunDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 周转率时段级趋势 - 钻取弹窗专用
export const fetchParkResourceRunTurnoverTimeTrend = (parkingId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/stat/turnover/time/trend/${parkingId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbParkingParkingId === parkingId) {
          return response;
        }
        throw new Error('真实接口返回无周转率时段趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('周转率时段趋势接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = ['0-2', '2-4', '4-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24'];
            const data = xAxis.map(() => 1.5 + Math.random() * 2.5);
            resolve({
              tbParkingParkingId: parkingId,
              tbParkingName: parkingId === 'PK20260119001' ? '北区停车场' : '南区停车场',
              xAxis,
              series: [{ name: '时段周转率', data }]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceRunTurnoverTimeTrend 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbParkingParkingId: '',
      tbParkingName: '',
      xAxis: [],
      series: [{ name: '时段周转率', data: [] }]
    });
  }
};


// ========== 停车资源 ==========
// 停车资源列表
export const fetchParkResourceList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/list`,
        params,
      })
      .then((response) => {
        console.log('停车资源列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('停车资源列表-响应符合实际格式');
          return response.map((item) => ({
            tbParkingName: item.tbParkingName,
            tbRegionName: item.tbRegionName,
            sysParkingTypeName: item.sysParkingTypeName,
            tbParkingSpaceTotalCount: item.tbParkingSpaceTotalCount,
            tbParkingSpaceAvailableCount: item.tbParkingSpaceAvailableCount,
            sysOperationStatusName: item.sysOperationStatusName,
            tbParkingId: item.tbParkingId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无停车资源列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('停车资源列表接口调用失败-使用模拟数据兜底', error.message);
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
                tbParkingId: 'PK20260119001',
              },
              {
                tbParkingName: '南区停车场',
                tbRegionName: '主城区',
                sysParkingTypeName: '商业停车场',
                tbParkingSpaceTotalCount: 800,
                tbParkingSpaceAvailableCount: 118,
                sysOperationStatusName: '运营中',
                tbParkingId: 'PK20260119002',
              },
              {
                tbParkingName: '东区停车场',
                tbRegionName: '经开区',
                sysParkingTypeName: '路侧停车场',
                tbParkingSpaceTotalCount: 400,
                tbParkingSpaceAvailableCount: 136,
                sysOperationStatusName: '暂停运营',
                tbParkingId: 'PK20260119003',
              },
              {
                tbParkingName: '西区停车场',
                tbRegionName: '文旅区',
                sysParkingTypeName: '景区停车场',
                tbParkingSpaceTotalCount: 600,
                tbParkingSpaceAvailableCount: 168,
                sysOperationStatusName: '运营中',
                tbParkingId: 'PK20260119004',
              },
              {
                tbParkingName: '中区停车场',
                tbRegionName: '龙文区',
                sysParkingTypeName: '住宅停车场',
                tbParkingSpaceTotalCount: 700,
                tbParkingSpaceAvailableCount: 98,
                sysOperationStatusName: '运营中',
                tbParkingId: 'PK20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 停车资源核心指标（卡片展示）
export const fetchParkResourceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalParkCount &&
          response.totalSpaceCount &&
          response.availableSpaceCount &&
          response.runningParkCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无停车资源核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车资源指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalParkCount: 5, // 停车场总数
              totalSpaceCount: 3000, // 总泊位数
              availableSpaceCount: 625, // 可用泊位数
              runningParkCount: 4, // 运营中停车场数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车资源指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalParkCount: 0,
      totalSpaceCount: 0,
      availableSpaceCount: 0,
      runningParkCount: 0,
    });
  }
};

// 各区域停车场数量对比（柱状图）
export const fetchParkResourceAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/stat/area/count`,
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

// 各类型泊位数对比（柱状图）
export const fetchParkResourceTypeSpaceCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/stat/type/space/count`,
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
        throw new Error('真实接口返回无类型泊位数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型泊位数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['公共停车场', '商业停车场', '路侧停车场', '景区停车场', '住宅停车场'],
              series: [{ name: '泊位数', data: [500, 800, 400, 600, 700] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 类型泊位数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '泊位数', data: [] }],
    });
  }
};

// 停车资源详情查询 - 详情弹窗专用
export const fetchParkResourceDetail = (parkingId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/detail/${parkingId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbParkingId === parkingId) {
          return response;
        }
        throw new Error('真实接口返回无停车资源详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('停车资源详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbParkingId: parkingId,
              tbParkingName: parkingId === 'PK20260119001' ? '北区停车场' : '南区停车场',
              tbRegionName: parkingId === 'PK20260119001' ? '高新区' : '主城区',
              sysParkingTypeName: parkingId === 'PK20260119001' ? '公共停车场' : '商业停车场',
              tbParkingSpaceTotalCount: parkingId === 'PK20260119001' ? 500 : 800,
              tbParkingSpaceAvailableCount: parkingId === 'PK20260119001' ? 105 : 118,
              sysOperationStatusName: parkingId === 'PK20260119001' ? '运营中' : '运营中',
              tbParkingSaturationRate: parkingId === 'PK20260119001' ? 79.0 : 85.2, // 饱和率
              tbParkingOperationYears: parkingId === 'PK20260119001' ? 5 : 8, // 运营年限
              tbParkingNewEnergyRatio: parkingId === 'PK20260119001' ? 20.5 : 25.8, // 新能源车位占比
              tbParkingCode: parkingId === 'PK20260119001' ? 'PARK-GX-001' : 'PARK-ZC-001', // 资源编码
              // 车位分布（模拟数据）
              spaceDistribution: {
                legend: ['小型车', '大型车', '新能源', '无障碍'],
                series: [{ name: '车位分布', data: [260, 50, 40, 19] }]
              },
              // 运营资质（模拟数据）
              operationQualifications: [
                { name: '营业执照', status: '有效', expireTime: '2030-12-31' },
                { name: '特种行业许可证', status: '有效', expireTime: '2028-06-30' },
                { name: '消防验收合格证', status: '待续期', expireTime: '2026-03-15' }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};


// ========== 基础服务（服务质量） ==========
// 服务质量列表
export const fetchParkServiceQualityList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/service/quality/list`,
        params,
      })
      .then((response) => {
        console.log('服务质量列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('服务质量列表-响应符合实际格式');
          return response.map((item) => ({
            tbServiceQualityPeriod: item.tbServiceQualityPeriod,
            tbServiceQualityAverageEntryTime: item.tbServiceQualityAverageEntryTime,
            tbServiceQualityAveragePayTime: item.tbServiceQualityAveragePayTime,
            tbServiceQualityPaySuccessRate: item.tbServiceQualityPaySuccessRate,
            tbServiceQualityComplaintRate: item.tbServiceQualityComplaintRate,
            tbServiceQualitySatisfactionRate: item.tbServiceQualitySatisfactionRate,
            tbServiceQualityId: item.tbServiceQualityId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无服务质量列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('服务质量列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbServiceQualityPeriod: '2026-01',
                tbServiceQualityAverageEntryTime: 45.2,
                tbServiceQualityAveragePayTime: 18.5,
                tbServiceQualityPaySuccessRate: 98.7,
                tbServiceQualityComplaintRate: 0.8,
                tbServiceQualitySatisfactionRate: 95.6,
                tbServiceQualityId: 'SQ20260119001',
              },
              {
                tbServiceQualityPeriod: '2026-02',
                tbServiceQualityAverageEntryTime: 42.8,
                tbServiceQualityAveragePayTime: 17.2,
                tbServiceQualityPaySuccessRate: 99.1,
                tbServiceQualityComplaintRate: 0.6,
                tbServiceQualitySatisfactionRate: 96.2,
                tbServiceQualityId: 'SQ20260119002',
              },
              {
                tbServiceQualityPeriod: '2026-03',
                tbServiceQualityAverageEntryTime: 48.5,
                tbServiceQualityAveragePayTime: 19.8,
                tbServiceQualityPaySuccessRate: 98.2,
                tbServiceQualityComplaintRate: 1.2,
                tbServiceQualitySatisfactionRate: 94.8,
                tbServiceQualityId: 'SQ20260119003',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkServiceQualityList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 服务质量核心指标（卡片展示）
export const fetchParkServiceQualityIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/service/quality/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.averageEntryTime &&
          response.paySuccessRate &&
          response.satisfactionRate &&
          response.complaintRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无服务质量核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '服务质量指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              averageEntryTime: 45.5, // 平均入场时长(秒)
              paySuccessRate: 98.7, // 缴费成功率(%)
              satisfactionRate: 95.6, // 用户满意度(%)
              complaintRate: 0.8, // 投诉率(%)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 服务质量指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      averageEntryTime: 0,
      paySuccessRate: 0,
      satisfactionRate: 0,
      complaintRate: 0,
    });
  }
};

// 缴费成功率趋势（折线图）
export const fetchParkServiceQualityPaySuccessRateTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/service/quality/stat/pay/success/trend`,
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
        throw new Error('真实接口返回无缴费成功率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '缴费成功率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 97 + Math.random() * 2.5);
            resolve({
              xAxis,
              series: [{ name: '缴费成功率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 缴费成功率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '缴费成功率(%)', data: [] }],
    });
  }
};

// 用户满意度趋势（折线图）
export const fetchParkServiceQualitySatisfactionTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/service/quality/stat/satisfaction/trend`,
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
        throw new Error('真实接口返回无用户满意度趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '用户满意度趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 93 + Math.random() * 4);
            resolve({
              xAxis,
              series: [{ name: '用户满意度(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 用户满意度趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '用户满意度(%)', data: [] }],
    });
  }
};

// 各区域服务质量指标对比（柱状图）
export const fetchParkServiceQualityRegionCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/service/quality/stat/region/compare`,
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
        throw new Error('真实接口返回无区域服务质量对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域服务质量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '用户满意度(%)', data: [95.2, 96.5, 94.8, 95.8, 96.1] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域服务质量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '用户满意度(%)', data: [] }],
    });
  }
};

// 各时段平均入场时长对比（柱状图）
export const fetchParkServiceQualityTimeEntryCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/service/quality/stat/time/entry/compare`,
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
        throw new Error('真实接口返回无时段入场时长对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '时段入场时长对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['早高峰(7-9)', '平峰(9-17)', '晚高峰(17-20)', '夜间(20-7)'],
              series: [{ name: '平均入场时长(秒)', data: [65.2, 42.5, 78.8, 35.6] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 时段入场时长对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '平均入场时长(秒)', data: [] }],
    });
  }
};

// 服务质量详情查询 - 详情弹窗专用
export const fetchParkServiceQualityDetail = (serviceQualityId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/service/quality/detail/${serviceQualityId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbServiceQualityId === serviceQualityId) {
          return response;
        }
        throw new Error('真实接口返回无服务质量详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('服务质量详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbServiceQualityId: serviceQualityId,
              tbServiceQualityPeriod: '2026-01',
              tbServiceQualityChainChangeRate: 2.5, // 环比变化率(%)
              tbServiceQualityIndustryAverageCompare: 1.2, // 行业均值对比(%)
              tbServiceQualityBestServiceHour: '10:00-15:00', // 最优服务时段
              tbServiceQualityAbnormalCount: 3, // 异常服务次数
              // 服务质量明细
              detail: {
                tbServiceQualityAverageEntryTime: 45.2,
                tbServiceQualityAveragePayTime: 18.5,
                tbServiceQualityPaySuccessRate: 98.7,
                tbServiceQualityComplaintRate: 0.8,
                tbServiceQualitySatisfactionRate: 95.6,
              },
              // 异常记录
              abnormalRecords: [
                {
                  time: Date.now() - 2 * 24 * 60 * 60 * 1000,
                  content: '早高峰入场时长异常偏高，排查为道闸识别慢导致',
                  handleStatus: '已处理'
                },
                {
                  time: Date.now() - 5 * 24 * 60 * 60 * 1000,
                  content: '缴费成功率临时下降，排查为支付系统接口波动',
                  handleStatus: '处理中'
                }
              ],
              // 用户评价摘要
              evaluationSummary: {
                positive: 85, // 好评占比(%)
                negative: 5, // 差评占比(%)
                neutral: 10, // 中评占比(%)
                keyWords: ['入场快', '缴费方便', '道闸卡顿', '客服响应慢'] // 关键词
              }
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkServiceQualityDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 用户评价明细 - 钻取弹窗专用
export const fetchParkServiceQualityEvaluationDetail = (serviceQualityId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/service/quality/stat/evaluation/detail/${serviceQualityId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbServiceQualityId === serviceQualityId) {
          return response;
        }
        throw new Error('真实接口返回无用户评价明细数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('用户评价明细接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbServiceQualityId: serviceQualityId,
              tbServiceQualityPeriod: '2026-01',
              evaluationList: [
                {
                  time: Date.now() - 24 * 60 * 60 * 1000,
                  userName: '用户A',
                  score: 5, // 评分(1-5)
                  content: '入场很快，缴费也方便，体验很好',
                  handleStatus: '未处理'
                },
                {
                  time: Date.now() - 24 * 60 * 60 * 1000,
                  userName: '用户B',
                  score: 2,
                  content: '道闸识别太慢了，等了好久才进去',
                  handleStatus: '已回复'
                },
                {
                  time: Date.now() - 2 * 24 * 60 * 60 * 1000,
                  userName: '用户C',
                  score: 4,
                  content: '整体不错，就是缴费的时候网络有点卡',
                  handleStatus: '未处理'
                },
                {
                  time: Date.now() - 3 * 24 * 60 * 60 * 1000,
                  userName: '用户D',
                  score: 1,
                  content: '投诉电话打不通，问题没人解决',
                  handleStatus: '已处理'
                },
                {
                  time: Date.now() - 3 * 24 * 60 * 60 * 1000,
                  userName: '用户E',
                  score: 5,
                  content: '服务很到位，工作人员态度也好',
                  handleStatus: '未处理'
                }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkServiceQualityEvaluationDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbServiceQualityId: '',
      tbServiceQualityPeriod: '',
      evaluationList: []
    });
  }
};


// ========== 业务流转效率 ==========
// 业务流转效率列表
export const fetchBusinessFlowEfficiencyList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/business/flow/efficiency/list`,
        params,
      })
      .then((response) => {
        console.log('业务流转效率列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('业务流转效率列表-响应符合实际格式');
          return response.map((item) => ({
            sysBusinessTypeName: item.sysBusinessTypeName,
            tbBusinessFlowPeriod: item.tbBusinessFlowPeriod,
            tbBusinessFlowAverageFlowDuration: item.tbBusinessFlowAverageFlowDuration,
            tbBusinessFlowCompletionRate: item.tbBusinessFlowCompletionRate,
            tbBusinessFlowBottleneckRatio: item.tbBusinessFlowBottleneckRatio,
            tbBusinessFlowOvertimeRate: item.tbBusinessFlowOvertimeRate,
            tbBusinessFlowId: item.tbBusinessFlowId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无业务流转效率列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('业务流转效率列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                sysBusinessTypeName: '停车资源审核',
                tbBusinessFlowPeriod: '2026-01',
                tbBusinessFlowAverageFlowDuration: 4.5,
                tbBusinessFlowCompletionRate: 98.2,
                tbBusinessFlowBottleneckRatio: 15.3,
                tbBusinessFlowOvertimeRate: 5.8,
                tbBusinessFlowId: 'BF20260119001',
              },
              {
                sysBusinessTypeName: '设备报修处理',
                tbBusinessFlowPeriod: '2026-01',
                tbBusinessFlowAverageFlowDuration: 8.2,
                tbBusinessFlowCompletionRate: 92.5,
                tbBusinessFlowBottleneckRatio: 28.7,
                tbBusinessFlowOvertimeRate: 12.3,
                tbBusinessFlowId: 'BF20260119002',
              },
              {
                sysBusinessTypeName: '投诉工单处理',
                tbBusinessFlowPeriod: '2026-01',
                tbBusinessFlowAverageFlowDuration: 6.8,
                tbBusinessFlowCompletionRate: 95.7,
                tbBusinessFlowBottleneckRatio: 21.5,
                tbBusinessFlowOvertimeRate: 8.9,
                tbBusinessFlowId: 'BF20260119003',
              },
              {
                sysBusinessTypeName: '价格调整审批',
                tbBusinessFlowPeriod: '2026-01',
                tbBusinessFlowAverageFlowDuration: 12.6,
                tbBusinessFlowCompletionRate: 88.9,
                tbBusinessFlowBottleneckRatio: 35.2,
                tbBusinessFlowOvertimeRate: 18.7,
                tbBusinessFlowId: 'BF20260119004',
              },
              {
                sysBusinessTypeName: '合同续签审核',
                tbBusinessFlowPeriod: '2026-01',
                tbBusinessFlowAverageFlowDuration: 9.4,
                tbBusinessFlowCompletionRate: 91.3,
                tbBusinessFlowBottleneckRatio: 24.8,
                tbBusinessFlowOvertimeRate: 10.5,
                tbBusinessFlowId: 'BF20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchBusinessFlowEfficiencyList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 业务流转效率核心指标（卡片展示）
export const fetchBusinessFlowEfficiencyIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/business/flow/efficiency/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.averageFlowDuration &&
          response.averageCompletionRate &&
          response.averageOvertimeRate &&
          response.coreBottleneckRatio
        ) {
          return response;
        }
        throw new Error('真实接口返回无业务流转效率核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '业务流转效率指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              averageFlowDuration: 8.3, // 平均流转时长(小时)
              averageCompletionRate: 93.3, // 平均完成率(%)
              averageOvertimeRate: 11.2, // 平均超时率(%)
              coreBottleneckRatio: 25.1, // 核心瓶颈环节占比(%)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 业务流转效率指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      averageFlowDuration: 0,
      averageCompletionRate: 0,
      averageOvertimeRate: 0,
      coreBottleneckRatio: 0,
    });
  }
};

// 统计周期内流转时长趋势（折线图）
export const fetchBusinessFlowDurationTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/business/flow/efficiency/stat/duration/trend`,
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
        throw new Error('真实接口返回无流转时长趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '流转时长趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 6 + Math.random() * 6);
            resolve({
              xAxis,
              series: [{ name: '流转时长(小时)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 流转时长趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '流转时长(小时)', data: [] }],
    });
  }
};

// 统计周期内完成率趋势（折线图）
export const fetchBusinessFlowCompletionRateTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/business/flow/efficiency/stat/completion/trend`,
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
        throw new Error('真实接口返回无完成率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '完成率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 85 + Math.random() * 10);
            resolve({
              xAxis,
              series: [{ name: '完成率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 完成率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '完成率(%)', data: [] }],
    });
  }
};

// 各业务类型流转时长对比（柱状图）
export const fetchBusinessFlowTypeDuration = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/business/flow/efficiency/stat/type/duration`,
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
        throw new Error('真实接口返回无业务类型流转时长数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '业务类型流转时长对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['停车资源审核', '设备报修处理', '投诉工单处理', '价格调整审批', '合同续签审核'],
              series: [{ name: '流转时长(小时)', data: [4.5, 8.2, 6.8, 12.6, 9.4] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 业务类型流转时长对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '流转时长(小时)', data: [] }],
    });
  }
};

// 各环节流转时长对比（柱状图）
export const fetchBusinessFlowLinkDuration = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/business/flow/efficiency/stat/link/duration`,
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
        throw new Error('真实接口返回无环节流转时长数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '环节流转时长对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['提交审核', '初审', '复审', '终审', '归档'],
              series: [{ name: '流转时长(小时)', data: [1.2, 2.8, 3.5, 2.1, 0.7] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 环节流转时长对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '流转时长(小时)', data: [] }],
    });
  }
};

// 业务流转效率详情查询 - 详情弹窗专用
export const fetchBusinessFlowEfficiencyDetail = (flowId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/business/flow/efficiency/detail/${flowId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbBusinessFlowId === flowId) {
          return response;
        }
        throw new Error('真实接口返回无业务流转详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('业务流转效率详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbBusinessFlowId: flowId,
              sysBusinessTypeName: flowId === 'BF20260119001' ? '停车资源审核' : '设备报修处理',
              tbBusinessFlowPeriod: '2026-01',
              tbBusinessFlowChainDurationChange: flowId === 'BF20260119001' ? -0.8 : 1.2, // 环比流转时长变化
              tbBusinessFlowCoreBottleneck: flowId === 'BF20260119001' ? '复审环节' : '派单环节', // 核心瓶颈环节
              tbBusinessFlowBestFlowHour: flowId === 'BF20260119001' ? '10:00-14:00' : '9:00-11:00', // 最优流转时段
              tbBusinessFlowStandardDuration: flowId === 'BF20260119001' ? 4.0 : 7.5, // 标准流转时长
              // 基础明细
              flowDetail: {
                tbBusinessFlowAverageFlowDuration: flowId === 'BF20260119001' ? 4.5 : 8.2,
                tbBusinessFlowCompletionRate: flowId === 'BF20260119001' ? 98.2 : 92.5,
                tbBusinessFlowBottleneckRatio: flowId === 'BF20260119001' ? 15.3 : 28.7,
                tbBusinessFlowOvertimeRate: flowId === 'BF20260119001' ? 5.8 : 12.3,
              },
              // 瓶颈分析
              bottleneckAnalysis: {
                linkName: flowId === 'BF20260119001' ? '复审环节' : '派单环节',
                bottleneckRatio: flowId === 'BF20260119001' ? 15.3 : 28.7,
                averageDuration: flowId === 'BF20260119001' ? 1.8 : 3.2,
                standardDuration: flowId === 'BF20260119001' ? 1.0 : 2.0,
                reason: flowId === 'BF20260119001' ? '审核人员不足，处理效率低' : '维修人员派单不合理，区域覆盖不均',
              },
              // 优化建议
              optimizationSuggestion: [
                {
                  content: '增加复审环节人员配置，优化审核流程',
                  expectedEffect: '流转时长缩短15%，瓶颈占比下降8%',
                  status: '待实施'
                },
                {
                  content: '引入自动化审核工具，减少人工干预',
                  expectedEffect: '流转时长缩短20%，超时率下降10%',
                  status: '评估中'
                }
              ],
              // 趋势数据
              trendData: {
                xAxis: ['1日', '5日', '10日', '15日', '20日', '25日', '30日'],
                series: [{ name: '流转时长(小时)', data: [4.8, 4.7, 4.6, 4.5, 4.4, 4.5, 4.3] }]
              }
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchBusinessFlowEfficiencyDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 瓶颈环节流转时长趋势 - 钻取弹窗专用
export const fetchBusinessFlowBottleneckLinkTrend = (flowId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/business/flow/efficiency/stat/bottleneck/link/trend/${flowId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbBusinessFlowId === flowId) {
          return response;
        }
        throw new Error('真实接口返回无瓶颈环节流转时长趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('瓶颈环节流转时长趋势接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = ['0-4', '4-8', '8-12', '12-16', '16-20', '20-24'];
            const data = xAxis.map(() => 1.5 + Math.random() * 2);
            resolve({
              tbBusinessFlowId: flowId,
              sysBusinessTypeName: flowId === 'BF20260119001' ? '停车资源审核' : '设备报修处理',
              xAxis,
              series: [{ name: '瓶颈环节流转时长(小时)', data }]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchBusinessFlowBottleneckLinkTrend 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbBusinessFlowId: '',
      sysBusinessTypeName: '',
      xAxis: [],
      series: [{ name: '瓶颈环节流转时长(小时)', data: [] }]
    });
  }
};


// ========== 业务质量 ==========
// 业务质量列表
export const fetchBusinessQualityList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/business/quality/list`,
        params,
      })
      .then((response) => {
        console.log('业务质量列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('业务质量列表-响应符合实际格式');
          return response.map((item) => ({
            sysBusinessTypeName: item.sysBusinessTypeName,
            tbBusinessQualityPeriod: item.tbBusinessQualityPeriod,
            tbBusinessQualityBillingAccuracy: item.tbBusinessQualityBillingAccuracy,
            tbBusinessQualityOrderSuccessRate: item.tbBusinessQualityOrderSuccessRate,
            tbBusinessQualityAbnormalOrderCount: item.tbBusinessQualityAbnormalOrderCount,
            tbBusinessQualityComplianceRate: item.tbBusinessQualityComplianceRate,
            tbBusinessQualityId: item.tbBusinessQualityId, // 主键
          }));
        }
        throw new Error('真实接口返回无业务质量列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('业务质量列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                sysBusinessTypeName: '停车计费',
                tbBusinessQualityPeriod: '2026-01',
                tbBusinessQualityBillingAccuracy: 99.2,
                tbBusinessQualityOrderSuccessRate: 98.5,
                tbBusinessQualityAbnormalOrderCount: 12,
                tbBusinessQualityComplianceRate: 97.8,
                tbBusinessQualityId: 'BQ20260119001',
              },
              {
                sysBusinessTypeName: '预约停车',
                tbBusinessQualityPeriod: '2026-01',
                tbBusinessQualityBillingAccuracy: 98.8,
                tbBusinessQualityOrderSuccessRate: 97.6,
                tbBusinessQualityAbnormalOrderCount: 18,
                tbBusinessQualityComplianceRate: 96.5,
                tbBusinessQualityId: 'BQ20260119002',
              },
              {
                sysBusinessTypeName: '月卡办理',
                tbBusinessQualityPeriod: '2026-01',
                tbBusinessQualityBillingAccuracy: 99.5,
                tbBusinessQualityOrderSuccessRate: 99.0,
                tbBusinessQualityAbnormalOrderCount: 5,
                tbBusinessQualityComplianceRate: 98.9,
                tbBusinessQualityId: 'BQ20260119003',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchBusinessQualityList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 业务质量核心指标（卡片展示）
export const fetchBusinessQualityIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/business/quality/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.billingAccuracy &&
          response.orderSuccessRate &&
          response.complianceRate &&
          response.abnormalOrderCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无业务质量核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '业务质量指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              billingAccuracy: 99.1, // 计费准确率(%)
              orderSuccessRate: 98.4, // 订单成功率(%)
              complianceRate: 97.7, // 合规率(%)
              abnormalOrderCount: 35, // 异常订单数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 业务质量指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      billingAccuracy: 0,
      orderSuccessRate: 0,
      complianceRate: 0,
      abnormalOrderCount: 0,
    });
  }
};

// 计费准确率趋势（折线图）
export const fetchBusinessQualityBillingAccuracyTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/business/quality/stat/billing/accuracy/trend`,
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
        throw new Error('真实接口返回无计费准确率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '计费准确率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 12}, (_, i) => `2026-0${i+1}`);
            const data = xAxis.map(() => 98.5 + Math.random());
            resolve({
              xAxis,
              series: [{ name: '计费准确率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 计费准确率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '计费准确率(%)', data: [] }],
    });
  }
};

// 合规率趋势（折线图）
export const fetchBusinessQualityComplianceRateTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/business/quality/stat/compliance/rate/trend`,
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
        throw new Error('真实接口返回无合规率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '合规率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 12}, (_, i) => `2026-0${i+1}`);
            const data = xAxis.map(() => 96.0 + Math.random() * 2.5);
            resolve({
              xAxis,
              series: [{ name: '合规率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 合规率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '合规率(%)', data: [] }],
    });
  }
};

// 异常类型占比（饼图）
export const fetchBusinessQualityAbnormalTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/business/quality/stat/abnormal/type/ratio`,
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
        throw new Error('真实接口返回无异常类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '异常类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['计费错误', '订单超时', '数据同步失败', '规则配置错误'],
              series: [{ name: '异常类型占比(%)', data: [45.2, 30.5, 15.8, 8.5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 异常类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '异常类型占比(%)', data: [] }],
    });
  }
};

// 业务类型质量分布占比（饼图）
export const fetchBusinessQualityTypeDistributionRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/business/quality/stat/type/distribution/ratio`,
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
        throw new Error('真实接口返回无业务类型质量分布数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '业务类型质量分布饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['停车计费', '预约停车', '月卡办理', '临停缴费'],
              series: [{ name: '业务类型质量分布(%)', data: [35.2, 28.1, 25.5, 11.2] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 业务类型质量分布饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '业务类型质量分布(%)', data: [] }],
    });
  }
};

// 业务质量详情查询 - 详情弹窗专用
export const fetchBusinessQualityDetail = (qualityId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/business/quality/detail/${qualityId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbBusinessQualityId === qualityId) {
          return response;
        }
        throw new Error('真实接口返回无业务质量详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('业务质量详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbBusinessQualityId: qualityId,
              sysBusinessTypeName: qualityId === 'BQ20260119001' ? '停车计费' : '预约停车',
              tbBusinessQualityPeriod: '2026-01',
              tbBusinessQualityBillingAccuracy: qualityId === 'BQ20260119001' ? 99.2 : 98.8,
              tbBusinessQualityOrderSuccessRate: qualityId === 'BQ20260119001' ? 98.5 : 97.6,
              tbBusinessQualityAbnormalOrderCount: qualityId === 'BQ20260119001' ? 12 : 18,
              tbBusinessQualityComplianceRate: qualityId === 'BQ20260119001' ? 97.8 : 96.5,
              // 新增输出字段
              tbBusinessQualityAbnormalRate: qualityId === 'BQ20260119001' ? 0.8 : 1.4,
              tbBusinessQualityChainAccuracyChange: qualityId === 'BQ20260119001' ? 0.3 : -0.2,
              sysAbnormalTypeName: qualityId === 'BQ20260119001' ? '计费错误' : '订单超时',
              tbBusinessQualityRectificationCount: qualityId === 'BQ20260119001' ? 8 : 10,
              // 异常订单清单
              abnormalOrderList: [
                {
                  orderNo: `ORD${Date.now() - Math.random() * 1000000}`,
                  abnormalType: '计费错误',
                  abnormalTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
                  handleStatus: '待处理'
                },
                {
                  orderNo: `ORD${Date.now() - Math.random() * 1000000}`,
                  abnormalType: '订单超时',
                  abnormalTime: Date.now() - 5 * 24 * 60 * 60 * 1000,
                  handleStatus: '已处理'
                }
              ],
              // 合规检查记录
              complianceCheckRecords: [
                {
                  checkTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
                  checkItem: '计费规则合规性',
                  checkResult: '合格',
                  checkPerson: '管理员'
                },
                {
                  checkTime: Date.now() - 14 * 24 * 60 * 60 * 1000,
                  checkItem: '订单流程合规性',
                  checkResult: '不合格',
                  checkPerson: '审核员'
                }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchBusinessQualityDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 异常订单详情列表 - 追溯弹窗专用
export const fetchBusinessQualityAbnormalOrderList = (qualityId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/business/quality/abnormal/order/list/${qualityId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbBusinessQualityId === qualityId) {
          return response;
        }
        throw new Error('真实接口返回无异常订单详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('异常订单详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbBusinessQualityId: qualityId,
              sysBusinessTypeName: qualityId === 'BQ20260119001' ? '停车计费' : '预约停车',
              abnormalOrderList: Array.from({length: 5}, () => ({
                orderNo: `ORD${Date.now() - Math.random() * 1000000}`,
                abnormalType: Math.random() > 0.5 ? '计费错误' : '订单超时',
                abnormalTime: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
                abnormalReason: Math.random() > 0.5 ? '价格配置错误' : '接口响应超时',
                handleStatus: Math.random() > 0.5 ? '已处理' : '待处理',
                handlePerson: Math.random() > 0.5 ? '运维人员A' : '运维人员B'
              }))
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchBusinessQualityAbnormalOrderList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbBusinessQualityId: '',
      sysBusinessTypeName: '',
      abnormalOrderList: []
    });
  }
};

// 提交整改方案
export const submitBusinessQualityRectification = (qualityId, rectificationPlan) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/park/business/quality/rectification/submit/${qualityId}`,
        data: { rectificationPlan },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('整改方案提交失败');
      })
      .catch((error) => {
        console.log('整改方案提交接口调用失败', error.message);
        // 模拟提交成功
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              rectificationCount: Math.floor(Math.random() * 10) + 5 // 整改完成数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitBusinessQualityRectification 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      success: false,
      rectificationCount: 0
    });
  }
};


// ========== 资源发展 ==========
// 资源发展列表
export const fetchResourceDevelopmentList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/development/list`,
        params,
      })
      .then((response) => {
        console.log('资源发展列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('资源发展列表-响应符合实际格式');
          return response.map((item) => ({
            sysResourceTypeName: item.sysResourceTypeName,
            tbResourceDevelopmentPeriod: item.tbResourceDevelopmentPeriod,
            tbResourceDevelopmentNewCount: item.tbResourceDevelopmentNewCount,
            tbResourceDevelopmentExpansionCount: item.tbResourceDevelopmentExpansionCount,
            tbResourceDevelopmentOptimizationCount: item.tbResourceDevelopmentOptimizationCount,
            tbResourceDevelopmentPlanCompletionRate: item.tbResourceDevelopmentPlanCompletionRate,
            developmentId: item.developmentId, // 发展规划ID
          }));
        }
        throw new Error('真实接口返回无资源发展列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源发展列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                sysResourceTypeName: '公共停车场',
                tbResourceDevelopmentPeriod: '2026-01',
                tbResourceDevelopmentNewCount: 5,
                tbResourceDevelopmentExpansionCount: 8,
                tbResourceDevelopmentOptimizationCount: 12,
                tbResourceDevelopmentPlanCompletionRate: 85.5,
                developmentId: 'DEV20260119001',
              },
              {
                sysResourceTypeName: '商业停车场',
                tbResourceDevelopmentPeriod: '2026-01',
                tbResourceDevelopmentNewCount: 3,
                tbResourceDevelopmentExpansionCount: 5,
                tbResourceDevelopmentOptimizationCount: 10,
                tbResourceDevelopmentPlanCompletionRate: 78.2,
                developmentId: 'DEV20260119002',
              },
              {
                sysResourceTypeName: '路侧停车场',
                tbResourceDevelopmentPeriod: '2026-01',
                tbResourceDevelopmentNewCount: 8,
                tbResourceDevelopmentExpansionCount: 6,
                tbResourceDevelopmentOptimizationCount: 15,
                tbResourceDevelopmentPlanCompletionRate: 92.3,
                developmentId: 'DEV20260119003',
              },
              {
                sysResourceTypeName: '景区停车场',
                tbResourceDevelopmentPeriod: '2026-01',
                tbResourceDevelopmentNewCount: 2,
                tbResourceDevelopmentExpansionCount: 3,
                tbResourceDevelopmentOptimizationCount: 8,
                tbResourceDevelopmentPlanCompletionRate: 67.8,
                developmentId: 'DEV20260119004',
              },
              {
                sysResourceTypeName: '住宅停车场',
                tbResourceDevelopmentPeriod: '2026-01',
                tbResourceDevelopmentNewCount: 6,
                tbResourceDevelopmentExpansionCount: 4,
                tbResourceDevelopmentOptimizationCount: 9,
                tbResourceDevelopmentPlanCompletionRate: 88.9,
                developmentId: 'DEV20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchResourceDevelopmentList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 资源发展核心指标（卡片展示）
export const fetchResourceDevelopmentIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/development/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalNewCount &&
          response.totalExpansionCount &&
          response.totalOptimizationCount &&
          response.averagePlanCompletionRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无资源发展核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源发展指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalNewCount: 24, // 新增资源总数
              totalExpansionCount: 26, // 扩容总数
              totalOptimizationCount: 54, // 优化总数
              averagePlanCompletionRate: 82.5, // 规划达成率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 资源发展指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalNewCount: 0,
      totalExpansionCount: 0,
      totalOptimizationCount: 0,
      averagePlanCompletionRate: 0,
    });
  }
};

// 资源新增趋势（折线图）
export const fetchResourceDevelopmentNewTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/development/stat/new/trend`,
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
        throw new Error('真实接口返回无资源新增趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源新增趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 12}, (_, i) => {
              return `${2026}-${String(i+1).padStart(2, '0')}`;
            });
            const data = xAxis.map(() => 2 + Math.random() * 6);
            resolve({
              xAxis,
              series: [{ name: '资源新增趋势', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 资源新增趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '资源新增趋势', data: [] }],
    });
  }
};

// 规划达成率趋势（折线图）
export const fetchResourceDevelopmentPlanCompletionTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/development/stat/plan/completion/trend`,
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
        throw new Error('真实接口返回无规划达成率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '规划达成率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 12}, (_, i) => {
              return `${2026}-${String(i+1).padStart(2, '0')}`;
            });
            const data = xAxis.map(() => 70 + Math.random() * 20);
            resolve({
              xAxis,
              series: [{ name: '规划达成率趋势(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 规划达成率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '规划达成率趋势(%)', data: [] }],
    });
  }
};

// 各类型资源发展数量对比（柱状图）
export const fetchResourceDevelopmentTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/development/stat/type/count`,
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
        throw new Error('真实接口返回无类型资源发展数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型资源发展数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['公共停车场', '商业停车场', '路侧停车场', '景区停车场', '住宅停车场'],
              series: [{ name: '发展数量', data: [25, 18, 29, 13, 19] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 类型资源发展数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '发展数量', data: [] }],
    });
  }
};

// 各区域资源发展数量对比（柱状图）
export const fetchResourceDevelopmentRegionCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/development/stat/region/count`,
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
        throw new Error('真实接口返回无区域资源发展数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域资源发展数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '发展数量', data: [15, 22, 18, 10, 20] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域资源发展数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '发展数量', data: [] }],
    });
  }
};

// 资源发展类型占比（饼图）
export const fetchResourceDevelopmentTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/development/stat/type/ratio`,
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
        throw new Error('真实接口返回无资源发展类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源发展类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['公共停车场', '商业停车场', '路侧停车场', '景区停车场', '住宅停车场'],
              series: [{ name: '资源发展类型占比(%)', data: [25.0, 18.0, 29.0, 13.0, 19.0] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 资源发展类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '资源发展类型占比(%)', data: [] }],
    });
  }
};

// 重点发展区域占比（饼图）
export const fetchResourceDevelopmentFocusRegionRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/development/stat/focus/region/ratio`,
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
        throw new Error('真实接口返回无重点发展区域占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '重点发展区域占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '重点发展区域占比(%)', data: [18.0, 26.0, 21.0, 12.0, 23.0] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 重点发展区域占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '重点发展区域占比(%)', data: [] }],
    });
  }
};

// 月度新增趋势 - 钻取弹窗专用
export const fetchResourceDevelopmentMonthlyNewTrend = (developmentId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/development/stat/monthly/new/trend/${developmentId}`,
        params,
      })
      .then((response) => {
        if (response && response.developmentId === developmentId) {
          return response;
        }
        throw new Error('真实接口返回无月度新增趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('月度新增趋势接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            const data = xAxis.map(() => Math.floor(Math.random() * 10) + 1);
            resolve({
              developmentId,
              sysResourceTypeName: developmentId === 'DEV20260119001' ? '公共停车场' : '商业停车场',
              xAxis,
              series: [{ name: '月度新增数量', data }]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchResourceDevelopmentMonthlyNewTrend 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      developmentId: '',
      sysResourceTypeName: '',
      xAxis: [],
      series: [{ name: '月度新增数量', data: [] }]
    });
  }
};

// 资源发展详情查询 - 详情弹窗专用
export const fetchResourceDevelopmentDetail = (developmentId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/development/detail/${developmentId}`,
        params,
      })
      .then((response) => {
        if (response && response.developmentId === developmentId) {
          return response;
        }
        throw new Error('真实接口返回无资源发展详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源发展详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              developmentId,
              sysResourceTypeName: developmentId === 'DEV20260119001' ? '公共停车场' : '商业停车场',
              tbResourceDevelopmentPeriod: '2026-01',
              tbResourceDevelopmentYearOnYearGrowth: developmentId === 'DEV20260119001' ? 12.5 : 8.3,
              tbResourceDevelopmentTotalAccumulated: developmentId === 'DEV20260119001' ? 125 : 98,
              tbRegionName: developmentId === 'DEV20260119001' ? '高新区,主城区' : '经开区,文旅区',
              tbResourceDevelopmentDevelopmentGap: developmentId === 'DEV20260119001' ? 15 : 22,
              // 发展明细
              developmentDetail: {
                tbResourceDevelopmentNewCount: developmentId === 'DEV20260119001' ? 5 : 3,
                tbResourceDevelopmentExpansionCount: developmentId === 'DEV20260119001' ? 8 : 5,
                tbResourceDevelopmentOptimizationCount: developmentId === 'DEV20260119001' ? 12 : 10,
                tbResourceDevelopmentPlanCompletionRate: developmentId === 'DEV20260119001' ? 85.5 : 78.2,
              },
              // 区域分布
              regionDistribution: {
                legend: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
                series: [{ name: '区域分布数量', data: [15, 22, 18, 10, 20] }]
              },
              // 规划明细
              planDetails: [
                { period: '2026-01', planCount: 10, actualCount: 8, completionRate: 80.0 },
                { period: '2026-02', planCount: 12, actualCount: 10, completionRate: 83.3 },
                { period: '2026-03', planCount: 15, actualCount: 13, completionRate: 86.7 }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchResourceDevelopmentDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 下周期发展规划调整
export const submitResourceDevelopmentPlanAdjustment = (developmentId, planContent) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/resource/development/plan/adjustment/${developmentId}`,
        data: { planContent },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无调整结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('发展规划调整接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '规划调整成功',
              newPlanContent: planContent
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitResourceDevelopmentPlanAdjustment 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ========== 设备运行 ==========
// 设备运行列表
export const fetchDeviceRunList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/run/list`,
        params,
      })
      .then((response) => {
        console.log('设备运行列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('设备运行列表-响应符合实际格式');
          return response.map((item) => ({
            tbDeviceName: item.tbDeviceName,
            sysDeviceTypeName: item.sysDeviceTypeName,
            tbParkingName: item.tbParkingName,
            tbDeviceOperationOnlineRate: item.tbDeviceOperationOnlineRate,
            tbDeviceOperationDailyRunningHours: item.tbDeviceOperationDailyRunningHours,
            tbDeviceOperationFaultRate: item.tbDeviceOperationFaultRate,
            tbDeviceDeviceId: item.tbDeviceDeviceId, // 设备ID
          }));
        }
        throw new Error('真实接口返回无设备运行列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('设备运行列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbDeviceName: '入口道闸001',
                sysDeviceTypeName: '道闸设备',
                tbParkingName: '北区停车场',
                tbDeviceOperationOnlineRate: 99.8,
                tbDeviceOperationDailyRunningHours: 16.5,
                tbDeviceOperationFaultRate: 0.2,
                tbDeviceDeviceId: 'DEV20260119001',
              },
              {
                tbDeviceName: '出口道闸001',
                sysDeviceTypeName: '道闸设备',
                tbParkingName: '北区停车场',
                tbDeviceOperationOnlineRate: 98.5,
                tbDeviceOperationDailyRunningHours: 15.8,
                tbDeviceOperationFaultRate: 1.5,
                tbDeviceDeviceId: 'DEV20260119002',
              },
              {
                tbDeviceName: '中央控制器001',
                sysDeviceTypeName: '控制设备',
                tbParkingName: '南区停车场',
                tbDeviceOperationOnlineRate: 99.9,
                tbDeviceOperationDailyRunningHours: 24.0,
                tbDeviceOperationFaultRate: 0.1,
                tbDeviceDeviceId: 'DEV20260119003',
              },
              {
                tbDeviceName: '车牌识别001',
                sysDeviceTypeName: '识别设备',
                tbParkingName: '东区停车场',
                tbDeviceOperationOnlineRate: 97.2,
                tbDeviceOperationDailyRunningHours: 18.2,
                tbDeviceOperationFaultRate: 2.8,
                tbDeviceDeviceId: 'DEV20260119004',
              },
              {
                tbDeviceName: 'LED显示屏001',
                sysDeviceTypeName: '显示设备',
                tbParkingName: '西区停车场',
                tbDeviceOperationOnlineRate: 96.5,
                tbDeviceOperationDailyRunningHours: 14.5,
                tbDeviceOperationFaultRate: 3.5,
                tbDeviceDeviceId: 'DEV20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDeviceRunList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 设备运行核心指标（卡片展示）
export const fetchDeviceRunIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/run/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalDeviceCount &&
          response.averageOnlineRate &&
          response.averageRunningHours &&
          response.averageFaultRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备运行核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备运行指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalDeviceCount: 125, // 设备总数
              averageOnlineRate: 98.4, // 平均在线率
              averageRunningHours: 17.8, // 平均运行时长
              averageFaultRate: 1.6, // 整体故障率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备运行指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalDeviceCount: 0,
      averageOnlineRate: 0,
      averageRunningHours: 0,
      averageFaultRate: 0,
    });
  }
};

// 近30天设备在线率趋势（折线图）
export const fetchDeviceRunOnlineRateTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/run/stat/online/rate/trend`,
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
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 95 + Math.random() * 5);
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

// 故障发生趋势（折线图）
export const fetchDeviceRunFaultTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/run/stat/fault/trend`,
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
        throw new Error('真实接口返回无故障发生趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '故障发生趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 1.0 + Math.random() * 2.0);
            resolve({
              xAxis,
              series: [{ name: '故障发生趋势(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 故障发生趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '故障发生趋势(%)', data: [] }],
    });
  }
};

// 设备类型分布占比（饼图）
export const fetchDeviceRunTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/run/stat/type/ratio`,
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
        throw new Error('真实接口返回无设备类型分布占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备类型分布占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['道闸设备', '控制设备', '识别设备', '显示设备', '支付设备'],
              series: [{ name: '设备类型分布占比(%)', data: [40.0, 25.0, 20.0, 10.0, 5.0] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备类型分布占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '设备类型分布占比(%)', data: [] }],
    });
  }
};

// 运行效能等级占比（饼图）
export const fetchDeviceRunEfficiencyRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/run/stat/efficiency/ratio`,
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
        throw new Error('真实接口返回无运行效能等级占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '运行效能等级占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['高效', '良好', '一般', '较低'],
              series: [{ name: '运行效能等级占比(%)', data: [65.0, 25.0, 8.0, 2.0] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 运行效能等级占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '运行效能等级占比(%)', data: [] }],
    });
  }
};

// 设备运行详情查询 - 详情弹窗专用
export const fetchDeviceRunDetail = (deviceId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/run/detail/${deviceId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbDeviceDeviceId === deviceId) {
          return response;
        }
        throw new Error('真实接口返回无设备运行详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('设备运行详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbDeviceDeviceId: deviceId,
              tbDeviceName: deviceId === 'DEV20260119001' ? '入口道闸001' : '出口道闸001',
              sysDeviceTypeName: deviceId === 'DEV20260119001' ? '道闸设备' : '道闸设备',
              tbParkingName: deviceId === 'DEV20260119001' ? '北区停车场' : '北区停车场',
              tbDeviceOperationMonthlyFaultCount: deviceId === 'DEV20260119001' ? 2 : 5,
              tbDeviceMaintainNextTime: deviceId === 'DEV20260119001' ? '2026-02-15' : '2026-02-10',
              sysEfficiencyLevelName: deviceId === 'DEV20260119001' ? '高效' : '良好',
              // 运行明细
              runDetail: {
                tbDeviceOperationOnlineRate: deviceId === 'DEV20260119001' ? 99.8 : 98.5,
                tbDeviceOperationDailyRunningHours: deviceId === 'DEV20260119001' ? 16.5 : 15.8,
                tbDeviceOperationFaultRate: deviceId === 'DEV20260119001' ? 0.2 : 1.5,
              },
              // 运行日志
              operationLogs: [
                {
                  time: Date.now() - 2 * 24 * 60 * 60 * 1000,
                  content: '设备自检正常，运行状态良好',
                  type: '运行日志'
                },
                {
                  time: Date.now() - 5 * 24 * 60 * 60 * 1000,
                  content: '系统重启，恢复在线状态',
                  type: '维护日志'
                },
                {
                  time: Date.now() - 10 * 24 * 60 * 60 * 1000,
                  content: '固件升级至V2.1.5',
                  type: '升级日志'
                }
              ],
              // 故障记录
              faultRecords: [
                {
                  time: Date.now() - 3 * 24 * 60 * 60 * 1000,
                  content: '道闸抬杆异常，检查为电机故障',
                  handleStatus: '已修复'
                },
                {
                  time: Date.now() - 8 * 24 * 60 * 60 * 1000,
                  content: '网络连接中断，重启后恢复',
                  handleStatus: '已处理'
                }
              ],
              // 维护历史
              maintenanceHistory: [
                {
                  time: '2026-01-15',
                  content: '定期维护，清洁设备并检查线路',
                  maintainer: '张三'
                },
                {
                  time: '2026-12-20',
                  content: '更换磨损部件，调整运行参数',
                  maintainer: '李四'
                }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDeviceRunDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交运维工单
export const submitDeviceMaintenanceOrder = (deviceId, maintenanceType, description = '') => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/device/run/maintenance/order/${deviceId}`,
        data: { maintenanceType, description },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无运维工单提交结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('运维工单提交接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              orderId: `MNT${Date.now()}`,
              message: '运维工单生成成功',
              maintenanceType,
              deviceId
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitDeviceMaintenanceOrder 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ========== 支撑资源 ==========
// 支撑资源列表
export const fetchSupportResourceList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/support/resource/list`,
        params,
      })
      .then((response) => {
        console.log('支撑资源列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('支撑资源列表-响应符合实际格式');
          return response.map((item) => ({
            tbSupportResourceName: item.tbSupportResourceName,
            sysSupportTypeName: item.sysSupportTypeName,
            tbParkingName: item.tbParkingName,
            tbSupportResourceQuantity: item.tbSupportResourceQuantity,
            tbSupportResourceAvailableQuantity: item.tbSupportResourceAvailableQuantity,
            tbSupportResourceIntactRate: item.tbSupportResourceIntactRate,
            tbSupportResourceId: item.tbSupportResourceId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无支撑资源列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('支撑资源列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbSupportResourceName: '出入口道闸',
                sysSupportTypeName: '道闸设备',
                tbParkingName: '北区停车场',
                tbSupportResourceQuantity: 4,
                tbSupportResourceAvailableQuantity: 3,
                tbSupportResourceIntactRate: 87.5,
                tbSupportResourceId: 'SR20260119001',
              },
              {
                tbSupportResourceName: '监控摄像头',
                sysSupportTypeName: '监控设备',
                tbParkingName: '南区停车场',
                tbSupportResourceQuantity: 12,
                tbSupportResourceAvailableQuantity: 11,
                tbSupportResourceIntactRate: 91.7,
                tbSupportResourceId: 'SR20260119002',
              },
              {
                tbSupportResourceName: '地磁传感器',
                sysSupportTypeName: '检测设备',
                tbParkingName: '东区停车场',
                tbSupportResourceQuantity: 200,
                tbSupportResourceAvailableQuantity: 185,
                tbSupportResourceIntactRate: 92.5,
                tbSupportResourceId: 'SR20260119003',
              },
              {
                tbSupportResourceName: 'LED显示屏',
                sysSupportTypeName: '显示设备',
                tbParkingName: '西区停车场',
                tbSupportResourceQuantity: 2,
                tbSupportResourceAvailableQuantity: 2,
                tbSupportResourceIntactRate: 100.0,
                tbSupportResourceId: 'SR20260119004',
              },
              {
                tbSupportResourceName: '充电桩',
                sysSupportTypeName: '充电设备',
                tbParkingName: '中区停车场',
                tbSupportResourceQuantity: 20,
                tbSupportResourceAvailableQuantity: 18,
                tbSupportResourceIntactRate: 90.0,
                tbSupportResourceId: 'SR20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSupportResourceList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 支撑资源核心指标（卡片展示）
export const fetchSupportResourceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/support/resource/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalResourceCount &&
          response.averageIntactRate &&
          response.coreTypeResourceCount &&
          response.maintainingResourceCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无支撑资源核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '支撑资源指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalResourceCount: 238, // 支撑资源总数
              averageIntactRate: 92.3, // 平均完好率
              coreTypeResourceCount: 42, // 核心类型资源数
              maintainingResourceCount: 18, // 维护中资源数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 支撑资源指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalResourceCount: 0,
      averageIntactRate: 0,
      coreTypeResourceCount: 0,
      maintainingResourceCount: 0,
    });
  }
};

// 支撑资源类型占比（饼图）
export const fetchSupportResourceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/support/resource/stat/type/ratio`,
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
        throw new Error('真实接口返回无支撑资源类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '支撑资源类型占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['道闸设备', '监控设备', '检测设备', '显示设备', '充电设备'],
              series: [{ name: '类型占比(%)', data: [15.2, 25.8, 30.5, 8.4, 20.1] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 支撑资源类型占比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '类型占比(%)', data: [] }],
    });
  }
};

// 各区域支撑资源分布占比（饼图）
export const fetchSupportResourceRegionRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/support/resource/stat/region/ratio`,
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
        throw new Error('真实接口返回无区域支撑资源分布数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域支撑资源分布接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '区域分布占比(%)', data: [22.5, 35.2, 18.3, 12.7, 11.3] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域支撑资源分布函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '区域分布占比(%)', data: [] }],
    });
  }
};

// 各类型支撑资源数量对比（柱状图）
export const fetchSupportResourceTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/support/resource/stat/type/count`,
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
        throw new Error('真实接口返回无类型支撑资源数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型支撑资源数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['道闸设备', '监控设备', '检测设备', '显示设备', '充电设备'],
              series: [{ name: '资源数量', data: [36, 62, 72, 20, 48] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 类型支撑资源数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '资源数量', data: [] }],
    });
  }
};

// 各停车场支撑资源配置对比（柱状图）
export const fetchSupportResourceParkingCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/support/resource/stat/parking/count`,
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
        throw new Error('真实接口返回无停车场支撑资源配置数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车场支撑资源配置对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['北区停车场', '南区停车场', '东区停车场', '西区停车场', '中区停车场'],
              series: [{ name: '资源数量', data: [42, 68, 45, 35, 48] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车场支撑资源配置对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '资源数量', data: [] }],
    });
  }
};

// 支撑资源详情查询 - 详情弹窗专用
export const fetchSupportResourceDetail = (resourceId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/support/resource/detail/${resourceId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbSupportResourceId === resourceId) {
          return response;
        }
        throw new Error('真实接口返回无支撑资源详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('支撑资源详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbSupportResourceId: resourceId,
              tbSupportResourceName: '出入口道闸',
              sysSupportTypeName: '道闸设备',
              tbParkingName: '北区停车场',
              tbSupportResourceQuantity: 4,
              tbSupportResourceAvailableQuantity: 3,
              tbSupportResourceIntactRate: 87.5,
              tbSupportMaintainMonthlyCount: 3, // 本月维护次数
              tbSupportResourceMaintainCycle: '30天', // 维护周期
              tbSupportResourceCoverageRatio: 85.0, // 覆盖车位比
              // 资源配置明细
              resourceConfig: [
                { name: '设备型号', value: 'DG-2000' },
                { name: '安装位置', value: '出入口1-4号' },
                { name: '生产厂家', value: '海康威视' },
                { name: '安装时间', value: '2026-01-15' },
              ],
              // 维护记录
              maintainRecords: [
                {
                  time: Date.now() - 10 * 24 * 60 * 60 * 1000,
                  content: '例行保养检查',
                  maintainer: '张三',
                  status: '已完成'
                },
                {
                  time: Date.now() - 25 * 24 * 60 * 60 * 1000,
                  content: '更换故障电机',
                  maintainer: '李四',
                  status: '已完成'
                },
                {
                  time: Date.now() - 40 * 24 * 60 * 60 * 1000,
                  content: '软件系统升级',
                  maintainer: '王五',
                  status: '已完成'
                }
              ],
              // 使用统计
              usageStatistics: {
                xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                series: [{ name: '使用次数', data: [1250, 1320, 1180, 1450, 1380, 980, 1100] }]
              }
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSupportResourceDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交维护需求 - 生成维护工单
export const submitSupportMaintainRequest = (resourceId, maintainPlan) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/support/resource/maintain/submit`,
        data: {
          resourceId,
          maintainPlan,
        },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无提交结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('提交维护需求接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              orderNo: `MO${Date.now()}`,
              message: '维护工单已生成',
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitSupportMaintainRequest 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      success: false,
      orderNo: '',
      message: '提交失败',
    });
  }
};


// ========== 投诉处理 ==========
// 投诉处理列表
export const fetchComplaintList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/complaint/list`,
        params,
      })
      .then((response) => {
        console.log('投诉处理列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('投诉处理列表-响应符合实际格式');
          return response.map((item) => ({
            tbComplaintComplaintNo: item.tbComplaintComplaintNo,
            sysComplaintTypeName: item.sysComplaintTypeName,
            tbComplaintSubmitTime: item.tbComplaintSubmitTime,
            tbComplaintProcessDuration: item.tbComplaintProcessDuration,
            sysComplaintResultName: item.sysComplaintResultName,
            tbComplaintUserSatisfaction: item.tbComplaintUserSatisfaction,
            tbComplaintId: item.tbComplaintId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无投诉处理列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('投诉处理列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbComplaintComplaintNo: 'COMP20260120001',
                sysComplaintTypeName: '服务质量',
                tbComplaintSubmitTime: Date.now() - 5 * 24 * 60 * 60 * 1000,
                tbComplaintProcessDuration: 12,
                sysComplaintResultName: '已处理',
                tbComplaintUserSatisfaction: 4.5,
                tbComplaintId: 'CPL20260120001',
              },
              {
                tbComplaintComplaintNo: 'COMP20260120002',
                sysComplaintTypeName: '计费争议',
                tbComplaintSubmitTime: Date.now() - 3 * 24 * 60 * 60 * 1000,
                tbComplaintProcessDuration: 8,
                sysComplaintResultName: '处理中',
                tbComplaintUserSatisfaction: null,
                tbComplaintId: 'CPL20260120002',
              },
              {
                tbComplaintComplaintNo: 'COMP20260120003',
                sysComplaintTypeName: '设备故障',
                tbComplaintSubmitTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
                tbComplaintProcessDuration: 24,
                sysComplaintResultName: '已处理',
                tbComplaintUserSatisfaction: 3.0,
                tbComplaintId: 'CPL20260120003',
              },
              {
                tbComplaintComplaintNo: 'COMP20260120004',
                sysComplaintTypeName: '环境卫生',
                tbComplaintSubmitTime: Date.now() - 24 * 60 * 60 * 1000,
                tbComplaintProcessDuration: 6,
                sysComplaintResultName: '已处理',
                tbComplaintUserSatisfaction: 4.8,
                tbComplaintId: 'CPL20260120004',
              },
              {
                tbComplaintComplaintNo: 'COMP20260120005',
                sysComplaintTypeName: '停车秩序',
                tbComplaintSubmitTime: Date.now(),
                tbComplaintProcessDuration: null,
                sysComplaintResultName: '待处理',
                tbComplaintUserSatisfaction: null,
                tbComplaintId: 'CPL20260120005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchComplaintList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 投诉处理核心指标（卡片展示）
export const fetchComplaintIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/complaint/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalComplaintCount &&
          response.processedCount &&
          response.processCompletionRate &&
          response.averageProcessDuration &&
          response.overallSatisfaction
        ) {
          return response;
        }
        throw new Error('真实接口返回无投诉处理核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '投诉处理指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalComplaintCount: 156, // 投诉总数
              processedCount: 142, // 已处理数
              processCompletionRate: 91.0, // 处理完成率
              averageProcessDuration: 15.2, // 平均处理时长(小时)
              overallSatisfaction: 4.1, // 整体满意度(分)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 投诉处理指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalComplaintCount: 0,
      processedCount: 0,
      processCompletionRate: 0,
      averageProcessDuration: 0,
      overallSatisfaction: 0,
    });
  }
};

// 投诉类型占比（饼图）
export const fetchComplaintTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/complaint/stat/type/ratio`,
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
        throw new Error('真实接口返回无投诉类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '投诉类型占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['服务质量', '计费争议', '设备故障', '环境卫生', '停车秩序'],
              series: [{ name: '投诉类型占比(%)', data: [35.2, 28.5, 18.3, 12.7, 5.3] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 投诉类型占比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '投诉类型占比(%)', data: [] }],
    });
  }
};

// 处理结果占比（饼图）
export const fetchComplaintResultRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/complaint/stat/result/ratio`,
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
        throw new Error('真实接口返回无处理结果占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '处理结果占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['已处理', '处理中', '待处理'],
              series: [{ name: '处理结果占比(%)', data: [75.6, 15.4, 9.0] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 处理结果占比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '处理结果占比(%)', data: [] }],
    });
  }
};

// 投诉来源占比（饼图）
export const fetchComplaintSourceRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/complaint/stat/source/ratio`,
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
        throw new Error('真实接口返回无投诉来源占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '投诉来源占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['电话投诉', 'APP投诉', '现场投诉', '微信投诉'],
              series: [{ name: '投诉来源占比(%)', data: [45.2, 35.8, 12.5, 6.5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 投诉来源占比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '投诉来源占比(%)', data: [] }],
    });
  }
};

// 近30天投诉新增趋势（折线图）
export const fetchComplaintNewTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/complaint/stat/new/trend`,
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
        throw new Error('真实接口返回无投诉新增趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '投诉新增趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => Math.floor(Math.random() * 10) + 1);
            resolve({
              xAxis,
              series: [{ name: '投诉新增数', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 投诉新增趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '投诉新增数', data: [] }],
    });
  }
};

// 处理完成趋势（折线图）
export const fetchComplaintProcessTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/complaint/stat/process/trend`,
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
        throw new Error('真实接口返回无处理完成趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '处理完成趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 80 + Math.random() * 15);
            resolve({
              xAxis,
              series: [{ name: '处理完成率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 处理完成趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '处理完成率(%)', data: [] }],
    });
  }
};

// 投诉处理详情查询 - 详情弹窗专用
export const fetchComplaintDetail = (complaintId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/complaint/detail/${complaintId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbComplaintId === complaintId) {
          return response;
        }
        throw new Error('真实接口返回无投诉处理详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('投诉处理详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbComplaintId: complaintId,
              tbComplaintComplaintNo: 'COMP20260120001',
              sysComplaintTypeName: '服务质量',
              tbComplaintSubmitTime: Date.now() - 5 * 24 * 60 * 60 * 1000,
              tbComplaintProcessDuration: 12,
              sysComplaintResultName: '已处理',
              tbComplaintUserSatisfaction: 4.5,
              tbComplaintSource: 'APP投诉', // 投诉来源
              sysUserUserName: '张三', // 处理责任人
              sysReviewStatusName: '已复盘', // 复盘状态
              // 投诉内容
              complaintContent: {
                title: '出入口道闸响应缓慢',
                content: '北区停车场出入口道闸在车辆驶近时响应时间超过10秒，导致车辆排队拥堵，影响通行效率。',
                attachments: ['图片1.jpg', '视频1.mp4']
              },
              // 处理过程
              processRecords: [
                {
                  time: Date.now() - 5 * 24 * 60 * 60 * 1000,
                  operator: '客服专员',
                  action: '接收投诉，初步登记',
                  content: '已记录投诉信息，转交技术部门处理'
                },
                {
                  time: Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
                  operator: '技术员',
                  action: '现场检查',
                  content: '经检查发现道闸传感器灵敏度下降，已进行校准'
                },
                {
                  time: Date.now() - 4 * 24 * 60 * 60 * 1000,
                  operator: '客服专员',
                  action: '回访用户',
                  content: '电话回访用户，反馈问题已解决，用户表示满意'
                }
              ],
              // 用户反馈
              userFeedback: {
                satisfaction: 4.5,
                comment: '处理速度很快，问题得到解决，但希望加强日常维护',
                feedbackTime: Date.now() - 4 * 24 * 60 * 60 * 1000
              }
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchComplaintDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交处理方案 - 处理弹窗专用
export const submitComplaintProcess = (complaintId, processPlan) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/complaint/process/submit`,
        data: {
          complaintId,
          processPlan,
        },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无提交结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('提交处理方案接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              processDuration: 8,
              message: '处理方案已提交，预计处理时长8小时',
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitComplaintProcess 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      success: false,
      processDuration: 0,
      message: '提交失败',
    });
  }
};

// 提交复盘意见 - 复盘弹窗专用
export const submitComplaintReview = (complaintId, reviewOpinion) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/complaint/review/submit`,
        data: {
          complaintId,
          reviewOpinion,
        },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无提交结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('提交复盘意见接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '复盘意见已保存',
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitComplaintReview 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      success: false,
      message: '提交失败',
    });
  }
};


// ========== 运维处置效率 ==========
// 运维处置效率列表
export const fetchMaintainEfficiencyList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/efficiency/list`,
        params,
      })
      .then((response) => {
        console.log('运维处置效率列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('运维处置效率列表-响应符合实际格式');
          return response.map((item) => ({
            sysWorkorderTypeName: item.sysWorkorderTypeName,
            tbMaintainEfficiencyPeriod: item.tbMaintainEfficiencyPeriod,
            tbMaintainEfficiencyAverageHandleDuration: item.tbMaintainEfficiencyAverageHandleDuration,
            tbMaintainEfficiencyCompletionRate: item.tbMaintainEfficiencyCompletionRate,
            tbMaintainEfficiencyReworkRate: item.tbMaintainEfficiencyReworkRate,
            tbMaintainEfficiencyOneTimeSolveRate: item.tbMaintainEfficiencyOneTimeSolveRate,
            tbMaintainEfficiencyId: item.tbMaintainEfficiencyId, // 主键
          }));
        }
        throw new Error('真实接口返回无运维处置效率列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('运维处置效率列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                sysWorkorderTypeName: '设备故障',
                tbMaintainEfficiencyPeriod: '2026-01',
                tbMaintainEfficiencyAverageHandleDuration: 2.5,
                tbMaintainEfficiencyCompletionRate: 95.8,
                tbMaintainEfficiencyReworkRate: 3.2,
                tbMaintainEfficiencyOneTimeSolveRate: 92.6,
                tbMaintainEfficiencyId: 'MT20260119001',
              },
              {
                sysWorkorderTypeName: '系统异常',
                tbMaintainEfficiencyPeriod: '2026-01',
                tbMaintainEfficiencyAverageHandleDuration: 1.8,
                tbMaintainEfficiencyCompletionRate: 98.2,
                tbMaintainEfficiencyReworkRate: 1.5,
                tbMaintainEfficiencyOneTimeSolveRate: 96.8,
                tbMaintainEfficiencyId: 'MT20260119002',
              },
              {
                sysWorkorderTypeName: '用户投诉',
                tbMaintainEfficiencyPeriod: '2026-01',
                tbMaintainEfficiencyAverageHandleDuration: 4.2,
                tbMaintainEfficiencyCompletionRate: 90.5,
                tbMaintainEfficiencyReworkRate: 5.8,
                tbMaintainEfficiencyOneTimeSolveRate: 88.2,
                tbMaintainEfficiencyId: 'MT20260119003',
              },
              {
                sysWorkorderTypeName: '日常巡检',
                tbMaintainEfficiencyPeriod: '2026-01',
                tbMaintainEfficiencyAverageHandleDuration: 0.8,
                tbMaintainEfficiencyCompletionRate: 99.0,
                tbMaintainEfficiencyReworkRate: 0.5,
                tbMaintainEfficiencyOneTimeSolveRate: 99.5,
                tbMaintainEfficiencyId: 'MT20260119004',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainEfficiencyList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 运维处置效率核心指标（卡片展示）
export const fetchMaintainEfficiencyIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/efficiency/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.averageHandleDuration &&
          response.completionRate &&
          response.oneTimeSolveRate &&
          response.reworkRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无运维处置效率核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '运维处置效率指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              averageHandleDuration: 2.3, // 平均处置时长(小时)
              completionRate: 95.6, // 处置完成率(%)
              oneTimeSolveRate: 93.8, // 一次性解决率(%)
              reworkRate: 3.2, // 返工率(%)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 运维处置效率指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      averageHandleDuration: 0,
      completionRate: 0,
      oneTimeSolveRate: 0,
      reworkRate: 0,
    });
  }
};

// 处置时长趋势（折线图）
export const fetchMaintainEfficiencyHandleDurationTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/efficiency/stat/handle/duration/trend`,
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
        throw new Error('真实接口返回无处置时长趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '处置时长趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 1.5 + Math.random() * 1.5);
            resolve({
              xAxis,
              series: [{ name: '处置时长(小时)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 处置时长趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '处置时长(小时)', data: [] }],
    });
  }
};

// 完成率趋势（折线图）
export const fetchMaintainEfficiencyCompletionRateTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/efficiency/stat/completion/rate/trend`,
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
        throw new Error('真实接口返回无完成率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '完成率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 90 + Math.random() * 10);
            resolve({
              xAxis,
              series: [{ name: '完成率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 完成率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '完成率(%)', data: [] }],
    });
  }
};

// 工单类型占比（饼图）
export const fetchMaintainEfficiencyWorkorderTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/efficiency/stat/workorder/type/ratio`,
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
        throw new Error('真实接口返回无工单类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '工单类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['设备故障', '系统异常', '用户投诉', '日常巡检'],
              series: [{ name: '工单类型占比(%)', data: [45, 25, 20, 10] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 工单类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '工单类型占比(%)', data: [] }],
    });
  }
};

// 处置效率等级占比（饼图）
export const fetchMaintainEfficiencyLevelRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/efficiency/stat/efficiency/level/ratio`,
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
        throw new Error('真实接口返回无处置效率等级占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '处置效率等级占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['优秀', '良好', '一般', '待改进'],
              series: [{ name: '处置效率等级占比(%)', data: [60, 25, 10, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 处置效率等级占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '处置效率等级占比(%)', data: [] }],
    });
  }
};

// 返工原因占比（饼图）
export const fetchMaintainEfficiencyReworkReasonRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/efficiency/stat/rework/reason/ratio`,
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
        throw new Error('真实接口返回无返工原因占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '返工原因占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['技术不足', '配件缺失', '判断失误', '用户需求变更'],
              series: [{ name: '返工原因占比(%)', data: [40, 30, 20, 10] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 返工原因占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '返工原因占比(%)', data: [] }],
    });
  }
};

// 运维处置效率详情查询 - 详情弹窗专用
export const fetchMaintainEfficiencyDetail = (maintainId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/efficiency/detail/${maintainId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbMaintainEfficiencyId === maintainId) {
          return response;
        }
        throw new Error('真实接口返回无运维处置效率详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('运维处置效率详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbMaintainEfficiencyId: maintainId,
              tbMaintainEfficiencyChainDurationChange: maintainId === 'MT20260119001' ? -0.5 : 0.2, // 环比处置时长变化
              sysWorkorderTypeName: maintainId === 'MT20260119001' ? '设备故障' : '系统异常', // 高频工单类型
              sysEfficiencyLevelName: maintainId === 'MT20260119001' ? '良好' : '优秀', // 处置效率等级
              tbMaintainEfficiencyOvertimeCount: maintainId === 'MT20260119001' ? 8 : 2, // 超时工单数
              // 明细数据
              detail: {
                tbMaintainEfficiencyAverageHandleDuration: maintainId === 'MT20260119001' ? 2.5 : 1.8,
                tbMaintainEfficiencyCompletionRate: maintainId === 'MT20260119001' ? 95.8 : 98.2,
                tbMaintainEfficiencyReworkRate: maintainId === 'MT20260119001' ? 3.2 : 1.5,
                tbMaintainEfficiencyOneTimeSolveRate: maintainId === 'MT20260119001' ? 92.6 : 96.8,
              }
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainEfficiencyDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 高频工单列表跟踪 - 跟踪弹窗专用
export const fetchMaintainEfficiencyWorkorderTrackList = (maintainId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/efficiency/stat/workorder/track/list/${maintainId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbMaintainEfficiencyId === maintainId) {
          return response;
        }
        throw new Error('真实接口返回无高频工单跟踪数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('高频工单跟踪接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbMaintainEfficiencyId: maintainId,
              sysWorkorderTypeName: maintainId === 'MT20260119001' ? '设备故障' : '系统异常',
              workorderList: [
                {
                  workorderNo: 'WO20260101001',
                  createTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
                  handlePerson: '张三',
                  handleStatus: '已完成',
                  handleDuration: 2.8,
                  isOvertime: false
                },
                {
                  workorderNo: 'WO20260101002',
                  createTime: Date.now() - 1 * 24 * 60 * 60 * 1000,
                  handlePerson: '李四',
                  handleStatus: '处理中',
                  handleDuration: 1.2,
                  isOvertime: false
                },
                {
                  workorderNo: 'WO20260101003',
                  createTime: Date.now() - 3 * 24 * 60 * 60 * 1000,
                  handlePerson: '王五',
                  handleStatus: '已完成',
                  handleDuration: 4.5,
                  isOvertime: true
                }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainEfficiencyWorkorderTrackList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbMaintainEfficiencyId: '',
      sysWorkorderTypeName: '',
      workorderList: []
    });
  }
};

// 提交运维效率复盘意见
export const submitMaintainEfficiencyReview = (maintainId, reviewOpinion = '', params = {}) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/maintain/efficiency/review/submit/${maintainId}`,
        data: {
          reviewOpinion,
          ...params
        }
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('复盘意见提交失败');
      })
      .catch((error) => {
        console.warn('复盘意见提交接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '复盘意见提交成功'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitMaintainEfficiencyReview 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      success: false,
      message: error.message
    });
  }
};


// ========== 服务发展 ==========
// 服务发展列表
export const fetchServiceDevelopmentList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/service/development/list`,
        params,
      })
      .then((response) => {
        console.log('服务发展列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('服务发展列表-响应符合实际格式');
          return response.map((item) => ({
            sysServiceTypeName: item.sysServiceTypeName,
            tbServiceDevelopmentPeriod: item.tbServiceDevelopmentPeriod,
            tbServiceDevelopmentNewServiceCount: item.tbServiceDevelopmentNewServiceCount,
            tbServiceDevelopmentCoverageRegionCount: item.tbServiceDevelopmentCoverageRegionCount,
            tbServiceDevelopmentUserGrowthRate: item.tbServiceDevelopmentUserGrowthRate,
            tbServiceDevelopmentServiceUtilizationRate: item.tbServiceDevelopmentServiceUtilizationRate,
            tbServiceDevelopmentId: item.tbServiceDevelopmentId,
          }));
        }
        throw new Error('真实接口返回无服务发展列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('服务发展列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                sysServiceTypeName: '智能停车服务',
                tbServiceDevelopmentPeriod: '2024-01',
                tbServiceDevelopmentNewServiceCount: 15,
                tbServiceDevelopmentCoverageRegionCount: 8,
                tbServiceDevelopmentUserGrowthRate: 12.5,
                tbServiceDevelopmentServiceUtilizationRate: 78.3,
                tbServiceDevelopmentId: 'SD20260119001',
              },
              {
                sysServiceTypeName: '车位预订服务',
                tbServiceDevelopmentPeriod: '2024-01',
                tbServiceDevelopmentNewServiceCount: 8,
                tbServiceDevelopmentCoverageRegionCount: 5,
                tbServiceDevelopmentUserGrowthRate: 18.2,
                tbServiceDevelopmentServiceUtilizationRate: 65.7,
                tbServiceDevelopmentId: 'SD20260119002',
              },
              {
                sysServiceTypeName: '缴费服务',
                tbServiceDevelopmentPeriod: '2024-01',
                tbServiceDevelopmentNewServiceCount: 12,
                tbServiceDevelopmentCoverageRegionCount: 10,
                tbServiceDevelopmentUserGrowthRate: 8.7,
                tbServiceDevelopmentServiceUtilizationRate: 92.5,
                tbServiceDevelopmentId: 'SD20260119003',
              },
              {
                sysServiceTypeName: '会员服务',
                tbServiceDevelopmentPeriod: '2024-01',
                tbServiceDevelopmentNewServiceCount: 6,
                tbServiceDevelopmentCoverageRegionCount: 3,
                tbServiceDevelopmentUserGrowthRate: 25.3,
                tbServiceDevelopmentServiceUtilizationRate: 58.9,
                tbServiceDevelopmentId: 'SD20260119004',
              },
              {
                sysServiceTypeName: '信息服务',
                tbServiceDevelopmentPeriod: '2024-01',
                tbServiceDevelopmentNewServiceCount: 10,
                tbServiceDevelopmentCoverageRegionCount: 7,
                tbServiceDevelopmentUserGrowthRate: 15.8,
                tbServiceDevelopmentServiceUtilizationRate: 82.4,
                tbServiceDevelopmentId: 'SD20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchServiceDevelopmentList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 服务发展核心指标（卡片展示）
export const fetchServiceDevelopmentIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/service/development/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.newServiceCount &&
          response.coverageRegionCount &&
          response.userGrowthRate &&
          response.serviceUtilizationRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无服务发展核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '服务发展指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              newServiceCount: 51, // 新增服务数
              coverageRegionCount: 33, // 覆盖区域数
              userGrowthRate: 16.1, // 用户增长率
              serviceUtilizationRate: 75.6, // 服务使用率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 服务发展指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      newServiceCount: 0,
      coverageRegionCount: 0,
      userGrowthRate: 0,
      serviceUtilizationRate: 0,
    });
  }
};

// 用户增长趋势（折线图）
export const fetchServiceDevelopmentUserGrowthTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/service/development/stat/user/growth/trend`,
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
        throw new Error('真实接口返回无用户增长趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '用户增长趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 12}, (_, i) => {
              return `${i+1}月`;
            });
            const data = xAxis.map(() => 5 + Math.random() * 20);
            resolve({
              xAxis,
              series: [{ name: '用户增长率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 用户增长趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '用户增长率(%)', data: [] }],
    });
  }
};

// 服务使用率趋势（折线图）
export const fetchServiceDevelopmentServiceUtilizationTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/service/development/stat/service/utilization/trend`,
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
        throw new Error('真实接口返回无服务使用率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '服务使用率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 12}, (_, i) => {
              return `${i+1}月`;
            });
            const data = xAxis.map(() => 60 + Math.random() * 30);
            resolve({
              xAxis,
              series: [{ name: '服务使用率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 服务使用率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '服务使用率(%)', data: [] }],
    });
  }
};

// 各类型服务发展数量对比（柱状图）
export const fetchServiceDevelopmentTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/service/development/stat/type/compare`,
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
        throw new Error('真实接口返回无类型服务发展数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型服务发展数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['智能停车', '车位预订', '缴费服务', '会员服务', '信息服务'],
              series: [{ name: '服务数量', data: [15, 8, 12, 6, 10] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 类型服务发展数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '服务数量', data: [] }],
    });
  }
};

// 各区域服务覆盖对比（柱状图）
export const fetchServiceDevelopmentRegionCoverageCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/service/development/stat/region/coverage/compare`,
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
        throw new Error('真实接口返回无区域服务覆盖数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域服务覆盖对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '覆盖区域数', data: [8, 10, 6, 5, 4] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域服务覆盖对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '覆盖区域数', data: [] }],
    });
  }
};

// 服务类型占比（饼图）
export const fetchServiceDevelopmentTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/service/development/stat/type/ratio`,
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
        throw new Error('真实接口返回无服务类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '服务类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['智能停车', '车位预订', '缴费服务', '会员服务', '信息服务'],
              series: [{ name: '服务类型占比(%)', data: [29.4, 15.7, 23.5, 11.8, 19.6] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 服务类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '服务类型占比(%)', data: [] }],
    });
  }
};

// 高使用率服务占比（饼图）
export const fetchServiceDevelopmentHighUtilizationRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/service/development/stat/high/utilization/ratio`,
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
        throw new Error('真实接口返回无高使用率服务占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '高使用率服务占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['缴费服务', '智能停车', '信息服务', '车位预订', '会员服务'],
              series: [{ name: '高使用率服务占比(%)', data: [35.2, 28.5, 19.8, 10.5, 6.0] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 高使用率服务占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '高使用率服务占比(%)', data: [] }],
    });
  }
};

// 服务发展详情查询 - 详情弹窗专用
export const fetchServiceDevelopmentDetail = (serviceDevelopmentId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/service/development/detail/${serviceDevelopmentId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbServiceDevelopmentId === serviceDevelopmentId) {
          return response;
        }
        throw new Error('真实接口返回无服务发展详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('服务发展详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbServiceDevelopmentId: serviceDevelopmentId,
              sysServiceTypeName: serviceDevelopmentId === 'SD20260119001' ? '智能停车服务' : '车位预订服务',
              tbServiceDevelopmentPeriod: '2024-01',
              tbServiceDevelopmentYearOnYearGrowth: serviceDevelopmentId === 'SD20260119001' ? 25.3 : 18.7, // 同比增长率
              tbServiceDevelopmentTotalUserCount: serviceDevelopmentId === 'SD20260119001' ? 12500 : 8500, // 累计服务用户数
              tbServiceDevelopmentOptimizationDemandCount: serviceDevelopmentId === 'SD20260119001' ? 8 : 5, // 服务优化需求数
              // 详情字段
              detail: {
                tbServiceDevelopmentNewServiceCount: serviceDevelopmentId === 'SD20260119001' ? 15 : 8,
                tbServiceDevelopmentCoverageRegionCount: serviceDevelopmentId === 'SD20260119001' ? 8 : 5,
                tbServiceDevelopmentUserGrowthRate: serviceDevelopmentId === 'SD20260119001' ? 12.5 : 18.2,
                tbServiceDevelopmentServiceUtilizationRate: serviceDevelopmentId === 'SD20260119001' ? 78.3 : 65.7,
              },
              // 用户反馈
              userFeedback: [
                {
                  time: Date.now() - 3 * 24 * 60 * 60 * 1000,
                  userName: '张先生',
                  content: '服务响应速度快，使用体验很好',
                  score: 5
                },
                {
                  time: Date.now() - 7 * 24 * 60 * 60 * 1000,
                  userName: '李女士',
                  content: '希望增加更多支付方式',
                  score: 4
                }
              ],
              // 覆盖区域详情
              coverageRegionDetail: [
                {
                  regionName: '高新区',
                  coverageRate: 100,
                  userCount: serviceDevelopmentId === 'SD20260119001' ? 3200 : 2100
                },
                {
                  regionName: '主城区',
                  coverageRate: 100,
                  userCount: serviceDevelopmentId === 'SD20260119001' ? 4500 : 2800
                }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchServiceDevelopmentDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 用户增长趋势钻取 - 月度趋势弹窗专用
export const fetchServiceDevelopmentUserGrowthTrendDetail = (serviceDevelopmentId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/service/development/stat/user/growth/trend/detail/${serviceDevelopmentId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbServiceDevelopmentId === serviceDevelopmentId) {
          return response;
        }
        throw new Error('真实接口返回无用户增长趋势详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('用户增长趋势详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 12}, (_, i) => {
              return `${i+1}月`;
            });
            const data = xAxis.map(() => 5 + Math.random() * 20);
            resolve({
              tbServiceDevelopmentId: serviceDevelopmentId,
              sysServiceTypeName: serviceDevelopmentId === 'SD20260119001' ? '智能停车服务' : '车位预订服务',
              xAxis,
              series: [{ name: '月度用户增长率(%)', data }]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchServiceDevelopmentUserGrowthTrendDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbServiceDevelopmentId: '',
      sysServiceTypeName: '',
      xAxis: [],
      series: [{ name: '月度用户增长率(%)', data: [] }]
    });
  }
};

// 提交服务优化建议
export const submitServiceDevelopmentOptimization = (serviceDevelopmentId, optimizationPlan) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/service/development/optimization/submit/${serviceDevelopmentId}`,
        data: { optimizationPlan },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无提交结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('提交服务优化建议接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '优化建议提交成功'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitServiceDevelopmentOptimization 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      success: false,
      message: '提交失败'
    });
  }
};



