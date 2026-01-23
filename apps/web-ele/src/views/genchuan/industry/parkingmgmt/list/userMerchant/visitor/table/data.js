import { maskIdCard, maskPhone } from '#/utils/dataMask/index.js';

/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      visitorId: '1',
      visitorName: '张三',
      phone: '13800138001',
      idCard: '350600199001011234',
      visitAssetId: 'asset-001',
      visitReason: '拜访客户',
      visitTime: '2026-01-10 09:30:00',
      leaveTime: '2026-01-10 11:30:00',
      status: '已结束',
      approveBy: 'admin-001',
      approveTime: '2026-01-10 09:20:00',
      createTime: '2026-01-10 09:15:00',
      remark: '正常拜访',
      plateNumber: '闽E·A1234',
      visitObject: '李四',
      expectedStayTime: '2小时',
    },
    {
      visitorId: '2',
      visitorName: '李四',
      phone: '13800138002',
      idCard: '350600199001012345',
      visitAssetId: 'asset-002',
      visitReason: '技术支持',
      visitTime: '2026-01-11 14:00:00',
      leaveTime: '2026-01-11 17:00:00',
      status: '已结束',
      approveBy: 'admin-002',
      approveTime: '2026-01-11 13:30:00',
      createTime: '2026-01-11 13:20:00',
      remark: '设备维护',
      plateNumber: '闽E·B5678',
      visitObject: '王五',
      expectedStayTime: '3小时',
    },
    {
      visitorId: '3',
      visitorName: '王五',
      phone: '13800138003',
      idCard: '350600199001013456',
      visitAssetId: 'asset-003',
      visitReason: '商务洽谈',
      visitTime: '2026-01-12 10:00:00',
      leaveTime: null,
      status: '已通过',
      approveBy: 'admin-001',
      approveTime: '2026-01-12 09:30:00',
      createTime: '2026-01-12 09:15:00',
      remark: '重要客户',
      plateNumber: '闽E·C9012',
      visitObject: '赵六',
      expectedStayTime: '2小时',
    },
    {
      visitorId: '4',
      visitorName: '赵六',
      phone: '13800138004',
      idCard: '350600199001014567',
      visitAssetId: 'asset-001',
      visitReason: '产品演示',
      visitTime: '2026-01-13 15:00:00',
      leaveTime: '-',
      status: '待审核',
      approveBy: '-',
      approveTime: '-',
      createTime: '2026-01-13 14:30:00',
      remark: '-',
      plateNumber: '闽E·D3456',
      visitObject: '张三',
      expectedStayTime: '1.5小时',
    },
    {
      visitorId: '5',
      visitorName: '孙七',
      phone: '13800138005',
      idCard: '350600199001015678',
      visitAssetId: 'asset-002',
      visitReason: '培训',
      visitTime: '2026-01-14 09:00:00',
      leaveTime: '-',
      status: '已拒绝',
      approveBy: 'admin-002',
      approveTime: '2026-01-14 08:30:00',
      createTime: '2026-01-14 08:15:00',
      remark: '培训取消',
      plateNumber: '闽E·E7890',
      visitObject: '李四',
      expectedStayTime: '4小时',
    },
    {
      visitorId: '6',
      visitorName: '周八',
      phone: '13800138006',
      idCard: '350600199001016789',
      visitAssetId: 'asset-003',
      visitReason: '会议',
      visitTime: '2026-01-15 14:00:00',
      leaveTime: '-',
      status: '待审核',
      approveBy: '-',
      approveTime: '-',
      createTime: '2026-01-15 13:30:00',
      remark: '-',
      plateNumber: '闽E·F2345',
      visitObject: '王五',
      expectedStayTime: '3小时',
    },
    {
      visitorId: '7',
      visitorName: '吴九',
      phone: '13800138007',
      idCard: '350600199001017890',
      visitAssetId: 'asset-001',
      visitReason: '面试',
      visitTime: '2026-01-16 10:00:00',
      leaveTime: '-',
      status: '待审核',
      approveBy: '-',
      approveTime: '-',
      createTime: '2026-01-16 09:30:00',
      remark: '-',
      plateNumber: '闽E·G6789',
      visitObject: '人力资源部',
      expectedStayTime: '1小时',
    },
    {
      visitorId: '8',
      visitorName: '郑十',
      phone: '13800138008',
      idCard: '350600199001018901',
      visitAssetId: 'asset-002',
      visitReason: '合作洽谈',
      visitTime: '2026-01-17 15:30:00',
      leaveTime: '-',
      status: '已通过',
      approveBy: 'admin-001',
      approveTime: '2026-01-17 15:00:00',
      createTime: '2026-01-17 14:30:00',
      remark: '战略合作伙伴',
      plateNumber: '闽E·H1234',
      visitObject: '总经理',
      expectedStayTime: '2小时',
    },
    {
      visitorId: '9',
      visitorName: '钱一',
      phone: '13800138009',
      idCard: '350600199001019012',
      visitAssetId: 'asset-003',
      visitReason: '设备安装',
      visitTime: '2026-01-18 08:30:00',
      leaveTime: '2026-01-18 12:30:00',
      status: '已结束',
      approveBy: 'admin-002',
      approveTime: '2026-01-18 08:00:00',
      createTime: '2026-01-18 07:30:00',
      remark: '设备维护',
      plateNumber: '闽E·I5678',
      visitObject: '技术部',
      expectedStayTime: '4小时',
    },
    {
      visitorId: '10',
      visitorName: '孙二',
      phone: '13800138010',
      idCard: '350600199001010123',
      visitAssetId: 'asset-001',
      visitReason: '参观学习',
      visitTime: '2026-01-19 14:00:00',
      leaveTime: '-',
      status: '已通过',
      approveBy: 'admin-001',
      approveTime: '2026-01-19 13:30:00',
      createTime: '2026-01-19 13:00:00',
      remark: '高校参观团',
      plateNumber: '闽E·J9012',
      visitObject: '市场部',
      expectedStayTime: '2小时',
    },
    {
      visitorId: '11',
      visitorName: '周三',
      phone: '13800138011',
      idCard: '350600199001011234',
      visitAssetId: 'asset-002',
      visitReason: '维修服务',
      visitTime: '2026-01-20 09:00:00',
      leaveTime: '2026-01-20 11:00:00',
      status: '已结束',
      approveBy: 'admin-002',
      approveTime: '2026-01-20 08:30:00',
      createTime: '2026-01-20 08:00:00',
      remark: '空调维修',
      plateNumber: '闽E·K3456',
      visitObject: '行政部',
      expectedStayTime: '2小时',
    },
    {
      visitorId: '12',
      visitorName: '吴四',
      phone: '13800138012',
      idCard: '350600199001012345',
      visitAssetId: 'asset-003',
      visitReason: '审计',
      visitTime: '2026-01-21 10:00:00',
      leaveTime: '-',
      status: '待审核',
      approveBy: '-',
      approveTime: '-',
      createTime: '2026-01-21 09:30:00',
      remark: '-',
      plateNumber: '闽E·L7890',
      visitObject: '财务部',
      expectedStayTime: '3小时',
    },
    {
      visitorId: '13',
      visitorName: '郑五',
      phone: '13800138013',
      idCard: '350600199001013456',
      visitAssetId: 'asset-001',
      visitReason: '培训',
      visitTime: '2026-01-22 14:00:00',
      leaveTime: '-',
      status: '已通过',
      approveBy: 'admin-001',
      approveTime: '2026-01-22 13:30:00',
      createTime: '2026-01-22 13:00:00',
      remark: '员工培训',
      plateNumber: '闽E·M2345',
      visitObject: '培训部',
      expectedStayTime: '4小时',
    },
    {
      visitorId: '14',
      visitorName: '王六',
      phone: '13800138014',
      idCard: '350600199001014567',
      visitAssetId: 'asset-002',
      visitReason: '商务访问',
      visitTime: '2026-01-23 15:00:00',
      leaveTime: '-',
      status: '已拒绝',
      approveBy: 'admin-002',
      approveTime: '2026-01-23 14:30:00',
      createTime: '2026-01-23 14:00:00',
      remark: '未提前预约',
      plateNumber: '闽E·N6789',
      visitObject: '销售部',
      expectedStayTime: '2小时',
    },
    {
      visitorId: '15',
      visitorName: '赵七',
      phone: '13800138015',
      idCard: '350600199001015678',
      visitAssetId: 'asset-003',
      visitReason: '项目验收',
      visitTime: '2026-01-24 09:30:00',
      leaveTime: '2026-01-24 11:30:00',
      status: '已结束',
      approveBy: 'admin-001',
      approveTime: '2026-01-24 09:00:00',
      createTime: '2026-01-24 08:30:00',
      remark: '项目完成',
      plateNumber: '闽E·O1234',
      visitObject: '项目经理',
      expectedStayTime: '2小时',
    },
    {
      visitorId: '16',
      visitorName: '孙八',
      phone: '13800138016',
      idCard: '350600199001016789',
      visitAssetId: 'asset-001',
      visitReason: '面试',
      visitTime: '2026-01-25 10:30:00',
      leaveTime: '-',
      status: '待审核',
      approveBy: '-',
      approveTime: '-',
      createTime: '2026-01-25 10:00:00',
      remark: '-',
      plateNumber: '闽E·P5678',
      visitObject: '人力资源部',
      expectedStayTime: '1小时',
    },
    {
      visitorId: '17',
      visitorName: '周九',
      phone: '13800138017',
      idCard: '350600199001017890',
      visitAssetId: 'asset-002',
      visitReason: '技术支持',
      visitTime: '2026-01-26 14:30:00',
      leaveTime: '-',
      status: '已通过',
      approveBy: 'admin-002',
      approveTime: '2026-01-26 14:00:00',
      createTime: '2026-01-26 13:30:00',
      remark: '系统升级',
      plateNumber: '闽E·Q9012',
      visitObject: '技术部',
      expectedStayTime: '3小时',
    },
    {
      visitorId: '18',
      visitorName: '吴十',
      phone: '13800138018',
      idCard: '350600199001018901',
      visitAssetId: 'asset-003',
      visitReason: '会议',
      visitTime: '2026-01-27 15:30:00',
      leaveTime: '2026-01-27 17:30:00',
      status: '已结束',
      approveBy: 'admin-001',
      approveTime: '2026-01-27 15:00:00',
      createTime: '2026-01-27 14:30:00',
      remark: '季度会议',
      plateNumber: '闽E·R3456',
      visitObject: '管理层',
      expectedStayTime: '2小时',
    },
    {
      visitorId: '19',
      visitorName: '郑一',
      phone: '13800138019',
      idCard: '350600199001019012',
      visitAssetId: 'asset-001',
      visitReason: '产品调研',
      visitTime: '2026-01-28 10:30:00',
      leaveTime: '-',
      status: '待审核',
      approveBy: '-',
      approveTime: '-',
      createTime: '2026-01-28 10:00:00',
      remark: '-',
      plateNumber: '闽E·S7890',
      visitObject: '产品部',
      expectedStayTime: '2小时',
    },
    {
      visitorId: '20',
      visitorName: '钱二',
      phone: '13800138020',
      idCard: '350600199001010123',
      visitAssetId: 'asset-002',
      visitReason: '维修服务',
      visitTime: '2026-01-29 08:30:00',
      leaveTime: '2026-01-29 12:30:00',
      status: '已结束',
      approveBy: 'admin-002',
      approveTime: '2026-01-29 08:00:00',
      createTime: '2026-01-29 07:30:00',
      remark: '网络维修',
      plateNumber: '闽E·T2345',
      visitObject: 'IT部',
      expectedStayTime: '4小时',
    },
  ];
};

/** 车辆信息静态数据 */
export const carInfoData = [
  // 访客1: 张三
  {
    car_id: 'car-visitor-001',
    car_number: '闽E·A1234',
    car_type: '小型轿车',
    visitor_id: '1',
    brand: '奔驰',
    color: '黑色',
    bind_status: '已绑定',
    create_time: '2026-01-10 09:15:00',
    update_time: '2026-01-10 09:15:00',
    remark: '访客车辆',
  },
  // 访客2: 李四
  {
    car_id: 'car-visitor-002',
    car_number: '闽E·B5678',
    car_type: 'SUV',
    visitor_id: '2',
    brand: '宝马',
    color: '白色',
    bind_status: '已绑定',
    create_time: '2026-01-11 13:20:00',
    update_time: '2026-01-11 13:20:00',
    remark: '访客车辆',
  },
  // 访客3: 王五
  {
    car_id: 'car-visitor-003',
    car_number: '闽E·C9012',
    car_type: '小型轿车',
    visitor_id: '3',
    brand: '奥迪',
    color: '银色',
    bind_status: '已绑定',
    create_time: '2026-01-12 09:15:00',
    update_time: '2026-01-12 09:15:00',
    remark: '访客车辆',
  },
  // 访客4: 赵六
  {
    car_id: 'car-visitor-004',
    car_number: '闽E·D3456',
    car_type: '新能源汽车',
    visitor_id: '4',
    brand: '特斯拉',
    color: '红色',
    bind_status: '已绑定',
    create_time: '2026-01-13 14:30:00',
    update_time: '2026-01-13 14:30:00',
    remark: '访客车辆',
  },
  // 访客5: 孙七
  {
    car_id: 'car-visitor-005',
    car_number: '闽E·E7890',
    car_type: '小型轿车',
    visitor_id: '5',
    brand: '大众',
    color: '蓝色',
    bind_status: '已绑定',
    create_time: '2026-01-14 08:15:00',
    update_time: '2026-01-14 08:15:00',
    remark: '访客车辆',
  },
  // 访客6: 周八
  {
    car_id: 'car-visitor-006',
    car_number: '闽E·F2345',
    car_type: 'SUV',
    visitor_id: '6',
    brand: '丰田',
    color: '灰色',
    bind_status: '已绑定',
    create_time: '2026-01-15 13:30:00',
    update_time: '2026-01-15 13:30:00',
    remark: '访客车辆',
  },
  // 访客7: 吴九
  {
    car_id: 'car-visitor-007',
    car_number: '闽E·G6789',
    car_type: '小型轿车',
    visitor_id: '7',
    brand: '本田',
    color: '白色',
    bind_status: '已绑定',
    create_time: '2026-01-16 09:30:00',
    update_time: '2026-01-16 09:30:00',
    remark: '访客车辆',
  },
  // 访客8: 郑十
  {
    car_id: 'car-visitor-008',
    car_number: '闽E·H1234',
    car_type: '中型轿车',
    visitor_id: '8',
    brand: '别克',
    color: '黑色',
    bind_status: '已绑定',
    create_time: '2026-01-17 14:30:00',
    update_time: '2026-01-17 14:30:00',
    remark: '访客车辆',
  },
  // 访客9: 钱一
  {
    car_id: 'car-visitor-009',
    car_number: '闽E·I5678',
    car_type: '小型轿车',
    visitor_id: '9',
    brand: '福特',
    color: '红色',
    bind_status: '已绑定',
    create_time: '2026-01-18 07:30:00',
    update_time: '2026-01-18 07:30:00',
    remark: '访客车辆',
  },
  // 访客10: 孙二
  {
    car_id: 'car-visitor-010',
    car_number: '闽E·J9012',
    car_type: 'SUV',
    visitor_id: '10',
    brand: '现代',
    color: '银色',
    bind_status: '已绑定',
    create_time: '2026-01-19 13:00:00',
    update_time: '2026-01-19 13:00:00',
    remark: '访客车辆',
  },
  // 访客11: 周三
  {
    car_id: 'car-visitor-011',
    car_number: '闽E·K3456',
    car_type: '小型轿车',
    visitor_id: '11',
    brand: '雪佛兰',
    color: '白色',
    bind_status: '已绑定',
    create_time: '2026-01-20 08:00:00',
    update_time: '2026-01-20 08:00:00',
    remark: '访客车辆',
  },
  // 访客12: 吴四
  {
    car_id: 'car-visitor-012',
    car_number: '闽E·L7890',
    car_type: '新能源汽车',
    visitor_id: '12',
    brand: '比亚迪',
    color: '蓝色',
    bind_status: '已绑定',
    create_time: '2026-01-21 09:30:00',
    update_time: '2026-01-21 09:30:00',
    remark: '访客车辆',
  },
  // 访客13: 郑五
  {
    car_id: 'car-visitor-013',
    car_number: '闽E·M2345',
    car_type: '中型轿车',
    visitor_id: '13',
    brand: '大众',
    color: '黑色',
    bind_status: '已绑定',
    create_time: '2026-01-22 13:00:00',
    update_time: '2026-01-22 13:00:00',
    remark: '访客车辆',
  },
  // 访客14: 王六
  {
    car_id: 'car-visitor-014',
    car_number: '闽E·N6789',
    car_type: 'SUV',
    visitor_id: '14',
    brand: '马自达',
    color: '灰色',
    bind_status: '已绑定',
    create_time: '2026-01-23 14:00:00',
    update_time: '2026-01-23 14:00:00',
    remark: '访客车辆',
  },
  // 访客15: 赵七
  {
    car_id: 'car-visitor-015',
    car_number: '闽E·O1234',
    car_type: '小型轿车',
    visitor_id: '15',
    brand: '蔚来',
    color: '灰色',
    bind_status: '已绑定',
    create_time: '2026-01-24 08:30:00',
    update_time: '2026-01-24 08:30:00',
    remark: '访客车辆',
  },
  // 访客16: 孙八
  {
    car_id: 'car-visitor-016',
    car_number: '闽E·P5678',
    car_type: '小型轿车',
    visitor_id: '16',
    brand: '福特',
    color: '红色',
    bind_status: '已绑定',
    create_time: '2026-01-25 10:00:00',
    update_time: '2026-01-25 10:00:00',
    remark: '访客车辆',
  },
  // 访客17: 周九
  {
    car_id: 'car-visitor-017',
    car_number: '闽E·Q9012',
    car_type: 'SUV',
    visitor_id: '17',
    brand: '现代',
    color: '银色',
    bind_status: '已绑定',
    create_time: '2026-01-26 13:30:00',
    update_time: '2026-01-26 13:30:00',
    remark: '访客车辆',
  },
  // 访客18: 吴十
  {
    car_id: 'car-visitor-018',
    car_number: '闽E·R3456',
    car_type: '中型轿车',
    visitor_id: '18',
    brand: '别克',
    color: '黑色',
    bind_status: '已绑定',
    create_time: '2026-01-27 14:30:00',
    update_time: '2026-01-27 14:30:00',
    remark: '访客车辆',
  },
  // 访客19: 郑一
  {
    car_id: 'car-visitor-019',
    car_number: '闽E·S7890',
    car_type: '新能源汽车',
    visitor_id: '19',
    brand: '比亚迪',
    color: '蓝色',
    bind_status: '已绑定',
    create_time: '2026-01-28 10:00:00',
    update_time: '2026-01-28 10:00:00',
    remark: '访客车辆',
  },
  // 访客20: 钱二
  {
    car_id: 'car-visitor-020',
    car_number: '闽E·T2345',
    car_type: '小型轿车',
    visitor_id: '20',
    brand: '雪佛兰',
    color: '白色',
    bind_status: '已绑定',
    create_time: '2026-01-29 07:30:00',
    update_time: '2026-01-29 07:30:00',
    remark: '访客车辆',
  },
];

/** 车辆详情字段配置 */
export const carDetailFields = [
  { key: 'car_number', label: '车牌号码' },
  { key: 'car_type', label: '车辆类型' },
  { key: 'brand', label: '车辆品牌' },
  { key: 'color', label: '车辆颜色' },
  { key: 'bind_status', label: '绑定状态' },
  { key: 'create_time', label: '创建时间' },
  { key: 'update_time', label: '更新时间' },
  { key: 'remark', label: '备注' },
];

/** 资产信息静态数据 */
export const assetList = [
  // 资产1: asset-001
  {
    asset_extend_id: 'asset-001',
    asset_type: '车场',
    name: '一号停车场',
    code: 'PARK-001',
    status: '正常',
    region_code: 'REGION-001',
    address: '福建省厦门市思明区湖滨南路1号',
    longitude: 118.089_42,
    latitude: 24.479_83,
    create_time: '2026-01-01 09:00:00',
    update_time: '2026-01-01 09:00:00',
    remark: '主停车场',
  },
  // 资产2: asset-002
  {
    asset_extend_id: 'asset-002',
    asset_type: '车库',
    name: '二号车库',
    code: 'GARAGE-002',
    status: '正常',
    region_code: 'REGION-002',
    address: '福建省厦门市湖里区湖里大道2号',
    longitude: 118.075_97,
    latitude: 24.470_42,
    create_time: '2026-01-02 10:00:00',
    update_time: '2026-01-02 10:00:00',
    remark: '地下车库',
  },
  // 资产3: asset-003
  {
    asset_extend_id: 'asset-003',
    asset_type: '路侧泊位',
    name: '三号路侧泊位',
    code: 'ROAD-003',
    status: '正常',
    region_code: 'REGION-003',
    address: '福建省厦门市集美区集美大道3号',
    longitude: 118.092_13,
    latitude: 24.502_48,
    create_time: '2026-01-03 11:00:00',
    update_time: '2026-01-03 11:00:00',
    remark: '路边停车位',
  },
];

/** 资产详情字段配置 */
export const assetDetailFields = [
  { key: 'asset_extend_id', label: '资产ID' },
  { key: 'asset_type', label: '资产类型' },
  { key: 'name', label: '资产名称' },
  { key: 'code', label: '资产编码' },
  { key: 'status', label: '状态' },
  { key: 'region_code', label: '所属区域编码' },
  { key: 'address', label: '详细地址' },
  { key: 'longitude', label: '经度' },
  { key: 'latitude', label: '纬度' },
  { key: 'create_time', label: '创建时间' },
  { key: 'update_time', label: '更新时间' },
  { key: 'remark', label: '备注' },
];

/** 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'visitorName',
      label: '访客姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入访客姓名',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '手机号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入手机号',
      },
      rules: 'required',
    },
    {
      fieldName: 'idCard',
      label: '身份证号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入身份证号',
      },
      rules: 'required',
    },
    {
      fieldName: 'plateNumber',
      label: '车牌号码',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: 'asset-001', value: 'asset-001' },
          { label: 'asset-002', value: 'asset-002' },
          { label: 'asset-003', value: 'asset-003' },
        ],
        placeholder: '请选择访问资源',
        showSearch: true,
      },
      fieldName: 'visitAssetId',
      label: '访问资源',
      rules: 'required',
    },
    {
      fieldName: 'visitReason',
      label: '访问事由',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入访问事由',
      },
      rules: 'required',
    },
    {
      fieldName: 'visitObject',
      label: '拜访对象',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入拜访对象',
      },
      rules: 'required',
    },
    {
      fieldName: 'expectedStayTime',
      label: '预计停留时长',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入预计停留时长',
      },
      rules: 'required',
    },
    {
      fieldName: 'visitTime',
      label: '访问时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        type: 'datetime',
        placeholder: '请选择访问时间',
      },
      rules: 'required',
    },
    {
      fieldName: 'leaveTime',
      label: '离开时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        type: 'datetime',
        placeholder: '请选择离开时间',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '待审核', value: '待审核' },
          { label: '已通过', value: '已通过' },
          { label: '已拒绝', value: '已拒绝' },
          { label: '已结束', value: '已结束' },
        ],
        placeholder: '请选择状态',
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'visitorId',
      title: '访客ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'visitorName',
      title: '访客姓名',
      minWidth: 120,
      sortable: true,
      slots: { default: 'visitorName' },
    },
    {
      field: 'phone',
      title: '手机号',
      minWidth: 150,
      sortable: true,
      formatter: ({ cellValue }) => {
        return maskPhone(cellValue);
      },
    },
    {
      field: 'idCard',
      title: '身份证号',
      minWidth: 200,
      sortable: true,
      formatter: ({ cellValue }) => {
        return maskIdCard(cellValue);
      },
    },
    {
      field: 'plateNumber',
      title: '车牌号码',
      minWidth: 120,
      sortable: true,
      slots: {
        default: 'plateNumber',
      },
    },
    {
      field: 'visitAssetId',
      title: '访问资源',
      minWidth: 120,
      sortable: true,
      slots: {
        default: 'visitAssetId',
      },
    },
    {
      field: 'visitReason',
      title: '访问事由',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'visitObject',
      title: '拜访对象',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'visitTime',
      title: '访问时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'leaveTime',
      title: '离开时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'expectedStayTime',
      title: '预计停留时长',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'approveBy',
      title: '审核人',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'approveTime',
      title: '审核时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 文字描述对象 */
export const textObj = {
  editText: '编辑访客',
  addText: '新增访客',
  excelName: '访客列表',
  excelAllName: '访客数据.xlsx',
  total: '访客数量20;已通过8;待审核6;已拒绝2;已结束4',
};

// 获取访客统计数据
export const getStatsDataByUserType = () => {
  // 获取访客数据
  const visitorData = dataList();

  // 统计总访客数
  const totalCount = visitorData.length;
  // 统计待审核访客数
  const pendingCount = visitorData.filter(
    (item) => item.status === '待审核',
  ).length;
  // 统计已通过访客数
  const approvedCount = visitorData.filter(
    (item) => item.status === '已通过',
  ).length;

  // 统计访问事由占比
  const reasonStats = {};
  visitorData.forEach((item) => {
    reasonStats[item.visitReason] = (reasonStats[item.visitReason] || 0) + 1;
  });

  // 统计访问资源类型占比
  const assetStats = {};
  visitorData.forEach((item) => {
    assetStats[item.visitAssetId] = (assetStats[item.visitAssetId] || 0) + 1;
  });

  // 统计近7日访客数量趋势
  const last7Days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last7Days.push(dateStr);
  }

  const dailyStats = {};
  last7Days.forEach((date) => {
    dailyStats[date] = 0;
  });

  visitorData.forEach((item) => {
    const visitDate = item.createTime.split(' ')[0];
    if (last7Days.includes(visitDate)) {
      dailyStats[visitDate]++;
    }
  });

  return {
    cards: [
      {
        title: '总访客数',
        value: totalCount,
        desc: `较上月增长${Math.floor(Math.random() * 10) + 5}%`,
        color: '#13ce66',
      },
      {
        title: '待审核访客数',
        value: pendingCount,
        desc: `占比${Math.round((pendingCount / totalCount) * 100)}%`,
        color: '#4ECDC4',
      },
      {
        title: '已通过访客数',
        value: approvedCount,
        desc: `占比${Math.round((approvedCount / totalCount) * 100)}%`,
        color: '#FF6B6B',
      },
    ],
    charts: [
      {
        title: '访问事由占比',
        type: 'pie',
        data: Object.entries(reasonStats).map(([name, value]) => ({
          value: Math.round((value / totalCount) * 100),
          name,
        })),
      },
      {
        title: '访问资源类型占比',
        type: 'pie',
        data: Object.entries(assetStats).map(([name, value]) => ({
          value: Math.round((value / totalCount) * 100),
          name,
        })),
      },
      {
        title: '近7日访客数量趋势',
        type: 'bar',
        xAxis: last7Days,
        series: last7Days.map((date) => dailyStats[date]),
      },
    ],
  };
};
