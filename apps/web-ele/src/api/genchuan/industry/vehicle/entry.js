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


/** 车辆创建记录 */
export function createDriveObj(data) { 
  return requestClient.post('/industry/car-drivein-record/create', data);
}

/** 车辆出场创建记录 */
export function createOutDriveObj(data) { 
  return requestClient.post('/industry/car-driveout-record/create', data);
}
/** 同步数据 */
export function refreshSync(data) { 
  return requestClient.post('/industry/parking-record-sync/sync', data);
}

 
 
export function updateDriveObj(data) {
  return requestClient.put('/industry/car-drivein-record/update', data);
}
export function updateOutDriveObj(data) {
  return requestClient.put('/industry/car-driveout-record/update', data);
}


/** 车辆删除 */
/** 删除【我的】所有对话，置顶除外 */
export function deleteDriveObj(id) {
  return requestClient.delete(`/industry/car-drivein-record/delete?id=${id}`);
} 
export function deleteOutDriveObj(id) {
  return requestClient.delete(`/industry/car-driveout-record/delete?id=${id}`);
}
