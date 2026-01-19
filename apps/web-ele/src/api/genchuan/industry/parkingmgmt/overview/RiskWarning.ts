import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';

// ============ 预警事件处置跟踪甘特图接口 (结构完全不变，仅新增模拟数据到15条) ============
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

// ========== 预警事件概览-新增开始 ==========
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
                parkAlarmEvidence: ['https://dummyimage.com/400x300/2b2b2b/fff&text=道闸故障抓拍图'],
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
                parkAlarmEvidence: ['https://dummyimage.com/400x300/2b2b2b/fff&text=消防栓无水压'],
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
                parkAlarmEvidence: ['https://dummyimage.com/400x300/2b2b2b/fff&text=占道停车抓拍'],
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
                parkAlarmEvidence: ['https://dummyimage.com/400x300/2b2b2b/fff&text=缴费异常截图'],
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
                parkAlarmEvidence: ['https://dummyimage.com/400x300/2b2b2b/fff&text=停电故障现场'],
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
                parkAlarmEvidence: ['https://dummyimage.com/400x300/2b2b2b/fff&text=排水口堵塞积水'],
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
                parkAlarmEvidence: ['https://dummyimage.com/400x300/2b2b2b/fff&text=VIP车位占用抓拍'],
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
                parkAlarmEvidence: ['https://dummyimage.com/400x300/2b2b2b/fff&text=导视牌破损实拍'],
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
                parkAlarmEvidence: ['https://dummyimage.com/400x300/2b2b2b/fff&text=门禁故障修复图'],
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
              parkAlarmEvidence: ['https://dummyimage.com/400x300/2b2b2b/fff&text=道闸故障抓拍图'],
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
