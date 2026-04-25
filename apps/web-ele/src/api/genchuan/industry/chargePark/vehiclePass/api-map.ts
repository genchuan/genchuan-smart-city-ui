import { createVehiclePassApi } from '#/api/genchuan/industry/chargePark/vehiclePass/shared';

export const plateIdentifyApi = createVehiclePassApi({
  basePath: 'plate-identify',
  actions: [
    { key: 'confirm', method: 'put', path: 'confirm' },
    { key: 'correct', method: 'put', path: 'update' }, // 文档2: correct改为update
  ],
});

export const enterRecordApi = createVehiclePassApi({
  basePath: 'enter-record',
  actions: [{ key: 'correct', method: 'put', path: 'update' }], // 文档2: correct改为update
});

export const unplateEnterApi = createVehiclePassApi({
  basePath: 'unplate-enter',
  actions: [
    { key: 'audit', method: 'put', path: 'audit' },
    { key: 'confirm', method: 'put', path: 'confirm' },
    { key: 'correct', method: 'put', path: 'update' }, // 文档2: correct改为update
  ],
});

export const inParkStatusApi = createVehiclePassApi({
  basePath: 'in-park-status',
  actions: [
    { key: 'location', method: 'get', path: 'location', payloadMode: 'query' },
    { key: 'remind', method: 'put', path: 'remind' },
    { key: 'alert', method: 'put', path: 'alert' },
  ],
});

export const fakePlateControlApi = createVehiclePassApi({
  basePath: 'fake-plate-control',
  actions: [
    { key: 'batchHandle', method: 'put', path: 'batch-handle' },
    { key: 'check', method: 'put', path: 'check' },
    { key: 'ignore', method: 'put', path: 'ignore' },
    { key: 'updateProgress', method: 'put', path: 'update-progress' },
  ],
});

export const oilCarHandleApi = createVehiclePassApi({
  basePath: 'oil-car-handle',
  actions: [
    { key: 'batchHandle', method: 'put', path: 'batch-handle' },
    { key: 'handle', method: 'put', path: 'handle' },
    { key: 'ignore', method: 'put', path: 'ignore' },
    { key: 'updateProgress', method: 'put', path: 'update-progress' },
  ],
});

export const leaveRecordApi = createVehiclePassApi({
  basePath: 'leave-record',
  actions: [{ key: 'correct', method: 'put', path: 'update' }], // 文档2: correct改为update
});

export const payCheckApi = createVehiclePassApi({
  basePath: 'pay-check',
  actions: [
    { key: 'release', method: 'put', path: 'release' },
    { key: 'remind', method: 'put', path: 'remind' },
  ],
});

export const abnormalLeaveApi = createVehiclePassApi({
  basePath: 'abnormal-leave',
  actions: [
    { key: 'batchHandle', method: 'put', path: 'batch-handle' },
    { key: 'check', method: 'put', path: 'check' },
    { key: 'ignore', method: 'put', path: 'ignore' },
    { key: 'updateProgress', method: 'put', path: 'update-progress' },
  ],
});

export const gateOpenApi = createVehiclePassApi({
  basePath: 'gate-open',
  actions: [
    { key: 'approve', method: 'put', path: 'approve' },
    { key: 'reject', method: 'put', path: 'reject' },
    { key: 'execute', method: 'put', path: 'execute' },
    { key: 'reapply', method: 'post', path: 'reapply' },
  ],
});

export const passRecordApi = createVehiclePassApi({
  basePath: 'pass-record',
  actions: [{ key: 'check', method: 'put', path: 'check' }],
});

export const inspectTaskApi = createVehiclePassApi({
  basePath: 'inspect-task',
  actions: [
    { key: 'batchAssign', method: 'put', path: 'batch-assign' },
    { key: 'assign', method: 'put', path: 'assign' },
    { key: 'claim', method: 'put', path: 'claim' },
    { key: 'updateProgress', method: 'put', path: 'update-progress' },
    { key: 'transfer', method: 'put', path: 'transfer' },
    { key: 'archive', method: 'put', path: 'archive' },
  ],
});

export const resultHandleApi = createVehiclePassApi({
  basePath: 'result-handle',
  actions: [
    { key: 'batchHandle', method: 'put', path: 'batch-handle' },
    { key: 'approve', method: 'put', path: 'approve' },
    { key: 'reject', method: 'put', path: 'reject' },
    { key: 'execute', method: 'put', path: 'execute' },
  ],
});

export const carInputApi = createVehiclePassApi({
  basePath: 'car-input',
  actions: [
    { key: 'audit', method: 'put', path: 'audit' },
    { key: 'confirm', method: 'put', path: 'confirm' },
    { key: 'correct', method: 'put', path: 'update' }, // 文档2: correct改为update
  ],
});

export const spaceQueryApi = createVehiclePassApi({
  basePath: 'space-query',
  actions: [
    { key: 'location', method: 'get', path: 'location', payloadMode: 'query' },
  ],
});

export const endParkApi = createVehiclePassApi({
  basePath: 'end-park',
  actions: [
    { key: 'pay', method: 'post', path: 'pay' },
    { key: 'confirm', method: 'put', path: 'confirm' },
    { key: 'cancel', method: 'put', path: 'cancel' },
  ],
});

export const passOpReportApi = createVehiclePassApi({
  basePath: 'pass-op-report',
});
