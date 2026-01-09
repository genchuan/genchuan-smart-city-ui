import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';

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
          faultId: item.faultId,
          faultType: item.faultType,
          faultCode: item.faultCode,
          areaCode: item.areaCode,
          lotId: item.lotId,
          deviceId: item.deviceId,
          deviceType: item.deviceType,
          faultLocation: item.faultLocation,
          influenceRange: item.influenceRange,
          affectedUserCount: item.affectedUserCount,
          maintenanceProgress: item.maintenanceProgress,
          maintainUserId: item.maintainUserId,
          sparePartNeed: item.sparePartNeed,
          maintenanceDeadline: item.maintenanceDeadline,
          createTime: item.createTime
        }));
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('泊位故障列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              faultId: 'FZ20250108001',
              faultType: '道闸故障',
              faultCode: 'DZ-003',
              areaCode: '350602',
              lotId: 'ZZXC001',
              deviceId: 'DZ-350602-001',
              deviceType: '智能道闸',
              faultLocation: '漳州市芗城区新华西商业街停车场出口',
              influenceRange: '出口道闸无法升降，影响车辆离场，覆盖12个泊位',
              affectedUserCount: 86,
              maintenanceProgress: '维修中',
              maintainUserId: 'WX001',
              sparePartNeed: '道闸控制主板、升降电机',
              maintenanceDeadline: '2025-01-09 18:00:00',
              createTime: '2025-01-08 09:15:00'
            },
            {
              faultId: 'FZ20250108002',
              faultType: '相机故障',
              faultCode: 'XJ-007',
              areaCode: '350603',
              lotId: 'ZZLW002',
              deviceId: 'XJ-350603-002',
              deviceType: '车牌识别相机',
              faultLocation: '漳州市龙文区蓝田开发区停车场入口',
              influenceRange: '车牌识别失败，无法自动抬杆，覆盖8个泊位',
              affectedUserCount: 52,
              maintenanceProgress: '未维修',
              maintainUserId: 'WX002',
              sparePartNeed: '相机镜头模组、识别算法模块',
              maintenanceDeadline: '2025-01-10 12:00:00',
              createTime: '2025-01-08 10:20:00'
            },
            {
              faultId: 'FZ20250108003',
              faultType: '传感器故障',
              faultCode: 'CGQ-002',
              areaCode: '350604',
              lotId: 'ZZLH003',
              deviceId: 'CGQ-350604-003',
              deviceType: '地感传感器',
              faultLocation: '漳州市龙海区石码镇锦江广场停车场B区',
              influenceRange: '无法检测车辆占位，计费异常，覆盖15个泊位',
              affectedUserCount: 120,
              maintenanceProgress: '维修中',
              maintainUserId: 'WX003',
              sparePartNeed: '地感线圈、信号接收器',
              maintenanceDeadline: '2025-01-09 10:00:00',
              createTime: '2025-01-08 11:30:00'
            },
            {
              faultId: 'FZ20250108004',
              faultType: '充电桩故障',
              faultCode: 'CDZ-005',
              areaCode: '350623',
              lotId: 'ZZZP004',
              deviceId: 'CDZ-350623-004',
              deviceType: '交流充电桩',
              faultLocation: '漳州市漳浦县绥安镇市民广场停车场充电桩区',
              influenceRange: '充电接口接触不良，无法充电，覆盖6个充电桩泊位',
              affectedUserCount: 38,
              maintenanceProgress: '未维修',
              maintainUserId: 'WX004',
              sparePartNeed: '充电枪头、接触端子',
              maintenanceDeadline: '2025-01-11 16:00:00',
              createTime: '2025-01-08 14:20:00'
            },
            {
              faultId: 'FZ20250108005',
              faultType: '系统故障',
              faultCode: 'XT-009',
              areaCode: '350622',
              lotId: 'ZZYX005',
              deviceId: 'XT-350622-005',
              deviceType: '停车管理系统服务器',
              faultLocation: '漳州市云霄县莆美镇万达广场停车场中控室',
              influenceRange: '计费系统崩溃，全场32个泊位无法正常计费',
              affectedUserCount: 215,
              maintenanceProgress: '已修复',
              maintainUserId: 'WX005',
              sparePartNeed: '无（系统重启修复）',
              maintenanceDeadline: '2025-01-08 18:00:00',
              createTime: '2025-01-08 08:00:00'
            },
            {
              faultId: 'FZ20250108006',
              faultType: '道闸故障',
              faultCode: 'DZ-008',
              areaCode: '350602',
              lotId: 'ZZXC006',
              deviceId: 'DZ-350602-006',
              deviceType: '智能道闸',
              faultLocation: '漳州市芗城区江滨路停车场入口',
              influenceRange: '道闸下降卡顿，存在安全隐患，覆盖10个泊位',
              affectedUserCount: 75,
              maintenanceProgress: '维修中',
              maintainUserId: 'WX001',
              sparePartNeed: '道闸传动齿轮、限位开关',
              maintenanceDeadline: '2025-01-09 14:00:00',
              createTime: '2025-01-08 15:45:00'
            },
            {
              faultId: 'FZ20250108007',
              faultType: '传感器故障',
              faultCode: 'CGQ-004',
              areaCode: '350603',
              lotId: 'ZZLW007',
              deviceId: 'CGQ-350603-007',
              deviceType: '车位传感器',
              faultLocation: '漳州市龙文区吾悦广场停车场C区',
              influenceRange: '车位状态显示错误，引导系统失效，覆盖20个泊位',
              affectedUserCount: 156,
              maintenanceProgress: '未维修',
              maintainUserId: 'WX003',
              sparePartNeed: '车位传感器探头、无线传输模块',
              maintenanceDeadline: '2025-01-10 10:00:00',
              createTime: '2025-01-08 12:15:00'
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

// 预警事件概览接口
export const fetchAlertEventOverviewList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/alert/event/overview/list`,
      params
    }).then(response => {
      console.log('预警事件概览列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('预警事件概览列表-响应符合实际格式');
        return response.map(item => ({
          alertId: item.alertId,
          alertLevel: item.alertLevel,
          alertType: item.alertType,
          areaCode: item.areaCode,
          lotId: item.lotId,
          roadsideId: item.roadsideId,
          deviceId: item.deviceId,
          alertContent: item.alertContent,
          occurTime: item.occurTime,
          disposalStatus: item.disposalStatus,
          maintainUserId: item.maintainUserId,
          userName: item.userName,
          createTime: item.createTime
        }));
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('预警事件概览列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              alertId: 'AL20250108001',
              alertLevel: '紧急',
              alertType: '泊位故障',
              areaCode: '350602',
              lotId: 'ZZXC001',
              roadsideId: 'LS350602001',
              deviceId: 'DZ-350602-001',
              alertContent: '芗城区新华西商业街停车场出口道闸完全卡死，无法升降，已造成10余辆车拥堵',
              occurTime: '2025-01-08 09:00:00',
              disposalStatus: '处置中',
              maintainUserId: 'WX001',
              userName: '张三',
              createTime: '2025-01-08 09:05:00'
            },
            {
              alertId: 'AL20250108002',
              alertLevel: '严重',
              alertType: '设备离线',
              areaCode: '350603',
              lotId: 'ZZLW002',
              roadsideId: 'LS350603002',
              deviceId: 'XJ-350603-002',
              alertContent: '龙文区蓝田开发区停车场入口车牌识别相机离线，无法自动识别车牌',
              occurTime: '2025-01-08 10:10:00',
              disposalStatus: '未处置',
              maintainUserId: 'WX002',
              userName: '李四',
              createTime: '2025-01-08 10:15:00'
            },
            {
              alertId: 'AL20250108003',
              alertLevel: '一般',
              alertType: '收费异常',
              areaCode: '350604',
              lotId: 'ZZLH003',
              roadsideId: 'LS350604003',
              deviceId: 'JS-350604-003',
              alertContent: '龙海区石码镇锦江广场停车场B区计费系统出现金额计算错误，多收用户费用',
              occurTime: '2025-01-08 11:20:00',
              disposalStatus: '已办结',
              maintainUserId: 'WX003',
              userName: '王五',
              createTime: '2025-01-08 11:25:00'
            },
            {
              alertId: 'AL20250108004',
              alertLevel: '提示',
              alertType: '超时长占用',
              areaCode: '350623',
              lotId: 'ZZZP004',
              roadsideId: 'LS350623004',
              deviceId: 'CW-350623-004',
              alertContent: '漳浦县绥安镇市民广场停车场充电桩泊位被车辆占用超8小时，未充电',
              occurTime: '2025-01-08 14:00:00',
              disposalStatus: '未处置',
              maintainUserId: 'WX004',
              userName: '赵六',
              createTime: '2025-01-08 14:05:00'
            },
            {
              alertId: 'AL20250108005',
              alertLevel: '紧急',
              alertType: '逃费预警',
              areaCode: '350622',
              lotId: 'ZZYX005',
              roadsideId: 'LS350622005',
              deviceId: 'TZ-350622-005',
              alertContent: '云霄县莆美镇万达广场停车场有多辆车尾随前车逃费离场，累计逃费金额超500元',
              occurTime: '2025-01-08 07:50:00',
              disposalStatus: '超时',
              maintainUserId: 'WX005',
              userName: '钱七',
              createTime: '2025-01-08 07:55:00'
            },
            {
              alertId: 'AL20250108006',
              alertLevel: '严重',
              alertType: '消防安全预警',
              areaCode: '350602',
              lotId: 'ZZXC006',
              roadsideId: 'LS350602006',
              deviceId: 'XF-350602-006',
              alertContent: '芗城区江滨路停车场入口消防栓水压不足，存在消防安全隐患',
              occurTime: '2025-01-08 15:30:00',
              disposalStatus: '处置中',
              maintainUserId: 'WX001',
              userName: '张三',
              createTime: '2025-01-08 15:35:00'
            },
            {
              alertId: 'AL20250108007',
              alertLevel: '一般',
              alertType: '设备离线',
              areaCode: '350603',
              lotId: 'ZZLW007',
              roadsideId: 'LS350603007',
              deviceId: 'CGQ-350603-007',
              alertContent: '龙文区吾悦广场停车场C区车位传感器批量离线，车位状态无法更新',
              occurTime: '2025-01-08 12:10:00',
              disposalStatus: '已办结',
              maintainUserId: 'WX003',
              userName: '王五',
              createTime: '2025-01-08 12:15:00'
            }
          ]);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchAlertEventOverviewList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 隐患预警视图接口
export const fetchHiddenDangerWarningList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/hidden/danger/warning/list`,
      params
    }).then(response => {
      console.log('隐患预警列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('隐患预警列表-响应符合实际格式');
        return response.map(item => ({
          hiddenDangerId: item.hiddenDangerId,
          hiddenDangerLevel: item.hiddenDangerLevel,
          areaCode: '350602',
          lotId: item.lotId,
          roadsideId: item.roadsideId,
          hiddenDangerType: item.hiddenDangerType,
          influenceRange: item.influenceRange,
          rectificationRequirement: item.rectificationRequirement,
          rectificationDeadline: item.rectificationDeadline,
          responsibleUnit: item.responsibleUnit,
          responsiblePerson: item.responsiblePerson,
          rectificationMeasure: item.rectificationMeasure,
          rectificationStatus: item.rectificationStatus,
          createTime: item.createTime
        }));
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('隐患预警列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              hiddenDangerId: 'YH20250108001',
              hiddenDangerLevel: '重大',
              areaCode: '350602',
              lotId: 'ZZXC001',
              roadsideId: 'LS350602001',
              hiddenDangerType: '消防通道占用隐患',
              influenceRange: '芗城区新华西商业街停车场消防通道被车辆占用，覆盖约200㎡消防区域',
              rectificationRequirement: '立即清理占用车辆，设置禁停标识，安排专人值守',
              rectificationDeadline: '2025-01-09 12:00:00',
              responsibleUnit: '漳州市芗城区停车场管理中心',
              responsiblePerson: '张三',
              rectificationMeasure: '联系拖车清理占用车辆，安装消防通道禁停护栏，新增24小时监控',
              rectificationStatus: '整改中',
              createTime: '2025-01-08 08:30:00'
            },
            {
              hiddenDangerId: 'YH20250108002',
              hiddenDangerLevel: '较大',
              areaCode: '350603',
              lotId: 'ZZLW002',
              roadsideId: 'LS350603002',
              hiddenDangerType: '设备老化',
              influenceRange: '龙文区蓝田开发区停车场入口道闸设备老化，故障率达30%，覆盖8个泊位',
              rectificationRequirement: '更换老化的道闸传动部件，完成设备全面检修',
              rectificationDeadline: '2025-01-10 18:00:00',
              responsibleUnit: '漳州市龙文区市政设施维护公司',
              responsiblePerson: '李四',
              rectificationMeasure: '采购同型号传动部件，安排工程师上门更换，更换后进行72小时试运行',
              rectificationStatus: '未整改',
              createTime: '2025-01-08 09:15:00'
            },
            {
              hiddenDangerId: 'YH20250108003',
              hiddenDangerLevel: '一般',
              areaCode: '350604',
              lotId: 'ZZLH003',
              roadsideId: 'LS350604003',
              hiddenDangerType: '泊位标线模糊',
              influenceRange: '龙海区石码镇锦江广场停车场B区20个泊位标线模糊，影响车辆停放规范',
              rectificationRequirement: '重新喷涂模糊标线，确保标线清晰可见',
              rectificationDeadline: '2025-01-12 10:00:00',
              responsibleUnit: '漳州市龙海区交通设施工程公司',
              responsiblePerson: '王五',
              rectificationMeasure: '封闭B区停车场，使用热熔涂料重新喷涂泊位标线，喷涂后晾干4小时再开放',
              rectificationStatus: '已完成',
              createTime: '2025-01-08 10:00:00'
            },
            {
              hiddenDangerId: 'YH20250108004',
              hiddenDangerLevel: '较大',
              areaCode: '350623',
              lotId: 'ZZZP004',
              roadsideId: 'LS350623004',
              hiddenDangerType: '收费系统漏洞',
              influenceRange: '漳浦县绥安镇市民广场停车场收费系统存在金额计算漏洞，可能导致费用流失',
              rectificationRequirement: '修复系统漏洞，完成数据对账，加强系统权限管理',
              rectificationDeadline: '2025-01-09 18:00:00',
              responsibleUnit: '漳州市漳浦县智慧停车运营公司',
              responsiblePerson: '赵六',
              rectificationMeasure: '联系系统开发商修复计算漏洞，对近7天收费数据进行核查，新增系统操作日志审计',
              rectificationStatus: '验收通过',
              createTime: '2025-01-08 11:20:00'
            },
            {
              hiddenDangerId: 'YH20250108005',
              hiddenDangerLevel: '一般',
              areaCode: '350622',
              lotId: 'ZZYX005',
              roadsideId: 'LS350622005',
              hiddenDangerType: '泊位标线模糊',
              influenceRange: '云霄县莆美镇万达广场停车场C区15个泊位标线磨损，影响停车引导',
              rectificationRequirement: '补涂磨损标线，定期巡检标线状态',
              rectificationDeadline: '2025-01-11 16:00:00',
              responsibleUnit: '漳州市云霄县物业管理有限公司',
              responsiblePerson: '钱七',
              rectificationMeasure: '采用冷涂涂料补涂标线，建立每月一次的标线巡检机制',
              rectificationStatus: '整改中',
              createTime: '2025-01-08 13:10:00'
            },
            {
              hiddenDangerId: 'YH20250108006',
              hiddenDangerLevel: '重大',
              areaCode: '350602',
              lotId: 'ZZXC006',
              roadsideId: 'LS350602006',
              hiddenDangerType: '消防通道占用隐患',
              influenceRange: '芗城区江滨路停车场消防通道被杂物堆积，应急情况下无法快速通行',
              rectificationRequirement: '立即清理杂物，设置消防通道警示标识，纳入日常巡检',
              rectificationDeadline: '2025-01-08 18:00:00',
              responsibleUnit: '漳州市芗城区停车场管理中心',
              responsiblePerson: '张三',
              rectificationMeasure: '组织人员清理杂物，安装反光警示标识，将消防通道巡检纳入每日工作清单',
              rectificationStatus: '已完成',
              createTime: '2025-01-08 14:30:00'
            },
            {
              hiddenDangerId: 'YH20250108007',
              hiddenDangerLevel: '较大',
              areaCode: '350603',
              lotId: 'ZZLW007',
              roadsideId: 'LS350603007',
              hiddenDangerType: '设备老化',
              influenceRange: '龙文区吾悦广场停车场车位传感器批量老化，数据准确率降至70%',
              rectificationRequirement: '分批更换老化传感器，完成系统校准',
              rectificationDeadline: '2025-01-15 12:00:00',
              responsibleUnit: '漳州市龙文区智慧停车项目部',
              responsiblePerson: '李四',
              rectificationMeasure: '采购100个新传感器，分3批更换，更换后对车位数据进行全量校准',
              rectificationStatus: '未整改',
              createTime: '2025-01-08 15:45:00'
            }
          ]);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchHiddenDangerWarningList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 合规预警视图接口
export const fetchComplianceWarningList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/compliance/warning/list`,
      params
    }).then(response => {
      console.log('合规预警列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('合规预警列表-响应符合实际格式');
        return response.map(item => ({
          complianceWarningId: item.complianceWarningId,
          violationDetail: item.violationDetail,
          complianceStandard: item.complianceStandard,
          rectificationRequirement: item.rectificationRequirement,
          punishmentSuggestion: item.punishmentSuggestion,
          rectificationDeadline: item.rectificationDeadline,
          responsibleSubject: item.responsibleSubject,
          areaCode: item.areaCode,
          lotId: item.lotId,
          warningTime: item.warningTime,
          rectificationStatus: item.rectificationStatus,
          createTime: item.createTime
        }));
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('合规预警列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              complianceWarningId: 'HG20250108001',
              violationDetail: '未按规定公示停车收费标准及投诉电话',
              complianceStandard: '《福建省停车场管理条例》第18条，收费标准需公示并留存备案',
              rectificationRequirement: '立即在停车场入口、出口显眼位置张贴收费公示牌，包含标准及投诉电话',
              punishmentSuggestion: '警告，限期整改',
              rectificationDeadline: '2025-01-09 10:00:00',
              responsibleSubject: '企业',
              areaCode: '350602',
              lotId: 'ZZXC001',
              warningTime: '2025-01-08 08:10:00',
              rectificationStatus: '整改中',
              createTime: '2025-01-08 08:15:00'
            },
            {
              complianceWarningId: 'HG20250108002',
              violationDetail: '消防灭火器过期未年检，消防沙箱为空',
              complianceStandard: '《消防法》第16条，停车场消防设施需定期检查并保持完好有效',
              rectificationRequirement: '更换全部过期灭火器，补齐消防沙箱黄沙，建立消防设施月度巡检台账',
              punishmentSuggestion: '罚款2000元，限期整改',
              rectificationDeadline: '2025-01-09 18:00:00',
              responsibleSubject: '企业',
              areaCode: '350603',
              lotId: 'ZZLW002',
              warningTime: '2025-01-08 09:20:00',
              rectificationStatus: '未整改',
              createTime: '2025-01-08 09:25:00'
            },
            {
              complianceWarningId: 'HG20250108003',
              violationDetail: '擅自增设路侧泊位，占用非机动车道',
              complianceStandard: '《城市道路管理条例》第27条，严禁擅自占用道路设置停车泊位',
              rectificationRequirement: '立即拆除违规增设泊位标线及地锁，恢复非机动车道正常通行',
              punishmentSuggestion: '限期恢复原状，警告处分',
              rectificationDeadline: '2025-01-10 12:00:00',
              responsibleSubject: '部门',
              areaCode: '350604',
              lotId: 'ZZLH003',
              warningTime: '2025-01-08 10:30:00',
              rectificationStatus: '整改中',
              createTime: '2025-01-08 10:35:00'
            },
            {
              complianceWarningId: 'HG20250108004',
              violationDetail: '收费员未开具正规停车发票，存在私收费用行为',
              complianceStandard: '《税收征收管理法》第21条，经营收费需开具合规票据，严禁私收款项',
              rectificationRequirement: '对涉事收费员停岗培训，补开用户发票，安装收费监督摄像头',
              punishmentSuggestion: '对个人罚款500元，企业内部通报批评',
              rectificationDeadline: '2025-01-08 18:00:00',
              responsibleSubject: '个人',
              areaCode: '350623',
              lotId: 'ZZZP004',
              warningTime: '2025-01-08 11:40:00',
              rectificationStatus: '已完成',
              createTime: '2025-01-08 11:45:00'
            },
            {
              complianceWarningId: 'HG20250108005',
              violationDetail: '充电桩区域未设置绝缘垫及安全警示标识',
              complianceStandard: '《电动汽车充电基础设施运营管理规范》第9条，充电区域需配备安全防护设施',
              rectificationRequirement: '铺设绝缘防滑垫，张贴高压危险警示标识，加装应急断电开关',
              punishmentSuggestion: '限期整改，不予处罚',
              rectificationDeadline: '2025-01-11 16:00:00',
              responsibleSubject: '企业',
              areaCode: '350622',
              lotId: 'ZZYX005',
              warningTime: '2025-01-08 13:20:00',
              rectificationStatus: '整改中',
              createTime: '2025-01-08 13:25:00'
            },
            {
              complianceWarningId: 'HG20250108006',
              violationDetail: '停车场出入口道闸未设置防砸雷达，存在安全隐患',
              complianceStandard: '《机械式停车设备安全规范》第7条，道闸需加装防砸及感应装置',
              rectificationRequirement: '为所有道闸加装防砸雷达及红外感应，完成安全调试后投入使用',
              punishmentSuggestion: '限期整改，逾期未改处1000元罚款',
              rectificationDeadline: '2025-01-12 10:00:00',
              responsibleSubject: '企业',
              areaCode: '350602',
              lotId: 'ZZXC006',
              warningTime: '2025-01-08 14:50:00',
              rectificationStatus: '未整改',
              createTime: '2025-01-08 14:55:00'
            },
            {
              complianceWarningId: 'HG20250108007',
              violationDetail: '未按时上报停车场月度运营数据及安全台账',
              complianceStandard: '《漳州智慧停车管理办法》第23条，运营单位需每月5日前上报相关台账',
              rectificationRequirement: '补报往期缺失台账，安排专人负责月度数据上报工作',
              punishmentSuggestion: '口头警告，限期补报',
              rectificationDeadline: '2025-01-09 12:00:00',
              responsibleSubject: '部门',
              areaCode: '350603',
              lotId: 'ZZLW007',
              warningTime: '2025-01-08 15:30:00',
              rectificationStatus: '已完成',
              createTime: '2025-01-08 15:35:00'
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

// 专项预警视图接口
export const fetchSpecialWarningList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/special/warning/list`,
      params
    }).then(response => {
      console.log('专项预警列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('专项预警列表-响应符合实际格式');
        return response.map(item => ({
          specialWarningId: item.specialWarningId,
          warningScene: item.warningScene,
          alertType: item.alertType,
          areaCode: item.areaCode,
          lotId: item.lotId,
          roadsideId: item.roadsideId,
          deviceId: item.deviceId,
          alertContent: item.alertContent,
          occurTime: item.occurTime,
          disposalStatus: item.disposalStatus,
          disposalMeasure: item.disposalMeasure,
          videoUrl: item.videoUrl,
          createTime: item.createTime
        }));
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('专项预警列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              specialWarningId: 'ZX20250108001',
              warningScene: '泊位类',
              alertType: '泊位占用异常',
              areaCode: '350602',
              lotId: 'ZZXC001',
              roadsideId: 'LS350602001',
              deviceId: 'CW-350602-001',
              alertContent: '芗城区新华西商业街停车场VIP泊位被普通车辆占用超12小时，车主拒不配合挪车',
              occurTime: '2025-01-08 08:20:00',
              disposalStatus: '处置中',
              disposalMeasure: '联系交警部门协助挪车，张贴泊位专属标识，加装地锁管控',
              videoUrl: 'https://video.zhangzhou-parking.com/ZX20250108001.mp4',
              createTime: '2025-01-08 08:25:00'
            },
            {
              specialWarningId: 'ZX20250108002',
              warningScene: '设备类',
              alertType: '设备频繁离线',
              areaCode: '350603',
              lotId: 'ZZLW002',
              roadsideId: 'LS350603002',
              deviceId: 'CGQ-350603-002',
              alertContent: '龙文区蓝田开发区停车场车位传感器单日离线超10次，数据上传中断，影响车位引导',
              occurTime: '2025-01-08 09:30:00',
              disposalStatus: '未处置',
              disposalMeasure: '检查传感器网络线路，更换故障天线，升级设备固件版本',
              videoUrl: 'https://video.zhangzhou-parking.com/ZX20250108002.mp4',
              createTime: '2025-01-08 09:35:00'
            },
            {
              specialWarningId: 'ZX20250108003',
              warningScene: '收费类',
              alertType: '支付通道故障',
              areaCode: '350604',
              lotId: 'ZZLH003',
              roadsideId: 'LS350604003',
              deviceId: 'ZF-350604-003',
              alertContent: '龙海区石码镇锦江广场停车场微信支付通道崩溃，车主无法扫码缴费，造成出口拥堵',
              occurTime: '2025-01-08 11:10:00',
              disposalStatus: '已办结',
              disposalMeasure: '紧急切换备用支付通道，联系支付服务商修复接口，增派人工收费窗口',
              videoUrl: 'https://video.zhangzhou-parking.com/ZX20250108003.mp4',
              createTime: '2025-01-08 11:15:00'
            },
            {
              specialWarningId: 'ZX20250108004',
              warningScene: '安全类',
              alertType: '人员闯入禁行区',
              areaCode: '350623',
              lotId: 'ZZZP004',
              roadsideId: 'LS350623004',
              deviceId: 'RK-350623-004',
              alertContent: '漳浦县绥安镇市民广场停车场配电房区域有无关人员闯入，触碰高压设备，存在触电风险',
              occurTime: '2025-01-08 14:20:00',
              disposalStatus: '处置中',
              disposalMeasure: '现场驱离无关人员，加装防爬护栏及警示灯带，增设24小时安保巡逻岗',
              videoUrl: 'https://video.zhangzhou-parking.com/ZX20250108004.mp4',
              createTime: '2025-01-08 14:25:00'
            },
            {
              specialWarningId: 'ZX20250108005',
              warningScene: '设备类',
              alertType: '道闸防砸失效',
              areaCode: '350622',
              lotId: 'ZZYX005',
              roadsideId: 'LS350622005',
              deviceId: 'DZ-350622-005',
              alertContent: '云霄县莆美镇万达广场停车场出口道闸防砸雷达故障，砸中通行车辆，造成车辆剐蹭',
              occurTime: '2025-01-08 07:40:00',
              disposalStatus: '超时',
              disposalMeasure: '更换故障防砸雷达，调试红外感应装置，对车主进行赔偿协商，整改安全隐患',
              videoUrl: 'https://video.zhangzhou-parking.com/ZX20250108005.mp4',
              createTime: '2025-01-08 07:45:00'
            },
            {
              specialWarningId: 'ZX20250108006',
              warningScene: '泊位类',
              alertType: '车位标线磨损',
              areaCode: '350602',
              lotId: 'ZZXC006',
              roadsideId: 'LS350602006',
              deviceId: 'BX-350602-006',
              alertContent: '芗城区江滨路停车场新能源车位标线严重磨损，车主无法识别，燃油车占用充电泊位',
              occurTime: '2025-01-08 15:50:00',
              disposalStatus: '未处置',
              disposalMeasure: '重新喷涂新能源车位专属彩色标线，加装车位识别指示牌，安排人员现场引导',
              videoUrl: 'https://video.zhangzhou-parking.com/ZX20250108006.mp4',
              createTime: '2025-01-08 15:55:00'
            },
            {
              specialWarningId: 'ZX20250108007',
              warningScene: '安全类',
              alertType: '消防通道堵塞',
              areaCode: '350603',
              lotId: 'ZZLW007',
              roadsideId: 'LS350603007',
              deviceId: 'XF-350603-007',
              alertContent: '龙文区吾悦广场停车场消防通道被私家车堵塞，消防门无法正常开启，存在消防安全隐患',
              occurTime: '2025-01-08 12:30:00',
              disposalStatus: '已办结',
              disposalMeasure: '联系车主挪车，加装消防通道禁停桩，张贴违法占用处罚公示，联动消防部门巡检',
              videoUrl: 'https://video.zhangzhou-parking.com/ZX20250108007.mp4',
              createTime: '2025-01-08 12:35:00'
            }
          ]);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchSpecialWarningList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 异常时长聚合统计
export const fetchAbnormalWarningDurationSummary = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/abnormal/warning/duration/summary`,
      params
    }).then(response => {
      console.log('异常时长统计-接口请求成功');
      if (response && typeof response === 'object' && !Array.isArray(response)) {
        console.log('异常时长统计-响应符合实际格式');
        return {
          avgAbnormalDuration: response.avgAbnormalDuration,
          maxAbnormalDuration: response.maxAbnormalDuration,
          minAbnormalDuration: response.minAbnormalDuration,
          totalAbnormalDuration: response.totalAbnormalDuration
        };
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('异常时长统计接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            avgAbnormalDuration: '45分钟',
            maxAbnormalDuration: '5小时20分钟',
            minAbnormalDuration: '6分钟',
            totalAbnormalDuration: '26小时48分钟'
          });
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchAbnormalWarningDurationSummary 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      avgAbnormalDuration: '0分钟',
      maxAbnormalDuration: '0分钟',
      minAbnormalDuration: '0分钟',
      totalAbnormalDuration: '0分钟'
    });
  }
};

// 处置进度耗时聚合统计
export const fetchDisposalProgressDurationSummary = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/disposal/progress/duration/summary`,
      params
    }).then(response => {
      console.log('处置进度耗时统计-接口请求成功');
      if (response && typeof response === 'object' && !Array.isArray(response)) {
        console.log('处置进度耗时统计-响应符合实际格式');
        return {
          occurToDispatchDuration: response.occurToDispatchDuration,
          dispatchToReceiveDuration: response.dispatchToReceiveDuration,
          receiveToDisposalDuration: response.receiveToDisposalDuration,
          disposalToFeedbackDuration: response.disposalToFeedbackDuration,
          feedbackToAcceptanceDuration: response.feedbackToAcceptanceDuration,
          acceptanceToCloseDuration: response.acceptanceToCloseDuration,
          alertDisposalTotalDuration: response.alertDisposalTotalDuration
        };
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('处置进度耗时统计接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            occurToDispatchDuration: '18分钟',
            dispatchToReceiveDuration: '12分钟',
            receiveToDisposalDuration: '38分钟',
            disposalToFeedbackDuration: '1小时45分钟',
            feedbackToAcceptanceDuration: '42分钟',
            acceptanceToCloseDuration: '15分钟',
            alertDisposalTotalDuration: '3小时30分钟'
          });
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchDisposalProgressDurationSummary 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      occurToDispatchDuration: '0分钟',
      dispatchToReceiveDuration: '0分钟',
      receiveToDisposalDuration: '0分钟',
      disposalToFeedbackDuration: '0分钟',
      feedbackToAcceptanceDuration: '0分钟',
      acceptanceToCloseDuration: '0分钟',
      alertDisposalTotalDuration: '0分钟'
    });
  }
};

// 处置进度追踪列表
export const fetchDisposalProgressTrackingList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/disposal/progress/tracking/list`,
      params
    }).then(response => {
      console.log('处置进度追踪列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('处置进度追踪列表-响应符合实际格式');
        return response.map(item => ({
          alertId: item.alertId,
          alertContent: item.alertContent,
          occurTime: item.occurTime,
          dispatchTime: item.dispatchTime,
          receiveTime: item.receiveTime,
          disposalTime: item.disposalTime,
          feedbackTime: item.feedbackTime,
          acceptanceTime: item.acceptanceTime,
          closeTime: item.closeTime,
          maintainUserId: item.maintainUserId,
          disposalMeasure: item.disposalMeasure,
          disposalResult: item.disposalResult,
          attachmentUrl: item.attachmentUrl,
          updateTime: item.updateTime
        }));
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('处置进度追踪列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              alertId: 'DP20250108001',
              alertContent: '芗城区新华西商业街停车场出口道闸卡死，车辆无法离场造成拥堵',
              occurTime: '2025-01-08 09:00:00',
              dispatchTime: '2025-01-08 09:15:00',
              receiveTime: '2025-01-08 09:23:00',
              disposalTime: '2025-01-08 09:55:00',
              feedbackTime: '2025-01-08 11:20:00',
              acceptanceTime: '2025-01-08 12:00:00',
              closeTime: '2025-01-08 12:12:00',
              maintainUserId: 'WX001',
              disposalMeasure: '更换道闸控制主板及传动齿轮，调试升降限位功能，现场测试运行正常',
              disposalResult: '处置成功',
              attachmentUrl: 'https://file.zhangzhou-parking.com/attachment/DP20250108001.pdf',
              updateTime: '2025-01-08 12:15:00'
            },
            {
              alertId: 'DP20250108002',
              alertContent: '龙文区蓝田开发区停车场车牌识别相机离线，无法自动抬杆通行',
              occurTime: '2025-01-08 10:10:00',
              dispatchTime: '2025-01-08 10:32:00',
              receiveTime: '2025-01-08 10:47:00',
              disposalTime: '2025-01-08 11:32:00',
              feedbackTime: '2025-01-08 13:42:00',
              acceptanceTime: '2025-01-08 14:37:00',
              closeTime: '2025-01-08 14:55:00',
              maintainUserId: 'WX002',
              disposalMeasure: '重新插拔相机网络线路，升级识别算法固件，测试车牌识别准确率达99.8%',
              disposalResult: '处置成功',
              attachmentUrl: 'https://file.zhangzhou-parking.com/attachment/DP20250108002.pdf',
              updateTime: '2025-01-08 14:58:00'
            },
            {
              alertId: 'DP20250108003',
              alertContent: '龙海区石码镇锦江广场计费系统金额计算错误，多收取用户停车费用',
              occurTime: '2025-01-08 11:20:00',
              dispatchTime: '2025-01-08 11:28:00',
              receiveTime: '2025-01-08 11:33:00',
              disposalTime: '2025-01-08 11:53:00',
              feedbackTime: '2025-01-08 12:43:00',
              acceptanceTime: '2025-01-08 13:08:00',
              closeTime: '2025-01-08 13:16:00',
              maintainUserId: 'WX003',
              disposalMeasure: '修复计费系统计算公式漏洞，对多收费用进行原路退还，核查近7天计费数据',
              disposalResult: '处置成功',
              attachmentUrl: 'https://file.zhangzhou-parking.com/attachment/DP20250108003.pdf',
              updateTime: '2025-01-08 13:19:00'
            },
            {
              alertId: 'DP20250108004',
              alertContent: '漳浦县绥安镇充电桩泊位被燃油车占用超8小时，新能源车主无法充电',
              occurTime: '2025-01-08 14:00:00',
              dispatchTime: '2025-01-08 14:30:00',
              receiveTime: '2025-01-08 14:52:00',
              disposalTime: '2025-01-08 15:57:00',
              feedbackTime: '2025-01-08 19:07:00',
              acceptanceTime: '2025-01-08 20:27:00',
              closeTime: '2025-01-08 20:52:00',
              maintainUserId: 'WX004',
              disposalMeasure: '联系车主挪车，加装新能源车位地锁，张贴禁停标识，安排现场人员引导',
              disposalResult: '处置成功',
              attachmentUrl: 'https://file.zhangzhou-parking.com/attachment/DP20250108004.pdf',
              updateTime: '2025-01-08 20:55:00'
            },
            {
              alertId: 'DP20250108005',
              alertContent: '云霄县万达广场多辆车尾随前车逃费离场，累计逃费金额超500元',
              occurTime: '2025-01-08 07:50:00',
              dispatchTime: '2025-01-08 08:02:00',
              receiveTime: '',
              disposalTime: '',
              feedbackTime: '',
              acceptanceTime: '',
              closeTime: '',
              maintainUserId: 'WX005',
              disposalMeasure: '待指派运维人员现场核实，加装防逃费识别摄像头，联动保安现场值守',
              disposalResult: '处置中',
              attachmentUrl: '',
              updateTime: '2025-01-08 08:05:00'
            },
            {
              alertId: 'DP20250108006',
              alertContent: '芗城区江滨路停车场消防栓水压不足，存在消防安全重大隐患',
              occurTime: '2025-01-08 15:30:00',
              dispatchTime: '2025-01-08 15:48:00',
              receiveTime: '2025-01-08 15:58:00',
              disposalTime: '2025-01-08 16:26:00',
              feedbackTime: '2025-01-08 17:41:00',
              acceptanceTime: '2025-01-08 18:16:00',
              closeTime: '2025-01-08 18:26:00',
              maintainUserId: 'WX001',
              disposalMeasure: '检修消防水泵增压系统，更换老化消防水管，补水加压后测试水压达标',
              disposalResult: '处置成功',
              attachmentUrl: 'https://file.zhangzhou-parking.com/attachment/DP20250108006.pdf',
              updateTime: '2025-01-08 18:29:00'
            },
            {
              alertId: 'DP20250108007',
              alertContent: '龙文区吾悦广场车位传感器批量离线，车位状态显示错误引导失效',
              occurTime: '2025-01-08 12:10:00',
              dispatchTime: '2025-01-08 12:35:00',
              receiveTime: '2025-01-08 12:51:00',
              disposalTime: '2025-01-08 13:41:00',
              feedbackTime: '2025-01-08 16:11:00',
              acceptanceTime: '2025-01-08 16:56:00',
              closeTime: '2025-01-08 17:16:00',
              maintainUserId: 'WX003',
              disposalMeasure: '更换故障传感器电池及信号模块，重新组网调试，车位数据准确率恢复正常',
              disposalResult: '处置成功',
              attachmentUrl: 'https://file.zhangzhou-parking.com/attachment/DP20250108007.pdf',
              updateTime: '2025-01-08 17:19:00'
            }
          ]);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchDisposalProgressTrackingList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 异常预警视图列表
export const fetchAbnormalWarningList = (params = {}) => {
  try {
    return requestClient.get({
      url: `${BASE_URL}/abnormal/warning/list`,
      params
    }).then(response => {
      console.log('异常预警列表-接口请求成功');
      if (response && Array.isArray(response)) {
        console.log('异常预警列表-响应符合实际格式');
        return response.map(item => ({
          // ===== 仅保留9个列表展示核心业务字段【一字不差严格匹配】=====
          abnormalId: item.abnormalId,
          abnormalType: item.abnormalType,
          abnormalReason: item.abnormalReason,
          influenceRange: item.influenceRange,
          relieveTime: item.relieveTime,
          relieveReason: item.relieveReason,
          areaCode: item.areaCode,
          lotId: item.lotId,
          createTime: item.createTime
        }));
      }
      throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
    }).catch(error => {
      console.log('异常预警列表接口调用失败-使用模拟数据兜底', error.message);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              abnormalId: 'YC20250108001',
              abnormalType: '数据异常',
              abnormalReason: '泊位传感器数据上传延迟，车位占用状态与实际不符，数据同步超时',
              influenceRange: '芗城区新华西商业街停车场25个泊位数据异常，覆盖3个出入口',
              relieveTime: '2025-01-08 10:30:00',
              relieveReason: '重启数据采集网关，修复网络传输卡顿问题，重新校准传感器数据',
              areaCode: '350602',
              lotId: 'ZZXC001',
              createTime: '2025-01-08 09:15:00'
            },
            {
              abnormalId: 'YC20250108002',
              abnormalType: '收费异常',
              abnormalReason: '停车计费系统费率配置错误，夜间停车费用翻倍计算，导致用户投诉',
              influenceRange: '龙文区蓝田开发区停车场全场42个泊位计费异常，涉及用户68人',
              relieveTime: '2025-01-08 11:45:00',
              relieveReason: '修正计费系统费率模板，对多收费用原路退还，重启计费服务生效',
              areaCode: '350603',
              lotId: 'ZZLW002',
              createTime: '2025-01-08 10:05:00'
            },
            {
              abnormalId: 'YC20250108003',
              abnormalType: '诱导信息异常',
              abnormalReason: '车位诱导屏显示数据错误，空余车位数量与实际偏差过大，误导车主停车',
              influenceRange: '龙海区石码镇锦江广场停车场B区30个泊位诱导异常，覆盖2个诱导屏',
              relieveTime: '2025-01-08 13:20:00',
              relieveReason: '重新同步车位数据至诱导屏，校准显示参数，升级诱导系统固件版本',
              areaCode: '350604',
              lotId: 'ZZLH003',
              createTime: '2025-01-08 11:10:00'
            },
            {
              abnormalId: 'YC20250108004',
              abnormalType: '流程异常',
              abnormalReason: '停车离场审核流程卡顿，车主缴费后无法自动抬杆，需人工干预放行',
              influenceRange: '漳浦县绥安镇市民广场停车场出口2个道闸，日均影响离场车辆120辆',
              relieveTime: '2025-01-08 15:50:00',
              relieveReason: '优化离场审核接口逻辑，清理系统缓存，修复流程阻塞BUG',
              areaCode: '350623',
              lotId: 'ZZZP004',
              createTime: '2025-01-08 14:00:00'
            },
            {
              abnormalId: 'YC20250108005',
              abnormalType: '数据异常',
              abnormalReason: '充电桩功率数据采集失败，充电量统计不准，无法生成充电明细账单',
              influenceRange: '云霄县莆美镇万达广场停车场6个充电桩泊位，涉及新能源车主35人',
              relieveTime: '',
              relieveReason: '',
              areaCode: '350622',
              lotId: 'ZZYX005',
              createTime: '2025-01-08 12:30:00'
            },
            {
              abnormalId: 'YC20250108006',
              abnormalType: '收费异常',
              abnormalReason: '扫码支付通道对接超时，车主付款后订单状态未同步，显示未缴费',
              influenceRange: '芗城区江滨路停车场入口1个收费岗亭，出口2个自助缴费机',
              relieveTime: '2025-01-08 16:10:00',
              relieveReason: '切换备用支付通道，联系支付服务商修复接口，手动同步未完成订单状态',
              areaCode: '350602',
              lotId: 'ZZXC006',
              createTime: '2025-01-08 15:00:00'
            },
            {
              abnormalId: 'YC20250108007',
              abnormalType: '流程异常',
              abnormalReason: '泊位预约审核流程失效，预约车位被占用，预约用户无法正常停车',
              influenceRange: '龙文区吾悦广场停车场10个预约专属泊位，日均影响预约用户20人',
              relieveTime: '',
              relieveReason: '',
              areaCode: '350603',
              lotId: 'ZZLW007',
              createTime: '2025-01-08 13:45:00'
            }
          ]);
        }, 500);
      });
    });
  } catch (error) {
    console.error('===== fetchAbnormalWarningList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};
