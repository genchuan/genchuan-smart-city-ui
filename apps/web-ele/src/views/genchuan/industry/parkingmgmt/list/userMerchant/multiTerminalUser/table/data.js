/** 表格初始数据*/
// 从商户管理模块导入商户列表数据
import { merchantList as baseMerchantList } from '../../merchant/table/data';

export const dataList = () => {
  return [
    {
      id: '1',
      username: 'user001',
      realName: '张三',
      userType: '个人',
      authStatus: '已认证',
      phone: '13800138001',
      email: 'zhangsan@example.com',
      createTime: '2024-01-01 10:00:00',
      updateTime: '2024-01-02 14:30:00',
      merchantId: 'merchant001',
      merchantName: '张三商贸有限公司',
      lastLoginTime: '2024-01-10 09:15:00',
    },
    {
      id: '2',
      username: 'user002',
      realName: '李四',
      userType: '个人',
      authStatus: '待审核',
      phone: '13800138002',
      email: 'lisi@example.com',
      createTime: '2024-01-02 11:30:00',
      updateTime: '2024-01-03 09:45:00',
      merchantId: 'merchant002',
      merchantName: '李四科技有限公司',
      lastLoginTime: '2024-01-09 16:20:00',
    },
    {
      id: '3',
      username: 'user003',
      realName: '王五',
      userType: '企业',
      authStatus: '未认证',
      phone: '13800138003',
      email: 'wangwu@example.com',
      createTime: '2024-01-03 14:20:00',
      updateTime: '2024-01-04 10:15:00',
      merchantId: 'merchant003',
      merchantName: '王五贸易有限公司',
      lastLoginTime: '2024-01-08 14:30:00',
    },
    {
      id: '4',
      username: 'user004',
      realName: '赵六',
      userType: '企业',
      authStatus: '认证失败',
      phone: '13800138004',
      email: 'zhaoliu@example.com',
      createTime: '2024-01-04 09:15:00',
      updateTime: '2024-01-05 15:20:00',
      merchantId: 'merchant004',
      merchantName: '赵六实业有限公司',
      lastLoginTime: '2024-01-07 11:45:00',
    },
    {
      id: '5',
      username: 'user005',
      realName: '孙七',
      userType: '政府',
      authStatus: '已认证',
      phone: '13800138005',
      email: 'sunqi@example.com',
      createTime: '2024-01-05 16:45:00',
      updateTime: '2024-01-06 13:10:00',
      merchantId: 'merchant005',
      merchantName: '孙七政务服务中心',
      lastLoginTime: '2024-01-06 09:30:00',
    },
    {
      id: '6',
      username: 'user006',
      realName: '周八',
      userType: '个人',
      authStatus: '已认证',
      phone: '13800138006',
      email: 'zhouba@example.com',
      createTime: '2024-01-06 10:30:00',
      updateTime: '2024-01-07 14:50:00',
      merchantId: 'merchant006',
      merchantName: '周八零售有限公司',
      lastLoginTime: '2024-01-10 10:20:00',
    },
    {
      id: '7',
      username: 'user007',
      realName: '吴九',
      userType: '企业',
      authStatus: '待审核',
      phone: '13800138007',
      email: 'wujiu@example.com',
      createTime: '2024-01-07 14:20:00',
      updateTime: '2024-01-08 09:15:00',
      merchantId: 'merchant007',
      merchantName: '吴九制造有限公司',
      lastLoginTime: '2024-01-09 14:30:00',
    },
    {
      id: '8',
      username: 'user008',
      realName: '郑十',
      userType: '政府',
      authStatus: '已认证',
      phone: '13800138008',
      email: 'zhengshi@example.com',
      createTime: '2024-01-08 09:45:00',
      updateTime: '2024-01-09 15:20:00',
      merchantId: 'merchant008',
      merchantName: '郑十城市管理局',
      lastLoginTime: '2024-01-10 11:45:00',
    },
    {
      id: '9',
      username: 'user009',
      realName: '冯十一',
      userType: '个人',
      authStatus: '未认证',
      phone: '13800138009',
      email: 'fengshiyi@example.com',
      createTime: '2024-01-09 13:10:00',
      updateTime: '2024-01-10 10:30:00',
      merchantId: 'merchant009',
      merchantName: '冯十一餐饮有限公司',
      lastLoginTime: '2024-01-10 14:50:00',
    },
    {
      id: '10',
      username: 'user010',
      realName: '陈十二',
      userType: '企业',
      authStatus: '认证失败',
      phone: '13800138010',
      email: 'chenshier@example.com',
      createTime: '2024-01-10 11:20:00',
      updateTime: '2024-01-11 09:15:00',
      merchantId: 'merchant010',
      merchantName: '陈十二物流有限公司',
      lastLoginTime: '2024-01-11 14:30:00',
    },
    {
      id: '11',
      username: 'user011',
      realName: '褚十三',
      userType: '政府',
      authStatus: '待审核',
      phone: '13800138011',
      email: 'chushisan@example.com',
      createTime: '2024-01-11 15:45:00',
      updateTime: '2024-01-12 13:10:00',
      merchantId: 'merchant011',
      merchantName: '褚十三交通管理局',
      lastLoginTime: '2024-01-12 09:30:00',
    },
    {
      id: '12',
      username: 'user012',
      realName: '卫十四',
      userType: '个人',
      authStatus: '已认证',
      phone: '13800138012',
      email: 'weishisi@example.com',
      createTime: '2024-01-12 10:30:00',
      updateTime: '2024-01-13 14:50:00',
      merchantId: 'merchant012',
      merchantName: '卫十四教育咨询有限公司',
      lastLoginTime: '2024-01-13 10:20:00',
    },
    {
      id: '13',
      username: 'user013',
      realName: '蒋十五',
      userType: '企业',
      authStatus: '已认证',
      phone: '13800138013',
      email: 'jiangshiwu@example.com',
      createTime: '2024-01-13 14:20:00',
      updateTime: '2024-01-14 09:15:00',
      merchantId: 'merchant013',
      merchantName: '蒋十五建筑有限公司',
      lastLoginTime: '2024-01-14 14:30:00',
    },
    {
      id: '14',
      username: 'user014',
      realName: '沈十六',
      userType: '政府',
      authStatus: '已认证',
      phone: '13800138014',
      email: 'shenshiliu@example.com',
      createTime: '2024-01-14 09:45:00',
      updateTime: '2024-01-15 15:20:00',
      merchantId: 'merchant014',
      merchantName: '沈十六环境保护局',
      lastLoginTime: '2024-01-15 11:45:00',
    },
    {
      id: '15',
      username: 'user015',
      realName: '韩十七',
      userType: '个人',
      authStatus: '待审核',
      phone: '13800138015',
      email: 'hanqishi@example.com',
      createTime: '2024-01-15 13:10:00',
      updateTime: '2024-01-16 10:30:00',
      merchantId: 'merchant015',
      merchantName: '韩十七医疗科技有限公司',
      lastLoginTime: '2024-01-16 14:50:00',
    },
    {
      id: '16',
      username: 'user016',
      realName: '杨十八',
      userType: '企业',
      authStatus: '未认证',
      phone: '13800138016',
      email: 'yangshiba@example.com',
      createTime: '2024-01-16 11:20:00',
      updateTime: '2024-01-17 09:15:00',
      merchantId: 'merchant016',
      merchantName: '杨十八文化传媒有限公司',
      lastLoginTime: '2024-01-17 14:30:00',
    },
    {
      id: '17',
      username: 'user017',
      realName: '朱十九',
      userType: '政府',
      authStatus: '认证失败',
      phone: '13800138017',
      email: 'zhushijiu@example.com',
      createTime: '2024-01-17 15:45:00',
      updateTime: '2024-01-18 13:10:00',
      merchantId: 'merchant017',
      merchantName: '朱十九市场监督管理局',
      lastLoginTime: '2024-01-18 09:30:00',
    },
    {
      id: '18',
      username: 'user018',
      realName: '秦二十',
      userType: '个人',
      authStatus: '已认证',
      phone: '13800138018',
      email: 'qiner shi@example.com',
      createTime: '2024-01-18 10:30:00',
      updateTime: '2024-01-19 14:50:00',
      merchantId: 'merchant018',
      merchantName: '秦二十旅游咨询有限公司',
      lastLoginTime: '2024-01-19 10:20:00',
    },
    {
      id: '19',
      username: 'user019',
      realName: '尤二十一',
      userType: '企业',
      authStatus: '待审核',
      phone: '13800138019',
      email: 'youeryi shi@example.com',
      createTime: '2024-01-19 14:20:00',
      updateTime: '2024-01-20 09:15:00',
      merchantId: 'merchant019',
      merchantName: '尤二十一电子商务有限公司',
      lastLoginTime: '2024-01-20 14:30:00',
    },
    {
      id: '20',
      username: 'user020',
      realName: '许二十二',
      userType: '政府',
      authStatus: '已认证',
      phone: '13800138020',
      email: 'xuer er shi@example.com',
      createTime: '2024-01-20 09:45:00',
      updateTime: '2024-01-21 15:20:00',
      merchantId: 'merchant020',
      merchantName: '许二十二自然资源局',
      lastLoginTime: '2024-01-21 11:45:00',
    },
  ];
};

/** 新增/修改的表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'username',
      label: '用户名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
      },
      rules: 'required',
    },
    {
      fieldName: 'realName',
      label: '真实姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入真实姓名',
      },
      rules: 'required',
    },
    {
      fieldName: 'userType',
      label: '用户类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择用户类型',
        options: [
          { label: '个人', value: '个人' },
          { label: '企业', value: '企业' },
          { label: '政府', value: '政府' },
        ],
        clearable: true,
      },
      rules: 'required',
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
        clearable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
      },
      rules: 'required',
    },
    {
      fieldName: 'email',
      label: '邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入邮箱',
      },
      rules: 'required',
    },
    {
      fieldName: 'merchantId',
      label: '商户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'merchantName',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
      },
      rules: 'required',
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
        clearable: true,
      },
    },
    {
      fieldName: 'username',
      label: '用户名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
        clearable: true,
      },
    },
    {
      fieldName: 'realName',
      label: '真实姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入真实姓名',
        clearable: true,
      },
    },
    {
      fieldName: 'userType',
      label: '用户类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择用户类型',
        options: [
          { label: '个人', value: '个人' },
          { label: '企业', value: '企业' },
          { label: '政府', value: '政府' },
        ],
        clearable: true,
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
        clearable: true,
      },
    },
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
        clearable: true,
      },
    },
    {
      fieldName: 'email',
      label: '邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入邮箱',
        clearable: true,
      },
    },
    {
      fieldName: 'merchantId',
      label: '商户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户ID',
        clearable: true,
      },
    },
    {
      fieldName: 'merchantName',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
        clearable: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '用户ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'username',
      title: '用户名',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'realName',
      title: '真实姓名',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'userType',
      title: '用户类型',
      minWidth: 120,
      sortable: true,
      slots: {
        default: 'userType',
      },
    },
    {
      field: 'authStatus',
      title: '认证状态',
      minWidth: 120,
      sortable: true,
      slots: {
        default: 'authStatus',
      },
    },
    {
      field: 'phone',
      title: '联系电话',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'email',
      title: '邮箱',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 200,
      sortable: true,
      slots: {
        default: 'merchantName',
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'lastLoginTime',
      title: '最后登录时间',
      minWidth: 200,
      sortable: true,
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 关联字段抽屉的表单字段设置 */
export function useMerchantDrawerSchema() {
  return [
    {
      fieldName: 'merchantName',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
        readonly: true,
      },
    },
    {
      fieldName: 'merchantId',
      label: '商户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户ID',
        readonly: true,
      },
    },
    {
      fieldName: 'userCount',
      label: '关联用户数量',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联用户数量',
        readonly: true,
      },
    },
  ];
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

// 将小驼峰转换为下划线命名，以保持原有功能兼容
export const merchantList = baseMerchantList.map((merchant) => ({
  merchant_id: merchant.merchantId,
  merchant_name: merchant.merchantName,
  merchant_code: merchant.merchantCode,
  contact_person: merchant.contactPerson,
  contact_phone: merchant.contactPhone,
  address: merchant.address,
  business_scope: merchant.businessScope,
  status: merchant.status,
  settlement_ratio: merchant.settlementRatio,
  create_time: merchant.createTime,
  update_time: merchant.updateTime,
  create_by: merchant.createBy,
  update_by: merchant.updateBy,
  remark: merchant.remark,
}));

/** 文本配置 */
export const textObj = {
  editText: '编辑用户',
  addText: '新增用户',
  excelName: '用户列表',
  excelAllName: '用户数据.xlsx',
  total: '总计: 用户数量',
};

/** 详情抽屉字段配置 */
export const userDetailFields = [
  { key: 'id', label: '用户ID' },
  { key: 'username', label: '用户名' },
  { key: 'realName', label: '真实姓名' },
  {
    key: 'userType',
    label: '用户类型',
    type: 'tag',
    tagType: (value) => {
      if (value === '个人') {
        return 'primary';
      } else if (value === '企业') {
        return 'success';
      } else {
        return 'warning';
      }
    },
  },
  {
    key: 'authStatus',
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
  { key: 'phone', label: '联系电话' },
  { key: 'email', label: '邮箱' },
  { key: 'merchantName', label: '商户名称' },
  { key: 'createTime', label: '创建时间' },
  { key: 'lastLoginTime', label: '最后登录时间' },
];

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
  switch (userType) {
    case '企业': {
      return enterpriseStatsData;
    }
    case '政府': {
      return governmentStatsData;
    }
    case '个人':
    default: {
      return statsData;
    }
  }
};
