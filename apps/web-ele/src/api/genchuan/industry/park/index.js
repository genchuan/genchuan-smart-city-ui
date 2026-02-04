import { requestClient } from '#/api/request';
 

/** 车辆入场记录分页 */
export function getDriveinList(params) { 
  return requestClient.get('/industry/car-drivein-record/page', {
    params,
  });
}
/** 车辆出场记录分页 */
export function getOutDriveinList(params) { 
  return requestClient.get('/industry/car-driveout-record/page', {
    params,
  });
}
/** 车场信息记录 */
export function getParkingData(params) { 
  return requestClient.get('/industry/park-lot/page', {
    params,
  });
} 

/** 车辆创建记录 */
export function createDriveObj(data) { 
  return requestClient.post('/industry/car-drivein-record/create', data);
}

/** 车辆出场创建记录 */
export function createOutDriveObj(data) { 
  return requestClient.post('/industry/car-driveout-record/create', data);
}

/** 车场创建记录 */
export function createParklot(data) { 
  return requestClient.post('/industry/park-lot/create', data);
}
export function updateParklot(data) {
  return requestClient.put('/industry/park-lot/update', data);
}
export function deleteParklot(id) {
  return requestClient.delete(`/industry/park-lot/delete?id=${id}`);
} 
/** 同步数据 */
export function refreshSync(data) { 
  return requestClient.post('/industry/parking-record-sync/sync', data);
}


export function getRoadList(params) { 
  return requestClient.get('/park/roadside-berth-manage/page', {
    params,
  });
}
export function updateRoad(data) { 
  return requestClient.put('/park/roadside-berth-manage/update', data);
}
export function createRoad(data) { 
  return requestClient.post('/park/roadside-berth-manage/create', data);
} 

export function deleteRoad(id) { 
  return requestClient.delete(`/park/roadside-berth-manage/delete?id=${id}` );
} 
