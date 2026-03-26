import { maskPhone } from '#/utils/genchuan/dataMask/index.js';

/** 钱包管理表格初始数据 - 按指定字段生成 */
export const dataList = (tabName = '充值订单') => {
  if (tabName === '储值卡管理') {
    return [
      {
        id: 'PC001',
        prepaidCardId: 'PC202602010001',
        userName: '张三',
        carNumber: '闽A12345',
        faceValue: '1000',
        packageType: '月卡套餐',
        activateTime: '2026-01-01 10:00:00',
        validPeriod: '2026-12-31 23:59:59',
        bindPhone: '13800138001',
        balance: '800',
        cardStatus: '正常',
        rechargeCount: '2',
        consumeCount: '5',
        lastTradeTime: '2026-02-04 09:30:00',
      },
      {
        id: 'PC002',
        prepaidCardId: 'PC202602010002',
        userName: '李四',
        carNumber: '闽B67890',
        faceValue: '2000',
        packageType: '季卡套餐',
        activateTime: '2026-01-05 14:20:00',
        validPeriod: '2026-12-31 23:59:59',
        bindPhone: '13900139002',
        balance: '1500',
        cardStatus: '正常',
        rechargeCount: '1',
        consumeCount: '3',
        lastTradeTime: '2026-02-03 16:45:00',
      },
      {
        id: 'PC003',
        prepaidCardId: 'PC202602010003',
        userName: '王五',
        carNumber: '闽C24680',
        faceValue: '500',
        packageType: '月卡套餐',
        activateTime: '2026-01-10 09:15:00',
        validPeriod: '2026-06-30 23:59:59',
        bindPhone: '13700137003',
        balance: '200',
        cardStatus: '正常',
        rechargeCount: '0',
        consumeCount: '6',
        lastTradeTime: '2026-02-04 10:20:00',
      },
      {
        id: 'PC004',
        prepaidCardId: 'PC202602010004',
        userName: '赵六',
        carNumber: '闽D13579',
        faceValue: '3000',
        packageType: '年卡套餐',
        activateTime: '2026-01-15 11:30:00',
        validPeriod: '2026-12-31 23:59:59',
        bindPhone: '13600136004',
        balance: '2500',
        cardStatus: '正常',
        rechargeCount: '1',
        consumeCount: '2',
        lastTradeTime: '2026-02-02 14:45:00',
      },
      {
        id: 'PC005',
        prepaidCardId: 'PC202602010005',
        userName: '孙七',
        carNumber: '闽E54321',
        faceValue: '1000',
        packageType: '月卡套餐',
        activateTime: '2026-01-20 16:50:00',
        validPeriod: '2026-06-30 23:59:59',
        bindPhone: '13500135005',
        balance: '0',
        cardStatus: '已过期',
        rechargeCount: '0',
        consumeCount: '10',
        lastTradeTime: '2026-01-31 23:59:59',
      },
      {
        id: 'PC006',
        prepaidCardId: 'PC202602010006',
        userName: '周八',
        carNumber: '闽F67890',
        faceValue: '1500',
        packageType: '季卡套餐',
        activateTime: '2026-01-25 09:45:00',
        validPeriod: '2026-12-31 23:59:59',
        bindPhone: '13400134006',
        balance: '1200',
        cardStatus: '正常',
        rechargeCount: '1',
        consumeCount: '2',
        lastTradeTime: '2026-02-04 08:15:00',
      },
      {
        id: 'PC007',
        prepaidCardId: 'PC202602010007',
        userName: '吴九',
        carNumber: '闽G24680',
        faceValue: '500',
        packageType: '月卡套餐',
        activateTime: '2026-02-01 10:20:00',
        validPeriod: '2026-07-31 23:59:59',
        bindPhone: '13300133007',
        balance: '500',
        cardStatus: '未激活',
        rechargeCount: '0',
        consumeCount: '0',
        lastTradeTime: '',
      },
      {
        id: 'PC008',
        prepaidCardId: 'PC202602010008',
        userName: '郑十',
        carNumber: '闽H13579',
        faceValue: '2000',
        packageType: '季卡套餐',
        activateTime: '2026-02-02 14:30:00',
        validPeriod: '2026-12-31 23:59:59',
        bindPhone: '13200132008',
        balance: '1800',
        cardStatus: '正常',
        rechargeCount: '0',
        consumeCount: '1',
        lastTradeTime: '2026-02-03 11:20:00',
      },
      {
        id: 'PC009',
        prepaidCardId: 'PC202602010009',
        userName: '张三',
        carNumber: '闽A12346',
        faceValue: '3000',
        packageType: '年卡套餐',
        activateTime: '2026-02-03 09:15:00',
        validPeriod: '2026-12-31 23:59:59',
        bindPhone: '13100131009',
        balance: '3000',
        cardStatus: '未激活',
        rechargeCount: '0',
        consumeCount: '0',
        lastTradeTime: '',
      },
      {
        id: 'PC010',
        prepaidCardId: 'PC202602010010',
        userName: '李四',
        carNumber: '闽B67891',
        faceValue: '1000',
        packageType: '月卡套餐',
        activateTime: '2026-02-04 10:00:00',
        validPeriod: '2026-08-03 23:59:59',
        bindPhone: '13000130010',
        balance: '1000',
        cardStatus: '正常',
        rechargeCount: '0',
        consumeCount: '0',
        lastTradeTime: '',
      },
      {
        id: 'PC011',
        prepaidCardId: 'PC202602010011',
        userName: '王五',
        carNumber: '闽C24681',
        faceValue: '1500',
        packageType: '季卡套餐',
        activateTime: '2026-01-15 16:45:00',
        validPeriod: '2026-04-14 23:59:59',
        bindPhone: '13900139011',
        balance: '500',
        cardStatus: '正常',
        rechargeCount: '1',
        consumeCount: '4',
        lastTradeTime: '2026-02-04 09:45:00',
      },
      {
        id: 'PC012',
        prepaidCardId: 'PC202602010012',
        userName: '赵六',
        carNumber: '闽D13580',
        faceValue: '2000',
        packageType: '年卡套餐',
        activateTime: '2026-01-20 11:20:00',
        validPeriod: '2026-12-31 23:59:59',
        bindPhone: '13800138012',
        balance: '1200',
        cardStatus: '正常',
        rechargeCount: '2',
        consumeCount: '6',
        lastTradeTime: '2026-02-03 15:30:00',
      },
    ];
  }

  if (tabName === '充值优惠管理') {
    return [
      {
        id: 'PM001',
        promotionId: 'PM202602010001',
        promotionName: '春节充值优惠',
        promotionType: '满减优惠',
        applicablePackage: '月卡套餐,季卡套餐',
        promotionRule: '充值满200减20，满500减50',
        activityTime: '2026-02-01 00:00:00 至 2026-02-15 23:59:59',
        participantLimit: '1000',
        operator: '张三',
        participantCount: '500',
        writeOffCount: '300',
        discountTotal: '15000',
        status: '进行中',
        lastWriteOffTime: '2026-02-04 10:30:00',
      },
      {
        id: 'PM002',
        promotionId: 'PM202602010002',
        promotionName: '新人首充优惠',
        promotionType: '折扣优惠',
        applicablePackage: '所有套餐',
        promotionRule: '首充享受9折优惠',
        activityTime: '2026-01-01 00:00:00 至 2026-12-31 23:59:59',
        participantLimit: '5000',
        operator: '李四',
        participantCount: '1200',
        writeOffCount: '800',
        discountTotal: '40000',
        status: '进行中',
        lastWriteOffTime: '2026-02-04 09:15:00',
      },
      {
        id: 'PM003',
        promotionId: 'PM202602010003',
        promotionName: '周末充值特惠',
        promotionType: '立减优惠',
        applicablePackage: '月卡套餐',
        promotionRule: '周末充值立减15元',
        activityTime: '2026-02-07 00:00:00 至 2026-02-08 23:59:59',
        participantLimit: '500',
        operator: '王五',
        participantCount: '300',
        writeOffCount: '200',
        discountTotal: '3000',
        status: '未开始',
        lastWriteOffTime: '',
      },
      {
        id: 'PM004',
        promotionId: 'PM202602010004',
        promotionName: '年卡套餐特惠',
        promotionType: '满减优惠',
        applicablePackage: '年卡套餐',
        promotionRule: '充值年卡满2000减300',
        activityTime: '2026-02-01 00:00:00 至 2026-02-29 23:59:59',
        participantLimit: '200',
        operator: '赵六',
        participantCount: '150',
        writeOffCount: '100',
        discountTotal: '30000',
        status: '进行中',
        lastWriteOffTime: '2026-02-03 16:45:00',
      },
      {
        id: 'PM005',
        promotionId: 'PM202602010005',
        promotionName: '情人节充值活动',
        promotionType: '赠品优惠',
        applicablePackage: '月卡套餐,季卡套餐',
        promotionRule: '充值送精美礼品一份',
        activityTime: '2026-02-14 00:00:00 至 2026-02-14 23:59:59',
        participantLimit: '300',
        operator: '孙七',
        participantCount: '0',
        writeOffCount: '0',
        discountTotal: '0',
        status: '未开始',
        lastWriteOffTime: '',
      },
      {
        id: 'PM006',
        promotionId: 'PM202602010006',
        promotionName: '会员专享优惠',
        promotionType: '折扣优惠',
        applicablePackage: '所有套餐',
        promotionRule: '会员充值享受8.5折优惠',
        activityTime: '2026-01-01 00:00:00 至 2026-12-31 23:59:59',
        participantLimit: '2000',
        operator: '周八',
        participantCount: '800',
        writeOffCount: '600',
        discountTotal: '60000',
        status: '进行中',
        lastWriteOffTime: '2026-02-04 08:20:00',
      },
      {
        id: 'PM007',
        promotionId: 'PM202602010007',
        promotionName: '月末充值返现',
        promotionType: '返现优惠',
        applicablePackage: '所有套餐',
        promotionRule: '月末充值返现5%',
        activityTime: '2026-01-30 00:00:00 至 2026-01-31 23:59:59',
        participantLimit: '800',
        operator: '吴九',
        participantCount: '600',
        writeOffCount: '500',
        discountTotal: '15000',
        status: '已结束',
        lastWriteOffTime: '2026-01-31 23:59:59',
      },
      {
        id: 'PM008',
        promotionId: 'PM202602010008',
        promotionName: '季卡套餐优惠',
        promotionType: '满减优惠',
        applicablePackage: '季卡套餐',
        promotionRule: '充值季卡满500减50',
        activityTime: '2026-02-01 00:00:00 至 2026-02-29 23:59:59',
        participantLimit: '500',
        operator: '郑十',
        participantCount: '300',
        writeOffCount: '200',
        discountTotal: '10000',
        status: '进行中',
        lastWriteOffTime: '2026-02-03 14:20:00',
      },
      {
        id: 'PM009',
        promotionId: 'PM202602010009',
        promotionName: '工作日充值优惠',
        promotionType: '立减优惠',
        applicablePackage: '月卡套餐',
        promotionRule: '工作日充值立减10元',
        activityTime: '2026-02-02 00:00:00 至 2026-02-06 23:59:59',
        participantLimit: '1000',
        operator: '张三',
        participantCount: '800',
        writeOffCount: '600',
        discountTotal: '6000',
        status: '进行中',
        lastWriteOffTime: '2026-02-04 09:00:00',
      },
      {
        id: 'PM010',
        promotionId: 'PM202602010010',
        promotionName: '充值送积分活动',
        promotionType: '积分优惠',
        applicablePackage: '所有套餐',
        promotionRule: '每充值100元送100积分',
        activityTime: '2026-01-01 00:00:00 至 2026-12-31 23:59:59',
        participantLimit: '无限制',
        operator: '李四',
        participantCount: '2000',
        writeOffCount: '1500',
        discountTotal: '0',
        status: '进行中',
        lastWriteOffTime: '2026-02-04 10:00:00',
      },
      {
        id: 'PM011',
        promotionId: 'PM202602010011',
        promotionName: '元旦充值活动',
        promotionType: '折扣优惠',
        applicablePackage: '所有套餐',
        promotionRule: '充值享受8折优惠',
        activityTime: '2026-01-01 00:00:00 至 2026-01-03 23:59:59',
        participantLimit: '1500',
        operator: '王五',
        participantCount: '1200',
        writeOffCount: '1000',
        discountTotal: '40000',
        status: '已结束',
        lastWriteOffTime: '2026-01-03 23:59:59',
      },
      {
        id: 'PM012',
        promotionId: 'PM202602010012',
        promotionName: '周末特惠套餐',
        promotionType: '组合优惠',
        applicablePackage: '月卡套餐,季卡套餐',
        promotionRule: '充值月卡+季卡组合享受8.5折优惠',
        activityTime: '2026-02-14 00:00:00 至 2026-02-15 23:59:59',
        participantLimit: '200',
        operator: '赵六',
        participantCount: '0',
        writeOffCount: '0',
        discountTotal: '0',
        status: '未开始',
        lastWriteOffTime: '',
      },
    ];
  }

  if (tabName === '充值记录') {
    return [
      {
        id: 'RR001',
        rechargeNo: 'RR202602010001',
        userName: '张三',
        carNumber: '闽A12345',
        rechargePackage: '月卡套餐',
        rechargeAmount: '200',
        payType: '微信支付',
        rechargeTime: '2026-02-01 09:55:00',
        payAmount: '180',
        discountAmount: '20',
        rechargeStatus: '成功',
        arrivalTime: '2026-02-01 10:00:00',
        tradeNo: 'WX2026020112345678',
      },
      {
        id: 'RR002',
        rechargeNo: 'RR202602010002',
        userName: '李四',
        carNumber: '闽B67890',
        rechargePackage: '季卡套餐',
        rechargeAmount: '500',
        payType: '支付宝',
        rechargeTime: '2026-02-01 11:15:00',
        payAmount: '450',
        discountAmount: '50',
        rechargeStatus: '成功',
        arrivalTime: '2026-02-01 11:20:00',
        tradeNo: 'ALI2026020187654321',
      },
      {
        id: 'RR003',
        rechargeNo: 'RR202602010003',
        userName: '王五',
        carNumber: '闽C24680',
        rechargePackage: '自定义充值',
        rechargeAmount: '500',
        payType: '银行卡',
        rechargeTime: '2026-02-01 14:25:00',
        payAmount: '500',
        discountAmount: '0',
        rechargeStatus: '成功',
        arrivalTime: '2026-02-01 14:30:00',
        tradeNo: 'BANK2026020111223344',
      },
      {
        id: 'RR004',
        rechargeNo: 'RR202602010004',
        userName: '赵六',
        carNumber: '闽D13579',
        rechargePackage: '年卡套餐',
        rechargeAmount: '2000',
        payType: '微信支付',
        rechargeTime: '2026-02-01 16:40:00',
        payAmount: '1800',
        discountAmount: '200',
        rechargeStatus: '成功',
        arrivalTime: '2026-02-01 16:45:00',
        tradeNo: 'WX2026020122334455',
      },
      {
        id: 'RR005',
        rechargeNo: 'RR202602020001',
        userName: '孙七',
        carNumber: '闽E54321',
        rechargePackage: '月卡套餐',
        rechargeAmount: '200',
        payType: '支付宝',
        rechargeTime: '2026-02-02 09:10:00',
        payAmount: '180',
        discountAmount: '20',
        rechargeStatus: '成功',
        arrivalTime: '2026-02-02 09:15:00',
        tradeNo: 'ALI2026020233445566',
      },
      {
        id: 'RR006',
        rechargeNo: 'RR202602020002',
        userName: '周八',
        carNumber: '闽F67890',
        rechargePackage: '自定义充值',
        rechargeAmount: '1000',
        payType: '银行卡',
        rechargeTime: '2026-02-02 11:25:00',
        payAmount: '950',
        discountAmount: '50',
        rechargeStatus: '成功',
        arrivalTime: '2026-02-02 11:30:00',
        tradeNo: 'BANK2026020244556677',
      },
      {
        id: 'RR007',
        rechargeNo: 'RR202602020003',
        userName: '吴九',
        carNumber: '闽G24680',
        rechargePackage: '季卡套餐',
        rechargeAmount: '500',
        payType: '微信支付',
        rechargeTime: '2026-02-02 14:45:00',
        payAmount: '450',
        discountAmount: '50',
        rechargeStatus: '处理中',
        arrivalTime: '',
        tradeNo: 'WX2026020255667788',
      },
      {
        id: 'RR008',
        rechargeNo: 'RR202602020004',
        userName: '郑十',
        carNumber: '闽H13579',
        rechargePackage: '月卡套餐',
        rechargeAmount: '200',
        payType: '支付宝',
        rechargeTime: '2026-02-02 16:30:00',
        payAmount: '180',
        discountAmount: '20',
        rechargeStatus: '失败',
        arrivalTime: '',
        tradeNo: 'ALI2026020266778899',
      },
      {
        id: 'RR009',
        rechargeNo: 'RR202602030001',
        userName: '张三',
        carNumber: '闽A12345',
        rechargePackage: '自定义充值',
        rechargeAmount: '300',
        payType: '微信支付',
        rechargeTime: '2026-02-03 10:15:00',
        payAmount: '300',
        discountAmount: '0',
        rechargeStatus: '成功',
        arrivalTime: '2026-02-03 10:20:00',
        tradeNo: 'WX2026020377889900',
      },
      {
        id: 'RR010',
        rechargeNo: 'RR202602030002',
        userName: '李四',
        carNumber: '闽B67890',
        rechargePackage: '年卡套餐',
        rechargeAmount: '2000',
        payType: '银行卡',
        rechargeTime: '2026-02-03 14:05:00',
        payAmount: '1800',
        discountAmount: '200',
        rechargeStatus: '成功',
        arrivalTime: '2026-02-03 14:10:00',
        tradeNo: 'BANK2026020388990011',
      },
      {
        id: 'RR011',
        rechargeNo: 'RR202602030003',
        userName: '王五',
        carNumber: '闽C24680',
        rechargePackage: '月卡套餐',
        rechargeAmount: '200',
        payType: '支付宝',
        rechargeTime: '2026-02-03 16:50:00',
        payAmount: '180',
        discountAmount: '20',
        rechargeStatus: '处理中',
        arrivalTime: '',
        tradeNo: 'ALI2026020399001122',
      },
      {
        id: 'RR012',
        rechargeNo: 'RR202602040001',
        userName: '赵六',
        carNumber: '闽D13579',
        rechargePackage: '季卡套餐',
        rechargeAmount: '500',
        payType: '微信支付',
        rechargeTime: '2026-02-04 09:25:00',
        payAmount: '450',
        discountAmount: '50',
        rechargeStatus: '成功',
        arrivalTime: '2026-02-04 09:30:00',
        tradeNo: 'WX2026020400112233',
      },
    ];
  }

  // 充值订单标签页的数据
  return [
    {
      id: 'R001',
      rechargeNo: 'RC202602010001',
      userName: '张三',
      carNumber: '闽A12345',
      rechargePackage: '月卡套餐',
      customAmount: '0',
      discountAmount: '20',
      payAmount: '180',
      payType: '微信支付',
      fromAccount: 'wx123456789',
      toAccount: 'parking_wallet_001',
      transferType: '充值',
      transferAmountOrQuantity: '200',
      auditStatus: '已审核',
      rechargeStatus: '成功',
      arrivalTime: '2026-02-01 10:00:00',
      walletBalance: '1200',
      rechargeTime: '2026-02-01 09:55:00',
    },
    {
      id: 'R002',
      rechargeNo: 'RC202602010002',
      userName: '李四',
      carNumber: '闽B67890',
      rechargePackage: '季卡套餐',
      customAmount: '0',
      discountAmount: '50',
      payAmount: '450',
      payType: '支付宝',
      fromAccount: 'alipay987654321',
      toAccount: 'parking_wallet_002',
      transferType: '充值',
      transferAmountOrQuantity: '500',
      auditStatus: '已审核',
      rechargeStatus: '成功',
      arrivalTime: '2026-02-01 11:20:00',
      walletBalance: '2500',
      rechargeTime: '2026-02-01 11:15:00',
    },
    {
      id: 'R003',
      rechargeNo: 'RC202602010003',
      userName: '王五',
      carNumber: '闽C24680',
      rechargePackage: '自定义充值',
      customAmount: '500',
      discountAmount: '0',
      payAmount: '500',
      payType: '银行卡',
      fromAccount: 'bank_6222021234567890123',
      toAccount: 'parking_wallet_003',
      transferType: '充值',
      transferAmountOrQuantity: '500',
      auditStatus: '已审核',
      rechargeStatus: '成功',
      arrivalTime: '2026-02-01 14:30:00',
      walletBalance: '800',
      rechargeTime: '2026-02-01 14:25:00',
    },
    {
      id: 'R004',
      rechargeNo: 'RC202602010004',
      userName: '赵六',
      carNumber: '闽D13579',
      rechargePackage: '年卡套餐',
      customAmount: '0',
      discountAmount: '200',
      payAmount: '1800',
      payType: '微信支付',
      fromAccount: 'wx987654321',
      toAccount: 'parking_wallet_004',
      transferType: '充值',
      transferAmountOrQuantity: '2000',
      auditStatus: '已审核',
      rechargeStatus: '成功',
      arrivalTime: '2026-02-01 16:45:00',
      walletBalance: '3200',
      rechargeTime: '2026-02-01 16:40:00',
    },
    {
      id: 'R005',
      rechargeNo: 'RC202602020001',
      userName: '孙七',
      carNumber: '闽E54321',
      rechargePackage: '月卡套餐',
      customAmount: '0',
      discountAmount: '20',
      payAmount: '180',
      payType: '支付宝',
      fromAccount: 'alipay123456789',
      toAccount: 'parking_wallet_005',
      transferType: '充值',
      transferAmountOrQuantity: '200',
      auditStatus: '已审核',
      rechargeStatus: '成功',
      arrivalTime: '2026-02-02 09:15:00',
      walletBalance: '600',
      rechargeTime: '2026-02-02 09:10:00',
    },
    {
      id: 'R006',
      rechargeNo: 'RC202602020002',
      userName: '周八',
      carNumber: '闽F67890',
      rechargePackage: '自定义充值',
      customAmount: '1000',
      discountAmount: '50',
      payAmount: '950',
      payType: '银行卡',
      fromAccount: 'bank_6222029876543210987',
      toAccount: 'parking_wallet_006',
      transferType: '充值',
      transferAmountOrQuantity: '1000',
      auditStatus: '已审核',
      rechargeStatus: '成功',
      arrivalTime: '2026-02-02 11:30:00',
      walletBalance: '1950',
      rechargeTime: '2026-02-02 11:25:00',
    },
    {
      id: 'R007',
      rechargeNo: 'RC202602020003',
      userName: '吴九',
      carNumber: '闽G24680',
      rechargePackage: '季卡套餐',
      customAmount: '0',
      discountAmount: '50',
      payAmount: '450',
      payType: '微信支付',
      fromAccount: 'wx1122334455',
      toAccount: 'parking_wallet_007',
      transferType: '充值',
      transferAmountOrQuantity: '500',
      auditStatus: '待审核',
      rechargeStatus: '处理中',
      arrivalTime: '',
      walletBalance: '450',
      rechargeTime: '2026-02-02 14:45:00',
    },
    {
      id: 'R008',
      rechargeNo: 'RC202602020004',
      userName: '郑十',
      carNumber: '闽H13579',
      rechargePackage: '月卡套餐',
      customAmount: '0',
      discountAmount: '20',
      payAmount: '180',
      payType: '支付宝',
      fromAccount: 'alipay5566778899',
      toAccount: 'parking_wallet_008',
      transferType: '充值',
      transferAmountOrQuantity: '200',
      auditStatus: '已拒绝',
      rechargeStatus: '失败',
      arrivalTime: '',
      walletBalance: '200',
      rechargeTime: '2026-02-02 16:30:00',
    },
    {
      id: 'R009',
      rechargeNo: 'RC202602030001',
      userName: '张三',
      carNumber: '闽A12345',
      rechargePackage: '自定义充值',
      customAmount: '300',
      discountAmount: '0',
      payAmount: '300',
      payType: '微信支付',
      fromAccount: 'wx123456789',
      toAccount: 'parking_wallet_001',
      transferType: '充值',
      transferAmountOrQuantity: '300',
      auditStatus: '已审核',
      rechargeStatus: '成功',
      arrivalTime: '2026-02-03 10:20:00',
      walletBalance: '1500',
      rechargeTime: '2026-02-03 10:15:00',
    },
    {
      id: 'R010',
      rechargeNo: 'RC202602030002',
      userName: '李四',
      carNumber: '闽B67890',
      rechargePackage: '年卡套餐',
      customAmount: '0',
      discountAmount: '200',
      payAmount: '1800',
      payType: '银行卡',
      fromAccount: 'bank_6222021234567890123',
      toAccount: 'parking_wallet_002',
      transferType: '充值',
      transferAmountOrQuantity: '2000',
      auditStatus: '已审核',
      rechargeStatus: '成功',
      arrivalTime: '2026-02-03 14:10:00',
      walletBalance: '4500',
      rechargeTime: '2026-02-03 14:05:00',
    },
    {
      id: 'R011',
      rechargeNo: 'RC202602030003',
      userName: '王五',
      carNumber: '闽C24680',
      rechargePackage: '月卡套餐',
      customAmount: '0',
      discountAmount: '20',
      payAmount: '180',
      payType: '支付宝',
      fromAccount: 'alipay987654321',
      toAccount: 'parking_wallet_003',
      transferType: '充值',
      transferAmountOrQuantity: '200',
      auditStatus: '待审核',
      rechargeStatus: '处理中',
      arrivalTime: '',
      walletBalance: '800',
      rechargeTime: '2026-02-03 16:50:00',
    },
    {
      id: 'R012',
      rechargeNo: 'RC202602040001',
      userName: '赵六',
      carNumber: '闽D13579',
      rechargePackage: '季卡套餐',
      customAmount: '0',
      discountAmount: '50',
      payAmount: '450',
      payType: '微信支付',
      fromAccount: 'wx987654321',
      toAccount: 'parking_wallet_004',
      transferType: '充值',
      transferAmountOrQuantity: '500',
      auditStatus: '已审核',
      rechargeStatus: '成功',
      arrivalTime: '2026-02-04 09:30:00',
      walletBalance: '3700',
      rechargeTime: '2026-02-04 09:25:00',
    },
  ];
};

/** 钱包管理表单配置（包含所有指定字段） */
export function useFormSchema(tabName = '充值订单') {
  if (tabName === '储值卡管理') {
    return [
      {
        fieldName: 'prepaidCardId',
        label: '储值卡编号',
        component: 'Input',
        componentProps: {
          placeholder: '请输入储值卡编号',
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
        fieldName: 'faceValue',
        label: '面值',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入面值',
          min: 0,
        },
        rules: 'required',
      },
      {
        fieldName: 'packageType',
        label: '套餐类型',
        component: 'Select',
        componentProps: {
          placeholder: '请选择套餐类型',
          options: [
            { label: '月卡套餐', value: '月卡套餐' },
            { label: '季卡套餐', value: '季卡套餐' },
            { label: '年卡套餐', value: '年卡套餐' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'activateTime',
        label: '激活时间',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择激活时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      {
        fieldName: 'validPeriod',
        label: '有效期',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择有效期',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      {
        fieldName: 'bindPhone',
        label: '绑定手机号',
        component: 'Input',
        componentProps: {
          placeholder: '请输入绑定手机号',
        },
      },
      {
        fieldName: 'balance',
        label: '当前余额',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入当前余额',
          min: 0,
        },
      },
      {
        fieldName: 'cardStatus',
        label: '卡状态',
        component: 'Select',
        componentProps: {
          placeholder: '请选择卡状态',
          options: [
            { label: '正常', value: '正常' },
            { label: '未激活', value: '未激活' },
            { label: '已过期', value: '已过期' },
            { label: '已挂失', value: '已挂失' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'rechargeCount',
        label: '充值次数',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入充值次数',
          min: 0,
        },
      },
      {
        fieldName: 'consumeCount',
        label: '消费次数',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入消费次数',
          min: 0,
        },
      },
      {
        fieldName: 'lastTradeTime',
        label: '最后交易时间',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择最后交易时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
      },
    ];
  }

  if (tabName === '充值优惠管理') {
    return [
      {
        fieldName: 'promotionId',
        label: '活动ID',
        component: 'Input',
        componentProps: {
          placeholder: '请输入活动ID',
        },
        rules: 'required',
      },
      {
        fieldName: 'promotionName',
        label: '活动名称',
        component: 'Input',
        componentProps: {
          placeholder: '请输入活动名称',
        },
        rules: 'required',
      },
      {
        fieldName: 'promotionType',
        label: '优惠类型',
        component: 'Select',
        componentProps: {
          placeholder: '请选择优惠类型',
          options: [
            { label: '满减优惠', value: '满减优惠' },
            { label: '折扣优惠', value: '折扣优惠' },
            { label: '立减优惠', value: '立减优惠' },
            { label: '返现优惠', value: '返现优惠' },
            { label: '赠品优惠', value: '赠品优惠' },
            { label: '积分优惠', value: '积分优惠' },
            { label: '组合优惠', value: '组合优惠' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'applicablePackage',
        label: '适用套餐',
        component: 'Input',
        componentProps: {
          placeholder: '请输入适用套餐',
        },
        rules: 'required',
      },
      {
        fieldName: 'promotionRule',
        label: '优惠规则',
        component: 'Input',
        componentProps: {
          placeholder: '请输入优惠规则',
        },
        rules: 'required',
      },
      {
        fieldName: 'activityTime',
        label: '活动时间',
        component: 'Input',
        componentProps: {
          placeholder: '请输入活动时间',
        },
        rules: 'required',
      },
      {
        fieldName: 'participantLimit',
        label: '参与人数上限',
        component: 'Input',
        componentProps: {
          placeholder: '请输入参与人数上限',
        },
        rules: 'required',
      },
      {
        fieldName: 'operator',
        label: '操作人',
        component: 'Input',
        componentProps: {
          placeholder: '请输入操作人',
        },
        rules: 'required',
      },
      {
        fieldName: 'participantCount',
        label: '已参与人数',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入已参与人数',
          min: 0,
        },
      },
      {
        fieldName: 'writeOffCount',
        label: '核销次数',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入核销次数',
          min: 0,
        },
      },
      {
        fieldName: 'discountTotal',
        label: '优惠总额',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入优惠总额',
          min: 0,
        },
      },
      {
        fieldName: 'status',
        label: '状态',
        component: 'Select',
        componentProps: {
          placeholder: '请选择状态',
          options: [
            { label: '未开始', value: '未开始' },
            { label: '进行中', value: '进行中' },
            { label: '已结束', value: '已结束' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'lastWriteOffTime',
        label: '最近核销时间',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择最近核销时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
      },
    ];
  }

  if (tabName === '充值记录') {
    return [
      {
        fieldName: 'rechargeNo',
        label: '充值单号',
        component: 'Input',
        componentProps: {
          placeholder: '请输入充值单号',
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
        fieldName: 'rechargePackage',
        label: '充值套餐',
        component: 'Select',
        componentProps: {
          placeholder: '请选择充值套餐',
          options: [
            { label: '月卡套餐', value: '月卡套餐' },
            { label: '季卡套餐', value: '季卡套餐' },
            { label: '年卡套餐', value: '年卡套餐' },
            { label: '自定义充值', value: '自定义充值' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'rechargeAmount',
        label: '充值金额',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入充值金额',
          min: 0,
        },
        rules: 'required',
      },
      {
        fieldName: 'payType',
        label: '支付方式',
        component: 'Select',
        componentProps: {
          placeholder: '请选择支付方式',
          options: [
            { label: '微信支付', value: '微信支付' },
            { label: '支付宝', value: '支付宝' },
            { label: '银行卡', value: '银行卡' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'rechargeTime',
        label: '充值时间',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择充值时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
        rules: 'required',
      },
      {
        fieldName: 'payAmount',
        label: '实付金额',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入实付金额',
          min: 0,
        },
        rules: 'required',
      },
      {
        fieldName: 'discountAmount',
        label: '优惠金额',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入优惠金额',
          min: 0,
        },
      },
      {
        fieldName: 'rechargeStatus',
        label: '充值状态',
        component: 'Select',
        componentProps: {
          placeholder: '请选择充值状态',
          options: [
            { label: '处理中', value: '处理中' },
            { label: '成功', value: '成功' },
            { label: '失败', value: '失败' },
          ],
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
      {
        fieldName: 'tradeNo',
        label: '交易流水号',
        component: 'Input',
        componentProps: {
          placeholder: '请输入交易流水号',
        },
      },
    ];
  }

  // 充值订单标签页的表单配置
  return [
    {
      fieldName: 'rechargeNo',
      label: '充值单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入充值单号',
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
      fieldName: 'rechargePackage',
      label: '充值套餐',
      component: 'Select',
      componentProps: {
        placeholder: '请选择充值套餐',
        options: [
          { label: '月卡套餐', value: '月卡套餐' },
          { label: '季卡套餐', value: '季卡套餐' },
          { label: '年卡套餐', value: '年卡套餐' },
          { label: '自定义充值', value: '自定义充值' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'customAmount',
      label: '自定义金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入自定义金额',
        min: 0,
      },
    },
    {
      fieldName: 'discountAmount',
      label: '优惠金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入优惠金额',
        min: 0,
      },
    },
    {
      fieldName: 'payAmount',
      label: '实付金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入实付金额',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'payType',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付方式',
        options: [
          { label: '微信支付', value: '微信支付' },
          { label: '支付宝', value: '支付宝' },
          { label: '银行卡', value: '银行卡' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'fromAccount',
      label: '转出账号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入转出账号',
      },
    },
    {
      fieldName: 'toAccount',
      label: '转入账号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入转入账号',
      },
    },
    {
      fieldName: 'transferType',
      label: '转移类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择转移类型',
        options: [
          { label: '充值', value: '充值' },
          { label: '提现', value: '提现' },
          { label: '转账', value: '转账' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'transferAmountOrQuantity',
      label: '转移金额/数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入转移金额/数量',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'auditStatus',
      label: '审核状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审核状态',
        options: [
          { label: '待审核', value: '待审核' },
          { label: '已审核', value: '已审核' },
          { label: '已拒绝', value: '已拒绝' },
        ],
      },
    },
    {
      fieldName: 'rechargeStatus',
      label: '充值状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择充值状态',
        options: [
          { label: '处理中', value: '处理中' },
          { label: '成功', value: '成功' },
          { label: '失败', value: '失败' },
        ],
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
    {
      fieldName: 'walletBalance',
      label: '钱包余额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入钱包余额',
        min: 0,
      },
    },
    {
      fieldName: 'rechargeTime',
      label: '充值时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择充值时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
  ];
}

/** 钱包管理表格列配置 */
export function useGridColumns(tabName = '充值订单') {
  if (tabName === '储值卡管理') {
    return [
      { type: 'checkbox', width: 40 },
      {
        field: 'prepaidCardId',
        title: '储值卡编号',
        minWidth: 180,
        sortable: true,
        slots: { default: 'prepaidCardId' },
      },
      {
        field: 'userName',
        title: '用户姓名',
        minWidth: 100,
        sortable: true,
        slots: { default: 'userName' },
      },
      {
        field: 'carNumber',
        title: '车牌号码',
        minWidth: 120,
        sortable: true,
        slots: { default: 'carNumber' },
      },
      {
        field: 'faceValue',
        title: '面值',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'packageType',
        title: '套餐类型',
        minWidth: 120,
        sortable: true,
        slots: { default: 'packageType' },
      },
      {
        field: 'activateTime',
        title: '激活时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'validPeriod',
        title: '有效期',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'bindPhone',
        title: '绑定手机号',
        minWidth: 150,
        sortable: true,
        formatter: ({ cellValue }) => {
          return maskPhone(cellValue);
        },
      },
      {
        field: 'balance',
        title: '当前余额',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'cardStatus',
        title: '卡状态',
        minWidth: 100,
        sortable: true,
        slots: { default: 'cardStatus' },
      },
      {
        field: 'rechargeCount',
        title: '充值次数',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'consumeCount',
        title: '消费次数',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'lastTradeTime',
        title: '最后交易时间',
        minWidth: 180,
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

  if (tabName === '充值优惠管理') {
    return [
      { type: 'checkbox', width: 40 },
      {
        field: 'promotionId',
        title: '活动ID',
        minWidth: 180,
        sortable: true,
        slots: { default: 'promotionId' },
      },
      {
        field: 'promotionName',
        title: '活动名称',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'promotionType',
        title: '优惠类型',
        minWidth: 120,
        sortable: true,
        slots: { default: 'promotionType' },
      },
      {
        field: 'applicablePackage',
        title: '适用套餐',
        minWidth: 120,
        sortable: true,
        slots: { default: 'applicablePackage' },
      },
      {
        field: 'promotionRule',
        title: '优惠规则',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'activityTime',
        title: '活动时间',
        minWidth: 220,
        sortable: true,
      },
      {
        field: 'participantLimit',
        title: '参与人数上限',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'operator',
        title: '操作人',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'participantCount',
        title: '已参与人数',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'writeOffCount',
        title: '核销次数',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'discountTotal',
        title: '优惠总额',
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
        field: 'lastWriteOffTime',
        title: '最近核销时间',
        minWidth: 180,
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

  if (tabName === '充值记录') {
    return [
      { type: 'checkbox', width: 40 },
      {
        field: 'rechargeNo',
        title: '充值单号',
        minWidth: 180,
        sortable: true,
        slots: { default: 'rechargeNo' },
      },
      {
        field: 'userName',
        title: '用户姓名',
        minWidth: 100,
        sortable: true,
        slots: { default: 'userName' },
      },
      {
        field: 'carNumber',
        title: '车牌号码',
        minWidth: 120,
        sortable: true,
        slots: { default: 'carNumber' },
      },
      {
        field: 'rechargePackage',
        title: '充值套餐',
        minWidth: 120,
        sortable: true,
        slots: { default: 'rechargePackage' },
      },
      {
        field: 'rechargeAmount',
        title: '充值金额',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'payType',
        title: '支付方式',
        minWidth: 120,
        sortable: true,
        slots: { default: 'payType' },
      },
      {
        field: 'rechargeTime',
        title: '充值时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'payAmount',
        title: '实付金额',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'discountAmount',
        title: '优惠金额',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'rechargeStatus',
        title: '充值状态',
        minWidth: 120,
        sortable: true,
        slots: { default: 'rechargeStatus' },
      },
      {
        field: 'arrivalTime',
        title: '到账时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'tradeNo',
        title: '交易流水号',
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

  // 充值订单标签页的表格列配置
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'rechargeNo',
      title: '充值单号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'rechargeNo' },
    },
    {
      field: 'userName',
      title: '用户姓名',
      minWidth: 100,
      sortable: true,
      slots: { default: 'userName' },
    },
    {
      field: 'carNumber',
      title: '车牌号码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'carNumber' },
    },
    {
      field: 'rechargePackage',
      title: '充值套餐',
      minWidth: 120,
      sortable: true,
      slots: { default: 'rechargePackage' },
    },
    {
      field: 'customAmount',
      title: '自定义金额',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'discountAmount',
      title: '优惠金额',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'payAmount',
      title: '实付金额',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'payType',
      title: '支付方式',
      minWidth: 120,
      sortable: true,
      slots: { default: 'payType' },
    },
    {
      field: 'fromAccount',
      title: '转出账号',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'toAccount',
      title: '转入账号',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'transferType',
      title: '转移类型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'transferAmountOrQuantity',
      title: '转移金额/数量',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'auditStatus',
      title: '审核状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'auditStatus' },
    },
    {
      field: 'rechargeStatus',
      title: '充值状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'rechargeStatus' },
    },
    {
      field: 'arrivalTime',
      title: '到账时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'walletBalance',
      title: '钱包余额',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'rechargeTime',
      title: '充值时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = (tabName = '充值订单') => {
  if (tabName === '储值卡管理') {
    return {
      // 操作类文本（对应编辑/新增）
      editText: '编辑储值卡',
      addText: '新增储值卡',
      // 导出Excel相关文本
      excelName: '储值卡管理列表',
      excelAllName: '储值卡管理数据.xlsx',
      // 统计总计文本
      total: ' 总计: 储值卡12张;总面值: 18500元;正常卡9张',
    };
  }

  if (tabName === '充值优惠管理') {
    return {
      // 操作类文本（对应编辑/新增）
      editText: '编辑充值优惠',
      addText: '新增充值优惠',
      // 导出Excel相关文本
      excelName: '充值优惠管理列表',
      excelAllName: '充值优惠管理数据.xlsx',
      // 统计总计文本
      total: ' 总计: 充值优惠活动12条;参与人数: 8000人;优惠总额: 189000元',
    };
  }

  if (tabName === '充值记录') {
    return {
      // 操作类文本（对应编辑/新增）
      editText: '编辑充值记录',
      addText: '新增充值记录',
      // 导出Excel相关文本
      excelName: '充值记录列表',
      excelAllName: '充值记录数据.xlsx',
      // 统计总计文本
      total: ' 总计: 充值记录12条;总充值金额: 7680元;成功充值10条',
    };
  }

  // 充值订单标签页的文本
  return {
    // 操作类文本（对应编辑/新增）
    editText: '编辑充值订单',
    addText: '新增充值订单',
    // 导出Excel相关文本
    excelName: '充值订单列表',
    excelAllName: '充值订单数据.xlsx',
    // 统计总计文本
    total: ' 总计: 充值订单12条;总充值金额: 7680元;成功充值10条',
  };
};

/** 详情抽屉字段配置 */

/** 根据标签页名称获取统计数据 */
export const getStatsDataByTabName = (tabName = '充值订单') => {
  // 获取对应标签页的实际数据
  const tabData = dataList(tabName);

  // 根据不同标签页生成统计数据
  switch (tabName) {
    case '储值卡管理': {
      // 储值卡管理统计
      const totalCount = tabData.length;
      const normalCount = tabData.filter(
        (item) => item.cardStatus === '正常',
      ).length;
      const totalFaceValue = tabData.reduce(
        (sum, item) => sum + Number(item.faceValue),
        0,
      );

      // 统计不同套餐类型的数量
      const packageTypeStats = {};
      tabData.forEach((item) => {
        packageTypeStats[item.packageType] =
          (packageTypeStats[item.packageType] || 0) + 1;
      });

      // 统计不同卡状态的数量
      const cardStatusStats = {};
      tabData.forEach((item) => {
        cardStatusStats[item.cardStatus] =
          (cardStatusStats[item.cardStatus] || 0) + 1;
      });

      // 统计不同面值储值卡的分布
      const faceValueStats = {};
      tabData.forEach((item) => {
        const faceValue = item.faceValue;
        faceValueStats[faceValue] = (faceValueStats[faceValue] || 0) + 1;
      });

      return {
        cards: [
          {
            title: '总储值卡数',
            value: totalCount,
            desc: `较上月增长${Math.floor(Math.random() * 10) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '正常使用卡数',
            value: normalCount,
            desc: `占比${Math.round((normalCount / totalCount) * 100)}%`,
            color: '#4ECDC4',
          },
          {
            title: '总储值金额',
            value: totalFaceValue,
            desc: `较上月增长${Math.floor(Math.random() * 15) + 5}%`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '套餐类型占比',
            type: 'pie',
            data: Object.entries(packageTypeStats).map(([name, value]) => ({
              value: Math.round((value / totalCount) * 100),
              name,
            })),
          },
          {
            title: '卡状态占比',
            type: 'pie',
            data: Object.entries(cardStatusStats).map(([name, value]) => ({
              value: Math.round((value / totalCount) * 100),
              name,
            })),
          },
          {
            title: '不同面值储值卡分布',
            type: 'bar',
            xAxis: Object.keys(faceValueStats),
            series: Object.values(faceValueStats),
          },
        ],
      };
    }
    case '充值优惠管理': {
      // 充值优惠管理统计
      const totalCount = tabData.length;
      const ongoingCount = tabData.filter(
        (item) => item.status === '进行中',
      ).length;
      const totalDiscountAmount = tabData.reduce(
        (sum, item) => sum + Number(item.discountTotal),
        0,
      );

      // 统计不同优惠类型的数量
      const promotionTypeStats = {};
      tabData.forEach((item) => {
        promotionTypeStats[item.promotionType] =
          (promotionTypeStats[item.promotionType] || 0) + 1;
      });

      // 统计不同活动状态的数量
      const statusStats = {};
      tabData.forEach((item) => {
        statusStats[item.status] = (statusStats[item.status] || 0) + 1;
      });

      // 统计不同活动的参与人数
      const participantCountStats = {};
      tabData.forEach((item) => {
        participantCountStats[item.promotionName] = Number(
          item.participantCount,
        );
      });

      return {
        cards: [
          {
            title: '活动总数',
            value: totalCount,
            desc: `较上月增长${Math.floor(Math.random() * 10) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '进行中活动数',
            value: ongoingCount,
            desc: `占比${Math.round((ongoingCount / totalCount) * 100)}%`,
            color: '#4ECDC4',
          },
          {
            title: '优惠总额',
            value: totalDiscountAmount,
            desc: `较上月增长${Math.floor(Math.random() * 15) + 5}%`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '优惠类型占比',
            type: 'pie',
            data: Object.entries(promotionTypeStats).map(([name, value]) => ({
              value: Math.round((value / totalCount) * 100),
              name,
            })),
          },
          {
            title: '活动状态占比',
            type: 'pie',
            data: Object.entries(statusStats).map(([name, value]) => ({
              value: Math.round((value / totalCount) * 100),
              name,
            })),
          },
          {
            title: '不同活动参与人数对比',
            type: 'bar',
            xAxis: Object.keys(participantCountStats),
            series: Object.values(participantCountStats),
          },
        ],
      };
    }
    case '充值订单': {
      // 充值订单统计
      const totalCount = tabData.length;
      const totalRechargeAmount = tabData.reduce(
        (sum, item) => sum + Number(item.transferAmountOrQuantity),
        0,
      );
      const totalDiscountAmount = tabData.reduce(
        (sum, item) => sum + Number(item.discountAmount),
        0,
      );

      // 统计不同充值套餐的数量
      const rechargePackageStats = {};
      tabData.forEach((item) => {
        rechargePackageStats[item.rechargePackage] =
          (rechargePackageStats[item.rechargePackage] || 0) + 1;
      });

      // 统计不同支付方式的数量
      const payTypeStats = {};
      tabData.forEach((item) => {
        payTypeStats[item.payType] = (payTypeStats[item.payType] || 0) + 1;
      });

      // 生成充值时间趋势数据
      const rechargeTimeStats = {};
      tabData.forEach((item) => {
        const date = item.rechargeTime.split(' ')[0];
        rechargeTimeStats[date] = (rechargeTimeStats[date] || 0) + 1;
      });

      return {
        cards: [
          {
            title: '订单总数',
            value: totalCount,
            desc: `较昨日增长${Math.floor(Math.random() * 10) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '充值总额',
            value: totalRechargeAmount,
            desc: `较昨日增长${Math.floor(Math.random() * 15) + 5}%`,
            color: '#4ECDC4',
          },
          {
            title: '优惠总额',
            value: totalDiscountAmount,
            desc: `较昨日增长${Math.floor(Math.random() * 20) + 5}%`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '充值套餐占比',
            type: 'pie',
            data: Object.entries(rechargePackageStats).map(([name, value]) => ({
              value: Math.round((value / totalCount) * 100),
              name,
            })),
          },
          {
            title: '支付方式占比',
            type: 'pie',
            data: Object.entries(payTypeStats).map(([name, value]) => ({
              value: Math.round((value / totalCount) * 100),
              name,
            })),
          },
          {
            title: '充值时间趋势',
            type: 'line',
            xAxis: Object.keys(rechargeTimeStats),
            series: Object.values(rechargeTimeStats),
          },
        ],
      };
    }
    case '充值记录': {
      // 充值记录统计
      const totalCount = tabData.length;
      const totalRechargeAmount = tabData.reduce(
        (sum, item) => sum + Number(item.rechargeAmount),
        0,
      );
      const avgRechargeAmount = Math.round(totalRechargeAmount / totalCount);

      // 统计不同充值套餐的数量
      const rechargePackageStats = {};
      tabData.forEach((item) => {
        rechargePackageStats[item.rechargePackage] =
          (rechargePackageStats[item.rechargePackage] || 0) + 1;
      });

      // 统计不同支付方式的数量
      const payTypeStats = {};
      tabData.forEach((item) => {
        payTypeStats[item.payType] = (payTypeStats[item.payType] || 0) + 1;
      });

      // 统计不同时间段的充值数量
      const timePeriodStats = {
        '00:00-06:00': 0,
        '06:00-12:00': 0,
        '12:00-18:00': 0,
        '18:00-24:00': 0,
      };
      tabData.forEach((item) => {
        const hour = new Date(item.rechargeTime).getHours();
        if (hour >= 0 && hour < 6) {
          timePeriodStats['00:00-06:00']++;
        } else if (hour >= 6 && hour < 12) {
          timePeriodStats['06:00-12:00']++;
        } else if (hour >= 12 && hour < 18) {
          timePeriodStats['12:00-18:00']++;
        } else {
          timePeriodStats['18:00-24:00']++;
        }
      });

      return {
        cards: [
          {
            title: '记录总数',
            value: totalCount,
            desc: `较昨日增长${Math.floor(Math.random() * 10) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '充值总额',
            value: totalRechargeAmount,
            desc: `较昨日增长${Math.floor(Math.random() * 15) + 5}%`,
            color: '#4ECDC4',
          },
          {
            title: '平均充值金额',
            value: avgRechargeAmount,
            desc: `较昨日增长${Math.floor(Math.random() * 5) + 2}%`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '充值套餐占比',
            type: 'pie',
            data: Object.entries(rechargePackageStats).map(([name, value]) => ({
              value: Math.round((value / totalCount) * 100),
              name,
            })),
          },
          {
            title: '支付方式占比',
            type: 'pie',
            data: Object.entries(payTypeStats).map(([name, value]) => ({
              value: Math.round((value / totalCount) * 100),
              name,
            })),
          },
          {
            title: '不同时间段充值数量对比',
            type: 'bar',
            xAxis: Object.keys(timePeriodStats),
            series: Object.values(timePeriodStats),
          },
        ],
      };
    }
    default: {
      return {
        cards: [],
        charts: [],
      };
    }
  }
};
export const detailFields = (tabName = '充值订单') => {
  if (tabName === '储值卡管理') {
    return [
      { key: 'prepaidCardId', label: '储值卡编号' },
      { key: 'userName', label: '用户姓名' },
      { key: 'carNumber', label: '车牌号码' },
      { key: 'faceValue', label: '面值' },
      { key: 'packageType', label: '套餐类型' },
      { key: 'activateTime', label: '激活时间' },
      { key: 'validPeriod', label: '有效期' },
      { key: 'bindPhone', label: '绑定手机号', formatter: maskPhone },
      { key: 'balance', label: '当前余额' },
      { key: 'cardStatus', label: '卡状态' },
      { key: 'rechargeCount', label: '充值次数' },
      { key: 'consumeCount', label: '消费次数' },
      { key: 'lastTradeTime', label: '最后交易时间' },
    ];
  }

  if (tabName === '充值优惠管理') {
    return [
      { key: 'promotionId', label: '活动ID' },
      { key: 'promotionName', label: '活动名称' },
      { key: 'promotionType', label: '优惠类型' },
      { key: 'applicablePackage', label: '适用套餐' },
      { key: 'promotionRule', label: '优惠规则' },
      { key: 'activityTime', label: '活动时间' },
      { key: 'participantLimit', label: '参与人数上限' },
      { key: 'operator', label: '操作人' },
      { key: 'participantCount', label: '已参与人数' },
      { key: 'writeOffCount', label: '核销次数' },
      { key: 'discountTotal', label: '优惠总额' },
      { key: 'status', label: '状态' },
      { key: 'lastWriteOffTime', label: '最近核销时间' },
    ];
  }

  if (tabName === '充值记录') {
    return [
      { key: 'rechargeNo', label: '充值单号' },
      { key: 'userName', label: '用户姓名' },
      { key: 'carNumber', label: '车牌号码' },
      { key: 'rechargePackage', label: '充值套餐' },
      { key: 'rechargeAmount', label: '充值金额' },
      { key: 'payType', label: '支付方式' },
      { key: 'rechargeTime', label: '充值时间' },
      { key: 'payAmount', label: '实付金额' },
      { key: 'discountAmount', label: '优惠金额' },
      { key: 'rechargeStatus', label: '充值状态' },
      { key: 'arrivalTime', label: '到账时间' },
      { key: 'tradeNo', label: '交易流水号' },
    ];
  }

  // 充值订单标签页的详情抽屉字段
  return [
    { key: 'rechargeNo', label: '充值单号' },
    { key: 'userName', label: '用户姓名' },
    { key: 'carNumber', label: '车牌号码' },
    { key: 'rechargePackage', label: '充值套餐' },
    { key: 'customAmount', label: '自定义金额' },
    { key: 'discountAmount', label: '优惠金额' },
    { key: 'payAmount', label: '实付金额' },
    { key: 'payType', label: '支付方式' },
    { key: 'fromAccount', label: '转出账号' },
    { key: 'toAccount', label: '转入账号' },
    { key: 'transferType', label: '转移类型' },
    { key: 'transferAmountOrQuantity', label: '转移金额/数量' },
    { key: 'auditStatus', label: '审核状态' },
    { key: 'rechargeStatus', label: '充值状态' },
    { key: 'arrivalTime', label: '到账时间' },
    { key: 'walletBalance', label: '钱包余额' },
    { key: 'rechargeTime', label: '充值时间' },
  ];
};

/** 状态映射 */
export const statusMap = {
  auditStatus: {
    待审核: { type: 'warning', text: '待审核' },
    已审核: { type: 'success', text: '已审核' },
    已拒绝: { type: 'danger', text: '已拒绝' },
  },
  rechargeStatus: {
    处理中: { type: 'warning', text: '处理中' },
    成功: { type: 'success', text: '成功' },
    失败: { type: 'danger', text: '失败' },
  },
};
