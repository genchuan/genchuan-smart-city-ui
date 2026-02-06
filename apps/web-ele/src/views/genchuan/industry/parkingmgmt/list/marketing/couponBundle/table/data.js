import {maskPhone} from "#/utils/dataMask/index.js";

/** 券包表格初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      packageId: 'PB001',
      packageName: '春节优惠套餐',
      salePrice: 99,
      couponName: '满50减20优惠券,满100减50优惠券',
      applyScope: '所有停车场',
      validDays: 30,
      saleLimit: 1000,
      status: '上架',
      createTime: '2025-01-10 09:20:30',
      soldCount: 500,
      remainingCount: 500
    },
    {
      packageId: 'PB002',
      packageName: '周末特惠包',
      salePrice: 49,
      couponName: '满30减10优惠券,满60减25优惠券',
      applyScope: '市区停车场',
      validDays: 14,
      saleLimit: 2000,
      status: '上架',
      createTime: '2025-01-12 14:15:20',
      soldCount: 1200,
      remainingCount: 800
    },
    {
      packageId: 'PB003',
      packageName: '月度畅行包',
      salePrice: 199,
      couponName: '满100减60优惠券,满200减100优惠券',
      applyScope: '所有停车场',
      validDays: 30,
      saleLimit: 500,
      status: '下架',
      createTime: '2025-01-15 10:05:10',
      soldCount: 300,
      remainingCount: 200
    },
    {
      packageId: 'PB004',
      packageName: '新人专享包',
      salePrice: 29,
      couponName: '满20减15优惠券,满50减25优惠券',
      applyScope: '新用户',
      validDays: 7,
      saleLimit: 5000,
      status: '上架',
      createTime: '2025-01-18 08:30:45',
      soldCount: 3500,
      remainingCount: 1500
    },
    {
      packageId: 'PB005',
      packageName: '工作日通勤包',
      salePrice: 149,
      couponName: '满80减40优惠券,满150减75优惠券',
      applyScope: '工作日使用',
      validDays: 30,
      saleLimit: 1500,
      status: '上架',
      createTime: '2025-01-20 16:40:15',
      soldCount: 800,
      remainingCount: 700
    },
    {
      packageId: 'PB006',
      packageName: '节假日出行包',
      salePrice: 79,
      couponName: '满40减20优惠券,满80减40优惠券',
      applyScope: '节假日使用',
      validDays: 7,
      saleLimit: 3000,
      status: '上架',
      createTime: '2025-01-22 11:10:30',
      soldCount: 1800,
      remainingCount: 1200
    },
    {
      packageId: 'PB007',
      packageName: '季度尊享包',
      salePrice: 499,
      couponName: '满200减120优惠券,满300减180优惠券',
      applyScope: '所有停车场',
      validDays: 90,
      saleLimit: 300,
      status: '下架',
      createTime: '2025-01-25 13:25:40',
      soldCount: 150,
      remainingCount: 150
    },
    {
      packageId: 'PB008',
      packageName: '夜间停车包',
      salePrice: 59,
      couponName: '满30减15优惠券,满60减30优惠券',
      applyScope: '夜间使用(18:00-次日8:00)',
      validDays: 14,
      saleLimit: 2500,
      status: '上架',
      createTime: '2025-01-28 09:50:25',
      soldCount: 1300,
      remainingCount: 1200
    },
    {
      packageId: 'PB009',
      packageName: '商务出行包',
      salePrice: 129,
      couponName: '满60减30优惠券,满120减60优惠券',
      applyScope: '商务停车场',
      validDays: 21,
      saleLimit: 1000,
      status: '上架',
      createTime: '2025-02-01 15:15:10',
      soldCount: 600,
      remainingCount: 400
    },
    {
      packageId: 'PB010',
      packageName: '学生专享包',
      salePrice: 39,
      couponName: '满25减12优惠券,满50减25优惠券',
      applyScope: '学生用户',
      validDays: 30,
      saleLimit: 1500,
      status: '上架',
      createTime: '2025-02-05 10:30:50',
      soldCount: 900,
      remainingCount: 600
    },
    {
      packageId: 'PB011',
      packageName: '家庭套餐',
      salePrice: 299,
      couponName: '满150减80优惠券,满250减130优惠券',
      applyScope: '所有停车场',
      validDays: 60,
      saleLimit: 800,
      status: '下架',
      createTime: '2025-02-08 14:20:15',
      soldCount: 400,
      remainingCount: 400
    },
    {
      packageId: 'PB012',
      packageName: '会员专享包',
      salePrice: 89,
      couponName: '满45减22优惠券,满90减45优惠券',
      applyScope: '会员用户',
      validDays: 30,
      saleLimit: 2000,
      status: '上架',
      createTime: '2025-02-10 09:40:30',
      soldCount: 1200,
      remainingCount: 800
    }
  ];
};

/** 定向发放管理表格初始数据 - 按指定字段生成 */
export const releaseDataList = () => {
  return [
    {
      releaseId: 'RL001',
      packageSelection: '春节优惠套餐',
      targetedUserTag: '新用户',
      releaseCount: 1000,
      releaseWay: '短信',
      releaseTime: '2025-01-10 09:20:30',
      receiveCount: 850,
      receiveRate: '85%',
      releaseStatus: '已完成'
    },
    {
      releaseId: 'RL002',
      packageSelection: '周末特惠包',
      targetedUserTag: '老用户',
      releaseCount: 2000,
      releaseWay: 'APP推送',
      releaseTime: '2025-01-12 14:15:20',
      receiveCount: 1600,
      receiveRate: '80%',
      releaseStatus: '已完成'
    },
    {
      releaseId: 'RL003',
      packageSelection: '新人专享包',
      targetedUserTag: '新用户',
      releaseCount: 5000,
      releaseWay: '短信',
      releaseTime: '2025-01-15 10:05:10',
      receiveCount: 4200,
      receiveRate: '84%',
      releaseStatus: '已完成'
    },
    {
      releaseId: 'RL004',
      packageSelection: '工作日通勤包',
      targetedUserTag: '通勤用户',
      releaseCount: 1500,
      releaseWay: 'APP推送',
      releaseTime: '2025-01-18 08:30:45',
      receiveCount: 1200,
      receiveRate: '80%',
      releaseStatus: '已完成'
    },
    {
      releaseId: 'RL005',
      packageSelection: '节假日出行包',
      targetedUserTag: '高频用户',
      releaseCount: 3000,
      releaseWay: '短信+APP推送',
      releaseTime: '2025-01-20 16:40:15',
      receiveCount: 2500,
      receiveRate: '83.3%',
      releaseStatus: '已完成'
    },
    {
      releaseId: 'RL006',
      packageSelection: '夜间停车包',
      targetedUserTag: '夜间用户',
      releaseCount: 2500,
      releaseWay: 'APP推送',
      releaseTime: '2025-01-22 11:10:30',
      receiveCount: 1800,
      receiveRate: '72%',
      releaseStatus: '已完成'
    },
    {
      releaseId: 'RL007',
      packageSelection: '商务出行包',
      targetedUserTag: '商务用户',
      releaseCount: 1000,
      releaseWay: '短信',
      releaseTime: '2025-01-25 13:25:40',
      receiveCount: 850,
      receiveRate: '85%',
      releaseStatus: '已完成'
    },
    {
      releaseId: 'RL008',
      packageSelection: '学生专享包',
      targetedUserTag: '学生用户',
      releaseCount: 1500,
      releaseWay: 'APP推送',
      releaseTime: '2025-01-28 09:50:25',
      receiveCount: 1300,
      receiveRate: '86.7%',
      releaseStatus: '已完成'
    },
    {
      releaseId: 'RL009',
      packageSelection: '会员专享包',
      targetedUserTag: '会员用户',
      releaseCount: 2000,
      releaseWay: '短信+APP推送',
      releaseTime: '2025-02-01 15:15:10',
      receiveCount: 1700,
      receiveRate: '85%',
      releaseStatus: '已完成'
    },
    {
      releaseId: 'RL010',
      packageSelection: '春节优惠套餐',
      targetedUserTag: '家庭用户',
      releaseCount: 1000,
      releaseWay: '短信',
      releaseTime: '2025-02-05 10:30:50',
      receiveCount: 800,
      receiveRate: '80%',
      releaseStatus: '进行中'
    },
    {
      releaseId: 'RL011',
      packageSelection: '周末特惠包',
      targetedUserTag: '年轻用户',
      releaseCount: 1500,
      releaseWay: 'APP推送',
      releaseTime: '2025-02-08 14:20:15',
      receiveCount: 600,
      receiveRate: '40%',
      releaseStatus: '进行中'
    },
    {
      releaseId: 'RL012',
      packageSelection: '新人专享包',
      targetedUserTag: '新用户',
      releaseCount: 3000,
      releaseWay: '短信',
      releaseTime: '2025-02-10 09:40:30',
      receiveCount: 0,
      receiveRate: '0%',
      releaseStatus: '未开始'
    }
  ];
};

/** 券包表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'packageId',
      label: '券包ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入券包ID',
      },
      rules: 'required'
    },
    {
      fieldName: 'packageName',
      label: '券包名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入券包名称'
      },
      rules: 'required'
    },
    {
      fieldName: 'salePrice',
      label: '售价',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入售价',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'couponName',
      label: '包含优惠券',
      component: 'Input',
      componentProps: {
        placeholder: '请输入包含优惠券'
      },
      rules: 'required'
    },
    {
      fieldName: 'applyScope',
      label: '适用范围',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用范围'
      },
      rules: 'required'
    },
    {
      fieldName: 'validDays',
      label: '有效天数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入有效天数',
        min: 1
      },
      rules: 'required'
    },
    {
      fieldName: 'saleLimit',
      label: '售卖数量上限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入售卖数量上限',
        min: 1
      },
      rules: 'required'
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '上架', value: '上架' },
          { label: '下架', value: '下架' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'soldCount',
      label: '已售数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入已售数量',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'remainingCount',
      label: '剩余数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入剩余数量',
        min: 0
      },
      rules: 'required'
    }
  ];
}

/** 定向发放管理表单配置（包含所有指定字段） */
export function useReleaseFormSchema() {
  return [
    {
      fieldName: 'releaseId',
      label: '发放ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发放ID',
      },
      rules: 'required'
    },
    {
      fieldName: 'packageSelection',
      label: '券包选择',
      component: 'Select',
      componentProps: {
        placeholder: '请选择券包',
        options: [
          { label: '春节优惠套餐', value: '春节优惠套餐' },
          { label: '周末特惠包', value: '周末特惠包' },
          { label: '月度畅行包', value: '月度畅行包' },
          { label: '新人专享包', value: '新人专享包' },
          { label: '工作日通勤包', value: '工作日通勤包' },
          { label: '节假日出行包', value: '节假日出行包' },
          { label: '季度尊享包', value: '季度尊享包' },
          { label: '夜间停车包', value: '夜间停车包' },
          { label: '商务出行包', value: '商务出行包' },
          { label: '学生专享包', value: '学生专享包' },
          { label: '家庭套餐', value: '家庭套餐' },
          { label: '会员专享包', value: '会员专享包' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'targetedUserTag',
      label: '定向用户标签',
      component: 'Select',
      componentProps: {
        placeholder: '请选择定向用户标签',
        options: [
          { label: '新用户', value: '新用户' },
          { label: '老用户', value: '老用户' },
          { label: '通勤用户', value: '通勤用户' },
          { label: '高频用户', value: '高频用户' },
          { label: '夜间用户', value: '夜间用户' },
          { label: '商务用户', value: '商务用户' },
          { label: '学生用户', value: '学生用户' },
          { label: '家庭用户', value: '家庭用户' },
          { label: '年轻用户', value: '年轻用户' },
          { label: '会员用户', value: '会员用户' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'releaseCount',
      label: '发放数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入发放数量',
        min: 1
      },
      rules: 'required'
    },
    {
      fieldName: 'releaseWay',
      label: '发放方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择发放方式',
        options: [
          { label: '短信', value: '短信' },
          { label: 'APP推送', value: 'APP推送' },
          { label: '短信+APP推送', value: '短信+APP推送' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'releaseTime',
      label: '发放时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择发放时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'receiveCount',
      label: '领取数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入领取数量',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'receiveRate',
      label: '领取率',
      component: 'Input',
      componentProps: {
        placeholder: '请输入领取率'
      },
      rules: 'required'
    },
    {
      fieldName: 'releaseStatus',
      label: '发放状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择发放状态',
        options: [
          { label: '未开始', value: '未开始' },
          { label: '进行中', value: '进行中' },
          { label: '已完成', value: '已完成' },
          { label: '已暂停', value: '已暂停' }
        ]
      },
      rules: 'required'
    }
  ];
}

/** 券包表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'packageId',
      title: '券包ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' }
    },
    {
      field: 'packageName',
      title: '券包名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'packageName' }
    },
    {
      field: 'salePrice',
      title: '售价',
      minWidth: 80,
      sortable: true
    },
    {
      field: 'couponName',
      title: '包含优惠券',
      minWidth: 200,
      sortable: true,
      slots: { default: 'couponName' }
    },
    {
      field: 'applyScope',
      title: '适用范围',
      minWidth: 150,
      sortable: true,
      slots: { default: 'applyScope' }
    },
    {
      field: 'validDays',
      title: '有效天数',
      minWidth: 80,
      sortable: true
    },
    {
      field: 'saleLimit',
      title: '售卖数量上限',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' }
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'soldCount',
      title: '已售数量',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'remainingCount',
      title: '剩余数量',
      minWidth: 100,
      sortable: true
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

/** 定向发放管理表格列配置 */
export function useReleaseGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'releaseId',
      title: '发放ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'id' }
    },
    {
      field: 'packageSelection',
      title: '券包选择',
      minWidth: 150,
      sortable: true,
      slots: { default: 'packageSelection' }
    },
    {
      field: 'targetedUserTag',
      title: '定向用户标签',
      minWidth: 150,
      sortable: true,
      slots: { default: 'targetedUserTag' }
    },
    {
      field: 'releaseCount',
      title: '发放数量',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'releaseWay',
      title: '发放方式',
      minWidth: 120,
      sortable: true,
      slots: { default: 'releaseWay' }
    },
    {
      field: 'releaseTime',
      title: '发放时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'receiveCount',
      title: '领取数量',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'receiveRate',
      title: '领取率',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'releaseStatus',
      title: '发放状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' }
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

/** 定向发放管理详情抽屉字段配置 */
export const releaseDetailFields = [
  { key: 'releaseId', label: '发放ID' },
  { key: 'packageSelection', label: '券包选择' },
  { key: 'targetedUserTag', label: '定向用户标签' },
  { key: 'releaseCount', label: '发放数量' },
  { key: 'releaseWay', label: '发放方式' },
  { key: 'releaseTime', label: '发放时间' },
  { key: 'receiveCount', label: '领取数量' },
  { key: 'receiveRate', label: '领取率' },
  { key: 'releaseStatus', label: '发放状态' }
];


export const textObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑券包',
  addText: '新增券包',
  // 导出Excel相关文本
  excelName: '券包列表',
  excelAllName: '全市券包数据.xlsx',
  // 统计总计文本
  total: ' 总计: 券包数量12;总售卖数量:10550;剩余数量:7450',
};

export const releaseTextObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑定向发放',
  addText: '新增定向发放',
  // 导出Excel相关文本
  excelName: '定向发放列表',
  excelAllName: '全市定向发放数据.xlsx',
  // 统计总计文本
  total: ' 总计: 发放记录12;总发放数量:24000;总领取数量:18950',
};

/** 使用记录查询表格初始数据 - 按指定字段生成 */
export const useDataList = () => {
  return [
    {
      useId: 'UR001',
      packageName: '春节优惠套餐',
      userPhone: '13800138001',
      userName: '张三',
      couponName: '满50减20优惠券',
      useTime: '2025-01-15 10:30:45',
      useStatus: '已使用',
      lotName: '中央商务区停车场',
      deductAmount: 20
    },
    {
      useId: 'UR002',
      packageName: '周末特惠包',
      userPhone: '13800138002',
      userName: '李四',
      couponName: '满30减10优惠券',
      useTime: '2025-01-16 14:20:15',
      useStatus: '已使用',
      lotName: '西湖景区停车场',
      deductAmount: 10
    },
    {
      useId: 'UR003',
      packageName: '新人专享包',
      userPhone: '13800138003',
      userName: '王五',
      couponName: '满20减15优惠券',
      useTime: '2025-01-17 09:15:30',
      useStatus: '已使用',
      lotName: '高铁站停车场',
      deductAmount: 15
    },
    {
      useId: 'UR004',
      packageName: '工作日通勤包',
      userPhone: '13800138004',
      userName: '赵六',
      couponName: '满80减40优惠券',
      useTime: '2025-01-18 18:45:20',
      useStatus: '已使用',
      lotName: '科技园停车场',
      deductAmount: 40
    },
    {
      useId: 'UR005',
      packageName: '节假日出行包',
      userPhone: '13800138005',
      userName: '孙七',
      couponName: '满40减20优惠券',
      useTime: '2025-01-19 11:30:10',
      useStatus: '已使用',
      lotName: '主题公园停车场',
      deductAmount: 20
    },
    {
      useId: 'UR006',
      packageName: '夜间停车包',
      userPhone: '13800138006',
      userName: '周八',
      couponName: '满30减15优惠券',
      useTime: '2025-01-20 20:15:45',
      useStatus: '已使用',
      lotName: '市中心停车场',
      deductAmount: 15
    },
    {
      useId: 'UR007',
      packageName: '商务出行包',
      userPhone: '13800138007',
      userName: '吴九',
      couponName: '满60减30优惠券',
      useTime: '2025-01-21 16:20:30',
      useStatus: '已使用',
      lotName: '商务中心停车场',
      deductAmount: 30
    },
    {
      useId: 'UR008',
      packageName: '学生专享包',
      userPhone: '13800138008',
      userName: '郑十',
      couponName: '满25减12优惠券',
      useTime: '2025-01-22 14:10:20',
      useStatus: '已使用',
      lotName: '大学城停车场',
      deductAmount: 12
    },
    {
      useId: 'UR009',
      packageName: '会员专享包',
      userPhone: '13800138009',
      userName: '王十一',
      couponName: '满45减22优惠券',
      useTime: '2025-01-23 10:45:15',
      useStatus: '已使用',
      lotName: '购物中心停车场',
      deductAmount: 22
    },
    {
      useId: 'UR010',
      packageName: '春节优惠套餐',
      userPhone: '13800138010',
      userName: '李十二',
      couponName: '满100减50优惠券',
      useTime: '2025-01-24 15:30:40',
      useStatus: '已使用',
      lotName: '机场停车场',
      deductAmount: 50
    },
    {
      useId: 'UR011',
      packageName: '周末特惠包',
      userPhone: '13800138011',
      userName: '张十三',
      couponName: '满60减25优惠券',
      useTime: '2025-01-25 12:15:25',
      useStatus: '已使用',
      lotName: '景区停车场',
      deductAmount: 25
    },
    {
      useId: 'UR012',
      packageName: '新人专享包',
      userPhone: '13800138012',
      userName: '刘十四',
      couponName: '满50减25优惠券',
      useTime: '2025-01-26 08:50:10',
      useStatus: '已使用',
      lotName: '地铁站停车场',
      deductAmount: 25
    },
    {
      useId: 'UR013',
      packageName: '工作日通勤包',
      userPhone: '13800138013',
      userName: '陈十五',
      couponName: '满150减75优惠券',
      useTime: '2025-01-27 19:20:35',
      useStatus: '已使用',
      lotName: '办公区停车场',
      deductAmount: 75
    }
  ];
};

/** 使用记录查询表单配置（包含所有指定字段） */
export function useUseFormSchema() {
  return [
    {
      fieldName: 'useId',
      label: '使用记录ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入使用记录ID',
      },
      rules: 'required'
    },
    {
      fieldName: 'packageName',
      label: '券包名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入券包名称'
      },
      rules: 'required'
    },
    {
      fieldName: 'userPhone',
      label: '用户手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户手机号'
      },
      rules: 'required'
    },
    {
      fieldName: 'userName',
      label: '用户姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户姓名'
      },
      rules: 'required'
    },
    {
      fieldName: 'couponName',
      label: '优惠券名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入优惠券名称'
      },
      rules: 'required'
    },
    {
      fieldName: 'useTime',
      label: '使用时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择使用时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'useStatus',
      label: '使用状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择使用状态',
        options: [
          { label: '已使用', value: '已使用' },
          { label: '未使用', value: '未使用' },
          { label: '已过期', value: '已过期' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'lotName',
      label: '使用车场',
      component: 'Input',
      componentProps: {
        placeholder: '请输入使用车场'
      },
      rules: 'required'
    },
    {
      fieldName: 'deductAmount',
      label: '抵扣金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入抵扣金额',
        min: 0
      },
      rules: 'required'
    }
  ];
}

/** 使用记录查询表格列配置 */
export function useUseGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'useId',
      title: '使用记录ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'id' }
    },
    {
      field: 'packageName',
      title: '券包名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'packageName' }
    },
    {
      field: 'userPhone',
      title: '用户手机号',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return maskPhone(cellValue);
      },
    },
    {
      field: 'userName',
      title: '用户姓名',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'couponName',
      title: '优惠券名称',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'useTime',
      title: '使用时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'useStatus',
      title: '使用状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' }
    },
    {
      field: 'lotName',
      title: '使用车场',
      minWidth: 150,
      sortable: true,
      slots: { default: 'lotName' }
    },
    {
      field: 'deductAmount',
      title: '抵扣金额',
      minWidth: 100,
      sortable: true
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

/** 使用记录查询详情抽屉字段配置 */
export const useDetailFields = [
  { key: 'useId', label: '使用记录ID' },
  { key: 'packageName', label: '券包名称' },
  { key: 'userPhone', label: '用户手机号', formatter: maskPhone },
  { key: 'userName', label: '用户姓名' },
  { key: 'couponName', label: '优惠券名称' },
  { key: 'useTime', label: '使用时间' },
  { key: 'useStatus', label: '使用状态' },
  { key: 'lotName', label: '使用车场' },
  { key: 'deductAmount', label: '抵扣金额' }
];

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'packageId', label: '券包ID' },
  { key: 'packageName', label: '券包名称' },
  { key: 'salePrice', label: '售价' },
  { key: 'couponName', label: '包含优惠券' },
  { key: 'applyScope', label: '适用范围' },
  { key: 'validDays', label: '有效天数' },
  { key: 'saleLimit', label: '售卖数量上限' },
  { key: 'status', label: '状态' },
  { key: 'createTime', label: '创建时间' },
  { key: 'soldCount', label: '已售数量' },
  { key: 'remainingCount', label: '剩余数量' }
];

export const useTextObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑使用记录',
  addText: '新增使用记录',
  // 导出Excel相关文本
  excelName: '使用记录列表',
  excelAllName: '全市使用记录数据.xlsx',
  // 统计总计文本
  total: ' 总计: 使用记录13;总抵扣金额:489',
};

/** 领取用户列表静态数据 */
export const receiveUserList = (releaseId) => {
  const baseList = [
    {
      userId: 'U001',
      userName: '张三',
      userPhone: '13800138001',
      receiveTime: '2025-01-15 10:30:45',
      status: '已领取'
    },
    {
      userId: 'U002',
      userName: '李四',
      userPhone: '13800138002',
      receiveTime: '2025-01-15 11:20:15',
      status: '已领取'
    },
    {
      userId: 'U003',
      userName: '王五',
      userPhone: '13800138003',
      receiveTime: '2025-01-15 12:10:30',
      status: '已领取'
    },
    {
      userId: 'U004',
      userName: '赵六',
      userPhone: '13800138004',
      receiveTime: '2025-01-15 13:45:20',
      status: '已领取'
    },
    {
      userId: 'U005',
      userName: '孙七',
      userPhone: '13800138005',
      receiveTime: '2025-01-15 14:30:10',
      status: '已领取'
    }
  ];

  // 根据releaseId返回不同的数据，模拟不同发放记录的领取用户
  return baseList.map((item, index) => ({
    ...item,
    id: `${releaseId}-U${String(index + 1).padStart(3, '0')}`
  }));
};

/** 关联订单详情静态数据 */
export const orderDetailList = (useId) => {
  return [
    {
      orderId: `ORD${useId.substring(2)}`,
      orderTime: '2025-01-15 10:30:45',
      totalAmount: 100,
      deductAmount: 20,
      actualAmount: 80,
      payStatus: '已支付',
      lotName: '中央商务区停车场',
      parkingTime: '2025-01-15 08:30:00',
      leaveTime: '2025-01-15 10:30:00',
      couponName: '满50减20优惠券'
    }
  ];
};

