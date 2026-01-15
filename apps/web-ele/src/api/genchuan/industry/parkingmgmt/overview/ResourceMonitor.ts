import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';

// ======================== 新增：车辆轨迹监控 所有接口 ========================
// 车辆轨迹监控-核心指标 (当日通行车辆数、异常通行车辆数)
export const fetchCarTrackIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/car/track/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.todayPassCarCount &&
          response.abnormalCarCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无车辆轨迹核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '车辆轨迹核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              todayPassCarCount: 236,  // 当日通行车辆数 (辆)
              abnormalCarCount: 17     // 异常通行车辆数 (辆)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 车辆轨迹核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    return Promise.resolve({
      todayPassCarCount: 0,
      abnormalCarCount: 0
    });
  }
};

// 车辆轨迹监控-车辆通行轨迹详情地图接口
export const fetchCarTrackList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/car/track/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            entryId: item.entryId,
            carNumber: item.carNumber,
            entryTime: item.entryTime,
            entryPosition: item.entryPosition,
            parkingId: item.parkingId,
            spaceId: item.spaceId,
            parkingTime: item.parkingTime,
            exitId: item.exitId,
            exitTime: item.exitTime,
            exitPosition: item.exitPosition,
            inspectionId: item.inspectionId,
            inspectionResult: item.inspectionResult,
            carLatitude: item.carLatitude,
            carLongitude: item.carLongitude,
            carStatus: item.inspectionResult === '正常' ? 'normal' : 'abnormal'
          }));
        }
        throw new Error('真实接口返回无车辆轨迹列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('车辆轨迹列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { entryId: 'ENTRY20260001', carNumber: '闽E·88966', entryTime:1736889600000, entryPosition:'主城区中央停车场入口', parkingId:'PARK20260001', spaceId:'SPACE1001', parkingTime:125, exitId:'EXIT20260001', exitTime:1736897400000, exitPosition:'主城区中央停车场出口', inspectionId:'CHECK001', inspectionResult:'正常', carLatitude:24.582, carLongitude:117.651, carStatus:'normal' },
              { entryId: 'ENTRY20260002', carNumber: '闽E·76523', entryTime:1736890200000, entryPosition:'高新区商业广场入口', parkingId:'PARK20260002', spaceId:'SPACE2005', parkingTime:89, exitId:'EXIT20260002', exitTime:1736895540000, exitPosition:'高新区商业广场出口', inspectionId:'CHECK002', inspectionResult:'异常', carLatitude:24.591, carLongitude:117.663, carStatus:'abnormal' },
              { entryId: 'ENTRY20260003', carNumber: '闽E·91256', entryTime:1736891000000, entryPosition:'经开区产业园入口', parkingId:'PARK20260003', spaceId:'SPACE3008', parkingTime:210, exitId:'EXIT20260003', exitTime:1736903600000, exitPosition:'经开区产业园出口', inspectionId:'CHECK003', inspectionResult:'正常', carLatitude:24.573, carLongitude:117.642, carStatus:'normal' },
              { entryId: 'ENTRY20260004', carNumber: '闽E·63289', entryTime:1736892500000, entryPosition:'文旅区生态停车场入口', parkingId:'PARK20260004', spaceId:'SPACE4002', parkingTime:156, exitId:'EXIT20260004', exitTime:1736901460000, exitPosition:'文旅区生态停车场出口', inspectionId:'CHECK004', inspectionResult:'异常', carLatitude:24.565, carLongitude:117.675, carStatus:'abnormal' }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchCarTrackList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    return Promise.resolve([]);
  }
};

// 车辆轨迹监控-单车辆通行时段趋势 折线图
export const fetchCarTrackSingleTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/car/track/stat/trend/single`,
        params,
      })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('单车辆通行时段趋势折线图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['00时','03时','06时','09时','12时','15时','18时','21时'],
          series: [
            { name: '通行车辆数(辆)', data: [8,15,23,36,29,41,35,19] }
          ],
        };
      });
  } catch (error) {
    console.error('fetchCarTrackSingleTrend 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// ======================== 新增：运维人员动态 所有接口 ========================
// 运维人员动态-人员列表地图接口
export const fetchMaintainStaffList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/maintain/staff/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            maintainUserId: item.maintainUserId,
            userName: item.userName,
            department: item.department,
            responsibleArea: item.responsibleArea,
            onDutyStatus: item.onDutyStatus,
            scheduleId: item.scheduleId,
            shiftType: item.shiftType,
            workTime: item.workTime,
            contactPhone: item.contactPhone,
            currentTask: item.currentTask,
            maintainLatitude: item.maintainLatitude,
            maintainLongitude: item.maintainLongitude
          }));
        }
        throw new Error('真实接口返回无运维人员列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('运维人员列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { maintainUserId: 'M2026001', userName: '张明', department: '运维一部', responsibleArea: '主城区', onDutyStatus: '在岗', scheduleId: 'SCH202601', shiftType: '白班', workTime: '08:00-18:00', contactPhone: '13800138000', currentTask: '设备巡检', maintainLatitude: 24.582, maintainLongitude: 117.651 },
              { maintainUserId: 'M2026002', userName: '李华', department: '运维二部', responsibleArea: '高新区', onDutyStatus: '任务中', scheduleId: 'SCH202602', shiftType: '白班', workTime: '08:00-18:00', contactPhone: '13900139000', currentTask: '道闸维修', maintainLatitude: 24.578, maintainLongitude: 117.662 },
              { maintainUserId: 'M2026003', userName: '王强', department: '运维三部', responsibleArea: '经开区', onDutyStatus: '离岗', scheduleId: 'SCH202603', shiftType: '夜班', workTime: '18:00-08:00', contactPhone: '13700137000', currentTask: '无', maintainLatitude: 24.591, maintainLongitude: 117.645 },
              { maintainUserId: 'M2026004', userName: '赵芳', department: '运维一部', responsibleArea: '文旅区', onDutyStatus: '在岗', scheduleId: 'SCH202601', shiftType: '白班', workTime: '08:00-18:00', contactPhone: '13600136000', currentTask: '泊位故障排查', maintainLatitude: 24.575, maintainLongitude: 117.673 },
              { maintainUserId: 'M2026005', userName: '陈杰', department: '运维二部', responsibleArea: '周边区县', onDutyStatus: '任务中', scheduleId: 'SCH202602', shiftType: '夜班', workTime: '18:00-08:00', contactPhone: '13500135000', currentTask: '充电桩维护', maintainLatitude: 24.602, maintainLongitude: 117.638 }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainStaffList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 运维人员动态-核心指标 (总运维人数、在岗人数、当前任务数)
export const fetchMaintainStaffIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/maintain/staff/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalStaffCount &&
          response.onDutyCount &&
          response.taskCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无运维人员核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '运维人员核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalStaffCount: 28,  // 总运维人数
              onDutyCount: 21,      // 在岗人数
              taskCount: 9          // 当前任务数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 运维人员核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalStaffCount: 0,
      onDutyCount: 0,
      taskCount: 0
    });
  }
};

// 运维人员动态-各部门在岗人数对比 柱状图
export const fetchMaintainDeptOnDutyCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/maintain/staff/stat/dept/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('运维人员部门在岗对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['运维一部','运维二部','运维三部','应急抢修组'],
          series: [{ name: '部门在岗人数(人)', data: [8, 7, 4, 2] }]
        };
      });
  } catch (error) {
    console.error('fetchMaintainDeptOnDutyCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// ======================== 新增：资源全景监控 所有接口 ========================
// 停车资源全景监控-地图接口
export const fetchParkingLotGeometries3 = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/panoramic/geometries/get`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response) && response.length > 0) {
          return response;
        }
        throw new Error('真实接口返回无地图点位数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('停车资源全景地图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { lotId: 'LOT2026001', lotName: '主城区中央停车场', totalSpace: 520, availableSpace: 126, parkType: 'public', garageId: 'GAR001', floorCount: 3, longitude: 117.6520, latitude:24.5810, accountId:'ACC2026001', updateTime:1736889600000 },
              { lotId: 'LOT2026002', lotName: '高新区商业广场停车场', totalSpace: 890, availableSpace: 205, parkType: 'business', garageId: 'GAR002', floorCount: 2, longitude: 117.6730, latitude:24.5720, accountId:'ACC2026002', updateTime:1736893200000 },
              { lotId: 'LOT2026003', lotName: '经开区产业园停车场', totalSpace: 360, availableSpace: 98, parkType: 'park', garageId: 'GAR003', floorCount: 1, longitude: 117.6310, latitude:24.5650, accountId:'ACC2026003', updateTime:1736896800000 },
              { lotId: 'LOT2026001', lotName: '主城区中央停车场', roadsideId: 'RS20260001', berthNumber: 'ZC-001', status: '占用', spaceId: 'SP20260001', spaceType: '路侧', entryExitId: 'EE001', direction: '东', longitude: 117.6522, latitude:24.5812, accountId:'ACC2026001', updateTime:1736889600000 },
              { lotId: 'LOT2026001', lotName: '主城区中央停车场', roadsideId: 'RS20260002', berthNumber: 'ZC-002', status: '空闲', spaceId: 'SP20260002', spaceType: '路侧', entryExitId: 'EE001', direction: '东', longitude: 117.6524, latitude:24.5814, accountId:'ACC2026001', updateTime:1736889600000 },
              { lotId: 'LOT2026001', lotName: '主城区中央停车场', roadsideId: 'RS20260003', berthNumber: 'ZC-003', status: '故障', spaceId: 'SP20260003', spaceType: '路侧', entryExitId: 'EE002', direction: '西', longitude: 117.6518, latitude:24.5808, accountId:'ACC2026001', updateTime:1736889600000 },
              { lotId: 'LOT2026002', lotName: '高新区商业广场停车场', roadsideId: 'RS20260010', berthNumber: 'GX-001', status: '占用', spaceId: 'SP20260010', spaceType: '路侧', entryExitId: 'EE003', direction: '南', longitude: 117.6732, latitude:24.5722, accountId:'ACC2026002', updateTime:1736893200000 },
              { lotId: 'LOT2026002', lotName: '高新区商业广场停车场', roadsideId: 'RS20260011', berthNumber: 'GX-002', status: '空闲', spaceId: 'SP20260011', spaceType: '路侧', entryExitId: 'EE003', direction: '南', longitude: 117.6734, latitude:24.5724, accountId:'ACC2026002', updateTime:1736893200000 }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkingLotGeometries 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 资源全景监控-核心指标 (总资源数、可用资源数、正常运营资源数)
export const fetchParkPanoramaIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/panorama/resource/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalResourceCount &&
          response.availableResourceCount &&
          response.normalOperateCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无资源全景核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源全景核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalResourceCount: 286,  // 总资源数(个：车场+车库+泊位+出入口)
              availableResourceCount: 235, // 可用资源数
              normalOperateCount: 271, // 正常运营资源数
              normalOperateRate: 94.8   // 资源正常运营率(%)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 资源全景核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalResourceCount: 0,
      availableResourceCount: 0,
      normalOperateCount: 0,
      normalOperateRate: 0
    });
  }
};

// 资源全景监控-资源类型占比 饼图 (车场/车库/路侧泊位/出入口)
export const fetchParkPanoramaResourceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/panorama/stat/resource/type/ratio`, params })
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
        throw new Error('真实接口返回无资源类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('资源类型占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['地面车场', '室内车库', '路侧泊位', '车场出入口'],
              series: [{ name: '资源类型数量占比', data: [38, 25, 32, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('fetchParkPanoramaResourceTypeRatio 异常:', error);
    return Promise.resolve({ legend: [], series: [{ name: '资源类型数量占比', data: [] }] });
  }
};

// 资源全景监控-车位类型占比 饼图 (普通车位/充电车位/无障碍/子母车位)
export const fetchParkPanoramaSpaceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/panorama/stat/space/type/ratio`, params })
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
        throw new Error('真实接口返回无车位类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('车位类型占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['普通车位', '充电车位', '无障碍车位', '子母车位'],
              series: [{ name: '车位类型数量占比', data: [65, 20, 8, 7] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('fetchParkPanoramaSpaceTypeRatio 异常:', error);
    return Promise.resolve({ legend: [], series: [{ name: '车位类型数量占比', data: [] }] });
  }
};

// ======================== 新增：停车资源效能 所有接口 ========================
// 停车资源效能-车场资源详情列表 (核心字段全量包含)
export const fetchParkResourceList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/efficiency/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            lotId: item.lotId,
            lotName: item.lotName,
            parkingSpaceTurnoverRate: item.parkingSpaceTurnoverRate,
            resourceUtilizationRate: item.resourceUtilizationRate,
            peakTimePeriodUtilizationRate: item.peakTimePeriodUtilizationRate,
            areaCode: item.areaCode,
            parkType: item.parkType,
            statTime: item.statTime
          }));
        }
        throw new Error('真实接口返回无停车资源列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('停车资源列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { lotId: 'LOT2026001', lotName: '主城区中央停车场', parkingSpaceTurnoverRate: 3.8, resourceUtilizationRate: 89.2, peakTimePeriodUtilizationRate: 96.5, areaCode: 'main', parkType: 'public', statTime: 1736889600000 },
              { lotId: 'LOT2026002', lotName: '高新区商业广场停车场', parkingSpaceTurnoverRate: 5.2, resourceUtilizationRate: 92.6, peakTimePeriodUtilizationRate: 98.3, areaCode: 'highTech', parkType: 'business', statTime: 1736893200000 },
              { lotId: 'LOT2026003', lotName: '经开区产业园停车场', parkingSpaceTurnoverRate: 2.1, resourceUtilizationRate: 75.8, peakTimePeriodUtilizationRate: 82.4, areaCode: 'economic', parkType: 'park', statTime: 1736896800000 },
              { lotId: 'LOT2026004', lotName: '文旅区生态停车场', parkingSpaceTurnoverRate: 4.5, resourceUtilizationRate: 86.3, peakTimePeriodUtilizationRate: 94.7, areaCode: 'culture', parkType: 'tourism', statTime: 1736900400000 },
              { lotId: 'LOT2026005', lotName: '周边区县便民停车场', parkingSpaceTurnoverRate: 1.9, resourceUtilizationRate: 68.5, peakTimePeriodUtilizationRate: 76.2, areaCode: 'suburb', parkType: 'public', statTime: 1736904000000 },
              { lotId: 'LOT2026006', lotName: '主城区小区配套车场', parkingSpaceTurnoverRate: 1.5, resourceUtilizationRate: 72.1, peakTimePeriodUtilizationRate: 88.6, areaCode: 'main', parkType: 'community', statTime: 1736907600000 },
              { lotId: 'LOT2026007', lotName: '高新区写字楼停车场', parkingSpaceTurnoverRate: 3.2, resourceUtilizationRate: 81.7, peakTimePeriodUtilizationRate: 93.5, areaCode: 'highTech', parkType: 'business', statTime: 1736911200000 },
              { lotId: 'LOT2026008', lotName: '经开区物流园车场', parkingSpaceTurnoverRate: 2.7, resourceUtilizationRate: 79.3, peakTimePeriodUtilizationRate: 85.1, areaCode: 'economic', parkType: 'park', statTime: 1736914800000 }
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

// 停车资源效能-核心指标 (平均泊位周转率、平均资源利用率)
export const fetchParkResourceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/efficiency/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.avgTurnoverRate &&
          response.avgUtilizationRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无停车资源核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车资源核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              avgTurnoverRate: 2.96,  // 平均泊位周转率 (次/日)
              avgUtilizationRate: 80.3 // 平均资源利用率 (%)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车资源核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      avgTurnoverRate: 0,
      avgUtilizationRate: 0
    });
  }
};

// 停车资源效能-近周期资源效能趋势 折线图 (周转率+利用率双趋势)
export const fetchParkResourceTrend = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/resource/efficiency/stat/trend`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('停车资源效能趋势折线图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['01日','02日','03日','04日','05日','06日','07日','08日','09日','10日','11日','12日','13日','14日','15日'],
          series: [
            { name: '泊位周转率(次/日)', data: [2.5,2.7,2.6,3.0,3.2,3.5,3.3,3.6,3.4,3.1,2.9,2.8,3.0,3.2,2.9] },
            { name: '资源利用率(%)', data: [76.2,77.5,78.1,79.3,80.5,82.1,81.7,83.2,82.6,81.5,80.2,79.6,80.1,81.4,80.3] }
          ],
        };
      });
  } catch (error) {
    console.error('fetchParkResourceTrend 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 停车资源效能-各区域资源效能占比 饼图
export const fetchParkResourceAreaRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/efficiency/stat/area/ratio`,
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
        throw new Error('真实接口返回无区域资源占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域资源效能占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['主城区','高新区','经开区','文旅区','周边区县'],
              series: [{ name: '区域资源效能占比', data: [35, 25, 18, 12, 10] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 区域资源效能占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '区域资源效能占比', data: [] }],
    });
  }
};

// 停车资源效能-区域资源利用率对比 柱状图
export const fetchParkResourceAreaCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/resource/efficiency/stat/area/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('区域资源利用率对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['主城区','高新区','经开区','文旅区','周边区县'],
          series: [{ name: '区域平均利用率(%)', data: [86.5, 90.2, 78.3, 84.7, 69.1] }]
        };
      });
  } catch (error) {
    console.error('fetchParkResourceAreaCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 停车资源效能-车场类型资源利用率对比 柱状图
export const fetchParkResourceTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/resource/efficiency/stat/type/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('车场类型利用率对比柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['公共车场','商业车场','园区车场','文旅车场','小区车场'],
          series: [{ name: '类型平均利用率(%)', data: [75.6, 89.8, 78.2, 83.5, 70.3] }]
        };
      });
  } catch (error) {
    console.error('fetchParkResourceTypeCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 终端设备状态-故障/离线设备详情列表 (核心字段全量包含)
export const fetchTerminalDeviceList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/list`,
        params,
      })
      .then((response) => {
        console.log('终端设备状态-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('终端设备状态-响应符合实际格式');
          return response.map((item) => ({
            deviceExtendId: item.deviceExtendId,
            deviceCode: item.deviceCode,
            deviceType: item.deviceType,
            status: item.status,
            responsiblePerson: item.responsiblePerson,
            monitorId: item.monitorId,
            monitorData: item.monitorData,
            updateTime: item.updateTime,
            assetId: item.assetId,
            installPosition: item.installPosition,
          }));
        }
        throw new Error('真实接口返回无设备列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('终端设备状态接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { deviceExtendId: 'DEV20260114001', deviceCode: 'CDZ001001', deviceType: 'charging', status: 'fault', responsiblePerson: '张三', monitorId: 'MON2026001', monitorData: { voltage: 220.5, signalStrength: -75 }, updateTime: 1736889600000, assetId: 'ASSET001', installPosition: '主城区A区充电站1号桩' },
              { deviceExtendId: 'DEV20260114002', deviceCode: 'DZ002003', deviceType: 'barrier', status: 'offline', responsiblePerson: '李四', monitorId: 'MON2026002', monitorData: { voltage: 219.8, signalStrength: -98 }, updateTime: 1736893200000, assetId: 'ASSET002', installPosition: '高新区B停车场入口道闸' },
              { deviceExtendId: 'DEV20260114003', deviceCode: 'CAM005002', deviceType: 'camera', status: 'fault', responsiblePerson: '王五', monitorId: 'MON2026003', monitorData: { voltage: 12.2, signalStrength: -82 }, updateTime: 1736896800000, assetId: 'ASSET003', installPosition: '经开区C路段监控摄像头' },
              { deviceExtendId: 'DEV20260114004', deviceCode: 'SEN008005', deviceType: 'sensor', status: 'abnormal', responsiblePerson: '赵六', monitorId: 'MON2026004', monitorData: { voltage: 5.1, signalStrength: -89 }, updateTime: 1736900400000, assetId: 'ASSET004', installPosition: '文旅区D停车场地磁传感器' },
              { deviceExtendId: 'DEV20260114005', deviceCode: 'CDZ001006', deviceType: 'charging', status: 'offline', responsiblePerson: '张三', monitorId: 'MON2026005', monitorData: { voltage: 0, signalStrength: -110 }, updateTime: 1736904000000, assetId: 'ASSET001', installPosition: '主城区A区充电站6号桩' },
              { deviceExtendId: 'DEV20260114006', deviceCode: 'LED003002', deviceType: 'screen', status: 'fault', responsiblePerson: '钱七', monitorId: 'MON2026006', monitorData: { voltage: 24.3, signalStrength: -78 }, updateTime: 1736907600000, assetId: 'ASSET005', installPosition: '周边区县E停车场引导屏' },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchTerminalDeviceList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 终端设备状态-核心指标 (总设备数、在线设备数、故障设备数)
export const fetchTerminalDeviceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalDeviceCount &&
          response.onlineDeviceCount &&
          response.faultDeviceCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '终端设备核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalDeviceCount: 864, // 总设备数
              onlineDeviceCount: 792, // 在线设备数
              faultDeviceCount: 46,   // 故障设备数
              offlineDeviceCount:26   // 离线设备数（备用）
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 终端设备核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalDeviceCount: 0,
      onlineDeviceCount: 0,
      faultDeviceCount: 0
    });
  }
};

// 终端设备状态-近24小时设备在线率趋势 折线图
export const fetchTerminalDeviceOnlineRateTrend = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/terminal/device/stat/online/rate/trend`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('设备在线率趋势折线图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
          series: [
            {
              name: '设备在线率(%)',
              data: [96.2,95.8,95.5,95.3,95.6,96.1,97.0,97.5,97.8,98.0,98.2,98.1,97.9,97.6,97.8,97.9,98.3,98.0,97.5,97.0,96.8,96.5,96.3,96.2]
            },
          ],
        };
      });
  } catch (error) {
    console.error('fetchTerminalDeviceOnlineRateTrend 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 终端设备状态-设备类型占比 饼图
export const fetchTerminalDeviceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/stat/type/ratio`,
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
              legend: ['充电桩','道闸设备','监控摄像头','地磁传感器','车位引导屏'],
              series: [{ name: '设备类型占比', data: [45, 20, 18, 10,7] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 设备类型占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '设备类型占比', data: [] }],
    });
  }
};

// 终端设备状态-设备运行状态占比 饼图
export const fetchTerminalDeviceStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/stat/status/ratio`,
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
        throw new Error('真实接口返回无设备状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备运行状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['在线运行','离线设备','故障设备','通讯异常'],
              series: [{ name: '设备运行状态占比', data: [91.7, 3.0, 5.3, 0] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 设备运行状态占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '设备运行状态占比', data: [] }],
    });
  }
};

// ======================== 新增：备品备件仓储 所有接口 ========================
// 备品备件仓储-库存详情列表 (核心字段全量包含)
export const fetchSparePartList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/spare/part/storage/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            sparePartId: item.sparePartId,
            partName: item.partName,
            model: item.model,
            currentStock: item.currentStock,
            minStock: item.minStock,
            storageLocation: item.storageLocation,
            inId: item.inId,
            inQuantity: item.inQuantity,
            inTime: item.inTime,
            outId: item.outId,
            outQuantity: item.outQuantity,
            outTime: item.outTime
          }));
        }
        throw new Error('真实接口返回无备件列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('备品备件列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { sparePartId: 'SPA20260101', partName: '充电桩接触器', model: 'CJX2-1810', currentStock: 28, minStock: 10, storageLocation: '1号仓库A区01货位', inId: 'IN2026001', inQuantity: 50, inTime: 1735670400000, outId: 'OUT2026001', outQuantity: 22, outTime: 1736880000000 },
              { sparePartId: 'SPA20260102', partName: '道闸限位开关', model: 'LXW5-11G1', currentStock: 5, minStock: 8, storageLocation: '1号仓库B区03货位', inId: 'IN2026002', inQuantity: 20, inTime: 1735756800000, outId: 'OUT2026002', outQuantity: 15, outTime: 1736966400000 },
              { sparePartId: 'SPA20260103', partName: '摄像头电源适配器', model: '12V2A', currentStock: 42, minStock: 15, storageLocation: '2号仓库A区05货位', inId: 'IN2026003', inQuantity: 60, inTime: 1735843200000, outId: 'OUT2026003', outQuantity: 18, outTime: 1737052800000 },
              { sparePartId: 'SPA20260104', partName: '地磁传感器电池', model: 'ER14505', currentStock: 3, minStock: 6, storageLocation: '2号仓库C区02货位', inId: 'IN2026004', inQuantity: 30, inTime: 1735929600000, outId: 'OUT2026004', outQuantity: 27, outTime: 1737139200000 },
              { sparePartId: 'SPA20260105', partName: '引导屏LED模组', model: 'P10单色', currentStock: 16, minStock: 10, storageLocation: '1号仓库D区08货位', inId: 'IN2026005', inQuantity: 40, inTime: 1736016000000, outId: 'OUT2026005', outQuantity: 24, outTime: 1737225600000 },
              { sparePartId: 'SPA20260106', partName: '道闸电机减速器', model: 'RV030', currentStock: 9, minStock: 5, storageLocation: '3号仓库A区01货位', inId: 'IN2026006', inQuantity: 25, inTime: 1736102400000, outId: 'OUT2026006', outQuantity: 16, outTime: 1737312000000 }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSparePartList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 备品备件仓储-核心指标 (总备件种类数、库存充足数、缺货备件数)
export const fetchSparePartIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/spare/part/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalPartTypeCount &&
          response.enoughStockCount &&
          response.lackStockCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无备件核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '备品备件核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalPartTypeCount: 48,  // 总备件种类数
              enoughStockCount: 39,    // 库存充足数
              lackStockCount: 9        // 缺货备件数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 备品备件核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalPartTypeCount: 0,
      enoughStockCount: 0,
      lackStockCount: 0
    });
  }
};

// 备品备件仓储-近30日备件出入库数量趋势 柱状图
export const fetchSparePartInOutTrend = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/spare/part/stat/in/out/trend`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('备品备件出入库趋势柱状图接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
          series: [
            { name: '入库数量(件)', data: [56,42,68,75,36,52,49,63,71,45,58,62,39,47,53,66,72,59,44,51,65,70,48,55,61,37,43,57,64,73] },
            { name: '出库数量(件)', data: [32,45,51,38,49,26,37,42,55,31,39,46,29,33,41,52,48,35,44,30,36,47,28,32,40,53,34,42,38,45] }
          ]
        };
      });
  } catch (error) {
    console.error('fetchSparePartInOutTrend 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 备品备件仓储-备件类型占比 饼图
export const fetchSparePartTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/spare/part/stat/type/ratio`,
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
        throw new Error('真实接口返回无备件类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '备件类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['机电类备件','电子类备件','五金类备件','耗材类备件','其他类备件'],
              series: [{ name: '备件类型占比', data: [42, 25, 18, 10, 5] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 备件类型占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '备件类型占比', data: [] }],
    });
  }
};
