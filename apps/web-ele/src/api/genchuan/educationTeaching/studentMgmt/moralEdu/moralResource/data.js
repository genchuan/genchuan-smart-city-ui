import { requestClient } from '#/api/request';

// ==================== 德育资源接口 ====================
export function getMoralResourcePage(params) {
  return requestClient.get('/studentmgmt/moral-resource/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const mock = getMockList();
    return { list: mock, total: mock.length };
  });
}

export function createMoralResource(data) {
  return requestClient.post('/studentmgmt/moral-resource/create', data).catch(err => {
    console.warn('上传接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateMoralResource(data) {
  return requestClient.put('/studentmgmt/moral-resource/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function onlineMoralResource(ids) {
  return requestClient.put('/studentmgmt/moral-resource/online', { ids }).catch(err => {
    console.warn('上架接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function offlineMoralResource(ids) {
  return requestClient.put('/studentmgmt/moral-resource/offline', { ids }).catch(err => {
    console.warn('下架接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportMoralResource(params) {
  return requestClient.download('/studentmgmt/moral-resource/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getMoralResourceDetail(params) {
  return requestClient.get('/studentmgmt/moral-resource/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = getMockList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// ==================== 图表接口 ====================
export function getMoralResourceChart(params) {
  return requestClient.get('/studentmgmt/moral-resource/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      statusCount: { unOnlineCount: 3, onlineCount: 17 },
      resourceTypeCount: { courseCount: 10, bookCount: 6, packageCount: 4 },
      learnTrend: [
        { month: '2025-01', count: 80 },
        { month: '2025-02', count: 120 },
        { month: '2025-03', count: 150 },
      ],
      rateTrend: [
        { month: '2025-01', rate: 75.0 },
        { month: '2025-02', rate: 80.0 },
        { month: '2025-03', rate: 85.5 },
      ],
    });
  });
}

export function getMoralResourceCount(params) {
  return requestClient.get('/studentmgmt/moral-resource/chart/resourceCount', { params }).catch(err => {
    console.warn('资源数量统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      typeList: ['课程', '图书', '专题包'],
      resourceCountList: [10, 6, 4],
      learnRateList: [85.5, 78.0, 90.0],
    });
  });
}

// 模拟数据（与接口响应结构一致）
export const getMockList = () => {
  return [
    {
      id: 1,
      resourceName: '中华优秀传统文化课程',
      resourceType: '课程',
      resourceUrl: 'https://example.com/course/1',
      learnNum: 320,
      learnRate: 85.5,
      publishTime: 1767225600000,
      offTime: null,
      status: '已上架',
      remark: '传统文化系列课程',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      resourceName: '雷锋故事图书',
      resourceType: '图书',
      resourceUrl: 'https://example.com/book/2',
      learnNum: 156,
      learnRate: 78.0,
      publishTime: null,
      offTime: null,
      status: '未上架',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 3,
      resourceName: '社会主义核心价值观专题包',
      resourceType: '专题包',
      resourceUrl: 'https://example.com/package/3',
      learnNum: 280,
      learnRate: 92.0,
      publishTime: 1775088000000,
      offTime: null,
      status: '已上架',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775088000000,
      updateTime: 1775088000000,
    },
    {
      id: 4,
      resourceName: '心理健康教育课程',
      resourceType: '课程',
      resourceUrl: 'https://example.com/course/4',
      learnNum: 210,
      learnRate: 79.5,
      publishTime: 1777680000000,
      offTime: 1777766400000,
      status: '已上架',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1777680000000,
      updateTime: 1777766400000,
    },
    {
      id: 5,
      resourceName: '红色家书图书',
      resourceType: '图书',
      resourceUrl: 'https://example.com/book/5',
      learnNum: 98,
      learnRate: 65.0,
      publishTime: null,
      offTime: null,
      status: '未上架',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1780358400000,
      updateTime: 1780358400000,
    },
    {
      id: 6,
      resourceName: '安全教育专题包',
      resourceType: '专题包',
      resourceUrl: 'https://example.com/package/6',
      learnNum: 430,
      learnRate: 88.0,
      publishTime: 1782950400000,
      offTime: null,
      status: '已上架',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1782950400000,
      updateTime: 1782950400000,
    },
  ];
};
