import { requestClient } from '#/api/request';  
export function getDriveinList(params) {
  return requestClient.get('/vehiclecharging/status_monitor/page', {
    params,
  }).catch(() => {
    return {
          list: [
            {
              id: 5001,
              device_code: "CP20250301001",
              station_id: 1001,
              station_name: "泉州丰泽万达广场充电站",
              lot_id: 2001,
              lot_code: "CL20250301001",
              device_type: "pile",
              device_type_name: "充电桩",
              voltage: 380.0,
              current: 120.0,
              power: 45.6,
              alarm_level: "serious",
              alarm_level_name: "严重",
              monitor_status: "abnormal",
              monitor_status_name: "异常",
              dispose_user: null,
              disposeUserName: null,
              dispose_measure: null,
              dispose_time: null,
              monitor_time: "2025-03-29 09:58:00",
              remark: "电压异常波动",
              creator: "1",
              createByName: "admin",
              create_time: "2025-03-29 09:58:00",
              update_time: "2025-03-29 09:58:00"
            },
            {
              id: 5002,
              device_code: "CP20250301002",
              station_id: 1002,
              station_name: "泉州丰泽泰禾广场充电站",
              lot_id: 2002,
              lot_code: "CL20250301002",
              device_type: "pile",
              device_type_name: "充电桩",
              voltage: 378.5,
              current: 118.2,
              power: 44.8,
              alarm_level: "general",
              alarm_level_name: "一般",
              monitor_status: "abnormal",
              monitor_status_name: "异常",
              dispose_user: "2",
              disposeUserName: "张三",
              dispose_measure: "检查线路",
              dispose_time: "2025-03-29 10:15:00",
              monitor_time: "2025-03-29 10:00:00",
              remark: "电流异常",
              creator: "1",
              createByName: "admin",
              create_time: "2025-03-29 10:00:00",
              update_time: "2025-03-29 10:15:00"
            },
            {
              id: 5003,
              device_code: "CP20250301003",
              station_id: 1003,
              station_name: "泉州丰泽东海泰禾充电站",
              lot_id: 2003,
              lot_code: "CL20250301003",
              device_type: "pile",
              device_type_name: "充电桩",
              voltage: 381.2,
              current: 121.5,
              power: 46.2,
              alarm_level: "none",
              alarm_level_name: "无",
              monitor_status: "normal",
              monitor_status_name: "正常",
              dispose_user: null,
              disposeUserName: null,
              dispose_measure: null,
              dispose_time: null,
              monitor_time: "2025-03-29 10:30:00",
              remark: "运行正常",
              creator: "1",
              createByName: "admin",
              create_time: "2025-03-29 10:30:00",
              update_time: "2025-03-29 10:30:00"
            },
            {
              id: 5004,
              device_code: "CP20250301004",
              station_id: 1004,
              station_name: "泉州丰泽泉秀路充电站",
              lot_id: 2004,
              lot_code: "CL20250301004",
              device_type: "pile",
              device_type_name: "充电桩",
              voltage: 379.8,
              current: 119.0,
              power: 45.2,
              alarm_level: "serious",
              alarm_level_name: "严重",
              monitor_status: "disposing",
              monitor_status_name: "处置中",
              dispose_user: "3",
              disposeUserName: "李四",
              dispose_measure: "更换保险丝",
              dispose_time: "2025-03-29 10:45:00",
              monitor_time: "2025-03-29 10:40:00",
              remark: "电压过低",
              creator: "1",
              createByName: "admin",
              create_time: "2025-03-29 10:40:00",
              update_time: "2025-03-29 10:45:00"
            },
            {
              id: 5005,
              device_code: "CP20250301005",
              station_id: 1005,
              station_name: "泉州丰泽城东万达充电站",
              lot_id: 2005,
              lot_code: "CL20250301005",
              device_type: "pile",
              device_type_name: "充电桩",
              voltage: 380.5,
              current: 120.8,
              power: 45.9,
              alarm_level: "general",
              alarm_level_name: "一般",
              monitor_status: "recovered",
              monitor_status_name: "已恢复",
              dispose_user: "4",
              disposeUserName: "王五",
              dispose_measure: "重启设备",
              dispose_time: "2025-03-29 11:00:00",
              monitor_time: "2025-03-29 10:55:00",
              remark: "已恢复正常",
              creator: "1",
              createByName: "admin",
              create_time: "2025-03-29 10:55:00",
              update_time: "2025-03-29 11:00:00"
            }
          ],
          total: 1024
        };
  });
}

/** excel导出 */
export function exporStatusExcel() {
  return requestClient.download(`/vehiclecharging/status_monitor/export`);
}

/** 异常处置 */
export function handleAbnormal(data) {
  return requestClient.put(`/vehiclecharging/status_monitor/handleAbnormal`, data);
} 
/** 处置 */
export function dispose(data) {
  return requestClient.put(`/vehiclecharging/status_monitor/handle`, data);
}