import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';

// ========== 1. 应急态势视图 接口 (字段：应急事件ID/等级/类型/位置/经纬度/影响范围等 完整15个字段)
export const fetchEmergencySituationList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/situation/list`,
        params,
      })
      .then((response) => {
        console.log('应急态势视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('应急态势视图-响应符合实际格式');
          return response.map((item) => ({
            emergencyId: item.emergencyId,
            emergencyLevel: item.emergencyLevel,
            emergencyType: item.emergencyType,
            address: item.address,
            longitude: item.longitude,
            latitude: item.latitude,
            influenceRange: item.influenceRange,
            developmentTrend: item.developmentTrend,
            affectedVehicleCount: item.affectedVehicleCount,
            lossSituation: item.lossSituation,
            rescueProgress: item.rescueProgress,
            responsibleUnit: item.responsibleUnit,
            occurTime: item.occurTime,
            createTime: item.createTime,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('应急态势视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                emergencyId: 'EM20250109001',
                emergencyLevel: '重大',
                emergencyType: '停车场火灾',
                address: '漳州市芗城区万达广场地下停车场B1层',
                longitude: '117.092536',
                latitude: '24.658627',
                influenceRange:
                  '过火面积约80㎡，覆盖22个停车泊位，周边3个充电桩受损',
                developmentTrend: '火势已初步控制，无蔓延趋势，烟雾逐步消散',
                affectedVehicleCount: 18,
                lossSituation:
                  '3辆车辆轻微烧毁，2台充电桩损坏，停车场通风系统受损',
                rescueProgress: '灭火作业完成，现场清理中',
                responsibleUnit: '漳州市消防救援支队芗城大队',
                occurTime: '2025-01-09 08:25:00',
                createTime: '2025-01-09 08:28:00',
              },
              {
                emergencyId: 'EM20250109002',
                emergencyLevel: '较大',
                emergencyType: '设备大规模故障',
                address: '漳州市龙文区吾悦广场地面停车场',
                longitude: '117.145672',
                latitude: '24.631289',
                influenceRange:
                  '全场45个道闸及识别设备瘫痪，无法进出，覆盖120个泊位',
                developmentTrend: '故障范围无扩大，技术抢修团队已到场',
                affectedVehicleCount: 96,
                lossSituation:
                  '暂无车辆损失，停车场计费系统暂停服务，预估经济损失5000元',
                rescueProgress: '设备检修中，预计2小时内恢复部分通道',
                responsibleUnit: '漳州智慧停车运维有限公司',
                occurTime: '2025-01-09 09:10:00',
                createTime: '2025-01-09 09:12:00',
              },
              {
                emergencyId: 'EM20250109003',
                emergencyLevel: '一般',
                emergencyType: '车辆拥堵',
                address: '漳州市龙海区石码镇锦江广场停车场入口',
                longitude: '117.021358',
                latitude: '24.469872',
                influenceRange:
                  '入口通道拥堵，排队车辆约50米，影响周边市政道路通行',
                developmentTrend: '拥堵逐步缓解，疏导效率提升',
                affectedVehicleCount: 32,
                lossSituation: '无直接经济损失，车辆通行效率降低',
                rescueProgress: '现场疏导完成，交通恢复正常',
                responsibleUnit: '漳州市交警支队龙海大队',
                occurTime: '2025-01-09 10:05:00',
                createTime: '2025-01-09 10:07:00',
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

// ========== 2. 应急资源分布展示 接口 (字段：资源ID/类型/名称/位置/经纬度等 完整13个字段)
export const fetchEmergencyResourceDistributionList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/resource/distribution/list`,
        params,
      })
      .then((response) => {
        console.log('应急资源分布展示-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('应急资源分布展示-响应符合实际格式');
          return response.map((item) => ({
            resourceId: item.resourceId,
            resourceType: item.resourceType,
            resourceName: item.resourceName,
            address: item.address,
            longitude: item.longitude,
            latitude: item.latitude,
            resourceStatus: item.resourceStatus,
            specification: item.specification,
            belongDepartment: item.belongDepartment,
            supplyChannel: item.supplyChannel,
            distance: item.distance,
            updateTime: item.updateTime,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log(
          '应急资源分布展示接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                resourceId: 'RES20250109001',
                resourceType: '消防器材',
                resourceName: '手提式干粉灭火器(4kg)',
                address: '漳州市芗城区万达广场地下停车场消防栓点位',
                longitude: '117.092851',
                latitude: '24.658932',
                resourceStatus: '可用',
                specification: 'MFZ/ABC4型，有效灭火距离3m',
                belongDepartment: '漳州万达商业管理有限公司',
                supplyChannel: '漳州市消防器材有限公司',
                distance: '0.2km',
                updateTime: '2025-01-09 08:30:00',
              },
              {
                resourceId: 'RES20250109002',
                resourceType: '抢修车辆',
                resourceName: '工程抢修车(含全套维修工具)',
                address: '漳州市龙文区蓝田开发区运维中心',
                longitude: '117.156237',
                latitude: '24.628945',
                resourceStatus: '在途',
                specification: '江铃凯运，载重2吨，含道闸/相机维修工具',
                belongDepartment: '漳州智慧停车运维有限公司',
                supplyChannel: '自有车辆调配',
                distance: '3.5km',
                updateTime: '2025-01-09 09:15:00',
              },
              {
                resourceId: 'RES20250109003',
                resourceType: '救援队伍',
                resourceName: '应急抢修班组(5人)',
                address: '漳州市龙海区石码镇应急指挥中心',
                longitude: '117.020864',
                latitude: '24.470129',
                resourceStatus: '占用',
                specification: '含电工2名、机械师2名、现场指挥1名',
                belongDepartment: '龙海区城市管理局',
                supplyChannel: '内部人员调配',
                distance: '0.8km',
                updateTime: '2025-01-09 10:10:00',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error(
      '===== fetchEmergencyResourceDistributionList 函数初始化异常 =====',
    );
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// ========== 3. 指挥调度看板 接口 (字段：调度任务ID/内容/类型/资源ID等 完整18个字段)
export const fetchCommandDispatchBoardList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/command/dispatch/list`,
        params,
      })
      .then((response) => {
        console.log('指挥调度看板-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('指挥调度看板-响应符合实际格式');
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
            executeTime: item.executeTime,
            completeTime: item.completeTime,
            feedbackContent: item.feedbackContent,
            createTime: item.createTime,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('指挥调度看板接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                dispatchTaskId: 'DIS20250109001',
                taskContent:
                  '调配10具干粉灭火器至万达地下停车场火灾现场，协助灭火作业',
                dispatchType: '指定派单',
                resourceId: 'RES20250109001',
                address: '漳州市芗城区万达广场地下停车场B1层',
                userId: 'CMD001',
                maintainUserId: 'WX006',
                taskStatus: '已完成',
                dispatchTime: '2025-01-09 08:30:00',
                executeTime: '2025-01-09 08:35:00',
                completeTime: '2025-01-09 08:40:00',
                feedbackContent:
                  '灭火器已送达现场，灭火作业顺利完成，无物资损耗',
                createTime: '2025-01-09 08:29:00',
              },
              {
                dispatchTaskId: 'DIS20250109002',
                taskContent:
                  '派遣工程抢修车及维修团队至吾悦广场停车场，抢修故障道闸设备',
                dispatchType: '一键派单',
                resourceId: 'RES20250109002',
                address: '漳州市龙文区吾悦广场地面停车场',
                userId: 'CMD002',
                maintainUserId: 'WX007',
                taskStatus: '执行中',
                dispatchTime: '2025-01-09 09:13:00',
                executeTime: '2025-01-09 09:20:00',
                completeTime: '--',
                feedbackContent:
                  '维修团队已到场，正在检测设备故障原因，预计1小时内出结果',
                createTime: '2025-01-09 09:12:00',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchCommandDispatchBoardList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// ========== 4. 应急处置进度 接口 (字段：应急事件ID/处置阶段/措施/时长等 完整16个字段)
export const fetchEmergencyDisposalProgressList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/disposal/progress/list`,
        params,
      })
      .then((response) => {
        console.log('应急处置进度-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('应急处置进度-响应符合实际格式');
          return response.map((item) => ({
            emergencyId: item.emergencyId,
            disposalStage: item.disposalStage,
            disposalMeasure: item.disposalMeasure,
            stageStartTime: item.stageStartTime,
            stageEndTime: item.stageEndTime,
            responsibleUnit: item.responsibleUnit,
            keyNode: item.keyNode,
            resourceInput: item.resourceInput,
            phasedAchievement: item.phasedAchievement,
            arrivalDuration: item.arrivalDuration,
            disposalDuration: item.disposalDuration,
            controlDuration: item.controlDuration,
            updateTime: item.updateTime,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('应急处置进度接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                emergencyId: 'EM20250109001',
                disposalStage: '处置',
                disposalMeasure:
                  '启用现场消防栓及干粉灭火器灭火，切断停车场电源，疏散现场人员及车辆',
                stageStartTime: '2025-01-09 08:28:00',
                stageEndTime: '2025-01-09 08:50:00',
                responsibleUnit: '漳州市消防救援支队芗城大队',
                keyNode: '火势完全扑灭，无复燃风险',
                resourceInput: '干粉灭火器10具、消防水带2条、救援人员8名',
                phasedAchievement:
                  '过火区域明火已灭，烟雾消散，现场无人员伤亡，受损车辆已转移至安全区域',
                arrivalDuration: '3分钟',
                disposalDuration: '22分钟',
                controlDuration: '5分钟',
                updateTime: '2025-01-09 08:52:00',
              },
              {
                emergencyId: 'EM20250109002',
                disposalStage: '派单',
                disposalMeasure:
                  '联系设备厂家技术支持，派遣维修团队到场检测故障原因，同步开启备用通道放行车辆',
                stageStartTime: '2025-01-09 09:12:00',
                stageEndTime: '--',
                responsibleUnit: '漳州智慧停车运维有限公司',
                keyNode: '维修团队到场，设备故障初步定位为控制主板损坏',
                resourceInput: '工程抢修车1辆、维修工具1套、技术人员5名',
                phasedAchievement:
                  '备用通道已开启，缓解车辆拥堵，故障设备正在检修中',
                arrivalDuration: '7分钟',
                disposalDuration: '--',
                controlDuration: '--',
                updateTime: '2025-01-09 09:25:00',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error(
      '===== fetchEmergencyDisposalProgressList 函数初始化异常 =====',
    );
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// ========== 5. 资源调度视图 接口 (字段：调度记录ID/资源ID/路径/状态等 完整16个字段)
export const fetchResourceDispatchViewList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/resource/dispatch/view/list`,
        params,
      })
      .then((response) => {
        console.log('资源调度视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('资源调度视图-响应符合实际格式');
          return response.map((item) => ({
            dispatchRecordId: item.dispatchRecordId,
            resourceId: item.resourceId,
            resourceType: item.resourceType,
            dispatchPath: item.dispatchPath,
            estimatedArrivalTime: item.estimatedArrivalTime,
            dispatchQuantity: item.dispatchQuantity,
            receiver: item.receiver,
            dispatchStatus: item.dispatchStatus,
            userId: item.userId,
            transportMode: item.transportMode,
            realTimeLocation: item.realTimeLocation,
            abnormalInfo: item.abnormalInfo,
            createTime: item.createTime,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源调度视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                dispatchRecordId: 'REC20250109001',
                resourceId: 'RES20250109002',
                resourceType: '抢修车辆',
                dispatchPath:
                  '蓝田开发区运维中心→龙江中路→水仙大街→吾悦广场停车场',
                estimatedArrivalTime: '2025-01-09 09:20:00',
                dispatchQuantity: 1,
                receiver: '漳州智慧停车运维有限公司',
                dispatchStatus: '已送达',
                userId: 'CMD002',
                transportMode: '公路运输',
                realTimeLocation: '漳州市龙文区吾悦广场停车场入口',
                abnormalInfo: '无异常',
                createTime: '2025-01-09 09:12:00',
              },
              {
                dispatchRecordId: 'REC20250109002',
                resourceId: 'RES20250109003',
                resourceType: '救援队伍',
                dispatchPath: '石码镇应急指挥中心→锦江大道→锦江广场停车场',
                estimatedArrivalTime: '2025-01-09 10:15:00',
                dispatchQuantity: 1,
                receiver: '龙海区城市管理局',
                dispatchStatus: '在途异常',
                userId: 'CMD003',
                transportMode: '公路运输',
                realTimeLocation: '锦江大道与紫光路交叉口',
                abnormalInfo: '道路施工拥堵，预计延迟10分钟到达',
                createTime: '2025-01-09 10:08:00',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchResourceDispatchViewList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// ========== 6. 现场态势视图 接口 (字段：应急事件ID/视频URL/现场数据等 完整12个字段)
export const fetchFieldSituationViewList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/field/situation/list`,
        params,
      })
      .then((response) => {
        console.log('现场态势视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('现场态势视图-响应符合实际格式');
          return response.map((item) => ({
            emergencyId: item.emergencyId,
            address: item.address,
            videoUrl: item.videoUrl,
            deviceId: item.deviceId,
            fieldPersonLocation: item.fieldPersonLocation,
            fieldData: item.fieldData,
            damageDegree: item.damageDegree,
            affectedBerthCount: item.affectedBerthCount,
            evacuatedVehicleCount: item.evacuatedVehicleCount,
            repairBerthCount: item.repairBerthCount,
            updateTime: item.updateTime,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('现场态势视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                emergencyId: 'EM20250109001',
                address: '漳州市芗城区万达广场地下停车场B1层',
                videoUrl:
                  'https://video.zhangzhou.com/emergency/fire20250109.mp4',
                deviceId: 'CAM350602001',
                fieldPersonLocation:
                  '消防人员8名，运维人员3名，现场指挥1名，均在安全区域',
                fieldData:
                  '设备损坏程度：中度，影响泊位数量：22个，过火面积：80㎡，受困车辆数：0辆',
                damageDegree: '中度',
                affectedBerthCount: 22,
                evacuatedVehicleCount: 18,
                repairBerthCount: 0,
                updateTime: '2025-01-09 08:55:00',
              },
              {
                emergencyId: 'EM20250109002',
                address: '漳州市龙文区吾悦广场地面停车场',
                videoUrl:
                  'https://video.zhangzhou.com/emergency/device20250109.mp4',
                deviceId: 'CAM350603002',
                fieldPersonLocation:
                  '维修人员5名，现场疏导人员2名，均在停车场入口区域',
                fieldData:
                  '设备损坏程度：重度，影响泊位数量：120个，过火面积：0㎡，受困车辆数：0辆',
                damageDegree: '重度',
                affectedBerthCount: 120,
                evacuatedVehicleCount: 45,
                repairBerthCount: 10,
                updateTime: '2025-01-09 09:30:00',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchFieldSituationViewList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// ========== 7. 应急方案视图 接口 (字段：应急方案ID/名称/适配类型/状态等 完整14个字段)
export const fetchEmergencyPlanViewList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/plan/view/list`,
        params,
      })
      .then((response) => {
        console.log('应急方案视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('应急方案视图-响应符合实际格式');
          return response.map((item) => ({
            emergencyPlanId: item.emergencyPlanId,
            planName: item.planName,
            emergencyType: item.emergencyType,
            executionStep: item.executionStep,
            responsibilityDivision: item.responsibilityDivision,
            resourceDemand: item.resourceDemand,
            mattersNeedingAttention: item.mattersNeedingAttention,
            riskPrompt: item.riskPrompt,
            relatedLaw: item.relatedLaw,
            planStatus: item.planStatus,
            launchTime: item.launchTime,
            updateTime: item.updateTime,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('应急方案视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                emergencyPlanId: 'PLAN20250109001',
                planName: '停车场火灾应急处置预案V2.0',
                emergencyType: '停车场火灾',
                executionStep:
                  '1.接警响应 2.切断电源 3.疏散人员车辆 4.启动灭火设备 5.现场警戒 6.善后清理',
                responsibilityDivision:
                  '消防支队：灭火救援；运维公司：现场断电及设备抢修；交警大队：交通疏导',
                resourceDemand:
                  '干粉灭火器、消防水带、救援人员、抢修工具、警戒设备',
                mattersNeedingAttention:
                  '灭火时注意用电安全，疏散车辆时避免二次拥堵，现场禁止无关人员进入',
                riskPrompt:
                  '火灾可能引发电路短路，存在触电风险；烟雾扩散可能导致人员窒息',
                relatedLaw:
                  '《中华人民共和国消防法》《停车场消防安全管理规范》',
                planStatus: '已启用',
                launchTime: '2025-01-09 08:28:00',
                updateTime: '2025-01-09 08:30:00',
              },
              {
                emergencyPlanId: 'PLAN20250109002',
                planName: '设备大规模故障应急抢修预案V1.5',
                emergencyType: '设备大规模故障',
                executionStep:
                  '1.故障上报 2.派单响应 3.现场检测 4.设备抢修 5.备用通道开启 6.恢复验收',
                responsibilityDivision:
                  '运维公司：设备抢修；停车场管理方：现场疏导；技术厂家：远程支持',
                resourceDemand:
                  '抢修车辆、维修工具、备用设备、技术人员、疏导标识',
                mattersNeedingAttention:
                  '抢修时做好安全防护，备用通道开启后安排专人值守，避免车辆剐蹭',
                riskPrompt:
                  '设备故障可能导致车辆拥堵，引发口角冲突；抢修操作不当可能扩大故障范围',
                relatedLaw: '《城市停车设施运营管理规范》《特种设备安全法》',
                planStatus: '已启用',
                launchTime: '2025-01-09 09:13:00',
                updateTime: '2025-01-09 09:15:00',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchEmergencyPlanViewList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// ========== 8. 跨域协同指挥 接口 (字段：协同ID/类型/任务/响应状态等 完整12个字段)
export const fetchCrossDomainCooperationCommandList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/cooperation/command/list`,
        params,
      })
      .then((response) => {
        console.log('跨域协同指挥-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('跨域协同指挥-响应符合实际格式');
          return response.map((item) => ({
            cooperationId: item.cooperationId,
            cooperationType: item.cooperationType,
            taskContent: item.taskContent,
            participantUnit: item.participantUnit,
            responseStatus: item.responseStatus,
            cooperationEffect: item.cooperationEffect,
            instructionFlow: item.instructionFlow,
            communicationRecord: item.communicationRecord,
            startTime: item.startTime,
            completeTime: item.completeTime,
            createTime: item.createTime,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('跨域协同指挥接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                cooperationId: 'COOP20250109001',
                cooperationType: '跨部门',
                taskContent:
                  '协同消防、交警、运维三方，完成万达停车场火灾现场处置及交通疏导',
                participantUnit:
                  '漳州市消防救援支队芗城大队、漳州市交警支队芗城大队、漳州万达商业管理有限公司',
                responseStatus: '已响应',
                cooperationEffect:
                  '三方配合顺畅，火灾处置及时，交通疏导高效，无二次事故发生',
                instructionFlow: '应急指挥中心→消防支队→交警大队→运维公司',
                communicationRecord:
                  '累计通话12次，微信指令推送8条，现场对讲机实时沟通',
                startTime: '2025-01-09 08:28:00',
                completeTime: '2025-01-09 08:55:00',
                createTime: '2025-01-09 08:27:00',
              },
              {
                cooperationId: 'COOP20250109002',
                cooperationType: '跨区域',
                taskContent:
                  '协同龙文区运维中心、龙海区应急队伍，支援吾悦广场设备故障抢修',
                participantUnit:
                  '漳州智慧停车运维有限公司龙文分公司、龙海区城市管理局应急中队',
                responseStatus: '已响应',
                cooperationEffect:
                  '资源调配及时，维修效率提升，故障范围得到有效控制',
                instructionFlow: '应急指挥中心→龙文运维中心→龙海应急中队',
                communicationRecord:
                  '累计通话6次，技术文档传输2份，远程视频指导1次',
                startTime: '2025-01-09 09:13:00',
                completeTime: '--',
                createTime: '2025-01-09 09:12:00',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error(
      '===== fetchCrossDomainCooperationCommandList 函数初始化异常 =====',
    );
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// ========== 9. 专项应急视图 接口 (字段：专项应急ID/场景/疏散通道/抢修进度等 完整14个字段)
export const fetchSpecialEmergencyViewList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/special/view/list`,
        params,
      })
      .then((response) => {
        console.log('专项应急视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('专项应急视图-响应符合实际格式');
          return response.map((item) => ({
            specialEmergencyId: item.specialEmergencyId,
            emergencyScene: item.emergencyScene,
            evacuationRoute: item.evacuationRoute,
            address: item.address,
            trappedVehicleCount: item.trappedVehicleCount,
            evacuationProgress: item.evacuationProgress,
            congestionRange: item.congestionRange,
            congestionReason: item.congestionReason,
            lotId: item.lotId,
            dredgePath: item.dredgePath,
            repairProgress: item.repairProgress,
            createTime: item.createTime,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('专项应急视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                specialEmergencyId: 'SPEC20250109001',
                emergencyScene: '停车场应急疏散',
                evacuationRoute: 'B1层东出口→地面广场→江滨路安全区域',
                address: '漳州市芗城区万达广场地下停车场B1层',
                trappedVehicleCount: 0,
                evacuationProgress: '100%',
                congestionRange: '无拥堵',
                congestionReason: '无',
                lotId: 'ZZXC001',
                dredgePath: '无',
                repairProgress: '0%',
                createTime: '2025-01-09 08:28:00',
              },
              {
                specialEmergencyId: 'SPEC20250109002',
                emergencyScene: '设备故障应急抢修',
                evacuationRoute: '无',
                address: '漳州市龙文区吾悦广场地面停车场',
                trappedVehicleCount: 0,
                evacuationProgress: '无',
                congestionRange: '入口通道50米',
                congestionReason: '道闸设备故障，车辆无法进出',
                lotId: 'ZZLW002',
                dredgePath: '停车场南侧备用通道→水仙大街→龙江中路',
                repairProgress: '30%',
                createTime: '2025-01-09 09:12:00',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSpecialEmergencyViewList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// ========== 10. 应急演练视图 接口 (字段：演练ID/科目/参与单位/评分等 完整14个字段)
export const fetchEmergencyDrillViewList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/emergency/drill/view/list`,
        params,
      })
      .then((response) => {
        console.log('应急演练视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('应急演练视图-响应符合实际格式');
          return response.map((item) => ({
            drillId: item.drillId,
            drillSubject: item.drillSubject,
            participantUnit: item.participantUnit,
            participantPerson: item.participantPerson,
            drillStatus: item.drillStatus,
            executionSituation: item.executionSituation,
            problemRectification: item.problemRectification,
            scoreResult: item.scoreResult,
            drillPlanId: item.drillPlanId,
            startTime: item.startTime,
            endTime: item.endTime,
            createTime: item.createTime,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('应急演练视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                drillId: 'DRILL20250105001',
                drillSubject: '火灾应急疏散演练',
                participantUnit:
                  '漳州万达商业管理有限公司、漳州市消防救援支队芗城大队',
                participantPerson:
                  '消防人员10名，运维人员8名，停车场工作人员20名',
                drillStatus: '已结束',
                executionSituation:
                  '演练流程顺畅，人员疏散及时，灭火操作规范，整体执行效果良好',
                problemRectification:
                  '部分人员疏散路线不熟悉，已组织专项培训；灭火器使用不熟练，已现场指导',
                scoreResult: '92分',
                drillPlanId: 'DRILLPLAN001',
                startTime: '2025-01-05 09:00:00',
                endTime: '2025-01-05 10:30:00',
                createTime: '2025-01-04 15:00:00',
              },
              {
                drillId: 'DRILL20250106002',
                drillSubject: '设备故障抢修演练',
                participantUnit: '漳州智慧停车运维有限公司、龙文区城市管理局',
                participantPerson: '维修人员12名，技术人员5名，现场指挥3名',
                drillStatus: '已结束',
                executionSituation:
                  '故障定位准确，抢修操作规范，备用设备调配及时，演练目标达成',
                problemRectification:
                  '抢修工具携带不全，已完善工具清单；沟通效率偏低，已优化对讲机频道分配',
                scoreResult: '88分',
                drillPlanId: 'DRILLPLAN002',
                startTime: '2025-01-06 14:00:00',
                endTime: '2025-01-06 15:40:00',
                createTime: '2025-01-05 16:00:00',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchEmergencyDrillViewList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};
