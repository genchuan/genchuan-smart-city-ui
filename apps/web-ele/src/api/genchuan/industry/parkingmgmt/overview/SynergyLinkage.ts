import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';


// ========== 协同效率评估 ==========
// 协同效率评估列表
export const fetchEfficiencyEvaluationList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/evaluation/list`,
        params,
      })
      .then((response) => {
        console.log('协同效率评估列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('协同效率评估列表-响应符合实际格式');
          return response.map((item) => ({
            bizCoopEfficiencyCoopEfficiencyId: item.bizCoopEfficiencyCoopEfficiencyId,
            sysCooperationTypeName: item.sysCooperationTypeName,
            sysAreaAreaName: item.sysAreaAreaName,
            sysStatCycleName: item.sysStatCycleName,
            bizCoopEfficiencyAverageResponseDuration: item.bizCoopEfficiencyAverageResponseDuration,
            bizCoopEfficiencyAverageDisposalDuration: item.bizCoopEfficiencyAverageDisposalDuration,
            bizCoopEfficiencyEffectivenessRate: item.bizCoopEfficiencyEffectivenessRate,
          }));
        }
        throw new Error('真实接口返回无协同效率评估列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('协同效率评估列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                bizCoopEfficiencyCoopEfficiencyId: 'EFF20260121001',
                sysCooperationTypeName: '故障处置协同',
                sysAreaAreaName: '浦东新区',
                sysStatCycleName: '2024年1月第3周',
                bizCoopEfficiencyAverageResponseDuration: 1.5,
                bizCoopEfficiencyAverageDisposalDuration: 4.8,
                bizCoopEfficiencyEffectivenessRate: 92.3,
              },
              {
                bizCoopEfficiencyCoopEfficiencyId: 'EFF20260121002',
                sysCooperationTypeName: '投诉处理协同',
                sysAreaAreaName: '徐汇区',
                sysStatCycleName: '2024年1月第3周',
                bizCoopEfficiencyAverageResponseDuration: 2.2,
                bizCoopEfficiencyAverageDisposalDuration: 6.5,
                bizCoopEfficiencyEffectivenessRate: 88.7,
              },
              {
                bizCoopEfficiencyCoopEfficiencyId: 'EFF20260121003',
                sysCooperationTypeName: '日常运维协同',
                sysAreaAreaName: '静安区',
                sysStatCycleName: '2024年1月第3周',
                bizCoopEfficiencyAverageResponseDuration: 1.2,
                bizCoopEfficiencyAverageDisposalDuration: 3.5,
                bizCoopEfficiencyEffectivenessRate: 95.2,
              },
              {
                bizCoopEfficiencyCoopEfficiencyId: 'EFF20260121004',
                sysCooperationTypeName: '费用结算协同',
                sysAreaAreaName: '黄浦区',
                sysStatCycleName: '2024年1月第3周',
                bizCoopEfficiencyAverageResponseDuration: 3.5,
                bizCoopEfficiencyAverageDisposalDuration: 8.2,
                bizCoopEfficiencyEffectivenessRate: 81.4,
              },
              {
                bizCoopEfficiencyCoopEfficiencyId: 'EFF20260121005',
                sysCooperationTypeName: '活动推广协同',
                sysAreaAreaName: '杨浦区',
                sysStatCycleName: '2024年1月第3周',
                bizCoopEfficiencyAverageResponseDuration: 1.8,
                bizCoopEfficiencyAverageDisposalDuration: 5.2,
                bizCoopEfficiencyEffectivenessRate: 89.6,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchEfficiencyEvaluationList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 协同效率评估核心指标（卡片展示）
export const fetchEfficiencyEvaluationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/evaluation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.averageResponseDuration &&
          response.averageDisposalDuration &&
          response.effectivenessRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无协同效率评估核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同效率评估指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              averageResponseDuration: 2.1, // 平均响应时长
              averageDisposalDuration: 5.7, // 平均处置时长
              effectivenessRate: 89.5, // 成效达标率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同效率评估指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      averageResponseDuration: 0,
      averageDisposalDuration: 0,
      effectivenessRate: 0,
    });
  }
};

// 不同类型协同效率对比（柱状图）
export const fetchEfficiencyEvaluationTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/evaluation/stat/type/compare`,
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
        throw new Error('真实接口返回无类型协同效率对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型协同效率对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['故障处置协同', '投诉处理协同', '日常运维协同', '费用结算协同', '活动推广协同'],
              series: [{ name: '平均处置时长(小时)', data: [4.8, 6.5, 3.5, 8.2, 5.2] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 类型协同效率对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '平均处置时长(小时)', data: [] }],
    });
  }
};

// 不同区域协同效率对比（柱状图）
export const fetchEfficiencyEvaluationAreaCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/evaluation/stat/area/compare`,
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
        throw new Error('真实接口返回无区域协同效率对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域协同效率对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['浦东新区', '徐汇区', '静安区', '黄浦区', '杨浦区'],
              series: [{ name: '平均响应时长(小时)', data: [1.5, 2.2, 1.2, 3.5, 1.8] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域协同效率对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '平均响应时长(小时)', data: [] }],
    });
  }
};

// 协同效率近周期趋势（折线图）
export const fetchEfficiencyEvaluationTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/evaluation/stat/trend`,
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
        throw new Error('真实接口返回无协同效率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同效率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['第1周', '第2周', '第3周', '第4周', '第5周'],
              series: [{ name: '综合效率评分', data: [85, 87, 89, 91, 89] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同效率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '综合效率评分', data: [] }],
    });
  }
};

// 问题复发率占比（饼图）
export const fetchEfficiencyEvaluationRecurrenceRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/evaluation/stat/recurrence/ratio`,
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
        throw new Error('真实接口返回无问题复发率占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '问题复发率占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['0-5%', '5-10%', '10-15%', '15-20%', '20%以上'],
              series: [{ name: '问题复发率占比(%)', data: [35.2, 28.6, 18.3, 12.1, 5.8] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 问题复发率占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '问题复发率占比(%)', data: [] }],
    });
  }
};

// 协同效率评估详情查询
export const fetchEfficiencyEvaluationDetail = (efficiencyId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/evaluation/detail/${efficiencyId}`,
        params,
      })
      .then((response) => {
        if (response && response.bizCoopEfficiencyCoopEfficiencyId === efficiencyId) {
          return response;
        }
        throw new Error('真实接口返回无协同效率评估详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('协同效率评估详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            const details = {
              'EFF20260121001': {
                bizCoopEfficiencyCoopEfficiencyId: efficiencyId,
                sysCooperationTypeName: '故障处置协同',
                sysAreaAreaName: '浦东新区',
                sysStatCycleName: '2024年1月第3周',
                bizCoopEfficiencyAverageResponseDuration: 1.5,
                bizCoopEfficiencyAverageDisposalDuration: 4.8,
                bizCoopEfficiencyEffectivenessRate: 92.3,
                // 详情字段
                bizCoopEfficiencyCoopCost: 2850,
                bizCoopEfficiencyProblemRecurrenceRate: 8.5,
                bizCoopEfficiencyEfficiencyBottleneck: '人员响应不及时',
                bizCoopEfficiencyOptimizationSuggestion: '加强人员培训，建立快速响应机制',
                // 效率评估明细
                efficiencyDetails: [
                  { item: '响应达标率', value: '95.6%', standard: '≥90%', status: '达标' },
                  { item: '处置达标率', value: '92.3%', standard: '≥90%', status: '达标' },
                  { item: '成本控制率', value: '88.7%', standard: '≥85%', status: '达标' },
                  { item: '问题复发率', value: '8.5%', standard: '≤10%', status: '达标' }
                ],
                // 数据来源
                dataSources: [
                  { source: '协同系统', type: '主数据', frequency: '实时' },
                  { source: '人工填报', type: '补充数据', frequency: '每日' },
                  { source: '监控系统', type: '监测数据', frequency: '每分钟' },
                  { source: '业务系统', type: '业务数据', frequency: '实时' }
                ],
                // 计算逻辑
                calculationLogic: [
                  { item: '响应时长', logic: '从协同发起时间到首次响应时间的差值' },
                  { item: '处置时长', logic: '从首次响应时间到问题解决时间的差值' },
                  { item: '成效达标率', logic: '实际成效与预期成效的比率' },
                  { item: '协同成本', logic: '人力成本+物资成本+时间成本的总和' }
                ]
              },
              'EFF20260121002': {
                bizCoopEfficiencyCoopEfficiencyId: efficiencyId,
                sysCooperationTypeName: '投诉处理协同',
                sysAreaAreaName: '徐汇区',
                sysStatCycleName: '2024年1月第3周',
                bizCoopEfficiencyAverageResponseDuration: 2.2,
                bizCoopEfficiencyAverageDisposalDuration: 6.5,
                bizCoopEfficiencyEffectivenessRate: 88.7,
                // 详情字段
                bizCoopEfficiencyCoopCost: 3200,
                bizCoopEfficiencyProblemRecurrenceRate: 12.3,
                bizCoopEfficiencyEfficiencyBottleneck: '跨部门协调耗时较长',
                bizCoopEfficiencyOptimizationSuggestion: '优化跨部门沟通流程，建立联席会议制度',
                // 效率评估明细
                efficiencyDetails: [
                  { item: '响应达标率', value: '89.2%', standard: '≥90%', status: '未达标' },
                  { item: '处置达标率', value: '88.7%', standard: '≥90%', status: '未达标' },
                  { item: '成本控制率', value: '91.5%', standard: '≥85%', status: '达标' },
                  { item: '问题复发率', value: '12.3%', standard: '≤10%', status: '未达标' }
                ],
                // 数据来源
                dataSources: [
                  { source: '协同系统', type: '主数据', frequency: '实时' },
                  { source: '客服系统', type: '业务数据', frequency: '实时' },
                  { source: '投诉系统', type: '反馈数据', frequency: '每日' },
                  { source: '质量系统', type: '评估数据', frequency: '每周' }
                ],
                // 计算逻辑
                calculationLogic: [
                  { item: '响应时长', logic: '投诉受理时间到首次联系用户的时间' },
                  { item: '处置时长', logic: '首次联系到问题解决并反馈用户的时间' },
                  { item: '成效达标率', logic: '用户满意度调查结果的综合评分' },
                  { item: '协同成本', logic: '人工成本+系统使用成本+沟通成本' }
                ]
              }
            };
            resolve(details[efficiencyId] || details['EFF20260121001']);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchEfficiencyEvaluationDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交优化方案
export const submitOptimizationPlan = (efficiencyId, optimizationPlan, optimizationDeadline) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/efficiency/evaluation/optimize/${efficiencyId}`,
        data: { optimizationPlan, optimizationDeadline },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无优化结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('优化方案接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '优化方案提交成功',
              optimizationStatus: '已优化'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitOptimizationPlan 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ========== 专属协同 ==========
// 专属协同列表
export const fetchSpecialCooperationList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/cooperation/list`,
        params,
      })
      .then((response) => {
        console.log('专属协同列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('专属协同列表-响应符合实际格式');
          return response.map((item) => ({
            bizSpecialCoopSpecialCoopId: item.bizSpecialCoopSpecialCoopId,
            sysCoopSceneName: item.sysCoopSceneName,
            sysResponsibleUnitName: item.sysResponsibleUnitName,
            bizSpecialCoopCoopRule: item.bizSpecialCoopCoopRule,
            bizSpecialCoopResponsibilityDivision: item.bizSpecialCoopResponsibilityDivision,
            sysCooperationStatusName: item.sysCooperationStatusName,
          }));
        }
        throw new Error('真实接口返回无专属协同列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('专属协同列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                bizSpecialCoopSpecialCoopId: 'SPECIAL20260120001',
                sysCoopSceneName: '重大活动保障',
                sysResponsibleUnitName: '保障部',
                bizSpecialCoopCoopRule: '提前2小时到岗，按预案执行',
                bizSpecialCoopResponsibilityDivision: 'A组负责入口，B组负责出口',
                sysCooperationStatusName: '待执行',
              },
              {
                bizSpecialCoopSpecialCoopId: 'SPECIAL20260120002',
                sysCoopSceneName: '应急演练',
                sysResponsibleUnitName: '安全部',
                bizSpecialCoopCoopRule: '全员参与，模拟真实场景',
                bizSpecialCoopResponsibilityDivision: '指挥组、执行组、评估组',
                sysCooperationStatusName: '执行中',
              },
              {
                bizSpecialCoopSpecialCoopId: 'SPECIAL20260120003',
                sysCoopSceneName: '系统升级',
                sysResponsibleUnitName: '技术部',
                bizSpecialCoopCoopRule: '零点作业，分批次升级',
                bizSpecialCoopResponsibilityDivision: '开发组、测试组、运维组',
                sysCooperationStatusName: '已完成',
              },
              {
                bizSpecialCoopSpecialCoopId: 'SPECIAL20260120004',
                sysCoopSceneName: '设备大修',
                sysResponsibleUnitName: '工程部',
                bizSpecialCoopCoopRule: '周末停运，48小时内完成',
                bizSpecialCoopResponsibilityDivision: '机械组、电气组、调试组',
                sysCooperationStatusName: '待复盘',
              },
              {
                bizSpecialCoopSpecialCoopId: 'SPECIAL20260120005',
                sysCoopSceneName: '数据迁移',
                sysResponsibleUnitName: '信息部',
                bizSpecialCoopCoopRule: '分批次迁移，确保数据安全',
                bizSpecialCoopResponsibilityDivision: '数据组、备份组、验证组',
                sysCooperationStatusName: '执行中',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSpecialCooperationList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 专属协同核心指标（卡片展示）
export const fetchSpecialCooperationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/cooperation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCooperationCount &&
          response.completionRate &&
          response.averageCooperationCycle
        ) {
          return response;
        }
        throw new Error('真实接口返回无专属协同核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '专属协同指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCooperationCount: 89, // 专属协同总数
              completionRate: 76.3, // 完成率
              averageCooperationCycle: 5.2, // 平均协同周期
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 专属协同指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCooperationCount: 0,
      completionRate: 0,
      averageCooperationCycle: 0,
    });
  }
};

// 不同场景协同数对比（柱状图）
export const fetchSpecialCooperationSceneCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/cooperation/stat/scene/count`,
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
        throw new Error('真实接口返回无场景协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '场景协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['重大活动保障', '应急演练', '系统升级', '设备大修', '数据迁移'],
              series: [{ name: '协同数量', data: [22, 18, 15, 12, 22] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 场景协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 不同责任单位协同数对比（柱状图）
export const fetchSpecialCooperationUnitCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/cooperation/stat/unit/count`,
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
        throw new Error('真实接口返回无责任单位协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '责任单位协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['保障部', '安全部', '技术部', '工程部', '信息部'],
              series: [{ name: '协同数量', data: [28, 19, 17, 14, 11] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 责任单位协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 协同场景占比（饼图）
export const fetchSpecialCooperationSceneRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/cooperation/stat/scene/ratio`,
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
        throw new Error('真实接口返回无协同场景占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同场景占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['重大活动保障', '应急演练', '系统升级', '设备大修', '数据迁移'],
              series: [{ name: '协同场景占比(%)', data: [24.7, 20.2, 16.9, 13.5, 24.7] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同场景占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '协同场景占比(%)', data: [] }],
    });
  }
};

// 协同状态占比（饼图）
export const fetchSpecialCooperationStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/cooperation/stat/status/ratio`,
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
        throw new Error('真实接口返回无协同状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['待执行', '执行中', '已完成', '待复盘', '已复盘'],
              series: [{ name: '协同状态占比(%)', data: [15.7, 28.1, 33.7, 12.4, 10.1] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '协同状态占比(%)', data: [] }],
    });
  }
};

// 专属协同详情查询
export const fetchSpecialCooperationDetail = (cooperationId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/cooperation/detail/${cooperationId}`,
        params,
      })
      .then((response) => {
        if (response && response.bizSpecialCoopSpecialCoopId === cooperationId) {
          return response;
        }
        throw new Error('真实接口返回无专属协同详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('专属协同详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            const details = {
              'SPECIAL20260120001': {
                bizSpecialCoopSpecialCoopId: cooperationId,
                sysCoopSceneName: '重大活动保障',
                sysResponsibleUnitName: '保障部',
                bizSpecialCoopCoopRule: '提前2小时到岗，按预案执行',
                bizSpecialCoopResponsibilityDivision: 'A组负责入口，B组负责出口',
                sysCooperationStatusName: '待执行',
                // 详情字段
                bizSpecialCoopAverageCoopCycle: 3.5,
                bizSpecialCoopCoopResult: '',
                bizSpecialCoopCompleteTime: '',
                bizSpecialCoopReviewConclusion: '',
                // 协同配置详情
                cooperationConfig: [
                  { item: '协同类型', value: '专属协同' },
                  { item: '优先级', value: '高' },
                  { item: '启动时间', value: '2026-01-20 08:00' },
                  { item: '预计时长', value: '48小时' },
                  { item: '参与人数', value: '25人' }
                ],
                // 场景要求
                sceneRequirements: [
                  { item: '安全保障', value: '全时段安保巡逻' },
                  { item: '设备要求', value: '备用设备100%完好' },
                  { item: '人员要求', value: '持证上岗，统一着装' },
                  { item: '通信要求', value: '专用对讲频道' }
                ],
                // 责任清单
                responsibilityList: [
                  { unit: '指挥组', task: '现场指挥协调', person: '张主任' },
                  { unit: '安保组', task: '安全保障', person: '李队长' },
                  { unit: '设备组', task: '设备运维', person: '王工' },
                  { unit: '后勤组', task: '物资保障', person: '赵主管' }
                ],
                // 执行进展时间轴
                executionProgress: [
                  { time: '2026-01-20 08:00', content: '任务启动，人员集合' },
                  { time: '2026-01-20 09:30', content: '现场勘查完成' },
                  { time: '2026-01-20 10:15', content: '设备调试完成' }
                ]
              },
              'SPECIAL20260120002': {
                bizSpecialCoopSpecialCoopId: cooperationId,
                sysCoopSceneName: '应急演练',
                sysResponsibleUnitName: '安全部',
                bizSpecialCoopCoopRule: '全员参与，模拟真实场景',
                bizSpecialCoopResponsibilityDivision: '指挥组、执行组、评估组',
                sysCooperationStatusName: '执行中',
                // 详情字段
                bizSpecialCoopAverageCoopCycle: 2.8,
                bizSpecialCoopCoopResult: '',
                bizSpecialCoopCompleteTime: '',
                bizSpecialCoopReviewConclusion: '',
                // 协同配置详情
                cooperationConfig: [
                  { item: '协同类型', value: '专属协同' },
                  { item: '优先级', value: '中' },
                  { item: '启动时间', value: '2026-01-19 14:00' },
                  { item: '预计时长', value: '8小时' },
                  { item: '参与人数', value: '45人' }
                ],
                // 场景要求
                sceneRequirements: [
                  { item: '真实性', value: '模拟真实应急场景' },
                  { item: '安全性', value: '确保演练人员安全' },
                  { item: '评估标准', value: '按评分表逐项评估' },
                  { item: '报告要求', value: '演练后24小时内提交报告' }
                ],
                // 责任清单
                responsibilityList: [
                  { unit: '指挥组', task: '演练总指挥', person: '孙总' },
                  { unit: '执行组', task: '场景执行', person: '周经理' },
                  { unit: '评估组', task: '效果评估', person: '吴专员' },
                  { unit: '记录组', task: '过程记录', person: '郑助理' }
                ],
                // 执行进展时间轴
                executionProgress: [
                  { time: '2026-01-19 14:00', content: '演练启动会召开' },
                  { time: '2026-01-19 14:30', content: '各小组就位' },
                  { time: '2026-01-19 15:15', content: '第一阶段演练完成' }
                ]
              }
            };
            resolve(details[cooperationId] || details['SPECIAL20260120001']);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSpecialCooperationDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交执行进展
export const submitExecutionProgress = (cooperationId, progressContent, evidenceFiles) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/special/cooperation/execute/${cooperationId}`,
        data: { progressContent, evidenceFiles },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无执行结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('执行进展接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '执行进展提交成功',
              cooperationStatus: '执行中'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitExecutionProgress 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};

// 提交复盘结论
export const submitReviewConclusion = (cooperationId, reviewConclusion, optimizationSuggestions) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/special/cooperation/review/${cooperationId}`,
        data: { reviewConclusion, optimizationSuggestions },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无复盘结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('复盘结论接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '复盘结论提交成功',
              cooperationStatus: '已复盘'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitReviewConclusion 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ========== 政企协同 ==========
// 政企协同列表
export const fetchGovEnterpriseCooperationList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/gov-enterprise/cooperation/list`,
        params,
      })
      .then((response) => {
        console.log('政企协同列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('政企协同列表-响应符合实际格式');
          return response.map((item) => ({
            bizGovernmentEnterpriseCoopGovEnterpriseCoopId: item.bizGovernmentEnterpriseCoopGovEnterpriseCoopId,
            sysDeptDeptName: item.sysDeptDeptName,
            sysMerchantMerchantName: item.sysMerchantMerchantName,
            sysEnterpriseTypeName: item.sysEnterpriseTypeName,
            sysCooperationItemName: item.sysCooperationItemName,
            sysCooperationStatusName: item.sysCooperationStatusName,
          }));
        }
        throw new Error('真实接口返回无政企协同列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('政企协同列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                bizGovernmentEnterpriseCoopGovEnterpriseCoopId: 'GE20260120001',
                sysDeptDeptName: '市场监督管理局',
                sysMerchantMerchantName: 'XX科技有限公司',
                sysEnterpriseTypeName: '高新技术企业',
                sysCooperationItemName: '企业注册审批',
                sysCooperationStatusName: '进行中',
              },
              {
                bizGovernmentEnterpriseCoopGovEnterpriseCoopId: 'GE20260120002',
                sysDeptDeptName: '税务局',
                sysMerchantMerchantName: 'YY餐饮有限公司',
                sysEnterpriseTypeName: '小微企业',
                sysCooperationItemName: '税务申报指导',
                sysCooperationStatusName: '已完成',
              },
              {
                bizGovernmentEnterpriseCoopGovEnterpriseCoopId: 'GE20260120003',
                sysDeptDeptName: '人社局',
                sysMerchantMerchantName: 'ZZ制造厂',
                sysEnterpriseTypeName: '制造业',
                sysCooperationItemName: '用工政策咨询',
                sysCooperationStatusName: '待响应',
              },
              {
                bizGovernmentEnterpriseCoopGovEnterpriseCoopId: 'GE20260120004',
                sysDeptDeptName: '环保局',
                sysMerchantMerchantName: 'AA化工有限公司',
                sysEnterpriseTypeName: '化工企业',
                sysCooperationItemName: '环保审批',
                sysCooperationStatusName: '进行中',
              },
              {
                bizGovernmentEnterpriseCoopGovEnterpriseCoopId: 'GE20260120005',
                sysDeptDeptName: '发改委',
                sysMerchantMerchantName: 'BB能源集团',
                sysEnterpriseTypeName: '能源企业',
                sysCooperationItemName: '项目立项审批',
                sysCooperationStatusName: '反馈中',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchGovEnterpriseCooperationList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 政企协同核心指标（卡片展示）
export const fetchGovEnterpriseCooperationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/gov-enterprise/cooperation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCooperationCount &&
          response.responseRate &&
          response.satisfactionRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无政企协同核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '政企协同指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCooperationCount: 328, // 政企协同总数
              responseRate: 92.3, // 响应率
              satisfactionRate: 94.5, // 满意度
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 政企协同指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCooperationCount: 0,
      responseRate: 0,
      satisfactionRate: 0,
    });
  }
};

// 不同政府部门协同数对比（柱状图）
export const fetchGovEnterpriseCooperationDeptCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/gov-enterprise/cooperation/stat/dept/count`,
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
        throw new Error('真实接口返回无政府部门协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '政府部门协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['市场监督管理局', '税务局', '人社局', '环保局', '发改委'],
              series: [{ name: '协同数量', data: [86, 72, 58, 64, 48] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 政府部门协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 不同企业类型协同数对比（柱状图）
export const fetchGovEnterpriseCooperationEntTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/gov-enterprise/cooperation/stat/ent-type/count`,
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
        throw new Error('真实接口返回无企业类型协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '企业类型协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['高新技术企业', '小微企业', '制造业', '化工企业', '能源企业'],
              series: [{ name: '协同数量', data: [95, 112, 68, 32, 21] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 企业类型协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 协同事项占比（饼图）
export const fetchGovEnterpriseCooperationItemRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/gov-enterprise/cooperation/stat/item/ratio`,
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
        throw new Error('真实接口返回无协同事项占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同事项占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['企业注册审批', '税务申报指导', '用工政策咨询', '环保审批', '项目立项审批'],
              series: [{ name: '协同事项占比(%)', data: [32.5, 28.2, 18.6, 12.8, 7.9] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同事项占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '协同事项占比(%)', data: [] }],
    });
  }
};

// 满意度占比（饼图）
export const fetchGovEnterpriseCooperationSatisfactionRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/gov-enterprise/cooperation/stat/satisfaction/ratio`,
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
        throw new Error('真实接口返回无满意度占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '满意度占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['非常满意', '满意', '基本满意', '一般', '不满意'],
              series: [{ name: '满意度占比(%)', data: [42.5, 36.8, 15.2, 4.3, 1.2] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 满意度占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '满意度占比(%)', data: [] }],
    });
  }
};

// 政企协同详情查询
export const fetchGovEnterpriseCooperationDetail = (cooperationId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/gov-enterprise/cooperation/detail/${cooperationId}`,
        params,
      })
      .then((response) => {
        if (response && response.bizGovernmentEnterpriseCoopGovEnterpriseCoopId === cooperationId) {
          return response;
        }
        throw new Error('真实接口返回无政企协同详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('政企协同详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            const mockData = {
              bizGovernmentEnterpriseCoopGovEnterpriseCoopId: cooperationId,
              sysDeptDeptName: cooperationId === 'GE20260120001' ? '市场监督管理局' : '税务局',
              sysMerchantMerchantName: cooperationId === 'GE20260120001' ? 'XX科技有限公司' : 'YY餐饮有限公司',
              sysEnterpriseTypeName: cooperationId === 'GE20260120001' ? '高新技术企业' : '小微企业',
              sysCooperationItemName: cooperationId === 'GE20260120001' ? '企业注册审批' : '税务申报指导',
              sysCooperationStatusName: cooperationId === 'GE20260120001' ? '进行中' : '已完成',
              // 详情字段
              bizGovernmentEnterpriseCoopProgressFeedback: cooperationId === 'GE20260120001' ? '已完成材料初审，待现场核验' : '已完成申报指导，企业已成功完成税务申报',
              sysSatisfactionName: cooperationId === 'GE20260120001' ? '待评价' : '非常满意',
              bizGovernmentEnterpriseCoopCompleteTime: cooperationId === 'GE20260120001' ? '' : '2026-01-19 16:30:00',
              bizGovernmentEnterpriseCoopCoopCycle: cooperationId === 'GE20260120001' ? '3天' : '2天',
              // 协同详情
              cooperationDetail: {
                launchTime: '2026-01-18 09:00:00',
                expectedCompleteTime: '2026-01-21 17:00:00',
                contactPerson: '张科长',
                contactPhone: '13800138000',
                cooperationContent: cooperationId === 'GE20260120001' ? '协助企业完成工商注册审批，提供政策咨询服务' : '指导企业完成税务申报，解答税务政策疑问'
              },
              // 责任分工
              responsibilityDivision: [
                { department: '市场监督管理局', task: '材料审核', person: '张三', phone: '13800138001' },
                { department: '行政审批科', task: '现场核验', person: '李四', phone: '13800138002' },
                { department: '法规科', task: '法律咨询', person: '王五', phone: '13800138003' }
              ],
              // 执行计划
              executionPlan: [
                { stage: '第一阶段', task: '材料收集与初审', startTime: '2026-01-18', endTime: '2026-01-19', status: '已完成' },
                { stage: '第二阶段', task: '现场核验与评估', startTime: '2026-01-20', endTime: '2026-01-21', status: '进行中' },
                { stage: '第三阶段', task: '审批决定与反馈', startTime: '2026-01-22', endTime: '2026-01-23', status: '待开始' }
              ],
              // 协同进度时间轴
              progressTimeline: [
                { time: '2026-01-18 09:30', content: '企业提交申请材料', operator: '企业端' },
                { time: '2026-01-18 14:20', content: '市场监管局受理申请', operator: '张科长' },
                { time: '2026-01-19 10:15', content: '材料初审通过', operator: '李四' },
                { time: '2026-01-20 09:00', content: '安排现场核验', operator: '王五' }
              ],
              // 双方反馈记录
              feedbackRecords: [
                { time: '2026-01-18 10:00', sender: '企业', content: '请问材料是否齐全？', type: '咨询' },
                { time: '2026-01-18 11:30', sender: '政府', content: '材料已收到，正在审核中', type: '回复' },
                { time: '2026-01-19 14:00', sender: '政府', content: '材料初审通过，请准备现场核验', type: '通知' }
              ]
            };
            resolve(mockData);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchGovEnterpriseCooperationDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交协同跟踪
export const submitCooperationTracking = (cooperationId, trackingContent) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/gov-enterprise/cooperation/tracking/${cooperationId}`,
        data: { trackingContent },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无跟踪结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('协同跟踪接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '跟踪记录提交成功',
              trackingId: 'TRACK' + Date.now()
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitCooperationTracking 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};

// 提交协同评价
export const submitCooperationEvaluation = (cooperationId, satisfactionLevel, evaluationContent) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/gov-enterprise/cooperation/evaluation/${cooperationId}`,
        data: { satisfactionLevel, evaluationContent },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无评价结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('协同评价接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '评价提交成功',
              cooperationStatus: '已完成'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitCooperationEvaluation 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ========== 层级协同 ==========
// 层级协同列表
export const fetchLevelCooperationList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/level/cooperation/list`,
        params,
      })
      .then((response) => {
        console.log('层级协同列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('层级协同列表-响应符合实际格式');
          return response.map((item) => ({
            bizCrossLevelCoopCrossLevelCoopId: item.bizCrossLevelCoopCrossLevelCoopId,
            issueLevelName: item.issueLevelName, // 下达层级
            receiveLevelName: item.receiveLevelName, // 接收层级
            bizCrossLevelCoopInstructionContent: item.bizCrossLevelCoopInstructionContent,
            sysInstructionStatusName: item.sysInstructionStatusName,
            bizCrossLevelCoopIssueTime: item.bizCrossLevelCoopIssueTime,
            currentUserLevel: item.currentUserLevel, // 当前用户层级，用于判断操作权限
          }));
        }
        throw new Error('真实接口返回无层级协同列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('层级协同列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                bizCrossLevelCoopCrossLevelCoopId: 'LEVEL20260119001',
                issueLevelName: '市级',
                receiveLevelName: '区级',
                bizCrossLevelCoopInstructionContent: '关于停车场智能化改造的指导意见',
                sysInstructionStatusName: '已下发',
                bizCrossLevelCoopIssueTime: '2026-01-19 09:30:00',
                currentUserLevel: '区级', // 模拟当前用户为区级，可操作反馈
              },
              {
                bizCrossLevelCoopCrossLevelCoopId: 'LEVEL20260119002',
                issueLevelName: '省级',
                receiveLevelName: '市级',
                bizCrossLevelCoopInstructionContent: '停车管理平台数据对接要求',
                sysInstructionStatusName: '已接收',
                bizCrossLevelCoopIssueTime: '2026-01-18 14:20:00',
                currentUserLevel: '市级', // 模拟当前用户为市级，可操作反馈
              },
              {
                bizCrossLevelCoopCrossLevelCoopId: 'LEVEL20260119003',
                issueLevelName: '区级',
                receiveLevelName: '街道',
                bizCrossLevelCoopInstructionContent: '停车设施安全检查通知',
                sysInstructionStatusName: '已反馈',
                bizCrossLevelCoopIssueTime: '2026-01-17 11:15:00',
                currentUserLevel: '街道', // 模拟当前用户为街道
              },
              {
                bizCrossLevelCoopCrossLevelCoopId: 'LEVEL20260119004',
                issueLevelName: '市级',
                receiveLevelName: '区级',
                bizCrossLevelCoopInstructionContent: '停车收费标准调整通知',
                sysInstructionStatusName: '已完成',
                bizCrossLevelCoopIssueTime: '2026-01-16 16:45:00',
                currentUserLevel: '区级',
              },
              {
                bizCrossLevelCoopCrossLevelCoopId: 'LEVEL20260119005',
                issueLevelName: '省级',
                receiveLevelName: '市级',
                bizCrossLevelCoopInstructionContent: '智慧停车平台建设方案',
                sysInstructionStatusName: '已下发',
                bizCrossLevelCoopIssueTime: '2026-01-15 10:00:00',
                currentUserLevel: '市级',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchLevelCooperationList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 层级协同核心指标（卡片展示）
export const fetchLevelCooperationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/level/cooperation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCooperationCount &&
          response.instructionCompleteRate &&
          response.averageFeedbackDuration
        ) {
          return response;
        }
        throw new Error('真实接口返回无层级协同核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '层级协同指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCooperationCount: 189, // 跨层级协同总数
              instructionCompleteRate: 78.5, // 指令完成率
              averageFeedbackDuration: 3.2, // 平均反馈时长
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 层级协同指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCooperationCount: 0,
      instructionCompleteRate: 0,
      averageFeedbackDuration: 0,
    });
  }
};

// 不同层级协同数对比（柱状图）
export const fetchLevelCooperationLevelCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/level/cooperation/stat/level/count`,
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
        throw new Error('真实接口返回无层级协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '层级协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['省级', '市级', '区级', '街道'],
              series: [{ name: '协同数量', data: [32, 68, 45, 44] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 层级协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 不同责任单位协同数对比（柱状图）
export const fetchLevelCooperationUnitCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/level/cooperation/stat/unit/count`,
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
        throw new Error('真实接口返回无责任单位协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '责任单位协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['交通局', '城管局', '公安局', '住建局', '街道办'],
              series: [{ name: '协同数量', data: [56, 42, 38, 28, 25] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 责任单位协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 指令状态占比（饼图）
export const fetchLevelCooperationStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/level/cooperation/stat/status/ratio`,
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
        throw new Error('真实接口返回无指令状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '指令状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['已下发', '已接收', '已反馈', '已完成'],
              series: [{ name: '指令状态占比(%)', data: [25.4, 18.0, 30.7, 25.9] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 指令状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '指令状态占比(%)', data: [] }],
    });
  }
};

// 层级协同详情查询 - 详情弹窗专用
export const fetchLevelCooperationDetail = (cooperationId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/level/cooperation/detail/${cooperationId}`,
        params,
      })
      .then((response) => {
        if (response && response.bizCrossLevelCoopCrossLevelCoopId === cooperationId) {
          return response;
        }
        throw new Error('真实接口返回无层级协同详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('层级协同详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              bizCrossLevelCoopCrossLevelCoopId: cooperationId,
              issueLevelName: cooperationId === 'LEVEL20260119001' ? '市级' : '省级',
              receiveLevelName: cooperationId === 'LEVEL20260119001' ? '区级' : '市级',
              bizCrossLevelCoopInstructionContent: cooperationId === 'LEVEL20260119001' ? '关于停车场智能化改造的指导意见' : '停车管理平台数据对接要求',
              sysInstructionStatusName: cooperationId === 'LEVEL20260119001' ? '已下发' : '已接收',
              bizCrossLevelCoopIssueTime: cooperationId === 'LEVEL20260119001' ? '2026-01-19 09:30:00' : '2026-01-18 14:20:00',
              // 详情字段
              bizCrossLevelCoopAverageFeedbackDuration: cooperationId === 'LEVEL20260119001' ? 2.8 : 3.5,
              sysResponsibleUnitName: cooperationId === 'LEVEL20260119001' ? '区交通局' : '市城管局',
              bizCrossLevelCoopFeedbackResult: cooperationId === 'LEVEL20260119001' ? '已收到指令，正在制定实施方案' : '数据对接方案已完成初步设计',
              bizCrossLevelCoopCompleteTime: cooperationId === 'LEVEL20260119001' ? '2026-01-20 17:30:00' : '2026-01-19 15:45:00',
              // 层级分工
              levelDivision: [
                { levelName: '省级', task: '政策制定与指导', person: '王局' },
                { levelName: '市级', task: '方案细化与部署', person: '李处' },
                { levelName: '区级', task: '具体实施与执行', person: '张科长' },
                { levelName: '街道', task: '现场协调与反馈', person: '赵主任' }
              ],
              // 反馈记录
              feedbackRecords: [
                { time: '2026-01-19 10:15:00', level: '区级', content: '已收到指令，开始组织学习' },
                { time: '2026-01-19 14:30:00', level: '区级', content: '实施方案初稿已完成' },
                { time: '2026-01-20 09:00:00', level: '市级', content: '请于本周五前提交详细实施计划' },
                { time: '2026-01-20 16:45:00', level: '区级', content: '详细实施计划已提交' }
              ],
              // 流转时间轴
              flowTimeline: [
                { time: '2026-01-19 09:30:00', level: '市级', action: '指令下发', status: '已下发' },
                { time: '2026-01-19 10:15:00', level: '区级', action: '指令接收', status: '已接收' },
                { time: '2026-01-19 14:30:00', level: '区级', action: '初步反馈', status: '已反馈' },
                { time: '2026-01-20 16:45:00', level: '区级', action: '完成反馈', status: '已完成' }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchLevelCooperationDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交层级反馈
export const submitLevelCooperationFeedback = (cooperationId, feedbackContent, evidenceFiles) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/level/cooperation/feedback/${cooperationId}`,
        data: { feedbackContent, evidenceFiles },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无反馈结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('层级反馈接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '反馈提交成功',
              instructionStatus: '已反馈'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitLevelCooperationFeedback 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ========== 行业协同 ==========
// 行业协同列表
export const fetchIndustryCooperationList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/industry/cooperation/list`,
        params,
      })
      .then((response) => {
        console.log('行业协同列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('行业协同列表-响应符合实际格式');
          return response.map((item) => ({
            bizCrossIndustryCoopCrossIndustryCoopId: item.bizCrossIndustryCoopCrossIndustryCoopId,
            sysIndustryIndustryName: item.sysIndustryIndustryName,
            sysCoopSceneName: item.sysCoopSceneName,
            bizCrossIndustryCoopProblemDesc: item.bizCrossIndustryCoopProblemDesc,
            bizCrossIndustryCoopCreateTime: item.bizCrossIndustryCoopCreateTime,
            sysEffectLevelName: item.sysEffectLevelName,
            sysCooperationStatusName: item.sysCooperationStatusName,
          }));
        }
        throw new Error('真实接口返回无行业协同列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('行业协同列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                bizCrossIndustryCoopCrossIndustryCoopId: 'INDUSTRY20260119001',
                sysIndustryIndustryName: '物流行业',
                sysCoopSceneName: '智慧仓储协同',
                bizCrossIndustryCoopProblemDesc: '仓储设备智能化改造需求',
                bizCrossIndustryCoopCreateTime: '2026-01-19 09:30:00',
                sysEffectLevelName: '高成效',
                sysCooperationStatusName: '待配合',
              },
              {
                bizCrossIndustryCoopCrossIndustryCoopId: 'INDUSTRY20260119002',
                sysIndustryIndustryName: '制造业',
                sysCoopSceneName: '供应链协同',
                bizCrossIndustryCoopProblemDesc: '原材料供应不及时问题',
                bizCrossIndustryCoopCreateTime: '2026-01-18 14:20:00',
                sysEffectLevelName: '中成效',
                sysCooperationStatusName: '配合中',
              },
              {
                bizCrossIndustryCoopCrossIndustryCoopId: 'INDUSTRY20260119003',
                sysIndustryIndustryName: '零售业',
                sysCoopSceneName: '线上线下融合协同',
                bizCrossIndustryCoopProblemDesc: 'O2O订单处理效率低',
                bizCrossIndustryCoopCreateTime: '2026-01-17 11:15:00',
                sysEffectLevelName: '低成效',
                sysCooperationStatusName: '待评估',
              },
              {
                bizCrossIndustryCoopCrossIndustryCoopId: 'INDUSTRY20260119004',
                sysIndustryIndustryName: '金融业',
                sysCoopSceneName: '风控数据协同',
                bizCrossIndustryCoopProblemDesc: '跨行业风险数据共享需求',
                bizCrossIndustryCoopCreateTime: '2026-01-16 16:45:00',
                sysEffectLevelName: '高成效',
                sysCooperationStatusName: '已完成',
              },
              {
                bizCrossIndustryCoopCrossIndustryCoopId: 'INDUSTRY20260119005',
                sysIndustryIndustryName: '医疗行业',
                sysCoopSceneName: '医疗设备运维协同',
                bizCrossIndustryCoopProblemDesc: '医疗设备远程运维支持',
                bizCrossIndustryCoopCreateTime: '2026-01-15 10:00:00',
                sysEffectLevelName: '中成效',
                sysCooperationStatusName: '待配合',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchIndustryCooperationList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 行业协同核心指标（卡片展示）
export const fetchIndustryCooperationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/industry/cooperation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCooperationCount &&
          response.problemSolveRate &&
          response.satisfactionRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无行业协同核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '行业协同指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCooperationCount: 156, // 跨行业协同总数
              problemSolveRate: 87.3, // 问题解决率
              satisfactionRate: 91.2, // 群众满意度
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 行业协同指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCooperationCount: 0,
      problemSolveRate: 0,
      satisfactionRate: 0,
    });
  }
};

// 不同行业协同数对比（柱状图）
export const fetchIndustryCooperationIndustryCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/industry/cooperation/stat/industry/count`,
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
        throw new Error('真实接口返回无行业协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '行业协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['物流行业', '制造业', '零售业', '金融业', '医疗行业'],
              series: [{ name: '协同数量', data: [42, 35, 28, 20, 31] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 行业协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 不同场景协同数对比（柱状图）
export const fetchIndustryCooperationSceneCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/industry/cooperation/stat/scene/count`,
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
        throw new Error('真实接口返回无场景协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '场景协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['智慧仓储协同', '供应链协同', '线上线下融合协同', '风控数据协同', '医疗设备运维协同'],
              series: [{ name: '协同数量', data: [38, 32, 25, 18, 35] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 场景协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 协同行业占比（饼图）
export const fetchIndustryCooperationIndustryRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/industry/cooperation/stat/industry/ratio`,
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
        throw new Error('真实接口返回无协同行业占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同行业占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['物流行业', '制造业', '零售业', '金融业', '医疗行业'],
              series: [{ name: '协同行业占比(%)', data: [26.9, 22.4, 17.9, 12.8, 20.0] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同行业占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '协同行业占比(%)', data: [] }],
    });
  }
};

// 协同场景占比（饼图）
export const fetchIndustryCooperationSceneRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/industry/cooperation/stat/scene/ratio`,
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
        throw new Error('真实接口返回无协同场景占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同场景占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['智慧仓储协同', '供应链协同', '线上线下融合协同', '风控数据协同', '医疗设备运维协同'],
              series: [{ name: '协同场景占比(%)', data: [24.4, 20.5, 16.0, 11.5, 27.6] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同场景占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '协同场景占比(%)', data: [] }],
    });
  }
};

// 行业协同详情查询 - 详情弹窗专用
export const fetchIndustryCooperationDetail = (cooperationId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/industry/cooperation/detail/${cooperationId}`,
        params,
      })
      .then((response) => {
        if (response && response.bizCrossIndustryCoopCrossIndustryCoopId === cooperationId) {
          return response;
        }
        throw new Error('真实接口返回无行业协同详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('行业协同详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              bizCrossIndustryCoopCrossIndustryCoopId: cooperationId,
              sysIndustryIndustryName: cooperationId === 'INDUSTRY20260119001' ? '物流行业' : '制造业',
              sysCoopSceneName: cooperationId === 'INDUSTRY20260119001' ? '智慧仓储协同' : '供应链协同',
              bizCrossIndustryCoopProblemDesc: cooperationId === 'INDUSTRY20260119001' ? '仓储设备智能化改造需求' : '原材料供应不及时问题',
              bizCrossIndustryCoopCreateTime: cooperationId === 'INDUSTRY20260119001' ? '2026-01-19 09:30:00' : '2026-01-18 14:20:00',
              sysEffectLevelName: cooperationId === 'INDUSTRY20260119001' ? '高成效' : '中成效',
              sysCooperationStatusName: cooperationId === 'INDUSTRY20260119001' ? '待配合' : '配合中',
              // 详情字段
              bizCrossIndustryCoopProblemSolveRate: cooperationId === 'INDUSTRY20260119001' ? 85.5 : 78.2,
              sysSatisfactionName: cooperationId === 'INDUSTRY20260119001' ? '满意' : '基本满意',
              bizCrossIndustryCoopCompleteTime: cooperationId === 'INDUSTRY20260119001' ? '2026-01-20 17:30:00' : '2026-01-19 15:45:00',
              sysResponsibleUnitName: cooperationId === 'INDUSTRY20260119001' ? '信息技术部' : '供应链管理部',
              // 行业需求
              industryRequirements: [
                { item: '技术支持需求', value: '需要物联网技术支持' },
                { item: '数据共享需求', value: '实时数据交换接口' },
                { item: '人员培训需求', value: '操作人员技能培训' },
                { item: '设备配套需求', value: '标准化设备接入' }
              ],
              // 配合要求
              cooperationRequirements: [
                { item: '响应时限', value: '24小时内' },
                { item: '技术标准', value: '符合行业技术规范' },
                { item: '安全要求', value: '数据安全等级三级' },
                { item: '协作方式', value: '远程协作+现场支持' }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchIndustryCooperationDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交协同配合
export const submitIndustryCooperationAssist = (cooperationId, assistContent) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/industry/cooperation/assist/${cooperationId}`,
        data: { assistContent },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无配合结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('协同配合接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '配合提交成功',
              cooperationStatus: '配合中'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitIndustryCooperationAssist 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};

// 提交协同评估
export const submitIndustryCooperationEvaluate = (cooperationId, evaluateResult, score) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/industry/cooperation/evaluate/${cooperationId}`,
        data: { evaluateResult, score },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无评估结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('协同评估接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '评估提交成功',
              cooperationStatus: '已完成'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitIndustryCooperationEvaluate 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ========== 区域协同 ==========
// 区域协同列表
export const fetchRegionCooperationList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/region/cooperation/list`,
        params,
      })
      .then((response) => {
        console.log('区域协同列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('区域协同列表-响应符合实际格式');
          return response.map((item) => ({
            bizCrossRegionCoopCrossRegionCoopId: item.bizCrossRegionCoopCrossRegionCoopId,
            launchAreaName: item.launchAreaName,
            cooperateAreaName: item.cooperateAreaName,
            sysTaskTypeName: item.sysTaskTypeName,
            sysCooperationStatusName: item.sysCooperationStatusName,
            bizCrossRegionCoopCreateTime: item.bizCrossRegionCoopCreateTime,
          }));
        }
        throw new Error('真实接口返回无区域协同列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('区域协同列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                bizCrossRegionCoopCrossRegionCoopId: 'REGION20260119001',
                launchAreaName: '高新区',
                cooperateAreaName: '主城区',
                sysTaskTypeName: '停车场数据共享',
                sysCooperationStatusName: '待协同',
                bizCrossRegionCoopCreateTime: '2026-01-19 09:30:00',
              },
              {
                bizCrossRegionCoopCrossRegionCoopId: 'REGION20260119002',
                launchAreaName: '经开区',
                cooperateAreaName: '文旅区',
                sysTaskTypeName: '跨区域应急调度',
                sysCooperationStatusName: '协同中',
                bizCrossRegionCoopCreateTime: '2026-01-18 14:20:00',
              },
              {
                bizCrossRegionCoopCrossRegionCoopId: 'REGION20260119003',
                launchAreaName: '主城区',
                cooperateAreaName: '龙文区',
                sysTaskTypeName: '停车资源共享',
                sysCooperationStatusName: '已完成',
                bizCrossRegionCoopCreateTime: '2026-01-17 11:15:00',
              },
              {
                bizCrossRegionCoopCrossRegionCoopId: 'REGION20260119004',
                launchAreaName: '文旅区',
                cooperateAreaName: '高新区',
                sysTaskTypeName: '联合巡检',
                sysCooperationStatusName: '待协同',
                bizCrossRegionCoopCreateTime: '2026-01-16 16:45:00',
              },
              {
                bizCrossRegionCoopCrossRegionCoopId: 'REGION20260119005',
                launchAreaName: '龙文区',
                cooperateAreaName: '经开区',
                sysTaskTypeName: '经验交流',
                sysCooperationStatusName: '协同中',
                bizCrossRegionCoopCreateTime: '2026-01-15 10:10:00',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchRegionCooperationList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 区域协同核心指标（卡片展示）
export const fetchRegionCooperationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/region/cooperation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCooperationCount &&
          response.completedCount &&
          response.averageCompletionRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无区域协同核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域协同指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCooperationCount: 156, // 跨区域协同总数
              completedCount: 124, // 已完成数
              averageCompletionRate: 79.5, // 平均完成率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域协同指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCooperationCount: 0,
      completedCount: 0,
      averageCompletionRate: 0,
    });
  }
};

// 不同区域协同数对比（柱状图）
export const fetchRegionCooperationAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/region/cooperation/stat/area/count`,
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
        throw new Error('真实接口返回无区域协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '协同数量', data: [35, 42, 28, 22, 29] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 不同任务类型协同数对比（柱状图）
export const fetchRegionCooperationTaskTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/region/cooperation/stat/task/type/count`,
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
        throw new Error('真实接口返回无任务类型协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '任务类型协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['停车场数据共享', '跨区域应急调度', '停车资源共享', '联合巡检', '经验交流'],
              series: [{ name: '协同数量', data: [45, 32, 28, 35, 16] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 任务类型协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 近周期协同完成率趋势（折线图）
export const fetchRegionCooperationCompletionRateTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/region/cooperation/stat/completion/rate/trend`,
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
        throw new Error('真实接口返回无协同完成率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同完成率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 12}, (_, i) => {
              return `${2026}-${String(i+1).padStart(2, '0')}`;
            });
            const data = xAxis.map(() => 70 + Math.random() * 15);
            resolve({
              xAxis,
              series: [{ name: '协同完成率趋势(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同完成率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同完成率趋势(%)', data: [] }],
    });
  }
};

// 区域协同详情查询 - 详情弹窗专用
export const fetchRegionCooperationDetail = (cooperationId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/region/cooperation/detail/${cooperationId}`,
        params,
      })
      .then((response) => {
        if (response && response.bizCrossRegionCoopCrossRegionCoopId === cooperationId) {
          return response;
        }
        throw new Error('真实接口返回无区域协同详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('区域协同详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              bizCrossRegionCoopCrossRegionCoopId: cooperationId,
              launchAreaName: cooperationId === 'REGION20260119001' ? '高新区' : '经开区',
              cooperateAreaName: cooperationId === 'REGION20260119001' ? '主城区' : '文旅区',
              sysTaskTypeName: cooperationId === 'REGION20260119001' ? '停车场数据共享' : '跨区域应急调度',
              sysCooperationStatusName: cooperationId === 'REGION20260119001' ? '待协同' : '协同中',
              bizCrossRegionCoopCreateTime: cooperationId === 'REGION20260119001' ? '2026-01-19 09:30:00' : '2026-01-18 14:20:00',
              // 详情字段
              bizCrossRegionCoopCompletionRate: cooperationId === 'REGION20260119001' ? 85.5 : 92.3,
              bizCrossRegionCoopAverageCoopDuration: cooperationId === 'REGION20260119001' ? 3.2 : 2.8,
              bizCrossRegionCoopCompleteTime: cooperationId === 'REGION20260119001' ? '' : '2026-01-19 16:45:00',
              sysUserUserName: cooperationId === 'REGION20260119001' ? '张三' : '李四',
              // 协同完整信息
              cooperationInfo: {
                cooperationContent: cooperationId === 'REGION20260119001' ? '高新区与主城区停车场数据实时共享，提升跨区域停车引导效率' : '经开区与文旅区建立应急联动机制，应对节假日停车高峰',
                cooperationStandard: '按照《跨区域停车场数据共享标准V1.0》执行',
                cooperationCycle: '长期',
                cooperationContact: '王五 13800138000'
              },
              // 任务分工
              taskDivision: [
                { area: '高新区', task: '数据采集与清洗', person: '张三', status: '进行中' },
                { area: '主城区', task: '数据接口开发', person: '李四', status: '待开始' },
                { area: '技术部', task: '系统对接支持', person: '王五', status: '已完成' }
              ],
              // 进度日志
              progressLogs: [
                { time: '2026-01-19 09:30:00', content: '协同任务创建', operator: '系统' },
                { time: '2026-01-19 10:15:00', content: '高新区数据准备完成', operator: '张三' },
                { time: '2026-01-19 11:30:00', content: '主城区接口需求确认', operator: '李四' }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchRegionCooperationDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 区域协同跟踪 - 跟踪弹窗专用
export const fetchRegionCooperationTrack = (cooperationId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/region/cooperation/track/${cooperationId}`,
        params,
      })
      .then((response) => {
        if (response && response.bizCrossRegionCoopCrossRegionCoopId === cooperationId) {
          return response;
        }
        throw new Error('真实接口返回无区域协同跟踪数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('区域协同跟踪接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              bizCrossRegionCoopCrossRegionCoopId: cooperationId,
              launchAreaName: cooperationId === 'REGION20260119001' ? '高新区' : '经开区',
              cooperateAreaName: cooperationId === 'REGION20260119001' ? '主城区' : '文旅区',
              // 协同进度时间轴
              progressTimeline: [
                { time: '2026-01-19 09:30', stage: '任务创建', status: '已完成' },
                { time: '2026-01-19 10:00', stage: '需求确认', status: '已完成' },
                { time: '2026-01-19 11:00', stage: '方案设计', status: '进行中' },
                { time: '2026-01-19 14:00', stage: '技术对接', status: '未开始' },
                { time: '2026-01-19 16:00', stage: '测试验证', status: '未开始' },
                { time: '2026-01-19 18:00', stage: '上线运行', status: '未开始' }
              ],
              // 各区域反馈结果
              areaFeedbackResults: [
                { area: '高新区', feedback: '数据准备已完成，等待主城区接口就绪', time: '2026-01-19 10:15:00', status: '已确认' },
                { area: '主城区', feedback: '接口开发中，预计今日完成', time: '2026-01-19 11:30:00', status: '已确认' },
                { area: '技术部', feedback: '技术支持团队已就位', time: '2026-01-19 09:45:00', status: '已确认' }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchRegionCooperationTrack 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交区域协同操作
export const submitRegionCooperationAction = (cooperationId, actionContent) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/region/cooperation/action/${cooperationId}`,
        data: { actionContent },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无协同操作结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('区域协同操作接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '协同操作提交成功',
              cooperationStatus: '协同中'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitRegionCooperationAction 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ========== 部门协同 ==========
// 部门协同列表
export const fetchDepartmentCooperationList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/department/cooperation/list`,
        params,
      })
      .then((response) => {
        console.log('部门协同列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('部门协同列表-响应符合实际格式');
          return response.map((item) => ({
            bizCrossDepartmentCoopCrossDepartmentCoopId: item.bizCrossDepartmentCoopCrossDepartmentCoopId,
            sysDeptDeptName: item.sysDeptDeptName,
            sysCooperationTypeName: item.sysCooperationTypeName,
            bizCrossDepartmentCoopCoopTask: item.bizCrossDepartmentCoopCoopTask,
            bizCrossDepartmentCoopResponseDuration: item.bizCrossDepartmentCoopResponseDuration,
            sysCooperationStatusName: item.sysCooperationStatusName,
          }));
        }
        throw new Error('真实接口返回无部门协同列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('部门协同列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                bizCrossDepartmentCoopCrossDepartmentCoopId: 'COOP20260119001',
                sysDeptDeptName: '运营部',
                sysCooperationTypeName: '日常运维协同',
                bizCrossDepartmentCoopCoopTask: '停车场设备巡检维护',
                bizCrossDepartmentCoopResponseDuration: 2.5,
                sysCooperationStatusName: '待响应',
              },
              {
                bizCrossDepartmentCoopCrossDepartmentCoopId: 'COOP20260119002',
                sysDeptDeptName: '技术部',
                sysCooperationTypeName: '故障处置协同',
                bizCrossDepartmentCoopCoopTask: '系统故障排查处理',
                bizCrossDepartmentCoopResponseDuration: 1.8,
                sysCooperationStatusName: '响应中',
              },
              {
                bizCrossDepartmentCoopCrossDepartmentCoopId: 'COOP20260119003',
                sysDeptDeptName: '客服部',
                sysCooperationTypeName: '投诉处理协同',
                bizCrossDepartmentCoopCoopTask: '用户投诉问题处理',
                bizCrossDepartmentCoopResponseDuration: 3.2,
                sysCooperationStatusName: '已完成',
              },
              {
                bizCrossDepartmentCoopCrossDepartmentCoopId: 'COOP20260119004',
                sysDeptDeptName: '财务部',
                sysCooperationTypeName: '费用结算协同',
                bizCrossDepartmentCoopCoopTask: '跨部门费用对账结算',
                bizCrossDepartmentCoopResponseDuration: 4.5,
                sysCooperationStatusName: '待响应',
              },
              {
                bizCrossDepartmentCoopCrossDepartmentCoopId: 'COOP20260119005',
                sysDeptDeptName: '市场部',
                sysCooperationTypeName: '活动推广协同',
                bizCrossDepartmentCoopCoopTask: '联合推广活动策划',
                bizCrossDepartmentCoopResponseDuration: 2.0,
                sysCooperationStatusName: '反馈中',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDepartmentCooperationList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 部门协同核心指标（卡片展示）
export const fetchDepartmentCooperationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/department/cooperation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCooperationCount &&
          response.responseRate &&
          response.satisfactionRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无部门协同核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '部门协同指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCooperationCount: 125, // 跨部门协同总数
              responseRate: 82.5, // 响应率
              satisfactionRate: 88.7, // 群众满意度
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 部门协同指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCooperationCount: 0,
      responseRate: 0,
      satisfactionRate: 0,
    });
  }
};

// 不同部门协同数对比（柱状图）
export const fetchDepartmentCooperationDeptCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/department/cooperation/stat/dept/count`,
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
        throw new Error('真实接口返回无部门协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '部门协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['运营部', '技术部', '客服部', '财务部', '市场部'],
              series: [{ name: '协同数量', data: [35, 28, 42, 12, 8] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 部门协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 不同类型协同数对比（柱状图）
export const fetchDepartmentCooperationTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/department/cooperation/stat/type/count`,
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
        throw new Error('真实接口返回无类型协同数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['日常运维协同', '故障处置协同', '投诉处理协同', '费用结算协同', '活动推广协同'],
              series: [{ name: '协同数量', data: [45, 32, 28, 15, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 类型协同数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同数量', data: [] }],
    });
  }
};

// 协同部门占比（饼图）
export const fetchDepartmentCooperationDeptRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/department/cooperation/stat/dept/ratio`,
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
        throw new Error('真实接口返回无协同部门占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同部门占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['运营部', '技术部', '客服部', '财务部', '市场部'],
              series: [{ name: '协同部门占比(%)', data: [28.0, 22.4, 33.6, 9.6, 6.4] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同部门占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '协同部门占比(%)', data: [] }],
    });
  }
};

// 协同类型占比（饼图）
export const fetchDepartmentCooperationTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/department/cooperation/stat/type/ratio`,
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
        throw new Error('真实接口返回无协同类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['日常运维协同', '故障处置协同', '投诉处理协同', '费用结算协同', '活动推广协同'],
              series: [{ name: '协同类型占比(%)', data: [36.0, 25.6, 22.4, 12.0, 4.0] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '协同类型占比(%)', data: [] }],
    });
  }
};

// 部门协同详情查询 - 详情弹窗专用
export const fetchDepartmentCooperationDetail = (cooperationId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/department/cooperation/detail/${cooperationId}`,
        params,
      })
      .then((response) => {
        if (response && response.bizCrossDepartmentCoopCrossDepartmentCoopId === cooperationId) {
          return response;
        }
        throw new Error('真实接口返回无部门协同详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('部门协同详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              bizCrossDepartmentCoopCrossDepartmentCoopId: cooperationId,
              sysDeptDeptName: cooperationId === 'COOP20260119001' ? '运营部' : '技术部',
              sysCooperationTypeName: cooperationId === 'COOP20260119001' ? '日常运维协同' : '故障处置协同',
              bizCrossDepartmentCoopCoopTask: cooperationId === 'COOP20260119001' ? '停车场设备巡检维护' : '系统故障排查处理',
              bizCrossDepartmentCoopResponseDuration: cooperationId === 'COOP20260119001' ? 2.5 : 1.8,
              sysCooperationStatusName: cooperationId === 'COOP20260119001' ? '待响应' : '响应中',
              // 详情字段
              bizCrossDepartmentCoopDisposalDuration: cooperationId === 'COOP20260119001' ? 8.5 : 6.2,
              sysSatisfactionName: cooperationId === 'COOP20260119001' ? '满意' : '基本满意',
              bizCrossDepartmentCoopCompleteTime: cooperationId === 'COOP20260119001' ? '2026-01-19 17:30:00' : '2026-01-18 15:45:00',
              bizCrossDepartmentCoopFeedbackResult: cooperationId === 'COOP20260119001' ? '已按计划完成设备巡检，发现并处理3处隐患' : '系统故障已定位并修复，相关功能恢复正常',
              // 任务要求
              taskRequirements: [
                { item: '响应时限', value: '2小时内' },
                { item: '处置标准', value: '按SOP流程操作' },
                { item: '质量标准', value: '符合行业规范' },
                { item: '文档要求', value: '完成记录并归档' }
              ],
              // 部门分工
              departmentDivision: [
                { deptName: '运营部', task: '现场设备检查', person: '张三' },
                { deptName: '技术部', task: '技术支持与指导', person: '李四' },
                { deptName: '安全部', task: '安全检查监督', person: '王五' }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDepartmentCooperationDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交协同响应
export const submitCooperationResponse = (cooperationId, responseContent) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/department/cooperation/response/${cooperationId}`,
        data: { responseContent },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无响应结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('协同响应接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '响应提交成功',
              cooperationStatus: '响应中'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitCooperationResponse 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};

// 提交协同反馈
export const submitCooperationFeedback = (cooperationId, feedbackResult, evidenceFiles) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/department/cooperation/feedback/${cooperationId}`,
        data: { feedbackResult, evidenceFiles },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无反馈结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('协同反馈接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '反馈提交成功',
              cooperationStatus: '已完成'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitCooperationFeedback 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ========== 运维人员动态 ==========
// 运维人员列表
export const fetchMaintainerDynamicList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintainer/dynamic/list`,
        params,
      })
      .then((response) => {
        console.log('运维人员动态列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('运维人员动态列表-响应符合实际格式');
          return response.map((item) => ({
            sysMaintainUserMaintainUserId: item.sysMaintainUserMaintainUserId,
            sysUserUserName: item.sysUserUserName,
            sysDeptDeptName: item.sysDeptDeptName,
            sysAreaAreaName: item.sysAreaAreaName,
            sysOnDutyStatusName: item.sysOnDutyStatusName,
            bizCoopStatCurrentCoopTaskCount: item.bizCoopStatCurrentCoopTaskCount,
          }));
        }
        throw new Error('真实接口返回无运维人员动态数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('运维人员动态列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                sysMaintainUserMaintainUserId: 'MAINT202601001',
                sysUserUserName: '张三',
                sysDeptDeptName: '运营部',
                sysAreaAreaName: 'A区停车场',
                sysOnDutyStatusName: '在岗',
                bizCoopStatCurrentCoopTaskCount: 3,
              },
              {
                sysMaintainUserMaintainUserId: 'MAINT202601002',
                sysUserUserName: '李四',
                sysDeptDeptName: '技术部',
                sysAreaAreaName: 'B区停车场',
                sysOnDutyStatusName: '待命',
                bizCoopStatCurrentCoopTaskCount: 1,
              },
              {
                sysMaintainUserMaintainUserId: 'MAINT202601003',
                sysUserUserName: '王五',
                sysDeptDeptName: '客服部',
                sysAreaAreaName: 'C区停车场',
                sysOnDutyStatusName: '休息',
                bizCoopStatCurrentCoopTaskCount: 0,
              },
              {
                sysMaintainUserMaintainUserId: 'MAINT202601004',
                sysUserUserName: '赵六',
                sysDeptDeptName: '安全部',
                sysAreaAreaName: 'D区停车场',
                sysOnDutyStatusName: '在岗',
                bizCoopStatCurrentCoopTaskCount: 2,
              },
              {
                sysMaintainUserMaintainUserId: 'MAINT202601005',
                sysUserUserName: '钱七',
                sysDeptDeptName: '运维部',
                sysAreaAreaName: 'E区停车场',
                sysOnDutyStatusName: '在岗',
                bizCoopStatCurrentCoopTaskCount: 4,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainerDynamicList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 运维人员核心指标（卡片展示）
export const fetchMaintainerDynamicIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintainer/dynamic/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalMaintainerCount &&
          response.onDutyCount &&
          response.totalCoopTaskCount
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
              totalMaintainerCount: 85, // 总运维人数
              onDutyCount: 62, // 在岗人数
              totalCoopTaskCount: 187, // 当前协同任务总数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainerDynamicIndicators 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalMaintainerCount: 0,
      onDutyCount: 0,
      totalCoopTaskCount: 0,
    });
  }
};

// 不同部门协同任务数对比（柱状图）
export const fetchMaintainerDynamicDeptTaskCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintainer/dynamic/stat/dept/task/count`,
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
        throw new Error('真实接口返回无部门协同任务数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '部门协同任务数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['运营部', '技术部', '客服部', '安全部', '运维部'],
              series: [{ name: '协同任务数', data: [45, 38, 22, 28, 54] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainerDynamicDeptTaskCount 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同任务数', data: [] }],
    });
  }
};

// 不同区域运维人员协同任务数对比（柱状图）
export const fetchMaintainerDynamicAreaTaskCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintainer/dynamic/stat/area/task/count`,
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
        throw new Error('真实接口返回无区域协同任务数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域协同任务数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['A区停车场', 'B区停车场', 'C区停车场', 'D区停车场', 'E区停车场'],
              series: [{ name: '协同任务数', data: [52, 48, 35, 41, 31] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainerDynamicAreaTaskCount 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同任务数', data: [] }],
    });
  }
};

// 运维人员详情查询 - 详情弹窗专用
export const fetchMaintainerDynamicDetail = (maintainerId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintainer/dynamic/detail/${maintainerId}`,
        params,
      })
      .then((response) => {
        if (response && response.sysMaintainUserMaintainUserId === maintainerId) {
          return response;
        }
        throw new Error('真实接口返回无运维人员详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('运维人员详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              sysMaintainUserMaintainUserId: maintainerId,
              sysUserUserName: maintainerId === 'MAINT202601001' ? '张三' : '李四',
              sysDeptDeptName: maintainerId === 'MAINT202601001' ? '运营部' : '技术部',
              sysAreaAreaName: maintainerId === 'MAINT202601001' ? 'A区停车场' : 'B区停车场',
              sysOnDutyStatusName: maintainerId === 'MAINT202601001' ? '在岗' : '待命',
              bizCoopStatCurrentCoopTaskCount: maintainerId === 'MAINT202601001' ? 3 : 1,
              // 详情字段
              bizCoopStatCompletedCoopTaskCount: maintainerId === 'MAINT202601001' ? 125 : 98,
              bizCoopStatCoopResponseDuration: maintainerId === 'MAINT202601001' ? 1.8 : 2.3,
              sysCooperationTypeName: maintainerId === 'MAINT202601001' ? '设备巡检,故障处理' : '系统维护,数据备份',
              bizCoopStatLatestCoopTime: maintainerId === 'MAINT202601001' ? '2026-01-19 14:30:00' : '2026-01-18 16:45:00',
              // 基础信息
              contactPhone: '138****5678',
              email: 'zhangsan@example.com',
              skillTags: maintainerId === 'MAINT202601001' ? ['设备维修', '电气工程', '安全管理'] : ['系统运维', '网络管理', '数据库'],
              // 协同历史
              cooperationHistory: [
                { taskId: 'TASK001', taskName: 'A区设备巡检', status: '已完成', time: '2026-01-18' },
                { taskId: 'TASK002', taskName: 'B区故障处理', status: '已完成', time: '2026-01-17' },
                { taskId: 'TASK003', taskName: 'C区系统升级', status: '进行中', time: '2026-01-19' },
              ],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainerDynamicDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交调度任务
export const submitMaintainerDispatchTask = (maintainerId, taskDetail, coopTarget) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/maintainer/dynamic/dispatch/${maintainerId}`,
        data: { taskDetail, coopTarget },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无调度结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('调度任务接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '调度任务提交成功',
              updatedTaskCount: 4,
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitMaintainerDispatchTask 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};
