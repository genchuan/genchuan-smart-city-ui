import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';


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
              return `${2023}-${String(i+1).padStart(2, '0')}`;
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
