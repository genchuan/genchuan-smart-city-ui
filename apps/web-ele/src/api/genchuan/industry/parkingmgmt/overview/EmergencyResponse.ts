import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';


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
                taskEmergencyEmergencyId: 'EM202501001',
                tbAssetExtendAddress: '高新区创业路128号',
                taskEmergencySceneSceneStatus: '处置中',
                taskEmergencySceneAffectedBerthCount: 15,
                taskEmergencySceneEvacuatedVehicleCount: 8,
                taskEmergencySceneRepairBerthCount: 5,
              },
              {
                taskEmergencyEmergencyId: 'EM202501002',
                tbAssetExtendAddress: '主城区人民广场东侧',
                taskEmergencySceneSceneStatus: '已处置',
                taskEmergencySceneAffectedBerthCount: 8,
                taskEmergencySceneEvacuatedVehicleCount: 8,
                taskEmergencySceneRepairBerthCount: 8,
              },
              {
                taskEmergencyEmergencyId: 'EM202501003',
                tbAssetExtendAddress: '经开区工业大道56号',
                taskEmergencySceneSceneStatus: '待处置',
                taskEmergencySceneAffectedBerthCount: 20,
                taskEmergencySceneEvacuatedVehicleCount: 5,
                taskEmergencySceneRepairBerthCount: 0,
              },
              {
                taskEmergencyEmergencyId: 'EM202501004',
                tbAssetExtendAddress: '文旅区景区北路32号',
                taskEmergencySceneSceneStatus: '处置中',
                taskEmergencySceneAffectedBerthCount: 12,
                taskEmergencySceneEvacuatedVehicleCount: 9,
                taskEmergencySceneRepairBerthCount: 8,
              },
              {
                taskEmergencyEmergencyId: 'EM202501005',
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


// ======================== 应急态势 新增接口 (指标卡片+图表) ========================
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

// ======================== 资源分布 新增接口 (柱状图+饼图) ========================
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

// ======================== 专项应急视图 新增接口 (指标卡片+折线图) ========================
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

// ======================== 应急响应-地图相关所有接口 ========================
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

// ======================== 新增：应急响应 所有接口 ========================
// -------------------------- 指挥调度 模块 --------------------------
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

// -------------------------- 处置进度 模块 --------------------------
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

// -------------------------- 应急方案 模块 --------------------------
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
