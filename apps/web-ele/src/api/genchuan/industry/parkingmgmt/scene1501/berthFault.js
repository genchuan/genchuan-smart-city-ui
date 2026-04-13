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

// 停车场资源查询接口
export const fetchParkResourceList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/resource/list`, // 独立接口路径
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
          // 对应 biz_park_res 表字段
          const mockData = [
            {
              park_id: 'P001',
              park_name: '市中心停车场',
              total_space: 100,
              occupy_space: 65,
              warn_occupy_count: 8,
              abnormal_type: 'overtime_occupy',
              coord_x: 24.901234,
              coord_y: 118.691234,
              region_name: '思明区',
              grid_name: '莲前网格',
              grid_id: 'LQ001',
              free_space: 35,
              vacant_space: 10,
              vacant_endure: '24h',
              warn_status: 'warning',
              check_result: 'qualified',
              fault_space_count: 12,
              fault_type: '车牌识别故障',
              fault_level: '严重故障',
              repair_progress: 60,
              region_code: '350203'
            },
            {
              park_id: 'P002',
              park_name: '软件园停车场',
              total_space: 80,
              occupy_space: 52,
              warn_occupy_count: 6,
              abnormal_type: 'device_fault',
              coord_x: 24.898765,
              coord_y: 118.708765,
              region_name: '湖里区',
              grid_name: '软件园网格',
              grid_id: 'HS001',
              free_space: 28,
              vacant_space: 8,
              vacant_endure: '18h',
              warn_status: 'disposed',
              check_result: 'qualified',
              fault_space_count: 8,
              fault_type: '计费系统故障',
              fault_level: '中度故障',
              repair_progress: 80,
              region_code: '350206'
            },
            {
              park_id: 'P004',
              park_name: '机场停车场',
              total_space: 150,
              occupy_space: 90,
              warn_occupy_count: 12,
              abnormal_type: 'non_motor_occupy',
              coord_x: 24.851234,
              coord_y: 118.191234,
              region_name: '湖里区',
              grid_name: '默认网格',
              grid_id: 'DEFAULT001',
              free_space: 60,
              vacant_space: 15,
              vacant_endure: '36h',
              warn_status: 'no_warn',
              check_result: 'unqualified',
              fault_space_count: 5,
              fault_type: '网络通信故障',
              fault_level: '中度故障',
              repair_progress: 40,
              region_code: '350206'
            },
            {
              park_id: 'P005',
              park_name: '会展中心停车场',
              total_space: 90,
              occupy_space: 58,
              warn_occupy_count: 7,
              abnormal_type: 'overtime_occupy',
              coord_x: 24.903456,
              coord_y: 118.723456,
              region_name: '思明区',
              grid_name: '瑞景网格',
              grid_id: 'LQ002',
              free_space: 32,
              vacant_space: 9,
              vacant_endure: '20h',
              warn_status: 'warning',
              check_result: 'qualified',
              fault_space_count: 9,
              fault_type: '地感线圈故障',
              fault_level: '完全故障',
              repair_progress: 30,
              region_code: '350203'
            },
            {
              park_id: 'P008',
              park_name: '湖里万达停车场',
              total_space: 70,
              occupy_space: 45,
              warn_occupy_count: 5,
              abnormal_type: 'non_motor_occupy',
              coord_x: 24.887654,
              coord_y: 118.737654,
              region_name: '湖里区',
              grid_name: '枋湖网格',
              grid_id: 'HS003',
              free_space: 25,
              vacant_space: 7,
              vacant_endure: '16h',
              warn_status: 'disposed',
              check_result: 'qualified',
              fault_space_count: 7,
              fault_type: '网络通信故障',
              fault_level: '中度故障',
              repair_progress: 50,
              region_code: '350206'
            },
            {
              park_id: 'P009',
              park_name: '集美软件园停车场',
              total_space: 120,
              occupy_space: 78,
              warn_occupy_count: 9,
              abnormal_type: 'device_fault',
              coord_x: 24.876543,
              coord_y: 118.186543,
              region_name: '集美区',
              grid_name: '灌口网格',
              grid_id: 'JM003',
              free_space: 42,
              vacant_space: 12,
              vacant_endure: '28h',
              warn_status: 'warning',
              check_result: 'unqualified',
              fault_space_count: 14,
              fault_type: '道闸控制故障',
              fault_level: '严重故障',
              repair_progress: 35,
              region_code: '350211'
            },
            {
              park_id: 'P010',
              park_name: '杏林湾停车场',
              total_space: 85,
              occupy_space: 55,
              warn_occupy_count: 6,
              abnormal_type: 'device_fault',
              coord_x: 24.865432,
              coord_y: 118.175432,
              region_name: '集美区',
              grid_name: '杏林网格',
              grid_id: 'JM001',
              free_space: 30,
              vacant_space: 8,
              vacant_endure: '22h',
              warn_status: 'no_warn',
              check_result: 'qualified',
              fault_space_count: 6,
              fault_type: '泊位显示屏故障',
              fault_level: '轻微故障',
              repair_progress: 70,
              region_code: '350211'
            }
          ];

          let filteredData = [...mockData];

          // 区域筛选
          if (params.regionCode) {
            const regionCodeLevel = params.regionCode.length >= 6 ? params.regionCode.substring(0, 6) : params.regionCode;
            filteredData = filteredData.filter(item => item.region_code === regionCodeLevel);
          }

          // 网格筛选
          if (params.gridId) {
            filteredData = filteredData.filter(item => item.grid_id === params.gridId);
          }

          // 故障类型筛选（兼容原有逻辑，对应停车场资源的故障字段）
          if (params.faultType) {
            filteredData = filteredData.filter(item => item.fault_type === params.faultType);
          }

          // 故障等级筛选（兼容原有逻辑）
          if (params.faultLevel) {
            filteredData = filteredData.filter(item => item.fault_level === params.faultLevel);
          }

          // 维修进度筛选（兼容原有逻辑）
          if (params.repairProgress) {
            filteredData = filteredData.filter(item => item.repair_progress === params.repairProgress);
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

// 故障监测数据接口
export const fetchBerthFaultData = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/fault/data/list`, // 独立接口路径
      params
    }).then(response => {
      console.log('泊位故障监测数据-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('泊位故障监测数据-响应符合实际格式');
        return response;
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('泊位故障监测数据接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          // 对应 gen_park_berth_fault 表字段（扩充至7条，满足至少5条的需求）
          const mockData = [
            {
              mon_id: 'M001',
              berth_id: 'B001',
              berth_name: '市中心停车场-001',
              berth_pos: '地下B区1排',
              fault_type: '车牌识别故障',
              fault_level: '严重故障',
              fault_status: 'unhandled',
              warn_status: 'warning',
              repair_wo_id: 'W001',
              repair_user_id: 'U001',
              repair_time: '2025-01-06 10:00:00',
              repair_measure: '更换车牌识别模块',
              verify_result: 'pending',
              verify_time: null,
              verify_user_id: null,
              region_code: '350203',
              grid_id: 'LQ001',
              guanli_shixiang: '泊位设备维护',
              jiance_bujian: '车牌识别传感器',
              yingyong_changjing: '商业停车场',
              fault_desc: '无法识别蓝牌/黄牌车辆',
              create_user: 'admin',
              create_time: '2025-01-05 09:15:00',
              fault_type_name: '车牌识别故障',
              level_name: '严重故障',
              region_name: '思明区',
              grid_name: '莲前网格',
              matter_name: '泊位设备故障维修'
            },
            {
              mon_id: 'M002',
              berth_id: 'B002',
              berth_name: '软件园停车场-002',
              berth_pos: '地面A区2排',
              fault_type: '计费系统故障',
              fault_level: '中度故障',
              fault_status: 'handling',
              warn_status: 'warning',
              repair_wo_id: 'W002',
              repair_user_id: 'U002',
              repair_time: '2025-01-06 14:00:00',
              repair_measure: '重启计费系统并更新配置',
              verify_result: 'pending',
              verify_time: null,
              verify_user_id: null,
              region_code: '350206',
              grid_id: 'HS001',
              guanli_shixiang: '泊位计费维护',
              jiance_bujian: '计费终端',
              yingyong_changjing: '产业园区停车场',
              fault_desc: '金额计算偏差，部分订单漏记',
              create_user: 'admin',
              create_time: '2025-01-04 11:20:00',
              fault_type_name: '计费系统故障',
              level_name: '中度故障',
              region_name: '湖里区',
              grid_name: '软件园网格',
              matter_name: '泊位计费故障维修'
            },
            {
              mon_id: 'M003',
              berth_id: 'B003',
              berth_name: '会展中心停车场-003',
              berth_pos: '地上C区3排',
              fault_type: '地感线圈故障',
              fault_level: '完全故障',
              fault_status: 'unhandled',
              warn_status: 'warning',
              repair_wo_id: 'W003',
              repair_user_id: 'U003',
              repair_time: '2025-01-07 09:00:00',
              repair_measure: '重新铺设地感线圈并校准',
              verify_result: 'pending',
              verify_time: null,
              verify_user_id: null,
              region_code: '350203',
              grid_id: 'LQ002',
              guanli_shixiang: '泊位检测设备维护',
              jiance_bujian: '地感线圈传感器',
              yingyong_changjing: '会展中心配套停车场',
              fault_desc: '线圈完全失效，无法检测车辆驶入驶出',
              create_user: 'admin',
              create_time: '2025-01-03 14:30:00',
              fault_type_name: '地感线圈故障',
              level_name: '完全故障',
              region_name: '思明区',
              grid_name: '瑞景网格',
              matter_name: '泊位检测故障维修'
            },
            {
              mon_id: 'M004',
              berth_id: 'B004',
              berth_name: '湖里万达停车场-004',
              berth_pos: '地下A区4排',
              fault_type: '网络通信故障',
              fault_level: '中度故障',
              fault_status: 'handling',
              warn_status: 'warning',
              repair_wo_id: 'W004',
              repair_user_id: 'U004',
              repair_time: '2025-01-06 16:00:00',
              repair_measure: '更换无线通信模块，优化信号覆盖',
              verify_result: 'pending',
              verify_time: null,
              verify_user_id: null,
              region_code: '350206',
              grid_id: 'HS003',
              guanli_shixiang: '泊位通信设备维护',
              jiance_bujian: '4G通信模块',
              yingyong_changjing: '商业综合体停车场',
              fault_desc: '信号不稳定，故障数据无法实时上传后台',
              create_user: 'admin',
              create_time: '2025-01-02 10:45:00',
              fault_type_name: '网络通信故障',
              level_name: '中度故障',
              region_name: '湖里区',
              grid_name: '枋湖网格',
              matter_name: '泊位通信故障维修'
            },
            {
              mon_id: 'M005',
              berth_id: 'B005',
              berth_name: '集美软件园停车场-005',
              berth_pos: '地面B区5排',
              fault_type: '道闸控制故障',
              fault_level: '严重故障',
              fault_status: 'unhandled',
              warn_status: 'warning',
              repair_wo_id: 'W005',
              repair_user_id: 'U005',
              repair_time: '2025-01-07 11:00:00',
              repair_measure: '更换道闸电机，调试控制程序',
              verify_result: 'pending',
              verify_time: null,
              verify_user_id: null,
              region_code: '350211',
              grid_id: 'JM003',
              guanli_shixiang: '泊位道闸设备维护',
              jiance_bujian: '道闸驱动电机',
              yingyong_changjing: '产业园区停车场',
              fault_desc: '道闸无法自动升降，需人工手动操作，造成车辆拥堵',
              create_user: 'admin',
              create_time: '2025-01-01 15:20:00',
              fault_type_name: '道闸控制故障',
              level_name: '严重故障',
              region_name: '集美区',
              grid_name: '灌口网格',
              matter_name: '泊位道闸故障维修'
            },
            {
              mon_id: 'M006',
              berth_id: 'B006',
              berth_name: '杏林湾停车场-006',
              berth_pos: '地上D区6排',
              fault_type: '泊位显示屏故障',
              fault_level: '轻微故障',
              fault_status: 'handling',
              warn_status: 'disposed',
              repair_wo_id: 'W006',
              repair_user_id: 'U006',
              repair_time: '2025-01-06 13:00:00',
              repair_measure: '更换显示屏背光模组，调试显示参数',
              verify_result: 'qualified',
              verify_time: '2025-01-06 15:00:00',
              verify_user_id: 'U007',
              region_code: '350211',
              grid_id: 'JM001',
              guanli_shixiang: '泊位显示设备维护',
              jiance_bujian: 'LED显示屏模组',
              yingyong_changjing: '商务办公区停车场',
              fault_desc: '显示屏黑屏，无法展示泊位占用状态及计费信息',
              create_user: 'admin',
              create_time: '2024-12-31 08:30:00',
              fault_type_name: '泊位显示屏故障',
              level_name: '轻微故障',
              region_name: '集美区',
              grid_name: '杏林网格',
              matter_name: '泊位显示故障维修'
            },
            {
              mon_id: 'M007',
              berth_id: 'B007',
              berth_name: '机场停车场-007',
              berth_pos: '地上E区7排',
              fault_type: '网络通信故障',
              fault_level: '中度故障',
              fault_status: 'handling',
              warn_status: 'no_warn',
              repair_wo_id: 'W007',
              repair_user_id: 'U008',
              repair_time: '2025-01-08 10:00:00',
              repair_measure: '优化网络路由，增强信号强度',
              verify_result: 'pending',
              verify_time: null,
              verify_user_id: null,
              region_code: '350206',
              grid_id: 'DEFAULT001',
              guanli_shixiang: '泊位通信设备维护',
              jiance_bujian: '光纤收发器',
              yingyong_changjing: '交通枢纽停车场',
              fault_desc: '光纤信号中断，局部泊位数据上传失败',
              create_user: 'admin',
              create_time: '2024-12-30 16:15:00',
              fault_type_name: '网络通信故障',
              level_name: '中度故障',
              region_name: '湖里区',
              grid_name: '默认网格',
              matter_name: '泊位通信故障维修'
            }
          ];

          let filteredData = [...mockData];
          // 基础筛选逻辑（兼容需求的筛选条件）
          if (params.regionCode) {
            filteredData = filteredData.filter(item => item.region_code === params.regionCode);
          }
          if (params.gridId) {
            filteredData = filteredData.filter(item => item.grid_id === params.gridId);
          }
          if (params.faultType) {
            filteredData = filteredData.filter(item => item.fault_type === params.faultType);
          }
          if (params.faultLevel) {
            filteredData = filteredData.filter(item => item.fault_level === params.faultLevel);
          }

          resolve(filteredData);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchBerthFaultData 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// ===================== 核心指标看板接口 =====================
// 故障监测汇总接口
export const fetchFaultOverview = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/fault/overview/get`,
      params
    }).then(response => {
      console.log('故障核心指标概览-接口请求成功');
      if (response && typeof response === 'object' && !Array.isArray(response) && response.city_fault_rate !== undefined) {
        console.log('故障核心指标概览-响应符合实际格式');
        return {
          city_fault_rate: response.city_fault_rate,
          sensor_fault_count: response.sensor_fault_count,
          facility_damage_count: response.facility_damage_count,
          repair_qualified_rate: response.repair_qualified_rate,
          avg_repair_duration: response.avg_repair_duration,
          serious_fault_ratio: response.serious_fault_ratio,
          verify_qualified_rate: response.verify_qualified_rate
        };
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('故障核心指标概览接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          const range = params.range || 'today';
          let mockData = {
            city_fault_rate: 2.1,
            sensor_fault_count: 7,
            facility_damage_count: 4,
            repair_qualified_rate: 96.8,
            avg_repair_duration: 45,
            serious_fault_ratio: 15.6,
            verify_qualified_rate: 95.8
          };
          if (range === 'yesterday') {
            mockData = {
              city_fault_rate: 1.8,
              sensor_fault_count: 6,
              facility_damage_count: 3,
              repair_qualified_rate: 95.5,
              avg_repair_duration: 48,
              serious_fault_ratio: 12.3,
              verify_qualified_rate: 94.5
            };
          } else if (range === 'week') {
            mockData = {
              city_fault_rate: 2.5,
              sensor_fault_count: 41,
              facility_damage_count: 22,
              repair_qualified_rate: 97.2,
              avg_repair_duration: 42,
              serious_fault_ratio: 18.9,
              verify_qualified_rate: 96.1
            };
          }
          resolve(mockData);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchFaultOverview 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      city_fault_rate: 0,
      sensor_fault_count: 0,
      facility_damage_count: 0,
      repair_qualified_rate: 0,
      avg_repair_duration: 0,
      serious_fault_ratio: 0,
      verify_qualified_rate: 0
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
      if (response && typeof response === 'object' && !Array.isArray(response) && response.city_fault_rate !== undefined) {
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

// ===================== 故障预警视图接口 =====================
// 故障预警汇总接口
export const fetchBerthFaultList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/fault/berth/list`,
      params
    }).then(response => {
      console.log('泊位故障列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('泊位故障列表-响应符合实际格式');
        return response.map(item => ({
          region_name: item.region_name,
          fault_type: item.fault_type,
          fault_level: item.fault_level,
          berth_pos: item.berth_pos,
          untreated_fault_count: item.untreated_fault_count,
          fault_handle_progress: item.fault_handle_progress,
          serious_fault_detail: item.serious_fault_detail,
          create_time: item.create_time
        }));
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('泊位故障列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              region_name: '思明区',
              fault_type: '地感线圈故障',
              fault_level: '完全故障',
              untreated_fault_count: 8,
              fault_handle_progress: 30,
              serious_fault_detail: '瑞景网格-瑞景商业广场地下停车场B区：地感线圈完全失效，无法检测车辆驶入驶出状态',
              create_time: '2025-01-05 09:15:00'
            },
            {
              region_name: '思明区',
              fault_type: '泊位显示屏故障',
              fault_level: '轻微故障',
              untreated_fault_count: 10,
              fault_handle_progress: 70,
              serious_fault_detail: '前埔网格-前埔南区小区地面泊位：泊位显示屏黑屏，无法展示泊位占用状态',
              create_time: '2025-01-04 11:20:00'
            },
            {
              region_name: '湖里区',
              fault_type: '计费系统故障',
              fault_level: '中度故障',
              untreated_fault_count: 5,
              fault_handle_progress: 80,
              serious_fault_detail: '软件园网格-软件园二期观日路34号泊位：计费系统出现金额计算偏差，部分订单漏记费用',
              create_time: '2025-01-03 10:30:00'
            },
            {
              region_name: '湖里区',
              fault_type: '道闸控制故障',
              fault_level: '严重故障',
              untreated_fault_count: 12,
              fault_handle_progress: 40,
              serious_fault_detail: '高林网格-高林居住区一期地面泊位：道闸无法自动升降，需人工手动操作，造成车辆拥堵',
              create_time: '2025-01-02 14:20:00'
            },
            {
              region_name: '湖里区',
              fault_type: '网络通信故障',
              fault_level: '中度故障',
              untreated_fault_count: 7,
              fault_handle_progress: 50,
              serious_fault_detail: '枋湖网格-枋湖客运中心停车场入口泊位：网络信号不稳定，故障数据无法实时上传至后台',
              create_time: '2025-01-01 16:45:00'
            },
            {
              region_name: '集美区',
              fault_type: '车牌识别故障',
              fault_level: '中度故障',
              untreated_fault_count: 11,
              fault_handle_progress: 65,
              serious_fault_detail: '杏林网格-杏林湾营运中心地面泊位：车牌识别延迟，影响车辆快速通行',
              create_time: '2025-12-31 07:30:00'
            },
            {
              region_name: '集美区',
              fault_type: '地感线圈故障',
              fault_level: '轻微故障',
              untreated_fault_count: 9,
              fault_handle_progress: 75,
              serious_fault_detail: '集美网格-集美软件园三期地下停车场C区：部分地感线圈灵敏度不足',
              create_time: '2025-12-30 10:15:00'
            },
            {
              region_name: '集美区',
              fault_type: '道闸控制故障',
              fault_level: '严重故障',
              untreated_fault_count: 14,
              fault_handle_progress: 35,
              serious_fault_detail: '灌口网格-灌口万达广场停车场出口泊位：道闸下降卡顿，存在安全隐患',
              create_time: '2025-12-29 15:20:00'
            },
            {
              region_name: '思明区',
              fault_type: '车牌识别故障',
              fault_level: '严重故障',
              untreated_fault_count: 15,
              fault_handle_progress: 60,
              serious_fault_detail: '莲前网格-莲前东路123号泊位：车牌识别模块无法识别蓝牌、黄牌车辆，影响计费结算',
              create_time: '2025-12-28 08:00:00'
            }
          ]);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchBerthFaultList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 故障分布查询接口
export const fetchFaultDistribution = (params = {}) => {
  try {
    return Promise.all([
      (async () => {
        try {
          const res = await requestClient.get({
            url: `${BASE_URL}/fault/type/distribution`,
            params
          });
          if (res && typeof res === 'object' && !Array.isArray(res) && res.data && res.data.labels && res.data.data) {
            return res.data;
          }
          throw new Error('类型分布数据无效');
        } catch (error) {
          console.warn('故障类型分布接口调用失败，使用模拟数据:', error.message);
          const timeRange = params.time_range || '';
          let typeData = [102, 89, 56, 95, 38, 27];
          if (timeRange === 'today') {
            typeData = [12, 9, 6, 10, 4, 3];
          } else if (timeRange === 'yesterday') {
            typeData = [25, 18, 11, 22, 8, 7];
          } else if (timeRange === 'week') {
            typeData = [86, 75, 48, 82, 32, 23];
          }
          return {
            labels: ['车牌识别故障', '地感线圈故障', '计费系统故障', '泊位显示屏故障', '道闸控制故障', '网络通信故障'],
            data: typeData
          };
        }
      })(),
      (async () => {
        try {
          const res = await requestClient.get({
            url: `${BASE_URL}/fault/level/distribution`,
            params
          });
          if (res && typeof res === 'object' && !Array.isArray(res) && res.data && res.data.labels && res.data.data) {
            return res.data;
          }
          throw new Error('等级分布数据无效');
        } catch (error) {
          console.warn('故障等级分布接口调用失败，使用模拟数据:', error.message);
          const timeRange = params.time_range || '';
          let levelData = [12, 28, 86, 99];
          if (timeRange === 'today') {
            levelData = [1, 3, 9, 11];
          } else if (timeRange === 'yesterday') {
            levelData = [2, 6, 18, 25];
          } else if (timeRange === 'week') {
            levelData = [10, 22, 75, 88];
          }
          return {
            labels: ['完全故障', '严重故障', '中度故障', '轻微故障'],
            data: levelData
          };
        }
      })(),
      (async () => {
        try {
          const res = await requestClient.get({
            url: `${BASE_URL}/fault/region/distribution`,
            params
          });
          if (res && typeof res === 'object' && !Array.isArray(res) && res.data && res.data.labels && res.data.data) {
            return res.data;
          }
          throw new Error('区域分布数据无效');
        } catch (error) {
          console.warn('故障区域分布接口调用失败，使用模拟数据:', error.message);
          const timeRange = params.time_range || '';
          let regionData = [33, 24, 34];
          if (timeRange === 'today') {
            regionData = [4, 3, 5];
          } else if (timeRange === 'yesterday') {
            regionData = [8, 6, 9];
          } else if (timeRange === 'week') {
            regionData = [28, 20, 29];
          }
          return {
            labels: ['思明区', '湖里区', '集美区'],
            data: regionData
          };
        }
      })()
    ]).then(([typeDist, levelDist, regionDist]) => {
      return {
        type: typeDist,
        level: levelDist,
        region: regionDist
      };
    });
  } catch (error) {
    console.error('===== fetchFaultDistribution 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      type: { labels: [], data: [] },
      level: { labels: [], data: [] },
      region: { labels: [], data: [] }
    });
  }
};
