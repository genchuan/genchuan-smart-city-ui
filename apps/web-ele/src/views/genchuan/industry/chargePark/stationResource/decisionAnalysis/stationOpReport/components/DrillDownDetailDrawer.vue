<script setup>
import { computed, nextTick, reactive } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { formatDateTime } from '../table/data.js';

const drillInfo = reactive({
  source: '',
  drillType: '',
  drillLabel: '',
  drillName: '',
  drillValue: '',
  reportCycle: '',
  reportId: '',
  row: {},
});

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
};

const statusTypeMap = {
  正常: 'success',
  可用: 'success',
  启用: 'success',
  已支付: 'success',
  已完成: 'success',
  生成成功: 'success',
  待处理: 'warning',
  待支付: 'warning',
  追缴中: 'warning',
  异常: 'danger',
  停用: 'danger',
  不可用: 'danger',
  生成失败: 'danger',
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

function withCommon(columns) {
  return [
    { type: 'seq', title: '序号', width: 60 },
    ...columns.map((column) => {
      if (
        [
          'generateStatus',
          'payStatus',
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

function getGridColumns() {
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
      { field: 'stationName', title: '场站名称', minWidth: 180 },
      { field: 'areaName', title: '所属片区', minWidth: 140 },
      { field: 'stationType', title: '场站类型', minWidth: 120 },
      { field: 'stationStatus', title: '运营状态', minWidth: 110 },
      { field: 'spaceCount', title: '车位数', minWidth: 100 },
      { field: 'orderCount', title: '订单量', minWidth: 100 },
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

function createRows() {
  const category = getMetricMeta().category;
  const sourceRow = drillInfo.row || {};
  const name = drillInfo.drillName || drillInfo.drillValue || getMetricLabel();
  const baseTime = sourceRow.generateTime || Date.now();

  return Array.from({ length: 12 }, (_, index) => {
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
        stationType: ['公共快充', '园区专用', '路侧停车', '综合枢纽'][
          index % 4
        ],
        stationStatus: index % 5 === 0 ? '异常' : '正常',
        spaceCount: 24 + no,
        orderCount: sourceRow.orderCount || 120 + no * 7,
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
  const list = createRows();
  const start = (page.currentPage - 1) * page.pageSize;
  const end = page.currentPage * page.pageSize;
  return {
    total: list.length,
    list: list.slice(start, end),
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
    reportCycle: info.reportCycle || '',
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
  height: 100%;
}

.drill-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: #606266;
  font-size: 14px;
}

:deep(.vxe-grid) {
  flex: 1;
  min-height: 520px;
}
</style>
