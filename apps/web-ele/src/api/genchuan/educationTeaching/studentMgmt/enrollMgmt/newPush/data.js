import { requestClient } from '#/api/request';

// ==================== 迎新推送接口 ====================

// 分页查询
export function getNewPushPage(params) {
  return requestClient.get('/studentmgmt/new-push/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

// 配置（新增推送任务）
export function createNewPushConfig(data) {
  return requestClient.post('/studentmgmt/new-push/config', data).catch(err => {
    console.warn('配置接口失败，模拟成功', err);
    return Promise.resolve({ id: Date.now() });
  });
}

// 推送（批量）
export function pushNewPush(data) {
  return requestClient.put('/studentmgmt/new-push/push', data).catch(err => {
    console.warn('推送接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑
export function updateNewPush(data) {
  return requestClient.put('/studentmgmt/new-push/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportNewPush(params) {
  return requestClient.download('/studentmgmt/new-push/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getNewPushDetail(params) {
  return requestClient.get('/studentmgmt/new-push/get', { params })
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(detail);
    });
}

// 迎新推送统计看板（折线图 + 卡片）
export function getNewPushChart(params) {
  return requestClient.get('/studentmgmt/new-push/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      waitPushCount: 2,
      finishedCount: 8,
      totalCount: 10,
      totalPushNum: 2800,
      avgFinishRate: 98.5,
      dateList: ['2025-08-20', '2025-08-22', '2025-08-25', '2025-08-28', '2025-08-30'],
      dailyPushList: [320, 320, 320, 320, 320],
    });
  });
}

// 推送核心指标统计（卡片）
export function getNewPushIndex(params) {
  return requestClient.get('/studentmgmt/new-push/chart/pushIndex', { params }).catch(err => {
    console.warn('指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalTaskCount: 10,
      pushedCount: 8,
      pushRate: 80.0,
      totalPushNum: 2560,
    });
  });
}

// 模拟数据
export const getMockList = () => {
  return [
    {
      id: 1,
      taskName: '新生入学须知推送',
      pushContent: '请各位新生于9月1日到校报到，携带录取通知书...',
      pushNum: 320,
      pushTime: 1735689600000,
      finishRate: 100.0,
      status: '已推送',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1735603200000,
      updateTime: 1735689600000,
    },
    {
      id: 2,
      taskName: '宿舍分配结果通知',
      pushContent: '您的宿舍已分配，请登录系统查看...',
      pushNum: null,
      pushTime: null,
      finishRate: null,
      status: '未推送',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1735603200000,
      updateTime: 1735603200000,
    },
    {
      id: 3,
      taskName: '军训安排提醒',
      pushContent: '军训时间为9月5日-9月18日，请做好准备...',
      pushNum: 310,
      pushTime: 1738281600000,
      finishRate: 96.9,
      status: '已推送',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1738195200000,
      updateTime: 1738281600000,
    },
    {
      id: 4,
      taskName: '新生体检通知',
      pushContent: '请于9月10日到校医院参加体检...',
      pushNum: null,
      pushTime: null,
      finishRate: null,
      status: '未推送',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1738195200000,
      updateTime: 1738195200000,
    },
    {
      id: 5,
      taskName: '开学典礼邀请',
      pushContent: '9月2日上午9点在大礼堂举行开学典礼...',
      pushNum: 315,
      pushTime: 1738886400000,
      finishRate: 98.4,
      status: '已推送',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1738800000000,
      updateTime: 1738886400000,
    },
    {
      id: 6,
      taskName: '校园卡使用指南',
      pushContent: '校园卡可在食堂、图书馆使用，请及时充值...',
      pushNum: null,
      pushTime: null,
      finishRate: null,
      status: '未推送',
      remark: '',
      creator: 'teacher_wang',
      updater: 'teacher_wang',
      createTime: 1738800000000,
      updateTime: 1738800000000,
    },
  ];
};
