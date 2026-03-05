// mockData.js

// 考核得分数据（多周期：current表示当前周期得分，previous表示上一周期得分）
export const mockAssessmentData = {
  day: {
    '东埔街道': { current: 91.2, previous: 90.5 },
    '源西街道': { current: 86.3, previous: 88.0 },
    '上城街道': { current: 87.2, previous: 87.2 },
    '新江街道': { current: 88.1, previous: 89.5 },
    '源南镇': { current: 83.4, previous: 84.9 },
    '高埔岗街道': { current: 86.0, previous: 86.0 },
    '埔前镇': { current: 89.9, previous: 89.3 },
    '转运站': { current: 92.3, previous: 91.8 }
  },
  month: {
    '东埔街道': { current: 90.5, previous: 89.8 },
    '源西街道': { current: 85.2, previous: 86.5 },
    '上城街道': { current: 86.8, previous: 86.1 },
    '新江街道': { current: 89.4, previous: 88.7 },
    '源南镇': { current: 84.9, previous: 84.2 },
    '高埔岗街道': { current: 85.6, previous: 85.0 },
    '埔前镇': { current: 88.3, previous: 87.6 },
    '转运站': { current: 89.5, previous: 90.8 }
  },
  quarter: {
    '东埔街道': { current: 87.8, previous: 89.1 },
    '源西街道': { current: 86.5, previous: 85.8 },
    '上城街道': { current: 86.1, previous: 85.4 },
    '新江街道': { current: 88.7, previous: 88.0 },
    '源南镇': { current: 84.2, previous: 83.5 },
    '高埔岗街道': { current: 85.0, previous: 84.3 },
    '埔前镇': { current: 87.6, previous: 86.9 },
    '转运站': { current: 85.8, previous: 90.1 }
  },
  year: {
    '东埔街道': { current: 87.1, previous: 88.4 },
    '源西街道': { current: 85.8, previous: 85.1 },
    '上城街道': { current: 85.4, previous: 84.7 },
    '新江街道': { current: 88.0, previous: 87.3 },
    '源南镇': { current: 81.5, previous: 82.8 },
    '高埔岗街道': { current: 84.3, previous: 83.6 },
    '埔前镇': { current: 86.9, previous: 86.2 },
    '转运站': { current: 90.1, previous: 89.4 }
  }
}

// 处理事件数据（按时间倒序，时间段格式）
export const eventList = [
  { id: 18, region: '源南镇', type: '公厕清洁', time: '2026-03-05 18:00-18:45', status: '已完成', person: '刘十九', completionRate: 95 },
  { id: 17, region: '上城街道', type: '绿化维护', time: '2026-03-05 17:30-18:15', status: '处理中', person: '郑二十', completionRate: null },
  { id: 16, region: '新江街道', type: '设施维修', time: '2026-03-05 17:00-17:30', status: '待处理', person: '周十一', completionRate: null },
  { id: 15, region: '东埔街道', type: '垃圾清运', time: '2026-03-05 16:45-17:20', status: '已完成', person: '吴十二', completionRate: 88 },
  { id: 14, region: '埔前镇', type: '园林修剪', time: '2026-03-05 16:20-17:00', status: '处理中', person: '郑十三', completionRate: null },
  { id: 13, region: '转运站', type: '设备检查', time: '2026-03-05 16:00-16:30', status: '待处理', person: '王十四', completionRate: null },
  { id: 12, region: '源西街道', type: '道路清扫', time: '2026-03-05 15:40-16:20', status: '已完成', person: '李十五', completionRate: 92 },
  { id: 11, region: '高埔岗街道', type: '垃圾分类', time: '2026-03-05 15:15-15:50', status: '处理中', person: '张十六', completionRate: null },
  { id: 10, region: '东埔街道', type: '垃圾清运', time: '2026-03-05 14:50-15:30', status: '待处理', person: '赵十七', completionRate: null },
  { id: 9, region: '源南镇', type: '公厕清洁', time: '2026-03-05 14:20-14:55', status: '已完成', person: '钱十八', completionRate: 100 },
  { id: 8, region: '上城街道', type: '设施维修', time: '2026-03-05 13:45-14:30', status: '处理中', person: '孙十九', completionRate: null },
  { id: 7, region: '新江街道', type: '道路清扫', time: '2026-03-05 13:10-13:50', status: '待处理', person: '周二十', completionRate: null },
  { id: 6, region: '埔前镇', type: '园林修剪', time: '2026-03-05 12:30-13:15', status: '已完成', person: '吴二一', completionRate: 87 },
  { id: 5, region: '转运站', type: '设备检查', time: '2026-03-05 11:50-12:30', status: '处理中', person: '郑二二', completionRate: null },
  { id: 4, region: '源西街道', type: '绿化维护', time: '2026-03-05 11:10-11:50', status: '待处理', person: '王二三', completionRate: null },
  { id: 3, region: '高埔岗街道', type: '垃圾分类', time: '2026-03-05 10:30-11:15', status: '已完成', person: '李二四', completionRate: 90 },
  { id: 2, region: '东埔街道', type: '垃圾清运', time: '2026-03-05 09:45-10:30', status: '处理中', person: '张二五', completionRate: null },
  { id: 1, region: '源南镇', type: '公厕清洁', time: '2026-03-05 09:00-09:40', status: '待处理', person: '刘二六', completionRate: null }
]

// 地区列表（河源市源城区）
export const districtList = [
  { id: 1, name: '东埔街道', center: { lat: 23.737, lng: 114.701 }, adcode: '441602001' },
  { id: 2, name: '源西街道', center: { lat: 23.730, lng: 114.690 }, adcode: '441602002' },
  { id: 3, name: '上城街道', center: { lat: 23.740, lng: 114.710 }, adcode: '441602003' },
  { id: 4, name: '新江街道', center: { lat: 23.720, lng: 114.715 }, adcode: '441602004' },
  { id: 5, name: '源南镇', center: { lat: 23.715, lng: 114.680 }, adcode: '441602100' },
  { id: 6, name: '高埔岗街道', center: { lat: 23.755, lng: 114.695 }, adcode: '441602005' },
  { id: 7, name: '埔前镇', center: { lat: 23.765, lng: 114.725 }, adcode: '441602101' },
  { id: 8, name: '转运站', center: { lat: 23.710, lng: 114.705 }, adcode: '441602999' }
]

// 模拟环卫车辆数据（16辆）
export const mockVehicleData = [
  { id: 1, vehicle_id: 'HV001', plate_number: '粤P12345', vehicle_type: '垃圾清运车', status: '正常', speed: 35, lat: 23.738, lng: 114.702, district: '东埔街道', driver: '张三', contact_phone: '13800138001' },
  { id: 2, vehicle_id: 'HV002', plate_number: '粤P23456', vehicle_type: '扫地车', status: '正常', speed: 20, lat: 23.731, lng: 114.691, district: '源西街道', driver: '李四', contact_phone: '13800138002' },
  { id: 3, vehicle_id: 'HV003', plate_number: '粤P34567', vehicle_type: '洒水车', status: '预警', speed: 15, lat: 23.741, lng: 114.711, district: '上城街道', driver: '王五', contact_phone: '13800138003' },
  { id: 4, vehicle_id: 'HV004', plate_number: '粤P45678', vehicle_type: '垃圾清运车', status: '正常', speed: 40, lat: 23.721, lng: 114.716, district: '新江街道', driver: '赵六', contact_phone: '13800138004' },
  { id: 5, vehicle_id: 'HV005', plate_number: '粤P56789', vehicle_type: '扫地车', status: '离线', speed: 0, lat: 23.716, lng: 114.681, district: '源南镇', driver: '钱七', contact_phone: '13800138005' },
  { id: 6, vehicle_id: 'HV006', plate_number: '粤P67890', vehicle_type: '洒水车', status: '正常', speed: 25, lat: 23.756, lng: 114.696, district: '高埔岗街道', driver: '孙八', contact_phone: '13800138006' },
  { id: 7, vehicle_id: 'HV007', plate_number: '粤P78901', vehicle_type: '垃圾清运车', status: '预警', speed: 30, lat: 23.766, lng: 114.726, district: '埔前镇', driver: '周九', contact_phone: '13800138007' },
  { id: 8, vehicle_id: 'HV008', plate_number: '粤P89012', vehicle_type: '扫地车', status: '正常', speed: 18, lat: 23.711, lng: 114.706, district: '转运站', driver: '吴十', contact_phone: '13800138008' },
  { id: 9, vehicle_id: 'HV009', plate_number: '粤P90123', vehicle_type: '洒水车', status: '正常', speed: 22, lat: 23.737, lng: 114.703, district: '东埔街道', driver: '郑十一', contact_phone: '13800138009' },
  { id: 10, vehicle_id: 'HV010', plate_number: '粤P01234', vehicle_type: '垃圾清运车', status: '正常', speed: 28, lat: 23.729, lng: 114.692, district: '源西街道', driver: '王十二', contact_phone: '13800138010' },
  { id: 11, vehicle_id: 'HV011', plate_number: '粤P11234', vehicle_type: '洒水车', status: '正常', speed: 20, lat: 23.739, lng: 114.712, district: '上城街道', driver: '李十三', contact_phone: '13800138011' },
  { id: 12, vehicle_id: 'HV012', plate_number: '粤P21234', vehicle_type: '扫地车', status: '正常', speed: 15, lat: 23.719, lng: 114.714, district: '新江街道', driver: '张十四', contact_phone: '13800138012' },
  { id: 13, vehicle_id: 'HV013', plate_number: '粤P31234', vehicle_type: '垃圾清运车', status: '正常', speed: 32, lat: 23.714, lng: 114.682, district: '源南镇', driver: '刘十五', contact_phone: '13800138013' },
  { id: 14, vehicle_id: 'HV014', plate_number: '粤P41234', vehicle_type: '洒水车', status: '预警', speed: 12, lat: 23.757, lng: 114.697, district: '高埔岗街道', driver: '陈十六', contact_phone: '13800138014' },
  { id: 15, vehicle_id: 'HV015', plate_number: '粤P51234', vehicle_type: '扫地车', status: '正常', speed: 16, lat: 23.764, lng: 114.724, district: '埔前镇', driver: '杨十七', contact_phone: '13800138015' },
  { id: 16, vehicle_id: 'HV016', plate_number: '粤P61234', vehicle_type: '垃圾清运车', status: '正常', speed: 38, lat: 23.712, lng: 114.707, district: '转运站', driver: '黄十八', contact_phone: '13800138016' }
]

// 设备指标模拟数据
export const deviceIndicatorsMock = {
  tbDeviceTotalCount: 131,
  tbDeviceOnlineCount: 115,
  tbDeviceNormalCount: 109,
  tbDeviceFaultCount: 6
}
