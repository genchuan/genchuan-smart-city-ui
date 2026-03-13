import { requestClient } from '#/api/request';
/** 道路实施检测分页 */
export function getWarnList(params) {
  return requestClient.get('/kitchen/ai-alert-message/page', {
    params,
  });
} 


/**整改通知书复审管理 */
export function getRectifyList(params) {
  return requestClient.get('/kitchen/rectify-review/page', {
    params,
  });
} 