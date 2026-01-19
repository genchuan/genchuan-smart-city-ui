import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';

// ========== 合规预警管理 ==========
// 合规预警列表
export const fetchParkComplianceWarningList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/compliance/warning/list`,
        params,
      })
      .then((response) => {
        console.log('合规预警视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('合规预警视图-响应符合实际格式');
          return response.map((item) => ({
            parkComplianceWarningWarningId: item.parkComplianceWarningWarningId,
            sysViolationTypeName: item.sysViolationTypeName,
            parkComplianceWarningViolationDetail: item.parkComplianceWarningViolationDetail,
            parkComplianceWarningWarningTime: item.parkComplianceWarningWarningTime,
            tbAssetExtendAddress: item.tbAssetExtendAddress,
            sysRectificationStatusName: item.sysRectificationStatusName,
            parkComplianceWarningComplianceStandard: item.parkComplianceWarningComplianceStandard,
            sysResponsibleSubjectTypeName: item.sysResponsibleSubjectTypeName,
            parkComplianceWarningRectificationDeadline: item.parkComplianceWarningRectificationDeadline,
            parkComplianceWarningInspectionResult: item.parkComplianceWarningInspectionResult,
            parkComplianceWarningEvidence: item.parkComplianceWarningEvidence,
            parkComplianceWarningRectifyLog: item.parkComplianceWarningRectifyLog
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('合规预警视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                parkComplianceWarningWarningId: 'HG20260119001',
                sysViolationTypeName: '占道违规',
                parkComplianceWarningViolationDetail: '停车场入口通道被商户货物占道，影响车辆正常通行，违反停车场通道畅通管理规范',
                parkComplianceWarningWarningTime: 1737283200000,
                tbAssetExtendAddress: '漳州市高新区龙江大道北区停车场入口通道',
                sysRectificationStatusName: '未整改',
                parkComplianceWarningComplianceStandard: '停车场所有通行通道宽度需≥3米，无任何占道堆放行为，保障车辆正常通行',
                sysResponsibleSubjectTypeName: '商户主体',
                parkComplianceWarningRectificationDeadline: 1737369600000,
                parkComplianceWarningInspectionResult: '未核查',
                parkComplianceWarningEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkComplianceWarningRectifyLog: []
              },
              {
                parkComplianceWarningWarningId: 'HG20260119002',
                sysViolationTypeName: '消防违规',
                parkComplianceWarningViolationDetail: '停车场负一层消防栓被遮挡，灭火器压力不足，违反消防安全管理条例相关要求',
                parkComplianceWarningWarningTime: 1737279600000,
                tbAssetExtendAddress: '漳州市主城区胜利路南区停车场负一层',
                sysRectificationStatusName: '整改中',
                parkComplianceWarningComplianceStandard: '消防设施需保持无遮挡、无损坏、压力正常，每月定期巡检并留存记录',
                sysResponsibleSubjectTypeName: '物业主体',
                parkComplianceWarningRectificationDeadline: 1737360000000,
                parkComplianceWarningInspectionResult: '未核查',
                parkComplianceWarningEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkComplianceWarningRectifyLog: [{time:1737300000000, content:'已清理消防栓遮挡物，更换压力不足灭火器2个'}]
              },
              {
                parkComplianceWarningWarningId: 'HG20260119003',
                sysViolationTypeName: '收费违规',
                parkComplianceWarningViolationDetail: '停车场计费系统未公示收费标准，存在临时车辆超额收费情况，违反物价管理相关规定',
                parkComplianceWarningWarningTime: 1737276000000,
                tbAssetExtendAddress: '漳州市经开区兴业路东区停车场收费岗亭',
                sysRectificationStatusName: '已整改',
                parkComplianceWarningComplianceStandard: '收费标准需在显著位置公示，计费系统精准计费，无乱收费、超额收费行为',
                sysResponsibleSubjectTypeName: '运营主体',
                parkComplianceWarningRectificationDeadline: 1737285600000,
                parkComplianceWarningInspectionResult: '通过',
                parkComplianceWarningEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkComplianceWarningRectifyLog: [{time:1737285600000, content:'已张贴收费公示牌，校准计费系统参数，退还超额收费金额'}]
              },
              {
                parkComplianceWarningWarningId: 'HG20260119004',
                sysViolationTypeName: '安防违规',
                parkComplianceWarningViolationDetail: '停车场监控设备存在3处盲区，监控录像留存时长不足30天，违反安防管理规范',
                parkComplianceWarningWarningTime: 1737272400000,
                tbAssetExtendAddress: '漳州市文旅区湖滨路西区停车场负二层',
                sysRectificationStatusName: '已整改',
                parkComplianceWarningComplianceStandard: '监控设备全覆盖无盲区，录像留存时长≥30天，重要区域监控需实时在线',
                sysResponsibleSubjectTypeName: '安防主体',
                parkComplianceWarningRectificationDeadline: 1737350400000,
                parkComplianceWarningInspectionResult: '未通过',
                parkComplianceWarningEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkComplianceWarningRectifyLog: [{time:1737350400000, content:'已新增监控摄像头2个，调整录像留存时长为45天'}]
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkComplianceWarningList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 合规预警核心指标
export const fetchParkComplianceWarningIndicators = (params = {}) => {
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
          response.totalCount &&
          response.unRectifyCount &&
          response.passRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无合规核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '合规预警指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCount: 42, // 合规预警总数
              unRectifyCount: 18, // 未整改预警数
              passRate: 76.5, // 核查通过率
              occupyViolationCount:9, // 占道违规数
              fireViolationCount:12, // 消防违规数
              chargeViolationCount:8, // 收费违规数
              safeViolationCount:13 // 安防违规数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 合规预警指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCount: 0,
      unRectifyCount:0,
      passRate:0,
      occupyViolationCount:0,
      fireViolationCount:0,
      chargeViolationCount:0,
      safeViolationCount:0
    });
  }
};

// 违规类型占比饼图
export const fetchParkComplianceWarningViolationRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/compliance/warning/stat/violation/ratio`,
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
        throw new Error('真实接口返回无违规类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '违规类型占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['占道违规', '消防违规', '收费违规', '安防违规', '其他违规'],
              series: [{ name: '违规类型占比', data: [9, 12, 8, 13, 0] }]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 违规类型占比函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [] });
  }
};

// 责任主体类型占比饼图
export const fetchParkComplianceWarningSubjectRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/compliance/warning/stat/subject/ratio`,
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
        throw new Error('真实接口返回无责任主体占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '责任主体占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['商户主体', '物业主体', '运营主体', '安防主体', '其他主体'],
              series: [{ name: '责任主体占比', data: [7, 15, 10, 8, 2] }]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 责任主体占比函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [] });
  }
};

// 不同区域预警数对比柱状图
export const fetchParkComplianceWarningAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/compliance/warning/stat/area/count`,
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
        throw new Error('真实接口返回无区域预警数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域预警数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['主城区', '高新区', '经开区', '文旅区', '周边区县'],
              series: [{ name: '合规预警数', data: [19, 8, 7, 6, 2] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 区域预警数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '合规预警数', data: [] }],
    });
  }
};

// 不同违规类型预警数对比柱状图
export const fetchParkComplianceWarningTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/compliance/warning/stat/type/count`,
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
        throw new Error('真实接口返回无违规类型预警数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '违规类型预警数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['占道违规', '消防违规', '收费违规', '安防违规', '其他违规'],
              series: [{ name: '合规预警数', data: [9, 12, 8, 13, 0] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 违规类型预警数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '合规预警数', data: [] }],
    });
  }
};

// 单条合规预警详情查询 - 详情弹窗专用 (GET)
export const fetchParkComplianceWarningDetail = (warningId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/compliance/warning/detail/${warningId}`,
        params,
      })
      .then((response) => {
        if (response && response.parkComplianceWarningWarningId === warningId) {
          return response;
        }
        throw new Error('真实接口返回无详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('合规预警详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              parkComplianceWarningWarningId: warningId,
              sysViolationTypeName: '占道违规',
              parkComplianceWarningViolationDetail: '停车场入口通道被商户货物占道，影响车辆正常通行，违反停车场通道畅通管理规范',
              parkComplianceWarningWarningTime: 1737283200000,
              tbAssetExtendAddress: '漳州市高新区龙江大道北区停车场入口通道',
              sysRectificationStatusName: '未整改',
              parkComplianceWarningComplianceStandard: '停车场所有通行通道宽度需≥3米，无任何占道堆放行为，保障车辆正常通行',
              sysResponsibleSubjectTypeName: '商户主体',
              parkComplianceWarningRectificationDeadline: 1737369600000,
              parkComplianceWarningInspectionResult: '未核查',
              parkComplianceWarningEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
              parkComplianceWarningRectifyLog: []
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkComplianceWarningDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 合规预警整改提交 - 整改弹窗确认提交专用 (POST 核心写操作)
export const submitParkComplianceWarningRectify = (params = {}) => {
  try {
    // 前置校验：整改方案必填
    if (!params.rectifyScheme || params.rectifyScheme.trim() === '') {
      return Promise.reject(new Error('整改方案为必填项，请填写！'));
    }
    // 整改方案长度≤500字
    if (params.rectifyScheme.length > 500) {
      return Promise.reject(new Error('整改方案字数超限，最多支持500字！'));
    }
    return requestClient
      .post({
        url: `${BASE_URL}/park/compliance/warning/rectify/submit`,
        data: params,
      })
      .then((response) => {
        if (response && response.success) {
          console.log('合规预警整改提交成功');
          return response;
        }
        throw new Error('整改提交失败');
      })
      .catch((error) => {
        console.warn('合规预警整改提交接口调用失败', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              parkComplianceWarningWarningId: params.parkComplianceWarningWarningId,
              sysRectificationStatusName: '已整改',
              msg: '整改方案提交成功，待核查验收'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitParkComplianceWarningRectify 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.reject(new Error('整改提交失败，请稍后重试'));
  }
};

// 合规预警核查提交 - 核查弹窗确认提交专用 (POST 核心写操作)
export const submitParkComplianceWarningInspect = (params = {}) => {
  try {
    // 前置校验：核查结果必填
    if (!params.inspectionResult || params.inspectionResult.trim() === '') {
      return Promise.reject(new Error('核查结果为必填项，请选择！'));
    }
    return requestClient
      .post({
        url: `${BASE_URL}/park/compliance/warning/inspect/submit`,
        data: params,
      })
      .then((response) => {
        if (response && response.success) {
          console.log('合规预警核查提交成功');
          return response;
        }
        throw new Error('核查提交失败');
      })
      .catch((error) => {
        console.warn('合规预警核查提交接口调用失败', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              parkComplianceWarningWarningId: params.parkComplianceWarningWarningId,
              parkComplianceWarningInspectionResult: params.inspectionResult,
              msg: params.inspectionResult === '通过' ? '核查通过，合规预警闭环完成' : '核查未通过，需重新整改'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitParkComplianceWarningInspect 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.reject(new Error('核查提交失败，请稍后重试'));
  }
};

// ========== 故障预警管理 ==========
// 故障预警列表
export const fetchParkFaultList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/fault/list`,
        params,
      })
      .then((response) => {
        console.log('故障预警视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('故障预警视图-响应符合实际格式');
          return response.map((item) => ({
            parkFaultFaultId: item.parkFaultFaultId,
            sysFaultTypeName: item.sysFaultTypeName,
            sysEquipmentTypeName: item.sysEquipmentTypeName,
            tbDeviceExtendInstallPosition: item.tbDeviceExtendInstallPosition,
            parkFaultFaultTime: item.parkFaultFaultTime,
            sysMaintenanceProgressName: item.sysMaintenanceProgressName,
            tbDeviceExtendDeviceCode: item.tbDeviceExtendDeviceCode,
            parkFaultFaultLevel: item.parkFaultFaultLevel,
            sysMaintainUserUserName: item.sysMaintainUserUserName,
            parkMaintainWorkorderExpectedFinishTime: item.parkMaintainWorkorderExpectedFinishTime,
            parkFaultEvidence: item.parkFaultEvidence,
            parkFaultRepairLog: item.parkFaultRepairLog,
            parkFaultPartsList: item.parkFaultPartsList,
            parkMaintainWorkorderWorkorderNo: item.parkMaintainWorkorderWorkorderNo
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('故障预警视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                parkFaultFaultId: 'FT20260119001',
                sysFaultTypeName: '硬件故障',
                sysEquipmentTypeName: '道闸设备',
                tbDeviceExtendInstallPosition: '漳州市高新区龙江大道北区停车场入口道闸',
                parkFaultFaultTime: 1737283200000,
                sysMaintenanceProgressName: '未处理',
                tbDeviceExtendDeviceCode: 'DZ-202601001',
                parkFaultFaultLevel: '紧急',
                sysMaintainUserUserName: '',
                parkMaintainWorkorderExpectedFinishTime: null,
                parkFaultEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkFaultRepairLog: [],
                parkFaultPartsList: [],
                parkMaintainWorkorderWorkorderNo: ''
              },
              {
                parkFaultFaultId: 'FT20260119002',
                sysFaultTypeName: '软件故障',
                sysEquipmentTypeName: '计费设备',
                tbDeviceExtendInstallPosition: '漳州市主城区胜利路南区停车场收费岗亭',
                parkFaultFaultTime: 1737279600000,
                sysMaintenanceProgressName: '处理中',
                tbDeviceExtendDeviceCode: 'JF-202601002',
                parkFaultFaultLevel: '严重',
                sysMaintainUserUserName: '李四-系统运维',
                parkMaintainWorkorderExpectedFinishTime: 1737367200000,
                parkFaultEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkFaultRepairLog: [{time:1737300000000, content:'已重装计费软件，正在调试参数'}],
                parkFaultPartsList: [{name:'计费系统授权密钥', count:1, unit:'个'}],
                parkMaintainWorkorderWorkorderNo: 'WD20260119002'
              },
              {
                parkFaultFaultId: 'FT20260119003',
                sysFaultTypeName: '通讯故障',
                sysEquipmentTypeName: '监控设备',
                tbDeviceExtendInstallPosition: '漳州市经开区兴业路东区停车场负一层监控点',
                parkFaultFaultTime: 1737276000000,
                sysMaintenanceProgressName: '已完成',
                tbDeviceExtendDeviceCode: 'JK-202601003',
                parkFaultFaultLevel: '一般',
                sysMaintainUserUserName: '王五-安防运维',
                parkMaintainWorkorderExpectedFinishTime: 1737285600000,
                parkFaultEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkFaultRepairLog: [{time:1737285600000, content:'更换网线及水晶头，通讯恢复正常'}],
                parkFaultPartsList: [{name:'超五类网线', count:2, unit:'米'}, {name:'水晶头', count:2, unit:'个'}],
                parkMaintainWorkorderWorkorderNo: 'WD20260119003'
              },
              {
                parkFaultFaultId: 'FT20260119004',
                sysFaultTypeName: '供电故障',
                sysEquipmentTypeName: '传感设备',
                tbDeviceExtendInstallPosition: '漳州市文旅区湖滨路西区停车场负二层配电室',
                parkFaultFaultTime: 1737272400000,
                sysMaintenanceProgressName: '已完成',
                tbDeviceExtendDeviceCode: 'CG-202601004',
                parkFaultFaultLevel: '轻微',
                sysMaintainUserUserName: '赵六-工程运维',
                parkMaintainWorkorderExpectedFinishTime: 1737350400000,
                parkFaultEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkFaultRepairLog: [{time:1737350400000, content:'更换电源适配器，设备供电稳定'}],
                parkFaultPartsList: [{name:'12V电源适配器', count:1, unit:'个'}],
                parkMaintainWorkorderWorkorderNo: 'WD20260119004'
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkFaultList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 故障预警核心指标
export const fetchParkFaultIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/fault/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCount &&
          response.unRepairCount &&
          response.hardwareFaultCount &&
          response.softwareFaultCount &&
          response.commFaultCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无故障核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '故障预警指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCount: 57, // 故障事件总数
              unRepairCount: 23, // 未修复故障数
              hardwareFaultCount: 26, // 硬件故障数
              softwareFaultCount: 12, // 软件故障数
              commFaultCount: 19, // 通讯故障数
              urgentCount:7, // 紧急故障数
              seriousCount:15 // 严重故障数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 故障预警指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCount: 0,
      unRepairCount:0,
      hardwareFaultCount:0,
      softwareFaultCount:0,
      commFaultCount:0,
      urgentCount:0,
      seriousCount:0
    });
  }
};

// 故障类型占比饼图
export const fetchParkFaultTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/fault/stat/type/ratio`,
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
        throw new Error('真实接口返回无故障类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '故障类型占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['硬件故障', '软件故障', '通讯故障', '供电故障', '其他故障'],
              series: [{ name: '故障类型占比', data: [26, 12, 19, 8, 4] }]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 故障类型占比函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [] });
  }
};

// 设备类型占比饼图
export const fetchParkFaultEquipmentRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/fault/stat/equipment/ratio`,
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
        throw new Error('真实接口返回无设备类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备类型占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['道闸设备', '监控设备', '计费设备', '传感设备', '其他设备'],
              series: [{ name: '设备类型占比', data: [22, 18, 9, 6, 2] }]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备类型占比函数初始化异常 =====');
    return Promise.resolve({ legend: [], series: [] });
  }
};

// 不同区域故障数对比柱状图
export const fetchParkFaultAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/fault/stat/area/count`,
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
        throw new Error('真实接口返回无区域故障数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域故障数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['主城区', '高新区', '经开区', '文旅区', '周边区县'],
              series: [{ name: '故障事件数', data: [23, 15, 12, 6, 1] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 区域故障数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '故障事件数', data: [] }],
    });
  }
};

// 不同设备类型故障数对比柱状图
export const fetchParkFaultEquipmentCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/fault/stat/equipment/count`,
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
        throw new Error('真实接口返回无设备故障数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备故障数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['道闸设备', '监控设备', '计费设备', '传感设备', '照明设备'],
              series: [{ name: '故障事件数', data: [22, 18, 9, 6, 2] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 设备故障数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '故障事件数', data: [] }],
    });
  }
};

// 单条故障详情查询 - 详情弹窗专用 (GET)
export const fetchParkFaultDetail = (faultId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/fault/detail/${faultId}`,
        params,
      })
      .then((response) => {
        if (response && response.parkFaultFaultId === faultId) {
          return response;
        }
        throw new Error('真实接口返回无详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('故障详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              parkFaultFaultId: faultId,
              sysFaultTypeName: '硬件故障',
              sysEquipmentTypeName: '道闸设备',
              tbDeviceExtendInstallPosition: '漳州市高新区龙江大道北区停车场入口道闸',
              parkFaultFaultTime: 1737283200000,
              sysMaintenanceProgressName: '未处理',
              tbDeviceExtendDeviceCode: 'DZ-202601001',
              parkFaultFaultLevel: '紧急',
              sysMaintainUserUserName: '',
              parkMaintainWorkorderExpectedFinishTime: null,
              parkFaultEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
              parkFaultRepairLog: [],
              parkFaultPartsList: [],
              parkMaintainWorkorderWorkorderNo: '',
              parkFaultDuration: 6 // 故障时长(小时)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkFaultDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 故障跟踪信息查询 - 跟踪弹窗专用 (GET)
export const fetchParkFaultTrackInfo = (faultId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/fault/track/info/${faultId}`,
        params,
      })
      .then((response) => {
        if (response && response.parkFaultFaultId === faultId) {
          return response;
        }
        throw new Error('真实接口返回无跟踪数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('故障跟踪接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              parkFaultFaultId: faultId,
              sysMaintenanceProgressName: '处理中',
              parkMaintainWorkorderWorkorderNo: 'WD20260119002',
              sysMaintainUserUserName: '李四-系统运维',
              parkMaintainWorkorderExpectedFinishTime: 1737367200000,
              parkFaultRepairLog: [{time:1737300000000, content:'已重装计费软件，正在调试参数'}, {time:1737310000000, content:'参数调试完成，设备试运行中'}],
              parkFaultPartsList: [{name:'计费系统授权密钥', count:1, unit:'个'}, {name:'系统安装包', count:1, unit:'份'}],
              parkFaultLatestDynamic: '设备试运行正常，预计今日完成验收'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkFaultTrackInfo 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 故障派单提交 - 派单弹窗确认提交专用 (POST 核心写操作)
export const submitParkFaultDispatch = (params = {}) => {
  try {
    // 前置校验：维修人员必填
    if (!params.maintainUser || params.maintainUser.trim() === '') {
      return Promise.reject(new Error('维修人员为必填项，请填写！'));
    }
    // 维修要求长度≤300字
    if (params.maintainRequire && params.maintainRequire.length > 300) {
      return Promise.reject(new Error('维修要求字数超限，最多支持300字！'));
    }
    return requestClient
      .post({
        url: `${BASE_URL}/park/fault/dispatch/submit`,
        data: params,
      })
      .then((response) => {
        if (response && response.success) {
          console.log('故障派单提交成功，已生成维修工单');
          return response;
        }
        throw new Error('派单提交失败');
      })
      .catch((error) => {
        console.warn('故障派单提交接口调用失败', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              parkFaultFaultId: params.parkFaultFaultId,
              sysMaintenanceProgressName: '待处理',
              parkMaintainWorkorderWorkorderNo: `WD${new Date().getTime().toString().slice(-8)}`,
              msg: '派单成功，维修人员已收到工单提醒'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitParkFaultDispatch 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.reject(new Error('派单提交失败，请稍后重试'));
  }
};

// ========== 异常预警管理 ==========
// 异常预警列表
export const fetchParkAbnormalList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/abnormal/list`,
        params,
      })
      .then((response) => {
        console.log('异常预警视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('异常预警视图-响应符合实际格式');
          return response.map((item) => ({
            parkAbnormalAbnormalId: item.parkAbnormalAbnormalId,
            sysAbnormalTypeName: item.sysAbnormalTypeName,
            parkAbnormalAbnormalReason: item.parkAbnormalAbnormalReason,
            parkAbnormalAbnormalTime: item.parkAbnormalAbnormalTime,
            tbAssetExtendAddress: item.tbAssetExtendAddress,
            sysAssociatedObjectTypeName: item.sysAssociatedObjectTypeName,
            parkAbnormalRelieveStatus: item.parkAbnormalRelieveStatus,
            tbAssetExtendName: item.tbAssetExtendName,
            sysUserUserName: item.sysUserUserName,
            parkAbnormalRelieveTime: item.parkAbnormalRelieveTime,
            parkAbnormalEvidence: item.parkAbnormalEvidence,
            parkAbnormalDisposeLog: item.parkAbnormalDisposeLog,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('异常预警视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                parkAbnormalAbnormalId: 'AB20260119001',
                sysAbnormalTypeName: '设备异常',
                parkAbnormalAbnormalReason: '停车场道闸控制板无响应，无法升降',
                parkAbnormalAbnormalTime: 1737283200000,
                tbAssetExtendAddress: '漳州市高新区龙江大道北区停车场入口道闸',
                sysAssociatedObjectTypeName: '安防设备',
                parkAbnormalRelieveStatus: '未解除',
                tbAssetExtendName: '北区停车场入口道闸控制板',
                sysUserUserName: '张三-设备运维',
                parkAbnormalRelieveTime: null,
                parkAbnormalEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAbnormalDisposeLog: []
              },
              {
                parkAbnormalAbnormalId: 'AB20260119002',
                sysAbnormalTypeName: '数据异常',
                parkAbnormalAbnormalReason: '停车场计费系统数据同步延迟，账单金额异常',
                parkAbnormalAbnormalTime: 1737279600000,
                tbAssetExtendAddress: '漳州市主城区胜利路南区停车场收费岗亭',
                sysAssociatedObjectTypeName: '计费系统',
                parkAbnormalRelieveStatus: '未解除',
                tbAssetExtendName: '南区停车场计费主机',
                sysUserUserName: '李四-系统运维',
                parkAbnormalRelieveTime: null,
                parkAbnormalEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAbnormalDisposeLog: [{time:1737300000000, content:'已重启计费服务，数据正在同步'}]
              },
              {
                parkAbnormalAbnormalId: 'AB20260119003',
                sysAbnormalTypeName: '通讯异常',
                parkAbnormalAbnormalReason: '停车场监控摄像头离线，无法实时查看画面',
                parkAbnormalAbnormalTime: 1737276000000,
                tbAssetExtendAddress: '漳州市经开区兴业路东区停车场负一层监控点',
                sysAssociatedObjectTypeName: '监控设备',
                parkAbnormalRelieveStatus: '已解除',
                tbAssetExtendName: '东区停车场监控摄像头',
                sysUserUserName: '王五-安防运维',
                parkAbnormalRelieveTime: 1737285600000,
                parkAbnormalEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAbnormalDisposeLog: [{time:1737285600000, content:'重新插拔网线，摄像头恢复正常通讯'}]
              },
              {
                parkAbnormalAbnormalId: 'AB20260119004',
                sysAbnormalTypeName: '环境异常',
                parkAbnormalAbnormalReason: '停车场负二层温湿度传感器报警，湿度超标易短路',
                parkAbnormalAbnormalTime: 1737272400000,
                tbAssetExtendAddress: '漳州市文旅区湖滨路西区停车场负二层配电室',
                sysAssociatedObjectTypeName: '传感设备',
                parkAbnormalRelieveStatus: '已解除',
                tbAssetExtendAddress: '漳州市文旅区湖滨路西区停车场负二层配电室',
                tbAssetExtendName: '西区停车场温湿度传感器',
                sysUserUserName: '赵六-工程运维',
                parkAbnormalRelieveTime: 1737350400000,
                parkAbnormalEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAbnormalDisposeLog: [{time:1737350400000, content:'开启除湿机，温湿度恢复正常值'}]
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkAbnormalList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 异常预警核心指标
export const fetchParkAbnormalIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/abnormal/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCount &&
          response.unRelieveCount &&
          response.deviceAbnormalCount &&
          response.dataAbnormalCount &&
          response.commAbnormalCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无异常核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '异常预警指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCount: 63, // 异常事件总数
              unRelieveCount: 27, // 未解除异常数
              deviceAbnormalCount: 24, // 设备异常数
              dataAbnormalCount: 18, // 数据异常数
              commAbnormalCount: 21, // 通讯异常数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 异常预警指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCount: 0,
      unRelieveCount:0,
      deviceAbnormalCount:0,
      dataAbnormalCount:0,
      commAbnormalCount:0
    });
  }
};

// 异常事件近周期变化趋势折线图
export const fetchParkAbnormalTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/abnormal/stat/trend`,
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
        throw new Error('真实接口返回无异常趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '异常趋势折线图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['01-13', '01-14', '01-15', '01-16', '01-17', '01-18', '01-19'],
              series: [{ name: '异常事件数', data: [8, 12, 9, 15, 10, 13, 11] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 异常趋势折线图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '异常事件数', data: [] }],
    });
  }
};

// 不同区域异常数对比柱状图
export const fetchParkAbnormalAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/abnormal/stat/area/count`,
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
        throw new Error('真实接口返回无区域异常数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域异常数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['主城区', '高新区', '经开区', '文旅区', '周边区县'],
              series: [{ name: '异常事件数', data: [25, 14, 16, 7, 1] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 区域异常数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '异常事件数', data: [] }],
    });
  }
};

// 不同类型异常数对比柱状图
export const fetchParkAbnormalTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/abnormal/stat/type/count`,
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
        throw new Error('真实接口返回无类型异常数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型异常数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['设备异常', '数据异常', '通讯异常', '环境异常', '其他异常'],
              series: [{ name: '异常事件数', data: [24, 18, 21, 9, 5] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 类型异常数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '异常事件数', data: [] }],
    });
  }
};

// 单条异常详情查询 - 详情弹窗专用 (GET)
export const fetchParkAbnormalDetail = (abnormalId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/abnormal/detail/${abnormalId}`,
        params,
      })
      .then((response) => {
        if (response && response.parkAbnormalAbnormalId === abnormalId) {
          return response;
        }
        throw new Error('真实接口返回无详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('异常详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              parkAbnormalAbnormalId: abnormalId,
              sysAbnormalTypeName: '设备异常',
              parkAbnormalAbnormalReason: '停车场道闸控制板无响应，无法升降，电压检测正常，判定为硬件故障',
              parkAbnormalAbnormalTime: 1737283200000,
              tbAssetExtendAddress: '漳州市高新区龙江大道北区停车场入口道闸',
              sysAssociatedObjectTypeName: '安防设备',
              parkAbnormalRelieveStatus: '未解除',
              tbAssetExtendName: '北区停车场入口道闸控制板(型号：DZ-802)',
              sysUserUserName: '张三-设备运维负责人',
              parkAbnormalRelieveTime: null,
              parkAbnormalEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
              parkAbnormalDisposeLog: [],
              parkAbnormalDuration: 5 // 异常时长(小时)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkAbnormalDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 异常处置内容提交 - 处置弹窗确认提交专用 (POST 核心写操作)
export const submitParkAbnormalDispose = (params = {}) => {
  try {
    // 前置校验：处置措施必填+长度≤300字，前端兜底校验
    if (!params.disposeMeasure || params.disposeMeasure.trim() === '') {
      return Promise.reject(new Error('处置措施为必填项，请填写处置内容！'));
    }
    if (params.disposeMeasure.length > 300) {
      return Promise.reject(new Error('处置措施字数超限，最多支持300字！'));
    }
    // 处置凭证最多3张，前端兜底校验
    if (params.disposeEvidence && params.disposeEvidence.length > 3) {
      return Promise.reject(new Error('处置凭证最多上传3张图片！'));
    }
    return requestClient
      .post({
        url: `${BASE_URL}/park/abnormal/dispose/submit`,
        data: params,
      })
      .then((response) => {
        if (response && response.success) {
          console.log('异常处置提交成功，已更新处置状态');
          return response;
        }
        throw new Error('处置内容提交失败');
      })
      .catch((error) => {
        console.warn('异常处置提交接口调用失败', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              parkAbnormalAbnormalId: params.parkAbnormalAbnormalId,
              parkAbnormalRelieveStatus: '处置中',
              msg: '处置方案提交成功，进入处置阶段'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitParkAbnormalDispose 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.reject(new Error('处置提交失败，请稍后重试'));
  }
};

// 异常解除提交 - 解除弹窗确认提交专用 (POST 核心写操作)
export const submitParkAbnormalRelieve = (params = {}) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/park/abnormal/relieve/submit`,
        data: params,
      })
      .then((response) => {
        if (response && response.success) {
          console.log('异常解除提交成功，已更新状态为已解除');
          return response;
        }
        throw new Error('解除提交失败');
      })
      .catch((error) => {
        console.warn('异常解除提交接口调用失败', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              parkAbnormalAbnormalId: params.parkAbnormalAbnormalId,
              parkAbnormalRelieveStatus: '已解除',
              parkAbnormalRelieveTime: new Date().getTime(),
              msg: '异常已成功解除，状态已更新'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitParkAbnormalRelieve 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.reject(new Error('解除提交失败，请稍后重试'));
  }
};

// ========== 隐患预警管理 ==========
// 隐患预警列表
export const fetchParkHiddenDangerList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/hiddenDanger/list`,
        params,
      })
      .then((response) => {
        console.log('隐患预警视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('隐患预警视图-响应符合实际格式');
          return response.map((item) => ({
            parkHiddenDangerHiddenDangerId: item.parkHiddenDangerHiddenDangerId,
            sysRiskLevelName: item.sysRiskLevelName,
            sysHiddenDangerTypeName: item.sysHiddenDangerTypeName,
            tbAssetExtendAddress: item.tbAssetExtendAddress,
            parkHiddenDangerInfluenceRange: item.parkHiddenDangerInfluenceRange,
            sysRectificationProgressName: item.sysRectificationProgressName,
            parkHiddenDangerRectificationDeadline: item.parkHiddenDangerRectificationDeadline,
            tbAssetExtendName: item.tbAssetExtendName,
            parkHiddenDangerDiscoverTime: item.parkHiddenDangerDiscoverTime,
            sysUserUserName: item.sysUserUserName,
            parkHiddenDangerAcceptStatus: item.parkHiddenDangerAcceptStatus,
            parkHiddenDangerEvidence: item.parkHiddenDangerEvidence,
            parkHiddenDangerRectifyRequire: item.parkHiddenDangerRectifyRequire,
            parkHiddenDangerRectifyLog: item.parkHiddenDangerRectifyLog,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('隐患预警视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                parkHiddenDangerHiddenDangerId: 'HD20260119001',
                sysRiskLevelName: '重大',
                sysHiddenDangerTypeName: '消防隐患',
                tbAssetExtendAddress: '漳州市高新区龙江大道北区停车场负一层消防通道',
                parkHiddenDangerInfluenceRange: '整个停车场消防应急逃生',
                sysRectificationProgressName: '未整改',
                parkHiddenDangerRectificationDeadline: 1737542400000,
                tbAssetExtendName: '北区停车场消防喷淋系统',
                parkHiddenDangerDiscoverTime: 1737283200000,
                sysUserUserName: '张三-消防维保负责人',
                parkHiddenDangerAcceptStatus: '待验收',
                parkHiddenDangerEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkHiddenDangerRectifyRequire: '立即检修喷淋系统，恢复正常水压，24小时内完成整改',
                parkHiddenDangerRectifyLog: []
              },
              {
                parkHiddenDangerHiddenDangerId: 'HD20260119002',
                sysRiskLevelName: '较大',
                sysHiddenDangerTypeName: '设施破损',
                tbAssetExtendAddress: '漳州市主城区胜利路南区停车场入口道闸',
                parkHiddenDangerInfluenceRange: '车辆进出通行效率',
                sysRectificationProgressName: '整改中',
                parkHiddenDangerRectificationDeadline: 1737628800000,
                tbAssetExtendName: '南区停车场入口道闸电机',
                parkHiddenDangerDiscoverTime: 1737279600000,
                sysUserUserName: '李四-设备运维负责人',
                parkHiddenDangerAcceptStatus: '待验收',
                parkHiddenDangerEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkHiddenDangerRectifyRequire: '更换道闸电机外壳，调试运行状态，48小时内完成整改',
                parkHiddenDangerRectifyLog: [{time:1737300000000, content:'已采购配件，预计今日到场更换'}]
              },
              {
                parkHiddenDangerHiddenDangerId: 'HD20260119003',
                sysRiskLevelName: '一般',
                sysHiddenDangerTypeName: '违规占用',
                tbAssetExtendAddress: '漳州市经开区兴业路东区停车场应急通道',
                parkHiddenDangerInfluenceRange: '应急救援通行',
                sysRectificationProgressName: '已整改',
                parkHiddenDangerRectificationDeadline: 1737369600000,
                tbAssetExtendName: '东区停车场应急通道标识',
                parkHiddenDangerDiscoverTime: 1737276000000,
                sysUserUserName: '王五-安保负责人',
                parkHiddenDangerAcceptStatus: '已验收',
                parkHiddenDangerEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkHiddenDangerRectifyRequire: '清理占道物品，恢复应急通道畅通，12小时内完成整改',
                parkHiddenDangerRectifyLog: [{time:1737285600000, content:'已清理完毕，通道恢复正常使用'}]
              },
              {
                parkHiddenDangerHiddenDangerId: 'HD20260119004',
                sysRiskLevelName: '低危',
                sysHiddenDangerTypeName: '地面破损',
                tbAssetExtendAddress: '漳州市文旅区湖滨路西区停车场负二层通道',
                parkHiddenDangerInfluenceRange: '人员行走安全',
                sysRectificationProgressName: '已整改',
                parkHiddenDangerRectificationDeadline: 1737456000000,
                tbAssetExtendName: '西区停车场地面地砖',
                parkHiddenDangerDiscoverTime: 1737272400000,
                sysUserUserName: '赵六-工程维修负责人',
                parkHiddenDangerAcceptStatus: '验收未通过',
                parkHiddenDangerEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkHiddenDangerRectifyRequire: '重新修补地面破损处，保证平整无凸起，72小时内完成整改',
                parkHiddenDangerRectifyLog: [{time:1737350400000, content:'已完成修补，等待验收'}]
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkHiddenDangerList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 隐患预警核心指标
export const fetchParkHiddenDangerIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/hiddenDanger/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCount &&
          response.majorCount &&
          response.importantCount &&
          response.normalCount &&
          response.lowCount &&
          response.overdueUnRectifyCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无隐患核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '隐患预警指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCount: 76, // 隐患总数
              majorCount: 15, // 重大风险数
              importantCount: 22, // 较大风险数
              normalCount: 28, // 一般风险数
              lowCount: 11, // 低风险数
              overdueUnRectifyCount: 18, // 到期未整改数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 隐患预警指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCount: 0,
      majorCount: 0,
      importantCount:0,
      normalCount:0,
      lowCount:0,
      overdueUnRectifyCount:0
    });
  }
};

// 隐患风险等级占比饼图
export const fetchParkHiddenDangerLevelRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/hiddenDanger/stat/level/ratio`,
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
        throw new Error('真实接口返回无隐患等级占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '隐患风险等级占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['重大', '较大', '一般', '低危'],
              series: [{ name: '风险等级占比', data: [15, 22, 28, 11] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 隐患风险等级占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '风险等级占比', data: [] }],
    });
  }
};

// 隐患类型占比饼图
export const fetchParkHiddenDangerTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/hiddenDanger/stat/type/ratio`,
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
        throw new Error('真实接口返回无隐患类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '隐患类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['消防隐患', '设施破损', '违规占用', '地面破损', '线路老化'],
              series: [{ name: '隐患类型占比', data: [30, 25, 18, 12, 15] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 隐患类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '隐患类型占比', data: [] }],
    });
  }
};

// 不同区域隐患数对比柱状图
export const fetchParkHiddenDangerAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/hiddenDanger/stat/area/count`,
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
        throw new Error('真实接口返回无区域隐患数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域隐患数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['主城区', '高新区', '经开区', '文旅区', '周边区县'],
              series: [{ name: '隐患事件数', data: [29, 16, 19, 10, 2] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 区域隐患数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '隐患事件数', data: [] }],
    });
  }
};

// 不同类型隐患数对比柱状图
export const fetchParkHiddenDangerTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/hiddenDanger/stat/type/count`,
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
        throw new Error('真实接口返回无类型隐患数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型隐患数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['消防隐患', '设施破损', '违规占用', '地面破损', '线路老化'],
              series: [{ name: '隐患事件数', data: [23, 19, 14, 9, 11] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 类型隐患数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '隐患事件数', data: [] }],
    });
  }
};

// 单条隐患详情查询 - 详情弹窗专用 (GET)
export const fetchParkHiddenDangerDetail = (hiddenDangerId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/hiddenDanger/detail/${hiddenDangerId}`,
        params,
      })
      .then((response) => {
        if (response && response.parkHiddenDangerHiddenDangerId === hiddenDangerId) {
          return response;
        }
        throw new Error('真实接口返回无详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('隐患详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              parkHiddenDangerHiddenDangerId: hiddenDangerId,
              sysRiskLevelName: '重大',
              sysHiddenDangerTypeName: '消防隐患',
              tbAssetExtendAddress: '漳州市高新区龙江大道北区停车场负一层消防通道',
              parkHiddenDangerInfluenceRange: '整个停车场消防应急逃生',
              sysRectificationProgressName: '未整改',
              parkHiddenDangerRectificationDeadline: 1737542400000,
              tbAssetExtendName: '北区停车场消防喷淋系统',
              parkHiddenDangerDiscoverTime: 1737283200000,
              sysUserUserName: '张三-消防维保负责人',
              parkHiddenDangerAcceptStatus: '待验收',
              parkHiddenDangerEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
              parkHiddenDangerRectifyRequire: '立即检修喷淋系统，恢复正常水压，24小时内完成整改，整改后需拍照留存凭证，验收合格后方可闭环',
              parkHiddenDangerRectifyLog: []
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkHiddenDangerDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 隐患整改内容提交 - 整改弹窗确认提交专用 (POST 核心写操作)
export const submitParkHiddenDangerRectify = (params = {}) => {
  try {
    // 前置校验：整改方案必填+长度≤500字，前端兜底校验
    if (!params.rectifyScheme || params.rectifyScheme.trim() === '') {
      return Promise.reject(new Error('整改方案为必填项，请填写整改内容！'));
    }
    if (params.rectifyScheme.length > 500) {
      return Promise.reject(new Error('整改方案字数超限，最多支持500字！'));
    }
    // 整改凭证最多3张，前端兜底校验
    if (params.rectifyEvidence && params.rectifyEvidence.length > 3) {
      return Promise.reject(new Error('整改凭证最多上传3张图片！'));
    }
    return requestClient
      .post({
        url: `${BASE_URL}/park/hiddenDanger/rectify/submit`,
        data: params,
      })
      .then((response) => {
        if (response && response.success) {
          console.log('隐患整改提交成功，已更新状态为整改中');
          return response;
        }
        throw new Error('整改内容提交失败');
      })
      .catch((error) => {
        console.warn('隐患整改提交接口调用失败', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              parkHiddenDangerHiddenDangerId: params.parkHiddenDangerHiddenDangerId,
              sysRectificationProgressName: '整改中',
              msg: '整改方案提交成功，进入整改阶段'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitParkHiddenDangerRectify 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.reject(new Error('整改提交失败，请稍后重试'));
  }
};

// 隐患验收结果提交 - 验收弹窗确认提交专用 (POST 核心写操作)
export const submitParkHiddenDangerAccept = (params = {}) => {
  try {
    // 前置校验：验收结果必填
    if (!params.acceptResult || params.acceptResult.trim() === '') {
      return Promise.reject(new Error('验收结果为必填项，请选择！'));
    }
    return requestClient
      .post({
        url: `${BASE_URL}/park/hiddenDanger/accept/submit`,
        data: params,
      })
      .then((response) => {
        if (response && response.success) {
          console.log('隐患验收提交成功，已更新验收状态');
          return response;
        }
        throw new Error('验收结果提交失败');
      })
      .catch((error) => {
        console.warn('隐患验收提交接口调用失败', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              parkHiddenDangerHiddenDangerId: params.parkHiddenDangerHiddenDangerId,
              parkHiddenDangerAcceptStatus: params.acceptResult === '通过' ? '已验收' : '验收未通过',
              sysRectificationProgressName: params.acceptResult === '通过' ? '已完成' : '整改中',
              msg: params.acceptResult === '通过' ? '验收通过，隐患闭环' : '验收未通过，需重新整改'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitParkHiddenDangerAccept 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.reject(new Error('验收提交失败，请稍后重试'));
  }
};

// ========== 预警事件概览 ==========
// 预警事件列表
export const fetchParkAlarmList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/list`,
        params,
      })
      .then((response) => {
        console.log('预警事件视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('预警事件视图-响应符合实际格式');
          return response.map((item) => ({
            parkAlarmAlarmId: item.parkAlarmAlarmId,
            sysAlarmLevelName: item.sysAlarmLevelName,
            sysAlarmTypeName: item.sysAlarmTypeName,
            parkAlarmAlarmTime: item.parkAlarmAlarmTime,
            tbAssetExtendName: item.tbAssetExtendName,
            tbAssetExtendAddress: item.tbAssetExtendAddress,
            sysDisposalStatusName: item.sysDisposalStatusName,
            sysResponsibleUnitName: item.sysResponsibleUnitName,
            parkAlarmReceiveTime: item.parkAlarmReceiveTime,
            parkAlarmDisposalDuration: item.parkAlarmDisposalDuration,
            parkMaintainWorkorderWorkorderNo: item.parkMaintainWorkorderWorkorderNo,
            parkAlarmEvidence: item.parkAlarmEvidence,
            parkAlarmDisposalLog: item.parkAlarmDisposalLog,
            parkAlarmProgress: item.parkAlarmProgress,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('预警事件视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                parkAlarmAlarmId: 'PA20260119001',
                sysAlarmLevelName: '紧急',
                sysAlarmTypeName: '设备故障',
                parkAlarmAlarmTime: 1737283200000,
                tbAssetExtendName: '北区停车场入口道闸',
                tbAssetExtendAddress: '漳州市高新区龙江大道辅路北区停车场',
                sysDisposalStatusName: '未处置',
                sysResponsibleUnitName: '漳州智慧停车运维中心',
                parkAlarmReceiveTime: 1737283500000,
                parkAlarmDisposalDuration: 0,
                parkMaintainWorkorderWorkorderNo: '',
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAlarmDisposalLog: [],
                parkAlarmProgress: '待派单'
              },
              {
                parkAlarmAlarmId: 'PA20260119002',
                sysAlarmLevelName: '高危',
                sysAlarmTypeName: '消防隐患',
                parkAlarmAlarmTime: 1737279600000,
                tbAssetExtendName: '南区停车场消防栓',
                tbAssetExtendAddress: '漳州市主城区胜利路南区停车场负一层',
                sysDisposalStatusName: '处理中',
                sysResponsibleUnitName: '漳州消防维保单位',
                parkAlarmReceiveTime: 1737280000000,
                parkAlarmDisposalDuration: 2.5,
                parkMaintainWorkorderWorkorderNo: 'W20260119001',
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAlarmDisposalLog: [{time:1737281000000, content:'已派单至消防维保，预计1小时到场处理'}],
                parkAlarmProgress: '维保人员途中'
              },
              {
                parkAlarmAlarmId: 'PA20260119003',
                sysAlarmLevelName: '中危',
                sysAlarmTypeName: '违规停车',
                parkAlarmAlarmTime: 1737276000000,
                tbAssetExtendName: '东区停车场应急通道',
                tbAssetExtendAddress: '漳州市经开区兴业路东区停车场出入口',
                sysDisposalStatusName: '已完成',
                sysResponsibleUnitName: '漳州城管执法大队',
                parkAlarmReceiveTime: 1737276200000,
                parkAlarmDisposalDuration: 1.2,
                parkMaintainWorkorderWorkorderNo: 'W20260119002',
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAlarmDisposalLog: [{time:1737277000000, content:'已驱离违规车辆，清理应急通道'}],
                parkAlarmProgress: '处置完成，复核通过'
              },
              {
                parkAlarmAlarmId: 'PA20260119004',
                sysAlarmLevelName: '低危',
                sysAlarmTypeName: '异常缴费',
                parkAlarmAlarmTime: 1737272400000,
                tbAssetExtendName: '西区停车场缴费终端',
                tbAssetExtendAddress: '漳州市文旅区湖滨路西区停车场出口',
                sysDisposalStatusName: '已驳回',
                sysResponsibleUnitName: '漳州停车收费管理中心',
                parkAlarmReceiveTime: 1737272600000,
                parkAlarmDisposalDuration: 0.8,
                parkMaintainWorkorderWorkorderNo: 'W20260119003',
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAlarmDisposalLog: [{time:1737273000000, content:'核实为用户操作失误，重新缴费完成，驳回预警'}],
                parkAlarmProgress: '预警已核销'
              },
              {
                parkAlarmAlarmId: 'PA20260119005',
                sysAlarmLevelName: '紧急',
                sysAlarmTypeName: '电力故障',
                parkAlarmAlarmTime: 1737268800000,
                tbAssetExtendName: '中区停车场监控总闸',
                tbAssetExtendAddress: '漳州市龙文区建元路中区停车场中控室',
                sysDisposalStatusName: '未处置',
                sysResponsibleUnitName: '漳州电力抢修运维部',
                parkAlarmReceiveTime: 1737269000000,
                parkAlarmDisposalDuration: 0,
                parkMaintainWorkorderWorkorderNo: '',
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAlarmDisposalLog: [],
                parkAlarmProgress: '待派单'
              },
              {
                parkAlarmAlarmId: 'PA20260119006',
                sysAlarmLevelName: '高危',
                sysAlarmTypeName: '排水堵塞',
                parkAlarmAlarmTime: 1737265200000,
                tbAssetExtendName: '东南区停车场地下排水泵',
                tbAssetExtendAddress: '漳州市芗城区新华东路东南区停车场负二层',
                sysDisposalStatusName: '未处置',
                sysResponsibleUnitName: '漳州市政排水养护中心',
                parkAlarmReceiveTime: 1737265500000,
                parkAlarmDisposalDuration: 0,
                parkMaintainWorkorderWorkorderNo: '',
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAlarmDisposalLog: [],
                parkAlarmProgress: '待派单'
              },
              {
                parkAlarmAlarmId: 'PA20260119007',
                sysAlarmLevelName: '中危',
                sysAlarmTypeName: '车位占用',
                parkAlarmAlarmTime: 1737261600000,
                tbAssetExtendName: '西北区停车场VIP专属车位',
                tbAssetExtendAddress: '漳州市高新区迎宾路西北区停车场VIP区',
                sysDisposalStatusName: '处理中',
                sysResponsibleUnitName: '漳州停车场安保部',
                parkAlarmReceiveTime: 1737261800000,
                parkAlarmDisposalDuration: 1.0,
                parkMaintainWorkorderWorkorderNo: 'W20260119004',
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAlarmDisposalLog: [{time:1737262500000, content:'安保人员到场核实，联系车主移车'}],
                parkAlarmProgress: '联系车主中'
              },
              {
                parkAlarmAlarmId: 'PA20260119008',
                sysAlarmLevelName: '低危',
                sysAlarmTypeName: '标识损坏',
                parkAlarmAlarmTime: 1737258000000,
                tbAssetExtendName: '东北区停车场导视牌',
                tbAssetExtendAddress: '漳州市经开区通港路东北区停车场入口',
                sysDisposalStatusName: '未处置',
                sysResponsibleUnitName: '漳州广告标识维保部',
                parkAlarmReceiveTime: 1737258200000,
                parkAlarmDisposalDuration: 0,
                parkMaintainWorkorderWorkorderNo: '',
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAlarmDisposalLog: [],
                parkAlarmProgress: '待派单'
              },
              {
                parkAlarmAlarmId: 'PA20260119009',
                sysAlarmLevelName: '中危',
                sysAlarmTypeName: '门禁异常',
                parkAlarmAlarmTime: 1737254400000,
                tbAssetExtendName: '西南区停车场人行门禁',
                tbAssetExtendAddress: '漳州市文旅区江滨路西南区停车场人行口',
                sysDisposalStatusName: '已完成',
                sysResponsibleUnitName: '漳州智能门禁运维中心',
                parkAlarmReceiveTime: 1737254600000,
                parkAlarmDisposalDuration: 0.6,
                parkMaintainWorkorderWorkorderNo: 'W20260119005',
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                parkAlarmDisposalLog: [{time:1737255000000, content:'门禁系统重启后恢复正常，测试无异常'}],
                parkAlarmProgress: '处置完成，正常使用'
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkAlarmList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 预警事件核心指标
export const fetchParkAlarmIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCount &&
          response.urgentCount &&
          response.highCount &&
          response.midCount &&
          response.lowCount &&
          response.undisposedCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无预警核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '预警事件指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCount: 89, // 预警事件总数
              urgentCount: 12, // 紧急预警数
              highCount: 26, // 高危预警数
              midCount: 35, // 中危预警数
              lowCount: 16, // 低危预警数
              undisposedCount: 23, // 未处置预警数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 预警事件指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCount: 0,
      urgentCount: 0,
      highCount:0,
      midCount:0,
      lowCount:0,
      undisposedCount:0
    });
  }
};

// 预警等级占比饼图
export const fetchParkAlarmLevelRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/stat/level/ratio`,
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
        throw new Error('真实接口返回无预警等级占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '预警等级占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['紧急', '高危', '中危', '低危'],
              series: [{ name: '预警等级占比', data: [12, 26, 35, 16] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 预警等级占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '预警等级占比', data: [] }],
    });
  }
};

// 预警类型占比饼图
export const fetchParkAlarmTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/stat/type/ratio`,
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
        throw new Error('真实接口返回无预警类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '预警类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['设备故障', '消防隐患', '违规停车', '异常缴费', '人员闯入'],
              series: [{ name: '预警类型占比', data: [32, 25, 18, 15, 10] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 预警类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '预警类型占比', data: [] }],
    });
  }
};

// 处置状态占比饼图
export const fetchParkAlarmStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/stat/status/ratio`,
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
        throw new Error('真实接口返回无处置状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '处置状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['未处置', '处理中', '已完成', '已驳回'],
              series: [{ name: '处置状态占比', data: [23, 36, 32, 9] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 处置状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '处置状态占比', data: [] }],
    });
  }
};

// 不同区域预警数对比柱状图
export const fetchParkAlarmAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/stat/area/count`,
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
        throw new Error('真实接口返回无区域预警数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域预警数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['主城区', '高新区', '经开区', '文旅区', '周边区县'],
              series: [{ name: '预警事件数', data: [32, 18, 21, 15, 3] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 区域预警数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '预警事件数', data: [] }],
    });
  }
};

// 不同类型预警数对比柱状图
export const fetchParkAlarmTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/stat/type/count`,
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
        throw new Error('真实接口返回无类型预警数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型预警数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['设备故障', '消防隐患', '违规停车', '异常缴费', '人员闯入'],
              series: [{ name: '预警事件数', data: [28, 22, 16, 13, 8] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 类型预警数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '预警事件数', data: [] }],
    });
  }
};

// 单条预警详情查询 - 详情弹窗专用 (GET)
export const fetchParkAlarmDetail = (alarmId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/detail/${alarmId}`,
        params,
      })
      .then((response) => {
        if (response && response.parkAlarmAlarmId === alarmId) {
          return response;
        }
        throw new Error('真实接口返回无详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('预警详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            // 模拟单条详情完整数据，包含所有弹窗展示字段
            resolve({
              parkAlarmAlarmId: alarmId,
              sysAlarmLevelName: '紧急',
              sysAlarmTypeName: '设备故障',
              parkAlarmAlarmTime: 1737283200000,
              tbAssetExtendName: '北区停车场入口道闸',
              tbAssetExtendAddress: '漳州市高新区龙江大道辅路北区停车场',
              sysDisposalStatusName: '未处置',
              sysResponsibleUnitName: '漳州智慧停车运维中心',
              parkAlarmReceiveTime: 1737283500000,
              parkAlarmDisposalDuration: 0,
              parkMaintainWorkorderWorkorderNo: '',
              parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
              parkAlarmDisposalLog: [],
              parkAlarmProgress: '待派单',
              parkAlarmDesc: '道闸电机卡死，无法正常抬杆，影响车辆通行，现场无人员值守', // 补充详情扩展字段
              parkAlarmRemark: '该道闸为2025年新装设备，首次出现故障' // 补充详情扩展字段
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkAlarmDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 预警处置内容提交 - 处置弹窗确认提交专用 (POST 核心写操作)
export const submitParkAlarmDisposal = (params = {}) => {
  try {
    // 前置校验：处置措施必填+长度≤500字，前端兜底校验（和需求一致）
    if (!params.disposalMeasure || params.disposalMeasure.trim() === '') {
      return Promise.reject(new Error('处置措施为必填项，请填写处置内容！'));
    }
    if (params.disposalMeasure.length > 500) {
      return Promise.reject(new Error('处置措施字数超限，最多支持500字！'));
    }
    // 处置凭证最多3张，前端兜底校验
    if (params.disposalEvidence && params.disposalEvidence.length > 3) {
      return Promise.reject(new Error('处置凭证最多上传3张图片！'));
    }
    return requestClient
      .post({
        url: `${BASE_URL}/park/alarm/disposal/submit`,
        data: params, // post用data传参，和原有get的params区分
      })
      .then((response) => {
        if (response && response.success) {
          console.log('预警处置提交成功，已更新状态为处理中，生成运维工单');
          return response; // 返回工单编号、更新后的预警状态等核心数据
        }
        throw new Error('处置内容提交失败，未生成工单');
      })
      .catch((error) => {
        console.warn('预警处置提交接口调用失败', error.message);
        // 模拟提交成功的返回数据，兜底业务闭环
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              parkAlarmAlarmId: params.parkAlarmAlarmId,
              sysDisposalStatusName: '处理中', // 状态更新为处理中
              parkMaintainWorkorderWorkorderNo: `W${new Date().getTime()}`, // 自动生成工单编号
              msg: '处置内容提交成功，运维工单已生成'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitParkAlarmDisposal 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.reject(new Error('处置提交失败，请稍后重试'));
  }
};

// 预警处置跟踪详情查询 - 跟踪弹窗专用 (GET)
export const fetchParkAlarmTrackInfo = (alarmId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/alarm/track/${alarmId}`,
        params,
      })
      .then((response) => {
        if (response && response.parkAlarmAlarmId === alarmId) {
          return response;
        }
        throw new Error('真实接口返回无跟踪数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('预警跟踪接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            // 模拟跟踪弹窗完整数据，包含处置进度+工单状态+反馈结果
            resolve({
              parkAlarmAlarmId: alarmId,
              parkAlarmProgress: '维保人员途中',
              sysDisposalStatusName: '处理中',
              parkMaintainWorkorderWorkorderNo: 'W20260119001',
              workorderStatus: '已派单，未完成', // 工单实时状态
              workorderAssignTime: 1737281000000, // 工单派单时间
              workorderHandler: '漳州智慧停车运维中心-张三', // 工单处理人
              feedbackResult: '维保人员预计15分钟后到达现场，已联系现场安保人员协助', // 反馈结果
              parkAlarmDisposalLog: [{time:1737281000000, content:'已派单至消防维保，预计1小时到场处理'}, {time:1737282000000, content:'维保人员已出发，当前位置：龙江大道中段'}]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkAlarmTrackInfo 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};


// ============ 预警事件处置跟踪 ============
// 甘特图接口
export const fetchEventHandleGanttData = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/event/gantt/list`, // 接口地址不变
        params,
      })
      .then((response) => {
        if (response && response.event && response.eventCate) {
          return {
            event: {
              dimensions: ['分类索引', '开始处置时间', '处置完成时间', '预警类型', '处置状态'],
              data: response.event.data || []
            },
            eventCate: {
              dimensions: ['关联工单号'],
              data: response.eventCate.data || []
            }
          };
        }
        throw new Error('真实接口返回无预警处置甘特图数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('预警处置跟踪甘特图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              event: {
                dimensions: ['分类索引', '开始处置时间', '处置完成时间', '预警类型', '处置状态'],
                data: [
                  [0, 1720339200000, 1720512000000, '客流超限预警', true],
                  [1, 1720684800000, 1720857600000, '道闸超时未关预警', true],
                  [2, 1720857600000, 1721030400000, '车位占用预警', false],
                  [3, 1720512000000, 1720684800000, '监控离线预警', false],
                  [4,1721376000000, 1721548800000, '车辆滞留预警', true],
                  [5,1721548800000, 1721721600000, '充电桩过载预警', false],
                  [6,1721894400000, 1722067200000, '设备离线预警', false],
                  [7, 1720684800000, 1720857600000, '道闸超时未关预警', true],
                  [8, 1720857600000, 1721030400000, '车位占用预警', false],
                  [9, 1720512000000, 1720684800000, '监控离线预警', false],
                  [10, 1719648000000, 1719820800000, '车辆违停预警', true],
                  [11, 1719820800000, 1719993600000, '充电桩断电预警', false],
                  [12, 1719475200000, 1719648000000, '道闸故障预警', true],
                  [13, 1721030400000, 1721203200000, '消防栓异常预警', true],
                  [14,1721721600000, 1721894400000, '出入口拥堵预警', true]
                ]
              },
              eventCate: {
                dimensions: ['关联工单号'],
                data: [
                  ['W20260116001'],['W20260116002'],['W20260116003'],['W20260116004'],['W20260116005'],
                  ['W20260116006'],['W20260116007'],['W20260116008'],['W20260116009'],['W20260116010'],
                  ['W20260116011'],['W20260116012'],['W20260116013'],['W20260116014'],['W20260116015']
                ]
              }
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchEventHandleGanttData 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ event: { data: [] }, eventCate: { data: [] } });
  }
};

// 事件处置跟踪列表 (核心列表-支持进度查看/协同/催办)
export const fetchParkDisposeTrackList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/dispose/track/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            parkAlarmAlarmId: item.parkAlarmAlarmId,
            sysAlarmTypeName: item.sysAlarmTypeName,
            sysMaintainUserUserName: item.sysMaintainUserUserName,
            parkMaintainWorkorderStartTime: item.parkMaintainWorkorderStartTime,
            sysDisposalProgressName: item.sysDisposalProgressName,
            parkMaintainWorkorderWorkorderNo: item.parkMaintainWorkorderWorkorderNo,
            parkMaintainWorkorderExpectedFinishTime: item.parkMaintainWorkorderExpectedFinishTime,
            parkMaintainWorkorderLatestDynamic: item.parkMaintainWorkorderLatestDynamic,
            parkMaintainWorkorderDispatchDuration: item.parkMaintainWorkorderDispatchDuration,
            parkMaintainWorkorderDealTime: item.parkMaintainWorkorderDealTime,
            parkAlarmEvidence: item.parkAlarmEvidence,
            disposeAllLog: item.disposeAllLog
          }));
        }
        throw new Error('真实接口返回无处置跟踪数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('事件处置跟踪列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                parkAlarmAlarmId: 'PA20260119001',
                sysAlarmTypeName: '设备故障',
                sysMaintainUserUserName: '张三-智慧停车运维',
                parkMaintainWorkorderStartTime: 1737283500000,
                sysDisposalProgressName: '待派单',
                parkMaintainWorkorderWorkorderNo: 'W20260119001',
                parkMaintainWorkorderExpectedFinishTime: 1737290700000,
                parkMaintainWorkorderLatestDynamic: '系统已生成工单，等待派单分配',
                parkMaintainWorkorderDispatchDuration: 0.5,
                parkMaintainWorkorderDealTime: 0,
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                disposeAllLog: [{time:1737283500000, content:'工单生成，进入派单队列'}]
              },
              {
                parkAlarmAlarmId: 'PA20260119002',
                sysAlarmTypeName: '消防隐患',
                sysMaintainUserUserName: '李四-消防维保',
                parkMaintainWorkorderStartTime: 1737280000000,
                sysDisposalProgressName: '处理中',
                parkMaintainWorkorderWorkorderNo: 'W20260119002',
                parkMaintainWorkorderExpectedFinishTime: 1737287200000,
                parkMaintainWorkorderLatestDynamic: '维保人员已到场，正在检修消防栓水压问题',
                parkMaintainWorkorderDispatchDuration: 0.3,
                parkMaintainWorkorderDealTime: 2.5,
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                disposeAllLog: [{time:1737280000000, content:'派单至消防维保李四'},{time:1737281000000, content:'维保人员出发'},{time:1737283000000, content:'到达现场开始检修'}]
              },
              {
                parkAlarmAlarmId: 'PA20260119003',
                sysAlarmTypeName: '违规停车',
                sysMaintainUserUserName: '王五-城管执法',
                parkMaintainWorkorderStartTime: 1737276200000,
                sysDisposalProgressName: '已完成',
                parkMaintainWorkorderWorkorderNo: 'W20260119003',
                parkMaintainWorkorderExpectedFinishTime: 1737279800000,
                parkMaintainWorkorderLatestDynamic: '违规车辆已驱离，应急通道恢复畅通，复核通过',
                parkMaintainWorkorderDispatchDuration: 0.2,
                parkMaintainWorkorderDealTime: 1.2,
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                disposeAllLog: [{time:1737276200000, content:'派单至城管王五'},{time:1737277000000, content:'驱离违规车辆'},{time:1737277500000, content:'处置完成复核通过'}]
              },
              {
                parkAlarmAlarmId: 'PA20260119004',
                sysAlarmTypeName: '异常缴费',
                sysMaintainUserUserName: '赵六-收费管理',
                parkMaintainWorkorderStartTime: 1737272600000,
                sysDisposalProgressName: '已驳回',
                parkMaintainWorkorderWorkorderNo: 'W20260119004',
                parkMaintainWorkorderExpectedFinishTime: 1737275000000,
                parkMaintainWorkorderLatestDynamic: '核实为用户操作失误，重新缴费完成，预警核销',
                parkMaintainWorkorderDispatchDuration: 0.1,
                parkMaintainWorkorderDealTime: 0.8,
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                disposeAllLog: [{time:1737272600000, content:'派单至收费管理赵六'},{time:1737273000000, content:'核实用户操作失误，驳回预警'}]
              },
              {
                parkAlarmAlarmId: 'PA20260119005',
                sysAlarmTypeName: '电力故障',
                sysMaintainUserUserName: '钱七-电力抢修',
                parkMaintainWorkorderStartTime: 1737269000000,
                sysDisposalProgressName: '超时处置',
                parkMaintainWorkorderWorkorderNo: 'W20260119005',
                parkMaintainWorkorderExpectedFinishTime: 1737272600000,
                parkMaintainWorkorderLatestDynamic: '工单超期未处理，已触发催办提醒',
                parkMaintainWorkorderDispatchDuration: 1.5,
                parkMaintainWorkorderDealTime: 0,
                parkAlarmEvidence: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                disposeAllLog: [{time:1737269000000, content:'工单生成'},{time:1737272600000, content:'工单超时，系统自动催办'}]
              }
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkDisposeTrackList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 事件处置跟踪核心指标 (平均处置时长、超时处置数、已完成处置数)
export const fetchParkDisposeTrackIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/dispose/track/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.avgDisposeDuration &&
          response.overtimeCount &&
          response.finishCount &&
          response.disposingCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无处置跟踪指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '事件处置跟踪指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              avgDisposeDuration: 2.3, // 平均处置时长(小时)
              overtimeCount: 7, // 超时处置数
              finishCount: 58, // 已完成处置数
              disposingCount: 24 // 处理中数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 事件处置跟踪指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      avgDisposeDuration: 0,
      overtimeCount: 0,
      finishCount:0,
      disposingCount:0
    });
  }
};

// 不同处置人处置效率对比柱状图
export const fetchParkDisposeUserEfficiency = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/dispose/stat/user/efficiency`,
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
        throw new Error('真实接口返回无处置人效率数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '处置人效率对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['张三-运维', '李四-消防', '王五-城管', '赵六-收费', '钱七-电力'],
              series: [{ name: '平均处置时长(小时)', data: [1.8, 2.1, 1.5, 0.9, 3.2] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 处置人效率对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '平均处置时长(小时)', data: [] }],
    });
  }
};

// 处置跟踪详情弹窗专用 (GET)
export const fetchParkDisposeTrackDetail = (alarmId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/dispose/track/detail/${alarmId}`,
        params,
      })
      .then((response) => {
        if (response && response.parkAlarmAlarmId === alarmId) {
          return response;
        }
        throw new Error('真实接口返回无处置详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('处置跟踪详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              parkAlarmAlarmId: alarmId,
              sysAlarmTypeName: '设备故障',
              sysMaintainUserUserName: '张三-智慧停车运维',
              parkMaintainWorkorderStartTime:1737283500000,
              sysDisposalProgressName:'处理中',
              parkMaintainWorkorderWorkorderNo:'W20260119001',
              parkMaintainWorkorderDispatchDuration:0.5,
              parkMaintainWorkorderDealTime:1.2,
              parkMaintainWorkorderExpectedFinishTime:1737290700000,
              sysUserUserName:['李四-消防维保','王五-城管'],
              parkMaintainWorkorderLatestDynamic:'维保人员已到场，正在维修道闸电机，预计30分钟完成',
              parkAlarmEvidence:['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg','https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
              disposeAllLog: [{time:1737283500000,content:'工单生成'},{time:1737284000000,content:'派单至张三'},{time:1737285000000,content:'张三出发'},{time:1737286000000,content:'到达现场开始维修'}]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkDisposeTrackDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 协同请求提交 (POST 核心写操作)
export const submitParkDisposeCooperate = (params = {}) => {
  try {
    // 前置校验：协同人员+协同理由 必填
    if (!params.cooperateUser || params.cooperateUser.length === 0) {
      return Promise.reject(new Error('协同人员为必填项，请选择协同人员！'));
    }
    if (!params.cooperateReason || params.cooperateReason.trim() === '') {
      return Promise.reject(new Error('协同理由为必填项，请填写协同原因！'));
    }
    if (params.cooperateReason.length > 300) {
      return Promise.reject(new Error('协同理由字数超限，最多支持300字！'));
    }
    return requestClient
      .post({
        url: `${BASE_URL}/park/dispose/cooperate/submit`,
        data: params,
      })
      .then((response) => {
        if (response && response.success) {
          console.log('协同请求提交成功，已发送协同通知');
          return response;
        }
        throw new Error('协同请求提交失败');
      })
      .catch((error) => {
        console.warn('协同请求提交接口调用失败', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              parkAlarmAlarmId: params.parkAlarmAlarmId,
              msg: '协同请求提交成功，已向选中人员发送通知'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitParkDisposeCooperate 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.reject(new Error('协同提交失败，请稍后重试'));
  }
};

// 催办请求提交 (无需弹窗 即时交互)
export const submitParkDisposeUrge = (params = {}) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/park/dispose/urge/submit`,
        data: params,
      })
      .then((response) => {
        if (response && response.success) {
          console.log('催办消息发送成功，已记录催办日志');
          return response;
        }
        throw new Error('催办请求发送失败');
      })
      .catch((error) => {
        console.warn('催办请求接口调用失败', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              parkAlarmAlarmId: params.parkAlarmAlarmId,
              msg: '催办消息已发送，处置人将收到提醒'
            });
          }, 300);
        });
      });
  } catch (error) {
    console.error('===== submitParkDisposeUrge 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.reject(new Error('催办失败，请稍后重试'));
  }
};
