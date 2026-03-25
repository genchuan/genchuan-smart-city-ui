import { requestClient } from '#/api/request';
const BASE_URL = '/industry/parking/berth';

// 停车场资源类指标看板接口（真实接口+模拟数据兜底）
export const fetchParkResourceOverview = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/resource/overview/get`,
      params
    }).then(response => {
      console.log('停车场资源类指标-接口请求成功');
      if (response && typeof response === 'object' && !Array.isArray(response) && response.city_park_total !== undefined) {
        console.log('停车场资源类指标-响应符合实际格式');
        return {
          city_park_total: response.city_park_total,
          pub_park_count: response.pub_park_count,
          road_park_count: response.road_park_count,
          special_park_count: response.special_park_count,
          total_berth_count: response.total_berth_count,
          pub_berth_count: response.pub_berth_count,
          road_berth_count: response.road_berth_count,
          special_berth_count: response.special_berth_count,
          enable_berth_rate: response.enable_berth_rate
        };
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('停车场资源类指标接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          const timeRange = params.time_range || 'current';
          let mockData = {};

          if (timeRange === 'current') {
            mockData = {
              city_park_total: 128,
              pub_park_count: 43,
              road_park_count: 38,
              special_park_count: 47,
              total_berth_count: 9120,
              pub_berth_count: 2820,
              road_berth_count: 1950,
              special_berth_count: 4350,
              enable_berth_rate: 0.918
            };
          } else if (timeRange === 'last_month') {
            mockData = {
              city_park_total: 126,
              pub_park_count: 42,
              road_park_count: 38,
              special_park_count: 46,
              total_berth_count: 8945,
              pub_berth_count: 2760,
              road_berth_count: 1890,
              special_berth_count: 4295,
              enable_berth_rate: 0.905
            };
          }

          resolve(mockData);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchParkResourceOverview 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      city_park_total: 0,
      pub_park_count: 0,
      road_park_count: 0,
      special_park_count: 0,
      total_berth_count: 0,
      pub_berth_count: 0,
      road_berth_count: 0,
      special_berth_count: 0,
      enable_berth_rate: 0
    });
  }
};

// 区域资源占比接口（真实接口+模拟数据兜底，返回{labels, data}格式）
export const fetchAreaResourceRatio = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/resource/area/ratio/get`,
      params
    }).then(response => {
      console.log('区域资源占比-接口请求成功');
      if (response && response.labels && Array.isArray(response.labels) && response.data && Array.isArray(response.data)) {
        return response;
      }
      throw new Error('真实接口返回格式异常，使用模拟数据兜底');
    }).catch(error => {
      console.log('区域资源占比接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          // 仅此处保留模拟兜底（文件1允许）
          const mockData = {
            labels: ['思明区', '湖里区', '集美区'],
            data: [28, 20, 29]
          };
          resolve(mockData);
        }, 300);
      });
    });
  } catch (error) {
    console.error('===== fetchAreaResourceRatio 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    return Promise.resolve({
      labels: ['思明区', '湖里区', '集美区'],
      data: [28, 20, 29]
    });
  }
};

// 行政区划级联筛选接口
export const fetchAreaOptions = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/area/options`,
      params
    }).then(response => {
      console.log('故障筛选-行政区划选项-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('故障筛选-行政区划选项-响应符合实际格式');
        return response;
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('故障筛选-行政区划选项接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              value: '350000', // 一级：福建省
              label: '福建省',
              children: [
                {
                  value: '350200', // 二级：厦门市
                  label: '厦门市',
                  children: [
                    { value: '350203', label: '思明区' }, // 三级：思明区
                    { value: '350206', label: '湖里区' }, // 三级：湖里区
                    { value: '350211', label: '集美区' }  // 三级：集美区
                  ]
                }
              ]
            }
          ]);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchAreaOptions 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 网格筛选接口
export const fetchGridOptionsByArea = (areaCode = '') => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/grid/options`,
      params: { areaCode }
    }).then(response => {
      console.log('故障筛选-网格选项-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('故障筛选-网格选项-响应符合实际格式');
        return response;
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('故障筛选-网格选项接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          let gridOptions;
          if (areaCode === '350203') {
            gridOptions = [
              { value: 'LQ001', label: '莲前网格' },
              { value: 'LQ002', label: '瑞景网格' },
              { value: 'LQ003', label: '前埔网格' }
            ];
          } else if (areaCode === '350206') {
            gridOptions = [
              { value: 'HS001', label: '软件园网格' },
              { value: 'HS002', label: '高林网格' },
              { value: 'HS003', label: '枋湖网格' }
            ];
          } else if (areaCode === '350211') {
            gridOptions = [
              { value: 'JM001', label: '杏林网格' },
              { value: 'JM002', label: '集美网格' },
              { value: 'JM003', label: '灌口网格' }
            ];
          } else {
            gridOptions = [
              { value: 'DEFAULT001', label: '默认网格' }
            ];
          }
          resolve(gridOptions);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchGridOptionsByArea 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};


