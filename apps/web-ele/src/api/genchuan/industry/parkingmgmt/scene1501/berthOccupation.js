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
      url: `${BASE_URL}/occupation/resource/list`,
      params
    }).then(response => {
      console.log('停车场资源列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('停车场资源列表-响应符合实际格式');
        return response;
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('停车场资源列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          const mockData = [
            {
              park_id: 'P001',
              park_name: '市中心停车场',
              total_space: 500,
              occupy_space: 358,
              warn_occupy_count: 8,
              abnormal_type: 'overtime_occupy',
              coord_x: 24.901234,
              coord_y: 118.691234,
              region_name: '思明区',
              grid_name: '莲前网格',
              grid_id: 'LQ001',
              region_code: '350203',
              warn_status: 'no_warn'
            },
            {
              park_id: 'P002',
              park_name: '软件园停车场',
              total_space: 800,
              occupy_space: 520,
              warn_occupy_count: 12,
              abnormal_type: 'non_motor_occupy',
              coord_x: 24.898765,
              coord_y: 118.708765,
              region_name: '湖里区',
              grid_name: '软件园网格',
              grid_id: 'HS001',
              region_code: '350206',
              warn_status: 'warning'
            },
            {
              park_id: 'P004',
              park_name: '机场停车场',
              total_space: 600,
              occupy_space: 387,
              warn_occupy_count: 8,
              abnormal_type: 'device_fault',
              coord_x: 24.851234,
              coord_y: 118.191234,
              region_name: '湖里区',
              grid_name: '默认网格',
              grid_id: 'DEFAULT001',
              region_code: '350206',
              warn_status: 'no_warn'
            },
            {
              park_id: 'P005',
              park_name: '会展中心停车场',
              total_space: 700,
              occupy_space: 490,
              warn_occupy_count: 10,
              abnormal_type: 'overtime_occupy',
              coord_x: 24.903456,
              coord_y: 118.723456,
              region_name: '思明区',
              grid_name: '瑞景网格',
              grid_id: 'LQ002',
              region_code: '350203',
              warn_status: 'warning'
            },
            {
              park_id: 'P008',
              park_name: '湖里万达停车场',
              total_space: 750,
              occupy_space: 480,
              warn_occupy_count: 9,
              abnormal_type: 'device_fault',
              coord_x: 24.887654,
              coord_y: 118.737654,
              region_name: '湖里区',
              grid_name: '枋湖网格',
              grid_id: 'HS003',
              region_code: '350206',
              warn_status: 'disposed'
            },
            {
              park_id: 'P009',
              park_name: '集美软件园停车场',
              total_space: 950,
              occupy_space: 620,
              warn_occupy_count: 11,
              abnormal_type: 'overtime_occupy',
              coord_x: 24.876543,
              coord_y: 118.186543,
              region_name: '湖里区',
              grid_name: '默认网格',
              grid_id: 'DEFAULT001',
              region_code: '350206',
              warn_status: 'warning'
            },
            {
              park_id: 'P010',
              park_name: '杏林湾停车场',
              total_space: 650,
              occupy_space: 390,
              warn_occupy_count: 0,
              abnormal_type: '',
              coord_x: 24.865432,
              coord_y: 118.175432,
              region_name: '思明区',
              grid_name: '默认网格',
              grid_id: 'DEFAULT001',
              region_code: '350203',
              warn_status: 'no_warn'
            }
          ];

          let filteredData = [...mockData];

          if (params.regionCode) {
            const regionCodeLevel = params.regionCode.length >= 6 ? params.regionCode.substring(0, 6) : params.regionCode;
            filteredData = filteredData.filter(item => item.region_code === regionCodeLevel);
          }

          if (params.gridId) {
            filteredData = filteredData.filter(item => item.grid_id === params.gridId);
          }

          if (params.abnormalType) {
            filteredData = filteredData.filter(item => item.abnormal_type === params.abnormalType);
          }

          if (params.warnStatus) {
            filteredData = filteredData.filter(item => item.warn_status === params.warnStatus);
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

// 占用监测数据接口
export const fetchBerthOccupyList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/occupation/berth/occupy/list`, // 接口URL贴合需求
      params
    }).then(response => {
      console.log('泊位占用监测列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('泊位占用监测列表-响应符合实际格式');
        // 仅返回gen_park_berth_occupy表的需求关联字段
        return response.map(item => ({
          mon_id: item.mon_id,
          berth_id: item.berth_id,
          berth_name: item.berth_name,
          abnormal_type: item.abnormal_type,
          create_time: item.create_time,
          region_code: item.region_code,
          grid_id: item.grid_id,
          region_name: item.region_name,
          grid_name: item.grid_name
        }));
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('泊位占用监测列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          // 复用现有模拟数据结构，减少改动
          const mockData = [
            {
              mon_id: 'W001',
              berth_id: 'B001',
              berth_name: '市中心停车场-A01泊位',
              abnormal_type: 'overtime_occupy',
              create_time: '2025-12-28 08:30:00',
              region_code: '350203',
              grid_id: 'LQ001',
              region_name: '思明区',
              grid_name: '莲前网格'
            },
            {
              mon_id: 'W002',
              berth_id: 'B002',
              berth_name: '软件园停车场-B12泊位',
              abnormal_type: 'non_motor_occupy',
              create_time: '2025-12-29 09:15:00',
              region_code: '350206',
              grid_id: 'HS001',
              region_name: '湖里区',
              grid_name: '软件园网格'
            },
            {
              mon_id: 'W003',
              berth_id: 'B003',
              berth_name: '火车站停车场-C08泊位',
              abnormal_type: 'device_fault',
              create_time: '2025-12-28 16:40:00',
              region_code: '350203',
              grid_id: 'LQ002',
              region_name: '思明区',
              grid_name: '瑞景网格'
            }
          ];
          // 复用现有筛选逻辑，减少改动
          let filteredData = [...mockData];
          if (params.regionCode) {
            filteredData = filteredData.filter(item => item.region_code === params.regionCode);
          }
          if (params.gridId) {
            filteredData = filteredData.filter(item => item.grid_id === params.gridId);
          }
          if (params.abnormalType) {
            filteredData = filteredData.filter(item => item.abnormal_type === params.abnormalType);
          }
          resolve(filteredData);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchBerthOccupyList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// ===================== 核心指标看板接口 =====================
// 占用监测汇总接口
export const fetchParkingOverview = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/occupation/overview/get`,
      params
    }).then(response => {
      console.log('停车核心指标概览-接口请求成功');
      if (response && typeof response === 'object' && !Array.isArray(response) && response.city_occupy_rate !== undefined) {
        console.log('停车核心指标概览-响应符合实际格式');
        // 仅返回需求指定的6个核心字段
        return {
          city_occupy_rate: response.city_occupy_rate,
          warn_occupy_total: response.warn_occupy_total,
          overtime_occupy_count: response.overtime_occupy_count,
          non_motor_occupy_count: response.non_motor_occupy_count,
          dispose_qualified_rate: response.dispose_qualified_rate,
          avg_dispose_duration: response.avg_dispose_duration
        };
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('停车核心指标概览接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          const range = params.range || 'today';
          let mockData = {
            city_occupy_rate: 65.8,
            warn_occupy_total: 28,
            overtime_occupy_count: 15,
            non_motor_occupy_count: 8,
            dispose_qualified_rate: 92.5,
            avg_dispose_duration: 25
          };
          if (range === 'yesterday') {
            mockData = {
              city_occupy_rate: 62.3,
              warn_occupy_total: 22,
              overtime_occupy_count: 12,
              non_motor_occupy_count: 6,
              dispose_qualified_rate: 91.8,
              avg_dispose_duration: 28
            };
          } else if (range === 'week') {
            mockData = {
              city_occupy_rate: 68.5,
              warn_occupy_total: 156,
              overtime_occupy_count: 89,
              non_motor_occupy_count: 45,
              dispose_qualified_rate: 93.2,
              avg_dispose_duration: 23
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
    return Promise.resolve({
      city_occupy_rate: 0,
      warn_occupy_total: 0,
      overtime_occupy_count: 0,
      non_motor_occupy_count: 0,
      dispose_qualified_rate: 0,
      avg_dispose_duration: 0
    });
  }
};

// 实时统计数据接口
export const fetchParkingRealTimeStat = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/occupation/realTimeStat/get`,
      params
    }).then(response => {
      console.log('停车实时统计表-接口请求成功');
      if (response && typeof response === 'object' && !Array.isArray(response) && response.city_occupy_rate !== undefined) {
        console.log('停车实时统计表-响应符合实际格式');
        return {
          city_occupy_rate: response.city_occupy_rate,
          warn_occupy_total: response.warn_occupy_total,
          overtime_occupy_count: response.overtime_occupy_count,
          non_motor_occupy_count: response.non_motor_occupy_count,
          dispose_qualified_rate: response.dispose_qualified_rate,
          avg_dispose_duration: response.avg_dispose_duration,
          city_vacant_rate: response.city_vacant_rate,
          warn_vacant_count: response.warn_vacant_count,
          fault_vacant_count: response.fault_vacant_count,
          adjust_vacant_count: response.adjust_vacant_count,
          verify_qualified_rate: response.verify_qualified_rate,
          avg_repair_duration: response.avg_repair_duration,
          review_qualified_rate: response.review_qualified_rate,
          city_fault_rate: response.city_fault_rate,
          sensor_fault_count: response.sensor_fault_count,
          facility_damage_count: response.facility_damage_count,
          serious_fault_ratio: response.serious_fault_ratio
        };
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('停车实时统计表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          const range = params.range || 'today';
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
          } else if (range === 'week') {
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
          resolve(mockData);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchParkingRealTimeStat 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
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

// ===================== 事件预警追踪接口 =====================
// 预警追踪查询接口
export const fetchWarnTrackList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/occupation/warn/track/list`,
      params
    }).then(response => {
      console.log('预警追踪列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('预警追踪列表-响应符合实际格式');
        return response.map(item => ({
          mon_id: item.mon_id,
          berth_name: item.berth_name,
          abnormal_type: item.abnormal_type,
          create_time: item.create_time,
          handle_status: item.handle_status,
          handler_name: item.handler_name,
          dispose_progress: item.dispose_progress,
          est_complete_time: item.est_complete_time
        }));
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('预警追踪列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              mon_id: 'W004',
              berth_name: '机场停车场-D25泊位',
              abnormal_type: 'overtime_occupy',
              create_time: '2025-12-29 10:20:00',
              handle_status: 'closed',
              handler_name: '王五',
              dispose_progress: 0,
              est_complete_time: ''
            },
            {
              mon_id: 'W005',
              berth_name: '会展中心停车场-E10泊位',
              abnormal_type: 'overtime_occupy',
              create_time: '2025-12-29 09:00:00',
              handle_status: 'handling',
              handler_name: '赵六',
              dispose_progress: 80,
              est_complete_time: '2025-12-29 11:00:00'
            },
            {
              mon_id: 'W009',
              berth_name: '集美软件园停车场-I15泊位',
              abnormal_type: 'non_motor_occupy',
              create_time: '2025-12-29 08:45:00',
              handle_status: 'unhandled',
              handler_name: '',
              dispose_progress: 0,
              est_complete_time: ''
            },
            {
              mon_id: 'W006',
              berth_name: '观音山停车场-F05泊位',
              abnormal_type: 'non_motor_occupy',
              create_time: '2025-12-29 14:20:00',
              handle_status: 'handling',
              handler_name: '钱七',
              dispose_progress: 40,
              est_complete_time: '2025-12-29 16:00:00'
            },
            {
              mon_id: 'W007',
              berth_name: 'SM广场停车场-G18泊位',
              abnormal_type: 'device_fault',
              create_time: '2025-12-28 10:10:00',
              handle_status: 'completed',
              handler_name: '孙八',
              dispose_progress: 100,
              est_complete_time: '2025-12-28 15:00:00'
            },
            {
              mon_id: 'W001',
              berth_name: '市中心停车场-A01泊位',
              abnormal_type: 'overtime_occupy',
              create_time: '2025-12-28 08:30:00',
              handle_status: 'handling',
              handler_name: '张三',
              dispose_progress: 60,
              est_complete_time: '2025-12-28 12:00:00'
            },
            {
              mon_id: 'W003',
              berth_name: '火车站停车场-C08泊位',
              abnormal_type: 'device_fault',
              create_time: '2025-12-28 16:40:00',
              handle_status: 'completed',
              handler_name: '李四',
              dispose_progress: 100,
              est_complete_time: '2025-12-29 08:00:00'
            },
            {
              mon_id: 'W010',
              berth_name: '杏林湾停车场-J07泊位',
              abnormal_type: 'device_fault',
              create_time: '2025-12-29 15:50:00',
              handle_status: 'handling',
              handler_name: '吴十',
              dispose_progress: 70,
              est_complete_time: '2025-12-30 13:00:00'
            },
            {
              mon_id: 'W008',
              berth_name: '湖里万达停车场-H09泊位',
              abnormal_type: 'overtime_occupy',
              create_time: '2025-12-29 11:30:00',
              handle_status: 'closed',
              handler_name: '周九',
              dispose_progress: 0,
              est_complete_time: ''
            },
            {
              mon_id: 'W002',
              berth_name: '软件园停车场-B12泊位',
              abnormal_type: 'non_motor_occupy',
              create_time: '2025-12-29 09:15:00',
              handle_status: 'unhandled',
              handler_name: '',
              dispose_progress: 0,
              est_complete_time: ''
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

// 工单状态查询接口
export const fetchDisposeWoStatus = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/occupation/dispose/wo/status`, // 接口URL贴合需求
      params // 传入mon_id关联工单
    }).then(response => {
      console.log('处置工单状态-接口请求成功');
      if (response && typeof response === 'object' && !Array.isArray(response)) {
        console.log('处置工单状态-响应符合实际格式');
        // 返回biz_park_dispose_wo表核心字段
        return {
          dispose_wo_id: response.dispose_wo_id,
          wo_no: response.wo_no,
          handle_status: response.handle_status,
          assign_time: response.assign_time,
          complete_time: response.complete_time,
          handler_name: response.handler_name,
          dept_name: response.dept_name,
          handle_duration: response.handle_duration,
          mon_id: response.mon_id
        };
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('处置工单状态接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          // 按mon_id返回对应工单数据，复用现有逻辑
          const mockWoMap = {
            'W001': {
              dispose_wo_id: 'WO001',
              wo_no: 'PARK-WO-20251228001',
              handle_status: 'handling',
              assign_time: '2025-12-28 08:35:00',
              complete_time: '',
              handler_name: '张三',
              dept_name: '停车运维部',
              handle_duration: 0,
              mon_id: 'W001'
            },
            'W002': {
              dispose_wo_id: 'WO002',
              wo_no: 'PARK-WO-20251229001',
              handle_status: 'unhandled',
              assign_time: '',
              complete_time: '',
              handler_name: '',
              dept_name: '',
              handle_duration: 0,
              mon_id: 'W002'
            },
            'W003': {
              dispose_wo_id: 'WO003',
              wo_no: 'PARK-WO-20251228002',
              handle_status: 'completed',
              assign_time: '2025-12-28 16:45:00',
              complete_time: '2025-12-29 08:00:00',
              handler_name: '李四',
              dept_name: '停车运维部',
              handle_duration: 15.25,
              mon_id: 'W003'
            }
          };
          resolve(mockWoMap[params.mon_id] || {
            dispose_wo_id: '',
            wo_no: '',
            handle_status: '',
            assign_time: '',
            complete_time: '',
            handler_name: '',
            dept_name: '',
            handle_duration: 0,
            mon_id: params.mon_id
          });
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchDisposeWoStatus 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      dispose_wo_id: '',
      wo_no: '',
      handle_status: '',
      assign_time: '',
      complete_time: '',
      handler_name: '',
      dept_name: '',
      handle_duration: 0,
      mon_id: params?.mon_id || ''
    });
  }
};
