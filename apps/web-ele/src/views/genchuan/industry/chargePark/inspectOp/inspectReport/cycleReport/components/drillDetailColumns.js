import {
  getAssetStatusLabel,
  getAssetStatusTagType,
  getAssetTypeLabel,
  getAssetTypeTagType,
} from '../../../assetMgmt/assetInfo/table/data';
import {
  getStockStatusLabel,
  getStockStatusTagType,
} from '../../../assetMgmt/stockMgmt/table/data';
import {
  getAlarmStatusLabel as getBikeAlarmStatusLabel,
  getAlarmStatusTagType as getBikeAlarmStatusTagType,
  getMonitorStatusLabel as getBikeMonitorStatusLabel,
  getMonitorStatusTagType as getBikeMonitorStatusTagType,
  getProcessStatusLabel as getBikeProcessStatusLabel,
  getProcessStatusTagType as getBikeProcessStatusTagType,
} from '../../../deviceMonitor/bikeChargeMonitor/table/data';
import {
  getAlarmStatusLabel as getCarAlarmStatusLabel,
  getAlarmStatusTagType as getCarAlarmStatusTagType,
  getMonitorStatusLabel as getCarMonitorStatusLabel,
  getMonitorStatusTagType as getCarMonitorStatusTagType,
  getProcessStatusLabel as getCarProcessStatusLabel,
  getProcessStatusTagType as getCarProcessStatusTagType,
} from '../../../deviceMonitor/carChargeMonitor/table/data';
import {
  getProcessStatusLabel as getOilProcessStatusLabel,
  getProcessStatusTagType as getOilProcessStatusTagType,
} from '../../../deviceMonitor/oilMonitor/table/data';
import {
  getAlarmStatusLabel as getShareAlarmStatusLabel,
  getAlarmStatusTagType as getShareAlarmStatusTagType,
  getMonitorStatusLabel as getShareMonitorStatusLabel,
  getMonitorStatusTagType as getShareMonitorStatusTagType,
  getProcessStatusLabel as getShareProcessStatusLabel,
  getProcessStatusTagType as getShareProcessStatusTagType,
} from '../../../deviceMonitor/shareChargeMonitor/table/data';
import {
  getAlarmStatusLabel,
  getAlarmStatusTagType,
  getMonitorStatusLabel,
  getMonitorStatusTagType,
  getProcessStatusLabel as getSpaceProcessStatusLabel,
  getProcessStatusTagType as getSpaceProcessStatusTagType,
} from '../../../deviceMonitor/spaceMonitor/table/data';
import {
  getReportStatusLabel,
  getReportStatusTagType,
  getReportTypeLabel,
  getReportTypeTagType,
} from '../../../inspectMgmt/inspectReport/table/data';
import {
  getPlanTypeLabel,
  getPlanTypeTagType,
  getTaskStatusLabel,
  getTaskStatusTagType,
} from '../../../inspectMgmt/inspectTask/table/data';
import {
  getOnlineStatusLabel,
  getOnlineStatusTagType,
  getUserStatusLabel,
  getUserStatusTagType,
} from '../../../inspectMgmt/inspectUser/table/data';

/**
 * Vxe formatter 只能输出文本；组件需用 cellRender 注册渲染器（见 adapter CellElTag）
 * @param {(v: unknown) => string} labelFn
 * @param {(v: unknown) => string} tagTypeFn
 */
function drillCellElTag(labelFn, tagTypeFn) {
  return {
    name: 'CellElTag',
    props: {
      labelGetter: (value) => labelFn(value),
      tagTypeGetter: (value) => tagTypeFn(value),
    },
  };
}

export function useDrillSpaceMonitorColumns() {
  return [
    { field: 'id', title: '监测ID', minWidth: 90, sortable: true },
    { field: 'spaceCode', title: '车位', minWidth: 120, sortable: true },
    { field: 'stationName', title: '所属场站', minWidth: 190, sortable: true },
    {
      field: 'monitorStatus',
      title: '监测状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(getMonitorStatusLabel, getMonitorStatusTagType),
    },
    {
      field: 'monitorTimeStr',
      title: '更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'alarmStatus',
      title: '告警状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(getAlarmStatusLabel, getAlarmStatusTagType),
    },
    { field: 'alarmTimeStr', title: '告警时间', minWidth: 180, sortable: true },
    {
      field: 'processStatus',
      title: '处理状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(
        getSpaceProcessStatusLabel,
        getSpaceProcessStatusTagType,
      ),
    },
  ];
}

export function useDrillCarChargeMonitorColumns() {
  return [
    { field: 'id', title: '监测ID', minWidth: 90, sortable: true },
    { field: 'deviceCode', title: '设备', minWidth: 130, sortable: true },
    { field: 'stationName', title: '所属场站', minWidth: 190, sortable: true },
    {
      field: 'monitorStatus',
      title: '监测状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(
        getCarMonitorStatusLabel,
        getCarMonitorStatusTagType,
      ),
    },
    {
      field: 'monitorTimeStr',
      title: '更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'alarmStatus',
      title: '告警状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(getCarAlarmStatusLabel, getCarAlarmStatusTagType),
    },
    { field: 'alarmTimeStr', title: '告警时间', minWidth: 180, sortable: true },
    {
      field: 'processStatus',
      title: '处理状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(
        getCarProcessStatusLabel,
        getCarProcessStatusTagType,
      ),
    },
  ];
}

export function useDrillBikeChargeMonitorColumns() {
  return [
    { field: 'id', title: '监测ID', minWidth: 90, sortable: true },
    { field: 'deviceCode', title: '设备', minWidth: 130, sortable: true },
    { field: 'stationName', title: '所属场站', minWidth: 190, sortable: true },
    {
      field: 'monitorStatus',
      title: '监测状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(
        getBikeMonitorStatusLabel,
        getBikeMonitorStatusTagType,
      ),
    },
    {
      field: 'monitorTimeStr',
      title: '更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'alarmStatus',
      title: '告警状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(
        getBikeAlarmStatusLabel,
        getBikeAlarmStatusTagType,
      ),
    },
    { field: 'alarmTimeStr', title: '告警时间', minWidth: 180, sortable: true },
    {
      field: 'processStatus',
      title: '处理状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(
        getBikeProcessStatusLabel,
        getBikeProcessStatusTagType,
      ),
    },
  ];
}

export function useDrillShareChargeMonitorColumns() {
  return [
    { field: 'id', title: '监测ID', minWidth: 90, sortable: true },
    { field: 'deviceCode', title: '设备', minWidth: 130, sortable: true },
    { field: 'stationName', title: '所属场站', minWidth: 190, sortable: true },
    {
      field: 'monitorStatus',
      title: '监测状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(
        getShareMonitorStatusLabel,
        getShareMonitorStatusTagType,
      ),
    },
    {
      field: 'monitorTimeStr',
      title: '更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'alarmStatus',
      title: '告警状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(
        getShareAlarmStatusLabel,
        getShareAlarmStatusTagType,
      ),
    },
    { field: 'alarmTimeStr', title: '告警时间', minWidth: 180, sortable: true },
    {
      field: 'processStatus',
      title: '处理状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(
        getShareProcessStatusLabel,
        getShareProcessStatusTagType,
      ),
    },
  ];
}

export function useDrillOilMonitorColumns() {
  return [
    { field: 'id', title: '监测ID', minWidth: 90, sortable: true },
    { field: 'spaceCode', title: '车位', minWidth: 120, sortable: true },
    { field: 'stationName', title: '所属场站', minWidth: 190, sortable: true },
    // {
    //   field: 'identifyTimeStr',
    //   title: '识别时间',
    //   minWidth: 180,
    //   sortable: true,
    // },
    {
      field: 'processStatus',
      title: '处置状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(
        getOilProcessStatusLabel,
        getOilProcessStatusTagType,
      ),
    },
    {
      field: 'processUserName',
      title: '处置人',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'processTimeStr',
      title: '处置时间',
      minWidth: 180,
      sortable: true,
    },
    { field: 'ignoreReason', title: '忽略理由', minWidth: 200, sortable: true },
    {
      field: 'processProgress',
      title: '处置进度',
      minWidth: 140,
      sortable: true,
    },
  ];
}

export function useDrillInspectTaskColumns() {
  return [
    { field: 'id', title: '任务ID', minWidth: 90, sortable: true },
    { field: 'planName', title: '关联计划', minWidth: 190, sortable: true },
    {
      field: 'taskType',
      title: '任务类型',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(getPlanTypeLabel, getPlanTypeTagType),
    },
    { field: 'userName', title: '巡检人员', minWidth: 110, sortable: true },
    {
      field: 'status',
      title: '任务状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(getTaskStatusLabel, getTaskStatusTagType),
    },
    {
      field: 'progress',
      title: '执行进度',
      minWidth: 150,
      sortable: true,
      formatter: ({ row }) => {
        if (
          row?.progressText !== undefined &&
          row?.progressText !== null &&
          row?.progressText !== ''
        ) {
          return String(row.progressText);
        }
        if (
          row?.progress !== undefined &&
          row?.progress !== null &&
          row?.progress !== ''
        ) {
          return String(row.progress);
        }
        return '-';
      },
    },
    {
      field: 'dispatchTimeStr',
      title: '派发时间',
      minWidth: 180,
      sortable: true,
    },
    { field: 'claimTimeStr', title: '认领时间', minWidth: 180, sortable: true },
    {
      field: 'completeTimeStr',
      title: '完成时间',
      minWidth: 180,
      sortable: true,
    },
    // {
    //   field: 'archiveText',
    //   title: '归档状态',
    //   minWidth: 110,
    //   sortable: true,
    //   formatter: ({ row }) => {
    //     if (
    //       row?.archiveText !== undefined &&
    //       row?.archiveText !== null &&
    //       row?.archiveText !== ''
    //     ) {
    //       return String(row.archiveText);
    //     }
    //     return row?.isArchive ? '已归档' : '未归档';
    //   },
    // },
  ];
}

export function useDrillInspectUserColumns() {
  return [
    { field: 'id', title: '人员ID', minWidth: 90, sortable: true },
    { field: 'name', title: '人员姓名', minWidth: 120, sortable: true },
    { field: 'phoneText', title: '手机号', minWidth: 130, sortable: true },
    { field: 'area', title: '所属片区', minWidth: 120, sortable: true },
    { field: 'deviceName', title: '绑定设备', minWidth: 150, sortable: true },
    {
      field: 'status',
      title: '人员状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(getUserStatusLabel, getUserStatusTagType),
    },
    {
      field: 'onlineStatus',
      title: '在线状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(getOnlineStatusLabel, getOnlineStatusTagType),
    },
    {
      field: 'lastLoginTimeStr',
      title: '最后登录时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'createTimeStr',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
  ];
}

export function useDrillAssetInfoColumns() {
  return [
    { field: 'id', title: '资产ID', minWidth: 90, sortable: true },
    { field: 'name', title: '资产名称', minWidth: 190, sortable: true },
    {
      field: 'type',
      title: '资产类型',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(getAssetTypeLabel, getAssetTypeTagType),
    },
    {
      field: 'purchaseTimeStr',
      title: '采购时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'status',
      title: '资产状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(getAssetStatusLabel, getAssetStatusTagType),
    },
    { field: 'reserve1', title: '报废理由', minWidth: 220, sortable: true },
    {
      field: 'createTimeStr',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
  ];
}

export function useDrillAssetStockColumns() {
  return [
    { field: 'id', title: '库存ID', minWidth: 90, sortable: true },
    { field: 'assetName', title: '关联资产', minWidth: 180, sortable: true },
    { field: 'assetType', title: '资产类型', minWidth: 110, sortable: true },
    { field: 'currentStock', title: '当前库存', minWidth: 120, sortable: true },
    {
      field: 'warnThreshold',
      title: '预警阈值',
      minWidth: 110,
      sortable: true,
    },
    {
      field: 'status',
      title: '库存状态',
      minWidth: 120,
      sortable: true,
      cellRender: drillCellElTag(getStockStatusLabel, getStockStatusTagType),
    },
    { field: 'stationName', title: '所属仓库', minWidth: 180, sortable: true },
    {
      field: 'lastUpdateTimeStr',
      title: '最后更新时间',
      minWidth: 180,
      sortable: true,
    },
    // {
    //   field: 'replenishRecord',
    //   title: '补货记录',
    //   minWidth: 180,
    //   sortable: true,
    // },
    // {
    //   field: 'allocateRecord',
    //   title: '调配记录',
    //   minWidth: 200,
    //   sortable: true,
    // },
  ];
}

export function useDrillInspectReportColumns() {
  return [
    { field: 'id', title: '上报ID', minWidth: 90, sortable: true },
    { field: 'taskName', title: '关联任务', minWidth: 190, sortable: true },
    {
      field: 'type',
      title: '问题类型',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(getReportTypeLabel, getReportTypeTagType),
    },
    {
      field: 'reportTimeStr',
      title: '上报时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'status',
      title: '上报状态',
      minWidth: 110,
      sortable: true,
      cellRender: drillCellElTag(getReportStatusLabel, getReportStatusTagType),
    },
    { field: 'auditUserName', title: '审核人', minWidth: 110, sortable: true },
    { field: 'auditTimeStr', title: '审核时间', minWidth: 180, sortable: true },
    {
      field: 'processUserName',
      title: '处置人',
      minWidth: 110,
      sortable: true,
    },
    {
      field: 'processTimeStr',
      title: '处置时间',
      minWidth: 180,
      sortable: true,
    },
    { field: 'remark', title: '审核意见', minWidth: 170, sortable: true },
  ];
}
