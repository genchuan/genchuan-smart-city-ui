// 收入明细报表API - 包含模拟数据
import { ElMessage } from 'element-plus';

/**
 * 模拟收入明细报表数据
 * @param {object} params 查询参数
 * @returns {Promise} 模拟数据
 */
export const getIncomeDetailReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  const {
    startDate = '2023-12-01',
    endDate = '2023-12-31',
    orderNo = '',
    plateNumber = '',
    region = '',
    parkingId = '',
    paymentType = '',
    page = 1,
    pageSize = 50,
  } = params;

  // 生成模拟数据
  const generateDetailData = () => {
    const data = [];
    const regions = [
      { code: 'xiangcheng', name: '芗城区' },
      { code: 'longwen', name: '龙文区' },
      { code: 'longhai', name: '龙海区' },
      { code: 'zhangpu', name: '漳浦县' },
    ];

    const parkingList = [
      { id: 'park001', name: '漳州万达广场停车场', region: '芗城区', type: 'public' },
      { id: 'park002', name: '芗城政府路侧停车场', region: '芗城区', type: 'roadside' },
      { id: 'park003', name: '龙文区体育中心停车场', region: '龙文区', type: 'public' },
      { id: 'park004', name: '龙海区商业城停车场', region: '龙海区', type: 'public' },
      { id: 'park005', name: '漳浦县汽车站停车场', region: '漳浦县', type: 'special' },
    ];

    const paymentTypes = [
      { type: 'wechat', name: '微信支付' },
      { type: 'alipay', name: '支付宝' },
      { type: 'cash', name: '现金支付' },
      { type: 'card', name: '刷卡支付' },
      { type: 'member', name: '会员支付' },
    ];

    const plateNumbers = [
      '闽E12345', '闽E23456', '闽E34567', '闽E45678', '闽E56789',
      '闽D12345', '闽D23456', '闽D34567', '闽D45678', '闽D56789',
      '闽F12345', '闽F23456', '闽F34567', '闽F45678', '闽F56789',
    ];

    // 生成200条数据，以便分页测试
    for (let i = 1; i <= 200; i++) {
      const orderId = `ORD${String(i).padStart(6, '0')}`;
      const randomParking = parkingList[Math.floor(Math.random() * parkingList.length)];
      const randomPayment = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      const randomPlate = plateNumbers[Math.floor(Math.random() * plateNumbers.length)];

      // 随机日期在范围内
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const randomTime = start.getTime() + Math.random() * timeDiff;
      const randomDate = new Date(randomTime);
      const dateStr = randomDate.toISOString().split('T')[0];

      // 随机时间
      const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
      const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      const second = Math.floor(Math.random() * 60).toString().padStart(2, '0');

      // 费用计算
      const baseHours = Math.floor(Math.random() * 10) + 1;
      const baseAmount = baseHours * 5 + Math.floor(Math.random() * 20);
      const discountAmount = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0;
      const paidAmount = baseAmount - discountAmount;

      // 确保停车场区域与区域筛选匹配
      const parkingRegion = parkingList.find(p => p.id === randomParking.id)?.region || randomRegion.name;

      data.push({
        id: i,
        orderNo: orderId,
        plateNumber: randomPlate,
        parkDuration: `${baseHours}小时${Math.floor(Math.random() * 60)}分钟`,
        basicAmount: baseAmount,
        discountAmount: discountAmount,
        paidAmount: paidAmount,
        paymentType: randomPayment.name,
        paymentTime: `${dateStr} ${hour}:${minute}:${second}`,
        parkingName: randomParking.name,
        regionName: parkingRegion,
        parkingId: randomParking.id,
        paymentCode: randomPayment.type,
        receiptUrl: ['cash', 'card'].includes(randomPayment.type)
          ? ''
          : `https://example.com/receipt/${orderId}.jpg`,
        remark: i % 10 === 0 ? '异常订单，需核实' :
          i % 5 === 0 ? '会员首次停车' :
            i % 7 === 0 ? '节假日优惠' : '',
        status: Math.random() > 0.9 ? '异常' : '正常',
      });
    }

    return data;
  };

  const allData = generateDetailData();

  // 筛选逻辑
  let filteredData = [...allData];

  // 日期筛选
  if (startDate && endDate) {
    filteredData = filteredData.filter(item => {
      const itemDate = item.paymentTime.split(' ')[0];
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  // 订单号筛选
  if (orderNo) {
    filteredData = filteredData.filter(item =>
      item.orderNo.toLowerCase().includes(orderNo.toLowerCase())
    );
  }

  // 车牌筛选
  if (plateNumber) {
    filteredData = filteredData.filter(item =>
      item.plateNumber.toLowerCase().includes(plateNumber.toLowerCase())
    );
  }

  // 区域筛选
  if (region) {
    const regionMap = {
      'xiangcheng': '芗城区',
      'longwen': '龙文区',
      'longhai': '龙海区',
      'zhangpu': '漳浦县',
    };
    const targetRegion = regionMap[region] || region;
    filteredData = filteredData.filter(item =>
      item.regionName === targetRegion ||
      item.regionName.includes(targetRegion)
    );
  }

  // 停车场筛选
  if (parkingId) {
    filteredData = filteredData.filter(item =>
      item.parkingId === parkingId ||
      item.parkingName.includes(parkingId)
    );
  }

  // 支付方式筛选
  if (paymentType) {
    const paymentMap = {
      'wechat': '微信支付',
      'alipay': '支付宝',
      'cash': '现金支付',
      'card': '刷卡支付',
      'member': '会员支付',
    };
    const targetPayment = paymentMap[paymentType] || paymentType;
    filteredData = filteredData.filter(item =>
      item.paymentType === targetPayment ||
      item.paymentCode === paymentType
    );
  }

  // 分页处理 - 修复分页参数
  const total = filteredData.length;
  const actualPage = page || 1;
  const actualPageSize = pageSize || 10;
  const startIndex = (actualPage - 1) * actualPageSize;
  const endIndex = Math.min(startIndex + actualPageSize, total);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // 计算总金额
  const totalAmount = filteredData.reduce((sum, item) => sum + item.paidAmount, 0);

  return {
    data: paginatedData,
    total: total,
    totalAmount: totalAmount,
    page: actualPage,
    pageSize: actualPageSize,
    pageCount: Math.ceil(total / actualPageSize),
    generatedAt: new Date().toISOString(),
    summary: {
      totalOrders: total,
      totalAmount: totalAmount,
      avgAmount: total > 0 ? Math.round(totalAmount / total) : 0,
      wechatAmount: filteredData.filter(d => d.paymentCode === 'wechat').reduce((sum, d) => sum + d.paidAmount, 0),
      alipayAmount: filteredData.filter(d => d.paymentCode === 'alipay').reduce((sum, d) => sum + d.paidAmount, 0),
      cashAmount: filteredData.filter(d => d.paymentCode === 'cash').reduce((sum, d) => sum + d.paidAmount, 0),
    }
  };
};

/**
 * 生成收入明细报表CSV文件
 * @param {object} params 导出参数
 * @returns {Promise} 模拟导出
 */
export const exportIncomeDetailReport = async (params) => {
  try {
    const data = await getIncomeDetailReport({
      ...params,
      page: 1,
      pageSize: 10000, // 导出所有数据
    });

    // 生成CSV内容
    const headers = [
      '订单号',
      '车牌号码',
      '停车时长',
      '基础费用(元)',
      '优惠金额(元)',
      '实付金额(元)',
      '支付方式',
      '支付时间',
      '停车场',
      '行政区划',
      '备注',
      '状态',
    ];

    const csvRows = data.data.map((item) => [
      item.orderNo,
      item.plateNumber,
      item.parkDuration,
      item.basicAmount.toFixed(2),
      item.discountAmount.toFixed(2),
      item.paidAmount.toFixed(2),
      item.paymentType,
      item.paymentTime,
      item.parkingName,
      item.regionName,
      item.remark,
      item.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map((row) => row.join(',')),
    ].join('\n');

    // 创建Blob并下载
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `收入明细报表_${params.startDate || '开始'}_${params.endDate || '结束'}_${new Date().getTime()}.csv`;

    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    ElMessage.success(`导出成功，共${data.total}条记录`);

    return {
      success: true,
      message: '导出成功',
      filename: link.download,
      totalRecords: data.total,
      totalAmount: data.totalAmount,
      exportTime: new Date().toISOString(),
    };
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error(`导出失败: ${error.message}`);
    throw error;
  }
};

// 获取统计汇总（可选）
export const getIncomeSummary = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const data = await getIncomeDetailReport({
    ...params,
    page: 1,
    pageSize: 10000,
  });

  return data.summary;
};

// 获取最近收入明细（用于首页展示）
export const getRecentIncomeDetails = async (limit = 10) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const data = await getIncomeDetailReport({
    startDate: '2023-12-20',
    endDate: '2023-12-31',
    page: 1,
    pageSize: limit,
  });

  return {
    recentDetails: data.data,
    summary: data.summary,
  };
};
