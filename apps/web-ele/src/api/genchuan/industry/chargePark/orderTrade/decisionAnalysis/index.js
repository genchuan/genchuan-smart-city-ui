import { requestClient } from '#/api/request';
/** 交易运营报表分页查询 */
export function decisionAnalysisPage(params) {
    return requestClient.get('/ordertrade/trade-op-report/page', {
        params,
    });
} 
/** 交易运营报表导出 */
export function decisionAnalysisExportReport(params) {
    return requestClient.download('/ordertrade/trade-op-report/export', {
        params,
    });
}
/** 交易运营报表创建 */
export function decisionAnalysisCreate(data) {
    return requestClient.post('/ordertrade/trade-op-report/create', data);
}
/** 交易运营报表图表 */
export function decisionAnalysisChart(params) {
    return requestClient.get('/ordertrade/trade-op-report/chart', {
        params,
    });
}
