import { requestClient } from '#/api/request';  
export function getRateSettingList(params) {
  return requestClient.get('/vehiclecharging/rate-setting/page', {
    params,   
})
}
/** excel导出 */
export function exporRateSettingExcel() {
  return requestClient.download(`/vehiclecharging/rate-setting/export-excel`);
}
/** 删除 */
export function deleteRateSetting(id) {
  return requestClient.delete(`/vehiclecharging/rate-setting/delete?id=${id}`);
}

/** 创建 */
export function createRateSetting(data) {
  return requestClient.post(`/vehiclecharging/rate-setting/create`, data);
}
/** 编辑 */
export function updateRateSetting(data) {
  return requestClient.put(`/vehiclecharging/rate-setting/update`, data);
}

/** 生效 */
export function enableRateSetting(data) {
  return requestClient.put(`/vehiclecharging/rate-setting/enable`, data);
}
/** 失效 */
export function disableRateSetting(data) {
  return requestClient.put(`/vehiclecharging/rate-setting/disable`, data);
}
/** 复制 */
export function copyRateSetting(data) {
  return requestClient.post(`/vehiclecharging/rate-setting/copy`, data);
}
/** 费率设置分布图表（柱状图 + 卡片） */
export function getRateSettingChart(data) {
  return requestClient.get(`/vehiclecharging/rate-setting/chart`, data);
}
/** 柱状图钻取 */
export function getRateSettingGradeCount(data) {
  return requestClient.get(`/vehiclecharging/rate-setting/chart/gradeCount`, data);
}

/** 获得场站设备实时运行监测图 */
export function getStationDeviceRealTimeMonitor(data) {
  return requestClient.get(`/vehiclecharging/status-monitor/chart`, data).catch(() => {
    return {
      totalCount: 1024,
      normalCount: 980,
      abnormalCount: 20,
      handlingCount: 15,
      recoveredCount: 9,
      paramTrend: [
        {
          time: "09:00",
          voltage: 380.0,
          current: 100.0,
          power: 38.0
        },
        {
          time: "09:15",
          voltage: 379.5,
          current: 102.0,
          power: 38.7
        },
        {
          time: "09:30",
          voltage: 380.2,
          current: 105.0,
          power: 39.9
        },
        {
          time: "09:45",
          voltage: 379.8,
          current: 108.0,
          power: 41.0
        },
        {
          time: "10:00",
          voltage: 380.0,
          current: 110.0,
          power: 41.8
        }
      ],
      abnormalPoints: [
        {
          id: 5001,
          deviceName: "CP20250301001 -快充桩",
          lon: 118.589423,
          lat: 24.907856,
          alarmLevel: "serious",
          alarmLevelName: "严重"
        },
        {
          id: 5002,
          deviceName: "CP20250301002 -慢充桩",
          lon: 118.590123,
          lat: 24.908156,
          alarmLevel: "serious",
          alarmLevelName: "严重"
        },
        {
          id: 5003,
          deviceName: "CP20250301003 -快充桩",
          lon: 118.590823,
          lat: 24.908456,
          alarmLevel: "serious",
          alarmLevelName: "严重"
        },
        {
          id: 5004,
          deviceName: "CP20250301004 -慢充桩",
          lon: 118.591523,
          lat: 24.908756,
          alarmLevel: "serious",
          alarmLevelName: "严重"
        },
        {
          id: 5005,
          deviceName: "CP20250301005 -快充桩",
          lon: 118.592223,
          lat: 24.909056,
          alarmLevel: "serious",
          alarmLevelName: "严重"
        }
      ]
    };
  });
}
/** 设备运行参数实时趋势（折线图钻取） */
export function getParamTrend(data) {
  return requestClient.get(`/vehiclecharging/status-monitor/chart/paramTrend`, data).catch(() => {
    return [
      {
        "time": "08:00",
        "voltage": 380.0,
        "current": 120.0,
        "power": 45.6
      },
      {
        "time": "08:15",
        "voltage": 378.0,
        "current": 125.0,
        "power": 47.25
      },
      {
        "time": "08:30",
        "voltage": 382.0,
        "current": 118.0,
        "power": 45.076
      }
    ];
  });
}
