import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const readStatusMap = {
  '未读': '2',
  '已读': '1'
};
const readStatusReverse = {
  'read': '已读',
  '1': '已读',
  '2': '未读'
};

const replyStatusMap = {
  '未回复': '2',
  '已回复': '1'
};
const replyStatusReverse = {
  'replied': '已回复',
  '1': '已回复',
  '2': '未回复'
};

function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.readStatus && readStatusReverse[result.readStatus]) {
    result.readStatus = readStatusReverse[result.readStatus];
  }
  if (result.replyStatus && replyStatusReverse[result.replyStatus]) {
    result.replyStatus = replyStatusReverse[result.replyStatus];
  }
  return result;
}

function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.readStatus && readStatusMap[result.readStatus]) {
    result.readStatus = readStatusMap[result.readStatus];
  }
  if (result.replyStatus && replyStatusMap[result.replyStatus]) {
    result.replyStatus = replyStatusMap[result.replyStatus];
  }
  return result;
}

function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 家长回复管理接口 ====================
export function getParentReplyPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/parent-reply/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = convertList(getMockList());
      return { list: mock, total: mock.length };
    });
}

export function readParentReply(ids) {
  return requestClient.put('/studentmgmt/parent-reply/read', { ids }).catch(err => {
    console.warn('标记已读接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function replyParentReply(data) {
  return requestClient.put('/studentmgmt/parent-reply/reply', data).catch(err => {
    console.warn('回复接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportParentReply(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/parent-reply/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getParentReplyDetail(params) {
  return requestClient.get('/studentmgmt/parent-reply/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// ==================== 家长提交回复（PUT） ====================
// 注意：方法改为 PUT，且不再有 .catch 模拟成功，以便真实联调
export function submitParentReply(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/parent-reply/submit', convertedData);
}

// ==================== 图表接口 ====================
export function getParentReplyChart(params) {
  return requestClient.get('/studentmgmt/parent-reply/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalReplyCount: 126,
      unreadReplyCount: 8,
      avgReplyDuration: 2.5,
      replyFinishRate: 0.94,
      recentWeekReplyTrend: [
        { date: '2025-03-25', count: 15 },
        { date: '2025-03-26', count: 22 },
        { date: '2025-03-27', count: 18 },
        { date: '2025-03-28', count: 16 },
        { date: '2025-03-29', count: 12 },
        { date: '2025-03-30', count: 9 },
        { date: '2025-03-31', count: 11 },
      ],
    });
  });
}

export function getParentReplyIndex(params) {
  return requestClient.get('/studentmgmt/parent-reply/chart/index', { params }).catch(err => {
    console.warn('核心指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      studentReplyCount: [
        { name: '张三', value: 5 },
        { name: '李四', value: 3 },
        { name: '王五', value: 2 },
      ],
      classReplyRate: [
        { name: '初一1班', value: 0.95 },
        { name: '初一2班', value: 0.92 },
        { name: '初二1班', value: 0.88 },
      ],
      replyTimeDistribute: [
        { name: '1小时内', value: 68 },
        { name: '1-3小时', value: 32 },
        { name: '3-12小时', value: 18 },
        { name: '12小时以上', value: 8 },
      ],
    });
  });
}

// ==================== 模拟数据（仅供兜底） ====================
export const getMockList = () => {
  return [
    {
      id: 1,
      communicateId: 1,
      communicateTitle: '关于加强宿舍安全管理的通知',
      studentId: 1,
      studentName: '张三',
      parentName: '张父',
      parentReplyContent: '收到通知，会提醒孩子注意安全',
      parentReplyTime: 1767225600000,
      teacherReplyContent: '感谢配合',
      teacherReplyTime: 1767312000000,
      readStatus: '1',
      replyStatus: '1',
      remark: '',
      creator: 'parent_zhangsan',
      updater: 'teacher_li',
      createTime: 1767225600000,
      updateTime: 1767312000000,
    },
    {
      id: 2,
      communicateId: 2,
      communicateTitle: '周末留宿申请提醒',
      studentId: 2,
      studentName: '李四',
      parentName: '李母',
      parentReplyContent: '孩子本周末回家，不留宿',
      parentReplyTime: 1769904000000,
      teacherReplyContent: null,
      teacherReplyTime: null,
      readStatus: '2',
      replyStatus: '2',
      remark: '',
      creator: 'parent_lisi',
      updater: null,
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 3,
      communicateId: 3,
      communicateTitle: '期中考试成绩反馈',
      studentId: 3,
      studentName: '王五',
      parentName: '王父',
      parentReplyContent: '成绩进步明显，感谢老师教导',
      parentReplyTime: 1775088000000,
      teacherReplyContent: '孩子很努力，继续保持',
      teacherReplyTime: 1775174400000,
      readStatus: '1',
      replyStatus: '1',
      remark: '',
      creator: 'parent_wangwu',
      updater: 'teacher_wang',
      createTime: 1775088000000,
      updateTime: 1775174400000,
    },
    {
      id: 4,
      communicateId: 1,
      communicateTitle: '关于加强宿舍安全管理的通知',
      studentId: 4,
      studentName: '赵六',
      parentName: '赵母',
      parentReplyContent: '已阅读，会配合学校工作',
      parentReplyTime: 1780358400000,
      teacherReplyContent: null,
      teacherReplyTime: null,
      readStatus: '2',
      replyStatus: '2',
      remark: '',
      creator: 'parent_zhaoliu',
      updater: null,
      createTime: 1780358400000,
      updateTime: 1780358400000,
    },
  ];
};
