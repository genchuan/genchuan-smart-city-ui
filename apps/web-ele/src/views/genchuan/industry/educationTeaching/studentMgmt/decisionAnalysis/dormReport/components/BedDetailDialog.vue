<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBedMgmtPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/dormReport/data.js';

// 本地模拟数据（保证至少一条）
const mockBeds = [
  { id: 15, building: 'C栋', floor: 4, roomNum: '401', bedNum: '3号床', studentId: 413, assignTime: Date.now() - 86400000, status: 'allocated', createTime: Date.now() - 86400000 },
  { id: 16, building: 'A栋', floor: 2, roomNum: '203', bedNum: '1号床', studentId: null, assignTime: null, status: 'free', createTime: Date.now() - 172800000 },
];

const currentFilters = ref({ status: 'all' });

const columns = [
  { field: 'building', title: '楼栋', minWidth: 100 },
  { field: 'floor', title: '楼层', minWidth: 80 },
  { field: 'roomNum', title: '房间号', minWidth: 100 },
  { field: 'bedNum', title: '床位号', minWidth: 100 },
  { field: 'studentId', title: '学生ID', minWidth: 100, formatter: ({ cellValue }) => cellValue || '-' },
  { field: 'status', title: '状态', minWidth: 100 },
  { field: 'assignTime', title: '分配时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'createTime', title: '创建时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
];

const fetchData = async (pageParams) => {
  try {
    const params = {
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    };
    if (currentFilters.value.status === 'allocated') params.status = 'allocated';
    else if (currentFilters.value.status === 'free') params.status = 'free';
    const res = await getBedMgmtPage(params);
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    let list = [...mockBeds];
    if (currentFilters.value.status === 'allocated') list = list.filter(b => b.status === 'allocated');
    else if (currentFilters.value.status === 'free') list = list.filter(b => b.status === 'free');
    const total = list.length;
    const start = (pageParams.currentPage - 1) * pageParams.pageSize;
    const sliced = list.slice(start, start + pageParams.pageSize);
    return { list: sliced, total };
  }
};

const dataObj = reactive({ totalShow: true, total: 0, currentPage: 1, pageSize: 10, loading: false });

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    proxyConfig: { ajax: { query: async ({ page }) => await fetchData(page) } },
    rowConfig: { keyField: 'id' },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true },
  },
  showSearchForm: false,
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel: () => detailDrawerApi.close(),
});

const open = async (filters = {}) => {
  currentFilters.value = filters;
  detailDrawerApi.open();
  dataObj.currentPage = 1;
  await gridApi.query();
};

defineExpose({ open });
</script>

<template>
  <DetailDrawer title="床位明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
