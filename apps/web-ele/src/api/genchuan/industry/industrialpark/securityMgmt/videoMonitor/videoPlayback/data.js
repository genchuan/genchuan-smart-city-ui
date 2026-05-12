// 文件1: src/views/genchuan/industrialPark/securityMgmt/videoPlayback/data.js
import { requestClient } from '#/api/request';

// ==================== 录像回放接口 ====================

// 分页查询
export function getVideoPlaybackPage(params) {
  return requestClient.get('/securitymgmt/video-playback/page', { params })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = getMockList();
      const { pageNo = 1, pageSize = 10, ...filters } = params;
      let filtered = mock.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          const itemValue = item[key];
          if (!itemValue) return false;
          if (typeof value === 'string') {
            return itemValue.toString().includes(value);
          }
          return itemValue === value;
        });
      });
      const start = (pageNo - 1) * pageSize;
      const list = filtered.slice(start, start + pageSize);
      return { list, total: filtered.length };
    });
}

// 获取录像播放地址
export function playVideoPlayback(params) {
  return requestClient.get('/securitymgmt/video-playback/play', { params }).catch(err => {
    console.warn('播放接口失败，模拟播放地址', err);
    return Promise.resolve({ playUrl: '/mock/video/' + params.id + '.mp4' });
  });
}

// 截图
export function snapVideoPlayback(data) {
  return requestClient.post('/securitymgmt/video-playback/snap', data).catch(err => {
    console.warn('截图接口失败，模拟成功', err);
    return Promise.resolve({ success: true, snapUrl: '/mock/snap/' + data.id + '_' + data.snapTime + '.jpg' });
  });
}

// 导出（列表）
export function exportVideoPlayback(params) {
  return requestClient.download('/securitymgmt/video-playback/export', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 删除录像
export function deleteVideoPlayback(data) {
  return requestClient.delete('/securitymgmt/video-playback/delete', { data }).catch(err => {
    console.warn('删除接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 确认删除
export function confirmVideoPlayback(data) {
  return requestClient.put('/securitymgmt/video-playback/confirm', data).catch(err => {
    console.warn('确认接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 摄像头设备详情（关联 camera_mgmt）
export function getCameraDetail(params) {
  return requestClient.get('/securitymgmt/camera-mgmt/get', { params }).catch(err => {
    console.warn('摄像头设备详情接口失败，使用模拟数据', err);
    return Promise.resolve({
      id: params.id,
      name: '高清网络摄像机',
      location: '园区大门东侧',
      status: '在线',
      model: 'DS-2CD2T25F'
    });
  });
}

// 用户详情（关联 sys_user）
export function getUserDetail(params) {
  return requestClient.get('/system/user/get', { params }).catch(err => {
    console.warn('用户详情接口失败，使用模拟数据', err);
    return Promise.resolve({
      id: params.id,
      username: 'admin',
      nickname: '管理员',
      phone: '13800000000'
    });
  });
}

// 录像回放图表数据（柱状图+折线图）
export function getVideoPlaybackChart() {
  return requestClient.get('/securitymgmt/video-playback/chart').catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      dailyQueryCount: [
        { date: '2025-05-01', count: 12 },
        { date: '2025-05-02', count: 15 },
        { date: '2025-05-03', count: 10 },
        { date: '2025-05-04', count: 18 },
        { date: '2025-05-05', count: 14 },
        { date: '2025-05-06', count: 20 },
        { date: '2025-05-07', count: 16 },
      ],
      cameraDurationList: [
        { cameraName: '大门摄像头', duration: 86400 },
        { cameraName: '办公楼东摄像头', duration: 72000 },
        { cameraName: '办公楼西摄像头', duration: 54000 },
        { cameraName: '车间A摄像头', duration: 108000 },
        { cameraName: '仓库北摄像头', duration: 43200 },
      ],
      monthlyTrendList: [
        { date: '2025-04-08', count: 8 },
        { date: '2025-04-12', count: 10 },
        { date: '2025-04-16', count: 12 },
        { date: '2025-04-20', count: 15 },
        { date: '2025-04-24', count: 14 },
        { date: '2025-04-28', count: 18 },
        { date: '2025-05-02', count: 16 },
        { date: '2025-05-06', count: 20 },
        { date: '2025-05-08', count: 22 },
      ],
    });
  });
}

// 模拟数据
export const getMockList = () => {
  return [
    {
      id: 1,
      cameraId: 1,
      cameraName: '大门摄像头',
      videoTime: 1744704000000,
      videoDuration: 3600,
      fileSize: 102400,
      storeStatus: '正常',
      queryTime: 1744707600000,
      exportRecord: null,
      handleUser: 'admin',
      creator: 'admin',
      updater: 'admin',
      createTime: 1744704000000,
      updateTime: 1744707600000,
    },
    {
      id: 2,
      cameraId: 2,
      cameraName: '办公楼东摄像头',
      videoTime: 1744790400000,
      videoDuration: 7200,
      fileSize: 204800,
      storeStatus: '正常',
      queryTime: 1744794000000,
      exportRecord: '/exports/video_2.mp4',
      handleUser: 'security_li',
      creator: 'admin',
      updater: 'security_li',
      createTime: 1744790400000,
      updateTime: 1744794000000,
    },
    {
      id: 3,
      cameraId: 3,
      cameraName: '办公楼西摄像头',
      videoTime: 1744876800000,
      videoDuration: 5400,
      fileSize: 153600,
      storeStatus: '已过期',
      queryTime: null,
      exportRecord: null,
      handleUser: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1744876800000,
      updateTime: 1744876800000,
    },
    {
      id: 4,
      cameraId: 4,
      cameraName: '车间A摄像头',
      videoTime: 1744963200000,
      videoDuration: 10800,
      fileSize: 307200,
      storeStatus: '正常',
      queryTime: 1744966800000,
      exportRecord: null,
      handleUser: 'security_wang',
      creator: 'admin',
      updater: 'security_wang',
      createTime: 1744963200000,
      updateTime: 1744966800000,
    },
    {
      id: 5,
      cameraId: 5,
      cameraName: '仓库北摄像头',
      videoTime: 1745049600000,
      videoDuration: 4320,
      fileSize: 122880,
      storeStatus: '已过期',
      queryTime: null,
      exportRecord: null,
      handleUser: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1745049600000,
      updateTime: 1745049600000,
    },
    {
      id: 6,
      cameraId: 1,
      cameraName: '大门摄像头',
      videoTime: 1745136000000,
      videoDuration: 3600,
      fileSize: 102400,
      storeStatus: '正常',
      queryTime: 1745139600000,
      exportRecord: null,
      handleUser: 'admin',
      creator: 'admin',
      updater: 'admin',
      createTime: 1745136000000,
      updateTime: 1745139600000,
    },
  ];
};
