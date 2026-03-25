import { requestClient } from '#/api/request';
const BASE_URL = '/industry/parking/berth';

// ===================== 全域数据地图接口 =====================
// 行政区划筛选接口
export const fetchAreaOptions = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/area/options`,
      params
    }).then(response => {
      console.log('行政区划选项-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('行政区划选项-响应符合实际格式');
        return response;
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('行政区划选项接口调用失败-使用模拟数据兜底', error.message);
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
                    { value: '350206', label: '湖里区' }  // 三级：湖里区
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
      console.log('网格选项-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('网格选项-响应符合实际格式');
        return response;
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('网格选项接口调用失败-使用模拟数据兜底', error.message);
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

// 停车场资源查询接口
export const fetchParkResourceList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/vacancy/resource/list`,
      params
    }).then(response => {
      console.log('停车场空置资源列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('停车场空置资源列表-响应符合实际格式');
        return response;
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('停车场空置资源列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          const mockData = [
            {
              park_id: 'P001',
              park_name: '市中心停车场',
              total_space: 500,
              free_space: 142,
              vacant_space: 128,
              vacant_endure: 120, // 空置时长（分钟）
              warn_status: 'no_warn',
              check_result: 'normal', // 核查结果：正常
              coord_x: 24.901234,
              coord_y: 118.691234,
              region_name: '思明区'
            },
            {
              park_id: 'P002',
              park_name: '软件园停车场',
              total_space: 800,
              free_space: 280,
              vacant_space: 265,
              vacant_endure: 240, // 空置时长（分钟）
              warn_status: 'warning',
              check_result: 'fault', // 核查结果：故障
              coord_x: 24.898765,
              coord_y: 118.708765,
              region_name: '湖里区'
            },
            {
              park_id: 'P004',
              park_name: '机场停车场',
              total_space: 600,
              free_space: 213,
              vacant_space: 198,
              vacant_endure: 180, // 空置时长（分钟）
              warn_status: 'no_warn',
              check_result: 'adjust', // 核查结果：规划调整
              coord_x: 24.851234,
              coord_y: 118.191234,
              region_name: '湖里区'
            },
            {
              park_id: 'P005',
              park_name: '会展中心停车场',
              total_space: 700,
              free_space: 210,
              vacant_space: 195,
              vacant_endure: 300, // 空置时长（分钟）
              warn_status: 'warning',
              check_result: 'fault', // 核查结果：故障
              coord_x: 24.903456,
              coord_y: 118.723456,
              region_name: '思明区'
            },
            {
              park_id: 'P008',
              park_name: '湖里万达停车场',
              total_space: 750,
              free_space: 270,
              vacant_space: 255,
              vacant_endure: 150, // 空置时长（分钟）
              warn_status: 'disposed',
              check_result: 'normal', // 核查结果：正常
              coord_x: 24.887654,
              coord_y: 118.737654,
              region_name: '湖里区'
            },
            {
              park_id: 'P009',
              park_name: '集美软件园停车场',
              total_space: 950,
              free_space: 332,
              vacant_space: 310,
              vacant_endure: 270, // 空置时长（分钟）
              warn_status: 'warning',
              check_result: 'fault', // 核查结果：故障
              coord_x: 24.876543,
              coord_y: 118.186543,
              region_name: '湖里区'
            },
            {
              park_id: 'P010',
              park_name: '杏林湾停车场',
              total_space: 650,
              free_space: 260,
              vacant_space: 245,
              vacant_endure: 90, // 空置时长（分钟）
              warn_status: 'no_warn',
              check_result: 'normal', // 核查结果：正常
              coord_x: 24.865432,
              coord_y: 118.175432,
              region_name: '思明区'
            }
          ];

          let filteredData = [...mockData];

          // 行政区划筛选
          if (params.regionCode) {
            const regionCodeLevel = params.regionCode.length >= 6 ? params.regionCode.substring(0, 6) : params.regionCode;
            // 模拟区域编码映射（350203=思明区，350206=湖里区）
            const regionMap = {
              '350203': '思明区',
              '350206': '湖里区'
            };
            const targetRegion = regionMap[regionCodeLevel];
            if (targetRegion) {
              filteredData = filteredData.filter(item => item.region_name === targetRegion);
            }
          }

          // 预警状态筛选
          if (params.warnStatus) {
            filteredData = filteredData.filter(item => item.warn_status === params.warnStatus);
          }

          // 核查结果筛选
          if (params.checkResult) {
            filteredData = filteredData.filter(item => item.check_result === params.checkResult);
          }

          // 空置时长筛选（模拟：传入minDuration，筛选≥该值的）
          if (params.minDuration) {
            const minDuration = Number(params.minDuration);
            filteredData = filteredData.filter(item => item.vacant_endure >= minDuration);
          }

          resolve(filteredData);
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

// 空置监测数据接口
export const fetchBerthVacantList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/vacancy/berth/list`,
      params
    }).then(response => {
      console.log('泊位空置监测数据-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('泊位空置监测数据-响应符合实际格式');
        return response;
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('泊位空置监测数据接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          // 匹配gen_park_berth_vacant表结构
          const mockData = [
            {
              mon_id: 'M001',
              berth_id: 'B001',
              berth_name: 'A01泊位',
              berth_pos: '市中心停车场-A01泊位',
              vacant_status: 'vacant',
              vacant_endure: 210,
              warn_status: 'warning',
              check_wo_id: 'CW001',
              check_result: 'fault',
              repair_wo_id: 'RW001',
              review_result: 'pending',
              region_code: '350203',
              region_name: '思明区',
              grid_name: '莲前网格'
            },
            {
              mon_id: 'M002',
              berth_id: 'B002',
              berth_name: 'B12泊位',
              berth_pos: '软件园停车场-B12泊位',
              vacant_status: 'vacant',
              vacant_endure: 270,
              warn_status: 'warning',
              check_wo_id: 'CW002',
              check_result: 'fault',
              repair_wo_id: 'RW002',
              review_result: 'pending',
              region_code: '350206',
              region_name: '湖里区',
              grid_name: '软件园网格'
            }
          ];
          // 复用原有筛选逻辑（与停车场资源接口一致）
          let filteredData = [...mockData];
          if (params.regionCode) {
            const regionMap = { '350203': '思明区', '350206': '湖里区' };
            const targetRegion = regionMap[params.regionCode.substring(0,6)];
            if (targetRegion) filteredData = filteredData.filter(item => item.region_name === targetRegion);
          }
          if (params.warnStatus) filteredData = filteredData.filter(item => item.warn_status === params.warnStatus);
          resolve(filteredData);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchBerthVacantList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// ===================== 核心指标看板接口 =====================
// 空置监测汇总接口
export const fetchParkingOverview = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/vacancy/overview/get`,
      params
    }).then(response => {
      console.log('停车空置核心指标概览-接口请求成功');
      if (response && typeof response === 'object' && !Array.isArray(response) && response.city_vacant_rate !== undefined) {
        console.log('停车空置核心指标概览-响应符合实际格式');
        // 仅返回需求指定的核心字段（空置相关）
        return {
          city_vacant_rate: response.city_vacant_rate, // 全城空置泊位率
          warn_vacant_count: response.warn_vacant_count, // 预警空置泊位数
          fault_vacant_count: response.fault_vacant_count, // 故障导致空置数
          adjust_vacant_count: response.adjust_vacant_count, // 规划调整空置数
          verify_qualified_rate: response.verify_qualified_rate, // 核查合格率
          avg_repair_duration: response.avg_repair_duration, // 平均修复时长
          review_qualified_rate: response.review_qualified_rate // 复核合格率
        };
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('停车空置核心指标概览接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          const range = params.range || 'today';
          // 仅保留需求指定的核心字段（空置相关）
          let mockData = {
            city_vacant_rate: 34.2,
            warn_vacant_count: 12,
            fault_vacant_count: 5,
            adjust_vacant_count: 3,
            verify_qualified_rate: 95.8,
            avg_repair_duration: 45,
            review_qualified_rate: 98.2
          };
          // 模拟不同时间范围的数据差异
          if (range === 'yesterday') {
            mockData = {
              city_vacant_rate: 37.7,
              warn_vacant_count: 10,
              fault_vacant_count: 4,
              adjust_vacant_count: 2,
              verify_qualified_rate: 94.5,
              avg_repair_duration: 48,
              review_qualified_rate: 97.8
            };
          } else if (range === 'week') {
            mockData = {
              city_vacant_rate: 31.5,
              warn_vacant_count: 78,
              fault_vacant_count: 29,
              adjust_vacant_count: 18,
              verify_qualified_rate: 96.1,
              avg_repair_duration: 42,
              review_qualified_rate: 98.5
            };
          } else if (range === 'month') { // 新增近30日筛选
            mockData = {
              city_vacant_rate: 32.8,
              warn_vacant_count: 326,
              fault_vacant_count: 118,
              adjust_vacant_count: 75,
              verify_qualified_rate: 95.9,
              avg_repair_duration: 44,
              review_qualified_rate: 98.3
            };
          }
          resolve(mockData);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchParkingOverview 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    // 异常兜底：返回全0默认值
    return Promise.resolve({
      city_vacant_rate: 0,
      warn_vacant_count: 0,
      fault_vacant_count: 0,
      adjust_vacant_count: 0,
      verify_qualified_rate: 0,
      avg_repair_duration: 0,
      review_qualified_rate: 0
    });
  }
};

// 实时统计数据接口
export const fetchParkingRealTimeStat = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/vacancy/realTimeStat/get`,
      params
    }).then(response => {
      console.log('停车实时统计表-接口请求成功');
      if (response && typeof response === 'object' && !Array.isArray(response) && response.city_occupy_rate !== undefined) {
        console.log('停车实时统计表-响应符合实际格式');
        // 严格匹配stat_park_real_time表结构
        return {
          city_occupy_rate: response.city_occupy_rate, // 全城占用泊位率
          warn_occupy_total: response.warn_occupy_total, // 预警占用泊位数
          overtime_occupy_count: response.overtime_occupy_count, // 超时长占用数
          non_motor_occupy_count: response.non_motor_occupy_count, // 非机动占用数
          dispose_qualified_rate: response.dispose_qualified_rate, // 处置合格率
          avg_dispose_duration: response.avg_dispose_duration, // 平均处置时长
          city_vacant_rate: response.city_vacant_rate, // 全城空置泊位率
          warn_vacant_count: response.warn_vacant_count, // 预警空置泊位数
          fault_vacant_count: response.fault_vacant_count, // 故障导致空置数
          adjust_vacant_count: response.adjust_vacant_count, // 规划调整空置数
          verify_qualified_rate: response.verify_qualified_rate, // 核查合格率
          avg_repair_duration: response.avg_repair_duration, // 平均修复时长
          review_qualified_rate: response.review_qualified_rate, // 复核合格率
          city_fault_rate: response.city_fault_rate, // 全城故障泊位率
          sensor_fault_count: response.sensor_fault_count, // 传感器故障数
          facility_damage_count: response.facility_damage_count, // 设施损坏数
          serious_fault_ratio: response.serious_fault_ratio // 严重故障占比
        };
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('停车实时统计表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          const range = params.range || 'today';
          // 基础模拟数据（今日）
          let mockData = {
            city_occupy_rate: 65.8,
            warn_occupy_total: 28,
            overtime_occupy_count: 15,
            non_motor_occupy_count: 8,
            dispose_qualified_rate: 92.5,
            avg_dispose_duration: 25,
            city_vacant_rate: 34.2,
            warn_vacant_count: 12,
            fault_vacant_count: 5,
            adjust_vacant_count: 3,
            verify_qualified_rate: 95.8,
            avg_repair_duration: 45,
            review_qualified_rate: 98.2,
            city_fault_rate: 2.1,
            sensor_fault_count: 7,
            facility_damage_count: 4,
            serious_fault_ratio: 15.6
          };
          // 昨日数据差异
          if (range === 'yesterday') {
            mockData = {
              city_occupy_rate: 62.3,
              warn_occupy_total: 22,
              overtime_occupy_count: 12,
              non_motor_occupy_count: 6,
              dispose_qualified_rate: 91.8,
              avg_dispose_duration: 28,
              city_vacant_rate: 37.7,
              warn_vacant_count: 10,
              fault_vacant_count: 4,
              adjust_vacant_count: 2,
              verify_qualified_rate: 94.5,
              avg_repair_duration: 48,
              review_qualified_rate: 97.8,
              city_fault_rate: 1.8,
              sensor_fault_count: 6,
              facility_damage_count: 3,
              serious_fault_ratio: 12.3
            };
          }
          // 近7日数据差异（累计/平均值）
          else if (range === 'week') {
            mockData = {
              city_occupy_rate: 68.5,
              warn_occupy_total: 156,
              overtime_occupy_count: 89,
              non_motor_occupy_count: 45,
              dispose_qualified_rate: 93.2,
              avg_dispose_duration: 23,
              city_vacant_rate: 31.5,
              warn_vacant_count: 78,
              fault_vacant_count: 29,
              adjust_vacant_count: 18,
              verify_qualified_rate: 96.1,
              avg_repair_duration: 42,
              review_qualified_rate: 98.5,
              city_fault_rate: 2.5,
              sensor_fault_count: 41,
              facility_damage_count: 22,
              serious_fault_ratio: 18.9
            };
          }
          // 近30日数据差异
          else if (range === 'month') {
            mockData = {
              city_occupy_rate: 67.2,
              warn_occupy_total: 685,
              overtime_occupy_count: 382,
              non_motor_occupy_count: 198,
              dispose_qualified_rate: 92.9,
              avg_dispose_duration: 24,
              city_vacant_rate: 32.8,
              warn_vacant_count: 326,
              fault_vacant_count: 118,
              adjust_vacant_count: 75,
              verify_qualified_rate: 95.9,
              avg_repair_duration: 44,
              review_qualified_rate: 98.3,
              city_fault_rate: 2.3,
              sensor_fault_count: 178,
              facility_damage_count: 95,
              serious_fault_ratio: 17.2
            };
          }
          resolve(mockData);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchParkingRealTimeStat 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    // 异常兜底：返回全0默认值
    return Promise.resolve({
      city_occupy_rate: 0,
      warn_occupy_total: 0,
      overtime_occupy_count: 0,
      non_motor_occupy_count: 0,
      dispose_qualified_rate: 0,
      avg_dispose_duration: 0,
      city_vacant_rate: 0,
      warn_vacant_count: 0,
      fault_vacant_count: 0,
      adjust_vacant_count: 0,
      verify_qualified_rate: 0,
      avg_repair_duration: 0,
      review_qualified_rate: 0,
      city_fault_rate: 0,
      sensor_fault_count: 0,
      facility_damage_count: 0,
      serious_fault_ratio: 0
    });
  }
};

// ===================== 异常预警视图 =====================
// 异常预警查询接口
export const fetchWarnTrackList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/vacancy/warn/track/list`,
      params
    }).then(response => {
      console.log('空置预警追踪列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('空置预警追踪列表-响应符合实际格式');
        // 仅返回需求指定的核心字段（空置预警相关）
        return response.map(item => ({
          mon_id: item.mon_id, // 新增：关联维修工单的监测ID
          berth_id: item.berth_id,
          berth_pos: item.berth_pos,
          vacant_endure: item.vacant_endure,
          warn_status: item.warn_status,
          check_result: item.check_result,
          repair_status: item.repair_status,
          repair_name: item.repair_name,
          review_result: item.review_result,
          est_recover_time: item.est_recover_time
        }));
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('空置预警追踪列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              mon_id: 'M004', // 新增：监测ID
              berth_id: 'B004',
              berth_pos: '机场停车场-D25泊位',
              vacant_endure: 240, // 空置时长（分钟）
              warn_status: 'closed',
              check_result: 'adjust', // 核查结果：规划调整
              repair_status: 'not_need', // 维修状态：无需维修
              repair_name: '',
              review_result: 'pass', // 复核结果：通过
              est_recover_time: ''
            },
            {
              mon_id: 'M005', // 新增：监测ID
              berth_id: 'B005',
              berth_pos: '会展中心停车场-E10泊位',
              vacant_endure: 300, // 空置时长（分钟）
              warn_status: 'warning',
              check_result: 'fault', // 核查结果：故障
              repair_status: 'repairing', // 维修状态：维修中
              repair_name: '赵六',
              review_result: 'pending', // 复核结果：待复核
              est_recover_time: '2025-12-29 11:00:00'
            },
            {
              mon_id: 'M009', // 新增：监测ID
              berth_id: 'B009',
              berth_pos: '集美软件园停车场-I15泊位',
              vacant_endure: 270, // 空置时长（分钟）
              warn_status: 'warning',
              check_result: 'fault', // 核查结果：故障
              repair_status: 'unhandled', // 维修状态：未处理
              repair_name: '',
              review_result: 'pending', // 复核结果：待复核
              est_recover_time: ''
            },
            {
              mon_id: 'M006', // 新增：监测ID
              berth_id: 'B006',
              berth_pos: '观音山停车场-F05泊位',
              vacant_endure: 180, // 空置时长（分钟）
              warn_status: 'warning',
              check_result: 'fault', // 核查结果：故障
              repair_status: 'repairing', // 维修状态：维修中
              repair_name: '钱七',
              review_result: 'pending', // 复核结果：待复核
              est_recover_time: '2025-12-29 16:00:00'
            },
            {
              mon_id: 'M007', // 新增：监测ID
              berth_id: 'B007',
              berth_pos: 'SM广场停车场-G18泊位',
              vacant_endure: 150, // 空置时长（分钟）
              warn_status: 'disposed',
              check_result: 'normal', // 核查结果：正常
              repair_status: 'completed', // 维修状态：已完成
              repair_name: '孙八',
              review_result: 'pass', // 复核结果：通过
              est_recover_time: '2025-12-28 15:00:00'
            },
            {
              mon_id: 'M001', // 新增：监测ID
              berth_id: 'B001',
              berth_pos: '市中心停车场-A01泊位',
              vacant_endure: 210, // 空置时长（分钟）
              warn_status: 'warning',
              check_result: 'fault', // 核查结果：故障
              repair_status: 'repairing', // 维修状态：维修中
              repair_name: '张三',
              review_result: 'pending', // 复核结果：待复核
              est_recover_time: '2025-12-29 12:00:00'
            },
            {
              mon_id: 'M003', // 新增：监测ID
              berth_id: 'B003',
              berth_pos: '火车站停车场-C08泊位',
              vacant_endure: 120, // 空置时长（分钟）
              warn_status: 'disposed',
              check_result: 'fault', // 核查结果：故障
              repair_status: 'completed', // 维修状态：已完成
              repair_name: '李四',
              review_result: 'pass', // 复核结果：通过
              est_recover_time: '2025-12-29 08:00:00'
            },
            {
              mon_id: 'M010', // 新增：监测ID
              berth_id: 'B010',
              berth_pos: '杏林湾停车场-J07泊位',
              vacant_endure: 240, // 空置时长（分钟）
              warn_status: 'warning',
              check_result: 'fault', // 核查结果：故障
              repair_status: 'repairing', // 维修状态：维修中
              repair_name: '吴十',
              review_result: 'pending', // 复核结果：待复核
              est_recover_time: '2025-12-29 13:00:00'
            },
            {
              mon_id: 'M008', // 新增：监测ID
              berth_id: 'B008',
              berth_pos: '湖里万达停车场-H09泊位',
              vacant_endure: 180, // 空置时长（分钟）
              warn_status: 'closed',
              check_result: 'adjust', // 核查结果：规划调整
              repair_status: 'not_need', // 维修状态：无需维修
              repair_name: '周九',
              review_result: 'pass', // 复核结果：通过
              est_recover_time: ''
            },
            {
              mon_id: 'M002', // 新增：监测ID
              berth_id: 'B002',
              berth_pos: '软件园停车场-B12泊位',
              vacant_endure: 270, // 空置时长（分钟）
              warn_status: 'warning',
              check_result: 'fault', // 核查结果：故障
              repair_status: 'unhandled', // 维修状态：未处理
              repair_name: '',
              review_result: 'pending', // 复核结果：待复核
              est_recover_time: ''
            }
          ]);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchWarnTrackList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 维修状态查询接口
export const fetchRepairWoStatus = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/vacancy/repair/wo/status`,
      params
    }).then(response => {
      console.log('维修工单状态-接口请求成功');
      if (response && typeof response === 'object') {
        console.log('维修工单状态-响应符合实际格式');
        return response;
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('维修工单状态接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          // 匹配biz_park_repair_wo表结构
          const mockData = {
            repair_wo_id: `RW${params.mon_id?.substring(1)}`,
            wo_no: `WO2025${params.mon_id?.substring(1)}001`,
            repair_status: params.mon_id === 'M001' ? 'repairing' : 'unhandled',
            assign_time: '2025-12-29 09:00:00',
            repair_time: params.mon_id === 'M003' ? '2025-12-29 08:00:00' : '',
            repair_name: params.mon_id === 'M001' ? '张三' : '未分配',
            dept_name: params.mon_id === 'M001' ? '运维一部' : '',
            repair_duration: params.mon_id === 'M003' ? 2 : 0,
            fault_type: 'sensor_fault',
            fault_level: 'medium'
          };
          resolve(mockData);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchRepairWoStatus 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};
