import { requestClient } from '#/api/request';

/** 对账记录分页查询 */
export function page(params) {
    return requestClient.get('/ordertrade/reconcile-record/page', {
        params,
    });
}
/** 对账记录导出 */
export function exportRecord(params) {
    return requestClient.get('/ordertrade/reconcile-record/export', {
        params,
    });
}
/** 对账记录图表 */
export function chart(params) {
    return requestClient.get('/ordertrade/reconcile-record/chart', {
        params,
    });
}
