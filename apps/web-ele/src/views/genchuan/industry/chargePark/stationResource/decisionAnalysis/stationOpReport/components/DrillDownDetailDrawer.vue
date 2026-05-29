<script setup>
import { computed, nextTick, reactive } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import * as pageApi from '#/api/genchuan/industry/chargePark/stationResource/decisionAnalysis/stationOpReport/index.js';

import { formatDateTime } from '../table/data.js';

const drillInfo = reactive({
  source: '',
  drillType: '',
  drillLabel: '',
  drillName: '',
  drillValue: '',
  drillCountValue: '',
  reportCycle: '',
  reportId: '',
  row: {},
});

function normalizeReportCycle(value) {
  return value === '全部' ? '' : value || '';
}

const metricMetaMap = {
  totalAreaCount: { label: '总片区数', category: 'area' },
  coverStationCount: { label: '覆盖场站数', category: 'station' },
  totalStationCount: { label: '总场站数', category: 'station' },
  normalOperateCount: { label: '正常运营数', category: 'station' },
  totalSpaceCount: { label: '总车位数', category: 'space' },
  availableSpaceCount: { label: '可用车位数', category: 'space' },
  effectiveRuleCount: { label: '生效规则数', category: 'rule' },
  orderCount: { label: '订单量', category: 'order' },
  revenue: { label: '营收', category: 'revenue' },
  recoveryRate: { label: '追缴完成率', category: 'recovery' },
  depositOrderCount: { label: '押金订单量', category: 'deposit' },
  operator: { label: '操作人信息', category: 'operator' },
  areaStationBar: { label: '片区场站数分布', category: 'area' },
  stationTypeBar: { label: '类型场站数分布', category: 'station' },
  stationOrderBar: { label: '场站订单量分布', category: 'order' },
  recoveryRateBar: { label: '场站追缴完成率', category: 'recovery' },
  trendLine: { label: '周期订单及业务趋势', category: 'trend' },
  mapStation: { label: '地图场站', category: 'station' },
};

const apiDrillMetrics = new Set([
  'availableSpaceCount',
  'coverStationCount',
  'depositOrderCount',
  'effectiveRuleCount',
  'normalOperateCount',
  'orderCount',
  'recoveryRate',
  'revenue',
  'totalAreaCount',
  'totalSpaceCount',
  'totalStationCount',
]);

const statusTypeMap = {
  paid: 'success',
  不可用: 'danger',
  停用: 'danger',
  占用: 'warning',
  待处理: 'warning',
  待支付: 'warning',
  已完成: 'success',
  已支付: 'success',
  已生效: 'success',
  已禁用: 'danger',
  异常: 'danger',
  正常: 'success',
  生成失败: 'danger',
  生成成功: 'success',
  可用: 'success',
  启用: 'success',
  空闲: 'success',
  追缴中: 'warning',
};

const metricColumnsMap = {
  availableSpaceCount: [
    { field: 'stationName', title: '场站名称', minWidth: 180 },
    { field: 'spaceNo', title: '车位编号', minWidth: 130 },
    { field: 'type', title: '车位类型', minWidth: 120 },
    { field: 'deviceType', title: '设备类型', minWidth: 120 },
    { field: 'realStatus', title: '实时状态', minWidth: 110 },
    { field: 'location', title: '位置', minWidth: 120 },
    { field: 'remark', title: '备注', minWidth: 180 },
  ],
  coverStationCount: [
    { field: 'name', title: '场站名称', minWidth: 180 },
    { field: 'stationNo', title: '场站编号', minWidth: 150 },
    { field: 'areaName', title: '所属片区', minWidth: 150 },
    { field: 'type', title: '场站类型', minWidth: 120 },
    { field: 'operateType', title: '运营类型', minWidth: 130 },
    { field: 'spaceTotal', title: '车位总数', minWidth: 110 },
    { field: 'address', title: '地址', minWidth: 220 },
    { field: 'status', title: '状态', minWidth: 100 },
    { field: 'remark', title: '备注', minWidth: 180 },
  ],
  depositOrderCount: [
    { field: 'stationName', title: '场站名称', minWidth: 180 },
    { field: 'depositOrderCount', title: '押金订单量', minWidth: 120 },
    { field: 'stationId', title: '场站ID', minWidth: 100 },
    { field: 'status', title: '状态', minWidth: 100 },
    { field: 'createTime', title: '创建时间', minWidth: 170 },
    { field: 'remark', title: '备注', minWidth: 180 },
  ],
  effectiveRuleCount: [
    { field: 'ruleName', title: '规则名称', minWidth: 180 },
    { field: 'ruleType', title: '规则类型', minWidth: 120 },
    { field: 'stationId', title: '场站ID', minWidth: 100 },
    { field: 'status', title: '状态', minWidth: 100 },
    { field: 'createTime', title: '创建时间', minWidth: 170 },
  ],
  normalOperateCount: [
    { field: 'name', title: '场站名称', minWidth: 180 },
    { field: 'stationNo', title: '场站编号', minWidth: 150 },
    { field: 'areaName', title: '所属片区', minWidth: 150 },
    { field: 'type', title: '场站类型', minWidth: 120 },
    { field: 'operateType', title: '运营类型', minWidth: 130 },
    { field: 'spaceTotal', title: '车位总数', minWidth: 110 },
    { field: 'address', title: '地址', minWidth: 220 },
    { field: 'status', title: '状态', minWidth: 100 },
    { field: 'remark', title: '备注', minWidth: 180 },
  ],
  orderCount: [
    { field: 'orderNo', title: '订单编号', minWidth: 180 },
    { field: 'stationName', title: '场站名称', minWidth: 180 },
    { field: 'plateNo', title: '车牌号', minWidth: 120 },
    { field: 'orderType', title: '订单类型', minWidth: 120 },
    { field: 'amount', title: '订单金额', minWidth: 110 },
    { field: 'discountAmount', title: '优惠金额', minWidth: 110 },
    { field: 'payMethod', title: '支付方式', minWidth: 120 },
    { field: 'status', title: '状态', minWidth: 100 },
    { field: 'createTime', title: '下单时间', minWidth: 170 },
    { field: 'payTime', title: '支付时间', minWidth: 170 },
  ],
  recoveryRate: [
    { field: 'stationName', title: '场站名称', minWidth: 180 },
    { field: 'recoveryRate', title: '追缴完成率', minWidth: 120 },
    { field: 'progress', title: '进度', minWidth: 100 },
    { field: 'range', title: '范围', minWidth: 130 },
    { field: 'type', title: '类型', minWidth: 120 },
    { field: 'status', title: '状态', minWidth: 100 },
    { field: 'createTime', title: '创建时间', minWidth: 170 },
    { field: 'remark', title: '备注', minWidth: 180 },
  ],
  revenue: [
    { field: 'orderNo', title: '订单编号', minWidth: 180 },
    { field: 'stationName', title: '场站名称', minWidth: 180 },
    { field: 'plateNo', title: '车牌号', minWidth: 120 },
    { field: 'orderType', title: '订单类型', minWidth: 120 },
    { field: 'amount', title: '订单金额', minWidth: 110 },
    { field: 'discountAmount', title: '优惠金额', minWidth: 110 },
    { field: 'payMethod', title: '支付方式', minWidth: 120 },
    { field: 'status', title: '状态', minWidth: 100 },
    { field: 'createTime', title: '下单时间', minWidth: 170 },
    { field: 'payTime', title: '支付时间', minWidth: 170 },
  ],
  totalAreaCount: [
    { field: 'name', title: '片区名称', minWidth: 180 },
    { field: 'areaNo', title: '片区编号', minWidth: 160 },
    { field: 'district', title: '行政区', minWidth: 120 },
    { field: 'stationCount', title: '场站数', minWidth: 100 },
    { field: 'phone', title: '联系电话', minWidth: 130 },
    { field: 'address', title: '地址', minWidth: 220 },
    { field: 'status', title: '状态', minWidth: 100 },
    { field: 'remark', title: '备注', minWidth: 180 },
  ],
  totalSpaceCount: [
    { field: 'stationName', title: '场站名称', minWidth: 180 },
    { field: 'spaceNo', title: '车位编号', minWidth: 130 },
    { field: 'type', title: '车位类型', minWidth: 120 },
    { field: 'deviceType', title: '设备类型', minWidth: 120 },
    { field: 'realStatus', title: '实时状态', minWidth: 110 },
    { field: 'location', title: '位置', minWidth: 120 },
    { field: 'remark', title: '备注', minWidth: 180 },
  ],
  totalStationCount: [
    { field: 'name', title: '场站名称', minWidth: 180 },
    { field: 'stationNo', title: '场站编号', minWidth: 150 },
    { field: 'areaName', title: '所属片区', minWidth: 150 },
    { field: 'type', title: '场站类型', minWidth: 120 },
    { field: 'operateType', title: '运营类型', minWidth: 130 },
    { field: 'spaceTotal', title: '车位总数', minWidth: 110 },
    { field: 'address', title: '地址', minWidth: 220 },
    { field: 'status', title: '状态', minWidth: 100 },
    { field: 'remark', title: '备注', minWidth: 180 },
  ],
};

const mapFieldLabelMap = {
  address: '地址',
  areaName: '所属片区',
  availableSpaceCount: '可用车位数',
  code: '编码',
  coordinate: '地图坐标',
  geoCode: '场站编码',
  id: 'ID',
  locationName: '位置名称',
  name: '名称',
  orderCount: '订单量',
  revenue: '营收',
  spaceCount: '车位数',
  spaceTotal: '泊位总数',
  stationCount: '场站数',
  stationId: '场站ID',
  stationName: '场站名称',
  stationNo: '场站编号',
  stationStatus: '运营状态',
  stationType: '场站类型',
  status: '状态',
  statusName: '状态',
  totalOrderCount: '总订单量',
  totalRevenue: '总营收',
  totalSpace: '总车位数',
  totalSpaceCount: '总车位数',
  type: '类型',
  typeName: '类型',
};

const drawerTitle = computed(() => {
  const label = getMetricLabel();
  const name = drillInfo.drillName || drillInfo.reportCycle || '';
  return `${label}钻取明细${name ? ` - ${name}` : ''}`;
});

function getMetricMeta() {
  return (
    metricMetaMap[drillInfo.drillType] || {
      label: drillInfo.drillLabel || drillInfo.drillType || '数据',
      category: 'default',
    }
  );
}

function getMetricLabel() {
  return drillInfo.drillLabel || getMetricMeta().label;
}

function getApiMetricLabel() {
  return metricMetaMap[drillInfo.drillType]?.label || getMetricLabel();
}

function normalizeCountValue(value) {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.floor(number);
}

function withCommon(columns) {
  return [
    { type: 'seq', title: '序号', width: 60 },
    ...columns.map((column) => {
      if (
        [
          'generateStatus',
          'payStatus',
          'realStatus',
          'spaceStatus',
          'stationStatus',
          'status',
        ].includes(column.field)
      ) {
        return {
          ...column,
          slots: { default: 'statusTag' },
        };
      }
      return column;
    }),
  ];
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function shouldFormatDateTime(key, value) {
  if (!key.endsWith('Time')) return false;
  if (value === undefined || value === null || value === '') return false;
  if (value instanceof Date) return true;
  if (typeof value === 'number') return true;
  return (
    typeof value === 'string' &&
    /^\d+$|^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(value)
  );
}

function formatMapCellValue(key, value) {
  if (value === undefined || value === null || value === '') return '';
  if (shouldFormatDateTime(key, value)) return formatDateTime(value);
  if (Array.isArray(value)) return value.join('、');
  if (isPlainObject(value)) return JSON.stringify(value);
  return value;
}

function normalizeMapRow(row = {}) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key,
      formatMapCellValue(key, value),
    ]),
  );
}

function normalizeDrillRow(row = {}, index = 0) {
  if (!isPlainObject(row)) {
    return {
      id: `${drillInfo.drillType || 'drill'}-${index + 1}`,
      value: row,
    };
  }
  return {
    id:
      row.id ||
      row.orderId ||
      row.orderNo ||
      row.stationId ||
      row.stationNo ||
      `${drillInfo.drillType || 'drill'}-${index + 1}`,
    ...normalizeMapRow(row),
  };
}

function normalizeDrillResponse(response = {}) {
  const data =
    response?.data && isPlainObject(response.data) ? response.data : response;
  const list = Array.isArray(data?.list) ? data.list : [];
  return {
    list: list.map((item, index) => normalizeDrillRow(item, index)),
    metricName: data?.metricName,
    total: normalizeCountValue(data?.total) ?? list.length,
  };
}

function createMapColumns(row = {}) {
  const keys = Object.keys(row).filter((key) => row[key] !== undefined);
  const priorityKeys = [
    'stationNo',
    'geoCode',
    'stationName',
    'locationName',
    'areaName',
    'stationType',
    'stationStatus',
    'statusName',
    'coordinate',
    'stationCount',
    'spaceCount',
    'orderCount',
    'revenue',
  ];
  const orderedKeys = [
    ...priorityKeys.filter((key) => keys.includes(key)),
    ...keys.filter((key) => !priorityKeys.includes(key)),
  ];
  return orderedKeys.map((key) => ({
    field: key,
    minWidth: key === 'coordinate' ? 180 : 140,
    title: mapFieldLabelMap[key] || key,
  }));
}

function getGridColumns() {
  if (drillInfo.source === 'map') {
    return withCommon(createMapColumns(drillInfo.row));
  }
  if (drillInfo.source === 'card' && metricColumnsMap[drillInfo.drillType]) {
    return withCommon(metricColumnsMap[drillInfo.drillType]);
  }
  const category = getMetricMeta().category;
  const columnsMap = {
    area: [
      { field: 'areaName', title: '片区名称', minWidth: 160 },
      { field: 'stationCount', title: '场站数', minWidth: 100, sortable: true },
      { field: 'spaceCount', title: '车位数', minWidth: 100, sortable: true },
      { field: 'normalOperateCount', title: '正常运营数', minWidth: 120 },
      { field: 'managerName', title: '负责人', minWidth: 120 },
    ],
    station: [
      { field: 'stationNo', title: '场站编码', minWidth: 140 },
      { field: 'stationName', title: '场站名称', minWidth: 180 },
      { field: 'areaName', title: '所属片区', minWidth: 140 },
      { field: 'stationType', title: '场站类型', minWidth: 120 },
      { field: 'stationStatus', title: '运营状态', minWidth: 110 },
      { field: 'spaceCount', title: '车位数', minWidth: 100 },
      { field: 'orderCount', title: '订单量', minWidth: 100 },
      { field: 'revenue', title: '营收', minWidth: 100 },
      { field: 'coordinate', title: '地图坐标', minWidth: 160 },
    ],
    space: [
      { field: 'stationName', title: '场站名称', minWidth: 180 },
      { field: 'spaceNo', title: '车位编号', minWidth: 130 },
      { field: 'spaceType', title: '车位类型', minWidth: 120 },
      { field: 'spaceStatus', title: '车位状态', minWidth: 110 },
      { field: 'lastUseTime', title: '最近使用时间', minWidth: 170 },
    ],
    rule: [
      { field: 'ruleName', title: '规则名称', minWidth: 180 },
      { field: 'ruleType', title: '规则类型', minWidth: 120 },
      { field: 'effectiveTime', title: '生效时间', minWidth: 170 },
      { field: 'status', title: '状态', minWidth: 100 },
      { field: 'operator', title: '操作人', minWidth: 120 },
    ],
    order: [
      { field: 'orderNo', title: '订单编号', minWidth: 180 },
      { field: 'stationName', title: '场站名称', minWidth: 180 },
      { field: 'userName', title: '用户名称', minWidth: 120 },
      { field: 'amount', title: '订单金额', minWidth: 110 },
      { field: 'payStatus', title: '支付状态', minWidth: 110 },
      { field: 'createTime', title: '下单时间', minWidth: 170 },
    ],
    revenue: [
      { field: 'orderNo', title: '订单编号', minWidth: 180 },
      { field: 'stationName', title: '场站名称', minWidth: 180 },
      { field: 'amount', title: '营收金额', minWidth: 120 },
      { field: 'payMethod', title: '支付方式', minWidth: 120 },
      { field: 'payTime', title: '支付时间', minWidth: 170 },
    ],
    recovery: [
      { field: 'stationName', title: '场站名称', minWidth: 180 },
      { field: 'debtAmount', title: '应追缴金额', minWidth: 120 },
      { field: 'recoveredAmount', title: '已追缴金额', minWidth: 120 },
      { field: 'recoveryRate', title: '追缴完成率', minWidth: 120 },
      { field: 'status', title: '状态', minWidth: 100 },
    ],
    deposit: [
      { field: 'orderNo', title: '押金订单号', minWidth: 180 },
      { field: 'userName', title: '用户名称', minWidth: 120 },
      { field: 'depositAmount', title: '押金金额', minWidth: 120 },
      { field: 'status', title: '订单状态', minWidth: 110 },
      { field: 'createTime', title: '创建时间', minWidth: 170 },
    ],
    operator: [
      { field: 'operator', title: '操作人', minWidth: 130 },
      { field: 'deptName', title: '所属部门', minWidth: 140 },
      { field: 'roleName', title: '角色', minWidth: 140 },
      { field: 'lastLoginTime', title: '最近登录时间', minWidth: 170 },
    ],
    trend: [
      { field: 'statDate', title: '统计日期', minWidth: 130 },
      { field: 'stationName', title: '场站名称', minWidth: 180 },
      { field: 'orderCount', title: '订单量', minWidth: 100 },
      { field: 'revenue', title: '营收', minWidth: 110 },
      { field: 'recoveryRate', title: '追缴完成率', minWidth: 120 },
    ],
    default: [
      { field: 'name', title: '名称', minWidth: 180 },
      { field: 'type', title: '类型', minWidth: 120 },
      { field: 'value', title: '数值', minWidth: 120 },
      { field: 'status', title: '状态', minWidth: 100 },
      { field: 'updateTime', title: '更新时间', minWidth: 170 },
    ],
  };

  return withCommon(columnsMap[category] || columnsMap.default);
}

function getBaseName(index) {
  const names = ['城东', '城西', '城南', '城北', '中心'];
  return names[index % names.length];
}

function getDrillRowCount(sourceRow) {
  if (drillInfo.source === 'map') {
    return 1;
  }

  const directCountValue = normalizeCountValue(drillInfo.drillCountValue);
  if (directCountValue !== null) {
    return directCountValue;
  }

  if (drillInfo.drillType === 'revenue') {
    const revenueCount = normalizeCountValue(
      sourceRow?.orderCount ?? sourceRow?.totalOrderCount,
    );
    if (revenueCount !== null) {
      return revenueCount;
    }
    return normalizeCountValue(drillInfo.drillValue) === 0 ? 0 : 12;
  }

  const directValue = normalizeCountValue(drillInfo.drillValue);
  if (directValue !== null) {
    return directValue;
  }

  const metricValue = normalizeCountValue(sourceRow?.[drillInfo.drillType]);
  if (Number.isFinite(metricValue) && metricValue > 0) {
    return metricValue;
  }

  return 12;
}

function createRows(start = 0, end) {
  const category = getMetricMeta().category;
  const sourceRow = drillInfo.row || {};
  if (drillInfo.source === 'map') {
    return [
      {
        id: sourceRow.id || sourceRow.stationId || sourceRow.geoCode || 'map-1',
        ...normalizeMapRow(sourceRow),
      },
    ];
  }
  const name = drillInfo.drillName || drillInfo.drillValue || getMetricLabel();
  const baseTime = sourceRow.generateTime || Date.now();
  const rowCount = getDrillRowCount(sourceRow);
  const realStart = Math.max(0, start);
  const realEnd = Math.min(end ?? rowCount, rowCount);
  const length = Math.max(0, realEnd - realStart);

  return Array.from({ length }, (_, offset) => {
    const index = realStart + offset;
    const no = index + 1;
    const baseName = getBaseName(index);
    const stationName = sourceRow.stationName || `${baseName}充停一体场站${no}`;
    const areaName = sourceRow.areaName || `${baseName}片区`;
    const common = {
      id: `${drillInfo.drillType || 'drill'}-${no}`,
      updateTime: formatDateTime(baseTime),
      stationName,
      areaName,
    };

    const rowMap = {
      area: {
        ...common,
        areaName,
        stationCount: sourceRow.totalStationCount || 8 + no,
        spaceCount: sourceRow.totalSpaceCount || 80 + no * 6,
        normalOperateCount: sourceRow.normalOperateCount || 6 + no,
        managerName: ['张明', '李倩', '王磊', '赵敏'][index % 4],
      },
      station: {
        ...common,
        coordinate: sourceRow.coordinate || '',
        revenue: sourceRow.revenue ?? sourceRow.totalRevenue ?? '',
        spaceCount:
          sourceRow.spaceCount ?? sourceRow.totalSpaceCount ?? 24 + no,
        stationNo:
          sourceRow.stationNo ||
          sourceRow.stationCode ||
          sourceRow.geoCode ||
          sourceRow.id ||
          '',
        stationStatus:
          sourceRow.stationStatus ||
          sourceRow.statusName ||
          sourceRow.status ||
          (index % 5 === 0 ? '异常' : '正常'),
        stationType:
          sourceRow.stationType ||
          sourceRow.typeName ||
          sourceRow.type ||
          ['公共快充', '园区专用', '路侧停车', '综合枢纽'][index % 4],
        orderCount:
          sourceRow.orderCount ?? sourceRow.totalOrderCount ?? 120 + no * 7,
      },
      space: {
        ...common,
        spaceNo: `P-${String(no).padStart(3, '0')}`,
        spaceType: ['充电车位', '普通车位', '无障碍车位'][index % 3],
        spaceStatus: index % 4 === 0 ? '不可用' : '可用',
        lastUseTime: '2026-05-09 09:30:00',
      },
      rule: {
        ...common,
        ruleName: `${name}规则${no}`,
        ruleType: ['计费规则', '权限规则', '押金规则'][index % 3],
        effectiveTime: '2026-05-01 00:00:00',
        status: index % 4 === 0 ? '停用' : '启用',
        operator: sourceRow.operator || 'admin',
      },
      order: {
        ...common,
        orderNo: `CP${new Date().getFullYear()}${String(no).padStart(6, '0')}`,
        userName: `用户${String(no).padStart(2, '0')}`,
        amount: Number((18 + no * 3.6).toFixed(2)),
        payStatus: index % 3 === 0 ? '待支付' : '已支付',
        createTime: '2026-05-09 10:20:00',
      },
      revenue: {
        ...common,
        orderNo: `REV${new Date().getFullYear()}${String(no).padStart(6, '0')}`,
        amount: Number((36 + no * 8.5).toFixed(2)),
        payMethod: ['微信支付', '支付宝', '余额支付'][index % 3],
        payTime: '2026-05-09 10:35:00',
      },
      recovery: {
        ...common,
        debtAmount: Number((120 + no * 15).toFixed(2)),
        recoveredAmount: Number((96 + no * 12).toFixed(2)),
        recoveryRate: `${Math.min(99, 72 + no)}%`,
        status: index % 3 === 0 ? '追缴中' : '已完成',
      },
      deposit: {
        ...common,
        orderNo: `DEP${new Date().getFullYear()}${String(no).padStart(6, '0')}`,
        userName: `用户${String(no).padStart(2, '0')}`,
        depositAmount: Number((100 + no * 10).toFixed(2)),
        status: index % 4 === 0 ? '待处理' : '已完成',
        createTime: '2026-05-09 11:00:00',
      },
      operator: {
        ...common,
        operator:
          sourceRow.operator || ['admin', 'operator01', 'station02'][index % 3],
        deptName: ['运营中心', '场站管理部', '客服中心'][index % 3],
        roleName: ['管理员', '运营专员', '场站负责人'][index % 3],
        lastLoginTime: '2026-05-09 08:30:00',
      },
      trend: {
        ...common,
        statDate:
          drillInfo.drillName || `2026-05-${String(no).padStart(2, '0')}`,
        orderCount: 80 + no * 9,
        revenue: Number((260 + no * 32).toFixed(2)),
        recoveryRate: `${Math.min(99, 70 + no)}%`,
      },
      default: {
        ...common,
        name: `${name}明细${no}`,
        type: getMetricLabel(),
        value: drillInfo.drillValue || sourceRow[drillInfo.drillType] || no,
        status: index % 4 === 0 ? '待处理' : '正常',
      },
    };

    return rowMap[category] || rowMap.default;
  });
}

async function getDrillData({ page }) {
  const start = (page.currentPage - 1) * page.pageSize;
  const end = page.currentPage * page.pageSize;
  if (apiDrillMetrics.has(drillInfo.drillType)) {
    try {
      const response = await pageApi.getStationOpReportDrillDown({
        metric: getApiMetricLabel(),
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        reportCycle: normalizeReportCycle(drillInfo.reportCycle),
      });
      const data = normalizeDrillResponse(response);
      if (data.metricName) {
        drillInfo.drillLabel = data.metricName;
        drawerApi.setState({
          title: drawerTitle.value,
        });
      }
      return {
        total: data.total,
        list: data.list,
      };
    } catch {
      // 接口未联通时保留本地兜底，避免钻取抽屉空白。
    }
  }

  const total = getDrillRowCount(drillInfo.row || {});
  return {
    total,
    list: createRows(start, end),
  };
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getGridColumns(),
    keepSource: true,
    pagerConfig: {
      pageSize: 10,
    },
    proxyConfig: {
      ajax: {
        query: getDrillData,
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    showOverflow: true,
  },
  showSearchForm: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  class: 'w-[75vw]',
  footer: false,
  mask: false,
  modal: false,
});

async function open(info = {}) {
  Object.assign(drillInfo, {
    source: info.source || '',
    drillType: info.drillType || '',
    drillLabel: info.drillLabel || info.label || '',
    drillName: info.drillName || info.name || '',
    drillValue: info.drillValue ?? info.value ?? '',
    drillCountValue: info.drillCountValue ?? info.countValue ?? '',
    reportCycle: normalizeReportCycle(info.reportCycle),
    reportId: info.reportId || '',
    row: info.row || {},
  });

  drawerApi.setState({
    title: drawerTitle.value,
  });

  await nextTick();
  gridApi.setGridOptions({ columns: getGridColumns() });
  drawerApi.open();
  nextTick(() => gridApi.query());
}

function close() {
  drawerApi.close();
}

function getTagType(value) {
  return statusTypeMap[value] || 'info';
}

defineExpose({
  open,
  close,
});
</script>

<template>
  <Drawer>
    <div class="station-drill-drawer">
      <div class="drill-summary">
        <ElTag type="primary">{{ drillInfo.reportCycle || '全部周期' }}</ElTag>
        <span>{{ getMetricLabel() }}</span>
        <span v-if="drillInfo.drillValue !== ''">
          取值：{{ drillInfo.drillValue }}
        </span>
      </div>
      <Grid>
        <template #statusTag="{ row, column }">
          <ElTag :type="getTagType(row[column.field])">
            {{ row[column.field] || '-' }}
          </ElTag>
        </template>
      </Grid>
    </div>
  </Drawer>
</template>

<style scoped>
.station-drill-drawer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: auto;
}

.drill-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #606266;
}

:deep(.vxe-grid) {
  min-height: 0;
}

:deep(.vxe-grid--table-wrapper) {
  max-height: calc(100vh - 260px);
  overflow: auto;
}

:deep(.vxe-pager--wrapper) {
  justify-content: center;
}

:deep(.vxe-grid--pager-wrapper) {
  flex: 0 0 auto;
}

:deep(.vxe-grid--pager-wrapper .vxe-pager) {
  position: relative;
  height: 65px;
  margin-top: 0;
}
</style>
