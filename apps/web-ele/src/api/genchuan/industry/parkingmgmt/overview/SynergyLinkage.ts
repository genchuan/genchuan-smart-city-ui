import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';

// 政企协同详情及进度
export const fetchGovEnterpriseCoopList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/gov/enterprise/coop/list`,
        params,
      })
      .then((response) => {
        console.log('政企协同视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('政企协同视图-响应符合实际格式');
          return response.map((item) => ({
            govEnterpriseCoopId: item.govEnterpriseCoopId,
            coopItem: item.coopItem,
            govDepartment: item.govDepartment,
            merchantId: 'M2025001',
            progressFeedback: item.progressFeedback,
            satisfactionEvaluation: item.satisfactionEvaluation,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('政企协同视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                govEnterpriseCoopId: 'GEC20250109001',
                coopItem: '企业诉求响应',
                govDepartment: '漳州市发改委营商环境科',
                merchantId: 'M2025001',
                progressFeedback:
                  '企业提出的停车收费备案诉求已受理，材料审核完成，备案登记办结',
                satisfactionEvaluation: '满意',
              },
              {
                govEnterpriseCoopId: 'GEC20250109002',
                coopItem: '联合安全生产',
                govDepartment: '漳州市应急管理局+消防救援支队',
                merchantId: 'M2025002',
                progressFeedback:
                  '已完成停车场消防设施联合检查，发现3处隐患，企业已全部整改完毕，复检合格',
                satisfactionEvaluation: '非常满意',
              },
              {
                govEnterpriseCoopId: 'GEC20250109003',
                coopItem: '应急物资采购供应',
                govDepartment: '漳州市工信局物资保障科',
                merchantId: 'M2025003',
                progressFeedback:
                  '应急消防器材采购合同已签订，物资已到货80%，剩余物资预计今日送达并完成验收',
                satisfactionEvaluation: '基本满意',
              },
              {
                govEnterpriseCoopId: 'GEC20250109004',
                coopItem: '企业诉求响应',
                govDepartment: '漳州市城管局停车管理处',
                merchantId: 'M2025004',
                progressFeedback:
                  '企业提出的停车场出入口扩建诉求已完成现场勘查，规划方案正在审批中',
                satisfactionEvaluation: '一般',
              },
              {
                govEnterpriseCoopId: 'GEC20250109005',
                coopItem: '企业诉求响应',
                govDepartment: '漳州市住建局城建科',
                merchantId: 'M2025005',
                progressFeedback:
                  '企业申请的园区停车场规划许可已审核通过，相关施工手续已同步办结发放',
                satisfactionEvaluation: '满意',
              },
              {
                govEnterpriseCoopId: 'GEC20250109006',
                coopItem: '联合安全生产',
                govDepartment: '漳州市交通运输局路政科',
                merchantId: 'M2025006',
                progressFeedback:
                  '完成漳州高速口停车场安全隐患排查，整改占道经营、消防通道堵塞等问题2项',
                satisfactionEvaluation: '非常满意',
              },
              {
                govEnterpriseCoopId: 'GEC20250109007',
                coopItem: '应急物资采购供应',
                govDepartment: '漳州市商务局商贸科',
                merchantId: 'M2025007',
                progressFeedback:
                  '漳州开发区应急物资储备库补货完成，防汛、防疫类物资备货量达需求标准120%',
                satisfactionEvaluation: '满意',
              },
              {
                govEnterpriseCoopId: 'GEC20250109008',
                coopItem: '企业诉求响应',
                govDepartment: '漳州市市场监管局企业科',
                merchantId: 'M2025008',
                progressFeedback:
                  '企业反映的停车场收费公示不规范问题，已完成现场核查并督促整改到位',
                satisfactionEvaluation: '基本满意',
              },
              {
                govEnterpriseCoopId: 'GEC20250109009',
                coopItem: '联合安全生产',
                govDepartment: '漳州市文旅局产业科',
                merchantId: 'M2025009',
                progressFeedback:
                  '完成漳州景区配套停车场安全检查，整改观光车停放、标识不清等安全问题3项',
                satisfactionEvaluation: '一般',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchGovEnterpriseCoopList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 政企协同核心指标
export const fetchGovEnterpriseCoopIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/coop/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCount &&
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
              totalCount: 36, // 政企协同总数
              responseRate: 0.97, // 响应率
              satisfactionRate: 94.2, // 满意度(%)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 政企协同指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCount: 0,
      responseRate: 0,
      satisfactionRate: 0,
    });
  }
};

// 政府部门协同数对比
export const fetchGovDeptCoopCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/synergy/govDeptCoopCount/get`,
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
        throw new Error('真实接口返回无政府部门协同数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '政府部门协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['城管局', '交通局', '住建局', '文旅局', '行政审批局'],
              series: [{ name: '协同事项数', data: [28, 35, 19, 12, 23] }],
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
      series: [{ name: '协同事项数', data: [] }],
    });
  }
};

// 获取企业类型协同数对比
export const fetchEnterpriseTypeCoopCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/synergy/enterpriseTypeCoopCount/get`,
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
        throw new Error('真实接口返回无企业类型协同数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '企业类型协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['国有企业', '民营企业', '外资企业', '合资企业'],
              series: [{ name: '协同事项数', data: [42, 58, 16, 24] }],
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
      series: [{ name: '协同事项数', data: [] }],
    });
  }
};

// 协同事项类型占比饼图接口
export const fetchCoopItemTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/synergy/coopItemTypeRatio/get`,
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
          '协同事项类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['企业诉求响应', '联合安全生产', '应急物资采购供应'],
              series: [{ name: '协同事项占比', data: [52, 28, 20] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同事项类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '协同事项占比', data: [] }],
    });
  }
};

// 满意度评价占比饼图接口
export const fetchSatisfactionLevelRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/synergy/satisfactionLevelRatio/get`,
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
          '满意度评价占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['非常满意', '满意', '基本满意', '一般'],
              series: [{ name: '满意度占比', data: [26, 45, 18, 11] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 满意度评价占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '满意度占比', data: [] }],
    });
  }
};

// 高频协同事项TOP10
export const fetchHighFrequencyCoopTop10 = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/coop/stat/top10`,
        params,
      })
      .then((response) => {
        console.log('高频协同事项TOP10-接口请求成功');
        if (response && Array.isArray(response)) {
          return response.map((item, index) => ({
            rank: index + 1,
            coopStatId: item.coopStatId,
            coopType: item.coopType,
            coopCount: item.coopCount,
            top10CoopItem: item.top10CoopItem,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log(
          '高频协同事项TOP10接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                rank: 1,
                coopStatId: 'CST2025001',
                coopType: 'high',
                coopCount: 89,
                top10CoopItem: '企业停车收费备案诉求响应',
              },
              {
                rank: 2,
                coopStatId: 'CST2025002',
                coopType: 'high',
                coopCount: 76,
                top10CoopItem: '停车场消防设施联合安全检查',
              },
              {
                rank: 3,
                coopStatId: 'CST2025003',
                coopType: 'medium',
                coopCount: 65,
                top10CoopItem: '应急消防器材采购供应对接',
              },
              {
                rank: 4,
                coopStatId: 'CST2025004',
                coopType: 'medium',
                coopCount: 58,
                top10CoopItem: '停车场出入口扩建规划审批',
              },
              {
                rank: 5,
                coopStatId: 'CST2025005',
                coopType: 'medium',
                coopCount: 49,
                top10CoopItem: '园区停车场规划许可办理',
              },
              {
                rank: 6,
                coopStatId: 'CST2025006',
                coopType: 'low',
                coopCount: 42,
                top10CoopItem: '高速口停车场占道经营整改',
              },
              {
                rank: 7,
                coopStatId: 'CST2025007',
                coopType: 'low',
                coopCount: 37,
                top10CoopItem: '应急物资储备库补货验收',
              },
              {
                rank: 8,
                coopStatId: 'CST2025008',
                coopType: 'low',
                coopCount: 31,
                top10CoopItem: '停车场收费公示规范整改',
              },
              {
                rank: 9,
                coopStatId: 'CST2025009',
                coopType: 'medium',
                coopCount: 26,
                top10CoopItem: '景区配套停车场安全检查',
              },
              {
                rank: 10,
                coopStatId: 'CST2025010',
                coopType: 'high',
                coopCount: 22,
                top10CoopItem: '停车场监控设备升级改造',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchHighFrequencyCoopTop10 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 协同统计分析-核心统计指标
export const fetchCoopCoreIndicators = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/coop/stat/core`, params })
      .then((res) => {
        if (res && Object.keys(res).length > 0) return res;
        throw new Error('核心指标无数据，使用兜底');
      })
      .catch((error) => {
        console.log('协同核心指标接口异常，使用兜底数据', error.message);
        return {
          totalCoopCount: 896,
          avgHandleCycle: 3.2,
          finishRate: 0.925,
          highPriorityRate: 0.46,
        };
      });
  } catch (error) {
    console.error('fetchCoopCoreIndicators 异常:', error);
    return Promise.resolve({
      totalCoopCount: 0,
      avgHandleCycle: 0,
      finishRate: 0,
      highPriorityRate: 0,
    });
  }
};

// 协同统计分析-类型协同数对比 (柱状图)
export const fetchCoopTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/coop/stat/type/count`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('类型协同数接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['高优先级', '中优先级', '低优先级', '紧急协同', '常规协同'],
          series: [{ name: '协同事项数', data: [326, 285, 198, 87, 126] }],
        };
      });
  } catch (error) {
    console.error('fetchCoopTypeCount 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 协同统计分析-区域协同数对比 (柱状图)
export const fetchCoopAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/coop/stat/area/count`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('区域协同数接口异常，使用兜底数据', error.message);
        return {
          xAxis: ['主城区', '高新区', '经开区', '文旅区', '周边区县'],
          series: [{ name: '协同事项数', data: [268, 195, 156, 125, 98] }],
        };
      });
  } catch (error) {
    console.error('fetchCoopAreaCount 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 协同统计分析-行业协同占比 (饼图)
export const fetchCoopIndustryRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/coop/stat/industry/ratio`, params })
      .then((res) => res || { legend: [], series: [] })
      .catch((error) => {
        console.log('行业协同占比接口异常，使用兜底数据', error.message);
        return {
          legend: ['停车服务', '消防安防', '规划审批', '物资供应', '运营管理'],
          series: [
            {
              name: '行业协同占比',
              data: [
                { value: 35, name: '停车服务' },
                { value: 25, name: '消防安防' },
                { value: 20, name: '规划审批' },
                { value: 12, name: '物资供应' },
                { value: 8, name: '运营管理' },
              ],
            },
          ],
        };
      });
  } catch (error) {
    console.error('fetchCoopIndustryRatio 异常:', error);
    return Promise.resolve({ legend: [], series: [] });
  }
};

// 协同统计分析-区域协同占比 (饼图)
export const fetchCoopAreaRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/coop/stat/area/ratio`, params })
      .then((res) => res || { legend: [], series: [] })
      .catch((error) => {
        console.log('区域协同占比接口异常，使用兜底数据', error.message);
        return {
          legend: ['主城区', '高新区', '经开区', '文旅区', '周边区县'],
          series: [
            {
              name: '区域协同占比',
              data: [
                { value: 32, name: '主城区' },
                { value: 24, name: '高新区' },
                { value: 18, name: '经开区' },
                { value: 15, name: '文旅区' },
                { value: 11, name: '周边区县' },
              ],
            },
          ],
        };
      });
  } catch (error) {
    console.error('fetchCoopAreaRatio 异常:', error);
    return Promise.resolve({ legend: [], series: [] });
  }
};

// 协同统计分析-协同事件近周期趋势
export const fetchCoopTrendData = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/coop/stat/trend`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('协同趋势折线图接口异常，使用兜底数据', error.message);
        return {
          xAxis: [
            '01-01',
            '01-02',
            '01-03',
            '01-04',
            '01-05',
            '01-06',
            '01-07',
            '01-08',
            '01-09',
            '01-10',
          ],
          series: [
            {
              name: '协同事件数',
              data: [68, 75, 59, 82, 96, 78, 92, 85, 102, 98],
            },
          ],
        };
      });
  } catch (error) {
    console.error('fetchCoopTrendData 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 协同效率评估-详情及优化建议列表
export const fetchCoopEfficiencyList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/coop/list`,
        params,
      })
      .then((response) => {
        console.log('协同效率评估-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('协同效率评估-响应符合实际格式');
          return response.map((item) => ({
            coopEfficiencyId: item.coopEfficiencyId,
            coopType: item.coopType,
            responseDuration: item.responseDuration,
            disposalDuration: item.disposalDuration,
            collaborationCost: item.collaborationCost,
            effectAchievementRate: item.effectAchievementRate,
            problemRecurrenceRate: item.problemRecurrenceRate,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('协同效率评估接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                coopEfficiencyId: 'CE20250110001',
                coopType: 'high',
                responseDuration: 2.5,
                disposalDuration: 8.2,
                collaborationCost: 1260,
                effectAchievementRate: 0.98,
                problemRecurrenceRate: 0.02,
              },
              {
                coopEfficiencyId: 'CE20250110002',
                coopType: 'high',
                responseDuration: 1.8,
                disposalDuration: 6.5,
                collaborationCost: 980,
                effectAchievementRate: 0.96,
                problemRecurrenceRate: 0.03,
              },
              {
                coopEfficiencyId: 'CE20250110003',
                coopType: 'medium',
                responseDuration: 4.2,
                disposalDuration: 12.6,
                collaborationCost: 850,
                effectAchievementRate: 0.92,
                problemRecurrenceRate: 0.05,
              },
              {
                coopEfficiencyId: 'CE20250110004',
                coopType: 'medium',
                responseDuration: 3.6,
                disposalDuration: 10.8,
                collaborationCost: 720,
                effectAchievementRate: 0.9,
                problemRecurrenceRate: 0.06,
              },
              {
                coopEfficiencyId: 'CE20250110005',
                coopType: 'medium',
                responseDuration: 5.1,
                disposalDuration: 14.2,
                collaborationCost: 650,
                effectAchievementRate: 0.88,
                problemRecurrenceRate: 0.07,
              },
              {
                coopEfficiencyId: 'CE20250110006',
                coopType: 'low',
                responseDuration: 8.5,
                disposalDuration: 20.5,
                collaborationCost: 420,
                effectAchievementRate: 0.85,
                problemRecurrenceRate: 0.1,
              },
              {
                coopEfficiencyId: 'CE20250110007',
                coopType: 'low',
                responseDuration: 7.2,
                disposalDuration: 18.6,
                collaborationCost: 380,
                effectAchievementRate: 0.82,
                problemRecurrenceRate: 0.12,
              },
              {
                coopEfficiencyId: 'CE20250110008',
                coopType: 'high',
                responseDuration: 3,
                disposalDuration: 9.5,
                collaborationCost: 1150,
                effectAchievementRate: 0.95,
                problemRecurrenceRate: 0.04,
              },
              {
                coopEfficiencyId: 'CE20250110009',
                coopType: 'medium',
                responseDuration: 4.8,
                disposalDuration: 13.8,
                collaborationCost: 780,
                effectAchievementRate: 0.89,
                problemRecurrenceRate: 0.08,
              },
              {
                coopEfficiencyId: 'CE20250110010',
                coopType: 'low',
                responseDuration: 9.2,
                disposalDuration: 22.3,
                collaborationCost: 350,
                effectAchievementRate: 0.8,
                problemRecurrenceRate: 0.15,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchCoopEfficiencyList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 协同效率评估-核心指标 (平均响应时长、平均处置时长、平均成效达标率)
export const fetchCoopEfficiencyIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.avgResponseDuration &&
          response.avgDisposalDuration &&
          response.avgEffectAchievementRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无效率评估核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '协同效率评估指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              avgResponseDuration: 4.6, // 平均响应时长(小时)
              avgDisposalDuration: 13.2, // 平均处置时长(小时)
              avgEffectAchievementRate: 0.915, // 平均成效达标率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 协同效率评估指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      avgResponseDuration: 0,
      avgDisposalDuration: 0,
      avgEffectAchievementRate: 0,
    });
  }
};

// 协同效率评估-类型协同效率对比 柱状图
export const fetchCoopEfficiencyTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/stat/type/count`,
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
        throw new Error('真实接口返回无类型效率数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型协同效率对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: [
                '高优先级',
                '中优先级',
                '低优先级',
                '紧急协同',
                '常规协同',
              ],
              series: [
                {
                  name: '平均处置时长(小时)',
                  data: [7.8, 12.5, 20.3, 5.6, 14.2],
                },
              ],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 类型协同效率对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '平均处置时长(小时)', data: [] }],
    });
  }
};

// 协同效率评估-区域协同效率对比 柱状图
export const fetchCoopEfficiencyAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/stat/area/count`,
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
        throw new Error('真实接口返回无区域效率数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域协同效率对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['主城区', '高新区', '经开区', '文旅区', '周边区县'],
              series: [
                { name: '平均响应时长(小时)', data: [3.2, 4.1, 3.8, 5.5, 6.8] },
              ],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 区域协同效率对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '平均响应时长(小时)', data: [] }],
    });
  }
};

// 协同效率评估-问题复发率占比 饼图
export const fetchCoopEfficiencyRecurrenceRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/stat/recurrence/ratio`,
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
        throw new Error('真实接口返回无复发率占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '问题复发率占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: [
                '无复发',
                '低复发(≤5%)',
                '中复发(5%-10%)',
                '高复发(>10%)',
              ],
              series: [{ name: '问题复发率占比', data: [68, 18, 9, 5] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 问题复发率占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '问题复发率占比', data: [] }],
    });
  }
};

// 协同效率评估-协同效率趋势 折线图
export const fetchCoopEfficiencyTrendData = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/efficiency/stat/trend`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log('协同效率趋势折线图接口异常，使用兜底数据', error.message);
        return {
          xAxis: [
            '01-01',
            '01-02',
            '01-03',
            '01-04',
            '01-05',
            '01-06',
            '01-07',
            '01-08',
            '01-09',
            '01-10',
          ],
          series: [
            {
              name: '综合效率评分',
              data: [82, 85, 83, 86, 88, 87, 90, 89, 92, 93],
            },
          ],
        };
      });
  } catch (error) {
    console.error('fetchCoopEfficiencyTrendData 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// ======================== 新增 区域协同 专属5个接口 (无冲突，直接追加) ========================
// 区域协同-跨区域协同详情及进度列表
export const fetchCrossRegionCoopList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/cross/region/coop/list`,
        params,
      })
      .then((response) => {
        console.log('区域协同视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('区域协同视图-响应符合实际格式');
          return response.map((item) => ({
            crossRegionCoopId: item.crossRegionCoopId,
            coopTask: item.coopTask,
            launchAreaCode: item.launchAreaCode,
            cooperateAreaCode: item.cooperateAreaCode,
            progressNode: item.progressNode,
            coopCompleteRate: item.coopCompleteRate,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('区域协同视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                crossRegionCoopId: 'CRC20250112001',
                coopTask: '跨区泊位调度',
                launchAreaCode: '漳州市主城区',
                cooperateAreaCode: '漳州市高新区',
                progressNode: '调度完成，泊位已分配',
                coopCompleteRate: 100,
              },
              {
                crossRegionCoopId: 'CRC20250112002',
                coopTask: '跨区设备抢修',
                launchAreaCode: '漳州市经开区',
                cooperateAreaCode: '漳州市文旅区',
                progressNode: '设备维修完毕，验收合格',
                coopCompleteRate: 100,
              },
              {
                crossRegionCoopId: 'CRC20250112003',
                coopTask: '跨区逃费追缴',
                launchAreaCode: '漳州市高新区',
                cooperateAreaCode: '漳州市主城区',
                progressNode: '追缴完成，费用已到账',
                coopCompleteRate: 100,
              },
              {
                crossRegionCoopId: 'CRC20250112004',
                coopTask: '跨区泊位调度',
                launchAreaCode: '漳州市文旅区',
                cooperateAreaCode: '漳州市周边区县',
                progressNode: '调度中，泊位协调中',
                coopCompleteRate: 75,
              },
              {
                crossRegionCoopId: 'CRC20250112005',
                coopTask: '跨区设备抢修',
                launchAreaCode: '漳州市主城区',
                cooperateAreaCode: '漳州市经开区',
                progressNode: '配件到位，开始维修',
                coopCompleteRate: 60,
              },
              {
                crossRegionCoopId: 'CRC20250112006',
                coopTask: '跨区逃费追缴',
                launchAreaCode: '漳州市周边区县',
                cooperateAreaCode: '漳州市高新区',
                progressNode: '信息核实中，待追缴',
                coopCompleteRate: 30,
              },
              {
                crossRegionCoopId: 'CRC20250112007',
                coopTask: '跨区泊位调度',
                launchAreaCode: '漳州市经开区',
                cooperateAreaCode: '漳州市文旅区',
                progressNode: '调度完成，高峰期保障到位',
                coopCompleteRate: 100,
              },
              {
                crossRegionCoopId: 'CRC20250112008',
                coopTask: '跨区设备抢修',
                launchAreaCode: '漳州市高新区',
                cooperateAreaCode: '漳州市周边区县',
                progressNode: '抢修完成，设备正常运行',
                coopCompleteRate: 100,
              },
              {
                crossRegionCoopId: 'CRC20250112009',
                coopTask: '跨区逃费追缴',
                launchAreaCode: '漳州市文旅区',
                cooperateAreaCode: '漳州市主城区',
                progressNode: '追缴中，欠费用户已联系',
                coopCompleteRate: 50,
              },
              {
                crossRegionCoopId: 'CRC20250112010',
                coopTask: '跨区泊位调度',
                launchAreaCode: '漳州市周边区县',
                cooperateAreaCode: '漳州市经开区',
                progressNode: '调度规划中，方案制定完成',
                coopCompleteRate: 40,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchCrossRegionCoopList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 区域协同-核心指标 (总数、完成率、平均协同时长)
export const fetchCrossRegionCoopIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/cross/region/coop/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCount &&
          response.completeRate &&
          response.avgCoopDuration
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
              totalCount: 56, // 跨区域协同总数
              completeRate: 0.89, // 协同完成率
              avgCoopDuration: 2.8, // 平均协同时长(小时)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域协同指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCount: 0,
      completeRate: 0,
      avgCoopDuration: 0,
    });
  }
};

// 区域协同-区域协同数对比 柱状图
export const fetchCrossRegionAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/cross/region/stat/area/count`,
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
        throw new Error('真实接口返回无区域协同数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['主城区', '高新区', '经开区', '文旅区', '周边区县'],
              series: [{ name: '协同事项数', data: [32, 28, 21, 16, 12] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 区域协同数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同事项数', data: [] }],
    });
  }
};

// 区域协同-任务类型协同数对比 柱状图
export const fetchCrossRegionTaskTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/cross/region/stat/taskType/count`,
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
        throw new Error('真实接口返回无任务类型协同数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '任务类型协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['跨区泊位调度', '跨区设备抢修', '跨区逃费追缴'],
              series: [{ name: '协同事项数', data: [29, 18, 9] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 任务类型协同数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同事项数', data: [] }],
    });
  }
};

// 区域协同-协同完成率趋势 折线图
export const fetchCrossRegionRateTrendData = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/cross/region/stat/rate/trend`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '协同完成率趋势折线图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: [
            '01-01',
            '01-02',
            '01-03',
            '01-04',
            '01-05',
            '01-06',
            '01-07',
            '01-08',
            '01-09',
            '01-10',
          ],
          series: [
            {
              name: '协同完成率(%)',
              data: [82, 85, 83, 87, 89, 86, 90, 88, 91, 92],
            },
          ],
        };
      });
  } catch (error) {
    console.error('fetchCrossRegionRateTrendData 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// ======================== 新增 专属协同视图 6个接口 (完整新增 无冲突) ========================
// 专属协同详情及结果列表
export const fetchSpecialCoopList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/coop/list`,
        params,
      })
      .then((response) => {
        console.log('专属协同视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('专属协同视图-响应符合实际格式');
          return response.map((item) => ({
            specialCoopId: item.specialCoopId,
            coopScene: item.coopScene,
            coopRule: item.coopRule,
            responsibilityDivision: item.responsibilityDivision,
            coopResult: item.coopResult,
            completeTime: item.completeTime,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('专属协同视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                specialCoopId: 'SPC20250110001',
                coopScene: '社区-停车场秩序协同',
                coopRule:
                  '每日早晚高峰巡逻，违规占道立即整改，违停车辆短信提醒',
                responsibilityDivision:
                  '社区居委会：秩序巡查；城管局：违停执法；物业：现场整改',
                coopResult:
                  '停车场出入口拥堵问题解决，违停率下降90%，居民投诉量清零',
                completeTime: 1_736_486_400_000,
              },
              {
                specialCoopId: 'SPC20250110002',
                coopScene: '物业-停车运营服务协同',
                coopRule: '车位预约登记，包月缴费绿色通道，充电桩维保定期巡检',
                responsibilityDivision:
                  '物业公司：运营服务；充电桩企业：设备维保；街道办：监督协调',
                coopResult:
                  '车位利用率提升40%，包月缴费效率提升80%，充电桩故障率低于2%',
                completeTime: 1_736_572_800_000,
              },
              {
                specialCoopId: 'SPC20250110003',
                coopScene: '社区-停车场秩序协同',
                coopRule: '节假日增派人员值守，临时车位扩容，人车分流规划整改',
                responsibilityDivision:
                  '社区居委会：人员调配；住建局：规划整改；交警中队：交通疏导',
                coopResult: '节假日停车通行效率提升60%，未发生拥堵及剐蹭事故',
                completeTime: 1_736_659_200_000,
              },
              {
                specialCoopId: 'SPC20250110004',
                coopScene: '物业-停车运营服务协同',
                coopRule: '智能停车系统升级，线上缴费全覆盖，车位导航精准推送',
                responsibilityDivision:
                  '物业公司：系统运维；科技公司：技术支持；市场监管局：价格监督',
                coopResult:
                  '停车缴费时长缩短至10秒内，车位找车效率提升70%，用户好评率98%',
                completeTime: 1_736_745_600_000,
              },
              {
                specialCoopId: 'SPC20250110005',
                coopScene: '社区-停车场秩序协同',
                coopRule: '非机动车专区规划，充电桩合规整改，消防通道专项清理',
                responsibilityDivision:
                  '社区居委会：场地规划；消防大队：合规检查；物业：日常维护',
                coopResult:
                  '非机动车乱停放问题解决，消防通道畅通率100%，充电安全零事故',
                completeTime: 1_736_832_000_000,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSpecialCoopList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 专属协同核心指标 (总数、完成率、平均协同周期)
export const fetchSpecialCoopIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/coop/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCount &&
          response.completeRate &&
          response.averageCycle
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
              totalCount: 28, // 专属协同总数
              completeRate: 0.92, // 完成率
              averageCycle: 3.5, // 平均协同周期(天)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 专属协同指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ totalCount: 0, completeRate: 0, averageCycle: 0 });
  }
};

// 专属协同-场景协同数对比柱状图
export const fetchSpecialCoopSceneCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/synergy/sceneCount/get`,
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
        throw new Error('真实接口返回无场景协同数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '场景协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['社区-停车场秩序', '物业-停车运营服务'],
              series: [{ name: '协同完成数', data: [16, 12] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 场景协同数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同完成数', data: [] }],
    });
  }
};

// 专属协同-责任单位协同数对比柱状图
export const fetchSpecialCoopDeptCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/synergy/deptCount/get`,
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
        throw new Error('真实接口返回无责任单位协同数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '责任单位协同数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['社区居委会', '物业公司', '城管局', '住建局', '消防大队'],
              series: [{ name: '协同事项数', data: [22, 19, 15, 8, 6] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 责任单位协同数对比函数初始化异常 =====');
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '协同事项数', data: [] }],
    });
  }
};

// 专属协同-协同场景占比饼图
export const fetchSpecialCoopSceneRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/synergy/sceneRatio/get`,
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
              legend: ['社区-停车场秩序', '物业-停车运营服务'],
              series: [{ name: '协同场景占比', data: [57, 43] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 协同场景占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '协同场景占比', data: [] }],
    });
  }
};

// 专属协同-协同状态占比饼图
export const fetchSpecialCoopStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/special/synergy/statusRatio/get`,
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
              legend: ['已完成', '进行中', '待协同'],
              series: [{ name: '协同状态占比', data: [92, 5, 3] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 协同状态占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '协同状态占比', data: [] }],
    });
  }
};
