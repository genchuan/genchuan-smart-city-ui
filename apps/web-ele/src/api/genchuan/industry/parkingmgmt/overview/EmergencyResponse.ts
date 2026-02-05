import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';


// ========== 协同指挥 ==========
// 协同事件列表
export const fetchCooperationList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/cooperation/list`,
        params,
      })
      .then((response) => {
        console.log('协同指挥-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('协同指挥-响应符合实际格式');
          return response.map((item) => ({
            taskCooperationCooperationId: item.taskCooperationCooperationId,
            sysCooperationTypeName: item.sysCooperationTypeName,
            taskCooperationTaskContent: item.taskCooperationTaskContent,
            sysDeptDeptName: item.sysDeptDeptName,
            taskCooperationCreateTime: item.taskCooperationCreateTime,
            sysResponseStatusName: item.sysResponseStatusName,
          }));
        }
        throw new Error('真实接口返回无协同指挥数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('协同指挥接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                taskCooperationCooperationId: 'COOP202601001',
                sysCooperationTypeName: '联合处置',
                taskCooperationTaskContent: '交通疏导与设备维修联合行动',
                sysDeptDeptName: '交通管理局',
                taskCooperationCreateTime: new Date().getTime() - 2 * 60 * 60 * 1000,
                sysResponseStatusName: '待响应',
              },
              {
                taskCooperationCooperationId: 'COOP202601002',
                sysCooperationTypeName: '资源调配',
                taskCooperationTaskContent: '应急物资跨区域调配',
                sysDeptDeptName: '物资保障部',
                taskCooperationCreateTime: new Date().getTime() - 3 * 60 * 60 * 1000,
                sysResponseStatusName: '已响应',
              },
              {
                taskCooperationCooperationId: 'COOP202601003',
                sysCooperationTypeName: '信息共享',
                taskCooperationTaskContent: '现场情况实时数据共享',
                sysDeptDeptName: '信息中心',
                taskCooperationCreateTime: new Date().getTime() - 60 * 60 * 1000,
                sysResponseStatusName: '已反馈',
              },
              {
                taskCooperationCooperationId: 'COOP202601004',
                sysCooperationTypeName: '联合处置',
                taskCooperationTaskContent: '消防隐患联合排查',
                sysDeptDeptName: '消防救援支队',
                taskCooperationCreateTime: new Date().getTime() - 4 * 60 * 60 * 1000,
                sysResponseStatusName: '已完成',
              },
              {
                taskCooperationCooperationId: 'COOP202601005',
                sysCooperationTypeName: '资源调配',
                taskCooperationTaskContent: '专业人员紧急增援',
                sysDeptDeptName: '人力资源部',
                taskCooperationCreateTime: new Date().getTime() - 30 * 60 * 1000,
                sysResponseStatusName: '已拒绝',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchCooperationList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 协同详情查询 - 详情弹窗专用
export const fetchCooperationDetail = (cooperationId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/cooperation/detail/${cooperationId}`,
        params,
      })
      .then((response) => {
        if (response && response.taskCooperationCooperationId === cooperationId) {
          return response;
        }
        throw new Error('真实接口返回无协同指挥详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('协同指挥详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              taskCooperationCooperationId: cooperationId,
              sysCooperationTypeName: '联合处置',
              taskCooperationTaskContent: '交通疏导与设备维修联合行动',
              sysDeptDeptName: '交通管理局',
              taskCooperationCreateTime: new Date().getTime() - 2 * 60 * 60 * 1000,
              sysResponseStatusName: '待响应',
              // 详情弹窗展示字段
              initiatingDept: '应急指挥中心',
              cooperationLeader: '王刚',
              cooperationEffect: '',
              completeTime: null,
              // 参与单位
              participatingUnits: [
                { deptName: '交通管理局', contact: '张科长', phone: '138****1234' },
                { deptName: '设备维修部', contact: '李工', phone: '139****5678' },
                { deptName: '安全监察部', contact: '刘主任', phone: '137****9012' },
              ],
              // 任务要求
              taskRequirements: '1. 确保周边交通畅通\n2. 设备维修需在2小时内完成\n3. 现场安全警戒到位\n4. 每小时汇报进度',
              // 反馈结果
              feedbackResults: [],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchCooperationDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 响应协同
export const respondToCooperation = (cooperationId, responseData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: responseData.responseResult === 'accept' ? '协同响应已提交' : '协同已拒绝',
        cooperationId: cooperationId,
        responseTime: new Date().getTime(),
      });
    }, 500);
  });
};

// 反馈协同
export const feedbackCooperation = (cooperationId, feedbackData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '协同反馈已提交',
        cooperationId: cooperationId,
        feedbackTime: new Date().getTime(),
      });
    }, 500);
  });
};

// 协同指挥核心指标（卡片展示）
export const fetchCooperationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/cooperation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCooperationCount &&
          response.responseRate &&
          response.effectStandardCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无协同指挥核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同指挥指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCooperationCount: 42, // 协同事件总数
              responseRate: 85.7, // 响应率
              effectStandardCount: 36, // 配合成效达标数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同指挥指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCooperationCount: 0,
      responseRate: 0,
      effectStandardCount: 0,
    });
  }
};

// 不同协同类型联动数对比（柱状图）
export const fetchCooperationTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/cooperation/stat/type/compare`,
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
        throw new Error('真实接口返回无协同类型对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同类型对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['联合处置', '资源调配', '信息共享', '联合演练', '技术支持'],
              series: [
                { name: '联动数', data: [15, 12, 8, 5, 2] },
              ],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同类型对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [],
    });
  }
};

// 不同参与单位联动数对比（柱状图）
export const fetchCooperationDeptCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/cooperation/stat/dept/compare`,
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
        throw new Error('真实接口返回无参与单位对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '参与单位对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['交通管理局', '消防救援支队', '设备维修部', '信息中心', '物资保障部'],
              series: [
                { name: '联动数', data: [18, 15, 12, 10, 8] },
              ],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 参与单位对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [],
    });
  }
};

// 协同类型占比（饼图）
export const fetchCooperationTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/cooperation/stat/type/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无协同类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同类型占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['联合处置', '资源调配', '信息共享', '联合演练', '技术支持'],
              series: [{
                name: '协同类型占比',
                data: [
                  { name: '联合处置', value: 35 },
                  { name: '资源调配', value: 28 },
                  { name: '信息共享', value: 20 },
                  { name: '联合演练', value: 12 },
                  { name: '技术支持', value: 5 },
                ]
              }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同类型占比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '协同类型占比', data: [] }]
    });
  }
};

// 响应状态占比（饼图）
export const fetchCooperationStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/cooperation/stat/status/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无响应状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '响应状态占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['待响应', '已响应', '已反馈', '已完成', '已拒绝'],
              series: [{
                name: '响应状态占比',
                data: [
                  { name: '待响应', value: 15 },
                  { name: '已响应', value: 25 },
                  { name: '已反馈', value: 30 },
                  { name: '已完成', value: 20 },
                  { name: '已拒绝', value: 10 },
                ]
              }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 响应状态占比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '响应状态占比', data: [] }]
    });
  }
};


// ========== 资源调度 ==========
// 调度路径地图 (资源调度起点/终点、调度路径线标注，匹配指定调度字段)
export const fetchDispatchPathMap = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/emergency/resource/dispatch/map`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item, index) => ({
            taskResourceDispatchDispatchRecordId: item.taskResourceDispatchDispatchRecordId,
            taskEmergencyResourceResourceId: item.taskEmergencyResourceResourceId,
            sysResourceTypeName: item.sysResourceTypeName,
            taskResourceDispatchDispatchQuantity: item.taskResourceDispatchDispatchQuantity,
            tbAssetExtendAddress: item.tbAssetExtendAddress, // 调出/调入位置（接口返回若区分，可拆分为startAddress/endAddress）
            sysDispatchStatusName: item.sysDispatchStatusName,
            taskResourceDispatchEstimatedArrivalTime: item.taskResourceDispatchEstimatedArrivalTime,
            taskResourceDispatchActualArrivalTime: item.taskResourceDispatchActualArrivalTime,
            sysUserUserName: item.sysUserUserName,
            startLongitude: 117.65 + (index * 0.006),
            startLatitude: 24.58 + (index * 0.004),
            endLongitude: 117.65 + (index * 0.006) + 0.003,
            endLatitude: 24.58 + (index * 0.004) + 0.002,
          }));
        }
        throw new Error('真实接口返回无调度路径地图数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('调度路径地图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                taskResourceDispatchDispatchRecordId: 'DIS2026001',
                taskEmergencyResourceResourceId: 'RES001',
                sysResourceTypeName: '救援设备',
                taskResourceDispatchDispatchQuantity: 2,
                tbAssetExtendAddress: '主城区中央停车场应急仓库',
                sysDispatchStatusName: '已到达',
                taskResourceDispatchEstimatedArrivalTime: '2026-02-02 10:30:00',
                taskResourceDispatchActualArrivalTime: '2026-02-02 10:25:00',
                sysUserUserName: '张三',
                startLongitude: 117.6500,
                startLatitude: 24.5800,
                endLongitude: 117.6530,
                endLatitude: 24.5820
              },
              {
                taskResourceDispatchDispatchRecordId: 'DIS2026002',
                taskEmergencyResourceResourceId: 'RES002',
                sysResourceTypeName: '应急物资',
                taskResourceDispatchDispatchQuantity: 50,
                tbAssetExtendAddress: '高新区应急物资储备库',
                sysDispatchStatusName: '调度中',
                taskResourceDispatchEstimatedArrivalTime: '2026-02-02 11:00:00',
                taskResourceDispatchActualArrivalTime: null,
                sysUserUserName: '李四',
                startLongitude: 117.6560,
                startLatitude: 24.5840,
                endLongitude: 117.6590,
                endLatitude: 24.5860
              },
              {
                taskResourceDispatchDispatchRecordId: 'DIS2026003',
                taskEmergencyResourceResourceId: 'RES003',
                sysResourceTypeName: '救援人员',
                taskResourceDispatchDispatchQuantity: 8,
                tbAssetExtendAddress: '经开区消防救援站',
                sysDispatchStatusName: '待调度',
                taskResourceDispatchEstimatedArrivalTime: '2026-02-02 12:00:00',
                taskResourceDispatchActualArrivalTime: null,
                sysUserUserName: '王五',
                startLongitude: 117.6620,
                startLatitude: 24.5880,
                endLongitude: 117.6650,
                endLatitude: 24.5900
              },
              {
                taskResourceDispatchDispatchRecordId: 'DIS2026004',
                taskEmergencyResourceResourceId: 'RES004',
                sysResourceTypeName: '救援设备',
                taskResourceDispatchDispatchQuantity: 1,
                tbAssetExtendAddress: '文旅区应急保障中心',
                sysDispatchStatusName: '已取消',
                taskResourceDispatchEstimatedArrivalTime: '2026-02-02 09:00:00',
                taskResourceDispatchActualArrivalTime: null,
                sysUserUserName: '赵六',
                startLongitude: 117.6680,
                startLatitude: 24.5920,
                endLongitude: 117.6710,
                endLatitude: 24.5940
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDispatchPathMap 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 资源调度列表
export const fetchResourceDispatchList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/dispatch/list`,
        params,
      })
      .then((response) => {
        console.log('资源调度-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('资源调度-响应符合实际格式');
          return response.map((item) => ({
            taskResourceDispatchDispatchRecordId: item.taskResourceDispatchDispatchRecordId,
            taskEmergencyResourceResourceId: item.taskEmergencyResourceResourceId,
            sysResourceTypeName: item.sysResourceTypeName,
            taskResourceDispatchDispatchQuantity: item.taskResourceDispatchDispatchQuantity,
            fromAddress: item.fromAddress || item.tbAssetExtendAddress,
            toAddress: item.toAddress || item.tbAssetExtendAddress,
            sysDispatchStatusName: item.sysDispatchStatusName,
            taskResourceDispatchDispatchTime: item.taskResourceDispatchDispatchTime,
            taskResourceDispatchEstimatedArrivalTime: item.taskResourceDispatchEstimatedArrivalTime,
            taskResourceDispatchActualArrivalTime: item.taskResourceDispatchActualArrivalTime,
            sysUserUserName: item.sysUserUserName,
          }));
        }
        throw new Error('真实接口返回无资源调度数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源调度接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                taskResourceDispatchDispatchRecordId: 'DISP202601001',
                taskEmergencyResourceResourceId: 'RES001',
                sysResourceTypeName: '维修设备',
                taskResourceDispatchDispatchQuantity: 5,
                fromAddress: '高新区仓库',
                toAddress: '创业路128号停车场',
                sysDispatchStatusName: '在途',
                taskResourceDispatchDispatchTime: new Date().getTime() - 2 * 60 * 60 * 1000,
                taskResourceDispatchEstimatedArrivalTime: new Date().getTime() + 60 * 60 * 1000,
                taskResourceDispatchActualArrivalTime: null,
                sysUserUserName: '王强',
              },
              {
                taskResourceDispatchDispatchRecordId: 'DISP202601002',
                taskEmergencyResourceResourceId: 'RES002',
                sysResourceTypeName: '救援车辆',
                taskResourceDispatchDispatchQuantity: 2,
                fromAddress: '主城区基地',
                toAddress: '人民广场东侧停车场',
                sysDispatchStatusName: '已送达',
                taskResourceDispatchDispatchTime: new Date().getTime() - 4 * 60 * 60 * 1000,
                taskResourceDispatchEstimatedArrivalTime: new Date().getTime() - 30 * 60 * 1000,
                taskResourceDispatchActualArrivalTime: new Date().getTime() - 25 * 60 * 1000,
                sysUserUserName: '李娜',
              },
              {
                taskResourceDispatchDispatchRecordId: 'DISP202601003',
                taskEmergencyResourceResourceId: 'RES003',
                sysResourceTypeName: '安全设备',
                taskResourceDispatchDispatchQuantity: 10,
                fromAddress: '经开区仓库',
                toAddress: '工业大道56号停车场',
                sysDispatchStatusName: '异常',
                taskResourceDispatchDispatchTime: new Date().getTime() - 3 * 60 * 60 * 1000,
                taskResourceDispatchEstimatedArrivalTime: new Date().getTime() - 30 * 60 * 1000,
                taskResourceDispatchActualArrivalTime: null,
                sysUserUserName: '张伟',
              },
              {
                taskResourceDispatchDispatchRecordId: 'DISP202601004',
                taskEmergencyResourceResourceId: 'RES004',
                sysResourceTypeName: '交通设施',
                taskResourceDispatchDispatchQuantity: 8,
                fromAddress: '文旅区仓库',
                toAddress: '景区北路32号停车场',
                sysDispatchStatusName: '在途',
                taskResourceDispatchDispatchTime: new Date().getTime() - 60 * 60 * 1000,
                taskResourceDispatchEstimatedArrivalTime: new Date().getTime() + 30 * 60 * 1000,
                taskResourceDispatchActualArrivalTime: null,
                sysUserUserName: '赵敏',
              },
              {
                taskResourceDispatchDispatchRecordId: 'DISP202601005',
                taskEmergencyResourceResourceId: 'RES005',
                sysResourceTypeName: '维修设备',
                taskResourceDispatchDispatchQuantity: 3,
                fromAddress: '龙文区仓库',
                toAddress: '中山路78号停车场',
                sysDispatchStatusName: '已送达',
                taskResourceDispatchDispatchTime: new Date().getTime() - 5 * 60 * 60 * 1000,
                taskResourceDispatchEstimatedArrivalTime: new Date().getTime() - 2 * 60 * 60 * 1000,
                taskResourceDispatchActualArrivalTime: new Date().getTime() - 1.5 * 60 * 60 * 1000,
                sysUserUserName: '陈浩',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchResourceDispatchList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 资源调度详情查询
export const fetchResourceDispatchDetail = (dispatchRecordId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/dispatch/detail/${dispatchRecordId}`,
        params,
      })
      .then((response) => {
        if (response && response.taskResourceDispatchDispatchRecordId === dispatchRecordId) {
          return response;
        }
        throw new Error('真实接口返回无资源调度详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源调度详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              taskResourceDispatchDispatchRecordId: dispatchRecordId,
              taskEmergencyResourceResourceId: 'RES001',
              sysResourceTypeName: '维修设备',
              taskResourceDispatchDispatchQuantity: 5,
              fromAddress: '高新区仓库',
              toAddress: '创业路128号停车场',
              sysDispatchStatusName: '在途',
              taskResourceDispatchDispatchTime: new Date().getTime() - 2 * 60 * 60 * 1000,
              taskResourceDispatchEstimatedArrivalTime: new Date().getTime() + 60 * 60 * 1000,
              taskResourceDispatchActualArrivalTime: null,
              sysUserUserName: '王强',
              // 弹窗展示字段
              resourceDetails: [
                { name: '电动扳手', model: 'DB-2025', quantity: 2, status: '正常' },
                { name: '安全警示牌', model: 'AJ-2025', quantity: 5, status: '正常' },
                { name: '应急照明灯', model: 'ZM-2025', quantity: 3, status: '正常' },
              ],
              dispatchInstruction: '请优先将维修设备送达现场，配合现场维修人员进行设备检修工作。注意运输过程中避免颠簸。',
              // 调度轨迹
              dispatchTrack: [
                { time: new Date().getTime() - 120, location: '高新区仓库', action: '装车完成' },
                { time: new Date().getTime() - 90, location: '创业路路口', action: '运输中' },
                { time: new Date().getTime() - 60, location: '创业路中段', action: '运输中' },
                { time: new Date().getTime() - 30, location: '目的地附近', action: '即将到达' },
              ],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchResourceDispatchDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 确认调度接收
export const confirmResourceDispatch = (dispatchRecordId, confirmData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '调度接收确认成功',
        confirmTime: new Date().getTime(),
        confirmData: confirmData,
      });
    }, 500);
  });
};

// 调度反馈
export const feedbackResourceDispatch = (dispatchRecordId, feedbackData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '调度反馈提交成功',
        feedbackTime: new Date().getTime(),
        feedbackData: feedbackData,
      });
    }, 500);
  });
};

// 资源调度核心指标（卡片展示）
export const fetchResourceDispatchIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/dispatch/indicators`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.transitingCount !== undefined &&
          response.deliveredCount !== undefined &&
          response.abnormalCount !== undefined
        ) {
          return response;
        }
        throw new Error('真实接口返回无资源调度核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源调度指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              transitingCount: 8, // 在途资源数
              deliveredCount: 12, // 已送达资源数
              abnormalCount: 2, // 异常资源数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 资源调度指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      transitingCount: 0,
      deliveredCount: 0,
      abnormalCount: 0,
    });
  }
};

// 不同资源类型调度量对比（柱状图）
export const fetchResourceDispatchTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/dispatch/stat/type/compare`,
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
        throw new Error('真实接口返回无资源类型调度对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源类型调度对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['维修设备', '救援车辆', '安全设备', '交通设施', '消防器材'],
              series: [
                { name: '已调度数量', data: [45, 32, 28, 36, 24] },
                { name: '在途数量', data: [12, 8, 6, 10, 5] },
              ],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 资源类型调度对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [],
    });
  }
};


// ========== 专项应急视图 ==========
// 专项应急视图地图 (疏散通道、拥堵范围、故障设备分布标注)
export const fetchSpecialEmergencyViewMap = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/emergency/special/view/map`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          // ✅ 核心修复：给真实接口返回的数据，补全 经度(longitude) + 纬度(latitude) 字段
          return response.map((item, index) => ({
            specialEmergencyId: item.specialEmergencyId,
            emergencyScene: item.emergencyScene,
            evacuationRoute: item.evacuationRoute,
            address: item.address,
            trappedVehicleCount: item.trappedVehicleCount,
            evacuationProgress: item.evacuationProgress,
            repairProgress: item.repairProgress,
            longitude: 117.65 + (index * 0.003),
            latitude: 24.58 + (index * 0.002)
          }));
        }
        throw new Error('真实接口返回无专项应急视图地图数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('专项应急视图地图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                specialEmergencyId: 'SPE2026001',
                emergencyScene: '停车场应急疏散',
                evacuationRoute: '主通道-西侧疏散走廊-北门安全出口',
                address: '主城区中央停车场地下一层',
                trappedVehicleCount: 12,
                evacuationProgress: 92,
                repairProgress: 0,
                longitude: 117.6500,
                latitude: 24.5800
              },
              {
                specialEmergencyId: 'SPE2026002',
                emergencyScene: '车辆拥堵应急',
                evacuationRoute: '南入口疏导通道-临时绕行路线',
                address: '高新区商业广场停车场主干道',
                trappedVehicleCount: 38,
                evacuationProgress: 75,
                repairProgress: 0,
                longitude: 117.6530,
                latitude: 24.5820
              },
              {
                specialEmergencyId: 'SPE2026003',
                emergencyScene: '设备故障应急抢修',
                evacuationRoute: '故障区域隔离通道',
                address: '经开区物流园车场充电桩区域',
                trappedVehicleCount: 7,
                evacuationProgress: 100,
                repairProgress: 68,
                longitude: 117.6560,
                latitude: 24.5840
              },
              {
                specialEmergencyId: 'SPE2026004',
                emergencyScene: '停车场应急疏散',
                evacuationRoute: '东侧消防通道-南门安全出口',
                address: '文旅区生态停车场露天区域',
                trappedVehicleCount: 9,
                evacuationProgress: 86,
                repairProgress: 0,
                longitude: 117.6590,
                latitude: 24.5860
              },
              {
                specialEmergencyId: 'SPE2026005',
                emergencyScene: '设备故障应急抢修',
                evacuationRoute: '道闸故障应急通道',
                address: '周边区县便民停车场出入口',
                trappedVehicleCount: 5,
                evacuationProgress: 100,
                repairProgress: 95,
                longitude: 117.6620,
                latitude: 24.5880
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSpecialEmergencyViewMap 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 专项应急列表
export const fetchSpecialEmergencyList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/emergency/list`,
        params,
      })
      .then((response) => {
        console.log('专项应急-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('专项应急-响应符合实际格式');
          return response.map((item) => ({
            taskSpecialEmergencySpecialEmergencyId: item.taskSpecialEmergencySpecialEmergencyId,
            sysEmergencyScenarioName: item.sysEmergencyScenarioName,
            taskSpecialEmergencyTrappedVehicleCount: item.taskSpecialEmergencyTrappedVehicleCount,
            taskSpecialEmergencyEvacuationRoute: item.taskSpecialEmergencyEvacuationRoute,
            tbAssetExtendAddress: item.tbAssetExtendAddress,
            sysDisposalProgressName: item.sysDisposalProgressName,
          }));
        }
        throw new Error('真实接口返回无专项应急数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('专项应急接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                taskSpecialEmergencySpecialEmergencyId: 'SE202601001',
                sysEmergencyScenarioName: '地下停车场火灾',
                taskSpecialEmergencyTrappedVehicleCount: 12,
                taskSpecialEmergencyEvacuationRoute: 'A区1号通道、B区2号通道',
                tbAssetExtendAddress: '高新区创业路128号地下二层',
                sysDisposalProgressName: '处置中',
              },
              {
                taskSpecialEmergencySpecialEmergencyId: 'SE202601002',
                sysEmergencyScenarioName: '特大暴雨积水',
                taskSpecialEmergencyTrappedVehicleCount: 8,
                taskSpecialEmergencyEvacuationRoute: '主出入口、应急出口',
                tbAssetExtendAddress: '主城区人民广场东侧停车场',
                sysDisposalProgressName: '已处置',
              },
              {
                taskSpecialEmergencySpecialEmergencyId: 'SE202601003',
                sysEmergencyScenarioName: '电梯故障困人',
                taskSpecialEmergencyTrappedVehicleCount: 3,
                taskSpecialEmergencyEvacuationRoute: '消防通道、备用电梯',
                tbAssetExtendAddress: '经开区工业大道56号停车楼',
                sysDisposalProgressName: '待处置',
              },
              {
                taskSpecialEmergencySpecialEmergencyId: 'SE202601004',
                sysEmergencyScenarioName: '电力系统瘫痪',
                taskSpecialEmergencyTrappedVehicleCount: 15,
                taskSpecialEmergencyEvacuationRoute: '应急照明指示路线',
                tbAssetExtendAddress: '文旅区景区北路32号停车场',
                sysDisposalProgressName: '处置中',
              },
              {
                taskSpecialEmergencySpecialEmergencyId: 'SE202601005',
                sysEmergencyScenarioName: '结构安全隐患',
                taskSpecialEmergencyTrappedVehicleCount: 6,
                taskSpecialEmergencyEvacuationRoute: '安全疏散通道',
                tbAssetExtendAddress: '龙文区中山路78号停车楼',
                sysDisposalProgressName: '已评估',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSpecialEmergencyList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 专项应急详情查询 - 详情弹窗专用
export const fetchSpecialEmergencyDetail = (specialEmergencyId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/emergency/detail/${specialEmergencyId}`,
        params,
      })
      .then((response) => {
        if (response && response.taskSpecialEmergencySpecialEmergencyId === specialEmergencyId) {
          return response;
        }
        throw new Error('真实接口返回无专项应急详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('专项应急详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              taskSpecialEmergencySpecialEmergencyId: specialEmergencyId,
              sysEmergencyScenarioName: '地下停车场火灾',
              taskSpecialEmergencyTrappedVehicleCount: 12,
              taskSpecialEmergencyEvacuationRoute: 'A区1号通道、B区2号通道',
              tbAssetExtendAddress: '高新区创业路128号地下二层',
              sysDisposalProgressName: '处置中',
              // 弹窗展示字段
              taskSpecialEmergencyEvacuationProgress: 65,
              parkFaultRepairProgress: 40,
              sysUserUserName: '李强',
              taskSpecialEmergencyExpectedFinishTime: new Date().getTime() + 2 * 60 * 60 * 1000,
              // 详情信息
              disposalPlan: '1.立即启动火灾应急预案；2.疏散周边车辆和人员；3.调派消防力量灭火；4.检查结构安全',
              evacuationRoute: [
                { name: 'A区1号通道', status: '通畅', distance: '200米' },
                { name: 'B区2号通道', status: '部分堵塞', distance: '150米' },
                { name: '紧急出口', status: '通畅', distance: '100米' },
              ],
              safetyExitDistribution: [
                { name: '东侧安全出口', location: 'A区东侧', capacity: '50人' },
                { name: '西侧安全出口', location: 'B区西侧', capacity: '30人' },
                { name: '北侧紧急出口', location: 'C区北侧', capacity: '20人' },
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSpecialEmergencyDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 更新处置进度
export const updateDisposalProgress = (specialEmergencyId, progressData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '处置进度已更新',
        updateTime: new Date().getTime(),
        progress: progressData.progress,
        remark: progressData.remark
      });
    }, 500);
  });
};

// 保存处置评估
export const saveDisposalAssessment = (specialEmergencyId, assessmentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '处置评估已保存',
        saveTime: new Date().getTime(),
        assessment: assessmentData.assessment,
        reportUrl: assessmentData.reportUrl
      });
    }, 500);
  });
};

// 专项应急视图-核心指标卡片 (受困车辆数、已疏散车辆数、已修复设备数)
export const fetchSpecialEmergencyIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/emergency/special/view/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          typeof response.trappedVehicleTotal === 'number' &&
          typeof response.evacuatedVehicleCount === 'number' &&
          typeof response.repairedDeviceCount === 'number'
        ) {
          return response;
        }
        throw new Error('真实接口返回无专项应急视图核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '专项应急视图核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              trappedVehicleTotal: 66,    // 受困车辆总数
              evacuatedVehicleCount: 152, // 已疏散车辆数
              repairedDeviceCount: 47     // 已修复设备数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 专项应急视图核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      trappedVehicleTotal: 0,
      evacuatedVehicleCount: 0,
      repairedDeviceCount: 0,
    });
  }
};

// 专项应急视图-处置进度时间趋势 折线图
export const fetchSpecialEmergencyDisposalTrend = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/emergency/special/view/stat/trend`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '专项应急处置进度时间趋势折线图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: [
            '01日', '02日', '03日', '04日', '05日', '06日', '07日',
            '08日', '09日', '10日', '11日', '12日', '13日', '14日', '15日'
          ],
          series: [
            {
              name: '当日疏散车辆数(辆)',
              data: [12, 18, 9, 25, 16, 22, 14, 8, 20, 17, 29, 15, 11, 23, 19],
            },
            {
              name: '当日修复设备数(台)',
              data: [3, 5, 2, 7, 4, 6, 3, 1, 5, 4, 8, 2, 3, 6, 4],
            },
          ],
        };
      });
  } catch (error) {
    console.error('fetchSpecialEmergencyDisposalTrend 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};


// ========== 资源分布 ==========
// 资源分布地图 (应急资源位置标注，按类型区分图标)
export const fetchEmergencyResourceDistributionMap = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/emergency/resource/distribution/map`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            resource_id: item.resource_id,
            resource_type: item.resource_type,
            address: item.address,
            longitude: item.longitude,
            latitude: item.latitude,
            resource_status: item.resource_status,
            belong_department: item.belong_department,
            emergencyEventDistance: item.emergencyEventDistance
          }));
        }
        throw new Error('真实接口返回无资源分布地图数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源分布地图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                resource_id: 'RES2026001',
                resource_type: '消防器材',
                address: '主城区中央停车场消防栓点位',
                longitude: 117.6515,
                latitude: 24.5828,
                resource_status: '正常可用',
                belong_department: '消防安保部',
                emergencyEventDistance: 0.2
              },
              {
                resource_id: 'RES2026002',
                resource_type: '抢修车辆',
                address: '高新区商业广场停车场入口处',
                longitude: 117.6625,
                latitude: 24.5786,
                resource_status: '调度中',
                belong_department: '工程维修部',
                emergencyEventDistance: 0.5
              },
              {
                resource_id: 'RES2026003',
                resource_type: '备用设备',
                address: '经开区物流园车场设备库房',
                longitude: 117.6459,
                latitude: 24.5914,
                resource_status: '闲置',
                belong_department: '设施保障部',
                emergencyEventDistance: 0.3
              },
              {
                resource_id: 'RES2026004',
                resource_type: '救援队伍',
                address: '文旅区生态停车场管理处',
                longitude: 117.6734,
                latitude: 24.5756,
                resource_status: '出勤中',
                belong_department: '应急指挥中心',
                emergencyEventDistance: 0.8
              },
              {
                resource_id: 'RES2026005',
                resource_type: '维修工具',
                address: '周边区县便民停车场维修间',
                longitude: 117.6382,
                latitude: 24.6025,
                resource_status: '正常可用',
                belong_department: '运维巡检部',
                emergencyEventDistance: 0.4
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchEmergencyResourceDistributionMap 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 资源分布列表
export const fetchResourceDistributionList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/resource/list`,
        params,
      })
      .then((response) => {
        console.log('资源分布-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('资源分布-响应符合实际格式');
          return response.map((item) => ({
            taskEmergencyResourceResourceId: item.taskEmergencyResourceResourceId,
            sysResourceTypeName: item.sysResourceTypeName,
            taskEmergencyResourceResourceName: item.taskEmergencyResourceResourceName,
            tbAssetExtendAddress: item.tbAssetExtendAddress,
            sysResourceStatusName: item.sysResourceStatusName,
            sysDeptDeptName: item.sysDeptDeptName,
          }));
        }
        throw new Error('真实接口返回无资源分布数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源分布接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                taskEmergencyResourceResourceId: 'RES001',
                sysResourceTypeName: '救援车辆',
                taskEmergencyResourceResourceName: '大型救援车',
                tbAssetExtendAddress: '高新区应急物资仓库A区',
                sysResourceStatusName: '待命',
                sysDeptDeptName: '应急救援部',
              },
              {
                taskEmergencyResourceResourceId: 'RES002',
                sysResourceTypeName: '医疗设备',
                taskEmergencyResourceResourceName: '便携式除颤仪',
                tbAssetExtendAddress: '主城区医疗中心3楼',
                sysResourceStatusName: '使用中',
                sysDeptDeptName: '医疗救护部',
              },
              {
                taskEmergencyResourceResourceId: 'RES003',
                sysResourceTypeName: '通讯设备',
                taskEmergencyResourceResourceName: '卫星电话',
                tbAssetExtendAddress: '经开区指挥中心',
                sysResourceStatusName: '待命',
                sysDeptDeptName: '通信保障部',
              },
              {
                taskEmergencyResourceResourceId: 'RES004',
                sysResourceTypeName: '救援设备',
                taskEmergencyResourceResourceName: '液压破拆工具组',
                tbAssetExtendAddress: '文旅区救援站',
                sysResourceStatusName: '维修中',
                sysDeptDeptName: '消防救援部',
              },
              {
                taskEmergencyResourceResourceId: 'RES005',
                sysResourceTypeName: '运输工具',
                taskEmergencyResourceResourceName: '应急运输车',
                tbAssetExtendAddress: '龙文区物资仓库B区',
                sysResourceStatusName: '调度中',
                sysDeptDeptName: '后勤保障部',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchResourceDistributionList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 资源详情查询 - 详情弹窗专用
export const fetchResourceDetail = (resourceId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/resource/detail/${resourceId}`,
        params,
      })
      .then((response) => {
        if (response && response.taskEmergencyResourceResourceId === resourceId) {
          return response;
        }
        throw new Error('真实接口返回无资源详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              taskEmergencyResourceResourceId: resourceId,
              sysResourceTypeName: '救援车辆',
              taskEmergencyResourceResourceName: '大型救援车',
              tbAssetExtendAddress: '高新区应急物资仓库A区',
              sysResourceStatusName: '待命',
              sysDeptDeptName: '应急救援部',
              // 详情弹窗展示字段
              taskEmergencyResourceQuantity: 5,
              sysUserUserName: '王强',
              sysUserUserPhone: '139****1234',
              distanceToTarget: '3.5公里',
              // 资源详情
              resourceDetail: {
                manufacturer: '应急设备制造公司',
                purchaseDate: new Date().getTime() - 365 * 24 * 60 * 60 * 1000,
                warrantyPeriod: '3年',
                specifications: '载重10吨，配备起重设备',
                maintenanceRecord: '最近一次保养：2026-01-15',
              },
              // 库存明细
              inventoryDetails: [
                { itemId: 'ITEM001', itemName: '液压千斤顶', quantity: 2, status: '完好' },
                { itemId: 'ITEM002', itemName: '救援绳索', quantity: 10, status: '完好' },
                { itemId: 'ITEM003', itemName: '应急电源', quantity: 3, status: '需检修' },
                { itemId: 'ITEM004', itemName: '医疗箱', quantity: 5, status: '完好' },
              ],
              // 使用记录
              usageRecords: [
                { time: new Date().getTime() - 30 * 24 * 60 * 60 * 1000, eventId: 'EM202612001', duration: '2天', operator: '张明' },
                { time: new Date().getTime() - 60 * 24 * 60 * 60 * 1000, eventId: 'EM202611002', duration: '1天', operator: '李华' },
                { time: new Date().getTime() - 90 * 24 * 60 * 60 * 1000, eventId: 'EM202610003', duration: '3天', operator: '刘伟' },
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchResourceDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 调度资源
export const dispatchResource = (resourceId, dispatchData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '资源调度指令已下发',
        dispatchId: `DISP${Date.now()}`,
        dispatchTime: new Date().getTime(),
        estimatedArrivalTime: dispatchData.estimatedArrivalTime,
        resourceStatus: '调度中'
      });
    }, 500);
  });
};

// 联系资源负责人
export const contactResourcePerson = (resourceId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '已触发联系资源负责人',
        contactInfo: {
          name: '王强',
          phone: '139****1234',
          position: '资源管理员'
        }
      });
    }, 300);
  });
};

// 资源分布核心指标（卡片展示）
export const fetchResourceDistributionIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/resource/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.standbyCount &&
          response.inUseCount &&
          response.underMaintenanceCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无资源分布核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源分布指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              standbyCount: 42, // 待命资源数
              inUseCount: 18, // 使用中资源数
              underMaintenanceCount: 5, // 维修中资源数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 资源分布指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      standbyCount: 0,
      inUseCount: 0,
      underMaintenanceCount: 0,
    });
  }
};

// 资源分布-不同类型资源数量对比 柱状图
export const fetchEmergencyResourceTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/emergency/resource/stat/type/compare`,
        params,
      })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '不同类型资源数量对比柱状图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: ['消防器材', '抢修车辆', '备用设备', '救援队伍', '维修工具', '医疗物资'],
          series: [
            { name: '资源数量(个/支/套)', data: [38, 16, 24, 9, 42, 12] }
          ],
        };
      });
  } catch (error) {
    console.error('fetchEmergencyResourceTypeCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 资源分布-不同部门资源数量对比 柱状图
export const fetchEmergencyResourceDeptCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/emergency/resource/stat/dept/compare`,
        params,
      })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '不同部门资源数量对比柱状图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: ['消防安保部', '工程维修部', '设施保障部', '应急指挥中心', '运维巡检部', '后勤补给部'],
          series: [
            { name: '资源数量(个/支/套)', data: [29, 35, 18, 12, 26, 9] }
          ],
        };
      });
  } catch (error) {
    console.error('fetchEmergencyResourceDeptCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 资源分布-资源状态占比 饼图
export const fetchEmergencyResourceStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/emergency/resource/stat/status/ratio`,
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
        throw new Error('真实接口返回无资源状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['正常可用', '调度中', '闲置待命', '故障待修', '已耗尽'],
              series: [{ name: '应急资源状态占比', data: [52, 18, 20, 7, 3] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 资源状态占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '应急资源状态占比', data: [] }],
    });
  }
};


// ======================== 应急态势 ========================
// 应急态势地图 (应急事件位置标注、影响范围缓冲区)
export const fetchEmergencySituationMap = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/emergency/situation/map`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            emergencyId: item.emergencyId,
            emergencyLevel: item.emergencyLevel,
            emergencyType: item.emergencyType,
            address: item.address,
            longitude: item.longitude,
            latitude: item.latitude,
            influenceRange: item.influenceRange,
            affectedVehicleCount: item.affectedVehicleCount,
            rescueProgress: item.rescueProgress
          }));
        }
        throw new Error('真实接口返回无应急态势地图数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('应急态势地图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                emergencyId: 'EMG20261001',
                emergencyLevel: '二级',
                emergencyType: '车辆拥堵',
                address: '主城区中央停车场东门主干道',
                longitude: 117.6512,
                latitude: 24.5825,
                influenceRange: 80,
                affectedVehicleCount: 56,
                rescueProgress: 65
              },
              {
                emergencyId: 'EMG20261002',
                emergencyLevel: '三级',
                emergencyType: '设备大规模故障',
                address: '高新区商业广场地下停车场负二层',
                longitude: 117.6628,
                latitude: 24.5783,
                influenceRange: 60,
                affectedVehicleCount: 23,
                rescueProgress: 42
              },
              {
                emergencyId: 'EMG20261003',
                emergencyLevel: '一级',
                emergencyType: '停车场火灾',
                address: '经开区物流园车场仓储区',
                longitude: 117.6456,
                latitude: 24.5917,
                influenceRange: 120,
                affectedVehicleCount: 18,
                rescueProgress: 88
              },
              {
                emergencyId: 'EMG20261004',
                emergencyLevel: '四级',
                emergencyType: '极端天气影响',
                address: '文旅区生态停车场露天停车区',
                longitude: 117.6731,
                latitude: 24.5759,
                influenceRange: 95,
                affectedVehicleCount: 32,
                rescueProgress: 27
              },
              {
                emergencyId: 'EMG20261005',
                emergencyLevel: '三级',
                emergencyType: '突发管制',
                address: '周边区县便民停车场出入口',
                longitude: 117.6385,
                latitude: 24.6022,
                influenceRange: 50,
                affectedVehicleCount: 41,
                rescueProgress: 59
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchEmergencySituationMap 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 应急态势列表
export const fetchEmergencySituationList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/situation/list`,
        params,
      })
      .then((response) => {
        console.log('应急态势-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('应急态势-响应符合实际格式');
          return response.map((item) => ({
            taskEmergencyEmergencyId: item.taskEmergencyEmergencyId,
            sysEmergencyLevelName: item.sysEmergencyLevelName,
            sysEmergencyTypeName: item.sysEmergencyTypeName,
            taskEmergencyEmergencyTime: item.taskEmergencyEmergencyTime,
            tbAssetExtendAddress: item.tbAssetExtendAddress,
            taskEmergencyAffectedVehicleCount: item.taskEmergencyAffectedVehicleCount,
            sysRescueProgressName: item.sysRescueProgressName,
          }));
        }
        throw new Error('真实接口返回无应急态势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('应急态势接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                taskEmergencyEmergencyId: 'EM202601101',
                sysEmergencyLevelName: '一级',
                sysEmergencyTypeName: '车辆事故',
                taskEmergencyEmergencyTime: new Date().getTime() - 2 * 60 * 60 * 1000,
                tbAssetExtendAddress: '高新区创业路128号北区停车场',
                taskEmergencyAffectedVehicleCount: 15,
                sysRescueProgressName: '处置中',
              },
              {
                taskEmergencyEmergencyId: 'EM202601102',
                sysEmergencyLevelName: '二级',
                sysEmergencyTypeName: '设备故障',
                taskEmergencyEmergencyTime: new Date().getTime() - 3 * 60 * 60 * 1000,
                tbAssetExtendAddress: '主城区人民广场东侧南区停车场',
                taskEmergencyAffectedVehicleCount: 8,
                sysRescueProgressName: '已调度',
              },
              {
                taskEmergencyEmergencyId: 'EM202601103',
                sysEmergencyLevelName: '三级',
                sysEmergencyTypeName: '交通拥堵',
                taskEmergencyEmergencyTime: new Date().getTime() - 60 * 60 * 1000,
                tbAssetExtendAddress: '经开区工业大道56号东区停车场',
                taskEmergencyAffectedVehicleCount: 20,
                sysRescueProgressName: '待响应',
              },
              {
                taskEmergencyEmergencyId: 'EM202601104',
                sysEmergencyLevelName: '二级',
                sysEmergencyTypeName: '消防隐患',
                taskEmergencyEmergencyTime: new Date().getTime() - 4 * 60 * 60 * 1000,
                tbAssetExtendAddress: '文旅区景区北路32号西区停车场',
                taskEmergencyAffectedVehicleCount: 12,
                sysRescueProgressName: '处置中',
              },
              {
                taskEmergencyEmergencyId: 'EM202601105',
                sysEmergencyLevelName: '一级',
                sysEmergencyTypeName: '人员求助',
                taskEmergencyEmergencyTime: new Date().getTime() - 30 * 60 * 1000,
                tbAssetExtendAddress: '龙文区中山路78号中区停车场',
                taskEmergencyAffectedVehicleCount: 6,
                sysRescueProgressName: '已处置',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchEmergencySituationList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 应急态势详情查询 - 详情弹窗专用
export const fetchEmergencySituationDetail = (emergencyId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/situation/detail/${emergencyId}`,
        params,
      })
      .then((response) => {
        if (response && response.taskEmergencyEmergencyId === emergencyId) {
          return response;
        }
        throw new Error('真实接口返回无应急态势详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('应急态势详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              taskEmergencyEmergencyId: emergencyId,
              sysEmergencyLevelName: '一级',
              sysEmergencyTypeName: '车辆事故',
              taskEmergencyEmergencyTime: new Date().getTime() - 2 * 60 * 60 * 1000,
              tbAssetExtendAddress: '高新区创业路128号北区停车场',
              taskEmergencyAffectedVehicleCount: 15,
              sysRescueProgressName: '处置中',
              // 弹窗展示字段
              tbAssetExtendName: '北区停车场入口道闸',
              taskEmergencyInfluenceRange: '停车场入口区域及周边50米道路',
              taskEmergencyResponseTime: new Date().getTime() - 110 * 60 * 1000, // 响应时间
              sysMaintainUserTeamName: '应急抢险一队',
              // 事件详情
              eventDetail: {
                description: '入口道闸故障导致车辆无法进出，造成入口拥堵',
                cause: '道闸控制系统故障',
                severity: '严重影响车辆通行',
                impactTime: '已持续2小时',
              },
              // 现场图片
              scenePhotos: [
                'https://example.com/emergency1.jpg',
                'https://example.com/emergency2.jpg',
                'https://example.com/emergency3.jpg'
              ],
              // 影响范围分析
              influenceAnalysis: {
                affectedParkingCount: 3,
                affectedVehicleCount: 15,
                estimatedLoss: '约2万元',
                trafficImpact: '入口道路拥堵约500米',
                expectedRecoveryTime: '1小时内',
              },
              // 调度信息
              dispatchInfo: {
                dispatchedResources: [
                  { type: '维修人员', count: 3, status: '已到达' },
                  { type: '疏导人员', count: 5, status: '已到达' },
                  { type: '应急车辆', count: 2, status: '途中' },
                ],
                cooperatingUnits: ['交警支队', '消防救援大队', '医疗急救中心'],
                coordinationMeasures: '已启动三级联动响应机制',
              },
              // 救援进度
              rescueProgress: {
                currentStage: '现场处置',
                progressPercentage: 65,
                completedTasks: [
                  '现场警戒设置',
                  '人员疏散',
                  '故障初步诊断'
                ],
                pendingTasks: [
                  '道闸修复',
                  '交通恢复',
                  '现场清理'
                ],
                nextStep: '更换故障部件',
              }
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchEmergencySituationDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 发起资源调度
export const dispatchEmergencyResource = (emergencyId, dispatchData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '资源调度请求已成功发起',
        dispatchId: `DISP${Date.now()}`,
        dispatchTime: new Date().getTime(),
        data: {
          emergencyId,
          ...dispatchData,
          cooperatingUnitsNotified: ['交警支队', '消防救援大队'],
          estimatedArrivalTime: new Date().getTime() + 30 * 60 * 1000,
        }
      });
    }, 500);
  });
};

// 应急态势-核心指标卡片 (应急事件总数、各等级应急数、受影响车辆数)
export const fetchEmergencySituationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/emergency/situation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          typeof response.totalEmergencyCount === 'number' &&
          response.levelEmergencyCount &&
          typeof response.affectedVehicleTotal === 'number'
        ) {
          return response;
        }
        throw new Error('真实接口返回无应急态势核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '应急态势核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalEmergencyCount: 23, // 应急事件总数
              levelEmergencyCount: {    // 各等级应急数
                level1: 3,
                level2: 5,
                level3: 9,
                level4: 6
              },
              affectedVehicleTotal: 216 // 受影响车辆总数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 应急态势核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalEmergencyCount: 0,
      levelEmergencyCount: { level1:0, level2:0, level3:0, level4:0 },
      affectedVehicleTotal: 0
    });
  }
};

// 应急态势-应急类型占比 饼图
export const fetchEmergencyTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/emergency/situation/stat/type/ratio`,
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
        throw new Error('真实接口返回无应急类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '应急类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['车辆拥堵', '设备大规模故障', '停车场火灾', '极端天气影响', '突发管制', '其他险情'],
              series: [{ name: '应急事件类型占比', data: [35, 22, 8, 15, 12, 8] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 应急类型占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '应急事件类型占比', data: [] }],
    });
  }
};

// 应急态势-应急等级占比 饼图
export const fetchEmergencyLevelRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/emergency/situation/stat/level/ratio`,
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
        throw new Error('真实接口返回无应急等级占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '应急等级占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['一级应急', '二级应急', '三级应急', '四级应急'],
              series: [{ name: '应急事件等级占比', data: [13, 26, 41, 20] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 应急等级占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '应急事件等级占比', data: [] }],
    });
  }
};


// ========== 现场态势 ==========
// 现场态势列表
export const fetchSceneSituationList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/scene/list`,
        params,
      })
      .then((response) => {
        console.log('现场态势-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('现场态势-响应符合实际格式');
          return response.map((item) => ({
            taskEmergencyEmergencyId: item.taskEmergencyEmergencyId,
            tbAssetExtendAddress: item.tbAssetExtendAddress,
            taskEmergencySceneSceneStatus: item.taskEmergencySceneSceneStatus,
            taskEmergencySceneAffectedBerthCount: item.taskEmergencySceneAffectedBerthCount,
            taskEmergencySceneEvacuatedVehicleCount: item.taskEmergencySceneEvacuatedVehicleCount,
            taskEmergencySceneRepairBerthCount: item.taskEmergencySceneRepairBerthCount,
          }));
        }
        throw new Error('真实接口返回无现场态势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('现场态势接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                taskEmergencyEmergencyId: 'EM202601001',
                tbAssetExtendAddress: '高新区创业路128号',
                taskEmergencySceneSceneStatus: '处置中',
                taskEmergencySceneAffectedBerthCount: 15,
                taskEmergencySceneEvacuatedVehicleCount: 8,
                taskEmergencySceneRepairBerthCount: 5,
              },
              {
                taskEmergencyEmergencyId: 'EM202601002',
                tbAssetExtendAddress: '主城区人民广场东侧',
                taskEmergencySceneSceneStatus: '已处置',
                taskEmergencySceneAffectedBerthCount: 8,
                taskEmergencySceneEvacuatedVehicleCount: 8,
                taskEmergencySceneRepairBerthCount: 8,
              },
              {
                taskEmergencyEmergencyId: 'EM202601003',
                tbAssetExtendAddress: '经开区工业大道56号',
                taskEmergencySceneSceneStatus: '待处置',
                taskEmergencySceneAffectedBerthCount: 20,
                taskEmergencySceneEvacuatedVehicleCount: 5,
                taskEmergencySceneRepairBerthCount: 0,
              },
              {
                taskEmergencyEmergencyId: 'EM202601004',
                tbAssetExtendAddress: '文旅区景区北路32号',
                taskEmergencySceneSceneStatus: '处置中',
                taskEmergencySceneAffectedBerthCount: 12,
                taskEmergencySceneEvacuatedVehicleCount: 9,
                taskEmergencySceneRepairBerthCount: 8,
              },
              {
                taskEmergencyEmergencyId: 'EM202601005',
                tbAssetExtendAddress: '龙文区中山路78号',
                taskEmergencySceneSceneStatus: '已处置',
                taskEmergencySceneAffectedBerthCount: 6,
                taskEmergencySceneEvacuatedVehicleCount: 6,
                taskEmergencySceneRepairBerthCount: 6,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSceneSituationList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 现场态势详情查询 - 详情弹窗专用
export const fetchSceneSituationDetail = (emergencyId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/scene/detail/${emergencyId}`,
        params,
      })
      .then((response) => {
        if (response && response.taskEmergencyEmergencyId === emergencyId) {
          return response;
        }
        throw new Error('真实接口返回无现场态势详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('现场态势详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              taskEmergencyEmergencyId: emergencyId,
              tbAssetExtendAddress: '高新区创业路128号',
              taskEmergencySceneSceneStatus: '处置中',
              taskEmergencySceneAffectedBerthCount: 15,
              taskEmergencySceneEvacuatedVehicleCount: 8,
              taskEmergencySceneRepairBerthCount: 5,
              // 弹窗展示字段
              sysUserUserName: '张伟',
              sysUserUserPhone: '138****5678',
              taskEmergencySceneScenePhotos: [
                'https://example.com/photo1.jpg',
                'https://example.com/photo2.jpg',
                'https://example.com/photo3.jpg'
              ],
              taskEmergencySceneDisposalSuggestion: '建议立即疏散周边车辆，设置警示标志，安排维修人员进行紧急修复。',
              // 现场完整态势
              sceneOverview: {
                affectedRange: '周边200米',
                startTime: new Date().getTime() - 2 * 60 * 60 * 1000,
                emergencyLevel: '中等',
                weatherCondition: '晴',
                temperature: '25°C',
                windSpeed: '3级',
              },
              // 实时数据
              realtimeData: {
                currentEvacuatedCount: 8,
                currentRepairCount: 5,
                remainingAffectedCount: 7,
                evacuationProgress: 57,
                repairProgress: 33,
                currentPersonnelCount: 12,
              },
              // 处置进展
              disposalProgress: [
                { time: new Date().getTime() - 120, action: '应急小组到达现场', status: '已完成' },
                { time: new Date().getTime() - 90, action: '开始疏散车辆', status: '进行中' },
                { time: new Date().getTime() - 60, action: '开始修复泊位', status: '进行中' },
                { time: new Date().getTime() - 30, action: '完成现场评估', status: '已完成' },
                { time: new Date().getTime() - 15, action: '协调周边资源', status: '进行中' },
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSceneSituationDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 联系现场负责人
export const contactScenePerson = (emergencyId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '已触发联系现场负责人',
        contactInfo: {
          name: '张伟',
          phone: '138****5678',
          position: '现场负责人'
        }
      });
    }, 300);
  });
};

// 下发处置指令
export const submitDisposalInstruction = (emergencyId, instruction) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '处置指令已下发，系统消息已发送给接收人',
        instructionId: `INST${Date.now()}`,
        sendTime: new Date().getTime()
      });
    }, 500);
  });
};

// 现场态势核心指标（卡片展示）
export const fetchSceneSituationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/scene/situation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.evacuatedVehicleCount &&
          response.repairBerthCount &&
          response.affectedRange
        ) {
          return response;
        }
        throw new Error('真实接口返回无现场态势核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '现场态势指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              evacuatedVehicleCount: 150, // 已疏导车辆数
              repairBerthCount: 85, // 已修复泊位数
              affectedRange: '3个区域', // 受影响范围
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 现场态势指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      evacuatedVehicleCount: 0,
      repairBerthCount: 0,
      affectedRange: '',
    });
  }
};

// 现场处置成效对比（柱状图）
export const fetchSceneDisposalEffectCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/scene/situation/stat/disposal/effect/compare`,
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
        throw new Error('真实接口返回无现场处置成效对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '现场处置成效对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['北区停车场', '南区停车场', '东区停车场', '西区停车场'],
              series: [
                { name: '已疏导车辆数', data: [45, 38, 52, 29] },
                { name: '已修复泊位数', data: [28, 35, 40, 22] },
                { name: '受影响泊位数', data: [65, 42, 70, 38] },
              ],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 现场处置成效对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [],
    });
  }
};

// 散点标注模拟数据（现场位置+关键区域）
export const fetchDotAnimationData = async (params: any = {}) => {
  // 模拟异步请求（符合原有组件的异步调用逻辑）
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockDotData = [
        { lat: 22.59843, lng: 113.850704, styleId: "style1" },
        { lat: 22.73174, lng: 113.83156, styleId: "style1" },
        { lat: 22.51992, lng: 114.041128, styleId: "style1" },
        { lat: 22.51272, lng: 113.923216, styleId: "style1" },
        { lat: 22.63708, lng: 114.021664, styleId: "style1" },
        { lat: 22.5685, lng: 113.937664, styleId: "style1" },
        { lat: 22.47647, lng: 113.87896, styleId: "style1" },
        { lat: 22.56663, lng: 113.971456, styleId: "style1" },
        { lat: 22.65771, lng: 114.008152, styleId: "style1" },
        { lat: 22.54694, lng: 113.985288, styleId: "style1" },
        { lat: 22.74182, lng: 113.987864, styleId: "style1" },
        { lat: 22.61793, lng: 114.054416, styleId: "style1" },
        { lat: 22.62883, lng: 114.04849, styleId: "style1" },
        { lat: 22.68143, lng: 113.89202, styleId: "style1" },
        { lat: 22.56446, lng: 114.06516, styleId: "style1" },
        { lat: 22.68407, lng: 113.891515, styleId: "style1" },
        { lat: 22.62253, lng: 113.919701, styleId: "style2" },
        { lat: 22.52789, lng: 114.033568, styleId: "style2" },
        { lat: 22.52885, lng: 114.050111, styleId: "style2" },
        { lat: 22.55658, lng: 114.017307, styleId: "style2" },
        { lat: 22.71386, lng: 113.852661, styleId: "style2" },
        { lat: 22.54378, lng: 113.93253, styleId: "style2" },
        { lat: 22.55387, lng: 113.966907, styleId: "style2" },
        { lat: 22.54396, lng: 113.932743, styleId: "style2" },
        { lat: 22.5447, lng: 113.933098, styleId: "style2" },
        { lat: 22.56445, lng: 113.933779, styleId: "style2" },
        { lat: 22.68963, lng: 114.33684, styleId: "style2" },
        { lat: 22.68206, lng: 114.339015, styleId: "style2" },
      ];
      resolve(mockDotData);
    }, 100);
  });
};


// 指挥调度-调度任务详情及进度列表
export const fetchDispatchTaskList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/dispatch/task/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            dispatchTaskId: item.dispatchTaskId,
            taskContent: item.taskContent,
            dispatchType: item.dispatchType,
            resourceId: item.resourceId,
            address: item.address,
            userId: item.userId,
            maintainUserId: item.maintainUserId,
            taskStatus: item.taskStatus,
            dispatchTime: item.dispatchTime,
            completeTime: item.completeTime,
          }));
        }
        throw new Error('真实接口返回无调度任务列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('调度任务列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                dispatchTaskId: 'DIS2026001',
                taskContent: '主城区停车场出入口拥堵疏导，调配安保及疏导人员',
                dispatchType: 'traffic',
                resourceId: 'RES001',
                address: '主城区中央停车场东门入口',
                userId: 'USER1001',
                maintainUserId: 'MUSER2001',
                taskStatus: 'completed',
                dispatchTime: 1_736_889_600_000,
                completeTime: 1_736_893_200_000,
              },
              {
                dispatchTaskId: 'DIS2026002',
                taskContent: '高新区车场充电桩故障抢修，更换故障设备',
                dispatchType: 'maintain',
                resourceId: 'RES002',
                address: '高新区商业广场地下停车场负二层',
                userId: 'USER1002',
                maintainUserId: 'MUSER2002',
                taskStatus: 'executing',
                dispatchTime: 1_736_893_200_000,
                completeTime: null,
              },
              {
                dispatchTaskId: 'DIS2026003',
                taskContent: '文旅区车场车辆剐蹭事故协调处理，联系交警及保险',
                dispatchType: 'emergency',
                resourceId: 'RES003',
                address: '文旅区生态停车场北区',
                userId: 'USER1001',
                maintainUserId: 'MUSER2003',
                taskStatus: 'pending',
                dispatchTime: 1_736_896_800_000,
                completeTime: null,
              },
              {
                dispatchTaskId: 'DIS2026004',
                taskContent: '经开区物流园车场消防通道占用清理，现场整改',
                dispatchType: 'security',
                resourceId: 'RES004',
                address: '经开区物流园车场西门通道',
                userId: 'USER1003',
                maintainUserId: 'MUSER2001',
                taskStatus: 'completed',
                dispatchTime: 1_736_896_800_000,
                completeTime: 1_736_900_400_000,
              },
              {
                dispatchTaskId: 'DIS2026005',
                taskContent: '周边区县车场照明系统故障维修，恢复正常供电',
                dispatchType: 'maintain',
                resourceId: 'RES005',
                address: '周边区县便民停车场南侧区域',
                userId: 'USER1002',
                maintainUserId: 'MUSER2004',
                taskStatus: 'executing',
                dispatchTime: 1_736_900_400_000,
                completeTime: null,
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDispatchTaskList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 指挥调度-核心指标卡片 (待执行任务数、执行中任务数、已完成任务数)
export const fetchDispatchTaskIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/dispatch/task/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          typeof response.pendingCount === 'number' &&
          typeof response.executingCount === 'number' &&
          typeof response.completedCount === 'number'
        ) {
          return response;
        }
        throw new Error('真实接口返回无调度任务核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '调度任务核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              pendingCount: 8,    // 待执行任务数
              executingCount: 12,  // 执行中任务数
              completedCount: 46   // 已完成任务数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 调度任务核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      pendingCount: 0,
      executingCount: 0,
      completedCount: 0,
    });
  }
};

// 指挥调度-不同接收人任务完成情况对比 柱状图
export const fetchDispatchTaskReceiverCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/dispatch/task/stat/receive/compare`,
        params,
      })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '接收人任务完成情况对比柱状图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: ['张工', '李工', '王工', '赵工', '刘工', '陈工'],
          series: [
            { name: '已完成任务数', data: [28, 32, 19, 25, 22, 16] },
            { name: '未完成任务数', data: [3, 2, 5, 4, 2, 6] }
          ],
        };
      });
  } catch (error) {
    console.error('fetchDispatchTaskReceiverCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};


// 处置进度-处置进度详情及关键节点列表
export const fetchDisposalProgressList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/disposal/progress/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            emergencyId: item.emergencyId,
            disposalStage: item.disposalStage,
            stageStartTime: item.stageStartTime,
            stageEndTime: item.stageEndTime,
            responsibleUnit: item.responsibleUnit,
            disposalMeasure: item.disposalMeasure,
            arrivalDuration: item.arrivalDuration,
            disposalDuration: item.disposalDuration,
          }));
        }
        throw new Error('真实接口返回无处置进度列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('处置进度列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                emergencyId: 'EMG2026001',
                disposalStage: 'close',
                stageStartTime: 1_736_889_600_000,
                stageEndTime: 1_736_898_600_000,
                responsibleUnit: '应急指挥中心',
                disposalMeasure: '现场疏导+交通管制+故障设备临时抢修',
                arrivalDuration: 8,
                disposalDuration: 75,
              },
              {
                emergencyId: 'EMG2026002',
                disposalStage: 'dispose',
                stageStartTime: 1_736_893_200_000,
                stageEndTime: null,
                responsibleUnit: '工程维修部',
                disposalMeasure: '充电桩故障检测+配件更换+通电测试',
                arrivalDuration: 12,
                disposalDuration: null,
              },
              {
                emergencyId: 'EMG2026003',
                disposalStage: 'arrive',
                stageStartTime: 1_736_896_800_000,
                stageEndTime: null,
                responsibleUnit: '安保部+交警支队',
                disposalMeasure: '事故现场保护+双方协调+责任认定',
                arrivalDuration: 5,
                disposalDuration: null,
              },
              {
                emergencyId: 'EMG2026004',
                disposalStage: 'receive',
                stageStartTime: 1_736_900_400_000,
                stageEndTime: null,
                responsibleUnit: '消防管理部',
                disposalMeasure: '现场核查+违规清理+整改通知下达',
                arrivalDuration: null,
                disposalDuration: null,
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDisposalProgressList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 处置进度-核心指标卡片 (各阶段平均耗时、超时处置数)
export const fetchDisposalProgressIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/disposal/progress/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          typeof response.timeoutDisposalCount === 'number'
        ) {
          return response;
        }
        throw new Error('真实接口返回无处置进度核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '处置进度核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              avgAlarmDuration: 3,     // 接警阶段平均耗时(分钟)
              avgReceiveDuration: 8,   // 派单阶段平均耗时(分钟)
              avgArriveDuration: 10,   // 到场阶段平均耗时(分钟)
              avgDisposeDuration: 65,  // 处置阶段平均耗时(分钟)
              avgCloseDuration: 15,    // 结案阶段平均耗时(分钟)
              timeoutDisposalCount: 5  // 超时处置数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 处置进度核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      avgAlarmDuration: 0,
      avgReceiveDuration: 0,
      avgArriveDuration: 0,
      avgDisposeDuration: 0,
      avgCloseDuration: 0,
      timeoutDisposalCount: 0
    });
  }
};

// 处置进度-处置进度时间趋势 折线图
export const fetchDisposalProgressTrend = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/emergency/disposal/progress/stat/trend`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '处置进度时间趋势折线图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: [
            '01日', '02日', '03日', '04日', '05日', '06日', '07日',
            '08日', '09日', '10日', '11日', '12日', '13日', '14日', '15日'
          ],
          series: [
            {
              name: '平均到场时长(分钟)',
              data: [8, 9, 7, 10, 12, 11, 9, 8, 10, 7, 6, 9, 11, 10, 8],
            },
            {
              name: '平均处置时长(分钟)',
              data: [58, 62, 65, 70, 68, 63, 59, 61, 66, 64, 57, 60, 65, 62, 59],
            },
          ],
        };
      });
  } catch (error) {
    console.error('fetchDisposalProgressTrend 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};


// 应急方案-方案执行步骤及责任分工列表
export const fetchEmergencyPlanList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/plan/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            emergency_plan_id: item.emergency_plan_id,
            plan_name: item.plan_name,
            emergency_type: item.emergency_type,
            execution_step: item.execution_step,
            responsibility_division: item.responsibility_division,
            resource_demand: item.resource_demand,
            plan_status: item.plan_status,
            launch_time: item.launch_time,
          }));
        }
        throw new Error('真实接口返回无应急方案列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('应急方案列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                emergency_plan_id: 'PLAN2026001',
                plan_name: '停车场大面积拥堵应急疏导方案',
                emergency_type: 'trafficJam',
                execution_step: '1.接警核实 2.派单调度 3.现场疏导 4.交通管制 5.恢复通行 6.结案归档',
                responsibility_division: '应急指挥中心总负责，安保部现场执行，交警支队配合',
                resource_demand: '安保人员*8、疏导牌*10、警戒带*5、对讲机*6',
                plan_status: 'completed',
                launch_time: 1_736_889_600_000,
              },
              {
                emergency_plan_id: 'PLAN2026002',
                plan_name: '充电桩设备故障紧急抢修方案',
                emergency_type: 'equipmentFault',
                execution_step: '1.故障上报 2.派单维修 3.现场检测 4.配件更换 5.通电测试 6.验收签字',
                responsibility_division: '工程维修部总负责，运维组现场执行，技术部技术支持',
                resource_demand: '维修工程师*3、备用充电桩*2、检测设备*1套、工具包*2',
                plan_status: 'executing',
                launch_time: 1_736_893_200_000,
              },
              {
                emergency_plan_id: 'PLAN2026003',
                plan_name: '停车场车辆事故应急处理方案',
                emergency_type: 'carAccident',
                execution_step: '1.事故上报 2.现场保护 3.人员协调 4.交警对接 5.保险理赔 6.现场清理',
                responsibility_division: '安保部总负责，客服部协调，交警支队主导处理',
                resource_demand: '安保人员*5、急救箱*1、警戒锥桶*8、事故记录单',
                plan_status: 'launched',
                launch_time: 1_736_896_800_000,
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchEmergencyPlanList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 应急方案-核心指标卡片 (已启动方案数、执行中方案数)
export const fetchEmergencyPlanIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/plan/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          typeof response.launchedCount === 'number' &&
          typeof response.executingCount === 'number'
        ) {
          return response;
        }
        throw new Error('真实接口返回无应急方案核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '应急方案核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              launchedCount: 16,   // 已启动方案数
              executingCount: 7     // 执行中方案数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 应急方案核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      launchedCount: 0,
      executingCount: 0,
    });
  }
};

// 应急方案-方案适配应急类型占比 饼图
export const fetchEmergencyPlanTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/plan/stat/type/ratio`,
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
        throw new Error('真实接口返回无方案类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '方案适配应急类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['交通拥堵', '设备故障', '车辆事故', '消防隐患', '人员求助', '其他'],
              series: [
                { name: '方案适配应急类型占比', data: [32, 25, 18, 10, 8, 7] },
              ],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 方案适配应急类型占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '方案适配应急类型占比', data: [] }],
    });
  }
};
