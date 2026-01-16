import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';

// ======================== 预警事件概览 所有接口 ========================
// 预警事件概览-预警事件核心详情列表
export const fetchAlarmEventList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/event/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            alarmId: item.alarmId,
            alarmLevel: item.alarmLevel,
            alarmType: item.alarmType,
            areaCode: item.areaCode,
            lotId: item.lotId,
            roadsideId: item.roadsideId,
            spaceId: item.spaceId,
            deviceId: item.deviceId,
            alarmTime: item.alarmTime,
            dealStatus: item.dealStatus,
            maintainUserId: item.maintainUserId,
          }));
        }
        throw new Error('真实接口返回无预警事件列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('预警事件列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                alarmId: 'ALM2026ZZ0001',
                alarmLevel: '一级预警',
                alarmType: '消防安全预警',
                areaCode: 'main',
                lotId: 'LOT2026ZZ001',
                roadsideId: 'RS2026ZZ001',
                spaceId: 'SP2026ZZ001',
                deviceId: 'DEV2026ZZ001',
                alarmTime: 1736889600000,
                dealStatus: '未处置',
                maintainUserId: 'M2026001'
              },
              {
                alarmId: 'ALM2026ZZ0002',
                alarmLevel: '二级预警',
                alarmType: '设备离线',
                areaCode: 'highTech',
                lotId: 'LOT2026ZZ002',
                roadsideId: 'RS2026ZZ005',
                spaceId: 'SP2026ZZ008',
                deviceId: 'DEV2026ZZ012',
                alarmTime: 1736893200000,
                dealStatus: '处置中',
                maintainUserId: 'M2026002'
              },
              {
                alarmId: 'ALM2026ZZ0003',
                alarmLevel: '三级预警',
                alarmType: '泊位故障',
                areaCode: 'economic',
                lotId: 'LOT2026ZZ003',
                roadsideId: 'RS2026ZZ010',
                spaceId: 'SP2026ZZ015',
                deviceId: 'DEV2026ZZ025',
                alarmTime: 1736896800000,
                dealStatus: '已办结',
                maintainUserId: 'M2026003'
              },
              {
                alarmId: 'ALM2026ZZ0004',
                alarmLevel: '四级预警',
                alarmType: '超时长占用',
                areaCode: 'culture',
                lotId: 'LOT2026ZZ004',
                roadsideId: 'RS2026ZZ018',
                spaceId: 'SP2026ZZ022',
                deviceId: '',
                alarmTime: 1736900400000,
                dealStatus: '已办结',
                maintainUserId: 'M2026004'
              },
              {
                alarmId: 'ALM2026ZZ0005',
                alarmLevel: '二级预警',
                alarmType: '收费异常',
                areaCode: 'suburb',
                lotId: 'LOT2026ZZ005',
                roadsideId: 'RS2026ZZ023',
                spaceId: 'SP2026ZZ029',
                deviceId: 'DEV2026ZZ033',
                alarmTime: 1736904000000,
                dealStatus: '处置中',
                maintainUserId: 'M2026005'
              },
              {
                alarmId: 'ALM2026ZZ0006',
                alarmLevel: '一级预警',
                alarmType: '逃费预警',
                areaCode: 'main',
                lotId: 'LOT2026ZZ001',
                roadsideId: 'RS2026ZZ003',
                spaceId: 'SP2026ZZ005',
                deviceId: '',
                alarmTime: 1736907600000,
                dealStatus: '未处置',
                maintainUserId: 'M2026001'
              },
              {
                alarmId: 'ALM2026ZZ0007',
                alarmLevel: '三级预警',
                alarmType: '泊位故障',
                areaCode: 'highTech',
                lotId: 'LOT2026ZZ002',
                roadsideId: 'RS2026ZZ007',
                spaceId: 'SP2026ZZ011',
                deviceId: 'DEV2026ZZ018',
                alarmTime: 1736911200000,
                dealStatus: '已办结',
                maintainUserId: 'M2026002'
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchAlarmEventList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 预警事件概览-核心指标卡片 (预警事件总数、各等级预警数、未处置预警数)
export const fetchAlarmEventIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/event/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalAlarmCount &&
          response.firstLevelCount &&
          response.undisposedCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无预警事件核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('预警事件核心指标接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalAlarmCount: 67,      // 预警事件总数
              firstLevelCount: 8,       // 一级预警数
              secondLevelCount: 19,     // 二级预警数
              thirdLevelCount: 25,      // 三级预警数
              fourthLevelCount: 15,     // 四级预警数
              undisposedCount: 12       // 未处置预警数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 预警事件核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalAlarmCount: 0,
      firstLevelCount: 0,
      secondLevelCount: 0,
      thirdLevelCount: 0,
      fourthLevelCount: 0,
      undisposedCount: 0
    });
  }
};

// 预警事件概览-不同区域预警数对比 柱状图
export const fetchAlarmAreaCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/alarm/stat/area/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('区域预警数对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['漳州主城区', '漳州高新区', '漳州经开区', '漳州文旅区', '漳州周边区县'],
          series: [{ name: '区域预警事件数量(条)', data: [22, 16, 12, 9, 8] }]
        };
      });
  } catch (error) {
    console.error('fetchAlarmAreaCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 预警事件概览-不同类型预警数对比 柱状图
export const fetchAlarmTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/alarm/stat/type/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('预警类型数对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['设备离线', '泊位故障', '收费异常', '超时长占用', '逃费预警', '消防安全预警'],
          series: [{ name: '预警类型数量(条)', data: [15, 13, 11, 9, 10, 9] }]
        };
      });
  } catch (error) {
    console.error('fetchAlarmTypeCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 预警事件概览-预警等级占比 饼图
export const fetchAlarmLevelRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/alarm/stat/level/ratio`, params })
      .then((response) => {
        if (response && typeof response === 'object' && !Array.isArray(response) && response.legend && Array.isArray(response.legend) && response.series && Array.isArray(response.series)) {
          return response;
        }
        throw new Error('真实接口返回无预警等级占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('预警等级占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['一级预警', '二级预警', '三级预警', '四级预警'],
              series: [{ name: '预警等级占比', data: [12, 28, 37, 23] }]
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 预警等级占比饼图函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [{ name: '预警等级占比', data: [] }] });
  }
};

// 预警事件概览-预警类型占比 饼图
export const fetchAlarmEventTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/alarm/stat/event/type/ratio`, params })
      .then((response) => {
        if (response && typeof response === 'object' && !Array.isArray(response) && response.legend && Array.isArray(response.legend) && response.series && Array.isArray(response.series)) {
          return response;
        }
        throw new Error('真实接口返回无预警类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('预警类型占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['设备离线', '泊位故障', '收费异常', '超时长占用', '逃费预警', '消防安全预警'],
              series: [{ name: '预警类型占比', data: [22, 19, 16, 13, 15, 15] }]
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 预警类型占比饼图函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [{ name: '预警类型占比', data: [] }] });
  }
};

// 预警事件概览-处置状态占比 饼图
export const fetchAlarmDealStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/alarm/stat/deal/status/ratio`, params })
      .then((response) => {
        if (response && typeof response === 'object' && !Array.isArray(response) && response.legend && Array.isArray(response.legend) && response.series && Array.isArray(response.series)) {
          return response;
        }
        throw new Error('真实接口返回无处置状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('处置状态占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['未处置', '处置中', '已办结', '已驳回'],
              series: [{ name: '预警处置状态占比', data: [18, 24, 55, 3] }]
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 处置状态占比饼图函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [{ name: '预警处置状态占比', data: [] }] });
  }
};

// ======================== 事件处置跟踪 所有接口 ========================
// 事件处置跟踪-处置进度详情列表（含各环节耗时）
export const fetchAlarmDisposalTrackList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/disposal/track/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            alarmId: item.alarmId,
            alarmContent: item.alarmContent,
            alarmTime: item.alarmTime,
            dispatchTime: item.dispatchTime,
            receiveTime: item.receiveTime,
            disposalTime: item.disposalTime,
            completeTime: item.completeTime,
            eachProcessDuration: item.eachProcessDuration,
            maintainUserId: item.maintainUserId,
            disposalMeasure: item.disposalMeasure,
            disposalResult: item.disposalResult,
          }));
        }
        throw new Error('真实接口返回无处置跟踪列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('事件处置跟踪列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                alarmId: 'ALM2026ZZ0003',
                alarmContent: '漳州经开区产业园停车场3号泊位地磁感应故障，无法识别车辆停放状态',
                alarmTime: 1736896800000,
                dispatchTime: 1736897100000,
                receiveTime: 1736897400000,
                disposalTime: 1736898300000,
                completeTime: 1736899200000,
                eachProcessDuration: { dispatch: 5, receive: 5, disposal: 15, total: 25 },
                maintainUserId: 'M2026003',
                disposalMeasure: '更换地磁感应传感器，重新调试信号接收模块',
                disposalResult: '处置完成，泊位恢复正常使用'
              },
              {
                alarmId: 'ALM2026ZZ0004',
                alarmContent: '漳州文旅区生态停车场12号车位车辆超时长占用超8小时，无人缴费离场',
                alarmTime: 1736900400000,
                dispatchTime: 1736900700000,
                receiveTime: 1736901000000,
                disposalTime: 1736901900000,
                completeTime: 1736902800000,
                eachProcessDuration: { dispatch: 5, receive: 5, disposal: 15, total: 25 },
                maintainUserId: 'M2026004',
                disposalMeasure: '现场联系车主，核实停车信息后完成补缴费用，提醒规范停车',
                disposalResult: '处置完成，车主正常离场'
              },
              {
                alarmId: 'ALM2026ZZ0007',
                alarmContent: '漳州高新区商业广场停车场7号泊位道闸落杆卡顿，影响车辆正常驶出',
                alarmTime: 1736911200000,
                dispatchTime: 1736911500000,
                receiveTime: 1736911800000,
                disposalTime: 1736912700000,
                completeTime: 1736913600000,
                eachProcessDuration: { dispatch: 5, receive: 5, disposal: 15, total: 25 },
                maintainUserId: 'M2026002',
                disposalMeasure: '润滑道闸传动轴承，校准落杆限位器，测试运行流畅度',
                disposalResult: '处置完成，道闸恢复正常使用'
              },
              {
                alarmId: 'ALM2026ZZ0005',
                alarmContent: '漳州龙海便民停车场收费系统异常，部分车辆缴费后无法抬杆，显示缴费未完成',
                alarmTime: 1736904000000,
                dispatchTime: 1736904300000,
                receiveTime: 1736904600000,
                disposalTime: 1736905500000,
                completeTime: null,
                eachProcessDuration: { dispatch: 5, receive: 5, disposal: 0, total: 10 },
                maintainUserId: 'M2026005',
                disposalMeasure: '重启收费系统服务，同步缴费数据，排查网络传输异常问题',
                disposalResult: '处置中，系统逐步恢复正常'
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchAlarmDisposalTrackList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 事件处置跟踪-核心指标卡片 (平均处置时长、超时处置数)
export const fetchAlarmDisposalIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/disposal/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.avgDisposalDuration &&
          response.overtimeDisposalCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无处置核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('事件处置核心指标接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              avgDisposalDuration: 23,    // 平均处置时长(分钟)
              overtimeDisposalCount: 7,   // 超时处置数(条)
              disposalCompletionRate: 82  // 处置完成率(%)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 事件处置核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      avgDisposalDuration: 0,
      overtimeDisposalCount: 0,
      disposalCompletionRate: 0
    });
  }
};

// 事件处置跟踪-不同责任人处置效率对比 柱状图
export const fetchMaintainDisposalCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/alarm/stat/maintain/disposal/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('责任人处置效率对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['张明', '李华', '王强', '赵芳', '陈杰'],
          series: [
            { name: '平均处置时长(分钟)', data: [20, 22, 25, 19, 24] },
            { name: '处置完成数量(条)', data: [16, 14, 12, 15, 11] }
          ]
        };
      });
  } catch (error) {
    console.error('fetchMaintainDisposalCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// ======================== 隐患预警视图 所有接口 ========================
// 隐患预警视图-地图标注数据(隐患位置+影响范围缓冲区)
export const fetchFaultWarningGeometries = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/fault/warning/geometries/get`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response) && response.length > 0) {
          return response;
        }
        throw new Error('真实接口返回无隐患地图数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('隐患预警地图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                faultId: 'FAULT2026ZZ001',
                faultLevel: '重大隐患',
                faultType: '消防通道占用隐患',
                areaCode: 'main',
                lotId: 'LOT2026ZZ001',
                roadsideId: 'RS2026ZZ008',
                spaceId: 'SP2026ZZ012',
                influenceRange: 20,
                rectificationRequirement: '立即清理消防通道占道车辆及杂物，恢复消防通道畅通',
                rectificationDeadline: 1737062400000,
                rectificationStatus: '整改中'
              },
              {
                faultId: 'FAULT2026ZZ002',
                faultLevel: '较大隐患',
                faultType: '设备老化',
                areaCode: 'highTech',
                lotId: 'LOT2026ZZ002',
                roadsideId: 'RS2026ZZ015',
                spaceId: 'SP2026ZZ020',
                influenceRange: 15,
                rectificationRequirement: '更换老化的道闸控制主板及传感器，更新设备固件版本',
                rectificationDeadline: 1737321600000,
                rectificationStatus: '未整改'
              },
              {
                faultId: 'FAULT2026ZZ003',
                faultLevel: '一般隐患',
                faultType: '泊位标线模糊',
                areaCode: 'economic',
                lotId: 'LOT2026ZZ003',
                roadsideId: 'RS2026ZZ022',
                spaceId: 'SP2026ZZ028',
                influenceRange: 8,
                rectificationRequirement: '重新喷涂泊位标线，增加反光标识，确保夜间可视度',
                rectificationDeadline: 1737580800000,
                rectificationStatus: '未整改'
              },
              {
                faultId: 'FAULT2026ZZ004',
                faultLevel: '轻微隐患',
                faultType: '收费系统漏洞',
                areaCode: 'culture',
                lotId: 'LOT2026ZZ004',
                roadsideId: '',
                spaceId: '',
                influenceRange: 10,
                rectificationRequirement: '修复收费系统计费漏洞，升级系统安全补丁，核验历史计费数据',
                rectificationDeadline: 1737235200000,
                rectificationStatus: '已完成'
              },
              {
                faultId: 'FAULT2026ZZ005',
                faultLevel: '较大隐患',
                faultType: '消防通道占用隐患',
                areaCode: 'suburb',
                lotId: 'LOT2026ZZ005',
                roadsideId: 'RS2026ZZ030',
                spaceId: 'SP2026ZZ035',
                influenceRange: 25,
                rectificationRequirement: '设置消防通道禁停标识，加装道闸隔离，安排专人巡查管控',
                rectificationDeadline: 1736976000000,
                rectificationStatus: '超期未整改'
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchFaultWarningGeometries 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 隐患预警视图-核心指标卡片 (隐患总数、各等级隐患数、到期未整改隐患数)
export const fetchFaultWarningIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/fault/warning/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalFaultCount &&
          response.majorFaultCount &&
          response.expiredUnrectifyCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无隐患核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('隐患预警核心指标接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalFaultCount: 32,        // 隐患总数
              majorFaultCount: 4,         // 重大隐患数
              biggerFaultCount: 7,        // 较大隐患数
              generalFaultCount: 13,      // 一般隐患数
              slightFaultCount: 8,        // 轻微隐患数
              expiredUnrectifyCount: 5    // 到期未整改隐患数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 隐患预警核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalFaultCount: 0,
      majorFaultCount: 0,
      biggerFaultCount: 0,
      generalFaultCount: 0,
      slightFaultCount: 0,
      expiredUnrectifyCount: 0
    });
  }
};

// 隐患预警视图-不同区域隐患数对比 柱状图
export const fetchFaultAreaCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/fault/stat/area/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('区域隐患数对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['漳州主城区', '漳州高新区', '漳州经开区', '漳州文旅区', '漳州周边区县'],
          series: [{ name: '区域隐患数量(处)', data: [11, 8, 6, 4, 3] }]
        };
      });
  } catch (error) {
    console.error('fetchFaultAreaCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 隐患预警视图-不同类型隐患数对比 柱状图
export const fetchFaultTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/fault/stat/type/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('隐患类型数对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['设备老化', '泊位标线模糊', '消防通道占用隐患', '收费系统漏洞'],
          series: [{ name: '隐患类型数量(处)', data: [9, 7, 10, 6] }]
        };
      });
  } catch (error) {
    console.error('fetchFaultTypeCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 隐患预警视图-隐患风险等级占比 饼图
export const fetchFaultLevelRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/fault/stat/level/ratio`, params })
      .then((response) => {
        if (response && typeof response === 'object' && !Array.isArray(response) && response.legend && Array.isArray(response.legend) && response.series && Array.isArray(response.series)) {
          return response;
        }
        throw new Error('真实接口返回无隐患等级占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('隐患风险等级占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['重大隐患', '较大隐患', '一般隐患', '轻微隐患'],
              series: [{ name: '隐患风险等级占比', data: [12.5, 21.9, 40.6, 25] }]
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 隐患风险等级占比饼图函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [{ name: '隐患风险等级占比', data: [] }] });
  }
};

// 隐患预警视图-隐患类型占比 饼图
export const fetchFaultTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/fault/stat/fault/type/ratio`, params })
      .then((response) => {
        if (response && typeof response === 'object' && !Array.isArray(response) && response.legend && Array.isArray(response.legend) && response.series && Array.isArray(response.series)) {
          return response;
        }
        throw new Error('真实接口返回无隐患类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('隐患类型占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['设备老化', '泊位标线模糊', '消防通道占用隐患', '收费系统漏洞'],
              series: [{ name: '隐患类型占比', data: [28, 22, 31, 19] }]
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 隐患类型占比饼图函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [{ name: '隐患类型占比', data: [] }] });
  }
};

// ======================== 异常预警视图 所有接口 ========================
// 异常预警视图-异常事件详情列表
export const fetchAbnormalEventList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/abnormal/event/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            abnormalId: item.abnormalId,
            abnormalType: item.abnormalType,
            areaCode: item.areaCode,
            lotId: item.lotId,
            abnormalReason: item.abnormalReason,
            abnormalDuration: item.abnormalDuration,
            relieveTime: item.relieveTime,
          }));
        }
        throw new Error('真实接口返回无异常事件列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('异常事件列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                abnormalId: 'ABN2026ZZ001',
                abnormalType: '收费异常',
                areaCode: 'main',
                lotId: 'LOT2026ZZ001',
                abnormalReason: '计费系统与支付网关对接异常，部分订单缴费后未同步核销',
                abnormalDuration: 120,
                relieveTime: 1736892000000
              },
              {
                abnormalId: 'ABN2026ZZ002',
                abnormalType: '数据异常',
                areaCode: 'highTech',
                lotId: 'LOT2026ZZ002',
                abnormalReason: '车位状态数据上报延迟，实时车位余量显示与实际不符',
                abnormalDuration: 90,
                relieveTime: 1736895600000
              },
              {
                abnormalId: 'ABN2026ZZ003',
                abnormalType: '诱导信息异常',
                areaCode: 'economic',
                lotId: 'LOT2026ZZ003',
                abnormalReason: '车位引导屏显示乱码，无法正常展示空余车位及导航信息',
                abnormalDuration: 150,
                relieveTime: null
              },
              {
                abnormalId: 'ABN2026ZZ004',
                abnormalType: '流程异常',
                areaCode: 'culture',
                lotId: 'LOT2026ZZ004',
                abnormalReason: '车辆离场时抬杆流程卡顿，需人工干预才能完成离场操作',
                abnormalDuration: 60,
                relieveTime: 1736900800000
              },
              {
                abnormalId: 'ABN2026ZZ005',
                abnormalType: '收费异常',
                areaCode: 'suburb',
                lotId: 'LOT2026ZZ005',
                abnormalReason: '移动支付渠道故障，车主无法通过微信/支付宝完成缴费',
                abnormalDuration: 180,
                relieveTime: null
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchAbnormalEventList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 异常预警视图-核心指标卡片 (异常事件总数、未解除异常数)
export const fetchAbnormalEventIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/abnormal/event/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalAbnormalCount &&
          response.unrelieveAbnormalCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无异常核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('异常预警核心指标接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalAbnormalCount: 41,     // 异常事件总数
              unrelieveAbnormalCount: 9,  // 未解除异常数
              relieveRate: 78             // 异常解除率(%)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 异常预警核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalAbnormalCount: 0,
      unrelieveAbnormalCount: 0,
      relieveRate: 0
    });
  }
};

// 异常预警视图-不同区域异常数对比 柱状图
export const fetchAbnormalAreaCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/abnormal/stat/area/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('区域异常数对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['漳州主城区', '漳州高新区', '漳州经开区', '漳州文旅区', '漳州周边区县'],
          series: [{ name: '区域异常数量(次)', data: [15, 10, 7, 5, 4] }]
        };
      });
  } catch (error) {
    console.error('fetchAbnormalAreaCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 异常预警视图-不同类型异常数对比 柱状图
export const fetchAbnormalTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/abnormal/stat/type/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('异常类型数对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['数据异常', '收费异常', '诱导信息异常', '流程异常'],
          series: [{ name: '异常类型数量(次)', data: [9, 14, 8, 10] }]
        };
      });
  } catch (error) {
    console.error('fetchAbnormalTypeCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 异常预警视图-异常类型占比 饼图
export const fetchAbnormalTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/abnormal/stat/type/ratio`, params })
      .then((response) => {
        if (response && typeof response === 'object' && !Array.isArray(response) && response.legend && Array.isArray(response.legend) && response.series && Array.isArray(response.series)) {
          return response;
        }
        throw new Error('真实接口返回无异常类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('异常类型占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['数据异常', '收费异常', '诱导信息异常', '流程异常'],
              series: [{ name: '异常类型占比', data: [22, 34, 20, 24] }]
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 异常类型占比饼图函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [{ name: '异常类型占比', data: [] }] });
  }
};

// 异常预警视图-异常事件近周期变化趋势 折线图
export const fetchAbnormalEventTrend = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/abnormal/stat/event/trend`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('异常事件趋势折线图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['01日', '02日', '03日', '04日', '05日', '06日', '07日', '08日', '09日', '10日', '11日', '12日', '13日', '14日', '15日'],
          series: [{ name: '异常事件数量(次)', data: [3, 5, 4, 6, 2, 5, 7, 4, 6, 3, 5, 4, 7, 5, 4] }]
        };
      });
  } catch (error) {
    console.error('fetchAbnormalEventTrend 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// ======================== 故障预警视图 所有接口 ========================
// 故障预警视图-地图故障设备位置标注数据
export const fetchDeviceFaultGeometries = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/device/fault/geometries/get`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            faultId: item.faultId,
            faultType: item.faultType,
            faultCode: item.faultCode,
            areaCode: item.areaCode,
            lotId: item.lotId,
            deviceExtendId: item.deviceExtendId,
            deviceType: item.deviceType,
            faultLocation: item.faultLocation,
            influenceRange: item.influenceRange,
            maintenanceProgress: item.maintenanceProgress,
            maintainUserId: item.maintainUserId,
          }));
        }
        throw new Error('真实接口返回无故障设备地图数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('故障预警地图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                faultId: 'DEVFAULT2026ZZ001',
                faultType: '道闸故障',
                faultCode: 'DZ-002',
                areaCode: 'main',
                lotId: 'LOT2026ZZ001',
                deviceExtendId: 'DEV20260114002',
                deviceType: 'barrier',
                faultLocation: '漳州主城区中央停车场入口2号道闸',
                influenceRange: 10,
                maintenanceProgress: '维修中',
                maintainUserId: 'M2026001'
              },
              {
                faultId: 'DEVFAULT2026ZZ002',
                faultType: '相机故障',
                faultCode: 'CAM-005',
                areaCode: 'highTech',
                lotId: 'LOT2026ZZ002',
                deviceExtendId: 'DEV20260114003',
                deviceType: 'camera',
                faultLocation: '漳州高新区商业广场停车场出口监控摄像头',
                influenceRange: 8,
                maintenanceProgress: '待维修',
                maintainUserId: 'M2026002'
              },
              {
                faultId: 'DEVFAULT2026ZZ003',
                faultType: '传感器故障',
                faultCode: 'SEN-001',
                areaCode: 'economic',
                lotId: 'LOT2026ZZ003',
                deviceExtendId: 'DEV20260114004',
                deviceType: 'sensor',
                faultLocation: '漳州经开区产业园停车场5号泊位地磁传感器',
                influenceRange: 5,
                maintenanceProgress: '已修复',
                maintainUserId: 'M2026003'
              },
              {
                faultId: 'DEVFAULT2026ZZ004',
                faultType: '充电桩故障',
                faultCode: 'CDZ-003',
                areaCode: 'culture',
                lotId: 'LOT2026ZZ004',
                deviceExtendId: 'DEV20260114001',
                deviceType: 'charging',
                faultLocation: '漳州文旅区生态停车场充电站3号充电桩',
                influenceRange: 12,
                maintenanceProgress: '维修中',
                maintainUserId: 'M2026004'
              },
              {
                faultId: 'DEVFAULT2026ZZ005',
                faultType: '系统故障',
                faultCode: 'SYS-001',
                areaCode: 'suburb',
                lotId: 'LOT2026ZZ005',
                deviceExtendId: '',
                deviceType: 'system',
                faultLocation: '漳州龙海便民停车场收费管理系统',
                influenceRange: 20,
                maintenanceProgress: '待维修',
                maintainUserId: 'M2026005'
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDeviceFaultGeometries 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 故障预警视图-核心指标卡片 (故障总数、各类型故障数、未修复故障数)
export const fetchDeviceFaultIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/device/fault/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalFaultCount &&
          response.unfixedFaultCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无故障核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('故障预警核心指标接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalFaultCount: 53,        // 故障总数
              barrierFaultCount: 14,      // 道闸故障数
              cameraFaultCount: 11,       // 相机故障数
              sensorFaultCount: 13,       // 传感器故障数
              chargingFaultCount: 9,      // 充电桩故障数
              systemFaultCount: 6,        // 系统故障数
              unfixedFaultCount: 16       // 未修复故障数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 故障预警核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalFaultCount: 0,
      barrierFaultCount: 0,
      cameraFaultCount: 0,
      sensorFaultCount: 0,
      chargingFaultCount: 0,
      systemFaultCount: 0,
      unfixedFaultCount: 0
    });
  }
};

// 故障预警视图-不同区域故障数对比 柱状图
export const fetchDeviceFaultAreaCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/device/fault/stat/area/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('区域故障数对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['漳州主城区', '漳州高新区', '漳州经开区', '漳州文旅区', '漳州周边区县'],
          series: [{ name: '区域故障数量(台)', data: [19, 12, 9, 7, 6] }]
        };
      });
  } catch (error) {
    console.error('fetchDeviceFaultAreaCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 故障预警视图-不同设备类型故障数对比 柱状图
export const fetchDeviceTypeFaultCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/device/fault/stat/device/type/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('设备类型故障数对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['道闸设备', '监控相机', '传感器', '充电桩', '系统'],
          series: [{ name: '设备故障数量(台)', data: [14, 11, 13, 9, 6] }]
        };
      });
  } catch (error) {
    console.error('fetchDeviceTypeFaultCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 故障预警视图-故障类型占比 饼图
export const fetchDeviceFaultTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/device/fault/stat/fault/type/ratio`, params })
      .then((response) => {
        if (response && typeof response === 'object' && !Array.isArray(response) && response.legend && Array.isArray(response.legend) && response.series && Array.isArray(response.series)) {
          return response;
        }
        throw new Error('真实接口返回无故障类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('故障类型占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['道闸故障', '相机故障', '传感器故障', '充电桩故障', '系统故障'],
              series: [{ name: '故障类型占比', data: [26, 21, 24, 17, 12] }]
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 故障类型占比饼图函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [{ name: '故障类型占比', data: [] }] });
  }
};

// 故障预警视图-设备类型占比 饼图
export const fetchDeviceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/device/fault/stat/device/type/ratio`, params })
      .then((response) => {
        if (response && typeof response === 'object' && !Array.isArray(response) && response.legend && Array.isArray(response.legend) && response.series && Array.isArray(response.series)) {
          return response;
        }
        throw new Error('真实接口返回无设备类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('设备类型占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['充电桩', '道闸设备', '监控摄像头', '地磁传感器', '车位引导屏'],
              series: [{ name: '故障设备类型占比', data: [22, 28, 23, 15, 12] }]
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 设备类型占比饼图函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [{ name: '故障设备类型占比', data: [] }] });
  }
};

// ======================== 合规预警视图 所有接口 ========================
// 合规预警视图-合规预警详情及整改进度列表
export const fetchComplianceWarningList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/compliance/warning/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            complianceWarningId: item.complianceWarningId,
            violationDetail: item.violationDetail,
            complianceStandard: item.complianceStandard,
            areaCode: item.areaCode,
            lotId: item.lotId,
            rectificationRequirement: item.rectificationRequirement,
            rectificationDeadline: item.rectificationDeadline,
            rectificationStatus: item.rectificationStatus,
          }));
        }
        throw new Error('真实接口返回无合规预警列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('合规预警列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                complianceWarningId: 'COMP2026ZZ001',
                violationDetail: '漳州主城区中央停车场未按规范公示停车收费标准及投诉电话，收费公示牌信息不全',
                complianceStandard: '《漳州市机动车停车服务收费管理办法》第三章第十条',
                areaCode: 'main',
                lotId: 'LOT2026ZZ001',
                rectificationRequirement: '完善收费公示牌，清晰展示收费标准、计费方式、投诉举报电话等信息',
                rectificationDeadline: 1737408000000,
                rectificationStatus: '整改中'
              },
              {
                complianceWarningId: 'COMP2026ZZ002',
                violationDetail: '漳州高新区商业广场停车场消防设施配备不足，灭火器过期未年检，消防栓水压不足',
                complianceStandard: '《建筑消防设施检测技术规程》及漳州市消防安全管理条例',
                areaCode: 'highTech',
                lotId: 'LOT2026ZZ002',
                rectificationRequirement: '更换过期灭火器，对消防栓进行加压检修，补充消防沙及灭火毯等设施',
                rectificationDeadline: 1737235200000,
                rectificationStatus: '超期未整改'
              },
              {
                complianceWarningId: 'COMP2026ZZ003',
                violationDetail: '漳州经开区产业园停车场泊位规划未预留足够的无障碍车位，不符合无障碍设计规范',
                complianceStandard: '《无障碍设计规范》GB 50763-2012 第5章',
                areaCode: 'economic',
                lotId: 'LOT2026ZZ003',
                rectificationRequirement: '重新规划泊位，增设2个无障碍车位并标注清晰，设置无障碍通道及标识',
                rectificationDeadline: 1737580800000,
                rectificationStatus: '未整改'
              },
              {
                complianceWarningId: 'COMP2026ZZ004',
                violationDetail: '漳州文旅区生态停车场充电桩安装间距不足，存在用电安全隐患，未张贴安全警示标识',
                complianceStandard: '《电动汽车充电基础设施建设技术规范》及漳州市用电安全管理规定',
                areaCode: 'culture',
                lotId: 'LOT2026ZZ004',
                rectificationRequirement: '调整充电桩安装间距，张贴安全警示标识，加装防护栏及漏电保护装置',
                rectificationDeadline: 1737148800000,
                rectificationStatus: '已完成'
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchComplianceWarningList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 合规预警视图-核心指标卡片 (合规预警总数、未整改预警数)
export const fetchComplianceWarningIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/compliance/warning/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalComplianceCount &&
          response.unrectifyCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无合规核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('合规预警核心指标接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalComplianceCount: 21,   // 合规预警总数
              unrectifyCount: 8,          // 未整改预警数
              rectifyCompletionRate: 62   // 整改完成率(%)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 合规预警核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalComplianceCount: 0,
      unrectifyCount: 0,
      rectifyCompletionRate: 0
    });
  }
};

// 合规预警视图-不同区域预警数对比 柱状图
export const fetchComplianceAreaCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/compliance/stat/area/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('区域合规预警数对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['漳州主城区', '漳州高新区', '漳州经开区', '漳州文旅区', '漳州周边区县'],
          series: [{ name: '区域合规预警数量(条)', data: [7, 5, 4, 3, 2] }]
        };
      });
  } catch (error) {
    console.error('fetchComplianceAreaCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 合规预警视图-不同违规类型预警数对比 柱状图
export const fetchViolationTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/compliance/stat/violation/type/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('违规类型预警数对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['收费规范违规', '消防设施不达标', '泊位规划违规', '用电安全违规', '标识标牌不全'],
          series: [{ name: '违规类型预警数量(条)', data: [6, 5, 4, 3, 3] }]
        };
      });
  } catch (error) {
    console.error('fetchViolationTypeCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 合规预警视图-违规类型占比 饼图
export const fetchViolationTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/compliance/stat/violation/type/ratio`, params })
      .then((response) => {
        if (response && typeof response === 'object' && !Array.isArray(response) && response.legend && Array.isArray(response.legend) && response.series && Array.isArray(response.series)) {
          return response;
        }
        throw new Error('真实接口返回无违规类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('违规类型占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['收费规范违规', '消防设施不达标', '泊位规划违规', '用电安全违规', '标识标牌不全'],
              series: [{ name: '违规类型占比', data: [29, 24, 19, 14, 14] }]
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 违规类型占比饼图函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [{ name: '违规类型占比', data: [] }] });
  }
};

// 合规预警视图-责任主体类型占比 饼图
export const fetchResponsibleSubjectRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/compliance/stat/subject/ratio`, params })
      .then((response) => {
        if (response && typeof response === 'object' && !Array.isArray(response) && response.legend && Array.isArray(response.legend) && response.series && Array.isArray(response.series)) {
          return response;
        }
        throw new Error('真实接口返回无责任主体占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('责任主体类型占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['车场运营方', '维保服务单位', '物业管控方', '第三方服务商'],
              series: [{ name: '责任主体类型占比', data: [48, 25, 18, 9] }]
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 责任主体类型占比饼图函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [{ name: '责任主体类型占比', data: [] }] });
  }
};
