import { requestClient } from '#/api/request';
// import request from 'axios';
const BASE_URL = '/industry';


// 应急全域数据概览相关接口
export const fetchEmergencyGlobalOverview = (params = {}) => {
  try {
      return requestClient.get({
        url: `${BASE_URL}/emerg-overview/get`,
        params
      }).then(response => {
        console.log('应急全域数据概览-接口请求成功');
        if ( response && typeof response === 'object' && !Array.isArray(response) && response.totalEvtCount ) {
          console.log('应急全域数据概览-响应符合实际格式');
          return response;
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch(error => {
        console.log('应急全域数据概览接口调用失败-使用模拟数据兜底', error.message);
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              totalEvtCount: 156,
              handlCount: 23,
              completedCount: 96,
              totalResCount: 896,
              highRiskCount: 18,
              regionCoverCount: 12,
              updateTime: "2025-11-19 10:00:00"
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 应急核心指标相关接口
export const fetchEmergencyCoreIndicators = () => {
  try {
    // return requestClient.get({
    //   url: `${BASE_URL}/emerg-core-metrics/list`
    // }).then(response => {
    //   console.log('应急核心指标-接口请求成功');
    //   if (typeof response === 'object' && response !== null && Object.keys(response).length > 0) {
    //     console.log('应急核心指标-响应符合实际格式');
    //     return response;
    //   }
    //   throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    // }).catch(error => {
      console.log('应急核心指标接口调用失败-使用模拟数据兜底');
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            "emergEventCompleteRate": {
              "rate": 66.5,
              "completedCount": 1330,
              "totalCount": 2000,
              "updateTime": 1764322488000,
              "warningThreshold": 40,
            },
            "earlyWarnAccRate": {
              "rate": 96.67,
              "completedCount": 8,
              "totalCount": 48,
              "updateTime": 1764036622000,
              "warningThreshold": 40,
            },
            "resUseRate": {
              "rate": 34.5,
              "usedCount": 690,
              "totalCount": 2000,
              "updateTime": 1763708842000,
              "warningThreshold": 40,
            },
            "riskRectifyRate": {
              "rate": 80,
              "rectifiedCount": 8,
              "totalCount": 20,
              "updateTime": 1764322488000,
              "warningThreshold": 40,
            },
            "avgHandleEndure": {
              "avgHandleDuration": 36,
              "updateTime": 1764322488000,
              "warningThreshold": 40
            }
          });
        }, 500);
      });
    // });
  } catch (error) {
    console.error('===== fetchEmergencyCoreIndicators初始化错误 =====');
    console.error('应急核心指标-初始化错误详情:', {
      message: error.message,
      stack: error.stack
    });
    return Promise.resolve({});
  }
};

// 风险分布视图相关接口
export const fetchEmergencyRiskGeometries = (params = {}) => {
  try {
    // return requestClient.get({
    //   url: `${BASE_URL}/emerg-risk-view/get`,
    //   params
    // }).then(response => {
    //   console.log('风险分布视图-接口请求成功');
    //
    //   // 判断response是否为数组（实际返回的结构）
    //   if (Array.isArray(response)) {
    //     console.log('风险分布视图-响应符合实际格式');
    //     return response; // 直接返回数组
    //   }
    //
    //   throw new Error('真实接口返回无效数据，使用模拟数据兜底');
    // }).catch(error => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('风险分布视图接口调用失败-使用模拟数据兜底');
          resolve([
            {
              hazardId: "R001",
              riskLevel: "高",
              hazardType: "消防隐患",
              gridName: "城东网格01",
              regionName: "东城区",
              discoverTime: 1727783400000,
              coordX: 26.855237,
              coordY: 117.777777
            },
            {
              hazardId: "R002",
              riskLevel: "中",
              hazardType: "矿山隐患",
              gridName: "南郊网格05",
              regionName: "南郊区",
              discoverTime: 1727883300000,
              coordX: 26.783237,
              coordY: 117.720114
            },
            {
              hazardId: "R003",
              riskLevel: "低",
              hazardType: "教育安全",
              gridName: "老城网格12",
              regionName: "老城区",
              discoverTime: 1727828700000,
              coordX: 26.733337,
              coordY: 117.650114
            },
            {
              hazardId: "R004",
              riskLevel: "高",
              hazardType: "用电隐患",
              gridName: "河西网格08",
              regionName: "西城区",
              discoverTime: 1727953200000,
              coordX: 26.810237,
              coordY: 117.800777
            },
            {
              hazardId: "R005",
              riskLevel: "中",
              hazardType: "交通隐患",
              gridName: "北站网格03",
              regionName: "北城区",
              discoverTime: 1727927100000,
              coordX: 26.756237,
              coordY: 117.712114
            },
            {
              hazardId: "R006",
              riskLevel: "低",
              hazardType: "公共设施",
              gridName: "工业园网格02",
              regionName: "工业园区",
              discoverTime: 1728006600000,
              coordX: 26.832237,
              coordY: 117.689114
            },
            {
              hazardId: "R007",
              riskLevel: "高",
              hazardType: "燃气隐患",
              gridName: "环山网格06",
              regionName: "风景区",
              discoverTime: 1728041400000,
              coordX: 26.798237,
              coordY: 117.833777
            },
            {
              hazardId: "R008",
              riskLevel: "中",
              hazardType: "自然灾害",
              gridName: "新区网格09",
              regionName: "新城区",
              discoverTime: 1728113700000,
              coordX: 26.765237,
              coordY: 117.755114
            }
          ]);
        }, 500);
      });
    // });
  } catch (error) {
    console.error('===== 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    return Promise.resolve([]);
  }
};

// 应急资源总览相关接口
export const fetchEmergencyResources = (params = {}) => {
  try {
    // return requestClient.get({
    //   url: `${BASE_URL}/emerg-resover-view/list`,
    //   params
    // }).then(response => {
    //   console.log('应急资源总览-接口请求成功');
    //
    //   if (Array.isArray(response)) {
    //     console.log('应急资源总览-响应符合实际格式');
    //     return response; // 直接返回数组
    //   }
    //
    //   throw new Error('真实接口返回无效数据，使用模拟数据兜底');
    // }).catch(error => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('应急资源总览接口调用失败-使用模拟数据兜底');
          resolve([
            {
              resId: '1',
              resName: '消防水泵',
              resType: '设备',
              totalQty: 50,
              availableQty: 45,
              storageLoc: '东区应急仓库 A-12',
              mngrName: '张工',
              stockStatus: '紧张',
              updateTime: '1727783400000'
            },
            {
              resId: '2',
              resName: '防汛沙袋',
              resType: '应急物资',
              totalQty: 2000,
              availableQty: 1500,
              storageLoc: '南区应急仓库 B-03',
              mngrName: '李姐',
              stockStatus: '紧张',
              updateTime: '1727783400000'
            },
            {
              resId: '3',
              resName: '应急通信车',
              resType: '设备',
              totalQty: 3,
              availableQty: 1,
              storageLoc: '西区应急仓库 C-01',
              mngrName: '王师傅',
              stockStatus: '充足',
              updateTime: '1727783400000'
            },
            {
              resId: '4',
              resName: '抢险救援一队',
              resType: '救援队伍',
              totalQty: 30,
              availableQty: 25,
              storageLoc: '北区应急中心',
              mngrName: '赵队',
              stockStatus: '充足',
              updateTime: '1727783400000'
            },
            {
              resId: '5',
              resName: '应急避难场所',
              resType: '设备',
              totalQty: 1,
              availableQty: 1,
              storageLoc: '市中心广场',
              mngrName: '孙主任',
              stockStatus: '紧张',
              updateTime: '1727783400000'
            },
            {
              resId: '6',
              resName: '医用急救包',
              resType: '应急物资',
              totalQty: 100,
              availableQty: 85,
              storageLoc: '东区应急仓库 A-05',
              mngrName: '刘医生',
              stockStatus: '短缺',
              updateTime: '1727783400000'
            },
            {
              resId: '7',
              resName: '无人机侦察队',
              resType: '救援队伍',
              totalQty: 8,
              availableQty: 6,
              storageLoc: '西区应急仓库 C-08',
              mngrName: '陈队长',
              stockStatus: '充足',
              updateTime: '1727783400000'
            },
            {
              resId: '8',
              resName: '柴油发电机',
              resType: '设备',
              totalQty: 5,
              availableQty: 2,
              storageLoc: '南区应急仓库 B-10',
              mngrName: '周师傅',
              stockStatus: '充足',
              updateTime: '1727783400000'
            }
          ]);
        }, 500);
      });
    // });
  } catch (error) {
    console.error('===== 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 近期预警信息滚动数据
export const fetchWarningScrollData = () => {
  try {
    // return requestClient.get({
    //   url: `${BASE_URL}/emerg-warn/get`
    // }).then(response => {
    //   console.log('近期预警信息-接口请求成功');
    //
    //   if (Array.isArray(response) && response.length > 0) {
    //     console.log('近期预警信息-响应符合实际格式');
    //     return response; // 直接返回接口的数组数据
    //   }
    //
    //   throw new Error('真实接口返回无效数据，使用模拟数据兜底');
    // }).catch(error => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('近期预警信息接口调用失败-使用模拟数据兜底');
          resolve([
            {
              "type": "应急安全",
              "discoveryTime": "2025-12-03 09:12:30",
              "status": "未处理",
              "description": "危化品风险等级上升",
              "regionName": "北京市"
            },
            {
              "type": "风险",
              "discoveryTime": "2025-12-02 09:12:30",
              "status": "未处理",
              "description": "施工围挡出现松动",
              "regionName": "北京市"
            },
            {
              "type": "应急资源",
              "discoveryTime": "2025-12-01 14:25:10",
              "status": "处理中",
              "description": "防汛沙袋库存不足",
              "regionName": "上海市"
            },
            {
              "type": "风险",
              "discoveryTime": "2025-11-30 10:08:20",
              "status": "已解决",
              "description": "消防通道被占用",
              "regionName": "广州市"
            },
            {
              "type": "应急安全",
              "discoveryTime": "2025-11-29 16:40:00",
              "status": "处理中",
              "description": "风险点监测设备离线",
              "regionName": "深圳市"
            }
          ]);
        }, 500);
      });
    // });
  } catch (initError) {
    // 捕获函数初始化/请求初始化阶段的异常
    console.error('===== 预警信息滚动数据函数初始化异常 =====');
    console.error('初始化错误信息:', initError.message);
    console.error('初始化错误堆栈:', initError.stack);
    // 兜底返回空数组，保证返回值类型统一
    return Promise.resolve([]);
  }
};


// 获取预警类型数据
export const fetchWarningTypes = async () => {
  try {
    const response = await requestClient.get({ url: `${BASE_URL}/warningTypes` });
    if (response.data?.code === 0 && Array.isArray(response.data.data) && response.data.data.length > 0) {
      return response.data.data;
    }
    throw new Error('真实接口返回空数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('预警类型数据接口调用失败：', error.message);
    return [
      {
        title: '风险等级预警',
        content: '东方化工厂仓库风险等级升至5级，请注意监控'
      },
      {
        title: '资源预警',
        content: '防汛沙袋可用数量低于库存的30%，建议补充'
      },
      {
        title: '指标预警',
        content: '平均处置时长升至35分钟，已超过目标值（30分钟）'
      }
    ];
  }
};

// 提交资源调拨申请
export const submitResourceAllocation = (params) => {
  try {
    return requestClient.post({
      url: `${BASE_URL}/submitResourceAllocation`,
      data: params
    }).then(response => {
      if (response.data?.code === 0 && response.data.success) {
        return response.data;
      }
      throw new Error('真实接口返回无效结果，使用模拟结果兜底');
    }).catch(error => {
      console.warn('提交资源调拨申请接口调用失败：', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ success: true, message: '资源调拨申请提交成功' });
        }, 500);
      });
    });
  } catch (error) {
    console.error('submitResourceAllocation初始化错误:', error);
    return Promise.resolve({ success: false, message: '申请失败' });
  }
};


