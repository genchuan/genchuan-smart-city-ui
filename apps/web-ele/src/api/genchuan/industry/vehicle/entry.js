import { requestClient } from '#/api/request';
 

/** 车辆入场记录分页 */
export function getDriveinList(params) { 
  return requestClient.get('/industry/car-drivein-record/page', {
    params,
  });
}
