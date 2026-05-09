<script setup>
import {reactive, ref} from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

const currentRow = ref({});

const columns = [
  { type: 'seq', width: 60, title: '序号' },
  { field: 'checkDate', title: '检查日期', minWidth: 120 },
  { field: 'score', title: '纪律得分', minWidth: 100, sortable: true },
  { field: 'inspector', title: '检查人', minWidth: 100 },
  { field: 'violation', title: '违纪情况', minWidth: 150 },
  { field: 'remark', title: '备注', minWidth: 120 },
];

// 获取宿舍纪律明细（模拟数据）
const fetchData = async (params) => {
  // TODO: 替换为真实API
  // return requestClient.get('/studentmgmt/dorm-compare-report/discipline-detail', { params });
  console.log('请求宿舍纪律明细:', params);
  const mockList = [];
  for (let i = 1; i <= 5; i++) {
    mockList.push({
      id: i,
      checkDate: `2026-04-${i * 3}`,
      score: (Math.random() * 30 + 60).toFixed(1),
      inspector: ['值班老师', '宿管员'][Math.floor(Math.random() * 2)],
      violation: i % 2 === 0 ? '晚归' : '卫生不合格',
      remark: i % 2 === 0 ? '已教育' : '已整改',
    });
  }
  return { list: mockList, total: mockList.length };
};

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) =>
          await fetchData({ dormNo: currentRow.value.dormNo, ...page }),
      },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true },
    showOverflow: true,
  },
  showSearchForm: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel: () => drawerApi.close(),
});

const open = async (row) => {
  if (!row) return;
  currentRow.value = row;
  drawerApi.open();
  setTimeout(() => gridApi.query(), 100);
};

const close = () => drawerApi.close();

defineExpose({ open, close });
</script>

<template>
  <Drawer title="宿舍纪律评比明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <div class="info-bar">宿舍号：{{ currentRow.dormNo }}</div>
      <Grid />
    </div>
  </Drawer>
</template>

<style scoped>
.detail-container {
  padding: 10px;
}
.info-bar {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #409eff;
}
</style>
