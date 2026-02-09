/** 发票申请表格初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      orderSelection: '订单1,订单2',
      invoiceType: '增值税普通发票',
      invoiceTitle: '漳州市芗城区XX公司',
      taxpayerId: '91350602MA12345678',
      email: 'finance@example.com',
      applicationId: 'APP001',
      applicationNo: 'AP202602010001',
      invoiceStatus: '已开具',
      estimateTime: '2026-02-02 10:00:00',
      relatedOrderCount: 2
    },
    {
      orderSelection: '订单3',
      invoiceType: '增值税专用发票',
      invoiceTitle: '漳州市龙文区YY企业',
      taxpayerId: '91350603MA87654321',
      email: 'tax@yy.com',
      applicationId: 'APP002',
      applicationNo: 'AP202602010002',
      invoiceStatus: '处理中',
      estimateTime: '2026-02-03 14:00:00',
      relatedOrderCount: 1
    },
    {
      orderSelection: '订单4,订单5,订单6',
      invoiceType: '增值税普通发票',
      invoiceTitle: '漳州市龙海区ZZ有限公司',
      taxpayerId: '91350681MA13579246',
      email: 'accounts@zz.com',
      applicationId: 'APP003',
      applicationNo: 'AP202602010003',
      invoiceStatus: '待处理',
      estimateTime: '2026-02-04 09:00:00',
      relatedOrderCount: 3
    },
    {
      orderSelection: '订单7',
      invoiceType: '增值税专用发票',
      invoiceTitle: '漳州市长泰区AA公司',
      taxpayerId: '91350625MA24681357',
      email: 'finance@aa.com',
      applicationId: 'APP004',
      applicationNo: 'AP202602010004',
      invoiceStatus: '已开具',
      estimateTime: '2026-02-02 16:00:00',
      relatedOrderCount: 1
    },
    {
      orderSelection: '订单8,订单9',
      invoiceType: '增值税普通发票',
      invoiceTitle: '漳州市漳浦县BB企业',
      taxpayerId: '91350623MA98765432',
      email: 'tax@bb.com',
      applicationId: 'APP005',
      applicationNo: 'AP202602010005',
      invoiceStatus: '处理中',
      estimateTime: '2026-02-03 11:00:00',
      relatedOrderCount: 2
    },
    {
      orderSelection: '订单10',
      invoiceType: '增值税普通发票',
      invoiceTitle: '漳州市云霄县CC有限公司',
      taxpayerId: '91350622MA19283746',
      email: 'accounts@cc.com',
      applicationId: 'APP006',
      applicationNo: 'AP202602010006',
      invoiceStatus: '待处理',
      estimateTime: '2026-02-04 10:30:00',
      relatedOrderCount: 1
    },
    {
      orderSelection: '订单11,订单12,订单13',
      invoiceType: '增值税专用发票',
      invoiceTitle: '漳州市诏安县DD公司',
      taxpayerId: '91350624MA56781234',
      email: 'finance@dd.com',
      applicationId: 'APP007',
      applicationNo: 'AP202602010007',
      invoiceStatus: '已开具',
      estimateTime: '2026-02-02 14:30:00',
      relatedOrderCount: 3
    },
    {
      orderSelection: '订单14',
      invoiceType: '增值税普通发票',
      invoiceTitle: '漳州市东山县EE企业',
      taxpayerId: '91350626MA43219876',
      email: 'tax@ee.com',
      applicationId: 'APP008',
      applicationNo: 'AP202602010008',
      invoiceStatus: '处理中',
      estimateTime: '2026-02-03 15:00:00',
      relatedOrderCount: 1
    },
    {
      orderSelection: '订单15,订单16',
      invoiceType: '增值税普通发票',
      invoiceTitle: '漳州市南靖县FF有限公司',
      taxpayerId: '91350627MA65432198',
      email: 'accounts@ff.com',
      applicationId: 'APP009',
      applicationNo: 'AP202602010009',
      invoiceStatus: '待处理',
      estimateTime: '2026-02-04 11:00:00',
      relatedOrderCount: 2
    },
    {
      orderSelection: '订单17',
      invoiceType: '增值税专用发票',
      invoiceTitle: '漳州市平和县GG公司',
      taxpayerId: '91350628MA78901234',
      email: 'finance@gg.com',
      applicationId: 'APP010',
      applicationNo: 'AP202602010010',
      invoiceStatus: '已开具',
      estimateTime: '2026-02-02 11:30:00',
      relatedOrderCount: 1
    },
    {
      orderSelection: '订单18,订单19,订单20',
      invoiceType: '增值税普通发票',
      invoiceTitle: '漳州市华安县HH企业',
      taxpayerId: '91350629MA34567890',
      email: 'tax@hh.com',
      applicationId: 'APP011',
      applicationNo: 'AP202602010011',
      invoiceStatus: '处理中',
      estimateTime: '2026-02-03 10:00:00',
      relatedOrderCount: 3
    },
    {
      orderSelection: '订单21',
      invoiceType: '增值税普通发票',
      invoiceTitle: '漳州市常山开发区II有限公司',
      taxpayerId: '91350692MA98765432',
      email: 'accounts@ii.com',
      applicationId: 'APP012',
      applicationNo: 'AP202602010012',
      invoiceStatus: '待处理',
      estimateTime: '2026-02-04 09:30:00',
      relatedOrderCount: 1
    }
  ];
};

/** 发票生成表格初始数据 - 按指定字段生成 */
export const generateDataList = () => {
  return [
    {
      applicationNo: 'AP202602010001',
      invoiceStatus: '已开具',
      refreshButton: true,
      invoiceId: 'INV001',
      invoiceNo: '1234567890',
      issueTime: '2026-02-02 10:30:00',
      pdfUrl: 'https://example.com/invoices/INV001.pdf',
      sendStatus: '已发送'
    },
    {
      applicationNo: 'AP202602010002',
      invoiceStatus: '处理中',
      refreshButton: true,
      invoiceId: 'INV002',
      invoiceNo: '0987654321',
      issueTime: '2026-02-03 14:30:00',
      pdfUrl: 'https://example.com/invoices/INV002.pdf',
      sendStatus: '待发送'
    },
    {
      applicationNo: 'AP202602010003',
      invoiceStatus: '待处理',
      refreshButton: true,
      invoiceId: 'INV003',
      invoiceNo: '1357924680',
      issueTime: '2026-02-04 09:30:00',
      pdfUrl: 'https://example.com/invoices/INV003.pdf',
      sendStatus: '待发送'
    },
    {
      applicationNo: 'AP202602010004',
      invoiceStatus: '已开具',
      refreshButton: true,
      invoiceId: 'INV004',
      invoiceNo: '2468013579',
      issueTime: '2026-02-02 16:30:00',
      pdfUrl: 'https://example.com/invoices/INV004.pdf',
      sendStatus: '已发送'
    },
    {
      applicationNo: 'AP202602010005',
      invoiceStatus: '处理中',
      refreshButton: true,
      invoiceId: 'INV005',
      invoiceNo: '3579246801',
      issueTime: '2026-02-03 11:30:00',
      pdfUrl: 'https://example.com/invoices/INV005.pdf',
      sendStatus: '待发送'
    },
    {
      applicationNo: 'AP202602010006',
      invoiceStatus: '待处理',
      refreshButton: true,
      invoiceId: 'INV006',
      invoiceNo: '4680135792',
      issueTime: '2026-02-04 10:30:00',
      pdfUrl: 'https://example.com/invoices/INV006.pdf',
      sendStatus: '待发送'
    },
    {
      applicationNo: 'AP202602010007',
      invoiceStatus: '已开具',
      refreshButton: true,
      invoiceId: 'INV007',
      invoiceNo: '5792468013',
      issueTime: '2026-02-02 14:30:00',
      pdfUrl: 'https://example.com/invoices/INV007.pdf',
      sendStatus: '已发送'
    },
    {
      applicationNo: 'AP202602010008',
      invoiceStatus: '处理中',
      refreshButton: true,
      invoiceId: 'INV008',
      invoiceNo: '6801357924',
      issueTime: '2026-02-03 15:30:00',
      pdfUrl: 'https://example.com/invoices/INV008.pdf',
      sendStatus: '待发送'
    },
    {
      applicationNo: 'AP202602010009',
      invoiceStatus: '待处理',
      refreshButton: true,
      invoiceId: 'INV009',
      invoiceNo: '7924680135',
      issueTime: '2026-02-04 11:30:00',
      pdfUrl: 'https://example.com/invoices/INV009.pdf',
      sendStatus: '待发送'
    },
    {
      applicationNo: 'AP202602010010',
      invoiceStatus: '已开具',
      refreshButton: true,
      invoiceId: 'INV010',
      invoiceNo: '8013579246',
      issueTime: '2026-02-02 11:30:00',
      pdfUrl: 'https://example.com/invoices/INV010.pdf',
      sendStatus: '已发送'
    },
    {
      applicationNo: 'AP202602010011',
      invoiceStatus: '处理中',
      refreshButton: true,
      invoiceId: 'INV011',
      invoiceNo: '9246801357',
      issueTime: '2026-02-03 10:30:00',
      pdfUrl: 'https://example.com/invoices/INV011.pdf',
      sendStatus: '待发送'
    },
    {
      applicationNo: 'AP202602010012',
      invoiceStatus: '待处理',
      refreshButton: true,
      invoiceId: 'INV012',
      invoiceNo: '0135792468',
      issueTime: '2026-02-04 09:30:00',
      pdfUrl: 'https://example.com/invoices/INV012.pdf',
      sendStatus: '待发送'
    }
  ];
};

/** 发票查询表格初始数据 - 按指定字段生成 */
export const queryDataList = () => {
  return [
    {
      invoiceNo: '1234567890',
      timeRange: '2026-02-01 至 2026-02-02',
      invoiceStatus: '已开具',
      carNumber: '闽A12345',
      invoiceId: 'INV001',
      invoiceTitle: '漳州市芗城区XX公司',
      invoiceAmount: 100.00,
      issueTime: '2026-02-02 10:30:00',
      invoiceType: '增值税普通发票',
      operationButton: true
    },
    {
      invoiceNo: '0987654321',
      timeRange: '2026-02-02 至 2026-02-03',
      invoiceStatus: '处理中',
      carNumber: '闽B67890',
      invoiceId: 'INV002',
      invoiceTitle: '漳州市龙文区YY企业',
      invoiceAmount: 200.50,
      issueTime: '2026-02-03 14:30:00',
      invoiceType: '增值税专用发票',
      operationButton: true
    },
    {
      invoiceNo: '1357924680',
      timeRange: '2026-02-03 至 2026-02-04',
      invoiceStatus: '待处理',
      carNumber: '闽C23456',
      invoiceId: 'INV003',
      invoiceTitle: '漳州市龙海区ZZ有限公司',
      invoiceAmount: 300.00,
      issueTime: '2026-02-04 09:30:00',
      invoiceType: '增值税普通发票',
      operationButton: true
    },
    {
      invoiceNo: '2468013579',
      timeRange: '2026-02-01 至 2026-02-02',
      invoiceStatus: '已开具',
      carNumber: '闽D78901',
      invoiceId: 'INV004',
      invoiceTitle: '漳州市长泰区AA公司',
      invoiceAmount: 150.75,
      issueTime: '2026-02-02 16:30:00',
      invoiceType: '增值税专用发票',
      operationButton: true
    },
    {
      invoiceNo: '3579246801',
      timeRange: '2026-02-02 至 2026-02-03',
      invoiceStatus: '处理中',
      carNumber: '闽E34567',
      invoiceId: 'INV005',
      invoiceTitle: '漳州市漳浦县BB企业',
      invoiceAmount: 250.25,
      issueTime: '2026-02-03 11:30:00',
      invoiceType: '增值税普通发票',
      operationButton: true
    },
    {
      invoiceNo: '4680135792',
      timeRange: '2026-02-03 至 2026-02-04',
      invoiceStatus: '待处理',
      carNumber: '闽F89012',
      invoiceId: 'INV006',
      invoiceTitle: '漳州市云霄县CC有限公司',
      invoiceAmount: 350.50,
      issueTime: '2026-02-04 10:30:00',
      invoiceType: '增值税专用发票',
      operationButton: true
    },
    {
      invoiceNo: '5792468013',
      timeRange: '2026-02-01 至 2026-02-02',
      invoiceStatus: '已开具',
      carNumber: '闽G45678',
      invoiceId: 'INV007',
      invoiceTitle: '漳州市诏安县DD公司',
      invoiceAmount: 120.00,
      issueTime: '2026-02-02 14:30:00',
      invoiceType: '增值税普通发票',
      operationButton: true
    },
    {
      invoiceNo: '6801357924',
      timeRange: '2026-02-02 至 2026-02-03',
      invoiceStatus: '处理中',
      carNumber: '闽H90123',
      invoiceId: 'INV008',
      invoiceTitle: '漳州市东山县EE企业',
      invoiceAmount: 220.75,
      issueTime: '2026-02-03 15:30:00',
      invoiceType: '增值税专用发票',
      operationButton: true
    },
    {
      invoiceNo: '7924680135',
      timeRange: '2026-02-03 至 2026-02-04',
      invoiceStatus: '待处理',
      carNumber: '闽J56789',
      invoiceId: 'INV009',
      invoiceTitle: '漳州市南靖县FF有限公司',
      invoiceAmount: 320.25,
      issueTime: '2026-02-04 11:30:00',
      invoiceType: '增值税普通发票',
      operationButton: true
    },
    {
      invoiceNo: '8013579246',
      timeRange: '2026-02-01 至 2026-02-02',
      invoiceStatus: '已开具',
      carNumber: '闽K01234',
      invoiceId: 'INV010',
      invoiceTitle: '漳州市平和县GG公司',
      invoiceAmount: 180.00,
      issueTime: '2026-02-02 11:30:00',
      invoiceType: '增值税专用发票',
      operationButton: true
    },
    {
      invoiceNo: '9246801357',
      timeRange: '2026-02-02 至 2026-02-03',
      invoiceStatus: '处理中',
      carNumber: '闽L67890',
      invoiceId: 'INV011',
      invoiceTitle: '漳州市华安县HH企业',
      invoiceAmount: 280.50,
      issueTime: '2026-02-03 10:30:00',
      invoiceType: '增值税普通发票',
      operationButton: true
    },
    {
      invoiceNo: '0135792468',
      timeRange: '2026-02-03 至 2026-02-04',
      invoiceStatus: '待处理',
      carNumber: '闽M23456',
      invoiceId: 'INV012',
      invoiceTitle: '漳州市常山开发区II有限公司',
      invoiceAmount: 380.75,
      issueTime: '2026-02-04 09:30:00',
      invoiceType: '增值税专用发票',
      operationButton: true
    }
  ];
};

/** 订单选择静态数据 */
export const orderOptions = [
  { label: '订单1（临停）- 闽A12345', value: '订单1' },
  { label: '订单2（临停）- 闽B67890', value: '订单2' },
  { label: '订单3（临停）- 闽C23456', value: '订单3' },
  { label: '订单4（期卡）- 闽D78901', value: '订单4' },
  { label: '订单5（期卡）- 闽E34567', value: '订单5' },
  { label: '订单6（临停）- 闽F89012', value: '订单6' },
  { label: '订单7（临停）- 闽G45678', value: '订单7' },
  { label: '订单8（期卡）- 闽H90123', value: '订单8' },
  { label: '订单9（临停）- 闽J56789', value: '订单9' },
  { label: '订单10（期卡）- 闽K01234', value: '订单10' },
  { label: '订单11（临停）- 闽K67890', value: '订单11' },
  { label: '订单12（临停）- 闽L23456', value: '订单12' },
  { label: '订单13（期卡）- 闽M78901', value: '订单13' },
  { label: '订单14（临停）- 闽M78901', value: '订单14' },
  { label: '订单15（期卡）- 闽N34567', value: '订单15' },
  { label: '订单16（临停）- 闽N34567', value: '订单16' },
  { label: '订单17（临停）- 闽O89012', value: '订单17' },
  { label: '订单18（期卡）- 闽P45678', value: '订单18' },
  { label: '订单19（临停）- 闽P45678', value: '订单19' },
  { label: '订单20（期卡）- 闽Q56789', value: '订单20' },
  { label: '订单21（临停）- 闽Q56789', value: '订单21' }
];

/** 订单详情静态数据 */
export const orderDetails = {
  '订单1': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174000',
    carNumber: '闽A12345',
    entryId: 'ENT001',
    exitId: 'EXT001',
    lotId: 'LOT001',
    spaceId: 'SPACE001',
    parkingDuration: 120,
    originalAmount: 20.00,
    discountAmount: 5.00,
    payAmount: 15.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '微信',
    paymentId: 'PAY001',
    createTime: '2026-02-01 10:00:00',
    updateTime: '2026-02-01 12:00:00',
    remark: '正常临停订单'
  },
  '订单2': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174001',
    carNumber: '闽B67890',
    entryId: 'ENT002',
    exitId: 'EXT002',
    lotId: 'LOT002',
    spaceId: 'SPACE002',
    parkingDuration: 90,
    originalAmount: 15.00,
    discountAmount: 0.00,
    payAmount: 15.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '支付宝',
    paymentId: 'PAY002',
    createTime: '2026-02-01 11:00:00',
    updateTime: '2026-02-01 12:30:00',
    remark: '正常临停订单'
  },
  '订单3': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174002',
    carNumber: '闽C23456',
    entryId: 'ENT003',
    exitId: 'EXT003',
    lotId: 'LOT003',
    spaceId: 'SPACE003',
    parkingDuration: 60,
    originalAmount: 10.00,
    discountAmount: 2.00,
    payAmount: 8.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '现金',
    paymentId: 'PAY003',
    createTime: '2026-02-01 12:00:00',
    updateTime: '2026-02-01 13:00:00',
    remark: '正常临停订单'
  },
  '订单4': {
    type: '期卡订单',
    orderPeriodId: '123e4567-e89b-12d3-a456-426614174003',
    userId: '1',
    carId: 'CAR001',
    packageId: 'PKG001',
    lotIds: ['LOT001', 'LOT002', 'LOT003'],
    originalPrice: 300.00,
    payAmount: 280.00,
    discountAmount: 20.00,
    effectTime: '2026-02-01 00:00:00',
    expireTime: '2026-03-01 00:00:00',
    orderStatus: '已支付',
    payStatus: '已支付',
    payType: '微信',
    paymentId: 'PAY004',
    createTime: '2026-01-31 10:00:00',
    updateTime: '2026-01-31 10:05:00',
    remark: '月度期卡'
  },
  '订单5': {
    type: '期卡订单',
    orderPeriodId: '123e4567-e89b-12d3-a456-426614174004',
    userId: '2',
    carId: 'CAR002',
    packageId: 'PKG002',
    lotIds: ['LOT001', 'LOT002'],
    originalPrice: 600.00,
    payAmount: 550.00,
    discountAmount: 50.00,
    effectTime: '2026-02-01 00:00:00',
    expireTime: '2026-04-01 00:00:00',
    orderStatus: '已支付',
    payStatus: '已支付',
    payType: '支付宝',
    paymentId: 'PAY005',
    createTime: '2026-01-31 11:00:00',
    updateTime: '2026-01-31 11:05:00',
    remark: '季度期卡'
  },
  '订单6': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174005',
    carNumber: '闽F89012',
    entryId: 'ENT004',
    exitId: 'EXT004',
    lotId: 'LOT004',
    spaceId: 'SPACE004',
    parkingDuration: 180,
    originalAmount: 30.00,
    discountAmount: 5.00,
    payAmount: 25.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '微信',
    paymentId: 'PAY006',
    createTime: '2026-02-01 13:00:00',
    updateTime: '2026-02-01 16:00:00',
    remark: '长时间临停订单'
  },
  '订单7': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174006',
    carNumber: '闽G45678',
    entryId: 'ENT005',
    exitId: 'EXT005',
    lotId: 'LOT005',
    spaceId: 'SPACE005',
    parkingDuration: 45,
    originalAmount: 7.50,
    discountAmount: 0.00,
    payAmount: 7.50,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '支付宝',
    paymentId: 'PAY007',
    createTime: '2026-02-01 14:00:00',
    updateTime: '2026-02-01 14:45:00',
    remark: '短时间临停订单'
  },
  '订单8': {
    type: '期卡订单',
    orderPeriodId: '123e4567-e89b-12d3-a456-426614174007',
    userId: '3',
    carId: 'CAR003',
    packageId: 'PKG003',
    lotIds: ['LOT001', 'LOT002', 'LOT003', 'LOT004'],
    originalPrice: 1200.00,
    payAmount: 1100.00,
    discountAmount: 100.00,
    effectTime: '2026-02-01 00:00:00',
    expireTime: '2026-08-01 00:00:00',
    orderStatus: '已支付',
    payStatus: '已支付',
    payType: '微信',
    paymentId: 'PAY008',
    createTime: '2026-01-31 12:00:00',
    updateTime: '2026-01-31 12:05:00',
    remark: '半年期卡'
  },
  '订单9': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174008',
    carNumber: '闽J56789',
    entryId: 'ENT006',
    exitId: 'EXT006',
    lotId: 'LOT006',
    spaceId: 'SPACE006',
    parkingDuration: 150,
    originalAmount: 25.00,
    discountAmount: 3.00,
    payAmount: 22.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '支付宝',
    paymentId: 'PAY009',
    createTime: '2026-02-01 15:00:00',
    updateTime: '2026-02-01 17:30:00',
    remark: '正常临停订单'
  },
  '订单10': {
    type: '期卡订单',
    orderPeriodId: '123e4567-e89b-12d3-a456-426614174009',
    userId: '4',
    carId: 'CAR004',
    packageId: 'PKG004',
    lotIds: ['LOT001'],
    originalPrice: 2400.00,
    payAmount: 2200.00,
    discountAmount: 200.00,
    effectTime: '2026-02-01 00:00:00',
    expireTime: '2027-02-01 00:00:00',
    orderStatus: '已支付',
    payStatus: '已支付',
    payType: '微信',
    paymentId: 'PAY010',
    createTime: '2026-01-31 13:00:00',
    updateTime: '2026-01-31 13:05:00',
    remark: '年期卡'
  },
  '订单11': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174010',
    carNumber: '闽K67890',
    entryId: 'ENT007',
    exitId: 'EXT007',
    lotId: 'LOT007',
    spaceId: 'SPACE007',
    parkingDuration: 120,
    originalAmount: 20.00,
    discountAmount: 5.00,
    payAmount: 15.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '微信',
    paymentId: 'PAY011',
    createTime: '2026-02-01 16:00:00',
    updateTime: '2026-02-01 18:00:00',
    remark: '正常临停订单'
  },
  '订单12': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174011',
    carNumber: '闽L23456',
    entryId: 'ENT008',
    exitId: 'EXT008',
    lotId: 'LOT008',
    spaceId: 'SPACE008',
    parkingDuration: 90,
    originalAmount: 15.00,
    discountAmount: 0.00,
    payAmount: 15.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '支付宝',
    paymentId: 'PAY012',
    createTime: '2026-02-01 17:00:00',
    updateTime: '2026-02-01 18:30:00',
    remark: '正常临停订单'
  },
  '订单13': {
    type: '期卡订单',
    orderPeriodId: '123e4567-e89b-12d3-a456-426614174012',
    userId: '5',
    carId: 'CAR005',
    packageId: 'PKG005',
    lotIds: ['LOT001', 'LOT002', 'LOT003', 'LOT004', 'LOT005'],
    originalPrice: 1800.00,
    payAmount: 1600.00,
    discountAmount: 200.00,
    effectTime: '2026-02-01 00:00:00',
    expireTime: '2026-08-01 00:00:00',
    orderStatus: '已支付',
    payStatus: '已支付',
    payType: '微信',
    paymentId: 'PAY013',
    createTime: '2026-01-31 14:00:00',
    updateTime: '2026-01-31 14:05:00',
    remark: '半年期卡'
  },
  '订单14': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174013',
    carNumber: '闽M78901',
    entryId: 'ENT009',
    exitId: 'EXT009',
    lotId: 'LOT009',
    spaceId: 'SPACE009',
    parkingDuration: 60,
    originalAmount: 10.00,
    discountAmount: 2.00,
    payAmount: 8.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '现金',
    paymentId: 'PAY014',
    createTime: '2026-02-01 18:00:00',
    updateTime: '2026-02-01 19:00:00',
    remark: '正常临停订单'
  },
  '订单15': {
    type: '期卡订单',
    orderPeriodId: '123e4567-e89b-12d3-a456-426614174014',
    userId: '6',
    carId: 'CAR006',
    packageId: 'PKG006',
    lotIds: ['LOT001', 'LOT002'],
    originalPrice: 600.00,
    payAmount: 550.00,
    discountAmount: 50.00,
    effectTime: '2026-02-01 00:00:00',
    expireTime: '2026-05-01 00:00:00',
    orderStatus: '已支付',
    payStatus: '已支付',
    payType: '支付宝',
    paymentId: 'PAY015',
    createTime: '2026-01-31 15:00:00',
    updateTime: '2026-01-31 15:05:00',
    remark: '季度期卡'
  },
  '订单16': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174015',
    carNumber: '闽N34567',
    entryId: 'ENT010',
    exitId: 'EXT010',
    lotId: 'LOT010',
    spaceId: 'SPACE010',
    parkingDuration: 150,
    originalAmount: 25.00,
    discountAmount: 3.00,
    payAmount: 22.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '微信',
    paymentId: 'PAY016',
    createTime: '2026-02-01 19:00:00',
    updateTime: '2026-02-01 21:30:00',
    remark: '正常临停订单'
  },
  '订单17': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174016',
    carNumber: '闽O89012',
    entryId: 'ENT011',
    exitId: 'EXT011',
    lotId: 'LOT011',
    spaceId: 'SPACE011',
    parkingDuration: 90,
    originalAmount: 15.00,
    discountAmount: 0.00,
    payAmount: 15.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '支付宝',
    paymentId: 'PAY017',
    createTime: '2026-02-01 20:00:00',
    updateTime: '2026-02-01 21:30:00',
    remark: '正常临停订单'
  },
  '订单18': {
    type: '期卡订单',
    orderPeriodId: '123e4567-e89b-12d3-a456-426614174017',
    userId: '7',
    carId: 'CAR007',
    packageId: 'PKG007',
    lotIds: ['LOT001', 'LOT002', 'LOT003'],
    originalPrice: 900.00,
    payAmount: 850.00,
    discountAmount: 50.00,
    effectTime: '2026-02-01 00:00:00',
    expireTime: '2026-05-01 00:00:00',
    orderStatus: '已支付',
    payStatus: '已支付',
    payType: '微信',
    paymentId: 'PAY018',
    createTime: '2026-01-31 16:00:00',
    updateTime: '2026-01-31 16:05:00',
    remark: '季度期卡'
  },
  '订单19': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174018',
    carNumber: '闽P45678',
    entryId: 'ENT012',
    exitId: 'EXT012',
    lotId: 'LOT012',
    spaceId: 'SPACE012',
    parkingDuration: 120,
    originalAmount: 20.00,
    discountAmount: 5.00,
    payAmount: 15.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '微信',
    paymentId: 'PAY019',
    createTime: '2026-02-01 21:00:00',
    updateTime: '2026-02-01 23:00:00',
    remark: '正常临停订单'
  },
  '订单20': {
    type: '期卡订单',
    orderPeriodId: '123e4567-e89b-12d3-a456-426614174019',
    userId: '8',
    carId: 'CAR008',
    packageId: 'PKG008',
    lotIds: ['LOT001'],
    originalPrice: 300.00,
    payAmount: 280.00,
    discountAmount: 20.00,
    effectTime: '2026-02-01 00:00:00',
    expireTime: '2026-03-01 00:00:00',
    orderStatus: '已支付',
    payStatus: '已支付',
    payType: '支付宝',
    paymentId: 'PAY020',
    createTime: '2026-01-31 17:00:00',
    updateTime: '2026-01-31 17:05:00',
    remark: '月度期卡'
  },
  '订单21': {
    type: '临停订单',
    orderTempId: '123e4567-e89b-12d3-a456-426614174020',
    carNumber: '闽Q56789',
    entryId: 'ENT013',
    exitId: 'EXT013',
    lotId: 'LOT013',
    spaceId: 'SPACE013',
    parkingDuration: 60,
    originalAmount: 10.00,
    discountAmount: 2.00,
    payAmount: 8.00,
    feeStrategyId: 'FEE001',
    orderStatus: '已完成',
    payStatus: '已支付',
    payType: '现金',
    paymentId: 'PAY021',
    createTime: '2026-02-01 22:00:00',
    updateTime: '2026-02-01 23:00:00',
    remark: '正常临停订单'
  }
};

/** 发票申请表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'orderSelection',
      label: '订单选择',
      component: 'Select',
      componentProps: {
        placeholder: '请选择订单',
        multiple: true,
        options: orderOptions
      },
      rules: 'required'
    },
    {
      fieldName: 'invoiceType',
      label: '发票类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择发票类型',
        options: [
          { label: '增值税普通发票', value: '增值税普通发票' },
          { label: '增值税专用发票', value: '增值税专用发票' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'invoiceTitle',
      label: '发票抬头',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发票抬头'
      },
      rules: 'required'
    },
    {
      fieldName: 'taxpayerId',
      label: '纳税人识别号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入纳税人识别号'
      },
      rules: 'required'
    },
    {
      fieldName: 'email',
      label: '接收邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入接收邮箱'
      },
      rules: 'required'
    },
    {
      fieldName: 'applicationId',
      label: '申请ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请ID',
        disabled: true
      }
    },
    {
      fieldName: 'applicationNo',
      label: '申请编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请编号',
        disabled: true
      }
    },
    {
      fieldName: 'invoiceStatus',
      label: '发票状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择发票状态',
        options: [
          { label: '待处理', value: '待处理' },
          { label: '处理中', value: '处理中' },
          { label: '已开具', value: '已开具' },
          { label: '已撤销', value: '已撤销' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'estimateTime',
      label: '预计开具时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择预计开具时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'relatedOrderCount',
      label: '关联订单数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入关联订单数',
        min: 1,
        disabled: true
      }
    }
  ];
}

/** 发票生成表单配置（包含所有指定字段） */
export function useGenerateFormSchema() {
  return [
    {
      fieldName: 'applicationNo',
      label: '申请编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请编号'
      },
      rules: 'required'
    },
    {
      fieldName: 'invoiceStatus',
      label: '发票状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择发票状态',
        options: [
          { label: '待处理', value: '待处理' },
          { label: '处理中', value: '处理中' },
          { label: '已开具', value: '已开具' },
          { label: '已撤销', value: '已撤销' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'invoiceId',
      label: '发票ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发票ID',
        disabled: true
      }
    },
    {
      fieldName: 'invoiceNo',
      label: '发票号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发票号码'
      },
      rules: 'required'
    },
    {
      fieldName: 'issueTime',
      label: '开具时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择开具时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'pdfUrl',
      label: 'PDF地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入PDF地址'
      },
      rules: 'required'
    },
    {
      fieldName: 'sendStatus',
      label: '发送状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择发送状态',
        options: [
          { label: '待发送', value: '待发送' },
          { label: '已发送', value: '已发送' }
        ]
      },
      rules: 'required'
    }
  ];
}

/** 发票查询表单配置（包含所有指定字段） */
export function useQueryFormSchema() {
  return [
    {
      fieldName: 'invoiceNo',
      label: '发票号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发票号码'
      },
      rules: 'required'
    },
    {
      fieldName: 'timeRange',
      label: '时间范围',
      component: 'Input',
      componentProps: {
        placeholder: '请输入时间范围'
      },
      rules: 'required'
    },
    {
      fieldName: 'invoiceStatus',
      label: '发票状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择发票状态',
        options: [
          { label: '待处理', value: '待处理' },
          { label: '处理中', value: '处理中' },
          { label: '已开具', value: '已开具' },
          { label: '已撤销', value: '已撤销' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'carNumber',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码'
      },
      rules: 'required'
    },
    {
      fieldName: 'invoiceId',
      label: '发票ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发票ID',
        disabled: true
      }
    },
    {
      fieldName: 'invoiceTitle',
      label: '发票抬头',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发票抬头'
      },
      rules: 'required'
    },
    {
      fieldName: 'invoiceAmount',
      label: '发票金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入发票金额',
        min: 0,
        precision: 2
      },
      rules: 'required'
    },
    {
      fieldName: 'issueTime',
      label: '开具时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择开具时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'invoiceType',
      label: '发票类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择发票类型',
        options: [
          { label: '增值税普通发票', value: '增值税普通发票' },
          { label: '增值税专用发票', value: '增值税专用发票' }
        ]
      },
      rules: 'required'
    }
  ];
}

/** 发票申请表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'orderSelection',
      title: '订单选择',
      minWidth: 150,
      sortable: true,
      slots: { default: 'orderSelection' }
    },
    {
      field: 'invoiceType',
      title: '发票类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'invoiceType' },
    },
    {
      field: 'invoiceTitle',
      title: '发票抬头',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'taxpayerId',
      title: '纳税人识别号',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'email',
      title: '接收邮箱',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'applicationId',
      title: '申请ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'applicationId' }
    },
    {
      field: 'applicationNo',
      title: '申请编号',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'invoiceStatus',
      title: '发票状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'invoiceStatus' },
    },
    {
      field: 'estimateTime',
      title: '预计开具时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'relatedOrderCount',
      title: '关联订单数',
      minWidth: 100,
      sortable: true,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    }
  ];
}

/** 发票生成表格列配置 */
export function useGenerateGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'applicationNo',
      title: '申请编号',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'invoiceStatus',
      title: '发票状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'invoiceStatus' }
    },
    {
      field: 'refreshButton',
      title: '刷新按钮',
      minWidth: 80,
      sortable: true,
      slots: { default: 'refreshButton' }
    },
    {
      field: 'invoiceId',
      title: '发票ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'invoiceId' }
    },
    {
      field: 'invoiceNo',
      title: '发票号码',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'issueTime',
      title: '开具时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'pdfUrl',
      title: 'PDF地址',
      minWidth: 200,
      sortable: true,
      slots: { default: 'pdfUrl' }
    },
    {
      field: 'sendStatus',
      title: '发送状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'sendStatus' }
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

/** 发票查询表格列配置 */
export function useQueryGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'invoiceNo',
      title: '发票号码',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'timeRange',
      title: '时间范围',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'invoiceStatus',
      title: '发票状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'invoiceStatus' }
    },
    {
      field: 'carNumber',
      title: '车牌号码',
      minWidth: 100,
      sortable: true,
      slots: { default: 'carNumber' },
    },
    {
      field: 'invoiceId',
      title: '发票ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'invoiceId' },
    },
    {
      field: 'invoiceTitle',
      title: '发票抬头',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'invoiceAmount',
      title: '发票金额',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'issueTime',
      title: '开具时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'invoiceType',
      title: '发票类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'invoiceType' },
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

export const textObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑发票',
  addText: '新增发票',
  // 导出Excel相关文本
  excelName: '发票列表',
  excelAllName: '发票数据.xlsx',
  // 统计总计文本
  total: ' 总计: 发票申请12;已开具3;处理中4;待处理5',
};

export const generateTextObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑发票生成',
  addText: '新增发票生成',
  // 导出Excel相关文本
  excelName: '发票生成列表',
  excelAllName: '发票生成数据.xlsx',
  // 统计总计文本
  total: ' 总计: 发票生成12;已开具6;处理中3;待处理3',
};

export const queryTextObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑发票查询',
  addText: '新增发票查询',
  // 导出Excel相关文本
  excelName: '发票查询列表',
  excelAllName: '发票查询数据.xlsx',
  // 统计总计文本
  total: ' 总计: 发票查询12;已开具6;处理中3;待处理3',
};

/** 发票申请详情抽屉字段配置 */
export const detailFields = [
  { key: 'orderSelection', label: '订单选择' },
  { key: 'invoiceType', label: '发票类型' },
  { key: 'invoiceTitle', label: '发票抬头' },
  { key: 'taxpayerId', label: '纳税人识别号' },
  { key: 'email', label: '接收邮箱' },
  { key: 'applicationId', label: '申请ID' },
  { key: 'applicationNo', label: '申请编号' },
  { key: 'invoiceStatus', label: '发票状态' },
  { key: 'estimateTime', label: '预计开具时间' },
  { key: 'relatedOrderCount', label: '关联订单数' }
];

/** 发票生成详情抽屉字段配置 */
export const generateDetailFields = [
  { key: 'applicationNo', label: '申请编号' },
  { key: 'invoiceStatus', label: '发票状态' },
  { key: 'invoiceId', label: '发票ID' },
  { key: 'invoiceNo', label: '发票号码' },
  { key: 'issueTime', label: '开具时间' },
  { key: 'pdfUrl', label: 'PDF地址' },
  { key: 'sendStatus', label: '发送状态' }
];

/** 发票查询详情抽屉字段配置 */
export const queryDetailFields = [
  { key: 'invoiceNo', label: '发票号码' },
  { key: 'timeRange', label: '时间范围' },
  { key: 'invoiceStatus', label: '发票状态' },
  { key: 'carNumber', label: '车牌号码' },
  { key: 'invoiceId', label: '发票ID' },
  { key: 'invoiceTitle', label: '发票抬头' },
  { key: 'invoiceAmount', label: '发票金额' },
  { key: 'issueTime', label: '开具时间' },
  { key: 'invoiceType', label: '发票类型' }
];

/** 状态选项配置 */
export const statusOptions = [
  { label: '全部', value: '' },
  { label: '待处理', value: '待处理' },
  { label: '处理中', value: '处理中' },
  { label: '已开具', value: '已开具' },
  { label: '已撤销', value: '已撤销' }
];

/** 车辆详情字段配置 */
export const carDetailFields = [
  { key: 'car_id', label: '车辆ID' },
  { key: 'car_number', label: '车牌号码' },
  { key: 'car_type', label: '车辆类型' },
  { key: 'brand', label: '品牌' },
  { key: 'model', label: '型号' },
  { key: 'color', label: '颜色' },
  { key: 'user_id', label: '用户ID' },
  { key: 'bind_time', label: '绑定时间' },
  { key: 'status', label: '状态' },
  { key: 'remark', label: '备注' }
];

/** 车辆信息模拟数据 */
export const carInfoData = [
  { car_id: 'CAR001', car_number: '闽A12345', car_type: '小型车', brand: '大众', model: '帕萨特', color: '黑色', user_id: '1', bind_time: '2026-01-01 10:00:00', status: '正常', remark: '个人车辆' },
  { car_id: 'CAR002', car_number: '闽B67890', car_type: '小型车', brand: '丰田', model: '凯美瑞', color: '白色', user_id: '2', bind_time: '2026-01-02 11:00:00', status: '正常', remark: '个人车辆' },
  { car_id: 'CAR003', car_number: '闽C23456', car_type: '小型车', brand: '本田', model: '雅阁', color: '银色', user_id: '3', bind_time: '2026-01-03 12:00:00', status: '正常', remark: '个人车辆' },
  { car_id: 'CAR004', car_number: '闽D78901', car_type: '小型车', brand: '奥迪', model: 'A4L', color: '蓝色', user_id: '4', bind_time: '2026-01-04 13:00:00', status: '正常', remark: '个人车辆' },
  { car_id: 'CAR005', car_number: '闽E34567', car_type: '小型车', brand: '宝马', model: '3系', color: '黑色', user_id: '5', bind_time: '2026-01-05 14:00:00', status: '正常', remark: '个人车辆' },
  { car_id: 'CAR006', car_number: '闽F89012', car_type: '小型车', brand: '奔驰', model: 'C级', color: '白色', user_id: '6', bind_time: '2026-01-06 15:00:00', status: '正常', remark: '个人车辆' },
  { car_id: 'CAR007', car_number: '闽G45678', car_type: '小型车', brand: '大众', model: '速腾', color: '红色', user_id: '7', bind_time: '2026-01-07 16:00:00', status: '正常', remark: '个人车辆' },
  { car_id: 'CAR008', car_number: '闽H90123', car_type: '小型车', brand: '丰田', model: '卡罗拉', color: '银色', user_id: '8', bind_time: '2026-01-08 17:00:00', status: '正常', remark: '个人车辆' },
  { car_id: 'CAR009', car_number: '闽J56789', car_type: '小型车', brand: '本田', model: '思域', color: '蓝色', user_id: '9', bind_time: '2026-01-09 18:00:00', status: '正常', remark: '个人车辆' },
  { car_id: 'CAR010', car_number: '闽K01234', car_type: '小型车', brand: '日产', model: '轩逸', color: '黑色', user_id: '10', bind_time: '2026-01-10 19:00:00', status: '正常', remark: '个人车辆' },
  { car_id: 'CAR011', car_number: '闽L67890', car_type: '小型车', brand: '大众', model: '朗逸', color: '白色', user_id: '11', bind_time: '2026-01-11 20:00:00', status: '正常', remark: '个人车辆' },
  { car_id: 'CAR012', car_number: '闽M23456', car_type: '小型车', brand: '丰田', model: '雷凌', color: '银色', user_id: '12', bind_time: '2026-01-12 21:00:00', status: '正常', remark: '个人车辆' }
];

/** 根据标签页获取统计数据 */
export const getStatsDataByTab = (tabName) => {
  // 获取对应标签页的数据
  let tabData;
  switch (tabName) {
    case '发票申请':
      tabData = dataList();
      break;
    case '发票生成':
      tabData = generateDataList();
      break;
    case '发票查询':
      tabData = queryDataList();
      break;
    default:
      tabData = [];
  }

  const totalCount = tabData.length;

  switch (tabName) {
    case '发票申请': {
      // 发票申请统计
      const todayCount = tabData.length; // 模拟今日申请数
      const issuedCount = tabData.filter(item => item.invoiceStatus === '已开具').length;
      const pendingCount = tabData.filter(item => ['待处理', '处理中'].includes(item.invoiceStatus)).length;

      // 统计不同发票类型的数量
      const invoiceTypeStats = {};
      tabData.forEach(item => {
        invoiceTypeStats[item.invoiceType] = (invoiceTypeStats[item.invoiceType] || 0) + 1;
      });

      // 统计不同申请状态的数量
      const statusStats = {};
      tabData.forEach(item => {
        statusStats[item.invoiceStatus] = (statusStats[item.invoiceStatus] || 0) + 1;
      });

      // 统计不同订单类型开票量
      const orderTypeStats = {
        临停订单: 0,
        期卡订单: 0
      };
      // 解析订单选择字段，统计订单类型
      tabData.forEach(item => {
        const orderNames = item.orderSelection.split(',').map(order => order.trim());
        orderNames.forEach(orderName => {
          const orderDetail = orderDetails[orderName];
          if (orderDetail) {
            if (orderDetail.type === '临停订单') {
              orderTypeStats['临停订单']++;
            } else if (orderDetail.type === '期卡订单') {
              orderTypeStats['期卡订单']++;
            }
          }
        });
      });

      return {
        cards: [
          {
            title: '今日申请数',
            value: todayCount,
            desc: `较昨日增长${Math.floor(Math.random() * 15) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '已开具数',
            value: issuedCount,
            desc: `占比${Math.round((issuedCount / totalCount) * 100)}%`,
            color: '#4ECDC4',
          },
          {
            title: '待开具数',
            value: pendingCount,
            desc: `占比${Math.round((pendingCount / totalCount) * 100)}%`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '发票类型占比',
            type: 'pie',
            data: Object.entries(invoiceTypeStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '申请状态占比',
            type: 'pie',
            data: Object.entries(statusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '不同订单类型开票量对比',
            type: 'bar',
            xAxis: Object.keys(orderTypeStats),
            series: Object.values(orderTypeStats),
          },
        ],
      };
    }
    case '发票生成': {
      // 发票生成统计
      const generatedCount = tabData.length;
      const sentCount = tabData.filter(item => item.sendStatus === '已发送').length;
      const downloadCount = Math.floor(totalCount * 1.5); // 基于实际数据量模拟下载次数

      // 统计不同发送状态的数量
      const sendStatusStats = {};
      tabData.forEach(item => {
        sendStatusStats[item.sendStatus] = (sendStatusStats[item.sendStatus] || 0) + 1;
      });

      // 统计不同发票状态的数量
      const invoiceStatusStats = {};
      tabData.forEach(item => {
        invoiceStatusStats[item.invoiceStatus] = (invoiceStatusStats[item.invoiceStatus] || 0) + 1;
      });

      // 生成近7天发票生成趋势（基于实际数据分布）
      const days = ['2月3日', '2月4日', '2月5日', '2月6日', '2月7日', '2月8日', '2月9日'];
      const trendData = days.map((_, index) => {
        // 基于实际数据量生成合理的趋势数据
        return Math.floor((totalCount / 7) * (0.8 + Math.random() * 0.4));
      });

      return {
        cards: [
          {
            title: '已生成发票数',
            value: generatedCount,
            desc: `较昨日增长${Math.floor(Math.random() * 10) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '成功发送数',
            value: sentCount,
            desc: `发送率${Math.round((sentCount / totalCount) * 100)}%`,
            color: '#4ECDC4',
          },
          {
            title: '下载次数',
            value: downloadCount,
            desc: '近7日累计',
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '发送状态占比',
            type: 'pie',
            data: Object.entries(sendStatusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '发票状态占比',
            type: 'pie',
            data: Object.entries(invoiceStatusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '近7天发票生成趋势',
            type: 'line',
            xAxis: days,
            series: trendData,
          },
        ],
      };
    }
    case '发票查询': {
      // 发票查询统计
      const totalInvoiceCount = tabData.length;
      const totalAmount = tabData.reduce((sum, item) => sum + (item.invoiceAmount || 0), 0);
      const avgAmount = totalCount > 0 ? Math.round(totalAmount / totalCount * 100) / 100 : 0;

      // 统计不同发票类型的数量
      const invoiceTypeStats = {};
      tabData.forEach(item => {
        invoiceTypeStats[item.invoiceType] = (invoiceTypeStats[item.invoiceType] || 0) + 1;
      });

      // 统计不同发票状态的数量
      const statusStats = {};
      tabData.forEach(item => {
        statusStats[item.invoiceStatus] = (statusStats[item.invoiceStatus] || 0) + 1;
      });

      // 基于实际数据生成不同月份开票金额趋势
      const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
      // 计算平均每月开票金额
      const avgMonthlyAmount = totalAmount / 6;
      // 基于平均金额生成合理的趋势数据
      const amountTrend = months.map((_, index) => {
        // 基于实际平均金额生成合理的趋势数据，有一定波动
        return Math.floor(avgMonthlyAmount * (0.8 + Math.random() * 0.4));
      });

      return {
        cards: [
          {
            title: '查询周期发票总数',
            value: totalInvoiceCount,
            desc: `较上月增长${Math.floor(Math.random() * 15) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '开票总金额',
            value: `¥${totalAmount.toFixed(2)}`,
            desc: '查询周期内',
            color: '#4ECDC4',
          },
          {
            title: '平均开票金额',
            value: `¥${avgAmount.toFixed(2)}`,
            desc: '每笔发票',
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '发票类型占比',
            type: 'pie',
            data: Object.entries(invoiceTypeStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '发票状态占比',
            type: 'pie',
            data: Object.entries(statusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '不同月份开票金额趋势',
            type: 'bar',
            xAxis: months,
            series: amountTrend,
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
};
