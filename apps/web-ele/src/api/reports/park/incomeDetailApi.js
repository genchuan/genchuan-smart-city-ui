// 收入明细报表API - 包含模拟数据
import { ElMessage } from 'element-plus';

/**
 * 模拟收入明细报表数据
 * @param {object} params 查询参数
 * @returns {Promise} 模拟数据
 */
export const getIncomeDetailReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 400));

  const {
    startDate = '2023-12-25',
    endDate = '2023-12-25',
    orderNo = '',
    plateNumber = '',
    region = '',
    parkingId = '',
    paymentType = '',
    page = 1,
    pageSize = 50,
  } = params;

  // 模拟收入明细数据
  const generateDetailData = (count = 50) => {
    const data = [];
    const regions = ['芗城区', '龙文区', '龙海区', '漳浦县'];
    const parkingNames = [
      '漳州万达广场停车场',
      '芗城政府路侧停车场',
      '龙文区体育中心停车场',
      '龙海区商业城停车场',
      '漳浦县汽车站停车场',
    ];
    const paymentTypes = [
      { type: 'wechat', name: '微信支付' },
      { type: 'alipay', name: '支付宝' },
      { type: 'cash', name: '现金支付' },
    ];

    for (let i = 1; i <= count; i++) {
      const orderId = `ORD${String(i).padStart(6, '0')}`;
      const regionIndex = Math.floor(Math.random() * regions.length);
      const parkingIndex = Math.floor(Math.random() * parkingNames.length);
      const paymentIndex = Math.floor(Math.random() * paymentTypes.length);
      const basicAmount = Math.floor(Math.random() * 50) + 5;
      const discountAmount = Math.floor(Math.random() * 5);
      const paidAmount = basicAmount - discountAmount;
      const parkingDuration = `${Math.floor(Math.random() * 8) + 1}小时${Math.floor(Math.random() * 60)}分钟`;

      data.push({
        id: i,
        orderNo: orderNo || orderId,
        plateNumber: plateNumber || `闽E${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
        parkDuration: parkingDuration,
        basicAmount,
        discountAmount,
        paidAmount,
        paymentType: paymentTypes[paymentIndex].name,
        paymentTime: `2023-12-25 ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
        parkingName: parkingNames[parkingIndex],
        regionName: regions[regionIndex],
        receiptUrl: paymentTypes[paymentIndex].type === 'cash' ? '' : `https://example.com/receipt/${orderId}.jpg`,
        remark: i % 10 === 0 ? '异常订单，需核实' : '',
      });
    }

    return data;
  };

  const allData = generateDetailData(200);

  // 根据筛选条件过滤数据
  let filteredData = allData;

  if (orderNo) {
    filteredData = filteredData.filter(item => item.orderNo.includes(orderNo));
  }

  if (plateNumber) {
    filteredData = filteredData.filter(item => item.plateNumber.includes(plateNumber));
  }

  if (region) {
    const regionMap = {
      'xiangcheng': '芗城区',
      'longwen': '龙文区',
      'longhai': '龙海区',
      'zhangpu': '漳浦县',
    };
    filteredData = filteredData.filter(item =>
      item.regionName === regionMap[region] || item.regionName === region
    );
  }

  if (paymentType) {
    const paymentMap = {
      'wechat': '微信支付',
      'alipay': '支付宝',
      'cash': '现金支付',
      'card': '刷卡支付',
      'member': '会员支付',
    };
    filteredData = filteredData.filter(item =>
      item.paymentType === paymentMap[paymentType] || item.paymentType === paymentType
    );
  }

  // 分页处理
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // 计算总金额
  const totalAmount = filteredData.reduce((sum, item) => sum + item.paidAmount, 0);

  return {
    data: paginatedData,
    total: filteredData.length,
    totalAmount,
    page,
    pageSize,
    generatedAt: new Date().toISOString(),
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
    ];

    const csvRows = data.data.map((item) => [
      item.orderNo,
      item.plateNumber,
      item.parkDuration,
      item.basicAmount,
      item.discountAmount,
      item.paidAmount,
      item.paymentType,
      item.paymentTime,
      item.parkingName,
      item.regionName,
      item.remark,
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
    link.download = `收入明细报表_${params.startDate || '开始'}_${params.endDate || '结束'}.csv`;

    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    ElMessage.success('导出成功（CSV格式）');

    return {
      success: true,
      message: '导出成功',
      filename: link.download,
      data,
      exportTime: new Date().toISOString(),
    };
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error(`导出失败: ${error.message}`);
    throw error;
  }
};
