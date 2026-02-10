/** 退款订单表格初始数据 - 按指定字段生成 */
export const dataList = (tabType = 'refundApply') => {
  if (tabType === 'refundRecord') {
    return [
      {
        id: 'RR001', // 退款记录ID
        refundNo: 'RF202501100001', // 退款单号
        originalOrderNo: 'OR202501100001', // 原订单编号
        userName: '张三', // 用户姓名
        carNumber: '闽A12345', // 车牌号码
        refundAmount: '100.00', // 退款金额
        refundReasonName: '重复缴费', // 退款原因
        applyTime: '2025-01-10 09:30:00', // 申请时间
        payTypeName: '微信支付', // 退款方式
        approveStatusName: '已通过', // 审批状态
        refundStatusName: '已退款', // 退款状态
        approveTime: '2025-01-10 10:00:00', // 审批时间
        refundTime: '2025-01-10 10:30:00', // 退款时间
        arrivalTime: '2025-01-10 11:00:00', // 到账时间
      },
      {
        id: 'RR002',
        refundNo: 'RF202501110002',
        originalOrderNo: 'OR202501110002',
        userName: '李四',
        carNumber: '闽B67890',
        refundAmount: '50.00',
        refundReasonName: '停车时间有误',
        applyTime: '2025-01-11 13:30:00',
        payTypeName: '支付宝',
        approveStatusName: '已通过',
        refundStatusName: '已退款',
        approveTime: '2025-01-11 14:00:00',
        refundTime: '2025-01-11 14:20:00',
        arrivalTime: '2025-01-11 14:45:00',
      },
      {
        id: 'RR003',
        refundNo: 'RF202501120003',
        originalOrderNo: 'OR202501120003',
        userName: '王五',
        carNumber: '闽C24680',
        refundAmount: '150.00',
        refundReasonName: '系统故障',
        applyTime: '2025-01-12 08:30:00',
        payTypeName: '微信支付',
        approveStatusName: '已拒绝',
        refundStatusName: '退款失败',
        approveTime: '2025-01-12 09:15:00',
        refundTime: '',
        arrivalTime: '',
      },
      {
        id: 'RR004',
        refundNo: 'RF202501130004',
        originalOrderNo: 'OR202501130004',
        userName: '赵六',
        carNumber: '闽D13579',
        refundAmount: '80.00',
        refundReasonName: '收费标准不符',
        applyTime: '2025-01-13 15:30:00',
        payTypeName: '支付宝',
        approveStatusName: '待审批',
        refundStatusName: '待退款',
        approveTime: '',
        refundTime: '',
        arrivalTime: '',
      },
      {
        id: 'RR005',
        refundNo: 'RF202501140005',
        originalOrderNo: 'OR202501140005',
        userName: '孙七',
        carNumber: '闽E54321',
        refundAmount: '120.00',
        refundReasonName: '重复缴费',
        applyTime: '2025-01-14 15:40:00',
        payTypeName: '微信支付',
        approveStatusName: '已通过',
        refundStatusName: '已退款',
        approveTime: '2025-01-14 16:10:00',
        refundTime: '2025-01-14 16:40:00',
        arrivalTime: '2025-01-14 17:00:00',
      },
      {
        id: 'RR006',
        refundNo: 'RF202501150006',
        originalOrderNo: 'OR202501150006',
        userName: '周八',
        carNumber: '闽F98765',
        refundAmount: '60.00',
        refundReasonName: '停车时间有误',
        applyTime: '2025-01-15 10:30:00',
        payTypeName: '支付宝',
        approveStatusName: '已通过',
        refundStatusName: '已退款',
        approveTime: '2025-01-15 11:00:00',
        refundTime: '2025-01-15 11:25:00',
        arrivalTime: '2025-01-15 11:50:00',
      },
      {
        id: 'RR007',
        refundNo: 'RF202501160007',
        originalOrderNo: 'OR202501160007',
        userName: '吴九',
        carNumber: '闽G36925',
        refundAmount: '90.00',
        refundReasonName: '系统故障',
        applyTime: '2025-01-16 13:30:00',
        payTypeName: '微信支付',
        approveStatusName: '待审批',
        refundStatusName: '待退款',
        approveTime: '',
        refundTime: '',
        arrivalTime: '',
      },
      {
        id: 'RR008',
        refundNo: 'RF202501170008',
        originalOrderNo: 'OR202501170008',
        userName: '郑十',
        carNumber: '闽H75315',
        refundAmount: '110.00',
        refundReasonName: '收费标准不符',
        applyTime: '2025-01-17 12:30:00',
        payTypeName: '支付宝',
        approveStatusName: '已拒绝',
        refundStatusName: '退款失败',
        approveTime: '2025-01-17 13:50:00',
        refundTime: '',
        arrivalTime: '',
      },
      {
        id: 'RR009',
        refundNo: 'RF202501180009',
        originalOrderNo: 'OR202501180009',
        userName: '张三',
        carNumber: '闽J25846',
        refundAmount: '70.00',
        refundReasonName: '重复缴费',
        applyTime: '2025-01-18 08:30:00',
        payTypeName: '微信支付',
        approveStatusName: '已通过',
        refundStatusName: '已退款',
        approveTime: '2025-01-18 09:00:00',
        refundTime: '2025-01-18 09:30:00',
        arrivalTime: '2025-01-18 10:00:00',
      },
      {
        id: 'RR010',
        refundNo: 'RF202501190010',
        originalOrderNo: 'OR202501190010',
        userName: '李四',
        carNumber: '闽K65432',
        refundAmount: '130.00',
        refundReasonName: '停车时间有误',
        applyTime: '2025-01-19 14:30:00',
        payTypeName: '支付宝',
        approveStatusName: '已通过',
        refundStatusName: '已退款',
        approveTime: '2025-01-19 15:00:00',
        refundTime: '2025-01-19 15:15:00',
        arrivalTime: '2025-01-19 15:40:00',
      },
      {
        id: 'RR011',
        refundNo: 'RF202501200011',
        originalOrderNo: 'OR202501200011',
        userName: '王五',
        carNumber: '闽L98712',
        refundAmount: '85.00',
        refundReasonName: '系统故障',
        applyTime: '2025-01-20 15:45:00',
        payTypeName: '微信支付',
        approveStatusName: '待审批',
        refundStatusName: '待退款',
        approveTime: '',
        refundTime: '',
        arrivalTime: '',
      },
      {
        id: 'RR012',
        refundNo: 'RF202501210012',
        originalOrderNo: 'OR202501210012',
        userName: '赵六',
        carNumber: '闽M32165',
        refundAmount: '95.00',
        refundReasonName: '收费标准不符',
        applyTime: '2025-01-21 09:45:00',
        payTypeName: '支付宝',
        approveStatusName: '已通过',
        refundStatusName: '已退款',
        approveTime: '2025-01-21 10:15:00',
        refundTime: '2025-01-21 10:45:00',
        arrivalTime: '2025-01-21 11:10:00',
      },
      {
        id: 'RR013',
        refundNo: 'RF202501220013',
        originalOrderNo: 'OR202501220013',
        userName: '孙七',
        carNumber: '闽N65498',
        refundAmount: '125.00',
        refundReasonName: '重复缴费',
        applyTime: '2025-01-22 13:30:00',
        payTypeName: '微信支付',
        approveStatusName: '已拒绝',
        refundStatusName: '退款失败',
        approveTime: '2025-01-22 14:30:00',
        refundTime: '',
        arrivalTime: '',
      },
      {
        id: 'RR014',
        refundNo: 'RF202501230014',
        originalOrderNo: 'OR202501230014',
        userName: '周八',
        carNumber: '闽O12378',
        refundAmount: '65.00',
        refundReasonName: '停车时间有误',
        applyTime: '2025-01-23 14:40:00',
        payTypeName: '支付宝',
        approveStatusName: '待审批',
        refundStatusName: '待退款',
        approveTime: '',
        refundTime: '',
        arrivalTime: '',
      },
      {
        id: 'RR015',
        refundNo: 'RF202501240015',
        originalOrderNo: 'OR202501240015',
        userName: '吴九',
        carNumber: '闽P98732',
        refundAmount: '105.00',
        refundReasonName: '系统故障',
        applyTime: '2025-01-24 10:50:00',
        payTypeName: '微信支付',
        approveStatusName: '已通过',
        refundStatusName: '已退款',
        approveTime: '2025-01-24 11:20:00',
        refundTime: '2025-01-24 11:50:00',
        arrivalTime: '2025-01-24 12:15:00',
      },
    ];
  } else if (tabType === 'amountCalculate') {
    return [
      {
        id: 'AC001', // 金额核算ID
        refundNo: 'RF202501100001', // 退款单号
        originalOrderNo: 'OR202501100001', // 原订单编号
        orderTypeName: '停车费', // 订单类型
        originalAmount: '200.00', // 原订单金额
        usedAmount: '100.00', // 已使用金额
        serviceFee: '5.00', // 手续费
        discountShare: '10.00', // 优惠分摊金额
        calculator: '张三', // 核算人
        refundAmount: '85.00', // 应退金额
        calculateResult: '核算通过', // 核算结果
        calculateTime: '2025-01-10 09:30:00', // 核算时间
        remark: '正常退款', // 备注
      },
      {
        id: 'AC002',
        refundNo: 'RF202501110002',
        originalOrderNo: 'OR202501110002',
        orderTypeName: '停车费',
        originalAmount: '150.00',
        usedAmount: '100.00',
        serviceFee: '3.00',
        discountShare: '5.00',
        calculator: '李四',
        refundAmount: '42.00',
        calculateResult: '核算通过',
        calculateTime: '2025-01-11 13:20:00',
        remark: '正常退款',
      },
      {
        id: 'AC003',
        refundNo: 'RF202501120003',
        originalOrderNo: 'OR202501120003',
        orderTypeName: '停车费',
        originalAmount: '300.00',
        usedAmount: '150.00',
        serviceFee: '8.00',
        discountShare: '15.00',
        calculator: '王五',
        refundAmount: '127.00',
        calculateResult: '核算驳回',
        calculateTime: '2025-01-12 08:15:00',
        remark: '金额计算错误',
      },
      {
        id: 'AC004',
        refundNo: 'RF202501130004',
        originalOrderNo: 'OR202501130004',
        orderTypeName: '停车费',
        originalAmount: '180.00',
        usedAmount: '100.00',
        serviceFee: '4.00',
        discountShare: '8.00',
        calculator: '赵六',
        refundAmount: '68.00',
        calculateResult: '核算通过',
        calculateTime: '2025-01-13 15:30:00',
        remark: '正常退款',
      },
      {
        id: 'AC005',
        refundNo: 'RF202501140005',
        originalOrderNo: 'OR202501140005',
        orderTypeName: '停车费',
        originalAmount: '250.00',
        usedAmount: '130.00',
        serviceFee: '6.00',
        discountShare: '12.00',
        calculator: '孙七',
        refundAmount: '102.00',
        calculateResult: '核算驳回',
        calculateTime: '2025-01-14 14:40:00',
        remark: '缺少凭证',
      },
      {
        id: 'AC006',
        refundNo: 'RF202501150006',
        originalOrderNo: 'OR202501150006',
        orderTypeName: '停车费',
        originalAmount: '120.00',
        usedAmount: '60.00',
        serviceFee: '2.00',
        discountShare: '3.00',
        calculator: '周八',
        refundAmount: '55.00',
        calculateResult: '核算通过',
        calculateTime: '2025-01-15 10:25:00',
        remark: '正常退款',
      },
      {
        id: 'AC007',
        refundNo: 'RF202501160007',
        originalOrderNo: 'OR202501160007',
        orderTypeName: '停车费',
        originalAmount: '220.00',
        usedAmount: '130.00',
        serviceFee: '5.00',
        discountShare: '10.00',
        calculator: '吴九',
        refundAmount: '75.00',
        calculateResult: '核算通过',
        calculateTime: '2025-01-16 13:30:00',
        remark: '正常退款',
      },
      {
        id: 'AC008',
        refundNo: 'RF202501170008',
        originalOrderNo: 'OR202501170008',
        orderTypeName: '停车费',
        originalAmount: '280.00',
        usedAmount: '170.00',
        serviceFee: '7.00',
        discountShare: '15.00',
        calculator: '郑十',
        refundAmount: '88.00',
        calculateResult: '核算驳回',
        calculateTime: '2025-01-17 12:50:00',
        remark: '金额计算错误',
      },
      {
        id: 'AC009',
        refundNo: 'RF202501180009',
        originalOrderNo: 'OR202501180009',
        orderTypeName: '停车费',
        originalAmount: '160.00',
        usedAmount: '90.00',
        serviceFee: '3.00',
        discountShare: '7.00',
        calculator: '张三',
        refundAmount: '60.00',
        calculateResult: '核算通过',
        calculateTime: '2025-01-18 08:30:00',
        remark: '正常退款',
      },
      {
        id: 'AC010',
        refundNo: 'RF202501190010',
        originalOrderNo: 'OR202501190010',
        orderTypeName: '停车费',
        originalAmount: '300.00',
        usedAmount: '170.00',
        serviceFee: '8.00',
        discountShare: '15.00',
        calculator: '李四',
        refundAmount: '107.00',
        calculateResult: '核算驳回',
        calculateTime: '2025-01-19 14:15:00',
        remark: '缺少凭证',
      },
      {
        id: 'AC011',
        refundNo: 'RF202501200011',
        originalOrderNo: 'OR202501200011',
        orderTypeName: '停车费',
        originalAmount: '190.00',
        usedAmount: '105.00',
        serviceFee: '4.00',
        discountShare: '8.00',
        calculator: '王五',
        refundAmount: '73.00',
        calculateResult: '核算通过',
        calculateTime: '2025-01-20 15:45:00',
        remark: '正常退款',
      },
      {
        id: 'AC012',
        refundNo: 'RF202501210012',
        originalOrderNo: 'OR202501210012',
        orderTypeName: '停车费',
        originalAmount: '180.00',
        usedAmount: '85.00',
        serviceFee: '3.00',
        discountShare: '7.00',
        calculator: '赵六',
        refundAmount: '85.00',
        calculateResult: '核算通过',
        calculateTime: '2025-01-21 09:45:00',
        remark: '正常退款',
      },
      {
        id: 'AC013',
        refundNo: 'RF202501220013',
        originalOrderNo: 'OR202501220013',
        orderTypeName: '停车费',
        originalAmount: '250.00',
        usedAmount: '125.00',
        serviceFee: '6.00',
        discountShare: '12.00',
        calculator: '孙七',
        refundAmount: '107.00',
        calculateResult: '核算驳回',
        calculateTime: '2025-01-22 13:30:00',
        remark: '金额计算错误',
      },
      {
        id: 'AC014',
        refundNo: 'RF202501230014',
        originalOrderNo: 'OR202501230014',
        orderTypeName: '停车费',
        originalAmount: '140.00',
        usedAmount: '75.00',
        serviceFee: '2.00',
        discountShare: '3.00',
        calculator: '周八',
        refundAmount: '60.00',
        calculateResult: '核算通过',
        calculateTime: '2025-01-23 14:40:00',
        remark: '正常退款',
      },
      {
        id: 'AC015',
        refundNo: 'RF202501240015',
        originalOrderNo: 'OR202501240015',
        orderTypeName: '停车费',
        originalAmount: '220.00',
        usedAmount: '115.00',
        serviceFee: '5.00',
        discountShare: '10.00',
        calculator: '吴九',
        refundAmount: '90.00',
        calculateResult: '核算驳回',
        calculateTime: '2025-01-24 10:50:00',
        remark: '缺少凭证',
      },
    ];
  }

  return [
    {
      id: 'R001', // 退款订单ID
      refundNo: 'RF202501100001', // 退款单号
      originalOrderNo: 'OR202501100001', // 原订单编号
      carNumber: '闽A12345', // 车牌号码
      refundAmount: '100.00', // 退款金额
      refundReasonName: '重复缴费', // 退款原因
      proofFiles: '截图1.jpg,截图2.jpg', // 佐证材料
      applicantName: '张三', // 申请人
      contactPhone: '13800138001', // 联系电话
      approveStatusName: '已通过', // 审批状态
      refundStatusName: '已退款', // 退款状态
      approveOpinion: '同意退款', // 审批意见
      refundTime: '2025-01-10 10:30:00', // 退款时间
      arrivalTime: '2025-01-10 11:00:00', // 到账时间
    },
    {
      id: 'R002',
      refundNo: 'RF202501110002',
      originalOrderNo: 'OR202501110002',
      carNumber: '闽B67890',
      refundAmount: '50.00',
      refundReasonName: '停车时间有误',
      proofFiles: '截图3.jpg',
      applicantName: '李四',
      contactPhone: '13900139002',
      approveStatusName: '已通过',
      refundStatusName: '已退款',
      approveOpinion: '同意退款',
      refundTime: '2025-01-11 14:20:00',
      arrivalTime: '2025-01-11 14:45:00',
    },
    {
      id: 'R003',
      refundNo: 'RF202501120003',
      originalOrderNo: 'OR202501120003',
      carNumber: '闽C24680',
      refundAmount: '150.00',
      refundReasonName: '系统故障',
      proofFiles: '截图4.jpg,截图5.jpg',
      applicantName: '王五',
      contactPhone: '13700137003',
      approveStatusName: '已拒绝',
      refundStatusName: '退款失败',
      approveOpinion: '证据不足，暂不退款',
      refundTime: '2025-01-12 09:15:00',
      arrivalTime: '',
    },
    {
      id: 'R004',
      refundNo: 'RF202501130004',
      originalOrderNo: 'OR202501130004',
      carNumber: '闽D13579',
      refundAmount: '80.00',
      refundReasonName: '收费标准不符',
      proofFiles: '截图6.jpg',
      applicantName: '赵六',
      contactPhone: '13600136004',
      approveStatusName: '待审批',
      refundStatusName: '待退款',
      approveOpinion: '',
      refundTime: '',
      arrivalTime: '',
    },
    {
      id: 'R005',
      refundNo: 'RF202501140005',
      originalOrderNo: 'OR202501140005',
      carNumber: '闽E54321',
      refundAmount: '120.00',
      refundReasonName: '重复缴费',
      proofFiles: '截图7.jpg,截图8.jpg',
      applicantName: '孙七',
      contactPhone: '13500135005',
      approveStatusName: '已通过',
      refundStatusName: '已退款',
      approveOpinion: '同意退款',
      refundTime: '2025-01-14 16:40:00',
      arrivalTime: '2025-01-14 17:00:00',
    },
    {
      id: 'R006',
      refundNo: 'RF202501150006',
      originalOrderNo: 'OR202501150006',
      carNumber: '闽F98765',
      refundAmount: '60.00',
      refundReasonName: '停车时间有误',
      proofFiles: '截图9.jpg',
      applicantName: '周八',
      contactPhone: '13400134006',
      approveStatusName: '已通过',
      refundStatusName: '已退款',
      approveOpinion: '同意退款',
      refundTime: '2025-01-15 11:25:00',
      arrivalTime: '2025-01-15 11:50:00',
    },
    {
      id: 'R007',
      refundNo: 'RF202501160007',
      originalOrderNo: 'OR202501160007',
      carNumber: '闽G36925',
      refundAmount: '90.00',
      refundReasonName: '系统故障',
      proofFiles: '截图10.jpg,截图11.jpg',
      applicantName: '吴九',
      contactPhone: '13300133007',
      approveStatusName: '待审批',
      refundStatusName: '待退款',
      approveOpinion: '',
      refundTime: '',
      arrivalTime: '',
    },
    {
      id: 'R008',
      refundNo: 'RF202501170008',
      originalOrderNo: 'OR202501170008',
      carNumber: '闽H75315',
      refundAmount: '110.00',
      refundReasonName: '收费标准不符',
      proofFiles: '截图12.jpg',
      applicantName: '郑十',
      contactPhone: '13200132008',
      approveStatusName: '已拒绝',
      refundStatusName: '退款失败',
      approveOpinion: '证据不足，暂不退款',
      refundTime: '2025-01-17 13:50:00',
      arrivalTime: '',
    },
    {
      id: 'R009',
      refundNo: 'RF202501180009',
      originalOrderNo: 'OR202501180009',
      carNumber: '闽J25846',
      refundAmount: '70.00',
      refundReasonName: '重复缴费',
      proofFiles: '截图13.jpg,截图14.jpg',
      applicantName: '张三',
      contactPhone: '13800138009',
      approveStatusName: '已通过',
      refundStatusName: '已退款',
      approveOpinion: '同意退款',
      refundTime: '2025-01-18 09:30:00',
      arrivalTime: '2025-01-18 10:00:00',
    },
    {
      id: 'R010',
      refundNo: 'RF202501190010',
      originalOrderNo: 'OR202501190010',
      carNumber: '闽K65432',
      refundAmount: '130.00',
      refundReasonName: '停车时间有误',
      proofFiles: '截图15.jpg',
      applicantName: '李四',
      contactPhone: '13900139010',
      approveStatusName: '已通过',
      refundStatusName: '已退款',
      approveOpinion: '同意退款',
      refundTime: '2025-01-19 15:15:00',
      arrivalTime: '2025-01-19 15:40:00',
    },
    {
      id: 'R011',
      refundNo: 'RF202501200011',
      originalOrderNo: 'OR202501200011',
      carNumber: '闽L98712',
      refundAmount: '85.00',
      refundReasonName: '系统故障',
      proofFiles: '截图16.jpg,截图17.jpg',
      applicantName: '王五',
      contactPhone: '13700137011',
      approveStatusName: '待审批',
      refundStatusName: '待退款',
      approveOpinion: '',
      refundTime: '',
      arrivalTime: '',
    },
    {
      id: 'R012',
      refundNo: 'RF202501210012',
      originalOrderNo: 'OR202501210012',
      carNumber: '闽M32165',
      refundAmount: '95.00',
      refundReasonName: '收费标准不符',
      proofFiles: '截图18.jpg',
      applicantName: '赵六',
      contactPhone: '13600136012',
      approveStatusName: '已通过',
      refundStatusName: '已退款',
      approveOpinion: '同意退款',
      refundTime: '2025-01-21 10:45:00',
      arrivalTime: '2025-01-21 11:10:00',
    },
    {
      id: 'R013',
      refundNo: 'RF202501220013',
      originalOrderNo: 'OR202501220013',
      carNumber: '闽N65498',
      refundAmount: '125.00',
      refundReasonName: '重复缴费',
      proofFiles: '截图19.jpg,截图20.jpg',
      applicantName: '孙七',
      contactPhone: '13500135013',
      approveStatusName: '已拒绝',
      refundStatusName: '退款失败',
      approveOpinion: '证据不足，暂不退款',
      refundTime: '2025-01-22 14:30:00',
      arrivalTime: '',
    },
    {
      id: 'R014',
      refundNo: 'RF202501230014',
      originalOrderNo: 'OR202501230014',
      carNumber: '闽O12378',
      refundAmount: '65.00',
      refundReasonName: '停车时间有误',
      proofFiles: '截图21.jpg',
      applicantName: '周八',
      contactPhone: '13400134014',
      approveStatusName: '待审批',
      refundStatusName: '待退款',
      approveOpinion: '',
      refundTime: '',
      arrivalTime: '',
    },
    {
      id: 'R015',
      refundNo: 'RF202501240015',
      originalOrderNo: 'OR202501240015',
      carNumber: '闽P98732',
      refundAmount: '105.00',
      refundReasonName: '系统故障',
      proofFiles: '截图22.jpg,截图23.jpg',
      applicantName: '吴九',
      contactPhone: '13300133015',
      approveStatusName: '已通过',
      refundStatusName: '已退款',
      approveOpinion: '同意退款',
      refundTime: '2025-01-24 11:50:00',
      arrivalTime: '2025-01-24 12:15:00',
    },
  ];
};

/** 退款订单表单配置（包含所有指定字段） */
export function useFormSchema(tabType = 'refundApply') {
  if (tabType === 'refundRecord') {
    return [
      {
        fieldName: 'refundNo',
        label: '退款单号',
        component: 'Input',
        componentProps: {
          placeholder: '请输入退款单号',
        },
        rules: 'required',
      },
      {
        fieldName: 'originalOrderNo',
        label: '原订单编号',
        component: 'Input',
        componentProps: {
          placeholder: '请输入原订单编号',
        },
        rules: 'required',
      },
      {
        fieldName: 'userName',
        label: '用户姓名',
        component: 'Input',
        componentProps: {
          placeholder: '请输入用户姓名',
        },
        rules: 'required',
      },
      {
        fieldName: 'carNumber',
        label: '车牌号码',
        component: 'Input',
        componentProps: {
          placeholder: '请输入车牌号码',
        },
        rules: 'required',
      },
      {
        fieldName: 'refundAmount',
        label: '退款金额',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入退款金额',
          min: 0,
          step: 0.01,
          precision: 2,
        },
        rules: 'required',
      },
      {
        fieldName: 'refundReasonName',
        label: '退款原因',
        component: 'Select',
        componentProps: {
          placeholder: '请选择退款原因',
          options: [
            { label: '重复缴费', value: '重复缴费' },
            { label: '停车时间有误', value: '停车时间有误' },
            { label: '系统故障', value: '系统故障' },
            { label: '收费标准不符', value: '收费标准不符' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'applyTime',
        label: '申请时间',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择申请时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
        rules: 'required',
      },
      {
        fieldName: 'payTypeName',
        label: '退款方式',
        component: 'Select',
        componentProps: {
          placeholder: '请选择退款方式',
          options: [
            { label: '微信支付', value: '微信支付' },
            { label: '支付宝', value: '支付宝' },
            { label: '银行卡', value: '银行卡' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'approveStatusName',
        label: '审批状态',
        component: 'Select',
        componentProps: {
          placeholder: '请选择审批状态',
          options: [
            { label: '待审批', value: '待审批' },
            { label: '已通过', value: '已通过' },
            { label: '已拒绝', value: '已拒绝' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'refundStatusName',
        label: '退款状态',
        component: 'Select',
        componentProps: {
          placeholder: '请选择退款状态',
          options: [
            { label: '待退款', value: '待退款' },
            { label: '已退款', value: '已退款' },
            { label: '退款失败', value: '退款失败' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'approveTime',
        label: '审批时间',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择审批时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      {
        fieldName: 'refundTime',
        label: '退款时间',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择退款时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      {
        fieldName: 'arrivalTime',
        label: '到账时间',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择到账时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
      },
    ];
  } else if (tabType === 'amountCalculate') {
    return [
      {
        fieldName: 'refundNo',
        label: '退款单号',
        component: 'Input',
        componentProps: {
          placeholder: '请输入退款单号',
        },
        rules: 'required',
      },
      {
        fieldName: 'originalOrderNo',
        label: '原订单编号',
        component: 'Input',
        componentProps: {
          placeholder: '请输入原订单编号',
        },
        rules: 'required',
      },
      {
        fieldName: 'orderTypeName',
        label: '订单类型',
        component: 'Select',
        componentProps: {
          placeholder: '请选择订单类型',
          options: [
            { label: '停车费', value: '停车费' },
            { label: '服务费', value: '服务费' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'originalAmount',
        label: '原订单金额',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入原订单金额',
          min: 0,
          step: 0.01,
          precision: 2,
        },
        rules: 'required',
      },
      {
        fieldName: 'usedAmount',
        label: '已使用金额',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入已使用金额',
          min: 0,
          step: 0.01,
          precision: 2,
        },
        rules: 'required',
      },
      {
        fieldName: 'serviceFee',
        label: '手续费',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入手续费',
          min: 0,
          step: 0.01,
          precision: 2,
        },
        rules: 'required',
      },
      {
        fieldName: 'discountShare',
        label: '优惠分摊金额',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入优惠分摊金额',
          min: 0,
          step: 0.01,
          precision: 2,
        },
        rules: 'required',
      },
      {
        fieldName: 'calculator',
        label: '核算人',
        component: 'Input',
        componentProps: {
          placeholder: '请输入核算人',
        },
        rules: 'required',
      },
      {
        fieldName: 'refundAmount',
        label: '应退金额',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入应退金额',
          min: 0,
          step: 0.01,
          precision: 2,
        },
        rules: 'required',
      },
      {
        fieldName: 'calculateResult',
        label: '核算结果',
        component: 'Select',
        componentProps: {
          placeholder: '请选择核算结果',
          options: [
            { label: '核算通过', value: '核算通过' },
            { label: '核算驳回', value: '核算驳回' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'calculateTime',
        label: '核算时间',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择核算时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
        rules: 'required',
      },
      {
        fieldName: 'remark',
        label: '备注',
        component: 'Input',
        componentProps: {
          placeholder: '请输入备注',
          type: 'textarea',
          rows: 3,
        },
      },
    ];
  }

  return [
    {
      fieldName: 'refundNo',
      label: '退款单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入退款单号',
      },
      rules: 'required',
    },
    {
      fieldName: 'originalOrderNo',
      label: '原订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入原订单编号',
      },
      rules: 'required',
    },
    {
      fieldName: 'carNumber',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
      rules: 'required',
    },
    {
      fieldName: 'refundAmount',
      label: '退款金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入退款金额',
        min: 0,
        step: 0.01,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'refundReasonName',
      label: '退款原因',
      component: 'Select',
      componentProps: {
        placeholder: '请选择退款原因',
        options: [
          { label: '重复缴费', value: '重复缴费' },
          { label: '停车时间有误', value: '停车时间有误' },
          { label: '系统故障', value: '系统故障' },
          { label: '收费标准不符', value: '收费标准不符' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'proofFiles',
      label: '佐证材料',
      component: 'FileUpload',
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: '请上传佐证材料',
      },
      rules: 'required',
    },
    {
      fieldName: 'applicantName',
      label: '申请人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请人姓名',
      },
      rules: 'required',
    },
    {
      fieldName: 'contactPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
      },
      rules: 'required',
    },
    {
      fieldName: 'approveStatusName',
      label: '审批状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审批状态',
        options: [
          { label: '待审批', value: '待审批' },
          { label: '已通过', value: '已通过' },
          { label: '已拒绝', value: '已拒绝' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'refundStatusName',
      label: '退款状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择退款状态',
        options: [
          { label: '待退款', value: '待退款' },
          { label: '已退款', value: '已退款' },
          { label: '退款失败', value: '退款失败' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'approveOpinion',
      label: '审批意见',
      component: 'Input',
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: '请输入审批意见',
        type: 'textarea',
        rows: 3,
      },
    },
    {
      fieldName: 'refundTime',
      label: '退款时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择退款时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'arrivalTime',
      label: '到账时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择到账时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

/** 退款订单表格列配置 */
export function useGridColumns(tabType = 'refundApply') {
  if (tabType === 'refundRecord') {
    return [
      { type: 'checkbox', width: 40 },
      {
        field: 'refundNo',
        title: '退款单号',
        minWidth: 180,
        sortable: true,
        slots: { default: 'refundNo' },
      },
      {
        field: 'originalOrderNo',
        title: '原订单编号',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'userName',
        title: '用户姓名',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'carNumber',
        title: '车牌号码',
        minWidth: 120,
        sortable: true,
        slots: { default: 'carNumber' },
      },
      {
        field: 'refundAmount',
        title: '退款金额',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'refundReasonName',
        title: '退款原因',
        minWidth: 120,
        sortable: true,
        slots: { default: 'refundReasonName' },
      },
      {
        field: 'applyTime',
        title: '申请时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'payTypeName',
        title: '退款方式',
        minWidth: 120,
        sortable: true,
        slots: { default: 'payTypeName' },
      },
      {
        field: 'approveStatusName',
        title: '审批状态',
        minWidth: 120,
        sortable: true,
        slots: { default: 'approveStatusName' },
      },
      {
        field: 'refundStatusName',
        title: '退款状态',
        minWidth: 120,
        sortable: true,
        slots: { default: 'refundStatusName' },
      },
      {
        field: 'approveTime',
        title: '审批时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'refundTime',
        title: '退款时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'arrivalTime',
        title: '到账时间',
        minWidth: 180,
        sortable: true,
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        slots: { default: 'actions' },
      },
    ];
  } else if (tabType === 'amountCalculate') {
    return [
      { type: 'checkbox', width: 40 },
      {
        field: 'refundNo',
        title: '退款单号',
        minWidth: 180,
        sortable: true,
        slots: { default: 'refundNo' },
      },
      {
        field: 'originalOrderNo',
        title: '原订单编号',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'orderTypeName',
        title: '订单类型',
        minWidth: 120,
        sortable: true,
        slots: { default: 'orderTypeName' },
      },
      {
        field: 'originalAmount',
        title: '原订单金额',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'usedAmount',
        title: '已使用金额',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'serviceFee',
        title: '手续费',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'discountShare',
        title: '优惠分摊金额',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'calculator',
        title: '核算人',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'refundAmount',
        title: '应退金额',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'calculateResult',
        title: '核算结果',
        minWidth: 120,
        sortable: true,
        slots: { default: 'calculateResult' },
      },
      {
        field: 'calculateTime',
        title: '核算时间',
        minWidth: 180,
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

  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'refundNo',
      title: '退款单号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'refundNo' },
    },
    {
      field: 'originalOrderNo',
      title: '原订单编号',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'carNumber',
      title: '车牌号码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'carNumber' },
    },
    {
      field: 'refundAmount',
      title: '退款金额',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'refundReasonName',
      title: '退款原因',
      minWidth: 120,
      sortable: true,
      slots: { default: 'refundReasonName' },
    },
    {
      field: 'proofFiles',
      title: '佐证材料',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'applicantName',
      title: '申请人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'contactPhone',
      title: '联系电话',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'approveStatusName',
      title: '审批状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'approveStatusName' },
    },
    {
      field: 'refundStatusName',
      title: '退款状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'refundStatusName' },
    },
    {
      field: 'approveOpinion',
      title: '审批意见',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'refundTime',
      title: '退款时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'arrivalTime',
      title: '到账时间',
      minWidth: 180,
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

export function textObj(tabType = 'refundApply') {
  if (tabType === 'refundRecord') {
    return {
      // 操作类文本（对应编辑/新增）
      editText: '编辑退款记录',
      addText: '新增退款记录',
      // 导出Excel相关文本
      excelName: '退款记录列表',
      excelAllName: '退款记录数据.xlsx',
      // 统计总计文本
      total: ' 总计: 退款记录数量15',
    };
  } else if (tabType === 'amountCalculate') {
    return {
      // 操作类文本（对应编辑/新增）
      editText: '编辑金额核算',
      addText: '新增金额核算',
      // 导出Excel相关文本
      excelName: '金额核算列表',
      excelAllName: '金额核算数据.xlsx',
      // 统计总计文本
      total: ' 总计: 金额核算数量15;核算总金额:1135.00',
    };
  }

  return {
    // 操作类文本（对应编辑/新增）
    editText: '编辑退款订单',
    addText: '新增退款订单',
    // 导出Excel相关文本
    excelName: '退款订单列表',
    excelAllName: '退款订单数据.xlsx',
    // 统计总计文本
    total: ' 总计: 退款订单数量15;退款总金额:1540.00',
  };
}

/** 详情抽屉字段配置 */
export function detailFields(tabType = 'refundApply') {
  if (tabType === 'refundRecord') {
    return [
      { key: 'refundNo', label: '退款单号' },
      { key: 'originalOrderNo', label: '原订单编号' },
      { key: 'userName', label: '用户姓名' },
      { key: 'carNumber', label: '车牌号码' },
      { key: 'refundAmount', label: '退款金额' },
      { key: 'refundReasonName', label: '退款原因' },
      { key: 'applyTime', label: '申请时间' },
      { key: 'payTypeName', label: '退款方式' },
      { key: 'approveStatusName', label: '审批状态' },
      { key: 'refundStatusName', label: '退款状态' },
      { key: 'approveTime', label: '审批时间' },
      { key: 'refundTime', label: '退款时间' },
      { key: 'arrivalTime', label: '到账时间' },
    ];
  } else if (tabType === 'amountCalculate') {
    return [
      { key: 'refundNo', label: '退款单号' },
      { key: 'originalOrderNo', label: '原订单编号' },
      { key: 'orderTypeName', label: '订单类型' },
      { key: 'originalAmount', label: '原订单金额' },
      { key: 'usedAmount', label: '已使用金额' },
      { key: 'serviceFee', label: '手续费' },
      { key: 'discountShare', label: '优惠分摊金额' },
      { key: 'calculator', label: '核算人' },
      { key: 'refundAmount', label: '应退金额' },
      { key: 'calculateResult', label: '核算结果' },
      { key: 'calculateTime', label: '核算时间' },
      { key: 'remark', label: '备注' },
    ];
  }

  return [
    { key: 'refundNo', label: '退款单号' },
    { key: 'originalOrderNo', label: '原订单编号' },
    { key: 'carNumber', label: '车牌号码' },
    { key: 'refundAmount', label: '退款金额' },
    { key: 'refundReasonName', label: '退款原因' },
    { key: 'proofFiles', label: '佐证材料' },
    { key: 'applicantName', label: '申请人' },
    { key: 'contactPhone', label: '联系电话' },
    { key: 'approveStatusName', label: '审批状态' },
    { key: 'refundStatusName', label: '退款状态' },
    { key: 'approveOpinion', label: '审批意见' },
    { key: 'refundTime', label: '退款时间' },
    { key: 'arrivalTime', label: '到账时间' },
  ];
}

/** 根据标签类型获取统计数据 */
export function getStatsDataByTabType(tabType = 'refundApply') {
  // 获取对应标签页的数据
  const refundData = dataList(tabType);
  const totalCount = refundData.length;

  switch (tabType) {
    case 'refundApply': {
      // 退款申请统计
      // 计算今日退款申请数（模拟今天为2025-01-24）
      const today = '2025-01-24';
      const todayCount = refundData.filter(item => {
        // 假设申请时间格式为'2025-01-24 11:50:00'
        return item.refundTime && item.refundTime.startsWith(today);
      }).length;

      // 计算已审批数
      const approvedCount = refundData.filter(item => 
        item.approveStatusName === '已通过' || item.approveStatusName === '已拒绝'
      ).length;

      // 计算已到账数
      const arrivedCount = refundData.filter(item => 
        item.arrivalTime && item.arrivalTime !== ''
      ).length;

      // 统计不同退款原因的数量
      const refundReasonStats = {};
      refundData.forEach(item => {
        refundReasonStats[item.refundReasonName] = (refundReasonStats[item.refundReasonName] || 0) + 1;
      });

      // 统计不同审批状态的数量
      const approveStatusStats = {};
      refundData.forEach(item => {
        approveStatusStats[item.approveStatusName] = (approveStatusStats[item.approveStatusName] || 0) + 1;
      });

      // 统计不同退款类型金额对比（这里用退款原因作为类型）
      const refundTypeAmountStats = {};
      refundData.forEach(item => {
        const amount = parseFloat(item.refundAmount) || 0;
        refundTypeAmountStats[item.refundReasonName] = (refundTypeAmountStats[item.refundReasonName] || 0) + amount;
      });

      return {
        cards: [
          {
            title: '今日退款申请数',
            value: todayCount,
            desc: `较昨日增长${Math.floor(Math.random() * 10) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '已审批数',
            value: approvedCount,
            desc: `审批率${Math.round((approvedCount / totalCount) * 100)}%`,
            color: '#4ECDC4',
          },
          {
            title: '已到账数',
            value: arrivedCount,
            desc: `到账率${Math.round((arrivedCount / totalCount) * 100)}%`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '退款原因占比',
            type: 'pie',
            data: Object.entries(refundReasonStats)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '审批状态占比',
            type: 'pie',
            data: Object.entries(approveStatusStats)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '不同退款类型金额对比',
            type: 'bar',
            xAxis: Object.keys(refundTypeAmountStats),
            series: Object.values(refundTypeAmountStats),
          },
        ],
      };
    }
    case 'refundRecord': {
      // 退款记录统计
      // 计算总退款金额
      const totalRefundAmount = refundData.reduce((sum, item) => {
        return sum + parseFloat(item.refundAmount) || 0;
      }, 0);

      // 计算退款成功率
      const successCount = refundData.filter(item => item.refundStatusName === '已退款').length;
      const successRate = Math.round((successCount / totalCount) * 100);

      // 统计不同退款状态的数量
      const refundStatusStats = {};
      refundData.forEach(item => {
        refundStatusStats[item.refundStatusName] = (refundStatusStats[item.refundStatusName] || 0) + 1;
      });

      // 统计不同退款原因的数量
      const refundReasonStats = {};
      refundData.forEach(item => {
        refundReasonStats[item.refundReasonName] = (refundReasonStats[item.refundReasonName] || 0) + 1;
      });

      // 生成近期退款趋势（最近7天）
      const days = ['01-18', '01-19', '01-20', '01-21', '01-22', '01-23', '01-24'];
      const dailyRefunds = days.map(day => {
        return refundData.filter(item => 
          item.applyTime && item.applyTime.includes(day)
        ).length;
      });

      return {
        cards: [
          {
            title: '总退款单数',
            value: totalCount,
            desc: `较上月增长${Math.floor(Math.random() * 10) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '总退款金额',
            value: totalRefundAmount.toFixed(2),
            desc: `较上月增长${Math.floor(Math.random() * 15) + 5}%`,
            color: '#4ECDC4',
          },
          {
            title: '退款成功率',
            value: `${successRate}%`,
            desc: `较上月提升${Math.floor(Math.random() * 5) + 1}%`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '退款状态占比',
            type: 'pie',
            data: Object.entries(refundStatusStats)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '退款原因占比',
            type: 'pie',
            data: Object.entries(refundReasonStats)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '近期退款趋势',
            type: 'line',
            xAxis: days,
            series: dailyRefunds,
          },
        ],
      };
    }
    case 'amountCalculate': {
      // 金额核算统计
      // 计算应退总额
      const totalRefundAmount = refundData.reduce((sum, item) => {
        return sum + parseFloat(item.refundAmount) || 0;
      }, 0);

      // 计算已退总额（模拟）
      const totalRefundedAmount = totalRefundAmount * 0.8; // 假设80%已退款

      // 统计不同订单类型的数量
      const orderTypeStats = {};
      refundData.forEach(item => {
        orderTypeStats[item.orderTypeName] = (orderTypeStats[item.orderTypeName] || 0) + 1;
      });

      // 统计不同核算结果的数量
      const calculateResultStats = {};
      refundData.forEach(item => {
        calculateResultStats[item.calculateResult] = (calculateResultStats[item.calculateResult] || 0) + 1;
      });

      // 统计不同核算人核算效率对比（这里用核算数量作为效率）
      const calculatorStats = {};
      refundData.forEach(item => {
        calculatorStats[item.calculator] = (calculatorStats[item.calculator] || 0) + 1;
      });

      return {
        cards: [
          {
            title: '核算订单数',
            value: totalCount,
            desc: `较上月增长${Math.floor(Math.random() * 10) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '应退总额',
            value: totalRefundAmount.toFixed(2),
            desc: `较上月增长${Math.floor(Math.random() * 15) + 5}%`,
            color: '#4ECDC4',
          },
          {
            title: '已退总额',
            value: totalRefundedAmount.toFixed(2),
            desc: `退款率${Math.round((totalRefundedAmount / totalRefundAmount) * 100)}%`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '订单类型占比',
            type: 'pie',
            data: Object.entries(orderTypeStats)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '核算结果占比',
            type: 'pie',
            data: Object.entries(calculateResultStats)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '不同核算人核算效率对比',
            type: 'bar',
            xAxis: Object.keys(calculatorStats),
            series: Object.values(calculatorStats),
          },
        ],
      };
    }
    default:
      return {
        cards: [],
        charts: [],
      };
  }
}

