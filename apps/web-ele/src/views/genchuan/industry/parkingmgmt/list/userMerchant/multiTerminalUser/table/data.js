/** 表格初始数据*/

import { maskIdCard, maskPhone } from '#/utils/dataMask';

// 个人用户数据列表
export const personalUserList = () => {
  return [
    {
      user_id: '1',
      user_name: '张三',
      user_phone: '13800138001',
      id_card: '110101199001011234',
      gender: '男',
      car_ids: ['car001', 'car002'],
      car_numbers: ['京A12345', '京B67890'],
      cert_status: '已认证',
      wallet_id: 'wallet001',
      balance: 1000.5,
      account_status: '正常',
      register_time: '2024-01-01 10:00:00',
      last_login_time: '2024-01-10 09:15:00',
      contact_address: '北京市朝阳区某某街道123号',
      signature: '人生如戏，全靠演技',
      create_time: '2024-01-01 10:00:00',
      update_time: '2024-01-02 14:30:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '2',
      user_name: '李四',
      user_phone: '13800138002',
      id_card: '110101199001012345',
      gender: '女',
      car_ids: ['car003'],
      car_numbers: ['京C34567'],
      cert_status: '待审核',
      wallet_id: 'wallet002',
      balance: 500.25,
      account_status: '正常',
      register_time: '2024-01-02 11:30:00',
      last_login_time: '2024-01-09 16:20:00',
      contact_address: '北京市海淀区某某街道456号',
      signature: '生活不止眼前的苟且，还有诗和远方',
      create_time: '2024-01-02 11:30:00',
      update_time: '2024-01-03 09:45:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '3',
      user_name: '王五',
      user_phone: '13800138003',
      id_card: '110101199001013456',
      gender: '男',
      car_ids: [],
      car_numbers: [],
      cert_status: '未认证',
      wallet_id: null,
      balance: 0,
      account_status: '禁用',
      register_time: '2024-01-03 14:20:00',
      last_login_time: '2024-01-08 14:30:00',
      contact_address: '北京市丰台区某某街道789号',
      signature: '简单生活，快乐工作',
      create_time: '2024-01-03 14:20:00',
      update_time: '2024-01-04 10:15:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '4',
      user_name: '赵六',
      user_phone: '13800138004',
      id_card: '110101199001014567',
      gender: '男',
      car_ids: ['car004'],
      car_numbers: ['京D78901'],
      cert_status: '认证失败',
      wallet_id: 'wallet003',
      balance: 2000,
      account_status: '冻结',
      register_time: '2024-01-04 09:15:00',
      last_login_time: '2024-01-07 11:45:00',
      contact_address: '北京市东城区某某街道321号',
      signature: '爱生活，爱自己',
      create_time: '2024-01-04 09:15:00',
      update_time: '2024-01-05 15:20:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '5',
      user_name: '孙七',
      user_phone: '13800138005',
      id_card: '110101199001015678',
      gender: '女',
      car_ids: ['car005', 'car006'],
      car_numbers: ['京E23456', '京F78901'],
      cert_status: '已认证',
      wallet_id: 'wallet004',
      balance: 1500.75,
      account_status: '正常',
      register_time: '2024-01-05 16:45:00',
      last_login_time: '2024-01-10 10:30:00',
      contact_address: '北京市西城区某某街道654号',
      signature: '快乐每一天',
      create_time: '2024-01-05 16:45:00',
      update_time: '2024-01-06 13:10:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '6',
      user_name: '周八',
      user_phone: '13800138006',
      id_card: '110101199001016789',
      gender: '男',
      car_ids: ['car007'],
      car_numbers: ['京G34567'],
      cert_status: '待审核',
      wallet_id: 'wallet005',
      balance: 800,
      account_status: '正常',
      register_time: '2024-01-06 10:30:00',
      last_login_time: '2024-01-09 14:50:00',
      contact_address: '北京市石景山区某某街道987号',
      signature: '努力工作，享受生活',
      create_time: '2024-01-06 10:30:00',
      update_time: '2024-01-07 14:50:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '7',
      user_name: '吴九',
      user_phone: '13800138007',
      id_card: '110101199001017890',
      gender: '男',
      car_ids: [],
      car_numbers: [],
      cert_status: '未认证',
      wallet_id: null,
      balance: 0,
      account_status: '正常',
      register_time: '2024-01-07 14:20:00',
      last_login_time: '2024-01-08 09:15:00',
      contact_address: '北京市房山区某某街道234号',
      signature: '宁静致远',
      create_time: '2024-01-07 14:20:00',
      update_time: '2024-01-08 09:15:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '8',
      user_name: '郑十',
      user_phone: '13800138008',
      id_card: '110101199001018901',
      gender: '女',
      car_ids: ['car008', 'car009'],
      car_numbers: ['京H45678', '京I89012'],
      cert_status: '已认证',
      wallet_id: 'wallet006',
      balance: 3000.25,
      account_status: '正常',
      register_time: '2024-01-08 09:45:00',
      last_login_time: '2024-01-10 11:45:00',
      contact_address: '北京市通州区某某街道567号',
      signature: '追求卓越',
      create_time: '2024-01-08 09:45:00',
      update_time: '2024-01-09 15:20:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '9',
      user_name: '冯十一',
      user_phone: '13800138009',
      id_card: '110101199001019012',
      gender: '男',
      car_ids: ['car010'],
      car_numbers: ['京J56789'],
      cert_status: '认证失败',
      wallet_id: 'wallet007',
      balance: 1200,
      account_status: '正常',
      register_time: '2024-01-09 13:10:00',
      last_login_time: '2024-01-10 14:50:00',
      contact_address: '北京市顺义区某某街道876号',
      signature: '诚信为本',
      create_time: '2024-01-09 13:10:00',
      update_time: '2024-01-10 10:30:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '10',
      user_name: '陈十二',
      user_phone: '13800138010',
      id_card: '110101199001010123',
      gender: '女',
      car_ids: [],
      car_numbers: [],
      cert_status: '待审核',
      wallet_id: 'wallet008',
      balance: 600.5,
      account_status: '正常',
      register_time: '2024-01-10 11:20:00',
      last_login_time: '2024-01-10 15:20:00',
      contact_address: '北京市昌平区某某街道159号',
      signature: '热爱生活',
      create_time: '2024-01-10 11:20:00',
      update_time: '2024-01-11 09:15:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '11',
      user_name: '褚十三',
      user_phone: '13800138011',
      id_card: '110101199001011234',
      gender: '男',
      car_ids: ['car011'],
      car_numbers: ['京K67890'],
      cert_status: '已认证',
      wallet_id: 'wallet009',
      balance: 2500,
      account_status: '正常',
      register_time: '2024-01-11 15:45:00',
      last_login_time: '2024-01-10 09:30:00',
      contact_address: '北京市大兴区某某街道753号',
      signature: '学习使人进步',
      create_time: '2024-01-11 15:45:00',
      update_time: '2024-01-12 13:10:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '12',
      user_name: '卫十四',
      user_phone: '13800138012',
      id_card: '110101199001012345',
      gender: '女',
      car_ids: ['car012', 'car013'],
      car_numbers: ['京L78901', '京M23456'],
      cert_status: '待审核',
      wallet_id: 'wallet010',
      balance: 900.75,
      account_status: '正常',
      register_time: '2024-01-12 10:30:00',
      last_login_time: '2024-01-10 10:20:00',
      contact_address: '北京市平谷区某某街道951号',
      signature: '快乐生活',
      create_time: '2024-01-12 10:30:00',
      update_time: '2024-01-13 14:50:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '13',
      user_name: '蒋十五',
      user_phone: '13800138013',
      id_card: '110101199001013456',
      gender: '男',
      car_ids: ['car014'],
      car_numbers: ['京N89012'],
      cert_status: '已认证',
      wallet_id: 'wallet011',
      balance: 1800,
      account_status: '正常',
      register_time: '2024-01-13 14:20:00',
      last_login_time: '2024-01-10 11:45:00',
      contact_address: '北京市怀柔区某某街道357号',
      signature: '努力奋斗',
      create_time: '2024-01-13 14:20:00',
      update_time: '2024-01-14 09:15:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '14',
      user_name: '沈十六',
      user_phone: '13800138014',
      id_card: '110101199001014567',
      gender: '女',
      car_ids: [],
      car_numbers: [],
      cert_status: '未认证',
      wallet_id: null,
      balance: 0,
      account_status: '正常',
      register_time: '2024-01-14 09:45:00',
      last_login_time: '2024-01-09 14:30:00',
      contact_address: '北京市密云区某某街道852号',
      signature: '开心就好',
      create_time: '2024-01-14 09:45:00',
      update_time: '2024-01-15 15:20:00',
      remark: '测试用户',
      userType: '个人',
    },
    {
      user_id: '15',
      user_name: '韩十七',
      user_phone: '13800138015',
      id_card: '110101199001015678',
      gender: '男',
      car_ids: ['car015'],
      car_numbers: ['京O90123'],
      cert_status: '认证失败',
      wallet_id: 'wallet012',
      balance: 1300.5,
      account_status: '正常',
      register_time: '2024-01-15 13:10:00',
      last_login_time: '2024-01-10 14:50:00',
      contact_address: '北京市延庆区某某街道456号',
      signature: '人生苦短，及时行乐',
      create_time: '2024-01-15 13:10:00',
      update_time: '2024-01-16 10:30:00',
      remark: '测试用户',
      userType: '个人',
    },
  ];
};

// 企业用户数据列表
export const enterpriseUserList = () => {
  return [
    {
      enterprise_id: 'ent001',
      enterprise_name: '张三商贸有限公司',
      credit_code: '91110000MA000000000',
      contact_person: '张三',
      contact_phone: '13800138001',
      register_address: '北京市朝阳区某某街道123号',
      industry_code: 'IT',
      industry_name: '信息技术',
      admin_id: 'user001',
      admin_name: '张三管理员',
      cert_status: '已认证',
      account_status: '正常',
      dept_count: 5,
      staff_count: 100,
      register_time: '2024-01-01 10:00:00',
      proxy_id: 'proxy001',
      proxy_status: '启用',
      create_time: '2024-01-01 10:00:00',
      update_time: '2024-01-02 14:30:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent002',
      enterprise_name: '李四科技有限公司',
      credit_code: '91110000MA000000001',
      contact_person: '李四',
      contact_phone: '13800138002',
      register_address: '北京市海淀区某某街道456号',
      industry_code: '金融',
      industry_name: '金融业',
      admin_id: 'user002',
      admin_name: '李四管理员',
      cert_status: '待审核',
      account_status: '正常',
      dept_count: 3,
      staff_count: 50,
      register_time: '2024-01-02 11:30:00',
      proxy_id: 'proxy002',
      proxy_status: '禁用',
      create_time: '2024-01-02 11:30:00',
      update_time: '2024-01-03 09:45:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent003',
      enterprise_name: '王五贸易有限公司',
      credit_code: '91110000MA000000002',
      contact_person: '王五',
      contact_phone: '13800138003',
      register_address: '北京市丰台区某某街道789号',
      industry_code: '贸易',
      industry_name: '批发和零售业',
      admin_id: 'user003',
      admin_name: '王五管理员',
      cert_status: '未认证',
      account_status: '禁用',
      dept_count: 2,
      staff_count: 20,
      register_time: '2024-01-03 14:20:00',
      proxy_id: null,
      proxy_status: '未设置',
      create_time: '2024-01-03 14:20:00',
      update_time: '2024-01-04 10:15:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent004',
      enterprise_name: '赵六实业有限公司',
      credit_code: '91110000MA000000003',
      contact_person: '赵六',
      contact_phone: '13800138004',
      register_address: '北京市东城区某某街道321号',
      industry_code: '制造',
      industry_name: '制造业',
      admin_id: 'user004',
      admin_name: '赵六管理员',
      cert_status: '认证失败',
      account_status: '正常',
      dept_count: 8,
      staff_count: 200,
      register_time: '2024-01-04 09:15:00',
      proxy_id: 'proxy003',
      proxy_status: '启用',
      create_time: '2024-01-04 09:15:00',
      update_time: '2024-01-05 15:20:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent005',
      enterprise_name: '孙七教育科技有限公司',
      credit_code: '91110000MA000000004',
      contact_person: '孙七',
      contact_phone: '13800138005',
      register_address: '北京市西城区某某街道654号',
      industry_code: '教育',
      industry_name: '教育业',
      admin_id: 'user005',
      admin_name: '孙七管理员',
      cert_status: '已认证',
      account_status: '正常',
      dept_count: 4,
      staff_count: 80,
      register_time: '2024-01-05 16:45:00',
      proxy_id: 'proxy004',
      proxy_status: '启用',
      create_time: '2024-01-05 16:45:00',
      update_time: '2024-01-06 13:10:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent006',
      enterprise_name: '周八医疗健康有限公司',
      credit_code: '91110000MA000000005',
      contact_person: '周八',
      contact_phone: '13800138006',
      register_address: '北京市石景山区某某街道987号',
      industry_code: '医疗',
      industry_name: '卫生和社会工作',
      admin_id: 'user006',
      admin_name: '周八管理员',
      cert_status: '待审核',
      account_status: '正常',
      dept_count: 6,
      staff_count: 120,
      register_time: '2024-01-06 10:30:00',
      proxy_id: 'proxy005',
      proxy_status: '禁用',
      create_time: '2024-01-06 10:30:00',
      update_time: '2024-01-07 14:50:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent007',
      enterprise_name: '吴九文化传媒有限公司',
      credit_code: '91110000MA000000006',
      contact_person: '吴九',
      contact_phone: '13800138007',
      register_address: '北京市房山区某某街道234号',
      industry_code: '文化',
      industry_name: '文化、体育和娱乐业',
      admin_id: 'user007',
      admin_name: '吴九管理员',
      cert_status: '已认证',
      account_status: '正常',
      dept_count: 3,
      staff_count: 40,
      register_time: '2024-01-07 14:20:00',
      proxy_id: 'proxy006',
      proxy_status: '启用',
      create_time: '2024-01-07 14:20:00',
      update_time: '2024-01-08 09:15:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent008',
      enterprise_name: '郑十建筑工程有限公司',
      credit_code: '91110000MA000000007',
      contact_person: '郑十',
      contact_phone: '13800138008',
      register_address: '北京市通州区某某街道567号',
      industry_code: '建筑',
      industry_name: '建筑业',
      admin_id: 'user008',
      admin_name: '郑十管理员',
      cert_status: '未认证',
      account_status: '正常',
      dept_count: 7,
      staff_count: 150,
      register_time: '2024-01-08 09:45:00',
      proxy_id: null,
      proxy_status: '未设置',
      create_time: '2024-01-08 09:45:00',
      update_time: '2024-01-09 15:20:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent009',
      enterprise_name: '冯十一物流运输有限公司',
      credit_code: '91110000MA000000008',
      contact_person: '冯十一',
      contact_phone: '13800138009',
      register_address: '北京市顺义区某某街道876号',
      industry_code: '物流',
      industry_name: '交通运输、仓储和邮政业',
      admin_id: 'user009',
      admin_name: '冯十一管理员',
      cert_status: '认证失败',
      account_status: '正常',
      dept_count: 5,
      staff_count: 110,
      register_time: '2024-01-09 13:10:00',
      proxy_id: 'proxy007',
      proxy_status: '禁用',
      create_time: '2024-01-09 13:10:00',
      update_time: '2024-01-10 10:30:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent010',
      enterprise_name: '陈十二能源科技有限公司',
      credit_code: '91110000MA000000009',
      contact_person: '陈十二',
      contact_phone: '13800138010',
      register_address: '北京市昌平区某某街道159号',
      industry_code: '能源',
      industry_name: '电力、热力、燃气及水生产和供应业',
      admin_id: 'user010',
      admin_name: '陈十二管理员',
      cert_status: '已认证',
      account_status: '正常',
      dept_count: 6,
      staff_count: 90,
      register_time: '2024-01-10 11:20:00',
      proxy_id: 'proxy008',
      proxy_status: '启用',
      create_time: '2024-01-10 11:20:00',
      update_time: '2024-01-11 09:15:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent011',
      enterprise_name: '褚十三房地产开发有限公司',
      credit_code: '91110000MA000000010',
      contact_person: '褚十三',
      contact_phone: '13800138011',
      register_address: '北京市大兴区某某街道753号',
      industry_code: '房地产',
      industry_name: '房地产业',
      admin_id: 'user011',
      admin_name: '褚十三管理员',
      cert_status: '待审核',
      account_status: '正常',
      dept_count: 8,
      staff_count: 180,
      register_time: '2024-01-11 15:45:00',
      proxy_id: 'proxy009',
      proxy_status: '启用',
      create_time: '2024-01-11 15:45:00',
      update_time: '2024-01-12 13:10:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent012',
      enterprise_name: '卫十四旅游服务有限公司',
      credit_code: '91110000MA000000011',
      contact_person: '卫十四',
      contact_phone: '13800138012',
      register_address: '北京市平谷区某某街道951号',
      industry_code: '旅游',
      industry_name: '住宿和餐饮业',
      admin_id: 'user012',
      admin_name: '卫十四管理员',
      cert_status: '已认证',
      account_status: '正常',
      dept_count: 3,
      staff_count: 60,
      register_time: '2024-01-12 10:30:00',
      proxy_id: 'proxy010',
      proxy_status: '禁用',
      create_time: '2024-01-12 10:30:00',
      update_time: '2024-01-13 14:50:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent013',
      enterprise_name: '蒋十五农业发展有限公司',
      credit_code: '91110000MA000000012',
      contact_person: '蒋十五',
      contact_phone: '13800138013',
      register_address: '北京市怀柔区某某街道357号',
      industry_code: '农业',
      industry_name: '农、林、牧、渔业',
      admin_id: 'user013',
      admin_name: '蒋十五管理员',
      cert_status: '未认证',
      account_status: '正常',
      dept_count: 2,
      staff_count: 30,
      register_time: '2024-01-13 14:20:00',
      proxy_id: null,
      proxy_status: '未设置',
      create_time: '2024-01-13 14:20:00',
      update_time: '2024-01-14 09:15:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent014',
      enterprise_name: '沈十六环保科技有限公司',
      credit_code: '91110000MA000000013',
      contact_person: '沈十六',
      contact_phone: '13800138014',
      register_address: '北京市密云区某某街道852号',
      industry_code: '环保',
      industry_name: '科学研究和技术服务业',
      admin_id: 'user014',
      admin_name: '沈十六管理员',
      cert_status: '认证失败',
      account_status: '正常',
      dept_count: 4,
      staff_count: 70,
      register_time: '2024-01-14 09:45:00',
      proxy_id: 'proxy011',
      proxy_status: '启用',
      create_time: '2024-01-14 09:45:00',
      update_time: '2024-01-15 15:20:00',
      remark: '测试企业',
      userType: '企业',
    },
    {
      enterprise_id: 'ent015',
      enterprise_name: '韩十七汽车销售有限公司',
      credit_code: '91110000MA000000014',
      contact_person: '韩十七',
      contact_phone: '13800138015',
      register_address: '北京市延庆区某某街道456号',
      industry_code: '汽车',
      industry_name: '批发和零售业',
      admin_id: 'user015',
      admin_name: '韩十七管理员',
      cert_status: '已认证',
      account_status: '正常',
      dept_count: 5,
      staff_count: 100,
      register_time: '2024-01-15 13:10:00',
      proxy_id: 'proxy012',
      proxy_status: '禁用',
      create_time: '2024-01-15 13:10:00',
      update_time: '2024-01-16 10:30:00',
      remark: '测试企业',
      userType: '企业',
    },
  ];
};

// 政府用户数据列表
export const governmentUserList = () => {
  return [
    {
      gov_user_id: 'gov001',
      user_name: '孙七',
      dept_id: 'dept001',
      dept_name: '交通管理局',
      contact_phone: '13800138005',
      region_id: 'region001',
      region_name: '北京市',
      role_id: 'role001',
      role_name: '管理员',
      permission_scope: '全部',
      account_status: '正常',
      register_time: '2024-01-05 16:45:00',
      last_operate_time: '2024-01-06 09:30:00',
      operate_log: '处理了10条交通违章记录',
      online_status: '在线',
      create_time: '2024-01-05 16:45:00',
      update_time: '2024-01-06 13:10:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov002',
      user_name: '周八',
      dept_id: 'dept002',
      dept_name: '环境保护局',
      contact_phone: '13800138006',
      region_id: 'region002',
      region_name: '上海市',
      role_id: 'role002',
      role_name: '普通用户',
      permission_scope: '部分',
      account_status: '正常',
      register_time: '2024-01-06 10:30:00',
      last_operate_time: '2024-01-07 14:50:00',
      operate_log: '检查了5个企业的环保合规情况',
      online_status: '离线',
      create_time: '2024-01-06 10:30:00',
      update_time: '2024-01-07 14:50:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov003',
      user_name: '吴九',
      dept_id: 'dept003',
      dept_name: '市场监督管理局',
      contact_phone: '13800138007',
      region_id: 'region003',
      region_name: '广州市',
      role_id: 'role003',
      role_name: '审核员',
      permission_scope: '全部',
      account_status: '禁用',
      register_time: '2024-01-07 14:20:00',
      last_operate_time: '2024-01-08 09:15:00',
      operate_log: '审核了20份企业注册申请',
      online_status: '离线',
      create_time: '2024-01-07 14:20:00',
      update_time: '2024-01-08 09:15:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov004',
      user_name: '郑十',
      dept_id: 'dept001',
      dept_name: '交通管理局',
      contact_phone: '13800138008',
      region_id: 'region004',
      region_name: '深圳市',
      role_id: 'role002',
      role_name: '普通用户',
      permission_scope: '部分',
      account_status: '正常',
      register_time: '2024-01-08 09:45:00',
      last_operate_time: '2024-01-09 15:20:00',
      operate_log: '更新了交通设施维护记录',
      online_status: '在线',
      create_time: '2024-01-08 09:45:00',
      update_time: '2024-01-09 15:20:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov005',
      user_name: '冯十一',
      dept_id: 'dept002',
      dept_name: '环境保护局',
      contact_phone: '13800138009',
      region_id: 'region005',
      region_name: '成都市',
      role_id: 'role001',
      role_name: '管理员',
      permission_scope: '全部',
      account_status: '正常',
      register_time: '2024-01-09 13:10:00',
      last_operate_time: '2024-01-10 10:30:00',
      operate_log: '审核了15份环保审批文件',
      online_status: '在线',
      create_time: '2024-01-09 13:10:00',
      update_time: '2024-01-10 10:30:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov006',
      user_name: '陈十二',
      dept_id: 'dept003',
      dept_name: '市场监督管理局',
      contact_phone: '13800138010',
      region_id: 'region006',
      region_name: '杭州市',
      role_id: 'role003',
      role_name: '审核员',
      permission_scope: '全部',
      account_status: '正常',
      register_time: '2024-01-10 11:20:00',
      last_operate_time: '2024-01-11 09:15:00',
      operate_log: '检查了30家企业的经营许可证',
      online_status: '离线',
      create_time: '2024-01-10 11:20:00',
      update_time: '2024-01-11 09:15:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov007',
      user_name: '褚十三',
      dept_id: 'dept001',
      dept_name: '交通管理局',
      contact_phone: '13800138011',
      region_id: 'region007',
      region_name: '武汉市',
      role_id: 'role002',
      role_name: '普通用户',
      permission_scope: '部分',
      account_status: '正常',
      register_time: '2024-01-11 15:45:00',
      last_operate_time: '2024-01-12 13:10:00',
      operate_log: '处理了25条交通事故记录',
      online_status: '在线',
      create_time: '2024-01-11 15:45:00',
      update_time: '2024-01-12 13:10:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov008',
      user_name: '卫十四',
      dept_id: 'dept002',
      dept_name: '环境保护局',
      contact_phone: '13800138012',
      region_id: 'region008',
      region_name: '重庆市',
      role_id: 'role002',
      role_name: '普通用户',
      permission_scope: '部分',
      account_status: '正常',
      register_time: '2024-01-12 10:30:00',
      last_operate_time: '2024-01-13 14:50:00',
      operate_log: '监测了10个空气质量站点的数据',
      online_status: '离线',
      create_time: '2024-01-12 10:30:00',
      update_time: '2024-01-13 14:50:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov009',
      user_name: '蒋十五',
      dept_id: 'dept003',
      dept_name: '市场监督管理局',
      contact_phone: '13800138013',
      region_id: 'region009',
      region_name: '南京市',
      role_id: 'role001',
      role_name: '管理员',
      permission_scope: '全部',
      account_status: '正常',
      register_time: '2024-01-13 14:20:00',
      last_operate_time: '2024-01-14 09:15:00',
      operate_log: '审批了20家新企业的注册申请',
      online_status: '在线',
      create_time: '2024-01-13 14:20:00',
      update_time: '2024-01-14 09:15:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov010',
      user_name: '沈十六',
      dept_id: 'dept001',
      dept_name: '交通管理局',
      contact_phone: '13800138014',
      region_id: 'region010',
      region_name: '天津市',
      role_id: 'role003',
      role_name: '审核员',
      permission_scope: '全部',
      account_status: '正常',
      register_time: '2024-01-14 09:45:00',
      last_operate_time: '2024-01-15 15:20:00',
      operate_log: '审核了15份车辆年检报告',
      online_status: '离线',
      create_time: '2024-01-14 09:45:00',
      update_time: '2024-01-15 15:20:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov011',
      user_name: '韩十七',
      dept_id: 'dept002',
      dept_name: '环境保护局',
      contact_phone: '13800138015',
      region_id: 'region011',
      region_name: '苏州市',
      role_id: 'role002',
      role_name: '普通用户',
      permission_scope: '部分',
      account_status: '正常',
      register_time: '2024-01-15 13:10:00',
      last_operate_time: '2024-01-16 10:30:00',
      operate_log: '处理了5个环境污染投诉',
      online_status: '在线',
      create_time: '2024-01-15 13:10:00',
      update_time: '2024-01-16 10:30:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov012',
      user_name: '杨十八',
      dept_id: 'dept003',
      dept_name: '市场监督管理局',
      contact_phone: '13800138016',
      region_id: 'region012',
      region_name: '西安市',
      role_id: 'role002',
      role_name: '普通用户',
      permission_scope: '部分',
      account_status: '禁用',
      register_time: '2024-01-16 09:15:00',
      last_operate_time: '2024-01-17 14:50:00',
      operate_log: '检查了10家食品企业的卫生情况',
      online_status: '离线',
      create_time: '2024-01-16 09:15:00',
      update_time: '2024-01-17 14:50:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov013',
      user_name: '朱十九',
      dept_id: 'dept001',
      dept_name: '交通管理局',
      contact_phone: '13800138017',
      region_id: 'region013',
      region_name: '长沙市',
      role_id: 'role001',
      role_name: '管理员',
      permission_scope: '全部',
      account_status: '正常',
      register_time: '2024-01-17 14:20:00',
      last_operate_time: '2024-01-18 09:15:00',
      operate_log: '更新了交通管制措施',
      online_status: '在线',
      create_time: '2024-01-17 14:20:00',
      update_time: '2024-01-18 09:15:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov014',
      user_name: '秦二十',
      dept_id: 'dept002',
      dept_name: '环境保护局',
      contact_phone: '13800138018',
      region_id: 'region014',
      region_name: '郑州市',
      role_id: 'role003',
      role_name: '审核员',
      permission_scope: '全部',
      account_status: '正常',
      register_time: '2024-01-18 09:45:00',
      last_operate_time: '2024-01-19 15:20:00',
      operate_log: '审批了8个建设项目的环境影响评价',
      online_status: '离线',
      create_time: '2024-01-18 09:45:00',
      update_time: '2024-01-19 15:20:00',
      remark: '测试政府用户',
      userType: '政府',
    },
    {
      gov_user_id: 'gov015',
      user_name: '尤二十一',
      dept_id: 'dept003',
      dept_name: '市场监督管理局',
      contact_phone: '13800138019',
      region_id: 'region015',
      region_name: '青岛市',
      role_id: 'role002',
      role_name: '普通用户',
      permission_scope: '部分',
      account_status: '正常',
      register_time: '2024-01-19 13:10:00',
      last_operate_time: '2024-01-20 10:30:00',
      operate_log: '处理了12个消费者投诉',
      online_status: '在线',
      create_time: '2024-01-19 13:10:00',
      update_time: '2024-01-20 10:30:00',
      remark: '测试政府用户',
      userType: '政府',
    },
  ];
};

// 根据用户类型获取对应的数据列表
export const dataList = (userType) => {
  switch (userType) {
    case '个人': {
      return personalUserList();
    }
    case '企业': {
      return enterpriseUserList();
    }
    case '政府': {
      return governmentUserList();
    }
    default: {
      return [];
    }
  }
};

/** 个人用户表单schema */
export function personalFormSchema() {
  return [
    {
      fieldName: 'user_id',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'user_name',
      label: '用户名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
      },
      rules: 'required',
    },
    {
      fieldName: 'user_phone',
      label: '手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号',
      },
      rules: 'required',
    },
    {
      fieldName: 'id_card',
      label: '身份证号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证号',
      },
      rules: 'required',
    },
    {
      fieldName: 'gender',
      label: '性别',
      component: 'Select',
      componentProps: {
        placeholder: '请选择性别',
        options: [
          { label: '男', value: '男' },
          { label: '女', value: '女' },
        ],
        clearable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'car_numbers',
      label: '绑定车牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入绑定车牌，多个车牌用逗号分隔，最多3个',
      },
    },
    {
      fieldName: 'contact_address',
      label: '联系地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系地址',
        type: 'textarea',
      },
    },
    {
      fieldName: 'signature',
      label: '个人签名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入个人签名',
        type: 'textarea',
      },
    },
  ];
}

/** 企业用户表单schema */
export function enterpriseFormSchema() {
  return [
    {
      fieldName: 'enterprise_id',
      label: '企业ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'enterprise_name',
      label: '企业名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'credit_code',
      label: '统一社会信用代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统一社会信用代码',
      },
      rules: 'required',
    },
    {
      fieldName: 'contact_person',
      label: '联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
      },
      rules: 'required',
    },
    {
      fieldName: 'contact_phone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
      },
      rules: 'required',
    },
    {
      fieldName: 'register_address',
      label: '注册地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入注册地址',
        type: 'textarea',
      },
      rules: 'required',
    },
    {
      fieldName: 'industry_code',
      label: '所属行业',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属行业',
        options: [
          { label: '信息技术', value: 'IT' },
          { label: '金融业', value: '金融' },
          { label: '批发和零售业', value: '贸易' },
          { label: '制造业', value: '制造' },
        ],
        clearable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'admin_id',
      label: '管理员账号ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入管理员账号ID',
      },
      rules: 'required',
    },
  ];
}

/** 政府用户表单schema */
export function governmentFormSchema() {
  return [
    {
      fieldName: 'gov_user_id',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'user_name',
      label: '用户名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
      },
      rules: 'required',
    },
    {
      fieldName: 'dept_id',
      label: '所属政府部门',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属政府部门',
        options: [
          { label: '交通管理局', value: 'dept001' },
          { label: '环境保护局', value: 'dept002' },
          { label: '市场监督管理局', value: 'dept003' },
        ],
        clearable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'contact_phone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
      },
      rules: 'required',
    },
    {
      fieldName: 'region_id',
      label: '负责区域',
      component: 'Select',
      componentProps: {
        placeholder: '请选择负责区域',
        options: [
          { label: '北京市', value: 'region001' },
          { label: '上海市', value: 'region002' },
          { label: '广州市', value: 'region003' },
          { label: '深圳市', value: 'region004' },
        ],
        clearable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'role_id',
      label: '用户角色',
      component: 'Select',
      componentProps: {
        placeholder: '请选择用户角色',
        options: [
          { label: '管理员', value: 'role001' },
          { label: '普通用户', value: 'role002' },
          { label: '审核员', value: 'role003' },
        ],
        clearable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'permission_scope',
      label: '权限范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择权限范围',
        options: [
          { label: '全部', value: '全部' },
          { label: '部分', value: '部分' },
        ],
        clearable: true,
      },
      rules: 'required',
    },
  ];
}

/** 新增/修改的表单，根据用户类型返回不同的schema */
export function useFormSchema(userType) {
  switch (userType) {
    case '个人': {
      return personalFormSchema();
    }
    case '企业': {
      return enterpriseFormSchema();
    }
    case '政府': {
      return governmentFormSchema();
    }
    default: {
      return [];
    }
  }
}

/** 个人用户搜索表单schema */
export function personalGridFormSchema() {
  return [
    {
      fieldName: 'user_id',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
        clearable: true,
      },
    },
    {
      fieldName: 'user_name',
      label: '用户名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
        clearable: true,
      },
    },
    {
      fieldName: 'user_phone',
      label: '手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号',
        clearable: true,
      },
    },
    {
      fieldName: 'cert_status',
      label: '认证状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择认证状态',
        options: [
          { label: '未认证', value: '未认证' },
          { label: '待审核', value: '待审核' },
          { label: '已认证', value: '已认证' },
          { label: '认证失败', value: '认证失败' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'account_status',
      label: '账号状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择账号状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '禁用', value: '禁用' },
          { label: '冻结', value: '冻结' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'register_time',
      label: '注册时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择注册时间',
        type: 'daterange',
        clearable: true,
      },
    },
  ];
}

/** 企业用户搜索表单schema */
export function enterpriseGridFormSchema() {
  return [
    {
      fieldName: 'enterprise_id',
      label: '企业ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业ID',
        clearable: true,
      },
    },
    {
      fieldName: 'enterprise_name',
      label: '企业名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业名称',
        clearable: true,
      },
    },
    {
      fieldName: 'industry_code',
      label: '所属行业',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属行业',
        options: [
          { label: '信息技术', value: 'IT' },
          { label: '金融业', value: '金融' },
          { label: '批发和零售业', value: '贸易' },
          { label: '制造业', value: '制造' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'cert_status',
      label: '认证状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择认证状态',
        options: [
          { label: '未认证', value: '未认证' },
          { label: '待审核', value: '待审核' },
          { label: '已认证', value: '已认证' },
          { label: '认证失败', value: '认证失败' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'account_status',
      label: '账号状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择账号状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '禁用', value: '禁用' },
          { label: '冻结', value: '冻结' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'register_time',
      label: '注册时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择注册时间',
        type: 'daterange',
        clearable: true,
      },
    },
  ];
}

/** 政府用户搜索表单schema */
export function governmentGridFormSchema() {
  return [
    {
      fieldName: 'gov_user_id',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
        clearable: true,
      },
    },
    {
      fieldName: 'user_name',
      label: '用户名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
        clearable: true,
      },
    },
    {
      fieldName: 'dept_id',
      label: '所属政府部门',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属政府部门',
        options: [
          { label: '交通管理局', value: 'dept001' },
          { label: '环境保护局', value: 'dept002' },
          { label: '市场监督管理局', value: 'dept003' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'region_id',
      label: '负责区域',
      component: 'Select',
      componentProps: {
        placeholder: '请选择负责区域',
        options: [
          { label: '北京市', value: 'region001' },
          { label: '上海市', value: 'region002' },
          { label: '广州市', value: 'region003' },
          { label: '深圳市', value: 'region004' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'role_id',
      label: '用户角色',
      component: 'Select',
      componentProps: {
        placeholder: '请选择用户角色',
        options: [
          { label: '管理员', value: 'role001' },
          { label: '普通用户', value: 'role002' },
          { label: '审核员', value: 'role003' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'account_status',
      label: '账号状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择账号状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '禁用', value: '禁用' },
          { label: '冻结', value: '冻结' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'online_status',
      label: '在线状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择在线状态',
        options: [
          { label: '在线', value: '在线' },
          { label: '离线', value: '离线' },
        ],
        clearable: true,
      },
    },
  ];
}

/** 列表的搜索表单，根据用户类型返回不同的schema */
export function useGridFormSchema(userType) {
  switch (userType) {
    case '个人': {
      return personalGridFormSchema();
    }
    case '企业': {
      return enterpriseGridFormSchema();
    }
    case '政府': {
      return governmentGridFormSchema();
    }
    default: {
      return [];
    }
  }
}

/** 个人用户表格列配置 */
export function personalGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'user_id',
      title: '用户ID',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'user_name',
      title: '用户名',
      minWidth: 150,
      sortable: true,
      slots: {
        default: 'userName',
      },
    },
    {
      field: 'user_phone',
      title: '手机号',
      minWidth: 150,
      sortable: true,
      formatter: ({ cellValue }) => {
        return maskPhone(cellValue);
      },
    },
    {
      field: 'id_card',
      title: '身份证号',
      minWidth: 200,
      sortable: true,
      formatter: ({ cellValue }) => {
        return maskIdCard(cellValue);
      },
    },
    {
      field: 'gender',
      title: '性别',
      minWidth: 80,
      sortable: true,
    },
    {
      field: 'car_numbers',
      title: '绑定车牌',
      minWidth: 200,
      sortable: true,
      slots: {
        default: 'carNumbers',
      },
    },
    {
      field: 'cert_status',
      title: '认证状态',
      minWidth: 120,
      sortable: true,
      slots: {
        default: 'certStatus',
      },
    },
    {
      field: 'balance',
      title: '钱包余额',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        // 确保cellValue是数字类型
        const numValue = Number.parseFloat(cellValue) || 0;
        return `¥${numValue.toFixed(2)}`;
      },
    },
    {
      field: 'account_status',
      title: '账号状态',
      minWidth: 120,
      sortable: true,
      slots: {
        default: 'accountStatus',
      },
    },
    {
      field: 'register_time',
      title: '注册时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'last_login_time',
      title: '最后登录时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'contact_address',
      title: '联系地址',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'signature',
      title: '个人签名',
      minWidth: 200,
      sortable: true,
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 企业用户表格列配置 */
export function enterpriseGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'enterprise_id',
      title: '企业ID',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'enterprise_name',
      title: '企业名称',
      minWidth: 200,
      sortable: true,
      slots: {
        default: 'enterpriseName',
      },
    },
    {
      field: 'credit_code',
      title: '统一社会信用代码',
      minWidth: 250,
      sortable: true,
    },
    {
      field: 'contact_person',
      title: '联系人',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'contact_phone',
      title: '联系电话',
      minWidth: 150,
      sortable: true,
      formatter: ({ cellValue }) => {
        return maskPhone(cellValue);
      },
    },
    {
      field: 'register_address',
      title: '注册地址',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'industry_name',
      title: '所属行业',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'admin_name',
      title: '管理员账号',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'cert_status',
      title: '认证状态',
      minWidth: 120,
      sortable: true,
      slots: {
        default: 'certStatus',
      },
    },
    {
      field: 'account_status',
      title: '账号状态',
      minWidth: 120,
      sortable: true,
      slots: {
        default: 'accountStatus',
      },
    },
    {
      field: 'dept_count',
      title: '部门数量',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'staff_count',
      title: '员工数量',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'register_time',
      title: '注册时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'proxy_status',
      title: '代付规则状态',
      minWidth: 150,
      sortable: true,
      slots: {
        default: 'proxyStatus',
      },
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 政府用户表格列配置 */
export function governmentGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'gov_user_id',
      title: '用户ID',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'user_name',
      title: '用户名',
      minWidth: 150,
      sortable: true,
      slots: {
        default: 'userName',
      },
    },
    {
      field: 'dept_name',
      title: '所属政府部门',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'contact_phone',
      title: '联系电话',
      minWidth: 150,
      sortable: true,
      formatter: ({ cellValue }) => {
        return maskPhone(cellValue);
      },
    },
    {
      field: 'region_name',
      title: '负责区域',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'role_name',
      title: '用户角色',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'permission_scope',
      title: '权限范围',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'account_status',
      title: '账号状态',
      minWidth: 120,
      sortable: true,
      slots: {
        default: 'accountStatus',
      },
    },
    {
      field: 'register_time',
      title: '注册时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'last_operate_time',
      title: '最后操作时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'operate_log',
      title: '操作日志摘要',
      minWidth: 200,
      sortable: true,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        // 确保cellValue是字符串类型
        const strValue = String(cellValue);
        return strValue.length > 50 ? `${strValue.slice(0, 50)}...` : strValue;
      },
    },
    {
      field: 'online_status',
      title: '在线状态',
      minWidth: 100,
      sortable: true,
      slots: {
        default: 'onlineStatus',
      },
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 列表的字段，根据用户类型返回不同的列配置 */
export function useGridColumns(userType) {
  switch (userType) {
    case '个人': {
      return personalGridColumns();
    }
    case '企业': {
      return enterpriseGridColumns();
    }
    case '政府': {
      return governmentGridColumns();
    }
    default: {
      return [];
    }
  }
}

/** 认证管理抽屉的表单字段设置 */
export function useAuthDrawerSchema() {
  return [
    {
      fieldName: 'authType',
      label: '认证类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择认证类型',
        options: [
          { label: '实名', value: '实名' },
          { label: '车牌', value: '车牌' },
          { label: '商户', value: '商户' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'authMaterialUrl',
      label: '认证材料URL',
      component: 'Input',
      componentProps: {
        placeholder: '请输入认证材料URL',
        clearable: true,
      },
    },
    {
      fieldName: 'plateNumber',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
        clearable: true,
      },
    },
    {
      fieldName: 'idCardOrLicense',
      label: '身份证号/营业执照号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证号/营业执照号',
        clearable: true,
      },
    },
    {
      fieldName: 'reviewerId',
      label: '审核人ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入审核人ID',
        clearable: true,
      },
    },
    {
      fieldName: 'reviewResult',
      label: '审核结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审核结果',
        options: [
          { label: '通过', value: '通过' },
          { label: '驳回', value: '驳回' },
        ],
      },
    },
    {
      fieldName: 'rejectReason',
      label: '驳回原因',
      component: 'Input',
      componentProps: {
        placeholder: '请输入驳回原因',
        type: 'textarea',
        rows: 4,
      },
    },
    {
      fieldName: 'authStatus',
      label: '认证状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择认证状态',
        options: [
          { label: '未认证', value: '未认证' },
          { label: '待审核', value: '待审核' },
          { label: '已认证', value: '已认证' },
          { label: '认证失败', value: '认证失败' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'authRecordDetail',
      label: '认证记录明细',
      component: 'Input',
      componentProps: {
        placeholder: '请输入认证记录明细',
        type: 'textarea',
        rows: 4,
      },
    },
  ];
}

/** 文本配置 */
export const textObj = {
  editText: '编辑用户',
  addText: '新增用户',
  excelName: '用户列表',
  excelAllName: '用户数据.xlsx',
  total: '总计: 用户数量',
};

/** 个人用户详情字段配置 */
export const personalDetailFields = [
  { key: 'user_id', label: '用户ID' },
  {
    key: 'user_name',
    label: '用户名',
  },
  {
    key: 'user_phone',
    label: '手机号',
    formatter: maskPhone,
  },
  {
    key: 'id_card',
    label: '身份证号',
    formatter: maskIdCard,
  },
  { key: 'gender', label: '性别' },
  {
    key: 'car_numbers',
    label: '绑定车牌',
    formatter: (value) => {
      if (!value || !Array.isArray(value)) return '';
      return value.join(', ');
    },
  },
  {
    key: 'cert_status',
    label: '认证状态',
    type: 'tag',
    tagType: (value) => {
      switch (value) {
        case '已认证': {
          return 'success';
        }
        case '待审核': {
          return 'warning';
        }
        case '认证失败': {
          return 'danger';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  {
    key: 'balance',
    label: '钱包余额',
    formatter: (value) => {
      return `¥${value.toFixed(2)}`;
    },
  },
  {
    key: 'account_status',
    label: '账号状态',
    type: 'tag',
    tagType: (value) => {
      switch (value) {
        case '冻结': {
          return 'warning';
        }
        case '正常': {
          return 'success';
        }
        case '禁用': {
          return 'danger';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  { key: 'register_time', label: '注册时间' },
  { key: 'last_login_time', label: '最后登录时间' },
  { key: 'contact_address', label: '联系地址' },
  { key: 'signature', label: '个人签名' },
  { key: 'create_time', label: '创建时间' },
  { key: 'update_time', label: '更新时间' },
  { key: 'remark', label: '备注' },
];

/** 企业用户详情字段配置 */
export const enterpriseDetailFields = [
  { key: 'enterprise_id', label: '企业ID' },
  { key: 'enterprise_name', label: '企业名称' },
  { key: 'credit_code', label: '统一社会信用代码' },
  { key: 'contact_person', label: '联系人' },
  {
    key: 'contact_phone',
    label: '联系电话',
    formatter: maskPhone,
  },
  { key: 'register_address', label: '注册地址' },
  { key: 'industry_name', label: '所属行业' },
  { key: 'admin_name', label: '管理员账号' },
  {
    key: 'cert_status',
    label: '认证状态',
    type: 'tag',
    tagType: (value) => {
      switch (value) {
        case '已认证': {
          return 'success';
        }
        case '待审核': {
          return 'warning';
        }
        case '认证失败': {
          return 'danger';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  {
    key: 'account_status',
    label: '账号状态',
    type: 'tag',
    tagType: (value) => {
      switch (value) {
        case '冻结': {
          return 'warning';
        }
        case '正常': {
          return 'success';
        }
        case '禁用': {
          return 'danger';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  { key: 'dept_count', label: '部门数量' },
  { key: 'staff_count', label: '员工数量' },
  { key: 'register_time', label: '注册时间' },
  {
    key: 'proxy_status',
    label: '代付规则状态',
    type: 'tag',
    tagType: (value) => {
      switch (value) {
        case '启用': {
          return 'success';
        }
        case '禁用': {
          return 'danger';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  { key: 'create_time', label: '创建时间' },
  { key: 'update_time', label: '更新时间' },
  { key: 'remark', label: '备注' },
];

/** 政府用户详情字段配置 */
export const governmentDetailFields = [
  { key: 'gov_user_id', label: '用户ID' },
  { key: 'user_name', label: '用户名' },
  { key: 'dept_name', label: '所属政府部门' },
  {
    key: 'contact_phone',
    label: '联系电话',
    formatter: maskPhone,
  },
  { key: 'region_name', label: '负责区域' },
  { key: 'role_name', label: '用户角色' },
  { key: 'permission_scope', label: '权限范围' },
  {
    key: 'account_status',
    label: '账号状态',
    type: 'tag',
    tagType: (value) => {
      switch (value) {
        case '冻结': {
          return 'warning';
        }
        case '正常': {
          return 'success';
        }
        case '禁用': {
          return 'danger';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  { key: 'register_time', label: '注册时间' },
  { key: 'last_operate_time', label: '最后操作时间' },
  {
    key: 'operate_log',
    label: '操作日志摘要',
    formatter: (value) => {
      if (!value) return '';
      return value.length > 50 ? `${value.slice(0, 50)}...` : value;
    },
  },
  {
    key: 'online_status',
    label: '在线状态',
    type: 'tag',
    tagType: (value) => {
      switch (value) {
        case '在线': {
          return 'success';
        }
        case '离线': {
          return 'info';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  { key: 'create_time', label: '创建时间' },
  { key: 'update_time', label: '更新时间' },
  { key: 'remark', label: '备注' },
];

/** 根据用户类型获取详情字段配置 */
export const getUserDetailFields = (userType) => {
  switch (userType) {
    case '个人': {
      return personalDetailFields;
    }
    case '企业': {
      return enterpriseDetailFields;
    }
    case '政府': {
      return governmentDetailFields;
    }
    default: {
      return [];
    }
  }
};

// 统计数据配置
export const statsData = {
  // 卡片数据
  cards: [
    {
      title: '总用户数',
      value: 5,
      desc: '较上月增长12%',
      color: '#13ce66',
    },
    {
      title: '认证用户数',
      value: 2,
      desc: '认证率40%',
      color: '#4ECDC4',
    },
    {
      title: '活跃用户数',
      value: 5,
      desc: '近7日活跃',
      color: '#FF6B6B',
    },
  ],
  // 图表数据
  charts: [
    {
      title: '认证状态占比',
      type: 'pie',
      data: [
        { value: 44.49, name: '已认证' },
        { value: 40, name: '待认证' },
        { value: 20, name: '已拒绝' },
      ],
    },
    {
      title: '账号状态占比',
      type: 'pie',
      data: [
        { value: 80, name: '正常' },
        { value: 20, name: '已禁用' },
      ],
    },
    {
      title: '近30日注册趋势',
      type: 'line',
      xAxis: ['01-10', '01-12', '01-14', '01-16', '01-18', '01-20'],
      series: [4, 8, 6, 12, 10, 16, 14, 8],
    },
  ],
};

// 企业用户管理统计数据
export const enterpriseStatsData = {
  cards: [
    {
      title: '总企业用户数',
      value: 120,
      desc: '较上月增长8%',
      color: '#13ce66',
    },
    {
      title: '认证企业数',
      value: 96,
      desc: '认证率80%',
      color: '#4ECDC4',
    },
    {
      title: '活跃企业数',
      value: 88,
      desc: '近7日活跃',
      color: '#FF6B6B',
    },
  ],
  charts: [
    {
      title: '认证状态占比',
      type: 'pie',
      data: [
        { value: 80, name: '已认证' },
        { value: 15, name: '待认证' },
        { value: 5, name: '已拒绝' },
      ],
    },
    {
      title: '账号状态占比',
      type: 'pie',
      data: [
        { value: 90, name: '正常' },
        { value: 10, name: '已禁用' },
      ],
    },
    {
      title: '不同行业企业分布',
      type: 'bar',
      xAxis: ['制造业', '服务业', '金融业', '科技业', '教育业'],
      series: [30, 25, 20, 15, 10],
    },
  ],
};

// 政府用户管理统计数据
export const governmentStatsData = {
  cards: [
    {
      title: '总政府用户数',
      value: 50,
      desc: '较上月增长5%',
      color: '#13ce66',
    },
    {
      title: '活跃用户数',
      value: 45,
      desc: '近7日活跃',
      color: '#4ECDC4',
    },
    {
      title: '不同部门用户数',
      value: 12,
      desc: '覆盖12个部门',
      color: '#FF6B6B',
    },
  ],
  charts: [
    {
      title: '账号状态占比',
      type: 'pie',
      data: [
        { value: 95, name: '正常' },
        { value: 5, name: '已禁用' },
      ],
    },
    {
      title: '用户角色占比',
      type: 'pie',
      data: [
        { value: 60, name: '管理员' },
        { value: 40, name: '普通用户' },
      ],
    },
    {
      title: '不同区域用户分布',
      type: 'bar',
      xAxis: ['区域1', '区域2', '区域3', '区域4', '区域5'],
      series: [15, 12, 10, 8, 5],
    },
  ],
};

// 根据用户类型获取对应统计数据
export const getStatsDataByUserType = (userType) => {
  // 获取对应用户类型的实际数据
  const userData = dataList(userType);

  // 根据不同用户类型生成统计数据
  switch (userType) {
    case '企业': {
      // 企业用户统计
      const totalCount = userData.length;
      const certifiedCount = userData.filter(
        (item) => item.cert_status === '已认证',
      ).length;
      const normalCount = userData.filter(
        (item) => item.account_status === '正常',
      ).length;

      // 统计不同认证状态的数量
      const certStatusStats = {
        已认证: userData.filter((item) => item.cert_status === '已认证').length,
        待审核: userData.filter((item) => item.cert_status === '待审核').length,
        未认证: userData.filter((item) => item.cert_status === '未认证').length,
        认证失败: userData.filter((item) => item.cert_status === '认证失败')
          .length,
      };

      // 统计不同账号状态的数量
      const accountStatusStats = {
        正常: userData.filter((item) => item.account_status === '正常').length,
        禁用: userData.filter((item) => item.account_status === '禁用').length,
        冻结: userData.filter((item) => item.account_status === '冻结').length,
      };

      // 统计不同行业的数量
      const industryStats = {};
      userData.forEach((item) => {
        industryStats[item.industry_name] =
          (industryStats[item.industry_name] || 0) + 1;
      });

      return {
        cards: [
          {
            title: '总企业用户数',
            value: totalCount,
            desc: `较上月增长${Math.floor(Math.random() * 10) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '认证企业数',
            value: certifiedCount,
            desc: `认证率${Math.round((certifiedCount / totalCount) * 100)}%`,
            color: '#4ECDC4',
          },
          {
            title: '活跃企业数',
            value: normalCount,
            desc: '近7日活跃',
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '认证状态占比',
            type: 'pie',
            data: Object.entries(certStatusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '账号状态占比',
            type: 'pie',
            data: Object.entries(accountStatusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '不同行业企业分布',
            type: 'bar',
            xAxis: Object.keys(industryStats),
            series: Object.values(industryStats),
            // showXAxisLabel: false,
          },
        ],
      };
    }
    case '政府': {
      // 政府用户统计
      const totalCount = userData.length;
      const onlineCount = userData.filter(
        (item) => item.online_status === '在线',
      ).length;

      // 统计不同部门的数量
      const deptStats = {};
      userData.forEach((item) => {
        deptStats[item.dept_name] = (deptStats[item.dept_name] || 0) + 1;
      });

      // 统计不同账号状态的数量
      const accountStatusStats = {
        正常: userData.filter((item) => item.account_status === '正常').length,
        禁用: userData.filter((item) => item.account_status === '禁用').length,
        冻结: userData.filter((item) => item.account_status === '冻结').length,
      };

      // 统计不同角色的数量
      const roleStats = {};
      userData.forEach((item) => {
        roleStats[item.role_name] = (roleStats[item.role_name] || 0) + 1;
      });

      // 统计不同区域的数量
      const regionStats = {};
      userData.forEach((item) => {
        regionStats[item.region_name] =
          (regionStats[item.region_name] || 0) + 1;
      });

      return {
        cards: [
          {
            title: '总政府用户数',
            value: totalCount,
            desc: `较上月增长${Math.floor(Math.random() * 5) + 3}%`,
            color: '#13ce66',
          },
          {
            title: '活跃用户数',
            value: onlineCount,
            desc: '近7日活跃',
            color: '#4ECDC4',
          },
          {
            title: '不同部门用户数',
            value: Object.keys(deptStats).length,
            desc: `覆盖${Object.keys(deptStats).length}个部门`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '账号状态占比',
            type: 'pie',
            data: Object.entries(accountStatusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '用户角色占比',
            type: 'pie',
            data: Object.entries(roleStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '不同区域用户分布',
            type: 'bar',
            xAxis: Object.keys(regionStats),
            series: Object.values(regionStats),
          },
        ],
      };
    }
    case '个人':
    default: {
      // 个人用户统计
      const totalCount = userData.length;
      const certifiedCount = userData.filter(
        (item) => item.cert_status === '已认证',
      ).length;
      const normalCount = userData.filter(
        (item) => item.account_status === '正常',
      ).length;

      // 统计不同认证状态的数量
      const certStatusStats = {
        已认证: userData.filter((item) => item.cert_status === '已认证').length,
        待审核: userData.filter((item) => item.cert_status === '待审核').length,
        未认证: userData.filter((item) => item.cert_status === '未认证').length,
        认证失败: userData.filter((item) => item.cert_status === '认证失败')
          .length,
      };

      // 统计不同账号状态的数量
      const accountStatusStats = {
        正常: userData.filter((item) => item.account_status === '正常').length,
        禁用: userData.filter((item) => item.account_status === '禁用').length,
        冻结: userData.filter((item) => item.account_status === '冻结').length,
      };

      // 统计注册时间分布（最近30天）
      const registerDateStats = {};
      userData.forEach((item) => {
        const date = item.register_time.split(' ')[0];
        registerDateStats[date] = (registerDateStats[date] || 0) + 1;
      });

      // 获取最近的6个日期
      const recentDates = Object.keys(registerDateStats).sort().slice(-6);
      const recentData = recentDates.map(
        (date) => registerDateStats[date] || 0,
      );

      return {
        cards: [
          {
            title: '总用户数',
            value: totalCount,
            desc: `较上月增长${Math.floor(Math.random() * 10) + 8}%`,
            color: '#13ce66',
          },
          {
            title: '认证用户数',
            value: certifiedCount,
            desc: `认证率${Math.round((certifiedCount / totalCount) * 100)}%`,
            color: '#4ECDC4',
          },
          {
            title: '活跃用户数',
            value: normalCount,
            desc: '近7日活跃',
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '认证状态占比',
            type: 'pie',
            data: Object.entries(certStatusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '账号状态占比',
            type: 'pie',
            data: Object.entries(accountStatusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '近30日注册趋势',
            type: 'line',
            xAxis: recentDates,
            series: recentData,
          },
        ],
      };
    }
  }
};

/** 车辆信息静态数据 */
export const carInfoData = [
  // 用户1: 张三
  {
    car_id: 'car001',
    car_number: '京A12345',
    car_type: '小型轿车',
    user_id: '1',
    brand: '奔驰',
    color: '黑色',
    bind_status: '已绑定',
    create_time: '2024-01-01 10:00:00',
    update_time: '2024-01-01 10:00:00',
    remark: '主驾驶车辆',
  },
  {
    car_id: 'car002',
    car_number: '京B67890',
    car_type: 'SUV',
    user_id: '1',
    brand: '宝马',
    color: '白色',
    bind_status: '已绑定',
    create_time: '2024-02-01 14:30:00',
    update_time: '2024-02-01 14:30:00',
    remark: '家庭用车',
  },
  // 用户2: 李四
  {
    car_id: 'car003',
    car_number: '京C34567',
    car_type: '小型轿车',
    user_id: '2',
    brand: '奥迪',
    color: '银色',
    bind_status: '已绑定',
    create_time: '2024-03-01 09:15:00',
    update_time: '2024-03-01 09:15:00',
    remark: '代步车',
  },
  // 用户4: 赵六
  {
    car_id: 'car004',
    car_number: '京D78901',
    car_type: '新能源汽车',
    user_id: '4',
    brand: '特斯拉',
    color: '红色',
    bind_status: '已绑定',
    create_time: '2024-04-01 16:45:00',
    update_time: '2024-04-01 16:45:00',
    remark: '电动轿车',
  },
  // 用户5: 孙七
  {
    car_id: 'car005',
    car_number: '京E23456',
    car_type: '小型轿车',
    user_id: '5',
    brand: '大众',
    color: '蓝色',
    bind_status: '已绑定',
    create_time: '2024-05-01 11:20:00',
    update_time: '2024-05-01 11:20:00',
    remark: '公司用车',
  },
  {
    car_id: 'car006',
    car_number: '京F78901',
    car_type: 'SUV',
    user_id: '5',
    brand: '丰田',
    color: '灰色',
    bind_status: '已绑定',
    create_time: '2024-06-01 15:30:00',
    update_time: '2024-06-01 15:30:00',
    remark: '越野车辆',
  },
  // 用户6: 周八
  {
    car_id: 'car007',
    car_number: '京G34567',
    car_type: '小型轿车',
    user_id: '6',
    brand: '本田',
    color: '白色',
    bind_status: '已绑定',
    create_time: '2024-07-01 10:30:00',
    update_time: '2024-07-01 10:30:00',
    remark: '通勤车辆',
  },
  // 用户8: 郑十
  {
    car_id: 'car008',
    car_number: '京H45678',
    car_type: '中型轿车',
    user_id: '8',
    brand: '别克',
    color: '黑色',
    bind_status: '已绑定',
    create_time: '2024-08-01 14:20:00',
    update_time: '2024-08-01 14:20:00',
    remark: '商务用车',
  },
  {
    car_id: 'car009',
    car_number: '京I89012',
    car_type: 'SUV',
    user_id: '8',
    brand: '现代',
    color: '银色',
    bind_status: '已绑定',
    create_time: '2024-09-01 09:15:00',
    update_time: '2024-09-01 09:15:00',
    remark: '家庭用车',
  },
  // 用户9: 冯十一
  {
    car_id: 'car010',
    car_number: '京J56789',
    car_type: '小型轿车',
    user_id: '9',
    brand: '福特',
    color: '红色',
    bind_status: '已绑定',
    create_time: '2024-10-01 16:45:00',
    update_time: '2024-10-01 16:45:00',
    remark: '代步车辆',
  },
  // 用户11: 褚十三
  {
    car_id: 'car011',
    car_number: '京K67890',
    car_type: '新能源汽车',
    user_id: '11',
    brand: '比亚迪',
    color: '蓝色',
    bind_status: '已绑定',
    create_time: '2024-11-01 11:20:00',
    update_time: '2024-11-01 11:20:00',
    remark: '电动轿车',
  },
  // 用户12: 卫十四
  {
    car_id: 'car012',
    car_number: '京L78901',
    car_type: 'SUV',
    user_id: '12',
    brand: '马自达',
    color: '灰色',
    bind_status: '已绑定',
    create_time: '2024-12-01 15:30:00',
    update_time: '2024-12-01 15:30:00',
    remark: '越野车辆',
  },
  {
    car_id: 'car013',
    car_number: '京M23456',
    car_type: '小型轿车',
    user_id: '12',
    brand: '雪佛兰',
    color: '白色',
    bind_status: '已绑定',
    create_time: '2025-01-01 10:00:00',
    update_time: '2025-01-01 10:00:00',
    remark: '通勤车辆',
  },
  // 用户13: 蒋十五
  {
    car_id: 'car014',
    car_number: '京N89012',
    car_type: '中型轿车',
    user_id: '13',
    brand: '大众',
    color: '黑色',
    bind_status: '已绑定',
    create_time: '2025-02-01 14:30:00',
    update_time: '2025-02-01 14:30:00',
    remark: '商务用车',
  },
  // 用户15: 韩十七
  {
    car_id: 'car015',
    car_number: '京O90123',
    car_type: '新能源汽车',
    user_id: '15',
    brand: '蔚来',
    color: '灰色',
    bind_status: '已绑定',
    create_time: '2025-03-01 09:15:00',
    update_time: '2025-03-01 09:15:00',
    remark: '电动SUV',
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
