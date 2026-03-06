import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';


// ========== 终端设备状态 ==========
// 终端设备状态列表
export const fetchTerminalDeviceList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/list`,
        params,
      })
      .then((response) => {
        console.log('终端设备状态列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('终端设备状态列表-响应符合实际格式');
          return response.map((item) => ({
            tbDeviceExtendDeviceCode: item.tbDeviceExtendDeviceCode,
            sysEquipmentTypeName: item.sysEquipmentTypeName,
            tbAssetExtendName: item.tbAssetExtendName,
            sysOperationStatusName: item.sysOperationStatusName,
            parkDeviceMonitorDataContent: item.parkDeviceMonitorDataContent,
            sysAreaAreaName: item.sysAreaAreaName,
          }));
        }
        throw new Error('真实接口返回无终端设备数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('终端设备状态列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbDeviceExtendDeviceCode: 'DEV202401001',
                sysEquipmentTypeName: '摄像头',
                tbAssetExtendName: '停车场监控系统',
                sysOperationStatusName: '在线',
                parkDeviceMonitorDataContent: '网络延迟:12ms,CPU使用率:45%',
                sysAreaAreaName: 'A区停车场',
              },
              {
                tbDeviceExtendDeviceCode: 'DEV202401002',
                sysEquipmentTypeName: '道闸',
                tbAssetExtendName: '出入口控制系统',
                sysOperationStatusName: '故障',
                parkDeviceMonitorDataContent: '网络延迟:25ms,设备异常',
                sysAreaAreaName: 'B区停车场',
              },
              {
                tbDeviceExtendDeviceCode: 'DEV202401003',
                sysEquipmentTypeName: '收费机',
                tbAssetExtendName: '收费系统终端',
                sysOperationStatusName: '在线',
                parkDeviceMonitorDataContent: '网络延迟:8ms,CPU使用率:32%',
                sysAreaAreaName: 'C区停车场',
              },
              {
                tbDeviceExtendDeviceCode: 'DEV202401004',
                sysEquipmentTypeName: 'LED屏',
                tbAssetExtendName: '信息发布系统',
                sysOperationStatusName: '离线',
                parkDeviceMonitorDataContent: '网络延迟:无,设备离线',
                sysAreaAreaName: 'D区停车场',
              },
              {
                tbDeviceExtendDeviceCode: 'DEV202401005',
                sysEquipmentTypeName: '服务器',
                tbAssetExtendName: '数据服务器',
                sysOperationStatusName: '在线',
                parkDeviceMonitorDataContent: '网络延迟:5ms,CPU使用率:68%',
                sysAreaAreaName: '中央机房',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchTerminalDeviceList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 终端设备状态核心指标（卡片展示）
export const fetchTerminalDeviceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalDeviceCount &&
          response.onlineDeviceCount &&
          response.faultDeviceCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无终端设备核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '终端设备状态指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalDeviceCount: 356, // 总设备数
              onlineDeviceCount: 298, // 在线设备数
              faultDeviceCount: 42, // 故障设备数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 终端设备状态指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalDeviceCount: 0,
      onlineDeviceCount: 0,
      faultDeviceCount: 0,
    });
  }
};

// 近24小时设备在线率趋势（折线图）
export const fetchTerminalDeviceOnlineTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/stat/online/trend`,
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
        throw new Error('真实接口返回无在线率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '在线率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
              series: [{ name: '在线率(%)', data: [92.5, 93.8, 94.2, 95.1, 94.8, 93.5, 92.8] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 在线率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '在线率(%)', data: [] }],
    });
  }
};

// 设备类型占比（饼图）
export const fetchTerminalDeviceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/stat/type/ratio`,
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
        throw new Error('真实接口返回无设备类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['摄像头', '道闸', '收费机', 'LED屏', '服务器'],
              series: [{ name: '设备类型占比(%)', data: [35.2, 28.6, 18.4, 12.8, 5.0] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '设备类型占比(%)', data: [] }],
    });
  }
};

// 运行状态占比（饼图）
export const fetchTerminalDeviceStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/stat/status/ratio`,
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
        throw new Error('真实接口返回无运行状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '运行状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['在线', '故障', '离线', '维护中', '待机'],
              series: [{ name: '运行状态占比(%)', data: [83.7, 11.8, 3.5, 0.8, 0.2] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 运行状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '运行状态占比(%)', data: [] }],
    });
  }
};

// 不同区域故障数对比（柱状图）
export const fetchTerminalDeviceAreaFaultCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/stat/area/fault/count`,
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
              xAxis: ['A区停车场', 'B区停车场', 'C区停车场', 'D区停车场', '中央机房'],
              series: [{ name: '故障数量', data: [8, 15, 6, 10, 3] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域故障数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '故障数量', data: [] }],
    });
  }
};

// 不同设备类型故障数对比（柱状图）
export const fetchTerminalDeviceTypeFaultCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/stat/type/fault/count`,
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
        throw new Error('真实接口返回无设备类型故障数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备类型故障数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['摄像头', '道闸', '收费机', 'LED屏', '服务器'],
              series: [{ name: '故障数量', data: [12, 18, 5, 4, 3] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备类型故障数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '故障数量', data: [] }],
    });
  }
};

// 终端设备详情查询 - 详情弹窗专用
export const fetchTerminalDeviceDetail = (deviceCode, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/detail/${deviceCode}`,
        params,
      })
      .then((response) => {
        if (response && response.tbDeviceExtendDeviceCode === deviceCode) {
          return response;
        }
        throw new Error('真实接口返回无终端设备详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('终端设备详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbDeviceExtendDeviceCode: deviceCode,
              tbDeviceExtendOfflineTime: deviceCode === 'DEV202401001' ? '0' : '2.5',
              sysFaultTypeName: deviceCode === 'DEV202401001' ? '-' : '硬件故障',
              sysMaintainUserUserName: deviceCode === 'DEV202401001' ? '张三' : '李四',
              tbDeviceExtendNextMaintainTime: deviceCode === 'DEV202401001' ? '2024-02-01 10:00:00' : '2024-01-25 14:30:00',
              // 详情字段
              sysEquipmentTypeName: deviceCode === 'DEV202401001' ? '摄像头' : '道闸',
              tbAssetExtendName: deviceCode === 'DEV202401001' ? '停车场监控系统' : '出入口控制系统',
              sysOperationStatusName: deviceCode === 'DEV202401001' ? '在线' : '故障',
              parkDeviceMonitorDataContent: deviceCode === 'DEV202401001' ? '网络延迟:12ms,CPU使用率:45%' : '网络延迟:25ms,设备异常',
              sysAreaAreaName: deviceCode === 'DEV202401001' ? 'A区停车场' : 'B区停车场',
              // 监控日志
              monitorLogs: [
                { time: '2024-01-19 10:30:00', data: 'CPU:45%,内存:65%', status: '正常' },
                { time: '2024-01-19 09:15:00', data: '网络延迟:12ms', status: '正常' },
                { time: '2024-01-18 16:45:00', data: '设备重启成功', status: '正常' },
                { time: '2024-01-18 14:20:00', data: '温度:32℃', status: '正常' }
              ],
              // 故障记录
              faultRecords: [
                { time: '2024-01-10 09:30:00', type: '网络中断', duration: '2.5小时', result: '已修复' },
                { time: '2023-12-25 14:20:00', type: '硬件故障', duration: '8小时', result: '已更换' },
                { time: '2023-11-15 16:10:00', type: '软件异常', duration: '1.2小时', result: '已修复' }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchTerminalDeviceDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交设备处置
export const submitDeviceDisposal = (deviceCode, disposalMeasures, disposalEvidence) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/terminal/device/disposal/${deviceCode}`,
        data: { disposalMeasures, disposalEvidence },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无处置结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('设备处置接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '设备处置提交成功',
              deviceStatus: '维护中'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitDeviceDisposal 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};

// 提交设备维护
export const submitDeviceMaintenance = (deviceCode, maintenanceType, maintenanceTime) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/terminal/device/maintenance/${deviceCode}`,
        data: { maintenanceType, maintenanceTime },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无维护结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('设备维护接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '维护工单生成成功',
              workOrderNo: 'WO' + new Date().getTime()
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitDeviceMaintenance 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ========== 关键岗位人员 ==========
// 关键岗位人员列表
export const fetchKeyPersonnelList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/key/personnel/list`,
        params,
      })
      .then((response) => {
        console.log('关键岗位人员列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('关键岗位人员列表-响应符合实际格式');
          return response.map((item) => ({
            sysUserUserId: item.sysUserUserId,
            sysUserUserName: item.sysUserUserName,
            sysRoleRoleName: item.sysRoleRoleName,
            sysAreaAreaName: item.sysAreaAreaName,
            sysOnlineStatusName: item.sysOnlineStatusName,
            sysMerchantMerchantName: item.sysMerchantMerchantName,
          }));
        }
        throw new Error('真实接口返回无关键岗位人员数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('关键岗位人员列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                sysUserUserId: 'USER202401001',
                sysUserUserName: '张三',
                sysRoleRoleName: '运营主管',
                sysAreaAreaName: 'A区停车场',
                sysOnlineStatusName: '在线',
                sysMerchantMerchantName: '停车场管理有限公司',
              },
              {
                sysUserUserId: 'USER202401002',
                sysUserUserName: '李四',
                sysRoleRoleName: '技术工程师',
                sysAreaAreaName: 'B区停车场',
                sysOnlineStatusName: '在线',
                sysMerchantMerchantName: '智能停车技术公司',
              },
              {
                sysUserUserId: 'USER202401003',
                sysUserUserName: '王五',
                sysRoleRoleName: '客服专员',
                sysAreaAreaName: 'C区停车场',
                sysOnlineStatusName: '离线',
                sysMerchantMerchantName: '客户服务有限公司',
              },
              {
                sysUserUserId: 'USER202401004',
                sysUserUserName: '赵六',
                sysRoleRoleName: '安全管理员',
                sysAreaAreaName: 'D区停车场',
                sysOnlineStatusName: '在线',
                sysMerchantMerchantName: '安防科技有限公司',
              },
              {
                sysUserUserId: 'USER202401005',
                sysUserUserName: '钱七',
                sysRoleRoleName: '财务专员',
                sysAreaAreaName: 'E区停车场',
                sysOnlineStatusName: '在线',
                sysMerchantMerchantName: '财务管理有限公司',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchKeyPersonnelList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 关键岗位人员核心指标（卡片展示）
export const fetchKeyPersonnelIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/key/personnel/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalPersonnelCount &&
          response.onlinePersonnelCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无关键岗位人员核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '关键岗位人员指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalPersonnelCount: 156, // 各岗位人员总数
              onlinePersonnelCount: 124, // 在线人数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 关键岗位人员指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalPersonnelCount: 0,
      onlinePersonnelCount: 0,
    });
  }
};

// 不同负责范围人员数量对比（柱状图）
export const fetchKeyPersonnelAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/key/personnel/stat/area/count`,
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
        throw new Error('真实接口返回无不同负责范围人员数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '不同负责范围人员数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['A区停车场', 'B区停车场', 'C区停车场', 'D区停车场', 'E区停车场'],
              series: [{ name: '人员数量', data: [35, 42, 28, 31, 20] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 不同负责范围人员数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '人员数量', data: [] }],
    });
  }
};

// 岗位角色占比（饼图）
export const fetchKeyPersonnelRoleRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/key/personnel/stat/role/ratio`,
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
        throw new Error('真实接口返回无岗位角色占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '岗位角色占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['运营主管', '技术工程师', '客服专员', '安全管理员', '财务专员'],
              series: [{ name: '岗位角色占比(%)', data: [25.6, 28.8, 19.2, 17.6, 9.6] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 岗位角色占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '岗位角色占比(%)', data: [] }],
    });
  }
};

// 关键岗位人员详情查询 - 详情弹窗专用
export const fetchKeyPersonnelDetail = (userId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/key/personnel/detail/${userId}`,
        params,
      })
      .then((response) => {
        if (response && response.sysUserUserId === userId) {
          return response;
        }
        throw new Error('真实接口返回无关键岗位人员详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('关键岗位人员详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              sysUserUserId: userId,
              sysUserUserName: userId === 'USER202401001' ? '张三' : '李四',
              sysUserUserPhone: userId === 'USER202401001' ? '13800138001' : '13800138002',
              sysUserOnDutyTime: userId === 'USER202401001' ? '8.5' : '7.2',
              taskAllTableTaskName: userId === 'USER202401001' ? '停车场设备巡检' : '系统故障处理',
              sysOperationLogOperateTime: userId === 'USER202401001' ? '2024-01-19 10:30:00' : '2024-01-19 09:15:00',
              // 详情字段
              sysRoleRoleName: userId === 'USER202401001' ? '运营主管' : '技术工程师',
              sysAreaAreaName: userId === 'USER202401001' ? 'A区停车场' : 'B区停车场',
              sysOnlineStatusName: userId === 'USER202401001' ? '在线' : '在线',
              sysMerchantMerchantName: userId === 'USER202401001' ? '停车场管理有限公司' : '智能停车技术公司',
              // 权限范围
              permissionScope: [
                { scope: '操作权限', value: '设备管理、人员调度' },
                { scope: '查看权限', value: '全部停车场数据' },
                { scope: '审批权限', value: '费用报销审批' },
                { scope: '系统权限', value: '后台管理系统' }
              ],
              // 操作日志
              operationLogs: [
                { time: '2024-01-19 10:30:00', operation: '处理协同响应', result: '成功' },
                { time: '2024-01-19 09:15:00', operation: '提交故障报告', result: '成功' },
                { time: '2024-01-18 16:45:00', operation: '更新设备状态', result: '成功' },
                { time: '2024-01-18 14:20:00', operation: '审批费用申请', result: '通过' }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchKeyPersonnelDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交调度任务
export const submitDispatchTask = (userId, taskContent, deadline) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/key/personnel/dispatch/${userId}`,
        data: { taskContent, deadline },
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
              message: '调度任务分配成功',
              taskName: taskContent.substring(0, 20) + '...'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitDispatchTask 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};

// 提交留言
export const submitPersonnelMessage = (userId, messageContent) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/key/personnel/message/${userId}`,
        data: { messageContent },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无留言结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('留言接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '留言发送成功',
              sendTime: new Date().toISOString()
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitPersonnelMessage 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ========== 设备资源效能 ==========
// 设备资源效能列表
export const fetchDeviceResourceEfficiencyList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/efficiency/list`,
        params,
      })
      .then((response) => {
        console.log('设备资源效能列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('设备资源效能列表-响应符合实际格式');
          return response.map((item) => ({
            id: item.id,
            sysEquipmentTypeName: item.sysEquipmentTypeName,
            sysAreaAreaName: item.sysAreaAreaName,
            sysStatCycleName: item.sysStatCycleName,
            parkDeviceEfficiencyDeviceOperationEfficiency: item.parkDeviceEfficiencyDeviceOperationEfficiency,
            parkDeviceEfficiencyFaultRepairRate: item.parkDeviceEfficiencyFaultRepairRate,
            parkDeviceEfficiencyAverageFaultFreeDuration: item.parkDeviceEfficiencyAverageFaultFreeDuration,
          }));
        }
        throw new Error('真实接口返回无设备资源效能列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('设备资源效能列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: 'EFF202501001',
                sysEquipmentTypeName: '道闸设备',
                sysAreaAreaName: 'A区停车场',
                sysStatCycleName: '本月',
                parkDeviceEfficiencyDeviceOperationEfficiency: 92.5,
                parkDeviceEfficiencyFaultRepairRate: 85.3,
                parkDeviceEfficiencyAverageFaultFreeDuration: 720,
              },
              {
                id: 'EFF202501002',
                sysEquipmentTypeName: '监控摄像头',
                sysAreaAreaName: 'B区停车场',
                sysStatCycleName: '本月',
                parkDeviceEfficiencyDeviceOperationEfficiency: 88.7,
                parkDeviceEfficiencyFaultRepairRate: 92.1,
                parkDeviceEfficiencyAverageFaultFreeDuration: 650,
              },
              {
                id: 'EFF202501003',
                sysEquipmentTypeName: '充电桩',
                sysAreaAreaName: 'C区停车场',
                sysStatCycleName: '本月',
                parkDeviceEfficiencyDeviceOperationEfficiency: 95.2,
                parkDeviceEfficiencyFaultRepairRate: 78.6,
                parkDeviceEfficiencyAverageFaultFreeDuration: 810,
              },
              {
                id: 'EFF202501004',
                sysEquipmentTypeName: '车位引导屏',
                sysAreaAreaName: 'D区停车场',
                sysStatCycleName: '本月',
                parkDeviceEfficiencyDeviceOperationEfficiency: 90.3,
                parkDeviceEfficiencyFaultRepairRate: 88.9,
                parkDeviceEfficiencyAverageFaultFreeDuration: 680,
              },
              {
                id: 'EFF202501005',
                sysEquipmentTypeName: '地磁传感器',
                sysAreaAreaName: 'E区停车场',
                sysStatCycleName: '本月',
                parkDeviceEfficiencyDeviceOperationEfficiency: 87.6,
                parkDeviceEfficiencyFaultRepairRate: 91.4,
                parkDeviceEfficiencyAverageFaultFreeDuration: 590,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDeviceResourceEfficiencyList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 设备资源效能核心指标（卡片展示）
export const fetchDeviceResourceEfficiencyIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/efficiency/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.avgOperationEfficiency &&
          response.avgFaultFreeDuration &&
          response.avgFaultRepairRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备资源效能核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备资源效能指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              avgOperationEfficiency: 90.8, // 设备平均运行效率
              avgFaultFreeDuration: 690, // 平均无故障时长
              avgFaultRepairRate: 87.2, // 平均故障修复率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备资源效能指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      avgOperationEfficiency: 0,
      avgFaultFreeDuration: 0,
      avgFaultRepairRate: 0,
    });
  }
};

// 不同设备类型运行效率对比（柱状图）
export const fetchDeviceResourceEfficiencyTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/efficiency/stat/type/compare`,
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
        throw new Error('真实接口返回无设备类型运行效率对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备类型运行效率对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['道闸设备', '监控摄像头', '充电桩', '车位引导屏', '地磁传感器'],
              series: [{ name: '运行效率(%)', data: [92.5, 88.7, 95.2, 90.3, 87.6] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备类型运行效率对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '运行效率(%)', data: [] }],
    });
  }
};

// 近周期设备故障修复率趋势（折线图）
export const fetchDeviceResourceEfficiencyTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/efficiency/stat/trend`,
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
        throw new Error('真实接口返回无设备故障修复率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备故障修复率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['第1周', '第2周', '第3周', '第4周', '第5周'],
              series: [{ name: '故障修复率(%)', data: [82.5, 85.3, 87.6, 89.2, 91.4] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备故障修复率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '故障修复率(%)', data: [] }],
    });
  }
};

// 各区域设备效能占比（饼图）
export const fetchDeviceResourceEfficiencyAreaRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/efficiency/stat/area/ratio`,
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
        throw new Error('真实接口返回无区域设备效能占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域设备效能占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['A区停车场', 'B区停车场', 'C区停车场', 'D区停车场', 'E区停车场'],
              series: [{ name: '设备效能占比(%)', data: [25.8, 22.3, 18.7, 20.5, 12.7] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域设备效能占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '设备效能占比(%)', data: [] }],
    });
  }
};

// 设备资源效能详情查询 - 详情弹窗专用
export const fetchDeviceResourceEfficiencyDetail = (efficiencyId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/efficiency/detail/${efficiencyId}`,
        params,
      })
      .then((response) => {
        if (response && response.id === efficiencyId) {
          return response;
        }
        throw new Error('真实接口返回无设备资源效能详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('设备资源效能详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              id: efficiencyId,
              sysEquipmentTypeName: efficiencyId === 'EFF202501001' ? '道闸设备' : '监控摄像头',
              sysAreaAreaName: efficiencyId === 'EFF202501001' ? 'A区停车场' : 'B区停车场',
              sysStatCycleName: efficiencyId === 'EFF202501001' ? '本月' : '本月',
              parkDeviceEfficiencyDeviceOperationEfficiency: efficiencyId === 'EFF202501001' ? 92.5 : 88.7,
              parkDeviceEfficiencyFaultRepairRate: efficiencyId === 'EFF202501001' ? 85.3 : 92.1,
              parkDeviceEfficiencyAverageFaultFreeDuration: efficiencyId === 'EFF202501001' ? 720 : 650,
              // 详情字段
              parkDeviceEfficiencyYoyGrowthRate: efficiencyId === 'EFF202501001' ? 8.2 : 6.7,
              parkDeviceEfficiencyMomGrowthRate: efficiencyId === 'EFF202501001' ? 2.5 : 1.8,
              parkDeviceEfficiencyLowEfficiencyCount: efficiencyId === 'EFF202501001' ? 3 : 2,
              parkDeviceEfficiencyMaintenanceSuggestion: efficiencyId === 'EFF202501001' ? '建议定期检查道闸电机，更新控制程序' : '建议升级摄像头固件，优化夜间识别算法',
              // 效能计算明细
              efficiencyCalculationDetails: [
                { item: '运行时间占比', value: '92.5%', standard: '≥90%' },
                { item: '响应时间达标率', value: '88.7%', standard: '≥85%' },
                { item: '故障响应时长', value: '15分钟', standard: '≤20分钟' },
                { item: '维护及时率', value: '95.2%', standard: '≥90%' }
              ],
              // 设备故障记录
              faultRecords: [
                { faultTime: '2024-01-15 10:30', faultType: '机械故障', repairTime: '2024-01-15 11:45', status: '已修复' },
                { faultTime: '2024-01-10 14:20', faultType: '电气故障', repairTime: '2024-01-10 16:10', status: '已修复' },
                { faultTime: '2024-01-05 08:45', faultType: '通信故障', repairTime: '2024-01-05 09:30', status: '已修复' }
              ],
              // 运行日志
              operationLogs: [
                { time: '2024-01-20 08:00', operation: '设备启动', operator: '系统', result: '成功' },
                { time: '2024-01-19 18:00', operation: '日常巡检', operator: '张三', result: '正常' },
                { time: '2024-01-18 14:30', operation: '固件升级', operator: '李四', result: '成功' }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDeviceResourceEfficiencyDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交维护工单
export const submitDeviceMaintenanceOrder = (efficiencyId, maintenanceType, maintenanceTime) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/device/efficiency/maintenance/${efficiencyId}`,
        data: { maintenanceType, maintenanceTime },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无维护工单结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('维护工单接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '维护工单提交成功',
              orderId: 'MAINT' + Date.now(),
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitDeviceMaintenanceOrder 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '接口异常' });
  }
};


// ======================== 运维人员动态 所有接口 ========================
// 运维人员动态-人员列表地图接口
export const fetchMaintainStaffGeometries = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/maintain/staff/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            maintainUserId: item.maintainUserId,
            userName: item.userName,
            department: item.department,
            responsibleArea: item.responsibleArea,
            onDutyStatus: item.onDutyStatus,
            scheduleId: item.scheduleId,
            shiftType: item.shiftType,
            workTime: item.workTime,
            contactPhone: item.contactPhone,
            currentTask: item.currentTask,
            maintainLatitude: item.maintainLatitude,
            maintainLongitude: item.maintainLongitude,
          }));
        }
        throw new Error('真实接口返回无运维人员列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('运维人员列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                maintainUserId: 'M2026001',
                userName: '张明',
                department: '运维一部',
                responsibleArea: '主城区',
                onDutyStatus: '在岗',
                scheduleId: 'SCH202601',
                shiftType: '白班',
                workTime: '08:00-18:00',
                contactPhone: '13800138000',
                currentTask: '设备巡检',
                maintainLatitude: 24.582,
                maintainLongitude: 117.651,
              },
              {
                maintainUserId: 'M2026002',
                userName: '李华',
                department: '运维二部',
                responsibleArea: '高新区',
                onDutyStatus: '任务中',
                scheduleId: 'SCH202602',
                shiftType: '白班',
                workTime: '08:00-18:00',
                contactPhone: '13900139000',
                currentTask: '道闸维修',
                maintainLatitude: 24.578,
                maintainLongitude: 117.662,
              },
              {
                maintainUserId: 'M2026003',
                userName: '王强',
                department: '运维三部',
                responsibleArea: '经开区',
                onDutyStatus: '离岗',
                scheduleId: 'SCH202603',
                shiftType: '夜班',
                workTime: '18:00-08:00',
                contactPhone: '13700137000',
                currentTask: '无',
                maintainLatitude: 24.591,
                maintainLongitude: 117.645,
              },
              {
                maintainUserId: 'M2026004',
                userName: '赵芳',
                department: '运维一部',
                responsibleArea: '文旅区',
                onDutyStatus: '在岗',
                scheduleId: 'SCH202601',
                shiftType: '白班',
                workTime: '08:00-18:00',
                contactPhone: '13600136000',
                currentTask: '泊位故障排查',
                maintainLatitude: 24.575,
                maintainLongitude: 117.673,
              },
              {
                maintainUserId: 'M2026005',
                userName: '陈杰',
                department: '运维二部',
                responsibleArea: '周边区县',
                onDutyStatus: '任务中',
                scheduleId: 'SCH202602',
                shiftType: '夜班',
                workTime: '18:00-08:00',
                contactPhone: '13500135000',
                currentTask: '充电桩维护',
                maintainLatitude: 24.602,
                maintainLongitude: 117.638,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainStaffList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 运维人员动态-核心指标 (总运维人数、在岗人数、当前任务数)
export const fetchMaintainStaffIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/maintain/staff/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalStaffCount &&
          response.onDutyCount &&
          response.taskCount
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
              totalStaffCount: 28, // 总运维人数
              onDutyCount: 21, // 在岗人数
              taskCount: 9, // 当前任务数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 运维人员核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalStaffCount: 0,
      onDutyCount: 0,
      taskCount: 0,
    });
  }
};

// 运维人员动态-各部门在岗人数对比 柱状图
export const fetchMaintainDeptOnDutyCompare = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/maintain/staff/stat/dept/compare`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '运维人员部门在岗对比柱状图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: ['运维一部', '运维二部', '运维三部', '应急抢修组'],
          series: [{ name: '部门在岗人数(人)', data: [8, 7, 4, 2] }],
        };
      });
  } catch (error) {
    console.error('fetchMaintainDeptOnDutyCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// ======================== 资源全景监控 所有接口 ========================
// 停车资源全景监控-地图接口
export const fetchParkingResourceGeometries = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/panoramic/geometries/get`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response) && response.length > 0) {
          return response;
        }
        throw new Error('真实接口返回无地图点位数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log(
          '停车资源全景地图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                lotId: 'LOT2026001',
                lotName: '主城区中央停车场',
                totalSpace: 520,
                availableSpace: 126,
                parkType: 'public',
                garageId: 'GAR001',
                floorCount: 3,
                longitude: 117.652,
                latitude: 24.581,
                accountId: 'ACC2026001',
                updateTime: 1_736_889_600_000,
              },
              {
                lotId: 'LOT2026002',
                lotName: '高新区商业广场停车场',
                totalSpace: 890,
                availableSpace: 205,
                parkType: 'business',
                garageId: 'GAR002',
                floorCount: 2,
                longitude: 117.673,
                latitude: 24.572,
                accountId: 'ACC2026002',
                updateTime: 1_736_893_200_000,
              },
              {
                lotId: 'LOT2026003',
                lotName: '经开区产业园停车场',
                totalSpace: 360,
                availableSpace: 98,
                parkType: 'park',
                garageId: 'GAR003',
                floorCount: 1,
                longitude: 117.631,
                latitude: 24.565,
                accountId: 'ACC2026003',
                updateTime: 1_736_896_800_000,
              },
              {
                lotId: 'LOT2026001',
                lotName: '主城区中央停车场',
                roadsideId: 'RS20260001',
                berthNumber: 'ZC-001',
                status: '占用',
                spaceId: 'SP20260001',
                spaceType: '路侧',
                entryExitId: 'EE001',
                direction: '东',
                longitude: 117.6522,
                latitude: 24.5812,
                accountId: 'ACC2026001',
                updateTime: 1_736_889_600_000,
              },
              {
                lotId: 'LOT2026001',
                lotName: '主城区中央停车场',
                roadsideId: 'RS20260002',
                berthNumber: 'ZC-002',
                status: '空闲',
                spaceId: 'SP20260002',
                spaceType: '路侧',
                entryExitId: 'EE001',
                direction: '东',
                longitude: 117.6524,
                latitude: 24.5814,
                accountId: 'ACC2026001',
                updateTime: 1_736_889_600_000,
              },
              {
                lotId: 'LOT2026001',
                lotName: '主城区中央停车场',
                roadsideId: 'RS20260003',
                berthNumber: 'ZC-003',
                status: '故障',
                spaceId: 'SP20260003',
                spaceType: '路侧',
                entryExitId: 'EE002',
                direction: '西',
                longitude: 117.6518,
                latitude: 24.5808,
                accountId: 'ACC2026001',
                updateTime: 1_736_889_600_000,
              },
              {
                lotId: 'LOT2026002',
                lotName: '高新区商业广场停车场',
                roadsideId: 'RS20260010',
                berthNumber: 'GX-001',
                status: '占用',
                spaceId: 'SP20260010',
                spaceType: '路侧',
                entryExitId: 'EE003',
                direction: '南',
                longitude: 117.6732,
                latitude: 24.5722,
                accountId: 'ACC2026002',
                updateTime: 1_736_893_200_000,
              },
              {
                lotId: 'LOT2026002',
                lotName: '高新区商业广场停车场',
                roadsideId: 'RS20260011',
                berthNumber: 'GX-002',
                status: '空闲',
                spaceId: 'SP20260011',
                spaceType: '路侧',
                entryExitId: 'EE003',
                direction: '南',
                longitude: 117.6734,
                latitude: 24.5724,
                accountId: 'ACC2026002',
                updateTime: 1_736_893_200_000,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkingLotGeometries 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 资源全景监控-核心指标 (总资源数、可用资源数、正常运营资源数)
export const fetchParkPanoramaIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/panorama/resource/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalResourceCount &&
          response.availableResourceCount &&
          response.normalOperateCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无资源全景核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源全景核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalResourceCount: 286, // 总资源数(个：车场+车库+泊位+出入口)
              availableResourceCount: 235, // 可用资源数
              normalOperateCount: 271, // 正常运营资源数
              normalOperateRate: 94.8, // 资源正常运营率(%)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 资源全景核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalResourceCount: 0,
      availableResourceCount: 0,
      normalOperateCount: 0,
      normalOperateRate: 0,
    });
  }
};

// 资源全景监控-资源类型占比 饼图 (车场/车库/路侧泊位/出入口)
export const fetchParkPanoramaResourceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/panorama/stat/resource/type/ratio`,
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
        throw new Error('真实接口返回无资源类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['地面车场', '室内车库', '路侧泊位', '车场出入口'],
              series: [{ name: '资源类型数量占比', data: [38, 25, 32, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('fetchParkPanoramaResourceTypeRatio 异常:', error);
    return Promise.resolve({
      legend: [],
      series: [{ name: '资源类型数量占比', data: [] }],
    });
  }
};

// 资源全景监控-车位类型占比 饼图 (普通车位/充电车位/无障碍/子母车位)
export const fetchParkPanoramaSpaceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/panorama/stat/space/type/ratio`, params })
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
        throw new Error('真实接口返回无车位类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '车位类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['普通车位', '充电车位', '无障碍车位', '子母车位'],
              series: [{ name: '车位类型数量占比', data: [65, 20, 8, 7] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('fetchParkPanoramaSpaceTypeRatio 异常:', error);
    return Promise.resolve({
      legend: [],
      series: [{ name: '车位类型数量占比', data: [] }],
    });
  }
};

// ======================== 车辆轨迹监控 所有接口 ========================
// 车辆轨迹监控-车辆通行轨迹详情地图接口
export const fetchCarTrackGeometries = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/car/track/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            entryId: item.entryId,
            carNumber: item.carNumber,
            entryTime: item.entryTime,
            entryPosition: item.entryPosition,
            parkingId: item.parkingId,
            spaceId: item.spaceId,
            parkingTime: item.parkingTime,
            exitId: item.exitId,
            exitTime: item.exitTime,
            exitPosition: item.exitPosition,
            inspectionId: item.inspectionId,
            inspectionResult: item.inspectionResult,
            carLatitude: item.carLatitude,
            carLongitude: item.carLongitude,
            carStatus: item.inspectionResult === '正常' ? 'normal' : 'abnormal',
          }));
        }
        throw new Error('真实接口返回无车辆轨迹列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('车辆轨迹列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                entryId: 'ENTRY20260001',
                carNumber: '闽E·88966',
                entryTime: 1_736_889_600_000,
                entryPosition: '主城区中央停车场入口',
                parkingId: 'PARK20260001',
                spaceId: 'SPACE1001',
                parkingTime: 125,
                exitId: 'EXIT20260001',
                exitTime: 1_736_897_400_000,
                exitPosition: '主城区中央停车场出口',
                inspectionId: 'CHECK001',
                inspectionResult: '正常',
                carLatitude: 24.582,
                carLongitude: 117.651,
                carStatus: 'normal',
              },
              {
                entryId: 'ENTRY20260002',
                carNumber: '闽E·76523',
                entryTime: 1_736_890_200_000,
                entryPosition: '高新区商业广场入口',
                parkingId: 'PARK20260002',
                spaceId: 'SPACE2005',
                parkingTime: 89,
                exitId: 'EXIT20260002',
                exitTime: 1_736_895_540_000,
                exitPosition: '高新区商业广场出口',
                inspectionId: 'CHECK002',
                inspectionResult: '异常',
                carLatitude: 24.591,
                carLongitude: 117.663,
                carStatus: 'abnormal',
              },
              {
                entryId: 'ENTRY20260003',
                carNumber: '闽E·91256',
                entryTime: 1_736_891_000_000,
                entryPosition: '经开区产业园入口',
                parkingId: 'PARK20260003',
                spaceId: 'SPACE3008',
                parkingTime: 210,
                exitId: 'EXIT20260003',
                exitTime: 1_736_903_600_000,
                exitPosition: '经开区产业园出口',
                inspectionId: 'CHECK003',
                inspectionResult: '正常',
                carLatitude: 24.573,
                carLongitude: 117.642,
                carStatus: 'normal',
              },
              {
                entryId: 'ENTRY20260004',
                carNumber: '闽E·63289',
                entryTime: 1_736_892_500_000,
                entryPosition: '文旅区生态停车场入口',
                parkingId: 'PARK20260004',
                spaceId: 'SPACE4002',
                parkingTime: 156,
                exitId: 'EXIT20260004',
                exitTime: 1_736_901_460_000,
                exitPosition: '文旅区生态停车场出口',
                inspectionId: 'CHECK004',
                inspectionResult: '异常',
                carLatitude: 24.565,
                carLongitude: 117.675,
                carStatus: 'abnormal',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchCarTrackList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    return Promise.resolve([]);
  }
};

// 车辆轨迹监控-核心指标 (当日通行车辆数、异常通行车辆数)
export const fetchCarTrackIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/car/track/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.todayPassCarCount &&
          response.abnormalCarCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无车辆轨迹核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '车辆轨迹核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              todayPassCarCount: 236, // 当日通行车辆数 (辆)
              abnormalCarCount: 17, // 异常通行车辆数 (辆)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 车辆轨迹核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    return Promise.resolve({
      todayPassCarCount: 0,
      abnormalCarCount: 0,
    });
  }
};

// 车辆轨迹监控-单车辆通行时段趋势 折线图
export const fetchCarTrackSingleTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/car/track/stat/trend/single`,
        params,
      })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '单车辆通行时段趋势折线图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: [
            '00时',
            '03时',
            '06时',
            '09时',
            '12时',
            '15时',
            '18时',
            '21时',
          ],
          series: [
            { name: '通行车辆数(辆)', data: [8, 15, 23, 36, 29, 41, 35, 19] },
          ],
        };
      });
  } catch (error) {
    console.error('fetchCarTrackSingleTrend 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// ======================== 停车资源效能 所有接口 ========================
// 停车资源效能-车场资源详情列表 (核心字段全量包含)
export const fetchParkResourceList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/efficiency/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            lotId: item.lotId,
            lotName: item.lotName,
            parkingSpaceTurnoverRate: item.parkingSpaceTurnoverRate,
            resourceUtilizationRate: item.resourceUtilizationRate,
            peakTimePeriodUtilizationRate: item.peakTimePeriodUtilizationRate,
            areaCode: item.areaCode,
            parkType: item.parkType,
            statTime: item.statTime,
          }));
        }
        throw new Error('真实接口返回无停车资源列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('停车资源列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                lotId: 'LOT2026001',
                lotName: '主城区中央停车场',
                parkingSpaceTurnoverRate: 3.8,
                resourceUtilizationRate: 89.2,
                peakTimePeriodUtilizationRate: 96.5,
                areaCode: 'main',
                parkType: 'public',
                statTime: 1_736_889_600_000,
              },
              {
                lotId: 'LOT2026002',
                lotName: '高新区商业广场停车场',
                parkingSpaceTurnoverRate: 5.2,
                resourceUtilizationRate: 92.6,
                peakTimePeriodUtilizationRate: 98.3,
                areaCode: 'highTech',
                parkType: 'business',
                statTime: 1_736_893_200_000,
              },
              {
                lotId: 'LOT2026003',
                lotName: '经开区产业园停车场',
                parkingSpaceTurnoverRate: 2.1,
                resourceUtilizationRate: 75.8,
                peakTimePeriodUtilizationRate: 82.4,
                areaCode: 'economic',
                parkType: 'park',
                statTime: 1_736_896_800_000,
              },
              {
                lotId: 'LOT2026004',
                lotName: '文旅区生态停车场',
                parkingSpaceTurnoverRate: 4.5,
                resourceUtilizationRate: 86.3,
                peakTimePeriodUtilizationRate: 94.7,
                areaCode: 'culture',
                parkType: 'tourism',
                statTime: 1_736_900_400_000,
              },
              {
                lotId: 'LOT2026005',
                lotName: '周边区县便民停车场',
                parkingSpaceTurnoverRate: 1.9,
                resourceUtilizationRate: 68.5,
                peakTimePeriodUtilizationRate: 76.2,
                areaCode: 'suburb',
                parkType: 'public',
                statTime: 1_736_904_000_000,
              },
              {
                lotId: 'LOT2026006',
                lotName: '主城区小区配套车场',
                parkingSpaceTurnoverRate: 1.5,
                resourceUtilizationRate: 72.1,
                peakTimePeriodUtilizationRate: 88.6,
                areaCode: 'main',
                parkType: 'community',
                statTime: 1_736_907_600_000,
              },
              {
                lotId: 'LOT2026007',
                lotName: '高新区写字楼停车场',
                parkingSpaceTurnoverRate: 3.2,
                resourceUtilizationRate: 81.7,
                peakTimePeriodUtilizationRate: 93.5,
                areaCode: 'highTech',
                parkType: 'business',
                statTime: 1_736_911_200_000,
              },
              {
                lotId: 'LOT2026008',
                lotName: '经开区物流园车场',
                parkingSpaceTurnoverRate: 2.7,
                resourceUtilizationRate: 79.3,
                peakTimePeriodUtilizationRate: 85.1,
                areaCode: 'economic',
                parkType: 'park',
                statTime: 1_736_914_800_000,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 停车资源效能-核心指标 (平均泊位周转率、平均资源利用率)
export const fetchParkResourceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/efficiency/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.avgTurnoverRate &&
          response.avgUtilizationRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无停车资源核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车资源核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              avgTurnoverRate: 2.96, // 平均泊位周转率 (次/日)
              avgUtilizationRate: 80.3, // 平均资源利用率 (%)
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车资源核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      avgTurnoverRate: 0,
      avgUtilizationRate: 0,
    });
  }
};

// 停车资源效能-近周期资源效能趋势 折线图 (周转率+利用率双趋势)
export const fetchParkResourceTrend = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/park/resource/efficiency/stat/trend`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '停车资源效能趋势折线图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: [
            '01日',
            '02日',
            '03日',
            '04日',
            '05日',
            '06日',
            '07日',
            '08日',
            '09日',
            '10日',
            '11日',
            '12日',
            '13日',
            '14日',
            '15日',
          ],
          series: [
            {
              name: '泊位周转率(次/日)',
              data: [
                2.5, 2.7, 2.6, 3, 3.2, 3.5, 3.3, 3.6, 3.4, 3.1, 2.9, 2.8, 3,
                3.2, 2.9,
              ],
            },
            {
              name: '资源利用率(%)',
              data: [
                76.2, 77.5, 78.1, 79.3, 80.5, 82.1, 81.7, 83.2, 82.6, 81.5,
                80.2, 79.6, 80.1, 81.4, 80.3,
              ],
            },
          ],
        };
      });
  } catch (error) {
    console.error('fetchParkResourceTrend 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 停车资源效能-各区域资源效能占比 饼图
export const fetchParkResourceAreaRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/efficiency/stat/area/ratio`,
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
        throw new Error('真实接口返回无区域资源占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域资源效能占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['主城区', '高新区', '经开区', '文旅区', '周边区县'],
              series: [
                { name: '区域资源效能占比', data: [35, 25, 18, 12, 10] },
              ],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 区域资源效能占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '区域资源效能占比', data: [] }],
    });
  }
};

// 停车资源效能-区域资源利用率对比 柱状图
export const fetchParkResourceAreaCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/efficiency/stat/area/compare`,
        params,
      })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '区域资源利用率对比柱状图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: ['主城区', '高新区', '经开区', '文旅区', '周边区县'],
          series: [
            { name: '区域平均利用率(%)', data: [86.5, 90.2, 78.3, 84.7, 69.1] },
          ],
        };
      });
  } catch (error) {
    console.error('fetchParkResourceAreaCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 停车资源效能-车场类型资源利用率对比 柱状图
export const fetchParkResourceTypeCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/efficiency/stat/type/compare`,
        params,
      })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '车场类型利用率对比柱状图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: ['公共车场', '商业车场', '园区车场', '文旅车场', '小区车场'],
          series: [
            { name: '类型平均利用率(%)', data: [75.6, 89.8, 78.2, 83.5, 70.3] },
          ],
        };
      });
  } catch (error) {
    console.error('fetchParkResourceTypeCompare 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// ======================== 备品备件仓储 所有接口 ========================
// 备品备件仓储-库存详情列表 (核心字段全量包含)
export const fetchSparePartList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/spare/part/storage/list`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response.map((item) => ({
            sparePartId: item.sparePartId,
            partName: item.partName,
            model: item.model,
            currentStock: item.currentStock,
            minStock: item.minStock,
            storageLocation: item.storageLocation,
            inId: item.inId,
            inQuantity: item.inQuantity,
            inTime: item.inTime,
            outId: item.outId,
            outQuantity: item.outQuantity,
            outTime: item.outTime,
          }));
        }
        throw new Error('真实接口返回无备件列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('备品备件列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                sparePartId: 'SPA20260101',
                partName: '充电桩接触器',
                model: 'CJX2-1810',
                currentStock: 28,
                minStock: 10,
                storageLocation: '1号仓库A区01货位',
                inId: 'IN2026001',
                inQuantity: 50,
                inTime: 1_735_670_400_000,
                outId: 'OUT2026001',
                outQuantity: 22,
                outTime: 1_736_880_000_000,
              },
              {
                sparePartId: 'SPA20260102',
                partName: '道闸限位开关',
                model: 'LXW5-11G1',
                currentStock: 5,
                minStock: 8,
                storageLocation: '1号仓库B区03货位',
                inId: 'IN2026002',
                inQuantity: 20,
                inTime: 1_735_756_800_000,
                outId: 'OUT2026002',
                outQuantity: 15,
                outTime: 1_736_966_400_000,
              },
              {
                sparePartId: 'SPA20260103',
                partName: '摄像头电源适配器',
                model: '12V2A',
                currentStock: 42,
                minStock: 15,
                storageLocation: '2号仓库A区05货位',
                inId: 'IN2026003',
                inQuantity: 60,
                inTime: 1_735_843_200_000,
                outId: 'OUT2026003',
                outQuantity: 18,
                outTime: 1_737_052_800_000,
              },
              {
                sparePartId: 'SPA20260104',
                partName: '地磁传感器电池',
                model: 'ER14505',
                currentStock: 3,
                minStock: 6,
                storageLocation: '2号仓库C区02货位',
                inId: 'IN2026004',
                inQuantity: 30,
                inTime: 1_735_929_600_000,
                outId: 'OUT2026004',
                outQuantity: 27,
                outTime: 1_737_139_200_000,
              },
              {
                sparePartId: 'SPA20260105',
                partName: '引导屏LED模组',
                model: 'P10单色',
                currentStock: 16,
                minStock: 10,
                storageLocation: '1号仓库D区08货位',
                inId: 'IN2026005',
                inQuantity: 40,
                inTime: 1_736_016_000_000,
                outId: 'OUT2026005',
                outQuantity: 24,
                outTime: 1_737_225_600_000,
              },
              {
                sparePartId: 'SPA20260106',
                partName: '道闸电机减速器',
                model: 'RV030',
                currentStock: 9,
                minStock: 5,
                storageLocation: '3号仓库A区01货位',
                inId: 'IN2026006',
                inQuantity: 25,
                inTime: 1_736_102_400_000,
                outId: 'OUT2026006',
                outQuantity: 16,
                outTime: 1_737_312_000_000,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSparePartList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 备品备件仓储-核心指标 (总备件种类数、库存充足数、缺货备件数)
export const fetchSparePartIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/spare/part/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalPartTypeCount &&
          response.enoughStockCount &&
          response.lackStockCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无备件核心指标数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '备品备件核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalPartTypeCount: 48, // 总备件种类数
              enoughStockCount: 39, // 库存充足数
              lackStockCount: 9, // 缺货备件数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 备品备件核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalPartTypeCount: 0,
      enoughStockCount: 0,
      lackStockCount: 0,
    });
  }
};

// 备品备件仓储-近30日备件出入库数量趋势 柱状图
export const fetchSparePartInOutTrend = (params = {}) => {
  try {
    return requestClient
      .get({ url: `${BASE_URL}/spare/part/stat/in/out/trend`, params })
      .then((res) => res || { xAxis: [], series: [] })
      .catch((error) => {
        console.log(
          '备品备件出入库趋势柱状图接口异常，使用兜底数据',
          error.message,
        );
        return {
          xAxis: [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
          ],
          series: [
            {
              name: '入库数量(件)',
              data: [
                56, 42, 68, 75, 36, 52, 49, 63, 71, 45, 58, 62, 39, 47, 53, 66,
                72, 59, 44, 51, 65, 70, 48, 55, 61, 37, 43, 57, 64, 73,
              ],
            },
            {
              name: '出库数量(件)',
              data: [
                32, 45, 51, 38, 49, 26, 37, 42, 55, 31, 39, 46, 29, 33, 41, 52,
                48, 35, 44, 30, 36, 47, 28, 32, 40, 53, 34, 42, 38, 45,
              ],
            },
          ],
        };
      });
  } catch (error) {
    console.error('fetchSparePartInOutTrend 异常:', error);
    return Promise.resolve({ xAxis: [], series: [] });
  }
};

// 备品备件仓储-备件类型占比 饼图
export const fetchSparePartTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/spare/part/stat/type/ratio`,
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
        throw new Error('真实接口返回无备件类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '备件类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: [
                '机电类备件',
                '电子类备件',
                '五金类备件',
                '耗材类备件',
                '其他类备件',
              ],
              series: [{ name: '备件类型占比', data: [42, 25, 18, 10, 5] }],
            });
          }, 500);
        });
      });
  } catch {
    console.error('===== 备件类型占比饼图函数初始化异常 =====');
    return Promise.resolve({
      legend: [],
      series: [{ name: '备件类型占比', data: [] }],
    });
  }
};
