import { requestClient } from '#/api/request';
 

/** 车辆入场记录分页 */
export function getDriveinList(params) { 
  return requestClient.get('/industry/car-drivein-record/page', {
    params,
  });
}

/** 车辆创建记录 */
export function createDriveObj(data) { 
  return requestClient.post('/industry/car-drivein-record/create', data);
}

 
export function updateDriveObj(data) {
  return requestClient.put('/industry/car-drivein-record/update', data);
}

/** 车辆删除 */
/** 删除【我的】所有对话，置顶除外 */
export function deleteDriveObj(id) {
  return requestClient.delete(`/industry/car-drivein-record/delete?id=${id}`);
}
